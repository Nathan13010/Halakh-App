/**
 * generate-from-file.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Script Node.js pour générer des fichiers JSON de Halakhot à partir d'un
 * fichier d'entrée pré-vocalisé (entree.txt).
 *
 * WORKFLOW :
 *   1. Vous vocalisez le texte sur le site Dicta Nakdan
 *   2. Vous collez le texte vocalisé + votre traduction dans entree.txt
 *   3. Ce script utilise Gemini UNIQUEMENT pour l'alignement mot-à-mot
 *   4. Il génère le JSON final prêt pour l'application
 *
 * Usage :
 *   npm run generate:from-file
 *   npm run generate:from-file -- --siman 319
 *   npm run generate:from-file -- --input mon_fichier.txt
 *   npm run generate:from-file -- --siman 318 --seif 1
 *
 * Variables d'environnement (.env) :
 *   GEMINI_API_KEY  – Clé API Google Gemini (obligatoire)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { fixSeif } from './fix-all-seif-prefixes.js';

// ─── Chemins ─────────────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// ─── Configuration ────────────────────────────────────────────────────────────
const GEMINI_MODEL = 'gemini-3.6-flash';
const API_DELAY_MS = 500;           // 0.5s (Le Smart Scheduler gère déjà la rotation des 4 clés)
const MAX_RETRIES = 15;
const RETRY_DELAY_MS = 10000;

class KeyManager {
  constructor(keys) {
    this.keys = keys.map(k => ({ value: k, cooldownUntil: 0 }));
  }

  async getAvailableKey() {
    while (true) {
      const now = Date.now();
      const availableKeys = this.keys.filter(k => k.cooldownUntil <= now);
      
      if (availableKeys.length > 0) {
        availableKeys.sort((a, b) => a.cooldownUntil - b.cooldownUntil);
        return availableKeys[0];
      }

      const soonest = [...this.keys].sort((a, b) => a.cooldownUntil - b.cooldownUntil)[0];
      const waitTime = soonest.cooldownUntil - now;
      console.log(`\n⏳ Toutes les clés sont en cooldown (Erreur 429). Pause de ${Math.ceil(waitTime / 1000)}s...`);
      await sleep(waitTime + 1000);
    }
  }

  setCooldown(keyObj, delayMs) {
    keyObj.cooldownUntil = Date.now() + delayMs;
    console.log(`\n🚫 Clé mise en quarantaine pour ${Math.ceil(delayMs / 1000)}s (Quota dépassé).`);
  }
}

let keyManager = null;
// ─── Correspondance chiffres arabes → lettres hébraïques (gematria) ───────────
const HEBREW_NUMERALS = {
  1:'א',2:'ב',3:'ג',4:'ד',5:'ה',6:'ו',7:'ז',8:'ח',9:'ט',10:'י',
  11:'יא',12:'יב',13:'יג',14:'יד',15:'טו',16:'טז',17:'יז',18:'יח',19:'יט',20:'כ',
  21:'כא',22:'כב',23:'כג',24:'כד',25:'כה',26:'כו',27:'כז',28:'כח',29:'כט',30:'ל',
  31:'לא',32:'לב',33:'לג',34:'לד',35:'לה',36:'לו',37:'לז',38:'לח',39:'לט',40:'מ',
  41:'מא',42:'מב',43:'מג',44:'מד',45:'מה',46:'מו',47:'מז',48:'מח',49:'מט',50:'נ',
  51:'נא',52:'נב',53:'נג',54:'נד',55:'נה',56:'נו',57:'נז',58:'נח',59:'נט',60:'ס',
  61:'סא',62:'סב',63:'סג',64:'סד',65:'סה',66:'סו',67:'סז',68:'סח',69:'סט',70:'ע',
  71:'עא',72:'עב',73:'עג',74:'עד',75:'עה',76:'עו',77:'עז',78:'עח',79:'עט',80:'פ',
  81:'פא',82:'פב',83:'פג',84:'פד',85:'פה',86:'פו',87:'פז',88:'פח',89:'פט',90:'צ',
  91:'צא',92:'צב',93:'צג',94:'צד',95:'צה',96:'צו',97:'צז',98:'צח',99:'צט',100:'ק',
};

function arabicToHebrewNumeral(n) {
  return HEBREW_NUMERALS[n] ?? String(n);
}

// ─── Suppression des voyelles (Nikkoud) ───────────────────────────────────────
function removeNikkoud(text) {
  return text.replace(/[\u0591-\u05C7]/g, '');
}


// ─── Appel API Dicta Nakdan ───────────────────────────────────────────────────
async function getVowelsFromNakdan(text) {
  try {
    const res = await fetch('https://nakdan-2-0.loadbalancer.dicta.org.il/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task: 'nakdan',
        data: text,
        genre: 'modern',
        addmorph: true,
        keepqq: false,
        matchpartial: true,
        keepmetagim: false,
        keephtml: false
      })
    });
    const data = await res.json();
    let result = '';
    for (const item of data) {
      if (item.sep) {
        result += item.word;
      } else {
        if (item.options && item.options.length > 0) {
          result += item.options[0][0];
        } else {
          result += item.word;
        }
      }
    }
    // Nettoyage des pipes | parfois insérés par l'API
    return result.replace(/\|/g, '');
  } catch (e) {
    console.warn(`⚠️ Erreur Nakdan : ${e.message}`);
    return text;
  }
}

// ─── Utilitaires ──────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Parsing du fichier d'entrée ──────────────────────────────────────────────
/**
 * Parse un fichier entree.txt avec le format :
 *
 * SIMAN: 318                    (optionnel, en-tête)
 * SUJET: הלכות שבת              (optionnel, en-tête)
 * SUJET_FR: Lois de Chabbat     (optionnel, en-tête)
 * ---
 * SEIF 1
 * TITRE: Cuisson intentionnelle
 * HEBREU: מִי שֶׁעָבַר...
 * FRANCAIS: Celui qui a transgressé...
 * ---
 *
 * @param {string} filePath
 * @returns {{ meta: { siman, sujet, sujet_fr }, seifim: Array }}
 */
function parseInputFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Fichier d'entrée introuvable : ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const blocks = content.split('---').map(b => b.trim()).filter(b => b.length > 0);

  const meta = { siman: null, sujet: null, sujet_fr: null };
  const seifim = [];

  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim());

    // Check if this block is a header (contains SIMAN/SUJET but no SEIF)
    const hasSeif = lines.some(l => /^SEIF\s+\d+/i.test(l));

    if (!hasSeif) {
      // Parse header metadata
      for (const line of lines) {
        const simanMatch = line.match(/^SIMAN\s*:\s*(.+)/i);
        const sujetMatch = line.match(/^SUJET\s*:\s*(.+)/i);
        const sujetFrMatch = line.match(/^SUJET_FR\s*:\s*(.+)/i);

        if (simanMatch) meta.siman = simanMatch[1].trim();
        else if (sujetFrMatch) meta.sujet_fr = sujetFrMatch[1].trim();
        else if (sujetMatch) meta.sujet = sujetMatch[1].trim();
      }
      continue;
    }

    // Parse a SEIF block
    let seifNum = null;
    let titre = '';
    let hebreu = '';
    let francais = '';

    // State machine for multi-line values
    let currentField = null;

    for (const line of lines) {
      const seifMatch = line.match(/^SEIF\s+(\d+)/i);
      const titreMatch = line.match(/^TITRE\s*:\s*(.+)/i);
      const hebreuMatch = line.match(/^HEBREU\s*:\s*(.+)/i);
      const francaisMatch = line.match(/^FRANCAIS\s*:\s*(.+)/i);

      if (seifMatch) {
        seifNum = parseInt(seifMatch[1], 10);
        currentField = null;
      } else if (titreMatch) {
        titre = titreMatch[1].trim();
        currentField = 'titre';
      } else if (hebreuMatch) {
        hebreu = hebreuMatch[1].trim();
        currentField = 'hebreu';
      } else if (francaisMatch) {
        francais = francaisMatch[1].trim();
        currentField = 'francais';
      } else if (currentField && line.length > 0) {
        // Continuation of a multi-line field
        if (currentField === 'titre') titre += ' ' + line;
        else if (currentField === 'hebreu') hebreu += ' ' + line;
        else if (currentField === 'francais') francais += ' ' + line;
      }
    }

    if (seifNum !== null && hebreu.length > 0) {
      // Normalize missing space after punctuation (e.g. "לוֹ,לְהַרְגִּיל" -> "לוֹ, לְהַרְגִּיל")
      hebreu = hebreu.replace(/([,.:;?!])([\u0590-\u05FF])/g, '$1 $2');
      seifim.push({ seifNum, titre, hebreu, francais });
    } else {
      console.warn(`⚠️  Bloc ignoré (données incomplètes) : SEIF ${seifNum ?? '?'}`);
    }
  }

  return { meta, seifim };
}

