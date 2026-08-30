# CODEX LEARNING CORE AUDIT

Date de l'audit : 30 août 2026
Périmètre : repository local actuel, données du Siman 1, Learning Core, scripts de test, build Vite et parcours UI réel desktop/mobile.
Méthode : audit avant modification. Aucun fichier source ni contenu halakhique n'a été modifié pendant cette passe.

## Résumé exécutif

Le Learning Core possède une bonne séparation générale entre données, validation, sélection, session, rendu et progression. Les QCM et V/F utilisent bien les réponses du JSON, le contexte `halakha_status` est propagé, les protections double-submit des mini-jeux testés fonctionnent, le build passe et les activités ouvertes ne donnent plus artificiellement de points de maîtrise.

Le système n'est toutefois pas prêt pour une V1. Les blocages principaux sont les suivants :

1. dans le parcours UI réel, une Flashcard lue laisse le KP en `non_started`, et non en `learning` ;
2. `ScenarioGame` est inatteignable, car le selector transforme les `practical_situation` en `card` avant le routeur UI ;
3. la maîtrise peut être obtenue en réussissant deux fois le même QCM, alors que la règle exige deux preuves distinctes ;
4. après un premier QCM réussi, le selector reprend ce QCM déjà maîtrisé au lieu du V/F encore non maîtrisé ;
5. le validateur central rejette 23 activités pourtant présentes et marquées `validated: true` dans le JSON, faute de contexte conditionnel à l'endroit attendu ;
6. plusieurs scripts verts testent une ancienne sémantique ou seulement la forme des données, sans exercer le chemin UI réel.

Verdict détaillé en fin de rapport : **⚠️ CORRECTIONS REQUIRED BEFORE V1**.

## A. Architecture réelle du projet

Le projet est une SPA/PWA statique :

- React 18 et ReactDOM ;
- Vite 5 ;
- TailwindCSS 3 ;
- données textuelles et pédagogiques servies depuis `public/data/` ;
- progression, XP, streak, favoris et préférences conservés dans `localStorage` ;
- aucune base de données n'est utilisée par le Learning Core ;
- le dépôt contient aussi un important pipeline de génération/validation des textes, des scripts historiques, des données `brut/` et `complet/`, et un assistant IA distinct du Learning Core.

Entrées applicatives principales :

- `src/main.jsx` monte `App` sous `React.StrictMode` ;
- `src/App.jsx` gère les onglets Bibliothèque, Apprentissage, IA et Profil ;
- `src/components/LearningScreen.jsx` instancie actuellement le moteur avec `useLearningSession("siman_1", 5)` ;
- `vite.config.js` sert sur le port 5173 et surveille les JSON de `public/data/`.

Le worktree était déjà très modifié au début de l'audit, notamment dans `LearningScreen.jsx`, `useLearningSession.js`, `activitySelector.js` et `progressionTracker.js`, avec plusieurs nouveaux fichiers de mini-jeux, tests et rapports non suivis par Git. Ils ont été considérés comme l'état courant à auditer. D'autres fichiers de génération ont continué à apparaître pendant l'audit, vraisemblablement via un processus externe déjà actif ; ils n'ont pas été touchés.

## B. Architecture réelle du Learning Core

Le chemin actif est constitué de :

- `src/services/knowledgeService.js` : chargement et mise en cache du JSON de connaissances ;
- `src/services/activityValidator.js` : validation centrale et classification objective/réflective ;
- `src/services/activitySelector.js` : tri des KP, choix des activités et normalisation UI ;
- `src/services/progressionTracker.js` : lecture/écriture de la progression locale et calcul de mastery ;
- `src/hooks/useLearningSession.js` : construction et orchestration de la session ;
- `src/components/LearningScreen.jsx` : écran d'apprentissage et modales de session/fin ;
- `src/components/learning/ActivityRenderer.jsx` : routeur vers les mini-jeux ;
- `ClassicQuiz.jsx`, `SwipeGame.jsx`, `ScenarioGame.jsx` : mini-jeux spécialisés ;
- `LearningCard.jsx` : rendu legacy des Flashcards.

Éléments legacy ou parallèles non utilisés par le chemin courant :

- `src/components/ActivityModal.jsx` : ancienne modale générique ;
- `src/services/pedagogyEngine.js` : moteur de génération à la volée non importé dans le flux actuel ;
- `src/data/learningData.js` : anciens niveaux et quiz hardcodés non importés par le Learning Core actuel.

