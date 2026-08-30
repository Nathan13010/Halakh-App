/**
 * @deprecated LEGACY EN QUARANTAINE — ne pas importer dans le Learning Core.
 * Ces données historiques ne sont pas une source pédagogique validée. Le chemin
 * actif doit uniquement lire les activités des Knowledge JSON via knowledgeService.
 */

export const BADGES = [
  {
    id: "lion-juda",
    title: "Lion de Juda",
    description: "A complété le premier Seïf du Siman 1 (Audace et force dans le service de D.ieu).",
    icon: "🦁",
    unlockedAtXp: 15
  },
  {
    id: "reveil-matin",
    title: "Maître du Réveil",
    description: "A complété l'ensemble du Niveau 1 sur les lois du réveil (Siman 1, Seifim 1-5).",
    icon: "⚡",
    unlockedAtXp: 60
  },
  {
    id: "erudit-debutant",
    title: "Érudit Débutant",
    description: "A accumulé 100 XP dans l'application.",
    icon: "🏆",
    unlockedAtXp: 100
  },
  {
    id: "flamme-torah",
    title: "Flamme de la Halakha",
    description: "A maintenu une régularité d'étude dynamique.",
    icon: "🔥",
    unlockedAtXp: 150
  }
];

export const LEARNING_LEVELS = [
  {
    id: "siman-1-base",
    siman: "1",
    seifRange: "1 - 5",
    title: "Bases du Réveil Matinal",
    subtitle: "Siman 1 (Seifim 1 à 5)",
    icon: "lion",
    totalLessons: 4,
    xpReward: 60,
    color: "from-amber-500 to-yellow-600",
    description: "Apprends à vaincre l'hésitation au réveil, agir avec la force du lion et canaliser ton énergie dès l'aube."
  },
  {
    id: "siman-2-habillage",
    siman: "2",
    seifRange: "1 - 28",
    title: "Pudeur & Habillage",
    subtitle: "Siman 2",
    icon: "shirt",
    totalLessons: 3,
    xpReward: 50,
    color: "from-emerald-500 to-teal-600",
    isLocked: true,
    description: "Règles de pudeur, ordre d'enfilage des vêtements et priorité au côté droit."
  },
  {
    id: "siman-3-hygiene",
    siman: "3",
    seifRange: "1 - 25",
    title: "Conduite aux Toilettes",
    subtitle: "Siman 3",
    icon: "droplet",
    totalLessons: 3,
    xpReward: 50,
    color: "from-blue-500 to-indigo-600",
    isLocked: true,
    description: "Propreté, respect des paroles saintes et règles d'hygiène halakhique."
  },
  {
    id: "siman-4-netilat",
    siman: "4",
    seifRange: "1 - 100",
    title: "L'Ablution des Mains",
    subtitle: "Siman 4 (Netilat Yadaïm)",
    icon: "sparkles",
    totalLessons: 5,
    xpReward: 100,
    color: "from-cyan-500 to-blue-600",
    isLocked: true,
    description: "L'ablution matinale des mains, son ordre et ses motifs spirituels."
  },
  {
    id: "siman-6-asher-yatsar",
    siman: "6",
    seifRange: "1 - 18",
    title: "Asher Yatsar & Elohaï Neshaman",
    subtitle: "Siman 6",
    icon: "heart",
    totalLessons: 4,
    xpReward: 80,
    color: "from-purple-500 to-violet-600",
    isLocked: true,
    description: "La bénédiction de gratitude pour la santé du corps et le retour de l'âme."
  }
];

