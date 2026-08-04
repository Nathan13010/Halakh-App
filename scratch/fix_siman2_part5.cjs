const fs = require('fs');
const file = 'public/data/siman_2.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
let modified = false;

data.halakhot.forEach(h => {
  const seifNum = parseInt(h.seif);

  // Seif 19
  if (seifNum === 19) {
    const w19 = h.mots_alignes.find(m => m.id === 19);
    const w20 = h.mots_alignes.find(m => m.id === 20);
    if (w19 && w19.hebreu_brut.includes('בכיסוי') && w20 && w20.hebreu_brut.includes('ראש')) {
      w19.francais_mot = "d'une couverture";
      w19.expression_contexte = "בכיסוי ראש = d'un couvre-chef";
      
      // Preserve punctuation if it was there, user said "de tête." so we just use that directly
      w20.francais_mot = "de tête.";
      w20.expression_contexte = "בכיסוי ראש = d'un couvre-chef";
      modified = true;
    }
  }

  // Seif 16
  if (seifNum === 16) {
    const w13 = h.mots_alignes.find(m => m.id === 13);
    const w14 = h.mots_alignes.find(m => m.id === 14);
    if (w13 && w13.hebreu_brut.includes('ומכל') && w14 && w14.hebreu_brut.includes('מקום')) {
      w13.francais_mot = "Et de tout";
      w13.expression_contexte = "ומכל מקום = Néanmoins / Toutefois";
      
      // The original was "néanmoins," - let's preserve the comma if it's in the text
      w14.francais_mot = w14.hebreu_brut.includes(',') ? "lieu," : "lieu";
      w14.expression_contexte = "ומכל מקום = Néanmoins / Toutefois";
      modified = true;
    }
  }

  // Seif 20
  if (seifNum === 20) {
    const w23 = h.mots_alignes.find(m => m.id === 23);
    if (w23 && w23.hebreu_brut.includes('ידי')) {
      w23.expression_contexte = "על ידי = par / au moyen de";
      modified = true;
    }
  }
});

if (modified) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log('Fichier siman_2.json mis à jour avec succès (Seif 16, 19, 20) !');
} else {
  console.log('Aucune modification apportée.');
}
