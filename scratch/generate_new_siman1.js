import fs from 'fs';

const newData = [
  // Leçon 1
  {
    title: "Trouver sa motivation du matin",
    text: "Le matin, il est normal d'avoir envie de rester au lit ! Quand le judaïsme nous invite à \"se lever avec force\", il ne parle pas de force physique. C'est simplement trouver ce petit courage intérieur pour commencer la journée avec entrain et une pensée pour Hachem (Dieu).",
    quizEyebrow: "Mise en situation",
    quizPrompt: "Le réveil sonne. Il fait froid en dehors du lit. Quelle est la meilleure approche ?",
    quizOptions: [
      "Je trouve une petite motivation intérieure pour me lever avec entrain.",
      "Je saute du lit le plus brutalement possible pour réveiller mon corps."
    ],
    quizAnswer: "Je trouve une petite motivation intérieure pour me lever avec entrain."
  },
  {
    title: "Prendre son temps",
    text: "Être motivé ne veut pas dire se lever en sursaut. Au contraire, le réveil doit se faire en douceur. Prenez un instant pour vous asseoir sur votre lit avant de vous mettre debout. Respecter son corps, c'est la première étape d'une belle journée.",
    quizEyebrow: "Phrase à trou",
    quizPrompt: "Pour ne pas brusquer mon corps au réveil, je prends le temps de ________ quelques instants sur mon lit.",
    quizOptions: [
      "M'asseoir.",
      "Faire des pompes."
    ],
    quizAnswer: "M'asseoir."
  },
  {
    title: "Le tout premier mot : Merci (Le Modé Ani)",
    text: "Dès l'ouverture des yeux, on récite une très courte prière de gratitude : le Modé Ani (ou Moda Ani pour une fille).\n🗣️ Phonétique : \"Modé (Moda) ani lefanékha, Mélekh 'haï vékayam, chéhékhézarta bi nichmati bé'hèmla, raba émounatékha.\"\n🇫🇷 Traduction : \"Je Te remercie, Roi vivant et éternel, de m'avoir rendu mon âme avec bienveillance ; grande est Ta fidélité.\"\nC'est une merveilleuse façon de remercier Dieu pour le cadeau de la vie chaque matin.",
    quizEyebrow: "Le sens des mots",
    quizPrompt: "Que signifie la prière du \"Modé Ani\" que l'on prononce au réveil ?",
    quizOptions: [
      "C'est un grand \"Merci\" à Dieu de nous avoir rendu la vie ce matin.",
      "C'est une prière pour demander à Dieu de gagner beaucoup d'argent."
    ],
    quizAnswer: "C'est un grand \"Merci\" à Dieu de nous avoir rendu la vie ce matin."
  },
  // Leçon 2
  {
    title: "Pas besoin d'attendre pour dire Merci",
    text: "Le Modé Ani est une prière tellement simple qu'elle ne contient aucun nom sacré de Dieu. La bonne nouvelle ? Vous pouvez la réciter directement dans votre lit, avant même de vous lever pour aller faire le lavage rituel des mains (qu'on appelle Nétilat Yadaïm).",
    quizEyebrow: "L'ordre logique",
    quizPrompt: "Je viens d'ouvrir les yeux. Que puis-je faire en tout premier depuis mon lit ?",
    quizOptions: [
      "Réciter la courte prière du Modé Ani.",
      "Aller faire mon lavage rituel des mains (Nétilat Yadaïm)."
    ],
    quizAnswer: "Réciter la courte prière du Modé Ani."
  },
  {
    title: "Orienter sa journée vers le positif",
    text: "Nos premières pensées agissent comme une boussole. Pour bien démarrer, on essaie d'orienter ses premières pensées vers le bien. Exemple de pensée : \"Hachem, aide-moi à être patient aujourd'hui avec mes proches\" ou \"Merci pour la santé de ma famille.\" Il s'agit juste de donner une belle intention à sa journée.",
    quizEyebrow: "Le conseil pratique",
    quizPrompt: "Comment donner une direction positive à ma journée dès le matin ?",
    quizOptions: [
      "En ayant une intention simple, comme demander à Dieu de m'aider à être patient.",
      "En essayant de lire un livre entier de prières avant de sortir du lit."
    ],
    quizAnswer: "En ayant une intention simple, comme demander à Dieu de m'aider à être patient."
  },
  {
    title: "Transmettre en douceur aux enfants",
    text: "Les enfants apprennent par l'exemple. Dès qu'un enfant sait parler, on peut lui apprendre avec beaucoup de patience à dire Modé Ani ou à se laver les mains. L'important est d'en faire un moment joyeux et adapté à son âge, sans aucune pression de réussite.",
    quizEyebrow: "Scénario Éducation",
    quizPrompt: "Ton enfant de 3 ans commence à bien parler. Comment l'habituer aux gestes du matin ?",
    quizOptions: [
      "Avec douceur, en créant de petites habitudes joyeuses.",
      "En exigeant qu'il apprenne tout par cœur pour le lendemain."
    ],
    quizAnswer: "Avec douceur, en créant de petites habitudes joyeuses."
  },
  // Leçon 3
  {
    title: "Garder un œil sur l'horloge",
    text: "Dans le judaïsme, le Chema Israël est l'une des prières les plus célèbres (elle proclame que Dieu est Un). Certaines prières, comme le Chema, ont une \"heure limite\" pour être lues le matin. L'idéal est donc d'organiser son heure de réveil pour ne pas rater ce moment !",
    quizEyebrow: "Devinette (Qui suis-je ?)",
    quizPrompt: "Je suis une prière très célèbre qui déclare que Dieu est Un, et j'ai une heure limite pour être récitée le matin. Qui suis-je ?",
    quizOptions: [
      "Le Chema.",
      "Le Modé Ani."
    ],
    quizAnswer: "Le Chema."
  },
  {
    title: "Se préparer sans courir",
    text: "Prendre le temps de se lever un peu en avance, c'est s'offrir le luxe du calme. Cela permet de se préparer tranquillement et d'être beaucoup plus concentré au moment de prier (cette belle concentration du cœur s'appelle la Kavana).",
    quizEyebrow: "Le choix Zen",
    quizPrompt: "Pourquoi est-il conseillé de se lever un peu avant le début de sa prière ?",
    quizOptions: [
      "Pour prendre son temps, s'apaiser et avoir une meilleure concentration (Kavana).",
      "Pour avoir le temps de vérifier ses emails avant de prier."
    ],
    quizAnswer: "Pour prendre son temps, s'apaiser et avoir une meilleure concentration (Kavana)."
  },
  {
    title: "La vraie énergie (\"Zrizout\")",
    text: "En hébreu, la Zrizout désigne l'élan pour faire une bonne action. Attention à ne pas s'y tromper : courir partout parce qu'on s'est levé en retard n'est pas de la Zrizout. La vraie Zrizout, c'est l'art d'anticiper pour agir à temps et sereinement.",
    quizEyebrow: "Vrai ou Faux (Bienveillant)",
    quizPrompt: "Courir dans tous les sens parce qu'on est en retard, c'est faire preuve d'un grand empressement spirituel (la Zrizout).",
    quizTrueFalse: {
      statement: "Courir dans tous les sens parce qu'on est en retard, c'est faire preuve d'un grand empressement spirituel (la Zrizout).",
      answer: "Faux"
    },
    quizExplanation: "L'empressement spirituel, c'est justement s'organiser pour agir avec calme."
  },
  // Leçon 4
  {
    title: "La spiritualité passe aussi par la santé",
    text: "Dans le judaïsme, le corps est un cadeau qu'il faut entretenir. Le sommeil et le confort sont nécessaires ! L'objectif est de trouver un équilibre : prendre soin de son corps en dormant suffisamment, pour avoir ensuite l'énergie de prier et de faire de bonnes actions.",
    quizEyebrow: "Le bon équilibre",
    quizPrompt: "Comment le judaïsme perçoit-il le sommeil ?",
    quizOptions: [
      "Comme un besoin naturel essentiel pour garder son corps en bonne santé.",
      "Comme une perte de temps : il faudrait dormir le moins possible."
    ],
    quizAnswer: "Comme un besoin naturel essentiel pour garder son corps en bonne santé."
  },
  {
    title: "Trouver son propre rythme",
    text: "Les textes anciens parlent souvent d'une moyenne de six à huit heures de sommeil par nuit. Mais attention, ce n'est pas une loi stricte ! Vos besoins varient selon votre âge, votre santé et votre travail. L'important est d'écouter son corps pour ne pas être épuisé la journée.",
    quizEyebrow: "Le sens des priorités",
    quizPrompt: "Combien d'heures dois-je dormir chaque nuit selon la loi juive ?",
    quizOptions: [
      "Ce qu'il me faut pour être en forme, en général entre 6 et 8 heures selon mes besoins.",
      "Exactement 4 heures, ni plus ni moins."
    ],
    quizAnswer: "Ce qu'il me faut pour être en forme, en général entre 6 et 8 heures selon mes besoins."
  },
  {
    title: "Éviter de perdre sa journée",
    text: "Le repos est excellent, mais il ne doit pas nous faire passer à côté de notre vie. Faire une sieste pour reprendre des forces est tout à fait permis (surtout le jour du Chabbat où c'est même conseillé !). Ce qu'on évite, c'est de dormir toute la journée par simple paresse.",
    quizEyebrow: "Conseil pratique",
    quizPrompt: "Je suis épuisé(e) l'après-midi, puis-je faire une petite sieste ?",
    quizOptions: [
      "Bien sûr, si cela m'aide à reprendre des forces pour le reste de la journée.",
      "Non, le judaïsme interdit de dormir pendant la journée."
    ],
    quizAnswer: "Bien sûr, si cela m'aide à reprendre des forces pour le reste de la journée."
  },
  // Leçon 5
  {
    title: "Ne jamais avoir honte",
    text: "Quand vous décidez de faire une bonne action ou une pratique religieuse (une Mitsva), soyez-en fier ! Si des personnes de votre entourage ne comprennent pas ou se moquent, ne laissez pas la honte vous arrêter. Votre force spirituelle, c'est de rester fidèle à vos valeurs.",
    quizEyebrow: "Mise en situation",
    quizPrompt: "Un collègue fait une blague sur ta nouvelle pratique religieuse. Que fais-tu ?",
    quizOptions: [
      "Je reste fidèle à ma pratique sans me disputer avec lui.",
      "Je l'insulte devant tout le monde pour défendre la religion."
    ],
    quizAnswer: "Je reste fidèle à ma pratique sans me disputer avec lui."
  },
  {
    title: "Rester fier, mais sans conflit",
    text: "Ne pas avoir honte ne veut pas dire chercher la bagarre ! Si quelqu'un se moque, la meilleure réaction est de l'ignorer poliment. On garde sa pratique, mais on évite les querelles, les insultes ou l'arrogance. La paix reste une priorité.",
    quizEyebrow: "Vrai ou Faux (Bienveillant)",
    quizPrompt: "Si quelqu'un critique ma religion, je dois lui crier dessus pour lui prouver qu'il a tort.",
    quizTrueFalse: {
      statement: "Si quelqu'un critique ma religion, je dois lui crier dessus pour lui prouver qu'il a tort.",
      answer: "Faux"
    },
    quizExplanation: "On reste fier de nos valeurs, mais on évite toujours les querelles inutiles."
  },
  {
    title: "La beauté de la discrétion",
    text: "Parfois, il vaut mieux dissimuler ses bonnes actions. Pourquoi ? Parce qu'une bonne action garde toute sa pureté quand elle est faite discrètement. Cela nous protège de l'orgueil (faire le bien juste pour être admiré) et évite de provoquer inutilement l'hostilité des autres.",
    quizEyebrow: "Le bon conseil",
    quizPrompt: "Pourquoi est-il souvent conseillé d'être discret quand on fait une bonne action ?",
    quizOptions: [
      "Pour rester humble et ne pas chercher à se vanter.",
      "Parce que c'est un secret qu'il ne faut jamais partager."
    ],
    quizAnswer: "Pour rester humble et ne pas chercher à se vanter."
  },
  // Leçon 6
  {
    title: "Penser à l'amour de Dieu",
    text: "Avant de commencer la prière du matin, on prend un instant pour penser à l'amour de Dieu (Hachem). Pourquoi ? Parce que cela aide à ne pas lire les mots de façon mécanique, comme un robot. C'est le moment de se connecter avec le cœur.",
    quizEyebrow: "Phrase à trou",
    quizPrompt: "Avant de prier, je pense à ________ de Dieu pour ne pas lire les mots comme un robot.",
    quizOptions: [
      "L'amour.",
      "La colère."
    ],
    quizAnswer: "L'amour."
  },
  {
    title: "Aimer son prochain",
    text: "Beaucoup ont l'habitude, juste avant de prier, de dire cette phrase : \"J'accepte sur moi le commandement d'aimer mon prochain comme moi-même\". C'est un rappel puissant : notre relation avec Dieu ne peut pas être séparée du respect et de l'amour que l'on porte aux autres êtres humains.",
    quizEyebrow: "La belle habitude",
    quizPrompt: "Quelle belle pensée est-il conseillé d'avoir juste avant de prier ?",
    quizOptions: [
      "\"J'accepte le commandement d'aimer mon prochain comme moi-même\".",
      "\"J'espère que mon voisin va rater son permis de conduire\"."
    ],
    quizAnswer: "\"J'accepte le commandement d'aimer mon prochain comme moi-même\"."
  },
  {
    title: "La qualité plutôt que la quantité",
    text: "Mieux vaut dire une seule petite prière en la comprenant et en y mettant tout son cœur, que de réciter 50 pages très vite en pensant à sa liste de courses ! Cette présence du cœur et cette attention s'appellent la Kavana.",
    quizEyebrow: "L'intention (La Kavana)",
    quizPrompt: "Qu'est-ce qui a le plus de valeur dans la prière selon le judaïsme ?",
    quizOptions: [
      "Dire peu de mots, mais avec attention et avec le cœur (Kavana).",
      "Lire le plus de pages possible le plus vite possible."
    ],
    quizAnswer: "Dire peu de mots, mais avec attention et avec le cœur (Kavana)."
  }
];

