import assert from "node:assert/strict";
import test from "node:test";
import { 
  mergeLearningPathStates, 
  mergeUserData, 
  generateSyncCode, 
  cleanSyncCode 
} from "../../src/services/cloudSyncService.js";

test("mergeLearningPathStates effectue l'union des leçons complétées et conserve les meilleurs scores", () => {
  const localState = {
    simans: {
      siman_1: {
        completedLessons: ["siman_1-lesson-1", "siman_1-lesson-2"],
        examPassed: false,
        bestExamScore: 6,
        examAttempts: 1
      },
      siman_2: {
        completedLessons: ["siman_2-lesson-1"],
        examPassed: false,
        bestExamScore: 0,
        examAttempts: 0
      }
    },
    categoryExam: { passed: false, bestScore: 0, attempts: 0 },
    revisionSheetUnlocked: false
  };

  const cloudState = {
    simans: {
      siman_1: {
        completedLessons: ["siman_1-lesson-2", "siman_1-lesson-3"],
        examPassed: true,
        bestExamScore: 8,
        examAttempts: 2
      },
      siman_2: {
        completedLessons: ["siman_2-lesson-1"],
        examPassed: true,
        bestExamScore: 8,
        examAttempts: 1
      },
      siman_3: {
        completedLessons: ["siman_3-lesson-1"],
        examPassed: true,
        bestExamScore: 8,
        examAttempts: 1
      },
      siman_4: {
        completedLessons: ["siman_4-lesson-1"],
        examPassed: true,
        bestExamScore: 8,
        examAttempts: 1
      }
    },
    categoryExam: { passed: true, bestScore: 6, attempts: 1 },
    revisionSheetUnlocked: true
  };

  const merged = mergeLearningPathStates(localState, cloudState);

  // Siman 1: leçons 1, 2, 3 doivent toutes être présentes
  assert.equal(merged.simans.siman_1.completedLessons.length, 3);
  assert.ok(merged.simans.siman_1.completedLessons.includes("siman_1-lesson-1"));
  assert.ok(merged.simans.siman_1.completedLessons.includes("siman_1-lesson-2"));
  assert.ok(merged.simans.siman_1.completedLessons.includes("siman_1-lesson-3"));
  assert.equal(merged.simans.siman_1.examPassed, true);
  assert.equal(merged.simans.siman_1.bestExamScore, 8);

  // Siman 2: conservé de local
  assert.equal(merged.simans.siman_2.completedLessons.length, 1);

  // Siman 3: conservé de cloud
  assert.equal(merged.simans.siman_3.completedLessons.length, 1);

  // Category exam et revision sheet
  assert.equal(merged.categoryExam.passed, true);
  assert.equal(merged.categoryExam.bestScore, 6);
  assert.equal(merged.revisionSheetUnlocked, true);
});

test("mergeUserData conserve le maximum de XP, de streak, et fusionne favoris et bookmarks", () => {
  const local = {
    xp: 250,
    streak: 3,
    lastStreakDate: "2026-09-02",
    favorites: [{ bookId: "siman_1", paragraphIndex: 2, title: "Loi 2" }],
    bookmarks: [{ bookId: "siman_1", paragraphIndex: 5 }],
    learningPath: null
  };

  const cloud = {
    xp: 400,
    streak: 5,
    lastStreakDate: "2026-09-03",
    favorites: [
      { bookId: "siman_1", paragraphIndex: 2, title: "Loi 2 (Cloud)" },
      { bookId: "siman_2", paragraphIndex: 1, title: "Loi Siman 2" }
    ],
    bookmarks: [{ bookId: "siman_2", paragraphIndex: 3 }],
    learningPath: null
  };

  const merged = mergeUserData(local, cloud);

  assert.equal(merged.xp, 400);
  assert.equal(merged.streak, 5);
  assert.equal(merged.favorites.length, 2);
  assert.equal(merged.bookmarks.length, 2);
});

test("generateSyncCode et cleanSyncCode respectent le format HLK-XXX-XXX", () => {
  const code = generateSyncCode();
  assert.match(code, /^HLK-[A-Z0-9]{3}-[A-Z0-9]{3}$/);

  // Normalisation d'un code saisi en minuscules sans tirets
  assert.equal(cleanSyncCode("hlk7k29mp"), "HLK-7K2-9MP");
  assert.equal(cleanSyncCode("  hlk-7k2-9mp  "), "HLK-7K2-9MP");
});

