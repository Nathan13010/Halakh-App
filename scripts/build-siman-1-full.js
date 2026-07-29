import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const RAW_FILE = path.join(ROOT, 'scripts', 'raw', '106_1_KITZUR_YALKUT_YOSEF.txt');
const OUT1 = path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', 'siman_1.json');
const OUT2 = path.join(ROOT, 'public', 'data', 'siman_1.json');
const OUT3 = path.join(ROOT, 'public', 'data', 'yalkout-1.json');

const GEMINI_MODEL = 'gemini-2.5-flash';
const API_DELAY_MS = 2500;
const MAX_RETRIES = 5;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function cleanText(raw) {
  return raw
    .replace(/<[^>]+>/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/\{.*?\}/g, '')
    .replace(/~.*?~/g, '')
    .replace(/_nbsp/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8217;/g, "'")
    .replace(/&#8221;/g, '"')
    .replace(/&#8220;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

async function processSeifViaGemini(seifNum, textRaw, attempt = 1) {
  console.log(`[Seif ${seifNum}] Processing via Gemini (Attempt ${attempt}/${MAX_RETRIES})...`);
  const inputWords = textRaw.split(/\s+/);
  const expectedWordCount = inputWords.length;

  const prompt = `Tu es un expert en traduction talmudique et halakhique.
Voici le texte hébreu brut d'un seif (paragraphe) du Kitzur Yalkut Yosef:
"${textRaw}"

Ton travail est de:
1. Fournir le texte exact AVEC voyelles (Nikkud). ATTENTION CRITIQUE: Tu ne dois JAMAIS modifier le nombre de mots ni développer les abréviations. Chaque mot dans ton texte avec voyelles DOIT correspondre mot pour mot au texte brut fourni. Le nombre de mots doit rester exactement égal à ${expectedWordCount}. Si un mot brut contient un point d'abréviation, ou des guillemets (comme ע''ה), LAISSE-LE EXACTEMENT A L'IDENTIQUE, ajoute juste les voyelles si possible ou laisse tel quel. Ne supprime aucun mot, n'ajoute aucun mot.
2. Fournir un titre en français pour ce paragraphe.
3. Fournir la traduction en français courant de l'ensemble du paragraphe.
4. Fournir un dictionnaire mot-à-mot (brut -> voyelles -> traduction exacte). 

Renvoie STRICTEMENT un JSON valide respectant ce schéma:
{
  "titre_seif": "...",
  "texte_avec_voyelles": "...",
  "francais": "...",
  "mots": [
    { "hebreu_brut": "...", "hebreu_voyelles": "...", "francais_mot": "...", "infinitif": "..." (optionnel) }
  ]
}
`;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titre_seif: { type: Type.STRING },
            texte_avec_voyelles: { type: Type.STRING },
            francais: { type: Type.STRING },
            mots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hebreu_brut: { type: Type.STRING },
                  hebreu_voyelles: { type: Type.STRING },
                  francais_mot: { type: Type.STRING },
                  infinitif: { type: Type.STRING }
                },
                required: ['hebreu_brut', 'hebreu_voyelles', 'francais_mot']
              }
            }
          },
          required: ['titre_seif', 'texte_avec_voyelles', 'francais', 'mots']
        }
      }
    });

    const result = JSON.parse(response.text());
    
    const voyellesWords = result.texte_avec_voyelles.split(/\s+/);
    
    if (inputWords.length !== voyellesWords.length) {
      throw new Error(`LONGUEUR INCORRECTE: Brut a ${inputWords.length} mots, Voyelles a ${voyellesWords.length} mots.`);
    }

    if (result.mots.length !== inputWords.length) {
      throw new Error(`DICTIONNAIRE INCORRECT: Dictionnaire a ${result.mots.length} entrées au lieu de ${inputWords.length}.`);
    }

    const mots_alignes = inputWords.map((w, i) => {
      let f_mot = result.mots[i]?.francais_mot;
      if (!f_mot || f_mot === 'Terme hébreu' || f_mot.startsWith('Terme (')) f_mot = '—';
      const obj = {
        id: i,
        hebreu_brut: w,
        hebreu_voyelles: voyellesWords[i] || w,
        francais_mot: f_mot,
        expression_contexte: f_mot
      };
      if (result.mots[i]?.infinitif) {
        obj.infinitif = result.mots[i].infinitif;
      }
      return obj;
    });

    return {
      seif: String(seifNum),
      sujet: "הלכות השכמת הבוקר",
      sujet_fr: "Lois du réveil du matin",
      titre_seif: result.titre_seif,
      texte_integral: {
        hebreu_sans_voyelles: textRaw,
        hebreu_avec_voyelles: result.texte_avec_voyelles,
        francais: result.francais
      },
      mots_alignes
    };

  } catch (err) {
    if (attempt < MAX_RETRIES) {
      console.warn(`[Seif ${seifNum}] Échec (${err.message}). Nouvel essai dans ${API_DELAY_MS}ms...`);
      await new Promise(r => setTimeout(r, API_DELAY_MS));
      return processSeifViaGemini(seifNum, textRaw, attempt + 1);
    } else {
      throw new Error(`[Seif ${seifNum}] Échec définitif après ${MAX_RETRIES} tentatives: ${err.message}`);
    }
  }
}

async function main() {
  console.log("🌐 Lecture du texte brut depuis", RAW_FILE);
  let rawText = fs.readFileSync(RAW_FILE, 'utf8');
  
  const siman1Start = rawText.indexOf('~ סימן א - הלכות השכמת הבוקר');
  const siman2Start = rawText.indexOf('~ סימן ב');
  
  const seifimRaw = rawText.substring(siman1Start, siman2Start);
  const lines = seifimRaw.split('\n').map(l => cleanText(l)).filter(Boolean);
  
  const rawSeifim = [];
  let currentSeifNum = null;
  
  for (let line of lines) {
    const match = line.match(/^!\s*([א-ת]{1,2})\s*$/);
    if (match) {
      currentSeifNum = match[1];
    } else if (currentSeifNum && line.trim().length > 0) {
      rawSeifim.push(`${currentSeifNum}. ${line.trim()}`);
      currentSeifNum = null;
    }
  }

  console.log(`Parsed ${rawSeifim.length} Seifim from the raw file.`);
  console.log('Sample Seif 59:', rawSeifim[58]);
  // process.exit(0);
  
  const halakhot = [];

  for (let i = 0; i < rawSeifim.length; i++) {
    const rawText = rawSeifim[i];
    const cleanRawText = rawText.replace(/\s+/g, ' ').trim();
    
    const seifNum = i + 1;
    const res = await processSeifViaGemini(seifNum, cleanRawText);
    halakhot.push(res);
    
    console.log(`✅ Seif ${seifNum} terminé.`);
    await new Promise(r => setTimeout(r, API_DELAY_MS));
  }

  const outputObj = {
    siman: "1",
    halakhot
  };

  const jsonStr = JSON.stringify(outputObj, null, 2);

  fs.mkdirSync(path.dirname(OUT1), { recursive: true });
  fs.writeFileSync(OUT1, jsonStr, 'utf8');
  fs.writeFileSync(OUT2, jsonStr, 'utf8');
  fs.writeFileSync(OUT3, jsonStr, 'utf8');

  console.log(`🎉 Siman 1 reconstruit entièrement avec ${halakhot.length} Seifim !`);
}

main().catch(console.error);
