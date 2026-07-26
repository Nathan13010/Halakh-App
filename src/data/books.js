export const FALLBACK_PARAGRAPHS = [
  {
    id: "p1",
    seif: 1,
    numero: 1,
    texte_integral: {
      hebreu_sans_voyelles: "כל המבשל בשבת במזיד אסור לו לעולם, ולאחרים מותר במוצאי שבת מיד.",
      hebreu_avec_voyelles: "כָּל הַמְבַשֵּׁל בְּשัׁבָּת בְּמֵזִיד אָסוּר לוֹ לְעוֹלָם, וּלְאַחֵרִים מוּתָּר בְּמוֹצָאֵי שַׁבָּת מִיָּד.",
      francais: "Quiconque cuit délibérément pendant le Chabbat, l'aliment lui est interdit à tout jamais ; quant aux autres, cela leur est permis immédiatement à l'issue de Chabbat."
    },
    mots_alignes: [
      { id: 1, hebreu_brut: "כל", hebreu_voyelles: "כָּל", francais_mot: "Tout / Quiconque", expression_contexte: "Terme englobant s'appliquant à toute personne sans distinction de statut." },
      { id: 2, hebreu_brut: "המבשל", hebreu_voyelles: "הַמְבַשֵּׁל", francais_mot: "qui cuit", expression_contexte: "La cuisson (Bishul) est l'une des 39 activités prohibées (Melahot) de Chabbat, consistant à amollir ou transformer un aliment par la chaleur." },
      { id: 3, hebreu_brut: "בשבת", hebreu_voyelles: "בְּשัׁבָּת", francais_mot: "pendant le Chabbat", expression_contexte: "Durant le jour saint du repos hebdomadaire hébraïque." },
      { id: 4, hebreu_brut: "במזיד", hebreu_voyelles: "בְּמֵזִיד", francais_mot: "intentionnellement", expression_contexte: "Agir avec préméditation et pleine conscience de l'interdit religieux, par opposition à une action involontaire (Beshogeg)." },
      { id: 5, hebreu_brut: "אסור", hebreu_voyelles: "אָסוּר", francais_mot: "est interdit", expression_contexte: "Interdiction stricte d'en tirer un bénéfice gustatif ou utilitaire." },
      { id: 6, hebreu_brut: "לו", hebreu_voyelles: "לוֹ", francais_mot: "pour lui", expression_contexte: "Pour l'auteur même de la transgression de Chabbat." },
      { id: 7, hebreu_brut: "לעולם", hebreu_voyelles: "לְעוֹלָם", francais_mot: "à tout jamais", expression_contexte: "Une amende perpétuelle imposée par les sages (Keness) afin de pénaliser durablement le transgresseur volontaire." },
      { id: 8, hebreu_brut: "ולאחרים", hebreu_voyelles: "וּלְאַחֵרִים", francais_mot: "et pour les autres", expression_contexte: "Pour tous les individus en dehors du transgresseur lui-même." },
      { id: 9, hebreu_brut: "מותר", hebreu_voyelles: "מוּתָּר", francais_mot: "il est permis", expression_contexte: "L'aliment n'a pas subi de modification intrinsèque qui le rendrait impure, il redevient autorisé lors de l'expiration du temps sacré." },
      { id: 10, hebreu_brut: "במוצאי", hebreu_voyelles: "בְּמוֹצָאֵי", francais_mot: "à l'issue", expression_contexte: "La fin du Chabbat, après l'apparition des trois étoiles." },
      { id: 11, hebreu_brut: "שבת", hebreu_voyelles: "שַׁבָּת", francais_mot: "de Chabbat", expression_contexte: "Le retour au temps profane de la semaine active." },
      { id: 12, hebreu_brut: "מיד", hebreu_voyelles: "מִיָּד", francais_mot: "immédiatement", expression_contexte: "Sans exiger d'attendre la durée de temps nécessaire à la réalisation du travail (Mouthar miyad), car la cuisson n'est pas pour autrui." }
    ]
  },
  {
    id: "p2",
    seif: 2,
    numero: 2,
    texte_integral: {
      hebreu_sans_voyelles: "ובשוגג, מותר בין לו ובין לאחרים במוצאי שבת, ובשבת עצמה אסור אף לאחרים.",
      hebreu_avec_voyelles: "וּבְשׁוֹגֵג, מוּתָּר בֵּין לוֹ וּבֵין לַאֲחֵרִים בְּמוֹצָאֵי שַׁבָּת, וּבְשַׁבָּת עַצְמָהּ אָסוּר אַף לַאֲחֵרִים.",
      francais: "Et s'il a agi par mégarde, l'aliment est consommer tant pour lui-même que pour de tierces personnes à l'issue de Chabbat ; toutefois, durant le jour même de Chabbat, il demeure formellement interdit à tous."
    },
    mots_alignes: [
      { id: 1, hebreu_brut: "ובשוגג", hebreu_voyelles: "וּבְשׁוֹגֵג", francais_mot: "et par inadvertance / mégarde", expression_contexte: "Sans intention malveillante ou ignorance momentanée de l'interdit de cuisson." },
      { id: 2, hebreu_brut: "mותר", hebreu_voyelles: "מוּתָּר", francais_mot: "autorisé", expression_contexte: "Aucune pénalisation irréversible n'est décrétée dans ce cas." },
      { id: 3, hebreu_brut: "בין", hebreu_voyelles: "בֵּין", francais_mot: "soit", expression_contexte: "Alternative englobant deux cas distincts." },
      { id: 4, hebreu_brut: "לו", hebreu_voyelles: "לוֹ", francais_mot: "pour lui", expression_contexte: "L'auteur involontaire de l'infraction." },
      { id: 5, hebreu_brut: "ובין", hebreu_voyelles: "וּבֵין", francais_mot: "soit", expression_contexte: "Seconde option." },
      { id: 6, hebreu_brut: "לאחרים", hebreu_voyelles: "לַאֲחֵרִים", francais_mot: "pour autrui", expression_contexte: "Tout autre membre de la communauté." },
      { id: 7, hebreu_brut: "במוצאי", hebreu_voyelles: "בְּמוֹצָאֵי", francais_mot: "au sortir", expression_contexte: "À l'extinction de la journée sainte." },
      { id: 8, hebreu_brut: "שבת", hebreu_voyelles: "שַׁבָּת", francais_mot: "de Chabbat", expression_contexte: "Le début de la semaine." },
      { id: 9, hebreu_brut: "ובשבת", hebreu_voyelles: "וּבְשַׁבָּת", francais_mot: "et durant Chabbat", expression_contexte: "Pendant les heures effectives de la journée de repos." },
      { id: 10, hebreu_brut: "עצמה", hebreu_voyelles: "עַצְמָהּ", francais_mot: "elle-même", expression_contexte: "Tant qu'il fait encore jour et que le jour sacré n'est pas clos." },
      { id: 11, hebreu_brut: "אסור", hebreu_voyelles: "אָסוּר", francais_mot: "interdit", expression_contexte: "Ne peut pas être consommé afin d'empêcher qu'on profite d'une profanation." },
      { id: 12, hebreu_brut: "אף", hebreu_voyelles: "אַף", francais_mot: "même", expression_contexte: "Adverbe accentuant la rigueur de l'assemblée." },
      { id: 13, hebreu_brut: "לאחרים", hebreu_voyelles: "לַאֲחֵרִים", francais_mot: "pour autrui", expression_contexte: "Pour tout être tiers afin d'éviter toute complaisance ou abus de cuisson accidentelle." }
    ]
  }
];

