const fs = require('fs');
const file = 'public/data/siman_2.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
let modified = false;

data.halakhot.forEach(h => {
  if (h.seif === '28') {
    if (!h.texte_integral.francais.includes('et là-bas dans la note')) {
      h.texte_integral.francais = h.texte_integral.francais.replace(
        '[Chéérit Yossef, Yalkout Yossef].',
        '[Chéérit Yossef, Yalkout Yossef, et là-bas dans la note page 251, car de nos jours il n\'y a pas besoin de faire attention à porter les chaussettes seulement sous la couverture].'
      );
      modified = true;
    }
  }
  if (h.seif === '26') {
    const w2 = h.mots_alignes.find(m => m.id === 2);
    if (w2 && w2.hebreu_brut === 'לפני') {
      w2.francais_mot = 'chez';
      modified = true;
    }
    const w22 = h.mots_alignes.find(m => m.id === 22);
    if (w22 && w22.hebreu_brut === 'וכיו\"ב.') {
      w22.expression_contexte = 'וכיוצא בזה = et d\'autres choses semblables (etc.)';
      modified = true;
    }
    const w32 = h.mots_alignes.find(m => m.id === 32);
    const w33 = h.mots_alignes.find(m => m.id === 33);
    if (w32 && w33 && w32.hebreu_brut === 'בגילוי' && w33.hebreu_brut === 'ראש,') {
      w32.francais_mot = 'à découvert';
      w33.francais_mot = 'tête,';
      modified = true;
    }
  }
});

if (modified) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log('Fichier siman_2.json mis à jour avec succès !');
} else {
  console.log('Aucune modification apportée.');
}
