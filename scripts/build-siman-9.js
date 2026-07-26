import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const OUTPUT_SHABBAT = path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', 'siman_9.json');
const OUTPUT_DATA_SIMAN = path.join(ROOT, 'public', 'data', 'siman_9.json');
const OUTPUT_DATA_YALKOUT = path.join(ROOT, 'public', 'data', 'yalkout-9.json');

const rawSeifim = [
  {
    seif: "1",
    titre_seif: "Intention spirituelle (Kavanah) lors de l'enveloppement",
    brut: "א. כשמתעטף בציצית יתכוון שצונו הקדוש ברוך הוא להתעטף בציצית, כדי שנזכור כל מצותיו לעשותם, כדכתיב: ''וזכרתם את כל מצות ה' ועשיתם אותם''.",
    voyelles: "א. כְּשֶׁמִּתְעַטֵּף בַּצִּיצִית יִתְכַּוֵּן שֶׁצִּוָּנוּ הַקָּדוֹשׁ בָּרוּךְ הוּא לְהִתְעַטֵּף בַּצִּיצִית, כְּדֵי שֶׁנִּזְכֹּר כָּל מִצְוֹתָיו לַעֲשׂוֹתָם, כְּדִכְתִיב: ''וּזְכַרְתֶּם אֶת כָּל מִצְוֹת ה' וַעֲשִׂיתֶם אֹתָם''.",
    francais: "1. Lorsqu'on s'enveloppe du Tsitsit, on aura l'intention que le Saint béni soit-Il nous a ordonné de nous envelopper du Tsitsit afin que nous nous rappelions tous Ses commandements pour les accomplir, comme il est écrit : « Et vous vous rappellerez toutes les Mitsvot d'Hashem et vous les accomplirez »."
  },
  {
    seif: "2",
    titre_seif: "Récitation de la bénédiction en position debout",
    brut: "ב. צריך לברך על הטלית כשהוא עומד, שכל המצות מברכים עליהן מעומד. ואם ברך מיושב, יצא, שאין העמידה מעכבת בדיעבד.",
    voyelles: "ב. צָרִיךְ לְבָרֵךְ עַל הַטַּלִּית כְּשֶׁהוּא עוֹמֵד, שֶׁכָּל הַמִּצְוֹת מְבָרְכִים עֲלֵיהֶן מֵעֻמָּד. וְאִם בֵּרַךְ מִיֻּשָׁב, יָצָא, שֶׁאֵין הָעֲמִידָה מְעַכֶּבֶת בְּדִיעֲבַד.",
    francais: "2. Il faut réciter la bénédiction sur le Tallit en position debout, car toutes les bénédictions sur les Mitsvot se récitent debout. S'il a récité la bénédiction assis, il est quitte a posteriori, car la position debout n'est pas une condition invalidante."
  },
  {
    seif: "3",
    titre_seif: "Revêtir le Tallit avant d'entrer à la synagogue",
    brut: "ג. נוהגים ללבוש טלית גדול קודם שנכנסים לבית הכנסת או מיד כשנכנסים, כדי להיכנס לבית הכנסת עטוף במצוה. ואין לברך על הטלית אלא כשהוא נקי כראוי.",
    voyelles: "ג. נוֹהֲגִים לִלְבֹּשׁ טַלִּית גָּדוֹל קֹדֶם שֶׁנִּכְנָסִים לְבֵית הַכְּנֶסֶת אוֹ מִיָּד כְּשֶׁנִּכְנָסִים, כְּדֵי לְהִכָּנֵס לְבֵית הַכְּנֶסֶת עָטוּף בַּמִּצְוָה. וְאֵין לְבָרֵךְ עַל הַטַּלִּית אֶלָּא כְּשֶׁהוּא נָקִי כָּרָאוּי.",
    francais: "3. L'usage est de revêtir le Tallit Gadol avant d'entrer à la synagogue ou dès qu'on y pénètre, afin d'entrer dans la maison de prière enveloppé de la Mitsva. On ne récite la bénédiction sur le Tallit que lorsque le corps et le lieu sont convenablement propres."
  },
  {
    seif: "4",
    titre_seif: "Inspection et séparation des franges du Tsitsit",
    brut: "ד. קודם שיברך יבדוק את החוטים ויפרידם זה מזה, כדי שיוכל לקיים מצות ציצית כהלכתה ולא יסתבכו החוטים אלו באלו.",
    voyelles: "ד. קֹדֶם שֶׁיְּבָרֵךְ יִבְדֹּק אֶת הַחוּטִים וִיפָרִידָם זֶה מִזֶּה, כְּדֵי שֶׁיּוּכַל לְקַיֵּם מִצְוַת צִיצִית כְּהִלְכָתָהּ וְלֹא יִסְתַּבְּכוּ הַחוּטִים אֵלּוּ בָּאֵלּוּ.",
    francais: "4. Avant de réciter la bénédiction, on inspectera les fils et on les séparera les uns des autres afin de pouvoir accomplir la Mitsva du Tsitsit selon la règle, évitant que les franges ne s'emmêlent entre elles."
  },
  {
    seif: "5",
    titre_seif: "Interdiction d'interruption orale pendant la bénédiction",
    brut: "ה. לאחר שבערך על הטלית לא יפסיק בדיבור עד שיסים את העטיפה, ואם הפסיק בדברים שאינם מענין העטיפה, יחזור ויברך.",
    voyelles: "ה. לְאַחַר שֶׁבֵּרַךְ עַל הַטַּלִּית לֹא יַפְסִיק בְּדִבּוּר עַד שֶׁיְּסַיֵּם אֶת הָעֲטִיפָה, וְאִם הִפְסִיק בִּדְבָרִים שֶׁאֵינָם מֵעִנְיַן הָעֲטִיפָה, יַחֲזֹר וִיבָרֵךְ.",
    francais: "5. Après avoir récité la bénédiction sur le Tallit, on ne s'interrompra pas par la parole avant d'avoir achevé l'enveloppement. Si l'on s'est interrompu par des paroles étrangères à la Mitsva, il faut réciter à nouveau la bénédiction."
  },
  {
    seif: "6",
    titre_seif: "Procédure exacte d'enveloppement (Atifa)",
    brut: "ו. סדר עטיפת הטלית: יכסה ראשו ורובו בטלית, וירחיק הציציות מפניו, ויזרוק שתי כנפות לצד שמאל לאחוריו, וישהה עטוף ראשו מעט, ואחר כך יורידנה על כתפיו.",
    voyelles: "ו. סֵדֶר עֲטִיפַת הַטַּלִּית: יְכַסֶּה רֹאשׁוֹ וְרוּבּוֹ בַּטַּלִּית, וְיַרְחִיק הַצִּיצִיּוֹת מִפָּנָיו, וְיִזְרֹק שְׁתֵּי כַּנְפוֹת לְצַד שְׁמֹאל לְאַחֲרָיו, וְיִשְׁהֶה עָטוּף רֹאשׁוֹ מְעַט, וְאַחַר כָּךְ יוֹרִידֶנָּה עַל כְּתֵפָיו.",
    francais: "6. L'ordre de l'enveloppement du Tallit : on se couvrira la tête et la majeure partie du corps avec le Tallit, on éloignera les franges de son visage, on rejettera deux coins par-dessus l'épaule gauche vers l'arrière, on restera ainsi la tête couverte un bref instant, puis on le rabaissera sur ses épaules."
  },
  {
    seif: "7",
    titre_seif: "Tallit retiré brièvement et réitération de la bénédiction",
    brut: "ז. מי שפשט טליתו על מנת ללובשה מיד, כגון שנכנס לבית הכסא, כשחוזר ולובשה אינו צריך לחזור ולברך, מפני שאין זו היסח הדעת.",
    voyelles: "ז. מִי שֶׁפָּשַׁט טַלִּיתוֹ עַל מְנָת לִלְבֹּשָׁהּ מִיָּד, כְּגוֹן שֶׁנִּכְנַס לְבֵית הַכִּסֵּא, כְּשֶׁחוֹזֵר וְלוֹבְשָׁהּ אֵינוֹ צָרִיךְ לַחֲזֹר וּלְבָרֵךְ, מִפְּנֵי שֶׁאֵין זוֹ הֶסֵּחַ הַדַּעַת.",
    francais: "7. Celui qui a retiré son Tallit dans l'intention de le remettre immédiatement, comme pour aller aux toilettes : lorsqu'il le revêt à nouveau, il n'a pas besoin de réciter une nouvelle bénédiction, car cela ne constitue pas une interruption d'attention (Hesah HaDa'at)."
  },
  {
    seif: "8",
    titre_seif: "Cas du Tallit glissé ou tombé du corps",
    brut: "ח. אם נפלה הטלית כולה מעל גופו שלא ברצונו, כשחוזר להתעטף בה צריך לחזור ולברך. אך אם נשארה מקצתה על כתפיו, אינו מברך.",
    voyelles: "ח. אִם נָפְלָה הַטַּלִּית כֻּלָּהּ מֵעַל גּוּפוֹ שֶׁלֹּא בִּרְצוֹנוֹ, כְּשֶׁחוֹזֵר לְהִתְעַטֵּף בָּהּ צָרִיךְ לַחֲזֹר וּלְבָרֵךְ. אַךְ אִם נִשְׁאֲרָה מִקְצָתָהּ עַל כְּתֵפָיו, אֵינוֹ מְבָרֵךְ.",
    francais: "8. Si le Tallit a glissé et est tombé entièrement du corps contre sa volonté : lorsqu'on s'en enveloppe à nouveau, il faut réciter la bénédiction. Cependant, si une partie du Tallit est restée appuyée sur les épaules, on ne récite pas de nouvelle bénédiction."
  },
  {
    seif: "9",
    titre_seif: "Bénédiction sur un Tallit emprunté ou de la synagogue",
    brut: "ט. המושאל טלית מחבירו לעלות לתורה, אינו מברך עליה, לפי שאינה שלו. אבל הלובש טלית של הקהל או טלית שאולה לתפלה כולו, מברך עליה.",
    voyelles: "ט. הַמֻּשְׁאָל טַלִּית מֵחֲבֵרוֹ לַעֲלוֹת לַתּוֹרָה, אֵינוֹ מְבָרֵךְ עָלֶיהָ, לְפִי שֶׁאֵינָהּ שֶׁלּוֹ. אֲבָל הַלּוֹבֵשׁ טַלִּית שֶׁל הַקָּהָל אוֹ טַלִּית שְׁאוּלָה לַתְּפִלָּה כֻּלּוֹ, מְבָרֵךְ עָלֶיהָ.",
    francais: "9. Celui qui emprunte le Tallit d'un ami uniquement pour monter à la Torah ne récite pas de bénédiction dessus, car il ne lui appartient pas pour un usage prolongé. En revanche, celui qui revêt le Tallit de la communauté ou un Tallit emprunté pour toute la prière doit réciter la bénédiction."
  },
  {
    seif: "10",
    titre_seif: "Port du Tallit Katan la nuit et acquittement le matin",
    brut: "י. הלובש טלית קטן בלילה, אינו מברך עליה. ואם נשאר לבוש בטלית קטן כל הלילה, בבוקר יברך על טלית גדול ויפטור את הטלית קטן.",
    voyelles: "י. הַלּוֹבֵשׁ טַלִּית קָטָן בַּלַּיְלָה, אֵינוֹ מְבָרֵךְ עָלֶיהָ. וְאִם נִשְׁאַר לָבוּשׁ בְּטַלִּית קָטָן כָּל הַלַּיְלָה, בַּבֹּקֶר יְבָרֵךְ עַל טַלִּית גָּדוֹל וְיִפְטוֹר אֶת הַטַּלִּית קָטָן.",
    francais: "10. Celui qui enfile un Tallit Katan la nuit ne récite pas de bénédiction. S'il est resté vêtu de son Tallit Katan toute la nuit, le matin venu, il récitera la bénédiction sur son Tallit Gadol et acquittera ainsi le Tallit Katan."
  },
  {
    seif: "11",
    titre_seif: "Couverture de la tête lors de la bénédiction",
    brut: "יא. לא יברך על הטלית כשהוא גלוי ראש, אלא יכסה ראשו בכיפה או בכובע, מפני שאסור להוציא שם שמים מפיו בגלוי ראש.",
    voyelles: "יא. לֹא יְבָרֵךְ עַל הַטַּלִּית כְּשֶׁהוּא גְּלוּי רֹאשׁ, אֶלָּא יְכַסֶּה רֹאשׁוֹ בְּכִפָּה אוֹ בְּכוֹבַע, מִפְּנֵי שֶׁאָסוּר לְהוֹצִיא שֵׁם שָׁמַיִם מִפִּיו בִּגְלוּי רֹאשׁ.",
    francais: "11. On ne récitera pas la bénédiction sur le Tallit la tête découverte ; on se couvrira la tête avec une Kippa ou un chapeau, car il est interdit de prononcer le Nom du Ciel la tête découverte."
  },
  {
    seif: "12",
    titre_seif: "La joie et la sainteté de l'enveloppement",
    brut: "יב. ישמח האדם בעשיית מצות ציצית, ויבין שעל ידי עטיפת הטלית הוא חוסה בצלא דמהימנותא וממשיך עליו קדושה ויראת שמים לכל היום.",
    voyelles: "יב. יִשְׂמַח הָאָדָם בַּעֲשִׂיַּת מִצְוַת צִיצִית, וְיָבִין שֶׁעַל יְדֵי עֲטִיפַת הַטַּלִּית הוּא חוֹסֶה בְּצִלָּא דִּמְהֵימְנוּתָא וּמַמְשִׁיךְ עָלָיו קְדֻשָּׁה וְיִרְאַת שָׁמַיִם לְכָל הַיּוֹם.",
    francais: "12. L'homme se réjouira d'accomplir la Mitsva du Tsitsit et comprendra que par l'enveloppement du Tallit, il s'abrite sous l'ombre de la Foi divine, attirant sur lui la sainteté et la crainte du Ciel pour toute la journée."
  }
];

