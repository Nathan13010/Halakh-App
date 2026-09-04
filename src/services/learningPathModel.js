import {
  getBeginnerLearningContent,
  removeLearningJargon
} from "../data/beginnerLearningContent.js";
import { getGlossaryForText } from "../data/learningGlossary.js";

export const LEARNING_CATEGORY = Object.freeze({
  id: "morning_conduct",
  title: "La conduite de l'homme au réveil",
  titleHebrew: "הלכות הנהגת אדם בבוקר",
  subtitle: "Les lois qui accompagnent le début de la journée",
  simanIds: Object.freeze(["siman_1", "siman_2", "siman_3", "siman_4", "siman_5", "siman_6", "siman_7"])
});

export const LESSON_SIZE = 3;

const SIMAN_1_PEDAGOGICAL_START = Object.freeze([
  "s1-kp-004",
  "s1-kp-016",
  "s1-kp-018",
  "s1-kp-019",
  "s1-kp-020",
  "s1-kp-021",
  "s1-kp-005",
  "s1-kp-008",
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
    "Un réveil en douceur et plein de sens ☀️",
    "Mes premières actions donnent le ton 🎯",
    "Rester zen et organisé 🧘‍♂️",
    "Le sommeil : prendre soin de son corps 🌙",
    "Fierté et bienveillance face aux autres 🛡️",
    "Le cœur de la prière ❤️"
  ]),
  siman_2: Object.freeze([
    "Le respect de soi dès le matin 👕",
    "Mettre du sens dans chaque geste 👟",
    "L'humilité dans notre attitude 🕊️",
    "La Kippa, un rappel au-dessus de nos têtes 🧢",
    "La religion s'adapte à la vie 🌊",
    "Vivre sa foi dans la joie, pas la souffrance ❤️"
  ]),
  siman_3: Object.freeze([
    "Écouter son corps, une règle d'or 🩺",
    "La pudeur, même en privé 🚪",
    "Mettre son esprit sur \"pause\" 🧠",
    "Le respect des objets sacrés 📖",
    "La propreté, c'est sacré 🧼",
    "Séparer la nourriture des toilettes 🍎"
  ]),
  siman_4: Object.freeze([
    "Un réveil plein d'énergie 🌅",
    "Le mot magique du matin 🗣️",
    "Une histoire de famille 👨👩👧👦",
    "Pas de stress au réveil ! 😌",
    "Une hygiène spirituelle au quotidien ✨",
    "La sagesse des toilettes 🚰"
  ]),
  siman_5: Object.freeze([
    "Le sens caché du Nom divin ✨",
    "Elokim : La source de toute énergie ⚡",
    "L'astuce spirituelle du matin 🌅",
    "Mettre sur pause : Joie et sérénité 🧘‍♂️",
    "Un petit pas avant l'action 🎯",
    "Le respect du Nom imprononçable 🤫"
  ]),
  siman_6: Object.freeze([
    "La merveille du corps humain 🧬",
    "Un lavage simple et concentré 🚰",
    "La santé avant tout ! 🏃‍♂️",
    "Temps et imprévus nocturnes 🌙",
    "Une pratique pour toute la famille 👨‍👩‍👧‍👦",
    "L'âme qui respire : Elohaï Néchama 🌬️"
  ]),
  siman_7: Object.freeze([
    "Le miracle de notre corps 🧬",
    "À chaque visite, sa bénédiction 💧",
    "Oups, j'ai oublié de bénir ! 😅",
    "Mode \"tout-terrain\" (sans eau) 🏜️",
    "Le bénéfice du doute 🤔"
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

const trimAtWord = (value, maxLength) => {
  const text = cleanText(value);
  if (text.length <= maxLength) return text;
  const slice = text.slice(0, maxLength - 1);
  const lastSpace = slice.lastIndexOf(" ");
  return `${slice.slice(0, lastSpace > 45 ? lastSpace : maxLength - 1).trim()}…`;
};

const compactQuizAnswer = (value, maxLength = 110) => {
  const text = cleanText(value)
    .replace(/\s*\[(?:[^\]]*(?:Ibid|Yalkout|Halikhot|Chéérit|tome|p\.)[^\]]*)\]\s*/gi, " ")
    .replace(/^Cette règle (?:indique|souligne|présente) (?:que )?/i, "")
    .replace(/^La règle indique (?:que )?/i, "")
    .replace(/^On veillera à /i, "Il faut ");

  if (text.length <= maxLength) return text;

  const clauseEnd = [text.indexOf(";"), text.indexOf(",")]
    .filter((index) => index >= 45 && index < maxLength)
    .sort((left, right) => left - right)[0];
  if (Number.isInteger(clauseEnd)) return `${text.slice(0, clauseEnd).trim()}.`;

  return trimAtWord(text, maxLength);
};

