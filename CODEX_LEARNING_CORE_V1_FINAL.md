# CODEX LEARNING CORE V1 — RAPPORT FINAL

Date de validation : 30 août 2026
Périmètre : Learning Core V1 de Halakh'App
Source pédagogique testée : `siman_1_knowledge.json`, version `1.0`

## 1. Résumé

Le Learning Core V1 est désormais fonctionnel, cohérent et testé de bout en
bout. Les corrections ont porté sur la progression, la maîtrise, le routage
des mini-jeux, le sélecteur, les sessions, la persistance, le reset, le debug,
le responsive et la préparation multi-Siman.

Le Knowledge JSON n'a pas été modifié. Aucun texte halakhique, distracteur,
contexte, opinion ou scénario n'a été créé ou complété par le code.

Chaîne active finale :

```text
learningSimans manifest
→ knowledgeService
→ activityValidator
→ activitySelector
→ useLearningSession
→ ActivityRenderer
→ ClassicQuiz / SwipeGame / ScenarioGame / LearningCard
→ progressionTracker
```

## 2. Bugs corrigés

- Une Flashcard terminée fait réellement passer `non_started` à `learning`.
- Les Flashcards de la queue ne sont plus marquées comme vues à la création de
  la session.
- `practical_situation` conserve son type et atteint réellement ScenarioGame.
- Le même QCM réussi deux fois ne suffit plus à atteindre `mastered`.
- Une activité objective non maîtrisée est proposée avant une activité déjà
  maîtrisée.
- Les Situations objectives futures ambiguës sont rejetées.
- Le backfill cherche les KPs suivants jusqu'à obtenir 5 KPs admissibles.
- Le retry ajouté après une erreur sur la dernière activité n'est plus perdu.
- Chaque activité possède une clé d'instance stable, y compris les retries.
- La valeur d'importance `secondary` est correctement classée.
- Le reset de progression efface aussi la progression Learning Core.
- Les anciens objets localStorage sont normalisés sans `undefined` ni `NaN`.
- Le contenu “Halakha du jour” hardcodé a été retiré du chemin actif.
- Le SwipeGame utilise une référence synchrone pour fiabiliser le seuil du
  geste tactile.

## 3. Architecture finale

- `src/data/learningSimans.js` centralise les chemins des Knowledge JSON.
- `knowledgeService.js` ne connaît plus de mapping local dispersé.
- `activityValidator.js` est l'unique porte d'admission des activités.
- `activitySelector.js` trie les KPs, exclut les activités invalides, applique
  le backfill et normalise seulement les champs UI.
- `useLearningSession.js` orchestre la queue, les soumissions, les retries et
  la fin de session.
- `sessionQueue.js` contient les transitions de queue pures et testables.
- `progressionTracker.js` possède les règles de progression et la migration
  localStorage.
- `LearningScreen.jsx` ne contient plus de contenu halakhique autonome.

## 4. Progression

Règles validées :

| Interaction | Résultat de statut |
|---|---|
| Flashcard réellement terminée | `non_started → learning` |
| Première réussite objective | `learning/non_started → practicing` |
| Erreur objective | `→ needs_review` |
| Deux preuves objectives distinctes | `→ mastered` |
| Situation ouverte | interaction enregistrée, aucune preuve objective |

Les compteurs `attempts`, `correct`, `wrong`, `last_seen`, `last_correct`,
`streak`, `activities_mastered` et `last_failed_activity_id` sont persistés et
normalisés.

## 5. Mastery

La maîtrise dépend du nombre d'`activity_id` objectifs distincts réussis :

```text
QCM A + QCM A → practicing
QCM A + QCM B → mastered possible
QCM A + V/F A → mastered possible
Flashcard + Situation reflective → aucune preuve de maîtrise
```

Le compteur de succès conserve les répétitions à des fins d'analyse, mais ces
répétitions ne créent pas de nouvelle preuve. Le streak du KP reste indépendant
de la décision de maîtrise.

## 6. Selector

La priorité V1 est conservée :

```text
needs_review > non_started > learning > practicing > mastered
```

À priorité égale : niveau, importance réelle du schéma, `last_seen` le plus
ancien, puis ID déterministe.

Autres garanties :

- alternative à `last_failed_activity_id` lorsqu'elle existe ;
- activité non maîtrisée avant activité maîtrisée ;
- aucune activité rejetée dans la queue ;
- 5 KPs distincts lorsque 5 KPs admissibles existent ;
- backfill au-delà des cinq premiers KPs classés ;
- rotation déterministe des KPs d'exposition via `last_seen`.

