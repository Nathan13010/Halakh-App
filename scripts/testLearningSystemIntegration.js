import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simulation de localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) { return store[key] || null; },
    setItem: function(key, value) { store[key] = value.toString(); },
    removeItem: function(key) { delete store[key]; },
    clear: function() { store = {}; }
  };
})();
global.localStorage = localStorageMock;
global.window = {};

import { getKpProgression, updateKpProgression, resetAllProgressions } from '../src/services/progressionTracker.js';
import { validateActivity } from '../src/services/activityValidator.js';

let report = [];
const log = (msg) => {
  console.log(msg);
  report.push(msg);
};

const runTest = (name, testFn) => {
  try {
    testFn();
    log(`- **${name}** : ✅ PASS`);
  } catch (error) {
    log(`- **${name}** : ❌ FAIL - ${error.message}`);
  }
};

const assert = (condition, msg) => {
  if (!condition) throw new Error(msg);
};

log("# 4. Simulation de Session Complète");

resetAllProgressions();

const DUMMY_KP_ID = "kp-test-session";
const AVAILABLE_TYPES = ['flashcard', 'multiple_choice', 'practical_situation', 'true_false'];

runTest("Cas A — Nouveau KP", () => {
  resetAllProgressions();
  
  // Simulation : Flashcard réussie (ou lue)
  let prog = updateKpProgression(DUMMY_KP_ID, "act-flash-1", "flashcard", true, AVAILABLE_TYPES);
  assert(prog.status === "practicing", `Status attendu practicing après flashcard seule, eu: ${prog.status}`);
  assert(prog.streak === 1, "Streak doit valoir 1");
  
  // QCM réussi
  prog = updateKpProgression(DUMMY_KP_ID, "act-qcm-1", "multiple_choice", true, AVAILABLE_TYPES);
  // Avec 1 QCM et 1 flashcard, on a seulement 'multiple_choice' maîtrisé = 1 type actif.
  // totalSuccessOnActive = 1 => pas encore maîtrisé, status practicing
  assert(prog.status === "practicing", `Status attendu practicing (car 1 seul type actif réussi 1 fois), eu: ${prog.status}`);
  assert(prog.correct === 2, "2 réponses correctes en tout");
  assert(prog.attempts === 2, "2 tentatives");
});

runTest("Cas B — QCM réussi (impact tracker)", () => {
  resetAllProgressions();
  let prog = updateKpProgression(DUMMY_KP_ID, "act-qcm-1", "multiple_choice", true, AVAILABLE_TYPES);
  assert(prog.attempts === 1, "attempts +1");
  assert(prog.correct === 1, "correct +1");
  assert(prog.wrong === 0, "wrong = 0");
  assert(prog.streak === 1, "streak +1");
  assert(prog.activities_mastered.length === 1 && prog.activities_mastered[0].id === "act-qcm-1", "Activité enregistrée dans mastered");
});

runTest("Cas C — QCM échoué", () => {
  resetAllProgressions();
  // 1 succès préalable pour tester le reset
  updateKpProgression(DUMMY_KP_ID, "act-qcm-1", "multiple_choice", true, AVAILABLE_TYPES);
  let prog = updateKpProgression(DUMMY_KP_ID, "act-qcm-1", "multiple_choice", false, AVAILABLE_TYPES);
  
  assert(prog.attempts === 2, "attempts = 2");
  assert(prog.wrong === 1, "wrong = 1");
  assert(prog.streak === 0, "streak doit être remis à 0");
  assert(prog.status === "needs_review", "status doit être needs_review");
  assert(prog.last_failed_activity_id === "act-qcm-1", "last_failed_activity_id doit être correct");
});

runTest("Cas D — Activité conditionnelle invalide bloquée", () => {
  const badAct = {
    activity_id: "bad-1", knowledge_point_id: "kp-cond", source_seif: "1", type: "multiple_choice", validated: true,
    question: "Q", options: ["A", "B"], correct_answer: "A"
  };
  const kp = { halakha_status: "conditional" }; // sans pedagogy.conditions
  
  const v = validateActivity(badAct, kp);
  assert(v.isValid === false, "L'activité conditionnelle sans condition explicite doit être refusée.");
});

