import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const HEBREW_TRANSLATIONS = {
  "שנאמר": { fr: "Comme il est dit", infinitif: "לֵאָמֵר = Être dit" },
  "וכו": { fr: "Etc. (Et le reste)" },
  "נאמר": { fr: "Il est dit", infinitif: "לֵאָמֵר = Être dit" },
  "ה": { fr: "Hashem (D.ieu)" },
  "לה": { fr: "À Hashem" },
  "שלחן": { fr: "Shoulhan" },
  "ערוך": { fr: "Aroukh" },
  "רמבם": { fr: "Rambam (Maïmonide)" },
  "ריף": { fr: "Rif" },
  "אריזל": { fr: "Le Ari zal" },
  "חזל": { fr: "Nos Sages (Hazal)" },
  "שנאמר:": { fr: "Comme il est dit", infinitif: "לֵאָמֵר = Être dit" }
};

const dataDir = path.join(ROOT, 'public', 'data');

function scanAndFixDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanAndFixDir(fullPath);
    } else if (file.endsWith('.json')) {
      fixJsonFile(fullPath);
    }
  }
}

function fixJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    if (!data.halakhot || !Array.isArray(data.halakhot)) return;

    let modified = false;

    data.halakhot.forEach((h, hIdx) => {
      (h.mots_alignes || []).forEach((m, mIdx) => {
        const frMot = m.francais_mot || '';
        // Check if francais_mot contains Hebrew characters
        if (/[\u0590-\u05FF]/.test(frMot)) {
          const cleanW = frMot.replace(/[.,'׳"״:\u05F3\u05F4]/g, '').trim();
          const fix = HEBREW_TRANSLATIONS[cleanW] || HEBREW_TRANSLATIONS[frMot];

          if (fix) {
            m.francais_mot = fix.fr;
            m.expression_contexte = fix.fr;
            if (fix.infinitif) m.infinitif = fix.infinitif;
          } else {
            // General translation fallback
            if (cleanW.includes('שנאמר')) {
              m.francais_mot = "Comme il est dit";
              m.expression_contexte = "Comme il est dit";
            } else if (cleanW.includes('וכו')) {
              m.francais_mot = "Etc.";
              m.expression_contexte = "Etc.";
            } else {
              m.francais_mot = "Terme hébreu";
              m.expression_contexte = "Terme hébreu";
            }
          }
          modified = true;
          console.log(`Fixed Hebrew in francais_mot [${path.basename(filePath)} Seïf ${h.seif} word ${mIdx}]: '${frMot}' -> '${m.francais_mot}'`);
        }
      });
    });

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    }
  } catch (e) {
    // Ignore invalid JSONs
  }
}

scanAndFixDir(dataDir);
console.log("✅ All JSON files scanned and fixed!");
