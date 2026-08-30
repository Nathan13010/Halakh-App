import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  getActivityAssessmentMode,
  getValidatedConditionContext,
  isObjectivelyAssessable,
  validateActivity
} from "../../src/services/activityValidator.js";
import { getActivitiesForKp } from "../../src/services/knowledgeService.js";
import { LEARNING_SIMANS } from "../../src/data/learningSimans.js";
import { baseActivity, makeKp } from "./helpers.js";

test("les quatre types valides sont acceptés", () => {
  const kp = makeKp("kp-1", {});
  for (const type of ["flashcard", "multiple_choice", "true_false", "practical_situation"]) {
    assert.equal(validateActivity(baseActivity(type, "kp-1"), kp).isValid, true, type);
  }
});

test("QCM et V/F sont OBJECTIVE; Flashcard et Situation ouverte sont REFLECTIVE", () => {
  assert.equal(getActivityAssessmentMode(baseActivity("multiple_choice", "kp-1")), "OBJECTIVE");
  assert.equal(getActivityAssessmentMode(baseActivity("true_false", "kp-1")), "OBJECTIVE");
  assert.equal(getActivityAssessmentMode(baseActivity("flashcard", "kp-1")), "REFLECTIVE");
  assert.equal(getActivityAssessmentMode(baseActivity("practical_situation", "kp-1")), "REFLECTIVE");
});

test("une Situation objective exige 2 options et une réponse exactement présente", () => {
  const valid = {
    ...baseActivity("practical_situation", "kp-1"),
    options: ["A", "B"],
    correct_answer: "B"
  };
  assert.equal(validateActivity(valid).isValid, true);
  assert.equal(isObjectivelyAssessable(valid), true);

  const oneOption = { ...valid, options: ["B"] };
  assert.match(validateActivity(oneOption).reason, /Moins de 2 options/);

  const mismatched = { ...valid, correct_answer: "C" };
  assert.match(validateActivity(mismatched).reason, /aucune option/);

  const ambiguous = {
    ...baseActivity("practical_situation", "kp-1"),
    correct_answer: "B"
  };
  assert.match(validateActivity(ambiguous).reason, /sans au moins 2 options/);
});

test("conditional accepte uniquement un contexte explicite sans transformation", () => {
  const kp = makeKp("kp-1", {}, { halakha_status: "conditional" });
  const activity = baseActivity("multiple_choice", "kp-1");
  const rejected = validateActivity(activity, kp);
  assert.equal(rejected.isValid, false);
  assert.match(rejected.reason, /sans texte de condition/);

  const exactContext = "Contexte validé existant";
  const explicitActivity = { ...activity, conditions: exactContext };
  assert.equal(validateActivity(explicitActivity, kp).isValid, true);
  assert.equal(getValidatedConditionContext(explicitActivity, kp), exactContext);

  const kpContext = makeKp("kp-1", {}, {
    halakha_status: "conditional",
    pedagogy: { conditions: exactContext, activities: {} }
  });
  assert.equal(validateActivity(activity, kpContext).isValid, true);
  assert.equal(getValidatedConditionContext(activity, kpContext), exactContext);
});

test("multiple_opinions est conservé sans mutation du texte", () => {
  const kp = makeKp("kp-1", {}, { halakha_status: "multiple_opinions" });
  const activity = baseActivity("true_false", "kp-1");
  const original = structuredClone(activity);
  assert.equal(validateActivity(activity, kp).isValid, true);
  assert.deepEqual(activity, original);
});

test("les IDs et la traçabilité sont obligatoires et cohérents", () => {
  const kp = makeKp("kp-parent", {});
  const mismatch = baseActivity("flashcard", "kp-other");
  assert.match(validateActivity(mismatch, kp).reason, /KP parent/);

  const noSource = { ...baseActivity("flashcard", "kp-parent"), source_seif: "" };
  assert.match(validateActivity(noSource, kp).reason, /source_seif/);
});

for (const config of Object.values(LEARNING_SIMANS)) {
  test(`${config.id}: le Knowledge JSON respecte son contrat de contenu`, () => {
    const relativePath = config.knowledgePath.replace(/^\//, "");
    const url = new URL(`../../public/${relativePath}`, import.meta.url);
    const data = JSON.parse(readFileSync(url, "utf8"));
    const results = data.knowledge_points.flatMap((kp) => getActivitiesForKp(kp)
      .map((activity) => ({ kp, activity, validation: validateActivity(activity, kp) })));
    const accepted = results.filter((result) => result.validation.isValid);
    const rejected = results.filter((result) => !result.validation.isValid);

    assert.equal(data.meta?.siman, config.simanNumber);
    assert.equal(results.length, config.contentContract.totalActivities);
    assert.equal(accepted.length, config.contentContract.acceptedActivities);
    assert.equal(rejected.length, config.contentContract.rejectedActivities);
    assert.ok(rejected.every(
      (result) => result.validation.reason === config.contentContract.allowedRejectionReason
    ));

    if (config.contentContract.pilotScope === "source_exposure_only") {
      const sourcePath = config.sourcePath.replace(/^\//, "");
      const sourceUrl = new URL(`../../public/${sourcePath}`, import.meta.url);
      const source = JSON.parse(readFileSync(sourceUrl, "utf8"));

      assert.equal(data.meta.review_status, "pilot_needs_human_editorial_review");
      assert.equal(data.meta.learning_mode, "exposure_only");
      assert.equal(data.knowledge_points.length, source.halakhot.length);

      data.knowledge_points.forEach((kp, index) => {
        const sourceHalakha = source.halakhot[index];
        const activityTypes = Object.keys(kp.pedagogy.activities);
        const flashcard = kp.pedagogy.activities.flashcard;

        assert.deepEqual(activityTypes, ["flashcard"]);
        assert.equal(kp.rule, sourceHalakha.texte_integral.francais);
        assert.equal(kp.title, sourceHalakha.titre_seif);
        assert.equal(kp.pedagogy.human_review_required, true);
        assert.equal(kp.pedagogy.pilot_scope, "source_exposure_only");
        assert.equal(flashcard.answer, sourceHalakha.texte_integral.francais);
        assert.equal(flashcard.source_seif, String(sourceHalakha.seif));
        assert.equal(flashcard.validation_scope, "exact_source_projection");
      });
    }
  });
}
