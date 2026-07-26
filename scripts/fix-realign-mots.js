/**
 * fix-realign-mots.js
 * 
 * Ce script corrige le décalage d'un cran dans mots_alignes causé par
 * l'insertion du badge id:0 sans réalignement des annotations.
 * 
 * Pattern détecté :
 *   mots[0] = badge {hebreu_brut: "א.", hebreu_voyelles: "א.", francais_mot: "1."} ✓ correct
 *   mots[1] = {hebreu_brut: "צריך", hebreu_voyelles: "ב.",  francais_mot: "2."} ✗ décalé !
 *     → hebreu_voyelles/francais_mot/expression_contexte/infinitif viennent de l'ancien mots[0] (le badge dupliqué)
 *   mots[2] = {hebreu_brut: "האדם", hebreu_voyelles: "צָרִיךְ", francais_mot: "Il faut que"} ✗ décalé !
 *     → les annotations viennent de l'ancien mots[1] qui était réellement "צריך"
 * 
 * Correction : pour chaque mot[i] (i >= 1), prendre les annotations de mot[i+1] (le suivant)
 *              car elles y ont été poussées.
 * 
 * On détecte si un seif est affecté en vérifiant si mots[1].hebreu_voyelles contient
 * la lettre hébraïque du badge (signe du décalage).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const HEBREW_LETTERS_MAP = {
  1: 'א', 2: 'ב', 3: 'ג', 4: 'ד', 5: 'ה', 6: 'ו', 7: 'ז', 8: 'ח', 9: 'ט', 10: 'י',
  11: 'יא', 12: 'יב', 13: 'יג', 14: 'יד', 15: 'טו', 16: 'טז', 17: 'יז', 18: 'יח', 19: 'יט', 20: 'כ',
  21: 'כא', 22: 'כב', 23: 'כג', 24: 'כד', 25: 'כה', 26: 'כו', 27: 'כז', 28: 'כח', 29: 'כט', 30: 'ל',
  31: 'לא', 32: 'לב', 33: 'לג', 34: 'לד', 35: 'לה', 36: 'לו', 37: 'לז', 38: 'לח', 39: 'לט', 40: 'מ',
  41: 'מא', 42: 'מב', 43: 'מג', 44: 'מד', 45: 'מה', 46: 'מו', 47: 'מז', 48: 'מח', 49: 'מט', 50: 'נ',
  51: 'נא', 52: 'נב', 53: 'נג', 54: 'נד', 55: 'נה', 56: 'נו', 57: 'נז', 58: 'נח', 59: 'נט', 60: 'ס',
  61: 'סא', 62: 'סב', 63: 'סג', 64: 'סד', 65: 'סה', 66: 'סו', 67: 'סז', 68: 'סח', 69: 'סט', 70: 'ע',
  71: 'עא', 72: 'עב', 73: 'עג', 74: 'עד', 75: 'עה', 76: 'עו', 77: 'עז', 78: 'עח', 79: 'עט', 80: 'פ',
  81: 'פא', 82: 'פב', 83: 'פג', 84: 'פד', 85: 'פה', 86: 'פו', 87: 'פז', 88: 'פח', 89: 'פט', 90: 'צ',
  91: 'צא', 92: 'צב', 93: 'צג', 94: 'צד', 95: 'צה', 96: 'צו', 97: 'צז', 98: 'צח', 99: 'צט', 100: 'ק',
  101: 'קא', 102: 'קב', 103: 'קג', 104: 'קד', 105: 'קה', 106: 'קו', 107: 'קז', 108: 'קח', 109: 'קט', 110: 'קי',
  111: 'קיא', 112: 'קיב', 113: 'קיג', 114: 'קיד', 115: 'קטו', 116: 'קטז', 117: 'קיז', 118: 'קיח', 119: 'קיט', 120: 'קכ',
  121: 'קכא', 122: 'קכב', 123: 'קכג', 124: 'קכד', 125: 'קכה', 126: 'קכו', 127: 'קכז', 128: 'קכח', 129: 'קכט', 130: 'קל',
  131: 'קלא', 132: 'קלב', 133: 'קלג', 134: 'קלד', 135: 'קלה', 136: 'קלו', 137: 'קלז', 138: 'קלח', 139: 'קלט', 140: 'קמ',
  141: 'קמא', 142: 'קמב', 143: 'קמג', 144: 'קמד', 145: 'קמה', 146: 'קמו', 147: 'קמז', 148: 'קמח', 149: 'קמט', 150: 'קס',
  151: 'קסא', 152: 'קסב', 153: 'קסג', 154: 'קסד', 155: 'קסה', 156: 'קסו', 157: 'קסז', 158: 'קסח', 159: 'קסט', 160: 'קע',
  161: 'קעא', 162: 'קעב', 163: 'קעג', 164: 'קעד', 165: 'קעה', 166: 'קעו', 167: 'קעז', 168: 'קעח', 169: 'קעט', 170: 'קפ',
  171: 'קפא', 172: 'קפב', 173: 'קפג', 174: 'קפד', 175: 'קפה', 176: 'קפו', 177: 'קפז', 178: 'קפח', 179: 'קפט', 180: 'קצ',
  181: 'קצא', 182: 'קצב', 183: 'קצג', 194: 'קצד', 185: 'קצה', 186: 'קצו', 187: 'קצז', 188: 'קצח', 189: 'קצט', 190: 'ר',
  191: 'רא', 192: 'רב', 193: 'רג', 194: 'רד', 195: 'רה', 196: 'רו', 197: 'רז', 198: 'רח', 199: 'רט', 200: 'ר'
};

function getHebrewLetter(num) {
  return HEBREW_LETTERS_MAP[num] || String(num);
}

function cleanPunct(str) {
  return (str || '').replace(/[.,'׳"״\u05F3\u05F4]/g, '').trim();
}

function isShifted(mots, seifNum) {
  // A seif is shifted if mots[1] exists AND its hebreu_voyelles or francais_mot
  // looks like a badge (number or hebrew letter) instead of a real word annotation
  if (!mots || mots.length < 2) return false;

  const mot1 = mots[1];
  const hebLetter = getHebrewLetter(seifNum);
  const cleanVoyelles = cleanPunct(mot1.hebreu_voyelles);
  const cleanFr = cleanPunct(mot1.francais_mot);
  
  // Check if voyelles of mot[1] matches the badge letter or badge number
  if (cleanVoyelles === cleanPunct(hebLetter) || cleanVoyelles === String(seifNum)) {
    return true;
  }
  // Check if francais_mot of mot[1] matches the badge number
  if (cleanFr === String(seifNum)) {
    return true;
  }
  // Check if expression_contexte of mot[1] is "Numéro du paragraphe" or matches badge
  if (mot1.expression_contexte === 'Numéro du paragraphe') {
    return true;
  }
  if (cleanPunct(mot1.expression_contexte) === cleanPunct(hebLetter)) {
    return true;
  }
  
  return false;
}

const findFiles = (dir) => {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) results = results.concat(findFiles(fullPath));
    else if (file.endsWith('.json')) results.push(fullPath);
  });
  return results;
};

let totalFixed = 0;
let totalOk = 0;
let totalFiles = 0;

const jsonFiles = findFiles(path.join(ROOT, 'public', 'data'));
jsonFiles.forEach(fp => {
  try {
    const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
    if (!data || !data.halakhot || !Array.isArray(data.halakhot)) return;

    let fileFixed = 0;
    
    data.halakhot.forEach((h, idx) => {
      const seifNum = parseInt(h.seif || (idx + 1), 10) || (idx + 1);
      const hebLetter = getHebrewLetter(seifNum);
      const hebBadge = `${hebLetter}.`;
      const frBadge = `${seifNum}.`;
      const mots = h.mots_alignes || [];

      if (!isShifted(mots, seifNum)) {
        // Verify badge exists at position 0
        if (mots.length > 0 && cleanPunct(mots[0].hebreu_brut) === cleanPunct(hebLetter)) {
          totalOk++;
          return;
        }
      }

      // The mots are shifted. We need to fix them.
      // Current state: mots[0] = badge (correct), mots[1..N] have annotations shifted +1
      // mots[i].hebreu_brut is CORRECT (matches the actual Hebrew word)
      // mots[i].hebreu_voyelles = annotations that should belong to mots[i-1]
      // mots[i].francais_mot = annotations that should belong to mots[i-1]
      // etc.
      
      // So for mot[i], the correct annotations are currently in mot[i+1]
      const fixedMots = mots.map((mot, i) => {
        if (i === 0) {
          // Badge - keep as is or fix
          return {
            id: 0,
            hebreu_brut: hebBadge,
            hebreu_voyelles: hebBadge,
            francais_mot: frBadge,
            expression_contexte: 'Numéro du paragraphe'
          };
        }
        
        // For mot[i], get annotations from mot[i+1] (where they were pushed)
        const source = mots[i + 1];
        if (source) {
          return {
            id: i,
            hebreu_brut: mot.hebreu_brut,
            hebreu_voyelles: source.hebreu_voyelles,
            francais_mot: source.francais_mot,
            expression_contexte: source.expression_contexte || '',
            ...(source.infinitif ? { infinitif: source.infinitif } : {})
          };
        } else {
          // Last word: no source available, keep hebreu_brut as voyelles fallback
          return {
            id: i,
            hebreu_brut: mot.hebreu_brut,
            hebreu_voyelles: mot.hebreu_brut,
            francais_mot: '',
            expression_contexte: ''
          };
        }
      });

      // Remove the last mot (which is now a ghost duplicate from the shift)
      // because we had N+1 entries after badge prepend, and the last one has no data
      if (fixedMots.length > 1) {
        fixedMots.pop();
      }

      // Re-index
      fixedMots.forEach((m, i) => { m.id = i; });

      h.mots_alignes = fixedMots;
      fileFixed++;
      totalFixed++;
    });

    if (fileFixed > 0) {
      fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✅ ${path.basename(fp)} : ${fileFixed} Seifim réalignés (${data.halakhot.length} total)`);
    } else {
      console.log(`✓  ${path.basename(fp)} : Déjà aligné (${data.halakhot.length} halakhot)`);
    }
    totalFiles++;
  } catch (e) {
    console.error('❌ Erreur sur', fp, e.message);
  }
});

console.log(`\n📊 Résultat : ${totalFixed} Seifim corrigés, ${totalOk} déjà OK sur ${totalFiles} fichiers`);