// ─── Schéma JSON pour Structured Outputs (alignement uniquement) ──────────────
const ALIGNMENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    mots_alignes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id:                  { type: Type.INTEGER },
          hebreu_brut:         { type: Type.STRING },
          hebreu_voyelles:     { type: Type.STRING },
          francais_mot:        { type: Type.STRING },
          expression_contexte: { type: Type.STRING },
          infinitif:           { type: Type.STRING },
        },
        required: ['id', 'hebreu_brut', 'hebreu_voyelles', 'francais_mot', 'expression_contexte'],
      },
    },
  },
  required: ['mots_alignes'],
};

// ─── Prompt système pour l'alignement ─────────────────────────────────────────
const SYSTEM_PROMPT = `Vous êtes une intelligence artificielle experte en linguistique hébraïque et Halakha (loi juive). Votre UNIQUE tâche est de créer un alignement mot-à-mot entre un texte hébreu vocalisé et sa traduction française.

DIRECTIVES STRICTES :

1. DÉCOUPAGE MOT PAR MOT :
   - Découpez le texte hébreu vocalisé en mots individuels (séparés par des espaces).
   - Chaque mot hébreu doit devenir une entrée dans le tableau "mots_alignes".
   - Le nombre d'entrées DOIT être EXACTEMENT égal au nombre de mots hébreux (séparés par espaces).
   - NE SAUTEZ AUCUN MOT. NE FUSIONNEZ PAS de mots. NE SÉPAREZ PAS un mot en deux.
   - La ponctuation reste collée au mot hébreu (ex: "בְּשַׁבָּת," est UN seul mot).
   - N'incluez PAS la numérotation du seif (ex: "א.") — elle sera ajoutée automatiquement.

2. CHAMPS À REMPLIR POUR CHAQUE MOT :
   - "hebreu_brut" : Le mot hébreu SANS voyelles, EXACTEMENT comme il est écrit dans le "TEXTE HÉBREU BRUT (ORIGINAL)" fourni, en conservant son orthographe exacte (ex: Ktiv Male).
   - "hebreu_voyelles" : Le mot hébreu AVEC voyelles, tel quel depuis le "TEXTE HÉBREU VOCALISÉ" fourni.
   - "francais_mot" : La traduction contextuelle directe et indépendante du mot hébreu en français. Ne découpez PAS mécaniquement la phrase française — donnez la VRAIE traduction individuelle du mot dans son contexte.
   - "expression_contexte" : Cette clé ne doit être remplie QUE si une précision est absolument nécessaire pour comprendre le mot (expression idiomatique, mot composé, ou syntaxe qui n'a pas de sens en traduction mot à mot). Si le mot se traduit de manière simple et directe, laisse la valeur "". NE RÉPÈTE JAMAIS le francais_mot et NE METS JAMAIS la traduction du mot suivant. L'expression_contexte pour le badge de numérotation du seif (ex: "א.") DOIT être vide "" (NE SURTOUT PAS écrire "Numéro du paragraphe"). Si du contexte est nécessaire, le francais_mot contiendra le mot isolé et expression_contexte contiendra l'expression complète.

3. GESTION DES INFINITIFS (OBLIGATOIRE POUR TOUT VERBE CONJUGUÉ) :
   - Pour TOUT verbe conjugué (passé, présent, futur, impératif), fournissez la clé "infinitif".
   - Format strict : "Mot hébreu à l'infinitif avec voyelles = Traduction en français"
   - Exemples : "לוֹמַר = Dire", "לִהְיוֹת = Être", "לְכַוֵּן = Penser / Avoir l'intention"
   - Si le mot n'est PAS un verbe conjugué, n'incluez PAS la clé "infinitif".

4. QUALITÉ :
   - Ne traduisez JAMAIS un mot par "Terme", "Terme hébreu", ou "—".
   - Conservez les acronymes (Rashei Tevot) tels quels.
   - Les contenus entre crochets [ ] font partie du texte et doivent être inclus dans l'alignement.

5. INDEXATION :
   - L'id commence à 1 (le badge de numérotation "א." sera ajouté automatiquement à l'id 0).`;

