const fs = require('fs');
const path = require('path');

// Analyser les arguments de ligne de commande
const args = process.argv.slice(2);
let siman = 1;
let minSeif = null;
let maxSeif = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--siman' && args[i+1]) {
    siman = parseInt(args[i+1]);
    i++;
  } else if (args[i] === '--seif' && args[i+1]) {
    minSeif = parseInt(args[i+1]);
    maxSeif = parseInt(args[i+1]); // Le min et le max sont identiques
    i++;
  } else if (args[i] === '--seifs' && args[i+1]) {
    const parts = args[i+1].split('-');
    minSeif = parseInt(parts[0]);
    maxSeif = parseInt(parts[1]);
    i++;
  }
}

// Vérification de la validité des arguments
if (!minSeif || !maxSeif) {
  console.log("💡 Utilisation :");
  console.log("Plage de seifim : node export_seif.cjs --siman 1 --seifs 1-10");
  console.log("Un seul seif    : node export_seif.cjs --siman 1 --seif 5");
  process.exit(1);
}

const inputFile = `public/data/siman_${siman}.json`;

if (!fs.existsSync(inputFile)) {
  console.error(`❌ Erreur : Le fichier ${inputFile} n'existe pas.`);
  process.exit(1);
}

// Dossier des téléchargements de Windows
const downloadsDir = 'C:\\Users\\natha\\Downloads';
let fileName = `siman_${siman}_seif_${minSeif}`;
if (minSeif !== maxSeif) {
  fileName += `_to_${maxSeif}`;
}
fileName += '.txt';

const outputFile = path.join(downloadsDir, fileName);

console.log(`Extraction ${minSeif === maxSeif ? 'du Seif' : 'des Seifim'} ${minSeif}${minSeif !== maxSeif ? ' à ' + maxSeif : ''} du Siman ${siman}...`);

try {
  const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  
  // Filtrer les halakhot
  const seifsToExport = data.halakhot.filter(h => {
    const seifNum = parseInt(h.seif);
    return seifNum >= minSeif && seifNum <= maxSeif;
  });

  if (seifsToExport.length === 0) {
    console.log("❌ Aucun Seif trouvé avec ce(s) numéro(s).");
    process.exit(1);
  }

  // Écriture du fichier
  const exportText = JSON.stringify(seifsToExport, null, 2);
  fs.writeFileSync(outputFile, exportText);
  
  console.log(`✅ Succès ! Fichier généré dans tes Téléchargements :`);
  console.log(`📂 ${outputFile}`);
} catch (error) {
  console.error("❌ Erreur lors de l'extraction :", error);
}
