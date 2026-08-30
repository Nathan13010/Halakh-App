/**
 * Sélectionne et ordonne les activités validées sans jamais en générer.
 */

import { getKpProgression } from "./progressionTracker.js";
import { getActivitiesForKp } from "./knowledgeService.js";
import {
  getActivityAssessmentMode,
  getValidatedConditionContext,
  isObjectivelyAssessable,
  validateActivity
} from "./activityValidator.js";

const STATUS_ORDER = {
  needs_review: 5,
  non_started: 4,
  learning: 3,
  practicing: 2,
  mastered: 1
};

const LEVEL_ORDER = {
  1: 4,
  2: 3,
  3: 2,
  4: 1
};

const IMPORTANCE_ORDER = {
  essential: 4,
  important: 3,
  secondary: 2,
  useful: 2,
  reference: 1
};

export const sortKpsForSelection = (kpA, kpB) => {
  const statusDifference = (STATUS_ORDER[kpB.prog.status] || 0)
    - (STATUS_ORDER[kpA.prog.status] || 0);
  if (statusDifference !== 0) return statusDifference;

  const levelDifference = (LEVEL_ORDER[kpB.kp.learning_level] || 0)
    - (LEVEL_ORDER[kpA.kp.learning_level] || 0);
  if (levelDifference !== 0) return levelDifference;

  const importanceDifference = (IMPORTANCE_ORDER[kpB.kp.importance] || 0)
    - (IMPORTANCE_ORDER[kpA.kp.importance] || 0);
  if (importanceDifference !== 0) return importanceDifference;

  // A priorité égale, les KPs jamais vus ou vus le plus anciennement tournent d'abord.
  const lastSeenDifference = (kpA.prog.last_seen || 0) - (kpB.prog.last_seen || 0);
  if (lastSeenDifference !== 0) return lastSeenDifference;

  return String(kpA.kp.id).localeCompare(String(kpB.kp.id));
};

export const getValidActivitiesForKp = (kp, { logRejected = true } = {}) => getActivitiesForKp(kp)
  .filter((activity) => {
    const validation = validateActivity(activity, kp);
    if (!validation.isValid && logRejected) {
      console.warn(`[Validator] Activité ${activity.activity_id} rejetée: ${validation.reason}`);
    }
    return validation.isValid;
  });

const uniqueByActivityId = (activities) => {
  const seen = new Set();
  return activities.filter((activity) => {
    if (seen.has(activity.activity_id)) return false;
    seen.add(activity.activity_id);
    return true;
  });
};

const pickAvoidFailed = (activities, progression, recentlyUsedIds) => {
  const candidates = uniqueByActivityId(activities);
  if (candidates.length === 0) return null;

  const ideal = candidates.find((activity) => activity.activity_id !== progression.last_failed_activity_id
    && !recentlyUsedIds.includes(activity.activity_id));
  if (ideal) return ideal;

  const notInQueue = candidates.find((activity) => !recentlyUsedIds.includes(activity.activity_id));
  return notInQueue || candidates[0];
};

const normalizeActivityForUi = (rawActivity, kp) => {
  const normalized = {
    ...rawActivity,
    id: rawActivity.activity_id,
    rawType: rawActivity.type,
    halakha_status: kp.halakha_status,
    conditions: getValidatedConditionContext(rawActivity, kp) || undefined,
    assessmentMode: getActivityAssessmentMode(rawActivity)
  };

  if (rawActivity.type === "flashcard") {
    normalized.type = "card";
    normalized.title = kp.title || rawActivity.title;
    normalized.rule = kp.rule || rawActivity.answer;
    normalized.explanation = kp.explanation;
    normalized.practical_example = kp.practical_example;
  } else if (rawActivity.type === "multiple_choice") {
    normalized.type = "quiz";
    normalized.correctIndex = rawActivity.options.indexOf(rawActivity.correct_answer);
  } else if (rawActivity.type === "true_false") {
    normalized.type = "true_false";
    normalized.question = `Vrai ou Faux : ${rawActivity.statement}`;
    normalized.options = ["Vrai", "Faux"];
    normalized.correctIndex = rawActivity.is_true ? 0 : 1;
  } else if (rawActivity.type === "practical_situation") {
    // Le type et les champs restent intacts pour rendre ScenarioGame accessible.
    normalized.type = "practical_situation";
    normalized.explanation = rawActivity.explanation || kp.explanation;
  }

  return normalized;
};

