import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import {
  getKpProgression,
  normalizeKpProgression,
  resetAllProgressions,
  updateKpProgression
} from "../../src/services/progressionTracker.js";
import { installBrowserStorage, setProgressions } from "./helpers.js";

let storage;

beforeEach(() => {
  storage = installBrowserStorage();
});

test("Flashcard complétée: non_started -> learning", () => {
  const progression = updateKpProgression("kp-1", "fc-1", "flashcard", null);
  assert.equal(progression.status, "learning");
  assert.equal(progression.attempts, 1);
  assert.equal(progression.correct, 0);
});

test("première évaluation objective réussie -> practicing", () => {
  updateKpProgression("kp-1", "fc-1", "flashcard", null);
  const progression = updateKpProgression("kp-1", "qcm-a", "multiple_choice", true);
  assert.equal(progression.status, "practicing");
  assert.deepEqual(progression.activities_mastered, [{ id: "qcm-a", type: "multiple_choice" }]);
});

test("une erreur -> needs_review et remet le streak du KP à zéro", () => {
  updateKpProgression("kp-1", "qcm-a", "multiple_choice", true);
  const progression = updateKpProgression("kp-1", "vf-a", "true_false", false);
  assert.equal(progression.status, "needs_review");
  assert.equal(progression.wrong, 1);
  assert.equal(progression.streak, 0);
  assert.equal(progression.last_failed_activity_id, "vf-a");
});

test("le même QCM réussi deux fois ne produit pas mastered", () => {
  updateKpProgression("kp-1", "qcm-a", "multiple_choice", true);
  const progression = updateKpProgression("kp-1", "qcm-a", "multiple_choice", true);
  assert.equal(progression.status, "practicing");
  assert.equal(progression.activities_mastered.length, 1);
  assert.equal(progression.activity_success_counts["qcm-a"], 2);
});

test("deux QCM distincts peuvent produire mastered", () => {
  updateKpProgression("kp-1", "qcm-a", "multiple_choice", true);
  const progression = updateKpProgression("kp-1", "qcm-b", "multiple_choice", true);
  assert.equal(progression.status, "mastered");
  assert.equal(progression.activities_mastered.length, 2);
});

test("un QCM et un V/F distincts peuvent produire mastered", () => {
  updateKpProgression("kp-1", "qcm-a", "multiple_choice", true);
  const progression = updateKpProgression("kp-1", "vf-a", "true_false", true);
  assert.equal(progression.status, "mastered");
});

test("Flashcard et Situation reflective ne sont jamais des preuves objectives", () => {
  updateKpProgression("kp-1", "fc-1", "flashcard", null);
  const progression = updateKpProgression(
    "kp-1",
    "scenario-1",
    "practical_situation_reflective",
    null
  );
  assert.equal(progression.status, "learning");
  assert.equal(progression.activities_mastered.length, 0);
  assert.equal(progression.correct, 0);
});

test("un streak historique élevé n'influence pas la maîtrise", () => {
  setProgressions(storage, { "kp-1": { status: "learning", streak: 99 } });
  const progression = updateKpProgression("kp-1", "qcm-a", "multiple_choice", true);
  assert.equal(progression.status, "practicing");
  assert.equal(progression.streak, 100);
});

test("les anciens objets localStorage sont migrés sans undefined ni NaN", () => {
  setProgressions(storage, { "kp-old": { status: "learning", attempts: "invalide" } });
  const progression = getKpProgression("kp-old");
  assert.equal(progression.attempts, 0);
  assert.equal(progression.correct, 0);
  assert.equal(progression.wrong, 0);
  assert.deepEqual(progression.activities_mastered, []);
  assert.deepEqual(progression.activity_success_counts, {});
});

test("la normalisation déduplique les anciennes preuves par activity_id", () => {
  const progression = normalizeKpProgression({
    activities_mastered: [
      { id: "qcm-a", type: "multiple_choice" },
      { id: "qcm-a", type: "multiple_choice" }
    ]
  });
  assert.equal(progression.activities_mastered.length, 1);
});

test("resetAllProgressions supprime la progression Learning Core", () => {
  updateKpProgression("kp-1", "fc-1", "flashcard", null);
  resetAllProgressions();
  assert.equal(storage.getItem("halakhapp_kp_progression"), null);
});
