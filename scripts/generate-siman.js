/**
 * generate-siman.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Script Node.js automatisé pour extraire un Siman (chapitre) du Kitzur Yalkout
 * Yossef, puis le vocaliser, traduire et structurer via l'API Gemini.
 *
 * Usage :
 *   node scripts/generate-siman.js [--siman <numéro>] [--seif <numéro>]
 *
 * Exemples :
 *   node scripts/generate-siman.js                     # Siman 318 complet
 *   node scripts/generate-siman.js --siman 318          # Siman 318 complet
 *   node scripts/generate-siman.js --siman 318 --seif 1 # Seif 1 uniquement
 *
 * Variables d'environnement (.env) :
 *   GEMINI_API_KEY    – Clé API Google Gemini (obligatoire)
 *   GEMINI_API_KEY_2  – 2ème clé API Google Gemini (optionnelle)
 *   GEMINI_API_KEY_3  – 3ème clé API Google Gemini (optionnelle)
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

const RAW_FILE = path.join(ROOT, 'scripts', 'raw', '106_1_KITZUR_YALKUT_YOSEF.txt');
const OUTPUT_DIR = path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat');

// ─── Configuration ────────────────────────────────────────────────────────────
const GEMINI_MODEL = 'gemini-3.6-flash'; // Modèle Gemini à utiliser
const API_DELAY_MS = 4500;           // pause de 4.5s entre chaque appel (pour respecter la limite de 15 requêtes/min du compte gratuit)
const MAX_RETRIES = 3;              // tentatives en cas d'erreur
const RETRY_DELAY_MS = 10000;       // on augmente le délai de retry par défaut à 10s

let apiKeys = [];
let currentKeyIndex = 0;
let aiClient = null;

function getAiClient() {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: apiKeys[currentKeyIndex] });
  }
  return aiClient;
}

function switchApiKey() {
  if (currentKeyIndex < apiKeys.length - 1) {
    currentKeyIndex++;
    console.log(`\n🔄 Quota épuisé sur la clé n°${currentKeyIndex}. Basculement sur la clé API n°${currentKeyIndex + 1}...`);
    aiClient = new GoogleGenAI({ apiKey: apiKeys[currentKeyIndex] });
    return true;
  }
  return false;
}

// ─── Correspondance chiffres arabes → lettres hébraïques (gematria) ───────────
const HEBREW_NUMERALS = {
  'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5,
  'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9, 'י': 10,
  'יא': 11, 'יב': 12, 'יג': 13, 'יד': 14, 'טו': 15,
  'טז': 16, 'יז': 17, 'יח': 18, 'יט': 19, 'כ': 20,
  'כא': 21, 'כב': 22, 'כג': 23, 'כד': 24, 'כה': 25,
  'כו': 26, 'כז': 27, 'כח': 28, 'כט': 29, 'ל': 30,
  'לא': 31, 'לב': 32, 'לג': 33, 'לד': 34, 'לה': 35,
  'לו': 36, 'לז': 37, 'לח': 38, 'לט': 39, 'מ': 40,
  'מא': 41, 'מב': 42, 'מג': 43, 'מד': 44, 'מה': 45,
  'מו': 46, 'מז': 47, 'מח': 48, 'מט': 49, 'נ': 50,
  'נא': 51, 'נב': 52, 'נג': 53, 'נד': 54, 'נה': 55,
  'נו': 56, 'נז': 57, 'נח': 58, 'נט': 59, 'ס': 60,
  'סא': 61, 'סב': 62, 'סג': 63, 'סד': 64, 'סה': 65,
  'סו': 66, 'סז': 67, 'סח': 68, 'סט': 69, 'ע': 70,
  'עא': 71, 'עב': 72, 'עג': 73, 'עד': 74, 'עה': 75,
  'עו': 76, 'עז': 77, 'עח': 78, 'עט': 79, 'פ': 80,
  'פא': 81, 'פב': 82, 'פג': 83, 'פד': 84, 'פה': 85,
  'פו': 86, 'פז': 87, 'פח': 88, 'פט': 89, 'צ': 90,
  'צא': 91, 'צב': 92, 'צג': 93, 'צד': 94, 'צה': 95,
  'צו': 96, 'צז': 97, 'צח': 98, 'צט': 99, 'ק': 100,
  'קא': 101, 'קב': 102, 'קג': 103, 'קד': 104, 'קה': 105,
  'קו': 106, 'קז': 107, 'קח': 108, 'קט': 109, 'קי': 110,
  'קיא': 111, 'קיב': 112, 'קיג': 113, 'קיד': 114, 'קטו': 115,
  'קטז': 116, 'קיז': 117, 'קיח': 118, 'קיט': 119, 'קכ': 120,
  'רא': 201, 'רב': 202, 'רג': 203, 'רד': 204, 'רה': 205,
  'שא': 301, 'שב': 302, 'שג': 303, 'שד': 304, 'שה': 305,
  'שו': 306, 'שז': 307, 'שח': 308, 'שט': 309, 'שי': 310,
  'שיא': 311, 'שיב': 312, 'שיג': 313, 'שיד': 314, 'שטו': 315,
  'שטז': 316, 'שיז': 317, 'שיח': 318, 'שיט': 319, 'שכ': 320,
};

// Convertit un numéro arabe en lettres hébraïques pour la gematria
function arabicToHebrewNumeral(n) {
  return Object.entries(HEBREW_NUMERALS).find(([, v]) => v === n)?.[0] ?? String(n);
}

// Convertit les lettres hébraïques de numérotation en chiffre arabe
function hebrewNumeralToArabic(str) {
  const clean = str.replace(/[.'׳]/g, '').trim();
  return HEBREW_NUMERALS[clean] ?? null;
}

// ─── Lecture du fichier source ────────────────────────────────────────────────
function loadRawText() {
  if (!fs.existsSync(RAW_FILE)) {
    throw new Error(`Fichier source introuvable : ${RAW_FILE}`);
  }
  // Le fichier est encodé en UTF-8
  return fs.readFileSync(RAW_FILE, 'utf8');
}

// ─── Nettoyage du texte (supprime balises HTML, références, crochets) ─────────
function cleanText(raw) {
  return raw
    // Supprime les balises HTML
    .replace(/<[^>]+>/g, '')
    // Supprime les contenus entre crochets [ ... ] (références)
    .replace(/\[[^\]]*\]/g, '')
    // Supprime les espaces multiples
    .replace(/[ \t]+/g, ' ')
    // Normalise les fins de ligne
    .replace(/\r/g, '')
    .trim();
}

// ─── Extraction du Siman ──────────────────────────────────────────────────────
/**
 * Extrait toutes les lignes appartenant au siman demandé.
 * @param {string} fullText  – Contenu complet du fichier
 * @param {number} simanNum  – Numéro du siman (ex: 318)
 * @returns {{ lines: string[], subsections: string[] }}
 */