`pedagogyEngine.js` est particulièrement sensible : il sait encore générer des QCM/V/F en UI à partir de `common_trap` et de hasard. Il n'est pas actif aujourd'hui, mais il contredit la règle « JSON validé uniquement » s'il était reconnecté par erreur.

## C. Flux des données

Flux réel de la session dynamique :

```text
public/data/.../siman_1_knowledge.json
→ knowledgeService.fetchKnowledgeForSiman
→ activitySelector.getQueueForSession
→ activityValidator.validateActivity
→ normalisation UI (type + rawType + halakha_status)
→ useLearningSession
→ ActivityRenderer
→ ClassicQuiz / SwipeGame / LearningCard
→ submitAnswer
→ progressionTracker.updateKpProgression
→ localStorage
→ nouvelle session / progression globale
```

La source pédagogique réelle a été retrouvée ici :

`public/data/הלכות הנהגת אדם בבוקר/siman_1_knowledge.json`

Statistiques constatées :

| Élément | Nombre |
|---|---:|
| Knowledge Points | 76 |
| Flashcards | 76 |
| QCM `multiple_choice` | 10 |
| V/F `true_false` | 10 |
| Situations `practical_situation` | 21 |
| Total activités | 117 |
| KP avec Flashcard uniquement | 49 |

Toutes les activités ont un `activity_id` unique, un `knowledge_point_id` correspondant au KP, et un `source_seif` non vide. Aucun doublon d'ID n'a été trouvé.

Limite multi-Siman : `knowledgeService.js` ne connaît explicitement que le mapping de dossier de `siman_1`. Le fallback suppose un fichier aplati dans `/data/`. Ajouter un Siman dans un nouveau dossier hébreu ne sera donc pas automatiquement découvert sans convention supplémentaire ou modification du mapping.

## D. Mini-jeux existants

### Flashcard / LearningCard

- Source : `flashcard` dans le JSON.
- Normalisation : `type: "card"`, `rawType: "flashcard"`.
- Rôle actuel attendu : exposition/découverte.
- Rendu : `LearningCard` avec titre, règle, explication et exemple du KP.
- Le bouton « J'ai compris » ne doit pas signifier réussite objective.

### ClassicQuiz

- Source : `multiple_choice`.
- Options et `correct_answer` viennent du JSON.
- Comparaison exacte du texte sélectionné avec `correct_answer`.
- Aucun distracteur n'est généré dans le composant.
- Feedback correct/incorrect et explication du JSON.
- Gardes `useRef` et state contre les doubles sélections et doubles clics sur Continuer.

### SwipeGame

- Source : `true_false`.
- `is_true` vient du JSON.
- Mapping vérifié dans le code et par bouton réel : gauche/FAUX = `false`, droite/VRAI = `true`.
- Boutons natifs accessibles, feedback, protection double-submit et `touch-pan-y`.
- Le drag du contrôleur navigateur émettant des événements souris et non tactiles, le geste tactile lui-même n'a pas pu être validé de façon concluante ; les boutons et le mapping ont été validés en largeur mobile.

### ScenarioGame

- Le composant implémente correctement sur le papier le parcours Situation → Question → Révélation → Réponse → Continuer.
- Une situation ouverte appelle finalement `onSubmit(null)` et ne propose pas « J'avais trouvé ».
- Une situation à options peut produire un résultat objectif.
- **Blocage actuel : le composant n'est jamais atteint.** Dans `activitySelector.js:165-166`, une `practical_situation` est normalisée en `type: "card"`. `ActivityRenderer` route donc vers la Flashcard legacy, pas vers `ScenarioGame`.
- Conséquence : la situation, la question et la réponse sont concaténées dans une carte et la réponse est visible immédiatement, sans séquence réflexive.

Autre risque : pour une future situation avec `options` mais sans `correct_answer`, le validateur actuel l'accepte, `ScenarioGame` considère qu'elle a des options, mais `isObjectivelyAssessable` la considère non objective. Toutes les options paraîtraient alors fausses à l'écran, tandis que le tracker ignorerait le résultat.

## E. Validation et sécurité

Le validateur central impose correctement :

