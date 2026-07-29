const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function removeNikkoud(str) {
  return str.replace(/[\u0591-\u05C7]/g, '');
}

function cleanDuplicateDiacritics(str) {
  return str.replace(/([\u0591-\u05C7])\1+/g, '$1');
}

function fixHalakha(h) {
  // 1. Clean duplicate diacritics in texte_integral
  if (h.texte_integral && h.texte_integral.hebreu_avec_voyelles) {
    h.texte_integral.hebreu_avec_voyelles = cleanDuplicateDiacritics(h.texte_integral.hebreu_avec_voyelles);
    // Fix עִמּוֹ' -> עַמּוֹ' for page abbreviation in text integral
    h.texte_integral.hebreu_avec_voyelles = h.texte_integral.hebreu_avec_voyelles.replace(/עִמּוֹ'/g, "עַמּוֹ'");
  }

  // 2. Fix mots_alignes
  if (Array.isArray(h.mots_alignes)) {
    h.mots_alignes.forEach((m, idx) => {
      if (idx === 0) return; // skip badge

      // Clean duplicate diacritics
      m.hebreu_voyelles = cleanDuplicateDiacritics(m.hebreu_voyelles);

      // Fix עִמּוֹ' -> עַמּוֹ' for page abbreviation
      if (m.hebreu_voyelles === "עִמּוֹ'" && (m.francais_mot === 'page' || (m.expression_contexte && m.expression_contexte.includes('page')))) {
        m.hebreu_voyelles = "עַמּוֹ'";
      }

      // Set hebreu_brut strictly from removeNikkoud(hebreu_voyelles)
      m.hebreu_brut = removeNikkoud(m.hebreu_voyelles);
    });

    // Re-generate texte_integral.hebreu_sans_voyelles to ensure 100% perfect match
    const sansWords = h.mots_alignes.map(m => m.hebreu_brut);
    h.texte_integral.hebreu_sans_voyelles = sansWords.join(' ');
  }
}

const targetFiles = [
  path.join(ROOT, 'public', 'data', 'siman_109.json'),
  path.join(ROOT, 'public', 'data', 'yalkout-109.json'),
];

targetFiles.forEach(fp => {
  if (!fs.existsSync(fp)) return;
  const d = JSON.parse(fs.readFileSync(fp, 'utf8'));
  if (d.halakhot && Array.isArray(d.halakhot)) {
    d.halakhot.forEach(fixHalakha);
    fs.writeFileSync(fp, JSON.stringify(d, null, 2), 'utf8');
    console.log(`✅ File updated: ${path.relative(ROOT, fp)}`);
  }
});
