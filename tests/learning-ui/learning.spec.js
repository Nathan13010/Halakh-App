import { readFileSync } from "node:fs";
import { expect, test } from "playwright/test";

const knowledgeUrl = new URL(
  "../../public/data/הלכות הנהגת אדם בבוקר/siman_1_knowledge.json",
  import.meta.url
);
const knowledgeData = JSON.parse(readFileSync(knowledgeUrl, "utf8"));
const activitiesById = new Map();

for (const kp of knowledgeData.knowledge_points) {
  for (const [type, rawActivities] of Object.entries(kp.pedagogy.activities)) {
    for (const activity of Array.isArray(rawActivities) ? rawActivities : [rawActivities]) {
      activitiesById.set(activity.activity_id, { ...activity, type, kp });
    }
  }
}

const openLearning = async (page, progressions = {}) => {
  await page.goto("/");
  await page.evaluate((storedProgressions) => {
    localStorage.clear();
    localStorage.setItem("halakhapp_kp_progression", JSON.stringify(storedProgressions));
  }, progressions);
  await page.reload();
  await page.getByRole("button", { name: "Apprentissage", exact: true }).click();
  const startButton = page.getByRole("button", { name: /Commencer la session/ });
  await expect(startButton).toBeEnabled();
  await startButton.click();
  await expect(page.getByTestId("activity-renderer")).toBeVisible();
};

const readProgression = (page, kpId) => page.evaluate((id) => {
  const all = JSON.parse(localStorage.getItem("halakhapp_kp_progression") || "{}");
  return all[id];
}, kpId);

const waitForNextActivityOrCompletion = async (page, previousInstanceId) => {
  const getState = async () => {
    if (await page.getByText("Session complétée", { exact: true }).isVisible().catch(() => false)) {
      return "complete";
    }

    const renderer = page.getByTestId("activity-renderer");
    if (!await renderer.isVisible().catch(() => false)) return "transitioning";
    const instanceId = await renderer.getAttribute("data-instance-id");
    return instanceId && instanceId !== previousInstanceId ? "activity" : "transitioning";
  };

  await expect.poll(getState, { timeout: 10_000 }).not.toBe("transitioning");
  return getState();
};

const completeCurrentActivityCorrectly = async (page) => {
  if (await page.getByText("Session complétée", { exact: true }).isVisible().catch(() => false)) {
    return "complete";
  }

  const renderer = page.getByTestId("activity-renderer");
  await expect(renderer).toBeVisible();
  const activityId = await renderer.getAttribute("data-activity-id");
  const instanceId = await renderer.getAttribute("data-instance-id");
  const rawType = await renderer.getAttribute("data-raw-type");
  const sourceActivity = activitiesById.get(activityId);

  if (rawType === "flashcard") {
    await page.getByRole("button", { name: "J'ai compris" }).click();
    return waitForNextActivityOrCompletion(page, instanceId);
  }

  if (rawType === "multiple_choice") {
    await page.getByTestId("classic-quiz")
      .getByText(sourceActivity.correct_answer, { exact: true })
      .click();
    await page.getByTestId("classic-quiz").getByRole("button", { name: /Continuer/ }).click();
    return waitForNextActivityOrCompletion(page, instanceId);
  }

  if (rawType === "true_false") {
    const answer = sourceActivity.is_true ? "VRAI" : "FAUX";
    await page.getByTestId("swipe-game").getByRole("button", { name: answer, exact: true }).click();
    await page.getByTestId("swipe-game").getByRole("button", { name: /Continuer/ }).click();
    return waitForNextActivityOrCompletion(page, instanceId);
  }

  if (rawType === "practical_situation") {
    const scenario = page.getByTestId("scenario-game");
    await scenario.getByRole("button", { name: /Analyser la situation/ }).click();
    if (Array.isArray(sourceActivity.options) && sourceActivity.options.length >= 2) {
      await scenario.getByText(sourceActivity.correct_answer, { exact: true }).click();
    } else {
      await scenario.getByRole("button", { name: /Révéler la conduite/ }).click();
    }
    await scenario.getByRole("button", { name: /Continuer/ }).click();
    return waitForNextActivityOrCompletion(page, instanceId);
  }

  throw new Error(`Type UI inattendu: ${rawType}`);
};

