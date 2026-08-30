import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  createRetryActivity,
  getNextSessionTransition
} from "../../src/services/sessionQueue.js";

test("une erreur sur la dernière activité ajoute le retry et garde la session active", () => {
  const activity = { activity_id: "qcm-a", id: "qcm-a" };
  const retryActivity = createRetryActivity(activity, 5);
  const transition = getNextSessionTransition({
    currentIndex: 4,
    queueLength: 5,
    retryActivity
  });

  assert.deepEqual(transition, {
    appendRetry: true,
    nextIndex: 5,
    nextStatus: "active"
  });
  assert.equal(retryActivity.retryOf, "qcm-a");
  assert.notEqual(retryActivity.id, activity.id);
});

test("la dernière activité sans retry termine la session", () => {
  assert.deepEqual(getNextSessionTransition({ currentIndex: 4, queueLength: 5 }), {
    appendRetry: false,
    nextIndex: 4,
    nextStatus: "completed"
  });
});

test("une activité intermédiaire avance d'un index", () => {
  assert.deepEqual(getNextSessionTransition({ currentIndex: 1, queueLength: 5 }), {
    appendRetry: false,
    nextIndex: 2,
    nextStatus: "active"
  });
});

test("les instances retry successives ont des clés distinctes", () => {
  const activity = { activity_id: "qcm-a", id: "qcm-a" };
  assert.notEqual(createRetryActivity(activity, 5).id, createRetryActivity(activity, 6).id);
});

test("ActivityRenderer est remonté sur une clé d'instance stable", () => {
  const url = new URL("../../src/components/LearningScreen.jsx", import.meta.url);
  const source = readFileSync(url, "utf8");
  assert.match(source, /<ActivityRenderer\s+key=\{session\.currentActivity\.id\}/);
});
