import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const findFiles = (dir) => {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(fullPath));
    } else if (file.endsWith('.json')) {
      results.push(fullPath);
    }
  });
  return results;
};

const jsonFiles = findFiles(path.join(ROOT, 'public', 'data'));
let grandTotalFixed = 0;

jsonFiles.forEach(fp => {
  try {
    const raw = fs.readFileSync(fp, 'utf8');
    const matches = raw.match(/[\u0600-\u06FF]/g);
    if (matches) {
      console.log(`⚠️  Fichier ${path.basename(fp)} : ${matches.length} diacritiques/caractères arabes trouvés !`);
      
      // Remove Arabic Unicode characters U+0600 to U+06FF (e.g. Sukun \u0652)
      const cleanedRaw = raw.replace(/[\u0600-\u06FF]/g, '');
      fs.writeFileSync(fp, cleanedRaw, 'utf8');
      
      grandTotalFixed += matches.length;
      console.log(`  ✅ ${path.basename(fp)} nettoyé (${matches.length} supprimaés)`);
    } else {
      console.log(`✓ ${path.basename(fp)} : Aucun caractère arabe.`);
    }
  } catch (e) {
    console.error('Erreur sur', fp, e.message);
  }
});

console.log(`\n🎉 Bilan : ${grandTotalFixed} caractères arabes parasites supprimés sur l'ensemble des JSON !`);
