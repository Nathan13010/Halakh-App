const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Revert entree.txt
const entreePath = path.join(ROOT, 'entree.txt');
let entree = fs.readFileSync(entreePath, 'utf8');
if (entree.includes('לוֹ לְהַרְגִּיל')) {
  entree = entree.replace('לוֹ לְהַרְגִּיל', 'לוֹ,לְהַרְגִּיל');
  fs.writeFileSync(entreePath, entree, 'utf8');
  console.log('✅ Reverted entree.txt');
}

// Revert JSON files
const targetFiles = [
  path.join(ROOT, 'public', 'data', 'siman_109.json'),
  path.join(ROOT, 'public', 'data', 'yalkout-109.json'),
];

targetFiles.forEach(fp => {
  if (!fs.existsSync(fp)) return;
  const d = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const h = d.halakhot[3]; // Seif 4
  if (!h || !h.mots_alignes) return;

  // Find where לוֹ and לְהַרְגִּיל or לוֹ,לְהַרְגִּיל are located
  const idx = h.mots_alignes.findIndex(m => m.hebreu_voyelles === 'לוֹ' || m.hebreu_voyelles === 'לוֹ,' || m.hebreu_voyelles === 'לוֹ,לְהַרְגִּיל');

  if (idx !== -1) {
    const combinedWord = {
      id: idx,
      hebreu_brut: "לו,להרגיל",
      hebreu_voyelles: "לוֹ,לְהַרְגִּיל",
      francais_mot: "à lui, d'habituer",
      expression_contexte: "Il lui appartient de prendre l'habitude",
      infinitif: "לְהַרְגִּיל = Habituer"
    };

    // If it was split into 2 words (לוֹ and לְהַרְגִּיל), replace both with 1 combined word
    if (h.mots_alignes[idx + 1] && (h.mots_alignes[idx + 1].hebreu_voyelles === 'לְהַרְגִּיל' || h.mots_alignes[idx + 1].hebreu_brut === 'להרגיל')) {
      h.mots_alignes.splice(idx, 2, combinedWord);
    } else {
      h.mots_alignes[idx] = combinedWord;
    }

    // Re-index all words in mots_alignes
    h.mots_alignes.forEach((m, i) => { m.id = i; });

    // Sync texte_integral
    h.texte_integral.hebreu_sans_voyelles = h.mots_alignes.map(m => m.hebreu_brut).join(' ');
    h.texte_integral.hebreu_avec_voyelles = h.mots_alignes.map(m => m.hebreu_voyelles).join(' ');
  }

  fs.writeFileSync(fp, JSON.stringify(d, null, 2), 'utf8');
  console.log(`✅ Reverted in ${path.relative(ROOT, fp)}`);
});
