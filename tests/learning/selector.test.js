import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { beforeEach, test } from "node:test";
import {
  getQueueForSession,
  pickActivitiesForKp,
  sortKpsForSelection
} from "../../src/services/activitySelector.js";
import { validateActivity } from "../../src/services/activityValidator.js";
import { getActivitiesForKp } from "../../src/services/knowledgeService.js";
import {
  baseActivity,
  installBrowserStorage,
  makeKp,
  setProgressions
} from "./helpers.js";

let storage;

const buckets = (kpId, types) => Object.fromEntries(types.map((type) => [
  type,
  baseActivity(type, kpId, type === "multiple_choice" ? "qcm-a" : type === "true_false" ? "vf-a" : type)
]));

beforeEach(() => {
  storage = installBrowserStorage();
});

test("needs_review passe avant non_started", () => {
  const reviewKp = makeKp("kp-review", buckets("kp-review", ["multiple_choice"]));
  const newKp = makeKp("kp-new", buckets("kp-new", ["flashcard"]));
  setProgressions(storage, { "kp-review": { status: "needs_review" } });

  const queue = getQueueForSession({ knowledge_points: [newKp, reviewKp] }, 1);
  assert.equal(queue[0].knowledge_point_id, "kp-review");
});

test("needs_review préfère une alternative à la dernière activité échouée", () => {
  const kpId = "kp-review";
  const qcmA = baseActivity("multiple_choice", kpId, "qcm-a");
  const qcmB = baseActivity("multiple_choice", kpId, "qcm-b");
  const kp = makeKp(kpId, { multiple_choice: [qcmA, qcmB] });
  const progression = { status: "needs_review", activities_mastered: [], last_failed_activity_id: qcmA.activity_id };

  const selected = pickActivitiesForKp(kp, progression);
  assert.equal(selected[0].activity_id, qcmB.activity_id);
});

test("une activité objective non maîtrisée passe avant celle déjà maîtrisée", () => {
  const kpId = "kp-tests";
  const qcm = baseActivity("multiple_choice", kpId, "qcm-a");
  const trueFalse = baseActivity("true_false", kpId, "vf-a");
  const kp = makeKp(kpId, { multiple_choice: qcm, true_false: trueFalse });
  const progression = {
    status: "practicing",
    activities_mastered: [{ id: qcm.activity_id, type: "multiple_choice" }]
  };

  const selected = pickActivitiesForKp(kp, progression);
  assert.equal(selected[0].activity_id, trueFalse.activity_id);
});

test("backfill atteint 5 KPs distincts lorsqu'un KP prioritaire est invalide", () => {
  const invalid = makeKp("kp-0", {
    flashcard: { ...baseActivity("flashcard", "kp-0"), validated: false }
  });
  const validKps = Array.from({ length: 5 }, (_, index) => {
    const id = `kp-${index + 1}`;
    return makeKp(id, buckets(id, ["flashcard"]));
  });

  const queue = getQueueForSession({ knowledge_points: [invalid, ...validKps] }, 5);
  assert.equal(new Set(queue.map((activity) => activity.knowledge_point_id)).size, 5);
  assert.ok(queue.every((activity) => activity.knowledge_point_id !== "kp-0"));
});

test("une Situation ouverte reste routée vers ScenarioGame en mode REFLECTIVE", () => {
  const kpId = "kp-scenario";
  const kp = makeKp(kpId, buckets(kpId, ["practical_situation"]));
  const selected = pickActivitiesForKp(kp, { status: "learning", activities_mastered: [] });
  assert.equal(selected[0].type, "practical_situation");
  assert.equal(selected[0].rawType, "practical_situation");
  assert.equal(selected[0].assessmentMode, "REFLECTIVE");
});

test("les KPs Flashcard-only en learning sont limités à un si d'autres KPs sont disponibles", () => {
  const flashKps = Array.from({ length: 3 }, (_, index) => {
    const id = `flash-${index}`;
    return makeKp(id, buckets(id, ["flashcard"]));
  });
  const practiceKps = Array.from({ length: 4 }, (_, index) => {
    const id = `practice-${index}`;
    return makeKp(id, buckets(id, ["multiple_choice"]));
  });

  setProgressions(storage, Object.fromEntries([
    ...flashKps.map((kp, index) => [kp.id, { status: "learning", last_seen: index + 1 }]),
    ...practiceKps.map((kp) => [kp.id, { status: "practicing" }])
  ]));

  const queue = getQueueForSession({ knowledge_points: [...flashKps, ...practiceKps] }, 5);
  const selectedFlashOnly = new Set(queue
    .filter((activity) => activity.knowledge_point_id.startsWith("flash-"))
    .map((activity) => activity.knowledge_point_id));
  assert.equal(selectedFlashOnly.size, 1);
  assert.equal(new Set(queue.map((activity) => activity.knowledge_point_id)).size, 5);
});

test("secondary est classé avant reference", () => {
  const commonProgression = { status: "non_started", last_seen: null };
  const secondary = { kp: makeKp("secondary", {}, { importance: "secondary" }), prog: commonProgression };
  const reference = { kp: makeKp("reference", {}, { importance: "reference" }), prog: commonProgression };
  assert.ok(sortKpsForSelection(secondary, reference) < 0);
});

test("la queue réelle contient 5 KPs et aucune activité source invalide", () => {
  const url = new URL(
    "../../public/data/הלכות הנהגת אדם בבוקר/siman_1_knowledge.json",
    import.meta.url
  );
  const data = JSON.parse(readFileSync(url, "utf8"));
  const queue = getQueueForSession(data, 5);
  const kpById = new Map(data.knowledge_points.map((kp) => [kp.id, kp]));

  assert.equal(new Set(queue.map((activity) => activity.knowledge_point_id)).size, 5);
  for (const activity of queue) {
    const kp = kpById.get(activity.knowledge_point_id);
    const raw = getActivitiesForKp(kp).find((candidate) => candidate.activity_id === activity.activity_id);
    assert.equal(validateActivity(raw, kp).isValid, true, activity.activity_id);
  }
});