// ─── Appel API Gemini (Traduction) ──────────────────────────────────────────
async function callGeminiTranslation(hebreuVoyelles, sujet, sujetFr, seifNum) {
  const userPrompt = `Rôle : Tu es une intelligence artificielle experte en traduction, en linguistique hébraïque et en Halakha (Kitsour Yalkout Yossef).

Objectif : Préparer des textes hébreux vocalisés pour alimenter un script de traitement de données (Data Parsing). Tu ne dois faire aucun commentaire, aucune introduction, ni aucune conclusion.

Instructions strictes pour la traduction et le nettoyage :
1. Nettoyage de l'hébreu : Si le texte hébreu fourni contient des barres verticales (|), supprime-les toutes.
2. Numérotation : Traduis les lettres hébraïques de numérotation en début de paragraphe par des chiffres arabes dans la traduction (ex: "כא." devient "21."). Ne mets jamais le mot "Paragraphe" devant.
3. Titre court : Génère un TITRE très court en français (max 6-7 mots) résumant la loi principale du Seif.
4. Traduction fluide (FRANCAIS) : La traduction doit être rigoureuse, fidèle au sens halakhique, et rédigée dans un style professionnel et accessible. Traduis les acronymes si nécessaire.
5. Intégralité stricte : Assure-toi de traduire et d'inclure absolument TOUT le texte hébreu dans ton champ 'FRANCAIS', y compris les références halakhiques (ex: [ילקו"י...]) à la fin des paragraphes. N'omets rien !
6. Sujet : Identifie la grande catégorie / le grand thème de ces lois (ex: Lois du Chabbat, Posture pendant la prière...).

Format de Sortie Exigé : Tu dois IMPÉRATIVEMENT formater ta réponse en texte brut, PAS DE BLOC DE CODE Markdown.

SUJET: ${sujet || 'Inconnu'}
SUJET_FR: ${sujetFr || 'Inconnu'}
---
SEIF ${seifNum}
TITRE: [Génère le titre ici]
HEBREU: ${hebreuVoyelles}
FRANCAIS: [Génère la traduction fluide ici]
---`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const keyObj = await keyManager.getAvailableKey();
    const aiClient = new GoogleGenAI({ apiKey: keyObj.value });

    try {
      const response = await aiClient.models.generateContent({
        model: GEMINI_MODEL,
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        config: { temperature: 0.1 },
      });

      const raw = response.text;
      const titreMatch = raw.match(/TITRE\s*:\s*(.+)/i);
      const francaisMatch = raw.match(/FRANCAIS\s*:\s*([\s\S]+?)(?:---|$)/i);
      
      if (!francaisMatch) throw new Error('Format de traduction invalide');
      
      return { 
        titre: titreMatch ? titreMatch[1].trim() : `Seif ${seifNum}`,
        francais: francaisMatch[1].trim()
      };

    } catch (err) {
      const isQuotaError = err.message && (
        err.message.includes('Quota') || err.message.includes('429') || err.message.includes('RESOURCE_EXHAUSTED')
      );
      
      if (isQuotaError) {
        let delayMs = 60000;
        try {
          const body = typeof err.message === 'string' ? JSON.parse(err.message) : err;
          const retryInfo = body?.error?.details?.find(d => d['@type']?.includes('RetryInfo'));
          if (retryInfo?.retryDelay) {
             const seconds = parseFloat(retryInfo.retryDelay.replace('s', ''));
             if (!isNaN(seconds) && seconds > 0) delayMs = seconds * 1000;
          }
        } catch { }
        keyManager.setCooldown(keyObj, delayMs);
        attempt--; // Ne compte pas comme une erreur de parsing/503
        continue;
      }

      const isLast = attempt === MAX_RETRIES;
      
      // Exponential Backoff avec Jitter (2s, 4s, 8s...)
      let baseDelay = 2000 * Math.pow(2, attempt - 1);
      if (baseDelay > 60000) baseDelay = 60000;
      const jitter = Math.floor(Math.random() * 1000);
      const waitMs = baseDelay + jitter;

      console.warn(`  ⚠️  Tentative traduction ${attempt}/${MAX_RETRIES} échouée (attente ${(waitMs / 1000).toFixed(1)}s): ${err.message.substring(0, 100)}`);
      if (isLast) throw err;
      await sleep(waitMs);
    }
  }
}

