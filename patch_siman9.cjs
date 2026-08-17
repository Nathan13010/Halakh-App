const fs = require('fs');
const file = 'public/data/הלכות אבלות דיני אבלות/siman_9.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

// Seif 5
const seif5 = data.halakhot.find(h => h.seif === '5');
if (seif5) {
  const mot22 = seif5.mots_alignes.find(m => m.id === 22);
  const mot23 = seif5.mots_alignes.find(m => m.id === 23);
  if (mot22) mot22.francais_mot = "n'";
  if (mot23) mot23.francais_mot = 'est pas quitte';
}

// Seif 14
const seif14 = data.halakhot.find(h => h.seif === '14');
if (seif14) {
  const mot64 = seif14.mots_alignes.find(m => m.id === 64);
  const mot65 = seif14.mots_alignes.find(m => m.id === 65);
  const mot80 = seif14.mots_alignes.find(m => m.id === 80);
  if (mot64) mot64.francais_mot = 'après';
  if (mot65) mot65.francais_mot = 'que déjà';
  if (mot80) mot80.francais_mot = 'au départ de';
}

// Seif 16
const seif16 = data.halakhot.find(h => h.seif === '16');
if (seif16) {
  const mot15 = seif16.mots_alignes.find(m => m.id === 15);
  const mot16 = seif16.mots_alignes.find(m => m.id === 16);
  if (mot15) mot15.francais_mot = '[les]';
  if (mot16) mot16.francais_mot = 'toutes.';
}

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log('Fichier patché avec succès !');
