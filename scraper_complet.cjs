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
    if (!titre.includes('סימן') && !titre.includes('סעיף') && !titre.includes('המשך')) {
        return [];
    }

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
const dossierComplet = path.join(__dirname, 'complet');
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
            let lastSiman = [0]; // Mémoriser le dernier Siman vu dans la catégorie

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

                        // On n'exige plus le mot "סימן" pour accepter l'article
                        if (lien) {
                            let numeros = extraireNumerosSiman(titre);
                            
                            // Si aucun numéro explicite n'a été trouvé, on hérite du dernier Siman vu
                            if (numeros.length === 0) {
                                numeros = [...lastSiman];
                            } else {
                                // Sinon, on met à jour le dernier Siman
                                lastSiman = [...numeros];
                            }

                            // Si l'URL a déjà été enregistrée, on l'ignore pour l'ajout au catalogue,
                            // mais on a quand même mis à jour le lastSiman pour les articles suivants !
                            if (urlsVues.has(lien)) {
                                return;
                            }
                            urlsVues.add(lien);

                            // Extraire les catégories spécifiques de l'article depuis la page d'archive
                            let categoriesArticle = [];
                            $(element).find('.entry-categories-inner a').each((i, el) => {
                                categoriesArticle.push($(el).text().trim());
                            });

                            // Choisir la meilleure catégorie en évitant 'כללי' si possible
                            let bestCategory = categoriesArticle.find(c => c !== 'כללי');
                            if (!bestCategory && categoriesArticle.length > 0) {
                                bestCategory = categoriesArticle[0];
                            }
                            // Fallback sur la catégorie de la page en cours si introuvable
                            if (!bestCategory) {
                                bestCategory = nomCategorie;
                            }

                            bestCategory = bestCategory.replace(/[/\\?%*:|"<>]/g, '-');

                            catalogue.push({
                                id_unique: idGlobal++,
                                categorie: bestCategory,
                                numeros: numeros,
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
                console.log(`[PASS] ${idFormatte}_siman_${nomNumeros} sauvegardé (${seifimCourants.length} seifim).`);
            }

            await pause(2500);

        } catch (err) {
            console.error(`[FAIL] Erreur sur ${chapitre.titre} : ${err.message}`);
        }
    }

    console.log("\nEXTRACTION TERMINÉE AVEC SUCCÈS.");
}

// ============================================================
// PHASE 3 : CONSOLIDATION — Fusion des Simanim fragmentés
// ============================================================

async function consoliderSimanim() {
    console.log("\n--- PHASE 3 : CONSOLIDATION DES SIMANIM ---");

    // Nettoyer le dossier complet/ avant regénération
    if (fsSync.existsSync(dossierComplet)) {
        await fs.rm(dossierComplet, { recursive: true, force: true });
    }
    await fs.mkdir(dossierComplet, { recursive: true });

    // 1. Lire tous les fichiers bruts
    const fichiers = await fs.readdir(dossierBrut);
    const fichiersJson = fichiers.filter(f => f.endsWith('.json')).sort();

    if (fichiersJson.length === 0) {
        console.error("[ERREUR] Aucun fichier JSON trouvé dans le dossier brut/.");
        return;
    }

    console.log(`Lecture de ${fichiersJson.length} fichiers bruts...`);

    // 2. Charger tous les articles en mémoire
    const tousLesArticles = [];

    for (const fichier of fichiersJson) {
        const chemin = path.join(dossierBrut, fichier);
        const contenu = await fs.readFile(chemin, 'utf8');
        let donnees;

        try {
            donnees = JSON.parse(contenu);
        } catch (err) {
            console.error(`[ERREUR] Impossible de parser ${fichier}: ${err.message}`);
            continue;
        }

        tousLesArticles.push(donnees);
    }

    // 3. Reclassifier les articles "כללי"
    // On construit d'abord un index : simanNum → catégorie(s) connues (hors כללי)
    const categoriesParSiman = {};
    for (const article of tousLesArticles) {
        if (article.categorie === 'כללי') continue;
        const numeros = article.numeros_siman || [];
        for (const num of numeros) {
            if (num === 0) continue;
            if (!categoriesParSiman[num]) categoriesParSiman[num] = new Set();
            categoriesParSiman[num].add(article.categorie);
        }
    }

    // Table de correspondance des mots-clés pour les cas non résolus par sibling
    const MOTS_CLES_CATEGORIES = {
        'ציצית': 'הלכות ציצית',
        'תפילין': 'הלכות תפילין',
        'סוכה': 'הלכות סוכה',
        'סוכות': 'הלכות סוכה',
        'שבת': 'הלכות שבת',
        'פסח': 'הלכות פסח',
        'חנוכה': 'הלכות חנוכה',
        'פורים': 'הלכות פורים',
        'לולב': 'הלכות לולב',
        'מזוזה': 'הלכות מזוזה (ומעקה)',
        'ברכות': 'הלכות ברכות',
        'תפילה': 'הלכות תפילה',
        'שחיטה': 'הלכות שחיטה',
        'אבלות': 'הלכות אבלות דיני אבלות',
        'ביצים': 'הלכות טריפות',
    };

    let compteurReclasses = 0;

    for (const article of tousLesArticles) {
        if (article.categorie !== 'כללי') continue;

        const numeros = article.numeros_siman || [];
        const titre = article.titre || '';
        let nouvelleCat = null;

        // Stratégie 1 : extraire "הלכות X" du titre (source la plus fiable)
        const matchHalakhot = titre.match(/הלכות\s+[^\s\[\]–\-,]+(?:\s+[^\s\[\]–\-,]+)*/);
        if (matchHalakhot) {
            nouvelleCat = matchHalakhot[0].trim();
        }

        // Stratégie 2 : un sibling avec le même siman existe dans une vraie catégorie
        if (!nouvelleCat) {
            for (const num of numeros) {
                if (categoriesParSiman[num] && categoriesParSiman[num].size === 1) {
                    nouvelleCat = [...categoriesParSiman[num]][0];
                    break;
                }
            }
        }

        // Stratégie 3 : mots-clés connus dans le titre
        if (!nouvelleCat) {
            for (const [motCle, cat] of Object.entries(MOTS_CLES_CATEGORIES)) {
                if (titre.includes(motCle)) {
                    nouvelleCat = cat;
                    break;
                }
            }
        }

        // Stratégie 4 : extraire "דיני/דין X" et essayer de matcher
        if (!nouvelleCat) {
            const matchDin = titre.match(/דינ[יe]\s+(\S+)/);
            if (matchDin) {
                const sujet = matchDin[1];
                for (const [motCle, cat] of Object.entries(MOTS_CLES_CATEGORIES)) {
                    if (sujet.includes(motCle)) {
                        nouvelleCat = cat;
                        break;
                    }
                }
            }
        }

        if (nouvelleCat) {
            console.log(`[RECLASS] "${titre}" : כללי → ${nouvelleCat}`);
            article.categorie = nouvelleCat;
            compteurReclasses++;
        }
    }

    if (compteurReclasses > 0) {
        console.log(`${compteurReclasses} articles reclassifiés depuis "כללי".\n`);
    }

    // 4. Regrouper par clé composite : categorie + numéro de Siman
    const groupes = {};

    for (const donnees of tousLesArticles) {
        const numeros = donnees.numeros_siman || [];
        const categorie = donnees.categorie || 'Categorie_Inconnue';

        if (numeros.length === 0 || (numeros.length === 1 && numeros[0] === 0)) continue;

        // Group by the exact array of numbers to avoid duplicating multi-siman articles
        const numsKey = numeros.join('-');
        const nomNumeros = numeros.length > 1 ? `${numeros[0]}-${numeros[numeros.length - 1]}` : `${numeros[0]}`;
        const cleGroupe = `${categorie}_${numsKey}`;

        if (!groupes[cleGroupe]) {
            groupes[cleGroupe] = { categorie, nomNumeros, minNum: Math.min(...numeros), fragments: [] };
        }

        groupes[cleGroupe].fragments.push({
            id_unique: donnees.id_unique,
            categorie: categorie,
            titre: donnees.titre,
            url_source: donnees.url_source,
            seifim: donnees.seifim || []
        });
    }

    const clesGroupes = Object.keys(groupes).sort((a, b) => {
        const ga = groupes[a], gb = groupes[b];
        if (ga.categorie !== gb.categorie) return ga.categorie.localeCompare(gb.categorie);
        return ga.minNum - gb.minNum;
    });
    console.log(`${clesGroupes.length} Simanim distincts identifiés (par catégorie).`);

    // 5. Construire et écrire les fichiers fusionnés dans des sous-dossiers par catégorie
    let compteurFusionnes = 0;
    let compteurMulti = 0;
    const categoriesCrees = new Set();

    for (const cle of clesGroupes) {
        const { categorie, nomNumeros, fragments } = groupes[cle];

        // Trier les fragments par le numéro du premier seif (lettre hébraïque)
        fragments.sort((a, b) => {
            const getSeifNum = (frag) => {
                if (!frag.seifim || frag.seifim.length === 0) return 0;
                const premierMot = frag.seifim[0].hebreu_brut.split(' ')[0];
                return convertirHebreuEnChiffre(premierMot);
            };
            return getSeifNum(a) - getSeifNum(b);
        });

        // Créer le sous-dossier de catégorie si nécessaire
        const dossierCategorie = path.join(dossierComplet, categorie);
        if (!categoriesCrees.has(categorie)) {
            await fs.mkdir(dossierCategorie, { recursive: true });
            categoriesCrees.add(categorie);
        }

        // Construire les sous-chapitres avec double numérotation
        let compteurGlobal = 0;
        const souschapitres = [];

        for (let i = 0; i < fragments.length; i++) {
            const fragment = fragments[i];
            const seifimsAvecGlobal = [];

            for (const seif of fragment.seifim) {
                compteurGlobal++;
                seifimsAvecGlobal.push({
                    seif_local: seif.seif,
                    seif_global: compteurGlobal,
                    hebreu_brut: seif.hebreu_brut
                });
            }

            const sousChapitre = {
                ordre: i + 1,
                id_unique_source: fragment.id_unique,
                titre_article: fragment.titre,
                url_source: fragment.url_source,
                seifim: seifimsAvecGlobal
            };

            if (fragment.couvre_aussi) {
                sousChapitre.couvre_aussi = fragment.couvre_aussi;
            }

            souschapitres.push(sousChapitre);
        }

            const structureFinale = {
                siman: isNaN(Number(nomNumeros)) ? nomNumeros : Number(nomNumeros),
                categorie: categorie,
                total_seifim: compteurGlobal,
                sous_chapitres: souschapitres
            };

            let suffix = `siman_${nomNumeros}_complet.json`;
            const nomFichier = path.join(dossierCategorie, suffix);
        await fs.writeFile(nomFichier, JSON.stringify(structureFinale, null, 2), 'utf8');

        if (fragments.length > 1) {
            compteurMulti++;
            console.log(`[FUSION] ${categorie} / Siman ${nomNumeros} : ${fragments.length} articles → ${compteurGlobal} seifim au total`);
        }

        compteurFusionnes++;
    }

    console.log(`\n[RÉSULTAT] ${compteurFusionnes} fichiers créés dans complet/`);
    console.log(`           répartis dans ${categoriesCrees.size} catégories`);
    console.log(`           dont ${compteurMulti} Simanim fusionnés à partir d'articles multiples`);
    console.log(`           et ${compteurFusionnes - compteurMulti} Simanim à article unique`);
    console.log("\nCONSOLIDATION TERMINÉE AVEC SUCCÈS.");
}

// ============================================================
// POINT D'ENTRÉE — Supporte --merge-only pour la Phase 3 seule
// ============================================================

async function demarrerUsine() {
    const args = process.argv.slice(2);
    const mergeOnly = args.includes('--merge-only');

    if (mergeOnly) {
        // Exécuter uniquement la Phase 3 (consolidation)
        console.log("Mode --merge-only : seule la Phase 3 sera exécutée.\n");
        await consoliderSimanim();
        return;
    }

    // Pipeline complet : Phases 1 + 2 + 3
    // Force la regénération de l'index pour nettoyer les 1050 doublons
    if (fsSync.existsSync(fichierIndex)) {
        await fs.unlink(fichierIndex);
    }

    const catalogue = await genererIndex();
    if (catalogue) {
        await telechargerSimanim(catalogue);
        await consoliderSimanim();
    }
}

demarrerUsine();