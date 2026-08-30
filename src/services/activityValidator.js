/**
 * Validation centrale des activités issues du Knowledge JSON.
 *
 * Ce module ne complète jamais une donnée manquante. Un contexte conditionnel
 * peut uniquement être lu depuis l'activité ou depuis un champ explicite du KP.
 */

const hasText = (value) => typeof value === "string" && value.trim().length > 0;
const hasCorrectAnswer = (activity) => activity.correct_answer !== undefined
  && activity.correct_answer !== null;

export const getValidatedConditionContext = (activity, kp = null) => {
  if (hasText(activity?.conditions)) return activity.conditions;
  if (hasText(kp?.pedagogy?.conditions)) return kp.pedagogy.conditions;
  if (hasText(kp?.conditions)) return kp.conditions;
  return null;
};

export const getPracticalSituationAssessment = (activity) => {
  const hasOptionsProperty = activity?.options !== undefined && activity?.options !== null;

  if (!hasOptionsProperty || (Array.isArray(activity.options) && activity.options.length === 0)) {
    if (hasCorrectAnswer(activity)) {
      return {
        mode: "INVALID",
        reason: "correct_answer fourni sans au moins 2 options (practical_situation)"
      };
    }

    if (!hasText(activity?.answer)) {
      return { mode: "INVALID", reason: "Answer manquante (practical_situation reflective)" };
    }

    return { mode: "REFLECTIVE" };
  }

  if (!Array.isArray(activity.options)) {
    return { mode: "INVALID", reason: "Options invalides (practical_situation)" };
  }

  if (activity.options.length < 2) {
    return { mode: "INVALID", reason: "Moins de 2 options fournies (practical_situation)" };
  }

  if (!hasCorrectAnswer(activity)) {
    return { mode: "INVALID", reason: "correct_answer manquant (practical_situation)" };
  }

  if (!activity.options.includes(activity.correct_answer)) {
    return {
      mode: "INVALID",
      reason: "correct_answer ne correspond à aucune option (practical_situation)"
    };
  }

  return { mode: "OBJECTIVE" };
};

export const validateActivity = (activity, kp = null) => {
  if (!activity) return { isValid: false, reason: "Activité null ou undefined" };
  if (!activity.activity_id) return { isValid: false, reason: "activity_id manquant" };
  if (!activity.knowledge_point_id) return { isValid: false, reason: "knowledge_point_id manquant" };
  if (!activity.source_seif) return { isValid: false, reason: "source_seif manquant" };
  if (!activity.type) return { isValid: false, reason: "type manquant" };

  if (kp?.id && activity.knowledge_point_id !== kp.id) {
    return { isValid: false, reason: "knowledge_point_id ne correspond pas au KP parent" };
  }

  if (activity.validated !== true) {
    return { isValid: false, reason: "L'activité n'est pas marquée comme validée (validated !== true)" };
  }

  switch (activity.type) {
    case "multiple_choice":
      if (!hasText(activity.question)) {
        return { isValid: false, reason: "Question manquante (multiple_choice)" };
      }
      if (!Array.isArray(activity.options)) {
        return { isValid: false, reason: "Options manquantes ou invalides (multiple_choice)" };
      }
      if (activity.options.length < 2) {
        return { isValid: false, reason: "Moins de 2 options fournies (multiple_choice)" };
      }
      if (!hasCorrectAnswer(activity)) {
        return { isValid: false, reason: "correct_answer manquant (multiple_choice)" };
      }
      if (!activity.options.includes(activity.correct_answer)) {
        return {
          isValid: false,
          reason: "correct_answer ne correspond à aucune option (multiple_choice)"
        };
      }
      break;

    case "flashcard":
      if (!hasText(activity.question) && !hasText(activity.title)) {
        return { isValid: false, reason: "Question ou title manquant (flashcard)" };
      }
      if (!hasText(activity.answer)) {
        return { isValid: false, reason: "Answer manquante (flashcard)" };
      }
      break;

    case "true_false":
      if (!hasText(activity.statement)) {
        return { isValid: false, reason: "Statement manquant (true_false)" };
      }
      if (typeof activity.is_true !== "boolean") {
        return { isValid: false, reason: "is_true manquant ou non booléen (true_false)" };
      }
      break;

    case "practical_situation": {
      if (!hasText(activity.situation)) {
        return { isValid: false, reason: "Situation manquante (practical_situation)" };
      }
      if (!hasText(activity.question)) {
        return { isValid: false, reason: "Question manquante (practical_situation)" };
      }

      const assessment = getPracticalSituationAssessment(activity);
      if (assessment.mode === "INVALID") {
        return { isValid: false, reason: assessment.reason };
      }
      break;
    }

    default:
      return { isValid: false, reason: `Type d'activité inconnu: ${activity.type}` };
  }

  if (kp?.halakha_status === "conditional" && !getValidatedConditionContext(activity, kp)) {
    return { isValid: false, reason: "Activité conditionnelle sans texte de condition fourni" };
  }

  return { isValid: true };
};

export const isObjectivelyAssessable = (activity) => {
  if (!activity) return false;
  const type = activity.rawType || activity.type;

  switch (type) {
    case "multiple_choice":
      return Array.isArray(activity.options)
        && activity.options.length >= 2
        && hasCorrectAnswer(activity)
        && activity.options.includes(activity.correct_answer);
    case "true_false":
      return typeof activity.is_true === "boolean";
    case "practical_situation":
      return getPracticalSituationAssessment(activity).mode === "OBJECTIVE";
    default:
      return false;
  }
};

export const getActivityAssessmentMode = (activity) => {
  if (!activity) return "INVALID";
  const type = activity.rawType || activity.type;

  if (type === "flashcard" || type === "card") return "REFLECTIVE";
  if (type === "practical_situation") return getPracticalSituationAssessment(activity).mode;
  if (type === "multiple_choice" || type === "true_false") {
    return isObjectivelyAssessable(activity) ? "OBJECTIVE" : "INVALID";
  }
  return "INVALID";
};
