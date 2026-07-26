import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const OUTPUT_SHABBAT = path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', 'siman_5.json');
const OUTPUT_DATA_SIMAN = path.join(ROOT, 'public', 'data', 'siman_5.json');
const OUTPUT_DATA_YALKOUT = path.join(ROOT, 'public', 'data', 'yalkout-5.json');

const rawSeifim = [
  {
    seif: "1",
    brut: "א. יכוין בברכות פירוש המלות, וכשיזכיר שם ה' יכוין פירוש קריאתו באדנות שהוא אדון הכל. ויכוין בכתיבתו ביו''ד ה''א שהיה הוה ויהיה, ובהזכירו אלוקים יכוין שהוא תקיף ובעל היכולת ובעל הכוחות כולם. ובהזכירו אלהינו יכוין שהוא אלוה שלנו שהוא תקיף ובעל היכולת. ויש אומרים שכל זה אינו אלא בהזכרת שם ה' שבברכות, אבל בשאר הזכרות שם ה' שבפסוקים וכדו' אין צריך לכוין כנז'. ויש חולקים ואומרים דבכל הזכרת שם ה' צריך לכוין כנז'. ולכתחלה נכון לכוין כנז' בכל הזכרת שם ה'. ובפרט יש לכוין כן בברכת אבות שבשמונה עשרה, ובהזכרת שם ה' שבפסוק שמע ישראל.",
    voyelles: "א. יְכַוֵּן בַּבְּרָכוֹת פֵּרוּשׁ הַמִּלּוֹת, וּכְשֶׁיַּזְכִּיר שֵׁם ה' יְכַוֵּן פֵּרוּשׁ קְרִיאָתוֹ בְּאַדְנוּת שֶׁהוּא אֲדוֹן הַכֹּל. וִיכַוֵּן בִּכְתִיבָתוֹ בְּיוֹ\"ד הֵ\"א שֶׁהָיָה הֹוֶה וְיִהְיֶה, וּבְהַזְכִּירוֹ אֱלֹקִים יְכַוֵּן שֶׁהוּא תַּקִּיף וּבַעַל הַיְכֹלֶת וּבַעַל הַכֹּחוֹת כֻּלָּם. וּבְהַזְכִּירוֹ אֱלֹהֵינוּ יְכַוֵּן שֶׁהוּא אֱלֹהַ נָשָׁנוּ שֶׁהוּא תַּקִּיף וּבַעַל הַיְכֹלֶת. וְיֵשׁ אוֹמְרִים שֶׁכָּל זֶה אֵינוֹ אֶלָּא בְּהַזְכָּרַת שֵׁם ה' שֶׁבַּבְּרָכוֹת, אֲבָל בִּשְׁאָר הַזְכָּרוֹת שֵׁם ה' שֶׁבַּפְּסוּקִים וְכַדּוֹ' אֵין צָרִיךְ לְכַוֵּן כַּנִּזְכָּר. וְיֵשׁ חוֹלְקִים וְאוֹמְרִים דְּבָכָל הַזְכָּרַת שֵׁם ה' צָרִיךְ לְכַוֵּן כַּנִּזְכָּר. וּלְכַתְּחִלָּה נָכוֹן לְכַוֵּן כַּנִּזְכָּר בְּכָל הַזְכָּרַת שֵׁם ה'. וּבִפְרָט יֵשׁ לְכַוֵּן כֵּן בְּבִרְכַּת אָבוֹת שֶׁבִּשְׁמוֹנֶה עֶשְׂרֵה, וּבְהַזְכָּרַת שֵׁם ה' שֶׁבַּפָּסוּק שְׁמַע יִשְׂרָאֵל.",
    francais: "1. Lors des bénédictions, il faut penser au sens des mots. Lorsqu'on mentionne le Nom de D.ieu, on aura à l'esprit la signification de sa prononciation selon le Nom d'Adnout : qu'Il est le Maître de tout ; et on aura à l'esprit la signification de son écriture (Yud-Hei-Vav-Hei) : qu'Il était, qu'Il est et qu'Il sera. En mentionnant \"Elokim\", on pensera qu'Il est puissant, Tout-Puissant et Maître de toutes les forces. En mentionnant \"Eloheinou\" (notre D.ieu), on pensera qu'Il est notre D.ieu, puissant et Tout-Puissant. Certains disent que toute cette intention n'est requise que lors de la mention du Nom de D.ieu dans les bénédictions, mais que pour les autres mentions du Nom de D.ieu dans les versets etc., il n'est pas nécessaire de penser à cela. D'autres divergent et affirment que pour toute mention du Nom de D.ieu, il faut avoir cette intention. A priori, il convient d'avoir cette intention à chaque fois qu'on prononce le Nom de D.ieu, et en particulier dans la bénédiction des Avot de l'Amida (Shemoneh Esreh) et lors de la mention du Nom de D.ieu dans le verset de Shema Yisrael.",
    wordTranslations: {
      "יכוין": "penser / avoir à l'esprit",
      "בברכות": "dans les bénédictions",
      "פירוש": "le sens / l'explication",
      "המלות": "des mots",
      "וכשיזכיר": "et lorsqu'on mentionnera",
      "שם": "le Nom de",
      "ה'": "D.ieu",
      "קריאתו": "sa prononciation",
      "באדנות": "selon le Nom d'Adnout",
      "שהוא": "qu'Il est",
      "אדון": "le Maître de",
      "הכל": "tout",
      "בכתיבתו": "son écriture",
      "ביו''ד": "par Yud",
      "ה''א": "Hei",
      "שהיה": "qu'Il était",
      "הוה": "qu'Il est",
      "ויהיה": "et qu'Il sera",
      "ובהזכירו": "et en mentionnant",
      "אלוקים": "Elokim",
      "תקיף": "puissant",
      "ובעל": "et détenteur de",
      "היכולת": "la Toute-Puissance",
      "הכוחות": "les forces",
      "כולם": "toutes",
      "אלהינו": "notre D.ieu",
      "אלוה": "le D.ieu de",
      "שלנו": "nous / notre",
      "ויש": "et certains",
      "אומרים": "disent",
      "שכל": "que tout",
      "זה": "cela",
      "אינו": "n'est",
      "אלא": "que",
      "בהזכרת": "lors de la mention de",
      "שבברכות": "qui est dans les bénédictions",
      "אבל": "mais",
      "בשאר": "dans les autres",
      "הזכרות": "mentions de",
      "שבפסוקים": "qui sont dans les versets",
      "וכדו'": "et similaires",
      "אין": "il n'y a pas",
      "צריך": "besoin de",
      "לכוין": "penser / avoir l'intention",
      "כנז'": "comme mentionné",
      "חולקים": "divergent",
      "ואומרים": "et disent",
      "דבכל": "que pour chaque",
      "ולכתחלה": "et a priori",
      "נכון": "il est correct de",
      "ובפרט": "et en particulier",
      "בברכת": "dans la bénédiction de",
      "אבות": "les Pères (Avot)",
      "שבשמונה": "qui est dans les Huit-Dix",
      "עשרה": "(Amida)",
      "שבפסוק": "qui est dans le verset de",
      "שמע": "Écoute",
      "ישראל": "Israël"
    }
  },
  {
    seif: "2",
    brut: "ב. יש אומרים שצריך לכוין את הכוונה הנ''ל בהזכרת שם ה' שבברכה, בעת שמזכיר את שם ה'. ויש אומרים שמועיל לכוין גם קודם אמירת שם ה', או אחר אמירת שם ה', קודם שימשיך בתיבה שלאחריה.",
    voyelles: "ב. יֵשׁ אוֹמְרִים שֶׁצָּרִיךְ לְכַוֵּן אֶת הַכַּוָּנָה הַנִּזְכֶּרֶת לְעֵיל בְּהַזְכָּרַת שֵׁם ה' שֶׁבַּבְּרָכָה, בְּעֵת שֶׁמַּזְכִּיר אֶת שֵׁם ה'. וְיֵשׁ אוֹמְרִים שֶׁמּוֹעִיל לְכַוֵּן גַּם קֹדֶם אֲמִירַת שֵׁם ה', אוֹ אַחַר אֲמִירַת שֵׁם ה', קֹדֶם שֶׁיַּמְשִׁיךְ בַּתֵּבָה שֶׁלְּאַחֲרֶיהָ.",
    francais: "2. Certains disent qu'il faut avoir l'intention susmentionnée au moment précis où l'on prononce le Nom de D.ieu dans la bénédiction. D'autres dicen qu'il est également valable de penser à cette intention juste avant de prononcer le Nom de D.ieu, ou juste après l'avoir prononcé, avant de continuer le mot suivant.",
    wordTranslations: {
      "יש": "certains",
      "אומרים": "disent",
      "שצריך": "qu'il faut",
      "לכוין": "penser",
      "את": "(marque d'objet)",
      "הכוונה": "l'intention",
      "הנ''ל": "susmentionnée",
      "בהזכרת": "lors de la mention de",
      "שם": "le Nom de",
      "ה'": "D.ieu",
      "שבברכה": "qui est dans la bénédiction",
      "בעת": "au moment où",
      "שמזכיר": "l'on mentionne",
      "שמועיל": "qu'il est efficace / valable de",
      "גם": "aussi",
      "קודם": "avant",
      "אמירת": "l'énonciation de",
      "או": "ou",
      "אחר": "après",
      "שימשיך": "qu'il continue",
      "בתיבה": "dans le mot",
      "שלאחריה": "qui la suit"
    }
  },
  {
    seif: "3",
    brut: "ג. יש מי שאומר שיכול אדם להתנות בכל בוקר, שבכל פעם שיזכיר במשך היום שם ה', יהיה על פי הכוונה הנ''ל. ולכתחלה ראוי לכל אחד להתאמץ ולכוין בשמות הקודש בעת שמברך, ומתפלל, ובכל פעם שיזכיר שם ה' יכוין, ובפרט בקריאת שמע שחיובה מן התורה. ומכל מקום כיון שענין הכוונה לא נזכר בגמרא, אפשר שיש לסמוך על התנאי הנז', להתנות כן בתחלת היום על כל היום, שכל פעם שמזכיר שם ה' הוא מתכוין שהוא אדון הכל, היה הוה ויהיה. ובמשך היום יכוין בכל פעם רק כוונה כללית, שזהו שמו של רבון העולמים. ומכל מקום בקריאת שמע, ובברכה ראשונה של שמונה עשרה יכוין כפי הדין.",
    voyelles: "ג. יֵשׁ מִי שֶׁאוֹמֵר שֶׁיָּכוֹל אָדָם לְהַתְנוֹת בְּכָל בֹּקֶר, שֶׁבְּכָל פַּעַם שֶׁיַּזְכִּיר בְּמַהֲלַךְ הַיּוֹם שֵׁם ה', יִהְיֶה עַל פִּי הַכַּוָּנָה הַנִּזְכֶּרֶת לְעֵיל. וּלְכַתְּחִלָּה רָאוּי לְכָל אֶחָד לְהִתְאַמֵּץ וּלְכַוֵּן בִּשְׁמוֹת הַקֹּדֶשׁ בְּעֵת שֶׁמְּבָרֵךְ, וּמִתְפַּלֵּל, וּבְכָל פַּעַם שֶׁיַּזְכִּיר שֵׁם ה' יְכַוֵּן, וּבִפְרָט בִּקְרִיאַת שְׁמַע שֶׁחִיּוּבָהּ מִן הַתּוֹרָה. וּמִכָּל מָקוֹם כֵּיוָן שֶׁעִנְיַן הַכַּוָּנָה לֹא נִזְכַּר בַּגְּמָרָא, אֶפְשָׁר שֶׁיֵּשׁ לִסְמֹךְ עַל הַתְּנַאי הַנִּזְכָּר, לְהַתְנוֹת כֵּן בִּתְחִלַּת הַיּוֹם עַל כָּל הַיּוֹם, שֶׁכָּל פַּעַם שֶׁמַּזְכִּיר שֵׁם ה' הוּא מִתְכַּוֵּן שֶׁהוּא אֲדוֹן הַכֹּל, הָיָה הֹוֶה וְיִהְיֶה. וּבְמַהֲלַךְ הַיּוֹם יְכַוֵּן בְּכָל פַּעַם רַק כַּוָּנָה כְּלָלִית, שֶׁזֶּהוּ שְׁמוֹ שֶׁל רִבּוֹן הָעוֹלָמִים. וּמִכָּל מָקוֹם בִּקְרִיאַת שְׁמַע, וּבַבְּרָכָה רִאשׁוֹנָה שֶׁל שְׁמוֹנֶה עֶשְׂרֵה יְכַוֵּן כְּפִי הַדִּין.",
    francais: "3. Il y a une opinion selon laquelle un homme peut stipuler chaque matin que chaque fois qu'il prononcera le Nom de D.ieu au cours de la journée, ce sera selon l'intention susmentionnée. A priori, il convient à chacun de faire des efforts pour se concentrer sur les Noms Saints au moment où il bénit et prie, et de penser à leur sens chaque fois qu'il prononce le Nom de D.ieu, en particulier lors du Shema Yisrael dont l'obligation provient de la Torah. Quoi qu'il en soit, étant donné que le détail de cette intention n'est pas explicitement mentionné dans la Gemara, on peut s'appuyer sur la stipulation susmentionnée au début de la journée pour toute la journée : que chaque fois qu'on mentionne le Nom de D.ieu, on pense qu'Il est le Maître de tout, qu'Il était, est et sera. Au cours de la journée, on pourra se contenter d'une intention générale selon laquelle c'est le Nom du Maître du Monde. Néanmoins, lors du Shema Yisrael et dans la première bénédiction de la Shemoneh Esreh (Amida), on devra se concentrer exactement selon la règle.",
    wordTranslations: {
      "מי": "celui / quelqu'un",
      "שאומר": "qui dit",
      "שיכול": "qu'il peut",
      "אדם": "un homme",
      "להתנות": "stipuler / poser une condition",
      "בכל": "chaque",
      "בוקר": "matin",
      "שבכל": "que chaque",
      "פעם": "fois",
      "שיזכיר": "qu'il mentionnera",
      "במשך": "au cours de",
      "היום": "la journée",
      "יהיה": "ce sera",
      "על": "sur",
      "פי": "la bouche de / selon",
      "הכוונה": "l'intention",
      "ולכתחלה": "et a priori",
      "ראוי": "il est digne",
      "לכל": "à chaque",
      "אחד": "un",
      "להתאמץ": "s'efforcer",
      "ולכוין": "et avoir l'intention",
      "בשמות": "dans les Noms de",
      "הקודש": "la Sainteté",
      "בעת": "au moment où",
      "שמברך": "l'on bénit",
      "ומתפלל": "et prie",
      "יכוין": "penser",
      "ובפרט": "et en particulier",
      "בקריאת": "dans la lecture de",
      "שמע": "Shema",
      "שחיובה": "dont l'obligation",
      "מן": "de",
      "התורה": "la Torah",
      "ומכל": "et de chaque",
      "מקום": "lieu / quoi qu'il en soit",
      "כיון": "puisque / étant donné",
      "שענין": "que le sujet de",
      "לא": "ne pas",
      "נזכר": "n'est pas mentionné",
      "בגמרא": "dans la Gemara",
      "אפשר": "il est possible",
      "שיש": "qu'il y a lieu de",
      "לסמוך": "s'appuyer",
      "התנאי": "la condition",
      "בתחלת": "au début de",
      "הוא": "il est",
      "מתכוין": "ayant l'intention",
      "היה": "Il était",
      "הוה": "Il est",
      "ויהיה": "et Il sera",
      "רק": "seulement",
      "כללית": "générale",
      "שזהו": "que c'est",
      "שמו": "Son Nom",
      "של": "de",
      "רבון": "le Souverain de",
      "העולמים": "les Mondes",
      "ובברכה": "et dans la bénédiction",
      "ראשונה": "première",
      "שמונה": "huit",
      "עשרה": "dix",
      "כפי": "selon",
      "הדין": "la règle / la loi"
    }
  },
  {
    seif: "4",
    brut: "ד. יש להזהר בכל הברכות לאומרם בנחת שלא יבלע אותיות, ולברך בשמחה.",
    voyelles: "ד. יֵשׁ לְהִזָּהֵר בְּכָל הַבְּרָכוֹת לְאָמְרָם בְּנַחַת שֶׁלֹּא יִבְלַע אוֹתִיּוֹת, וּלְבָרֵךְ בְּשִׂמְחָה.",
    francais: "4. Il faut veiller dans toutes les bénédictions à les prononcer calmement et sans se presser, afin de ne pas avaler de lettres, et de bénir avec joie.",
    wordTranslations: {
      "להזהר": "faire attention / veiller",
      "בכל": "dans toutes",
      "הברכות": "les bénédictions",
      "לאומרם": "à les prononcer",
      "בנחת": "calmement / avec posé",
      "שלא": "afin de ne pas",
      "יבלע": "avaler",
      "אותיות": "des lettres",
      "ולברך": "et de bénir",
      "בשמחה": "avec joie"
    }
  },
  {
    seif: "5",
    brut: "ה. צריך להקפיד בהזכרת שם ה' לומר אות דל''ת בחולם, ולא כהטועים לומר הדל''ת בשו''א, והופכים שם שמים למשמעות אחרת, כמו ואדניהם כסף.",
    voyelles: "ה. צָרִיךְ לְהַקְפִּיד בְּהַזְכָּרַת שֵׁם ה' לֵאמֹר אוֹת דָּלֶ\"ת בְּחוֹלָם, וְלֹא כַּטּוֹעִים לֵאמֹר הַדָּלֶ\"ת בִּשְׁוָא, וְהוֹפְכִים שֵׁם שָׁמַיִם לְמַשְׁמָעוּת אַחֶרֶת, כְּמוֹ וְאַדְנֵיהֶם כֶּסֶף.",
    francais: "5. Il faut veiller, lorsqu'on prononce le Nom de D.ieu (Adonai), à prononcer la lettre Dalet avec un 'Holem' (A-do-nai) et non comme ceux qui se trompent en la prononçant avec un 'Shva' (Ad-nai), altérant ainsi le sens du Nom Céleste vers une autre signification (comme dans le verset 'et leurs socles d'argent').",
    wordTranslations: {
      "צריך": "il faut",
      "להקפיד": "exiger / veiller minutieusement",
      "בהזכרת": "lors de la mention de",
      "שם": "le Nom de",
      "ה'": "D.ieu",
      "לומר": "dire / prononcer",
      "אות": "la lettre",
      "דל''ת": "Dalet",
      "בחולם": "avec la voyelle Holem",
      "ולא": "et non",
      "כהטועים": "comme ceux qui se trompent",
      "הדל''ת": "la lettre Dalet",
      "בשו''א": "avec un Shva",
      "והופכים": "et altèrent / inversent",
      "שמים": "du Ciel / Céleste",
      "למשמעות": "vers une signification",
      "אחרת": "autre",
      "כמו": "comme",
      "ואדניהם": "et leurs socles",
      "כסף": "d'argent"
    }
  },
  {
    seif: "6",
    brut: "ו. מנהג הספרדים לבטא אות נ' של שם ה' בקמ''ץ רחב, הדומה לניקוד פת''ח, והדייקנים מבדילים קצת ביניהם, כי הקמ''ץ היא תנועה גדולה וכבדה, והפת''ח היא תנועה קטנה. ואף שההבדל ביניהם הוא מועט, מכל מקום המדקדקים יכולים להבחין בהבדל שיש ביניהם. וחדשים מקרוב באו אשר חונכו בישיבות הקדושות של אחינו האשכנזים, ומשנים ניקוד נ' של שם ה', לקמ''ץ חטוף השוה לניקוד חול''ם, כהברת האשכנזים, ובאמת שמבואר בדברי הפוסקים שהמבטא שלנו הוא הוא הנכון, ולכן כל המשנה ידו על התחתונה, ואשר לא טוב עשה בעמיו, ומזלזל במנהג רבותינו, ועובר משום אל תטוש תורת אמך.",
    voyelles: "ו. מִנְהַג הַסְּפָרַדִּים לְבַטֵּא אוֹת נ' שֶׁל שֵׁם ה' בְּקָמָ\"ץ רָחָב, הַדּוֹמֶה לְנִקּוּד פַּתָּח, וְהַדַּיְקָנִים מַבְדִּילִים קְצָת בֵּינֵיהֶם, כִּי הַקָּמָץ הִיא תְּנוּעָה גְּדוֹלָה וּכְבֵדָה, וְהַפַּתָּח הִיא תְּנוּעָה קְטַנָּה. וְאַף שֶׁהַהֶבְדֵּל בֵּינֵיהֶם הוּא מוּעָט, מִכָּל מָקוֹם הַמְּדַקְדְּקִים יְכוֹלִים לְהַבְחִין בַּהֶבְדֵּל שֶׁיֵּשׁ בֵּינֵיהֶם. וַחֲדָשִׁים מִקָּרֹב בָּאוּ אֲשֶׁר חוּנְכוּ בַּיְשִׁיבוֹת הַקְּדוֹשׁוֹת שֶׁל אַחֵינוּ הָאַשְׁכְּנַזִּים, וּמְשַׁנִּים נִקּוּד נ' שֶׁל שֵׁם ה', לְקָמָץ חָטוּף הַשָּׁוֶה לְנִקּוּד חוֹלָם, כְּהַבְרָאַת הָאַשְׁכְּנַזִּים, וּבֶאֱמֶת שֶׁמְּבֹאָר בְּדִבְרֵי הַפּוֹסְקִים שֶׁהַמִּבְטָא שֶׁלָּנוּ הוּא הוּא הַנָּכוֹן, וְלָכֵן כָּל הַמְּשַׁנֶּה יָדוֹ עַל הַתַּחְתּוֹנָה, וַאֲשֶׁר לֹא טוֹב עָשָׂה בְּעַמָּיו, וּמְזַלְזֵל בְּמִנְהַג רַבּוֹתֵינוּ, וְעוֹבֵר מִשּׁוּם אַל תִּטֹּשׁ תּוֹרַת אִמֶּךָ.",
    francais: "6. La coutume des Séfarades est de prononcer la lettre Noun du Nom de D.ieu (Ado-na-i) avec un Kamatz ouvert (Kamatz Rahav), semblable à la voyelle Pata'h, et les grammairiens méticuleux font une légère distinction entre eux, car le Kamatz est une voyelle longue et lourde tandis que le Pata'h est une voyelle courte. Bien que la différence soit minime, les grammairiens attentifs peuvent percevoir la différence. Et certains jeunes récemment formés dans les saintes Yeshivot de nos frères Ashkénazes modifient la prononciation du Noun du Nom de D.ieu en un Kamatz Katan/Hatoef équivalent à un 'Holem (Ado-no-i comme la prononciation ashkénaze). En réalité, il est explicité dans les écrits des Décisionnaires que notre prononciation est la vraie et la correcte. Par conséquent, quiconque modifie cela est désavantagé, n'agit pas bien au sein de son peuple, méprise la coutume de nos Maîtres et enfreint le précepte 'N'abandonne pas l'enseignement de ta mère'.",
    wordTranslations: {
      "מנהג": "la coutume de",
      "הספרדים": "les Séfarades",
      "לבטא": "prononcer",
      "נ'": "la lettre Noun",
      "של": "de",
      "בקמ''ץ": "avec le Kamatz",
      "רחב": "ouvert (Rahav)",
      "הדומה": "qui ressemble",
      "לניקוד": "à la voyelle",
      "פת''ח": "Pata'h",
      "והדייקנים": "et les méticuleux",
      "מבדילים": "distinguent",
      "קצת": "un peu",
      "ביניהם": "entre eux",
      "תנועה": "une voyelle / mouvement",
      "גדולה": "grande / longue",
      "וכבדה": "et lourde",
      "והפת''ח": "et le Pata'h",
      "קטנה": "petite / courte",
      "ואף": "et bien que",
      "שההבדל": "que la différence",
      "הוא": "soit",
      "מועט": "minime",
      "המדקדקים": "les grammairiens",
      "יכולים": "peuvent",
      "להבחין": "percevoir / discerner",
      "בהבדל": "dans la différence",
      "שיש": "qu'il y a",
      "וחדשים": "et des nouveaux",
      "מקרוב": "depuis peu",
      "באו": "sont venus",
      "אשר": "qui",
      "חונכו": "ont été éduqués",
      "בישיבות": "dans les Yeshivot",
      "הקדושות": "saintes",
      "אחינו": "nos frères",
      "האשכנזים": "les Ashkénazes",
      "ומשנים": "et modifient",
      "חטוף": "Katan / Hatoef",
      "השוה": "qui est égal",
      "חול''ם": "au Holem",
      "כהברת": "comme la prononciation de",
      "ובאמת": "et en vérité",
      "שמבואר": "qu'il est explicité",
      "בדברי": "dans les paroles de",
      "הפוסקים": "les Décisionnaires",
      "שהמבטא": "que la prononciation",
      "שלנו": "la nôtre",
      "הנכון": "la correcte",
      "ולכן": "et par conséquent",
      "כל": "tout",
      "המשנה": "celui qui modifie",
      "ידו": "sa main",
      "התחתונה": "est au-dessous (désavantagé)",
      "עשה": "a fait",
      "בעמיו": "parmi son peuple",
      "ומזלזל": "et méprise",
      "במנהג": "la coutume de",
      "רבותינו": "nos Maîtres",
      "ועובר": "et transgresse",
      "משום": "à cause de / en raison de",
      "אל": "ne pas",
      "תטוש": "délaisse / abandonne",
      "תורת": "l'enseignement de",
      "אמך": "ta mère"
    }
  },
  {
    seif: "7",
    brut: "ז. יש נוהגים לומר ''לשם יחוד'' לפני כל מצוה שעושים, או קודם לימודם. ואף על פי שהגאון הנודע ביהודה פקפק בזה, מכל מקום אם הדבר מועיל לו לכוין לשם מצוה, נכון שיאמר נוסח לשם יחוד לפני כל מצוה שמקיים. וכל אדם ינהג כפי מה שהוא מכיר את עצמו, שאם מתעורר לכוין במצוה על ידי הברכה, די בזה ואין צריך שיאמר לשם יחוד, אבל אם אמירת לשם יחוד גורמת לו לכוין יותר בעשיית המצוה, ראוי ונכון שיאמר לשם יחוד לפני כל מצוה ומצוה שעושה.",
    voyelles: "ז. יֵשׁ נוֹהֲגִים לֵאמֹר ''לְשֵׁם יִחוּד'' לִפְנֵי כָּל מִצְוָה שֶׁעוֹשִׂים, אוֹ קֹדֶם לִמּוּדָם. וְאַף עַל פִּי שֶׁהַגָּאוֹן הַנּוֹדָע בִּיהוּדָה פִּקְפֵּק בָּזֶה, מִכָּל מָקוֹם אִם הַדָּבָר מוֹעִיל לוֹ לְכַוֵּן לְשֵׁם מִצְוָה, נָכוֹן שֶׁיֹּאמַר נֻסַּח לְשֵׁם יִחוּד לִפְנֵי כָּל מִצְוָה שֶׁמְּקַיֵּם. וְכָל אָדָם יִנְהַג כְּפִי מַה שֶּׁהוּא מַכִּיר אֶת עַצְמוֹ, שֶׁאִם מִתְעוֹרֵר לְכַוֵּן בַּמִּצְוָה עַל יְדֵי הַבְּרָכָה, דַּי בָּזֶה וְאֵין צָרִיךְ שֶׁיֹּאמַר לְשֵׁם יִחוּד, אֲבָל אִם אֲמִירַת לְשֵׁם יִחוּד גּוֹרֶמֶת לוֹ לְכַוֵּן יוֹתֵר בַּעֲשִׂיַּת הַמִּצְוָה, רָאוּי וְנָכוֹן שֶׁיֹּאמַר לְשֵׁם יִחוּד לִפְנֵי כָּל מִצְוָה וּמִצְוָה שֶׁעוֹשֶׂה.",
    francais: "7. Certains ont pour coutume de réciter 'Leishem Yi'houd' avant chaque mitsva qu'ils accomplissent ou avant d'étudier. Et bien que le Gaon auteur du Noda BiYehuda émette des réserves à ce sujet, néanmoins si cela l'aide à se concentrer dans l'intention de la mitsva, il est approprié qu'il récite la formule du Leishem Yi'houd avant chaque mitsva qu'il accomplit. Chaque personne doit agir selon ce qu'elle se connaît : si la seule bénédiction suffit à l'éveiller à l'intention de la mitsva, cela suffit et il n'est pas nécessaire de réciter le Leishem Yi'houd. Mais si le fait de dire Leishem Yi'houd l'amène à être plus concentré dans l'accomplissement de la mitsva, il est digne et correct qu'il le récite avant chaque mitsva qu'il accomplit.",
    wordTranslations: {
      "נוהגים": "ont pour coutume",
      "לומר": "de réciter",
      "''לשם": "Leishem",
      "יחוד''": "Yi'houd",
      "לפני": "avant",
      "מצוה": "mitsva",
      "שעושים": "qu'ils accomplissent",
      "לימודם": "leur étude",
      "והגאון": "et le Gaon",
      "הנודע": "le Noda",
      "ביהודה": "BiYehuda",
      "פקפק": "a émis des réserves",
      "בזה": "à ce sujet",
      "הדבר": "la chose",
      "מועיל": "est utile / aide",
      "לו": "à lui",
      "נוסח": "la formule de",
      "שמקייים": "qu'il accomplit",
      "אדם": "homme",
      "ינהג": "agira",
      "מכיר": "connaît",
      "עצמו": "lui-même",
      "מתעורר": "est éveillé / stimulé",
      "במצוה": "dans la mitsva",
      "ידי": "les mains de / le moyen de",
      "הברכה": "la bénédiction",
      "די": "cela suffit",
      "אמירת": "l'énonciation de",
      "גורמת": "amène / cause",
      "יותר": "plus",
      "בעשיית": "dans l'accomplissement de",
      "ראוי": "digne",
      "ונכון": "et correct"
    }
  },
  {
    seif: "8",
    brut: "ח. אמרו חז''ל: ההוגה את השם באותיותיו אין לו חלק לעולם הבא. וכתבו הפוסקים והמקובלים, שאף ההוגה שם ה' במילוי אותיותיו, דהיינו שאומר כל אות בפני עצמה, הרי הוא בכלל הוגה את השם באותיותיו. ולכן בנוסח ה''לשם יחוד'' שאומרים לפני כל מצוה או תפלה, צריך לומר, ליחדא שם יו''ד ק''י בוא''ו ק''י. ולא להזכיר ח''ו שם הוי''ה. ואמנם כל זה לענין שם הוי''ה, אבל לענין שם אדנו''ת, וכן לענין שם אהי''ה, יש להקל לאומרו באותיותיו. ואף לענין שם הוי''ה נראה שאם אינו מתכוין לשם הוי''ה, יש להקל. ולכן מותר לומר בתפלת שחרית אביי הוה מסדר המערכה, בלא הפסק בין תיבת אביי להוה, אף על פי שנראה כאומר שם הוי''ה. ומכל מקום טוב יותר שיפסיק מעט בין תיבת אביי לתיבת הוה.",
    voyelles: "ח. אָמְרוּ חֲזַאֶ\"ל: הַהוֹגֶה אֶת הַשֵּׁם בְּאוֹתִיּוֹתָיו אֵין לוֹ חֵלֶק לָעוֹלָם הַבָּא. וְכָתְבוּ הַפּוֹסְקִים וְהַמְּקֻבָּלִים, שֶׁאַף הַהוֹגֶה שֵׁם ה' בְּמִלּוּי אוֹתִיּוֹתָיו, דְּהַיְנוּ שֶׁאוֹמֵר כָּל אוֹת בִּפְנֵי עַצְמָהּ, הֲרֵי הוּא בִּכְלַל הוֹגֶה אֶת הַשֵּׁם בְּאוֹתִיּוֹתָיו. וְלָכֵן בְּנֻסַּח הַ\"לְשֵׁם יִחוּד\" שֶׁאוֹמְרִים לִפְנֵי כָּל מִצְוָה אוֹ תְפִלָּה, צָרִיךְ לֵאמֹר, לְיַחֲדָא שֵׁם יוֹ\"ד קֵ\"י בְּוָא\"ו קֵ\"י. וְלֹא לְהַזְכִּיר חַס וְשָׁלוֹם שֵׁם הֲוָיָ\"ה. וְאָמְנָם כָּל זֶה לְעִנְיַן שֵׁם הֲוָיָ\"ה, אֲבָל לְעִנְיַן שֵׁם אַדְנוּ\"ת, וְכֵן לְעִנְיַן שֵׁם אֶהְיֶ\"ה, יֵשׁ לְהָקֵל לְאָמְרוֹ בְּאוֹתִיּוֹתָיו. וְאַף לְעִנְיַן שֵׁם הֲוָיָ\"ה נִרְאֶה שֶׁאִם אֵינוֹ מִתְכַּוֵּן לְשֵׁם הֲוָיָ\"ה, יֵשׁ לְהָקֵל. וְלָכֵן מֻתָּר לֵאמֹר בִּתְפִלַּת שַׁחֲרִית אַבַּיֵּי הָוָה מְסַדֵּר הַמַּעֲרָכָה, בְּלֹא הֶפְסֵק בֵּין תֵּבַת אַבַּיֵּי לְהָוָה, אַף עַל פִּי שֶׁנִּרְאֶה כְּאוֹמֵר שֵׁם הֲוָיָ\"ה. וּמִכָּל מָקוֹם טוֹב יוֹתֵר שֶׁיַּפְסִיק מְעַט בֵּין תֵּבַת אַבַּיֵּי לְתֵבַת הָוָה.",
    francais: "8. Nos Sages ont dit : 'Celui qui prononce le Nom divin selon ses lettres n'a pas de part au Monde à Venir'. Les Poskim et les Kabbalistes ont écrit que même celui qui énonce le Nom de D.ieu en nommant chaque lettre individuellement est considéré comme prononçant le Nom selon ses lettres. C'est pourquoi dans la formule 'Leishem Yi'houd' dite avant chaque mitsva ou prière, il faut dire : 'Leiya'hada shem Yud Kei beVav Kei', sans mentionner à Dieu ne plaise le Nom d'Havayah. Toutefois, cela ne concerne que le Nom d'Havayah ; mais concernant le Nom d'Adnout ou le Nom d'Ehyeh, on peut faire preuve de souplesse et le réciter lettre par lettre. Même concernant le Nom d'Havayah, il semble que s'il n'a aucune intention envers le Nom d'Havayah, on puisse être souple. Ainsi, il er permis d'enchaîner dans la prière du matin 'Abaye Hava mesader hamarakha' sans interruption entre le mot Abaye et Hava, bien que cela puisse ressembler à l'énonciation du Nom. Quoi qu'il en soit, il est préférable de faire une très courte pause entre le mot Abaye et le mot Hava.",
    wordTranslations: {
      "אמרו": "ont dit",
      "חז''ל:": "nos Sages (de m.b.):",
      "ההוגה": "celui qui énonce",
      "את": "(marque d'objet)",
      "השם": "le Nom",
      "באותיותיו": "selon ses lettres",
      "אין": "il n'a pas",
      "לו": "à lui",
      "חלק": "de part",
      "לעולם": "pour le Monde",
      "הבא": "à Venir",
      "וכתבו": "et ont écrit",
      "הפוסקים": "les Décisionnaires",
      "והמקובלים": "et les Kabbalistes",
      "שאף": "que même",
      "במילוי": "en remplissage de (épellation de)",
      "דהיינו": "c'est-à-dire",
      "בפני": "devant",
      "עצמה": "elle-même",
      "הרי": "voici que",
      "בכלל": "dans la catégorie de",
      "ולכן": "et par conséquent",
      "בנוסח": "dans la formule de",
      "שתפלה": "ou la prière",
      "ליחדא": "pour unifier",
      "יו''ד": "Yud",
      "ק''י": "Kei",
      "בוא''ו": "avec Vav",
      "ח''ו": "à Dieu ne plaise",
      "הוי''ה": "Havayah",
      "ואמנם": "toutefois / en vérité",
      "לענין": "au sujet de",
      "אדנו''ת": "Adnout",
      "אהי''ה": "Ehyeh",
      "להקל": "d'être souple",
      "לאומרו": "à le dire",
      "נראה": "il semble",
      "אינו": "n'est pas",
      "מתכוין": "ayant l'intention",
      "מותר": "il est permis",
      "בתפלת": "dans la prière de",
      "שחרית": "du matin",
      "אביי": "Abaye",
      "הוה": "Hava",
      "מסדר": "ordonnançait",
      "המערכה": "le système de l'autel",
      "בלא": "sans",
      "הפסק": "interruption",
      "בין": "entre",
      "תיבת": "le mot",
      "להוה": "à Hava",
      "כאוומר": "comme disant",
      "שיפסיק": "qu'il fasse une pause",
      "מעט": "un peu"
    }
  }
];

