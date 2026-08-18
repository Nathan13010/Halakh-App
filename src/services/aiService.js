import { GEMINI_API_KEY } from '../firebase';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Un mini cache pour éviter de re-télécharger l'index à chaque question
let searchIndexCache = null;

// Fonction utilitaire simple pour normaliser le texte (suppression ponctuation basique)
const normalize = (text) => text.toLowerCase().replace(/[.,:;!?()]/g, '');

/**
 * Télécharge et parse l'index local si nécessaire.
 */
async function getSearchIndex() {
  if (searchIndexCache) return searchIndexCache;
  
  try {
    const response = await fetch('/search_index.json');
    if (!response.ok) throw new Error('Network response was not ok');
    searchIndexCache = await response.json();
    return searchIndexCache;
  } catch (error) {
    console.error("Erreur lors du chargement de l'index de recherche:", error);
    return [];
  }
}

/**
 * Recherche lexicale basique pour trouver les 5 meilleurs Seifim.
 */
export async function searchTopSources(question) {
  const index = await getSearchIndex();
  if (index.length === 0) return [];

  const normalizedQuestionWords = normalize(question).split(/\s+/).filter(w => w.length > 2);
  
  // Si la question est trop courte, on retourne vide
  if (normalizedQuestionWords.length === 0) return [];

  const scoredSources = index.map(item => {
    let score = 0;
    const itemText = normalize(item.text);
    const itemTitle = normalize(item.title);
    const itemCategory = normalize(item.category);

    normalizedQuestionWords.forEach(word => {
      if (itemTitle.includes(word)) score += 5; // Le titre pèse lourd
      if (itemCategory.includes(word)) score += 3; // La catégorie aussi
      if (itemText.includes(word)) score += 1;
    });

    return { ...item, score };
  });

  // Trie par score décroissant et prend les 5 meilleurs
  return scoredSources
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

/**
 * Extrait des mots-clés en Hébreu à partir d'une question en Français via Gemini
 * pour permettre une recherche efficace dans l'index hébreu.
 */
async function extractHebrewKeywords(question) {
  try {
    const prompt = `Extrais les concepts halakhiques clés de cette question en français et traduis-les en 3 mots-clés en hébreu (sans ponctuation, uniquement les mots en hébreu séparés par des espaces). 
Exemple: "que dois je faire au reveille dès le matin ?" -> "השכמת הבוקר מודה אני"
Question : "${question}"`;
    
    const result = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt
    });
    
    const text = result.text.trim();
    console.log("[AI Search] Mots-clés hébreux extraits par Gemini :", text);
    return text;
  } catch (error) {
    console.error("[AI Search] Erreur lors de la traduction de la requête :", error);
    return "";
  }
}

/**
 * Ordonne à Gemini de répondre en se basant sur les sources trouvées.
 */
export async function askHalakha(question) {
  try {
    // 1. Traduire la requête en mots clés hébreux pour chercher dans notre index
    const hebrewKeywords = await extractHebrewKeywords(question);
    const searchString = `${question} ${hebrewKeywords}`;
    
    // 2. Chercher les sources locales
    const topSources = await searchTopSources(searchString);
    console.log(`[AI Search] Nombre de sources trouvées pour '${searchString}' :`, topSources.length);
    if (topSources.length > 0) {
      console.log("[AI Search] Top Source 1 :", topSources[0].title, "(Score:", topSources[0].score, ")");
    }
    
    if (topSources.length === 0) {
      return {
        status: "INSUFFICIENT_SOURCES",
        answer: "Je n'ai pas trouvé suffisamment de sources dans le Yalkout Yossef pour répondre à votre question. Veuillez reformuler ou consulter un Rav.",
        citations: []
      };
    }

    const sourcesContext = topSources.map(s => (
      `{ "id": "${s.id}", "book": "${s.book}", "siman": ${s.siman}, "seif": ${s.seif}, "title": "${s.title}", "text": "${s.text.replace(/"/g, '\\"')}" }`
    )).join(',\n');
    
    console.log("[AI Search] Sources envoyées en contexte à Gemini :\n", sourcesContext);

    const systemPrompt = `Tu es l'assistant halakhique de Halakh'App, une application dédiée à l'étude de la Halakha séfarade.
MISSION: Répondre aux questions en t'appuyant EXCLUSIVEMENT sur les sources documentaires fournies.
RÈGLE ABSOLUE : NE JAMAIS INVENTER. Tu ne dois jamais inventer de halakha, de source, de numéro, ni déduire une règle non établie.
Si les sources ne permettent pas de répondre avec certitude, retourne status = "INSUFFICIENT_SOURCES".
Tu ne peux citer qu'une source dont l'ID apparaît dans la liste SOURCES. Ne fabrique pas de sourceId.
Réponds en français clair, naturel, et respectueux.

FORMAT DE SORTIE: Retourne EXCLUSIVEMENT un objet JSON conforme à ce schéma :
{
  "answer": "string (la réponse)",
  "status": "ANSWERED" ou "INSUFFICIENT_SOURCES",
  "citations": [ { "sourceId": "string (ex: yy_35_4)" } ],
  "confidence": "HIGH", "MEDIUM", ou "LOW"
}`;

    const userPrompt = `QUESTION UTILISATEUR :
${question}

SOURCES :
[
${sourcesContext}
]`;

    const result = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: "Compris. Je répondrai exclusivement au format JSON demandé en me basant uniquement sur les sources fournies, et sans jamais halluciner." }] },
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const responseText = result.text;
    const parsedResponse = JSON.parse(responseText);

    // Citation Validator
    const allowedSourceIds = new Set(topSources.map(s => s.id));
    if (parsedResponse.citations) {
      for (const citation of parsedResponse.citations) {
        if (!allowedSourceIds.has(citation.sourceId)) {
          console.error("Invalid citation generated by AI:", citation.sourceId);
          parsedResponse.status = "INSUFFICIENT_SOURCES";
          parsedResponse.answer = "Une erreur de validation des sources s'est produite. Les sources citées ne correspondent pas aux sources récupérées. (Anti-Hallucination)";
          parsedResponse.citations = [];
          break;
        }
      }
    }

    if (parsedResponse.status === "ANSWERED" && (!parsedResponse.citations || parsedResponse.citations.length === 0)) {
       parsedResponse.status = "INSUFFICIENT_SOURCES";
       parsedResponse.answer = "Je n'ai pas pu valider la réponse avec une source exacte de la base de données. Veuillez consulter un Rav.";
    }

    return {
      ...parsedResponse,
      rawSources: topSources
    };

  } catch (error) {
    console.error("Erreur dans askHalakha:", error);
    return {
      status: "ERROR",
      answer: "Une erreur interne s'est produite lors de la communication avec l'IA. Veuillez réessayer plus tard.",
      citations: []
    };
  }
}