runTest("Cas E — Activité multiple_opinions", () => {
  const goodAct = {
    activity_id: "good-1", knowledge_point_id: "kp-cond", source_seif: "1", type: "multiple_choice", validated: true,
    question: "Q", options: ["A", "B"], correct_answer: "A"
  };
  const kp = { halakha_status: "multiple_opinions" };
  const v = validateActivity(goodAct, kp);
  assert(v.isValid === true, "L'activité multiple opinions est acceptée et le validateur n'altère pas les données.");
});

runTest("Cas F — Activité falsifiée (validated: false)", () => {
  const fakeAct = {
    activity_id: "bad-2", knowledge_point_id: "kp-1", source_seif: "1", type: "multiple_choice", validated: false,
    question: "Q", options: ["A", "B"], correct_answer: "A"
  };
  const v = validateActivity(fakeAct, {});
  assert(v.isValid === false, "Activité avec validated=false est strictement bloquée.");
});

log("");
log("# 5. Vérification de la maîtrise (Mastery)");

runTest("1. 3 Flashcards réussies → PAS mastered", () => {
  resetAllProgressions();
  updateKpProgression(DUMMY_KP_ID, "fc-1", "flashcard", true, AVAILABLE_TYPES);
  updateKpProgression(DUMMY_KP_ID, "fc-2", "flashcard", true, AVAILABLE_TYPES);
  let prog = updateKpProgression(DUMMY_KP_ID, "fc-3", "flashcard", true, AVAILABLE_TYPES);
  assert(prog.status === "practicing", "Le statut reste practicing");
});

runTest("2. 2 QCM différents réussis → mastered", () => {
  resetAllProgressions();
  updateKpProgression(DUMMY_KP_ID, "qcm-1", "multiple_choice", true, AVAILABLE_TYPES);
  let prog = updateKpProgression(DUMMY_KP_ID, "qcm-2", "multiple_choice", true, AVAILABLE_TYPES);
  assert(prog.status === "mastered", "mastered car 2 succès actifs");
});

runTest("3. 1 QCM + 1 Situation réussis → mastered", () => {
  resetAllProgressions();
  updateKpProgression(DUMMY_KP_ID, "qcm-1", "multiple_choice", true, AVAILABLE_TYPES);
  let prog = updateKpProgression(DUMMY_KP_ID, "sit-1", "practical_situation", true, AVAILABLE_TYPES);
  assert(prog.status === "mastered", "mastered car 2 types d'activité actifs maîtrisés");
});

runTest("4. QCM réussi + erreur + Situation réussie", () => {
  resetAllProgressions();
  updateKpProgression(DUMMY_KP_ID, "qcm-1", "multiple_choice", true, AVAILABLE_TYPES); // status = practicing, streak=1
  updateKpProgression(DUMMY_KP_ID, "qcm-2", "multiple_choice", false, AVAILABLE_TYPES); // status = needs_review, streak=0
  
  // Avec la règle actuelle, 1 qcm maîtrisé et 1 situation = 2 types !
  let prog = updateKpProgression(DUMMY_KP_ID, "sit-1", "practical_situation", true, AVAILABLE_TYPES);
  // Le script de progressionTracker.js évalue typesMastered.
  // Les masteredActs ne sont pas vidés lors d'une erreur. 
  // Ce comportement signifie que "l'expérience" n'est pas perdue, mais le statut needs_review forçait la révision.
  // Une fois réussi, on re-évalue les types.
  assert(prog.status === "mastered", "Le streak à 0 avant la situation n'empêche pas le passage à mastered car les types maîtrisés (QCM, Situation) sont validés.");
});

// Ecriture du fichier rapport brut (qui sera repris dans le md)
fs.writeFileSync(path.join(__dirname, '..', 'temp_integration_report.txt'), report.join('\n'), 'utf-8');
console.log("Script de test terminé avec succès.");
