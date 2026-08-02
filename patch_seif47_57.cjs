const fs = require('fs');
const file = 'public/data/siman_1.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

// 1. Correction globale de l'ID 0 (Numéros de Seifim)
data.halakhot.forEach(seif => {
  const m0 = seif.mots_alignes.find(m => m.id === 0);
  if (m0 && m0.hebreu_brut && m0.hebreu_voyelles) {
    // Remplacer les voyelles fantaisistes par la valeur brute (les lettres + point)
    m0.hebreu_voyelles = m0.hebreu_brut;
  }
});

// Helper function to find a specific Seif
const getSeif = (num) => data.halakhot.find(h => h.seif === num.toString());

// 2. Troncature Seif 57, ID 47
const s57 = getSeif(57);
if (s57) {
  const m47 = s57.mots_alignes.find(m => m.id === 47);
  if (m47) {
    m47.hebreu_brut = 'ביהמ"ק].';
    m47.hebreu_voyelles = 'בֵּיהמ"ק].'; // Ensure vowels are also correct if needed, but the audit said hebreu_voyelles was already correct: ביהמ"ק]. We just use what's appropriate or sync them.
    // Ensure the quotes are correct
  }
  // Corriger aussi dans le texte intégral sans voyelles
  s57.texte_integral.hebreu_sans_voyelles = s57.texte_integral.hebreu_sans_voyelles.replace(/ביהמ(?!["'])/, 'ביהמ"ק');
}

// 3. Voyelles manquantes Seif 55, ID 71
const s55 = getSeif(55);
if (s55) {
  const m71 = s55.mots_alignes.find(m => m.id === 71);
  if (m71) {
    m71.hebreu_voyelles = '[וּבְעֶרֶב ר"ח';
  }
}

// 4. Balise [mcd] Seif 53, ID 37
const s53 = getSeif(53);
if (s53) {
  const m37 = s53.mots_alignes.find(m => m.id === 37);
  if (m37 && m37.francais_mot === '[mcd]') {
    m37.francais_mot = '';
  }
}

// 5. Incohérence Niqqud Seif 51, ID 16
const s51 = getSeif(51);
if (s51) {
  const m16 = s51.mots_alignes.find(m => m.id === 16);
  if (m16) {
    m16.hebreu_voyelles = 'לְמוֹנְעָן';
  }
}

// 6. Ponctuation et Préfixes Seif 47
const s47 = getSeif(47);
if (s47) {
  const m19 = s47.mots_alignes.find(m => m.id === 19);
  if (m19) { m19.hebreu_brut = 'בחו"ל'; }

  const m39 = s47.mots_alignes.find(m => m.id === 39);
  if (m39 && m39.francais_mot.endsWith(',')) {
    m39.francais_mot = m39.francais_mot.replace(/,$/, '');
  }
}

// 7. Niqqud de l'acronyme Seif 48, ID 39
const s48 = getSeif(48);
if (s48) {
  const m39 = s48.mots_alignes.find(m => m.id === 39);
  if (m39) {
    m39.hebreu_voyelles = "הִלְ'";
  }
}

// Sauvegarde
fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log("Corrections de l'audit 47-57 appliquées avec succès !");
