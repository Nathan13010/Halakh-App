# Instructions Officielles - Génération de Données (Siman / Seif)

Ce document sert de guide de référence absolu pour toute intelligence artificielle (IA) chargée de générer, traduire et aligner de nouveaux paragraphes (Seifim) ou chapitres (Simanim) pour l'application *Halakh'App*.

**L'IA DOIT LIRE ET APPLIQUER STRICTEMENT CES INSTRUCTIONS AVANT TOUTE GÉNÉRATION.**

---

## 1. Source de Données
- **Source officielle :** Le texte hébreu brut doit impérativement être récupéré depuis l'API ou le site de `www.yalkut.info` (par exemple via des requêtes WordPress REST API ou en parsant le HTML) pour garantir d'avoir l'intégralité des Seifim. Ne vous fiez pas aux résumés partiels.

## 2. Architecture des Données et Fichiers
- **Fichier unique :** Les données d'un chapitre doivent être stockées dans un seul fichier JSON situé dans `public/data/siman_X.json` (où X est le numéro du Siman).
- **Pas de doublons :** Ne jamais créer de dossiers parasites comme `public/data/kitzur_yalkut_yosef/shabbat/` ou des fichiers comme `yalkout-X.json`.
- **Mise à jour UI :** Si un nouveau Siman est créé, l'IA doit s'assurer qu'il est débloqué dans l'application React (par exemple en mettant à jour le fichier `src/data/books.js` si nécessaire).
- **Build :** L'IA doit s'assurer que les changements sont pris en compte par l'application (en nettoyant les caches ou en exécutant `npm run build` si requis).

---

## 2. Structure JSON Requise
Chaque Siman doit respecter la structure stricte suivante :

```json
{
  "siman": "X",
  "titre_hebreu": "Titre du Siman",
  "titre_francais": "Titre traduit",
  "halakhot": [
    {
    - **Important :** Chaque objet DOIT posséder toutes ces clés, sans exception. Ne changez jamais de schéma (ex: ne remplacez pas `id` et `numero` par `sujet` ou inversement). Le schéma doit rester strictement uniforme.
      "id": "pX",
      "numero": "Numéro de la halakha (ex: 1, 2, 3...)",
      "sujet": "Le grand sujet (ex: הלכות השכמת הבוקר)",
      "sujet_fr": "Traduction du grand sujet (ex: Lois du réveil du matin)",
      "seif": "Numéro du paragraphe",
      "titre_seif": "Résumé court de la loi abordée (ex: Se lever avec force et courage) sans mentionner '(Seif X)' à la fin",
      "texte_integral": {
        "hebreu_sans_voyelles": "Texte hébreu brut",
        "hebreu_avec_voyelles": "Texte hébreu avec voyelles (Nakdan)",
        "francais": "Traduction fluide et globale du paragraphe"
      },
      "mots_alignes": [
        // Voir section 3 pour les règles d'alignement
      ]
    }
  ]
}
```

---

## 3. Alignement des mots (`mots_alignes`) & Traductions
L'alignement est le cœur de l'application interactive. Il DOIT être parfait (0% de désynchronisation).

- **Correspondance exacte :** Le nombre d'objets dans le tableau `mots_alignes` **doit être exactement égal** au nombre de mots dans la phrase `hebreu_sans_voyelles` séparés par des espaces.
- **PAS de mots génériques (ERREUR FATALE) :** Il est **strictement interdit** d'utiliser des mots de remplissage comme "Terme", "Terme hébreu", ou "—" pour la clé `francais_mot`. Chaque mot hébreu DOIT avoir une traduction française.
- **Traduction contextuelle :** Le `francais_mot` ne doit pas être une traduction littérale robotique, mais la traduction exacte que ce mot prend *dans le contexte de cette phrase précise*.
- **Expression de contexte :** La clé `expression_contexte` doit regrouper le mot avec les 2 ou 3 mots environnants pour aider l'utilisateur à comprendre le sens global (ex: mot="permis", contexte="il est permis de dormir").

**Exemple de structure d'un mot :**
```json
{
  "id": 1,
  "hebreu_brut": "מותר",
  "hebreu_voyelles": "מוּתָּר",
  "francais_mot": "il est permis",
  "expression_contexte": "il est permis de dormir"
}
```

