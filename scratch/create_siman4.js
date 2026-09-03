import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetPath = path.join(__dirname, '..', 'public', 'data', 'הלכות הנהגת אדם בבוקר', 'siman_4_knowledge.json');

const lessons = [
  {
    sources: [1, 4],
    notions: [
      {
        title: "Un nouveau départ",
        text: "Chaque matin est une petite renaissance. En ouvrant les yeux, le judaïsme nous invite à marquer le coup et à éveiller notre conscience spirituelle avant même de commencer notre journée. Pour cela, on pratique la Netilat Yadaïm, le lavage des mains matinal. C'est un geste simple qui purifie notre corps et notre esprit pour les heures à venir.",
        quizEyebrow: "Mise en situation",
        quizPrompt: "Au réveil, comment utilisez-vous l'eau pour vous laver les mains ?",
        quizOptions: [
          "Je plonge mes mains dans un bol d'eau pendant une minute.",
          "Je prends un récipient et je verse l'eau en alternant trois fois sur chaque main."
        ],
        quizAnswer: "Je prends un récipient et je verse l'eau en alternant trois fois sur chaque main."
      },
      {
        title: "La méthode douce",
        text: "Comment faire ? C'est très simple ! Prenez un ustensile (comme un grand verre ou un récipient à deux anses) rempli d'eau. La tradition veut que l'on prenne d'abord le récipient de la main droite, puis qu'on le passe à la main gauche pour commencer à verser l'eau sur la main droite. On privilégie toujours la droite, symbole de bonté et d'action positive.",
        quizEyebrow: "Vrai ou Faux",
        quizPrompt: "\"Pour la Netilat Yadaïm du matin, la coutume est d'alterner : on verse l'eau une fois à droite, puis une fois à gauche, et on répète cela trois fois.\"",
        quizOptions: [
          "Vrai",
          "Faux"
        ],
        quizAnswer: "Vrai"
      },
      {
        title: "L'eau en mouvement",
        text: "Le secret de ce lavage réside dans l'alternance. On verse un peu d'eau sur la main droite, puis sur la main gauche, puis de nouveau sur la droite, et ainsi de suite. Au total, on verse trois fois sur chaque main, en alternant. Ce rythme dynamique réveille l'âme et chasse les énergies endormies de la nuit.",
        quizEyebrow: "Phrase à trou",
        quizPrompt: "En nous lavant les mains le matin, la première main qui reçoit l'eau est la main ________.",
        quizOptions: [
          "Gauche, pour équilibrer.",
          "Droite, car elle représente la bonté et l'élan positif."
        ],
        quizAnswer: "Droite, car elle représente la bonté et l'élan positif."
      }
    ]
  },
  {
    sources: [1, 20],
    notions: [
      {
        title: "Le moment de gratitude",
        text: "Une fois l'eau versée, mais avant d'essuyer vos mains, c'est le moment de prononcer une bénédiction. On remercie Dieu pour ce commandement : \"Béni sois-Tu... qui nous a ordonné le lavage des mains\" (Al Netilat Yadaïm en hébreu). C'est une façon de dire : \"Merci de me donner la force d'agir aujourd'hui\".",
        quizEyebrow: "Vrai ou Faux",
        quizPrompt: "\"La bénédiction se récite au moment où j'ai les mains sèches, 10 minutes après le lavage.\"",
        quizOptions: [
          "Vrai",
          "Faux"
        ],
        quizAnswer: "Faux"
      },
      {
        title: "L'importance de l'essuyage",
        text: "Pourquoi bénir avant de s'essuyer ? Dans le judaïsme, on aime prononcer la bénédiction juste avant ou pendant l'action, pour y mettre toute notre intention. L'essuyage fait partie intégrante de la bonne action du lavage. On bénit donc les mains mouillées, puis on les sèche.",
        quizEyebrow: "Devinette",
        quizPrompt: "Que signifie \"Al Netilat Yadaïm\" ?",
        quizOptions: [
          "C'est la bénédiction pour remercier Dieu de nous avoir ordonné le lavage des mains.",
          "C'est une expression pour se souhaiter une bonne journée."
        ],
        quizAnswer: "C'est la bénédiction pour remercier Dieu de nous avoir ordonné le lavage des mains."
      },
      {
        title: "Un geste tout terrain",
        text: "Si vous êtes dans un endroit où vous ne vous sentez pas à l'aise pour dire le nom de Dieu (par exemple si la pièce n'est pas très propre), pas de panique. Séchez vos mains, sortez de la pièce, et prononcez votre bénédiction juste après dans un endroit pur. La loi juive s'adapte à votre quotidien !",
        quizEyebrow: "Le bon conseil",
        quizPrompt: "Je viens de me laver les mains mais je suis dans une pièce un peu encombrée et pas très nette. Que faire pour dire ma prière ?",
        quizOptions: [
          "Je sèche mes mains, je vais dans un endroit propre comme le salon, et je dis ma bénédiction.",
          "Je crie la bénédiction très fort pour purifier la pièce."
        ],
        quizAnswer: "Je sèche mes mains, je vais dans un endroit propre comme le salon, et je dis ma bénédiction."
      }
    ]
  },
  {
    sources: [16, 17],
    notions: [
      {
        title: "Pour tous, sans exception",
        text: "La beauté de la Netilat Yadaïm du matin, c'est qu'elle nous unit tous. Les hommes comme les femmes sont invités à commencer leur journée par ce geste de pureté et à prononcer la bénédiction. C'est une action universelle qui installe une ambiance sereine dans tout le foyer dès le lever du soleil.",
        quizEyebrow: "Vrai ou Faux",
        quizPrompt: "\"L'obligation de se laver les mains le matin concerne tout le monde : les hommes, les femmes, et c'est une excellente habitude à transmettre aux enfants.\"",
        quizOptions: [
          "Vrai",
          "Faux"
        ],
        quizAnswer: "Vrai"
      },
      {
        title: "L'éducation par l'amour",
        text: "Et les enfants dans tout ça ? La tradition nous encourage chaleureusement à les habituer à se laver les mains le matin. Dès qu'ils sont en âge de comprendre, on leur apprend le geste ludique (verser l'eau trois fois) et on les aide à chantonner la bénédiction. C'est un moment de tendresse incroyable.",
        quizEyebrow: "Mise en situation",
        quizPrompt: "Votre petite fille de 4 ans veut faire comme vous le matin avec le récipient d'eau. Que faites-vous ?",
        quizOptions: [
          "Je lui dis que c'est réservé aux grandes personnes.",
          "Je l'aide à verser l'eau sur ses mains et on dit la bénédiction ensemble pour l'habituer avec joie."
        ],
        quizAnswer: "Je l'aide à verser l'eau sur ses mains et on dit la bénédiction ensemble pour l'habituer avec joie."
      },
      {
        title: "Une graine pour l'avenir",
        text: "Même pour les tout-petits bébés, c'est une merveilleuse coutume de leur laver doucement les petites mains au réveil. Les Sages expliquent que cela attire sur eux une énergie pure et les aide à grandir dans un environnement empreint de sainteté et de douceur.",
        quizEyebrow: "Phrase à trou",
        quizPrompt: "Laver les mains des tout-petits bébés le matin est considéré comme une superbe coutume pour attirer sur eux ________.",
        quizOptions: [
          "Une énergie pure et de la sainteté.",
          "La garantie qu'ils feront leurs nuits."
        ],
        quizAnswer: "Une énergie pure et de la sainteté."
      }
    ]
  },
  {
    sources: [25, 40],
    notions: [
      {
        title: "Habillez-vous tranquillement",
        text: "Une idée reçue voudrait qu'on ne puisse rien faire avant de s'être lavé les mains le matin. Rassurez-vous : la loi juive est pleine de bon sens ! En vous levant, vous avez tout à fait le droit de toucher vos vêtements et de vous habiller avant même d'avoir fait le lavage des mains. Il n'y a aucune angoisse à avoir.",
        quizEyebrow: "Le bon conseil",
        quizPrompt: "Je me lève le matin avec une envie très pressante d'aller aux toilettes, mais je n'ai pas encore fait mon lavage des mains !",
        quizOptions: [
          "Je me retiens coûte que coûte et je cherche mon récipient en paniquant.",
          "J'y vais tout de suite ! Le corps passe avant, je ferai mon lavage sereinement juste après."
        ],
        quizAnswer: "J'y vais tout de suite ! Le corps passe avant, je ferai mon lavage sereinement juste après."
      },
      {
        title: "Priorité à votre corps",
        text: "Si vous avez un besoin pressant d'aller aux toilettes en vous réveillant, allez-y directement ! Le judaïsme respecte profondément les besoins du corps. Vous ferez vos besoins, vous vous habillerez confortablement, et seulement après, vous ferez votre lavage des mains avec la bénédiction.",
        quizEyebrow: "Vrai ou Faux",
        quizPrompt: "\"Toucher ses vêtements en se levant, avant de s'être lavé les mains, est strictement interdit.\"",
        quizOptions: [
          "Vrai",
          "Faux"
        ],
        quizAnswer: "Faux"
      },
      {
        title: "La voie de la sérénité",
        text: "L'idée est simplement de ne pas toucher directement de la nourriture ou des parties très sensibles de votre corps avant le lavage. Mais pour tout le reste (marcher, s'habiller, préparer ses affaires), la règle d'or est la sérénité.",
        quizEyebrow: "Devinette",
        quizPrompt: "Selon le judaïsme, comment doit-on aborder la pratique religieuse dès le réveil ?",
        quizOptions: [
          "Avec bon sens, logique et sérénité.",
          "Avec angoisse et la peur constante de faire un faux pas."
        ],
        quizAnswer: "Avec bon sens, logique et sérénité."
      }
    ]
  },
  {
    sources: [42, 43, 44, 46],
    notions: [
      {
        title: "Les petits moments de la journée",
        text: "Le lavage des mains n'est pas réservé qu'au matin. Il y a de petites actions au cours de la journée qui demandent de se rafraîchir. Rassurez-vous, pour ces moments-là, un simple rinçage des mains sous le robinet suffit, sans avoir besoin d'un récipient spécial ni de dire de bénédiction.",
        quizEyebrow: "Phrase à trou",
        quizPrompt: "Après m'être coupé les ongles, la coutume veut que je ________.",
        quizOptions: [
          "Me lave simplement les mains pour me rafraîchir.",
          "Lise un chapitre entier des Psaumes."
        ],
        quizAnswer: "Me lave simplement les mains pour me rafraîchir."
      },
      {
        title: "La beauté jusqu'au bout des ongles",
        text: "Par exemple, après s'être coupé les ongles ou être allé chez le coiffeur, la tradition demande de se laver les mains. C'est une façon de marquer une transition, de se débarrasser des énergies résiduelles et de retrouver un état de pureté pour continuer sa journée.",
        quizEyebrow: "Vrai ou Faux",
        quizPrompt: "\"Je ne dois me laver les mains en cours de journée que si je touche des parties de mon corps qui sont habituellement couvertes (car elles transpirent).\"",
        quizOptions: [
          "Vrai",
          "Faux"
        ],
        quizAnswer: "Vrai"
      },
      {
        title: "Écouter son corps",
        text: "De même, si au cours de la journée vous touchez une partie de votre corps qui est habituellement couverte par les vêtements (et qui est donc sujette à la transpiration), un petit passage des mains sous l'eau est recommandé par souci d'hygiène.",
        quizEyebrow: "Mise en situation",
        quizPrompt: "Vous venez de vous couper les cheveux. Faut-il se laver les mains avec la bénédiction et le récipient du matin ?",
        quizOptions: [
          "Oui, c'est exactement la même procédure qu'au réveil.",
          "Non, un simple rinçage sous le robinet suffit, sans aucune bénédiction."
        ],
        quizAnswer: "Non, un simple rinçage sous le robinet suffit, sans aucune bénédiction."
      }
    ]
  },
  {
    sources: [19, 78],
    notions: [
      {
        title: "Respecter son corps",
        text: "Chaque fois que nous sortons des toilettes, nous nous lavons les mains. Ce n'est pas seulement pour l'hygiène physique, c'est aussi un geste de respect profond envers notre corps, cette machine merveilleuse que Dieu a conçue pour fonctionner avec précision.",
        quizEyebrow: "Vrai ou Faux",
        quizPrompt: "\"En sortant des toilettes, l'eau du robinet suffit largement pour se laver les mains, il n'est pas obligatoire d'utiliser un récipient spécial.\"",
        quizOptions: [
          "Vrai",
          "Faux"
        ],
        quizAnswer: "Vrai"
      },
      {
        title: "Simple et efficace",
        text: "Comment se laver les mains en sortant des toilettes ? L'essentiel de la loi dit qu'un simple passage des mains sous le robinet suffit amplement ! La belle coutume est de reproduire le geste du matin en alternant trois fois droite/gauche, mais bonne nouvelle : vous n'avez pas besoin d'un récipient pour cela. Faire couler l'eau du robinet fait très bien l'affaire.",
        quizEyebrow: "Devinette",
        quizPrompt: "Ma salle de bain est très propre et séparée des toilettes. Puis-je y laver mes mains le matin ?",
        quizOptions: [
          "Non, la salle de bain est toujours considérée comme impure.",
          "Oui, absolument. Nos salles de bain modernes sont propres et tout à fait adaptées."
        ],
        quizAnswer: "Oui, absolument. Nos salles de bain modernes sont propres et tout à fait adaptées."
      },
      {
        title: "Nos salles de bain modernes",
        text: "Aujourd'hui, nos salles de bain sont carrelées et propres. Si votre lavabo se trouve dans une salle de bain (qui ne contient pas les toilettes), vous pouvez tout à fait y faire votre lavage des mains du matin ou de la journée sans aucun problème !",
        quizEyebrow: "Le bon conseil",
        quizPrompt: "En sortant des toilettes, quelle est la coutume idéale pour se laver les mains sous le robinet ?",
        quizOptions: [
          "Mouiller ses mains trois fois en alternance (Droite, Gauche, Droite, Gauche, Droite, Gauche).",
          "Laisser couler l'eau chaude pendant 3 minutes sur les poignets."
        ],
        quizAnswer: "Mouiller ses mains trois fois en alternance (Droite, Gauche, Droite, Gauche, Droite, Gauche)."
      }
    ]
  }
];

let globalIndex = 0;
const newKps = [];

for (const lesson of lessons) {
  const mappedSources = lesson.sources.map(s => ({ siman: 4, seif: s }));

  for (const notion of lesson.notions) {
    globalIndex++;
    const formattedId = `00${globalIndex}`.slice(-3);

    newKps.push({
      id: `new-s4-kp-${formattedId}`,
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

const result = {
  meta: {
    siman: 4,
    siman_hebrew: "ד",
    title: "Lois du lavage des mains le matin et aux toilettes",
    title_hebrew: "הלכות נטילת ידים שחרית ובית הכסא",
    source: "siman_4.json",
    knowledge_points: newKps.length,
    version: "2.0",
    method: "novice-friendly rewrite"
  },
  knowledge_points: newKps
};

fs.writeFileSync(targetPath, JSON.stringify(result, null, 2), 'utf8');
console.log(`siman_4_knowledge.json généré avec succès avec ${newKps.length} notions !`);
