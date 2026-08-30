import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

import { getKpProgression, updateKpProgression, resetAllProgressions } from '../src/services/progressionTracker.js';
import { validateActivity } from '../src/services/activityValidator.js';
import { pickActivitiesForKp, getQueueForSession } from '../src/services/activitySelector.js';

const jsonPath = path.join(__dirname, '..', 'public', 'data', 'הלכות הנהגת אדם בבוקר', 'siman_1_knowledge.json');
const rawJson = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

const auditResults = {
  masteryCases: [],
  antiRepetition: [],
  validator: [],
  traceability: []
};

// ==========================================
// 1. AUDIT MASTERY CASES (A to J)
// ==========================================
console.log("=== 1. AUDIT MASTERY LOGIC ===");

const AVAILABLE_TYPES = ['flashcard', 'multiple_choice', 'true_false', 'practical_situation'];

function testMasteryCase(id, description, actions, expectedStatus, expectedRule) {
  resetAllProgressions();
  const kpId = `test-kp-${id}`;
  
  let initialProg = getKpProgression(kpId);
  
  for (const act of actions) {
    if (act.type === 'manual_streak_reset') {
      const p = JSON.parse(global.localStorage.getItem("halakhapp_kp_progression"));
      p[kpId].streak = 0;
      global.localStorage.setItem("halakhapp_kp_progression", JSON.stringify(p));
    } else if (act.type === 'manual_streak_set') {
      const p = JSON.parse(global.localStorage.getItem("halakhapp_kp_progression"));
      p[kpId].streak = act.value;
      global.localStorage.setItem("halakhapp_kp_progression", JSON.stringify(p));
    } else {
      updateKpProgression(kpId, act.id, act.type, act.correct, AVAILABLE_TYPES);
    }
  }
  
  const finalProg = getKpProgression(kpId);
  const typesMastered = [...new Set((finalProg.activities_mastered || []).map(a => a.type))];
  const isPass = finalProg.status === expectedStatus;
  
  // Identifier la condition déclenchée dans le code
  let triggeredCondition = "none / default practicing";
  const hasSituation = typesMastered.includes('practical_situation');
  const totalSuccessOnActive = Object.values(finalProg.activity_success_counts || {}).reduce((a, b) => a + b, 0);
  
  if (typesMastered.length >= 2) {
    triggeredCondition = `typesMastered.length >= 2 (${typesMastered.join(', ')}) -> mastered`;
  } else if (typesMastered.length === 1) {
    if (totalSuccessOnActive >= 2) {
      triggeredCondition = `typesMastered.length === 1 && totalSuccessOnActive >= 2 (${totalSuccessOnActive}) -> mastered`;
    } else {
      triggeredCondition = `typesMastered.length === 1 && totalSuccessOnActive < 2 (${totalSuccessOnActive}) -> practicing`;
    }
  } else {
    triggeredCondition = `typesMastered.length === 0 -> practicing`;
  }
  
  auditResults.masteryCases.push({
    id,
    description,
    initialStatus: initialProg.status,
    activitiesSuccessCount: actions.filter(a => a.correct).length,
    finalStreak: finalProg.streak,
    activitiesMastered: finalProg.activities_mastered,
    typesMastered,
    finalStatus: finalProg.status,
    expectedStatus,
    triggeredCondition,
    passed: isPass,
    expectedRule
  });
}

// A. 3 Flashcards réussies -> NOT mastered (practicing)
testMasteryCase('A', '3 Flashcards réussies', [
  { id: 'fc1', type: 'flashcard', correct: true },
  { id: 'fc2', type: 'flashcard', correct: true },
  { id: 'fc3', type: 'flashcard', correct: true }
], 'practicing', 'Flashcards ne comptent pas dans activities_mastered');

// B. 1 QCM réussi -> NOT mastered (practicing)
testMasteryCase('B', '1 QCM réussi', [
  { id: 'qcm1', type: 'multiple_choice', correct: true }
], 'practicing', '1 seul succès actif nécessite au moins 2 réussites distinctes ou 2 types');