- activité non nulle ;
- `activity_id` ;
- `knowledge_point_id` ;
- `source_seif` ;
- type reconnu ;
- `validated === true` ;
- champs spécifiques Flashcard, QCM, V/F et Situation ;
- présence de `correct_answer` dans les options d'un QCM ;
- présence d'un texte de condition pour un KP `conditional`.

Audit réel des 117 activités via `validateActivity` :

| Résultat central | Nombre |
|---|---:|
| Acceptées | 94 |
| Rejetées | 23 |

Les 23 rejets ont la même cause : `Activité conditionnelle sans texte de condition fourni`.

Répartition des rejets :

- 15 situations ouvertes ;
- 4 QCM ;
- 4 V/F.

Les 20 activités brutes objectivement évaluables sont 10 QCM + 10 V/F. Après validation centrale, seules 12 restent sélectionnables : 6 QCM + 6 V/F.

Le JSON place souvent un texte `conditions` sur la Flashcard d'un KP conditionnel, mais pas sur ses autres activités, et ne fournit pas `kp.pedagogy.conditions`. Le contrat entre données et validateur n'est donc pas aligné. Il ne faut pas inventer ces conditions dans le code : il faut décider où le contexte validé doit vivre, puis corriger soit le schéma éditorial, soit la règle de lecture du contexte, avec validation humaine.

Lacunes du validateur :

- il ne compare pas `activity.knowledge_point_id` à `kp.id` ;
- il ne vérifie pas la cohérence de `source_seif` avec les sources du KP ;
- il ne valide pas `halakha_status` contre un enum ;
- il ne demande pas de contexte explicite pour `multiple_opinions` ;
- pour une future situation objective, il ne vérifie pas que `correct_answer` existe et appartient aux `options` ;
- `answer` et `correct_answer` n'ont pas de contrat unifié pour `practical_situation`.

Le principe INVALID → REJECT est bien respecté dans le selector : aucune réparation ou invention n'a été trouvée dans ce chemin actif.

## F. Progression et mastery

Modèle par défaut réel :

```json
{
  "status": "non_started",
  "attempts": 0,
  "correct": 0,
  "wrong": 0,
  "last_seen": null,
  "last_correct": null,
  "next_review": null,
  "streak": 0,
  "activities_mastered": [],
  "activity_success_counts": {},
  "last_failed_activity_id": null
}
```

Points corrects :

- `isCorrect === null` met à jour `attempts` et `last_seen`, sans modifier `correct`, `wrong`, `streak` ou `activities_mastered` ;
- une erreur objective met le statut en `needs_review`, incrémente `wrong`, remet le streak à zéro et stocke `last_failed_activity_id` ;
- une Flashcard ou une situation ouverte n'est pas ajoutée à `activities_mastered` dans le chemin UI actuel ;
- le `streak` n'est pas utilisé comme condition de `mastered` ;
- une seule réussite objective ne donne pas `mastered` ;
- un QCM + un V/F distincts peuvent donner `mastered` ;
- un QCM + une future situation réellement objective peuvent donner `mastered`.

Incohérence importante : le calcul additionne toutes les valeurs de `activity_success_counts`. Réussir **deux fois le même QCM** produit donc `totalSuccessOnActive === 2` et `mastered`, même si `activities_mastered` ne contient qu'un seul ID. Cela ne respecte pas la règle « deux QCM distincts réussis ».

Le selector aggrave ce point : après avoir maîtrisé le QCM de `s1-kp-006`, il choisit de nouveau ce même QCM au lieu du V/F non maîtrisé. Le parcours peut donc atteindre `mastered` en répétant le même QCM, sans jamais voir le V/F.

`next_review` existe dans le modèle mais n'est jamais calculé. Ce n'est pas bloquant tant que la répétition espacée est explicitement hors périmètre V1.

## G. ActivitySelector / sessions

Priorité codée et confirmée :

```text
needs_review > non_started > learning > practicing > mastered
```

Puis :

- niveau 1 > 2 > 3 > 4 ;
- importance `essential` > `important` > `useful` > `reference`.

Le JSON utilise aussi `secondary` sur 15 KP, mais `IMPORTANCE_ORDER` ne contient pas cette valeur. Ces KP reçoivent donc un poids 0, inférieur à `reference`, ce qui doit être confirmé ou corrigé explicitement.

