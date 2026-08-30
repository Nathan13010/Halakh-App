import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

import { updateKpProgression, getKpProgression, resetAllProgressions } from '../src/services/progressionTracker.js';

let report = [];
const log = (msg) => { console.log(msg); report.push(msg); };

const availableTypes = ['flashcard', 'multiple_choice', 'practical_situation'];

const runCase = (caseName, actions) => {
    resetAllProgressions();
    const kpId = 'test-kp';
    
    log(`### CAS ${caseName}`);
    let prog = getKpProgression(kpId);
    log(`- **État initial :** status=${prog.status}, streak=${prog.streak}`);
    
    actions.forEach(action => {
        if (action === 'reset_streak') {
            const p = JSON.parse(global.localStorage.getItem("halakhapp_kp_progression"));
            p[kpId].streak = 0;
            global.localStorage.setItem("halakhapp_kp_progression", JSON.stringify(p));
            log(`- *Action : streak artificiellement remis à 0*`);
        } else {
            updateKpProgression(kpId, action.id, action.type, action.correct, availableTypes);
            log(`- *Action : ${action.type} réussie=${action.correct}*`);
        }
    });

    prog = getKpProgression(kpId);
    log(`- **Streak final :** ${prog.streak}`);
    log(`- **Activités maîtrisées :** ${JSON.stringify(prog.activities_mastered)}`);
    log(`- **Statut final :** ${prog.status}`);
    log(`- **Condition de déclenchement :** (Vue depuis code) typesMastered=${new Set(prog.activities_mastered.map(a=>a.type)).size}, totalSuccessActive=${Object.values(prog.activity_success_counts || {}).reduce((a,b)=>a+b,0)}`);
    log("");
};

log("# Audit de la Logique de Maîtrise");
log("");

// CAS A: Flashcard, QCM, Situation -> streak = 3
runCase("A", [
    { id: 'fc1', type: 'flashcard', correct: true },
    { id: 'qcm1', type: 'multiple_choice', correct: true },
    { id: 'sit1', type: 'practical_situation', correct: true }
]);

// CAS B: Flashcard, QCM, reset streak, Situation -> streak = 1
runCase("B", [
    { id: 'fc1', type: 'flashcard', correct: true },
    { id: 'qcm1', type: 'multiple_choice', correct: true },
    'reset_streak',
    { id: 'sit1', type: 'practical_situation', correct: true }
]);

// CAS C: QCM réussi 2 fois sans Situation
runCase("C", [
    { id: 'qcm1', type: 'multiple_choice', correct: true },
    { id: 'qcm2', type: 'multiple_choice', correct: true }
]);

// CAS D: QCM réussi 1 fois, Situation réussie 1 fois
runCase("D", [
    { id: 'qcm1', type: 'multiple_choice', correct: true },
    { id: 'sit1', type: 'practical_situation', correct: true }
]);

// CAS E: Flashcard réussie plusieurs fois
runCase("E", [
    { id: 'fc1', type: 'flashcard', correct: true },
    { id: 'fc2', type: 'flashcard', correct: true },
    { id: 'fc3', type: 'flashcard', correct: true }
]);

log("## Conclusion");
log("En inspectant le code `progressionTracker.js`, on observe :");
log("```javascript");
log(`    const typesMastered = [...new Set(newMasteredActs.map(a => a.type))];
    const hasSituation = typesMastered.includes('practical_situation');
    const hasOtherThanFlashcard = availableActivityTypes.some(t => t !== 'flashcard' && t !== 'card');

    if (!hasOtherThanFlashcard) {
      newStatus = "practicing";
    } else if (typesMastered.length >= 2) {
      newStatus = "mastered";
    } else if (typesMastered.length === 1) {
      const totalSuccessOnActive = Object.values(newSuccessCounts).reduce((a, b) => a + b, 0);
      if (hasSituation) {
        newStatus = "mastered";
      } else if (totalSuccessOnActive >= 2) {
        newStatus = "mastered";
      } else {
        newStatus = "practicing";
      }
    } else {
      newStatus = "practicing";
    }
`);
log("```");
log("");
log("**STREAK_USED_FOR_MASTERY = NO**");
log("");
log("La variable `streak` n'est absolument pas utilisée dans la détermination du statut `mastered`. La maîtrise dépend uniquement de la diversité des types d'activités maîtrisées (`typesMastered.length >= 2`), de la présence d'une situation pratique, ou d'au moins 2 réussites sur des activités actives (QCM/VF).");

fs.writeFileSync('mastery_logic_audit.md', report.join('\n'));