// C. 2 QCM différents réussis -> mastered
testMasteryCase('C', '2 QCM différents réussis', [
  { id: 'qcm1', type: 'multiple_choice', correct: true },
  { id: 'qcm2', type: 'multiple_choice', correct: true }
], 'mastered', '2 réussites actives (totalSuccessOnActive >= 2)');

// D. 1 QCM + 1 VF -> mastered
testMasteryCase('D', '1 QCM + 1 VF réussis', [
  { id: 'qcm1', type: 'multiple_choice', correct: true },
  { id: 'vf1', type: 'true_false', correct: true }
], 'mastered', '2 types interactifs différents (typesMastered.length >= 2)');

// E. 1 QCM + 1 Situation -> mastered
testMasteryCase('E', '1 QCM + 1 Situation réussis', [
  { id: 'qcm1', type: 'multiple_choice', correct: true },
  { id: 'sit1', type: 'practical_situation', correct: true }
], 'mastered', '2 types interactifs différents (typesMastered.length >= 2)');

// F. 1 seule Situation -> NOT mastered (attendu selon règle 5 de l\'utilisateur)
testMasteryCase('F', '1 seule Situation', [
  { id: 'sit1', type: 'practical_situation', correct: true }
], 'practicing', 'Une seule situation ne doit pas automatiquement donner mastered');

// G. 1 Flashcard + 1 Situation -> NOT mastered (attendu selon règle 5)
testMasteryCase('G', '1 Flashcard + 1 Situation', [
  { id: 'fc1', type: 'flashcard', correct: true },
  { id: 'sit1', type: 'practical_situation', correct: true }
], 'practicing', 'Flashcard passive + 1 seule situation ne doit pas donner mastered');

// H. 1 QCM réussi + erreur + 1 Situation réussie -> mastered
testMasteryCase('H', '1 QCM + erreur + 1 Situation', [
  { id: 'qcm1', type: 'multiple_choice', correct: true },
  { id: 'qcm2', type: 'multiple_choice', correct: false },
  { id: 'sit1', type: 'practical_situation', correct: true }
], 'mastered', '2 types distincts maîtrisés (QCM + Situation), le reset de streak ne bloque pas la maîtrise');

// I. streak = 0 avec 2 QCM réussis -> mastered
testMasteryCase('I', '2 QCM réussis avec streak reset à 0', [
  { id: 'qcm1', type: 'multiple_choice', correct: true },
  { id: 'qcm2', type: 'multiple_choice', correct: true },
  { type: 'manual_streak_reset' }
], 'mastered', 'Streak indépendant de mastered');

// J. streak = 10 avec 1 seule Flashcard -> NOT mastered
testMasteryCase('J', '1 Flashcard avec streak = 10', [
  { id: 'fc1', type: 'flashcard', correct: true },
  { type: 'manual_streak_set', value: 10 }
], 'practicing', 'Streak élevé ne donne pas la maîtrise sans activités actives');

// K. 1 Flashcard + 1 Situation (reflective/exposure, correct = null)
testMasteryCase('K', '1 Flashcard + 1 Situation (reflective)', [
  { id: 'fc1', type: 'flashcard', correct: true }, // Flashcard envoie true mais est ignorée de la maitrise active
  { id: 'sit1', type: 'practical_situation_reflective', correct: null } // Simulation de la Situation sans options
], 'practicing', 'Une situation ouverte ne doit générer aucune fausse réussite et ne donne pas mastered');

// L. 1 QCM + 1 Situation (reflective)
testMasteryCase('L', '1 QCM + 1 Situation (reflective)', [
  { id: 'qcm1', type: 'multiple_choice', correct: true },
  { id: 'sit1', type: 'practical_situation_reflective', correct: null }
], 'practicing', '1 Situation ouverte ne donne pas le 2eme point de maitrise');

// M. 1 QCM + 1 future Situation avec options (objective)
testMasteryCase('M', '1 QCM + 1 Situation (objective)', [
  { id: 'qcm1', type: 'multiple_choice', correct: true },
  { id: 'sit1', type: 'practical_situation', correct: true } // Simulation Situation avec options
], 'mastered', 'Une future situation évaluable objectivement comptera pour la maitrise');

