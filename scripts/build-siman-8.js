import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const OUTPUT_SHABBAT = path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', 'siman_8.json');
const OUTPUT_DATA_SIMAN = path.join(ROOT, 'public', 'data', 'siman_8.json');
const OUTPUT_DATA_YALKOUT = path.join(ROOT, 'public', 'data', 'yalkout-8.json');

const rawSeifim = [
  {
    seif: "1",
    titre_seif: "Grandeur et portée spirituelle du Tsitsit",
    brut: "א. גדולה מצות ציצית, שהיא שקולה כנגד כל המצות כולן, שנאמר: ''וראיתם אותו וזכרתם את כל מצות ה' ועשיתם אותם''. וכל הזהיר במצות ציצית זוכה ורואה פני שכינה, וניצול מן החטא.",
    voyelles: "א. גְּדוֹלָה מִצְוַת צִיצִית, שֶׁהִיא שְׁקוּלָה כְּנֶגֶד כָּל הַמִּצְוֹת כֻּלָּן, שֶׁנֶּאֱמַר: ''וּרְאִיתֶם אֹתוֹ וּזְכַרְתֶּם אֶת כָּל מִצְוֹת ה' וַעֲשִׂיתֶם אֹתָם''. וְכָל הַזָּהִיר בְּמִצְוַת צִיצִית זוֹכֶה וְרוֹאֶה פְּנֵי שְׁכִינָה, וְנִצָּל מִן הַחֵטְא.",
    francais: "1. Grande est la Mitsva du Tsitsit, car elle équivaut à l'ensemble de toutes les Mitsvot de la Torah, comme il est dit : « Vous le verrez et vous vous rappellerez toutes les Mitsvot d'Hashem et vous les accomplirez ». Et quiconque fait preuve de vigilance dans la Mitsva du Tsitsit méritera de voir la Présence divine et sera préservé du péché."
  },
  {
    seif: "2",
    titre_seif: "Port du Tallit Katan au quotidien et discrétion",
    brut: "ב. ראוי לכל אדם להיות זהיר ללבוש טלית קטן (ציצית) כל היום, כדי שיזכור את המצות בכל רגע. וילבשנו על גבי חולצתו או תחתיה, ובני ספרד נוהגים ללובשו תחת החולצה, והציציות מכוסות בבגדיו.",
    voyelles: "ב. רָאוּי לְכָל אָדָם לִהְיוֹת זָהִיר לִלְבֹּשׁ טַלִּית קָטָן (צִיצִית) כָּל הַיּוֹם, כְּדֵי שֶׁיִּזְכֹּר אֶת הַמִּצְוֹת בְּכָל רֶגַע. וְיִלְבָּשֶׁנּוּ עַל גַּבֵּי חוּלְצָתוֹ אוֹ תַּחְתֶּיהָ, וּבְנֵי סְפָרַד נוֹהֲגִים לִלְבֹּשׁ תַּחַת הַחוּלְצָה, וְהַצִּיצִיּוֹת מְכֻסּוֹת בִּבְגָדָיו.",
    francais: "2. Il convient à tout homme de veiller à porter un Tallit Katan (Tsitsit) tout au long de la journée, afin de se rappeler les Mitsvot à chaque instant. On peut le porter sur sa chemise ou en dessous ; les Séfarades ont pour coutume de le porter sous la chemise, les franges du Tsitsit étant dissimulées sous leurs vêtements."
  },
  {
    seif: "3",
    titre_seif: "Matière idéale du vêtement (laine vs coton)",
    brut: "ג. מצוה מן המותר לעשות הטלית של צמר רחלים, שהוא מצוה מן התורה לכל הדעות. אבל שאר בגדים של פשתן או שאר מינים, חיובם מדרבנן. ובגד של כותנה, מותר להטיל בו ציצית.",
    voyelles: "ג. מִצְוָה מִן הַמֻּבְחָר לַעֲשׂוֹת הַטַּלִּית שֶׁל צֶמֶר רְחֵלִים, שֶׁהוּא מִצְוָה מִן הַתּוֹרָה לְכָל הַדֵּעוֹת. אֲבָל שְׁאָר בְּגָדִים שֶׁל פִּשְׁתָּן אוֹ שְׁאָר מִינִים, חִיּוּבָם מִדְּרַבָּנָן. וּבֶגֶד שֶׁל כֻּתְנָה, מֻתָּר לְהַטִּיל בּוֹ צִיצִית.",
    francais: "3. La manière la plus accomplie (Mitsva Min HaMouv'har) est de confectionner le Tallit en pure laine de brebis, ce qui constitue une obligation d'origine torahique (d'Oraïta) selon tous les avis. Pour les autres tissus comme le coton ou les fibres synthétiques, l'obligation est d'origine rabbinique (d'Rabbanan). Il est permis de mettre des Tsitsit à un vêtement en coton."
  },
  {
    seif: "4",
    titre_seif: "Bénédiction et enveloppement du Tallit Gadol",
    brut: "ד. כשמתעטף בטלית גדול, מברך מעומד: ''ברוך אתה ה' אלהינו מלך העולם אשר קדשנו במצותיו וצונו להתעטף בציצית''. ויתעטף בו ראשו ורובו כדרך שבני אדם מתכסים.",
    voyelles: "ד. כְּשֶׁמִּתְעַטֵּף בְּטַלִּית גָּדוֹל, מְבָרֵךְ מֵעֻמָּד: ''בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ לְהִתְעַטֵּף בַּצִּיצִית''. וְיִתְעַטֵּף בּוֹ רֹאשׁוֹ וְרוּבּוֹ כְּדֶרֶךְ שֶׁבְּנֵי אָדָם מִתְכַּסִּים.",
    francais: "4. Lorsqu'on s'enveloppe du Tallit Gadol, on récite debout la bénédiction : « Baroukh Atah Hashem Eloheinou Melekh Ha'Olam Asher Qiddeshanou BiMitzvotav VeTzivanou LeHit'atef BiTzitzi ». On s'enveloppera la tête et la majeure partie du corps à la manière dont les gens se couvrent."
  },
  {
    seif: "5",
    titre_seif: "Bénédiction spécifique au Tallit Katan",
    brut: "ה. המברך על טלית קטן, מברך: ''אשר קדשנו במצותיו וצונו על מצות ציצית''. ואם ברך להתעטף בציצית על טלית קטן, יצא. ואם בירך על טלית גדול, פוטר בזה את הטלית קטן שעליו.",
    voyelles: "ה. הַמְּבָרֵךְ עַל טַלִּית קָטָן, מְבָרֵךְ: ''אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ עַל מִצְוַת צִיצִית''. וְאִם בֵּרַךְ לְהִתְעַטֵּף בַּצִּיצִית עַל טַלִּית קָטָן, יָצָא. וְאִם בֵּרַךְ עַל טַלִּית גָּדוֹל, פּוֹטֵר בָּזֶה אֶת הַטַּלִּית קָטָן שֶׁעָלָיו.",
    francais: "5. Celui qui récite la bénédiction sur un Tallit Katan récite : « ...Asher Qiddeshanou BiMitzvotav VeTzivanou 'Al Mitzvat Tzitzi ». S'il a récité LeHit'atef sur le Tallit Katan, il est quitte. Lorsqu'on met le Tallit Gadol avec sa bénédiction, celle-ci acquitte également le Tallit Katan que l'on porte."
  },
  {
    seif: "6",
    titre_seif: "Dimensions halakhiques minimales (Chi'our)",
    brut: "ו. שיעור טלית קטן שחייב בציצית, הוא אמה באמה (כארבעים ושמונה סנטימטרים) מראש כתפו עד למטה, בין מלפניו ובין מאחוריו, חוץ מפתח הצוואר.",
    voyelles: "ו. שִׁעוּר טַלִּית קָטָן שֶׁחַיָּב בַּצִּיצִית, הוּא אַמָּה בְּאַמָּה (כְּאַרְבָּעִים וּשְׁמֹנָה סַנְטִימֶטְרִים) מֵרֹאשׁ כִּתְפּוֹ עַד לְמַטָּה, בֵּין מִלְּפָנָיו וּבֵין מֵאַחֲרָיו, חוּץ מִפֶּתַח הַצַּוָּאר.",
    francais: "6. La mesure minimale d'un Tallit Katan soumis à l'obligation du Tsitsit est d'une coudée sur une coudée (environ 48 centimètres de longueur) depuis le haut de l'épaule vers le bas, tant à l'avant qu'à l'arrière, sans compter l'ouverture du col."
  },
  {
    seif: "7",
    titre_seif: "Structure des 8 fils et des 5 nœuds",
    brut: "ז. צריך שיהיו בציצית ארבעה חוטי צמר כפולים, שהם שמונה חוטים בכל כנף, ויקשור בהם חמישה קשרים כפולים וארבע חוליות ביניהם.",
    voyelles: "ז. צָרִיךְ שֶׁיִּהְיוּ בַּצִּיצִית אַרְבָּעָה חוּטֵי צֶמֶר כְּפוּלִים, שֶׁהֵם שְׁמֹנָה חוּטִים בְּכָל כָּנָף, וְיִקְשֹׁר בָּהֶם חֲמִשָּׁה קְשָׁרִים כְּפוּלִים וְאַרְבַּע חֻלְיוֹת בֵּינֵיהֶם.",
    francais: "7. Il faut qu'il y ait dans chaque Tsitsit quatre fils de laine pliés en deux, formant huit brins à chaque coin du vêtement. On y nouera cinq doubles nœuds espacés de quatre séries d'enroulements (Holiot)."
  },
  {
    seif: "8",
    titre_seif: "Exemption des vêtements sans quatre coins",
    brut: "ח. בגד שאין לו ארבע כנפות (פינות) פטור מציצית. ואם יש לו יותר מארבע כנפות, יטיל ציצית בארבע פינות הרחוקות זו מזו.",
    voyelles: "ח. בֶּגֶד שֶׁאֵין לוֹ אַרְבַּע כַּנְפוֹת (פִּנּוֹת) פָּטוּר מִצִּיצִית. וְאִם יֵשׁ לוֹ יוֹתֵר מֵאַרְבַּע כַּנְפוֹת, יַטִּיל צִיצִית בְּאַרְבַּע פִּנּוֹת הָרְחוֹקוֹת זוֹ מִזּוֹ.",
    francais: "8. Un vêtement qui ne possède pas quatre coins (Arba Kanafot) est exempt de la Mitsva du Tsitsit. S'il possède plus de quatre coins, on mettra des Tsitsit aux quatre coins les plus distants les uns des autres."
  },
  {
    seif: "9",
    titre_seif: "Fabrication des fils Lishmah (avec intention)",
    brut: "ט. חובה שיהיו חוטי הציצית נטווים ונשזרים לשמה, דהיינו לשם מצות ציצית. וציצית שנעשתה שלא לשמה, פסולה.",
    voyelles: "ט. חוֹבָה שֶׁיִּהְיוּ חוּטֵי הַצִּיצִית נִטְוִים וְנִשְׁזָרִים לִשְׁמָהּ, דְּהַיְנוּ לְשֵׁם מִצְוַת צִיצִית. וְצִיצִית שֶׁנַּעֲשְׂתָה שֶׁלֹּא לִשְׁמָהּ, פְּסוּלָה.",
    francais: "9. Il est obligatoire que les fils du Tsitsit soient filés et tordus Lishmah (avec l'intention expresse d'accomplir la Mitsva du Tsitsit). Tout Tsitsit fabriqué sans cette intention sacrée est invalide (Passoul)."
  },
  {
    seif: "10",
    titre_seif: "Le principe de Ta'assé VeLo Min Ha'Assouï",
    brut: "י. קשר את הציצית בבגד שעדיין לא נקרא בגד, או שקשר ציצית ולאחר מכן חתך את הבגד לעשות בו כנפות, פסול משום תעשה ולא מן העשוי.",
    voyelles: "י. קָשַׁר אֶת הַצִּיצִית בַּבֶּגֶד שֶׁעֲדַיִן לֹא נִקְרָא בֶּגֶד, אוֹ שֶׁקָּשַׁר צִיצִית וּלְאַחַר מִכֵּן חָתַךְ אֶת הַבֶּגֶד לַעֲשׂוֹת בּוֹ כַּנְפוֹת, פָּסוּל מִשּׁוּם תַּעֲשֶׂה וְלֹא מִן הָעָשׂוּי.",
    francais: "10. Si l'on a attaché des Tsitsit à un morceau de tissu avant qu'il ne soit un vêtement achevé, ou si l'on a attaché les Tsitsit puis découpé le tissu pour créer quatre coins, cela est invalide en vertu du principe Ta'assé VeLo Min Ha'Assouï."
  },
  {
    seif: "11",
    titre_seif: "Cas des fils de Tsitsit cassés ou abîmés",
    brut: "יא. נפסקו חוטים מן הציצית, אם נשתייר מכל חוט כדי עניבה (כארבעה סנטימטרים), כשרה. ואם נפסקו שני חוטים שלמים, יש להחמיר ולפסול.",
    voyelles: "יא. נִפְסְקוּ חוּטִים מִן הַצִּיצִית, אִם נִשְׁתַּיֵּר מִכָּל חוּט כְּדֵי עֲנִיבָה (כְּאַרְבָּעָה סַנְטִימֶטְרִים), כְּשֵׁרָה. וְאִם נִפְסְקוּ שְׁנֵי חוּטִים שְׁלֵמִים, יֵשׁ לְהַחְמִיר וְלִפְסֹל.",
    francais: "11. Si des fils du Tsitsit se sont cassés : s'il reste de chaque brin cassé la longueur d'un nœud coulant (Kedei Anivah, soit environ 4 cm), le Tsitsit demeure kasher. Si deux fils entiers se sont rompus depuis leur base, il convient d'être rigoureux et de le déclarer invalide."
  },
  {
    seif: "12",
    titre_seif: "Vérification matinale des franges du Tsitsit",
    brut: "יב. צריכים לבדוק את חוטי הציצית בכל יום קודם שמברך עליהם, שמא נפסקו החוטים ונהיה פסול, כדי שלא יברך ברכה לבטלה.",
    voyelles: "יב. צְרִיכִים לִבְדֹּק אֶת חוּטֵי הַצִּיצִית בְּכָל יוֹם קֹדֶם שֶׁמְּבָרֵךְ עֲלֵיהֶם, שֶׁמָּא נִפְסְקוּ הַחוּטִים וְנִהְיָה פָּסוּל, כְּדֵי שֶׁלֹּא יְבָרֵךְ בְּרָכָה לְבַטָּלָה.",
    francais: "12. Il faut inspecter les fils du Tsitsit chaque jour avant de réciter la bénédiction, de peur que des brins ne se soient rompus et rendus invalides, évitant ainsi de réciter une bénédiction en vain."
  },
  {
    seif: "13",
    titre_seif: "Entrer aux toilettes avec le Tallit Katan vs Gadol",
    brut: "יג. מותר להיכנס לבית הכסא ולבית המרחץ כשהוא לבוש בטלית קטן. אך בטלית גדול שמתעטף בו לתפלה, אין להיכנס לבית הכסא.",
    voyelles: "יג. מֻתָּר לְהִכָּנֵס לְבֵית הַכִּסֵּא וּלְבֵית הַמַּרְחָץ כְּשֶׁהוּא לָבוּשׁ בְּטַלִּית קָטָן. אַךְ בְּטַלִּית גָּדוֹל שֶׁמִּתְעַטֵּף בּוֹ לַתְּפִלָּה, אֵין לְהִכָּנֵס לְבֵית הַכִּסֵּא.",
    francais: "13. Il est permis d'entrer dans les toilettes ou dans la salle de bain lorsqu'on porte un Tallit Katan sous ses vêtements. Cependant, avec le Tallit Gadol réservé à la prière, il est interdit d'entrer dans les toilettes."
  },
  {
    seif: "14",
    titre_seif: "Le Tsitsit pendant le jour et l'interdiction la nuit",
    brut: "יד. מצות ציצית נוהגת ביום ולא בלילה, שנאמר ''וראיתם אותו'' - פרט ללילה. ולכן אין מברכים על הציצית בלילה. ואם לובש טלית קטן בלילה, אינו מברך.",
    voyelles: "יד. מִצְוַת צִיצִית נוֹהֶגֶת בַּיּוֹם וְלֹא בַּלַּיְלָה, שֶׁנֶּאֱמַר ''וּרְאִיתֶם אֹתוֹ'' - פְּרָט לַלַּיְלָה. וְלָכֵן אֵין מְבָרְכִים עַל הַצִּיצִית בַּלַּיְלָה. וְאִם לוֹבֵשׁ טַלִּית קָטָן בַּלַּיְלָה, אֵינוֹ מְבָרֵךְ.",
    francais: "14. La Mitsva du Tsitsit ne s'applique que durant la journée et non la nuit, car il est dit : « Vous le verrez » — ce qui exclut la nuit. C'est pourquoi on ne récite pas de bénédiction sur le Tsitsit la nuit."
  },
  {
    seif: "15",
    titre_seif: "Exemption des femmes de la Mitsva du Tsitsit",
    brut: "טו. נשים פטורות ממצות ציצית, לפי שהיא מצות עשה שהזמן גרמא. ואם רוצות ללבוש ציצית, אין מניחים אותן משום יוהרא.",
    voyelles: "טו. נָשִׁים פְּטוּרוֹת מִמִּצְוַת צִיצִית, לְפִי שֶׁהִיא מִצְוַת עֲשֵׂה שֶׁהַזְּמָן גְּרָמָא. וְאִם רוֹצוֹת לִלְבֹּשׁ צִיצִית, אֵין מַנִּיחִים אוֹתָן מִשּׁוּם יוֹהֲרָא.",
    francais: "15. Les femmes sont exemptes de la Mitsva du Tsitsit car il s'agit d'un commandement positif lié au temps. Et si elles souhaitent en porter, nos Sages s'y opposent en raison de l'orgueil (Yohara)."
  },
  {
    seif: "16",
    titre_seif: "Coutume d'embrasser les Tsitsit au Shema",
    brut: "טז. מנהג יפה לאחז בציציות שבידו בשעת קריאת שמע, וכשמגיע לתיבת ''וראיתם אותו'' מסתכל בהן ומנשקן ומעבירן על עיניו, סגולה לראיה טובה.",
    voyelles: "טז. מִנְהָג יָפֶה לֶאֱחֹז בַּצִּיצִיּוֹת שֶׁבְּיָדוֹ בִּשְׁעַת קְרִיאַת שְׁמַע, וּכְשֶׁמַּגִּיעַ לַתֵּבָה ''וּרְאִיתֶם אֹתוֹ'' מִסְתַּכֵּל בָּהֶן וּמְנַשְּׁקָן וּמַעֲבִירָן עַל עֵינָיו, סְגֻלָּה לִרְאִיָּה טוֹבָה.",
    francais: "16. C'est une belle coutume de tenir les franges du Tsitsit dans sa main pendant la récitation du Shema. Lorsqu'on arrive au mot 'OuRe'item Oto', on les regarde, on les embrasse et on les passe sur ses yeux, ce qui est une Segoula pour préserver une bonne vue."
  },
  {
    seif: "17",
    titre_seif: "Respect des franges et dépôt à la Gueniza",
    brut: "יז. אין לנהוג מנהג בזיון בציצית, כגון לנגב בהם ידיו או להשתמש בהם לצרכי חול. וציצית שנפסלה, יניחנה בגניזה או בין דפי ספר קודש.",
    voyelles: "יז. אֵין לִנְהֹג מִנְהַג בִּזָּיוֹן בַּצִּיצִית, כְּגוֹן לְנַגֵּב בָּהֶם יָדָיו אוֹ לְהִשְׁתַּמֵּשׁ בָּהֶם לְצָרְכֵי חוֹל. וְצִיצִית שֶׁנִּפְסְלָה, יַנִּיחֶנָּה בִּגְנִיזָה אוֹ בֵּין דַּפֵּי סֵפֶר קֹדֶשׁ.",
    francais: "17. On ne doit adopter aucun comportement irrespectueux envers le Tsitsit, comme s'y essuyer les mains ou l'utiliser à des fins profanes. Si un Tsitsit devient invalide, on le déposera dans la Gueniza ou entre les pages d'un livre saint."
  },
  {
    seif: "18",
    titre_seif: "Précautions pour le lavage du Tallit",
    brut: "יח. כשמכבסים את הטלית, יזהרו שלא לכבס את החוטים במכונת כביסה כדי שלא יסתבכו ויפסלו, אלא יכבסם בידו בזהירות ובכבוד.",
    voyelles: "יח. כְּשֶׁמְּכַבְּסִים אֶת הַטַּלִּית, יִזָּהֲרוּ שֶׁלֹּא לְכַבֵּס אֶת הַחוּטִים בִּמְכוֹנַת כְּבִיסָה כְּדֵי שֶׁלֹּא יִסְתַּבְּכוּ וְיִפָּסְלוּ, אֶלָּא יְכַבְּסֵם בְּיָדוֹ בִּזְהִירוּת וּבְכָבוֹד.",
    francais: "18. Lorsqu'on lave le Tallit, on veillera à ne pas laver les franges dans une machine à laver automatique afin qu'elles ne s'emmêlent pas ni ne se déchirent, mais on les lavera délicatement à la main avec respect."
  }
];

