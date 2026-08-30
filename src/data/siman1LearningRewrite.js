const qcm = (explanation, prompt, answer, options, quizExplanation = explanation) => Object.freeze({
  explanation,
  quizPrompt: prompt,
  quizAnswer: answer,
  quizOptions: Object.freeze(options),
  quizExplanation
});

const scenario = (explanation, prompt, answer, options, quizExplanation = explanation) => Object.freeze({
  ...qcm(explanation, prompt, answer, options, quizExplanation),
  quizEyebrow: "Cas pratique"
});

const trueFalse = (explanation, statement, answer, quizExplanation) => Object.freeze({
  explanation,
  quizAnswer: quizExplanation,
  quizExplanation,
  quizTrueFalse: Object.freeze({ statement, answer })
});

export const SIMAN_1_LEARNING_REWRITE = Object.freeze({
  "s1-kp-007": trueFalse(
    "Le sommeil est nécessaire, mais il devient un obstacle lorsqu'il prend la place de la prière, de l'étude ou des bonnes actions. Le but est de trouver un équilibre adapté à sa santé.",
    "Dormir davantage est toujours bénéfique pour le corps et l'esprit.",
    "Faux",
    "Un excès de sommeil peut nuire à la santé et faire perdre un temps précieux."
  ),
  "s1-kp-009": qcm(
    "Le texte donne une indication moyenne de six à huit heures. Ce repère religieux ne remplace pas un conseil médical et les besoins peuvent varier selon chaque personne.",
    "Quelle durée moyenne de sommeil le texte recommande-t-il ?",
    "Six à huit heures.",
    ["Quatre à cinq heures.", "Six à huit heures.", "Plus de neuf heures."]
  ),
  "s1-kp-010": scenario(
    "Le soir et la nuit sont souvent plus calmes. Réserver une partie de ce temps à la Torah permet d'étudier avec moins de distractions, tout en préservant le repos nécessaire.",
    "Pourquoi l'étude du soir ou de la nuit est-elle particulièrement valorisée ?",
    "Parce que ce moment calme favorise l'étude et la réflexion.",
    [
      "Parce que ce moment calme favorise l'étude et la réflexion.",
      "Parce qu'il est interdit d'étudier pendant la journée.",
      "Parce qu'elle remplace la prière du matin."
    ]
  ),
  "s1-kp-011": scenario(
    "Une longue sieste peut faire disparaître le temps prévu pour apprendre. La règle invite à protéger son temps d'étude, sans interdire un repos réellement nécessaire.",
    "Une longue sieste fait manquer le temps d'étude. Que faut-il privilégier ?",
    "Limiter la sieste afin de préserver le temps d'étude.",
    [
      "Limiter la sieste afin de préserver le temps d'étude.",
      "Supprimer toute étude prévue pendant la journée.",
      "Reporter systématiquement l'étude au lendemain."
    ]
  ),
  "s1-kp-012": trueFalse(
    "Une courte sieste n'est pas mauvaise en elle-même. Elle peut être permise lorsqu'elle aide à retrouver les forces nécessaires pour étudier, et le repos de Chabbat possède aussi une valeur particulière.",
    "Toute sieste pendant la journée est interdite, même si elle aide ensuite à étudier.",
    "Faux",
    "Une sieste utile à l'étude peut être permise, ainsi que le repos pendant Chabbat."
  ),
  "s1-kp-013": qcm(
    "La source décrit la fin de la nuit, proche de l'aube, comme un moment où le sommeil peut être particulièrement réparateur. Il s'agit d'une indication du texte, pas d'une prescription médicale.",
    "Quel sommeil le texte présente-t-il comme particulièrement reposant ?",
    "Le sommeil pris en fin de nuit, près de l'aube.",
    [
      "Le sommeil pris en fin de nuit, près de l'aube.",
      "Une longue sieste juste avant le coucher.",
      "Le sommeil pris uniquement en début d'après-midi."
    ]
  ),
  "s1-kp-014": scenario(
    "Étudier la nuit est précieux, mais cette étude ne doit pas conduire à manquer le Chema du matin. Une Mitsva ne doit pas être accomplie au détriment d'une autre obligation.",
    "Après avoir étudié toute la nuit, quelle priorité faut-il préserver le matin ?",
    "Réciter le Chema avant la fin de son horaire.",
    [
      "Réciter le Chema avant la fin de son horaire.",
      "Dormir jusqu'à midi sans prévoir de réveil.",
      "Remplacer le Chema par une nouvelle étude."
    ]
  ),
  "s1-kp-015": trueFalse(
    "Prier au lever du soleil est une pratique valorisée, mais elle ne justifie pas de dépasser l'heure du Chema ou de la prière. Il faut choisir un horaire qui protège ces limites.",
    "Il faut rechercher la prière à Nets même si l'on risque de dépasser l'heure du Chema.",
    "Faux",
    "La prière à Nets ne doit pas faire dépasser l'heure du Chema ou de la prière."
  ),
  "s1-kp-001": qcm(
    "La force spirituelle consiste à rester fidèle à une Mitsva même lorsque d'autres personnes se moquent. Elle ne demande ni agressivité ni recherche du conflit.",
    "Que faire si des personnes se moquent d'une Mitsva que l'on accomplit ?",
    "Continuer la Mitsva sans avoir honte.",
    [
      "Continuer la Mitsva sans avoir honte.",
      "Abandonner la Mitsva pour éviter les regards.",
      "Répondre immédiatement par une dispute."
    ]
  ),
  "s1-kp-002": scenario(
    "Ne pas avoir honte des Mitsvot ne signifie pas provoquer les autres. On reste ferme dans sa pratique tout en évitant la querelle et l'effronterie.",
    "Une personne se moque de ta pratique. Quelle réaction convient le mieux ?",
    "Rester fidèle à la Mitsva sans chercher la dispute.",
    [
      "Rester fidèle à la Mitsva sans chercher la dispute.",
      "L'insulter pour défendre la Mitsva.",
      "Renoncer définitivement à la Mitsva."
    ]
  ),
  "s1-kp-003": trueFalse(
    "La vigilance des yeux consiste à détourner rapidement le regard de ce qui ne convient pas. Cette réaction protège l'esprit avant que l'image ne s'y installe.",
    "Être vigilant signifie continuer à regarder puis essayer d'oublier plus tard.",
    "Faux",
    "La vigilance consiste à détourner rapidement les yeux de ce qu'il ne faut pas regarder."
  ),
  "s1-kp-017": qcm(
    "Certains grands maîtres évitaient les conversations ordinaires avant les premiers cantiques du matin. Cette pratique aide à donner une direction spirituelle aux premières paroles de la journée.",
    "Selon la pratique rapportée, quelles paroles évite-t-on au lever ?",
    "Les paroles profanes avant les cantiques du matin.",
    [
      "Les paroles profanes avant les cantiques du matin.",
      "Le Modé Ani prononcé au réveil.",
      "Toute parole pendant toute la matinée."
    ]
  ),
  "s1-kp-024": scenario(
    "La confrontation n'est envisagée que lorsque les intérêts de la Torah sont réellement empêchés et qu'aucune voie paisible n'est possible. Elle reste une exception, pas une manière habituelle d'agir.",
    "Des personnes empêchent une action nécessaire à la Torah. Que privilégier d'abord ?",
    "Chercher une solution paisible et n'affronter qu'en dernier recours.",
    [
      "Chercher une solution paisible et n'affronter qu'en dernier recours.",
      "Créer immédiatement une dispute publique.",
      "Ignorer toujours le problème, même s'il devient grave."
    ]
  ),
  "s1-kp-022": trueFalse(
    "Se rappeler que Dieu voit nos actions encourage une conduite honnête même lorsque personne ne nous observe. Cette présence à l'esprit concerne tous les lieux et tous les moments.",
    "Il suffit de penser à la présence de Dieu uniquement pendant la prière.",
    "Faux",
    "La présence de Dieu doit aussi guider nos choix dans la vie quotidienne."
  ),
  "s1-kp-023": qcm(
    "La crainte du Ciel n'est pas seulement une émotion. Elle se construit par des actes concrets : prier avec attention, rechercher la paix, respecter les autres et agir honnêtement.",
    "Comment renforcer concrètement sa crainte du Ciel ?",
    "Par la prière, la paix, le respect et l'honnêteté.",
    [
      "Par la prière, la paix, le respect et l'honnêteté.",
      "En jugeant sévèrement toutes les autres personnes.",
      "En multipliant les conflits religieux."
    ]
  ),
  "s1-kp-025": scenario(
    "Lorsqu'un signe religieux visible risque de provoquer un danger réel ou une hostilité importante, la prudence peut demander de rester discret. Protéger la personne ne signifie pas abandonner sa foi.",
    "Un signe religieux visible provoque un danger réel. Quelle attitude adopter ?",
    "Rester discret afin d'éviter le danger.",
    [
      "Rester discret afin d'éviter le danger.",
      "S'exposer volontairement pour être remarqué.",
      "Abandonner définitivement toute pratique."
    ]
  ),
  "s1-kp-026": trueFalse(
    "Une bonne action garde toute sa valeur lorsqu'elle reste discrète. La discrétion protège la sincérité et évite de transformer la Mitsva en moyen d'obtenir l'admiration.",
    "Pour avoir de la valeur, une bonne action doit toujours être racontée aux autres.",
    "Faux",
    "Il est préférable de garder ses bonnes actions discrètes lorsque cela est possible."
  ),
  "s1-kp-027": qcm(
    "La source permet une parole discrète destinée à cacher une pratique pieuse et à éviter l'orgueil. Cette permission ne doit pas devenir une autorisation générale de mentir.",
    "Pourquoi peut-on rester vague au sujet d'une pratique pieuse ?",
    "Pour rester humble et ne pas paraître orgueilleux.",
    [
      "Pour rester humble et ne pas paraître orgueilleux.",
      "Pour tromper les autres dans son intérêt.",
      "Pour éviter toutes les Mitsvot publiques."
    ]
  ),
  "s1-kp-028": scenario(
    "Avant la prière, penser à l'amour de Dieu aide à ne pas réciter les mots mécaniquement. Cette intention prépare une relation sincère avec Celui à qui l'on s'adresse.",
    "Quelle pensée peut préparer le cœur avant la prière du matin ?",
    "Penser à l'amour de Dieu.",
    ["Penser à l'amour de Dieu.", "Préparer sa liste de courses.", "Comparer sa prière à celle des autres."]
  ),
  "s1-kp-029": trueFalse(
    "Accepter la Mitsva d'aimer son prochain avant la prière rappelle que la relation avec Dieu ne se sépare pas du respect des autres.",
    "Avant la prière, on accepte la Mitsva d'aimer son prochain comme soi-même.",
    "Vrai",
    "Cette intention unit la prière à l'amour et au respect du prochain."
  ),
  "s1-kp-030": qcm(
    "La Kavana est l'attention et l'intention mises dans la prière. Quelques paroles comprises et récitées avec présence ont plus de valeur qu'une longue récitation distraite.",
    "Que vaut-il mieux privilégier dans la prière ?",
    "Peu de paroles avec attention.",
    ["Peu de paroles avec attention.", "Beaucoup de paroles sans attention.", "La vitesse avant la compréhension."]
  ),
  "s1-kp-031": scenario(
    "Le repos doit donner les forces nécessaires pour comprendre et approfondir la Torah. Se priver de sommeil au point de ne plus pouvoir étudier correctement manque le but recherché.",
    "La fatigue empêche d'étudier sérieusement. Que faut-il corriger ?",
    "Dormir suffisamment pour retrouver force et concentration.",
    [
      "Dormir suffisamment pour retrouver force et concentration.",
      "Continuer sans dormir jusqu'à ne plus comprendre.",
      "Abandonner définitivement l'étude approfondie."
    ]
  ),
  "s1-kp-032": trueFalse(
    "Les personnes ne se concentrent pas toutes de la même manière. Une voix audible ou un léger mouvement peuvent aider certains, tandis que d'autres ont besoin de calme.",
    "Tout le monde doit utiliser exactement la même voix et les mêmes mouvements pour prier.",
    "Faux",
    "Chacun choisit la manière respectueuse qui l'aide réellement à se concentrer."
  ),
  "s1-kp-033": qcm(
    "La Parachat HaAkéda raconte la ligature d'Isaac. Sa récitation avant Cha'harit rappelle le mérite des Patriarches et leur dévouement envers Dieu.",
    "À quel moment est-il bon de réciter la Parachat HaAkéda ?",
    "Avant la prière du matin, Cha'harit.",
    ["Avant la prière du matin, Cha'harit.", "Uniquement après Min'ha.", "Seulement après le repas du soir."]
  ),
  "s1-kp-034": qcm(
    "La Parachat HaAkéda appartient à la préparation de la prière du matin. Elle n'est normalement pas répétée à Min'ha ; le jour de Kippour constitue l'exception rapportée.",
    "À Min'ha un jour ordinaire, récite-t-on la Parachat HaAkéda ?",
    "Non, sauf le jour de Kippour.",
    ["Non, sauf le jour de Kippour.", "Oui, obligatoirement chaque jour.", "Oui, mais uniquement le vendredi."]
  ),
  "s1-kp-035": trueFalse(
    "La récitation de la Parachat HaAkéda n'est pas réservée aux jours de semaine. La pratique rapportée la maintient aussi le Chabbat et les jours de fête.",
    "On récite aussi la Parachat HaAkéda le Chabbat et les jours de fête.",
    "Vrai",
    "La pratique rapportée inclut le Chabbat et les jours de fête."
  ),
  "s1-kp-036": scenario(
    "Prier avec la communauté possède une grande importance. En cas de véritable retard, certains passages préparatoires peuvent être sautés afin de rejoindre la prière commune.",
    "On arrive en retard et la communauté va commencer. Que peut-on faire ?",
    "Sauter certains passages pour prier avec la communauté.",
    [
      "Sauter certains passages pour prier avec la communauté.",
      "Réciter chaque passage et manquer toute la prière commune.",
      "Quitter immédiatement la synagogue."
    ]
  ),
  "s1-kp-037": scenario(
    "Le Chabbat, lorsqu'il faut choisir entre certains ajouts, l'avis retenu maintient la Parachat HaAkéda et permet de sauter les Psaumes supplémentaires du Chabbat.",
    "En retard le Chabbat, quel passage maintient-on en priorité ?",
    "La Parachat HaAkéda.",
    ["Les Psaumes supplémentaires du Chabbat.", "La Parachat HaAkéda.", "Aucun passage : il faut prier seul."]
  ),
  "s1-kp-038": qcm(
    "La coutume séfarade relie ce verset au souvenir de la ligature d'Isaac. Il est récité après la Parachat HaAkéda et également avant Ézéhou Mekoman.",
    "Quel verset récite-t-on après la Parachat HaAkéda ?",
    "« Vécha'hat oto al yérekh hamizbéa'h... »",
    [
      "« Chéma Israël... »",
      "« Vécha'hat oto al yérekh hamizbéa'h... »",
      "« Baroukh Chéamar... »"
    ]
  ),
  "s1-kp-039": trueFalse(
    "Les Korbanot rappellent les sacrifices offerts au Temple. Même les érudits et les étudiants de Yéchiva sont invités à préserver cette récitation quotidienne.",
    "Les étudiants de Yéchiva sont dispensés de réciter les Korbanot chaque jour.",
    "Faux",
    "Même les érudits et les étudiants doivent s'efforcer de réciter les Korbanot."
  ),
  "s1-kp-040": scenario(
    "Les passages des Korbanot et Ézéhou Mekoman font aussi partie de la préparation de la prière pendant les jours saints. Ils ne sont pas réservés aux jours de semaine.",
    "Le Chabbat ou un jour de fête, que fait-on des Korbanot ?",
    "On les récite également selon la coutume rapportée.",
    [
      "On les récite également selon la coutume rapportée.",
      "On les remplace obligatoirement par le Chema.",
      "On les interdit jusqu'au lendemain."
    ]
  ),
  "s1-kp-041": trueFalse(
    "La source attribue une grande valeur spirituelle à la récitation des Korbanot et insiste particulièrement sur cette pratique en période d'épidémie ou de maladie grave.",
    "La récitation des Korbanot est présentée comme particulièrement importante en temps d'épidémie.",
    "Vrai",
    "La source lui attribue alors une valeur spirituelle et protectrice particulière."
  ),
  "s1-kp-042": qcm(
    "Ézéhou Mekoman décrit déjà l'ordre des différentes catégories de sacrifices. La coutume évite donc de répéter séparément certains passages qui y sont déjà inclus.",
    "Pourquoi certains passages de sacrifices ne sont-ils pas répétés séparément ?",
    "Parce qu'ils sont déjà inclus dans Ézéhou Mekoman.",
    [
      "Parce qu'ils sont déjà inclus dans Ézéhou Mekoman.",
      "Parce que tous les Korbanot sont interdits le matin.",
      "Parce qu'ils ne concernent que les jours de fête."
    ]
  ),
  "s1-kp-043": scenario(
    "Dans une maison de deuil, les passages habituels peuvent être récités par l'assemblée et par l'endeuillé. Toutefois, une coutume locale contraire doit être respectée.",
    "Dans une maison de deuil, comment récite-t-on les Korbanot ?",
    "On les récite, sauf si la coutume locale prévoit de les omettre.",
    [
      "On les récite, sauf si la coutume locale prévoit de les omettre.",
      "On les interdit toujours à toutes les personnes présentes.",
      "Seul un enfant peut les réciter."
    ]
  ),
  "s1-kp-044": trueFalse(
    "La coutume rapportée est de réciter les Korbanot assis. Se lever seul alors que toute la communauté reste assise peut donner l'impression d'afficher une piété supérieure, appelée Yohara.",
    "Il est préférable de se lever seul pour paraître plus rigoureux que la communauté.",
    "Faux",
    "On évite cette attitude de Yohara et l'on suit la position de la communauté."
  ),
  "s1-kp-045": qcm(
    "Un sacrifice expiatoire suppose que la personne sache qu'elle a commis une faute précise. La coutume n'ajoute donc pas une formule générale disant que l'on serait redevable d'un tel sacrifice.",
    "Quelle formule notre coutume omet-elle dans le Yehi Ratzon ?",
    "« Comme si j'étais redevable d'un sacrifice expiatoire. »",
    [
      "« Comme si j'étais redevable d'un sacrifice expiatoire. »",
      "« Je Te remercie de m'avoir rendu mon âme. »",
      "« Écoute Israël, Hachem est Un. »"
    ]
  ),
  "s1-kp-046": qcm(
    "Certains avis demandent aux femmes de réciter les Korbanot, mais la coutume actuelle n'en fait pas une obligation stricte. La règle conserve donc une nuance entre recommandation et obligation.",
    "Quel statut la récitation des Korbanot a-t-elle pour les femmes ?",
    "Elle n'est pas une obligation stricte selon la conclusion rapportée.",
    [
      "Elle n'est pas une obligation stricte selon la conclusion rapportée.",
      "Elle leur est entièrement interdite.",
      "Elle remplace obligatoirement toute leur prière."
    ]
  ),
  "s1-kp-047": trueFalse(
    "A priori, les Korbanot sont récités avant Baroukh Chéamar. Il faut prendre le temps d'articuler les mots clairement plutôt que de les avaler pour aller plus vite.",
    "Il vaut mieux avaler les mots des Korbanot pour terminer avant Baroukh Chéamar.",
    "Faux",
    "Les Korbanot doivent être récités avant Baroukh Chéamar avec une prononciation soignée."
  ),
  "s1-kp-048": scenario(
    "Lorsqu'il n'existe aucune autre possibilité, prier avec la communauté passe avant les Korbanot préparatoires. Ceux-ci peuvent alors être récités après la prière.",
    "On arrive très en retard à la synagogue. Que faire des Korbanot ?",
    "Les reporter après la prière pour rejoindre la communauté.",
    [
      "Les reporter après la prière pour rejoindre la communauté.",
      "Les réciter pendant la Amida de l'officiant.",
      "Renoncer à la prière avec la communauté pour toute la journée."
    ]
  ),
  "s1-kp-049": scenario(
    "Pendant la Hazarah, l'assemblée doit écouter la répétition de la Amida et répondre Amen aux bénédictions. Réciter un autre passage à ce moment ferait manquer cette participation.",
    "La Hazarah commence alors qu'il reste des Korbanot. Que faut-il faire ?",
    "Écouter la Hazarah et répondre Amen.",
    [
      "Écouter la Hazarah et répondre Amen.",
      "Lire les Korbanot à voix haute par-dessus l'officiant.",
      "Sortir jusqu'à la fin de la répétition."
    ]
  ),
  "s1-kp-050": trueFalse(
    "Les Korbanot correspondent à des sacrifices offerts pendant la journée. Leur récitation est donc rattachée au jour et commence normalement à partir de l'aube.",
    "Le moment normal des Korbanot commence à partir de l'aube.",
    "Vrai",
    "Leur récitation est liée aux horaires diurnes des sacrifices du Temple."
  ),
  "s1-kp-051": qcm(
    "La source rapporte un avis particulier pour les personnes obligées de se lever très tôt. Cet horaire exceptionnel ne devient pas la définition générale de l'aube.",
    "Que doit retenir une personne obligée de se lever très tôt ?",
    "Il existe un horaire particulier rapporté pour ce cas.",
    [
      "Il existe un horaire particulier rapporté pour ce cas.",
      "Tous les horaires du matin sont supprimés.",
      "Les Korbanot doivent toujours être récités avant minuit."
    ]
  ),
  "s1-kp-052": scenario(
    "La légère pause entre « Abayé » et « havé » évite que les deux mots se mélangent et produisent une sonorité pouvant ressembler au Nom divin.",
    "Comment prononcer de préférence « Abayé havé mesader » ?",
    "Avec une légère pause entre « Abayé » et « havé ».",
    [
      "Avec une légère pause entre « Abayé » et « havé ».",
      "En supprimant entièrement le mot « havé ».",
      "En répétant chaque mot trois fois."
    ]
  ),
  "s1-kp-053": trueFalse(
    "Le Pitoum HaKetoret décrit l'encens offert au Temple. La pratique rapportée invite à le réciter avec attention le matin et également pendant la prière de Min'ha.",
    "Le Pitoum HaKetoret peut être récité le matin et à Min'ha.",
    "Vrai",
    "La pratique rapportée demande de le réciter à ces deux moments avec concentration."
  ),
  "s1-kp-054": qcm(
    "On peut penser que la récitation de l'encens tient lieu de son offrande, mais cette demande ne se prononce pas verbalement. L'intention reste dans le cœur.",
    "Comment exprimer l'intention liée au Pitoum HaKetoret ?",
    "La penser dans son cœur sans la prononcer.",
    [
      "La penser dans son cœur sans la prononcer.",
      "La crier avant chaque phrase.",
      "Ne jamais avoir aucune intention."
    ]
  ),
  "s1-kp-055": scenario(
    "Certaines personnes écrivent le Pitoum HaKetoret sur parchemin comme Ségoula, c'est-à-dire comme pratique porteuse de mérite. La source discute toutefois le problème d'écrire un passage biblique isolé.",
    "Avant d'écrire le Pitoum HaKetoret seul, que faut-il vérifier ?",
    "Les réserves halakhiques concernant un passage isolé.",
    [
      "Les réserves halakhiques concernant un passage isolé.",
      "Uniquement la couleur de l'encre.",
      "S'il peut remplacer une Mézouza."
    ]
  ),
  "s1-kp-056": trueFalse(
    "Les versets possèdent une sainteté particulière. Les écrire sur un mur, une boîte ou un objet demande donc des précautions pour éviter qu'ils soient traités sans respect.",
    "On peut écrire n'importe quel verset sur n'importe quel objet sans précaution.",
    "Faux",
    "L'écriture de versets sur des supports exige de préserver leur sainteté."
  ),
  "s1-kp-057": qcm(
    "La lecture privée des Dix Commandements et du passage de la Manne est permise. Leur récitation fixe dans l'office public est évitée afin de ne pas donner l'impression que ces textes sont plus importants que le reste de la Torah.",
    "Comment lire les Dix Commandements et le passage de la Manne ?",
    "En privé, sans les intégrer à l'office public.",
    [
      "En privé, sans les intégrer à l'office public.",
      "Uniquement au milieu de la Amida.",
      "En remplacement du Chema à la synagogue."
    ]
  ),
  "s1-kp-058": qcm(
    "Le Tikkoun 'Hatsot est une prière de la nuit qui exprime la peine causée par la destruction du Temple et l'éloignement de la présence divine, appelée Chékhina.",
    "Quel est le but principal du Tikkoun 'Hatsot ?",
    "Exprimer la peine liée au Temple détruit et à l'exil de la Chékhina.",
    [
      "Exprimer la peine liée au Temple détruit et à l'exil de la Chékhina.",
      "Remplacer toutes les prières de la journée.",
      "Célébrer uniquement les événements joyeux."
    ]
  ),
  "s1-kp-059": trueFalse(
    "La tristesse exprimée pendant le Tikkoun concerne la destruction du Temple. Elle ne doit pas devenir un état permanent : la prière et l'étude de la Torah se vivent avec joie.",
    "Après le Tikkoun 'Hatsot, il faut rester triste pendant la prière et l'étude.",
    "Faux",
    "Même après le Tikkoun, la prière et l'étude doivent être vécues avec joie."
  ),
  "s1-kp-060": scenario(
    "Tikkoun Rachel est la partie du Tikkoun qui exprime le deuil. S'asseoir au sol ou sur un petit support rend cette attitude de peine visible dans la posture du corps.",
    "Quelle posture adopte-t-on pour Tikkoun Rachel ?",
    "On s'assoit au sol ou sur un petit support.",
    [
      "On s'assoit au sol ou sur un petit support.",
      "On reste obligatoirement debout sur une chaise.",
      "On marche rapidement dans la pièce."
    ]
  ),
  "s1-kp-061": qcm(
    "Les Ben HaMetsarim, ou Trois Semaines, sont une période de deuil pour la destruction du Temple. La coutume ajoute alors un Tikkoun après le milieu de la journée.",
    "Quand récite-t-on le Tikkoun exceptionnellement l'après-midi ?",
    "Pendant les Ben HaMetsarim, après le milieu du jour.",
    [
      "Pendant les Ben HaMetsarim, après le milieu du jour.",
      "Tous les vendredis avant le repas.",
      "Pendant tout le mois de Nissan."
    ]
  ),
  "s1-kp-062": trueFalse(
    "Avant 'Hatsot, le début de la nuit est associé à une qualité spirituelle différente. La règle générale évite alors le Tikkoun et la lecture des Téhilim, sauf exceptions précises.",
    "En règle générale, on évite les Téhilim en début de nuit avant 'Hatsot.",
    "Vrai",
    "La règle générale reporte le Tikkoun et les Téhilim après le milieu de la nuit."
  ),
  "s1-kp-063": scenario(
    "La source reconnaît des exceptions pour certaines nuits et certains besoins importants. Elles ne suppriment pas la règle générale et doivent rester limitées aux situations prévues.",
    "Quand peut-on lire des Téhilim avant 'Hatsot selon l'exception rapportée ?",
    "Pour certains besoins précis, comme une naissance imminente.",
    [
      "Pour certains besoins précis, comme une naissance imminente.",
      "Dès que l'on préfère éviter toute autre étude.",
      "Uniquement parce que l'on se sent fatigué."
    ]
  ),
  "s1-kp-064": qcm(
    "'Hatsot n'est pas toujours minuit à l'heure de la montre. Son calcul dépend des horaires du soleil dans le lieu où se trouve la personne.",
    "De quoi dépend le calcul de 'Hatsot ?",
    "Du lieu et des horaires locaux du lever et du coucher du soleil.",
    [
      "Du lieu et des horaires locaux du lever et du coucher du soleil.",
      "Toujours de minuit exactement sur la montre.",
      "Uniquement du jour de la semaine."
    ]
  ),
  "s1-kp-065": trueFalse(
    "Après l'aube, les deux parties du Tikkoun n'ont pas le même statut. Tikkoun Léa peut encore être récité, tandis que Tikkoun Rachel est omis.",
    "Après l'aube, on peut encore réciter Tikkoun Rachel comme Tikkoun Léa.",
    "Faux",
    "Après l'aube, Tikkoun Léa reste possible, mais pas Tikkoun Rachel."
  ),
  "s1-kp-066": scenario(
    "Lorsqu'un groupe de la communauté suit cette pratique, le Tikkoun peut être récité publiquement à la synagogue. Cette récitation collective n'est pas considérée comme une démonstration d'orgueil.",
    "Un groupe veut réciter Tikkoun 'Hatsot à la synagogue. Est-ce possible ?",
    "Oui, une partie de la communauté peut le réciter publiquement.",
    [
      "Oui, une partie de la communauté peut le réciter publiquement.",
      "Non, toute récitation publique est interdite.",
      "Oui, mais uniquement à la place de Cha'harit."
    ]
  ),
  "s1-kp-067": scenario(
    "La majorité des femmes n'ont pas l'habitude de réciter Tikkoun 'Hatsot. Cependant, la conclusion rapportée permet à celle qui le souhaite de le faire et demande de ne pas l'en empêcher.",
    "Une femme souhaite réciter Tikkoun 'Hatsot. Quelle réponse convient ?",
    "Ne pas l'en empêcher, même si ce n'est pas la coutume répandue.",
    [
      "Ne pas l'en empêcher, même si ce n'est pas la coutume répandue.",
      "Lui dire que cette prière lui est toujours interdite.",
      "Lui imposer cette récitation comme obligation stricte."
    ]
  ),
  "s1-kp-068": trueFalse(
    "Le Talmid 'Hakham récite le texte établi du Tikkoun, puis retourne à son étude. Ajouter de longues lamentations au détriment de la Torah ferait perdre une priorité essentielle.",
    "Un Talmid 'Hakham doit prolonger les lamentations même si cela supprime son étude.",
    "Faux",
    "Il récite le Tikkoun prévu puis préserve son temps d'étude de la Torah."
  ),
  "s1-kp-069": qcm(
    "Dans le contexte rapporté, lorsqu'il est réellement impossible d'accomplir les deux, le Tikkoun 'Hatsot reçoit la priorité sur les Séli'hot.",
    "En Éloul, si l'on ne peut faire ni le Tikkoun ni les Séli'hot ensemble, que choisir ?",
    "Le Tikkoun 'Hatsot.",
    ["Le Tikkoun 'Hatsot.", "Les Séli'hot dans tous les cas.", "Aucun des deux, même si l'un reste possible."]
  ),
  "s1-kp-070": scenario(
    "Les nuits liées à une grande joie ont un statut particulier. On ne récite pas le Tikkoun chez un jeune marié et il est préférable que le père, le Mohel et le Sandak s'en abstiennent avant une Brit Mila.",
    "Qui s'abstient de préférence du Tikkoun la nuit avant une Brit Mila ?",
    "Le père du bébé, le Mohel et le Sandak.",
    ["Le père du bébé, le Mohel et le Sandak.", "Tous les habitants de la ville.", "Uniquement les enfants présents."]
  ),
  "s1-kp-071": trueFalse(
    "Tikkoun Rachel est centré sur la destruction du Temple. Tikkoun Léa contient surtout des louanges, des demandes et des remerciements.",
    "Tikkoun Rachel et Tikkoun Léa ont exactement le même contenu et le même rôle.",
    "Faux",
    "Rachel exprime surtout la peine ; Léa contient surtout louanges et demandes."
  ),
  "s1-kp-072": qcm(
    "Les jours joyeux ne reçoivent pas tous le même traitement. Certains omettent seulement Tikkoun Rachel pour éviter la tristesse ; lors d'autres nuits festives, les deux parties sont omises.",
    "Pourquoi Tikkoun Rachel est-il omis certains jours joyeux ?",
    "Parce qu'il ne convient pas d'y évoquer la tristesse.",
    [
      "Parce qu'il ne convient pas d'y évoquer la tristesse.",
      "Parce que toute prière y est interdite.",
      "Parce que Tikkoun Léa devient un sacrifice."
    ]
  ),
  "s1-kp-073": qcm(
    "Ticha Béav est consacré au deuil du Temple et limite l'étude aux sujets tristes. Tikkoun Rachel correspond à cette atmosphère, tandis que Tikkoun Léa est omis.",
    "Quelle partie du Tikkoun récite-t-on la nuit de Ticha Béav ?",
    "Tikkoun Rachel seulement.",
    ["Tikkoun Rachel seulement.", "Tikkoun Léa seulement.", "Les deux parties sans modification."]
  ),
  "s1-kp-074": trueFalse(
    "Pendant l'année de Chémita, la coutume en Terre d'Israël omet Tikkoun Rachel, mais continue Tikkoun Léa. En diaspora, Tikkoun Rachel reste récité comme les autres années.",
    "En Chémita, la diaspora omet Tikkoun Rachel exactement comme la Terre d'Israël.",
    "Faux",
    "Cette omission concerne la Terre d'Israël ; en diaspora, la pratique habituelle continue."
  ),
  "s1-kp-075": scenario(
    "Le Vidouï est normalement récité avant le Tikkoun. Lorsqu'il vient d'être dit à Min'ha, dans le Chema du coucher ou dans les Séli'hot proches, on évite de le répéter inutilement.",
    "Le Vidouï vient d'être récité juste avant le Tikkoun. Que fait-on ?",
    "On ne le répète pas une seconde fois.",
    ["On ne le répète pas une seconde fois.", "On le répète obligatoirement trois fois.", "On annule tout le Tikkoun."]
  ),
  "s1-kp-076": scenario(
    "Dans une maison de deuil, l'avis principal omet Tikkoun Rachel et conserve Tikkoun Léa avec une adaptation. Un autre avis demande à l'endeuillé d'omettre les deux pendant les sept jours de Chiva.",
    "Dans une maison de deuil, quelle pratique est rapportée pour le Tikkoun ?",
    "Omettre Rachel ; un autre avis omet les deux parties pour l'endeuillé.",
    [
      "Omettre Rachel ; un autre avis omet les deux parties pour l'endeuillé.",
      "Réciter obligatoirement les deux parties sans adaptation.",
      "Remplacer le Tikkoun par la Parachat HaAkéda."
    ]
  )
});

export const getSiman1LearningRewrite = (knowledgePointId) => (
  SIMAN_1_LEARNING_REWRITE[knowledgePointId] || null
);
