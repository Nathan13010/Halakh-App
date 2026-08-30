# Parcours multi-Siman du Learning Core

## État actuel

Les Simanim 1, 2 et 3 sont déclarés dans le manifeste Learning et présentés
dans un parcours séquentiel pour la catégorie `הלכות הנהגת אדם בבוקר`.

- Le Siman 1 est accessible au départ.
- Une leçon contient au maximum trois notions, toujours présentées avant leur
  contrôle.
- La leçon suivante est débloquée après un contrôle sans faute.
- L'examen du Siman exige 100 % de bonnes réponses et débloque le Siman
  suivant.
- Le test final de catégorie prend deux questions dans chaque Siman.
- Sa réussite débloque une fiche de révision permanente et imprimable.

- Le Siman 1 conserve son Knowledge JSON éditorial complet.
- Les Simanim 2 et 3 utilisent un pilote d'exposition fidèle à la source :
  un Knowledge Point et une flashcard par סעיף, reprenant sans reformulation la
  traduction française du fichier de lecture.
- Ces deux pilotes portent `human_review_required: true` et
  `pilot_scope: source_exposure_only`. Leur progression mesure les סעיפים déjà
  exposés. Ils ne fournissent volontairement ni faux énoncé halakhique, ni
  situation pratique inventée avant la revue éditoriale.

Pour rendre le parcours testable sans créer de fausse règle, le moteur produit
pour ces pilotes des questions de reconnaissance : il affiche un extrait exact
de la règle déjà lue et demande de l'associer à l'un des trois titres réellement
étudiés. Les options sont donc des noms de notions vraies, jamais des lois
fabriquées. Cette réussite vérifie le repérage du contenu pilote ; elle ne
remplace pas la future validation éditoriale de questions halakhiques fines.

## Ordre pédagogique du Siman 1

Le premier JSON avait été extrait dans l'ordre des Knowledge Points, ce qui
pouvait faire remonter une activité marquée `needs_review` avant son
explication. Le nouveau parcours possède un état séparé, stocké sous
`halakhapp_learning_path_v1`, et ignore cette priorité historique.

La première séquence est désormais :

1. se lever avec force pour servir Hachem ;
2. ne pas se lever brusquement ;
3. dire Modé Ani au réveil ;
4. contrôler ces trois notions.

La Zrizout n'apparaît que dans la leçon 3, après le réveil, Modé Ani et la
préparation à la prière. Un glossaire contextuel explique les principaux termes
pour qu'un débutant puisse entrer directement par l'onglet Apprentissage.

## État et déblocage

Le nouvel état persistant enregistre séparément :

- les leçons terminées de chaque Siman ;
- les tentatives et le meilleur score de chaque examen ;
- la validation des trois Simanim ;
- la validation du test de catégorie ;
- le déblocage de la fiche de révision.

L'ancien stockage `halakhapp_kp_progression` est conservé pour compatibilité
avec le Learning Core V1, mais il ne peut plus changer l'ordre du nouveau
parcours. Le bouton de réinitialisation du profil efface les deux stockages.

Les pilotes sont reproductibles avec :

```bash
node scripts/generate-learning-pilot.cjs
```

## Conditions d'entrée d'un nouveau Siman

Le pilote exige un fichier `siman_N_knowledge.json` qui respecte toutes les
conditions suivantes :

1. extraction éditoriale reliée aux Seifim sources ;
2. activités portant `validated: true` après revue ;
3. aucune règle halakhique générée au runtime par l'application ;
4. conditions explicites pour les activités `conditional` ;
5. opinions multiples conservées sans simplification ;
6. `activity_id`, `knowledge_point_id` et `source_seif` cohérents ;
7. inventaire documenté des activités acceptées et rejetées.

## Procédure d'intégration

1. Déposer le Knowledge JSON validé sous `public/data/<dossier>/`.
2. Ajouter une entrée à `src/data/learningSimans.js` avec :
   - `id` ;
   - `simanNumber` ;
   - `knowledgePath` ;
   - `contentContract`.
3. Renseigner dans le contrat les nombres validés d'activités totales,
   acceptées et rejetées, ainsi que l'unique motif de rejet éditorial autorisé.
4. Exécuter :

   ```bash
   npm run test:learning
   npm run test:learning:ui
   npm run build
   ```

5. Une projection exacte de la source peut être intégrée comme pilote si elle
   est clairement identifiée comme telle. Seules les reconnaissances
   source-vers-titre sont alors produites automatiquement ; les QCM fondés sur
   des affirmations halakhiques restent interdits avant validation éditoriale.

## Politique d'échec

```text
Fichier absent, contrat incohérent ou donnée ambiguë
→ le Siman n'est pas activé
→ aucune donnée n'est inventée pour satisfaire les tests
```
