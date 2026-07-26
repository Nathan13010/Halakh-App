import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const OUTPUT_SHABBAT = path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', 'siman_7.json');
const OUTPUT_DATA_SIMAN = path.join(ROOT, 'public', 'data', 'siman_7.json');
const OUTPUT_DATA_YALKOUT = path.join(ROOT, 'public', 'data', 'yalkout-7.json');

const rawSeifim = [
  {
    seif: "1",
    titre_seif: "Signification et gratitude pour l'âme restituée",
    brut: "א. ברכת אלהי נשמה שטהרה היא, נתקנה להודות להקדוש ברוך הוא על החזרת הנשמה לאדם בכל בוקר, שהיא טהורה ונקיה. ויתבונן בנפלאות הבורא שהחזיר לו את נשמתו כשהיא רעננה ומתוקנת, ויקבל עליו להקדיש את כוחותיו לעבודת השם יתברך.",
    voyelles: "א. בִּרְכַּת אֱלֹהַי נְשָׁמָה שֶׁטְּהוֹרָה הִיא, נִתְקְנָה לְהוֹדוֹת לַהַקָּדוֹשׁ בָּרוּךְ הוּא עַל הַחֲזָרַת הַנְּשָׁמָה לָאָדָם בְּכָל בֹּקֶר, שֶׁהִיא טְהוֹרָה וּנְקִיָּה. וְיִתְבּוֹנֵן בְּנִפְלְאוֹת הַבּוֹרֵא שֶׁהֶחֱזִיר לוֹ אֶת נִשְׁמָתוֹ כְּשֶׁהִיא רַעֲנַנָּה וּמְתֻקֶּנֶת, וִיקַבֵּל עָלָיו לְהַקְדִּישׁ אֶת כֹּחוֹתָיו לַעֲבוֹדַת הַשֵּׁם יִתְבָּרַךְ.",
    francais: "1. La bénédiction Elohaï Neshamah Shetehorah Hi a été instituée pour rendre grâce au Saint béni soit-Il pour le retour de l'âme à l'homme chaque matin, pure et limpide. On réfléchira aux merveilles du Créateur qui lui restitue son âme régénérée, et l'on s'engagera à consacrer ses forces au service du Nom béni soit-Il."
  },
  {
    seif: "2",
    titre_seif: "Enchaînement d'Asher Yatsar et d'Elohaï Neshamah",
    brut: "ב. נהגו לברך ברכת אלהי נשמה סמוך לברכת אשר יצר. ואם ברך אשר יצר ורוצה להפסיק ביניהם בדבור או בלימוד, רשאי, שאינן ברכות הסמוכות זו לזו, אלא ברכות שבח והודאה נפרדות הן.",
    voyelles: "ב. נָהֲגוּ לְבָרֵךְ בִּרְכַּת אֱלֹהַי נְשָׁמָה סָמוּךְ לְבִרְכַּת אֲשֶׁר יָצַר. וְאִם בֵּרַךְ אֲשֶׁר יָצַר וְרוֹצֶה לְהַפְסִיק בֵּינֵיהֶם בְּדִבּוּר אוֹ בְּלִמּוּד, רַשַּׁאי, שֶׁאֵינָן בְּרָכוֹת הַסְּמוּכוֹת זוֹ לָזוֹ, אֶלָּא בְּרָכוֹת שֶׁבַח וְהוֹדָאָה נִפְרָדוֹת הֵן.",
    francais: "2. L'usage est de réciter la bénédiction Elohaï Neshamah juste après la bénédiction Asher Yatsar. Cependant, si l'on a récité Asher Yatsar et que l'on souhaite s'interrompre en parlant ou en étudiant avant Elohaï Neshamah, cela est permis car ce ne sont pas des bénédictions accolées l'une à l'autre, mais des bénédictions de louange autonomes."
  },
  {
    seif: "3",
    titre_seif: "Formule initiale et conclusion de la bénédiction",
    brut: "ג. ברכת אלהי נשמה אינה פותחת בברוך, מפני שהיא ברכת ההודאה שנסמכה לברכת אשר יצר, או מפני שהיא ברכה הקצרה הפותחת באלהי. ומסיימים בה: ברוך אתה ה' המחזיר נשמות לפגרים מתים.",
    voyelles: "ג. בִּרְכַּת אֱלֹהַי נְשָׁמָה אֵינָהּ פּוֹתַחַת בְּבָרוּךְ, מִפְּנֵי שֶׁהִיא בִּרְכַּת הַהוֹדָאָה שֶׁנִּסְמְכָה לְבִרְכַּת אֲשֶׁר יָצַר, אוֹ מִפְּנֵי שֶׁהִיא בְּרָכָה הַקְּצָרָה הַפּוֹתַחַת בֵּאלֹהַי. וּמְסַיְּמִים בָּהּ: בָּרוּךְ אַתָּה ה' הַמַּחֲזִיר נְשָׁמוֹת לִפְגָרִים מֵתִים.",
    francais: "3. La bénédiction Elohaï Neshamah ne commence pas par la formule Baroukh, soit parce qu'elle est juxtaposée à Asher Yatsar, soit parce qu'elle débute par l'invocation Elohaï. On la conclut par la formule : Baroukh Atah Hashem HaMakhazir Neshamot Lifgarim Metim."
  },
  {
    seif: "4",
    titre_seif: "Bénédiction pour celui qui a veillé toute la nuit",
    brut: "ד. מי שהיה ער כל הלילה ולא ישן כלל, יברך ברכת אלהי נשמה בבוקר. וכן הוא מנהג בני ספרד ועדות המזרח, לברך כל ברכות השחר אפילו אם לא ישן ולא פשט בגדיו.",
    voyelles: "ד. מִי שֶׁהָיָה עֵר כָּל הַלַּיְלָה וְלֹא יָשַׁן כְּלָל, יְבָרֵךְ בִּרְכַּת אֱלֹהַי נְשָׁמָה בַּבֹּקֶר. וְכֵן הוּא מִנְהַג בְּנֵי סְפָרַד וַעֲדוֹת הַמִּזְרָח, לְבָרֵךְ כָּל בִּרְכוֹת הַשַּׁחַר אֲפִילוּ אִם לֹא יָשַׁן וְלֹא פָּשַׁט בְּגָדָיו.",
    francais: "4. Celui qui est resté éveillé toute la nuit et n'a pas dormi du tout récitera la bénédiction Elohaï Neshamah le matin. Tel est l'usage des Séfarades et des communautés orientales : réciter toutes les bénédictions du matin même s'il n'a pas dormi et n'a pas retiré ses vêtements."
  },
  {
    seif: "5",
    titre_seif: "Récitation des bénédictions du matin par un non-voyant",
    brut: "ה. סומא (סגי נהור) חייב לברך את כל ברכות השחר, ובכללן ברכת פוקח עורים, שהרי נהנה ממה שאחרים רואים ומנהיגים אותו בדרך.",
    voyelles: "ה. סוֹמֵא (סַגִּי נְהוֹר) חַיָּב לְבָרֵךְ אֶת כָּל בִּרְכוֹת הַשַּׁחַר, וּבִכְלָלָן בִּרְכַּת פּוֹקֵחַ עִוְרִים, שֶׁהֲרֵי נֶהֱנֶה מִמַּה שֶׁאֲחֵרִים רוֹאִים וּמַנְהִיגִים אוֹתוֹ בַּדֶּרֶךְ.",
    francais: "5. Une personne non-voyante (aveugle) est tenue de réciter toutes les bénédictions du matin, y compris la bénédiction 'Poke'ah Ivrim' (Qui ouvre les yeux des aveugles), car elle profite du fait que les autres voient et la guident sur le chemin."
  },
  {
    seif: "6",
    titre_seif: "Ordre fixe de récitation des bénédictions du matin",
    brut: "ו. מנהגינו לברך את ברכות השחר כסדר הנדפס בסידורים, אף על פי שלא נהנה באותה שעה מאותם הדברים, שברכות אלו נתקנו על מנהגו של עולם.",
    voyelles: "ו. מִנְהָגֵנוּ לְבָרֵךְ אֶת בִּרְכוֹת הַשַּׁחַר כְּסֵדֶר הַנִּדְפָּס בַּסִּדּוּרִים, אַף עַל פִּי שֶׁלֹּא נֶהֱנָה בְּאוֹתָהּ שָׁעָה מֵאוֹתָם הַדְּבָרִים, שֶׁבְּרָכוֹת אֵלּוּ נִתְקְנוּ עַל מִנְהָגוֹ שֶׁל עוֹלָם.",
    francais: "6. Notre coutume est de réciter les bénédictions du matin dans l'ordre imprimé dans les livres de prière (Siddourim), même si l'on ne profite pas immédiatement de l'action spécifique à ce moment-là, car ces bénédictions ont été instituées sur l'ordre général du monde."
  },
  {
    seif: "7",
    titre_seif: "La bénédiction HaNoten LaYa'ef Ko'ah",
    brut: "ז. מנהג בני ספרד לברך ברכת ''הנותן ליעף כח'' בשם ומלכות, כדעת מרן השלחן ערוך והארי''זל, ואין לחוש בה משום ספק ברכות.",
    voyelles: "ז. מִנְהַג בְּנֵי סְפָרַד לְבָרֵךְ בִּרְכַּת ''הַנּוֹתֵן לַיָּעֵף כֹּחַ'' בְּשֵׁם וּמַלְכוּת, כְּדַעַת מָרָן הַשֻּׁלְחָן עָרוּךְ וְהָאֲרִי''זַל, וְאֵין לָחוּשׁ בָּהּ מִשּׁוּם סְפֵק בְּרָכוֹת.",
    francais: "7. La coutume des Séfarades est de réciter la bénédiction 'HaNoten LaYa'ef Ko'ah' avec le Nom de D.ieu et la Royauté (Shem ouMalkhout), conformément à l'avis de Maran le Shoulhan Aroukh et du Ari zal, sans craindre d'interdiction de doute."
  },
  {
    seif: "8",
    titre_seif: "Récitation de She'assa Li Kol Tzorqui à Kippour et le 9 Av",
    brut: "ח. ביום הכפורים ובתשעה באב, אף על פי שאין נועלים מנעל של עור, מכל מקום מנהגינו לברך ברכת שעשה לי כל צרכי, שברכה זו נתקנה על מנהגו של עולם.",
    voyelles: "ח. בְּיוֹם הַכִּפּוּרִים וּבְתִשְׁעָה בְּאָב, אַף עַל פִּי שֶׁאֵין נוֹעֲלִים מִנְעָל שֶׁל עוֹר, מִכָּל מָקוֹם מִנְהָגֵנוּ לְבָרֵךְ בִּרְכַּת שֶׁעָשָׂה לִי כָּל צָרְכִּי, שֶׁבְּרָכָה זוֹ נִתְקְנָה עַל מִנְהָגוֹ שֶׁל עוֹלָם.",
    francais: "8. Le jour de Kippour et le 9 Av, bien qu'il soit interdit de porter des chaussures en cuir, notre coutume est néanmoins de réciter la bénédiction 'She'assa Li Kol Tzorqui', car cette bénédiction concerne le fonctionnement général du monde."
  },
  {
    seif: "9",
    titre_seif: "Les bénédictions Ozer Yisrael et Oter Yisrael",
    brut: "ט. מברכים ברכת עוטר ישראל בתפארה וברכת אוזר ישראל בגבורה בכל יום, אפילו אם לא חגר חגורה ולא שם מצנפת על ראשו, מפני שנתקנו על מנהג העולם.",
    voyelles: "ט. מְבָרְכִים בִּרְכַּת עוֹטֵר יִשְׂרָאֵל בְּתִפְאָרָה וּבִרְכַּת אוֹזֵר יִשְׂרָאֵל בִּגְבוּרָה בְּכָל יוֹם, אֲפִילוּ אִם לֹא חָגַר חֲגוֹרָה וְלֹא שָׂם מִצְנֶפֶת עַל רֹאשׁוֹ, מִפְּנֵי שֶׁנִּתְקְנוּ עַל מִנְהַג הָעוֹלָם.",
    francais: "9. On récite chaque jour les bénédictions 'Oter Yisrael BiTfara' et 'Ozer Yisrael BiGveurah', même si l'on n'a pas mis de ceinture ou de couvre-chef spécifique, car elles ont été instituées pour l'ensemble du peuple d'Israël."
  },
  {
    seif: "10",
    titre_seif: "Les trois bénédictions de distinction et She'assani Kirtzono",
    brut: "י. מברכים בשם ומלכות שלש ברכות אלו: שלא עשני גוי, שלא עשני עבד, שלא עשני אשה. והנשים מברכות: שלא עשני גוי, שלא עשני שפחה, ובמקום שלא עשני אשה אומרות: שעשני כרצונו בלא שם ומלכות.",
    voyelles: "י. מְבָרְכִים בְּשֵׁם וּמַלְכוּת שָׁלֹשׁ בְּרָכוֹת אֵלּוּ: שֶׁלֹּא עָשַׂנִי גּוֹי, שֶׁלֹּא עָשַׂנִי עֶבֶד, שֶׁלֹּא עָשַׂנִי אִשָּׁה. וְהַנָּשִׁים מְבָרְכוֹת: שֶׁלֹּא עָשַׂנִי גּוֹי, שֶׁלֹּא עָשַׂנִי שִׁפְחָה, וּבִמְקוֹם שֶׁלֹּא עָשַׂנִי אִשָּׁה אוֹמְרוֹת: שֶׁעָשַׂנִי כִּרְצוֹנוֹ בְּלֹא שֵׁם וּמַלְכוּת.",
    francais: "10. On récite avec le Nom de D.ieu et la Royauté les trois bénédictions : 'Shelo Assani Goy', 'Shelo Assani Avad', 'Shelo Assani Isha'. Les femmes récitent : 'Shelo Assani Goy', 'Shelo Assani Shif'ha', et à la place de 'Shelo Assani Isha', elles dicen 'She'assani Kirtzono' sans prononcer le Nom de D.ieu ni la Royauté."
  },
  {
    seif: "11",
    titre_seif: "Structure de la bénédiction HaMa'avir Shenah",
    brut: "יא. ברכת המעביר שנה מעיני ותנומה מעפעפי היא ברכה אחת ארוכה, ואין לענות אמן אחר תנומה מעפעפי, אלא בסוף הברכה אחר הנותן חסדים טובים לעמו ישראל.",
    voyelles: "יא. בִּרְכַּת הַמַּעֲבִיר שֵׁנָה מֵעֵינַי וּתְנוּמָה מֵעַפְעַפָּי הִיא בְּרָכָה אַחַת אֲרוּכָה, וְאֵין לַעֲנוֹת אָמֵן אַחַר תְּנוּמָה מֵעַפְעַפָּי, אֶלָּא בְּסוֹף הַבְּרָכָה אַחַר הַנּוֹתֵן חֲסָדִים טוֹבִים לְעַמּוֹ יִשְׂרָאֵל.",
    francais: "11. La bénédiction 'HaMa'avir Shenah M'Einay VeTenoumah Me'Af'apay' forme une seule et même longue bénédiction. Il ne faut donc pas répondre 'Amen' après les mots 'VeTenoumah Me'Af'apay', mais uniquement à la fin après 'HaNoten 'Hassadim Tovim Le'Amo Yisrael'."
  },
  {
    seif: "12",
    titre_seif: "Conditions de propreté pour réciter Birkhot HaShahar",
    brut: "יב. אין לברך ברכות השחר אלא כשהוא נקי בגופו, ולא יברך בבית הכסא או במרחץ. ויכול לברכן בביתו או בבית הכנסת קודם התפלה.",
    voyelles: "יב. אֵין לְבָרֵךְ בִּרְכוֹת הַשַּׁחַר אֶלָּא כְּשֶׁהוּא נָקִי בְּגוּפוֹ, וְלֹא יְבָרֵךְ בְּבֵית הַכִּסֵּא אוֹ בַּמֶּרְחָץ. וְיוּכַל לְבָרְכָן בְּבֵיתוֹ אוֹ בְּבֵית הַכְּנֶסֶת קֹדֶם הַתְּפִלָּה.",
    francais: "12. On ne doit réciter les bénédictions du matin que lorsque le corps est propre. Il est interdit de les réciter dans les toilettes ou dans la salle de bain. On peut les réciter à la maison ou à la synagogue avant la prière."
  },
  {
    seif: "13",
    titre_seif: "Éducation des femmes et enfants aux bénédictions matinales",
    brut: "יג. מנהג יפה ללמד את הנשים והילדים לברך ברכות השחר בכוונה מתוך הסידור, ועונים אחריהם אמן, כדי להרגילם במצות.",
    voyelles: "יג. מִנְהָג יָפֶה לְלַמֵּד אֶת הַנָּשִׁים וְהַיְלָדִים לְבָרֵךְ בִּרְכוֹת הַשַּׁחַר בְּכַוָּנָה מִתּוֹךְ הַסִּדּוּר, וְעוֹנִים אַחֲרֵיהֶם אָמֵן, כְּדֵי לְהַרְגִּילָם בַּמִּצְוֹת.",
    francais: "13. C'est une belle coutume d'enseigner aux femmes et aux enfants à réciter les bénédictions du matin avec ferveur à partir du Siddour, et de répondre 'Amen' après eux afin de les habituer aux Mitsvot."
  },
  {
    seif: "14",
    titre_seif: "Réciter les bénédictions avant de consommer",
    brut: "יד. יש להקפיד לברך ברכות השחר קודם שאוכל או שותה, שאין ראוי לאכול קודם שיודה להקדוש ברוך הוא על חידוש כחותיו.",
    voyelles: "יד. יֵשׁ לְהַקְפִּיד לְבָרֵךְ בִּרְכוֹת הַשַּׁחַר קֹדֶם שֶׁאוֹכֵל אוֹ שׁוֹתֶה, שֶׁאֵין רָאוּי לֶאֱכֹל קֹדֶם שֶׁיּוֹדֶה לַהַקָּדוֹשׁ בָּרוּךְ הוּא עַל חִדּוּשׁ כֹּחוֹתָיו.",
    francais: "14. Il faut veiller à réciter les bénédictions du matin avant de manger ou de boire, car il ne convient pas de consommer de la nourriture avant de rendre grâce au Saint béni soit-Il pour le renouvellement de ses forces."
  },
  {
    seif: "15",
    titre_seif: "Rattrapage des bénédictions jusqu'au coucher du soleil",
    brut: "טו. מי שעדיין לא ברך ברכות השחר בבוקר, יכול לברכן כל היום כולו עד שקיעת החמה, חוץ מברכת על נטילת ידים ואשר יצר שנתקנו על חובת השעה.",
    voyelles: "טו. מִי שֶׁעֲדַיִן לֹא בֵּרַךְ בִּרְכוֹת הַשַּׁחַר בַּבֹּקֶר, יוּכַל לְבָרְכָן כָּל הַיּוֹם כֻּלּוֹ עַד שְׁקִיעַת הַחַמָּה, חוּץ מִבִּרְכַּת עַל נְטִילַת יָדַיִם וַאֲשֶׁר יָצַר שֶׁנִּתְקְנוּ עַל חוֹבַת הַשָּׁעָה.",
    francais: "15. Celui qui n'a pas encore récité les bénédictions du matin peut les rattraper durant toute la journée jusqu'au coucher du soleil, à l'exception d'Al Netilat Yadaïm et Asher Yatsar qui dépendent de l'action immédiate."
  },
  {
    seif: "16",
    titre_seif: "Ferveur, joie et intention dans les bénédictions",
    brut: "טז. יזהר האדם לברך את ברכות השחר בשמחה ובכוונה עצומה, ויבין מה שהוא מוציא מפיו, שעל ידי זה תתקבל תפילתו ברצון ויזכה לסיעתא דשמיא בכל מעשי ידיו.",
    voyelles: "טז. יִזָּהֵר הָאָדָם לְבָרֵךְ אֶת בִּרְכוֹת הַשַּׁחַר בְּשִׂמְחָה וּבְכַוָּנָה עֲצוּמָה, וְיָבִין מָה הוּא מוֹצִיא מִפִּיו, שֶׁעַל יְדֵי זֶה תִּתְקַבֵּל תְּפִלָּתוֹ בְּרָצוֹן וְיִזְכֶּה לְסִיַּעְתָּא דִּשְׁמַיָּא בְּכָל מַעֲשֵׂה יָדָיו.",
    francais: "16. L'homme veillera à réciter les bénédictions du matin avec joie et une grande intention, en comprenant ce qui sort de sa bouche. Par cela, sa prière sera agréée avec bienveillance et il méritera l'aide céleste dans toutes ses entreprises."
  }
];

