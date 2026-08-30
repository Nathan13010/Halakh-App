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

const loadSource = (simanNumber) => JSON.parse(readFileSync(
  new URL(`siman_${simanNumber}.json`, dataDirectory),
  "utf8"
));

const buildCurriculum = (simanNumber) => buildSimanCurriculum(
  LEARNING_SIMANS[`siman_${simanNumber}`],
  loadKnowledge(simanNumber),
  loadSource(simanNumber)
);

test("le Siman 1 commence par le réveil avant toute question sur la Zrizout", () => {
  const data = loadKnowledge(1);
  const ordered = getOrderedKnowledgePoints(data, "siman_1");
  assert.deepEqual(ordered.slice(0, 3).map((kp) => kp.id), [
    "s1-kp-004",
    "s1-kp-016",
    "s1-kp-018"
  ]);

  const curriculum = buildCurriculum(1);
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

test("les premières explications parlent à un débutant et Modé Ani est présenté intégralement", () => {
  const curriculum = buildCurriculum(1);
  const firstItems = curriculum.lessons[0].items;
  assert.equal(
    firstItems[0].coreText,
    "Au réveil, on essaie de dépasser l'envie de rester au lit afin de commencer la journée avec courage et de se tourner vers Dieu."
  );
  assert.match(firstItems[0].vocabulary[0].definition, /Hachem signifie littéralement « le Nom »/);
  assert.match(firstItems[2].explanation, /Modé ani lefanékha/);
  assert.match(`${firstItems[2].coreText} ${firstItems[2].explanation}`, /une fille dit « Moda Ani »/i);
  assert.match(firstItems[2].explanation, /Je Te remercie, Roi vivant et éternel/);
});

test("chaque leçon contient au plus trois notions et ne teste que des notions déjà présentées", () => {
  for (const simanNumber of [1, 2, 3]) {
    const simanId = `siman_${simanNumber}`;
    const data = loadKnowledge(simanNumber);
    const curriculum = buildCurriculum(simanNumber);
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

test("la première leçon utilise les trois questions directes proposées", () => {
  const questions = buildCurriculum(1).lessons[0].questions;

  assert.deepEqual(questions.map((question) => question.kind), [
    "quick_choice",
    "true_false",
    "quick_choice"
  ]);
  assert.equal(questions[0].prompt, "Que signifie « se lever avec force » au réveil ?");
  assert.deepEqual(questions[0].options, [
    "Remercier Dieu avec la prière du Modé Ani.",
    "Vaincre la paresse pour commencer la journée avec entrain.",
    "S'asseoir quelques instants sur le lit avant de se lever."
  ]);
  assert.equal(questions[0].correctAnswer, questions[0].options[1]);
  assert.equal(
    questions[1].prompt,
    "« Il faut s'asseoir quelques instants sur le lit pour éviter de se lever trop brusquement. »"
  );
  assert.equal(questions[1].context, null);
  assert.equal(questions[1].correctAnswer, "Vrai");
  assert.equal(questions[2].prompt, "Quel est le rôle de la prière Modé Ani dès le réveil ?");
  assert.equal(questions[2].correctAnswer, "Remercier Dieu pour le retour de notre âme.");
});

test("la troisième leçon distingue l'horaire, la préparation et la Zrizout", () => {
  const questions = buildCurriculum(1).lessons[2].questions;

  assert.deepEqual(questions.map((question) => question.knowledgePointId), [
    "s1-kp-005",
    "s1-kp-008",
    "s1-kp-006"
  ]);
  assert.equal(questions[0].prompt, "Pourquoi doit-on calculer son heure de réveil le matin ?");
  assert.deepEqual(questions[0].options, [
    "Pour accomplir la prière et le Chema avant leur heure limite.",
    "Pour faire une longue pause avant de commencer la journée.",
    "Pour vérifier la météo du jour."
  ]);
  assert.equal(questions[0].correctAnswer, questions[0].options[0]);

  assert.equal(questions[1].prompt, "Pourquoi est-il conseillé de se lever bien avant le début de la prière ?");
  assert.deepEqual(questions[1].options, [
    "Pour pouvoir réciter la prière deux fois de suite.",
    "Pour se préparer avec calme et avoir une meilleure concentration (Kavana).",
    "Pour éviter de faire ses ablutions matinales."
  ]);
  assert.equal(questions[1].correctAnswer, questions[1].options[1]);

  assert.equal(questions[2].kind, "true_false");
  assert.equal(
    questions[2].prompt,
    "« Courir dans tous les sens parce qu'on est en retard est une preuve de Zrizout (empressement). »"
  );
  assert.equal(questions[2].context, null);
  assert.equal(questions[2].correctAnswer, "Faux");
});

test("toutes les questions restent directes et toutes les réponses sont courtes", () => {
  const forbiddenMetaText = /que faut-il retenir|une personne découvre|ce rappel parle-t-il|à quelle notion correspond|explique-le à un ami/i;

  for (const simanNumber of [1, 2, 3]) {
    const curriculum = buildCurriculum(simanNumber);
    const items = new Map(curriculum.lessons.flatMap((lesson) => lesson.items).map((item) => [item.id, item]));
    const questions = curriculum.lessons.flatMap((lesson) => lesson.questions);

    questions.forEach((question) => {
      const item = items.get(question.knowledgePointId);
      assert.ok(item);
      assert.doesNotMatch(question.prompt, forbiddenMetaText);
      assert.equal(question.context, null);
      assert.ok(question.prompt.length <= 100, `${question.id}: question trop longue`);
      assert.ok(question.options.every((option) => option.length <= 90), `${question.id}: réponse trop longue`);
      assert.ok(question.options.every((option) => !option.includes("…")), `${question.id}: réponse tronquée`);
      assert.ok(question.options.includes(question.correctAnswer));
      assert.equal(question.provenance, "learned_rules_only");
      if (question.kind === "true_false") {
        assert.deepEqual(question.options, ["Vrai", "Faux"]);
        assert.equal(question.correctAnswer, item.quizTrueFalse.answer);
      } else {
        assert.equal(question.kind, "quick_choice");
        assert.equal(question.correctAnswer, item.quizAnswer);
      }
    });
  }
});

test("les leçons 4 à 26 n'utilisent plus le matching automatique", () => {
  const curriculum = buildCurriculum(1);
  const rewrittenLessons = curriculum.lessons.slice(3);
  const fillText = /Cette phrase donne l'idée principale|référence complète est disponible/i;

  rewrittenLessons.forEach((lesson) => {
    assert.ok(lesson.questions.some((question) => question.eyebrow === "Cas pratique"));
    lesson.questions.forEach((question) => {
      assert.doesNotMatch(question.prompt, /^Que signifie «/i);
      assert.ok(new Set(question.options).size === question.options.length);
      assert.doesNotMatch(question.explanation, fillText);
    });
    lesson.items.forEach((item) => assert.doesNotMatch(item.explanation, fillText));
  });

  rewrittenLessons.slice(0, -1).forEach((lesson) => {
    assert.ok(lesson.questions.some((question) => question.kind === "true_false"));
    assert.ok(lesson.questions.some((question) => question.kind === "quick_choice"));
  });
});

test("chaque notion ouvre sa référence française, sans jargon Seif, et le vocabulaire apparaît au maximum deux fois", () => {
  for (const simanNumber of [1, 2, 3]) {
    const curriculum = buildCurriculum(simanNumber);
    const items = curriculum.lessons.flatMap((lesson) => lesson.items);
    const questions = curriculum.lessons.flatMap((lesson) => lesson.questions);
    const vocabularyCounts = {};

    items.forEach((item) => {
      assert.ok(item.references.length >= 1);
      assert.ok(item.references.every((reference) => reference.french.length > 0));
      assert.doesNotMatch(`${item.title} ${item.coreText} ${item.explanation}`, /\bSeif\b|סעיף/i);
      item.vocabulary.forEach((entry) => {
        vocabularyCounts[entry.term] = (vocabularyCounts[entry.term] || 0) + 1;
      });
    });
    questions.forEach((question) => {
      assert.doesNotMatch(`${question.prompt} ${question.context} ${question.explanation}`, /\bSeif\b|סעיף/i);
    });
    assert.ok(Object.values(vocabularyCounts).every((count) => count <= 2));
  }
});

test("les examens couvrent le Siman et le test final prend des questions des trois Simanim", () => {
  const curricula = Object.fromEntries(LEARNING_CATEGORY.simanIds.map((simanId, index) => [
    simanId,
    buildCurriculum(index + 1)
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