test("parcours complet, persistance et fin de session", async ({ page }) => {
  const criticalErrors = [];
  page.on("pageerror", (error) => criticalErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") criticalErrors.push(message.text());
  });

  await openLearning(page);
  const firstRenderer = page.getByTestId("activity-renderer");
  const firstActivityId = await firstRenderer.getAttribute("data-activity-id");
  const firstKpId = activitiesById.get(firstActivityId).knowledge_point_id;
  expect(await firstRenderer.getAttribute("data-raw-type")).toBe("flashcard");

  await completeCurrentActivityCorrectly(page);
  await expect(page.getByTestId("activity-renderer")).not.toHaveAttribute("data-activity-id", firstActivityId);
  expect((await readProgression(page, firstKpId)).status).toBe("learning");

  for (let step = 0; step < 20; step += 1) {
    if (await completeCurrentActivityCorrectly(page) === "complete") break;
  }

  await expect(page.getByText("Session complétée", { exact: true })).toBeVisible();
  const storedXp = Number(await page.evaluate(() => localStorage.getItem("mishne_mikra_xp") || 0));
  expect(storedXp).toBeGreaterThanOrEqual(0);
  expect(criticalErrors).toEqual([]);
});

test("QCM, erreur, anti-double-submit et changement d'instance", async ({ page }) => {
  const kpId = "s1-kp-006";
  const qcm = activitiesById.get("s1-kp-006-qcm-01");
  expect(qcm).toBeTruthy();
  await openLearning(page, { [kpId]: { status: "needs_review" } });
  await expect(page.getByTestId("classic-quiz")).toBeVisible();

  const initialActivityId = await page.getByTestId("activity-renderer").getAttribute("data-activity-id");
  const wrongAnswer = qcm.options.find((option) => option !== qcm.correct_answer);
  await page.getByTestId("classic-quiz")
    .getByText(wrongAnswer, { exact: true })
    .click();
  await expect(page.getByText(/Ce n'est pas la bonne réponse/)).toBeVisible();

  await page.getByTestId("classic-quiz").getByRole("button", { name: /Continuer/ })
    .evaluate((button) => { button.click(); button.click(); });
  await expect(page.getByTestId("activity-renderer")).not.toHaveAttribute("data-activity-id", initialActivityId);

  const progression = await readProgression(page, kpId);
  expect(progression.attempts).toBe(1);
  expect(progression.wrong).toBe(1);
  expect(progression.status).toBe("needs_review");
});

test("ScenarioGame est réellement atteint et reste reflective", async ({ page }) => {
  const kpId = "s1-kp-037";
  await openLearning(page, { [kpId]: { status: "needs_review" } });
  const scenario = page.getByTestId("scenario-game");
  await expect(scenario).toBeVisible();
  await expect(page.getByTestId("activity-renderer")).toHaveAttribute("data-raw-type", "practical_situation");

  await scenario.getByRole("button", { name: /Analyser la situation/ }).click();
  await scenario.getByRole("button", { name: /Révéler la conduite/ }).click();
  await expect(scenario.getByText(/Conduite Halakhique/)).toBeVisible();
  await scenario.getByRole("button", { name: /Continuer/ }).click();

  const progression = await readProgression(page, kpId);
  expect(progression.attempts).toBe(1);
  expect(progression.correct).toBe(0);
  expect(progression.wrong).toBe(0);
  expect(progression.activities_mastered).toEqual([]);
});

test("desktop: le sélecteur charge les pilotes des Simanim 2 et 3", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: "Apprentissage", exact: true }).click();

  const siman2Button = page.getByRole("button", { name: "Siman 2", exact: true });
  await siman2Button.click();
  await expect(siman2Button).toHaveAttribute("aria-pressed", "true");
  const startButton = page.getByRole("button", { name: /Commencer la session/ });
  await expect(startButton).toBeEnabled();
  await startButton.click();
  await expect(page.getByTestId("activity-renderer")).toHaveAttribute("data-activity-id", /^s2-kp-/);
  await expect(page.getByTestId("activity-renderer")).toHaveAttribute("data-raw-type", "flashcard");
  await page.getByRole("button", { name: "Fermer la session" }).click();

  const siman3Button = page.getByRole("button", { name: "Siman 3", exact: true });
  await siman3Button.click();
  await expect(siman3Button).toHaveAttribute("aria-pressed", "true");
  await expect(startButton).toBeEnabled();
  await startButton.click();
  await expect(page.getByTestId("activity-renderer")).toHaveAttribute("data-activity-id", /^s3-kp-/);
  await expect(page.getByTestId("activity-renderer")).toHaveAttribute("data-raw-type", "flashcard");
});