La cible de 5 KP distincts est implémentée par `kps.slice(0, sessionSize)`. Une activité supplémentaire peut être ajoutée pour un KP, ce qui donne par exemple 6 activités pour 5 KP. C'est cohérent avec la cible conceptuelle.

Problème de backfill : les 5 KP sont tranchés avant de vérifier qu'ils possèdent une activité sélectionnable. Si l'un d'eux n'a plus aucune activité valide, la session contient moins de 5 KP et le selector ne prend pas le KP suivant. Le test manuel l'a montré avec un KP `needs_review` conditionnel dont toutes les alternatives étaient rejetées.

Pour `learning`, le selector courant contient déjà la bonne intention : il évite la Flashcard si un QCM, un V/F ou une situation valide existe, et ne retombe sur la Flashcard qu'en fallback. Le problème principal est que le hook ne place pas réellement la Flashcard en `learning`.

Autres incohérences de sélection :

- dès qu'un test est déjà maîtrisé, le code saute le bloc des `unmasteredTests` et peut reprendre le premier test déjà maîtrisé ;
- les 49 KP Flashcard-only ne pourront jamais devenir `mastered` ; après exposition de tous les nouveaux KP, ils risquent de monopoliser `learning` sans critère de récence ;
- `last_seen` n'est pas utilisé pour faire tourner les KP de même priorité ;
- le choix est déterministe et prend généralement la première activité.

## H. Statuts non_started / learning / practicing / needs_review / mastered

| Statut attendu | Sémantique attendue | Comportement actuel |
|---|---|---|
| `non_started` | jamais étudié | correct par défaut, mais reste à tort après une Flashcard réellement lue |
| `learning` | contenu découvert, pas encore évalué | fonction `markKpAsLearning` disponible, mais non déclenchée par le type normalisé réel |
| `practicing` | début d'évaluation objective | obtenu après une première réussite objective ; les anciens tests l'attendent aussi après Flashcard directe, ce qui est obsolète |
| `needs_review` | erreur objective | correct dans le chemin QCM/VF réel |
| `mastered` | preuves objectives suffisantes | pas de rôle direct du streak, mais répétition du même QCM suffisante à tort |

Le modèle sémantique demandé est réalisable sans faire passer les activités réflectives en `practicing`.

## I. Audit du problème Flashcard → practicing

### A. Comportement actuel après nouveau KP → Flashcard

Dans le parcours UI réel, le statut final est **`non_started`**.

Preuve : après une première session, la session suivante a de nouveau affiché `s1-kp-001-flashcard-01`. Le panneau debug indiquait :

```text
STATUS: non_started
ATTEMPTS: 1
CORRECT: 0
WRONG: 0
STREAK: 0
```

Le hook tente de marquer les Flashcards avec `if (act.type === 'flashcard')` (`useLearningSession.js:53`), mais le selector les a déjà normalisées en `type: 'card'` avec `rawType: 'flashcard'` (`activitySelector.js:152`). La condition ne s'exécute donc jamais. Au clic, `isObjectivelyAssessable` retourne faux et le tracker reçoit `isCorrect: null`, ce qui laisse le statut inchangé.

Le comportement n'est donc ni `learning` ni `practicing` dans l'UI actuelle.

### B. Pourquoi la Flashcard se répétait-elle sur un KP learning ?

Trois causes distinctes ont existé ou existent :

1. l'ancienne condition du selector proposait une Flashcard pour `non_started || learning` tant qu'elle n'était pas dans `activities_mastered` ; or les Flashcards ne sont jamais ajoutées à `activities_mastered`, donc la condition restait vraie indéfiniment ;
2. ce point a été corrigé dans le selector courant, mais le hook ne produit plus le statut `learning` à cause du conflit `type`/`rawType` ; le KP reste donc `non_started` et reprend la Flashcard ;
3. pour un KP comme `s1-kp-024`, les activités alternatives conditionnelles sont toutes rejetées par le validateur. Le fallback Flashcard est alors le seul choix possible et se répète même en `learning`.

### C. Peut-on conserver Flashcard → learning et sélectionner ensuite une autre activité ?

Oui. C'est la bonne séparation de responsabilités. Le tracker doit conserver la sémantique `learning`, tandis que le selector doit préférer une activité alternative valide pour un KP `learning`. Le selector courant contient déjà cette branche.

### D. Modification minimale et propre recommandée

La correction minimale ne doit pas transformer une exposition en réussite :

