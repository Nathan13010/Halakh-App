const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public/data/הלכות ציצית/siman_9.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const seif7 = data.halakhot.find(h => h.seif === '7');
if (!seif7.texte_integral.francais.includes("Yalkout Yossef")) {
  seif7.texte_integral.francais += " [Yalkout Yossef sur les lois de Tsitsit p. 168, et éd. 5766 p. 119 ; Che'erit Yossef vol. 1 p. 176].";
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log('✅ Seif 7 corrigé avec succès !');
} else {
  console.log('Déjà corrigé.');
}