const knowledgePoints = newData.map((item, index) => {
  const kp = {
    id: `new-s1-kp-${String(index + 1).padStart(3, '0')}`,
    title: item.title,
    rule: item.text,
    sources: [{ siman: 1, seif: 1 }],
    pedagogy: {
      simple_explanation: item.text
    },
    quizEyebrow: item.quizEyebrow,
    quizPrompt: item.quizPrompt,
    quizExplanation: item.quizExplanation || undefined
  };

  if (item.quizTrueFalse) {
    kp.quizTrueFalse = item.quizTrueFalse;
  } else {
    kp.quizOptions = item.quizOptions;
    kp.quizAnswer = item.quizAnswer;
  }

  return kp;
});

const outputJson = {
  meta: {
    siman: 1,
    siman_hebrew: "א",
    title: "Le réveil et les prières du matin",
    title_hebrew: "הלכות הנהגת אדם בבוקר",
    source: "siman_1.json",
    knowledge_points: 18,
    version: "2.0",
    method: "novice-friendly rewrite"
  },
  knowledge_points: knowledgePoints
};

const jsonPath = '../public/data/הלכות הנהגת אדם בבוקר/siman_1_knowledge.json';
fs.writeFileSync(jsonPath, JSON.stringify(outputJson, null, 2), 'utf8');
console.log('siman_1_knowledge.json successfully generated!');