// Interactive Quizzes for Level 1 (Siman 1 - Seifim 1 to 5)
export const LEVEL_1_QUIZZES = [
  {
    lessonId: 1,
    seif: "1",
    title: "Leçon 1 : L'Audace du Léopard et la Force du Lion (Seïf 1)",
    questions: [
      {
        id: "q1_1",
        type: "scenario",
        imageUrl: "/images/learning/morning_wake_up.jpg",
        scenario: "Au réveil, tu te sens fatigué et le mauvais penchant tente de te persuader de rester au lit sous la couette. Que nous enseigne Rabbi Yehouda ben Téima dans le traité Avot citée par le Yalkout Yossef ?",
        options: [
          "Dormir jusqu'à ce que la fatigue disparaisse complètement.",
          "Être audacieux comme le léopard et fort comme le lion pour se lever immédiatement au service du Créateur.",
          "Attendre l'heure de midi pour prier au calme.",
          "Ignorer la prière si le corps est fatigué."
        ],
        correctIndex: 1,
        explanation: "Le Seïf 1 enseigne qu'il faut se renforcer comme un lion et être audacieux comme le léopard pour vaincre son penchant matinal et se lever rapidement devant D.ieu.",
        xp: 15
      },
      {
        id: "q1_2",
        type: "match",
        imageUrl: "/images/learning/storybook_zrizout.jpg",
        question: "Associe le verbe hébreu conjugué à sa forme infinitive exacte :",
        hebrewWord: "הֱוֵי (Sois)",
        options: [
          "לִהְיוֹת (Être)",
          "לִשְׁמֹעַ (Écouter)",
          "לָרוּץ (Courir)",
          "לַעֲשׂוֹת (Faire)"
        ],
        correctIndex: 0,
        explanation: "הֱוֵי provient de la racine du verbe לִהְיוֹת (Être). En hébreu, הֱוֵי עַז כַּנָּמֵר signifie 'Sois audacieux comme le léopard'.",
        xp: 10
      },
      {
        id: "q1_3",
        type: "true_false",
        imageUrl: "/images/learning/vector_courage.jpg",
        scenario: "Vrai ou Faux ? Face à ceux qui se moquent de notre pratique des Mitsvot au réveil, nous devons nous sentir intimidés et abandonner nos prières.",
        options: [
          "Vrai, il faut éviter toute tension sociale.",
          "Faux ! Le Seïf 1 exige d'être audacieux comme le léopard et ne jamais avoir honte devant les moqueurs."
        ],
        correctIndex: 1,
        explanation: "Le Seïf 1 stipule clairement que l'audace (עַז כַּנָּמֵר) sert précisément à ne pas se sentir gêné ni intimidé par les moqueries d'autrui lors de l'accomplissement des Mitsvot.",
        xp: 15
      }
    ]
  },
  {
    lessonId: 2,
    seif: "2",
    title: "Leçon 2 : L'Empressement au Réveil - Zrizout (Seïf 2)",
    questions: [
      {
        id: "q2_1",
        type: "scenario",
        scenario: "Dès que tu ouvres les yeux le matin, quelle doit être ton attitude naturelle et habituelle selon le Seïf 2 du Yalkout Yossef ?",
        options: [
          "Consulter son téléphone pendant 30 minutes au lit.",
          "Se lever immédiatement avec empressement (Zrizout) pour servir le Créateur béni soit-Il.",
          "Prendre un long petit-déjeuner avant toute ablution.",
          "Rester immobile en méditant sans bouger."
        ],
        correctIndex: 1,
        explanation: "Le Seïf 2 explique que l'homme doit prendre l'habitude constante de se lever avec entrain dès le réveil afin d'aller servir D.ieu sans retard.",
        xp: 15
      },
      {
        id: "q2_2",
        type: "true_false",
        scenario: "Vrai ou Faux ? Si le mauvais penchant cherche à alourdir nos membres au réveil pour nous faire rater le temps de la prière, nous devons céder s'il fait froid dehors.",
        options: [
          "Vrai, la santé prime sur le réveil.",
          "Faux ! C'est précisément là que réside le combat spirituel : surmonter l'alourdissement du corps pour se réveiller avec joie."
        ],
        correctIndex: 1,
        explanation: "Le Yalkout Yossef souligne que surmonter la lourdeur du réveil est la première victoire de la journée contre le Yezer HaRa.",
        xp: 15
      }
    ]
  },
  {
    lessonId: 3,
    seif: "3 & 4",
    title: "Leçon 3 : L'Aube et la Sagesse du Sommeil (Seifim 3 & 4)",
    questions: [
      {
        id: "q3_1",
        type: "scenario",
        scenario: "Pourquoi est-il louable et recommandé de se lever tôt le matin avant le lever du jour (ou à l'aube) selon le Seïf 3 ?",
        options: [
          "Pour avoir le temps de préparer sa journée et de prier avec ferveur dès le début du jour.",
          "Uniquement pour travailler plus d'heures au bureau.",
          "C'est une obligation réservée exclusivement aux rabbins.",
          "Pour pouvoir dormir deux fois plus l'après-midi."
        ],
        correctIndex: 0,
        explanation: "Le Seïf 3 encourage à devancer l'aube afin de consacrer les moments purs du matin à l'étude et à la prière.",
        xp: 15
      },
      {
        id: "q3_2",
        type: "scenario",
        scenario: "Que dit le Seïf 4 concernant un sommeil trop prolongé et excessif ?",
        options: [
          "Le sommeil excessif est excellent pour la mémoire halakhique.",
          "L'homme ne doit pas croire qu'un sommeil excessif lui apporte un réel bienfait ; au contraire, cela engourdit l'esprit.",
          "Il est recommandé de dormir 12 heures chaque nuit.",
          "Le sommeil n'a aucune importance en Halakha."
        ],
        correctIndex: 1,
        explanation: "Le Seïf 4 enseigne que trop dormir engourdit l'esprit et prive l'homme de moments précieux pour sa croissance spirituelle.",
        xp: 15
      }
    ]
  },
  {
    lessonId: 4,
    seif: "5",
    title: "Leçon 4 : Le Sommeil Diurne & Bilan du Siman 1 (Seïf 5)",
    questions: [
      {
        id: "q4_1",
        type: "scenario",
        scenario: "Quelle est la recommandation du Seïf 5 concernant le fait de dormir pendant la journée ?",
        options: [
          "Il est recommandé de dormir tout l'après-midi.",
          "Il est convenable de ne pas s'adonner à un sommeil prolongé le jour (sauf une courte sieste réparatrice si nécessaire).",
          "Il est strictement interdit de fermer les yeux plus de 60 secondes le jour.",
          "Le sommeil de jour est supérieur au sommeil de nuit."
        ],
        correctIndex: 1,
        explanation: "Le Seïf 5 conseille de ne pas perdre son temps en somnolences diurnes excessives, tout en autorisant un repos bref si le corps en a besoin.",
        xp: 15
      },
      {
        id: "q4_2",
        type: "match",
        question: "Associe l'infinitive du verbe 'לִזְכֹּר' (Se rappeler) :",
        hebrewWord: "יִזְכֹּר (Il se rappellera)",
        options: [
          "לִזְכֹּר = Se rappeler / Se souvenir",
          "לִשְׁכֹּחַ = Oublier",
          "לָדַעַת = Savoir",
          "לִלְמֹד = Apprendre"
        ],
        correctIndex: 0,
        explanation: "יִזְכֹּר provient de la racine לִזְכֹּר (Se rappeler / Se souvenir).",
        xp: 10
      }
    ]
  }
];
