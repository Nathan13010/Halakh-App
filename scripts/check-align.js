import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

function cleanHeb(str) {
  return (str || '').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"'׳״\u05F3\u05F4]/g, '').trim();
}

function reAlignHalakha(h) {
  const hebBrutFull = (h.texte_integral?.hebreu_sans_voyelles || '').trim();
  const hebVoyellesFull = (h.texte_integral?.hebreu_avec_voyelles || hebBrutFull).trim();

  const brutWords = hebBrutFull.split(/\s+/).filter(Boolean);
  const voyellesWords = hebVoyellesFull.split(/\s+/).filter(Boolean);
  const originalMots = h.mots_alignes || [];

  // Remove leading paragraph numbers like "א.", "ב.", "1." from originalMots if text does not start with them
  let cleanMots = [...originalMots];
  if (cleanMots.length > 0 && /^[0-9א-ת]+[\.]?$/.test(cleanMots[0].hebreu_brut.trim())) {
    const textFirstWord = cleanHeb(brutWords[0]);
    const motFirstWord = cleanHeb(cleanMots[0].hebreu_brut);
    if (textFirstWord !== motFirstWord) {
      console.log(`  -> Suppress prefix item: "${cleanMots[0].hebreu_brut}" (${cleanMots[0].francais_mot})`);
      cleanMots.shift();
    }
  }

  // Smart Word Matching: map each brutWord to best matching item in cleanMots
  let lastMatchedIndex = 0;
  const fullMots = brutWords.map((bWord, idx) => {
    const bClean = cleanHeb(bWord);

    // Look for exact word match starting near lastMatchedIndex
    let matchedItem = null;
    let foundIdx = -1;

    for (let i = lastMatchedIndex; i < Math.min(lastMatchedIndex + 5, cleanMots.length); i++) {
      const mClean = cleanHeb(cleanMots[i].hebreu_brut);
      if (mClean === bClean || (bClean.length > 1 && mClean.includes(bClean))) {
        matchedItem = cleanMots[i];
        foundIdx = i;
        break;
      }
    }

    if (!matchedItem && idx < cleanMots.length) {
      // Fallback to sequential index if character similarity is close
      const candidate = cleanMots[idx];
      const cClean = cleanHeb(candidate.hebreu_brut);
      if (bClean === cClean || bClean.startsWith(cClean) || cClean.startsWith(bClean)) {
        matchedItem = candidate;
        foundIdx = idx;
      }
    }

    if (foundIdx !== -1) {
      lastMatchedIndex = foundIdx + 1;
    }

    return {
      id: idx,
      hebreu_brut: bWord,
      hebreu_voyelles: voyellesWords[idx] || bWord,
      francais_mot: matchedItem ? (matchedItem.francais_mot || '') : '',
      expression_contexte: matchedItem ? (matchedItem.expression_contexte || '') : '',
      infinitif: matchedItem ? matchedItem.infinitif : null
    };
  });

  return fullMots;
}

const files = [
  path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', 'siman_318.json'),
  path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', 'siman_1.json'),
  path.join(ROOT, 'public', 'data', 'siman_318.json'),
  path.join(ROOT, 'public', 'data', 'siman_1.json'),
  path.join(ROOT, 'public', 'data', 'yalkout-318.json'),
  path.join(ROOT, 'public', 'data', 'yalkout-1.json')
];

files.forEach(fp => {
  if (fs.existsSync(fp)) {
    console.log(`🔍 Vérification et réalignement de ${path.basename(fp)}...`);
    const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
    data.halakhot.forEach((h, idx) => {
      h.mots_alignes = reAlignHalakha(h);
    });
    fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ ${path.basename(fp)} réaligné avec succès !`);
  }
});
