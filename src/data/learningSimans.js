/**
 * Manifeste technique des Knowledge JSON disponibles pour le Learning Core.
 * Ajouter un Siman consiste à déclarer son chemin ici, sans modifier le moteur.
 */
export const LEARNING_SIMANS = Object.freeze({
  siman_1: Object.freeze({
    id: "siman_1",
    simanNumber: 1,
    knowledgePath: "/data/הלכות הנהגת אדם בבוקר/siman_1_knowledge.json",
    contentContract: Object.freeze({
      totalActivities: 117,
      acceptedActivities: 94,
      rejectedActivities: 23,
      allowedRejectionReason: "Activité conditionnelle sans texte de condition fourni"
    })
  })
});

export const DEFAULT_LEARNING_SIMAN_ID = "siman_1";

export const getLearningSimanConfig = (simanId) => LEARNING_SIMANS[simanId] || {
  id: simanId,
  simanNumber: String(simanId || "").replace(/^siman_/, ""),
  knowledgePath: `/data/${simanId}_knowledge.json`
};