---

## 4. Vocalisation (Nikoud) via l'API Dicta Nakdan
Toutes les voyelles (`hebreu_voyelles`) doivent être générées via l'API de Dicta Nakdan (`https://nakdan-2-0.loadbalancer.dicta.org.il/api`).

### Règles d'utilisation de l'API :
1. **Ne jamais envoyer de mots isolés :** Envoyer toujours le paragraphe entier ou la phrase complète à l'API (`useTokenization: true`). L'hébreu dépend du contexte.
2. **Options recommandées :** 
   - `task: "nakdan"`
   - `genre: "rabbinic"` (ou "modern" selon les cas)
3. **Numérotation initiale :** Le texte hébreu brut de chaque paragraphe (ainsi que la traduction globale et le tableau `mots_alignes`) doit TOUJOURS commencer par la lettre hébraïque du Seif (ex: `א.`, `ב.`) et sa traduction française doit être le numéro suivi d'un point (ex: `1.`, `2.`). L'API de Yalkut Info fournit parfois les textes sans ces numérotations, l'IA doit donc les rajouter manuellement en préfixe. Ne mettez PAS le mot "Paragraphe" devant le numéro.
- **Ponctuation parasite :** Il est strictement interdit d'avoir des mots isolés dans `mots_alignes` qui ne sont que des points finaux (`.`) ou des tirets avec la traduction par défaut `—`. La ponctuation doit toujours être rattachée au mot qui la précède (ex: `הבוקר,`). Tout point ou espace en trop à la fin des paragraphes hébreux récupérés sur Yalkut.info doit être nettoyé.
- **Le correctif "Ktiv Male" (Shourouk vs Koubouts) :**
   La grammaire stricte (Ktiv Haser) supprime le Vav (ו) et utilise un Koubouts (ֻ). Exemple : `מותר` devient `מֻתָּר`.
   Puisque l'application exige de conserver le texte d'origine exact (Ktiv Male), l'IA doit appliquer la logique suivante post-API :
   - *Règle :* Si le mot brut original contient un Vav (`ו`), et que Nakdan renvoie un mot avec un Koubouts (`ֻ`), l'IA **doit remplacer le Koubouts par un Shourouk (`וּ`)** pour préserver le Ktiv Male de l'utilisateur. 
   - *Exemple :* `מותר` + `מֻתָּר` = **`מוּתָּר`**.

---

- **Fidélité stricte de la traduction :** Ne JAMAIS ajouter de commentaires extérieurs, de justifications, ou de paraphrases étendues dans le texte français (comme de longs développements sur la Michna Beroura ou des analogies non présentes dans le texte source). La traduction française doit être l'exact reflet du texte hébreu fourni.
- **Audit rigoureux du Nikkoud (Voyellisation) :** L'API Nakdan est un algorithme qui peut se tromper sur le contexte. L'IA DOIT vérifier sémantiquement les voyelles pour éviter des hallucinations (ex: traiter `משינה` comme "Machine" (`מָשִׁינָה`) au lieu de "Du sommeil" (`מִשֵּׁנָה`), ou transformer un nom en verbe). Ne faites pas une confiance aveugle à l'API.

