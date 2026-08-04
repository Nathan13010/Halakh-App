const fs = require('fs');
const file = 'public/data/siman_2.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
let modified = false;

data.halakhot.forEach(h => {
  const seifNum = parseInt(h.seif);

  // Seif 21
  if (seifNum === 21) {
    const w19 = h.mots_alignes.find(m => m.id === 19);
    if (w19 && w19.hebreu_brut.includes('ומכל')) {
      w19.francais_mot = "et de tout";
      modified = true;
    }
    const w20 = h.mots_alignes.find(m => m.id === 20);
    if (w20 && w20.hebreu_brut.includes('מקום')) {
      w20.francais_mot = "lieu";
      w20.expression_contexte = "ומכל מקום = Néanmoins / Cependant";
      modified = true;
    }

    const w43 = h.mots_alignes.find(m => m.id === 43);
    if (w43 && w43.hebreu_brut.includes('וכל')) {
      w43.francais_mot = "et tout";
      modified = true;
    }
    const w44 = h.mots_alignes.find(m => m.id === 44);
    if (w44 && w44.hebreu_brut.includes('שכן')) {
      w44.francais_mot = "que oui";
      w44.expression_contexte = "וכל שכן = À fortiori";
      modified = true;
    }
  }

  // Seif 25
  if (seifNum === 25) {
    const w10 = h.mots_alignes.find(m => m.id === 10);
    if (w10 && w10.hebreu_brut.includes('ואף')) {
      w10.francais_mot = "et même";
      modified = true;
    }
    const w11 = h.mots_alignes.find(m => m.id === 11);
    if (w11 && w11.hebreu_brut.includes('על')) {
      w11.francais_mot = "sur";
      modified = true;
    }
    const w12 = h.mots_alignes.find(m => m.id === 12);
    if (w12 && w12.hebreu_brut.includes('פי')) {
      w12.francais_mot = "la bouche";
      modified = true;
    }

    const w76 = h.mots_alignes.find(m => m.id === 76);
    if (w76 && w76.hebreu_brut.includes('מה')) {
      w76.francais_mot = "quoi";
      modified = true;
    }
    const w77 = h.mots_alignes.find(m => m.id === 77);
    if (w77 && w77.hebreu_brut.includes('שלומך')) {
      w77.francais_mot = "ta paix,";
      modified = true;
    }

    const w80 = h.mots_alignes.find(m => m.id === 80);
    if (w80 && w80.hebreu_brut.includes('דבזמן')) {
      w80.francais_mot = "que dans le temps";
      modified = true;
    }

    const w97 = h.mots_alignes.find(m => m.id === 97);
    if (w97 && w97.hebreu_brut.includes('לכל')) {
      w97.francais_mot = "à tout";
      modified = true;
    }
  }

  // Seif 23
  if (seifNum === 23) {
    const w2 = h.mots_alignes.find(m => m.id === 2);
    if (w2 && w2.hebreu_brut.includes('שהיה')) {
      w2.expression_contexte = "";
      modified = true;
    }
  }

  // Seif 24
  if (seifNum === 24) {
    const w9 = h.mots_alignes.find(m => m.id === 9);
    if (w9 && w9.hebreu_brut.includes('ראש')) {
      w9.francais_mot = "tête,";
      modified = true;
    }
  }

  // Global Harmonization for בגילוי
  if (h.mots_alignes) {
    h.mots_alignes.forEach(m => {
      if (m.hebreu_brut && m.hebreu_brut.includes('בגילוי')) {
        let replacement = "à découvert";
        if (m.hebreu_brut.endsWith(',')) replacement += ',';
        if (m.hebreu_brut.endsWith('.')) replacement += '.';
        if (m.francais_mot !== replacement) {
          m.francais_mot = replacement;
          modified = true;
        }
      }
    });
  }

});

if (modified) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log('Fichier siman_2.json mis à jour avec succès (Seif 21, 22, 23, 24, 25) !');
} else {
  console.log('Aucune modification apportée.');
}
