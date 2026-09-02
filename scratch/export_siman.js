import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Récupérer les arguments passés à la commande
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error("Erreur : Veuillez spécifier le chemin du fichier JSON depuis le dossier public/data/.");
  console.error("Exemple d'utilisation :");
  console.error("node export_siman.js \"הלכות הנהגת אדם בבוקר/siman_1.json\"");
  process.exit(1);
}

const relativePath = args[0];

// Déterminer les chemins
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const basePath = path.join(__dirname, '..', 'public', 'data');
const inputPath = path.join(basePath, relativePath);

if (!fs.existsSync(inputPath)) {
  console.error(`Erreur : Le fichier n'existe pas à l'emplacement : ${inputPath}`);
  process.exit(1);
}

// Extraire le nom du fichier pour le fichier de sortie
const baseFileName = path.basename(relativePath, '.json');
const outputPath = `C:\\Users\\natha\\Downloads\\export_${baseFileName}.txt`;

try {
  // Lire et parser le fichier JSON
  const rawData = fs.readFileSync(inputPath, 'utf8');
  const jsonData = JSON.parse(rawData);

  if (!jsonData.halakhot || !Array.isArray(jsonData.halakhot)) {
    console.error("Erreur : Le fichier JSON ne contient pas de tableau 'halakhot' valide.");
    process.exit(1);
  }

  let outputText = `=== Export: ${baseFileName} ===\n\n`;

  // Parcourir chaque Halakha et extraire l'hébreu avec voyelles + le français
  jsonData.halakhot.forEach((halakha) => {
    const seif = halakha.seif || "?";
    const titre = halakha.titre_seif || halakha.sujet_fr || "Sans titre";
    
    outputText += `--- Paragraphe ${seif} : ${titre} ---\n\n`;
    
    if (halakha.texte_integral) {
      if (halakha.texte_integral.hebreu_avec_voyelles) {
        outputText += `${halakha.texte_integral.hebreu_avec_voyelles}\n\n`;
      }
      if (halakha.texte_integral.francais) {
        outputText += `${halakha.texte_integral.francais}\n\n`;
      }
    } else {
      outputText += `(Texte intégral manquant)\n\n`;
    }
  });

  // Écrire le fichier texte
  fs.writeFileSync(outputPath, outputText, 'utf8');
  console.log(`✅ Succès ! L'export a été généré ici : ${outputPath}`);

} catch (error) {
  console.error("Une erreur est survenue lors du traitement du fichier :", error.message);
}
