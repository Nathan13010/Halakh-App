import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// Common dictionary for Hebrew words to French translation + Infinitives
const DICT = {
  "ציצית": { fr: "Tsitsit (Franges)", context: "Tsitsit" },
  "טלית": { fr: "Tallit", context: "Tallit" },
  "גדול": { fr: "Gadol (Grand)", context: "Gadol" },
  "קטן": { fr: "Katan (Petit)", context: "Katan" },
  "בגד": { fr: "Vêtement", context: "Vêtement" },
  "בגדים": { fr: "Vêtements", context: "Vêtements" },
  "חייב": { fr: "Soumis / Obligé", context: "Soumis" },
  "פטור": { fr: "Exempt", context: "Exempt" },
  "כנף": { fr: "Coin / Aile", context: "Coin" },
  "כנפות": { fr: "Coins", context: "Coins" },
  "חוטים": { fr: "Fils / Brins", context: "Fils" },
  "חוטי": { fr: "Fils de", context: "Fils de" },
  "קשר": { fr: "Nœud", context: "Nœud" },
  "קשרים": { fr: "Nœuds", context: "Nœuds" },
  "מברך": { fr: "Bénit / Récite la bénédiction", context: "Bénit", infinitif: "לְבָרֵךְ = Bénir" },
  "לברך": { fr: "De bénir / réciter", context: "De bénir", infinitif: "לְבָרֵךְ = Bénir" },
  "ברכה": { fr: "Bénédiction", context: "Bénédiction" },
  "ברכות": { fr: "Bénédictions", context: "Bénédictions" },
  "הקב״ה": { fr: "Le Saint béni soit-Il", context: "Le Saint béni soit-Il" },
  "הקדוש": { fr: "Le Saint", context: "Le Saint" },
  "ברוך": { fr: "Béni soit", context: "Béni soit" },
  "הוא": { fr: "Il", context: "Il" },
  "מצוה": { fr: "Mitsva (Commandement)", context: "Mitsva" },
  "מצות": { fr: "Mitsvot", context: "Mitsvot" },
  "תורה": { fr: "Torah", context: "Torah" },
  "הלכה": { fr: "Halakha (Loi)", context: "Halakha" },
  "יום": { fr: "Jour", context: "Jour" },
  "לילה": { fr: "Nuit", context: "Nuit" },
  "נשים": { fr: "Les femmes", context: "Les femmes" },
  "אנשים": { fr: "Les hommes", context: "Les hommes" },
  "עבד": { fr: "Esclave / Serviteur", context: "Esclave" },
  "גוי": { fr: "Non-juif", context: "Non-juif" },
  "כותנה": { fr: "Coton", context: "Coton" },
  "צמר": { fr: "Laine", context: "Laine" },
  "פשתן": { fr: "Lin", context: "Lin" },
  "מותר": { fr: "Permis", context: "Permis" },
  "אסור": { fr: "Interdit", context: "Interdit" },
  "לבוש": { fr: "Vêtu", context: "Vêtu" },
  "ללבוש": { fr: "Revêtir / Porter", context: "Revêtir", infinitif: "לִלְבֹּשׁ = Revêtir / Porter" },
  "עטיפה": { fr: "Enveloppement", context: "Enveloppement" },
  "להתעטף": { fr: "S'envelopper", context: "S'envelopper", infinitif: "לְהִתְעַטֵּף = S'envelopper" },
  "כוונה": { fr: "Intention / Kavanah", context: "Kavanah" },
  "להתכוון": { fr: "Avoir l'intention", context: "Avoir l'intention", infinitif: "לְהִתְכַּוֵּן = Avoir l'intention" },
  "שמחה": { fr: "Joie", context: "Joie" },
  "קדושה": { fr: "Sainteté", context: "Sainteté" },
  "שיעור": { fr: "Mesure halakhique", context: "Mesure" },
  "פסול": { fr: "Invalide (Passoul)", context: "Invalide" },
  "כשר": { fr: "Kasher / Valide", context: "Kasher" },
  "לשמה": { fr: "Lishmah (intention sacrée)", context: "Lishmah" },
  "עשייה": { fr: "Action / Confection", context: "Confection" },
  "לעשות": { fr: "Faire / Confectionner", context: "Confectionner", infinitif: "לַעֲשׂוֹת = Faire / Confectionner" },
  "שנאמר": { fr: "Comme il est dit", context: "Comme il est dit", infinitif: "לֵאָמֵר = Être dit" },
  "וראיתם": { fr: "Et vous le verrez", context: "Et vous le verrez", infinitif: "לִרְאוֹת = Voir" },
  "וזכרתם": { fr: "Et vous vous rappellerez", context: "Et vous vous rappellerez", infinitif: "לִזְכֹּר = Se rappeler" }
};

