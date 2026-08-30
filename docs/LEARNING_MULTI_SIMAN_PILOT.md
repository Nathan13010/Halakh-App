# Pilote multi-Siman du Learning Core

## État actuel

Les Simanim 1, 2 et 3 sont déclarés dans le manifeste Learning.

- Le Siman 1 conserve son Knowledge JSON éditorial complet.
- Les Simanim 2 et 3 utilisent un pilote d'exposition fidèle à la source :
  un Knowledge Point et une flashcard par סעיף, reprenant sans reformulation la
  traduction française du fichier de lecture.
- Ces deux pilotes portent `human_review_required: true` et
  `pilot_scope: source_exposure_only`. Leur progression mesure les סעיפים déjà
  exposés, et non une maîtrise objective. Ils ne fournissent volontairement ni
  QCM, ni vrai/faux, ni situation pratique avant la revue éditoriale.

Les pilotes sont reproductibles avec :

```bash
node scripts/generate-learning-pilot.cjs
```

## Conditions d'entrée d'un nouveau Siman

Le pilote exige un fichier `siman_N_knowledge.json` qui respecte toutes les
conditions suivantes :

1. extraction éditoriale reliée aux Seifim sources ;
2. activités portant `validated: true` après revue ;
3. aucune donnée générée au runtime par l'application ;
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

5. Une projection exacte de la source peut être rendue sélectionnable comme
   pilote d'exposition si elle est clairement identifiée comme telle. Les
   activités objectives restent interdites avant validation éditoriale.

## Politique d'échec

```text
Fichier absent, contrat incohérent ou donnée ambiguë
→ le Siman n'est pas activé
→ aucune donnée n'est inventée pour satisfaire les tests
```