1. au moment où l'utilisateur termine réellement une Flashcard, détecter `currentActivity.rawType === 'flashcard'` et appeler `markKpAsLearning` ;
2. conserver ensuite l'appel `updateKpProgression(..., null, ...)` pour enregistrer `attempts` et `last_seen` sans points de réussite ;
3. supprimer ou remplacer le marquage à l'initialisation de la file. Le corriger simplement en `rawType` à cet endroit marquerait comme vues toutes les Flashcards en attente, même si l'utilisateur ferme la session avant de les voir ;
4. conserver la branche actuelle du selector qui, pour `learning`, choisit un test ou une situation valide avant la Flashcard ;
5. ajouter un test du chemin hook/session réel, et non seulement un appel direct au tracker.

Cette correction conserve exactement :

```text
non_started → Flashcard réellement terminée → learning
learning → première activité objective réussie → practicing
practicing → preuves objectives distinctes → mastered
```

## J. Reflective vs Objective

`isObjectivelyAssessable` classe actuellement :

- QCM avec `correct_answer` : objectif ;
- V/F avec `is_true` booléen : objectif ;
- situation avec options + `correct_answer` : objectif ;
- Flashcard : non objectif ;
- situation ouverte : non objectif.

Le hook ignore correctement une valeur visuelle `true/false` si l'activité n'est pas objectivement évaluable et envoie `null` au tracker.

Les 21 situations actuelles sont ouvertes : aucune ne possède d'options, aucune ne doit compter pour mastery. Ce principe est correct dans `ScenarioGame` et le hook, mais il n'est pas exercé dans l'UI parce que les situations sont routées comme des cartes.

Plusieurs tests historiques simulent encore une Flashcard par `correct: true` et une situation ouverte par `practical_situation, correct: true`. Leurs résultats ne prouvent pas le comportement du chemin actuel.

## K. Anti-répétition

Comportements corrects observés :

- une erreur QCM enregistre `last_failed_activity_id` ;
- la file de la session passe de 6 à 7 activités et place une reprise plus tard ;
- après fermeture/rechargement, le KP `needs_review` est prioritaire ;
- le selector choisit le V/F alternatif au lieu de reprendre immédiatement le QCM échoué ;
- aucune duplication consécutive d'ID n'a été trouvée dans la file initiale.

Limites :

- le test d'anti-répétition de `masteryFinalAudit.js` est un faux positif pour `s1-kp-002` : l'activité échouée est absente, mais la sélection est vide parce que l'alternative est invalide ;
- après réussite d'une activité alternative, `last_failed_activity_id` est effacé ; la mémoire de l'erreur ne subsiste plus ;
- après un QCM maîtrisé, le selector peut reprendre ce même QCM au lieu d'un V/F non maîtrisé ;
- si une erreur survient sur la dernière activité de la file, `submitAnswer` ajoute la reprise via un state asynchrone, puis `nextActivity` peut voir l'ancienne longueur et marquer immédiatement la session `completed`. La reprise ajoutée risque alors d'être ignorée ;
- `recentlyUsedIds` ne protège que la file en construction et pas les sessions successives.

## L. Persistance

Progression KP :

- clé : `halakhapp_kp_progression` ;
- format JSON local ;
- lecture et écriture protégées par `try/catch` ;
- persistence confirmée après rechargement via le debug UI.

Autres clés :

- XP : `mishne_mikra_xp` ;
- streak et date : `mishne_mikra_streak`, `mishne_mikra_last_streak_date` ;
- préférences, favoris et repères sous d'autres clés `mishne_mikra_*`.

Le test UI a confirmé que les 15 XP gagnés sur le QCM réussi restent présents après rechargement.

Problèmes :

- l'action de réinitialisation du Profil supprime XP/streak mais pas `halakhapp_kp_progression`, alors que le toast annonce « Progression réinitialisée » ;
- `getKpProgression` renvoie un ancien objet stocké sans le fusionner avec les valeurs par défaut. Une progression issue d'une version antérieure et dépourvue de nouveaux compteurs peut produire des `undefined` ou `NaN` ;
- la file et l'index de session ne sont pas persistés ; fermer la modale recharge toute l'application et revient à la Bibliothèque ;
- aucun versionnage/mécanisme de migration du schéma de progression n'existe.

## M. Tests existants