const DICT = {
  "גדולה": { fr: "Grande est", context: "Grande est" },
  "מצות": { fr: "La Mitsva de", context: "La Mitsva de" },
  "ציצית": { fr: "Tsitsit (Franges)", context: "Tsitsit" },
  "שהיא": { fr: "Car elle est", context: "Car elle est" },
  "שקולה": { fr: "Équivalente à", context: "Équivalente à", infinitif: "לִשְׁקֹל = Peser / Équivaloir" },
  "כנגד": { fr: "À l'encontre de / Face à", context: "Équivalente à" },
  "כל": { fr: "Toutes / Tout", context: "Toutes" },
  "המצות": { fr: "Les Mitsvot", context: "Les Mitsvot" },
  "כולן": { fr: "Toutes ensemble", context: "Toutes ensemble" },
  "שנאמר": { fr: "Comme il est dit", context: "Comme il est dit" },
  "וראיתם": { fr: "Et vous le verrez", context: "Et vous le verrez", infinitif: "לִרְאוֹת = Voir" },
  "אותו": { fr: "Lui / Cela", context: "Lui" },
  "וזכרתם": { fr: "Et vous vous rappellerez", context: "Et vous vous rappellerez", infinitif: "לִזְכֹּר = Se rappeler / Se souvenir" },
  "את": { fr: "[Particule COD]", context: "[Accusatif]" },
  "ועשיתם": { fr: "Et vous les accomplirez", context: "Et vous les accomplirez", infinitif: "לַעֲשׂוֹת = Faire / Accomplir" },
  "אותם": { fr: "Eux / Les", context: "Les" },
  "וכל": { fr: "Et tout", context: "Et tout" },
  "הזהיר": { fr: "Qui est vigilant", context: "Qui est vigilant", infinitif: "לְהִזָּהֵר = Faire attention / Être vigilant" },
  "זוכה": { fr: "Mérite", context: "Mérite", infinitif: "לִזְכּוֹת = Mériter" },
  "ורואה": { fr: "Et voit", context: "Et voit", infinitif: "לִרְאוֹת = Voir" },
  "פני": { fr: "La Présence de", context: "La Face de" },
  "שכינה": { fr: "La Shekhina (Présence divine)", context: "Présence divine" },
  "וניצול": { fr: "Et est préservé / sauvé", context: "Et est préservé", infinitif: "לְהִנָּצֵל = Être sauvé / Préservé" },
  "מן": { fr: "De", context: "De" },
  "החטא": { fr: "Le péché", context: "Le péché" },
  "ראוי": { fr: "Il convient", context: "Il convient" },
  "לכל": { fr: "À tout", context: "À tout" },
  "אדם": { fr: "Homme", context: "Homme" },
  "להיות": { fr: "D'être", context: "D'être", infinitif: "לִהְיוֹת = Être" },
  "זהיר": { fr: "Vigilant", context: "Vigilant" },
  "ללבוש": { fr: "Porter / Revêtir", context: "Porter", infinitif: "לִלְבֹּשׁ = Porter (un vêtement)" },
  "טלית": { fr: "Tallit", context: "Tallit" },
  "קטן": { fr: "Petit (Katan)", context: "Katan" },
  "היום": { fr: "La journée / Le jour", context: "La journée" },
  "כדי": { fr: "Afin de", context: "Afin de" },
  "שיזכור": { fr: "Qu'il se rappelle", context: "Qu'il se rappelle", infinitif: "לִזְכֹּר = Se rappeler" },
  "רגע": { fr: "Instant / Moment", context: "Instant" },
  "וילבשנו": { fr: "Et le portera", context: "Et le portera", infinitif: "לִלְבֹּשׁ = Porter" },
  "חולצתו": { fr: "Sa chemise", context: "Sa chemise" },
  "תחתיה": { fr: "Sous elle", context: "Sous elle" },
  "ובני": { fr: "Et les fils de", context: "Et les fils de" },
  "ספרד": { fr: "Séfarad", context: "Séfarades" },
  "נוהגים": { fr: "Ont la coutume", context: "Ont la coutume", infinitif: "לִנְהֹג = Avoir pour coutume" },
  "ללובשו": { fr: "De le porter", context: "De le porter", infinitif: "לִלְבֹּשׁ = Porter" },
  "תחת": { fr: "Sous", context: "Sous" },
  "החולצה": { fr: "La chemise", context: "La chemise" },
  "והציציות": { fr: "Et les franges", context: "Et les franges" },
  "מכוסות": { fr: "Couvertes / Dissimulées", context: "Dissimulées" },
  "בבגדיו": { fr: "Dans ses vêtements", context: "Dans ses vêtements" },
  "מן": { fr: "De", context: "De" },
  "המובחר": { fr: "Le meilleur / Le plus parfait", context: "Le plus accompli" },
  "לעשות": { fr: "Faire / Confectionner", context: "Confectionner", infinitif: "לַעֲשׂוֹת = Faire / Confectionner" },
  "הטלית": { fr: "Le Tallit", context: "Le Tallit" },
  "של": { fr: "De", context: "De" },
  "צמר": { fr: "Laine", context: "Laine" },
  "רחלים": { fr: "Brebis", context: "Brebis" },
  "שהוא": { fr: "Car c'est", context: "Car c'est" },
  "התורה": { fr: "La Torah", context: "La Torah" },
  "הדעות": { fr: "Les avis", context: "Les avis" },
  "אבל": { fr: "Mais", context: "Mais" },
  "שאר": { fr: "Le reste de / Les autres", context: "Les autres" },
  "בגדים": { fr: "Vêtements", context: "Vêtements" },
  "פשתן": { fr: "Lin", context: "Lin" },
  "מינים": { fr: "Espèces / Tissus", context: "Tissus" },
  "חיובם": { fr: "Leur obligation est", context: "Leur obligation est" },
  "מדרבנן": { fr: "Rabbinique (d'Rabbanan)", context: "Rabbinique" },
  "ובגד": { fr: "Et un vêtement de", context: "Et un vêtement de" },
  "כותנה": { fr: "Coton", context: "Coton" },
  "מותר": { fr: "Permis", context: "Permis" },
  "להטיל": { fr: "Mettre / Attacher", context: "Attacher", infinitif: "לְהַטִּיל = Attacher / Placer" },
  "בו": { fr: "En lui", context: "En lui" },
  "כשמתעטף": { fr: "Lorsqu'il s'enveloppe", context: "Lorsqu'il s'enveloppe", infinitif: "לְהִתְעַטֵּף = S'envelopper" },
  "בטלית": { fr: "Dans le Tallit", context: "Dans le Tallit" },
  "גדול": { fr: "Grand (Gadol)", context: "Gadol" },
  "מברך": { fr: "Bénit / Récite la bénédiction", context: "Bénit", infinitif: "לְבָרֵךְ = Bénir" },
  "מעומד": { fr: "Debout", context: "Debout" },
  "להתעטף": { fr: "De s'envelopper", context: "De s'envelopper", infinitif: "לְהִתְעַטֵּף = S'envelopper" },
  "בציצית": { fr: "Dans le Tsitsit", context: "Dans le Tsitsit" },
  "ראשו": { fr: "Sa tête", context: "Sa tête" },
  "ורובו": { fr: "Et la majeure partie de son corps", context: "La majeure partie de son corps" },
  "כדרך": { fr: "À la manière dont", context: "À la manière dont" },
  "שבני": { fr: "Que les hommes", context: "Que les hommes" },
  "מתכסים": { fr: "Se couvrent", context: "Se couvrent", infinitif: "לְהִתְכַּסּוֹת = Se couvrir" },
  "המברך": { fr: "Celui qui bénit", context: "Celui qui bénit" },
  "יצא": { fr: "Est quitte", context: "Est quitte", infinitif: "לָצֵאת = Sortir / Être quitte" },
  "פוטר": { fr: "Acquitte", context: "Acquitte", infinitif: "לִפְטֹר = Acquitter / Exempter" },
  "בזה": { fr: "Par cela", context: "Par cela" },
  "שעליו": { fr: "Qu'il porte sur lui", context: "Qu'il porte" },
  "שיעור": { fr: "La mesure de", context: "La mesure de" },
  "שחייב": { fr: "Qui est soumis à l'obligation", context: "Qui est soumis" },
  "אמה": { fr: "Une coudée (Amah)", context: "Une coudée" },
  "באמה": { fr: "Sur une coudée", context: "Sur une coudée" },
  "כארבעים": { fr: "Environ quarante", context: "Environ 40" },
  "ושמונה": { fr: "Et huit", context: "Et 8" },
  "סנטימטרים": { fr: "Centimètres", context: "Centimètres" },
  "מראש": { fr: "Depuis le haut de", context: "Depuis le haut de" },
  "כתפו": { fr: "Son épaule", context: "Son épaule" },
  "עד": { fr: "Jusqu'à", context: "Jusqu'à" },
  "למטה": { fr: "Le bas", context: "Le bas" },
  "בין": { fr: "Tant", context: "Tant" },
  "מלפניו": { fr: "De son avant", context: "À l'avant" },
  "ומאחוריו": { fr: "Et de son arrière", context: "À l'arrière" },
  "חוץ": { fr: "Sauf / Excepté", context: "Sauf" },
  "מפתח": { fr: "L'ouverture de", context: "L'ouverture de" },
  "הצוואר": { fr: "Le col / cou", context: "Le col" },
  "צריך": { fr: "Il faut", context: "Il faut" },
  "שיהיו": { fr: "Qu'il y ait", context: "Qu'il y ait" },
  "ארבעה": { fr: "Quatre", context: "Quatre" },
  "חוטי": { fr: "Fils de", context: "Fils de" },
  "כפולים": { fr: "Doublés / Pliés", context: "Pliés" },
  "שהם": { fr: "Qui sont", context: "Qui sont" },
  "שמונה": { fr: "Huit", context: "Huit" },
  "חוטים": { fr: "Fils / Brins", context: "Brins" },
  "כנף": { fr: "Coin / Aile", context: "Coin" },
  "ויקשור": { fr: "Et nouera", context: "Et nouera", infinitif: "לִקְשֹׁר = Nouer / Attacher" },
  "חמישה": { fr: "Cinq", context: "Cinq" },
  "קשרים": { fr: "Nœuds", context: "Nœuds" },
  "וארבע": { fr: "Et quatre", context: "Et quatre" },
  "חוליות": { fr: "Séries d'enroulements (Holiot)", context: "Enroulements" },
  "ביניהם": { fr: "Entre eux", context: "Entre eux" },
  "שאין": { fr: "Qui n'a pas", context: "Qui n'a pas" },
  "ארבע": { fr: "Quatre", context: "Quatre" },
  "כנפות": { fr: "Coins", context: "Coins" },
  "פינות": { fr: "Coins", context: "Coins" },
  "פטור": { fr: "Exempt", context: "Exempt" },
  "יותר": { fr: "Plus de", context: "Plus de" },
  "הרחוקות": { fr: "Les plus éloignées", context: "Les plus éloignées" },
  "חובה": { fr: "Obligation", context: "Obligation" },
  "נטווים": { fr: "Filés", context: "Filés", infinitif: "לִטְוֹת = Filer" },
  "ונשזרים": { fr: "Et tordus", context: "Et tordus", infinitif: "לִשְׁזֹר = Tordre" },
  "לשמה": { fr: "Lishmah (avec intention sacrée)", context: "Lishmah" },
  "דהיינו": { fr: "C'est-à-dire", context: "C'est-à-dire" },
  "לשם": { fr: "Au nom de", context: "Au nom de" },
  "שנעשתה": { fr: "Qui a été faite", context: "Qui a été faite" },
  "שלא": { fr: "Sans", context: "Sans" },
  "פסולה": { fr: "Invalide (Passoul)", context: "Invalide" },
  "קשר": { fr: "A attaché", context: "A attaché", infinitif: "לִקְשֹׁר = Attacher" },
  "בבגד": { fr: "Dans un vêtement", context: "Dans un vêtement" },
  "שעדיין": { fr: "Qui n'est pas encore", context: "Qui n'est pas encore" },
  "נקרא": { fr: "Appelé", context: "Appelé" },
  "מכן": { fr: "Après cela", context: "Après cela" },
  "חתך": { fr: "A découpé", context: "A découpé", infinitif: "לַחְתֹּךְ = Découper" },
  "משום": { fr: "En vertu de", context: "En vertu de" },
  "תעשה": { fr: "Tu feras", context: "Tu feras", infinitif: "לַעֲשׂוֹת = Faire" },
  "ולא": { fr: "Et non", context: "Et non" },
  "העשוי": { fr: "Le fait accompli", context: "Le fait accompli" },
  "נפסקו": { fr: "Se sont cassés", context: "Se sont cassés", infinitif: "לְהִפָּסֵק = Se casser / Se rompre" },
  "נשתייר": { fr: "Il reste", context: "Il reste", infinitif: "לְהִשָּׁאֵר = Rester" },
  "חוט": { fr: "Fil / Brin", context: "Brin" },
  "עניבה": { fr: "Nœud coulant", context: "Nœud coulant" },
  "כשרה": { fr: "Kasher / Valide", context: "Kasher" },
  "שני": { fr: "Deux", context: "Deux" },
  "שלמים": { fr: "Entiers", context: "Entiers" },
  "להחמיר": { fr: "D'être rigoureux", context: "D'être rigoureux", infinitif: "לְהַחְמִיר = Être rigoureux" },
  "ולפסול": { fr: "Et d'invalider", context: "Et d'invalider", infinitif: "לִפְסֹל = Invalider" },
  "צריכים": { fr: "Il faut", context: "Il faut" },
  "לבדוק": { fr: "Inspecter / Vérifier", context: "Inspecter", infinitif: "לִבְדֹּק = Inspecter / Vérifier" },
  "שמא": { fr: "De peur que", context: "De peur que" },
  "ונהיה": { fr: "Et soit devenu", context: "Et soit devenu" },
  "לבטלה": { fr: "En vain", context: "En vain" },
  "להיכנס": { fr: "D'entrer", context: "D'entrer", infinitif: "לְהִכָּנֵס = Entrer" },
  "לבית": { fr: "Dans la maison / pièce", context: "Dans la pièce" },
  "הכסא": { fr: "Aux toilettes", context: "Aux toilettes" },
  "המרחץ": { fr: "À la salle de bain", context: "À la salle de bain" },
  "לבוש": { fr: "Vêtu", context: "Vêtu" },
  "נוהגת": { fr: "S'applique", context: "S'applique", infinitif: "לִנְהֹג = S'appliquer" },
  "ביום": { fr: "Le jour", context: "Le jour" },
  "בלילה": { fr: "La nuit", context: "La nuit" },
  "פרט": { fr: "À l'exclusion de", context: "À l'exclusion de" },
  "ולכן": { fr: "Et donc", context: "Et donc" },
  "אין": { fr: "On ne récite pas", context: "On ne récite pas" },
  "נשים": { fr: "Les femmes", context: "Les femmes" },
  "פטורות": { fr: "Exemptes", context: "Exemptes" },
  "לפי": { fr: "Puisque", context: "Puisque" },
  "עשה": { fr: "Commandement positif", context: "Commandement positif" },
  "שהזמן": { fr: "Que le temps", context: "Que le temps" },
  "גרמא": { fr: "Détermine / Cause", context: "Détermine" },
  "מניחים": { fr: "On les autorise", context: "On les autorise", infinitif: "לְהַנִּיחַ = Laisser / Autoriser" },
  "אותן": { fr: "Elles", context: "Elles" },
  "יוהרא": { fr: "Orgueil / Ostentation", context: "Orgueil" },
  "יפה": { fr: "Belle / Excellente", context: "Belle" },
  "לאחז": { fr: "De saisir / tenir", context: "De tenir", infinitif: "לֶאֱחֹז = Tenir / Saisir" },
  "בשעת": { fr: "Au moment de", context: "Au moment de" },
  "קריאת": { fr: "La lecture de", context: "La lecture de" },
  "שמע": { fr: "Shema", context: "Shema" },
  "וכשמגיע": { fr: "Et lorsqu'il arrive", context: "Et lorsqu'il arrive", infinitif: "לְהַגִּיעַ = Arriver" },
  "לתיבת": { fr: "Au mot", context: "Au mot" },
  "מסתכל": { fr: "Regarde", context: "Regarde", infinitif: "לְהִסְתַּכֵּל = Regarder" },
  "בהן": { fr: "En elles", context: "En elles" },
  "ומנשקן": { fr: "Et les embrasse", context: "Et les embrasse", infinitif: "לְנַשֵּׁק = Embrasser" },
  "ומעבירן": { fr: "Et les passe", context: "Et les passe", infinitif: "לְהַעֲבִיר = Passer / Transporter" },
  "עיניו": { fr: "Ses yeux", context: "Ses yeux" },
  "סגולה": { fr: "Segoula (Remède spirituel)", context: "Segoula" },
  "לראיה": { fr: "Pour la vue", context: "Pour la vue" },
  "טובה": { fr: "Bonne", context: "Bonne" },
  "בזיון": { fr: "Mépris / Irrespect", context: "Mépris" },
  "לנגב": { fr: "Essuyer", context: "Essuyer", infinitif: "לְנַגֵּב = Essuyer" },
  "ידיו": { fr: "Ses mains", context: "Ses mains" },
  "להשתמש": { fr: "Utiliser", context: "Utiliser", infinitif: "לְהִשְׁתַּמֵּשׁ = Utiliser / Employer" },
  "לצרכי": { fr: "Pour des besoins de", context: "Pour des besoins de" },
  "חול": { fr: "Profanes", context: "Profanes" },
  "שנפסלה": { fr: "Qui est devenue invalide", context: "Qui est devenue invalide" },
  "יניחנה": { fr: "La déposera", context: "La déposera", infinitif: "לְהַנִּיחַ = Déposer" },
  "בגניזה": { fr: "Dans la Gueniza", context: "Dans la Gueniza" },
  "דפי": { fr: "Les pages de", context: "Les pages de" },
  "ספר": { fr: "Un livre de", context: "Un livre de" },
  "קודש": { fr: "Saintité", context: "Saintité" },
  "כשמכבסים": { fr: "Lorsqu'on lave", context: "Lorsqu'on lave", infinitif: "לְכַבֵּס = Laver (du linge)" },
  "יזהרו": { fr: "Fronderont attention", context: "Veilleront", infinitif: "לְהִזָּהֵר = Veiller / Faire attention" },
  "במכונת": { fr: "Dans une machine", context: "Dans une machine" },
  "כביסה": { fr: "Lavage (Linge)", context: "Lavage" },
  "שיסתבכו": { fr: "Qu'ils s'emmêlent", context: "Qu'ils s'emmêlent", infinitif: "לְהִסְתַּבֵּךְ = S'emmêler" },
  "ויפסלו": { fr: "Et se déchirent", context: "Et se déchirent" },
  "בידו": { fr: "À la main", context: "À la main" },
  "בזהירות": { fr: "Avec précaution", context: "Avec précaution" },
  "ובכבוד": { fr: "Et avec respect", context: "Et avec respect" }
};

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

