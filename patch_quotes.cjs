const fs = require('fs');
const file = 'public/data/siman_1.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const s45 = data.halakhot.find(h => h.seif === '45');
if (s45) {
  // Update texte_integral
  s45.texte_integral.hebreu_sans_voyelles = s45.texte_integral.hebreu_sans_voyelles.replace(/ביהמ'ק/g, 'ביהמ"ק').replace(/השו'ע/g, 'השו"ע').replace(/ע'כ/g, 'ע"כ');
  s45.texte_integral.hebreu_avec_voyelles = s45.texte_integral.hebreu_avec_voyelles.replace(/ביהמ'ק/g, 'ביהמ"ק').replace(/הַשּׁוּ'עַ/g, 'הַשּׁוּ"עַ').replace(/השׁו'ע/g, 'השׁו"ע').replace(/ע'כ/g, 'ע"כ');
  
  // Update mots_alignes
  const m22 = s45.mots_alignes.find(m => m.id === 22);
  if (m22) { m22.hebreu_brut = m22.hebreu_brut.replace(/'/g, '"'); m22.hebreu_voyelles = m22.hebreu_voyelles.replace(/'/g, '"'); }
  const m39 = s45.mots_alignes.find(m => m.id === 39);
  if (m39) { m39.hebreu_brut = m39.hebreu_brut.replace(/'/g, '"'); m39.hebreu_voyelles = m39.hebreu_voyelles.replace(/'/g, '"'); }
  const m84 = s45.mots_alignes.find(m => m.id === 84);
  if (m84) { m84.hebreu_brut = m84.hebreu_brut.replace(/'/g, '"'); m84.hebreu_voyelles = m84.hebreu_voyelles.replace(/'/g, '"'); }
}
fs.writeFileSync(file, JSON.stringify(data, null, 2));
