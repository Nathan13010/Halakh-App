import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../public/data/הלכות הנהגת אדם בבוקר/siman_1_knowledge.json');

function runValidation() {
  console.log("=== VALIDATION DU SCHEMA PRACTICAL_SITUATION ===");
  const rawData = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(rawData);

  let totalPractical = 0;
  let validPractical = 0;
  let invalidPractical = 0;
  const errors = [];

  data.knowledge_points.forEach(kp => {
    if (kp.pedagogy && kp.pedagogy.activities && kp.pedagogy.activities.practical_situation) {
      const activities = Array.isArray(kp.pedagogy.activities.practical_situation) 
        ? kp.pedagogy.activities.practical_situation 
        : [kp.pedagogy.activities.practical_situation];

      activities.forEach(activity => {
        totalPractical++;
        const currentErrors = [];

        if (typeof activity.validated !== 'boolean') currentErrors.push('validated doit être un boolean');
        if (!activity.activity_id) currentErrors.push('activity_id manquant');
        if (!activity.knowledge_point_id) currentErrors.push('knowledge_point_id manquant');
        if (!activity.source_seif) currentErrors.push('source_seif manquant');
        if (!activity.situation) currentErrors.push('situation manquante');
        if (!activity.question) currentErrors.push('question manquante');
        if (!activity.answer) currentErrors.push('answer (bonne réponse) manquante');
        
        // Options check based on the schema rule: if options exist, answer must be in it
        if (activity.options) {
          if (!Array.isArray(activity.options)) currentErrors.push('options n\'est pas un tableau');
          else if (!activity.options.includes(activity.answer)) currentErrors.push('la bonne réponse n\'est pas dans les options');
        }

        if (currentErrors.length === 0) {
          validPractical++;
        } else {
          invalidPractical++;
          errors.push({
            id: activity.activity_id || 'UNKNOWN',
            kp: kp.id,
            errors: currentErrors
          });
        }
      });
    }
  });

  console.log(`Total activités practical_situation trouvées : ${totalPractical}`);
  console.log(`Activités valides : ${validPractical}`);
  console.log(`Activités invalides : ${invalidPractical}`);

  if (errors.length > 0) {
    console.log("\nDétail des erreurs :");
    errors.forEach(e => {
      console.log(`- ${e.id} (KP: ${e.kp}) : ${e.errors.join(', ')}`);
    });
  } else {
    console.log("\nToutes les activités practical_situation respectent le schéma !");
  }
}

runValidation();
