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
  181: 'קצא', 182: 'קצב', 183: 'קצג', 184: 'קצד', 185: 'קצה', 186: 'קצו', 187: 'קצז', 188: 'קצח', 189: 'קצט', 190: 'ר',
  191: 'רא', 192: 'רב', 193: 'רג'
};

function getHebrewLetter(seifNum) {
  const num = parseInt(seifNum, 10);
  if (!isNaN(num) && HEBREW_LETTERS_MAP[num]) {
    return HEBREW_LETTERS_MAP[num];
  }
  return String(seifNum);
}

function cleanStr(str) {
  return (str || '').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"'׳״\u05F3\u05F4\u0591-\u05C7]/g, '').trim();
}

function removeDuplicateBadges(mots, seifNum) {
  const hebLetter = getHebrewLetter(seifNum);
  const isDuplicate = (word) => {
    if (!word) return false;
    const cleanWord = cleanStr(word.hebreu_brut);
    return cleanWord === cleanStr(hebLetter) || cleanWord === String(seifNum) || (!isNaN(cleanWord) && cleanWord.length > 0);
  };

  // Keep shifting from front if the word is a duplicate badge
  while (mots.length > 0 && isDuplicate(mots[0])) {
    mots.shift();
  }
  return mots;
}

function realignVoyelles(h, mots) {
  const voyellesText = (h.texte_integral?.hebreu_avec_voyelles || '').trim();
  if (!voyellesText) return;
  const voyellesWords = voyellesText.split(/\s+/).filter(Boolean);

  // Offset logic: if first word of voyellesText is a badge, we offset by 1
  let voyellesOffset = 0;
  if (voyellesWords.length > 0) {
    const seifNum = parseInt(h.seif || 1, 10);
    const hebLetter = getHebrewLetter(seifNum);
    if (cleanStr(voyellesWords[0]) === cleanStr(hebLetter)) {
       voyellesOffset = 1;
    }
  }

  for (let i = 0; i < mots.length; i++) {
    if (i + voyellesOffset < voyellesWords.length) {
      mots[i].hebreu_voyelles = voyellesWords[i + voyellesOffset];
    }
  }
}

export function fixSeif(h, fallbackIdx, subjectMap) {
  const seifNum = parseInt(h.seif || (fallbackIdx + 1), 10) || (fallbackIdx + 1);
  const hebLetter = getHebrewLetter(seifNum);
  const hebBadge = `${hebLetter}.`;
  const frBadge = `${seifNum}.`;

  let hebBrut = (h.texte_integral?.hebreu_sans_voyelles || '').trim();
  let hebVoyelles = (h.texte_integral?.hebreu_avec_voyelles || hebBrut).trim();
  let frText = (h.texte_integral?.francais || '').trim();

  // Ensure text begins with badges
  if (cleanStr(hebBrut.split(/\s+/)[0] || '') !== cleanStr(hebLetter)) {
    hebBrut = `${hebBadge} ${hebBrut}`;
  }
  if (cleanStr(hebVoyelles.split(/\s+/)[0] || '') !== cleanStr(hebLetter)) {
    hebVoyelles = `${hebBadge} ${hebVoyelles}`;
  }
  if (cleanStr(frText.split(/\s+/)[0] || '') !== cleanStr(String(seifNum))) {
    frText = `${frBadge} ${frText}`;
  }

  // NLP Corrections & Normalization
  const removeNikkoud = (str) => (str || '').replace(/[\u0591-\u05C7]/g, '');
  const cleanDuplicateDiacritics = (str) => (str || '').replace(/([\u0591-\u05C7])\1+/g, '$1');

  hebVoyelles = cleanDuplicateDiacritics(hebVoyelles).replace(/עִמּוֹ'/g, "עַמּוֹ'");

  h.texte_integral = {
    hebreu_sans_voyelles: hebBrut,
    hebreu_avec_voyelles: hebVoyelles,
    francais: frText
  };

  // Normalize sujet_fr
  if (h.sujet && subjectMap[h.sujet]) {
    h.sujet_fr = subjectMap[h.sujet];
  } else if (h.sujet_he && subjectMap[h.sujet_he]) {
    h.sujet_fr = subjectMap[h.sujet_he];
  }

  // Remove existing badges from mots
  let mots = [...(h.mots_alignes || [])];
  
  if (mots.length > 0 && mots[0].expression_contexte === 'Numéro du paragraphe') {
    mots.shift();
  }

  mots = removeDuplicateBadges(mots, seifNum);
  realignVoyelles(h, mots);

  // Force id:0 badge
  mots.unshift({
    id: 0,
    hebreu_brut: hebBadge,
    hebreu_voyelles: hebBadge,
    francais_mot: frBadge,
    expression_contexte: 'Numéro du paragraphe'
  });

  // Re-index, clean diacritics, fix עמו', and enforce strict hebreu_brut
  mots.forEach((m, idx) => {
    m.id = idx;
    if (idx > 0) {
      m.hebreu_voyelles = cleanDuplicateDiacritics(m.hebreu_voyelles);
      if (m.hebreu_voyelles === "עִמּוֹ'" && (m.francais_mot === 'page' || (m.expression_contexte && m.expression_contexte.includes('page')))) {
        m.hebreu_voyelles = "עַמּוֹ'";
      }
      // m.hebreu_brut = removeNikkoud(m.hebreu_voyelles); // 🛑 Ne plus écraser pour préserver le Ktiv Male
    }
  });
  h.mots_alignes = mots;

  // Re-sync hebreu_sans_voyelles to guarantee 100% match
  h.texte_integral.hebreu_sans_voyelles = mots.map(m => m.hebreu_brut).join(' ');
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

const isMain = process.argv[1] && process.argv[1].endsWith(path.basename(__filename));

if (isMain) {
  // 1. First pass to build canonical subjects
  const jsonFiles = findFiles(path.join(ROOT, 'public', 'data'));
  const subjectMap = {};
  const subjectVotes = {};

  jsonFiles.forEach(fp => {
    try {
      const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
      if (data && data.halakhot && Array.isArray(data.halakhot)) {
        data.halakhot.forEach(h => {
          const heSubject = h.sujet || h.sujet_he; // Prefer h.sujet which is the clean subsection
          const frSubject = h.sujet_fr;
          if (heSubject && frSubject) {
            if (!subjectVotes[heSubject]) subjectVotes[heSubject] = {};
            subjectVotes[heSubject][frSubject] = (subjectVotes[heSubject][frSubject] || 0) + 1;
          }
        });
      }
    } catch (e) {}
  });

  for (let heSub in subjectVotes) {
     const votes = subjectVotes[heSub];
     const bestFr = Object.keys(votes).reduce((a, b) => votes[a] > votes[b] ? a : b);
     subjectMap[heSub] = bestFr;
  }

  // 2. Second pass to fix data
  jsonFiles.forEach(fp => {
    try {
      const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
      if (data && data.halakhot && Array.isArray(data.halakhot)) {
        data.halakhot.forEach((h, idx) => {
          fixSeif(h, idx, subjectMap);
        });
        fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf8');
        console.log(`✅ ${path.basename(fp)} : Tous les Seifim mis à jour et corrigés (${data.halakhot.length} halakhot)!`);
      }
    } catch (e) {
      console.error('Erreur sur', fp, e.message);
    }
  });
}