// Data definition for Simanim 10 to 20
const SIMANIM_DATA = [
  {
    siman: "10",
    sujet_fr: "Chapitre 10 - Lois de la confection du Tsitsit et de la sainteté des franges",
    halakhot: [
      {
        seif: "1",
        titre_seif: "Fabrication des fils Lishmah (avec intention sacrée)",
        brut: "א. חוטי הציצית צריכים להיות נטווים ונשזרים לשמה, דהיינו לשם מצות ציצית. ואם נטוו שלא לשמה, הציצית פסולה.",
        voyelles: "א. חוּטֵי הַצִּיצִית צְרִיכִים לִהְיוֹת נִטְוִים וְנִשְׁזָרִים לִשְׁמָהּ, דְּהַיְנוּ לְשֵׁם מִצְוַת צִיצִית. וְאִם נִטְווּ שֶׁלֹּא לִשְׁמָהּ, הַצִּיצִית פְּסוּלָה.",
        francais: "1. Les fils du Tsitsit doivent être filés et tordus Lishmah (avec l'intention d'accomplir la Mitsva du Tsitsit). Si les fils ont été fabriqués sans cette intention, le Tsitsit est invalide."
      },
      {
        seif: "2",
        titre_seif: "Confection des fils par un Juif majeur",
        brut: "ב. צריך שהטוויה והשזירה של חוטי הציצית תעשה על ידי בן ישראל גדול בר דעת, או קטן תחת השגחת גדול המורה לו לטוות לשמה.",
        voyelles: "ב. צָרִיךְ שֶׁהַטְּוִיָּה וְהַשְּׁזִירָה שֶׁל חוּטֵי הַצִּיצִית תֵּעָשֶׂה עַל יְדֵי בֶּן יִשְׂרָאֵל גָּדוֹל בַּר דַּעַת, אוֹ קָטָן תַּחַת הַשְׁגָּחַת גָּדוֹל הַמּוֹרֶה לוֹ לִטְווֹת לִשְׁמָהּ.",
        francais: "2. La filature et le tressage des fils de Tsitsit doivent être effectués par un Juif majeur responsable, ou par un mineur sous la supervision directe d'un adulte lui ordonnant de filer Lishmah."
      },
      {
        seif: "3",
        titre_seif: "Sainteté des franges et interdiction de mépris",
        brut: "ג. חוטי הציצית יש בהם קדושה, ואין להשתמש בהם תשמיש מגונה או לצרכי חול, אלא יש להקפיד בכבודם בכל עת.",
        voyelles: "ג. חוּטֵי הַצִּיצִית יֵשׁ בָּהֶם קְדֻשָּׁה, וְאֵין לְהִשְׁתַּמֵּשׁ בָּהֶם תַּשְׁמִישׁ מְגֻנֶּה אוֹ לְצָרְכֵי חוֹל, אֶלָּא יֵשׁ לְהַקְפִּיד בִּכְבוֹדָם בְּכָל עֵת.",
        francais: "3. Les fils du Tsitsit possèdent une sainteté propre ; il est interdit de les utiliser à des fins profanes ou irrespectueuses, et l'on doit veiller à leur respect à tout moment."
      }
    ]
  },
  {
    siman: "11",
    sujet_fr: "Chapitre 11 - Lois du nombre de fils, des nœuds et des enroulements",
    halakhot: [
      {
        seif: "1",
        titre_seif: "Les 4 fils pliés formant 8 brins à chaque coin",
        brut: "א. בכל כנף וכנף מציבים ארבעה חוטים, וכאשר כופלים אותם באמצע נעשים שמונה חוטים משתלשלים.",
        voyelles: "א. בְּכָל כָּנָף וְכָנָף מַצִּיבִים אַרְבָּעָה חוּטִים, וְכַאֲשֶׁר כּוֹפְלִים אוֹתָם בָּאֶמְצַע נַעֲשִׂים שְׁמֹנָה חוּטִים מִשְׁתַּלְשְׁלִים.",
        francais: "1. À chaque coin du vêtement, on insère quatre fils de laine qui, pliés en leur milieu, forment huit brins pendant vers le bas."
      },
      {
        seif: "2",
        titre_seif: "Les 5 doubles nœuds et les 4 séries d'enroulements",
        brut: "ב. עושים בציצית חמישה קשרים כפולים וארבע חוליות ביניהם, כפי המנהג המקובל להרבות בקדושה.",
        voyelles: "ב. עוֹשִׂים בַּצִּיצִית חֲמִשָּׁה קְשָׁרִים כְּפוּלִים וְאַרְבַּע חֻלְיוֹת בֵּינֵיהֶם, כְּפִי הַמִּנְהָג הַמְּקֻבָּל לַהַרְבּוֹת בִּקְדֻשָּׁה.",
        francais: "2. On réalise dans chaque Tsitsit cinq doubles nœuds espacés de quatre séries d'enroulements (Holiot), selon la coutume établie pour multiplier la sainteté."
      }
    ]
  },
  {
    siman: "12",
    sujet_fr: "Chapitre 12 - Emplacement du trou du Tsitsit et fixation au vêtement",
    halakhot: [
      {
        seif: "1",
        titre_seif: "Emplacement exact du trou à partir du bord",
        brut: "א. הנקב שמכניסים בו את הציצית לא יהיה רחוק מן השפה יותר משלוש אצבעות, ולא קרוב פחות מקשר אגודל.",
        voyelles: "א. הַנֶּקֶב שֶׁמַּכְנִיסִים בּוֹ אֶת הַצִּיצִית לֹא יִהְיֶה רָחוֹק מִן הַשָּׂפָה יוֹתֵר מִשָּׁלֹשׁ אֶצְבָּעוֹת, וְלֹא קָרוֹב פָּחוֹת מִקֶּשֶׁר אֲגוּדָל.",
        francais: "1. Le trou dans lequel on introduit le Tsitsit ne doit pas être distant du bord de plus de trois largeurs de doigts (Kesher Agoudal), ni plus près que la jointure du pouce."
      },
      {
        seif: "2",
        titre_seif: "Fixation des franges du côté du coin",
        brut: "ב. יקשור את הציצית על כנף הבגד כשהוא תלוי לצד שפת הבגד, כדי שיהיה נוי למצוה.",
        voyelles: "ב. יִקְשֹׁר אֶת הַצִּיצִית עַל כָּנָף הַבֶּגֶד כְּשֶׁהוּא תָּלוּי לְצַד שְׂפַת הַבֶּגֶד, כְּדֵי שֶׁיִּהְיוּ נוֹי לַמִּצְוָה.",
        francais: "2. On nouera le Tsitsit sur le coin du vêtement de manière à ce qu'il pende harmonieusement le long du bord, pour l'embellissement du commandement (Noï Mitzva)."
      }
    ]
  },
  {
    siman: "13",
    sujet_fr: "Chapitre 13 - Vêtement emprunté, loué ou acheté soumis au Tsitsit",
    halakhot: [
      {
        seif: "1",
        titre_seif: "Vêtement emprunté et délai des 30 jours",
        brut: "א. השואל טלית מחבירו פטור מציצית עד שלושים יום, מפני שאינו נקרא בגדו. ולאחר שלושים יום חייב בציצית.",
        voyelles: "א. הַשּׁוֹאֵל טַלִּית מֵחֲבֵרוֹ פָּטוּר מִצִּיצִית עַד שְׁלֹשִׁים יוֹם, מִפְּנֵי שֶׁאֵינוֹ נִקְרָא בִּגְדוֹ. וּלְאַחַר שְׁלֹשִׁים יוֹם חַיָּב בַּצִּיצִית.",
        francais: "1. Celui qui emprunte un Tallit à un ami est exempt de Tsitsit pendant les trente premiers jours, car il n'est pas considéré comme son vêtement personnel. Après trente jours, il devient soumis à l'obligation."
      },
      {
        seif: "2",
        titre_seif: "Achat d'un vêtement neuf à 4 coins",
        brut: "ב. הקונה בגד חדש של ארבע כנפות, חייב להטיל בו ציצית מיד קודם שילבשנו.",
        voyelles: "ב. הַקּוֹנֶה בֶּגֶד חָדָשׁ שֶׁל אַרְבַּע כַּנְפוֹת, חַיָּב לְהַטִּיל בּוֹ צִיצִית מִיָּד קֹדֶם שֶׁיִּלְבָּשֶׁנּוּ.",
        francais: "2. Celui qui achète un vêtement neuf à quatre coins a l'obligation d'y attacher des Tsitsit immédiatement avant de le revêtir."
      }
    ]
  },
  {
    siman: "14",
    sujet_fr: "Chapitre 14 - Respect du Tallit et comportement lors du port",
    halakhot: [
      {
        seif: "1",
        titre_seif: "Interdiction de traiter le vêtement de Tsitsit avec mépris",
        brut: "א. אין לגרור את חוטי הציצית על גבי הקרקע, שאין זה כבוד למצוה, אלא יגביהם וישמרם בטהרה.",
        voyelles: "א. אֵין לִגְרֹר אֶת חוּטֵי הַצִּיצִית עַל גַּבֵּי הַקַּרְקַע, שֶׁאֵין זֶה כָּבוֹד לַמִּצְוָה, אֶלָּא יַגְבִּיהֵם וְיִשְׁמְרֵם בְּטָהֳרָה.",
        francais: "1. On ne laissera pas traîner les franges du Tsitsit sur le sol, car ce ne serait pas respectueux envers le commandement ; on les relèvera et on les préservera avec pureté."
      }
    ]
  },
  {
    siman: "15",
    sujet_fr: "Chapitre 15 - Le Tsitsit la nuit et exemption nocturne",
    halakhot: [
      {
        seif: "1",
        titre_seif: "Exemption du Tsitsit la nuit et absence de bénédiction",
        brut: "א. מצות ציצית אינה נוהגת בלילה, ולפיכך הלובש ציצית בלילה אינו מברך עליה.",
        voyelles: "א. מִצְוַת צִיצִית אֵינָהּ נוֹהֶגֶת בַּלַּיְלָה, וּלְפִיכָךְ הַלּוֹבֵשׁ צִיצִית בַּלַּיְלָה אֵינוֹ מְבָרֵךְ עָלֶיהָ.",
        francais: "1. La Mitsva du Tsitsit ne s'applique pas durant la nuit ; c'est pourquoi celui qui revêt un Tsitsit la nuit ne récite pas de bénédiction."
      }
    ]
  },
  {
    siman: "16",
    sujet_fr: "Chapitre 16 - Entrer dans les cimetières avec le Tsitsit (Lo'eg LaRash)",
    halakhot: [
      {
        seif: "1",
        titre_seif: "Dissimuler les Tsitsit au cimetière par respect des défunts",
        brut: "א. הנכנס לבית הקברות צריך לגרור או לכסות את ציציותיו, שלא ללגוג לכהים ולמתים שאינם יכולים לקיים עוד מצות.",
        voyelles: "א. הַנִּכְנָס לְבֵית הַקְּבָרוֹת צָרִיךְ לִגְרֹר אוֹ לְכַסּוֹת אֶת צִיצִיּוֹתָיו, שֶׁלֹּא לִלְגֹּג לַכֵּהִים וְלַמֵּתִים שֶׁאֵינָם יְכוֹלִים לְקַיֵּם עוֹד מִצְוֹת.",
        francais: "1. Celui qui entre dans un cimetière doit dissimuler ses franges de Tsitsit à l'intérieur de ses vêtements, afin de ne pas se moquer des défunts (Lo'eg LaRash) qui ne peuvent plus accomplir les Mitsvot."
      }
    ]
  },
  {
    siman: "17",
    sujet_fr: "Chapitre 17 - Exemption des femmes et des serviteurs concernant le Tsitsit",
    halakhot: [
      {
        seif: "1",
        titre_seif: "Exemption des femmes pour les Mitsvot liées au temps",
        brut: "א. נשים פטורות ממצות ציצית מפני שהיא מצות עשה שהזמן גרמא, וכל מצות עשה שהזמן גרמא נשים פטורות.",
        voyelles: "א. נָשִׁים פְּטוּרוֹת מִמִּצְוַת צִיצִית מִפְּנֵי שֶׁהִיא מִצְוַת עֲשֵׂה שֶׁהַזְּמָן גְּרָמָא, וְכָל מִצְוַת עֲשֵׂה שֶׁהַזְּמָן גְּרָמָא נָשִׁים פְּטוּרוֹת.",
        francais: "1. Les femmes sont exemptes de la Mitsva du Tsitsit car il s'agit d'un commandement positif lié au temps, et les femmes sont exemptes des commandements positifs déterminés par le temps."
      }
    ]
  },
  {
    siman: "18",
    sujet_fr: "Chapitre 18 - L'ordre de mise du Tallit avant les Tefillines",
    halakhot: [
      {
        seif: "1",
        titre_seif: "Priorité du Tallit sur les Tefillines (Ma'alin BaKodesh)",
        brut: "א. בכל בוקר יניח את הטלית תחילה ואחר כך יניח את התפילין, מפני שהציצית תדירה יותר, ותדיר ושאינו תדיר, תדיר קודם.",
        voyelles: "א. בְּכָל בֹּקֶר יַנִּיחַ אֶת הַטַּלִּית תְּחִלָּה וְאַחַר כָּךְ יַנִּיחַ אֶת הַתְּפִלִּין, מִפְּנֵי שֶׁהַצִּיצִית תְּדִירָה יוֹתֵר, וְתָדִיר וְשֶׁאֵינוֹ תָדִיר, תָדִיר קוֹדֵם.",
        francais: "1. Chaque matin, on revêtira d'abord le Tallit puis on mettra les Tefillines, car le Tsitsit est plus fréquent (Tadir) que le Tefillin, et la règle établit que ce qui est plus fréquent prime sur ce qui l'est moins."
      }
    ]
  },
  {
    siman: "19",
    sujet_fr: "Chapitre 19 - Statut des vêtements en cuir ou étoffe spéciale",
    halakhot: [
      {
        seif: "1",
        titre_seif: "Exemption du vêtement de cuir sans tissu à 4 coins",
        brut: "א. בגד של עור פטור מן הציצית, שאין נקרא בגד אלא דבר העשוי מטווי וארוג.",
        voyelles: "א. בֶּגֶד שֶׁל עוֹר פָּטוּר מִן הַצִּיצִית, שֶׁאֵין נִקְרָא בֶּגֶד אֶלָּא דָּבָר הֶעָשׂוּי מִטָּווּי וְאָרוּג.",
        francais: "1. Un vêtement en cuir est exempt du Tsitsit, car seul un textile filé et tissé porte halakhiquement le nom de vêtement (Beged)."
      }
    ]
  },
  {
    siman: "20",
    sujet_fr: "Chapitre 20 - Vendre ou donner un vêtement de Tsitsit à un non-juif",
    halakhot: [
      {
        seif: "1",
        titre_seif: "Retirer les franges avant de donner un vêtement à un non-juif",
        brut: "א. המוכר או נותן בגד של ציצית לגוי, חייב להסיר את הציציות תחילה, שמא יראו אותו ויבואו לידי מכשול.",
        voyelles: "א. הַמּוֹכֵר אוֹ נוֹתֵן בֶּגֶד שֶׁל צִיצִית לְגוֹי, חַיָּב לְהָסִיר אֶת הַצִּיצִיּוֹת תְּחִלָּה, שֶׁמָּא יִרְאוּ אוֹתוֹ וְיָבֹאוּ לִידֵי מִכְשׁוֹל.",
        francais: "1. Celui qui vend ou donne un vêtement muni de Tsitsit à un non-juif a l'obligation d'en retirer les franges au préalable, de peur qu'on ne l'associe à un Juif et que cela ne crée un obstacle ou une confusion."
      }
    ]
  }
];

