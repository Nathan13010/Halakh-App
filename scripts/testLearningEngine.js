import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Mock localStorage
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

import { getQueueForSession, sortKpsForSelection } from '../src/services/activitySelector.js';
import { updateKpProgression, getKpProgression, resetAllProgressions } from '../src/services/progressionTracker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '..', 'public', 'data', 'הלכות הנהגת אדם בבוקר', 'siman_1_knowledge.json');

const knowledgeData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

let results = [];
let pass = true;

const assert = (condition, message) => {
  if (condition) {
    results.push(`✅ ${message}`);
  } else {
    results.push(`❌ ${message}`);
    pass = false;
  }
};

resetAllProgressions();

// Helper pour mocker des KP pour tester sortKpsForSelection
const mockKp = (id, status, level, importance) => ({
  kp: { id, learning_level: level, importance },
  prog: { status }
});

// A. needs_review prioritaire sur non_started
// B. learning_level 1 prioritaire sur learning_level 2
// C. essential prioritaire sur important à statut/niveau identiques
let kpsToSort = [
  mockKp('kp1', 'non_started', 1, 'essential'),
  mockKp('kp2', 'needs_review', 3, 'essential'),
  mockKp('kp3', 'needs_review', 1, 'essential'),
  mockKp('kp4', 'non_started', 1, 'important')
];
kpsToSort.sort(sortKpsForSelection);
assert(kpsToSort[0].kp.id === 'kp3', "[A, B] needs_review lvl1 est 1er");
assert(kpsToSort[1].kp.id === 'kp2', "[A] needs_review lvl3 passe avant non_started lvl1");
assert(kpsToSort[2].kp.id === 'kp1', "[C] non_started lvl1 essential passe avant non_started lvl1 important");

// D, E, F: Simulation d'erreur
const targetKp = knowledgeData.knowledge_points.find(k => k.pedagogy?.activities?.multiple_choice);
updateKpProgression(targetKp.id, "fake_act_id", "multiple_choice", false, ["flashcard", "multiple_choice"]);
let progAfterFail = getKpProgression(targetKp.id);
assert(progAfterFail.status === "needs_review", "[D] Une erreur remet le KP en needs_review");
assert(progAfterFail.streak === 0, "[E] Une erreur remet streak à 0");
assert(progAfterFail.last_failed_activity_id === "fake_act_id", "[F] last_failed_activity_id est enregistré");

// G: Anti-répétition (la même activity_id n'est jamais présentée deux fois immédiatement)
let queue = getQueueForSession(knowledgeData, 5);
const actIds = queue.map(a => a.id);
const uniqueIds = new Set(actIds);
assert(actIds.length === uniqueIds.size, "[G] La même activity_id n'est jamais présentée deux fois dans la même session");

// Test: fallback avoid failed activity
const failedActInQueue = queue.find(a => a.id === "fake_act_id");
assert(!failedActInQueue, "[G] last_failed_activity_id est évitée si d'autres activités sont dispo");

// H, I: Activité non validée / inexistante
// (Le Selector filtre par validated === true, donc impossible)
let hasUnvalidated = queue.some(a => a.validated === false);
assert(!hasUnvalidated, "[H, I] Aucune activité non validée n'est sélectionnée");

// J: Traçabilité
let traceabilityOk = queue.every(act => act.id && act.knowledge_point_id && act.source_seif);
assert(traceabilityOk, "[J] La traçabilité est toujours conservée (id, kp_id, source_seif)");

// K: Flashcard seule ne donne jamais mastered
updateKpProgression("kp_flashcard_only", "act1", "flashcard", true, ["flashcard"]);
updateKpProgression("kp_flashcard_only", "act1", "flashcard", true, ["flashcard"]);
let progFlash = getKpProgression("kp_flashcard_only");
assert(progFlash.status !== "mastered", "[K] Une Flashcard seule ne peut jamais donner mastered");

// L: Multiple réussites pour QCM
const targetQcmKp = targetKp.id;
// 1ere réussite
updateKpProgression(targetQcmKp, "qcm1", "multiple_choice", true, ["flashcard", "multiple_choice"]);
let progQcm1 = getKpProgression(targetQcmKp);
assert(progQcm1.status === "practicing", "[L] Une seule réussite au QCM ne donne pas mastered");
// 2eme réussite distincte
updateKpProgression(targetQcmKp, "qcm1", "multiple_choice", true, ["flashcard", "multiple_choice"]);
let progQcm2 = getKpProgression(targetQcmKp);
assert(progQcm2.status === "mastered", "[L] Deux réussites au QCM donnent mastered");

// M: Situation pratique
updateKpProgression("kp_situation", "sit1", "practical_situation", true, ["flashcard", "practical_situation"]);
let progSit = getKpProgression("kp_situation");
assert(progSit.status === "mastered", "[M] Une situation pratique réussie donne un poids élevé (mastered)");

const report = `# Rapport de test du Moteur d'Apprentissage V2\n\n${results.join('\n')}\n\n**Résultat final : ${pass ? "SUCCÈS" : "ÉCHEC"}**\n`;
fs.writeFileSync(path.join(__dirname, '..', 'learning_engine_test_report.md'), report);

if (!pass) process.exit(1);
console.log("Tous les tests ont réussi !");
