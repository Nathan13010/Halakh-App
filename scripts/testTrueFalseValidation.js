import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../public/data/הלכות הנהגת אדם בבוקר/siman_1_knowledge.json');

function runValidation() {
  console.log("=== VALIDATION DU SCHEMA TRUE_FALSE ===");
  const rawData = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(rawData);

  let totalTrueFalse = 0;
  let validTrueFalse = 0;
  let invalidTrueFalse = 0;
  const errors = [];

  data.knowledge_points.forEach(kp => {
    if (kp.pedagogy && kp.pedagogy.activities && kp.pedagogy.activities.true_false) {
      const activities = Array.isArray(kp.pedagogy.activities.true_false) 
        ? kp.pedagogy.activities.true_false 
        : [kp.pedagogy.activities.true_false];

      activities.forEach(activity => {
        totalTrueFalse++;
        const currentErrors = [];

        if (typeof activity.validated !== 'boolean') currentErrors.push('validated doit être un boolean');
        if (!activity.activity_id) currentErrors.push('activity_id manquant');
        if (!activity.knowledge_point_id) currentErrors.push('knowledge_point_id manquant');
        if (!activity.source_seif) currentErrors.push('source_seif manquant');
        if (!activity.statement) currentErrors.push('statement manquant');
        if (typeof activity.is_true !== 'boolean') currentErrors.push('is_true manquant ou non boolean');

        if (currentErrors.length === 0) {
          validTrueFalse++;
        } else {
          invalidTrueFalse++;
          errors.push({
            id: activity.activity_id || 'UNKNOWN',
            kp: kp.id,
            errors: currentErrors
          });
        }
      });
    }
  });

  console.log(`Total activités true_false trouvées : ${totalTrueFalse}`);
  console.log(`Activités valides : ${validTrueFalse}`);
  console.log(`Activités invalides : ${invalidTrueFalse}`);

  if (errors.length > 0) {
    console.log("\nDétail des erreurs :");
    errors.forEach(e => {
      console.log(`- ${e.id} (KP: ${e.kp}) : ${e.errors.join(', ')}`);
    });
  } else {
    console.log("\nToutes les activités true_false respectent le schéma !");
  }
}

runValidation();