function extractSiman(fullText, simanNum) {
  const hebrewNum = arabicToHebrewNumeral(simanNum);
  if (!hebrewNum) throw new Error(`Impossible de convertir le siman ${simanNum} en gematria`);

  const lines = fullText.split('\n');
  const simanMarker = `סימן ${hebrewNum}`;

  // Trouver la première ligne du siman
  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (l.startsWith('~') && l.includes(simanMarker)) {
      startIdx = i;
      break;
    }
  }

  if (startIdx === -1) {
    throw new Error(`Siman ${simanNum} (${hebrewNum}) introuvable dans le fichier source`);
  }

  // Trouver la fin du siman (prochaine ligne ~ סימן qui ne correspond pas)
  let endIdx = lines.length;
  for (let i = startIdx + 1; i < lines.length; i++) {
    const l = lines[i].trim();
    if (l.startsWith('~ סימן') && !l.includes(simanMarker)) {
      endIdx = i;
      break;
    }
  }

  const simanLines = lines.slice(startIdx, endIdx);
  console.log(`✅ Siman ${simanNum} extrait : lignes ${startIdx}–${endIdx} (${simanLines.length} lignes)`);

  // Extraire les sous-titres de sections
  const subsections = simanLines
    .filter(l => l.trim().startsWith('~'))
    .map(l => l.trim().replace(/^~\s*/, ''));

  return { lines: simanLines, subsections };
}

