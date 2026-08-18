import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPLET_DIR = path.join(__dirname, '..', 'complet');
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'search_index.json');

function buildIndex() {
  console.log('Building search index...');
  const index = [];

  if (!fs.existsSync(COMPLET_DIR)) {
    console.error(`Directory not found: ${COMPLET_DIR}`);
    return;
  }

  const categories = fs.readdirSync(COMPLET_DIR);
  
  categories.forEach(category => {
    const categoryPath = path.join(COMPLET_DIR, category);
    if (!fs.statSync(categoryPath).isDirectory()) return;

    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('_complet.json'));
    
    files.forEach(file => {
      const filePath = path.join(categoryPath, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      if (data.sous_chapitres) {
        data.sous_chapitres.forEach(chapitre => {
          if (chapitre.seifim) {
            chapitre.seifim.forEach(seif => {
              // Create a unique stable ID based on siman and seif
              const id = `yy_${data.siman}_${seif.seif_global || seif.seif_local}`;
              
              index.push({
                id: id,
                book: "Yalkout Yossef",
                siman: data.siman,
                seif: seif.seif_global || seif.seif_local,
                title: chapitre.titre_article || '',
                text: seif.hebreu_brut || '',
                category: category,
                // Extraction of basic keywords can be added here
                keywords: []
              });
            });
          }
        });
      }
    });
  });

  console.log(`Indexed ${index.length} seifim.`);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));
  console.log(`Search index saved to ${OUTPUT_FILE}`);
}

buildIndex();
