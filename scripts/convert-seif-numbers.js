import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const HEBREW_NUMERALS = {
  'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9, 'י': 10,
  'יא': 11, 'יב': 12, 'יג': 13, 'יד': 14, 'טו': 15, 'טז': 16, 'יז': 17, 'יח': 18, 'יט': 19, 'כ': 20,
  'כא': 21, 'כב': 22, 'כג': 23, 'כד': 24, 'כה': 25, 'כו': 26, 'כז': 27, 'כח': 28, 'כט': 29, 'ל': 30,
  'לא': 31, 'לב': 32, 'לג': 33, 'לד': 34, 'לה': 35, 'לו': 36, 'לז': 37, 'לח': 38, 'לט': 39, 'מ': 40,
  'מא': 41, 'מב': 42, 'מג': 43, 'מד': 44, 'מה': 45, 'מו': 46, 'מז': 47, 'מח': 48, 'מט': 49, 'נ': 50,
  'נא': 51, 'נב': 52, 'נג': 53, 'נד': 54, 'נה': 55, 'נו': 56, 'נז': 57, 'נח': 58, 'נט': 59, 'ס': 60,
  'סא': 61, 'סב': 62, 'סג': 63, 'סד': 64, 'סה': 65, 'סו': 66, 'סז': 67, 'סח': 68, 'סט': 69, 'ע': 70,
  'עא': 71, 'עב': 72, 'עג': 73, 'עד': 74, 'עה': 75, 'עו': 76, 'עז': 77, 'עח': 78, 'עט': 79, 'פ': 80,
  'פא': 81, 'פב': 82, 'פג': 83, 'פד': 84, 'פה': 85, 'פו': 86, 'פז': 87, 'פח': 88, 'פט': 89, 'צ': 90,
  'צא': 91, 'צב': 92, 'צג': 93, 'צד': 94, 'צה': 95, 'צו': 96, 'צז': 97, 'צח': 98, 'צט': 99, 'ק': 100,
  'קא': 101, 'קב': 102, 'קג': 103, 'קד': 104, 'קה': 105, 'קו': 106, 'קז': 107, 'קח': 108, 'קט': 109, 'קי': 110,
  'קיא': 111, 'קיב': 112, 'קיג': 113, 'קיד': 114, 'קטו': 115, 'קטז': 116, 'קיז': 117, 'קיח': 118, 'קיט': 119, 'קכ': 120,
  'קכא': 121, 'קכב': 122, 'קכג': 123, 'קכד': 124, 'קכה': 125, 'קכו': 126, 'קכז': 127, 'קכח': 128, 'קכט': 129, 'קל': 130,
  'קלא': 131, 'קלב': 132, 'קלג': 133, 'קלד': 134, 'קלה': 135, 'קלו': 136, 'קלז': 137, 'קלח': 138, 'קלט': 139, 'קמ': 140,
  'קמא': 141, 'קמב': 142, 'קמג': 143, 'קמד': 144, 'קמה': 145, 'קמו': 146, 'קמז': 147, 'קמח': 148, 'קמט': 149, 'קס': 150,
  'קסא': 151, 'קסב': 152, 'קסג': 153, 'קסד': 154, 'קסה': 155, 'קסו': 156, 'קסז': 157, 'קסח': 158, 'קסט': 159, 'קע': 160,
  'קעא': 161, 'קעב': 162, 'קעג': 163, 'קעד': 164, 'קעה': 165, 'קעו': 166, 'קעז': 167, 'קעח': 168, 'קעט': 169, 'קפ': 170,
  'קפא': 171, 'קפב': 172, 'קפג': 173, 'קפד': 174, 'קפה': 175, 'קפו': 176, 'קפז': 177, 'קפח': 178, 'קפט': 179, 'קצ': 180,
  'קצא': 181, 'קצב': 182, 'קצג': 183, 'קצד': 184, 'קצה': 185, 'קצו': 186, 'קצז': 187, 'קצח': 188, 'קצט': 189, 'ר': 190,
  'רא': 191, 'רב': 192, 'רג': 193
};

function parseSeif(val, fallbackIdx) {
  if (typeof val === 'number') return String(val);
  if (!val) return String(fallbackIdx + 1);
  const clean = String(val).replace(/[.'׳"״]/g, '').trim();
  if (/^\d+$/.test(clean)) return clean;
  if (HEBREW_NUMERALS[clean]) return String(HEBREW_NUMERALS[clean]);
  return String(fallbackIdx + 1);
}

const findFiles = (dir) => {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(fullPath));
    } else if (file.endsWith('.json')) {
      results.push(fullPath);
    }
  });
  return results;
};

const jsonFiles = findFiles(path.join(ROOT, 'public', 'data'));
jsonFiles.forEach(fp => {
  try {
    const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
    if (data && data.halakhot && Array.isArray(data.halakhot)) {
      let countFixed = 0;
      data.halakhot.forEach((h, idx) => {
        const fixed = parseSeif(h.seif, idx);
        if (h.seif !== fixed) {
          h.seif = fixed;
          countFixed++;
        }
      });
      fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✅ ${path.basename(fp)} : ${countFixed} numéros seif convertis en chiffres!`);
    }
  } catch (e) {
    console.error('Erreur sur', fp, e.message);
  }
});
