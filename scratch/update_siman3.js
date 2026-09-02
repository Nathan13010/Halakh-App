import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, '..', 'public', 'data', 'הלכות הנהגת אדם בבוקר', 'siman_3_knowledge.json');

let rawData = '{}';
let data = { knowledge_points: [] };
try {
  rawData = fs.readFileSync(filePath, 'utf8');
  data = JSON.parse(rawData);
} catch (err) {
  console.log("Could not read original file, creating new JSON object.");
}

const lessons = [
  {
    sources: [1, 2, 6],
    notions: [
      {
        title: "La santé est spirituelle",
        text: "Dans le judaïsme, le corps est un \"véhicule\" prêté par Dieu. Il faut en prendre soin ! C'est pourquoi les Sages recommandent d'avoir un rythme de vie sain et de prendre le temps de passer aux toilettes le matin et le soir, sans jamais se précipiter ni forcer. Prendre soin de son système digestif est une vraie marque de sagesse.",
        quizEyebrow: "Vrai ou Faux ?",
        quizPrompt: "\"Selon le judaïsme, il est bien vu de se retenir d'aller aux toilettes pour montrer que l'on contrôle son corps.\"",
        quizOptions: [
          "Vrai",
          "Faux (C'est même strictement interdit pour des raisons de santé !)"
        ],
        quizAnswer: "Faux (C'est même strictement interdit pour des raisons de santé !)"
      },
      {
        title: "Ne jamais se retenir",
        text: "Il existe une règle très stricte appelée Bal Teshaktzu (qui signifie \"Ne rendez pas votre corps abominable\"). Cette règle interdit de se retenir quand on a envie d'aller aux toilettes. Se retenir est mauvais pour la santé, et la religion nous demande de ne jamais abîmer notre corps.",
        quizEyebrow: "Mise en situation",
        quizPrompt: "Il est 3h du matin, tu es bien au chaud mais tu as envie d'aller aux toilettes. Que fais-tu ?",
        quizOptions: [
          "Je me retiens jusqu'au matin pour ne pas avoir froid.",
          "Je me lève tout de suite, car le judaïsme interdit de se retenir et de faire souffrir son corps."
        ],
        quizAnswer: "Je me lève tout de suite, car le judaïsme interdit de se retenir et de faire souffrir son corps."
      },
      {
        title: "Vaincre la paresse",
        text: "Même s'il fait très froid en plein milieu de la nuit, ou que l'on est bien au chaud sous la couette, si le corps réclame d'aller aux toilettes, on ne doit pas céder à la paresse. On se lève, on se soulage, et on retourne dormir sereinement !",
        quizEyebrow: "Le sens des mots",
        quizPrompt: "Que signifie la règle de Bal Teshaktzu ?",
        quizOptions: [
          "C'est l'obligation de prier tous les matins.",
          "C'est l'interdiction de rendre son corps \"abominable\" en se retenant d'aller aux toilettes."
        ],
        quizAnswer: "C'est l'interdiction de rendre son corps \"abominable\" en se retenant d'aller aux toilettes."
      }
    ]
  },
  {
    sources: [8, 9],
    notions: [
      {
        title: "Fermer la porte",
        text: "La pudeur (Tzniout) nous accompagne partout. Même lorsque l'on vit seul ou qu'il fait nuit noire, on prend l'habitude de toujours fermer la porte des toilettes derrière soi. Se respecter soi-même, c'est garder une attitude digne même quand personne ne nous regarde.",
        quizEyebrow: "Le téléphone sonne",
        quizPrompt: "Tu es aux toilettes et tu reçois un appel d'un ami pour discuter de la pluie et du beau temps. Que fais-tu ?",
        quizOptions: [
          "Je réponds pour faire passer le temps.",
          "Je laisse sonner : on ne parle aux toilettes, sauf urgence absolue."
        ],
        quizAnswer: "Je laisse sonner : on ne parle aux toilettes, sauf urgence absolue."
      },
      {
        title: "Le silence est d'or",
        text: "Les toilettes ne sont pas un salon de discussion ! La règle est de ne jamais y parler. On évite de discuter avec quelqu'un resté dans le couloir et on ne répond pas au téléphone (sauf en cas d'urgence absolue, bien sûr). Ce silence marque le respect de notre intimité.",
        quizEyebrow: "Vrai ou Faux ?",
        quizPrompt: "\"Si je vis totalement seul chez moi, je n'ai pas besoin de fermer la porte des toilettes.\"",
        quizOptions: [
          "Vrai",
          "Faux (La pudeur s'applique même quand on est seul !)."
        ],
        quizAnswer: "Faux (La pudeur s'applique même quand on est seul !)."
      },
      {
        title: "Se découvrir avec mesure",
        text: "Même dans cet espace privé, la loi juive nous conseille de ne découvrir nos vêtements que pour le strict nécessaire afin de ne pas les salir, et de se rhabiller dès que possible. Le message est simple : notre corps est précieux, on ne l'expose pas sans raison.",
        quizEyebrow: "L'attitude juste",
        quizPrompt: "Pourquoi la religion demande-t-elle le silence et la discrétion dans cet endroit ?",
        quizOptions: [
          "Pour nous apprendre à respecter notre intimité et garder une attitude digne partout.",
          "Parce que le bruit fait fuir les ondes positives."
        ],
        quizAnswer: "Pour nous apprendre à respecter notre intimité et garder une attitude digne partout."
      }
    ]
  },
  {
    sources: [10],
    notions: [
      {
        title: "La séparation du sacré et du profane",
        text: "Le judaïsme accorde une importance capitale à la séparation entre ce qui est \"pur\" (le sacré, la Torah, la prière) et ce qui est \"impur\" (la saleté, les déchets). C'est pourquoi il est strictement interdit de prononcer des mots de Torah, ou même d'y penser, pendant que l'on se trouve aux toilettes.",
        quizEyebrow: "Mise en situation",
        quizPrompt: "Tu es aux toilettes et tu te surprends à réfléchir à un passage de la Torah ou à Dieu. Que fais-tu ?",
        quizOptions: [
          "C'est très bien, il faut penser à Dieu partout.",
          "Je change de pensée et je réfléchis plutôt à mes factures ou à mes courses !"
        ],
        quizAnswer: "Je change de pensée et je réfléchis plutôt à mes factures ou à mes courses !"
      },
      {
        title: "À quoi penser alors ?",
        text: "Si l'on ne peut pas penser à la religion, que faire ? Les Sages conseillent de profiter de ce moment pour penser à des choses très concrètes : faire ses calculs financiers, penser à sa liste de courses, à son travail ou au programme de la journée. C'est le moment idéal pour penser \"matériel\" !",
        quizEyebrow: "Vrai ou Faux ?",
        quizPrompt: "\"Il est permis de lire un magazine de sport ou de décoration aux toilettes pour éviter de penser à la religion.\"",
        quizOptions: [
          "Vrai (Tant qu'il n'y a pas de textes sacrés, c'est permis).",
          "Faux"
        ],
        quizAnswer: "Vrai (Tant qu'il n'y a pas de textes sacrés, c'est permis)."
      },
      {
        title: "La lecture aux toilettes",
        text: "Puisqu'on ne peut pas étudier, est-il permis de lire ? Oui ! Vous pouvez tout à fait lire un journal, un magazine ou un article sur votre téléphone, tant qu'il ne contient aucun texte sacré ou religieux. Cela aide l'esprit à se concentrer sur des sujets profanes.",
        quizEyebrow: "La grande raison",
        quizPrompt: "Pourquoi est-il interdit de penser à la prière aux toilettes ?",
        quizOptions: [
          "Parce que ça donne mal à la tête.",
          "Pour marquer une séparation claire entre ce qui est saint (la prière) et ce qui est impur."
        ],
        quizAnswer: "Pour marquer une séparation claire entre ce qui est saint (la prière) et ce qui est impur."
      }
    ]
  },
  {
    sources: [13, 14],
    notions: [
      {
        title: "Vider ses poches",
        text: "Puisque les toilettes sont considérées comme un endroit inapproprié pour le sacré, on ne doit pas y faire entrer de textes saints (comme un livre de prières ou un texte contenant le nom de Dieu). Avant d'entrer, on prend l'habitude de vérifier ses poches et de laisser son livre à l'extérieur.",
        quizEyebrow: "Le bon réflexe",
        quizPrompt: "Tu t'apprêtes à entrer aux toilettes chez toi, mais tu as un petit livre de psaumes (prières) dans la poche. Que fais-tu ?",
        quizOptions: [
          "Je le pose sur une table à l'extérieur avant d'entrer.",
          "Je le garde, ce n'est pas grave s'il reste dans la poche."
        ],
        quizAnswer: "Je le pose sur une table à l'extérieur avant d'entrer."
      },
      {
        title: "L'exception des lieux publics",
        text: "Le judaïsme est toujours logique. Si vous êtes dans des toilettes publiques (une gare, un aéroport) et que laisser votre livre de prières dehors signifie qu'on va vous le voler, la loi vous autorise exceptionnellement à le garder dans votre poche, bien caché.",
        quizEyebrow: "Vrai ou Faux ?",
        quizPrompt: "\"Il est strictement interdit d'entrer aux toilettes avec la photo d'un rabbin sur son téléphone.\"",
        quizOptions: [
          "Vrai",
          "Faux (Une photo n'a pas de sainteté, c'est donc permis)."
        ],
        quizAnswer: "Faux (Une photo n'a pas de sainteté, c'est donc permis)."
      },
      {
        title: "Et les photos ?",
        text: "Peut-on entrer avec une photo d'un grand rabbin dans son portefeuille ou sur l'écran de son téléphone ? Oui, absolument ! Une simple photo ne contient aucune sainteté religieuse et n'est pas un texte sacré. Il faut juste veiller à ne pas la salir.",
        quizEyebrow: "Scénario voyage",
        quizPrompt: "Tu es dans une gare et tu as peur qu'on te vole ton livre de prières si tu le laisses devant les toilettes. Que dit la loi ?",
        quizOptions: [
          "Exceptionnellement, tu peux le garder caché dans ta poche pour le protéger.",
          "Tu dois le jeter à la poubelle plutôt que de l'entrer aux toilettes."
        ],
        quizAnswer: "Exceptionnellement, tu peux le garder caché dans ta poche pour le protéger."
      }
    ]
  },
  {
    sources: [18, 19],
    notions: [
      {
        title: "Une hygiène irréprochable",
        text: "Après avoir fait ses besoins, il faut se nettoyer avec un soin extrême. On utilise du papier, et l'idéal (quand c'est possible) est de terminer avec un peu d'eau ou une lingette humide. Pourquoi cette exigence ? Parce que pour pouvoir prononcer des prières ensuite, le corps doit être d'une propreté parfaite.",
        quizEyebrow: "L'exigence de propreté",
        quizPrompt: "Pourquoi le judaïsme exige-t-il de se nettoyer avec un soin extrême aux toilettes ?",
        quizOptions: [
          "Parce que le corps doit être parfaitement propre pour pouvoir prier ou parler à Dieu ensuite.",
          "Parce que c'est une loi pour faire des économies de papier."
        ],
        quizAnswer: "Parce que le corps doit être parfaitement propre pour pouvoir prier ou parler à Dieu ensuite."
      },
      {
        title: "L'éducation des enfants",
        text: "L'hygiène s'apprend dès le plus jeune âge. Il est recommandé d'habituer les enfants à se nettoyer correctement. Cependant, la religion est pleine de douceur : même si un enfant n'est pas encore capable de se nettoyer parfaitement seul, on l'encourage quand même à dire ses petites prières sans le braquer.",
        quizEyebrow: "Vrai ou Faux ?",
        quizPrompt: "\"Si un petit enfant ne sait pas encore s'essuyer parfaitement, il n'a plus le droit de réciter de petites prières.\"",
        quizOptions: [
          "Vrai",
          "Faux (On lui apprend avec patience, mais il peut continuer à faire ses petites prières)."
        ],
        quizAnswer: "Faux (On lui apprend avec patience, mais il peut continuer à faire ses petites prières)."
      },
      {
        title: "Le respect des autres",
        text: "Garder des toilettes propres et sans mauvaises odeurs est aussi une question de respect pour les autres membres de la famille ou de la communauté. D'ailleurs, il est interdit de faire sa prière s'il y a une mauvaise odeur dans la pièce. La propreté est la condition de la spiritualité !",
        quizEyebrow: "La règle des odeurs",
        quizPrompt: "Tu es dans ta chambre et tu veux prier, mais une très mauvaise odeur vient des toilettes d'à côté. Que fais-tu ?",
        quizOptions: [
          "Je prie en me bouchant le nez.",
          "Je m'éloigne ou j'aère la pièce, car on ne prie pas s'il y a une mauvaise odeur."
        ],
        quizAnswer: "Je m'éloigne ou j'aère la pièce, car on ne prie pas s'il y a une mauvaise odeur."
      }
    ]
  },
  {
    sources: [23, 24],
    notions: [
      {
        title: "Respecter la nourriture",
        text: "Manger est une action qui entretient la vie, tandis que les toilettes sont le lieu où l'on rejette les déchets. Pour marquer cette différence, il est strictement interdit d'introduire de la nourriture ou des boissons (une pomme, un café, un sandwich) dans les toilettes, même si on ne les mange pas à l'intérieur !",
        quizEyebrow: "Mise en situation",
        quizPrompt: "Tu vas aux toilettes dans un café, mais tu as ton gobelet de café à la main. Que fais-tu ?",
        quizOptions: [
          "Je le garde avec moi, ce n'est qu'une boisson.",
          "Je le confie à un ami ou je le pose dehors : on n'entre ni nourriture ni boisson aux toilettes."
        ],
        quizAnswer: "Je le confie à un ami ou je le pose dehors : on n'entre ni nourriture ni boisson aux toilettes."
      },
      {
        title: "Les boîtes fermées",
        text: "La règle est tellement respectée qu'on évite même de ranger des boîtes de conserve ou des paquets de gâteaux fermés dans la pièce des toilettes (si la salle de bain fait aussi office de cellier, par exemple). La nourriture mérite un endroit propre.",
        quizEyebrow: "Vrai ou Faux ?",
        quizPrompt: "\"Il est interdit d'entrer aux toilettes avec des médicaments dans sa poche.\"",
        quizOptions: [
          "Vrai",
          "Faux (La santé prime, les médicaments sont autorisés)."
        ],
        quizAnswer: "Faux (La santé prime, les médicaments sont autorisés)."
      },
      {
        title: "L'exception médicale",
        text: "Comme toujours, le judaïsme fait passer la santé avant tout. Si vous avez une boîte de médicaments dans votre poche, vous avez tout à fait le droit de la garder avec vous aux toilettes. Les médicaments ne sont pas considérés comme des \"repas\" ou de la nourriture de plaisir.",
        quizEyebrow: "Le grand principe",
        quizPrompt: "Pourquoi la nourriture est-elle interdite dans les toilettes ?",
        quizOptions: [
          "Pour bien séparer ce qui nourrit la vie (la nourriture) du lieu des déchets.",
          "Parce que ça attire les insectes."
        ],
        quizAnswer: "Pour bien séparer ce qui nourrit la vie (la nourriture) du lieu des déchets."
      }
    ]
  }
];

let globalIndex = 0;
const newKps = [];

for (const lesson of lessons) {
  const mappedSources = lesson.sources.map(s => ({ siman: 3, seif: s }));
  
  for (const notion of lesson.notions) {
    globalIndex++;
    const formattedId = `00${globalIndex}`.slice(-3);
    
    newKps.push({
      id: `new-s3-kp-${formattedId}`,
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
console.log("siman_3_knowledge.json mis à jour !");
