import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const OUT1 = path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', 'siman_10.json');
const OUT2 = path.join(ROOT, 'public', 'data', 'siman_10.json');
const OUT3 = path.join(ROOT, 'public', 'data', 'yalkout-10.json');

const raw17Seifim = [
  {
    seif: "1",
    titre_seif: "Filature Lishmah (avec intention sacrée)",
    brut: "א. חוטי הציצית צריכים להיות נטווים ונשזרים לשמה, דהיינו לשם מצות ציצית. ואם נטוו שלא לשמה, הציצית פסולה.",
    voyelles: "א. חוּטֵי הַצִּיצִית צְרִיכִים לִהְיוֹת נִטְוִים וְנִשְׁזָרִים לִשְׁמָהּ, דְּהַיְנוּ לְשֵׁם מִצְוַת צִיצִית. וְאִם נִטְווּ שֶׁלֹּא לִשְׁמָהּ, הַצִּיצִית פְּסוּלָה.",
    francais: "1. Les fils du Tsitsit doivent être filés et tordus Lishmah (avec l'intention d'accomplir la Mitsva du Tsitsit). Si les fils ont été fabriqués sans cette intention, le Tsitsit est invalide."
  },
  {
    seif: "2",
    titre_seif: "Déclaration verbale au début du travail",
    brut: "ב. צריך שיאמר הטווה בתחלת הטוויה שהוא עושה כן לשם מצות ציצית, ואם אמר כן בתחלה, סגי, ואינו צריך לומר כן בכל עת.",
    voyelles: "ב. צָרִיךְ שֶׁיֹּאמַר הַטּוֹוֶה בִּתְחִלַּת הַטְּוִיָּה שֶׁהוּא עוֹשֶׂה כֵּן לְשֵׁם מִצְוַת צִיצִית, וְאִם אָמַר כֵּן בַּתְּחִלָּה, סַגִּי, וְאֵינוֹ צָרִיךְ לוֹמַר כֵּן בְּכָל עֵת.",
    francais: "2. Le fileur doit déclarer au début du travail de filature qu'il agit ainsi dans l'intention d'accomplir la Mitsva du Tsitsit. S'il l'a dit au début, cela suffit, et il n'a pas besoin de le répéter à chaque instant."
  },
  {
    seif: "3",
    titre_seif: "Exigence d'un exécutant juif majeur (Bar Da'at)",
    brut: "ג. העושה ציצית צריך שיהיה בן ישראל גדול ובר דעת, אבל ציצית שנעשית על ידי נכרי, פסולה, אפילו אם ישראל עומד על גבו ומזהיר אותו.",
    voyelles: "ג. הָעוֹשֶׂה צִיצִית צָרִיךְ שֶׁיִּהְיֶה בֶּן יִשְׂרָאֵל גָּדוֹל וּבַר דַּעַת, אֲבָל צִיצִית שֶׁנַּעֲשֵׂת עַל יְדֵי נָכְרִי, פְּסוּלָה, אֲפִלּוּ אִם יִשְׂרָאֵל עוֹמֵד עַל גַּבּוֹ וּמַזְהִיר אוֹתוֹ.",
    francais: "3. Celui qui confectionne le Tsitsit doit être un Juif majeur et lucide. Un Tsitsit confectionné par un non-juif est invalide, même si un Juif se tient à ses côtés et l'avertit d'agir Lishmah."
  },
  {
    seif: "4",
    titre_seif: "Validité de la filature par une femme juive",
    brut: "ד. אשה ישראלית כשרה לטוות ולשזור חוטי ציצית, בלבד שתאמר בתחלת הטוויה שהוא לשם מצות ציצית.",
    voyelles: "ד. אִשָּׁה יִשְׂרְאֵלִית כְּשֵׁרָה לִטְווֹת וְלִשְׁזֹר חוּטֵי צִיצִית, בִּלְבַד שֶׁתֹּאמַר בִּתְחִלַּת הַטְּוִיָּה שֶׁהוּא לְשֵׁם מִצְוַת צִיצִית.",
    francais: "4. Une femme juive est parfaitement apte à filer et tordre les fils de Tsitsit, à la condition qu'elle déclare au début de la filature qu'elle le fait dans l'intention de la Mitsva du Tsitsit."
  },
  {
    seif: "5",
    titre_seif: "Filature mécanique et activation par un Juif",
    brut: "ה. חוטי ציצית שנטוו במכונה המופעלת על ידי ישראל, אם מפעיל המכונה אומר בתחלת הפעלתה שהוא עושה כן לשם מצות ציצית, כשרים.",
    voyelles: "ה. חוּטֵי צִיצִית שֶׁנִּטְווּ בִּמְכוֹנָה הַמֻּפְעֶלֶת עַל יְדֵי יִשְׂרָאֵל, אִם מַפְעִיל הַמְּכוֹנָה אוֹמֵר בִּתְחִלַּת הַפְעָלָתָהּ שֶׁהוּא עוֹשֶׂה כֵּן לְשֵׁם מִצְוַת צִיצִית, כְּשֵׁרִים.",
    francais: "5. Les fils de Tsitsit filés au moyen d'une machine actionnée par un Juif : si l'opérateur de la machine déclare au moment de sa mise en marche qu'il agit pour la Mitsva du Tsitsit, les fils sont kashers."
  },
  {
    seif: "6",
    titre_seif: "Obligation de tressage (Shezirah) Lishmah",
    brut: "ו. צריכים שזירה לשמה, דהיינו שהחוטים שנטוו לשמה יחזרו וישזרו אותם כפולים לשמה.",
    voyelles: "ו. צְרִיכִים שְׁזִירָה לִשְׁמָהּ, דְּהַיְנוּ שֶׁהַחוּטִים שֶׁנִּטְווּ לִשְׁמָהּ יַחַזְרוּ וְיִשְׁזְרוּ אוֹתָם כְּפוּלִים לִשְׁמָהּ.",
    francais: "6. Il faut également que le tressage (Shezirah) soit fait Lishmah, c'est-à-dire que les fils filés Lishmah soient ensuite tordus deux à deux avec cette même intention sacrée."
  },
  {
    seif: "7",
    titre_seif: "Longueur minimale des franges pendantes (24 cm)",
    brut: "ז. שיעור אורך חוטי הציצית התלויים בכנף הוא שתים עשרה אצבעות (כעשרים וארבעה סנטימטרים), ואם היו ארוכים יותר, כשר.",
    voyelles: "ז. שִׁעוּר אֹרֶךְ חוּטֵי הַצִּיצִית הַתְּלוּיִים בַּכָּנָף הוּא שְׁתֵּים עֶשְׂרֵה אֶצְבָּעוֹת (כְּעֶשְׂרִים וְאַרְבָּעָה סַנְטִימֶטְרִים), וְאִם הָיוּ אֲרֻכִּים יוֹתֵר, כָּשֵׁר.",
    francais: "7. La longueur minimale des fils du Tsitsit pendant au coin du vêtement est de douze largeurs de doigts (environ 24 centimètres). S'ils sont plus longs, le Tsitsit demeure parfaitement kasher."
  },
  {
    seif: "8",
    titre_seif: "Proportion d'un tiers de nœuds et deux tiers libres",
    brut: "ח. ראוי שיהיה שליש הציצית גדיל (הקשרים והחוליות) ושני שלישים ענף (החוטים התלויים חופשיים).",
    voyelles: "ח. רָאוּי שֶׁיִּהְיֶה שְׁלִישׁ הַצִּיצִית גְּדִיל (הַקְּשָׁרִים וְהַחֻלְיוֹת) וּשְׁנֵי שְׁלִישִׁים עָנָף (הַחוּטִים הַתְּלוּיִים חוֹפְשִׁיִּים).",
    francais: "8. Il convient qu'un tiers de la longueur du Tsitsit soit composé des nœuds et enroulements (Guedil), et que les deux tiers restants soient formés par les brins libres (Anaf)."
  },
  {
    seif: "9",
    titre_seif: "Interdiction des fils volés (Mitzva Ba'ah Be'Avera)",
    brut: "ט. ציצית העשויה מחוטים גזולים, פסולה, משום מצוה הבאה בעבירה. אך אם לקח חוטים מחבירו שלא ברשות על מנת לשלם לו, יחזיר או ישלם, והציצית כשרה.",
    voyelles: "ט. צִיצִית הָעֲשׂוּיָה מִחוּטִים גְּזוּלִים, פְּסוּלָה, מִשּׁוּם מִצְוָה הַבָּאָה בַּעֲבֵרָה. אַךְ אִם לָקַח חוּטִים מֵחֲבֵרוֹ שֶׁלֹּא בִּרְשׁוּת עַל מְנָת לְשַׁלֵּם לוֹ, יַחֲזִיר אוֹ יְשַׁלֵּם, וְהַצִּיצִית כְּשֵׁרָה.",
    francais: "9. Un Tsitsit confectionné avec des fils volés est invalide, en raison du principe d'un commandement accompli par une transgression (Mitzva Ba'ah Be'Avera). Toutefois, s'il a pris des fils sans permission dans l'intention d'en rembourser la valeur, il paiera et le Tsitsit est kasher."
  },
  {
    seif: "10",
    titre_seif: "Couleur des fils (préférence pour le blanc)",
    brut: "י. מצוה שיהיו חוטי הציצית כצבע הבגד, ובגד לבן יטיל בו חוטי לבן, וכן נוהגים לכתחילה לעשות חוטי ציצית לבנים בכל בגד.",
    voyelles: "י. מִצְוָה שֶׁיִּהְיוּ חוּטֵי הַצִּיצִית כְּצֶבַע הַבֶּגֶד, וּבֶגֶד לָבָן יַטִּיל בּוֹ חוּטֵי לָבָן, וְכֵן נוֹהֲגִים לְכַתְּחִלָּה לַעֲשׂוֹת חוּטֵי צִיצִית לְבָנִים בְּכָל בֶּגֶד.",
    francais: "10. C'est une Mitsva que les fils du Tsitsit soient de la couleur du vêtement ; pour un vêtement blanc, on y mettra des fils blancs, et la coutume a priori est de faire des fils de Tsitsit blancs pour tout vêtement."
  },
  {
    seif: "11",
    titre_seif: "Découper les fils trop longs après le nouage",
    brut: "יא. אם היו חוטי הציצית ארוכים ביותר וחתך אותם לאחר שקשרם בבגד, כשרים, ואין בזה משום תעשה ולא מן העשוי.",
    voyelles: "יא. אִם הָיוּ חוּטֵי הַצִּיצִית אֲרֻכִּים בְּיוֹתֵר וְחָתַךְ אוֹתָם לְאַחַר שֶׁקְּשָׁרָם בַּבֶּגֶד, כְּשֵׁרִים, וְאֵין בָּזֶה מִשּׁוּם תַּעֲשֶׂה וְלֹא מִן הָעָשׂוּי.",
    francais: "11. Si les fils de Tsitsit étaient très longs et qu'on les a coupés après les avoir noués au vêtement, ils restent kashers, et cela ne contrevient pas au principe de Ta'assé VeLo Min Ha'Assouï."
  },
  {
    seif: "12",
    titre_seif: "Interdiction de couper les fils avec les dents",
    brut: "יב. אין לחתוך חוטי ציצית בשיניים, מפני שמקצר ימים, אלא יחתוך אותם בסכין או במספריים.",
    voyelles: "יב. אֵין לַחְתֹּךְ חוּטֵי צִיצִית בְּשִׁנַּיִם, מִפְּנֵי שֶׁמְּקַצֵּר יָמִים, אֶלָּא יַחְתֹּךְ אוֹתָם בְּסַכִּין אוֹ בְּמִסְפָּרַיִם.",
    francais: "12. On ne coupera pas les fils de Tsitsit avec ses dents, car cela raccourcit la vie ; on les coupera au moyen d'un couteau ou de ciseaux."
  },
  {
    seif: "13",
    titre_seif: "Nombre d'enroulements (7, 8, 11, 13 = 39) selon la Kabbalah",
    brut: "יג. מנהג בני ספרד לכרוך בחוליות הציצית כנגד שם הוי''ה: שבע, שמונה, אחת עשרה, ושלוש עשרה כריכות, ובסך הכל ל''ט כריכות.",
    voyelles: "יג. מִנְהַג בְּנֵי סְפָרַד לִכְרֹךְ בַּחֻלְיוֹת הַצִּיצִית כְּנֶגֶד שֵׁם הֲוָיָ''ה: שֶׁבַע, שְׁמֹנָה, אַחַת עֶשְׂרֵה, וּשְׁלֹשׁ עֶשְׂרֵה כְּרִיכוֹת, וּבְסַךְ הַכֹּל לַ''ט כְּרִיכוֹת.",
    francais: "13. La coutume des Séfarades est d'enrouler les brins de Tsitsit selon la valeur numérique du Nom Divin (HaVaYaH) : 7, 8, 11 et 13 enroulements, formant un total de 39 enroulements (Lamed-Tet)."
  },
  {
    seif: "14",
    titre_seif: "Attacher des Tsitsit la nuit pour le lendemain",
    brut: "יד. מותר לקשור ציצית בבגד בלילה, ואין בזה משום תעשה ולא מן העשוי, וכשילבשנו ביום יברך עליו.",
    voyelles: "יד. מֻתָּר לִקְשֹׁר צִיצִית בַּבֶּגֶד בַּלַּיְלָה, וְאֵין בָּזֶה מִשּׁוּם תַּעֲשֶׂה וְלֹא מִן הָעָשׂוּי, וּכְשֶׁיִּלְבָּשֶׁנּוּ בַּיּוֹם יְבָרֵךְ עָלָיו.",
    francais: "14. Il est permis d'attacher des Tsitsit à un vêtement pendant la nuit ; cela ne contrevient pas au principe de Ta'assé VeLo Min Ha'Assouï, et lorsqu'on le revêtira le jour, on récitera la bénédiction."
  },
  {
    seif: "15",
    titre_seif: "Attacher des Tsitsit au nom d'un autre Juif",
    brut: "טו. הקושר ציצית עבור חבירו, יכוון בשעת הקשירה שהיא נעשית לשם מצות ציצית עבור בעל הבגד.",
    voyelles: "טו. הַקּוֹשֵׁר צִיצִית עֲבוּר חֲבֵרוֹ, יְכַוֵּן בִּשְׁעַת הַקְּשִׁירָה שֶׁהִיא נַעֲשֵׂת לְשֵׁם מִצְוַת צִיצִית עֲבוּר בַּעַל הַבֶּגֶד.",
    francais: "15. Celui qui noue des Tsitsit pour son prochain aura l'intention au moment du nouage que cela est fait pour la Mitsva du Tsitsit au nom du propriétaire du vêtement."
  },
  {
    seif: "16",
    titre_seif: "Séparer clairement les 8 brins avant le nouage",
    brut: "טז. יקפיד להפריד את ארבעת החוטים לשניים קודם הקשירה, כדי שיהיו שמונה חוטים נפרדים וברורים כהלכה.",
    voyelles: "טז. יַקְפִּיד לְהַפְרִיד אֶת אַרְבַּעַת הַחוּטִים לִשְׁנַיִם קֹדֶם הַקְּשִׁירָה, כְּדֵי שֶׁיִּהְיוּ שְׁמֹנָה חוּטִים נִפְרָדִים וּבְרוּרִים כַּהֲלָכָה.",
    francais: "16. On veillera à séparer clairement les quatre fils pliés avant le nouage afin d'obtenir huit brins bien distincts et ordonnés conformément à la Halakha."
  },
  {
    seif: "17",
    titre_seif: "Absence de bénédiction sur la confection (Heksher Mitzva)",
    brut: "יז. אין מברכים על עשיית הציצית וקשירתה, אלא העשייה היא הכשר מצוה, והברכה נתקנה על העטיפה והלבישה בלבד.",
    voyelles: "יז. אֵין מְבָרְכִים עַל עֲשִׂיַּת הַצִּיצִית וּקְשִׁירָתָהּ, אֶלָּא הָעֲשִׂיָּה הִיא הֶכְשֵׁר מִצְוָה, וְהַבְּרָכָה נִתְקְנָה עַל הָעֲטִיפָה וְהַלְּבִישָׁה בִּלְבַד.",
    francais: "17. On ne récite pas de bénédiction au moment de la fabrication ou du nouage du Tsitsit, car la confection constitue une préparation (Heksher Mitzva) ; la bénédiction a été instituée uniquement au moment où l'on revêt ou s'enveloppe du vêtement."
  }
];