// ─── Extraction des Seifim ────────────────────────────────────────────────────
/**
 * Découpe les lignes du siman en objets { hebrewLetter, arabicNum, globalId, rawText, subsection }
 * Chaque seif reçoit un globalId unique (séquentiel) pour éviter les conflits entre sous-sections.
 * @param {string[]} lines
 * @returns {Array<{ hebrewLetter: string, arabicNum: number, globalId: number, rawText: string, subsection: string }>}
 */
function extractSeifim(lines) {
  const seifim = [];
  let currentSubsection = '';
  let globalId = 0;

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();

    // Mise à jour de la sous-section courante
    if (l.startsWith('~')) {
      currentSubsection = l.replace(/^~\s*/, '').replace(/\r/g, '');
      continue;
    }

    // Marqueur de seif : "! א" ou "! ב" etc.
    if (l.startsWith('!')) {
      const letterMatch = l.match(/^!\s*([^\s!]+)/);
      if (!letterMatch) continue;

      const hebrewLetter = letterMatch[1].replace(/[.'׳]/g, '').trim();
      const arabicNum = hebrewNumeralToArabic(hebrewLetter);

      // Collecter le texte du seif (ligne(s) suivante(s) non-vides jusqu'au prochain ! ou ~)
      const textLines = [];
      for (let j = i + 1; j < lines.length; j++) {
        const next = lines[j].trim();
        if (next.startsWith('!') || next.startsWith('~')) break;
        if (next.length > 0) textLines.push(next);
      }

      const rawText = cleanText(textLines.join(' '));
      if (!rawText) continue;

      globalId++;
      seifim.push({
        hebrewLetter,
        arabicNum: arabicNum ?? globalId,
        globalId,
        rawText,
        subsection: currentSubsection,
      });
    }
  }

  return seifim;
}

// ─── Schéma JSON pour Structured Outputs ─────────────────────────────────────
const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    livre:    { type: Type.STRING },
    sujet:    { type: Type.STRING },
    sujet_he: { type: Type.STRING },
    sujet_fr: { type: Type.STRING },
    titre_seif:     { type: Type.STRING },
    siman:    { type: Type.STRING },
    seif:     { type: Type.STRING },
    texte_integral: {
      type: Type.OBJECT,
      properties: {
        hebreu_sans_voyelles: { type: Type.STRING },
        hebreu_avec_voyelles: { type: Type.STRING },
        francais:             { type: Type.STRING },
      },
      required: ['hebreu_sans_voyelles', 'hebreu_avec_voyelles', 'francais'],
    },
    mots_alignes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id:                 { type: Type.INTEGER },
          hebreu_brut:        { type: Type.STRING },
          hebreu_voyelles:    { type: Type.STRING },
          francais_mot:       { type: Type.STRING },
          expression_contexte:{ type: Type.STRING },
          infinitif:          { type: Type.STRING },
        },
        required: ['id', 'hebreu_brut', 'hebreu_voyelles', 'francais_mot', 'expression_contexte'],
      },
    },
  },
  required: ['livre', 'sujet', 'sujet_he', 'sujet_fr', 'titre_seif', 'siman', 'seif', 'texte_integral', 'mots_alignes'],
};

// ─── Prompt système ───────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `Vous êtes une intelligence artificielle experte en traduction, linguistique hébraïque, ingénierie de données et Halakha (loi juive). Votre tâche est de convertir le texte brut en hébreu (sans voyelles - "Lelo Nikoud") du Yalkout Yossef fourni en un objet JSON parfaitement structuré.

