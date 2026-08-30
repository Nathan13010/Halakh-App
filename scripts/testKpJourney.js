import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { updateKpProgression, getKpProgression, resetAllProgressions, markKpAsLearning } from '../src/services/progressionTracker.js';
import { getKnowledgePointById } from '../src/services/knowledgeService.js';
import { pickActivitiesForKp } from '../src/services/activitySelector.js';

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

const jsonPath = path.join(__dirname, '..', 'public', 'data', 'הלכות הנהגת אדם בבוקר', 'siman_1_knowledge.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

function runKpJourney(kpId) {
  console.log(`\n=== JOURNEY TEST : ${kpId} ===`);
  resetAllProgressions();
  
  const kp = getKnowledgePointById(data, kpId);
  const availableTypes = ['flashcard', 'multiple_choice', 'true_false', 'practical_situation'];
  
  const table = [];
  let step = 1;

  // Maximum de 10 étapes pour éviter boucle infinie
  while (step <= 10) {
    const prog = getKpProgression(kpId);
    if (prog.status === 'mastered') {
      table.push({
        Etape: step,
        "Status avant": prog.status,
        Action: "NONE",
        Type: "NONE",
        Resultat: "NONE",
        "Status apres": prog.status
      });
      break;
    }

    const acts = pickActivitiesForKp(kp, prog, []);
    if (acts.length === 0) {
      console.log("No more activities to pick!");
      break;
    }

    // Prendre la première (priorité du sélecteur)
    const act = acts[0];
    
    // Si c'est le début d'une activité, useLearningSession appelle markKpAsLearning
    markKpAsLearning(kpId);
    
    // Simuler le résultat (true si testable, null si reflective)
    const isAssessable = act.rawType === 'multiple_choice' || act.rawType === 'true_false';
    const simResult = isAssessable ? true : null;

    const statusBefore = prog.status;
    updateKpProgression(kpId, act.id, act.rawType, simResult, availableTypes);
    const progAfter = getKpProgression(kpId);

    table.push({
      Etape: step,
      "Status avant": statusBefore,
      Action: "Submit",
      Type: act.rawType,
      Resultat: simResult === null ? "Reflective (null)" : (simResult ? "Correct" : "Wrong"),
      "Status apres": progAfter.status
    });

    step++;
  }
  
  console.table(table);
}

runKpJourney('s1-kp-024');

// TEST ERREUR ET REPETITION
function runErrorJourney(kpId) {
  console.log(`\n=== ERROR REPETITION TEST : ${kpId} ===`);
  resetAllProgressions();
  
  const kp = getKnowledgePointById(data, kpId);
  const availableTypes = ['flashcard', 'multiple_choice', 'true_false', 'practical_situation'];
  
  const table = [];
  
  // Étape 1 : Réussir la flashcard
  updateKpProgression(kpId, "fc1", 'flashcard', null, availableTypes);
  
  // Étape 2 : Échouer au QCM (simulons une erreur)
  const progBeforeErr = getKpProgression(kpId);
  updateKpProgression(kpId, `${kpId}-qcm-01`, 'multiple_choice', false, availableTypes);
  const progAfterErr = getKpProgression(kpId);
  
  // Étape 3 : Que choisit le sélecteur ?
  const acts = pickActivitiesForKp(kp, progAfterErr, []);
  
  console.log("Status après erreur :", progAfterErr.status);
  console.log("last_failed_activity_id :", progAfterErr.last_failed_activity_id);
  console.log("Activités choisies après erreur :");
  console.table(acts.map(a => ({ ID: a.id, Type: a.rawType })));
}

runErrorJourney('s1-kp-006');