Scripts Learning Core retrouvés et lus :

- `scripts/masteryFinalAudit.js` ;
- `scripts/testLearningSystemIntegration.js` ;
- `scripts/testPracticalSituationValidation.js` ;
- `scripts/testTrueFalseValidation.js` ;
- `scripts/testClassicQuizValidation.js` ;
- `scripts/testKpJourney.js` ;
- `scripts/testLearningEngine.js` ;
- `scripts/simulateSessions.js` ;
- `scripts/manualValidationSim.js` ;
- `scripts/masteryAuditSim.js` ;
- `scripts/testPedagogyEngine.cjs` ;
- `scripts/validatePedagogicalData.cjs` ;
- `scripts/audit_knowledge.cjs`.

Il n'existe pas de script `npm test` dans `package.json`. Les tests sont des scripts Node indépendants, plusieurs écrivent directement des rapports dans le dépôt. Ils ont donc été exécutés dans une copie temporaire minimale afin de préserver les rapports locaux déjà modifiés.

Rapports existants lus :

- `mastery_final_audit.md` ;
- `mastery_final_audit_v2.md` ;
- `mastery_logic_audit.md` ;
- `classic_quiz_validation_report.md` ;
- `learning_engine_test_report.md` ;
- `manual_test_results.txt` ;
- `temp_integration_report.txt` ;
- `scripts/audit_report.md` ;
- `scripts/integration_report.md`.

Rapports cités dans la passation mais absents du repository :

- `scenario_game_assessment_audit.md` ;
- `full_learning_session_validation.md` ;
- `swipe_game_manual_validation.md` ;
- `scenario_game_implementation_report.md` ;
- `true_false_implementation_report.md` ;
- `classic_quiz_implementation_report.md`.

`mastery_final_audit_v2.md` conclut « SYSTEM READY », mais cette conclusion n'est pas corroborée par le chemin actuel : il ne détecte pas la Flashcard restant `non_started`, l'inaccessibilité de `ScenarioGame`, les 23 rejets centraux ni la répétition du même QCM pour mastery.

## N. Résultats des tests exécutés

| Script | Exit | Résultat utile |
|---|---:|---|
| `testClassicQuizValidation.js` | 0 | 8 tests unitaires PASS ; 6 QCM réels acceptés, 4 rejetés |
| `testPracticalSituationValidation.js` | 0 | 21/21 valides selon son schéma simplifié ; ne teste pas le contexte conditionnel central |
| `testTrueFalseValidation.js` | 0 | 10/10 valides selon son schéma simplifié ; 4 sont pourtant rejetés centralement |
| `validatePedagogicalData.cjs` | 0 | structure/traçabilité de base PASS ; ne reproduit pas `activityValidator` |
| `testLearningSystemIntegration.js` | 0 | logs PASS, mais simule Flashcard=`true` et situations ouvertes comme objectives |
| `masteryFinalAudit.js` | 0 | cas A-M annoncés PASS ; plusieurs appels directs ne reproduisent pas le hook réel |
| `testLearningEngine.js` | **1** | FAIL sur l'ancienne attente « une situation seule → mastered » ; l'attente du script est désormais obsolète |
| `testKpJourney.js` | 0 | montre 10 répétitions de Flashcard sur `s1-kp-024`, car toutes ses alternatives sont rejetées |
| `simulateSessions.js` | 0 | nouveau profil : 5 KP/6 activités ; profil erreur : V/F prioritaire |
| `manualValidationSim.js` | 0 | son propre test de priorité affiche `false`, sans faire échouer le processus |
| `masteryAuditSim.js` | 0 | simulation exécutée ; conclusion textuelle contient encore l'ancienne exception Situation |
| `testPedagogyEngine.cjs` | 0 | génère un rapport à partir d'une copie de logique, pas d'un import du code production |
| `audit_knowledge.cjs` | 0 | audit éditorial généré ; ce n'est pas un test du runtime |

Conclusion tests : les scripts donnent une couverture utile des règles unitaires, mais ils ne constituent pas encore une suite fiable. Certains PASS sont de faux positifs ou vérifient une sémantique abandonnée.

## O. Résultat du build

Commande : `npm run build`

Résultat final : **PASS, exit code 0**.

```text
Vite 5.4.21
81 modules transformés
Build terminé en 4.70 s
```

Artefacts principaux :

