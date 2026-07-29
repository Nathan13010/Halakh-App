import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const DICT = {
  "ציצית": { fr: "Tsitsit (Franges)", context: "Tsitsit" },
  "ציציות": { fr: "Tsitsiot", context: "Tsitsiot" },
  "טלית": { fr: "Tallit", context: "Tallit" },
  "גדול": { fr: "Gadol (Grand)", context: "Gadol" },
  "קטן": { fr: "Katan (Petit)", context: "Katan" },
  "בגד": { fr: "Vêtement", context: "Vêtement" },
  "בגדים": { fr: "Vêtements", context: "Vêtements" },
  "חייב": { fr: "Soumis / Obligé", context: "Soumis" },
  "פטור": { fr: "Exempt", context: "Exempt" },
  "פטורה": { fr: "Exempte", context: "Exempte" },
  "כנף": { fr: "Coin", context: "Coin" },
  "כנפות": { fr: "Coins", context: "Coins" },
  "חוטים": { fr: "Fils / Brins", context: "Fils" },
  "חוטי": { fr: "Fils de", context: "Fils de" },
  "קשר": { fr: "Nœud", context: "Nœud" },
  "קשרים": { fr: "Nœuds", context: "Nœuds" },
  "מברך": { fr: "Bénit / Récite la bénédiction", context: "Bénit", infinitif: "לְבָרֵךְ = Bénir" },
  "לברך": { fr: "De bénir", context: "De bénir", infinitif: "לְבָרֵךְ = Bénir" },
  "ברכה": { fr: "Bénédiction", context: "Bénédiction" },
  "מצוה": { fr: "Mitsva", context: "Mitsva" },
  "מצות": { fr: "Mitsvot", context: "Mitsvot" },
  "יום": { fr: "Jour", context: "Jour" },
  "לילה": { fr: "Nuit", context: "Nuit" },
  "נשים": { fr: "Les femmes", context: "Les femmes" },
  "תפילין": { fr: "Tefillines", context: "Tefillines" },
  "עור": { fr: "Cuir", context: "Cuir" },
  "גוי": { fr: "Non-juif", context: "Non-juif" },
  "נכרי": { fr: "Non-juif", context: "Non-juif" },
  "מותר": { fr: "Permis", context: "Permis" },
  "אסור": { fr: "Interdit", context: "Interdit" },
  "לבוש": { fr: "Vêtu", context: "Vêtu" },
  "ללבוש": { fr: "Revêtir", context: "Revêtir", infinitif: "לִלְבֹּשׁ = Revêtir" },
  "שנאמר": { fr: "Comme il est dit", context: "Comme il est dit", infinitif: "לֵאָמֵר = Être dit" },
  "וראיתם": { fr: "Et vous le verrez", context: "Et vous le verrez", infinitif: "לִרְאוֹת = Voir" },
  "וזכרתם": { fr: "Et vous vous rappellerez", context: "Et vous vous rappellerez", infinitif: "לִזְכֹּר = Se rappeler" }
};