export const pickActivitiesForKp = (kp, progression, recentlyUsedIds = []) => {
  const validActivities = getValidActivitiesForKp(kp);
  if (validActivities.length === 0) return [];

  const flashcards = validActivities.filter((activity) => activity.type === "flashcard");
  const tests = validActivities.filter((activity) => ["multiple_choice", "true_false"].includes(activity.type));
  const situations = validActivities.filter((activity) => activity.type === "practical_situation");
  const masteredIds = new Set((progression.activities_mastered || []).map((activity) => activity.id));
  const unmasteredTests = tests.filter((activity) => !masteredIds.has(activity.activity_id));
  const unmasteredSituations = situations.filter((activity) => !masteredIds.has(activity.activity_id));
  const selectedActivities = [];

  if (progression.status === "non_started") {
    const flashcard = pickAvoidFailed(flashcards, progression, recentlyUsedIds);
    if (flashcard) selectedActivities.push(flashcard);
  } else if (progression.status === "learning" && tests.length === 0 && situations.length === 0) {
    const flashcard = pickAvoidFailed(flashcards, progression, recentlyUsedIds);
    if (flashcard) selectedActivities.push(flashcard);
  }

  const orderedCandidates = [...unmasteredTests, ...unmasteredSituations, ...tests, ...situations];

  const testActivity = pickAvoidFailed(orderedCandidates, progression, recentlyUsedIds);
  if (testActivity) selectedActivities.push(testActivity);

  return uniqueByActivityId(selectedActivities).map((activity) => normalizeActivityForUi(activity, kp));
};

export const isExposureOnlyLearningKp = (kp, progression) => {
  if (progression.status !== "learning") return false;
  const validActivities = getValidActivitiesForKp(kp, { logRejected: false });
  return validActivities.length > 0
    && validActivities.every((activity) => !isObjectivelyAssessable(activity));
};

export const getQueueForSession = (knowledgeData, sessionSize = 5) => {
  if (!knowledgeData?.knowledge_points || sessionSize <= 0) return [];

  const rankedKps = knowledgeData.knowledge_points
    .map((kp) => ({ kp, prog: getKpProgression(kp.id) }))
    .sort(sortKpsForSelection);

  const queue = [];
  const recentlyUsedIds = [];
  const deferredExposureOnly = [];
  let selectedKpCount = 0;
  let exposureOnlyCount = 0;

  const appendKpActivities = (item) => {
    const activities = pickActivitiesForKp(item.kp, item.prog, recentlyUsedIds);
    if (activities.length === 0) return false;

    activities.forEach((activity) => {
      queue.push(activity);
      recentlyUsedIds.push(activity.id);
    });
    selectedKpCount += 1;
    return true;
  };

  for (const item of rankedKps) {
    if (selectedKpCount >= sessionSize) break;

    if (isExposureOnlyLearningKp(item.kp, item.prog)) {
      if (exposureOnlyCount >= 1) {
        deferredExposureOnly.push(item);
        continue;
      }
      if (appendKpActivities(item)) exposureOnlyCount += 1;
      continue;
    }

    appendKpActivities(item);
  }

  // Si aucun autre contenu n'est disponible, on complète malgré tout la session
  // avec les KPs d'exposition différés, dans l'ordre déterministe de last_seen.
  for (const item of deferredExposureOnly) {
    if (selectedKpCount >= sessionSize) break;
    appendKpActivities(item);
  }

  return queue;
};