// ─── Appel API Gemini (alignement uniquement) ────────────────────────────────
async function callGeminiAlignment(hebreuBrut, hebreuVoyelles, francais) {
  const userPrompt = `Voici le texte hébreu brut original, le texte hébreu vocalisé et sa traduction française. Crée l'alignement mot-à-mot.

TEXTE HÉBREU BRUT (ORIGINAL) :
${hebreuBrut}

TEXTE HÉBREU VOCALISÉ :
${hebreuVoyelles}

TRADUCTION FRANÇAISE :
${francais}

Génère le tableau "mots_alignes" selon le schéma défini. Rappel : un élément par mot hébreu (séparé par un espace), sans inclure le badge de numérotation.`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const keyObj = await keyManager.getAvailableKey();
    const aiClient = new GoogleGenAI({ apiKey: keyObj.value });

    try {
      const response = await aiClient.models.generateContent({
        model: GEMINI_MODEL,
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: ALIGNMENT_SCHEMA,
          temperature: 0.0,
        },
      });

      const raw = response.text;
      const cleanRaw = (raw || '').replace(/[\u0600-\u06FF]/g, '');
      const parsed = JSON.parse(cleanRaw);

      // Validation : vérifier que le nombre de mots alignés est cohérent
      const originalWords = hebreuBrut.split(/\s+/).filter(Boolean);
      const hebrewWords = hebreuVoyelles.split(/\s+/).filter(Boolean);
      const alignedCount = parsed.mots_alignes?.length || 0;

      if (alignedCount < hebrewWords.length * 0.7) {
        throw new Error(
          `Alignement tronqué : ${alignedCount} mots alignés sur ${hebrewWords.length} attendus`
        );
      }

      // 🛑 BULLETPROOF FIX : Forcer hebreu_brut à être exactement le mot original non-vocalisé
      if (parsed.mots_alignes && parsed.mots_alignes.length === originalWords.length) {
        parsed.mots_alignes.forEach((m, idx) => {
          m.hebreu_brut = originalWords[idx];
        });
      }

      return parsed;

    } catch (err) {
      const isQuotaError = err.message && (
        err.message.includes('Quota exceeded') ||
        err.message.includes('429') ||
        err.message.includes('RESOURCE_EXHAUSTED') ||
        err.message.includes('quota')
      );
      
      if (isQuotaError) {
        let delayMs = 60000;
        try {
          const body = typeof err.message === 'string' ? JSON.parse(err.message) : err;
          const retryInfo = body?.error?.details?.find(d => d['@type']?.includes('RetryInfo'));
          if (retryInfo?.retryDelay) {
            const seconds = parseFloat(retryInfo.retryDelay.replace('s', ''));
            if (!isNaN(seconds) && seconds > 0) {
              delayMs = Math.ceil(seconds * 1000) + 500;
            }
          }
        } catch { }
        keyManager.setCooldown(keyObj, delayMs);
        attempt--; 
        continue;
      }

      const isLast = attempt === MAX_RETRIES;

      // Exponential Backoff avec Jitter (2s, 4s, 8s...)
      let baseDelay = 2000 * Math.pow(2, attempt - 1);
      if (baseDelay > 60000) baseDelay = 60000;
      const jitter = Math.floor(Math.random() * 1000);
      const waitMs = baseDelay + jitter;

      console.warn(`  ⚠️  Tentative ${attempt}/${MAX_RETRIES} échouée (attente ${(waitMs / 1000).toFixed(1)}s): ${err.message.substring(0, 120)}`);
      if (isLast) throw err;
      await sleep(waitMs);
    }
  }
}