const DICT_S10 = {
  "חוטי": { fr: "Fils de", context: "Fils de" },
  "ציצית": { fr: "Tsitsit (Franges)", context: "Tsitsit" },
  "צריכים": { fr: "Doivent", context: "Doivent" },
  "להיות": { fr: "Être", context: "Être", infinitif: "לִהְיוֹת = Être" },
  "נטווים": { fr: "Filés", context: "Filés", infinitif: "לִטְוֹת = Filer" },
  "ונשזרים": { fr: "Et tordus", context: "Et tordus", infinitif: "לִשְׁזֹר = Tordre" },
  "לשמה": { fr: "Lishmah (avec intention sacrée)", context: "Lishmah" },
  "דהיינו": { fr: "C'est-à-dire", context: "C'est-à-dire" },
  "לשם": { fr: "Au nom de", context: "Au nom de" },
  "מצות": { fr: "La Mitsva de", context: "La Mitsva de" },
  "ואם": { fr: "Et si", context: "Et si" },
  "נטוו": { fr: "Ont été filés", context: "Ont été filés" },
  "שלא": { fr: "Sans", context: "Sans" },
  "פסולה": { fr: "Invalide (Passoul)", context: "Invalide" },
  "שיאמר": { fr: "Qu'il dise / déclare", context: "Qu'il déclare", infinitif: "לָמוֹר = Dire / Déclarer" },
  "הטווה": { fr: "Le fileur", context: "Le fileur" },
  "בתחלת": { fr: "Au début de", context: "Au début de" },
  "הטוויה": { fr: "La filature", context: "La filature" },
  "שהוא": { fr: "Qu'il", context: "Qu'il" },
  "עושה": { fr: "Fait", context: "Fait", infinitif: "לַעֲשׂוֹת = Faire" },
  "בתחלה": { fr: "Au début", context: "Au début" },
  "סגי": { fr: "Cela suffit (Araméen)", context: "Cela suffit" },
  "אינו": { fr: "Il n'est pas", context: "Il n'est pas" },
  "צריך": { fr: "Soumis / Besoin", context: "Besoin" },
  "לומר": { fr: "De dire", context: "De dire", infinitif: "לָמוֹר = Dire" },
  "בכל": { fr: "À tout", context: "À tout" },
  "עת": { fr: "Moment / Temps", context: "Moment" },
  "העושה": { fr: "Celui qui fait", context: "Celui qui fait" },
  "ישראל": { fr: "Israël (Juif)", context: "Juif" },
  "גדול": { fr: "Majeur (Adulte)", context: "Majeur" },
  "ור": { fr: "Et de", context: "Et de" },
  "דעת": { fr: "Raison / Lucide", context: "Lucide" },
  "שנעשית": { fr: "Qui est faite", context: "Qui est faite" },
  "ידי": { fr: "Mains de", context: "Mains de" },
  "נכרי": { fr: "Non-juif", context: "Non-juif" },
  "אפילו": { fr: "Même", context: "Même" },
  "עומד": { fr: "Se tient", context: "Se tient", infinitif: "לַעֲמֹד = Se tenir" },
  "גבו": { fr: "Son dos", context: "Son dos" },
  "ומזהיר": { fr: "Et l'avertit", context: "Et l'avertit", infinitif: "לְהַזְהִיר = Avertir" },
  "אש": { fr: "Femme", context: "Femme" },
  "ישראלית": { fr: "Juive", context: "Juive" },
  "כשרה": { fr: "Apte / Kasher", context: "Apte" },
  "לבוש": { fr: "Porter", context: "Porter" },
  "בלבד": { fr: "À la seule condition", context: "À la seule condition" },
  "שתאמר": { fr: "Qu'elle déclare", context: "Qu'elle déclare", infinitif: "לָמוֹר = Dire" },
  "במכונה": { fr: "Dans une machine", context: "Dans une machine" },
  "המופעלת": { fr: "Actionnée", context: "Actionnée", infinitif: "לְהַפְעִיל = Actionner / Mettre en marche" },
  "מפעיל": { fr: "L'opérateur de", context: "L'opérateur de" },
  "המכונה": { fr: "La machine", context: "La machine" },
  "אומר": { fr: "Dit", context: "Dit" },
  "הפעלתה": { fr: "Sa mise en marche", context: "Sa mise en marche" },
  "כשרים": { fr: "Kashers / Valides", context: "Kashers" },
  "שזירה": { fr: "Le tressage", context: "Le tressage" },
  "יחזרו": { fr: "Reviendront", context: "Reviendront", infinitif: "לַחֲזֹר = Revenir / Répéter" },
  "וישזרו": { fr: "Et tordront", context: "Et tordront", infinitif: "לִשְׁזֹר = Tordre" },
  "כפולים": { fr: "Pliés deux à deux", context: "Pliés" },
  "שיעור": { fr: "La mesure de", context: "La mesure de" },
  "אורך": { fr: "Longueur", context: "Longueur" },
  "התלויים": { fr: "Qui pendent", context: "Qui pendent" },
  "בכנף": { fr: "Au coin", context: "Au coin" },
  "שתים": { fr: "Deux", context: "Deux" },
  "עשרי": { fr: "Dix", context: "Dix" },
  "אצבעות": { fr: "Doigts", context: "Doigts" },
  "כעשרים": { fr: "Environ vingt", context: "Environ 20" },
  "וארבעה": { fr: "Et quatre", context: "Et 4" },
  "סנטימטרים": { fr: "Centimètres", context: "Centimètres" },
  "ארוכים": { fr: "Longs", context: "Longs" },
  "יותר": { fr: "Plus", context: "Plus" },
  "כשר": { fr: "Kasher", context: "Kasher" },
  "ראוי": { fr: "Il convient", context: "Il convient" },
  "שליש": { fr: "Un tiers", context: "Un tiers" },
  "גדיל": { fr: "Nœuds et enroulements (Guedil)", context: "Guedil" },
  "הקשרים": { fr: "Les nœuds", context: "Les nœuds" },
  "והחוליות": { fr: "Et les enroulements", context: "Et les enroulements" },
  "ושני": { fr: "Et deux", context: "Et deux" },
  "שלישים": { fr: "Tiers", context: "Tiers" },
  "ענף": { fr: "Brins libres (Anaf)", context: "Brins libres" },
  "חופשיים": { fr: "Libres", context: "Libres" },
  "מחוטים": { fr: "De fils", context: "De fils" },
  "גזולים": { fr: "Volés", context: "Volés" },
  "משום": { fr: "En vertu de", context: "En vertu de" },
  "מצוה": { fr: "Mitsva", context: "Mitsva" },
  "הבאה": { fr: "Qui vient", context: "Qui vient" },
  "בעבירה": { fr: "Par une transgression", context: "Par une transgression" },
  "אך": { fr: "Cependant", context: "Cependant" },
  "לקח": { fr: "A pris", context: "A pris", infinitif: "לָקַחַת = Prendre" },
  "מחבירו": { fr: "De son ami", context: "De son ami" },
  "ברשות": { fr: "Permission", context: "Permission" },
  "מנת": { fr: "Intention", context: "Intention" },
  "לשלם": { fr: "Rembourser", context: "Rembourser", infinitif: "לְשַׁלֵּם = Payer / Rembourser" },
  "יחזיר": { fr: "Rendra", context: "Rendra", infinitif: "לְהַחְזִיר = Rendre" },
  "ישילם": { fr: "Ou paiera", context: "Ou paiera" },
  "כצבע": { fr: "De la couleur de", context: "De la couleur de" },
  "הבגד": { fr: "Le vêtement", context: "Le vêtement" },
  "לבן": { fr: "Blanc", context: "Blanc" },
  "יטיל": { fr: "Mettra", context: "Mettra", infinitif: "לְהַטִּיל = Attacher" },
  "לכתחילה": { fr: "A priori", context: "A priori" },
  "לבנים": { fr: "Blancs", context: "Blancs" },
  "בגד": { fr: "Vêtement", context: "Vêtement" },
  "ופטור": { fr: "Et exempt", context: "Et exempt" },
  "נאמר": { fr: "Il est dit", context: "Il est dit" }
};

