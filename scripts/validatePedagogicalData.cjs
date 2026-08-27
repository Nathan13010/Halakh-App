const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'public', 'data', 'הלכות הנהגת אדם בבוקר', 'siman_1_knowledge.json');
const knowledgeData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

let errors = [];

knowledgeData.knowledge_points.forEach(kp => {
  if (kp.pedagogy) {
    if (kp.pedagogy.activities) {
      Object.keys(kp.pedagogy.activities).forEach(type => {
        let acts = kp.pedagogy.activities[type];
        if (!Array.isArray(acts)) acts = [acts];
        
        acts.forEach(act => {
          if (!act.activity_id) errors.push(`Manque activity_id pour KP ${kp.id} (${type})`);
          if (!act.knowledge_point_id) errors.push(`Manque knowledge_point_id pour KP ${kp.id} (${type})`);
          if (!act.source_seif) errors.push(`Manque source_seif pour KP ${kp.id} (${type})`);
          if (act.knowledge_point_id !== kp.id) errors.push(`Mauvais KP ID dans activité de ${kp.id}`);
          if (act.validated !== true) errors.push(`Activité non validée pour ${kp.id}`);
          
          if (type === 'multiple_choice' && !act.options.includes(act.correct_answer)) {
            errors.push(`La bonne réponse n'est pas dans les options pour QCM ${act.activity_id}`);
          }
        });
      });
    }
  }
});

if (errors.length === 0) {
  console.log("Validation réussie : Toutes les activités pédagogiques sont correctement structurées, tracées et validées.");
} else {
  console.log("Erreurs trouvées :");
  errors.forEach(e => console.log("- " + e));
}
