import { readFileSync } from "node:fs";
import { expect, test } from "playwright/test";
import { LEARNING_SIMANS } from "../../src/data/learningSimans.js";
import {
  buildCategoryExamQuestions,
  buildSimanCurriculum,
  buildSimanExamQuestions,
  LEARNING_CATEGORY
} from "../../src/services/learningPathModel.js";
import {
  createDefaultLearningPathState,
  LEARNING_PATH_STORAGE_KEY
} from "../../src/services/learningPathProgress.js";

const dataDirectory = new URL(
  "../../public/data/הלכות הנהגת אדם בבוקר/",
  import.meta.url
);

const curricula = Object.fromEntries(LEARNING_CATEGORY.simanIds.map((simanId, index) => {
  const knowledge = JSON.parse(readFileSync(new URL(`siman_${index + 1}_knowledge.json`, dataDirectory), "utf8"));
  const source = JSON.parse(readFileSync(new URL(`siman_${index + 1}.json`, dataDirectory), "utf8"));
  return [simanId, buildSimanCurriculum(LEARNING_SIMANS[simanId], knowledge, source)];
}));

const simanExams = Object.fromEntries(Object.entries(curricula).map(([simanId, curriculum]) => [
  simanId,
  buildSimanExamQuestions(curriculum)
]));
const categoryExam = buildCategoryExamQuestions(curricula);
const allQuestions = new Map([
  ...Object.values(curricula).flatMap((curriculum) => curriculum.lessons.flatMap((lesson) => lesson.questions)),
  ...Object.values(simanExams).flat(),
  ...categoryExam
].map((question) => [question.id, question]));

const openLearning = async (page, pathState = null) => {
  await page.goto("/");
  await page.evaluate(({ storageKey, storedState }) => {
    localStorage.clear();
    if (storedState) localStorage.setItem(storageKey, JSON.stringify(storedState));
  }, { storageKey: LEARNING_PATH_STORAGE_KEY, storedState: pathState });
  await page.reload();
  await page.getByRole("button", { name: "Apprentissage", exact: true }).click();
  await expect(page.getByTestId("learning-path-map")).toBeVisible();
};

const answerCurrentQuestion = async (page, correct = true) => {
  const flow = page.getByTestId("quiz-flow");
  const questionId = await flow.getAttribute("data-question-id");
  const question = allQuestions.get(questionId);
  if (!question) throw new Error(`Question de test inconnue: ${questionId}`);
  const answer = correct
    ? question.correctAnswer
    : question.options.find((option) => option !== question.correctAnswer);

  await page.getByTestId("quiz-option").filter({ hasText: answer }).first().click();
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
};

const completeQuiz = async (page, questions, wrongAt = -1) => {
  for (let index = 0; index < questions.length; index += 1) {
    await answerCurrentQuestion(page, index !== wrongAt);
  }
  await expect(page.getByTestId("quiz-result")).toBeVisible();
};

const stateWithCompletedLessons = (simanIds) => {
  const state = createDefaultLearningPathState();
  simanIds.forEach((simanId) => {
    state.simans[simanId].completedLessons = curricula[simanId].lessons.map((lesson) => lesson.id);
  });
  return state;
};

