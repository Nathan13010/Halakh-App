import { LEARNING_CATEGORY } from "./learningPathModel.js";

export const LEARNING_PATH_STORAGE_KEY = "halakhapp_learning_path_v1";
export const LEARNING_PATH_VERSION = 1;

const createDefaultSimanState = () => ({
  completedLessons: [],
  examPassed: false,
  examAttempts: 0,
  bestExamScore: 0,
  completedAt: null
});

export const createDefaultLearningPathState = () => ({
  version: LEARNING_PATH_VERSION,
  categoryId: LEARNING_CATEGORY.id,
  simans: Object.fromEntries(
    LEARNING_CATEGORY.simanIds.map((simanId) => [simanId, createDefaultSimanState()])
  ),
  categoryExam: {
    passed: false,
    attempts: 0,
    bestScore: 0,
    completedAt: null
  },
  revisionSheetUnlocked: false,
  updatedAt: null
});

const safeCounter = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
};
export const normalizeLearningPathState = (stored) => {
  const defaults = createDefaultLearningPathState();
  const source = stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
  const simans = {};

  for (const simanId of LEARNING_CATEGORY.simanIds) {
    const simanSource = source.simans?.[simanId] || {};
    simans[simanId] = {
      completedLessons: [...new Set(
        Array.isArray(simanSource.completedLessons)
          ? simanSource.completedLessons.filter((lessonId) => typeof lessonId === "string")
          : []
      )],
      examPassed: simanSource.examPassed === true,
      examAttempts: safeCounter(simanSource.examAttempts),
      bestExamScore: safeCounter(simanSource.bestExamScore),
      completedAt: simanSource.completedAt ?? null
    };
  }

  const categoryExam = source.categoryExam || {};
  const categoryPassed = categoryExam.passed === true
    && LEARNING_CATEGORY.simanIds.every((simanId) => simans[simanId].examPassed);

  return {
    ...defaults,
    simans,
    categoryExam: {
      passed: categoryPassed,
      attempts: safeCounter(categoryExam.attempts),
      bestScore: safeCounter(categoryExam.bestScore),
      completedAt: categoryPassed ? categoryExam.completedAt ?? null : null
    },
    revisionSheetUnlocked: categoryPassed,
    updatedAt: source.updatedAt ?? null
  };
};

export const isSimanUnlocked = (state, simanId) => {
  const normalized = normalizeLearningPathState(state);
  const index = LEARNING_CATEGORY.simanIds.indexOf(simanId);
  if (index < 0) return false;
  if (index === 0) return true;
  return normalized.simans[LEARNING_CATEGORY.simanIds[index - 1]].examPassed;
};

export const isLessonUnlocked = (state, simanId, lessonIndex, lessonIds) => {
  const normalized = normalizeLearningPathState(state);
  if (!isSimanUnlocked(normalized, simanId) || lessonIndex < 0) return false;
  if (lessonIndex === 0) return true;
  return normalized.simans[simanId].completedLessons.includes(lessonIds[lessonIndex - 1]);
};

export const isSimanExamUnlocked = (state, simanId, lessonIds) => {
  const normalized = normalizeLearningPathState(state);
  return isSimanUnlocked(normalized, simanId)
    && lessonIds.length > 0
    && lessonIds.every((lessonId) => normalized.simans[simanId].completedLessons.includes(lessonId));
};

export const isCategoryExamUnlocked = (state) => {
  const normalized = normalizeLearningPathState(state);
  return LEARNING_CATEGORY.simanIds.every((simanId) => normalized.simans[simanId].examPassed);
};

export const completePathLesson = (state, simanId, lessonId, now = Date.now()) => {
  const normalized = normalizeLearningPathState(state);
  if (!normalized.simans[simanId] || normalized.simans[simanId].completedLessons.includes(lessonId)) {
    return normalized;
  }

  return {
    ...normalized,
    simans: {
      ...normalized.simans,
      [simanId]: {
        ...normalized.simans[simanId],
        completedLessons: [...normalized.simans[simanId].completedLessons, lessonId]
      }
    },
    updatedAt: now
  };
};

export const recordSimanExam = (state, simanId, correct, total, now = Date.now()) => {
  const normalized = normalizeLearningPathState(state);
  if (!normalized.simans[simanId] || total <= 0) return normalized;

  const score = Math.round((correct / total) * 100);
  const passed = correct === total;
  const previous = normalized.simans[simanId];
  return {
    ...normalized,
    simans: {
      ...normalized.simans,
      [simanId]: {
        ...previous,
        examPassed: previous.examPassed || passed,
        examAttempts: previous.examAttempts + 1,
        bestExamScore: Math.max(previous.bestExamScore, score),
        completedAt: previous.completedAt || (passed ? now : null)
      }
    },
    updatedAt: now
  };
};

export const recordCategoryExam = (state, correct, total, now = Date.now()) => {
  const normalized = normalizeLearningPathState(state);
  if (total <= 0 || !isCategoryExamUnlocked(normalized)) return normalized;

  const score = Math.round((correct / total) * 100);
  const passed = correct === total;
  const wasPassed = normalized.categoryExam.passed;
  return {
    ...normalized,
    categoryExam: {
      passed: wasPassed || passed,
      attempts: normalized.categoryExam.attempts + 1,
      bestScore: Math.max(normalized.categoryExam.bestScore, score),
      completedAt: normalized.categoryExam.completedAt || (passed ? now : null)
    },
    revisionSheetUnlocked: wasPassed || passed,
    updatedAt: now
  };
};

export const loadLearningPathState = () => {
  if (typeof window === "undefined") return createDefaultLearningPathState();
  try {
    const saved = window.localStorage.getItem(LEARNING_PATH_STORAGE_KEY);
    return normalizeLearningPathState(saved ? JSON.parse(saved) : null);
  } catch (error) {
    console.error("Erreur de lecture du parcours d'apprentissage:", error);
    return createDefaultLearningPathState();
  }
};

export const saveLearningPathState = (state) => {
  const normalized = normalizeLearningPathState(state);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LEARNING_PATH_STORAGE_KEY, JSON.stringify(normalized));
    } catch (error) {
      console.error("Erreur de sauvegarde du parcours d'apprentissage:", error);
    }
  }
  return normalized;
};

export const resetLearningPathState = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LEARNING_PATH_STORAGE_KEY);
  }
};
