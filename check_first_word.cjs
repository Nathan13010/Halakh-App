const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'data', 'siman_1.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

for (const halakha of data.halakhot) {
  if (halakha.mots_alignes && halakha.mots_alignes.length > 0) {
    const firstMot = halakha.mots_alignes[0];
    console.log(`Seif ${halakha.seif} (ID ${halakha.id}): ${firstMot.hebreu_brut} / ${firstMot.hebreu_voyelles}`);
  }
}