export const BOOKS = [
  {
    id: "yalkout-1",
    title: "Yalkout Yossef",
    subtitle: "Siman 1 - Lois du Matin - Hilkhot Hashkamat Haboker",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Lois sur le réveil et les prières du matin. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-amber-900 via-amber-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-1", title: "Siman 1" }]
  },
  {
    id: "yalkout-2",
    title: "Yalkout Yossef",
    subtitle: "Siman 2 - Lois de l'Habillage - Hilkhot Malboush",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Lois sur l'habillage et la couverture de la tête. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-2", title: "Siman 2" }]
  },
  {
    id: "yalkout-3",
    title: "Yalkout Yossef",
    subtitle: "Siman 3 - Conduite aux Toilettes - Hanagates Bet Hakisse",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Lois sur la conduite et les règles de pudeur aux toilettes. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-purple-900 via-violet-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-3", title: "Siman 3" }]
  },
  {
    id: "yalkout-4",
    title: "Yalkout Yossef",
    subtitle: "Siman 4 - Ablutions du Matin - Netilat Yadaïm",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Lois de l'ablution des mains au réveil. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-cyan-900 via-blue-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-4", title: "Siman 4" }]
  },
  {
    id: "yalkout-5",
    title: "Yalkout Yossef",
    subtitle: "Siman 5 - L'intention dans les Bénédictions - Kavanat HaBerakhot",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Lois de la kavanah (intention) lors des bénédictions et de la prononciation des Noms Sains. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-5", title: "Siman 5" }]
  },
  {
    id: "yalkout-6",
    title: "Yalkout Yossef",
    subtitle: "Siman 6 - Asher Yatsar & Elohaï Neshaman",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Lois des bénédictions Asher Yatsar et Elohaï Neshaman. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-teal-900 via-emerald-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-6", title: "Siman 6" }]
  },
  {
    id: "yalkout-7",
    title: "Yalkout Yossef",
    subtitle: "Siman 7 - Bénédictions du Matin - Birkhot HaShahar",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Lois d'Elohaï Neshamah et des bénédictions du matin. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-violet-900 via-purple-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-7", title: "Siman 7" }]
  },
  {
    id: "yalkout-8",
    title: "Yalkout Yossef",
    subtitle: "Siman 8 - Lois du Tsitsit & Tallit - Hilkhot Tzitzi",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Lois fondamentales du port du Tsitsit et du Tallit Katan/Gadol. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-blue-900 via-sky-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-8", title: "Siman 8" }]
  },
  {
    id: "yalkout-9",
    title: "Yalkout Yossef",
    subtitle: "Siman 9 - Port du Tallit & Bénédiction",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Lois de l'enveloppement du Tallit, de la bénédiction et de la kavanah. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-indigo-900 via-blue-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-9", title: "Siman 9" }]
  },
  {
    id: "yalkout-10",
    title: "Yalkout Yossef",
    subtitle: "Siman 10 - Confection du Tsitsit & Sainteté",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Lois de la fabrication des fils Lishmah et du respect des franges. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-cyan-900 via-blue-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-10", title: "Siman 10" }]
  },
  {
    id: "yalkout-11",
    title: "Yalkout Yossef",
    subtitle: "Siman 11 - Fils du Tsitsit, Nœuds & Enroulements",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Lois des 8 brins, des 5 doubles nœuds et des enroulements (Holiot). Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-teal-900 via-emerald-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-11", title: "Siman 11" }]
  },
  {
    id: "yalkout-12",
    title: "Yalkout Yossef",
    subtitle: "Siman 12 - Trou du Tsitsit & Fixation au Vêtement",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Lois sur l'emplacement halakhique du trou et la fixation des franges. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-emerald-900 via-green-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-12", title: "Siman 12" }]
  },
  {
    id: "yalkout-13",
    title: "Yalkout Yossef",
    subtitle: "Siman 13 - Vêtement Emprunté ou Acheté",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Règles du Tallit emprunté et délai des 30 jours. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-sky-900 via-indigo-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-13", title: "Siman 13" }]
  },
  {
    id: "yalkout-14",
    title: "Yalkout Yossef",
    subtitle: "Siman 14 - Respect du Tallit au Quotidien",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Règles de respect des franges et interdiction d'inconvenance. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-blue-900 via-slate-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-14", title: "Siman 14" }]
  },
  {
    id: "yalkout-15",
    title: "Yalkout Yossef",
    subtitle: "Siman 15 - Le Tsitsit la Nuit",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Règles de l'exemption nocturne de la bénédiction. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-15", title: "Siman 15" }]
  },
  {
    id: "yalkout-16",
    title: "Yalkout Yossef",
    subtitle: "Siman 16 - Le Tsitsit au Cimetière (Lo'eg LaRash)",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Dissimuler les franges au cimetière par respect pour les défunts. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-stone-900 via-zinc-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-16", title: "Siman 16" }]
  },
  {
    id: "yalkout-17",
    title: "Yalkout Yossef",
    subtitle: "Siman 17 - Exemption des Femmes concernant le Tsitsit",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Exemption des Mitsvot positives liées au temps. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-purple-900 via-pink-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-17", title: "Siman 17" }]
  },
  {
    id: "yalkout-18",
    title: "Yalkout Yossef",
    subtitle: "Siman 18 - Priorité du Tallit sur les Tefillines",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Priorité halakhique du Tsitsit (Tadir) sur le Tefillin le matin. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-amber-900 via-yellow-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-18", title: "Siman 18" }]
  },
  {
    id: "yalkout-19",
    title: "Yalkout Yossef",
    subtitle: "Siman 19 - Vêtement en Cuir et Étoffe Spéciale",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Statut halakhique des vêtements non tissés. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-orange-900 via-amber-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-19", title: "Siman 19" }]
  },
  {
    id: "yalkout-20",
    title: "Yalkout Yossef",
    subtitle: "Siman 20 - Don ou Vente d'un Tallit à un Non-Juif",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Obligation de retirer les franges avant la vente à un non-juif. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-red-900 via-amber-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-20", title: "Siman 20" }]
  },
  {
    id: "yalkout-318",
    title: "Yalkout Yossef",
    subtitle: "Siman 318 - Lois de Chabbat - Hilkhot Bishul (La Cuisson)",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Lois fondamentales concernant les règles de cuisson pendant le Chabbat. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-318", title: "Siman 318" }]
  },
  {
    id: "choulhan-aroukh-319",
    title: "Choulhan Aroukh",
    subtitle: "Siman 319 - Hilkhot Borer (Le Tri le Chabbat)",
    author: "Rav Yosef Karo",
    category: "Halakha",
    description: "Règles halakhiques concernant le tri durant le Chabbat. Prochainement disponible à l'étude interactive.",
    coverColor: "bg-gradient-to-br from-red-950 via-red-900 to-amber-950/80",
    isUnlocked: false,
    chapters: []
  },
  {
    id: "mishna-beroura-3",
    title: "Mishna Beroura",
    subtitle: "Volume 3 - Hilkhot Chabbat",
    author: "Hafetz Haïm",
    category: "Commentaire / Halakha",
    description: "Le commentaire indispensable sur les lois sabbatiques synthétisant les coutumes séfarades et ashkénazes. Prochainement.",
    coverColor: "bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950",
    isUnlocked: false,
    chapters: []
  }
];
