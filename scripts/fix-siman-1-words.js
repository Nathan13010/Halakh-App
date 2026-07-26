import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const DICT_S1 = {
  "שויתי": { fr: "J'ai placé", context: "J'ai placé", infinitif: "לָשִׁית = Placer / Mettre" },
  "ה'": { fr: "Hashem (D.ieu)", context: "Hashem" },
  "לנגדי": { fr: "Devant moi", context: "Devant moi" },
  "תמיד": { fr: "Toujours / En permanence", context: "Toujours" },
  "הוא": { fr: "C'est", context: "C'est" },
  "כלל": { fr: "Un principe", context: "Un principe" },
  "גדול": { fr: "Grand / Majeur", context: "Majeur" },
  "בתורה": { fr: "Dans la Torah", context: "Dans la Torah" },
  "ובמעלות": { fr: "Et dans les vertus de", context: "Et dans les vertus" },
  "הצדיקים": { fr: "Les Justes", context: "Les Justes" },
  "פיטום": { fr: "La composition de", context: "La composition de" },
  "הקטורת": { fr: "L'Encens", context: "L'Encens" },
  "הסממנים": { fr: "Les ingrédients / épices", context: "Les épices" },
  "הצרי": { fr: "Le baume", context: "Le baume" },
  "והציפורן": { fr: "Et l'ongle odorant", context: "Et l'ongle odorant" },
  "והחלבנה": { fr: "Et le galbanum", context: "Et le galbanum" },
  "והלבונה": { fr: "Et l'encens pur", context: "Et l'encens pur" },
  "משקל": { fr: "Un poids de", context: "Un poids de" },
  "שבעים": { fr: "Soixante-dix", context: "Soixante-dix" },
  "ושבעה": { fr: "Et sept", context: "Et sept" },
  "מנה": { fr: "Mané (mesure)", context: "Mané" },
  "מור": { fr: "Myrrhe", context: "Myrrhe" },
  "וקציעה": { fr: "Et casse", context: "Et casse" },
  "שיבולת": { fr: "Nard", context: "Nard" },
  "נרד": { fr: "Nard", context: "Nard" },
  "וכהרכום": { fr: "Et safran", context: "Et safran" },
  "שש עשרה": { fr: "Seize", context: "Seize" },
  "שנים עשר": { fr: "Douze", context: "Douze" },
  "שלושה": { fr: "Trois", context: "Trois" },
  "תשעה": { fr: "Neuf", context: "Neuf" },
  "האבל": { fr: "L'endeuillé", context: "L'endeuillé" },
  "בתוך": { fr: "Au milieu de", context: "Au milieu de" },
  "שבעה": { fr: "Les sept jours (Shiva)", context: "Les 7 jours" },
  "רחל": { fr: "Rachel", context: "Rachel" },
  "לאה": { fr: "Léa", context: "Léa" },
  "תיקון": { fr: "Le Tikoun (Réparation)", context: "Tikoun" },
  "חצות": { fr: "Minuit", context: "Minuit" }
};

function parseWord(cleanW) {
  if (DICT_S1[cleanW]) return DICT_S1[cleanW];
  const prefixes = ['ו', 'ב', 'כ', 'ל', 'מ', 'ש', 'ה'];
  for (const p of prefixes) {
    if (cleanW.startsWith(p) && cleanW.length > 2) {
      const sub = cleanW.slice(1);
      if (DICT_S1[sub]) return DICT_S1[sub];
    }
  }
  return null;
}

function fixSiman1File(filePath) {
  if (!fs.existsSync(filePath)) return;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  data.halakhot.forEach((h) => {
    (h.mots_alignes || []).forEach((m) => {
      if (!m.francais_mot) {
        const wText = m.hebreu_voyelles || m.hebreu_brut || m.mot_hebreu || '';
        const cleanW = wText.replace(/[.,'׳"״\u05F3\u05F4]/g, '').trim();
        const entry = parseWord(cleanW);
        if (entry) {
          m.francais_mot = entry.fr;
          m.expression_contexte = entry.context;
          if (entry.infinitif) m.infinitif = entry.infinitif;
        } else {
          // Fallback clean word
          m.francais_mot = cleanW;
          m.expression_contexte = cleanW;
        }
      }
    });
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Fixed missing word translations in ${path.basename(filePath)}`);
}

fixSiman1File(path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', 'siman_1.json'));
fixSiman1File(path.join(ROOT, 'public', 'data', 'siman_1.json'));
fixSiman1File(path.join(ROOT, 'public', 'data', 'yalkout-1.json'));

console.log("✅ Siman 1 word translations fixed!");