const DICT = {
  "כשמתעטף": { fr: "Lorsqu'il s'enveloppe", context: "Lorsqu'il s'enveloppe", infinitif: "לְהִתְעַטֵּף = S'envelopper" },
  "בציצית": { fr: "Dans le Tsitsit", context: "Dans le Tsitsit" },
  "יתכוון": { fr: "Aura l'intention", context: "Aura l'intention", infinitif: "לְהִתְכַּוֵּן = Avoir l'intention / Penser" },
  "שצונו": { fr: "Qu'Il nous a ordonné", context: "Qu'Il nous a ordonné", infinitif: "לְצַוּוֹת = Ordonner" },
  "הקדוש": { fr: "Le Saint", context: "Le Saint" },
  "ברוך": { fr: "Béni soit", context: "Béni soit" },
  "הוא": { fr: "Il", context: "Il" },
  "להתעטף": { fr: "De s'envelopper", context: "De s'envelopper", infinitif: "לְהִתְעַטֵּף = S'envelopper" },
  "כדי": { fr: "Afin de", context: "Afin de" },
  "שנזכור": { fr: "Que nous nous rappelions", context: "Que nous nous rappelions", infinitif: "לִזְכֹּר = Se rappeler" },
  "כל": { fr: "Toutes / Tout", context: "Toutes" },
  "מצותיו": { fr: "Ses Mitsvot", context: "Ses Mitsvot" },
  "לעשותם": { fr: "Pour les accomplir", context: "Pour les accomplir", infinitif: "לַעֲשׂוֹת = Faire / Accomplir" },
  "כדכתיב": { fr: "Comme il est écrit", context: "Comme il est écrit" },
  "וזכרתם": { fr: "Et vous vous rappellerez", context: "Et vous vous rappellerez", infinitif: "לִזְכֹּר = Se rappeler" },
  "את": { fr: "[Particule COD]", context: "[Accusatif]" },
  "המצות": { fr: "Les Mitsvot", context: "Les Mitsvot" },
  "ועשיתם": { fr: "Et vous les accomplirez", context: "Et vous les accomplirez", infinitif: "לַעֲשׂוֹת = Faire" },
  "אותם": { fr: "Eux / Les", context: "Les" },
  "צריך": { fr: "Il faut", context: "Il faut" },
  "לברך": { fr: "Bénir / Réciter", context: "Bénir", infinitif: "לְבָרֵךְ = Bénir" },
  "על": { fr: "Sur", context: "Sur" },
  "הטלית": { fr: "Le Tallit", context: "Le Tallit" },
  "כשהוא": { fr: "Lorsqu'il est", context: "Lorsqu'il est" },
  "עומד": { fr: "Debout", context: "Debout", infinitif: "לַעֲמֹד = Être debout / Se tenir" },
  "שכל": { fr: "Car toutes", context: "Car toutes" },
  "מברכים": { fr: "On récite la bénédiction", context: "On bénit", infinitif: "לְבָרֵךְ = Bénir" },
  "עליהן": { fr: "Sur elles", context: "Sur elles" },
  "מעומד": { fr: "Debout", context: "Debout" },
  "ואם": { fr: "Et si", context: "Et si" },
  "ברך": { fr: "A béni", context: "A béni" },
  "מיושב": { fr: "Assis", context: "Assis", infinitif: "לָשֶׁבֶת = Être assis" },
  "יצא": { fr: "Est quitte", context: "Est quitte", infinitif: "לָצֵאת = Être quitte" },
  "שאין": { fr: "Car non", context: "Car non" },
  "העמידה": { fr: "La station debout", context: "La station debout" },
  "מעכבת": { fr: "N'invalide pas / Empêche pas", context: "N'invalide pas" },
  "בדיעבד": { fr: "A posteriori", context: "A posteriori" },
  "נוהגים": { fr: "Ont la coutume", context: "Ont la coutume", infinitif: "לִנְהֹג = Avoir pour coutume" },
  "ללבוש": { fr: "De porter / revêtir", context: "De revêtir", infinitif: "לִלְבֹּשׁ = Revêtir" },
  "גדול": { fr: "Grand (Gadol)", context: "Gadol" },
  "קודם": { fr: "Avant", context: "Avant" },
  "שנכנסים": { fr: "Qu'on entre", context: "Qu'on entre", infinitif: "לְהִכָּנֵס = Entrer" },
  "לבית": { fr: "Dans la maison de", context: "Dans la maison de" },
  "הכנסת": { fr: "La synagogue", context: "La synagogue" },
  "או": { fr: "Ou", context: "Ou" },
  "מיד": { fr: "Immédiatement", context: "Immédiatement" },
  "כשנכנסים": { fr: "Lorsqu'on entre", context: "Lorsqu'on entre" },
  "להיכנס": { fr: "D'entrer", context: "D'entrer", infinitif: "לְהִכָּנֵס = Entrer" },
  "עטוף": { fr: "Enveloppé", context: "Enveloppé" },
  "במצוה": { fr: "Dans la Mitsva", context: "Dans la Mitsva" },
  "אלא": { fr: "Mais / Que", context: "Que" },
  "נקי": { fr: "Propre", context: "Propre" },
  "כראוי": { fr: "Convenablement", context: "Convenablement" },
  "יבדוק": { fr: "Inspectera", context: "Inspectera", infinitif: "לִבְדֹּק = Inspecter / Vérifier" },
  "החוטים": { fr: "Les fils", context: "Les fils" },
  "ויפרידם": { fr: "Et les séparera", context: "Et les séparera", infinitif: "לְהַפְרִיד = Séparer" },
  "זה": { fr: "Ce / Cet", context: "Cet" },
  "מזה": { fr: "De celui-ci", context: "De celui-ci" },
  "שיוכל": { fr: "Afin qu'il puisse", context: "Afin qu'il puisse", infinitif: "לִיכֹל = Pouvoir" },
  "לקיימ": { fr: "D'accomplir", context: "D'accomplir", infinitif: "לְקַיֵּם = Accomplir" },
  "כהלכתה": { fr: "Selon sa règle halakhique", context: "Selon la règle" },
  "ולא": { fr: "Et ne pas", context: "Et ne pas" },
  "יסתבכו": { fr: "S'emmêleront", context: "S'emmêleront", infinitif: "לְהִסְתַּבֵּךְ = S'emmêler" },
  "אלו": { fr: "Ces", context: "Ces" },
  "באלו": { fr: "Dans celles-ci", context: "Dans celles-ci" },
  "לאחר": { fr: "Après", context: "Après" },
  "שברך": { fr: "Qu'il a béni", context: "Qu'il a béni" },
  "יפסיק": { fr: "S'interrompra", context: "S'interrompra", infinitif: "לְהַפְסִיק = S'interrompre" },
  "בדיבור": { fr: "Par la parole", context: "Par la parole" },
  "שיסים": { fr: "Qu'il termine", context: "Qu'il termine", infinitif: "לְסַיֵּם = Terminer" },
  "העטיפה": { fr: "L'enveloppement", context: "L'enveloppement" },
  "הפסיק": { fr: "S'est interrompu", context: "S'est interrompu" },
  "בדברים": { fr: "Par des paroles", context: "Par des paroles" },
  "שאינם": { fr: "Qui ne sont pas", context: "Qui ne sont pas" },
  "מעניין": { fr: "Du sujet de", context: "Du sujet de" },
  "יחזור": { fr: "Répétera / Récitera à nouveau", context: "Répétera", infinitif: "לַחֲזֹר = Répéter / Revenir" },
  "ויברך": { fr: "Et bénira", context: "Et bénira" },
  "סדר": { fr: "L'ordre de", context: "L'ordre de" },
  "יכסה": { fr: "Couvrira", context: "Couvrira", infinitif: "לְכַסּוֹת = Couvrir" },
  "וירחיק": { fr: "Et éloignera", context: "Et éloignera", infinitif: "לְהַרְחִיק = Éloigner" },
  "הציציות": { fr: "Les franges", context: "Les franges" },
  "מפניו": { fr: "De son visage", context: "De son visage" },
  "ויזרוק": { fr: "Et rejettera", context: "Et rejettera", infinitif: "לִזְרֹק = Rejeter / Lancer" },
  "שתי": { fr: "Deux", context: "Deux" },
  "כנפות": { fr: "Coins", context: "Coins" },
  "לצד": { fr: "Du côté de", context: "Du côté de" },
  "שמאל": { fr: "Gauche", context: "Gauche" },
  "לאחוריו": { fr: "Vers son arrière", context: "Vers son arrière" },
  "וישהה": { fr: "Et restera", context: "Et restera", infinitif: "לִשְׁהוֹת = Rester / Patienter" },
  "מעט": { fr: "Un peu / Bref", context: "Un peu" },
  "ואחר": { fr: "Et après", context: "Et après" },
  "כך": { fr: "Ainsi", context: "Ainsi" },
  "יורידנה": { fr: "La rabaissera", context: "La rabaissera", infinitif: "לְהוֹרִיד = Rabaisser / Descendre" },
  "כתפיו": { fr: "Ses épaules", context: "Ses épaules" },
  "מי": { fr: "Celui qui", context: "Celui qui" },
  "שפשט": { fr: "Qui a retiré", context: "Qui a retiré", infinitif: "לִפְשֹׁט = Retirer" },
  "טליתו": { fr: "Son Tallit", context: "Son Tallit" },
  "מנת": { fr: "Intention / But", context: "Intention" },
  "ללובשה": { fr: "De le remettre", context: "De le remettre", infinitif: "לִלְבֹּשׁ = Porter" },
  "כגון": { fr: "Par exemple", context: "Par exemple" },
  "שנכנס": { fr: "Qu'il est entré", context: "Qu'il est entré" },
  "הכסא": { fr: "Aux toilettes", context: "Aux toilettes" },
  "כשחוזר": { fr: "Lorsqu'il revient", context: "Lorsqu'il revient", infinitif: "לַחֲזֹר = Revenir" },
  "ולובשה": { fr: "Et le revêt", context: "Et le revêt" },
  "אינו": { fr: "N'est pas", context: "N'est pas" },
  "היסח": { fr: "Interruption de", context: "Interruption de" },
  "הדעת": { fr: "L'attention / L'esprit", context: "L'attention" },
  "אם": { fr: "Si", context: "Si" },
  "נפלה": { fr: "Est tombé", context: "Est tombé", infinitif: "לִנְפֹּל = Tomber" },
  "כולה": { fr: "En totalité", context: "En totalité" },
  "מעל": { fr: "Au-dessus de / De", context: "De" },
  "גופו": { fr: "Son corps", context: "Son corps" },
  "שלא": { fr: "Sans", context: "Sans" },
  "בירצונו": { fr: "Sa volonté", context: "Sa volonté" },
  "בה": { fr: "En lui", context: "En lui" },
  "נשארה": { fr: "Est restée", context: "Est restée", infinitif: "לְהִשָּׁאֵר = Rester" },
  "מקצתה": { fr: "Une partie de lui", context: "Une partie" },
  "המושאל": { fr: "Celui qui emprunte", context: "Celui qui emprunte", infinitif: "לִשְׁאֹל = Emprunter" },
  "מחבירו": { fr: "De son ami", context: "De son ami" },
  "לעלות": { fr: "Pour monter", context: "Pour monter", infinitif: "לַעֲלוֹת = Monter" },
  "לתורה": { fr: "À la Torah", context: "À la Torah" },
  "עליה": { fr: "Sur lui", context: "Sur lui" },
  "לפי": { fr: "Car", context: "Car" },
  "שאינה": { fr: "Qu'il n'est pas", context: "Qu'il n'est pas" },
  "שלו": { fr: "À lui", context: "À lui" },
  "הלובש": { fr: "Celui qui revêt", context: "Celui qui revêt" },
  "הקהל": { fr: "La communauté", context: "La communauté" },
  "שאולה": { fr: "Emprunté", context: "Emprunté" },
  "לתפלה": { fr: "Pour la prière", context: "Pour la prière" },
  "כולו": { fr: "Toute entière", context: "Toute entière" },
  "נשאר": { fr: "Est resté", context: "Est resté", infinitif: "לְהִשָּׁאֵר = Rester" },
  "גלוי": { fr: "Découvert", context: "Découvert" },
  "ראש": { fr: "Tête", context: "Tête" },
  "יכסה": { fr: "Couvrira", context: "Couvrira" },
  "בכיפה": { fr: "Avec une Kippa", context: "Avec une Kippa" },
  "בכובע": { fr: "Avec un chapeau", context: "Avec un chapeau" },
  "שאסור": { fr: "Car il est interdit", context: "Car il est interdit" },
  "להוציא": { fr: "De prononcer / sortir", context: "De prononcer", infinitif: "לְהוֹצִיא = Prononcer / Sortir" },
  "שם": { fr: "Le Nom de", context: "Le Nom de" },
  "שמים": { fr: "Ciel (D.ieu)", context: "Ciel" },
  "מפיו": { fr: "De sa bouche", context: "De sa bouche" },
  "ישמח": { fr: "Se réjouira", context: "Se réjouira", infinitif: "לִשְׂמֹחַ = Se réjouir" },
  "בעשיית": { fr: "Dans l'accomplissement de", context: "Dans l'accomplissement" },
  "ויבין": { fr: "Et comprendra", context: "Et comprendra", infinitif: "לְהָבִין = Comprendre" },
  "חוסה": { fr: "S'abrite", context: "S'abrite", infinitif: "לַחֲסוֹת = S'abriter" },
  "בצלא": { fr: "Sous l'ombre de", context: "Sous l'ombre de" },
  "דמהימנותא": { fr: "La Foi (Araméen)", context: "La Foi divine" },
  "וממשיך": { fr: "Et attire", context: "Et attire", infinitif: "לִמְשֹׁךְ = Attirer / Tirer" },
  "קדושה": { fr: "Sainteté", context: "Sainteté" },
  "ויראת": { fr: "Et crainte de", context: "Et crainte de" }
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
    sujet: "הלכות לבישת הטלית וברכתה",
    sujet_fr: "Chapitre 9 - Lois du port du Tallit, de sa bénédiction et de la kavanah",
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
  siman: "9",
  halakhot
};

const jsonStr = JSON.stringify(outputObj, null, 2);

fs.mkdirSync(path.dirname(OUTPUT_SHABBAT), { recursive: true });
fs.writeFileSync(OUTPUT_SHABBAT, jsonStr, 'utf8');
fs.writeFileSync(OUTPUT_DATA_SIMAN, jsonStr, 'utf8');
fs.writeFileSync(OUTPUT_DATA_YALKOUT, jsonStr, 'utf8');

console.log(`✅ Siman 9 built successfully with ${halakhot.length} Seifim across all 3 data paths!`);