test("le parcours commence par le réveil, puis seulement par un quiz sur les notions apprises", async ({ page }) => {
  await openLearning(page);

  const siman1 = page.getByTestId("path-siman_1");
  await expect(siman1.getByRole("button", { name: "Commencer", exact: true })).toBeEnabled();
  await expect(page.getByTestId("path-siman_2").getByRole("button")).toBeDisabled();
  await siman1.getByRole("button", { name: "Commencer", exact: true }).click();

  await expect(page.getByTestId("lesson-node-1")).toBeEnabled();
  await expect(page.getByTestId("lesson-node-2")).toBeDisabled();
  await page.getByTestId("lesson-node-1").click();

  const lessonPlayer = page.getByTestId("lesson-player");
  await expect(lessonPlayer).toHaveAttribute("data-item-id", "s1-kp-004");
  await expect(page.getByRole("heading", { name: "Se lever avec force pour servir Hachem" })).toBeVisible();
  await expect(lessonPlayer).toContainText("Paragraphe 1");
  await expect(lessonPlayer).toContainText("Au réveil, on essaie de dépasser l'envie de rester au lit");
  await expect(page.getByTestId("lesson-glossary")).toContainText("Hachem signifie littéralement « le Nom »");
  await expect(page.getByText("En mots simples", { exact: true })).toHaveCount(0);
  await expect(page.getByText("La véritable Zrizout", { exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: "Voir la loi complète en français", exact: true }).click();
  const reference = page.getByTestId("source-reference-modal");
  await expect(reference).toBeVisible();
  await expect(reference).toContainText("Nous avons appris dans le traité Avot");
  await expect(reference).toContainText("Siman 1 · Paragraphe 1");
  await page.getByRole("button", { name: "Fermer la référence", exact: true }).click();

  await page.getByRole("button", { name: "Notion suivante", exact: true }).click();
  await expect(lessonPlayer).toHaveAttribute("data-item-id", "s1-kp-016");
  await page.getByRole("button", { name: "Notion suivante", exact: true }).click();
  await expect(lessonPlayer).toHaveAttribute("data-item-id", "s1-kp-018");
  await expect(lessonPlayer).toContainText("Modé ani lefanékha");
  await expect(lessonPlayer).toContainText("Je Te remercie, Roi vivant et éternel");
  await expect(lessonPlayer).toContainText("une fille dit « Moda Ani »");
  await page.getByRole("button", { name: "Vérifier ce que j'ai appris", exact: true }).click();

  await expect(page.getByTestId("quiz-flow")).toBeVisible();
  await expect(page.getByText("Défi mémoire", { exact: true })).toBeVisible();
  await expect(page.getByText("La véritable Zrizout", { exact: true })).toHaveCount(0);
  await completeQuiz(page, curricula.siman_1.lessons[0].questions);
  await page.getByRole("button", { name: "Valider cette leçon", exact: true }).click();
  await expect(page.getByTestId("lesson-success")).toBeVisible();
  await page.getByRole("button", { name: /Débloquer la leçon suivante/ }).click();

  await expect(page.getByTestId("siman-path-view")).toBeVisible();
  await expect(page.getByTestId("lesson-node-2")).toBeEnabled();
  const stored = await page.evaluate((storageKey) => JSON.parse(localStorage.getItem(storageKey)), LEARNING_PATH_STORAGE_KEY);
  expect(stored.simans.siman_1.completedLessons).toContain("siman_1-lesson-1");
  expect(Number(await page.evaluate(() => localStorage.getItem("mishne_mikra_xp")))).toBe(30);
});
test("un examen de Siman imparfait ne débloque pas le suivant; un sans-faute le fait", async ({ page }) => {
  const state = stateWithCompletedLessons(["siman_1"]);
  await openLearning(page, state);
  await page.getByTestId("path-siman_1").getByRole("button", { name: "Continuer", exact: true }).click();
  await expect(page.getByTestId("siman-exam-node")).toBeEnabled();
  await page.getByTestId("siman-exam-node").click();

  await completeQuiz(page, simanExams.siman_1, 0);
  await expect(page.getByText(`${simanExams.siman_1.length - 1}/${simanExams.siman_1.length} bonnes réponses`, { exact: true })).toBeVisible();
  let stored = await page.evaluate((storageKey) => JSON.parse(localStorage.getItem(storageKey)), LEARNING_PATH_STORAGE_KEY);
  expect(stored.simans.siman_1.examPassed).toBe(false);

  await page.getByRole("button", { name: "Recommencer le test", exact: true }).click();
  await completeQuiz(page, simanExams.siman_1);
  await page.getByRole("button", { name: /Valider le Siman/ }).click();
  await expect(page.getByTestId("learning-path-map")).toBeVisible();
  await expect(page.getByTestId("path-siman_2").getByRole("button", { name: "Commencer", exact: true })).toBeEnabled();

  stored = await page.evaluate((storageKey) => JSON.parse(localStorage.getItem(storageKey)), LEARNING_PATH_STORAGE_KEY);
  expect(stored.simans.siman_1.examPassed).toBe(true);
  expect(stored.simans.siman_1.bestExamScore).toBe(100);
});

test("le test de catégorie réunit les trois Simanim et débloque la fiche permanente", async ({ page }) => {
  const state = stateWithCompletedLessons(LEARNING_CATEGORY.simanIds);
  LEARNING_CATEGORY.simanIds.forEach((simanId) => {
    state.simans[simanId].examPassed = true;
  });

  await openLearning(page, state);
  await page.getByRole("button", { name: "Passer le test final", exact: true }).click();
  await completeQuiz(page, categoryExam);
  await page.getByRole("button", { name: "Ouvrir ma fiche de révision", exact: true }).click();

  const sheet = page.getByTestId("revision-sheet");
  await expect(sheet).toBeVisible();
  await expect(sheet).toContainText("Fiche de révision obtenue");
  await sheet.getByRole("button", { name: "Siman 2", exact: true }).click();
  await expect(sheet.getByRole("heading", { name: /Siman 2/ })).toBeVisible();
  await expect(sheet).toContainText("Paragraphe 1");
  await expect(sheet).toContainText("Pudeur en s'habillant et se déshabillant");

  const stored = await page.evaluate((storageKey) => JSON.parse(localStorage.getItem(storageKey)), LEARNING_PATH_STORAGE_KEY);
  expect(stored.categoryExam.passed).toBe(true);
  expect(stored.revisionSheetUnlocked).toBe(true);
});

test("la progression du nouveau parcours persiste après rechargement", async ({ page }) => {
  const state = stateWithCompletedLessons(["siman_1"]);
  state.simans.siman_1.examPassed = true;
  await openLearning(page, state);
  await expect(page.getByTestId("path-siman_2").getByRole("button", { name: "Commencer", exact: true })).toBeEnabled();

  await page.reload();
  await page.getByRole("button", { name: "Apprentissage", exact: true }).click();
  await expect(page.getByTestId("path-siman_1")).toContainText("Validé");
  await expect(page.getByTestId("path-siman_2").getByRole("button", { name: "Commencer", exact: true })).toBeEnabled();
});

test("desktop: le reset du profil efface aussi le nouveau parcours", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  const state = stateWithCompletedLessons(["siman_1"]);
  await page.goto("/");
  await page.evaluate(({ storageKey, storedState }) => {
    localStorage.setItem(storageKey, JSON.stringify(storedState));
    localStorage.setItem("mishne_mikra_xp", "30");
  }, { storageKey: LEARNING_PATH_STORAGE_KEY, storedState: state });
  await page.reload();
  await page.getByRole("button", { name: "Profil", exact: true }).click();
  await page.getByRole("button", { name: /Réinitialiser ma progression/ }).click();

  const stored = await page.evaluate((storageKey) => ({
    path: localStorage.getItem(storageKey),
    xp: localStorage.getItem("mishne_mikra_xp")
  }), LEARNING_PATH_STORAGE_KEY);
  expect(stored).toEqual({ path: null, xp: null });
});

test("mobile 375px: la carte et la première leçon restent sans débordement horizontal", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-touch");
  await openLearning(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await page.getByTestId("path-siman_1").getByRole("button", { name: "Commencer", exact: true }).click();
  await page.getByTestId("lesson-node-1").click();
  await expect(page.getByTestId("lesson-player")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.getByRole("heading", { name: "Se lever avec force pour servir Hachem" })).toBeVisible();
});
