import {
  getBeginnerLearningContent,
  removeLearningJargon
} from "../data/beginnerLearningContent.js";
import { getGlossaryForText } from "../data/learningGlossary.js";

export const LEARNING_CATEGORY = Object.freeze({
  id: "morning_conduct",
  title: "הלכות הנהגת אדם בבוקר",
  subtitle: "Les lois qui accompagnent le début de la journée",
  simanIds: Object.freeze(["siman_1", "siman_2", "siman_3"])
});

export const LESSON_SIZE = 3;

const SIMAN_1_PEDAGOGICAL_START = Object.freeze([
  "s1-kp-004",
  "s1-kp-016",
  "s1-kp-018",
  "s1-kp-019",
  "s1-kp-020",
  "s1-kp-021",
  "s1-kp-008",
  "s1-kp-005",
  "s1-kp-006",
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

const getSourceParagraph = (kp) => String(
  kp?.sources?.[0]?.seif
  || kp?.source_seif
  || Object.values(kp?.pedagogy?.activities || {})
    .flatMap((activity) => Array.isArray(activity) ? activity : [activity])
    .find(Boolean)?.source_seif
  || ""
);

const getParagraphNumber = (kp) => {
  const match = getSourceParagraph(kp).match(/\d+/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
};

const sentenceExcerpt = (value, maxLength = 360) => {
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

const getSourceNumbers = (kp) => {
  const sourceValues = (kp?.sources || []).map((source) => source?.seif);
  if (sourceValues.length === 0) sourceValues.push(getSourceParagraph(kp));
  return [...new Set(sourceValues.flatMap((value) => String(value || "").match(/\d+/g) || []))];
};

const buildSourceIndex = (sourceData) => new Map((sourceData?.halakhot || []).map((halakha) => [
  String(halakha.seif),
  {
    siman: sourceData?._meta?.siman,
    paragraph: String(halakha.seif),
    title: halakha.titre_seif || halakha.sujet_fr || `Paragraphe ${halakha.seif}`,
    french: String(halakha.texte_integral?.francais || "").trim()
  }
]));

export const getOrderedKnowledgePoints = (knowledgeData, simanId) => {
  const points = [...(knowledgeData?.knowledge_points || [])];
  const originalIndex = new Map(points.map((kp, index) => [kp.id, index]));
  const bySource = points.sort((left, right) => (
    getParagraphNumber(left) - getParagraphNumber(right)
    || originalIndex.get(left.id) - originalIndex.get(right.id)
  ));

  if (simanId !== "siman_1") return bySource;

  const byId = new Map(bySource.map((kp) => [kp.id, kp]));
  const preferred = SIMAN_1_PEDAGOGICAL_START.map((id) => byId.get(id)).filter(Boolean);
  const preferredIds = new Set(preferred.map((kp) => kp.id));
  return [...preferred, ...bySource.filter((kp) => !preferredIds.has(kp.id))];
};

export const createLearningItem = (kp, sourceIndex = new Map()) => {
  const rawRule = cleanText(kp?.rule || kp?.pedagogy?.simple_explanation);
  const beginnerContent = getBeginnerLearningContent(kp, rawRule);
  const references = getSourceNumbers(kp).map((number) => sourceIndex.get(number)).filter(Boolean);

  return {
    id: kp.id,
    title: beginnerContent.title || removeLearningJargon(kp.title),
    sourceParagraph: getSourceParagraph(kp),
    coreText: sentenceExcerpt(beginnerContent.coreText),
    explanation: beginnerContent.explanation || null,
    references,
    vocabulary: [],
    halakhaStatus: kp.halakha_status || "unclassified",
    needsEditorialReview: kp?.pedagogy?.human_review_required === true
  };
};

const scheduleVocabulary = (items) => {
  const appearances = new Map();
  return items.map((item) => {
    const vocabulary = getGlossaryForText(`${item.title} ${item.coreText} ${item.explanation || ""}`)
      .filter((entry) => (appearances.get(entry.term) || 0) < 2)
      .map((entry) => {
        const exposure = (appearances.get(entry.term) || 0) + 1;
        appearances.set(entry.term, exposure);
        return { ...entry, exposure };
      });
    return { ...item, vocabulary };
  });
};

const makeOptionPool = (allItems, lessonItems) => {
  const pool = [...lessonItems];
  const usedIds = new Set(pool.map((item) => item.id));

  for (const item of allItems) {
    if (pool.length >= 3) break;
    if (!usedIds.has(item.id)) {
      usedIds.add(item.id);
      pool.push(item);
    }
  }
  return pool;
};

const getRuleOptions = (optionPool, seed) => deterministicRotate(
  [...new Set(optionPool.map((item) => item.coreText))].slice(0, 4),
  seed
);

const createMemoryQuestion = (item, optionPool, scopeId) => ({
  id: `${scopeId}-${item.id}-memory`,
  knowledgePointId: item.id,
  sourceParagraph: item.sourceParagraph,
  kind: "memory_choice",
  eyebrow: "Défi mémoire",
  prompt: `Que faut-il retenir au sujet de « ${item.title} » ?`,
  context: null,
  options: getRuleOptions(optionPool, `${scopeId}-${item.id}-memory`),
  correctAnswer: item.coreText,
  explanation: `Le rappel à retenir est : ${item.coreText}`,
  provenance: "learned_rules_only"
});

const createTrueFalseQuestion = (item, optionPool, scopeId, questionIndex) => {
  const checksum = [...`${scopeId}-${item.id}-${questionIndex}`]
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const isMatch = checksum % 2 === 0;
  const otherItem = optionPool.find((candidate) => candidate.id !== item.id) || item;
  const comparedItem = isMatch ? item : otherItem;
  return {
    id: `${scopeId}-${item.id}-true-false`,
    knowledgePointId: item.id,
    sourceParagraph: item.sourceParagraph,
    kind: "true_false",
    eyebrow: "Vrai ou faux",
    prompt: `Ce rappel parle-t-il de « ${comparedItem.title} » ?`,
    context: item.coreText,
    options: ["Vrai", "Faux"],
    correctAnswer: isMatch ? "Vrai" : "Faux",
    explanation: `Ce rappel concerne « ${item.title} » : ${item.coreText}`,
    provenance: "learned_rules_only"
  };
};

const createBeginnerChallengeQuestion = (item, optionPool, scopeId) => ({
  id: `${scopeId}-${item.id}-beginner-challenge`,
  knowledgePointId: item.id,
  sourceParagraph: item.sourceParagraph,
  kind: "beginner_challenge",
  eyebrow: "Explique-le à un ami",
  prompt: `Une personne découvre « ${item.title} ». Quelle explication doit-elle retenir ?`,
  context: null,
  options: getRuleOptions(optionPool, `${scopeId}-${item.id}-challenge`),
  correctAnswer: item.coreText,
  explanation: `La formulation la plus juste est : ${item.coreText}`,
  provenance: "learned_rules_only"
});

const createCheckpointQuestion = (item, optionPool, scopeId, questionIndex) => {
  const format = questionIndex % 3;
  if (format === 1) return createTrueFalseQuestion(item, optionPool, scopeId, questionIndex);
  if (format === 2) return createBeginnerChallengeQuestion(item, optionPool, scopeId);
  return createMemoryQuestion(item, optionPool, scopeId);
};

export const buildSimanCurriculum = (
  simanConfig,
  knowledgeData,
  sourceData = null,
  lessonSize = LESSON_SIZE
) => {
  const simanId = simanConfig.id;
  const orderedPoints = getOrderedKnowledgePoints(knowledgeData, simanId);
  const sourceIndex = buildSourceIndex(sourceData);
  const allItems = scheduleVocabulary(orderedPoints.map((kp) => createLearningItem(kp, sourceIndex)));
  const lessons = [];

  for (let start = 0; start < allItems.length; start += lessonSize) {
    const lessonItems = allItems.slice(start, start + lessonSize);
    const lessonIndex = lessons.length;
    const lessonId = `${simanId}-lesson-${lessonIndex + 1}`;
    const optionPool = makeOptionPool(allItems, lessonItems);
    const customTitle = LESSON_TITLES[simanId]?.[lessonIndex];

    lessons.push({
      id: lessonId,
      index: lessonIndex,
      number: lessonIndex + 1,
      title: customTitle || lessonItems[0]?.title || `Leçon ${lessonIndex + 1}`,
      items: lessonItems,
      questions: lessonItems.map((item, questionIndex) => (
        createCheckpointQuestion(item, optionPool, lessonId, questionIndex)
      ))
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
