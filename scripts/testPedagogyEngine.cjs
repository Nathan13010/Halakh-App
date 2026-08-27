const fs = require('fs');
const path = require('path');

// Le script utilise ES modules dynamiquement ou on simule la logique pour le test.
// Comme le projet React utilise import/export, on va recréer la logique ici pour le rapport,
// ou bien l'importer si package.json le permet. Puisque c'est un script de test isolé,
// on recrée la fonction canGenerateActivity et validateActivity pour produire le rapport.

const dataPath = path.join(__dirname, '..', 'public', 'data', 'הלכות הנהגת אדם בבוקר', 'siman_1_knowledge.json');
const knowledgeData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const validateKpStructure = (kp) => {
  if (!kp || !kp.id || !kp.sources || kp.sources.length === 0) return false;
  if (!kp.rule && !kp.claims) return false;
  return true;
};

const canGenerateActivity = (kp, activityType) => {
  if (!validateKpStructure(kp)) return { canGenerate: false, reason: "KP invalide ou sans source" };
  if (activityType === 'card') return { canGenerate: true };
  if (activityType === 'quiz') {
    if (kp.common_trap) return { canGenerate: true };
    return { canGenerate: false, reason: "Pas de distracteur sûr (common_trap absent)" };
  }
  if (activityType === 'true_false') {
    if (kp.common_trap) return { canGenerate: true };
    return { canGenerate: false, reason: "Pas de distracteur sûr pour générer une affirmation fausse" };
  }
  return { canGenerate: false, reason: "Type d'activité inconnu" };
};

const formatSource = (sources) => {
  if (!sources || sources.length === 0) return "Inconnue";
  return sources.map(s => `Siman ${s.siman}, Seif ${s.seif}`).join(" ; ");
};

const validateActivity = (activity) => {
  if (!activity.knowledge_point_id) return { isValid: false, reason: "knowledge_point_id manquant" };
  if (!activity.source_seif) return { isValid: false, reason: "source_seif manquant" };
  if (!activity.question) return { isValid: false, reason: "question manquante" };
  if (!activity.correct_answer) return { isValid: false, reason: "réponse correcte manquante" };
  if (!activity.explanation) return { isValid: false, reason: "explication manquante" };
  if (activity.activity_type !== 'card') {
    if (!activity.options || activity.options.length < 2) return { isValid: false, reason: "pas assez d'options" };
    if (!activity.options.includes(activity.correct_answer)) return { isValid: false, reason: "la réponse correcte n'est pas dans les options" };
  }
  return { isValid: true };
};

const generateCardActivity = (kp) => ({
  activity_id: `card_${kp.id}`,
  knowledge_point_id: kp.id,
  source_seif: formatSource(kp.sources),
  activity_type: "card",
  question: kp.title,
  options: [],
  correct_answer: kp.rule,
  explanation: kp.explanation || kp.rule
});

const generateTrueFalseActivity = (kp) => {
  const isTrue = true; // Fixé pour le test de structure
  let statement = kp.rule;
  let questionPrefix = kp.halakha_status === 'conditional' ? "Dans ce cas précis, Vrai ou Faux ? " : "Vrai ou Faux ? ";
  return {
    activity_id: `tf_${kp.id}`,
    knowledge_point_id: kp.id,
    source_seif: formatSource(kp.sources),
    activity_type: "true_false",
    question: questionPrefix + statement,
    options: ["Vrai", "Faux"],
    correct_answer: "Vrai",
    explanation: kp.explanation ? `${kp.rule} (${kp.explanation})` : kp.rule
  };
};

const generateQuizActivity = (kp) => {
  let questionText = `Quelle est la règle concernant : ${kp.title} ?`;
  if (kp.halakha_status === "multiple_opinions") questionText = `Concernant "${kp.title}", sachant qu'il y a des divergences d'opinions, que faut-il retenir ?`;
  else if (kp.halakha_status === "conditional") questionText = `Sous quelle condition la règle s'applique-t-elle : "${kp.title}" ?`;
  
  const options = [kp.rule];
  if (kp.common_trap) options.push(kp.common_trap);
  
  return {
    activity_id: `quiz_${kp.id}`,
    knowledge_point_id: kp.id,
    source_seif: formatSource(kp.sources),
    activity_type: "quiz",
    question: questionText,
    options: options,
    correct_answer: kp.rule,
    explanation: kp.explanation ? `${kp.rule}\nExplication : ${kp.explanation}` : kp.rule
  };
};

let stats = {
  total_kp: knowledgeData.knowledge_points.length,
  used_kp: 0,
  level_1_used: 0,
  level_2_used: 0,
  generated_activities: 0,
  quiz_count: 0,
  tf_count: 0,
  card_count: 0,
  refused_activities: 0,
  refusal_reasons: {},
  no_source_activities: 0,
  invalid_activities: 0
};

knowledgeData.knowledge_points.forEach(kp => {
  // On simule le passage dans le moteur pour générer Card, puis Quiz, puis TF
  
  // Card (toujours générée)
  let cardCheck = canGenerateActivity(kp, 'card');
  if (cardCheck.canGenerate) {
    let card = generateCardActivity(kp);
    let v = validateActivity(card);
    if(v.isValid) {
      stats.generated_activities++;
      stats.card_count++;
      stats.used_kp++;
      if (kp.learning_level === 1) stats.level_1_used++;
      if (kp.learning_level === 2) stats.level_2_used++;
    } else {
      stats.invalid_activities++;
    }
  }

  // Quiz
  let quizCheck = canGenerateActivity(kp, 'quiz');
  if (quizCheck.canGenerate) {
    let quiz = generateQuizActivity(kp);
    let v = validateActivity(quiz);
    if(v.isValid) {
      stats.generated_activities++;
      stats.quiz_count++;
    } else {
      stats.invalid_activities++;
    }
  } else {
    stats.refused_activities++;
    stats.refusal_reasons[quizCheck.reason] = (stats.refusal_reasons[quizCheck.reason] || 0) + 1;
  }

  // True/False
  let tfCheck = canGenerateActivity(kp, 'true_false');
  if (tfCheck.canGenerate) {
    let tf = generateTrueFalseActivity(kp);
    let v = validateActivity(tf);
    if(v.isValid) {
      stats.generated_activities++;
      stats.tf_count++;
    } else {
      stats.invalid_activities++;
    }
  } else {
    stats.refused_activities++;
    stats.refusal_reasons[tfCheck.reason] = (stats.refusal_reasons[tfCheck.reason] || 0) + 1;
  }
  
  if (!kp.sources || kp.sources.length === 0) {
    stats.no_source_activities++;
  }
});

fs.writeFileSync(path.join(__dirname, 'report.json'), JSON.stringify(stats, null, 2));
console.log("Rapport généré.");