## 5. Registre des erreurs historiques (à ne jamais reproduire)
Voici la liste des erreurs passées que l'IA doit vérifier avant de livrer son travail :
- [x] **Désynchronisation ID/Mots :** Avoir plus de mots dans `mots_alignes` que dans `hebreu_sans_voyelles`. Le split se fait strictement sur l'espace `(" ")`.
- [x] **Le bug du "Terme" :** Oublier de traduire des mots hébreux et les remplacer par la valeur par défaut "Terme" ou "—".
- [x] **Le bug du "Ktiv Male" :** Retourner le mot `מוֹתָר` ("Motar" = le surplus) au lieu de `מוּתָּר` ("Mutar" = permis) à cause d'une mauvaise gestion de l'API Nakdan. Il faut appliquer la règle du *Shourouk* décrite en section 4.
- [x] **Le bug des voyelles effacées (API Nakdan) :** Traiter la réponse de Nakdan comme un simple tableau au lieu de `response.data`, ou mal gérer la ponctuation. Nakdan sépare la ponctuation avec l'attribut `"sep": true`. Pour récupérer la phrase vocalisée complète sans perdre l'alignement, l'IA doit reconstituer la chaîne (en utilisant `token.nakdan.options[0].w` si `sep` est faux, sinon `token.str`) puis faire un `.split(' ')` sur la chaîne complète.
- [x] **Caches et Fallbacks :** Ne pas oublier de mettre à jour la constante `FALLBACK_PARAGRAPHS` dans `src/data/books.js` si le Siman 1 est regénéré, pour éviter que le navigateur n'affiche d'anciennes données stockées en dur en cas de faille réseau.
- [x] **Absence de numérotation ou de titre :** Oublier le champ `titre_seif` ou la numérotation hébraïque (`א.`, `ב.`) au début du texte car le scraper web ne les a pas attrapés.
- [x] **Points isolés (Bug du "—") :** Ajouter des éléments vides de ponctuation à cause de multiples espaces ou de points à la fin des phrases. La ponctuation doit être collée au mot. Et veillez à retirer les doubles points espacés (`. .`) à la fin des textes intégraux.
- [x] **Décalage d'alignement (Highlight anarchique) :** Créer un tableau de traduction dont la longueur est correcte, mais où les mots français sont décalés par rapport aux mots hébreux (ce qui cause un surlignement de mauvais mots dans l'UI). L'IA doit rigoureusement tester le dictionnaire d'alignement.
- [x] **Incohérence structurelle (Clés manquantes) :** Générer les Seifim avec un schéma JSON différent des précédents (oublier `sujet`, `sujet_fr` ou `id`, `numero`). Le schéma défini en Section 1 doit être strictement respecté.
- [x] **Commentaires intrusifs (Hallucination de traduction) :** Ajouter de longs commentaires ou des justifications halakhiques dans la traduction française qui ne figurent pas dans le texte hébreu original.
- [x] **Hallucination de Nikkoud (Contexte ignoré) :** Accepter aveuglément les voyelles de Nakdan sans les vérifier (ex: `מָשִׁינָה` - "machine" au lieu de `מִשֵּׁנָה` - "sommeil", ou `לְעִצּוּם` au lieu du verbe `לַעֲצֹם`). L'IA est garante de la cohérence sémantique des voyelles.
- [x] **L'erreur du Ksheye'or (Seif 9) :** Le mot `כשיעור` dans le contexte du réveil n'est pas "comme la mesure" (`כְּשִׁעוּר`) mais bien le verbe s'éveiller au futur : `כְּשֶׁיֵּעוֹר`. L'IA doit être particulièrement vigilante sur les mots à sens multiple (homographes).
- [x] **Le bug des "Pipes" ( | ) de Nakdan :** L'API Nakdan insère parfois un caractère `|` (barre verticale) pour séparer les préfixes du reste du mot (ex: `הַ|יּוֹדֵעַ`). Ce caractère est un artefact interne de l'API et doit être **systématiquement supprimé** du résultat final (regex: `str.replace(/\|/g, '')`). Le script de génération doit inclure cette étape de nettoyage post-API.
- [x] **Confusion nom/verbe (Ledavar vs Ledaber) :** Le mot `לדבר` peut être un nom (`לְדָבָר` = "pour une chose") ou un verbe (`לְדַבֵּר` = "parler"). Nakdan choisit souvent le nom par défaut. L'IA doit vérifier le contexte : si le sujet "sait parler", c'est le verbe Pi'el `לְדַבֵּר`.
- [x] **Incohérence de Nikkoud entre Seifim (Hamegounah) :** Si un même mot apparaît dans plusieurs Seifim (ex: `המגונה`), son Nikkoud doit être identique partout. Nakdan peut proposer `הַמְגוּנֶּה` (Shourouk) dans un Seif et `הַמְגֻנֶּה` (Koubouts) dans un autre. L'IA doit unifier le Nikkoud en vérifiant les occurrences précédentes du même mot.

*Note pour l'IA : Mettez ce fichier à jour si vous rencontrez de nouvelles contraintes ou bugs lors du développement.*