function parseHebrewWord(cleanW) {
  if (DICT[cleanW]) return DICT[cleanW];
  const prefixes = ['ו', 'ב', 'כ', 'ל', 'מ', 'ש', 'ה'];
  for (const p of prefixes) {
    if (cleanW.startsWith(p) && cleanW.length > 2) {
      const sub = cleanW.slice(1);
      if (DICT[sub]) return DICT[sub];
    }
  }
  return { fr: cleanW, context: cleanW };
}

function processSeif(item, simanNum) {
  const wordsV = item.voyelles.split(/\s+/);
  const wordsB = item.brut.split(/\s+/);

  const mots_alignes = wordsV.map((wV, idx) => {
    const wB = wordsB[idx] || wV;
    const cleanW = wB.replace(/[.,'׳"״:\u05F3\u05F4]/g, '').trim();
    const entry = parseHebrewWord(cleanW);

    const obj = {
      id: idx,
      hebreu_brut: wB,
      hebreu_voyelles: wV,
      francais_mot: entry.fr,
      expression_contexte: entry.context
    };

    if (entry.infinitif) {
      obj.infinitif = entry.infinitif;
    }

    return obj;
  });

  return {
    seif: item.seif,
    sujet: "הלכות ציצית והטלית",
    sujet_fr: `Chapitre ${simanNum} - Lois du Tsitsit et du Tallit`,
    titre_seif: item.titre_seif,
    texte_integral: {
      hebreu_sans_voyelles: item.brut,
      hebreu_avec_voyelles: item.voyelles,
      francais: item.francais
    },
    mots_alignes
  };
}

SIMANIM_DATA.forEach((sData) => {
  const simanNum = sData.siman;
  const halakhot = sData.halakhot.map(h => processSeif(h, simanNum));

  const outputObj = {
    siman: simanNum,
    halakhot
  };

  const jsonStr = JSON.stringify(outputObj, null, 2);

  const out1 = path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', `siman_${simanNum}.json`);
  const out2 = path.join(ROOT, 'public', 'data', `siman_${simanNum}.json`);
  const out3 = path.join(ROOT, 'public', 'data', `yalkout-${simanNum}.json`);

  fs.mkdirSync(path.dirname(out1), { recursive: true });
  fs.writeFileSync(out1, jsonStr, 'utf8');
  fs.writeFileSync(out2, jsonStr, 'utf8');
  fs.writeFileSync(out3, jsonStr, 'utf8');

  console.log(`✅ Siman ${simanNum} built successfully with ${halakhot.length} Seifim across all 3 paths!`);
});

console.log("🎉 All Simanim 10 to 20 built successfully!");
