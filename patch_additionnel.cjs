const fs = require('fs');
const file = 'public/data/siman_1.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

// Helper function to find a specific Seif
const getSeif = (num) => data.halakhot.find(h => h.seif === num.toString());

// 1. Nettoyage global de l'ID 0 dans texte_integral.hebreu_avec_voyelles
data.halakhot.forEach(seif => {
  if (seif.texte_integral && seif.texte_integral.hebreu_sans_voyelles && seif.texte_integral.hebreu_avec_voyelles) {
    const sansV = seif.texte_integral.hebreu_sans_voyelles;
    const avecV = seif.texte_integral.hebreu_avec_voyelles;
    
    // Le premier "mot" est le numéro (ex: "מח.")
    const numeroSansV = sansV.split(' ')[0];
    const motsAvecV = avecV.split(' ');
    
    if (motsAvecV.length > 0) {
      motsAvecV[0] = numeroSansV;
      seif.texte_integral.hebreu_avec_voyelles = motsAvecV.join(' ');
    }
  }
});

// 2. Seif 53, ID 20 (ותיקין)
const s53 = getSeif(53);
if (s53) {
  const m20 = s53.mots_alignes.find(m => m.id === 20);
  if (m20) {
    m20.hebreu_voyelles = 'וָתִיקִין.';
  }
  
  // 3. Seif 53, ID 37 (את)
  const m37 = s53.mots_alignes.find(m => m.id === 37);
  if (m37) {
    m37.francais_mot = '-';
  }
}

// 4. Seif 55, ID 71 (ובער"ח)
const s55 = getSeif(55);
if (s55) {
  const m71 = s55.mots_alignes.find(m => m.id === 71);
  if (m71) {
    m71.hebreu_brut = '[ובערב ר"ח';
    m71.hebreu_voyelles = '[וּבְעֶרֶב ר"ח';
  }
}

// 5. Seif 49, ID 7 & 8 (עמוד השחר)
const s49 = getSeif(49);
if (s49) {
  const m7 = s49.mots_alignes.find(m => m.id === 7);
  if (m7) {
    m7.francais_mot = 'la colonne (de)';
    m7.expression_contexte = "עַמּוּד הַשַּׁחַר = l'aube";
  }
  const m8 = s49.mots_alignes.find(m => m.id === 8);
  if (m8) {
    m8.francais_mot = "l'aurore";
    m8.expression_contexte = '';
  }
}

// Sauvegarde
fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log("Corrections additionnelles appliquées avec succès !");