// ─── Sauvegarde du fichier JSON ───────────────────────────────────────────────
function saveOutput(outputFile, simanNum, simanHebrew, halakhot) {
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });

  const sorted = [...halakhot].sort((a, b) => {
    const ga = a._globalId ?? parseInt(a.seif, 10) ?? 0;
    const gb = b._globalId ?? parseInt(b.seif, 10) ?? 0;
    return ga - gb;
  });

  const output = {
    _meta: {
      source: 'entree.txt (texte pré-vocalisé)',
      siman: parseInt(simanNum, 10),
      siman_hebrew: simanHebrew,
      generated_at: new Date().toISOString(),
      total_seifim: sorted.length,
    },
    halakhot: sorted,
  };

  try {
    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf8');
    console.log(`  💾 Sauvegardé dans ${outputFile}`);

    // Auto-unlock book in src/data/books.js if present
    const booksPath = path.join(ROOT, 'src', 'data', 'books.js');
    if (fs.existsSync(booksPath)) {
      let booksCode = fs.readFileSync(booksPath, 'utf8');
      const bookBlockRegex = new RegExp(`(\\{\\s*id:\\s*"yalkout-${simanNum}"[\\s\\S]*?isUnlocked:\\s*)(false)`, 'g');
      if (bookBlockRegex.test(booksCode)) {
        booksCode = booksCode.replace(bookBlockRegex, '$1true');
        fs.writeFileSync(booksPath, booksCode, 'utf8');
        console.log(`  🔓 Siman ${simanNum} automatiquement débloqué dans src/data/books.js`);
      }
    }
  } catch (e) {
    console.warn(`  ⚠️  Impossible d'écrire les copies dans public/data/ : ${e.message}`);
  }
}

// ─── Arguments CLI ────────────────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  let simanNum = null;
  let targetSeif = null;
  let inputFile = path.join(ROOT, 'entree.txt');
  let sujet = null;
  let sujetFr = null;
  let outputFile = null;
  let categorie = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--siman' && args[i + 1]) {
      simanNum = args[++i];
    } else if (args[i] === '--seif' && args[i + 1]) {
      targetSeif = parseInt(args[++i], 10);
    } else if (args[i] === '--input' && args[i + 1]) {
      inputFile = path.resolve(args[++i]);
    } else if (args[i] === '--sujet' && args[i + 1]) {
      sujet = args[++i];
    } else if (args[i] === '--sujet-fr' && args[i + 1]) {
      sujetFr = args[++i];
    } else if (args[i] === '--output' && args[i + 1]) {
      outputFile = path.resolve(args[++i]);
    } else if (args[i] === '--categorie' && args[i + 1]) {
      categorie = args[++i];
    }
  }

  return { simanNum, targetSeif, inputFile, sujet, sujetFr, outputFile, categorie };
}

