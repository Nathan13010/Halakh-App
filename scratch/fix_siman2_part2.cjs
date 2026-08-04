const fs = require('fs');
const file = 'public/data/siman_2.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
let modified = false;

function removeNikkoud(text) {
  return text.replace(/[\u0591-\u05C7]/g, '');
}

data.halakhot.forEach(h => {
  // 1. Sync hebreu_sans_voyelles avec hebreu_avec_voyelles
  if (h.texte_integral && h.texte_integral.hebreu_avec_voyelles) {
    const expectedSans = removeNikkoud(h.texte_integral.hebreu_avec_voyelles);
    if (h.texte_integral.hebreu_sans_voyelles !== expectedSans) {
      h.texte_integral.hebreu_sans_voyelles = expectedSans;
      modified = true;
    }
  }

  if (h.mots_alignes) {
    h.mots_alignes.forEach(m => {
      // 1. Sync hebreu_brut avec hebreu_voyelles
      const expectedBrut = removeNikkoud(m.hebreu_voyelles);
      if (m.hebreu_brut !== expectedBrut) {
        m.hebreu_brut = expectedBrut;
        modified = true;
      }

      // 3. Standardisation de "את"
      if (m.hebreu_brut === 'את') {
        if (m.francais_mot !== '[préposition accusatif]' || m.expression_contexte !== 'Particule non traduisible indiquant le COD') {
          m.francais_mot = '[préposition accusatif]';
          m.expression_contexte = 'Particule non traduisible indiquant le COD';
          modified = true;
        }
      }
    });
  }

  // 2. Corrections manuelles
  if (h.seif === '1' || h.seif === '1.') { // au cas où seif="1" ou "1."
    const w38 = h.mots_alignes.find(m => m.id === 38);
    if (w38 && w38.francais_mot === "et d'habiller") {
      w38.francais_mot = 'et de mettre';
      modified = true;
    }
  }

  if (h.seif === '5' || h.seif === '5.') {
    const w42 = h.mots_alignes.find(m => m.id === 42);
    if (w42 && w42.francais_mot === "est l'honneur de") {
      w42.francais_mot = "est l'honneur";
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