// ==========================================
// 2. AUDIT ANTI-RÉPÉTITION
// ==========================================
console.log("=== 2. AUDIT ANTI-RÉPÉTITION ===");

// Trouver un KP du JSON avec plusieurs activités
const kpWithMultipleActivities = rawJson.knowledge_points.find(kp => {
  if (!kp.pedagogy?.activities) return false;
  const acts = [];
  Object.values(kp.pedagogy.activities).forEach(v => {
    if (Array.isArray(v)) acts.push(...v);
    else if (v) acts.push(v);
  });
  return acts.length >= 2;
});

if (kpWithMultipleActivities) {
  // Test 1: last_failed_activity_id évité si alternative existe
  const progFailed = {
    status: 'needs_review',
    streak: 0,
    activities_mastered: [],
    last_failed_activity_id: 's1-kp-002-flashcard-01'
  };
  const picked = pickActivitiesForKp(kpWithMultipleActivities, progFailed);
  const pickedIds = picked.map(a => a.activity_id);
  
  auditResults.antiRepetition.push({
    test: "Évitement de last_failed_activity_id lorsqu'une alternative existe",
    passed: !pickedIds.includes('s1-kp-002-flashcard-01'),
    details: `KP ${kpWithMultipleActivities.id}, failed: s1-kp-002-flashcard-01, picked: ${pickedIds.join(', ')}`
  });

  // Test 2: Aucune activité consécutive en double dans une file générée
  const sessionQueue = getQueueForSession(rawJson, 5);
  let hasConsecutiveDuplicates = false;
  for (let i = 0; i < sessionQueue.length - 1; i++) {
    if (sessionQueue[i].id === sessionQueue[i+1].id) {
      hasConsecutiveDuplicates = true;
    }
  }
  auditResults.antiRepetition.push({
    test: "Absence de doublons consécutifs (activity_id) dans une session",
    passed: !hasConsecutiveDuplicates,
    details: `Taille file: ${sessionQueue.length}, IDs: ${sessionQueue.map(a => a.id).join(', ')}`
  });
}

// ==========================================
// 3. AUDIT DU VALIDATEUR
// ==========================================
console.log("=== 3. AUDIT VALIDATEUR ===");

const validatorTests = [
  {
    name: "Rejet si validated !== true",
    act: { activity_id: "v1", knowledge_point_id: "kp1", source_seif: "1", type: "flashcard", validated: false, question: "Q", answer: "A" },
    expected: false
  },
  {
    name: "Rejet si activity_id absent",
    act: { knowledge_point_id: "kp1", source_seif: "1", type: "flashcard", validated: true, question: "Q", answer: "A" },
    expected: false
  },
  {
    name: "Rejet si knowledge_point_id absent",
    act: { activity_id: "v3", source_seif: "1", type: "flashcard", validated: true, question: "Q", answer: "A" },
    expected: false
  },
  {
    name: "Rejet si source_seif absent",
    act: { activity_id: "v4", knowledge_point_id: "kp1", type: "flashcard", validated: true, question: "Q", answer: "A" },
    expected: false
  },
  {
    name: "Rejet si type inconnu",
    act: { activity_id: "v5", knowledge_point_id: "kp1", source_seif: "1", type: "puzzle", validated: true },
    expected: false
  },
  {
    name: "Rejet QCM sans options",
    act: { activity_id: "v6", knowledge_point_id: "kp1", source_seif: "1", type: "multiple_choice", validated: true, question: "Q", correct_answer: "A" },
    expected: false
  },
  {
    name: "Rejet QCM si correct_answer n'est pas dans options",
    act: { activity_id: "v7", knowledge_point_id: "kp1", source_seif: "1", type: "multiple_choice", validated: true, question: "Q", options: ["A", "B"], correct_answer: "C" },
    expected: false
  },
  {
    name: "Rejet activité conditionnelle sans conditions explicites",
    act: { activity_id: "v8", knowledge_point_id: "kp1", source_seif: "1", type: "multiple_choice", validated: true, question: "Q", options: ["A", "B"], correct_answer: "A" },
    kp: { halakha_status: "conditional" },
    expected: false
  },
  {
    name: "Acceptation si human_review_required: true mais validated: true",
    act: { activity_id: "v9", knowledge_point_id: "kp1", source_seif: "1", type: "multiple_choice", validated: true, question: "Q", options: ["A", "B"], correct_answer: "A" },
    kp: { halakha_status: "clear", pedagogy: { human_review_required: true } },
    expected: true
  }
];

