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
      totalActivities: 117,
      acceptedActivities: 94,
      rejectedActivities: 23,
      allowedRejectionReason: "Activité conditionnelle sans texte de condition fourni"
    })
  }),
  siman_2: Object.freeze({
    id: "siman_2",
    simanNumber: 2,
    shortLabel: "Siman 2",
    sourcePath: "/data/הלכות הנהגת אדם בבוקר/siman_2.json",
    knowledgePath: "/data/הלכות הנהגת אדם בבוקר/siman_2_knowledge.json",
    contentContract: Object.freeze({
      pilotScope: "source_exposure_only",
      totalActivities: 28,
      acceptedActivities: 28,
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
      pilotScope: "source_exposure_only",
      totalActivities: 25,
      acceptedActivities: 25,
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
