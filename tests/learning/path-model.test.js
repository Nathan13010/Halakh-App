import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  buildCategoryExamQuestions,
  buildSimanCurriculum,
  buildSimanExamQuestions,
  getOrderedKnowledgePoints,
  LEARNING_CATEGORY
} from "../../src/services/learningPathModel.js";
import { LEARNING_SIMANS } from "../../src/data/learningSimans.js";

const dataDirectory = new URL(
  "../../public/data/הלכות הנהגת אדם בבוקר/",
  import.meta.url
);

const loadKnowledge = (simanNumber) => JSON.parse(readFileSync(
  new URL(`siman_${simanNumber}_knowledge.json`, dataDirectory),
  "utf8"
));

test("le Siman 1 commence par le réveil avant toute question sur la Zrizout", () => {
  const data = loadKnowledge(1);
  const ordered = getOrderedKnowledgePoints(data, "siman_1");
  assert.deepEqual(ordered.slice(0, 3).map((kp) => kp.id), [
    "s1-kp-004",
    "s1-kp-016",
    "s1-kp-018"
  ]);

  const curriculum = buildSimanCurriculum(LEARNING_SIMANS.siman_1, data);
  assert.deepEqual(curriculum.lessons[0].items.map((item) => item.title), [
    "Se lever avec force pour servir Hachem",
    "Ne pas se lever brusquement",
    "Dire Modé Ani au réveil"
  ]);
  assert.equal(curriculum.lessons[0].questions.some((question) => (
    question.prompt.includes("Zrizout") || question.context?.includes("Zrizout")
  )), false);

  const zrizoutLesson = curriculum.lessons.find((lesson) => (
    lesson.items.some((item) => item.id === "s1-kp-006")
  ));
  assert.ok(zrizoutLesson);
  assert.ok(zrizoutLesson.questions.some((question) => question.knowledgePointId === "s1-kp-006"));
});
test("chaque leçon contient au plus trois notions et ne teste que des notions déjà présentées", () => {
  for (const simanNumber of [1, 2, 3]) {
    const simanId = `siman_${simanNumber}`;
    const data = loadKnowledge(simanNumber);
    const curriculum = buildSimanCurriculum(LEARNING_SIMANS[simanId], data);
    const learnedIds = curriculum.lessons.flatMap((lesson) => lesson.items.map((item) => item.id));

    assert.equal(new Set(learnedIds).size, data.knowledge_points.length);
    assert.equal(learnedIds.length, data.knowledge_points.length);
    curriculum.lessons.forEach((lesson) => {
      const lessonIds = new Set(lesson.items.map((item) => item.id));
      assert.ok(lesson.items.length >= 1 && lesson.items.length <= 3);
      assert.ok(lesson.questions.length >= 1);
      lesson.questions.forEach((question) => assert.ok(lessonIds.has(question.knowledgePointId)));
    });
  }
});

test("les questions de reconnaissance n'inventent pas de fausses règles", () => {
  const curriculum = buildSimanCurriculum(LEARNING_SIMANS.siman_2, loadKnowledge(2));
  const recognitionQuestions = curriculum.lessons.flatMap((lesson) => lesson.questions)
    .filter((question) => question.provenance === "source_recognition");

  assert.ok(recognitionQuestions.length > 0);
  recognitionQuestions.forEach((question) => {
    assert.ok(question.options.includes(question.correctAnswer));
    assert.ok(question.options.every((option) => (
      curriculum.knowledgePoints.some((kp) => kp.title === option)
    )));
  });
});

test("les examens couvrent le Siman et le test final prend des questions des trois Simanim", () => {
  const curricula = Object.fromEntries(LEARNING_CATEGORY.simanIds.map((simanId, index) => [
    simanId,
    buildSimanCurriculum(LEARNING_SIMANS[simanId], loadKnowledge(index + 1))
  ]));

  for (const curriculum of Object.values(curricula)) {
    const exam = buildSimanExamQuestions(curriculum);
    assert.ok(exam.length >= 2 && exam.length <= 8);
    assert.equal(new Set(exam.map((question) => question.id)).size, exam.length);
  }

  const categoryExam = buildCategoryExamQuestions(curricula);
  assert.deepEqual(new Set(categoryExam.map((question) => question.simanId)), new Set(LEARNING_CATEGORY.simanIds));
  assert.equal(categoryExam.length, 6);
});