const lowerFirst = (value) => value.charAt(0).toLocaleLowerCase("fr") + value.slice(1);

const createDirectQuizPrompt = (title) => {
  const normalizedTitle = cleanText(title);
  const patterns = [
    [/^Ordre (?:pour|de) (.+)$/i, (subject) => `Dans quel ordre faut-il ${lowerFirst(subject)} ?`],
    [/^Façon de (.+)$/i, (subject) => `Comment faut-il ${lowerFirst(subject)} ?`],
    [/^Autorisation de (.+)$/i, (subject) => `Quand peut-on ${lowerFirst(subject)} ?`],
    [/^Pudeur (.+)$/i, (subject) => `Comment préserver la pudeur ${lowerFirst(subject)} ?`],
    [/^Interdiction de (.+)$/i, (subject) => `Que faut-il éviter concernant ${lowerFirst(subject)} ?`],
    [/^Obligation de (.+)$/i, (subject) => `Quelle obligation concerne ${lowerFirst(subject)} ?`]
  ];

  for (const [pattern, buildPrompt] of patterns) {
    const match = normalizedTitle.match(pattern);
    if (match) return buildPrompt(match[1]);
  }
  return `Que signifie « ${normalizedTitle} » ?`;
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
  if (points.some((kp) => kp.id?.startsWith("new-"))) {
    return points;
  }
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
  const title = beginnerContent.title || removeLearningJargon(kp.title);
  const coreText = kp?.id?.startsWith("new-") 
    ? beginnerContent.coreText 
    : sentenceExcerpt(beginnerContent.coreText);

  return {
    id: kp.id,
    title,
    sourceParagraph: getSourceParagraph(kp),
    coreText,
    explanation: beginnerContent.explanation || null,
    references,
    vocabulary: [],
    quizPrompt: kp.quizPrompt || beginnerContent.quizPrompt || createDirectQuizPrompt(title),
    quizAnswer: kp.quizAnswer || beginnerContent.quizAnswer || compactQuizAnswer(coreText),
    quizOptions: kp.quizOptions || beginnerContent.quizOptions || null,
    quizTrueFalse: kp.quizTrueFalse || beginnerContent.quizTrueFalse || null,
    quizExplanation: kp.quizExplanation || beginnerContent.quizExplanation || null,
    quizEyebrow: kp.quizEyebrow || beginnerContent.quizEyebrow || null,
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

const getQuizOptions = (item, optionPool, seed) => {
  if (item.quizOptions) return item.quizOptions;
  const answers = [...new Set(optionPool.map((candidate) => candidate.quizAnswer))];
  if (!answers.includes(item.quizAnswer)) answers.push(item.quizAnswer);
  return deterministicRotate(answers.slice(0, 2), seed);
};

const createQuickChoiceQuestion = (item, optionPool, scopeId) => ({
  id: `${scopeId}-${item.id}-quick-choice`,
  knowledgePointId: item.id,
  sourceParagraph: item.sourceParagraph,
  kind: "quick_choice",
  eyebrow: item.quizEyebrow || "QCM",
  prompt: item.quizPrompt,
  context: null,
  options: getQuizOptions(item, optionPool, `${scopeId}-${item.id}-quick-choice`),
  correctAnswer: item.quizAnswer,
  explanation: item.quizExplanation || `Bonne réponse : ${item.quizAnswer}`,
  provenance: "learned_rules_only"
});

const createTrueFalseQuestion = (item, scopeId) => ({
  id: `${scopeId}-${item.id}-true-false`,
  knowledgePointId: item.id,
  sourceParagraph: item.sourceParagraph,
  kind: "true_false",
  eyebrow: "Vrai ou faux",
  prompt: `« ${item.quizTrueFalse.statement} »`,
  context: null,
  options: ["Vrai", "Faux"],
  correctAnswer: item.quizTrueFalse.answer,
  explanation: item.quizExplanation || `À retenir : ${item.quizAnswer}`,
  provenance: "learned_rules_only"
});

const createCheckpointQuestion = (item, optionPool, scopeId) => (
  item.quizTrueFalse
    ? createTrueFalseQuestion(item, scopeId)
    : createQuickChoiceQuestion(item, optionPool, scopeId)
);

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
      questions: lessonItems.map((item) => createCheckpointQuestion(item, optionPool, lessonId))
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
