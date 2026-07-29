const fs = require('fs');
const path = require('path');

function removeNikkoud(text) {
  if (!text) return "";
  return text.replace(/[\u0591-\u05C7]/g, "");
}

function cleanDuplicateDiacritics(text) {
  if (!text) return "";
  return text.replace(/([\u0591-\u05C7])\1+/g, "$1");
}

const ROOT = path.resolve(__dirname, '..');
const targetFiles = [
  path.join(ROOT, 'public', 'data', 'siman_1.json'),
  path.join(ROOT, 'public', 'data', 'yalkout-1.json')
];

let replacedCount = 0;

targetFiles.forEach(fp => {
  if (!fs.existsSync(fp)) return;
  const d = JSON.parse(fs.readFileSync(fp, 'utf8'));
  
  d.halakhot.forEach(h => {
    if (h.mots_alignes) {
      h.mots_alignes.forEach(m => {
        if (m.hebreu_voyelles === 'לְעַמּוּד') {
          m.hebreu_voyelles = 'לַעֲמוֹד';
          replacedCount++;
        }
        else if (m.hebreu_voyelles === 'לְלִמּוּד') {
          m.hebreu_voyelles = 'לִלְמוֹד';
          replacedCount++;
        }
        else if (m.hebreu_voyelles === 'לִיְשׁוֹן') {
          m.hebreu_voyelles = 'לִישׁוֹן';
          replacedCount++;
        }
      });
    }
  });

  // Recalculate hebreu_brut, text_integral for all seifim
  d.halakhot.forEach(h => {
    if (h.mots_alignes) {
      h.mots_alignes.forEach(m => {
        if (m.hebreu_voyelles) {
          m.hebreu_voyelles = cleanDuplicateDiacritics(m.hebreu_voyelles);
          m.hebreu_brut = removeNikkoud(m.hebreu_voyelles);
        }
      });
      h.texte_integral.hebreu_sans_voyelles = h.mots_alignes.map(m => m.hebreu_brut).join(' ');
      h.texte_integral.hebreu_avec_voyelles = h.mots_alignes.map(m => m.hebreu_voyelles).join(' ');
    }
  });

  fs.writeFileSync(fp, JSON.stringify(d, null, 2), 'utf8');
  console.log(`✅ Corrected ${path.basename(fp)}`);
});

console.log(`Total replacements made: ${replacedCount}`);
