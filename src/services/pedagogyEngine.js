/**
 * @deprecated LEGACY EN QUARANTAINE — ne pas connecter au Learning Core.
 * pedagogyEngine.js
 * 
 * Moteur pédagogique strict.
 * Le Learning Core V1 interdit toute génération runtime et lit exclusivement
 * les activités prévalidées des Knowledge JSON.
 */

/**
 * Vérifie si le KP contient les éléments minimaux pour être traité
 */
const validateKpStructure = (kp) => {
  if (!kp || !kp.id || !kp.sources || kp.sources.length === 0) return false;
  if (!kp.rule && !kp.claims) return false;
  return true;
};

/**
 * Vérifie si on peut générer une activité de type donné pour un KP
 */
export const canGenerateActivity = (kp, activityType) => {
  if (!validateKpStructure(kp)) {
    return { canGenerate: false, reason: "KP invalide ou sans source" };
  }

  if (activityType === 'card') {
    return { canGenerate: true };
  }

  if (activityType === 'quiz') {
    // Pour un QCM sûr, il nous faut une bonne réponse ET des distracteurs SÛRS.
    // Distracteurs sûrs = common_trap présent OU multiple_opinions avec claims détaillés.
    if (kp.common_trap) {
      return { canGenerate: true };
    }
    // TODO: Implémenter logique poussée pour multiple opinions ou conditions
    return { canGenerate: false, reason: "Pas de distracteur sûr (common_trap absent)" };
  }

  if (activityType === 'true_false') {
    // Pour vrai/faux, si on n'a pas de common_trap pour faire le "faux", on ne peut faire que des questions "Vrai",
    // ce qui a un intérêt limité, mais c'est sûr. On va dire qu'on a besoin d'un common_trap pour faire un Faux.
    if (kp.common_trap) {
      return { canGenerate: true };
    }
    return { canGenerate: false, reason: "Pas de distracteur sûr pour générer une affirmation fausse" };
  }

  return { canGenerate: false, reason: "Type d'activité inconnu" };
};

/**
 * Formate la source pour la traçabilité
 */
const formatSource = (sources) => {
  if (!sources || sources.length === 0) return "Inconnue";
  return sources.map(s => `Siman ${s.siman}, Seif ${s.seif}`).join(" ; ");
};

/**
 * Génère une "Card" (Fiche d'apprentissage)
 */
const generateCardActivity = (kp) => {
  return {
    activity_id: `card_${kp.id}_${Date.now()}`,
    knowledge_point_id: kp.id,
    source_seif: formatSource(kp.sources),
    activity_type: "card",
    question: kp.title,
    options: [],
    correct_answer: kp.rule,
    explanation: kp.explanation || kp.rule,
    
    // UI extras
    title: kp.title,
    rule: kp.rule,
    practical_example: kp.practical_example,
    halakha_status: kp.halakha_status
  };
};

/**
 * Génère une activité Vrai/Faux
 */
const generateTrueFalseActivity = (kp) => {
  // On n'utilise que le common_trap comme affirmation fausse pour être 100% sûr
  const isTrue = Math.random() > 0.5;
  
  let statement = isTrue ? kp.rule : kp.common_trap;
  
  let questionPrefix = "Vrai ou Faux ? ";
  if (kp.halakha_status === 'conditional') {
    questionPrefix = "Dans ce cas précis, Vrai ou Faux ? ";
  }

  return {
    activity_id: `tf_${kp.id}_${Date.now()}`,
    knowledge_point_id: kp.id,
    source_seif: formatSource(kp.sources),
    activity_type: "true_false",
    question: questionPrefix + statement,
    options: ["Vrai", "Faux"],
    correct_answer: isTrue ? "Vrai" : "Faux",
    explanation: kp.explanation ? `${kp.rule} (${kp.explanation})` : kp.rule,
    
    // UI extras
    correctIndex: isTrue ? 0 : 1
  };
};

/**
 * Génère un QCM à partir du KP
 */
const generateQuizActivity = (kp) => {
  let questionText = `Quelle est la règle concernant : ${kp.title} ?`;
  
  if (kp.halakha_status === "multiple_opinions") {
    questionText = `Concernant "${kp.title}", sachant qu'il y a des divergences d'opinions, que faut-il retenir ?`;
  } else if (kp.halakha_status === "conditional") {
    questionText = `Sous quelle condition la règle s'applique-t-elle : "${kp.title}" ?`;
  }

  const options = [];
  const correctAnswer = kp.rule;
  options.push(correctAnswer);
  
  if (kp.common_trap) {
    options.push(kp.common_trap);
  }

  // Pour l'instant, on se limite à 2 choix si on n'a que la règle et le common_trap.
  // On ne force pas un QCM à 4 choix.

  // Mélange des options
  const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
  const correctIndex = shuffledOptions.indexOf(correctAnswer);

  return {
    activity_id: `quiz_${kp.id}_${Date.now()}`,
    knowledge_point_id: kp.id,
    source_seif: formatSource(kp.sources),
    activity_type: "quiz",
    question: questionText,
    options: shuffledOptions,
    correct_answer: correctAnswer,
    explanation: kp.explanation ? `${kp.rule}\nExplication : ${kp.explanation}` : kp.rule,
    
    // UI extras
    correctIndex: correctIndex
  };
};

/**
 * Validateur final automatique
 */
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

/**
 * Point d'entrée principal
 */
export const generateActivityForKp = (kp, forceType = null) => {
  const types = forceType ? [forceType] : ["quiz", "true_false", "card"];
  
  for (const type of types) {
    const check = canGenerateActivity(kp, type);
    if (check.canGenerate) {
      let activity;
      if (type === 'card') activity = generateCardActivity(kp);
      else if (type === 'quiz') activity = generateQuizActivity(kp);
      else if (type === 'true_false') activity = generateTrueFalseActivity(kp);
      
      const validation = validateActivity(activity);
      if (!validation.isValid) {
        console.warn(`Activité générée invalide : ${validation.reason}`, activity);
        continue; // On essaie un autre type si possible
      }
      
      return activity;
    }
  }
  
  // Si rien ne passe, on renvoie null
  return null;
};
