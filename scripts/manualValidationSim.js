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

import { getQueueForSession } from '../src/services/activitySelector.js';
import { updateKpProgression, getKpProgression, resetAllProgressions } from '../src/services/progressionTracker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '..', 'public', 'data', 'הלכות הנהגת אדם בבוקר', 'siman_1_knowledge.json');

const knowledgeData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

let report = [];
const log = (msg) => { console.log(msg); report.push(msg); };

const simulateSubmitAnswer = (act, kp, isCorrect) => {
    const allKpActs = kp.pedagogy?.activities || {};
    const availableActivityTypes = Object.keys(allKpActs);
    
    if (act.type === 'card' && act.rawType === 'flashcard') {
      updateKpProgression(act.knowledge_point_id, act.activity_id, act.rawType, true, availableActivityTypes);
      return;
    }
    updateKpProgression(act.knowledge_point_id, act.activity_id, act.rawType, isCorrect, availableActivityTypes);
};

// TEST 1
resetAllProgressions();
log("==================================================");
log("TEST 1 - NOUVEL UTILISATEUR");
// Trouver un KP qui a flashcard ET qcm
let kpWithQcm = knowledgeData.knowledge_points.find(k => k.pedagogy?.activities?.flashcard && k.pedagogy?.activities?.multiple_choice);
let customKnowledgeData = { ...knowledgeData, knowledge_points: [kpWithQcm] };

let queue1 = getQueueForSession(customKnowledgeData, 5);
log("Queue length: " + queue1.length);
if (queue1.length > 0) {
    const act1 = queue1[0];
    const prog1 = getKpProgression(act1.knowledge_point_id);
    log(`1. KP selectionne en premier: ${act1.knowledge_point_id}`);
    log(`2. Activite affichee: ${act1.id} (type UI: ${act1.type}, raw: ${act1.rawType})`);
    log(`3. Est-ce bien une Flashcard pour un KP non_started ? ${act1.rawType === 'flashcard' && prog1.status === 'non_started'}`);
    
    if (queue1.length > 1) {
        const act2 = queue1[1];
        log(`4. Apres la Flashcard, activite proposee: ${act2.id} (type UI: ${act2.type}, raw: ${act2.rawType})`);
        log(`5. Est-ce que le QCM/VF correspond bien au meme KP ? ${act2.knowledge_point_id === act1.knowledge_point_id}`);
        const allActsForKp = kpWithQcm.pedagogy.activities;
        log(`6. Situation existe dans le JSON pour ce KP ? ${!!allActsForKp.practical_situation}`);
    }
    simulateSubmitAnswer(queue1[0], customKnowledgeData.knowledge_points.find(k=>k.id===queue1[0].knowledge_point_id), true);
    log(`7. Statut apres Flashcard: ${getKpProgression(queue1[0].knowledge_point_id).status}`);
}
log("TEST 1: Evaluated.\n");

// TEST 2
log("==================================================");
log("TEST 2 - ERREUR");
resetAllProgressions();
let kpT2 = knowledgeData.knowledge_points.find(k => k.pedagogy?.activities?.multiple_choice && k.pedagogy?.activities?.multiple_choice.length > 0);
const availableActs2 = Object.keys(kpT2.pedagogy.activities);
let qcmAct = Array.isArray(kpT2.pedagogy.activities.multiple_choice) ? kpT2.pedagogy.activities.multiple_choice[0] : kpT2.pedagogy.activities.multiple_choice;
updateKpProgression(kpT2.id, qcmAct.activity_id, 'multiple_choice', false, availableActs2);
let prog2 = getKpProgression(kpT2.id);
log(`Apres erreur sur ${qcmAct.activity_id}:`);
log(`status = ${prog2.status}`);
log(`wrong = ${prog2.wrong}`);
log(`streak = ${prog2.streak}`);
log(`last_failed_activity_id = ${prog2.last_failed_activity_id}`);
// Prochaine activité pour ce KP :
let queue2 = getQueueForSession(knowledgeData, 5);
let actT2next = queue2.find(a => a.knowledge_point_id === kpT2.id);
log(`Prochaine activite proposee: ${actT2next ? actT2next.id : 'Aucune'}`);
log("TEST 2: Evaluated.\n");

