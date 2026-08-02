const fs = require('fs');
const file = 'public/data/siman_1.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const s45 = data.halakhot.find(h => h.seif === '45');
if (s45) {
  s45.sujet = 'הלכות השכמת הבוקר';
  s45.sujet_he = 'הלכות השכמת הבוקר';
  s45.sujet_fr = 'Posture pendant le Tikkoun \'Hatsot';
}
fs.writeFileSync(file, JSON.stringify(data, null, 2));