test("desktop: une session objective crédite et persiste les XP", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  const objectiveKps = knowledgeData.knowledge_points
    .filter((kp) => kp.halakha_status !== "conditional"
      && (kp.pedagogy.activities.multiple_choice || kp.pedagogy.activities.true_false))
    .slice(0, 5);
  expect(objectiveKps).toHaveLength(5);
  const focusedIds = new Set(objectiveKps.map((kp) => kp.id));
  const progressions = Object.fromEntries(knowledgeData.knowledge_points.map((kp) => [
    kp.id,
    { status: focusedIds.has(kp.id) ? "practicing" : "mastered" }
  ]));

  await openLearning(page, progressions);
  for (let step = 0; step < 10; step += 1) {
    if (await completeCurrentActivityCorrectly(page) === "complete") break;
  }

  await expect(page.getByText("Session complétée", { exact: true })).toBeVisible();
  await expect.poll(async () => Number(await page.evaluate(
    () => localStorage.getItem("mishne_mikra_xp") || 0
  ))).toBe(75);
  await expect.poll(async () => await page.evaluate(
    () => localStorage.getItem("mishne_mikra_streak")
  )).toBe("1");
  expect(await page.evaluate(
    () => localStorage.getItem("mishne_mikra_last_streak_date")
  )).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});

test("desktop: une erreur sur la dernière activité affiche réellement son retry", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  const objectiveKps = knowledgeData.knowledge_points
    .filter((kp) => kp.halakha_status !== "conditional"
      && (kp.pedagogy.activities.multiple_choice || kp.pedagogy.activities.true_false))
    .slice(0, 5);
  const focusedIds = new Set(objectiveKps.map((kp) => kp.id));
  const progressions = Object.fromEntries(knowledgeData.knowledge_points.map((kp) => [
    kp.id,
    { status: focusedIds.has(kp.id) ? "practicing" : "mastered" }
  ]));

  await openLearning(page, progressions);
  for (let step = 0; step < 4; step += 1) await completeCurrentActivityCorrectly(page);

  const renderer = page.getByTestId("activity-renderer");
  const activityId = await renderer.getAttribute("data-activity-id");
  const instanceId = await renderer.getAttribute("data-instance-id");
  const rawType = await renderer.getAttribute("data-raw-type");
  const sourceActivity = activitiesById.get(activityId);

  if (rawType === "multiple_choice") {
    const wrongAnswer = sourceActivity.options.find((option) => option !== sourceActivity.correct_answer);
    await page.getByTestId("classic-quiz").getByText(wrongAnswer, { exact: true }).click();
    await page.getByTestId("classic-quiz").getByRole("button", { name: /Continuer/ }).click();
  } else if (rawType === "true_false") {
    await page.getByTestId("swipe-game")
      .getByRole("button", { name: sourceActivity.is_true ? "FAUX" : "VRAI", exact: true })
      .click();
    await page.getByTestId("swipe-game").getByRole("button", { name: /Continuer/ }).click();
  } else {
    throw new Error(`Dernière activité objective inattendue: ${rawType}`);
  }

  await expect(renderer).toHaveAttribute("data-activity-id", activityId);
  await expect(renderer).not.toHaveAttribute("data-instance-id", instanceId);
  await expect(renderer).toHaveAttribute("data-instance-id", /__retry__/);
  await expect(page.getByText("6/6", { exact: true })).toBeVisible();
  await expect(page.getByText("Session complétée", { exact: true })).not.toBeVisible();

  await completeCurrentActivityCorrectly(page);
  await expect(page.getByText("Session complétée", { exact: true })).toBeVisible();
});

