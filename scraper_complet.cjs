const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');

const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function convertirHebreuEnChiffre(hebreuStr) {
    const valeurs = {
        'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
        'י': 10, 'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 'צ': 90,
        'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400,
        'ך': 20, 'ם': 40, 'ן': 50, 'ף': 80, 'ץ': 90
    };

    let total = 0;
    const textePropre = hebreuStr.replace(/['"״׳\s]/g, '');

    for (let i = 0; i < textePropre.length; i++) {
        total += valeurs[textePropre[i]] || 0;
    }
    return total;
}

// La douchette stricte : s'arrête au mot "Seif", au tiret, ou ignore les crochets
function extraireNumerosSiman(titre) {
    let bloc = titre;

    // 1. On coupe la phrase avant le mot "Seif" ou avant un grand tiret
    if (bloc.includes('סעיף')) {
        bloc = bloc.split('סעיף')[0];
    } else if (bloc.includes(' – ')) {
        bloc = bloc.split(' – ')[0];
    } else if (bloc.includes(' - ')) {
        bloc = bloc.split(' - ')[0];
    }

    // 2. On retire les mots parasites et les crochets (ex: [רצח])
    bloc = bloc.replace('סימן', '').replace('המשך', '');
    bloc = bloc.replace(/\[.*?\]/g, '').trim();

    // 3. Gestion des plages (ex: קסג-קסד)
    if (bloc.includes('-') || bloc.includes('־')) {
        const bornes = bloc.split(/[\-־]/);
        if (bornes.length >= 2) {
            const debut = convertirHebreuEnChiffre(bornes[0].trim());
            const fin = convertirHebreuEnChiffre(bornes[1].trim());
            if (debut > 0 && fin >= debut && (fin - debut) <= 50) {
                let plage = [];
                for (let n = debut; n <= fin; n++) plage.push(n);
                return plage;
            }
        }
    }

    // 4. Gestion des listes classiques (ex: א,ג)
    const parties = bloc.split(/[,]/);
    let numeros = [];
    for (let partie of parties) {
        const num = convertirHebreuEnChiffre(partie.trim());
        if (num > 0 && !numeros.includes(num)) {
            numeros.push(num);
        }
    }
    return numeros;
}

const dossierBrut = path.join(__dirname, 'brut');
const fichierIndex = path.join(__dirname, 'index_yalkut.json');

async function genererIndex() {
    console.log("--- PHASE 1 : CARTOGRAPHIE & DÉDUPLICATION ---");
    const urlAccueil = 'https://www.yalkut.info';
    let catalogue = [];
    const urlsVues = new Set(); // Le registre anti-doublons
    let idGlobal = 1;

    try {
        const reponseAccueil = await axios.get(urlAccueil);
        const $accueil = cheerio.load(reponseAccueil.data);
        const liensCategories = [];

        $accueil('li.cat-item a').each((index, element) => {
            liensCategories.push($accueil(element).attr('href'));
        });

        console.log(`${liensCategories.length} catégories trouvées. Création du catalogue unique...`);

        for (const urlCategorie of liensCategories) {
            let pageSuivante = urlCategorie;

            while (pageSuivante) {
                try {
                    const reponseCat = await axios.get(pageSuivante);
                    const $ = cheerio.load(reponseCat.data);

                    let nomCategorie = $('h1.archive-title span').last().text().trim();
                    if (!nomCategorie) nomCategorie = "Categorie_Inconnue";
                    nomCategorie = nomCategorie.replace(/[/\\?%*:|"<>]/g, '-');

                    $('article.post').each((index, element) => {
                        const titre = $(element).find('.entry-title').text().trim();
                        const lien = $(element).find('.entry-title a').attr('href');

                        if (titre.includes('סימן') && lien) {
                            // Si l'URL a déjà été enregistrée via une autre catégorie, on l'ignore
                            if (urlsVues.has(lien)) {
                                return;
                            }
                            urlsVues.add(lien);

                            const numeros = extraireNumerosSiman(titre);

                            catalogue.push({
                                id_unique: idGlobal++,
                                categorie: nomCategorie,
                                numeros: numeros.length > 0 ? numeros : [0],
                                titre: titre,
                                url: lien
                            });
                        }
                    });

                    const lienSuivant = $('a.next.page-numbers').attr('href');
                    pageSuivante = lienSuivant ? lienSuivant : null;
                    await pause(1500);

                } catch (err) {
                    console.error(`Erreur sur la catégorie ${pageSuivante}: ${err.message}`);
                    pageSuivante = null;
                }
            }
        }

        await fs.writeFile(fichierIndex, JSON.stringify(catalogue, null, 2), 'utf8');
        console.log(`\nCatalogue unique nettoyé : ${catalogue.length} articles uniques répertoriés.\n`);
        return catalogue;

    } catch (err) {
        console.error(`Erreur critique Phase 1 : ${err.message}`);
        return null;
    }
}

async function telechargerSimanim(catalogue) {
    console.log("--- PHASE 2 : EXTRACTION DU TEXTE ---");
    await fs.mkdir(dossierBrut, { recursive: true });

    for (const chapitre of catalogue) {
        const nomNumeros = chapitre.numeros.join('_');
        const idFormatte = String(chapitre.id_unique).padStart(4, '0');
        const nomFichier = path.join(dossierBrut, `${idFormatte}_${chapitre.categorie}_siman_${nomNumeros}_brut.json`);

        if (fsSync.existsSync(nomFichier)) {
            console.log(`[IGNORE] Déjà présent : ${nomFichier}`);
            continue;
        }

        try {
            const reponse = await axios.get(chapitre.url);
            const $ = cheerio.load(reponse.data);

            const htmlContent = $('.entry-content').html();
            if (!htmlContent) continue;

            const morceaux = htmlContent.split('<a name="');
            let seifimCourants = [];

            for (let i = 1; i < morceaux.length; i++) {
                const seifHtml = '<a name="' + morceaux[i];
                let texteHebreu = cheerio.load(seifHtml).text().trim();
                texteHebreu = texteHebreu.replace(/\s+/g, ' ');

                if (texteHebreu) {
                    seifimCourants.push({
                        seif: seifimCourants.length + 1,
                        hebreu_brut: texteHebreu
                    });
                }
            }

            if (seifimCourants.length > 0) {
                const resultat = {
                    id_unique: chapitre.id_unique,
                    categorie: chapitre.categorie,
                    titre: chapitre.titre,
                    numeros_siman: chapitre.numeros,
                    url_source: chapitre.url,
                    seifim: seifimCourants
                };

                await fs.writeFile(nomFichier, JSON.stringify(resultat, null, 2), 'utf8');
                console.log(`[PASS] ${idFormatte}_siman_${nomNumeros} sauvegardé (${seifimCourants.length} seifim).`);
            }

            await pause(2500);

        } catch (err) {
            console.error(`[FAIL] Erreur sur ${chapitre.titre} : ${err.message}`);
        }
    }

    console.log("\nEXTRACTION TERMINÉE AVEC SUCCÈS.");
}

async function demarrerUsine() {
    // Force la regénération de l'index pour nettoyer les 1050 doublons
    if (fsSync.existsSync(fichierIndex)) {
        await fs.unlink(fichierIndex);
    }

    const catalogue = await genererIndex();
    if (catalogue) {
        await telechargerSimanim(catalogue);
    }
}

demarrerUsine();