DIRECTIVES DE CONTENU ET TRADUCTION :
1. TRAITEMENT DE LA LOI UNIQUEMENT : Traite exclusivement le texte de la Halakha. Ignore et supprime complètement les textes entre crochets (comme les références "[רמב"ם]", "[ילקוט יוסף]", etc.) situés à la fin ou au cours des paragraphes.
2. PRECISION DU NIKOUD (נִיקּוּד) : Ponctuez et ajoutez toutes les voyelles sur chaque mot hébreu avec une précision grammaticale absolue. Ne confondez pas les verbes actifs et passifs (Kal, Piel, Pual, Hifil). Conservez les acronymes (Rashei Tevot) avec leur Nikoud approprié.
3. TRADUCTION FRANÇAISE : Fournissez une traduction française fluide, fidèle au sens halakhique (concepts comme Kli Rishon, Yad Soledet Bo, Bishul Ahar Bishul) et rédigée dans un style professionnel et accessible.
4. NUMÉROTATION : Les lettres hébraïques de numérotation (א, ב, ג) doivent être traduites par leur équivalent en chiffres arabes (1., 2., 3.) dans la version française.
5. MINI-TITRE DU SEIF (titre_seif) : Fournissez OBLIGATOIREMENT un mini-titre concis en français (3 à 7 mots) résumant le sujet du Seif (ex: "Signification de la bénédiction Asher Yatsar", "Ablution directe au robinet", "Délai de 72 minutes").
6. DECOUPAGE ALIGNÉ & TRADUCTION MOT-À-MOT (MOTS_ALIGNES) :
   - Créez le tableau "mots_alignes" pour découper la loi mot par mot.
   - "francais_mot" : Fournissez la traduction contextuelle directe et indépendante du mot hébreu en français. Ne découpez pas mécaniquement la phrase française complète, mais donnez la vraie traduction individuelle du mot.
   - GESTION SYSTEMATIQUE DES INFINITIFS (POUR DÉBUTANTS) : Pour TOUT verbe conjugué (au passé, présent, futur, impératif, etc.), fournissez OBLIGATOIREMENT la clé "infinitif" au format strict : "Mot hébreu à l'infinitif avec voyelles = Traduction en français" (Ex: "לוֹמַר = Dire", "לִהְיוֹת = Être", "לְכַוֵּן = Penser / Avoir l'intention").
   - GESTION DU CONTEXTE : Dans "expression_contexte", fournissez uniquement une note d'apprentissage explicative en français si pertinent pour les débutants. Ne mettez AUCUN extrait de texte hébreu dans "expression_contexte".
7. ORGANISATION DU SUJET (SUJET_HE & SUJET_FR) :
   - "sujet_he" : Indiquez le titre hébreu exact ou nettoyé de la sous-section courante (ex: "דיני כלי שני" ou "הלכות השכמת הבוקר").
   - "sujet_fr" : Fournissez la traduction précise et fluide en français du titre de la sous-section. Si un "Sujet Traduit" est fourni dans le prompt utilisateur, utilisez-le EXACTEMENT tel quel, mot pour mot.
7. NETTOYAGE ET SÉCURITÉ TEXTUELLE :
   - Corrigez les erreurs de scan OCR (remplacez les caractères arabes ou corrompus comme "כ" isolés par les vraies lettres hébraïques).
   - Échappez impérativement tous les guillemets doubles internes (\\").
   - Ne faites aucun retour à la ligne physique à l'intérieur des valeurs de texte.`;

// ─── Appel API Gemini ─────────────────────────────────────────────────────────
async function callGemini(seifData, simanNum, simanLabel, translatedSubject) {
  const { hebrewLetter, arabicNum, rawText, subsection } = seifData;

  const userPrompt = `Traite le Seif suivant du Kitzur Yalkout Yossef :

Livre      : Kitzur Yalkout Yossef
Sujet      : ${subsection}
${translatedSubject ? `Sujet Traduit (sujet_fr) DOIT ÊTRE EXACTEMENT: ${translatedSubject}` : ''}
Siman      : ${simanNum} (${simanLabel})
Seif       : ${hebrewLetter} (${arabicNum})

Texte brut (hébreu sans voyelles) :
${rawText}

Génère l'objet JSON selon le schéma défini. N'inclus PAS la numérotation du seif au début de mots_alignes.`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await getAiClient().models.generateContent({
        model: GEMINI_MODEL,
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.0,
          thinkingConfig: {
            thinkingLevel: "low"
          }
        },
      });

      const raw = response.text;
      const cleanRaw = (raw || '').replace(/[\u0600-\u06FF]/g, '');
      const parsed = JSON.parse(cleanRaw);
      
      if (parsed.mots_alignes && parsed.texte_integral && parsed.texte_integral.hebreu_sans_voyelles) {
        const wordsCount = parsed.texte_integral.hebreu_sans_voyelles.split(/\s+/).filter(Boolean).length;
        if (parsed.mots_alignes.length < wordsCount * 0.7) {
          throw new Error(`Génération tronquée: ${parsed.mots_alignes.length} mots générés sur ~${wordsCount} attendus.`);
        }
      }
      return parsed;

    } catch (err) {
      const isQuotaError = err.message && (
        err.message.includes('Quota exceeded') ||
        err.message.includes('429') ||
        err.message.includes('RESOURCE_EXHAUSTED') ||
        err.message.includes('quota')
      );

      if (isQuotaError && switchApiKey()) {
        attempt--; // On ne compte pas cette tentative puisqu'on vient de changer de clé
        continue;
      }

      const isLast = attempt === MAX_RETRIES;

      // Extraire le délai de retry suggéré par l'API (429 RESOURCE_EXHAUSTED)
      let waitMs = RETRY_DELAY_MS * attempt;
      try {
        const body = typeof err.message === 'string' ? JSON.parse(err.message) : err;
        const retryInfo = body?.error?.details?.find(d => d['@type']?.includes('RetryInfo'));
        if (retryInfo?.retryDelay) {
          // retryDelay est au format "Xs" ou "X.XXXs"
          const seconds = parseFloat(retryInfo.retryDelay.replace('s', ''));
          if (!isNaN(seconds) && seconds > 0) {
            waitMs = Math.ceil(seconds * 1000) + 500; // +500 ms de marge
          }
        }
      } catch { /* garde le délai par défaut */ }

      console.warn(`  ⚠️  Tentative ${attempt}/${MAX_RETRIES} échouée pour seif ${hebrewLetter} (attente ${(waitMs / 1000).toFixed(1)}s): ${err.message.substring(0, 120)}`);
      if (isLast) throw err;
      await sleep(waitMs);
    }
  }
}

