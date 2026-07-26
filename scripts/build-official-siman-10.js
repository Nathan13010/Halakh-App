import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const OUT1 = path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', 'siman_10.json');
const OUT2 = path.join(ROOT, 'public', 'data', 'siman_10.json');
const OUT3 = path.join(ROOT, 'public', 'data', 'yalkout-10.json');

const officialYalkutYosefSiman10 = [
  {
    seif: "1",
    titre_seif: "Exemption de l'écharpe d'hiver (Tza'if)",
    brut: "א. צעיף שנותנים על הצואר בימות החורף, אף-על-פי שיש לו ד' כנפות ויש בו שיעור טלית, פטור מציצית. וירא שמים יעשה קרן אחת בעיגול.",
    voyelles: "א. צָעִיף שֶׁנּוֹתְנִים עַל הַצַּוָּאר בִּימוֹת הַחֹרֶף, אַף-עַל-פִּי שֶׁיֵּשׁ לוֹ ד' כַּנְפוֹת וְיֵשׁ בּוֹ שִׁעוּר טַלִּית, פָּטוּר מִצִּיצִית. וִירֵא שָׁמַיִם יַעֲשֶׂה קֶרֶן אַחַת בְּעִגּוּל.",
    francais: "1. Une écharpe qu'on met autour du cou en hiver, même si elle possède quatre coins et la dimension minimale d'un Tallit, est exempte de la Mitsva du Tsitsit. Un homme craignant le Ciel arrondira l'un des coins pour éliminer tout doute."
  },
  {
    seif: "2",
    titre_seif: "Vêtement à plus de quatre coins",
    brut: "ב. טלית שאין בה ד' כנפות פטורה מציצית, יש לה יותר מארבע כנפות, חייב להטיל ציציות בארבע כנפות המרוחקות זו מזו. וכן דעת מרן השלחן ערוך.",
    voyelles: "ב. טַלִּית שֶׁאֵין בָּהּ ד' כַּנְפוֹת פְּטוּרָה מִצִּיצִית, יֵשׁ לָהּ יוֹתֵר מֵאַרְבַּע כַּנְפוֹת, חַיָּב לְהַטִּיל צִיצִיּוֹת בְּאַרְבַּע כַּנְפוֹת הַמְּרֻחָקוֹת זוֹ מִזּוֹ. וְכֵן דַּעַת מָרָן הַשֻּׁלְחָן עָרוּךְ.",
    francais: "2. Un Tallit qui ne possède pas 4 coins est exempt de Tsitsit. S'il possède plus de 4 coins, on a l'obligation de mettre des Tsitsiot aux 4 coins les plus distants les uns des autres, selon l'avis de Maran le Shoulhan Aroukh."
  },
  {
    seif: "3",
    titre_seif: "Interdiction d'ajouter une 5ème frange (Bal Tossif)",
    brut: "ג. בגד שיש בו ה' כנפות, ועבר והטיל בו ה' ציציות, עובר משום בל תוסיף.",
    voyelles: "ג. בֶּגֶד שֶׁיֵּשׁ בּוֹ ה' כַּנְפוֹת, וְעָבַר וְהִטִּיל בּוֹ ה' צִיצִיּוֹת, עוֹבֵר מִשּׁוּם בַּל תּוֹסִיף.",
    francais: "3. Un vêtement qui possède 5 coins : si l'on a transgressé en y installant 5 Tsitsiot, on transgresse l'interdiction de Bal Tossif (ne rien ajouter aux Mitsvot)."
  },
  {
    seif: "4",
    titre_seif: "Cas du manteau long (Frak)",
    brut: "ד. מעיל ארוך הפתוח ברובו מאחריו (הנקרא פראק), נהגו לעשות בו עיגול בכנף אחד, כדי שלא יצטרך להטיל בו ציצית לכולי עלמא.",
    voyelles: "ד. מְעִיל אָרֹךְ הַפָּתוּחַ בְּרֻבּוֹ מֵאַחֲרָיו (הַנִּקְרָא פְרָאק), נָהֲגוּ לַעֲשׂוֹת בּוֹ עִגּוּל בְּכָנָף אֶחָד, כְּדֵי שֶׁלֹּא יִצְטָרֵךְ לְהַטִּיל בּוֹ צִיצִית לְכֻלֵּי עָלְמָא.",
    francais: "4. Pour un manteau long ouvert en majeure partie à l'arrière (appelé Frak), la coutume est d'arrondir l'un de ses coins afin de l'exempter de Tsitsit selon tous les avis rabbiniques."
  },
  {
    seif: "5",
    titre_seif: "Chemises modernes avec découpe au col",
    brut: "ה. חולצות ובגדים שיש בהם ד' כנפות, ב' למעלה ליד הצואר, וב' למטה, כבר פשט המנהג שאין מטילין בהם ציצית, דלא חשיב כבגד שיש לו ד' כנפות אלא כשב' כנפות מלפניו וב' כנפות מאחריו.",
    voyelles: "ה. חוּלְצוֹת וּבְגָדִים שֶׁיֵּשׁ בָּהֶם ד' כַּנְפוֹת, ב' לְמַעְלָה לְיַד הַצַּוָּאר, וּב' לְמַטָּה, כְּבָר פָּשַׁט הַמִּנְהָג שֶׁאֵין מַטִּילִין בָּהֶם צִיצִית, דְּלֹא חָשִׁיב כְּבֶגֶד שֶׁיֵּשׁ לוֹ ד' כַּנְפוֹת אֶלָּא כְּשֶׁב' כַּנְפוֹת מִלְּפָנָיו וּב' כַּנְפוֹת מֵאַחֲרָיו.",
    francais: "5. Les chemises et vêtements qui comportent 4 coins (2 en haut près du col et 2 en bas) : l'usage universel est de ne pas y mettre de Tsitsit, car un vêtement n'est considéré soumis que s'il comporte 2 coins à l'avant et 2 coins à l'arrière."
  },
  {
    seif: "6",
    titre_seif: "Tallit Katan fermé par boutons-pression",
    brut: "ו. טלית קטן שסוגרים אותו על-ידי לחצנים בצדדיו, עד שנראה שאין לו ארבע כנפות, יש להסתפק בזה אם מקיים באותה שעה מצות ציצית, אבל אחר שפתח את הלחצנים הטלית כשרה.",
    voyelles: "ו. טַלִּית קָטָן שֶׁסּוֹגְרִים אוֹתוֹ עַל-יְדֵי לַחַצְנִים בִּצְדָדָיו, עַד שֶׁנִּרְאֶה שֶׁאֵין לוֹ אַרְבַּע כַּנְפוֹת, יֵשׁ לְהִסְתַּפֵּק בָּזֶה אִם מְקַיֵּם בְּאוֹתָהּ שָׁעָה מִצְוַת צִיצִית, אֲבָל אַחַר שֶׁפָּתַח אֶת הַלַּחַצְנִים הַטַּלִּית כְּשֵׁרָה.",
    francais: "6. Un Tallit Katan fermé sur les côtés au moyen de boutons-pression, au point qu'il semble ne plus avoir 4 coins : il y a un doute quant à savoir si l'on accomplit la Mitsva pendant cette fermeture. Mais une fois les boutons-pression ouverts, le Tallit est parfaitement kasher."
  },
  {
    seif: "7",
    titre_seif: "Ajout d'un 4ème coin sur un vêtement à 3 coins",
    brut: "ז. היו לבגד ג' כנפות, ועשה בהם ג' ציציות, ושוב עשה לבגד כנף ד', ועשה גם בו ציצית, הטלית פסולה, משום שנאמר תעשה ולא מן העשוי.",
    voyelles: "ז. הָיוּ לַבֶּגֶד ג' כַּנְפוֹת, וְעָשָׂה בָּהֶם ג' צִיצִיּוֹת, וְשׁוּב עָשָׂה לַבֶּגֶד כָּנָף ד', וְעָשָׂה גַּם בּוֹ צִיצִית, הַטַּלִּית פְּסוּלָה, מִשּׁוּם שֶׁנֶּאֱמַר תַּעֲשֶׂה וְלֹא מִן הָעָשׂוּי.",
    francais: "7. Si un vêtement n'avait que 3 coins sur lesquels on a installé 3 Tsitsiot, puis qu'on a ajouté un 4ème coin avec son Tsitsit, le Tallit est invalide en vertu du principe Ta'assé VeLo Min Ha'Assouï."
  },
  {
    seif: "8",
    titre_seif: "Coin de Tallit découpé puis réparé",
    brut: "ח. טלית שהיו לה ד' כנפות עם ציציות, ואחר כך נחתך כנף אחד ונעשה עגול, תיקן את הכנף אחר כך, אינו צריך להתיר הציציות, וכן נראה עיקר.",
    voyelles: "ח. טַלִּית שֶׁהָיוּ לָהּ ד' כַּנְפוֹת עִם צִיצִיּוֹת, וְאַחַר כָּךְ נִחְתַּךְ כָּנָף אֶחָד וְנַעֲשָׂה עָגֹל, תִּקֵּן אֶת הַכָּנָף אַחַר כָּךְ, אֵינוֹ צָרִיךְ לְהַתִּיר הַצִּיצִיּוֹת, וְכֵן נִרְאֶה עִקָּר.",
    francais: "8. Un Tallit à 4 coins muni de Tsitsiot dont un coin a été découpé en arrondi puis réparé : a posteriori, il n'est pas nécessaire de défaire et réattacher les Tsitsiot, et tel est l'avis fondamental."
  },
  {
    seif: "9",
    titre_seif: "Coin déchiré et recousu au vêtement",
    brut: "ט. אם נקרע הכנף ורוצה לחברו לבגד, מעיקר הדין אין צריך להתיר ממנו הציציות, ולא נפסל משום תעשה ולא מן העשוי, כיון דתחלת עשייתו בבגד זה היה בכשרות.",
    voyelles: "ט. אִם נִקְרַע הַכָּנָף וְרוֹצֶה לְחַבְּרוֹ לַבֶּגֶד, מֵעִקַּר הַדִּין אֵין צָרִיךְ לְהַתִּיר מִמֶּנּוּ הַצִּיצִיּוֹת, וְלֹא נִפְסַל מִשּׁוּם תַּעֲשֶׂה וְלֹא מִן הָעָשׂוּי, כֵּיוָן דִּתְחִלַּת עֲשִׂיָּתוֹ בְּבֶגֶד זֶה הָיָה בְּכַשְׁרוּת.",
    francais: "9. Si un coin du vêtement s'est déchiré et qu'on souhaite le recoudre : en strict droit halakhique, il n'est pas nécessaire de défaire le Tsitsit au préalable, car la confection initiale avait été faite de manière valide."
  },
  {
    seif: "10",
    titre_seif: "Pliage et couture des coins pour le lavage",
    brut: "י. מי שמכבס את טליתו, וחושש שהחוטים לא יקרעו בכיבוס, ורוצה לכופלן על הכנף, ולתפור כפילות הכנף באופן שהציציות נבלעות בתוך הכפילות, ואחר הכביסה מתיר את התפירות, אין לחוש בזה משום תעשה ולא מן העשוי.",
    voyelles: "י. מִי שֶׁמְּכַבֵּס אֶת טַלִּיתוֹ, וְחוֹשֵׁשׁ שֶׁהַחוּטִים לֹא יִקָּרְעוּ בַּכִּבּוּס, וְרוֹצֶה לְכוֹפְלָן עַל הַכָּנָף, וְלִתְפֹּר כְּפִילוּת הַכָּנָף בְּאֹפֶן שֶׁהַצִּיצִיּוֹת נִבְלָעוֹת בְּתוֹךְ הַכְּפִילוּת, וְאַחַר הַכְּבִיסָה מַתִּיר אֶת הַתְּפִירוֹת, אֵין לָחוּשׁ בָּזֶה מִשּׁוּם תַּעֲשֶׂה וְלֹא מִן הָעָשׂוּי.",
    francais: "10. Celui qui lave son Tallit et craint que les fils ne s'abîment au lavage : s'il plie le coin et le coud temporairement pour y enfermer les franges, puis découd le tout après le lavage, cela est parfaitement permis et ne contrevient pas au principe de Ta'assé VeLo Min Ha'Assouï."
  },
  {
    seif: "11",
    titre_seif: "Tallit déchiré en deux puis recousu",
    brut: "יא. טלית עם ציציות שנקרעה לשנים, אפילו אם נקרעה ברובה, ובא לתופרה, מעיקר הדין אין צריך להתיר הציציות קודם שתופר הבגד, ואין לחוש בזה משום תעשה ולא מן העשוי.",
    voyelles: "יא. טַלִּית עִם צִיצִיּוֹת שֶׁנִּקְרְעָה לִשְׁנַיִם, אֲפִלּוּ אִם נִקְרְעָה בְּרֻבָּהּ, וּבָא לִתְפֹּרָהּ, מֵעִקַּר הַדִּין אֵין צָרִיךְ לְהַתִּיר הַצִּיצִיּוֹת קֹדֶם שֶׁתּוֹפֵר הַבֶּגֶד, וְאֵין לָחוּשׁ בָּזֶה מִשּׁוּם תַּעֲשֶׂה וְלֹא מִן הָעָשׂוּי.",
    francais: "11. Un Tallit avec ses Tsitsiot qui s'est déchiré en deux (même en majeure partie) : si l'on vient le recoudre, en strict droit halakhique, il n'est pas nécessaire de défaire les franges avant la couture."
  },
  {
    seif: "12",
    titre_seif: "Tallit coupé en deux conservant le Chi'our",
    brut: "יב. טלית שחלקוה לשתים, ובכל חלק יש בה שיעור טלית, ונשאר לכל אחת מהם ציצית אחת או שתים, מותר להטיל ציציות בשאר הכנפות, ואין בזה משום תעשה ולא מן העשוי.",
    voyelles: "יב. טַלִּית שֶׁחִלְּקוּהָ לִשְׁתַּיִם, וּבְכָל חֵלֶק יֵשׁ בָּהּ שִׁעוּר טַלִּית, וְנִשְׁאַר לְכָל אַחַת מֵהֶם צִיצִית אַחַת אוֹ שְׁתַּיִם, מֻתָּר לְהַטִּיל צִיצִיּוֹת בִּשְׁאָר הַכַּנְפוֹת, וְאֵין בָּזֶה מִשּׁוּם תַּעֲשֶׂה וְלֹא מִן הָעָשׂוּי.",
    francais: "12. Si l'on a découpé un grand Tallit en deux parties et que chaque partie conserve la dimension minimale d'un Tallit (Chi'our Tallit), il est permis de rajouter des Tsitsiot aux coins manquants sans crainte d'invalidation."
  },
  {
    seif: "13",
    titre_seif: "Vœu d'interdiction (Kounam) sur le Tallit",
    brut: "יג. מי שאסר טליתו בקונם לכל העולם לשלשים יום, וחל יום שלשים בשבת קודש, ובערב שבת הניח בו בעליו ציציות ולבשו בשבת קודש, אין בזה משום תעשה ולא מן העשוי, וכן עיקר לדינא.",
    voyelles: "יג. מִי שֶׁאָסַר טַלִּיתוֹ בְּקוֹנָם לְכָל הָעוֹלָם לִשְׁלֹשִׁים יוֹם, וְחָל יוֹם שְׁלֹשִׁים בְּשַׁבָּת קֹדֶשׁ, וּבְעֶרֶב שַׁבָּת הִנִּיחַ בּוֹ בְּעָלָיו צִיצִיּוֹת וּלְבָשׁוֹ בְּשַׁבָּת קֹדֶשׁ, אֵין בָּזֶה מִשּׁוּם תַּעֲשֶׂה וְלֹא מִן הָעָשׂוּי, וְכֵן עִקָּר לַדִּינָא.",
    francais: "13. Celui qui a fait un vœu d'interdiction (Kounam) sur son Tallit pour 30 jours et que le 30ème jour tombe un Chabbat : s'il a installé des Tsitsiot la veille de Chabbat et qu'il le revêt le jour du Chabbat, cela demeure valide et ne contrevient pas au principe Ta'assé VeLo Min Ha'Assouï."
  },
  {
    seif: "14",
    titre_seif: "Forme carrée obligatoire des coins",
    brut: "יד. צריך שהכנף יהיה מרובע, ולא עגול, דאין עיגול נקרא כנף.",
    voyelles: "יד. צָרִיךְ שֶׁהַכָּנָף יִהְיֶה מְרֻבָּע, וְלֹא עָגֹל, דְּאֵין עִגּוּל נִקְרָא כָּנָף.",
    francais: "14. Le coin du vêtement doit obligatoirement être carré et non arrondi, car une forme arrondie n'est pas appelée coin (Kanaph) en Halakha."
  },
  {
    seif: "15",
    titre_seif: "Vêtement ouvert sur les côtés en bas",
    brut: "טו. בגד שיש לו ד' כנפות ופתוח מהצד לצד מטה, ולמעלה הוא סתום, אם רובו סתום פטור מציצית, ואם רובו פתוח חייב.",
    voyelles: "טו. בֶּגֶד שֶׁיֵּשׁ לוֹ ד' כַּנְפוֹת וּפָתוּחַ מֵהַצַּד לְצַד מַטָּה, וּלְמַעְלָה הוּא סָתוּם, אִם רֻבּוֹ סָתוּם פָּטוּר מִצִּיצִית, וְאִם רֻבּוֹ פָּתוּחַ חַיָּב.",
    francais: "15. Un vêtement possédant 4 coins qui est ouvert sur les côtés dans sa partie inférieure et fermé dans sa partie supérieure : si la majeure partie est fermée, il est exempt ; si la majeure partie est ouverte, il est soumis au Tsitsit."
  },
  {
    seif: "16",
    titre_seif: "Vêtement à moitié ouvert et à moitié fermé",
    brut: "טז. בגד שחציו פתוח וחציו סתום יש להטיל בו ציצית לחומרא, אך אין לברך עליו, ואין יוצאין בו בשבת.",
    voyelles: "טז. בֶּגֶד שֶׁחֶצְיוֹ פָּתוּחַ וְחֶצְיוֹ סָתוּם יֵשׁ לְהַטִּיל בּוֹ צִיצִית לַחֻמְרָא, אַךְ אֵין לְבָרֵךְ עָלָיו, וְאֵין יוֹצְאִין בּוֹ בַּשַּׁבָּת.",
    francais: "16. Un vêtement exactement à moitié ouvert et à moitié fermé : par rigueur (LeHoumra), on y mettra des Tsitsiot, mais on ne récitera pas de bénédiction et on ne sortira pas avec dans le domaine public le Chabbat."
  },
  {
    seif: "17",
    titre_seif: "Exemption de la serviette de bain (Magavet)",
    brut: "יז. המתעטף במגבת, אין צריך להטיל בה ציציות, אחר שאין העיטוף נעשה לשם הנאת לבישה, אלא עיקר המגבת נועדה לניגוב.",
    voyelles: "יז. הַמִּתְעַטֵּף בְּמַגֶּבֶת, אֵין צָרִיךְ לְהַטִּיל בָּהּ צִיצִיּוֹת, אַחַר שֶׁאֵין הָעִיטוּף נַעֲשָׂה לְשֵׁם הֲנָאַת לְבִישָׁה, אֶלָּא עִקַּר הַמַּגֶּבֶת נוֹעֲדָה לְנִגּוּב.",
    francais: "17. Celui qui s'enveloppe dans une serviette de bain n'a pas besoin d'y mettre des Tsitsiot, car l'enveloppement n'est pas fait dans l'intention de s'habiller mais uniquement pour s'essuyer."
  }
];