const DICT = {
  "ברכת": { fr: "Bénédiction de", context: "Bénédiction de" },
  "אלהי": { fr: "Mon D.ieu", context: "Mon D.ieu" },
  "נשמה": { fr: "L'âme", context: "L'âme" },
  "שטהרה": { fr: "Qui est pure", context: "Qui est pure" },
  "היא": { fr: "Elle", context: "Elle" },
  "נתקנה": { fr: "A été instituée", context: "A été instituée", infinitif: "לְתַקֵּן = Instituer / Établir" },
  "להודות": { fr: "Remercier", context: "Remercier", infinitif: "לְהוֹדוֹת = Remercier / Rendre grâce" },
  "להקדוש": { fr: "Au Saint", context: "Au Saint" },
  "ברוך": { fr: "Béni soit", context: "Béni soit" },
  "הוא": { fr: "Il", context: "Il" },
  "על": { fr: "Sur / Pour", context: "Sur / Pour" },
  "החזרת": { fr: "Le retour de", context: "Le retour de", infinitif: "לְהַחֲזִיר = Restituer / Ramener" },
  "הנשמה": { fr: "L'âme", context: "L'âme" },
  "לאדם": { fr: "À l'homme", context: "À l'homme" },
  "בכל": { fr: "En chaque", context: "En chaque" },
  "בוקר": { fr: "Matin", context: "Matin" },
  "טהורה": { fr: "Pure", context: "Pure" },
  "ונקיה": { fr: "Et limpide", context: "Et limpide" },
  "ויתבונן": { fr: "Et réfléchira", context: "Et réfléchira", infinitif: "לְהִתְבּוֹנֵן = Méditer / Réfléchir" },
  "בנפלאות": { fr: "Aux merveilles de", context: "Aux merveilles de" },
  "הבורא": { fr: "Le Créateur", context: "Le Créateur" },
  "שהחזיר": { fr: "Qui a restitué", context: "Qui a restitué", infinitif: "לְהַחֲזִיר = Restituer" },
  "לו": { fr: "À lui", context: "À lui" },
  "את": { fr: "[Particule COD]", context: "[Accusatif]" },
  "נשמתו": { fr: "Son âme", context: "Son âme" },
  "כשהיא": { fr: "Lorsqu'elle est", context: "Lorsqu'elle est" },
  "רעננה": { fr: "Régénérée / Fraîche", context: "Régénérée" },
  "ומתוקנת": { fr: "Et réparée", context: "Et réparée" },
  "ויקבל": { fr: "Et acceptera", context: "Et acceptera", infinitif: "לְקַבֵּל = Accepter / Recevoir" },
  "עליו": { fr: "Sur lui", context: "Sur lui" },
  "להקדיש": { fr: "Consacrer", context: "Consacrer", infinitif: "לְהַקְדִּישׁ = Consacrer / Sanctifier" },
  "כוחותיו": { fr: "Ses forces", context: "Ses forces" },
  "לעבודת": { fr: "Au service de", context: "Au service de" },
  "השם": { fr: "Le Nom (D.ieu)", context: "Le Nom de D.ieu" },
  "יתברך": { fr: "Qu'Il soit béni", context: "Béni soit-Il" },
  "נהגו": { fr: "Ont pris l'habitude", context: "Ont la coutume", infinitif: "לִנְהֹג = Avoir pour coutume" },
  "לברך": { fr: "Bénir / Réciter", context: "Bénir", infinitif: "לְבָרֵךְ = Bénir / Réciter une bénédiction" },
  "סמוך": { fr: "Près de / Accolé", context: "Près de" },
  "אשר": { fr: "Qui / Que", context: "Qui" },
  "יצר": { fr: "A formé", context: "A formé", infinitif: "לִיצֹר = Créer / Forme" },
  "ואם": { fr: "Et si", context: "Et si" },
  "ברך": { fr: "A béni", context: "A béni" },
  "ורוצה": { fr: "Et veut", context: "Et veut", infinitif: "לִרְצוֹת = Vouloir" },
  "להפסיק": { fr: "Interrompre", context: "Interrompre", infinitif: "לְהַפְסִיק = Interrompre / Stopper" },
  "ביניהם": { fr: "Entre eux", context: "Entre eux" },
  "בדבור": { fr: "Par la parole", context: "Par la parole" },
  "או": { fr: "Ou", context: "Ou" },
  "בלימוד": { fr: "Par l'étude", context: "Par l'étude" },
  "רשאי": { fr: "Permis / Autorisé", context: "Autorisé" },
  "שאינן": { fr: "Car elles ne sont pas", context: "Car elles ne sont pas" },
  "ברכות": { fr: "Bénédictions", context: "Bénédictions" },
  "הסמוכות": { fr: "Juxtaposées", context: "Juxtaposées" },
  "זו": { fr: "L'une", context: "L'une" },
  "לזו": { fr: "À l'autre", context: "À l'autre" },
  "אלא": { fr: "Mais", context: "Mais" },
  "שבח": { fr: "Louange", context: "Louange" },
  "והודאה": { fr: "Et gratitude", context: "Et gratitude" },
  "נפרדות": { fr: "Séparées / Autonomes", context: "Autonomes" },
  "הן": { fr: "Elles sont", context: "Elles sont" },
  "אינה": { fr: "N'est pas", context: "N'est pas" },
  "פותחת": { fr: "Débute", context: "Débute", infinitif: "לִפְתֹּחַ = Ouvrir / Débuter" },
  "בברוך": { fr: "Par Baroukh", context: "Par Baroukh" },
  "מפני": { fr: "Parce que", context: "Parce que" },
  "שהיא": { fr: "Qu'elle est", context: "Qu'elle est" },
  "שנסמכה": { fr: "Qui est rattachée", context: "Qui est rattachée" },
  "הקצרה": { fr: "Courte", context: "Courte" },
  "הפותחת": { fr: "Qui débute", context: "Qui débute" },
  "באלהי": { fr: "Par Elohaï", context: "Par Elohaï" },
  "ומסיימים": { fr: "Et concluent", context: "Et concluent", infinitif: "לְסַיֵּם = Conclure / Terminer" },
  "בה": { fr: "En elle", context: "En elle" },
  "אתה": { fr: "Tu es", context: "Tu es" },
  "המוציא": { fr: "Qui fait sortir", context: "Qui fait sortir" },
  "המחזיר": { fr: "Qui restitue", context: "Qui restitue", infinitif: "לְהַחֲזִיר = Restituer" },
  "נשמות": { fr: "Âmes", context: "Âmes" },
  "לפגרים": { fr: "Aux corps", context: "Aux corps" },
  "מתים": { fr: "Morts", context: "Morts" },
  "מי": { fr: "Qui / Celui qui", context: "Celui qui" },
  "שהיה": { fr: "Qui était", context: "Qui était" },
  "ער": { fr: "Éveillé", context: "Éveillé" },
  "כל": { fr: "Tout / Toute", context: "Toute" },
  "הלילה": { fr: "La nuit", context: "La nuit" },
  "ולא": { fr: "Et n'a pas", context: "Et n'a pas" },
  "ישן": { fr: "Dormi", context: "Dormi", infinitif: "לִישֹׁן = Dormir" },
  "כלל": { fr: "Du tout", context: "Du tout" },
  "יברך": { fr: "Récitera la bénédiction", context: "Bénira", infinitif: "לְבָרֵךְ = Bénir" },
  "בבוקר": { fr: "Le matin", context: "Le matin" },
  "וכן": { fr: "Et ainsi", context: "Et ainsi" },
  "מנהג": { fr: "La coutume de", context: "La coutume de" },
  "בני": { fr: "Fils de", context: "Les enfants de" },
  "ספרד": { fr: "Sefarad (Séfarades)", context: "Séfarades" },
  "ועדות": { fr: "Et communautés de", context: "Et communautés de" },
  "המזרח": { fr: "L'Orient", context: "L'Orient" },
  "שחר": { fr: "Aube / Matin", context: "Matin" },
  "אפילו": { fr: "Même", context: "Même" },
  "אם": { fr: "Si", context: "Si" },
  "פשט": { fr: "A retiré", context: "A retiré", infinitif: "לִפְשֹׁט = Retirer / Enlever" },
  "בגדיו": { fr: "Ses vêtements", context: "Ses vêtements" },
  "סומא": { fr: "Non-voyant (aveugle)", context: "Aveugle" },
  "חייב": { fr: "Obligé / Tenu", context: "Tenu" },
  "פוקח": { fr: "Qui ouvre", context: "Qui ouvre", infinitif: "לִפְקֹחַ = Ouvrir (les yeux)" },
  "עורים": { fr: "Les aveugles", context: "Les aveugles" },
  "שהרי": { fr: "Car", context: "Car" },
  "נהנה": { fr: "Profite", context: "Profite", infinitif: "לֵהָנוֹת = Profiter" },
  "ממה": { fr: "De ce que", context: "De ce que" },
  "שאחרים": { fr: "Que les autres", context: "Que les autres" },
  "רואים": { fr: "Voient", context: "Voient", infinitif: "לִרְאוֹת = Voir" },
  "ומנהיגים": { fr: "Et guident", context: "Et guident", infinitif: "לְהַנְהִיג = Guider / Diriger" },
  "אותו": { fr: "Lui", context: "Lui" },
  "בדרך": { fr: "Sur le chemin", context: "Sur le chemin" },
  "כסדר": { fr: "Selon l'ordre", context: "Selon l'ordre" },
  "הנדפס": { fr: "Imprimé", context: "Imprimé" },
  "בסידורים": { fr: "Dans les Siddourim", context: "Dans les livres de prière" },
  "באותה": { fr: "À cette", context: "À cette" },
  "שעה": { fr: "Heure / Moment", context: "Moment" },
  "מאותם": { fr: "De ces", context: "De ces" },
  "הדברים": { fr: "Choses", context: "Choses" },
  "שברכות": { fr: "Car les bénédictions", context: "Car les bénédictions" },
  "אלו": { fr: "Celles-ci", context: "Celles-ci" },
  "העולם": { fr: "Le monde", context: "Le monde" },
  "הנותן": { fr: "Qui donne", context: "Qui donne", infinitif: "לָתֵת = Donner" },
  "ליעף": { fr: "À l'épuisé", context: "À l'épuisé" },
  "כח": { fr: "Force", context: "Force" },
  "בשם": { fr: "Avec le Nom de D.ieu", context: "Avec le Nom" },
  "ומלכות": { fr: "Et la Royauté", context: "Et la Royauté" },
  "כדעת": { fr: "Selon l'avis de", context: "Selon l'avis de" },
  "מרן": { fr: "Maran (Notre Maître)", context: "Maran" },
  "השלחן": { fr: "Le Shoulhan", context: "Le Shoulhan" },
  "ערוך": { fr: "Aroukh", context: "Aroukh" },
  "ספק": { fr: "Doute", context: "Doute" },
  "שעשה": { fr: "Qui a fait / pourvu", context: "Qui a pourvu", infinitif: "לַעֲשׂוֹת = Faire / Pourvoir" },
  "צרי": { fr: "Mes besoins", context: "Mes besoins" },
  "עוטר": { fr: "Qui couronne", context: "Qui couronne", infinitif: "לַעְטֹר = Couronner" },
  "ישראל": { fr: "Israël", context: "Israël" },
  "בתפארה": { fr: "Avec splendeur", context: "Avec splendeur" },
  "אוזר": { fr: "Qui ceint", context: "Qui ceint", infinitif: "לֶאֱזֹר = Ceindre / Fortifier" },
  "בגבורה": { fr: "Avec force", context: "Avec force" },
  "שלא": { fr: "Qui ne pas", context: "Qui ne pas" },
  "עשני": { fr: "M'a fait", context: "M'a fait" },
  "גוי": { fr: "Non-juif", context: "Non-juif" },
  "עבד": { fr: "Serviteur / Esclave", context: "Esclave" },
  "אשה": { fr: "Femme", context: "Femme" },
  "שפחה": { fr: "Servante", context: "Servante" },
  "שעשני": { fr: "Qui m'a fait", context: "Qui m'a fait" },
  "כרצונו": { fr: "Selon Sa volonté", context: "Selon Sa volonté" },
  "המעביר": { fr: "Qui fait passer", context: "Qui fait passer", infinitif: "לְהַעֲבִיר = Faire passer / Éloigner" },
  "שנה": { fr: "Le sommeil", context: "Le sommeil" },
  "מעיני": { fr: "De mes yeux", context: "De mes yeux" },
  " ותנומה": { fr: "Et l'assoupissement", context: "Et l'assoupissement" },
  "מעפעפי": { fr: "De mes paupières", context: "De mes paupières" },
  "אחת": { fr: "Une", context: "Une" },
  "ארוכה": { fr: "Longue", context: "Longue" },
  "לענות": { fr: "Répondre", context: "Répondre", infinitif: "לַעֲנוֹת = Répondre" },
  "אמן": { fr: "Amen", context: "Amen" },
  "בסוף": { fr: "À la fin de", context: "À la fin de" },
  "חסדים": { fr: "Bontés", context: "Bontés" },
  "טובים": { fr: "Bonnes", context: "Bonnes" },
  "לרצון": { fr: "Avec bienveillance", context: "Avec bienveillance" },
  "נקי": { fr: "Propre", context: "Propre" },
  "בגופו": { fr: "Dans son corps", context: "Dans son corps" },
  "בבית": { fr: "À la maison", context: "À la maison" },
  "הכנסת": { fr: "La synagogue", context: "La synagogue" },
  "קודם": { fr: "Avant", context: "Avant" },
  "התפלה": { fr: "La prière", context: "La prière" },
  "ללמד": { fr: "Enseigner", context: "Enseigner", infinitif: "לְלַמֵּד = Enseigner" },
  "הנשים": { fr: "Les femmes", context: "Les femmes" },
  "והילדים": { fr: "Et les enfants", context: "Et les enfants" },
  "בכוונה": { fr: "Avec ferveur", context: "Avec ferveur" },
  "שאוכל": { fr: "Qu'il mange", context: "Qu'il mange", infinitif: "לֶאֱכֹל = Manger" },
  "שותה": { fr: "Boive", context: "Boive", infinitif: "לִשְׁתּוֹת = Boire" },
  "שיעור": { fr: "Durée / Intervalle", context: "Durée" },
  "שקיעת": { fr: "Coucher de", context: "Coucher de" },
  "החמה": { fr: "Le soleil", context: "Le soleil" }
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
    sujet: "הלכות ברכת אלהי נשמה ושאר ברכות השחר",
    sujet_fr: "Chapitre 7 - Lois de la bénédiction Elohaï Neshamah et des bénédictions du matin",
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
  siman: "7",
  halakhot
};

const jsonStr = JSON.stringify(outputObj, null, 2);

fs.mkdirSync(path.dirname(OUTPUT_SHABBAT), { recursive: true });
fs.writeFileSync(OUTPUT_SHABBAT, jsonStr, 'utf8');
fs.writeFileSync(OUTPUT_DATA_SIMAN, jsonStr, 'utf8');
fs.writeFileSync(OUTPUT_DATA_YALKOUT, jsonStr, 'utf8');

console.log(`✅ Siman 7 built with full Hebrew vocalization and word alignment across all 3 paths!`);