validatorTests.forEach(t => {
  const res = validateActivity(t.act, t.kp || null);
  const passed = res.isValid === t.expected;
  auditResults.validator.push({
    test: t.name,
    passed,
    expected: t.expected,
    actual: res.isValid,
    reason: res.reason
  });
});

// ==========================================
// 4. AUDIT DE TRAÇABILITÉ
// ==========================================
console.log("=== 4. AUDIT TRAÇABILITÉ ===");

const testQueue = getQueueForSession(rawJson, 10);
let missingFieldsCount = 0;
const fieldAudit = [];

testQueue.forEach(act => {
  const required = ['activity_id', 'knowledge_point_id', 'source_seif', 'type', 'validated'];
  const missing = required.filter(f => act[f] === undefined || act[f] === null);
  
  // Vérifier également si halakha_status est conservé
  const hasHalakhaStatus = act.halakha_status !== undefined;

  fieldAudit.push({
    id: act.id,
    type: act.type,
    rawType: act.rawType,
    missingFields: missing,
    hasHalakhaStatus,
    halakhaStatusValue: act.halakha_status
  });

  if (missing.length > 0) missingFieldsCount++;
});

auditResults.traceability = {
  totalActivitiesTested: testQueue.length,
  missingRequiredFieldsCount: missingFieldsCount,
  details: fieldAudit
};

// ==========================================
// 5. TEST DE PROPAGATION SPÉCIFIQUE
// ==========================================
console.log("=== 5. PROPAGATION HALAKHA_STATUS ===");

const dummyKpMultipleOpinions = {
  id: "kp-mo-1",
  halakha_status: "multiple_opinions",
  pedagogy: {
    activities: {
      multiple_choice: {
        activity_id: "mo-qcm-1",
        knowledge_point_id: "kp-mo-1",
        source_seif: "1",
        type: "multiple_choice",
        validated: true,
        question: "Selon l'opinion X...",
        options: ["A", "B"],
        correct_answer: "A"
      }
    }
  }
};

const dummyProg = { status: "non_started", activities_mastered: [] };
const normalizedMo = pickActivitiesForKp(dummyKpMultipleOpinions, dummyProg);
const passedMoTest = normalizedMo.length > 0 && normalizedMo[0].halakha_status === "multiple_opinions";

auditResults.traceabilitySpecific = [
  {
    test: "multiple_choice + halakha_status: multiple_opinions -> activity.halakha_status === 'multiple_opinions'",
    passed: passedMoTest,
    actual: normalizedMo[0]?.halakha_status
  }
];

const dummyKpConditional = {
  id: "kp-cond-1",
  halakha_status: "conditional",
  pedagogy: {
    activities: {
      true_false: {
        activity_id: "cond-tf-1",
        knowledge_point_id: "kp-cond-1",
        source_seif: "1",
        type: "true_false",
        validated: true,
        statement: "Dans le cas X...",
        is_true: true,
        conditions: "Si condition Y"
      }
    }
  }
};

const normalizedCond = pickActivitiesForKp(dummyKpConditional, dummyProg);
const passedCondTest = normalizedCond.length > 0 && normalizedCond[0].halakha_status === "conditional";

auditResults.traceabilitySpecific.push({
  test: "true_false + halakha_status: conditional -> activity.halakha_status === 'conditional'",
  passed: passedCondTest,
  actual: normalizedCond[0]?.halakha_status
});

console.log(JSON.stringify(auditResults, null, 2));

// Export du rapport
export { auditResults };