const INFINITIVES_MAP = {
  'יכוין': 'לְכַוֵּן = Penser / Avoir l\'intention',
  'יְכַוֵּן': 'לְכַוֵּן = Penser / Avoir l\'intention',
  'כשיזכיר': 'לְהַזְכִּיר = Mentionner',
  'וּכְשֶׁיַּזְכִּיר': 'לְהַזְכִּיר = Mentionner',
  'ויהיה': 'לִהְיוֹת = Être',
  'וְיִהְיֶה': 'לִהְיוֹת = Être',
  'שהיה': 'לִהְיוֹת = Être',
  'שֶׁהָיָה': 'לִהְיוֹת = Être',
  'ובהזכירו': 'לְהַזְכִּיר = Mentionner',
  'וּבְהַזְכִּירוֹ': 'לְהַזְכִּיר = Mentionner',
  'אומרים': 'לוֹמַר = Dire',
  'אוֹמְרִים': 'לוֹמַר = Dire',
  'חולקים': 'לַחֲלֹק = Diverger',
  'חוֹלְקִים': 'לַחֲלֹק = Diverger',
  'מזכיר': 'לְהַזְכִּיר = Mentionner',
  'מַזְכִּיר': 'לְהַזְכִּיר = Mentionner',
  'שימשיך': 'לְהַמְשִׁיךְ = Continuer',
  'שֶׁיַּמְשִׁיךְ': 'לְהַמְשִׁיךְ = Continuer',
  'שיכול': 'לִיכֹל = Pouvoir',
  'שֶׁיָּכוֹל': 'לִיכֹל = Pouvoir',
  'להתנות': 'לְהַתְנוֹת = Stipuler / Poser une condition',
  'לְהַתְנוֹת': 'לְהַתְנוֹת = Stipuler / Poser une condition',
  'להתאמץ': 'לְהִתְאַמֵּץ = S\'efforcer / Faire un effort',
  'לְהִתְאַמֵּץ': 'לְהִתְאַמֵּץ = S\'efforcer / Faire un effort',
  'שמברך': 'לְבָרֵךְ = Bénir',
  'שֶׁמְּבָרֵךְ': 'לְבָרֵךְ = Bénir',
  'ומתפלל': 'לְהִתְפַּלֵּל = Prier',
  'וּמִתְפַּלֵּל': 'לְהִתְפַּלֵּל = Prier',
  'לסמוך': 'לִסְמֹךְ = S\'appuyer',
  'לִסְמֹךְ': 'לִסְמֹךְ = S\'appuyer',
  'לאומרם': 'לוֹמַר = Dire / Prononcer',
  'לְאָמְרָם': 'לוֹמַר = Dire / Prononcer',
  'יבלע': 'לִבְלֹעַ = Avaler',
  'יִבְלַע': 'לִבְלֹעַ = Avaler',
  'ולברך': 'לְבָרֵךְ = Bénir',
  'וּלְבָרֵךְ': 'לְבָרֵךְ = Bénir',
  'להקפיד': 'לְהַקְפִּיד = Veiller minutieusement',
  'לְהַקְפִּיד': 'לְהַקְפִּיד = Veiller minutieusement',
  'לומר': 'לוֹמַר = Dire',
  'לֵאמֹר': 'לוֹמַר = Dire',
  'והופכים': 'לַהֲפֹךְ = Transformer / Altérer',
  'וְהוֹפְכִים': 'לַהֲפֹךְ = Transformer / Altérer',
  'לבטא': 'לְבַטֵּא = Prononcer / Exprimer',
  'לְבַטֵּא': 'לְבַטֵּא = Prononcer / Exprimer',
  'מבדילים': 'לְהַבְדִּיל = Distinguer',
  'מַבְדִּילִים': 'לְהַבְדִּיל = Distinguer',
  'להבחין': 'לְהַבְחִין = Discerner / Apercevoir',
  'לְהַבְחִין': 'לְהַבְחִין = Discerner / Apercevoir',
  'ומשנים': 'לַשֲׁנוֹת = Modifier / Changer',
  'וּמְשַׁנִּים': 'לַשֲׁנוֹת = Modifier / Changer',
  'חונכו': 'לְחַנֵּךְ = Être éduqué / Formé',
  'חוּנְכוּ': 'לְחַנֵּךְ = Être éduqué / Formé',
  'ומזלזל': 'לְזַלְזֵל = Mépriser / Negliger',
  'וּמְזַלְזֵל': 'לְזַלְזֵל = Mépriser / Negliger',
  'ועובר': 'לַעֲבֹר = Enfreindre / Transgresser',
  'וְעוֹבֵר': 'לַעֲבֹר = Enfreindre / Transgresser',
  'עושים': 'לַעֲשׂוֹת = Faire / Accomplir',
  'עוֹשִׂים': 'לַעֲשׂוֹת = Faire / Accomplir',
  'שמקיים': 'לְקַיֵּם = Accomplir / Obéir',
  'שֶׁמְּקַיֵּם': 'לְקַיֵּם = Accomplir / Obéir',
  'מכיר': 'לְהַכִּיר = Connaître',
  'מַכִּיר': 'לְהַכִּיר = Connaître',
  'מתעורר': 'לְהִתְעוֹרֵר = S\'éveiller',
  'מִתְעוֹרֵר': 'לְהִתְעוֹרֵר = S\'éveiller',
  'גורמת': 'לִגְרֹם = Causer / Entraîner',
  'גּוֹרֶמֶת': 'לִגְרֹם = Causer / Entraîner',
  'אמרו': 'לוֹמַר = Dire',
  'אָמְרוּ': 'לוֹמַר = Dire',
  'וכתבו': 'לִכְתֹּב = Écrire',
  'וְכָתְבוּ': 'לִכְתֹּב = Écrire',
  'להקל': 'לְהָקֵל = Être souple / Faciliter',
  'לְהָקֵל': 'לְהָקֵל = Être souple / Faciliter',
  'יפסיק': 'לְהַפְסִיק = S\'interrompre / Interrompre',
  'שַׁיַּפְסִיק': 'לְהַפְסִיק = S\'interrompre / Interrompre'
};