// ─── Utilitaires ─────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parseArgs() {
  const args = process.argv.slice(2);
  let simanNum  = null;
  let fromSiman = null;
  let toSiman   = null;
  let targetSeif = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--siman' && args[i + 1]) {
      simanNum = parseInt(args[++i], 10);
    } else if (args[i] === '--from' && args[i + 1]) {
      fromSiman = parseInt(args[++i], 10);
    } else if (args[i] === '--to' && args[i + 1]) {
      toSiman = parseInt(args[++i], 10);
    } else if (args[i] === '--seif' && args[i + 1]) {
      targetSeif = parseInt(args[++i], 10);
    }
  }

  // Si aucun siman n'est fourni et pas de plage, défaut = 318
  if (simanNum === null && fromSiman === null && toSiman === null) {
    simanNum = 318;
  }

  return { simanNum, fromSiman, toSiman, targetSeif };
}

// ─── Traitement d'un Siman individuel ─────────────────────────────────────────
async function processSingleSiman(fullText, simanNum, targetSeif) {
  const simanLabel = arabicToHebrewNumeral(simanNum);
  const outputFile = path.join(OUTPUT_DIR, `siman_${simanNum}.json`);

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`📖 Génération Siman ${simanNum} (${simanLabel})`);
  console.log(`   Source  : ${path.relative(ROOT, RAW_FILE)}`);
  console.log(`   Sortie  : ${path.relative(ROOT, outputFile)}`);
  if (targetSeif) console.log(`   Seif    : ${targetSeif} uniquement`);
  console.log('═══════════════════════════════════════════════════════════\n');

  // 1. Extraction du siman
  console.log(`🔍 Extraction du Siman ${simanNum}...`);
  let lines = [];
  let subsections = [];
  try {
    const extracted = extractSiman(fullText, simanNum);
    lines = extracted.lines;
    subsections = extracted.subsections;
  } catch (err) {
    console.error(`⚠️  Impossible d'extraire le Siman ${simanNum} : ${err.message}`);
    return;
  }

  console.log(`   Sous-sections trouvées :`);
  subsections.forEach(s => console.log(`     • ${s}`));

  // 2. Pré-traduction des sujets
  console.log(`\n🗣️ Pré-traduction des ${subsections.length} sujets...`);
  const subjectTranslations = {};
  for (const sub of subsections) {
     if (subjectTranslations[sub]) continue;
     let translated = false;
     for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
       try {
         const resp = await getAiClient().models.generateContent({
           model: GEMINI_MODEL,
           contents: [{ role: 'user', parts: [{ text: `Traduis ce titre hébreu court en français (sujet de loi juive) de façon claire et fluide. Donne uniquement la traduction.\n\nTitre: ${sub}` }] }],
           config: { temperature: 0.0, thinkingConfig: { thinkingLevel: "low" } }
         });
         subjectTranslations[sub] = resp.text.trim().replace(/^"|"$/g, '');
         console.log(`     - ${sub} -> ${subjectTranslations[sub]}`);
         translated = true;
         break;
       } catch(e) {
         const isQuotaError = e.message && (
           e.message.includes('Quota exceeded') ||
           e.message.includes('429') ||
           e.message.includes('RESOURCE_EXHAUSTED') ||
           e.message.includes('quota')
         );
         if (isQuotaError && switchApiKey()) {
           attempt--;
           continue;
         }
         if (attempt < MAX_RETRIES) await sleep(2000);
       }
     }
     if (!translated) {
       console.warn(`     ⚠️ Impossible de pré-traduire le sujet : ${sub}`);
     }
  }

  // 3. Extraction des seifim
  console.log('\n📋 Extraction des Seifim...');
  let seifim = extractSeifim(lines);

  if (targetSeif !== null) {
    const filtered = seifim.filter(s => s.globalId === targetSeif);
    if (filtered.length === 0) {
      const byArabic = seifim.filter(s => s.arabicNum === targetSeif);
      if (byArabic.length === 0) {
        console.error(`❌ Seif ${targetSeif} introuvable dans Siman ${simanNum}`);
        return;
      }
      seifim = byArabic.slice(0, 1);
    } else {
      seifim = filtered;
    }
  }

  console.log(`   ${seifim.length} seif(im) à traiter\n`);

  // 4. Chargement du fichier existant pour reprise
  let existingHalakhot = [];
  if (fs.existsSync(outputFile)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
      existingHalakhot = (existing.halakhot ?? []).filter(h => !h._error);
      const existingKeys = new Set(existingHalakhot.map(h => h._globalId ?? `${h.seif}|${h.sujet}`));
      console.log(`♻️  Reprise : ${existingHalakhot.length} seif(im) valides déjà générés`);

      seifim = seifim.filter(s => !existingKeys.has(s.globalId) && !existingKeys.has(`${s.arabicNum}|${s.subsection}`));
      console.log(`   ${seifim.length} seif(im) restants à traiter\n`);
    } catch {
      console.warn('⚠️  Fichier de sortie existant illisible, redémarrage complet\n');
    }
  }

  if (seifim.length === 0) {
    console.log(`✅ Siman ${simanNum} déjà totalement généré (${existingHalakhot.length} seifim). Skipped.`);
    return;
  }

  // 5. Traitement seif par seif
  const halakhot = [...existingHalakhot];
  let successCount = 0;
  let errorCount = 0;

  for (let idx = 0; idx < seifim.length; idx++) {
    const seif = seifim[idx];
    const progress = `[${idx + 1}/${seifim.length}]`;
    const translatedSubject = subjectTranslations[seif.subsection] || "";

    console.log(`${progress} 🔄 Seif ${seif.hebrewLetter} (${seif.arabicNum}) — ${seif.subsection.substring(0, 50)}`);
    console.log(`        Texte (${seif.rawText.length} car.) : ${seif.rawText.substring(0, 80)}...`);

    try {
      const result = await callGemini(seif, simanNum, simanLabel, translatedSubject);
      result.seif = String(seif.arabicNum);
      result._globalId = seif.globalId;
      if (!result.sujet_he) result.sujet_he = seif.subsection;
      
      // Inline validation post-génération
      try {
        fixSeif(result, idx, subjectTranslations);
      } catch (e) {
        console.warn(`        ⚠️ Avertissement lors de la post-validation: ${e.message}`);
      }
      
      halakhot.push(result);
      successCount++;
      console.log(`        ✅ OK → ${result.texte_integral.francais.substring(0, 60)}...`);
    } catch (err) {
      errorCount++;
      console.error(`        ❌ ERREUR : ${err.message}`);
      halakhot.push({
        livre: 'Kitzur Yalkout Yossef',
        sujet: seif.subsection,
        sujet_he: seif.subsection,
        sujet_fr: '',
        siman: String(simanNum),
        seif: String(seif.arabicNum),
        _globalId: seif.globalId,
        _error: err.message,
        texte_integral: { hebreu_sans_voyelles: seif.rawText, hebreu_avec_voyelles: '', francais: '' },
        mots_alignes: [],
      });
    }

    if ((idx + 1) % 5 === 0 || idx === seifim.length - 1) {
      saveOutput(outputFile, simanNum, simanLabel, halakhot);
      console.log(`        💾 Sauvegarde intermédiaire (${halakhot.length} seifim)`);
    }

    if (idx < seifim.length - 1) {
      await sleep(API_DELAY_MS);
    }
  }

  saveOutput(outputFile, simanNum, simanLabel, halakhot);

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`✅ Génération terminée pour Siman ${simanNum}`);
  console.log(`   Succès  : ${successCount}`);
  console.log(`   Erreurs : ${errorCount}`);
  console.log(`   Total   : ${halakhot.length} seifim`);
  console.log(`   Fichier : ${outputFile}`);
  console.log('═══════════════════════════════════════════════════════════');
}

