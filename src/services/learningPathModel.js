import { isObjectivelyAssessable, validateActivity } from "./activityValidator.js";

export const LEARNING_CATEGORY = Object.freeze({
  id: "morning_conduct",
  title: "הלכות הנהגת אדם בבוקר",
  subtitle: "Les lois qui accompagnent le début de la journée",
  simanIds: Object.freeze(["siman_1", "siman_2", "siman_3"])
});

export const LESSON_SIZE = 3;

// Le JSON du Siman 1 suit l'ordre d'extraction éditoriale. Pour un débutant,
// le parcours commence plutôt par les gestes réellement vécus au réveil.
const SIMAN_1_PEDAGOGICAL_START = Object.freeze([
  "s1-kp-004", // Se lever avec force
  "s1-kp-016", // Ne pas se lever brusquement
  "s1-kp-018", // Modé Ani
  "s1-kp-019", // Modé Ani avant Nétilat Yadaïm
  "s1-kp-020", // Consacrer le début de la journée
  "s1-kp-021", // Éducation des enfants
  "s1-kp-008", // Se préparer à la prière
  "s1-kp-005", // Horaires du Chema et de la prière
  "s1-kp-006", // Définition de la Zrizout, après sa mise en contexte
  "s1-kp-007",
  "s1-kp-009",
  "s1-kp-010",
  "s1-kp-011",
  "s1-kp-012",
  "s1-kp-013",
  "s1-kp-014",
  "s1-kp-015",
  "s1-kp-001",
  "s1-kp-002",
  "s1-kp-003",
  "s1-kp-017"
]);

const LESSON_TITLES = Object.freeze({
  siman_1: Object.freeze([
    "Le réveil du matin",
    "Les premiers instants de la journée",
    "Se préparer sans précipitation",
    "Sommeil et disponibilité",
    "Trouver le bon rythme",
    "Étude, réveil et vigilance",
    "Courage et comportement"
  ]),
  siman_2: Object.freeze([
    "S'habiller avec pudeur",
    "L'ordre de l'habillement",
    "Bien se chausser"
  ]),
  siman_3: Object.freeze([
    "Les besoins du matin",
    "Ne pas se retenir",
    "La conduite aux toilettes"
  ])
});

const cleanText = (value) => String(value || "")
  .replace(/^\s*\d+[.)]\s*/, "")
  .replace(/\s+/g, " ")
  .trim();

