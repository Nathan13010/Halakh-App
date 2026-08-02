const fs = require('fs');
const file = 'public/data/siman_1.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const s58 = data.halakhot.find(h => h.seif === '58');
if (s58) {
  const m42 = s58.mots_alignes.find(m => m.id === 42);
  if (m42) {
    m42.francais_mot = "qui (est) sur";
    m42.expression_contexte = "קריאת שמע שעל המטה = Le Chéma du coucher";
  }

  const m43 = s58.mots_alignes.find(m => m.id === 43);
  if (m43) {
    m43.francais_mot = "le lit,";
    m43.expression_contexte = "קריאת שמע שעל המטה = Le Chéma du coucher";
  }
}

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log("Seif 58 patché.");
