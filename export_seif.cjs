const fs = require('fs');
const path = require('path');

// Analyser les arguments de ligne de commande
const args = process.argv.slice(2);
let siman = 1;
let minSeif = null;
let maxSeif = null;
let exportAll = false;
let batchSize = 5;

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
  } else if (args[i] === '--all') {
    exportAll = true;
  } else if (args[i].match(/^--\d+$/)) {
    batchSize = parseInt(args[i].substring(2));
  }
}

// Vérification de la validité des arguments
if (!exportAll && (!minSeif || !maxSeif)) {
  console.log("💡 Utilisation :");
  console.log("Plage de seifim : node export_seif.cjs --siman 1 --seifs 1-10");
  console.log("Un seul seif    : node export_seif.cjs --siman 1 --seif 5");
  console.log("Tout par lots   : node export_seif.cjs --siman 2 --all --5");
  process.exit(1);
}

let inputFile = null;
const dataDir = path.join(__dirname, 'public', 'data');
if (fs.existsSync(dataDir)) {
  const folders = fs.readdirSync(dataDir).filter(f => fs.statSync(path.join(dataDir, f)).isDirectory());
  for (const folder of folders) {
    const p = path.join(dataDir, folder, `siman_${siman}.json`);
    if (fs.existsSync(p)) {
      inputFile = p;
      break;
    }
  }
}
if (!inputFile) inputFile = `public/data/siman_${siman}.json`;

if (!fs.existsSync(inputFile)) {
  console.error(`❌ Erreur : Le fichier ${inputFile} n'existe pas.`);
  process.exit(1);
}

// Dossier des téléchargements de Windows
const downloadsDir = 'C:\\Users\\natha\\Downloads';

try {
  const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  const halakhot = data.halakhot || [];
  
  if (halakhot.length === 0) {
    console.log("❌ Aucun Seif trouvé dans ce fichier.");
    process.exit(1);
  }

  if (exportAll) {
    console.log(`Extraction de tous les seifim du Siman ${siman} par lots de ${batchSize}...`);
    // Trier par seifNum
    halakhot.sort((a, b) => parseInt(a.seif) - parseInt(b.seif));
    
    let generatedFiles = 0;
    
    for (let i = 0; i < halakhot.length;) {
      let chunk;
      // Regrouper le dernier lot s'il ne reste pas beaucoup d'éléments (ex: 6 pour des lots de 5)
      if (halakhot.length - i <= batchSize + Math.ceil(batchSize * 0.2)) {
        chunk = halakhot.slice(i);
        i = halakhot.length;
      } else {
        chunk = halakhot.slice(i, i + batchSize);
        i += batchSize;
      }
      const startSeif = chunk[0].seif;
      const endSeif = chunk[chunk.length - 1].seif;
      
      let fileName = `siman_${siman}_seif_${startSeif}`;
      if (startSeif !== endSeif) {
        fileName += `_to_${endSeif}`;
      }
      fileName += '.txt';
      const outputFile = path.join(downloadsDir, fileName);
      
      fs.writeFileSync(outputFile, JSON.stringify(chunk, null, 2));
      console.log(`✅ Créé : ${outputFile}`);
      generatedFiles++;
    }
    
    console.log(`\n🎉 Succès ! ${generatedFiles} fichiers ont été générés dans tes Téléchargements.`);
  } else {
    console.log(`Extraction ${minSeif === maxSeif ? 'du Seif' : 'des Seifim'} ${minSeif}${minSeif !== maxSeif ? ' à ' + maxSeif : ''} du Siman ${siman}...`);
    
    // Filtrer les halakhot
    const seifsToExport = halakhot.filter(h => {
      const seifNum = parseInt(h.seif);
      return seifNum >= minSeif && seifNum <= maxSeif;
    });

    if (seifsToExport.length === 0) {
      console.log("❌ Aucun Seif trouvé avec ce(s) numéro(s).");
      process.exit(1);
    }

    // Écriture du fichier
    let fileName = `siman_${siman}_seif_${minSeif}`;
    if (minSeif !== maxSeif) {
      fileName += `_to_${maxSeif}`;
    }
    fileName += '.txt';
    
    const outputFile = path.join(downloadsDir, fileName);
    fs.writeFileSync(outputFile, JSON.stringify(seifsToExport, null, 2));
    
    console.log(`✅ Succès ! Fichier généré dans tes Téléchargements :`);
    console.log(`📂 ${outputFile}`);
  }
} catch (error) {
  console.error("❌ Erreur lors de l'extraction :", error);
}