- CSS : 69.42 kB, gzip 11.11 kB ;
- JS : 1,761.98 kB, gzip 416.07 kB.

Avertissement non bloquant : chunk JS supérieur à 500 kB. Le code splitting est une dette de performance, pas un blocage fonctionnel du Learning Core V1.

Le premier essai sandboxé a échoué sur une permission de lecture du chemin parent ; le même build relancé avec les permissions appropriées a réussi. Ce premier échec n'était pas une erreur du projet.

## P. Résultat du test UI réel

Environnement : serveur Vite réel, navigateur intégré, parcours desktop puis viewport demandé de 375 px (largeur DOM utile observée : 370 px).

### Parcours desktop

- ouverture de l'onglet Apprentissage : PASS ;
- démarrage de session : PASS ;
- file initiale : 5 KP distincts, 6 activités ;
- Flashcards : affichage, contenu, bouton et transitions PASS ;
- ClassicQuiz : options JSON, bonne/mauvaise réponse, feedback et explication PASS ;
- double-clic sur option et double-clic sur Continuer : une seule transition observée, PASS ;
- erreur QCM : `needs_review`, `wrong: 1`, `last_failed_activity_id` et reprise de file observés, PASS ;
- session suivante : V/F alternatif choisi en priorité, PASS ;
- SwipeGame par boutons : sens FAUX/VRAI, feedback et double-submit PASS ;
- fin de session : modale de victoire et +15 XP, PASS ;
- rechargement : XP persistant, PASS ;
- console : aucune erreur ou warning dans les parcours testés.

### Défaut Flashcard observé

Après lecture de la première Flashcard, la session suivante affiche de nouveau la même activité avec :

```text
STATUS: non_started
ATTEMPTS: 1
```

Échec confirmé.

### ScenarioGame

Impossible à tester comme mini-jeu réel : le selector le convertit en `card`. Un appel direct au selector sur `s1-kp-044` renvoie :

```json
{
  "type": "card",
  "rawType": "practical_situation",
  "objective": false
}
```

Échec fonctionnel confirmé.

### Responsive proche de 375 px

- aucun overflow horizontal sur la Flashcard (`scrollWidth === clientWidth`) ;
- modal bottom-sheet lisible, bouton visible ;
- QCM lisible ;
- feedback QCM plus haut que la zone visible mais conteneur scrollable correctement (`681 px` visibles pour `772 px` de contenu) ;
- défilement manuel jusqu'au bouton Continuer : PASS ;
- SwipeGame et feedback tiennent dans la zone mobile ;
- navigation inférieure lisible.

Le geste tactile Swipe n'a pas été validé de façon concluante : le contrôleur de test a émis un drag souris alors que le composant écoute `onTouchStart/onTouchMove/onTouchEnd`. Le mapping et les boutons de secours ont été validés ; un test Playwright avec émulation tactile réelle reste à ajouter.

## Q. Bugs/incohérences trouvés

### Bloquants V1

1. Flashcard réelle : `non_started` reste inchangé au lieu de devenir `learning`.
2. `ScenarioGame` inatteignable ; réponse ouverte affichée immédiatement dans une carte.
3. Deux réussites du même QCM suffisent à `mastered`.
4. Selector : QCM déjà maîtrisé repris avant le V/F non maîtrisé.
5. 23 activités `validated: true` rejetées par le contrat conditionnel du runtime.
6. Validateur incomplet pour les futures situations à options.

### Importants

7. Pas de backfill lorsque l'un des 5 KP sélectionnés n'a aucune activité valide.
8. Course de state possible : retry ajouté après une erreur sur la dernière activité, puis session marquée terminée avec l'ancienne longueur.
9. Les mini-jeux ne reçoivent pas de `key={activity.id}`. Deux activités consécutives du même composant peuvent réutiliser `isSubmitted`, `isNextClicked` et la sélection précédente.
10. `secondary` absent du classement des importances.
11. Les 49 KP Flashcard-only peuvent rester indéfiniment `learning` et monopoliser les sessions sans rotation par `last_seen`.
12. Le debug de session est une photographie prise à la construction de la file et n'est pas actualisé après chaque réponse.
13. L'action Profil « réinitialiser la progression » ne supprime pas la progression KP.
14. Absence de migration des anciennes structures localStorage.

### Sécurité de contenu / architecture