const getSourceSeif = (kp) => String(
  kp?.sources?.[0]?.seif
  || kp?.source_seif
  || Object.values(kp?.pedagogy?.activities || {})
    .flatMap((activity) => Array.isArray(activity) ? activity : [activity])
    .find(Boolean)?.source_seif
  || ""
);
const getSeifNumber = (kp) => {
  const match = getSourceSeif(kp).match(/\d+/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
};

const sentenceExcerpt = (value, maxLength = 330) => {
  const text = cleanText(value);
  if (text.length <= maxLength) return text;

  const sentences = text.match(/[^.!?]+[.!?]+(?:[”»']|$)?/g) || [];
  const firstSentence = cleanText(sentences[0]);
  if (firstSentence && firstSentence.length <= maxLength) return firstSentence;

  const slice = text.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(" ");
  return `${slice.slice(0, lastSpace > 120 ? lastSpace : maxLength).trim()}…`;
};

const deterministicRotate = (values, seed) => {
  if (values.length < 2) return values;
  const offset = [...String(seed)].reduce((sum, char) => sum + char.charCodeAt(0), 0) % values.length;
  return [...values.slice(offset), ...values.slice(0, offset)];
};

const getEditorialObjectiveActivity = (kp) => {
  const activities = kp?.pedagogy?.activities || {};
  const orderedTypes = ["multiple_choice", "true_false", "practical_situation"];

  for (const type of orderedTypes) {
    const rawActivities = activities[type];
    if (!rawActivities) continue;

    for (const rawActivity of Array.isArray(rawActivities) ? rawActivities : [rawActivities]) {
      const activity = { ...rawActivity, type };
      if (validateActivity(activity, kp).isValid && isObjectivelyAssessable(activity)) {
        return activity;
      }
    }
  }

  return null;
};

export const getOrderedKnowledgePoints = (knowledgeData, simanId) => {
  const points = [...(knowledgeData?.knowledge_points || [])];
  const originalIndex = new Map(points.map((kp, index) => [kp.id, index]));
  const bySource = points.sort((left, right) => (
    getSeifNumber(left) - getSeifNumber(right)
    || originalIndex.get(left.id) - originalIndex.get(right.id)
  ));

  if (simanId !== "siman_1") return bySource;

  const byId = new Map(bySource.map((kp) => [kp.id, kp]));
  const preferred = SIMAN_1_PEDAGOGICAL_START.map((id) => byId.get(id)).filter(Boolean);
  const preferredIds = new Set(preferred.map((kp) => kp.id));
  return [...preferred, ...bySource.filter((kp) => !preferredIds.has(kp.id))];
};

export const createLearningItem = (kp) => {
  const sourceText = cleanText(kp?.rule || kp?.pedagogy?.simple_explanation);
  const simpleText = cleanText(kp?.pedagogy?.simple_explanation || kp?.rule);
  const coreText = sentenceExcerpt(simpleText || sourceText);
  const explanation = cleanText(kp?.explanation);

  return {
    id: kp.id,
    title: kp.title,
    sourceSeif: getSourceSeif(kp),
    coreText,
    explanation: explanation && explanation !== coreText ? explanation : null,
    fullText: sourceText && sourceText !== coreText ? sourceText : null,
    halakhaStatus: kp.halakha_status || "unclassified",
    needsEditorialReview: kp?.pedagogy?.human_review_required === true
  };
};

const createRecognitionQuestion = (kp, optionPool, scopeId) => {
  const item = createLearningItem(kp);
  const optionTitles = [...new Set(optionPool.map((candidate) => candidate.title))];
  if (!optionTitles.includes(kp.title)) optionTitles.push(kp.title);
  const options = deterministicRotate(optionTitles.slice(0, 4), `${scopeId}-${kp.id}`);

  return {
    id: `${scopeId}-${kp.id}-recognition`,
    knowledgePointId: kp.id,
    sourceSeif: item.sourceSeif,
    kind: "choice",
    eyebrow: "Relie la règle à son thème",
    prompt: "À quelle notion correspond ce rappel ?",
    context: item.coreText,
    options,
    correctAnswer: kp.title,
    explanation: `Cette règle appartient à la notion « ${kp.title} » (סעיף ${item.sourceSeif}).`,
    provenance: "source_recognition"
  };
};

const normalizeEditorialQuestion = (kp, activity, scopeId) => {
  const common = {
    id: `${scopeId}-${activity.activity_id}`,
    activityId: activity.activity_id,
    knowledgePointId: kp.id,
    sourceSeif: activity.source_seif,
    explanation: cleanText(activity.explanation) || createLearningItem(kp).coreText,
    provenance: "validated_editorial_activity",
    conditions: cleanText(activity.conditions) || null
  };

  if (activity.type === "true_false") {
    return {
      ...common,
      kind: "true_false",
      eyebrow: "Vrai ou faux",
      prompt: activity.statement,
      context: null,
      options: ["Vrai", "Faux"],
      correctAnswer: activity.is_true ? "Vrai" : "Faux"
    };
  }

  return {
    ...common,
    kind: "choice",
    eyebrow: activity.type === "practical_situation" ? "Mise en situation" : "Choisis la bonne réponse",
    prompt: activity.type === "practical_situation"
      ? `${activity.situation} ${activity.question}`.trim()
      : activity.question,
    context: null,
    options: activity.options,
    correctAnswer: activity.correct_answer
  };
};

const makeOptionPool = (allPoints, lessonPoints) => {
  const pool = [...lessonPoints];
  const usedIds = new Set(pool.map((kp) => kp.id));

  for (const kp of allPoints) {
    if (pool.length >= 3) break;
    if (!usedIds.has(kp.id)) {
      usedIds.add(kp.id);
      pool.push(kp);
    }
  }

  return pool;
};

const createCheckpointQuestion = (kp, optionPool, scopeId) => {
  const editorialActivity = getEditorialObjectiveActivity(kp);
  return editorialActivity
    ? normalizeEditorialQuestion(kp, editorialActivity, scopeId)
    : createRecognitionQuestion(kp, optionPool, scopeId);
};

export const buildSimanCurriculum = (simanConfig, knowledgeData, lessonSize = LESSON_SIZE) => {
  const simanId = simanConfig.id;
  const orderedPoints = getOrderedKnowledgePoints(knowledgeData, simanId);
  const lessons = [];

  for (let start = 0; start < orderedPoints.length; start += lessonSize) {
    const lessonPoints = orderedPoints.slice(start, start + lessonSize);
    const lessonIndex = lessons.length;
    const lessonId = `${simanId}-lesson-${lessonIndex + 1}`;
    const optionPool = makeOptionPool(orderedPoints, lessonPoints);
    const customTitle = LESSON_TITLES[simanId]?.[lessonIndex];

    lessons.push({
      id: lessonId,
      index: lessonIndex,
      number: lessonIndex + 1,
      title: customTitle || lessonPoints[0]?.title || `Leçon ${lessonIndex + 1}`,
      items: lessonPoints.map(createLearningItem),
      questions: lessonPoints.map((kp) => createCheckpointQuestion(kp, optionPool, lessonId))
    });
  }

  return {
    id: simanId,
    simanNumber: simanConfig.simanNumber,
    shortLabel: simanConfig.shortLabel,
    title: knowledgeData?.meta?.title || simanConfig.shortLabel,
    titleHebrew: knowledgeData?.meta?.title_hebrew || LEARNING_CATEGORY.title,
    learningMode: knowledgeData?.meta?.learning_mode || "editorial",
    needsEditorialReview: knowledgeData?.meta?.review_status === "pilot_needs_human_editorial_review",
    lessons,
    knowledgePoints: orderedPoints
  };
};

const pickEvenly = (questions, maximum) => {
  if (questions.length <= maximum) return questions;
  if (maximum === 1) return [questions[0]];

  const picked = [];
  const usedIndexes = new Set();
  for (let index = 0; index < maximum; index += 1) {
    const sourceIndex = Math.round(index * (questions.length - 1) / (maximum - 1));
    if (!usedIndexes.has(sourceIndex)) {
      usedIndexes.add(sourceIndex);
      picked.push(questions[sourceIndex]);
    }
  }
  return picked;
};

export const buildSimanExamQuestions = (curriculum, maximum = 8) => {
  const onePerLesson = curriculum.lessons.map((lesson, index) => (
    lesson.questions[index % lesson.questions.length]
  ));
  return pickEvenly(onePerLesson, maximum).map((question) => ({
    ...question,
    id: `${curriculum.id}-exam-${question.id}`
  }));
};

export const buildCategoryExamQuestions = (curricula, perSiman = 2) => (
  LEARNING_CATEGORY.simanIds.flatMap((simanId) => {
    const curriculum = curricula[simanId];
    if (!curriculum) return [];
    return pickEvenly(buildSimanExamQuestions(curriculum, 8), perSiman).map((question) => ({
      ...question,
      id: `category-exam-${question.id}`,
      simanId,
      simanNumber: curriculum.simanNumber
    }));
  })
);
