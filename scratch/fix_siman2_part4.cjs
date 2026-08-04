const fs = require('fs');
const file = 'public/data/siman_2.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
let modified = false;

data.halakhot.forEach(h => {
  const seifNum = parseInt(h.seif);

  // Seif 11
  if (seifNum === 11) {
    const w48 = h.mots_alignes.find(m => m.id === 48);
    if (w48 && w48.hebreu_brut.includes('יש')) {
      if (w48.francais_mot !== 'il y a') {
        w48.francais_mot = 'il y a';
        modified = true;
      }
    }
    const w49 = h.mots_alignes.find(m => m.id === 49);
    if (w49 && w49.hebreu_brut.includes('לחוש')) {
      if (w49.francais_mot !== 'lieu de craindre') {
        w49.francais_mot = 'lieu de craindre';
        modified = true;
      }
    }
  }

  // Seif 13
  if (seifNum === 13) {
    const w63 = h.mots_alignes.find(m => m.id === 63);
    if (w63 && (w63.hebreu_brut === 'תשס' || w63.hebreu_brut.includes('תשס'))) {
      if (w63.hebreu_brut !== 'תשס"ד,') {
        w63.hebreu_brut = 'תשס"ד,';
        modified = true;
      }
    }
    
    if (h.texte_integral && h.texte_integral.hebreu_sans_voyelles) {
      if (h.texte_integral.hebreu_sans_voyelles.includes('תשס עמוד')) {
        h.texte_integral.hebreu_sans_voyelles = h.texte_integral.hebreu_sans_voyelles.replace('תשס עמוד', 'תשס"ד, עמוד');
        modified = true;
      }
    }
  }

  // Seif 14
  if (seifNum === 14) {
    const w45 = h.mots_alignes.find(m => m.id === 45);
    if (w45 && w45.hebreu_brut.includes('ומכל')) {
      if (w45.francais_mot !== 'et de tout') {
        w45.francais_mot = 'et de tout';
        modified = true;
      }
    }
    const w46 = h.mots_alignes.find(m => m.id === 46);
    if (w46 && w46.hebreu_brut.includes('מקום')) {
      if (w46.francais_mot !== 'lieu') {
        w46.francais_mot = 'lieu';
        modified = true;
      }
    }
    const w51 = h.mots_alignes.find(m => m.id === 51);
    if (w51 && w51.hebreu_brut.includes('מדאי')) {
      if (w51.francais_mot !== 'nécessaire') {
        w51.francais_mot = 'nécessaire';
        modified = true;
      }
    }
    const w66 = h.mots_alignes.find(m => m.id === 66);
    if (w66 && w66.hebreu_brut.includes('מדאי')) {
      if (w66.francais_mot !== 'nécessaire') {
        w66.francais_mot = 'nécessaire';
        modified = true;
      }
    }
  }

  // Seif 15
  if (seifNum === 15) {
    const w1 = h.mots_alignes.find(m => m.id === 1);
    if (w1 && w1.hebreu_brut.includes('אין')) {
      if (w1.francais_mot !== 'il ne faut pas') {
        w1.francais_mot = 'il ne faut pas';
        modified = true;
      }
    }
    const w141 = h.mots_alignes.find(m => m.id === 141);
    if (w141 && w141.hebreu_brut.includes('שכן')) {
      if (w141.francais_mot !== 'que oui') {
        w141.francais_mot = 'que oui';
        modified = true;
      }
    }
    const w160 = h.mots_alignes.find(m => m.id === 160);
    if (w160 && w160.hebreu_brut.includes('השכמת')) {
      if (w160.francais_mot !== 'le lever de') {
        w160.francais_mot = 'le lever de';
        modified = true;
      }
    }
    const w161 = h.mots_alignes.find(m => m.id === 161);
    if (w161 && w161.hebreu_brut.includes('הבוקר')) {
      if (w161.francais_mot !== 'le matin') {
        w161.francais_mot = 'le matin';
        modified = true;
      }
    }
  }
});

if (modified) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log('Fichier siman_2.json mis à jour avec succès (Seif 11, 13, 14, 15) !');
} else {
  console.log('Aucune modification apportée.');
}