// ─── Pipeline principal ───────────────────────────────────────────────────────
async function main() {
  const cliArgs = parseArgs();

  const loadedKeys = Object.keys(process.env)
    .filter(k => k === 'GEMINI_API_KEY' || k.startsWith('GEMINI_API_KEY_'))
    .sort((a, b) => {
      const numA = parseInt(a.replace('GEMINI_API_KEY_', '').replace('GEMINI_API_KEY', '1'), 10) || 1;
      const numB = parseInt(b.replace('GEMINI_API_KEY_', '').replace('GEMINI_API_KEY', '1'), 10) || 1;
      return numA - numB;
    })
    .map(k => process.env[k])
    .filter(Boolean);

  if (loadedKeys.length === 0) {
    console.error('❌ Aucune clé API trouvée. Créez un fichier .env avec GEMINI_API_KEY=votre_clé');
    process.exit(1);
  }

  // Ensure logs directory exists
  const logsDir = path.join(ROOT, 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  keyManager = new KeyManager(loadedKeys);
  console.log(`🔑 ${loadedKeys.length} clé(s) API chargée(s) avec Smart Scheduler.`);

  // 1. Parser le fichier d'entrée
  console.log(`\n📂 Lecture de ${path.relative(ROOT, cliArgs.inputFile)}...`);
  const { meta, seifim } = parseInputFile(cliArgs.inputFile);

  // Résoudre les métadonnées : CLI > en-tête du fichier > défaut
  const simanNum = cliArgs.simanNum || meta.siman || '318';
  const sujet = cliArgs.sujet || meta.sujet || '';
  const sujetFr = cliArgs.sujetFr || meta.sujet_fr || '';
  const simanHebrew = arabicToHebrewNumeral(parseInt(simanNum, 10));

  // Filtrer par seif si demandé
  let seifimToProcess = seifim;
  if (cliArgs.targetSeif !== null) {
    seifimToProcess = seifim.filter(s => s.seifNum === cliArgs.targetSeif);
    if (seifimToProcess.length === 0) {
      console.error(`❌ Seif ${cliArgs.targetSeif} introuvable dans le fichier d'entrée`);
      process.exit(1);
    }
  }

  const outputFile = cliArgs.outputFile || path.join(ROOT, 'public', 'data', `siman_${simanNum}.json`);
  const categorie = cliArgs.categorie || '';

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`📖 Génération depuis fichier pré-vocalisé`);
  console.log(`   Siman   : ${simanNum} (${simanHebrew})`);
  console.log(`   Sujet   : ${sujet || '(non spécifié)'}`);
  console.log(`   Sujet FR: ${sujetFr || '(non spécifié)'}`);
  console.log(`   Seifim  : ${seifimToProcess.length} à traiter`);
  console.log(`   Sortie  : ${path.relative(ROOT, outputFile)}`);
  console.log('═══════════════════════════════════════════════════════════\n');

  // 2. Charger le fichier existant pour reprise
  let existingHalakhot = [];
  if (fs.existsSync(outputFile)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
      existingHalakhot = (existing.halakhot ?? []).filter(h => !h._error && h.texte_integral?.francais?.trim() && h.mots_alignes?.length > 0);
      const existingSeifNums = new Set(existingHalakhot.map(h => parseInt(h.seif, 10)));
      console.log(`♻️  Reprise : ${existingHalakhot.length} seif(im) valides déjà générés`);

      // Ne re-traiter que les seifim qui ne sont pas déjà dans le fichier
      const beforeCount = seifimToProcess.length;
      seifimToProcess = seifimToProcess.filter(s => !existingSeifNums.has(s.seifNum));
      if (beforeCount !== seifimToProcess.length) {
        console.log(`   ${seifimToProcess.length} seif(im) restants à traiter\n`);
      }
    } catch {
      console.warn('⚠️  Fichier de sortie existant illisible, redémarrage complet\n');
    }
  }

  if (seifimToProcess.length === 0) {
    console.log(`✅ Tous les Seifim sont déjà générés (${existingHalakhot.length} seifim). Rien à faire.`);
    return;
  }

  // 3. Initialiser l'API Gemini (Géré dynamiquement via getAiClient)

  // 4. Traitement seif par seif
  const halakhot = [...existingHalakhot];
  let successCount = 0;
  let errorCount = 0;
  const simanStartTime = Date.now();
  let totalSeifDuration = 0;

  for (let idx = 0; idx < seifimToProcess.length; idx++) {
    const seifStartTime = Date.now();
    const seif = seifimToProcess[idx];
    const progress = `[${idx + 1}/${seifimToProcess.length}]`;
    const hebLetter = arabicToHebrewNumeral(seif.seifNum);
    const startTimeStr = new Date(seifStartTime).toLocaleTimeString();

    console.log(`${progress} 🔄 Seif ${seif.seifNum} (${hebLetter}) — "${seif.titre}" [Démarré à ${startTimeStr}]`);
    console.log(`        Texte (${seif.hebreu.length} car.) : ${seif.hebreu.substring(0, 80)}...`);

    let hebreuVoyelles = seif.hebreu;

    try {
      if (!/[\u0591-\u05C7]/.test(hebreuVoyelles)) {
        console.log('        🪄  Texte brut détecté. Vocalisation via Dicta Nakdan...');
        hebreuVoyelles = await getVowelsFromNakdan(seif.hebreu);
      }

      // Si le français est manquant (généré par le scraper), on demande la traduction à Gemini
      if (!seif.francais || seif.francais.trim() === '' || seif.francais.length < 5) {
        console.log('        🌍 Traduction française manquante. Traduction via Gemini en cours...');
        const transRes = await callGeminiTranslation(hebreuVoyelles, sujet, sujetFr, seif.seifNum);
        seif.francais = transRes.francais;
        seif.titre = transRes.titre;
      }

      // Appeler Gemini pour l'alignement
      const result = await callGeminiAlignment(seif.hebreu, hebreuVoyelles, seif.francais);

      // Construire le texte hébreu sans voyelles
      const hebreuSansVoyelles = removeNikkoud(seif.hebreu);

      // Construire l'objet halakha complet
      const halakha = {
        livre: 'Kitzur Yalkout Yossef',
        sujet: sujet,
        sujet_he: sujet,
        sujet_fr: sujetFr,
        titre_seif: seif.titre,
        siman: String(simanNum),
        seif: String(seif.seifNum),
        texte_integral: {
          hebreu_sans_voyelles: hebreuSansVoyelles,
          hebreu_avec_voyelles: hebreuVoyelles,
          francais: seif.francais,
        },
        mots_alignes: result.mots_alignes,
        _globalId: seif.seifNum,
      };

      // Post-traitement avec fixSeif (normalise les badges, l'indexation, etc.)
      const subjectMap = {};
      if (sujet && sujetFr) subjectMap[sujet] = sujetFr;
      try {
        fixSeif(halakha, idx, subjectMap);
      } catch (e) {
        console.warn(`        ⚠️ Avertissement fixSeif : ${e.message}`);
      }

      halakhot.push(halakha);
      successCount++;
      const seifDuration = (Date.now() - seifStartTime) / 1000;
      totalSeifDuration += seifDuration;
      
      // Télémétrie
      try {
        const logLine = JSON.stringify({
          timestamp: new Date().toISOString(),
          date: new Date().toLocaleDateString('fr-FR'),
          siman: simanNum,
          seif: seif.seifNum,
          duration: parseFloat(seifDuration.toFixed(1)),
          status: 'success'
        }) + '\n';
        fs.appendFileSync(path.join(ROOT, 'logs', 'generation_history.jsonl'), logLine, 'utf8');
      } catch (err) {
        console.warn(`        ⚠️ Impossible d'écrire la télémétrie : ${err.message}`);
      }

      console.log(`        ✅ OK → ${result.mots_alignes.length} mots alignés (en ${seifDuration.toFixed(1)}s)`);
      console.log(`        📝 "${seif.francais.substring(0, 60)}..."`);

    } catch (err) {
      errorCount++;
      const seifDuration = (Date.now() - seifStartTime) / 1000;
      console.error(`        ❌ ERREUR après ${seifDuration.toFixed(1)}s : ${err.message}`);
      halakhot.push({
        livre: 'Kitzur Yalkout Yossef',
        sujet: sujet,
        sujet_he: sujet,
        sujet_fr: sujetFr,
        titre_seif: seif.titre,
        siman: String(simanNum),
        seif: String(seif.seifNum),
        _globalId: seif.seifNum,
        _error: err.message,
        texte_integral: {
          hebreu_sans_voyelles: removeNikkoud(seif.hebreu),
          hebreu_avec_voyelles: hebreuVoyelles,
          francais: seif.francais,
        },
        mots_alignes: [],
      });
    }

    // Sauvegarde intermédiaire tous les 5 seifim ou au dernier
    if ((idx + 1) % 5 === 0 || idx === seifimToProcess.length - 1) {
      saveOutput(outputFile, simanNum, simanHebrew, halakhot);
      console.log(`        💾 Sauvegarde intermédiaire (${halakhot.length} seifim)`);
    }

    // Pause entre les appels API
    if (idx < seifimToProcess.length - 1) {
      if (API_DELAY_MS > 0) {
        console.log(`        ⏸️ Pause de ${(API_DELAY_MS / 1000).toFixed(1)}s...`);
        await sleep(API_DELAY_MS);
      }
    }
  }

  // 5. Sauvegarde finale
  saveOutput(outputFile, simanNum, simanHebrew, halakhot);

  const simanDuration = (Date.now() - simanStartTime) / 1000;
  const avgSeif = successCount > 0 ? (totalSeifDuration / successCount).toFixed(1) : 0;

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`✅ Génération terminée pour Siman ${simanNum}`);
  console.log(`   Succès  : ${successCount}`);
  console.log(`   Erreurs : ${errorCount}`);
  console.log(`   Total   : ${halakhot.length} seifim`);
  console.log(`   ⏱️ Durée totale : ${simanDuration.toFixed(1)}s (Moyenne temps API brut: ${avgSeif}s / seif)`);
  if (avgSeif > 0) {
    const estHours = ((avgSeif * 13000) / 3600).toFixed(1);
    console.log(`   📈 Est. (13 000 seifim - temps actif pur API) : ~${estHours} heures`);
  }
  console.log(`   Fichier : ${path.relative(ROOT, outputFile)}`);
  console.log('═══════════════════════════════════════════════════════════');
}

// ─── Lancement ────────────────────────────────────────────────────────────────
main().catch(err => {
  console.error('\n❌ Erreur fatale :', err.message);
  if (process.env.DEBUG) console.error(err.stack);
  process.exit(1);
});