Pour éviter que les 49 KPs Flashcard-only bloquent toutes les sessions, un seul
KP `learning` sans aucune activité objective est pris en priorité par session
lorsque d'autres KPs admissibles existent. Les KPs différés servent néanmoins
à compléter la session si aucun autre contenu n'est disponible.

## 7. Validator

Le validateur central couvre :

- Flashcard ;
- QCM avec au moins deux options et réponse exactement présente ;
- Vrai/Faux avec booléen explicite ;
- Situation ouverte reflective ;
- Situation future objective ;
- statut conditional ;
- statut multiple_opinions ;
- `activity_id`, `knowledge_point_id`, `source_seif`, `validated` et cohérence
  avec le KP parent.

Audit réel du JSON :

```text
117 activités analysées
94 acceptées
23 rejetées
```

Les 23 rejets sont tous et uniquement des activités conditional sans texte de
condition explicite utilisable.

## 8. Sessions

- Une session vise 5 KPs distincts et peut contenir plus de 5 activités si un
  KP propose une découverte suivie d'un exercice.
- Les activités invalides ne consomment pas un emplacement de KP.
- Une erreur ajoute un retry avec un ID d'instance unique.
- Le calcul de transition reçoit le retry avant de décider si la session est
  terminée.
- Le cas réel “erreur en position 5/5” affiche le retry en 6/6, garde la session
  active, puis termine seulement après la reprise.
- Une nouvelle session est reconstruite depuis la progression persistée sans
  rechargement forcé de la page.

## 9. Mini-jeux

- `ClassicQuiz` : QCM objectif, réponse et explication strictement issues du
  JSON, protection anti-double-submit.
- `SwipeGame` : V/F objectif, boutons et vrai geste tactile gauche/droite,
  protection anti-double-submit.
- `ScenarioGame` : Situation réellement routée, trois étapes, mode ouvert ou
  futur mode à options.
- `LearningCard` : découverte reflective, validation au clic “J'ai compris”.

`ActivityRenderer` est remonté avec `key={session.currentActivity.id}`. Les
états internes, refs et animations ne sont donc pas réutilisés entre deux
instances consécutives du même mini-jeu.

## 10. Reflective vs Objective

| Type source | Mode |
|---|---|
| `flashcard` | REFLECTIVE |
| `multiple_choice` valide | OBJECTIVE |
| `true_false` valide | OBJECTIVE |
| `practical_situation` sans options et avec `answer` | REFLECTIVE |
| `practical_situation` avec ≥2 options et `correct_answer` membre | OBJECTIVE |
| Situation intermédiaire/ambiguë | INVALID / REJECT |

Le tracker reçoit `practical_situation_reflective` pour les 21 Situations
ouvertes actuelles. Elles augmentent `attempts` et `last_seen`, mais jamais
`correct`, `wrong` ou les preuves de maîtrise.

## 11. Conditional / multiple opinions

La lecture du contexte conditionnel est centralisée et limitée à :

1. `activity.conditions` ;
2. `kp.pedagogy.conditions` ;
3. `kp.conditions`.

Aucune lecture depuis une activité sœur et aucune déduction depuis `rule`,
`claims` ou l'explication n'est effectuée.

Le JSON actuel ne contient pas de contexte explicite au niveau KP/pedagogy pour
les 23 activités rejetées. Elles restent donc volontairement indisponibles :

- Situations : KPs 002, 012, 014, 015, 024, 025, 043, 048, 050, 062, 063,
  070, 072, 074 et 075 ;
- QCM et V/F : KPs 024, 050, 070 et 075.

`multiple_opinions` est conservé dans les activités normalisées et signalé dans
les trois mini-jeux concernés, sans transformation du texte.

## 12. Persistance

- `normalizeKpProgression` fusionne les valeurs par défaut avec les anciens
  objets.
- Les compteurs invalides deviennent `0` et les collections manquantes sont
  recréées.
- Les anciennes preuves dupliquées sont dédupliquées par `activity_id`.
- Le reset Profil/Réglages supprime `halakhapp_kp_progression`, XP, streak et
  date de streak.
- Une session objective de cinq activités persiste exactement 75 XP dans le
  test UI.
- La première session Learning complétée du jour persiste le streak existant ;
  les suivantes du même jour ne le doublent pas.

## 13. Multi-Siman readiness

Le Siman actif est un paramètre de `LearningScreen` et de
`useLearningSession`. Le manifeste central associe un ID à un chemin de
Knowledge JSON. Un futur fichier aplati `/data/siman_N_knowledge.json` dispose
également d'un fallback sans modification du moteur.

