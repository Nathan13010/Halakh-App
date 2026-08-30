/**
 * Persistance et règles de progression du Learning Core.
 *
 * Une preuve de maîtrise est toujours une réussite objective associée à un
 * activity_id distinct. Les expositions (Flashcard et Situation reflective)
 * ne peuvent donc jamais produire de maîtrise.
 */

const STORAGE_KEY = "halakhapp_kp_progression";

export const DEFAULT_KP_PROGRESSION = Object.freeze({
  status: "non_started",
  attempts: 0,
  correct: 0,
  wrong: 0,
  last_seen: null,
  last_correct: null,
  next_review: null,
  streak: 0,
  activities_mastered: [],
  activity_success_counts: {},
  last_failed_activity_id: null
});

const VALID_STATUSES = new Set([
  "non_started",
  "learning",
  "practicing",
  "needs_review",
  "mastered"
]);

const toSafeCounter = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
};

export const normalizeKpProgression = (stored = {}) => {
  const source = stored && typeof stored === "object" ? stored : {};
  const uniqueMastered = [];
  const seenActivityIds = new Set();

  if (Array.isArray(source.activities_mastered)) {
    source.activities_mastered.forEach((activity) => {
      if (!activity || typeof activity.id !== "string" || seenActivityIds.has(activity.id)) return;
      seenActivityIds.add(activity.id);
      uniqueMastered.push({
        id: activity.id,
        type: typeof activity.type === "string" ? activity.type : "unknown"
      });
    });
  }

  const successCounts = {};
  if (source.activity_success_counts && typeof source.activity_success_counts === "object") {
    Object.entries(source.activity_success_counts).forEach(([activityId, count]) => {
      if (activityId) successCounts[activityId] = toSafeCounter(count);
    });
  }

  return {
    ...DEFAULT_KP_PROGRESSION,
    ...source,
    status: VALID_STATUSES.has(source.status) ? source.status : DEFAULT_KP_PROGRESSION.status,
    attempts: toSafeCounter(source.attempts),
    correct: toSafeCounter(source.correct),
    wrong: toSafeCounter(source.wrong),
    streak: toSafeCounter(source.streak),
    activities_mastered: uniqueMastered,
    activity_success_counts: successCounts,
    last_seen: source.last_seen ?? null,
    last_correct: source.last_correct ?? null,
    next_review: source.next_review ?? null,
    last_failed_activity_id: source.last_failed_activity_id ?? null
  };
};

export const getAllProgressions = () => {
  if (typeof window === "undefined") return {};

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return {};

    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

    return Object.fromEntries(
      Object.entries(parsed).map(([kpId, progression]) => [kpId, normalizeKpProgression(progression)])
    );
  } catch (error) {
    console.error("Erreur lecture progression:", error);
    return {};
  }
};

const saveProgressions = (progressions) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressions));
  } catch (error) {
    console.error("Erreur sauvegarde progression:", error);
  }
};

export const getKpProgression = (kpId) => {
  const progressions = getAllProgressions();
  return normalizeKpProgression(progressions[kpId]);
};

export const markKpAsLearning = (kpId) => {
  const progressions = getAllProgressions();
  const kpProg = getKpProgression(kpId);

  if (kpProg.status === "non_started") {
    progressions[kpId] = {
      ...kpProg,
      status: "learning",
      last_seen: Date.now()
    };
    saveProgressions(progressions);
  }

  return progressions[kpId] || kpProg;
};

const isObjectiveActivityType = (activityType) => ![
  "flashcard",
  "card",
  "practical_situation_reflective"
].includes(activityType);

export const updateKpProgression = (
  kpId,
  activityId,
  activityType,
  isCorrect,
  _availableActivityTypes = []
) => {
  const progressions = getAllProgressions();
  const kpProg = getKpProgression(kpId);

  let newStatus = kpProg.status;
  let newStreak = kpProg.streak;
  let newCorrect = kpProg.correct;
  let newWrong = kpProg.wrong;
  let lastCorrect = kpProg.last_correct;
  let lastFailedActivityId = kpProg.last_failed_activity_id;
  const newMasteredActs = [...kpProg.activities_mastered];
  const newSuccessCounts = { ...kpProg.activity_success_counts };

  if (isCorrect === true) {
    newCorrect += 1;
    newStreak += 1;
    lastCorrect = Date.now();
    lastFailedActivityId = null;

    if (isObjectiveActivityType(activityType)) {
      newSuccessCounts[activityId] = (newSuccessCounts[activityId] || 0) + 1;

      if (!newMasteredActs.some((activity) => activity.id === activityId)) {
        newMasteredActs.push({ id: activityId, type: activityType });
      }

      newStatus = newMasteredActs.length >= 2 ? "mastered" : "practicing";
    }
  } else if (isCorrect === false) {
    newWrong += 1;
    newStreak = 0;
    newStatus = "needs_review";
    lastFailedActivityId = activityId;
  } else if (activityType === "flashcard" && kpProg.status === "non_started") {
    // La découverte n'est enregistrée qu'au clic final de la Flashcard.
    newStatus = "learning";
  }

  progressions[kpId] = normalizeKpProgression({
    ...kpProg,
    status: newStatus,
    attempts: kpProg.attempts + 1,
    correct: newCorrect,
    wrong: newWrong,
    streak: newStreak,
    last_seen: Date.now(),
    last_correct: lastCorrect,
    activities_mastered: newMasteredActs,
    activity_success_counts: newSuccessCounts,
    last_failed_activity_id: lastFailedActivityId
  });

  saveProgressions(progressions);
  return progressions[kpId];
};

export const resetAllProgressions = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
};
