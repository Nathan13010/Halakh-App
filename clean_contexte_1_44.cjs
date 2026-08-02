const fs = require('fs');
const file = 'public/data/siman_1.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

let motsNettoyes = 0;

data.halakhot.forEach(seif => {
  // On ne nettoie que les Seifim de 1 à 44
  if (parseInt(seif.seif) <= 44) {
    seif.mots_alignes.forEach(mot => {
      // Si le champ expression_contexte n'est pas vide, on le vide
      if (mot.expression_contexte && mot.expression_contexte.trim() !== "") {
        mot.expression_contexte = "";
        motsNettoyes++;
      }
    });
  }
});

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log(`Nettoyage terminé ! ${motsNettoyes} champs 'expression_contexte' ont été vidés pour les Seifim 1 à 44.`);
