import { getLearningQuizOverride } from "./learningQuizContent.js";
import { getSiman1LearningRewrite } from "./siman1LearningRewrite.js";

const CONTENT_OVERRIDES = Object.freeze({
  "s1-kp-004": Object.freeze({
    coreText: "Au réveil, on essaie de dépasser l'envie de rester au lit afin de commencer la journée avec courage et de se tourner vers Dieu.",
    explanation: "La force dont il est question n'est pas une force physique. C'est le courage intérieur qui aide à ne pas laisser la fatigue ou la paresse décider à notre place.",
    quizPrompt: "Que signifie « se lever avec force » au réveil ?",
    quizAnswer: "Vaincre la paresse pour commencer la journée avec entrain.",
    quizOptions: [
      "Remercier Dieu avec la prière du Modé Ani.",
      "Vaincre la paresse pour commencer la journée avec entrain.",
      "S'asseoir quelques instants sur le lit avant de se lever."
    ]
  }),
  "s1-kp-016": Object.freeze({
    coreText: "Au réveil, on prend quelques instants avant de se mettre debout, par exemple en s'asseyant d'abord sur le lit.",
    explanation: "Être motivé ne signifie pas se lever brutalement. On peut commencer la journée avec énergie tout en respectant son corps.",
    quizAnswer: "S'asseoir quelques instants avant de se lever.",
    quizTrueFalse: Object.freeze({
      statement: "Il faut s'asseoir quelques instants sur le lit pour éviter de se lever trop brusquement.",
      answer: "Vrai"
    })
  }),
  "s1-kp-018": Object.freeze({
    coreText: "Dès le réveil, on remercie Dieu avec la courte prière Modé Ani. Un garçon dit « Modé Ani » et une fille dit « Moda Ani ».",
    explanation: "Texte : « Modé ani lefanékha, Mélekh 'haï vékayam, chéhékhézarta bi nichmati bé'hèmla, raba émounatékha. »\n\nTraduction : « Je Te remercie, Roi vivant et éternel, d'avoir réintégré en moi mon âme avec bienveillance ; grande est Ta fidélité. »\n\nLe Modé Ani est la première prière prononcée au réveil. Elle remercie Dieu de nous avoir restitué notre âme et rendu la vie après le sommeil, comparé à une petite mort. La journée commence ainsi par la gratitude et la reconnaissance.",
    quizPrompt: "Quel est le rôle de la prière Modé Ani dès le réveil ?",
    quizAnswer: "Remercier Dieu pour le retour de notre âme.",
    quizOptions: [
      "Dépasser la fatigue et sauter du lit avec courage.",
      "Prendre le temps de s'asseoir avant de se lever.",
      "Remercier Dieu pour le retour de notre âme."
    ]
  }),
  "s1-kp-019": Object.freeze({
    coreText: "On peut dire Modé Ani immédiatement au réveil, avant même de procéder au lavage rituel des mains appelé Nétilat Yadaïm.",
    explanation: "Cette courte prière ne contient pas l'un des noms sacrés de Dieu. Elle peut donc être récitée dès l'ouverture des yeux.",
    quizAnswer: "Dire Modé Ani dès le réveil, avant le lavage des mains.",
    quizTrueFalse: Object.freeze({
      statement: "Il faut attendre Nétilat Yadaïm avant de dire Modé Ani.",
      answer: "Faux"
    })
  }),
  "s1-kp-020": Object.freeze({
    coreText: "Les premières pensées, paroles et actions du matin donnent une direction à toute la journée. On essaie donc de les orienter vers le bien et vers Dieu.",
    explanation: "Il ne s'agit pas de tout réussir immédiatement. L'idée est de commencer par une intention positive, même avec une action très simple.",
    quizPrompt: "Pourquoi soigner ses premières pensées et actions du matin ?",
    quizAnswer: "Pour orienter toute la journée vers le bien et vers Dieu."
  }),
  "s1-kp-021": Object.freeze({
    coreText: "Lorsqu'un enfant commence à parler, on peut progressivement lui apprendre à dire Modé Ani et à se laver les mains au réveil.",
    explanation: "L'apprentissage se fait avec douceur, en répétant de petites habitudes adaptées à l'âge de l'enfant.",
    quizPrompt: "Comment initier un jeune enfant aux habitudes du réveil ?",
    quizAnswer: "Lui apprendre progressivement Modé Ani et le lavage des mains."
  }),
  "s1-kp-008": Object.freeze({
    coreText: "On essaie de se lever assez tôt pour avoir le temps de se préparer calmement et de prier sans dépasser l'horaire prévu.",
    explanation: "Se préparer à l'avance permet d'éviter la précipitation et de commencer la prière dans de bonnes conditions.",
    quizPrompt: "Pourquoi est-il conseillé de se lever bien avant le début de la prière ?",
    quizAnswer: "Pour se préparer avec calme et avoir une meilleure concentration (Kavana).",
    quizOptions: [
      "Pour pouvoir réciter la prière deux fois de suite.",
      "Pour se préparer avec calme et avoir une meilleure concentration (Kavana).",
      "Pour éviter de faire ses ablutions matinales."
    ]
  }),
  "s1-kp-005": Object.freeze({
    coreText: "Le Chema et la prière du matin doivent être récités pendant des horaires précis. Il faut donc organiser son réveil pour ne pas les dépasser.",
    explanation: "Le judaïsme relie certaines prières à des moments de la journée. Les horaires exacts dépendent du lieu et de la date.",
    quizPrompt: "Pourquoi doit-on calculer son heure de réveil le matin ?",
    quizAnswer: "Pour accomplir la prière et le Chema avant leur heure limite.",
    quizOptions: [
      "Pour accomplir la prière et le Chema avant leur heure limite.",
      "Pour faire une longue pause avant de commencer la journée.",
      "Pour vérifier la météo du jour."
    ]
  }),
  "s1-kp-006": Object.freeze({
    coreText: "La Zrizout consiste à s'organiser pour agir avec empressement au bon moment. Courir parce que l'on s'est levé trop tard n'est pas cette qualité.",
    explanation: "La Zrizout n'est pas la précipitation. Elle consiste à anticiper, se préparer et accomplir une bonne action sans la repousser.",
    quizAnswer: "La Zrizout, c'est anticiper une Mitsva par amour, pas paniquer à cause d'un retard.",
    quizTrueFalse: Object.freeze({
      statement: "Courir dans tous les sens parce qu'on est en retard est une preuve de Zrizout (empressement).",
      answer: "Faux"
    })
  }),
  "s1-kp-007": Object.freeze({
    coreText: "Le sommeil et le confort sont nécessaires, mais ils ne doivent pas faire oublier l'étude, la prière et les bonnes actions.",
    explanation: "L'objectif est de rechercher un équilibre : prendre soin de son corps tout en gardant du temps et de l'énergie pour sa vie spirituelle."
  }),
  "s1-kp-009": Object.freeze({
    title: "Trouver une durée de sommeil équilibrée",
    coreText: "Le texte rapporte une recommandation de six à huit heures de sommeil par nuit.",
    explanation: "Cette durée est une indication rapportée par le texte, pas un conseil médical personnalisé. Les besoins peuvent varier selon l'âge, la santé et la situation de chacun."
  }),
  "s1-kp-010": Object.freeze({
    title: "Donner aussi une place à l'étude le soir",
    coreText: "L'étude de la Torah peut aussi avoir une place importante pendant la soirée et la nuit.",
    explanation: "Il ne s'agit pas de négliger sa santé. L'idée est de ne pas réserver tous ses moments disponibles au sommeil ou aux distractions, et de garder un temps calme pour apprendre."
  }),
  "s1-kp-011": Object.freeze({
    title: "Éviter de perdre sa journée dans le sommeil",
    coreText: "On évite de dormir longtemps pendant la journée lorsque cela prend la place du temps prévu pour étudier.",
    explanation: "Cette règle invite à protéger son temps. Elle ne signifie pas qu'une courte sieste ou un repos nécessaire à la santé serait toujours interdit."
  }),
  "s1-kp-012": Object.freeze({
    title: "Quand une sieste peut être utile",
    coreText: "Dormir un peu dans la journée peut être permis lorsque ce repos aide à étudier ensuite, ainsi que pendant Chabbat.",
    explanation: "Le repos n'est donc pas présenté comme mauvais en lui-même. Ce qui compte est son but, sa durée et la manière dont il aide la personne à mieux vivre sa journée."
  }),
  "s1-kp-013": Object.freeze({
    title: "Le repos de la fin de nuit",
    coreText: "Le texte considère le sommeil pris en fin de nuit, près de l'aube, comme particulièrement reposant pour le corps.",
    explanation: "Il s'agit d'une indication rapportée dans la loi source. Elle ne remplace pas l'attention portée à sa santé ni un avis médical lorsque celui-ci est nécessaire."
  })
});

