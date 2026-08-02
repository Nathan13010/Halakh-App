const fs = require('fs');
const file = 'public/data/siman_1.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

// Trouver le Seif 46
const s46 = data.halakhot.find(h => h.seif === '46');

if (s46) {
  // 1. UPDATE DB : Catégorisation
  s46.sujet = "הלכות השכמת הבוקר";
  s46.sujet_he = "הלכות השכמת הבוקר";
  s46.sujet_fr = "Lois du lever matinal";

  // 2. CLEAN PONCTUATION (Virgules en trop)
  const idsToClean = [56, 63, 94, 96];
  idsToClean.forEach(id => {
    const mot = s46.mots_alignes.find(m => m.id === id);
    if (mot && mot.francais_mot.endsWith(',')) {
      mot.francais_mot = mot.francais_mot.slice(0, -1);
    }
  });

  // 3. MANUAL FIXES
  // Redondance ID 87 et 88
  const m87 = s46.mots_alignes.find(m => m.id === 87);
  if (m87) { m87.francais_mot = "permettre"; }
  
  const m88 = s46.mots_alignes.find(m => m.id === 88);
  if (m88) { m88.francais_mot = "lui"; }

  // Allégement ID 38 et 70
  const m38 = s46.mots_alignes.find(m => m.id === 38);
  if (m38) { 
    m38.francais_mot = "et des personnes"; 
    m38.expression_contexte = "Toutefois, des personnes";
  }

  const m70 = s46.mots_alignes.find(m => m.id === 70);
  if (m70) { 
    m70.francais_mot = "et celui"; 
    m70.expression_contexte = "De plus, celui";
  }
}

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log("Seif 46 patché avec succès !");
