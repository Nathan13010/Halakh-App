const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs/promises');
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

function extraireNumerosSiman(titre) {
    if (!titre.includes('סימן') && !titre.includes('סעיף') && !titre.includes('המשך')) {
        return [];
    }
    let bloc = titre;
    if (bloc.includes('סעיף')) bloc = bloc.split('סעיף')[0];
    else if (bloc.includes(' – ')) bloc = bloc.split(' – ')[0];
    else if (bloc.includes(' - ')) bloc = bloc.split(' - ')[0];

    bloc = bloc.replace('סימן', '').replace('המשך', '');
    bloc = bloc.replace(/\[.*?\]/g, '').trim();

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

    const parties = bloc.split(/[,]/);
    let numeros = [];
    for (let partie of parties) {
        const num = convertirHebreuEnChiffre(partie.trim());
        if (num > 0 && !numeros.includes(num)) numeros.push(num);
    }
    return numeros;
}

async function scrapeDam() {
    const contenu = await fs.readFile('all-pages-הלכות דם.txt', 'utf8');
    const $ = cheerio.load(contenu);
    const catalogue = [];
    let idUniqueDam = 9000; // on utilise des ID élevés pour ne pas écraser les autres

    $('.entry-title a').each((i, el) => {
        const url = $(el).attr('href');
        const titre = $(el).text().trim();
        
        let numeros = extraireNumerosSiman(titre);
        if (numeros.length === 0) {
            if (titre.includes('תולעים')) {
                numeros = [84];
            } else {
                numeros = [69]; // מליחה
            }
        }

        catalogue.push({
            id_unique: idUniqueDam++,
            categorie: 'הלכות דם',
            titre: titre,
            url: url,
            numeros: numeros
        });
    });

    console.log(`Trouvé ${catalogue.length} articles pour הלכות דם.`);

    const dossierBrut = path.join(__dirname, 'brut');
    await fs.mkdir(dossierBrut, { recursive: true });

    for (const chapitre of catalogue) {
        const nomNumeros = chapitre.numeros.join('_');
        const idFormatte = String(chapitre.id_unique).padStart(4, '0');
        const nomFichier = path.join(dossierBrut, `${idFormatte}_${chapitre.categorie}_siman_${nomNumeros}_brut.json`);

        try {
            console.log(`Téléchargement de: ${chapitre.titre}`);
            const reponse = await axios.get(chapitre.url);
            const $page = cheerio.load(reponse.data);

            const htmlContent = $page('.entry-content').html();
            if (!htmlContent) {
                console.log(`[VIDE] ${chapitre.titre}`);
                continue;
            }

            const morceaux = htmlContent.split(/<a[^>]*name="[^"]*"[^>]*><\/a>/i);
            let seifimCourants = [];

            for (let i = 1; i < morceaux.length; i++) {
                let texteHebreu = cheerio.load(morceaux[i]).text().trim();
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
                console.log(`[OK] ${idFormatte}_siman_${nomNumeros} sauvegardé (${seifimCourants.length} seifim).`);
            } else {
                console.log(`[AUCUN SEIF] ${chapitre.titre}`);
            }

            await pause(1500);
        } catch (err) {
            console.error(`[ERREUR] sur ${chapitre.titre} : ${err.message}`);
        }
    }
}

scrapeDam();