// ─── Pipeline principal ───────────────────────────────────────────────────────
async function main() {
  const { simanNum, fromSiman, toSiman, targetSeif } = parseArgs();

  apiKeys = Object.keys(process.env)
    .filter(k => k === 'GEMINI_API_KEY' || k.startsWith('GEMINI_API_KEY_'))
    .sort((a, b) => {
      const numA = parseInt(a.replace('GEMINI_API_KEY_', '').replace('GEMINI_API_KEY', '1'), 10) || 1;
      const numB = parseInt(b.replace('GEMINI_API_KEY_', '').replace('GEMINI_API_KEY', '1'), 10) || 1;
      return numA - numB;
    })
    .map(k => process.env[k])
    .filter(Boolean);

  if (apiKeys.length === 0) {
    console.error('❌ Aucune clé API trouvée. Créez un fichier .env avec GEMINI_API_KEY=votre_clé');
    process.exit(1);
  }

  console.log(`🔑 ${apiKeys.length} clé(s) API chargée(s).`);

  const simanimToProcess = [];
  if (fromSiman !== null && toSiman !== null) {
    for (let s = Math.min(fromSiman, toSiman); s <= Math.max(fromSiman, toSiman); s++) {
      simanimToProcess.push(s);
    }
  } else if (simanNum !== null) {
    simanimToProcess.push(simanNum);
  }

  console.log(`🚀 Lancement du traitement pour les Simanim : ${simanimToProcess.join(', ')}`);

  const fullText = loadRawText();

  for (const num of simanimToProcess) {
    await processSingleSiman(fullText, num, targetSeif);
  }
}