// TEST 3
log("==================================================");
log("TEST 3 - PRIORITE NEEDS_REVIEW");
resetAllProgressions();
let kpA = knowledgeData.knowledge_points.find(k => k.learning_level === 1);
let kpB = knowledgeData.knowledge_points.find(k => (k.learning_level === 4 || k.learning_level === 3) && k.pedagogy.activities.multiple_choice);
updateKpProgression(kpB.id, "fake_act", "multiple_choice", false, ["multiple_choice"]);
let queue3 = getQueueForSession(knowledgeData, 5);
let firstKpInQueue3 = queue3[0].knowledge_point_id;
log(`KP A (lvl 1) status: ${getKpProgression(kpA.id).status}`);
log(`KP B (lvl ${kpB.learning_level}) status: ${getKpProgression(kpB.id).status}`);
log(`Premier KP selectionne: ${firstKpInQueue3} (Est-ce KP B ? ${firstKpInQueue3 === kpB.id})`);
log("TEST 3: Evaluated.\n");

// TEST 4
log("==================================================");
log("TEST 4 - MAITRISE");
resetAllProgressions();
let kpT4 = knowledgeData.knowledge_points.find(k => 
    k.pedagogy?.activities?.flashcard && 
    k.pedagogy?.activities?.multiple_choice && 
    k.pedagogy?.activities?.practical_situation
);
if (!kpT4) log("Aucun KP avec les 3 types trouve.");
else {
    const availableActs4 = Object.keys(kpT4.pedagogy.activities);
    const fc = kpT4.pedagogy.activities.flashcard;
    const qcm = Array.isArray(kpT4.pedagogy.activities.multiple_choice) ? kpT4.pedagogy.activities.multiple_choice[0] : kpT4.pedagogy.activities.multiple_choice;
    const sit = Array.isArray(kpT4.pedagogy.activities.practical_situation) ? kpT4.pedagogy.activities.practical_situation[0] : kpT4.pedagogy.activities.practical_situation;
    
    updateKpProgression(kpT4.id, fc.activity_id, 'flashcard', true, availableActs4);
    let prog4a = getKpProgression(kpT4.id);
    log(`1. Apres Flashcard: status=${prog4a.status}`);
    
    updateKpProgression(kpT4.id, qcm.activity_id, 'multiple_choice', true, availableActs4);
    let prog4b = getKpProgression(kpT4.id);
    log(`3. Apres QCM: status=${prog4b.status}`);
    
    updateKpProgression(kpT4.id, sit.activity_id, 'practical_situation', true, availableActs4);
    let prog4c = getKpProgression(kpT4.id);
    log(`5. Apres Situation: status=${prog4c.status}`);
    
    log(`Final state:`);
    log(`status: ${prog4c.status}`);
    log(`attempts: ${prog4c.attempts}`);
    log(`correct: ${prog4c.correct}`);
    log(`wrong: ${prog4c.wrong}`);
    log(`streak: ${prog4c.streak}`);
    log(`activities_mastered: ${JSON.stringify(prog4c.activities_mastered)}`);
}
log("TEST 4: Evaluated.\n");

// TEST 5
log("==================================================");
log("TEST 5 - TRACABILITE");
let queue5 = getQueueForSession(knowledgeData, 5);
let tracabilityFail = false;
for (let act of queue5) {
    if (!act.id || !act.knowledge_point_id || !act.source_seif) {
        tracabilityFail = true;
        log(`Manque donnee pour: ${act.id || 'unknown'}`);
    }
}
log(`Tracabilite OK: ${!tracabilityFail}`);
log("TEST 5: Evaluated.\n");

// TEST 6
log("==================================================");
log("TEST 6 - ANTI-REPETITION");
resetAllProgressions();
let kpT6 = knowledgeData.knowledge_points[0];
let fc6 = kpT6.pedagogy.activities.flashcard;
updateKpProgression(kpT6.id, fc6.activity_id, 'flashcard', false, ['flashcard']); // simulate fail
let queue6 = getQueueForSession(knowledgeData, 5);
let act6 = queue6.find(a => a.knowledge_point_id === kpT6.id);
log(`Activity displayed after fail: ${act6 ? act6.id : 'None'}`);
log(`Was it the same ? ${act6 && act6.id === fc6.activity_id}`);
log("TEST 6: Evaluated.\n");

fs.writeFileSync('manual_test_results.txt', report.join('\n'));
