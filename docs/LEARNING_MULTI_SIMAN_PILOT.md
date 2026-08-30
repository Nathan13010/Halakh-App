# Pilote multi-Siman du Learning Core

## État actuel

Un seul Knowledge JSON validé est disponible : `siman_1_knowledge.json`.
Aucun deuxième Siman ne doit être activé à partir des fichiers `siman_N.json`
de lecture : ils ne remplacent pas un Knowledge JSON éditorial validé.

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

5. Ne rendre le Siman sélectionnable dans le produit qu'après réussite des
   trois gates et validation humaine du rapport de contenu.

## Politique d'échec

```text
Fichier absent, contrat incohérent ou donnée ambiguë
→ le Siman n'est pas activé
→ aucune donnée n'est inventée pour satisfaire les tests
```