const FULL_DATA = [
  // SIMAN 11 (18 Seifim)
  {
    siman: "11",
    sujet_fr: "Chapitre 11 - Lois des fils du Tsitsit et de leur nouage (18 Seifim)",
    halakhot: [
      { seif: "1", titre_seif: "Les 4 fils pliés formant 8 brins à chaque coin", brut: "א. בכל כנף וכנף מציבים ארבעה חוטים, וכאשר כופלים אותם באמצע נעשים שמונה חוטים משתלשלים.", voyelles: "א. בְּכָל כָּנָף וְכָנָף מַצִּיבִים אַרְבָּעָה חוּטִים, וְכַאֲשֶׁר כּוֹפְלִים אוֹתָם בָּאֶמְצַע נַעֲשִׂים שְׁמֹנָה חוּטִים מִשְׁתַּלְשְׁלִים.", francais: "1. À chaque coin du vêtement, on insère 4 fils de laine qui, pliés en leur milieu, forment 8 brins pendant vers le bas." },
      { seif: "2", titre_seif: "Le brin plus long (Shamesh) pour les enroulements", brut: "ב. אחד מארבעת החוטים עושים אותו ארוך יותר משאר החוטים, כדי לכרוך בו את החוליות, והוא הנקרא שמש.", voyelles: "ב. אֶחָד מֵאַרְבַּעַת הַחוּטִים עוֹשִׂים אוֹתוֹ אָרֹךְ יוֹתֵר מִשְּׁאָר הַחוּטִים, כְּדֵי לִכְרֹךְ בּוֹ אֶת הַחֻלְיוֹת, וְהוּא הַנִּקְרָא שַׁמָּשׁ.", francais: "2. L'un des 4 fils est fait plus long que les autres afin de réaliser les enroulements (Holiot), et ce brin est appelé Shamesh." },
      { seif: "3", titre_seif: "Filature et tressage Lishmah (avec intention sacrée)", brut: "ג. חוטי הציצית צריכים להיות נטווים ונשזרים לשמה, דהיינו לשם מצות ציצית.", voyelles: "ג. חוּטֵי הַצִּיצִית צְרִיכִים לִהְיוֹת נִטְוִים וְנִשְׁזָרִים לִשְׁמָהּ, דְּהַיְנוּ לְשֵׁם מִצְוַת צִיצִית.", francais: "3. Les fils du Tsitsit doivent être filés et tordus Lishmah (avec l'intention expresse d'accomplir la Mitsva du Tsitsit)." },
      { seif: "4", titre_seif: "Déclaration verbale Lishmah au début du travail", brut: "ד. צריך שיאמר הטווה בתחלת הטוויה שהוא עושה כן לשם מצות ציצית.", voyelles: "ד. צָרִיךְ שֶׁיֹּאמַר הַטּוֹוֶה בִּתְחִלַּת הַטְּוִיָּה שֶׁהוּא עוֹשֶׂה כֵּן לְשֵׁם מִצְוַת צִיצִית.", francais: "4. Le fileur doit déclarer au début du travail de filature qu'il agit ainsi dans l'intention d'accomplir la Mitsva du Tsitsit." },
      { seif: "5", titre_seif: "Validité de la filature faite par une femme juive", brut: "ה. אשה ישראלית כשרה לטוות ולשזור חוטי ציצית לשמה.", voyelles: "ה. אִשָּׁה יִשְׂרְאֵלִית כְּשֵׁרָה לִטְווֹת וְלִשְׁזֹר חוּטֵי צִיצִית לִשְׁמָהּ.", francais: "5. Une femme juive est parfaitement apte à filer et tordre les fils de Tsitsit Lishmah." },
      { seif: "6", titre_seif: "Invalidation des fils fabriqués par un non-juif", brut: "ו. ציצית שנעשית על ידי נכרי פסולה, אפילו אם ישראל עומד על גבו ומזהיר אותו.", voyelles: "ו. צִיצִית שֶׁנַּעֲשֵׂת עַל יְדֵי נָכְרִי פְּסוּלָה, אֲפִלּוּ אִם יִשְׂרָאֵל עוֹמֵד עַל גַּבּוֹ וּמַזְהִיר אוֹתוֹ.", francais: "6. Un Tsitsit confectionné par un non-juif est invalide, même si un Juif se tient à ses côtés et l'avertit." },
      { seif: "7", titre_seif: "Filature mécanique actionnée par un Juif", brut: "ז. חוטי ציצית שנטוו במכונה המופעלת על ידי ישראל שאמר לשמה, כשרים.", voyelles: "ז. חוּטֵי צִיצִית שֶׁנִּטְווּ בִּמְכוֹנָה הַמֻּפְעֶלֶת עַל יְדֵי יִשְׂרָאֵל שֶׁאָמַר לִשְׁמָהּ, כְּשֵׁרִים.", francais: "7. Les fils de Tsitsit filés au moyen d'une machine actionnée par un Juif ayant déclaré Lishmah au démarrage sont kashers." },
      { seif: "8", titre_seif: "Obligation de Shezirah (tressage) Lishmah", brut: "ח. צריכים שזירה לשמה, שהחוטים שנטוו לשמה יחזרו וישזרו אותם כפולים לשמה.", voyelles: "ח. צְרִיכִים שְׁזִירָה לִשְׁמָהּ, שֶׁהַחוּטִים שֶׁנִּטְווּ לִשְׁמָהּ יַחַזְרוּ וְיִשְׁזְרוּ אוֹתָם כְּפוּלִים לִשְׁמָהּ.", francais: "8. Le tressage (Shezirah) doit également être accompli Lishmah pour doubler les fils." },
      { seif: "9", titre_seif: "Longueur minimale des franges pendantes (24 cm)", brut: "ט. שיעור אורך חוטי הציצית התלויים בכנף הוא שתים עשרה אצבעות (כעשרים וארבעה סנטימטרים).", voyelles: "ט. שִׁעוּר אֹרֶךְ חוּטֵי הַצִּיצִית הַתְּלוּיִים בַּכָּנָף הוּא שְׁתֵּים עֶשְׂרֵה אֶצְבָּעוֹת (כְּעֶשְׂרִים וְאַרְבָּעָה סַנְטִימֶטְרִים).", francais: "9. La longueur minimale des fils du Tsitsit pendant au coin du vêtement est de 12 doigts (environ 24 cm)." },
      { seif: "10", titre_seif: "Proportion : 1/3 de nœuds et 2/3 de brins libres", brut: "י. ראוי שיהיה שליש הציצית גדיל ושני שלישים ענף.", voyelles: "י. רָאוּי שֶׁיִּהְיֶה שְׁלִישׁ הַצִּיצִית גְּדִיל וּשְׁנֵי שְׁלִישִׁים עָנָף.", francais: "10. Il convient qu'un tiers du Tsitsit soit composé des nœuds (Guedil) et deux tiers des brins libres (Anaf)." },
      { seif: "11", titre_seif: "Les 5 doubles nœuds et les 4 séries d'enroulements", brut: "יא. עושים בציצית חמישה קשרים כפולים וארבע חוליות ביניהם.", voyelles: "יא. עוֹשִׂים בַּצִּיצִית חֲמִשָּׁה קְשָׁרִים כְּפוּלִים וְאַרְבַּע חֻלְיוֹת בֵּינֵיהֶם.", francais: "11. On réalise dans chaque Tsitsit 5 doubles nœuds espacés de 4 séries d'enroulements (Holiot)." },
      { seif: "12", titre_seif: "Nombre d'enroulements (7, 8, 11, 13 = 39 pour HaVaYaH)", brut: "יב. מנהג בני ספרד לכרוך בחוליות הציצית כנגד שם הוי''ה: ז', ח', י''א, י''ג, ובסך הכל ל''ט כריכות.", voyelles: "יב. מִנְהַג בְּנֵי סְפָרַד לִכְרֹךְ בַּחֻלְיוֹת הַצִּיצִית כְּנֶגֶד שֵׁם הֲוָיָ''ה: ז', ח', י''א, י''ג, וּבְסַךְ הַכֹּל לַ''ט כְּרִיכוֹת.", francais: "12. La coutume des Séfarades est d'enrouler les brins selon le Nom Divin : 7, 8, 11 et 13 enroulements (total 39)." },
      { seif: "13", titre_seif: "Préférence pour des fils blancs sur tout vêtement", brut: "יג. מצוה שיהיו חוטי הציצית לבנים בכל בגד.", voyelles: "יג. מִצְוָה שֶׁיִּהְיוּ חוּטֵי הַצִּיצִית לְבָנִים בְּכָל בֶּגֶד.", francais: "13. C'est une Mitsva a priori d'utiliser des fils de Tsitsit blancs pour tout vêtement." },
      { seif: "14", titre_seif: "Invalidation des fils volés (Mitzva Ba'ah Be'Avera)", brut: "יד. ציצית העשויה מחוטים גזולים פסולה משום מצוה הבאה בעבירה.", voyelles: "יד. צִיצִית הָעֲשׂוּיָה מִחוּטִים גְּזוּלִים פְּסוּלָה מִשּׁוּם מִצְוָה הַבָּאָה בַּעֲבֵרָה.", francais: "14. Un Tsitsit confectionné avec des fils volés est invalide (Mitzva Ba'ah Be'Avera)." },
      { seif: "15", titre_seif: "Interdiction de couper les fils avec les dents", brut: "טו. אין לחתוך חוטי ציצית בשיניים מפני שמקצר ימים, אלא בסכין או במספריים.", voyelles: "טו. אֵין לַחְתֹּךְ חוּטֵי צִיצִית בְּשִׁנַּיִם מִפְּנֵי שֶׁמְּקַצֵּר יָמִים, אֶלָּא בְּסַכִּין אוֹ בְּמִסְפָּרַיִם.", francais: "15. On ne coupera pas les fils de Tsitsit avec les dents car cela raccourcit la vie, mais aux ciseaux." },
      { seif: "16", titre_seif: "Égaliser la longueur des fils après le nouage", brut: "טז. אם היו החוטים ארוכים ביותר וחתך אותם לאחר שקשרם, כשרים.", voyelles: "טז. אִם הָיוּ הַחוּטִים אֲרֻכִּים בְּיוֹתֵר וְחָתַךְ אוֹתָם לְאַחַר שֶׁקְּשָׁרָם, כְּשֵׁרִים.", francais: "16. S'il a coupé les fils trop longs après les avoir noués au vêtement, le Tsitsit reste kasher." },
      { seif: "17", titre_seif: "Nouer les franges la nuit pour le lendemain", brut: "יז. מותר לקשור ציצית בבגד בלילה, וכשילבשנו ביום יברך עליו.", voyelles: "יז. מֻתָּר לִקְשֹׁר צִיצִית בַּבֶּגֶד בַּלַּיְלָה, וּכְשֶׁיִּלְבָּשֶׁנּוּ בַּיּוֹם יְבָרֵךְ עָלָיו.", francais: "17. Il est permis d'attacher des Tsitsit à un vêtement la nuit ; lorsqu'on le portera le jour, on bénira." },
      { seif: "18", titre_seif: "Absence de bénédiction sur la confection (Heksher Mitzva)", brut: "יח. אין מברכים על עשיית הציצית וקשירתה, שהעשייה היא הכשר מצוה בלבד.", voyelles: "יח. אֵין מְבָרְכִים עַל עֲשִׂיַּת הַצִּיצִית וּקְשִׁירָתָהּ, שֶׁהָעֲשִׂיָּה הִיא הֶכְשֵׁר מִצְוָה בִּלְבַד.", francais: "18. On ne récite pas de bénédiction sur la confection du Tsitsit, car elle constitue une préparation." }
    ]
  },

  // SIMAN 12 (6 Seifim)
  {
    siman: "12",
    sujet_fr: "Chapitre 12 - Emplacement du trou du Tsitsit et fixation au vêtement (6 Seifim)",
    halakhot: [
      { seif: "1", titre_seif: "Emplacement exact du trou (entre 1 Kesher Agoudal et 3 doigts)", brut: "א. הנקב שמכניסים בו את הציצית לא יהיה רחוק מן השפה יותר משלוש אצבעות, ולא קרוב פחות מקשר אגודל.", voyelles: "א. הַנֶּקֶב שֶׁמַּכְנִיסִים בּוֹ אֶת הַצִּיצִית לֹא יִהְיֶה רָחוֹק מִן הַשָּׂפָה יוֹתֵר מִשָּׁלֹשׁ אֶצְבָּעוֹת, וְלֹא קָרוֹב פָּחוֹת מִקֶּשֶׁר אֲגוּדָל.", francais: "1. Le trou du Tsitsit ne doit pas être distant du bord de plus de 3 doigts, ni plus près qu'une jointure de pouce." },
      { seif: "2", titre_seif: "Invalidation du trou trop proche du bord (moins d'un pouce)", brut: "ב. נתנו למטה מקשר אגודל פטור, מפני שאינו נקרא על הכנף אלא תחת הכנף.", voyelles: "ב. נְתָנוֹ לְמַטָּה מִקֶּשֶׁר אֲגוּדָל פָּטוּר, מִפְּנֵי שֶׁאֵינוֹ נִקְרָא עַל הַכָּנָף אֶלָּא תַּחַת הַכָּנָף.", francais: "2. Si le trou est placé à moins d'un Kesher Agoudal du bord, le Tsitsit est invalide." },
      { seif: "3", titre_seif: "Invalidation du trou trop distant du bord (plus de 3 doigts)", brut: "ג. נתנו למעלה משלוש אצבעות פטור, מפני שאינו נקרא כנף אלא בגד.", voyelles: "ג. נְתָנוֹ לְמַעְלָה מִשָּׁלֹשׁ אֶצְבָּעוֹת פָּטוּר, מִפְּנֵי שֶׁאֵינוֹ נִקְרָא כָּנָף אֶלָּא בֶּגֶד.", francais: "3. Si le trou est placé à plus de 3 doigts du bord, il est invalide car ce n'est plus appelé le coin." },
      { seif: "4", titre_seif: "Cas du trou déchiré jusqu'au bord du vêtement", brut: "ד. נקרע הנקב עד שפת הבגד לאחר שנקשרו הציציות, כשר.", voyelles: "ד. נִקְרַע הַנֶּקֶב עַד שְׂפַת הַבֶּגֶד לְאַחַר שֶׁנִּקְשְׁרוּ הַצִּיצִיּוֹת, כָּשֵׁר.", francais: "4. Si le trou s'est déchiré jusqu'au bord après le nouage des franges, le Tsitsit demeure kasher." },
      { seif: "5", titre_seif: "Position des franges pendantes le long du vêtement", brut: "ה. יקשור את הציצית על כנף הבגד כשהוא תלוי לצד שפת הבגד.", voyelles: "ה. יִקְשֹׁר אֶת הַצִּיצִית עַל כָּנָף הַבֶּגֶד כְּשֶׁהוּא תָּלוּי לְצַד שְׂפַת הַבֶּגֶד.", francais: "5. On nouera le Tsitsit de manière à ce qu'il pende le long du bord du vêtement (Noï Mitzva)." },
      { seif: "6", titre_seif: "Confection de deux trous parallèles si nécessaire", brut: "ו. מותר לעשות שני נקבים זה אצל זה כדי להעביר את החוטים ולשמרם ישרים.", voyelles: "ו. מֻתָּר לַעֲשׂוֹת שְׁנֵי נְקָבִים זֶה אֵצֶל זֶה כְּדֵי לְהַעֲבִיר אֶת הַחוּטִים וּלְשָׁמְרָם יְשָׁרִים.", francais: "6. Il est permis de percer 2 trous voisins pour faire passer les fils et maintenir le nœud bien droit." }
    ]
  },

  // SIMAN 13 (5 Seifim)
  {
    siman: "13",
    sujet_fr: "Chapitre 13 - Lois du vêtement emprunté ou acheté (5 Seifim)",
    halakhot: [
      { seif: "1", titre_seif: "Vêtement emprunté : exempt pendant 30 jours", brut: "א. השואל טלית מחבירו פטור מציצית עד שלושים יום, מפני שאינו נקרא בגדו.", voyelles: "א. הַשּׁוֹאֵל טַלִּית מֵחֲבֵרוֹ פָּטוּר מִצִּיצִית עַד שְׁלֹשִׁים יוֹם, מִפְּנֵי שֶׁאֵינוֹ נִקְרָא בִּגְדוֹ.", francais: "1. Celui qui emprunte un Tallit à un ami est exempt de Tsitsit pendant les 30 premiers jours." },
      { seif: "2", titre_seif: "Obligation et bénédiction après 30 jours d'emprunt", brut: "ב. לאחר שלושים יום חייב בציצית ומברך עליה.", voyelles: "ב. לְאַחַר שְׁלֹשִׁים יוֹם חַיָּב בַּצִּיצִית וּמְבָרֵךְ עָלֶיהָ.", francais: "2. Après 30 jours d'emprunt, le vêtement devient soumis au Tsitsit avec bénédiction." },
      { seif: "3", titre_seif: "Achat d'un vêtement neuf à 4 coins", brut: "ג. הקונה בגד חדש של ארבע כנפות חייב להטיל בו ציצית מיד קודם שילבשנו.", voyelles: "ג. הַקּוֹנֶה בֶּגֶד חָדָשׁ שֶׁל אַרְבַּע כַּנְפוֹת חַיָּב לְהַטִּיל בּוֹ צִיצִית מִיָּד קֹדֶם שֶׁיִּלְבָּשֶׁנּוּ.", francais: "3. Celui qui achète un vêtement neuf à 4 coins doit y mettre des Tsitsiot avant de le porter." },
      { seif: "4", titre_seif: "Emprunter le Tallit d'un ami pour la montée à la Torah", brut: "ד. המושאל טלית מחבירו לעלות לתורה אינו מברך עליה, לפי שאינה שלו.", voyelles: "ד. הַמֻּשְׁאָל טַלִּית מֵחֲבֵרוֹ לַעֲלוֹת לַתּוֹרָה אֵינוֹ מְבָרֵךְ עָלֶיהָ, לְפִי שֶׁאֵינָהּ שֶׁלּוֹ.", francais: "4. Celui qui emprunte un Tallit uniquement pour monter à la Torah ne récite pas de bénédiction." },
      { seif: "5", titre_seif: "Revêtir le Tallit de la communauté (Coutume publique)", brut: "ה. הלובש טלית של הקהל או טלית שאולה לתפלה כולו, מברך עליה.", voyelles: "ה. הַלּוֹבֵשׁ טַלִּית שֶׁל הַקָּהָל אוֹ טַלִּית שְׁאוּלָה לַתְּפִלָּה כֻּלּוֹ, מְבָרֵךְ עָלֶיהָ.", francais: "5. Celui qui revêt le Tallit de la synagogue pour toute la prière doit réciter la bénédiction." }
    ]
  },

  // SIMAN 14 (6 Seifim)
  {
    siman: "14",
    sujet_fr: "Chapitre 14 - Respect du Tallit et comportement lors du port (6 Seifim)",
    halakhot: [
      { seif: "1", titre_seif: "Interdiction de traîner les franges sur le sol", brut: "א. אין לגרור את חוטי הציצית על גבי הקרקע, שאין זה כבוד למצוה.", voyelles: "א. אֵין לִגְרֹר אֶת חוּטֵי הַצִּיצִית עַל גַּבֵּי הַקַּרְקַע, שֶׁאֵין זֶה כָּבוֹד לַמִּצְוָה.", francais: "1. On ne laissera pas traîner les franges du Tsitsit sur le sol par respect pour la Mitsva." },
      { seif: "2", titre_seif: "Interdiction d'utiliser le Tsitsit pour des usages profanes", brut: "ב. אין לנגב ידיו בציצית ולא להשתמש בהם לצרכי חול.", voyelles: "ב. אֵין לְנַגֵּב יָדָיו בַּצִּיצִית וְלֹא לְהִשְׁתַּמֵּשׁ בָּהֶם לְצָרְכֵי חוֹל.", francais: "2. On ne s'essuiera pas les mains avec les Tsitsit et on ne les utilisera pas à des fins profanes." },
      { seif: "3", titre_seif: "Déposer les franges détachées à la Gueniza", brut: "ג. ציצית שנפסלה יניחנה בגניזה או בין דפי ספר קודש.", voyelles: "ג. צִיצִית שֶׁנִּפְסְלָה יַנִּיחֶנָּה בִּגְנִיזָה אוֹ בֵּין דַּפֵּי סֵפֶר קֹדֶשׁ.", francais: "3. Un Tsitsit devenu invalide sera déposé à la Gueniza ou entre les pages d'un livre saint." },
      { seif: "4", titre_seif: "Entrer aux toilettes avec un Tallit Katan dissimulé", brut: "ד. מותר להיכנס לבית הכסא כשהוא לבוש בטלית קטן תחת בגדיו.", voyelles: "ד. מֻתָּר לְהִכָּנֵס לְבֵית הַכִּסֵּא כְּשֶׁהוּא לָבוּשׁ בְּטַלִּית קָטָן תַּחַת בְּגָדָיו.", francais: "4. Il est permis d'entrer aux toilettes lorsqu'on porte un Tallit Katan dissimulé sous ses vêtements." },
      { seif: "5", titre_seif: "Interdiction d'entrer aux toilettes avec le Tallit Gadol", brut: "ה. בטלית גדול שמתעטף בו לתפלה אין להיכנס לבית הכסא.", voyelles: "ה. בְּטַלִּית גָּדוֹל שֶׁמִּתְעַטֵּף בּוֹ לַתְּפִלָּה אֵין לְהִכָּנֵס לְבֵית הַכִּסֵּא.", francais: "5. Il est strictement interdit d'entrer aux toilettes avec le Tallit Gadol réservé à la prière." },
      { seif: "6", titre_seif: "Précautions pour le lavage du Tallit", brut: "ו. כשמכבסים את הטלית יזהרו שלא יסתבכו החוטים במכונה ויפסלו.", voyelles: "ו. כְּשֶׁמְּכַבְּסִים אֶת הַטַּלִּית יִזָּהֲרוּ שֶׁלֹּא יִסְתַּבְּכוּ הַחוּטִים בִּמְכוֹנָה וְיִפָּסְלוּ.", francais: "6. Lorsqu'on lave le Tallit, on veillera à ce que les franges ne s'emmêlent pas en machine." }
    ]
  },

  // SIMAN 15 (5 Seifim)
  {
    siman: "15",
    sujet_fr: "Chapitre 15 - Le Tsitsit la nuit et exemption nocturne (5 Seifim)",
    halakhot: [
      { seif: "1", titre_seif: "Exemption du Tsitsit la nuit (OuRe'item Oto)", brut: "א. מצות ציצית נוהגת ביום ולא בלילה, שנאמר וראיתם אותו - פרט ללילה.", voyelles: "א. מִצְוַת צִיצִית נוֹהֶגֶת בַּיּוֹם וְלֹא בַּלַּיְלָה, שֶׁנֶּאֱמַר וּרְאִיתֶם אֹתוֹ - פְּרָט לַלַּיְלָה.", francais: "1. La Mitsva du Tsitsit ne s'applique que le jour et non la nuit (« Vous le verrez » - exclusion nocturne)." },
      { seif: "2", titre_seif: "Absence de bénédiction sur le Tsitsit enfilé la nuit", brut: "ב. הלובש ציצית בלילה אינו מברך עליה.", voyelles: "ב. הַלּוֹבֵשׁ צִיצִית בַּלַּיְלָה אֵינוֹ מְבָרֵךְ עָלֶיהָ.", francais: "2. Celui qui enfile un Tsitsit la nuit ne récite pas de bénédiction." },
      { seif: "3", titre_seif: "Dormir avec son Tallit Katan toute la nuit", brut: "ג. הישן בטלית קטן בלילה, אינו מברך עליו בבוקר.", voyelles: "ג. הַיֵּשָׁן בְּטַלִּית קָטָן בַּלַּיְלָה, אֵינוֹ מְבָרֵךְ עָלָיו בַּבֹּקֶר.", francais: "3. Celui qui dort avec son Tallit Katan toute la nuit ne récite pas de bénédiction dessus le matin." },
      { seif: "4", titre_seif: "Acquittement du Tallit Katan par le Tallit Gadol le matin", brut: "ד. יברך בבוקר על טלית גדול ויפטור את הטלית קטן שעליו.", voyelles: "ד. יְבָרֵךְ בַּבֹּקֶר עַל טַלִּית גָּדוֹל וְיִפְטוֹר אֶת הַטַּלִּית קָטָן שֶׁעָלָיו.", francais: "4. Le matin, on bénira sur le Tallit Gadol et on acquittera ainsi le Tallit Katan porté." },
      { seif: "5", titre_seif: "Exemption du vêtement de nuit (Pyjama à 4 coins)", brut: "ה. בגד המיוחד ללילה פטור מציצית אפילו אם לובשו ביום.", voyelles: "ה. בֶּגֶד הַמְּיֻחָד לַלַּיְלָה פָּטוּר מִצִּיצִית אֲפִלּוּ אִם לוֹבְשׁוֹ בַּיּוֹם.", francais: "5. Un vêtement réservé exclusivement à la nuit (pyjama) est exempt de Tsitsit même porté le jour." }
    ]
  },

  // SIMAN 16 (4 Seifim)
  {
    siman: "16",
    sujet_fr: "Chapitre 16 - Le Tsitsit au cimetière - Lo'eg LaRash (4 Seifim)",
    halakhot: [
      { seif: "1", titre_seif: "Dissimuler les franges du Tsitsit au cimetière", brut: "א. הנכנס לבית הקברות צריך ללכסות את ציציותיו שלא ללגוג למתים.", voyelles: "א. הַנִּכְנָס לְבֵית הַקְּבָרוֹת צָרִיךְ לְכַסּוֹת אֶת צִיצִיּוֹתָיו שֶׁלֹּא לִלְגֹּג לַמֵּתִים.", francais: "1. Celui qui entre dans un cimetière doit dissimuler ses franges pour ne pas se moquer des défunts." },
      { seif: "2", titre_seif: "Le principe de Lo'eg LaRash (Respect des défunts)", brut: "ב. המראה ציצית למת עובר משום לועג לרש.", voyelles: "ב. הַמַּרְאֶה צִיצִית לַמֵּת עוֹבֵר מִשּׁוּם לוֹעֵג לָרָשׁ.", francais: "2. Montrer ostensiblement des franges de Tsitsit devant un défunt transgresse le principe de Lo'eg LaRash." },
      { seif: "3", titre_seif: "Distance requise autour des tombes (4 coudées)", brut: "ג. בתוך ארבע אמות של קבר צריך לכסות הציציות.", voyelles: "ג. בְּתוֹךְ אַרְבַּע אַמּוֹת שֶׁל קֶבֶר צָרִיךְ לְכַסּוֹת הַצִּיצִיּוֹת.", francais: "3. Dans un rayon de 4 coudées autour d'une tombe, il est obligatoire de couvrir ses Tsitsiot." },
      { seif: "4", titre_seif: "Franges naturellement dissimulées sous la chemise", brut: "ד. אם הציציות מכוסות תחת בגדיו אין צריך לעשות דבר.", voyelles: "ד. אִם הַצִּיצִיּוֹת מְכֻסּוֹת תַּחַת בְּגָדָיו אֵין צָרִיךְ לַעֲשׂוֹת דָּבָר.", francais: "4. Si les franges sont déjà naturellement dissimulées sous ses vêtements, aucune action n'est requise." }
    ]
  },

  // SIMAN 17 (4 Seifim)
  {
    siman: "17",
    sujet_fr: "Chapitre 17 - Exemption des femmes et des serviteurs (4 Seifim)",
    halakhot: [
      { seif: "1", titre_seif: "Exemption des femmes pour les Mitsvot liées au temps", brut: "א. נשים פטורות ממצות ציצית מפני שהיא מצות עשה שהזמן גרמא.", voyelles: "א. נָשִׁים פְּטוּרוֹת מִמִּצְוַת צִיצִית מִפְּנֵי שֶׁהִיא מִצְוַת עֲשֵׂה שֶׁהַזְּמָן גְּרָמָא.", francais: "1. Les femmes sont exemptes de la Mitsva du Tsitsit car il s'agit d'un commandement positif lié au temps." },
      { seif: "2", titre_seif: "Opposition des Sages à l'ostentation (Yohara)", brut: "ב. אם רוצות ללבוש ציצית אין מניחים אותן משום יוהרא.", voyelles: "ב. אִם רוֹצוֹת לִלְבֹּשׁ צִיצִית אֵין מַנִּיחִים אוֹתָן מִשּׁוּם יוֹהֲרָא.", francais: "2. Et si des femmes souhaitent en porter, les Sages s'y opposent en raison du risque d'ostentation (Yohara)." },
      { seif: "3", titre_seif: "Exemption des serviteurs et des jeunes enfants", brut: "ג. עבדים וקטנים שלא הגיעו לחינוך פטורים מציצית.", voyelles: "ג. עֲבָדִים וּקְטַנִּים שֶׁלֹּא הִגִּיעוּ לְחִנּוּךְ פְּטוּרִים מִצִּיצִית.", francais: "3. Les serviteurs et les jeunes enfants n'ayant pas atteint l'âge de l'éducation (Khinoukh) sont exempts." },
      { seif: "4", titre_seif: "Éducation des jeunes garçons au port du Tsitsit", brut: "ד. קטן שהגיע לחינוך מחנכים אותו ללבוש ציצית.", voyelles: "ד. קָטָן שֶׁהִגִּיעַ לְחִנּוּךְ מְחַנְּכִים אוֹתוֹ לִלְבֹּשׁ צִיצִית.", francais: "4. Un jeune garçon ayant atteint l'âge de l'éducation (dès 5-6 ans) doit être habitué à porter le Tsitsit." }
    ]
  },

  // SIMAN 18 (5 Seifim)
  {
    siman: "18",
    sujet_fr: "Chapitre 18 - Priorité du Tallit sur les Tefillines (5 Seifim)",
    halakhot: [
      { seif: "1", titre_seif: "Priorité matinale : Tallit puis Tefillines (Tadir)", brut: "א. יניח את הטלית תחילה ואחר כך יניח את התפילין, מפני שהציצית תדירה יותר.", voyelles: "א. יַנִּיחַ אֶת הַטַּלִּית תְּחִלָּה וְאַחַר כָּךְ יַנִּיחַ אֶת הַתְּפִלִּין, מִפְּנֵי שֶׁהַצִּיצִית תְּדִירָה יוֹתֵר.", francais: "1. Chaque matin, on revêtira d'abord le Tallit puis les Tefillines, car le Tsitsit est plus fréquent (Tadir)." },
      { seif: "2", titre_seif: "Cas où les Tefillines ont été pris en premier par mégarde", brut: "ב. פגע בתפילין תחילה יניחם ולא יעביר על המצוה.", voyelles: "ב. פָּגַע בַּתְּפִלִּין תְּחִלָּה יַנִּיחֵם וְלֹא יַעֲבִיר עַל הַמִּצְוָה.", francais: "2. Si l'on a saisi les Tefillines en premier, on les mettra sans survoler le commandement (Ein Ma'avirin)." },
      { seif: "3", titre_seif: "Principe d'élévation dans la sainteté (Ma'alin BaKodesh)", brut: "ג. מעלין בקודש ואין מורידין.", voyelles: "ג. מַעֲלִין בַּקֹּדֶשׁ וְאֵין מוֹרִידִין.", francais: "3. On s'élève dans les degrés de sainteté et l'on ne redescend pas." },
      { seif: "4", titre_seif: "Ordre de retrait à la fin de la prière", brut: "ד. בסיום התפלה חולץ התפילין תחילה ואחר כך מוריד הטלית.", voyelles: "ד. בְּסִיּוּם הַתְּפִלָּה חוֹלֵץ הַתְּפִלִּין תְּחִלָּה וְאַחַר כָּךְ מוֹרִיד הַטַּלִּית.", francais: "4. À la fin de la prière, on retire d'abord les Tefillines puis l'on rabaisse le Tallit." },
      { seif: "5", titre_seif: "Bénédictions distinctes du Tallit et du Tefillin", brut: "ה. מברכים ברכה נפרדת על הטלית וברכה נפרדת על התפילין.", voyelles: "ה. מְבָרְכִים בְּרָכָה נִפְרֶדֶת עַל הַטַּלִּית וּבְרָכָה נִפְרֶדֶת עַל הַתְּפִלִּין.", francais: "5. On récite une bénédiction distincte sur le Tallit et une bénédiction distincte sur le Tefillin." }
    ]
  },

  // SIMAN 19 (4 Seifim)
  {
    siman: "19",
    sujet_fr: "Chapitre 19 - Vêtements en cuir et étoffe spéciale (4 Seifim)",
    halakhot: [
      { seif: "1", titre_seif: "Exemption du vêtement entièrement en cuir", brut: "א. בגד של עור פטור מן הציצית, שאין נקרא בגד אלא דבר העשוי מטווי וארוג.", voyelles: "א. בֶּגֶד שֶׁל עוֹר פָּטוּר מִן הַצִּיצִית, שֶׁאֵין נִקְרָא בֶּגֶד אֶלָּא דָּבָר הֶעָשׂוּי מִטָּווּי וְאָרוּג.", francais: "1. Un vêtement en cuir est exempt du Tsitsit, car seul un textile filé et tissé est appelé Beged." },
      { seif: "2", titre_seif: "Définition halakhique du vêtement tissé", brut: "ב. בגד העשוי מבדים ארוגים חייב בציצית.", voyelles: "ב. בֶּגֶד הֶעָשׂוּי מִבַּדִּים אֲרוּגִים חַיָּב בַּצִּיצִית.", francais: "2. Tout vêtement fait d'étoffes tissées à 4 coins est soumis au Tsitsit." },
      { seif: "3", titre_seif: "Vêtement en cuir avec coins en tissu", brut: "ג. בגד עור שקבע בו כנפות של בגד ארוג חייב בציצית.", voyelles: "ג. בֶּגֶד עוֹר שֶׁקָּבַע בּוֹ כַּנְפוֹת שֶׁל בֶּגֶד אָרוּג חַיָּב בַּצִּיצִית.", francais: "3. Un vêtement en cuir auquel on a fixé des coins en tissu tissé devient soumis au Tsitsit." },
      { seif: "4", titre_seif: "Statut des fibres synthétiques modernes", brut: "ד. בגדים העשויים מסיבים סינתטיים מדרבנן חייבים בציצית.", voyelles: "ד. בְּגָדִים הָעֲשׂוּיִים מִסִּיבִים סִינְתֶטִיִּים מִדְּרַבָּנָן חַיָּבִים בַּצִּיצִית.", francais: "4. Les vêtements modernes en fibres synthétiques sont soumis au Tsitsit d'origine rabbinique." }
    ]
  },

  // SIMAN 20 (4 Seifim)
  {
    siman: "20",
    sujet_fr: "Chapitre 20 - Don ou vente d'un Tallit à un non-juif (4 Seifim)",
    halakhot: [
      { seif: "1", titre_seif: "Retirer les franges avant la vente à un non-juif", brut: "א. המוכר או נותן בגד של ציצית לגוי חייב להסיר את הציציות תחילה.", voyelles: "א. הַמּוֹכֵר אוֹ נוֹתֵן בֶּגֶד שֶׁל צִיצִית לְגוֹי חַיָּב לְהָסִיר אֶת הַצִּיצִיּוֹת תְּחִלָּה.", francais: "1. Celui qui vend ou donne un vêtement muni de Tsitsit à un non-juif doit en retirer les franges au préalable." },
      { seif: "2", titre_seif: "Prévention du risque de tromperie ou profanation", brut: "ב. הטעם להסיר הציציות שלא יבואו לידי מכשול וחילול.", voyelles: "ב. הַטַּעַם לְהָסִיר הַצִּיצִיּוֹת שֶׁלֹּא יָבֹאוּ לִידֵי מִכְשׁוֹל וְחִלּוּל.", francais: "2. La raison de ce retrait est d'empêcher tout obstacle ou profanation." },
      { seif: "3", titre_seif: "Vendre du tissu brut sans franges nouées", brut: "ג. מותר למכור לגוי בגד של ארבע כנפות שעדיין לא נטלו בו ציציות.", voyelles: "ג. מֻתָּר לִמְכֹּר לְגוֹי בֶּגֶד שֶׁל אַרְבַּע כַּנְפוֹת שֶׁעֲדַיִן לֹא נָטְלוּ בּוֹ צִיצִיּוֹת.", francais: "3. Il est permis de vendre à un non-juif un vêtement à 4 coins auquel on n'a jamais attaché de Tsitsit." },
      { seif: "4", titre_seif: "Donner un Tsitsit invalide (Passoul)", brut: "ד. ציצית שנפסלה מותר ליתנה לגוי לאחר שהתיר החוטים.", voyelles: "ד. צִיצִית שֶׁנִּפְסְלָה מֻתָּר לִתְנָהּ לְגוֹי לְאַחַר שֶׁהִתִּיר הַחוּטִים.", francais: "4. Un vêtement dont le Tsitsit a été défait ou déclaré invalide peut être donné à un non-juif." }
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

FULL_DATA.forEach((sData) => {
  const simanNum = sData.siman;
  const halakhot = sData.halakhot.map(h => processSeif(h, simanNum));

  const outputObj = {
    siman: simanNum,
    halakhot
  };

  const jsonStr = JSON.stringify(outputObj, null, 2);

  const targetFile = path.join(ROOT, 'public', 'data', `siman_${simanNum}.json`);
  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
  fs.writeFileSync(targetFile, jsonStr, 'utf8');

  console.log(`✅ Siman ${simanNum} built with ALL ${halakhot.length} Seifim in public/data/siman_${simanNum}.json`);
});

console.log("🎉 All Simanim 11 to 20 built with COMPLETE SEIFIM!");
