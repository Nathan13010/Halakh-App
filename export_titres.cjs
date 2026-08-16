const fs = require('fs');
const path = require('path');

const dossierBrut = path.join(__dirname, 'brut');
const fichierExport = path.join(__dirname, 'inventaire_titres.txt');

function exporterTitres() {
    try {
        console.log("Lecture du dossier brut en cours...");

        // Lire tous les fichiers du dossier brut
        const fichiers = fs.readdirSync(dossierBrut);
        let contenuExport = "--- INVENTAIRE DES TITRES ---\n\n";

        // Pour garder un ordre propre
        fichiers.sort();

        let compteur = 0;

        for (const fichier of fichiers) {
            if (fichier.endsWith('.json')) {
                const cheminFichier = path.join(dossierBrut, fichier);
                const donnees = fs.readFileSync(cheminFichier, 'utf8');
                const json = JSON.parse(donnees);

                // On prépare la ligne à écrire dans le fichier texte
                contenuExport += `ID: ${String(json.id_unique).padStart(4, '0')} | Fichier: ${fichier} | Titre: ${json.titre}\n`;
                compteur++;
            }
        }

        // Sauvegarder dans un fichier texte
        fs.writeFileSync(fichierExport, contenuExport, 'utf8');
        console.log(`\n[SUCCÈS] ${compteur} titres ont été exportés dans le fichier : inventaire_titres.txt`);

    } catch (erreur) {
        console.error("[ERREUR] Problème lors de l'exportation :", erreur.message);
    }
}

exporterTitres();