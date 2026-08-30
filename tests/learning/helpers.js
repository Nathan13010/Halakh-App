export class MemoryStorage {
  constructor() {
    this.values = new Map();
  }

  getItem(key) {
    return this.values.has(key) ? this.values.get(key) : null;
  }

  setItem(key, value) {
    this.values.set(key, String(value));
  }

  removeItem(key) {
    this.values.delete(key);
  }

  clear() {
    this.values.clear();
  }
}

export const installBrowserStorage = () => {
  const storage = new MemoryStorage();
  globalThis.localStorage = storage;
  globalThis.window = { localStorage: storage };
  return storage;
};

export const setProgressions = (storage, progressions) => {
  storage.setItem("halakhapp_kp_progression", JSON.stringify(progressions));
};

export const baseActivity = (type, kpId, suffix = type) => {
  const activity = {
    activity_id: `${kpId}-${suffix}`,
    knowledge_point_id: kpId,
    source_seif: "1",
    type,
    validated: true
  };

  if (type === "flashcard") return { ...activity, question: "Question", answer: "Réponse" };
  if (type === "multiple_choice") {
    return { ...activity, question: "Question", options: ["A", "B"], correct_answer: "A" };
  }
  if (type === "true_false") return { ...activity, statement: "Affirmation", is_true: true };
  if (type === "practical_situation") {
    return { ...activity, situation: "Situation", question: "Question", answer: "Réponse" };
  }
  return activity;
};

export const makeKp = (id, activities, overrides = {}) => ({
  id,
  title: `KP ${id}`,
  rule: "Règle validée de test",
  explanation: "Explication validée de test",
  learning_level: 1,
  importance: "essential",
  halakha_status: "clear",
  pedagogy: { activities },
  ...overrides
});
