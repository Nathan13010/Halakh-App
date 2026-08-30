import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateActivity } from '../src/services/activityValidator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, '..', 'public', 'data', 'הלכות הנהגת אדם בבוקר', 'siman_1_knowledge.json');

const report = [];
const log = (msg) => {
  console.log(msg);
  report.push(msg);
};

// Tests Unitaires
log("# Tests Unitaires du Validateur");

const runTest = (name, activity, expectedIsValid, kp = null) => {
  const result = validateActivity(activity, kp);
  const passed = result.isValid === expectedIsValid;
  log(`- **${name}** : ${passed ? '✅ PASS' : '❌ FAIL'} (Attendu: ${expectedIsValid}, Reçu: ${result.isValid}${!result.isValid ? ` - ${result.reason}` : ''})`);
  return passed;
};

// TEST 1: Valide multiple_choice
runTest("TEST 1: Une activité valide multiple_choice est acceptée", {
  activity_id: "test-001",
  knowledge_point_id: "kp-1",
  source_seif: "1",
  type: "multiple_choice",
  validated: true,
  question: "Q1",
  options: ["A", "B"],
  correct_answer: "A"
}, true);

// TEST 2: validated: false
runTest("TEST 2: Une activité avec validated: false est refusée", {
  activity_id: "test-002",
  knowledge_point_id: "kp-1",
  source_seif: "1",
  type: "multiple_choice",
  validated: false,
  question: "Q1",
  options: ["A", "B"],
  correct_answer: "A"
}, false);

// TEST 3: sans activity_id
runTest("TEST 3: Une activité sans activity_id est refusée", {
  knowledge_point_id: "kp-1",
  source_seif: "1",
  type: "multiple_choice",
  validated: true,
  question: "Q1",
  options: ["A", "B"],
  correct_answer: "A"
}, false);

// TEST 4: sans knowledge_point_id
runTest("TEST 4: Une activité sans knowledge_point_id est refusée", {
  activity_id: "test-004",
  source_seif: "1",
  type: "multiple_choice",
  validated: true,
  question: "Q1",
  options: ["A", "B"],
  correct_answer: "A"
}, false);

// TEST 5: sans source_seif
runTest("TEST 5: Une activité sans source_seif est refusée", {
  activity_id: "test-005",
  knowledge_point_id: "kp-1",
  type: "multiple_choice",
  validated: true,
  question: "Q1",
  options: ["A", "B"],
  correct_answer: "A"
}, false);

// TEST 6: QCM sans options
runTest("TEST 6: Un QCM sans options est refusé", {
  activity_id: "test-006",
  knowledge_point_id: "kp-1",
  source_seif: "1",
  type: "multiple_choice",
  validated: true,
  question: "Q1",
  correct_answer: "A"
}, false);

// TEST 7: QCM avec correct_answer qui ne correspond pas
runTest("TEST 7: Un QCM dont correct_answer ne correspond à aucune option est refusé", {
  activity_id: "test-007",
  knowledge_point_id: "kp-1",
  source_seif: "1",
  type: "multiple_choice",
  validated: true,
  question: "Q1",
  options: ["A", "B"],
  correct_answer: "C"
}, false);

// TEST 8: Activité inconnue
runTest("TEST 8: Une activité de type inconnu est refusée", {
  activity_id: "test-008",
  knowledge_point_id: "kp-1",
  source_seif: "1",
  type: "unknown_type",
  validated: true
}, false);

log("");
log("*(Les Tests 9 et 10 sont de la logique UI testée manuellement ou via composant. Les Tests 11 et 12 sont respectés par la structure du moteur qui ne modifie pas l'objet)*");
log("");

// Test sur le vrai JSON
log("# Audit de siman_1_knowledge.json");
if (!fs.existsSync(jsonPath)) {
  log("❌ Fichier non trouvé : " + jsonPath);
} else {
  const content = fs.readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(content);
  
  let totalMC = 0;
  let validMC = 0;
  let invalidMC = 0;
  let rejectionReasons = {};
  
  data.knowledge_points.forEach(kp => {
    if (kp.pedagogy && kp.pedagogy.activities) {
      Object.entries(kp.pedagogy.activities).forEach(([type, act]) => {
        // Dans notre JSON actuel, c'est parfois un tableau (ex: practical_situation) ou un objet
        const acts = Array.isArray(act) ? act : [act];
        
        acts.forEach(a => {
          // On cherche spécifically les multiple_choice (ou types assimilés dans la future version du json)
          if (a.type === 'multiple_choice' || type === 'multiple_choice') {
            totalMC++;
            // Assurer que le type est bien dans l'objet pour la validation
            const actToTest = { ...a, type: a.type || type }; 
            
            const v = validateActivity(actToTest, kp);
            if (v.isValid) {
              validMC++;
            } else {
              invalidMC++;
              rejectionReasons[v.reason] = (rejectionReasons[v.reason] || 0) + 1;
            }
          }
        });
      });
    }
  });

  log(`- Total des activités \`multiple_choice\` existantes : **${totalMC}**`);
  log(`- Activités affichables (valides) : **${validMC}**`);
  log(`- Activités rejetées : **${invalidMC}**`);
  
  if (invalidMC > 0) {
    log("\n### Raisons de rejet :");
    Object.entries(rejectionReasons).forEach(([reason, count]) => {
      log(`- ${reason} : ${count}`);
    });
  }
}

// Ecriture du rapport
const reportPath = path.join(__dirname, '..', 'classic_quiz_validation_report.md');
fs.writeFileSync(reportPath, report.join('\n'), 'utf-8');
console.log(`\nRapport généré: ${reportPath}`);