test("desktop: le reset UI efface Learning Core, XP et streak", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem("halakhapp_kp_progression", JSON.stringify({ "kp-test": { status: "learning" } }));
    localStorage.setItem("mishne_mikra_xp", "30");
    localStorage.setItem("mishne_mikra_streak", "4");
  });
  await page.reload();
  await page.getByRole("button", { name: "Profil", exact: true }).click();
  await page.getByRole("button", { name: /Réinitialiser ma progression/ }).click();

  const stored = await page.evaluate(() => ({
    learning: localStorage.getItem("halakhapp_kp_progression"),
    xp: localStorage.getItem("mishne_mikra_xp"),
    streak: localStorage.getItem("mishne_mikra_streak")
  }));
  expect(stored).toEqual({ learning: null, xp: null, streak: null });
});

test("mobile 375px: vrai/faux répond à un vrai geste tactile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-touch");
  const kpId = "s1-kp-006";
  const qcmId = "s1-kp-006-qcm-01";
  const trueFalse = activitiesById.get("s1-kp-006-vf-01");
  expect(trueFalse).toBeTruthy();

  await openLearning(page, {
    [kpId]: {
      status: "needs_review",
      activities_mastered: [{ id: qcmId, type: "multiple_choice" }]
    }
  });
  await expect(page.getByTestId("swipe-game")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  const card = page.getByTestId("swipe-card");
  const coordinates = trueFalse.is_true
    ? { startX: 120, endX: 280 }
    : { startX: 255, endX: 60 };
  await card.evaluate((element, points) => {
    const makeTouch = (clientX) => new Touch({
      identifier: 1,
      target: element,
      clientX,
      clientY: 250,
      pageX: clientX,
      pageY: 250,
      screenX: clientX,
      screenY: 250,
      radiusX: 2,
      radiusY: 2,
      rotationAngle: 0,
      force: 1
    });
    const start = makeTouch(points.startX);
    element.dispatchEvent(new TouchEvent("touchstart", {
      bubbles: true,
      cancelable: true,
      touches: [start],
      targetTouches: [start],
      changedTouches: [start]
    }));
    const move = makeTouch(points.endX);
    element.dispatchEvent(new TouchEvent("touchmove", {
      bubbles: true,
      cancelable: true,
      touches: [move],
      targetTouches: [move],
      changedTouches: [move]
    }));
    element.dispatchEvent(new TouchEvent("touchend", {
      bubbles: true,
      cancelable: true,
      touches: [],
      targetTouches: [],
      changedTouches: [move]
    }));
  }, coordinates);

  await expect(page.getByText("🎉 Bonne réponse !", { exact: true })).toBeVisible();
  await page.getByTestId("swipe-game").getByRole("button", { name: /Continuer/ }).click();
  const progression = await readProgression(page, kpId);
  expect(progression.status).toBe("mastered");
  expect(progression.activities_mastered.map((activity) => activity.id)).toContain(trueFalse.activity_id);
});