L'ajout d'un Siman dans un dossier éditorial spécifique demande uniquement une
entrée de manifeste, pas une réécriture du selector, de la session ou de l'UI.

## 14. Legacy sécurisé

- `learningData.js` : marqué `@deprecated`, hors source pédagogique active.
- `pedagogyEngine.js` : marqué `@deprecated`, génération runtime interdite.
- `ActivityModal.jsx` : marqué legacy ; le chemin actif utilise
  `learning/ActivityRenderer`.
- `scripts/LEARNING_TESTS_LEGACY.md` identifie les anciens scripts comme non
  autoritatifs.
- Le contenu hardcodé “Halakha du jour” et son quiz ont été retirés de
  `LearningScreen.jsx`.

## 15. Tests automatisés

Commande autoritative :

```bash
npm run test:learning
```

Résultat final :

```text
33 tests
33 pass
0 fail
0 skipped
```

Couverture : progression, mastery, migration, reset, validator, JSON réel,
priorités, alternative à l'échec, backfill, rotation d'exposition, scénarios,
queue, retry final, clés d'instance et manifeste multi-Siman.

## 16. Tests UI desktop

Commande autoritative :

```bash
npm run test:learning:ui
```

Scénarios desktop passés :

- parcours complet et fin de session ;
- Flashcard et persistance `learning` ;
- QCM, erreur et anti-double-submit ;
- changement réel d'instance ;
- ScenarioGame reflective ;
- session objective et 75 XP persistés ;
- streak quotidien persisté ;
- retry réel de dernière activité ;
- reset UI complet.

Une inspection indépendante dans le navigateur intégré a confirmé une queue
réelle 1/6 pour 5 KPs, le changement d'activity_id après la Flashcard, le panneau
debug complet et zéro erreur console.

## 17. Tests UI mobile/touch

Viewport : `375 × 812`, contexte Playwright `hasTouch: true`.

Scénarios mobile passés :

- parcours complet et fin de session ;
- Flashcard ;
- QCM avec erreur et reprise ;
- ScenarioGame reflective ;
- V/F avec de vrais `TouchEvent` et dépassement du seuil de swipe ;
- changement d'activité et persistance.

Mesure navigateur complémentaire : `innerWidth = 375`, `scrollWidth = 370`,
donc aucun débordement horizontal global. Aucune erreur console critique.

Résultat Playwright final global :

```text
14 cas projetés
10 scénarios exécutés et passés
4 skips attendus (cas volontairement limités au projet desktop ou mobile)
0 fail
```

Les échecs intermédiaires de construction concernaient deux locators d'option
et une précondition de priorité de test ; ils ont été corrigés, puis toutes les
suites ont été relancées jusqu'au résultat final ci-dessus.

## 18. Build

Commande :

```bash
npm run build
```

Résultat final :

```text
Vite 5.4.21
83 modules transformés
build réussi en 4.14 s
```

Le seul avertissement est la taille du bundle principal (environ 1,76 MB,
416 KB gzip). Il ne bloque pas le Learning Core mais mérite un découpage futur.

## 19. Problèmes restant non bloquants

1. Les 23 activités conditional restent rejetées jusqu'à ce que le pipeline
   éditorial fournisse un contexte explicite validé.
2. Les KPs sans deux activités objectives distinctes ne peuvent pas devenir
   `mastered` ; c'est une limite volontaire des données, pas un bug du moteur.
3. La rotation des contenus d'exposition est volontairement simple pour V1.
4. Le manifeste multi-Siman reste déclaratif ; il n'existe pas encore de
   découverte backend automatique.
5. Le bundle de production dépasse le seuil Vite de 500 KB.
6. La gamification globale reste minimale : XP par réussite et un streak par
   première session complétée du jour, sans redesign des récompenses.

## 20. Recommandations futures

1. Corriger éditorialement les contextes conditional manquants dans le pipeline
   source, puis laisser le validateur les réadmettre automatiquement.
2. Ajouter de nouvelles preuves objectives uniquement lorsqu'elles sont
   rédigées et validées par le pipeline éditorial.
3. Ajouter les prochains Simanim au manifeste et exécuter les deux suites avant
   activation UI.
4. Extraire les écrans lourds en imports dynamiques pour réduire le bundle.
5. Améliorer les transitions et l'accessibilité sans multiplier les mini-jeux.
6. Conserver `npm run test:learning`, `npm run test:learning:ui` et
   `npm run build` comme gate obligatoire avant livraison.

## Verdict

```text
✅ LEARNING CORE V1 READY
```
