import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, '..', 'public', 'data', 'הלכות הנהגת אדם בבוקר', 'siman_2_knowledge.json');

const rawData = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(rawData);

const lessons = [
  {
    sources: [1],
    notions: [
      {
        title: "S'habiller avec conscience",
        text: "Le judaïsme nous apprend que Dieu est partout, même dans l'intimité de notre chambre. C'est pourquoi, en s'habillant ou en se déshabillant, on garde une certaine pudeur (Tzniout en hébreu). On ne s'habille pas à la hâte ou n'importe comment, mais avec le respect que l'on doit à soi-même et à Celui qui nous regarde avec bienveillance.",
        quizEyebrow: "Mise en situation",
        quizPrompt: "Tu es en retard ce matin, tu attrapes le premier vêtement qui te tombe sous la main, il est taché. Que dit le judaïsme ?",
        quizOptions: [
          "Tant pis, Dieu regarde seulement le cœur, pas les vêtements.",
          "Prends 2 minutes pour te changer : la propreté est une forme de respect envers Dieu et les autres."
        ],
        quizAnswer: "Prends 2 minutes pour te changer : la propreté est une forme de respect envers Dieu et les autres."
      },
      {
        title: "Le vêtement à l'endroit",
        text: "Un détail qui a toute son importance : on fait attention à ne pas porter ses vêtements à l'envers avec les coutures apparentes ! Pourquoi ? Parce que se négliger, c'est manquer de respect envers soi-même et envers les autres. Un esprit clair commence par une tenue soignée.",
        quizEyebrow: "Le bon conseil",
        quizPrompt: "Que nous apprend la règle de ne jamais porter ses vêtements à l'envers ?",
        quizOptions: [
          "Qu'avoir une tenue digne et soignée est le premier pas vers une belle journée.",
          "Que les vêtements à l'envers portent malheur et rendent malade."
        ],
        quizAnswer: "Qu'avoir une tenue digne et soignée est le premier pas vers une belle journée."
      },
      {
        title: "Propre et présentable",
        text: "La spiritualité ne veut pas dire se détacher du monde matériel. Au contraire ! Nos Sages insistent pour que nos vêtements soient toujours propres, sans mauvaises odeurs ni taches. Il ne s'agit pas de porter des vêtements de luxe pour se vanter, mais d'avoir une tenue digne, propre et agréable pour notre entourage.",
        quizEyebrow: "Vrai ou Faux ?",
        quizPrompt: "\"La pudeur (Tzniout) n'est obligatoire que lorsqu'on se trouve à la synagogue, chez soi on fait ce qu'on veut.\"",
        quizOptions: [
          "Vrai.",
          "Faux (Dieu est présent partout, on garde une attitude digne même dans sa chambre)."
        ],
        quizAnswer: "Faux (Dieu est présent partout, on garde une attitude digne même dans sa chambre)."
      }
    ]
  },
  {
    sources: [1],
    notions: [
      {
        title: "La priorité à la droite",
        text: "La Torah donne souvent une importance particulière au côté droit (qui symbolise la bonté). C'est pourquoi, lorsqu'on s'habille, on a l'habitude de commencer par enfiler la manche droite ou la jambe droite. En revanche, pour se déshabiller, on retire le côté gauche en premier !",
        quizEyebrow: "L'ordre logique",
        quizPrompt: "Comment mettre ses chaussures à lacets selon la coutume juive ?",
        quizOptions: [
          "La droite, puis la gauche, je lace la gauche, puis je lace la droite.",
          "La gauche en premier, je lace tout, puis je passe à la droite."
        ],
        quizAnswer: "La droite, puis la gauche, je lace la gauche, puis je lace la droite."
      },
      {
        title: "Le secret des chaussures",
        text: "Il existe une règle très précise pour mettre ses chaussures à lacets, conçue pour nous apprendre à ne jamais agir comme des robots : on enfile d'abord la chaussure droite (sans la lacer), puis la chaussure gauche qu'on lace tout de suite, et enfin on lace la droite ! (On fait cela car le côté gauche a aussi son importance : c'est sur le bras gauche qu'on met les Téfilines).",
        quizEyebrow: "Symbolique",
        quizPrompt: "Pourquoi donne-t-on généralement la priorité au côté droit lorsqu'on s'habille ?",
        quizOptions: [
          "Parce que le côté droit est le seul côté qui compte.",
          "Parce que le côté droit symbolise la bonté et a une importance particulière dans la Torah."
        ],
        quizAnswer: "Parce que le côté droit symbolise la bonté et a une importance particulière dans la Torah."
      },
      {
        title: "Un vêtement à la fois",
        text: "Une vieille tradition juive recommande de ne pas enfiler deux vêtements en même temps (par exemple, mettre sa veste et son manteau d'un seul coup). La tradition dit que cela peut causer des oublis. Au-delà de ça, c'est une belle invitation à faire chaque chose l'une après l'autre, avec pleine conscience.",
        quizEyebrow: "Vrai ou Faux ?",
        quizPrompt: "\"Il est recommandé de ne pas enfiler deux vêtements en même temps pour nous apprendre à faire les choses étape par étape.\"",
        quizOptions: [
          "Vrai",
          "Faux"
        ],
        quizAnswer: "Vrai"
      }
    ]
  },
  {
    sources: [1],
    notions: [
      {
        title: "Une posture digne, mais pas hautaine",
        text: "La loi juive nous demande de ne pas marcher le torse excessivement bombé, la tête rejetée en arrière avec arrogance. Celui qui marche avec trop de fierté semble repousser la présence de Dieu. On garde une posture droite et digne, en regardant devant soi, avec une humilité naturelle.",
        quizEyebrow: "Mise en situation",
        quizPrompt: "Tu croises un voisin dans la rue. Que dois-tu faire ?",
        quizOptions: [
          "Le juger sur sa tenue avant de lui parler.",
          "Essayer d'être le premier à le saluer avec le sourire."
        ],
        quizAnswer: "Essayer d'être le premier à le saluer avec le sourire."
      },
      {
        title: "Le pouvoir d'un \"Bonjour\"",
        text: "Il est très important d'être le premier à saluer les autres ! Vous pouvez tout à fait dire \"Chalom\" (qui signifie \"Paix\" en hébreu) à n'importe qui dans la rue, même si cette personne n'a pas la tête couverte. Être poli et aimable avec tout le monde est une grande qualité dans le judaïsme.",
        quizEyebrow: "Le bon réflexe",
        quizPrompt: "Pourquoi la loi juive déconseille-t-elle de marcher en bombant le torse de manière exagérée ?",
        quizOptions: [
          "Parce que cela montre de l'arrogance et un manque d'humilité face à Dieu.",
          "Parce que cela donne mal au dos à la longue."
        ],
        quizAnswer: "Parce que cela montre de l'arrogance et un manque d'humilité face à Dieu."
      },
      {
        title: "\"Chalom\", un des noms de Dieu",
        text: "Le mot Chalom est si important qu'il est considéré comme l'un des noms de Dieu. Si la personne en face de vous ne porte pas de Kippa, vous pouvez lui dire Chalom, mais pour éviter de la mettre mal à l'aise, vous pouvez aussi utiliser un simple \"Bonjour\" ou \"Comment vas-tu ?\". L'essentiel est de répandre la gentillesse !",
        quizEyebrow: "Vrai ou Faux ?",
        quizPrompt: "\"Le mot hébreu Chalom (Paix) est considéré comme l'un des noms de Dieu.\"",
        quizOptions: [
          "Vrai",
          "Faux"
        ],
        quizAnswer: "Vrai"
      }
    ]
  },
  {
    sources: [1],
    notions: [
      {
        title: "Pourquoi se couvrir la tête ?",
        text: "Les hommes juifs portent une Kippa (ou un chapeau) pour se couvrir la tête. Ce n'est pas juste un bout de tissu ! C'est un rappel constant qu'il y a \"quelque chose au-dessus de nous\". Cela nous aide à garder notre humilité et à nous souvenir que Dieu observe nos actions.",
        quizEyebrow: "La symbolique",
        quizPrompt: "Quel est le message principal de la Kippa sur la tête d'un homme juif ?",
        quizOptions: [
          "C'est juste un accessoire de mode pour se protéger du soleil.",
          "C'est un rappel d'humilité : il y a Dieu au-dessus de nous."
        ],
        quizAnswer: "C'est un rappel d'humilité : il y a Dieu au-dessus de nous."
      },
      {
        title: "Fiers de notre identité",
        text: "Aujourd'hui, porter la Kippa dans la rue est aussi une marque d'appartenance et de fierté. Elle montre que l'on fait partie de ceux qui essaient de respecter la Torah. Un homme qui craint Dieu porte sa Kippa comme un symbole de ses valeurs morales et spirituelles.",
        quizEyebrow: "La taille idéale",
        quizPrompt: "Comment doit être la Kippa selon la loi juive ?",
        quizOptions: [
          "Elle doit être bien visible, idéalement en couvrant une bonne partie de la tête.",
          "Elle doit être complètement invisible pour ne gêner personne."
        ],
        quizAnswer: "Elle doit être bien visible, idéalement en couvrant une bonne partie de la tête."
      },
      {
        title: "Quelle taille pour la Kippa ?",
        text: "L'idéal est de porter une Kippa qui recouvre une bonne partie de la tête. Mais selon la loi stricte, une petite Kippa est permise, tant qu'elle est bien visible de tous les côtés. Le plus important pendant la prière est d'avoir la tête couverte avec respect.",
        quizEyebrow: "Vrai ou Faux ?",
        quizPrompt: "\"Porter la Kippa est réservé uniquement aux grands rabbins, les autres n'en ont pas besoin.\"",
        quizOptions: [
          "Vrai",
          "Faux (Tout homme juif est invité à la porter pour se rappeler de la présence de Dieu)."
        ],
        quizAnswer: "Faux (Tout homme juif est invité à la porter pour se rappeler de la présence de Dieu)."
      }
    ]
  },
  {
    sources: [1],
    notions: [
      {
        title: "Penser à Dieu, même sans Kippa",
        text: "Si vous êtes à la plage, à la piscine ou chez le coiffeur, il est évident que vous ne portez pas de Kippa ! La bonne nouvelle ? Même la tête découverte, il est tout à fait permis de penser à des paroles de Torah ou à Dieu. La religion ne vous demande pas de cesser d'être spirituel quand vous retirez votre chapeau.",
        quizEyebrow: "Scénario à la plage",
        quizPrompt: "Tu te baignes dans la mer (sans Kippa) et tu as soudain envie de remercier Dieu dans tes pensées. Est-ce permis ?",
        quizOptions: [
          "Oui, on peut toujours avoir des pensées spirituelles, même la tête découverte.",
          "Non, Dieu ne nous écoute pas si on n'a pas de Kippa sur la tête."
        ],
        quizAnswer: "Oui, on peut toujours avoir des pensées spirituelles, même la tête découverte."
      },
      {
        title: "Le travail et la subsistance",
        text: "Si votre travail vous interdit strictement de porter la Kippa et que vous n'avez pas d'autre moyen de nourrir votre famille, la loi juive est compréhensive. Dans des cas de force majeure liés à votre emploi, certains rabbins autorisent à travailler la tête découverte. La vie et la famille passent avant tout.",
        quizEyebrow: "Le monde professionnel",
        quizPrompt: "Si un homme risque de perdre son seul emploi à cause de sa Kippa, que dit la loi juive ?",
        quizOptions: [
          "Il doit démissionner immédiatement et ne plus nourrir sa famille.",
          "La loi est compréhensive : dans certains cas de force majeure, il peut travailler tête nue."
        ],
        quizAnswer: "La loi est compréhensive : dans certains cas de force majeure, il peut travailler tête nue."
      },
      {
        title: "Ce qui nécessite une tête couverte",
        text: "Même si on peut penser à Dieu sans Kippa, il y a des moments où se couvrir la tête est obligatoire : pour prier avec des mots, ou pour prononcer une bénédiction avant de manger. Cependant, si votre Kippa tombe pendant votre prière sans que vous vous en rendiez compte, rassurez-vous : votre prière reste valable !",
        quizEyebrow: "Vrai ou Faux ?",
        quizPrompt: "\"Si ma Kippa tombe de ma tête sans que je m'en rende compte pendant ma prière, ma prière reste valable.\"",
        quizOptions: [
          "Vrai",
          "Faux"
        ],
        quizAnswer: "Vrai"
      }
    ]
  },
  {
    sources: [1],
    notions: [
      {
        title: "Garder sa dignité",
        text: "Dans les temps anciens, les Sages disaient qu'il valait mieux vendre les poutres de sa propre maison plutôt que de marcher pieds nus dans la rue ! Pourquoi ? Parce que marcher pieds nus était considéré comme dégradant. Le judaïsme nous demande de toujours préserver notre dignité humaine.",
        quizEyebrow: "L'erreur du débutant",
        quizPrompt: "Quelqu'un regrette une faute et veut marcher pieds nus dans le froid pour se punir. Que lui conseille-t-on ?",
        quizOptions: [
          "De ne pas le faire ! Dieu ne veut pas de notre souffrance, Il veut de bonnes actions.",
          "De le faire tous les jours jusqu'à ce qu'il tombe malade."
        ],
        quizAnswer: "De ne pas le faire ! Dieu ne veut pas de notre souffrance, Il veut de bonnes actions."
      },
      {
        title: "Dieu ne veut pas nous voir souffrir",
        text: "Parfois, une personne qui regrette ses erreurs (un Ba'al Téchouva) veut s'infliger des souffrances, comme marcher pieds nus ou jeûner, pour se faire pardonner. La réponse de la loi juive est claire : Non ! Dieu ne tire aucune satisfaction de notre souffrance physique.",
        quizEyebrow: "La dignité avant tout",
        quizPrompt: "Pourquoi les Sages insistaient-ils pour que chacun porte des chaussures en public ?",
        quizOptions: [
          "Parce qu'ils possédaient tous des usines de chaussures.",
          "Parce que préserver son apparence et sa dignité humaine est très important dans le judaïsme."
        ],
        quizAnswer: "Parce que préserver son apparence et sa dignité humaine est très important dans le judaïsme."
      },
      {
        title: "La meilleure des réparations",
        text: "Si vous avez fait une erreur, la meilleure façon de réparer n'est pas de vous punir. Le meilleur remède (la Téchouva) est simplement d'étudier un peu plus la Torah, de faire de bonnes actions, et d'avancer dans la joie. La spiritualité juive se vit dans le bonheur et l'évolution personnelle.",
        quizEyebrow: "Vrai ou Faux ?",
        quizPrompt: "\"La meilleure façon de se faire pardonner une faute est d'étudier la Torah et de s'améliorer, pas de s'infliger des souffrances.\"",
        quizOptions: [
          "Vrai",
          "Faux"
        ],
        quizAnswer: "Vrai"
      }
    ]
  }
];

let globalIndex = 0;
const newKps = [];

for (const lesson of lessons) {
  const mappedSources = lesson.sources.map(s => ({ siman: 2, seif: s }));
  
  for (const notion of lesson.notions) {
    globalIndex++;
    const formattedId = `00${globalIndex}`.slice(-3);
    
    newKps.push({
      id: `new-s2-kp-${formattedId}`,
      title: notion.title,
      rule: notion.text,
      sources: mappedSources,
      pedagogy: {
        simple_explanation: notion.text
      },
      quizEyebrow: notion.quizEyebrow,
      quizPrompt: notion.quizPrompt,
      quizOptions: notion.quizOptions,
      quizAnswer: notion.quizAnswer
    });
  }
}

data.knowledge_points = newKps;

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log("siman_2_knowledge.json mis à jour !");
