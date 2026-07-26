import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const files = [
  path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', 'siman_1.json'),
  path.join(ROOT, 'public', 'data', 'siman_1.json'),
  path.join(ROOT, 'public', 'data', 'yalkout-1.json')
];

files.forEach(fp => {
  if (fs.existsSync(fp)) {
    const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
    const seif1 = data.halakhot.find(h => h.seif === '1' || h.seif === 'א');
    if (seif1) {
      // Fix item 0 if it was merged with 'שנינו'
      if (seif1.mots_alignes[0] && seif1.mots_alignes[0].hebreu_brut === 'שנינו') {
        // Reset item 0's translation to "Il est enseigné"
        seif1.mots_alignes[0].francais_mot = "Il est enseigné";
        seif1.mots_alignes[0].expression_contexte = "שנינו במסכת";
        seif1.mots_alignes[0].hebreu_voyelles = "שָׁנִינוּ";

        // Insert separate "א." item at index 0
        seif1.mots_alignes.unshift({
          id: 0,
          hebreu_brut: 'א.',
          hebreu_voyelles: 'א.',
          francais_mot: '1.',
          expression_contexte: 'Numéro du paragraphe'
        });
      }

      // Re-index all IDs sequentially (0, 1, 2, 3...)
      seif1.mots_alignes.forEach((m, idx) => { m.id = idx; });

      // Ensure texte_integral starts with "א." for 1-to-1 match
      if (!seif1.texte_integral.hebreu_sans_voyelles.startsWith('א.')) {
        seif1.texte_integral.hebreu_sans_voyelles = 'א. ' + seif1.texte_integral.hebreu_sans_voyelles;
      }
      if (!seif1.texte_integral.hebreu_avec_voyelles.startsWith('א.')) {
        seif1.texte_integral.hebreu_avec_voyelles = 'א. ' + seif1.texte_integral.hebreu_avec_voyelles;
      }

      fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf8');
      console.log('✅ Elément 0 ("א.") séparé et réindexé avec succès dans', path.basename(fp));
    }
  }
});
