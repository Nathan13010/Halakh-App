import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const ROOT = path.join(__dirname, '..');

const SYSTEM_PROMPT = `
Tu es un expert en Halakha (Loi juive), spécialisé dans la traduction et l'explication du Kitzour Yalkout Yossef.
Ta mission est de générer un objet JSON contenant la traduction et l'alignement mot-à-mot du texte fourni.

FORMAT JSON ATTENDU :
{
  "sujet": "...", // En hébreu
  "texte_integral": {
    "hebreu_sans_voyelles": "...",
    "hebreu_avec_voyelles": "...",
    "francais": "..."
  },
  "mots_alignes": [
    {
      "id": 1,
      "hebreu_brut": "...",
      "hebreu_voyelles": "...",
      "francais_mot": "...",
      "expression_contexte": "...",
      "infinitif": "..." // Optionnel
    }
  ]
}

REGLES STRICTES :
1. "mots_alignes" doit contenir CHAQUE MOT du texte original. Si le texte a 150 mots, le tableau doit avoir 150 éléments. Ne jamais tronquer le tableau !
2. Ne mets pas le badge (numéro de paragraphe) dans le tableau "mots_alignes".
`;

async function regen() {
  console.log('Generating Seif 8...');
  const text = `ח. היוצא לנקביו צריך לנהוג בצניעות בבית הכסא, ויצמצם בגילוי גופו רק מה שמוכרח לו לגלות שלא לטנף בגדיו. ואף על פי שאמרו בגמרא שלא יגלה מלאחריו יותר מטפח, ומלפניו טפחיים, בזמן הזה שבתי הכסאות שלנו יש בהם מחיצות ודלת סגורה, אין להקפיד בשיעור הנז'. ומכל מקום יגלה רק מה שמוכרח. ויזהר לנהוג בצניעות גם בלילה, ויסגור הדלת אפילו בחושך, משום צניעות. וכל אדם צריך להזהר בזה, ולא רק תלמידי חכמים. ואף להטלת מי רגליו יהא צנוע. ואפילו אם מחמת שמחפש מקום צנוע צריך להשהות עצמו מעט, אין לחוש בזה משום איסור בל תשקצו, וגדול כבוד הבריות. אך אם יש שם ריח רע וקשה לו מאד לעשות שם צרכיו זולת אם יפתח הדלת, יש להקל בזה כשאין שם מי שרואהו. וגם קטן בר הבנה טוב להרגילו שיהיה צנוע בבית הכסא, ושלא ידבר שם.`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview', // using pro model for reliable completion of long texts
        contents: [
          { role: 'user', parts: [{ text: 'Voici le texte à traiter pour le Seif 8 :\n\n' + text }] }
        ],
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });
      
      const raw = response.text;
      console.log('RAW:\n' + raw.substring(0, 150));
      const cleanRaw = (raw || '').replace(/```json/g, '').replace(/```/g, '').replace(/[\u0600-\u06FF]/g, '').trim();
      const result = JSON.parse(cleanRaw);
      
      const expectedWords = text.split(/\s+/).filter(Boolean).length;
      if (result.mots_alignes.length < expectedWords * 0.8) {
         throw new Error("Truncated! Expected ~" + expectedWords + ", got " + result.mots_alignes.length);
      }
      
      // Load siman 3 json
      const paths = ['public/data/siman_3.json', 'public/data/yalkout-3.json', 'public/data/kitzur_yalkut_yosef/shabbat/siman_3.json'];
      let d = JSON.parse(fs.readFileSync(path.join(ROOT, paths[0]), 'utf8'));
      
      // format result properly
      const { fixSeif } = await import('../scripts/fix-all-seif-prefixes.js');
      
      result.livre = "Kitzur Yalkout Yossef";
      result.sujet = "סימן ג' - הנהגת בית הכסא";
      result.sujet_he = "סימן ג' - הנהגת בית הכסא";
      result.sujet_fr = "Section 3 - Conduite à tenir aux toilettes";
      result.siman = "3";
      result.seif = "8";
      
      // Fake subject map
      const subMap = { "סימן ג' - הנהגת בית הכסא": "Section 3 - Conduite à tenir aux toilettes" };
      fixSeif(result, 7, subMap);
      
      // Insert in order
      d.halakhot.push(result);
      d.halakhot.sort((a, b) => parseInt(a.seif) - parseInt(b.seif));
      
      // Save to all paths
      paths.forEach(p => {
         const fp = path.join(ROOT, p);
         if (fs.existsSync(fp)) {
           fs.writeFileSync(fp, JSON.stringify(d, null, 2));
           console.log('Updated', fp);
         }
      });
      console.log('SUCCESS!');
      return;
    } catch (e) {
      console.error('Attempt', attempt, 'failed:', e.message);
    }
  }
}

regen();
