import assert from "node:assert/strict";
import test from "node:test";
import {
  completePathLesson,
  createDefaultLearningPathState,
  isCategoryExamUnlocked,
  isLessonUnlocked,
  isSimanExamUnlocked,
  isSimanUnlocked,
  normalizeLearningPathState,
  recordCategoryExam,
  recordSimanExam
} from "../../src/services/learningPathProgress.js";
import { LEARNING_CATEGORY } from "../../src/services/learningPathModel.js";

test("le parcours débloque les leçons et les Simanim strictement dans l'ordre", () => {
  let state = createDefaultLearningPathState();
  const lessons = ["siman_1-lesson-1", "siman_1-lesson-2"];

  assert.equal(isSimanUnlocked(state, "siman_1"), true);
  assert.equal(isSimanUnlocked(state, "siman_2"), false);
  assert.equal(isLessonUnlocked(state, "siman_1", 0, lessons), true);
  assert.equal(isLessonUnlocked(state, "siman_1", 1, lessons), false);

  state = completePathLesson(state, "siman_1", lessons[0], 100);
  assert.equal(isLessonUnlocked(state, "siman_1", 1, lessons), true);
  assert.equal(isSimanExamUnlocked(state, "siman_1", lessons), false);

  state = completePathLesson(state, "siman_1", lessons[1], 200);
  assert.equal(isSimanExamUnlocked(state, "siman_1", lessons), true);
  state = recordSimanExam(state, "siman_1", 7, 8, 300);
  assert.equal(isSimanUnlocked(state, "siman_2"), false);
  state = recordSimanExam(state, "siman_1", 8, 8, 400);
  assert.equal(isSimanUnlocked(state, "siman_2"), true);
});
test("seul un score parfait valide un examen et la catégorie", () => {
  let state = createDefaultLearningPathState();
  for (const simanId of LEARNING_CATEGORY.simanIds) {
    state = recordSimanExam(state, simanId, 5, 5, 100);
  }

  assert.equal(isCategoryExamUnlocked(state), true);
  state = recordCategoryExam(state, 5, 6, 200);
  assert.equal(state.categoryExam.passed, false);
  assert.equal(state.revisionSheetUnlocked, false);
  state = recordCategoryExam(state, 6, 6, 300);
  assert.equal(state.categoryExam.passed, true);
  assert.equal(state.revisionSheetUnlocked, true);
});

test("la normalisation refuse de restaurer une fiche sans les trois examens", () => {
  const normalized = normalizeLearningPathState({
    simans: { siman_1: { examPassed: true } },
    categoryExam: { passed: true },
    revisionSheetUnlocked: true
  });

  assert.equal(normalized.categoryExam.passed, false);
  assert.equal(normalized.revisionSheetUnlocked, false);
});
