const fs = require('fs');
const file = "public/data/הלכות ציצית/siman_11.json";
const reportPath = "pipeline/reports/siman_11_autofix.json";

const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

let changes = 0;
for (const seifReport of report.details) {
  const seifNum = parseInt(seifReport.seif, 10);
  const halakha = data.halakhot.find(h => parseInt(h.seif, 10) === seifNum);
  
  if (!halakha) continue;

  for (const detail of seifReport.details) {
    // Detail format: Ktiv Male mot[98]: "מֻטֶּלֶת" → "מוּטֶּלֶת"
    const match = detail.match(/Ktiv Male mot\[(\d+)\]: "([^"]+)" → "([^"]+)"/);
    if (match) {
      const idx = parseInt(match[1], 10);
      const original = match[2];
      const fixed = match[3];

      if (halakha.mots_alignes[idx].hebreu_voyelles === fixed) {
        halakha.mots_alignes[idx].hebreu_voyelles = original;
        changes++;
      }
    }
  }
}

if (changes > 0) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Reverted ${changes} Ktiv Male changes in ${file}`);
} else {
  console.log('No changes needed or found.');
}
