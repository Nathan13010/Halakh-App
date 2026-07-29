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

targetFiles.forEach(fp => {
  if (!fs.existsSync(fp)) return;
  const d = JSON.parse(fs.readFileSync(fp, 'utf8'));
  
  // Apply specific fixes
  const h1 = d.halakhot[0]; // Seif 1
  if (h1 && h1.mots_alignes[113] && h1.mots_alignes[113].hebreu_voyelles === 'הַמְגֻוָּנָה') {
    h1.mots_alignes[113].hebreu_voyelles = 'הַמְגֻנֶּה';
  }
  if (h1 && h1.mots_alignes[28] && h1.mots_alignes[28].hebreu_voyelles === 'עז') {
    h1.mots_alignes[28].hebreu_voyelles = 'עַז';
  }

  const h2 = d.halakhot[1]; // Seif 2
  if (h2 && h2.mots_alignes[63] && h2.mots_alignes[63].hebreu_voyelles === 'וְאִילּוּ') {
    h2.mots_alignes[63].hebreu_voyelles = 'וְאֵלּוּ';
  }

  const h4 = d.halakhot[3]; // Seif 4
  if (h4 && h4.mots_alignes[106] && h4.mots_alignes[106].hebreu_voyelles === 'בְּשֶׁיָּנָה') {
    h4.mots_alignes[106].hebreu_voyelles = 'בְּשֵׁינָה';
  }

  const h5 = d.halakhot[4]; // Seif 5
  if (h5 && h5.mots_alignes[36] && h5.mots_alignes[36].hebreu_voyelles === 'בְּשֶׁיָּנָה.') {
    h5.mots_alignes[36].hebreu_voyelles = 'בְּשֵׁינָה.';
  }

  const h8 = d.halakhot[7]; // Seif 8
  if (h8 && h8.mots_alignes[74] && h8.mots_alignes[74].hebreu_voyelles === 'אֶל') {
    h8.mots_alignes[74].hebreu_voyelles = 'אַל';
  }

  const h15 = d.halakhot[14]; // Seif 15
  if (h15 && h15.mots_alignes[11] && h15.mots_alignes[11].hebreu_voyelles === 'מְעוּטָּר') {
    h15.mots_alignes[11].hebreu_voyelles = 'מְעֻטָּר';
  }

  const h17 = d.halakhot[16]; // Seif 17
  if (h17 && h17.mots_alignes[14] && h17.mots_alignes[14].hebreu_voyelles === 'כְּיוּהֲרָא,') {
    h17.mots_alignes[14].hebreu_voyelles = 'כְּיֻהֲרָא,';
  }

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