// ─── Sauvegarde du fichier JSON ───────────────────────────────────────────────
function saveOutput(outputFile, simanNum, simanLabel, halakhot) {
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });

  const sorted = [...halakhot].sort((a, b) => {
    const ga = a._globalId ?? parseInt(a.seif, 10) ?? 0;
    const gb = b._globalId ?? parseInt(b.seif, 10) ?? 0;
    return ga - gb;
  });

  const output = {
    _meta: {
      source: '106_1_KITZUR_YALKUT_YOSEF.txt',
      siman: simanNum,
      siman_hebrew: simanLabel,
      generated_at: new Date().toISOString(),
      total_seifim: sorted.length,
    },
    halakhot: sorted,
  };

  // Écrit uniquement dans le fichier unique public/data/siman_X.json
  try {
    const rootDataDir = path.join(ROOT, 'public', 'data');
    fs.mkdirSync(rootDataDir, { recursive: true });
    fs.writeFileSync(path.join(rootDataDir, `siman_${simanNum}.json`), JSON.stringify(output, null, 2), 'utf8');
    console.log(`\n💾 Fichier unique sauvegardé dans public/data/siman_${simanNum}.json`);
  } catch (e) {
    console.error(`❌ Erreur sauvegarde public/data/siman_${simanNum}.json: ${e.message}`);
  }
}

// ─── Lancement ────────────────────────────────────────────────────────────────
main().catch(err => {
  console.error('\n❌ Erreur fatale :', err.message);
  if (process.env.DEBUG) console.error(err.stack);
  process.exit(1);
});
