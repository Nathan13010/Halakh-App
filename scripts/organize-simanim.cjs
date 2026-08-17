const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../public/data');

const categoryMap = {
  'siman_1.json': 'הלכות הנהגת אדם בבוקר',
  'siman_2.json': 'הלכות הנהגת אדם בבוקר',
  'siman_3.json': 'הלכות הנהגת אדם בבוקר',
  'siman_4.json': 'הלכות הנהגת אדם בבוקר',
  'siman_5.json': 'הלכות הנהגת אדם בבוקר',
  'siman_6.json': 'הלכות הנהגת אדם בבוקר',
  'siman_7.json': 'הלכות הנהגת אדם בבוקר',
  'siman_8.json': 'הלכות ציצית',
  'siman_109.json': 'הלכות תפילה',
  'siman_318.json': 'הלכות שבת'
};

function organize() {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  let moved = 0;

  files.forEach(file => {
    const targetFolder = categoryMap[file];
    if (targetFolder) {
      const folderPath = path.join(DATA_DIR, targetFolder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      const sourcePath = path.join(DATA_DIR, file);
      const destPath = path.join(folderPath, file);

      fs.renameSync(sourcePath, destPath);
      console.log(`✅ Déplacé: ${file} ➔ ${targetFolder}/`);
      moved++;
    }
  });

  console.log(`\n🎉 Terminé ! ${moved} fichier(s) déplacé(s).`);
}

organize();