15. `LearningScreen.jsx` contient une « Halakha du jour » et ses réponses hardcodées dans le composant, hors chaîne JSON validée.
16. `learningData.js` contient des quiz/distracteurs halakhiques legacy hardcodés ; ils sont actuellement inutilisés mais risqués s'ils sont réactivés.
17. `pedagogyEngine.js` peut générer à la volée des activités et ne doit pas être reconnecté au Learning Core V1 sans refonte conforme à la règle JSON validé uniquement.
18. `LearningCard` affiche tout `halakha_status` non `clear` et non `multiple_opinions` comme « Règle Conditionnelle ». Les 11 KP `custom` sont donc mal étiquetés.
19. Écran et service de connaissances encore partiellement hardcodés pour le Siman 1.

## R. Dette technique réellement importante

Priorité haute :

- une vraie suite de tests automatisés avec assertions et un runner unique ;
- tests d'intégration du hook/session, pas seulement du tracker ;
- tests de composants pour transitions, état réinitialisé entre activités et double-submit ;
- contrat JSON versionné pour conditions, opinions et situations objectives ;
- migration/versionnage de la progression locale ;
- suppression ou quarantaine explicite des chemins legacy contenant du contenu pédagogique hardcodé ou généré.

Priorité moyenne :

- extraction de `simanId` depuis la sélection utilisateur ;
- découverte multi-Siman par manifeste plutôt que mapping manuel ;
- rotation par récence pour les KP de même statut ;
- reprise/annulation propre de session sans `window.location.reload()` ;
- code splitting du gros bundle ;
- actualisation du panneau debug.

## S. Ce qui fonctionne déjà correctement

- séparation globale services → hook → renderer → mini-jeux ;
- chargement du JSON éditorial ;
- traçabilité de base conservée après normalisation ;
- rejet central des activités invalides, sans réparation/invention ;
- options QCM et réponses V/F issues du JSON ;
- distinction objective/réflective présente ;
- situation ouverte conçue sans auto-évaluation subjective ;
- propagation de `halakha_status` vers l'UI ;
- priorité `needs_review` codée ;
- `last_failed_activity_id` utilisé pour chercher une alternative ;
- streak indépendant de mastery ;
- erreur objective → `needs_review` ;
- double-submit QCM/VF protégé et validé en UI ;
- interface desktop/mobile lisible ;
- feedback, modal de fin et XP persistants ;
- build production réussi.

## T. Prochaines étapes recommandées

Ordre minimal recommandé, sans refactoring massif :

1. corriger le passage Flashcard réellement terminée → `learning` dans le hook en utilisant `rawType` au moment de l'interaction ;
2. ajouter un test d'intégration qui reproduit exactement nouveau KP → Flashcard → fermeture/nouvelle session → activité alternative ;
3. préserver `type: "practical_situation"` lors de la normalisation et ajouter `key={activity.id}` au mini-jeu rendu ;
4. tester le parcours ouvert de `ScenarioGame` et garantir `null` jusqu'au tracker ;
5. renforcer le validateur des situations objectives (`options`, `correct_answer`, appartenance aux options) ;
6. aligner, sans inventer de texte, le contrat de conditions entre JSON et validateur, puis réauditer les 23 activités rejetées ;
7. exiger deux `activity_id` objectifs distincts pour mastery ;
8. corriger la préférence du selector pour les tests non maîtrisés avant tout test déjà maîtrisé ;
9. backfiller les KP sans activité valide pour atteindre réellement 5 KP distincts ;
10. corriger la course du retry sur la dernière activité ;
11. remplacer les scripts obsolètes par des assertions alignées sur la sémantique validée ;
12. sortir tout contenu halakhique hardcodé des composants et isoler clairement les modules legacy ;
13. relancer l'ensemble des tests, le build et le parcours UI desktop/mobile, y compris un vrai test tactile.

## Verdict

# ⚠️ CORRECTIONS REQUIRED BEFORE V1

L'architecture générale n'a pas besoin d'une réécriture complète. Les défauts sont localisés et peuvent être corrigés par petites étapes dans le hook, le selector, le validateur, le renderer et les tests. Ils touchent cependant directement la sémantique des statuts, l'accès à ScenarioGame et la preuve de maîtrise ; ils doivent donc être corrigés avant de déclarer le Learning Core V1 prêt.
