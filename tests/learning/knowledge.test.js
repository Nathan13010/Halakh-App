import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DEFAULT_LEARNING_SIMAN_ID,
  getLearningSimanConfig
} from "../../src/data/learningSimans.js";
import { fetchKnowledgeForSiman } from "../../src/services/knowledgeService.js";

test("le Siman par défaut est déclaré dans un manifeste central", () => {
  const config = getLearningSimanConfig(DEFAULT_LEARNING_SIMAN_ID);
  assert.equal(config.id, "siman_1");
  assert.match(config.knowledgePath, /siman_1_knowledge\.json$/);
});

test("un futur Siman utilise le chemin aplati sans modifier le service", async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(url);
    return {
      ok: true,
      json: async () => ({ meta: { siman: 999 }, knowledge_points: [] })
    };
  };

  try {
    const data = await fetchKnowledgeForSiman("siman_999");
    assert.equal(data.meta.siman, 999);
    assert.equal(calls[0], "/data/siman_999_knowledge.json");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