const JARGON_REPLACEMENTS = Object.freeze([
  [/\bLe Seif précise également\b/gi, "Il est également précisé"],
  [/\bLe Seif précise\b/gi, "Il est précisé"],
  [/\bLe Seif présente\b/gi, "Cette règle présente"],
  [/\bLe Seif souligne\b/gi, "Cette règle souligne"],
  [/\bLe Seif rapporte également que\b/gi, "La règle indique également que"],
  [/\bLe Seif rapporte que\b/gi, "La règle indique que"],
  [/\bLe Seif rapporte\b/gi, "La règle indique"],
  [/\bLe Seif recommande\b/gi, "Il est recommandé"],
  [/\bLe Seif permet\b/gi, "Dans cette situation, il est permis"],
  [/\bLe Seif traite également de\b/gi, "Cette partie explique également"],
  [/\bLe Seif traite de\b/gi, "Cette partie explique"],
  [/\bLe Seif cite\b/gi, "Le texte mentionne"],
  [/\bd'après le Seif\b/gi, "d'après cette règle"],
  [/\bselon le Seif\b/gi, "selon cette règle"],
  [/\bdu Seif\b/gi, "de cette règle"],
  [/\bdans le Seif\b/gi, "dans cette règle"],
  [/\bce Seif\b/gi, "cette règle"],
  [/\bles Seifim\b/gi, "les paragraphes"],
  [/\ble Seif\b/gi, "la règle"],
  [/סעיפים/g, "paragraphes"],
  [/סעיף/g, "paragraphe"]
]);

export const removeLearningJargon = (value) => {
  let text = String(value || "");
  JARGON_REPLACEMENTS.forEach(([pattern, replacement]) => {
    text = text.replace(pattern, replacement);
  });
  return text.replace(/\s+/g, " ").trim();
};

const fallbackExplanation = (coreText) => {
  const normalized = coreText.toLocaleLowerCase("fr");

  if (/\bil est interdit\b|\bne (?:doit|faut|fera|marchera|récitera) pas\b/.test(normalized)) {
    return "Cette règle indique un comportement à éviter. La référence complète permet de comprendre les raisons, les limites et les éventuelles exceptions.";
  }
  if (/\bil est permis\b|\bpeut\b|\bautorisé/.test(normalized)) {
    return "Cette possibilité dépend du contexte décrit. La référence complète aide à vérifier les conditions et les cas particuliers avant de l'appliquer.";
  }
  if (/\bil faut\b|\bon veillera\b|\bon essaie\b|\bil convient\b/.test(normalized)) {
    return "En pratique, on avance progressivement vers ce comportement. La référence complète contient les précisions et les situations particulières.";
  }
  return "Cette phrase donne l'idée principale à retenir. La référence complète est disponible pour approfondir les détails et les cas particuliers.";
};

export const getBeginnerLearningContent = (kp, sourceText) => {
  const override = CONTENT_OVERRIDES[kp?.id];
  const quizOverride = getLearningQuizOverride(kp?.id) || {};
  const simanRewrite = getSiman1LearningRewrite(kp?.id) || {};
  if (override) return { ...quizOverride, ...simanRewrite, ...override };

  const simpleText = removeLearningJargon(kp?.pedagogy?.simple_explanation || sourceText);
  const explanation = removeLearningJargon(kp?.explanation);
  return {
    ...quizOverride,
    ...simanRewrite,
    coreText: simpleText,
    explanation: simanRewrite.explanation || explanation || fallbackExplanation(simpleText)
  };
};
