const fs = require("node:fs");
const path = require("node:path");

const DATA_DIRECTORY = path.join(
  __dirname,
  "..",
  "public",
  "data",
  "הלכות הנהגת אדם בבוקר"
);

const SIMAN_HEBREW = {
  2: "ב",
  3: "ג"
};

const buildKnowledgePoint = (halakha, simanNumber, index) => {
  const sequence = String(index + 1).padStart(3, "0");
  const kpId = `s${simanNumber}-kp-${sequence}`;
  const sourceSeif = String(halakha.seif);
  const sourceText = String(halakha.texte_integral?.francais || "").trim();

  if (!sourceText) {
    throw new Error(`Traduction française absente: Siman ${simanNumber}, סעיף ${sourceSeif}`);
  }

  return {
    id: kpId,
    title: halakha.titre_seif,
    rule: sourceText,
    explanation: null,
    practical_example: null,
    common_trap: null,
    learning_level: 1,
    importance: "important",
    knowledge_type: "source_seif",
    halakha_status: "unclassified",
    claims: [
      {
        text: sourceText,
        sources: [{ siman: simanNumber, seif: sourceSeif }]
      }
    ],
    sources: [{ siman: simanNumber, seif: sourceSeif }],
    pedagogy: {
      learning_summary: `Lecture directe du סעיף ${sourceSeif} : ${halakha.titre_seif}`,
      simple_explanation: sourceText,
      human_review_required: true,
      pilot_scope: "source_exposure_only",
      activities: {
        flashcard: {
          activity_id: `${kpId}-flashcard-01`,
          knowledge_point_id: kpId,
          source_seif: sourceSeif,
          title: halakha.titre_seif,
          question: `Que présente le סעיף ${sourceSeif} concernant « ${halakha.titre_seif} » ?`,
          answer: sourceText,
          conditions: "",
          validated: true,
          validation_scope: "exact_source_projection"
        }
      }
    }
  };
};

for (const simanNumber of [2, 3]) {
  const sourceName = `siman_${simanNumber}.json`;
  const sourcePath = path.join(DATA_DIRECTORY, sourceName);
  const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  const halakhot = Array.isArray(source.halakhot) ? source.halakhot : [];

  if (halakhot.length === 0) {
    throw new Error(`Aucun סעיף trouvé dans ${sourceName}`);
  }

  const firstHalakha = halakhot[0];
  const knowledge = {
    meta: {
      siman: simanNumber,
      siman_hebrew: SIMAN_HEBREW[simanNumber],
      title: firstHalakha.sujet_fr || firstHalakha.sujet,
      title_hebrew: firstHalakha.sujet_he || firstHalakha.sujet,
      source: sourceName,
      source_seifim: halakhot.length,
      knowledge_points: halakhot.length,
      version: "pilot-1.0",
      method: "direct source-grounded seif projection",
      learning_mode: "exposure_only",
      review_status: "pilot_needs_human_editorial_review",
      external_sources_used: false
    },
    knowledge_points: halakhot.map((halakha, index) => (
      buildKnowledgePoint(halakha, simanNumber, index)
    ))
  };

  const outputPath = path.join(DATA_DIRECTORY, `siman_${simanNumber}_knowledge.json`);
  fs.writeFileSync(outputPath, `${JSON.stringify(knowledge, null, 2)}\n`, "utf8");
  console.log(`Siman ${simanNumber}: ${knowledge.knowledge_points.length} KP générés`);
}