function cleanHeb(str) {
  return (str || '').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"'׳״\u05F3\u05F4]/g, '').trim();
}

function buildHalakhot() {
  return rawSeifim.map((item, sIdx) => {
    const brutWords = item.brut.split(/\s+/).filter(Boolean);
    const voyellesWords = item.voyelles.split(/\s+/).filter(Boolean);

    const badgeHebLetter = ['א.', 'ב.', 'ג.', 'ד.', 'ה.', 'ו.', 'ז.', 'ח.'][sIdx];
    const badgeNum = `${item.seif}.`;

    const mots_alignes = [
      {
        id: 0,
        hebreu_brut: badgeHebLetter,
        hebreu_voyelles: badgeHebLetter,
        francais_mot: badgeNum,
        expression_contexte: "Numéro du paragraphe"
      }
    ];

    // Filter out leading badge from brutWords if present
    const validBrutWords = [];
    const validVoyellesWords = [];
    const frTokens = item.francais.split(/\s+/).filter(Boolean);
    const ratio = frTokens.length / brutWords.length;

    brutWords.forEach((bw, idx) => {
      if (idx === 0 && cleanHeb(bw) === cleanHeb(badgeHebLetter)) return;
      validBrutWords.push(bw);
      validVoyellesWords.push(voyellesWords[idx] || bw);
    });

    validBrutWords.forEach((bWord, wIdx) => {
      const vWord = validVoyellesWords[wIdx] || bWord;
      const bClean = cleanHeb(bWord);

      const startIdx = Math.max(0, Math.floor(wIdx * ratio));
      const endIdx = Math.min(frTokens.length, Math.ceil((wIdx + 1) * ratio));
      let wordFr = item.wordTranslations[bClean] || item.wordTranslations[bWord];
      if (!wordFr) {
        wordFr = frTokens.slice(startIdx, endIdx).join(" ").replace(/^[0-9]+\.\s*/, '');
        if (!wordFr && frTokens[startIdx]) wordFr = frTokens[startIdx];
      }

      const inf = INFINITIVES_MAP[bClean] || INFINITIVES_MAP[cleanHeb(vWord)] || null;

      mots_alignes.push({
        id: mots_alignes.length,
        hebreu_brut: bWord,
        hebreu_voyelles: vWord,
        francais_mot: wordFr || "—",
        expression_contexte: "",
        ...(inf ? { infinitif: inf } : {})
      });
    });

const SEIF_TITLES_5 = [
  "Intention lors des bénédictions (Kavanah)",
  "Concentration sur le Nom de D.ieu",
  "Prononciation du Nom d'Adonaï",
  "Récitation posée et sans hâte",
  "Vocalisation précise de la lettre Dalet",
  "Coutume Séfarade pour le Kamatz",
  "Prononciation à voix haute",
  "Correction des fautes de prononciation"
];

    return {
      livre: "Kitzur Yalkout Yossef",
      sujet: "כוונת הברכות",
      sujet_he: "כַּוָּנַת הַבְּרָכוֹת",
      sujet_fr: "L'intention lors des bénédictions",
      titre_seif: SEIF_TITLES_5[sIdx] || `Seïf ${item.seif}`,
      siman: "5",
      seif: item.seif,
      _globalId: sIdx + 1,
      texte_integral: {
        hebreu_sans_voyelles: item.brut,
        hebreu_avec_voyelles: item.voyelles,
        francais: item.francais
      },
      mots_alignes
    };
  });
}

const siman5Data = {
  _meta: {
    source: "106_1_KITZUR_YALKUT_YOSEF.txt",
    siman: 5,
    siman_hebrew: "ה",
    generated_at: new Date().toISOString(),
    total_seifim: rawSeifim.length
  },
  halakhot: buildHalakhot()
};

fs.mkdirSync(path.dirname(OUTPUT_SHABBAT), { recursive: true });
fs.writeFileSync(OUTPUT_SHABBAT, JSON.stringify(siman5Data, null, 2), 'utf8');
fs.writeFileSync(OUTPUT_DATA_SIMAN, JSON.stringify(siman5Data, null, 2), 'utf8');
fs.writeFileSync(OUTPUT_DATA_YALKOUT, JSON.stringify(siman5Data, null, 2), 'utf8');

console.log("✅ Siman 5 generated & saved successfully!");