function processSeif(item) {
  const wordsV = item.voyelles.split(/\s+/);
  const wordsB = item.brut.split(/\s+/);

  const mots_alignes = wordsV.map((wV, idx) => {
    const wB = wordsB[idx] || wV;
    const cleanW = wB.replace(/[.,'׳"״\u05F3\u05F4]/g, '').trim();
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
    sujet_fr: "Chapitre 8 - Lois du Tsitsit et du Tallit",
    titre_seif: item.titre_seif,
    texte_integral: {
      hebreu_sans_voyelles: item.brut,
      hebreu_avec_voyelles: item.voyelles,
      francais: item.francais
    },
    mots_alignes
  };
}

const halakhot = rawSeifim.map(processSeif);

const outputObj = {
  siman: "8",
  halakhot
};

const jsonStr = JSON.stringify(outputObj, null, 2);

fs.mkdirSync(path.dirname(OUTPUT_SHABBAT), { recursive: true });
fs.writeFileSync(OUTPUT_SHABBAT, jsonStr, 'utf8');
fs.writeFileSync(OUTPUT_DATA_SIMAN, jsonStr, 'utf8');
fs.writeFileSync(OUTPUT_DATA_YALKOUT, jsonStr, 'utf8');

console.log(`✅ Siman 8 built successfully with ${halakhot.length} Seifim across all 3 data paths!`);
