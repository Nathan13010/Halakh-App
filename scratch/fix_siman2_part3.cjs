const fs = require('fs');
const file = 'public/data/siman_2.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
let modified = false;

data.halakhot.forEach(h => {
  const seifNum = parseInt(h.seif);

  // 1. Seif 10 : Séparer "תחלה.[שם"
  if (seifNum === 10) {
    const idx41 = h.mots_alignes.findIndex(m => m.id === 41);
    if (idx41 !== -1) {
      const w41 = h.mots_alignes[idx41];
      if (w41.hebreu_brut && (w41.hebreu_brut.includes('תחלה.[שם') || w41.hebreu_brut.includes('תחילה.[שם'))) {
        const hbrut = w41.hebreu_brut.replace('[שם', '');
        const hvoy = w41.hebreu_voyelles.replace('[שָּׁם', '').replace('[שָׁם', '');

        const newW41 = {
          id: 41,
          hebreu_brut: hbrut,
          hebreu_voyelles: hvoy || 'תְּחִלָּה.',
          francais_mot: 'en premier.',
          expression_contexte: w41.expression_contexte || ''
        };
        const newW42 = {
          id: 42,
          hebreu_brut: '[שם',
          hebreu_voyelles: '[שָּׁם',
          francais_mot: '[Ibid.',
          expression_contexte: ''
        };

        h.mots_alignes.splice(idx41, 1, newW41, newW42);
        
        // Décaler les IDs suivants
        for (let i = idx41 + 2; i < h.mots_alignes.length; i++) {
          h.mots_alignes[i].id = i;
        }

        if (h.texte_integral) {
          if (h.texte_integral.hebreu_sans_voyelles) {
            h.texte_integral.hebreu_sans_voyelles = h.texte_integral.hebreu_sans_voyelles.replace('תחלה.[שם', 'תחלה. [שם').replace('תחילה.[שם', 'תחילה. [שם');
          }
          if (h.texte_integral.hebreu_avec_voyelles) {
            h.texte_integral.hebreu_avec_voyelles = h.texte_integral.hebreu_avec_voyelles.replace('תְּחִלָּה.[שָּׁם', 'תְּחִלָּה. [שָּׁם');
          }
          if (h.texte_integral.francais) {
            h.texte_integral.francais = h.texte_integral.francais.replace('en premier.[Ibid', 'en premier. [Ibid').replace('en premier. [Ibid', 'en premier. [Ibid');
          }
        }
        modified = true;
      }
    }
  }

  // 2. Seif 9 : Corriger וי en וי"א
  if (seifNum === 9) {
    const w23 = h.mots_alignes.find(m => m.id === 23);
    if (w23 && (w23.hebreu_brut === 'וי' || w23.hebreu_brut === 'וְי')) {
      w23.hebreu_brut = 'וי"א';
      w23.hebreu_voyelles = 'וְי"א';
      
      if (h.texte_integral) {
        if (h.texte_integral.hebreu_sans_voyelles) {
          h.texte_integral.hebreu_sans_voyelles = h.texte_integral.hebreu_sans_voyelles.replace('וי שגם', 'וי"א שגם');
        }
        if (h.texte_integral.hebreu_avec_voyelles) {
          h.texte_integral.hebreu_avec_voyelles = h.texte_integral.hebreu_avec_voyelles.replace('וְי שֶׁגַּם', 'וְי"א שֶׁגַּם').replace('וְיֵ שֶׁגַּם', 'וְי"א שֶׁגַּם');
        }
      }
      modified = true;
    }
  }

  // 3. Seif 7 : Corriger שמואל en שמאל et disants en disent
  if (seifNum === 7) {
    const w22 = h.mots_alignes.find(m => m.id === 22);
    if (w22 && w22.hebreu_brut.includes('שמואל')) {
      w22.hebreu_brut = w22.hebreu_brut.replace('שמואל', 'שמאל');
      w22.hebreu_voyelles = 'שְׂמֹאל.';
      modified = true;
    }
    const w30 = h.mots_alignes.find(m => m.id === 30);
    if (w30 && w30.hebreu_brut.includes('שמואל')) {
      w30.hebreu_brut = w30.hebreu_brut.replace('שמואל', 'שמאל');
      w30.hebreu_voyelles = 'שְׂמֹאל';
      modified = true;
    }
    
    if (h.texte_integral) {
      if (h.texte_integral.hebreu_sans_voyelles) {
        h.texte_integral.hebreu_sans_voyelles = h.texte_integral.hebreu_sans_voyelles.replace(/שמואל/g, 'שמאל');
      }
      if (h.texte_integral.hebreu_avec_voyelles) {
        h.texte_integral.hebreu_avec_voyelles = h.texte_integral.hebreu_avec_voyelles.replace(/שְׁמוּאֵל/g, 'שְׂמֹאל').replace(/שְּׁמוּאֵל/g, 'שְׂמֹאל');
      }
    }

    const w26 = h.mots_alignes.find(m => m.id === 26);
    if (w26 && w26.francais_mot === 'disants') {
      w26.francais_mot = 'disent';
      modified = true;
    }
    const w34 = h.mots_alignes.find(m => m.id === 34);
    if (w34 && w34.francais_mot === 'disants') {
      w34.francais_mot = 'disent';
      modified = true;
    }
  }

  // 4. Seif 6 : Nettoyer dicen
  if (seifNum === 6) {
    const w39 = h.mots_alignes.find(m => m.id === 39);
    if (w39 && w39.expression_contexte && w39.expression_contexte.includes('dicen')) {
      w39.expression_contexte = 'וְיֵשׁ אוֹמְרִים = Certains disent';
      modified = true;
    }
  }

  // 5. Harmonisation de la particule "את" partout
  if (h.mots_alignes) {
    h.mots_alignes.forEach(m => {
      if (m.hebreu_brut === 'את' || m.hebreu_brut === 'אֶת') { // Just in case it has nikkoud
        if (m.francais_mot !== '(marqueur du COD)') {
          m.francais_mot = '(marqueur du COD)';
          if (m.expression_contexte === 'Particule non traduisible indiquant le COD') {
             m.expression_contexte = ''; // On vide car '(marqueur du COD)' se suffit à lui-même
          }
          modified = true;
        }
      }
    });
  }
});

if (modified) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log('Fichier siman_2.json mis à jour avec succès (Seif 6, 7, 9, 10, etc.) !');
} else {
  console.log('Aucune modification apportée.');
}
