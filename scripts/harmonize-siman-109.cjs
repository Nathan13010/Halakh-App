const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function harmonizeHalakha(h) {
  const mots = h.mots_alignes;
  if (!mots) return;

  mots.forEach((m, idx) => {
    // 1. Harmonize השליח -> "l'officiant"
    if (m.hebreu_brut === 'השליח' || m.hebreu_brut === 'השליח,') {
      const punct = m.hebreu_brut.endsWith(',') ? ',' : '';
      m.francais_mot = `l'officiant${punct}`;
      m.expression_contexte = "L'officiant (Chalia'h Tsibour)";
    }

    // 2. Harmonize צבור / ציבור when part of השליח צבור
    if (idx > 0 && (mots[idx - 1].hebreu_brut === 'השליח' || mots[idx - 1].hebreu_brut === 'השליח,')) {
      if (m.hebreu_brut.startsWith('צבור') || m.hebreu_brut.startsWith('ציבור')) {
        const punct = m.hebreu_brut.slice(-1);
        const hasPunct = [',', '.', ';', ':', ']'].includes(punct);
        const pStr = hasPunct ? punct : '';
        m.francais_mot = `de la communauté${pStr}`;
        m.expression_contexte = "De la communauté (Chalia'h Tsibour)";
      }
    }
  });
}

const targetFiles = [
  path.join(ROOT, 'public', 'data', 'siman_109.json'),
  path.join(ROOT, 'public', 'data', 'yalkout-109.json'),
];

targetFiles.forEach(fp => {
  if (!fs.existsSync(fp)) return;
  const d = JSON.parse(fs.readFileSync(fp, 'utf8'));
  if (d.halakhot && Array.isArray(d.halakhot)) {
    d.halakhot.forEach(harmonizeHalakha);
    fs.writeFileSync(fp, JSON.stringify(d, null, 2), 'utf8');
    console.log(`✅ Harmonized terms in: ${path.relative(ROOT, fp)}`);
  }
});