const DICT = {
  "צעיף": { fr: "Écharpe", context: "Écharpe" },
  "שנותנים": { fr: "Qu'on met / place", context: "Qu'on met", infinitif: "לָתֵת = Donner / Mettre" },
  "הצוואר": { fr: "Le cou", context: "Le cou" },
  "החורף": { fr: "L'hiver", context: "L'hiver" },
  "כנפות": { fr: "Coins", context: "Coins" },
  "שיעור": { fr: "Mesure", context: "Mesure" },
  "טלית": { fr: "Tallit", context: "Tallit" },
  "פטור": { fr: "Exempt", context: "Exempt" },
  "מציצית": { fr: "De Tsitsit", context: "De Tsitsit" },
  "וירא": { fr: "Et un homme craignant", context: "Un homme craignant" },
  "שמים": { fr: "Le Ciel", context: "Le Ciel" },
  "יעשה": { fr: "Fera / Arrondira", context: "Fera", infinitif: "לַעֲשׂוֹת = Faire" },
  "קרן": { fr: "Un coin", context: "Un coin" },
  "בעיגול": { fr: "En arrondi", context: "En arrondi" },
  "חייב": { fr: "Soumis / Obligé", context: "Soumis" },
  "להטיל": { fr: "Mettre", context: "Mettre", infinitif: "לְהַטִּיל = Attacher" },
  "ציציות": { fr: "Tsitsiot", context: "Tsitsiot" },
  "המרוחקות": { fr: "Les plus éloignées", context: "Les plus éloignées" },
  "שלחן": { fr: "Shoulhan", context: "Shoulhan" },
  "ערוך": { fr: "Aroukh", context: "Aroukh" },
  "עובר": { fr: "Transgresse", context: "Transgresse", infinitif: "לַעֲבֹר = Transgresser" },
  "תוסיף": { fr: "N'ajoute pas (Bal Tossif)", context: "N'ajoute pas" },
  "מעיל": { fr: "Manteau", context: "Manteau" },
  "ארוך": { fr: "Long", context: "Long" },
  "הפתוח": { fr: "Qui est ouvert", context: "Ouvert" },
  "ברובו": { fr: "En sa majeure partie", context: "En majeure partie" },
  "פראק": { fr: "Frak (Manteau)", context: "Frak" },
  "חולצות": { fr: "Chemises", context: "Chemises" },
  "בגדים": { fr: "Vêtements", context: "Vêtements" },
  "המנהג": { fr: "La coutume", context: "La coutume" },
  "מטילין": { fr: "On ne met pas", context: "On ne met pas" },
  "לחצנים": { fr: "Boutons-pression", context: "Boutons-pression" },
  "להסתפק": { fr: "Douter / Avoir un doute", context: "Douter", infinitif: "לְהִסְתַּפֵּךְ = Douter" },
  "כשרה": { fr: "Kasher", context: "Kasher" },
  "פסולה": { fr: "Invalide (Passoul)", context: "Invalide" },
  "תעשה": { fr: "Tu feras", context: "Tu feras" },
  "העשוי": { fr: "Le fait accompli", context: "Le fait accompli" },
  "נחתך": { fr: "A été coupé", context: "A été coupé", infinitif: "לְהֵחָתֵךְ = Être coupé" },
  "עגול": { fr: "Arrondi", context: "Arrondi" },
  "נקרע": { fr: "S'est déchiré", context: "S'est déchiré", infinitif: "לְהִקָּרַע = Se déchirer" },
  "מכבס": { fr: "Lave (du linge)", context: "Lave", infinitif: "לְכַבֵּס = Laver" },
  "כביסה": { fr: "Lavage", context: "Lavage" },
  "מרובע": { fr: "Carré", context: "Carré" },
  "מגבת": { fr: "Serviette de bain", context: "Serviette de bain" },
  "לניגוב": { fr: "Pour s'essuyer", context: "Pour s'essuyer", infinitif: "לְנַגֵּב = Essuyer" }
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
    const cleanW = wB.replace(/[.,'׳"״:\(\)\[\]\u05F3\u05F4]/g, '').trim();
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
    sujet: "דיני כנפות הטלית",
    sujet_fr: "Chapitre 10 - Lois des coins du Tallit (Texte Officiel Yalkout Yossef)",
    titre_seif: item.titre_seif,
    texte_integral: {
      hebreu_sans_voyelles: item.brut,
      hebreu_avec_voyelles: item.voyelles,
      francais: item.francais
    },
    mots_alignes
  };
}

const halakhot = officialYalkutYosefSiman10.map(processSeif);

const outputObj = {
  siman: "10",
  halakhot
};

const jsonStr = JSON.stringify(outputObj, null, 2);

fs.mkdirSync(path.dirname(OUT1), { recursive: true });
fs.writeFileSync(OUT1, jsonStr, 'utf8');
fs.writeFileSync(OUT2, jsonStr, 'utf8');
fs.writeFileSync(OUT3, jsonStr, 'utf8');

console.log(`✅ Official Yalkut Yosef Siman 10 built with exact 17 Seifim across all 3 paths!`);
