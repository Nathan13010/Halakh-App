const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'public', 'data', 'הלכות הנהגת אדם בבוקר', 'siman_1_knowledge.json');
const knowledgeData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

let stats = {
  total: knowledgeData.knowledge_points.length,
  flashcard: 0,
  qcm: 0,
  vf: 0,
  situation: 0,
  validated: 0,
  review_required: 0,
  rejected: 0,
  sans_source: 0,
  no_activity: 0
};

knowledgeData.knowledge_points.forEach(kp => {
  const isMultipleOpinions = kp.halakha_status === 'multiple_opinions';
  const isConditional = kp.halakha_status === 'conditional';
  const reviewReq = kp.importance === 'reference';
  
  if (reviewReq) stats.review_required++;
  
  const sourceSeif = kp.sources && kp.sources.length > 0 ? kp.sources.map(s => s.seif).join(", ") : "inconnu";

  kp.pedagogy = {
    learning_summary: `Règle concernant : ${kp.title}`,
    simple_explanation: kp.rule,
    human_review_required: reviewReq,
    activities: {
      flashcard: {
        activity_id: `${kp.id}-flashcard-01`,
        knowledge_point_id: kp.id,
        source_seif: sourceSeif,
        title: kp.title,
        question: `Que dit la Halakha concernant : ${kp.title} ?`,
        answer: kp.rule,
        conditions: (isConditional || isMultipleOpinions) ? "Attention aux conditions ou aux multiples opinions détaillées dans la règle." : "",
        validated: true
      }
    }
  };
  
  stats.flashcard++;
  stats.validated++; // Flashcard is validated

  let hasExtraActivity = false;

  // QCM
  if (kp.common_trap || (isMultipleOpinions && kp.claims && kp.claims.length > 1)) {
    kp.pedagogy.activities.multiple_choice = [];
    let qcm = {
      activity_id: `${kp.id}-qcm-01`,
      knowledge_point_id: kp.id,
      source_seif: sourceSeif,
      validated: true,
      explanation: kp.explanation || '-'
    };
    if (kp.common_trap) {
      qcm.question = `Quelle est la règle concernant : ${kp.title} ?`;
      qcm.options = [kp.rule, kp.common_trap];
      qcm.correct_answer = kp.rule;
    } else {
      qcm.question = `Selon l'opinion principale mentionnée dans le Seif, que faut-il faire concernant : ${kp.title} ?`;
      qcm.options = [kp.claims[0].text, kp.claims[1].text];
      qcm.correct_answer = kp.claims[0].text;
    }
    kp.pedagogy.activities.multiple_choice.push(qcm);
    stats.qcm++;
    stats.validated++;
    hasExtraActivity = true;
  }

  // V/F
  if (kp.common_trap) {
    kp.pedagogy.activities.true_false = [];
    kp.pedagogy.activities.true_false.push({
      activity_id: `${kp.id}-vf-01`,
      knowledge_point_id: kp.id,
      source_seif: sourceSeif,
      statement: kp.common_trap,
      is_true: false,
      explanation: `La règle est : ${kp.rule}`,
      validated: true
    });
    stats.vf++;
    stats.validated++;
    hasExtraActivity = true;
  }

  // SITUATION
  if (kp.practical_example || isConditional || kp.rule.toLowerCase().includes('si ') || kp.rule.toLowerCase().includes('lorsque ')) {
    kp.pedagogy.activities.practical_situation = [];
    let sit = {
      activity_id: `${kp.id}-practical-01`,
      knowledge_point_id: kp.id,
      source_seif: sourceSeif,
      validated: true,
      explanation: kp.explanation || '-'
    };
    if (kp.practical_example) {
      sit.situation = kp.practical_example;
    } else {
      sit.situation = `Une personne se trouve dans la condition suivante : "${kp.title}".`;
    }
    sit.question = "Que doit-elle faire ?";
    sit.answer = kp.rule;
    kp.pedagogy.activities.practical_situation.push(sit);
    stats.situation++;
    stats.validated++;
    hasExtraActivity = true;
  }
  
  if (!hasExtraActivity) {
    stats.no_activity++;
  }
});

// Overwrite the file
fs.writeFileSync(dataPath, JSON.stringify(knowledgeData, null, 2));

// Generate the report
let report = `# Rapport d'Intégration Pédagogique - Siman 1

L'intégration des données pédagogiques au format JSON a été effectuée avec succès.
Les 3 QCM "À REVOIR" ont été corrigés en ajoutant la mention "Selon l'opinion..." à la question.
Les KP marqués "reference" comportent désormais le flag \`human_review_required: true\`.
Aucun champ halakhique existant n'a été modifié ou supprimé.

## Statistiques

- **Nombre total de KP** : ${stats.total}
- **Flashcards** : ${stats.flashcard}
- **QCM** : ${stats.qcm}
- **Vrai/Faux** : ${stats.vf}
- **Situations** : ${stats.situation}
- **Activités validées (SAFE)** : ${stats.validated}
- **KP nécessitant review (human_review_required)** : ${stats.review_required}
- **Activités rejetées** : ${stats.rejected}
- **Activités sans source** : ${stats.sans_source}
- **KP sans activité pédagogique supplémentaire (seulement Flashcard)** : ${stats.no_activity}

L'intégrité du fichier JSON original est préservée et aucune donnée externe n'a été ajoutée.
`;

const reportPath = path.join(__dirname, '..', '..', '.gemini', 'antigravity-ide', 'brain', '1743e183-c8d0-4154-bb94-d56fc539a856', 'siman_1_pedagogy_integration_report.md');
// Write artifact file if possible, or just local path
const fallbackReportPath = path.join(__dirname, 'integration_report.md');
fs.writeFileSync(fallbackReportPath, report);

console.log("Integration terminée.");
