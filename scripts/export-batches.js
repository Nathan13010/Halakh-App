import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

function exportBatches() {
  const args = process.argv.slice(2);
  let inputFile = null;
  let batchSize = 5;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input' && args[i + 1]) {
      inputFile = path.resolve(args[++i]);
    } else if (args[i] === '--batch' && args[i + 1]) {
      batchSize = parseInt(args[++i], 10);
    }
  }

  if (!inputFile || !fs.existsSync(inputFile)) {
    console.error("❌ ERREUR: Fichier d'entrée manquant ou invalide. Utilisation: node scripts/export-batches.js --input <chemin> [--batch <taille>]");
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  const halakhot = data.halakhot || [];
  
  if (halakhot.length === 0) {
    console.log("⚠️ Le fichier ne contient aucun seif.");
    return;
  }

  const outputDir = path.dirname(inputFile);
  const baseName = path.basename(inputFile, '.json');
  const outputFile = path.join(outputDir, `${baseName}_export.txt`);
  
  let content = `EXPORT DE ${baseName}\n========================\n\n`;
  
  for (let i = 0; i < halakhot.length; i += batchSize) {
    const batch = halakhot.slice(i, i + batchSize);
    
    content += `\n\n--- LOT DE SEIFIM ${batch[0].seif} à ${batch[batch.length-1].seif} ---\n\n`;
    
    for (const h of batch) {
      content += `SEIF ${h.seif}\n`;
      content += `TITRE: ${h.titre_seif || ''}\n`;
      content += `HEBREU: ${h.texte_integral?.hebreu_avec_voyelles || h.texte_integral?.hebreu_sans_voyelles || ''}\n`;
      content += `FRANCAIS: ${h.texte_integral?.francais || ''}\n`;
      content += `\n`;
    }
  }

  fs.writeFileSync(outputFile, content, 'utf8');
  console.log(`✅ Export terminé ! Les lots ont été générés dans : ${outputFile}`);
}

exportBatches();