function parseHebrewWord(cleanW) {
  if (DICT_S10[cleanW]) return DICT_S10[cleanW];
  const prefixes = ['ו', 'ב', 'כ', 'ל', 'מ', 'ש', 'ה'];
  for (const p of prefixes) {
    if (cleanW.startsWith(p) && cleanW.length > 2) {
      const sub = cleanW.slice(1);
      if (DICT_S10[sub]) return DICT_S10[sub];
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
    sujet: "הלכות עשיית הציצית והכשרת החוטים",
    sujet_fr: "Chapitre 10 - Confection du Tsitsit et sainteté des franges (17 Seifim)",
    titre_seif: item.titre_seif,
    texte_integral: {
      hebreu_sans_voyelles: item.brut,
      hebreu_avec_voyelles: item.voyelles,
      francais: item.francais
    },
    mots_alignes
  };
}

const halakhot = raw17Seifim.map(processSeif);

const outputObj = {
  siman: "10",
  halakhot
};

const jsonStr = JSON.stringify(outputObj, null, 2);

fs.mkdirSync(path.dirname(OUT1), { recursive: true });
fs.writeFileSync(OUT1, jsonStr, 'utf8');
fs.writeFileSync(OUT2, jsonStr, 'utf8');
fs.writeFileSync(OUT3, jsonStr, 'utf8');

console.log(`🎉 Siman 10 completely rebuilt with ALL ${halakhot.length} Seifim across all 3 data paths!`);
