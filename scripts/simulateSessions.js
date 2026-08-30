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

import { getQueueForSession } from '../src/services/activitySelector.js';
import { resetAllProgressions, getKpProgression } from '../src/services/progressionTracker.js';
import { getKnowledgePointById } from '../src/services/knowledgeService.js';

const jsonPath = path.join(__dirname, '..', 'public', 'data', 'הלכות הנהגת אדם בבוקר', 'siman_1_knowledge.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

function runSimulation(profileName, setupFunc) {
  console.log(`\n=== SIMULATION : ${profileName} ===`);
  resetAllProgressions();
  
  if (setupFunc) {
    setupFunc();
  }

  const queue = getQueueForSession(data, 5);
  
  if (queue.length === 0) {
    console.log("Aucune activité sélectionnée.");
    return;
  }

  const table = [];
  queue.forEach((act, idx) => {
    const kp = getKnowledgePointById(data, act.knowledge_point_id);
    const prog = getKpProgression(kp.id);
    
    table.push({
      Position: idx + 1,
      KP: kp.id,
      Seif: kp.source_seif,
      Level: kp.learning_level,
      Importance: kp.importance,
      Type: act.rawType || act.type,
      "Status actuel": prog.status
    });
  });

  console.table(table);

  // Stats
  const kps = new Set(queue.map(a => a.knowledge_point_id));
  const types = queue.reduce((acc, a) => {
    const t = a.rawType || a.type;
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  console.log(`- Nombre de KPs distincts : ${kps.size}`);
  console.log(`- Types d'activités :`, types);
}

// PROFIL A: Nouvel Utilisateur
runSimulation("PROFIL A — Nouvel utilisateur", () => {});

// PROFIL B: Intermédiaire (learning, practicing)
runSimulation("PROFIL B — Intermédiaire", () => {
  const progressions = {};
  progressions["s1-kp-001"] = { status: "practicing", last_seen: Date.now() - 86400000 };
  progressions["s1-kp-002"] = { status: "learning", last_seen: Date.now() - 4000000 };
  progressions["s1-kp-003"] = { status: "mastered", last_seen: Date.now() - 86400000 };
  localStorage.setItem("halakhapp_kp_progression", JSON.stringify(progressions));
});

// PROFIL C: Utilisateur avec erreurs (needs_review)
runSimulation("PROFIL C — Avec erreurs", () => {
  const progressions = {};
  progressions["s1-kp-006"] = { status: "needs_review", last_seen: Date.now() - 3600000, last_failed_activity_id: "s1-kp-006-qcm-01" }; // A un QCM
  progressions["s1-kp-001"] = { status: "non_started" }; 
  progressions["s1-kp-002"] = { status: "practicing", last_seen: Date.now() - 86400000 }; 
  localStorage.setItem("halakhapp_kp_progression", JSON.stringify(progressions));
});

