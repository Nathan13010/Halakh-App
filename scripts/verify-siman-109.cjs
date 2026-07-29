const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function removeNikkoud(str) {
  return str.replace(/[\u0591-\u05C7]/g, '');
}

const file = path.join(ROOT, 'public', 'data', 'siman_109.json');
const d = JSON.parse(fs.readFileSync(file, 'utf8'));

let mismatches = 0;
let dupNikkoud = 0;
let immoCount = 0;

d.halakhot.forEach((h) => {
  const sansWords = h.texte_integral.hebreu_sans_voyelles.split(/\s+/).filter(Boolean);
  const mots = h.mots_alignes;
  
  mots.forEach((m, i) => {
    const rawFromVoyelles = removeNikkoud(m.hebreu_voyelles);
    if (m.hebreu_brut !== rawFromVoyelles || m.hebreu_brut !== sansWords[i]) {
      mismatches++;
      console.log(`Mismatch at Seif ${h.seif} index ${i}: "${m.hebreu_brut}" vs "${rawFromVoyelles}" vs "${sansWords[i]}"`);
    }
    if (/([\u0591-\u05C7])\1+/.test(m.hebreu_voyelles)) {
      dupNikkoud++;
      console.log(`Dup nikkoud at Seif ${h.seif} index ${i}: "${m.hebreu_voyelles}"`);
    }
    if (m.hebreu_voyelles === "עִמּוֹ'" && m.francais_mot === 'page') {
      immoCount++;
      console.log(`Immo at Seif ${h.seif} index ${i}: "${m.hebreu_voyelles}"`);
    }
  });
});

console.log('--- VERIFICATION RESULTS ---');
console.log('Total Mismatches (hebreu_brut vs text_integral):', mismatches);
console.log('Total Duplicate Nikkoud:', dupNikkoud);
console.log('Total Immo for page:', immoCount);
