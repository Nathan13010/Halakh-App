/**
 * Manifeste technique des Knowledge JSON disponibles pour le Learning Core.
 * Ajouter un Siman consiste à déclarer son chemin ici, sans modifier le moteur.
 */
export const LEARNING_SIMANS = Object.freeze({
  siman_1: Object.freeze({
    id: "siman_1",
    simanNumber: 1,
    shortLabel: "Siman 1",
    sourcePath: "/data/הלכות הנהגת אדם בבוקר/siman_1.json",
    knowledgePath: "/data/הלכות הנהגת אדם בבוקר/siman_1_knowledge.json",
    contentContract: Object.freeze({
      totalActivities: 0,
      acceptedActivities: 0,
      rejectedActivities: 0,
      allowedRejectionReason: null
    })
  }),
  siman_2: Object.freeze({
    id: "siman_2",
    simanNumber: 2,
    shortLabel: "Siman 2",
    sourcePath: "/data/הלכות הנהגת אדם בבוקר/siman_2.json",
    knowledgePath: "/data/הלכות הנהגת אדם בבוקר/siman_2_knowledge.json",
    contentContract: Object.freeze({
      totalActivities: 0,
      acceptedActivities: 0,
      rejectedActivities: 0,
      allowedRejectionReason: null
    })
  }),
  siman_3: Object.freeze({
    id: "siman_3",
    simanNumber: 3,
    shortLabel: "Siman 3",
    sourcePath: "/data/הלכות הנהגת אדם בבוקר/siman_3.json",
    knowledgePath: "/data/הלכות הנהגת אדם בבוקר/siman_3_knowledge.json",
    contentContract: Object.freeze({
      totalActivities: 0,
      acceptedActivities: 0,
      rejectedActivities: 0,
      allowedRejectionReason: null
    })
  }),
  siman_4: Object.freeze({
    id: "siman_4",
    simanNumber: 4,
    shortLabel: "Siman 4",
    sourcePath: "/data/הלכות הנהגת אדם בבוקר/siman_4.json",
    knowledgePath: "/data/הלכות הנהגת אדם בבוקר/siman_4_knowledge.json",
    contentContract: Object.freeze({
      totalActivities: 0,
      acceptedActivities: 0,
      rejectedActivities: 0,
      allowedRejectionReason: null
    })
  }),
  siman_5: Object.freeze({
    id: "siman_5",
    simanNumber: 5,
    shortLabel: "Siman 5",
    sourcePath: "/data/הלכות הנהגת אדם בבוקר/siman_5.json",
    knowledgePath: "/data/הלכות הנהגת אדם בבוקר/siman_5_knowledge.json",
    contentContract: Object.freeze({
      totalActivities: 0,
      acceptedActivities: 0,
      rejectedActivities: 0,
      allowedRejectionReason: null
    })
  }),
  siman_6: Object.freeze({
    id: "siman_6",
    simanNumber: 6,
    shortLabel: "Siman 6",
    sourcePath: "/data/הלכות הנהגת אדם בבוקר/siman_6.json",
    knowledgePath: "/data/הלכות הנהגת אדם בבוקר/siman_6_knowledge.json",
    contentContract: Object.freeze({
      totalActivities: 0,
      acceptedActivities: 0,
      rejectedActivities: 0,
      allowedRejectionReason: null
    })
  }),
  siman_7: Object.freeze({
    id: "siman_7",
    simanNumber: 7,
    shortLabel: "Siman 7",
    sourcePath: "/data/הלכות הנהגת אדם בבוקר/siman_7.json",
    knowledgePath: "/data/הלכות הנהגת אדם בבוקר/siman_7_knowledge.json",
    contentContract: Object.freeze({
      totalActivities: 0,
      acceptedActivities: 0,
      rejectedActivities: 0,
      allowedRejectionReason: null
    })
  })
});

export const DEFAULT_LEARNING_SIMAN_ID = "siman_1";
export const AVAILABLE_LEARNING_SIMANS = Object.freeze(Object.values(LEARNING_SIMANS));

export const getLearningSimanConfig = (simanId) => LEARNING_SIMANS[simanId] || {
  id: simanId,
  simanNumber: String(simanId || "").replace(/^siman_/, ""),
  knowledgePath: `/data/${simanId}_knowledge.json`
};
