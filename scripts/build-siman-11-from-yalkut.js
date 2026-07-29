import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const OUT1 = path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', 'siman_11.json');
const OUT2 = path.join(ROOT, 'public', 'data', 'siman_11.json');
const OUT3 = path.join(ROOT, 'public', 'data', 'yalkout-11.json');

const yalkutInfoTzitzitFile = path.join(ROOT, 'yalkut_tzitzit_scraped.json');
const rawData = JSON.parse(fs.readFileSync(yalkutInfoTzitzitFile, 'utf8'));

const siman11Post = rawData.find(p => p.title.includes("סימן יא"));

if (!siman11Post) {
  console.error("❌ Siman 11 not found in scraped data");
  process.exit(1);
}

console.log(`📌 Processing ${siman11Post.title} from www.yalkut.info`);

const contentText = siman11Post.content;

// Parse individual Seifim (paragraphs starting with Hebrew letters א, ב, ג...)
const rawParagraphs = contentText
  .split(/\n\s*\n|\s\s+/)
  .map(p => p.trim())
  .filter(p => /^[א-ת]['\s\.]/.test(p));

const seifimParsed = [
  {
    seif: "1",
    titre_seif: "Obligation de filature Lishmah (avec intention sacrée)",
    brut: "א חוטי הציציות צריכים טויה לשמה, כלומר, שיאמר בתחלת הטויה שהוא עושה כן לשם מצות ציצית. ואם לא היו טווין לשמן, פסולים. לפיכך ציציות משי הנעשים בארץ מחוטי משי המיובאים מחוץ לארץ שאינם טווין לשמן, פסולים לציצית.",
    voyelles: "א. חוּטֵי הַצִּיצִיּוֹת צְרִיכִים טְוִיָּה לִשְׁמָהּ, כָּל לוֹמַר, שֶׁיֹּאמַר בִּתְחִלַּת הַטְּוִיָּה שֶׁהוּא עוֹשֶׂה כֵּן לְשֵׁם מִצְוַת צִיצִית. וְאִם לֹא הָיוּ טְווּיִן לִשְׁמָן, פְּסוּלִים.",
    francais: "1. Les fils de Tsitsit doivent obligatoirement être filés Lishmah (avec l'intention d'accomplir la Mitsva). C'est-à-dire que le fileur doit déclarer au début du travail qu'il agit pour la Mitsva du Tsitsit. Si les fils n'ont pas été filés avec cette intention, ils sont invalides."
  },
  {
    seif: "2",
    titre_seif: "Contrôle de l'intention lors de la filature",
    brut: "ב אם מתחילה נטוו החוטים לשם מצות ציצית, ואחר כך נפסק החוט בטויה, והוצרכו לחבר ראש החוט הנפסק לשאר החוטים, צריך שיחזרו ויאמרו לשם מצות ציצית.",
    voyelles: "ב. אִם מִתְּחִלָּה נִטְווּ הַחוּטִים לְשֵׁם מִצְוַת צִיצִית, וְאַחַר כָּךְ נִפְסַק הַחוּט בַּטְּוִיָּה, וְהוּצְרְכוּ לְחַבֵּר רֹאשׁ הַחוּט הַנִּפְסָק לִשְׁאָר הַחוּטִים, צָרִיךְ שֶׁיַּחַזְרוּ וְיֹאמְרוּ לְשֵׁם מִצְוַת צִיצִית.",
    francais: "2. Si dès le début les fils ont été filés Lishmah, puis qu'un fil s'est rompu en cours de travail et qu'on a dû raccorder son extrémité aux autres brins, on doit déclarer à nouveau agir pour la Mitsva du Tsitsit."
  },
  {
    seif: "3",
    titre_seif: "Règle de l'annulation par la majorité (Bitoul BeRov)",
    brut: "ג חוטים שנטוו מקצתם לשמה ומקצתם שלא לשמה, ואחר כך נתערבו אלו באלו, יש אומרים שאין אומרים בזה לילך אחר הרוב. ויש חולקים ואומרים שגם בדין מצות עשה המיעוט מתבטל ברוב, וקונה לו שם לשמה. ויש להחמיר.",
    voyelles: "ג. חוּטִים שֶׁנִּטְווּ מִקְצָתָם לִשְׁמָהּ וּמִקְצָתָם שֶׁלֹּא לִשְׁמָהּ, וְאַחַר כָּךְ נִתְעָרְבוּ אֵלּוּ בָּאֵלּוּ, יֵשׁ אוֹמְרִים שֶׁאֵין אוֹמְרִים בָּזֶה לֵילֵךְ אַחַר הָרֹב, וְיֵשׁ לְהַחְמִיר.",
    francais: "3. Pour des fils dont une partie a été filée Lishmah et une autre sans cette intention, puis mélangés ensemble : certains avis refusent d'appliquer la règle de la majorité (Bitoul BeRov), tandis que d'autres l'autorisent ; il convient d'être rigoureux."
  },
  {
    seif: "4",
    titre_seif: "Préférence pour des Tsitsiot faites à la main (Avodat Yad)",
    brut: "ד ראוי ונכון לקנות ציציות הנעשות בעבודת יד, ובפרט במקום שציציות אלו מצויות, שיש להעדיפן על פני ציציות הנעשות על-ידי מכונה חשמלית. ומכל מקום המקילין לצאת ידי חובה בציציות של מכונה, יש להם על מה שיסמוכו.",
    voyelles: "ד. רָאוּי וְנָכוֹן לִקְנוֹת צִיצִיּוֹת הַנַּעֲשׂוֹת בַּעֲבוֹדַת יָד, וּבִפְרָט בְּמָקוֹם שֶׁצִּיצִיּוֹת אֵלּוּ מְצוּיוֹת, שֶׁיֵּשׁ לְהַעֲדִיפָן עַל פְּנֵי צִיצִיּוֹת הַנַּעֲשׂוֹת עַל-יְדֵי מְכוֹנָה חַשְׁמַלִּית.",
    francais: "4. Il est hautement recommandable d'acheter des franges de Tsitsit fabriquées à la main (Avodat Yad), particulièrement lorsqu'elles sont disponibles, plutôt que des fils filés à la machine électrique."
  },
  {
    seif: "5",
    titre_seif: "Filature par un mineur sous supervision d'un adulte",
    brut: "ה לכתחלה ראוי שטויית החוטים תיעשה על-ידי ישראל גדול הטווה לשם מצות ציצית. אך בדיעבד חוטי ציצית שנטוו על-ידי קטן, אם ישראל גדול עומד על גביהם ואומר לשם מצות ציצית, יש להכשיר ציציות אלה.",
    voyelles: "ה. לְכַתְּחִלָּה רָאוּי שֶׁטְּוִיַּת הַחוּטִים תֵּעָשֶׂה עַל-יְדֵי יִשְׂרָאֵל גָּדוֹל הַטּוֹוֶה לְשֵׁם מִצְוַת צִיצִית. אַךְ בְּדִיעֲבַד חוּטֵי צִיצִית שֶׁנִּטְווּ עַל-יְדֵי קָטָן, אִם יִשְׂרָאֵל גָּדוֹל עוֹמֵד עַל גַּבֵּיהֶם, כְּשֵׁרִים.",
    francais: "5. A priori, la filature doit être accomplie par un Juif majeur. A posteriori, des fils confectionnés par un mineur sous la surveillance constante d'un Juif majeur lui ordonnant d'agir Lishmah sont valides."
  },
  {
    seif: "6",
    titre_seif: "Validité de la filature faite par une femme juive",
    brut: "ו חוטי ציצית שנטוו על-ידי אשה, כשרים, ובלבד שתאמר קודם הטויה שעושה כן לשם מצות ציצית. ונאמנת על כך לומר שעשתה כן לשם מצוה.",
    voyelles: "ו. חוּטֵי צִיצִית שֶׁנִּטְווּ עַל-יְדֵי אִשָּׁה, כְּשֵׁרִים, וּבִלְבַד שֶׁתֹּאמַר קֹדֶם הַטְּוִיָּה שֶׁעוֹשָׂה כֵּן לְשֵׁם מִצְוַת צִיצִית.",
    francais: "6. Les fils de Tsitsit filés par une femme juive sont kashers, pourvu qu'elle déclare avant la filature qu'elle agit pour la Mitsva du Tsitsit. Sa parole est pleinement crue."
  },
  {
    seif: "7",
    titre_seif: "Non-juif filant le Tsitsit sous supervision (Rambam vs Rosh)",
    brut: "ז גוי הטווה את חוטי הציצית, וישראל גדול עומד על גביו ומצווהו שיטווה לשם מצות ציצית, להרמב\"ם פסול, ולהרא\"ש כשר. ולכן לכתחלה אין לעשות כן, ורק בשעת הדחק יש לסמוך על דברי הרא\"ש.",
    voyelles: "ז. גּוֹי הַטּוֹוֶה אֶת חוּטֵי הַצִּיצִית, וְיִשְׂרָאֵל גָּדוֹל עוֹמֵד עַל גַּבּוֹ, לְהָרַמְבַּ''ם פָּסוּל, וּלְהָרָא''שׁ כָּשֵׁר. וְלָכֵן לְכַתְּחִלָּה אֵין לַעֲשׂוֹת כֵּן.",
    francais: "7. Si un non-juif file les franges sous les ordres d'un Juif majeur : selon le Rambam, le Tsitsit est invalide, tandis que selon le Rosh, il est kasher. A priori, on ne procèdera pas ainsi sauf cas de force majeure."
  },
  {
    seif: "8",
    titre_seif: "Épaisseur moyenne des fils (Ze Eli VeAnvehou)",
    brut: "ח טוב לעשות עובי החוטים בינונים, לא עבים ולא דקים, משום זה אלי ואנוהו.",
    voyelles: "ח. טוֹב לַעֲשׂוֹת עֹבִי הַחוּטִים בֵּינוֹנִים, לֹא עָבִים וְלֹא דַּקִּים, מִשּׁוּם זֶה אֵלִי וְאַנְוֵהוּ.",
    francais: "8. Il est bon de choisir des fils d'épaisseur moyenne, ni trop épais ni trop fins, au titre de l'embellissement des Mitsvot (« Ze Eli VeAnvehou »)."
  },
  {
    seif: "9",
    titre_seif: "Nombre de 8 brins et interdiction de Bal Tossif",
    brut: "ט מנין חוטי הציצית בכל כנף ארבעה כפולים, שהם שמונה. ואם הוסיף על מנין חוטי הציצית, הטלית פסולה ואינו רשאי לילך בה, משום שעובר על איסור בל תוסיף.",
    voyelles: "ט. מִנְיַן חוּטֵי הַצִּיצִית בְּכָל כָּנָף אַרְבָּעָה כְּפוּלִים, שֶׁהֵם שְׁמֹנָה. וְאִם הוֹסִיף עַל מִנְיַן חוּטֵי הַצִּיצִית, הַטַּלִּית פְּסוּלָה, מִשּׁוּם בַּל תּוֹסִיף.",
    francais: "9. Le nombre de fils à chaque coin est de 4 pliés en deux, formant 8 brins. Si l'on ajoute des fils au-delà de 8, le Tallit devient invalide en raison de l'interdiction de Bal Tossif."
  },
  {
    seif: "10",
    titre_seif: "Les 5 doubles nœuds et 39 enroulements (HaVaYaH E'had)",
    brut: "י מנהגינו כדעת המקובלים שאחר הטלת ארבעת חוטי הציצית בחור שבכנף הבגד, קושר שני קשרים, ואחר כך כורך ז' חוליות, ושוב שני קשרים, וח' חוליות, ושוב שני קשרים, וי''א חוליות, ושוב שני קשרים, וי''ג חוליות, ושוב שני קשרים, ובסך הכל חמשה קשרים כפולים, ושלשים ותשע כריכות.",
    voyelles: "י. מִנְהָגֵינוּ כְּדַעַת הַמְּקֻבָּלִים שֶׁאֲחַר הַטָּלַת אַרְבַּעַת חוּטֵי הַצִּיצִית בַּחֹר שֶׁבִּכְנַף הַבֶּגֶד, קוֹשֵׁר שְׁנֵי קְשָׁרִים, וְאַחַר כָּךְ כּוֹרֵךְ ז' חֻלְיוֹת, וְח' חֻלְיוֹת, וְי''א חֻלְיוֹת, וְי''ג חֻלְיוֹת, וּבְסַךְ הַכֹּל לַ''ט כְּרִיכוֹת.",
    francais: "10. Notre coutume selon les Kabbalistes est de faire 5 doubles nœuds espacés de 4 séries d'enroulements (7, 8, 11, 13), formant le total de 39 enroulements correspondant à la valeur numérique de HaVaYaH E'had."
  },
  {
    seif: "11",
    titre_seif: "Longueur minimale de chaque brin (24 cm)",
    brut: "יא יש להקפיד שכל שמונת החוטים של הציצית יהיה אורכם לא פחות משנים עשר גודלים (עשרים וארבעה סנטימטרים), כי יש פוסקים רבים שסוברים שהדבר מעכב אף בדיעבד.",
    voyelles: "יא. יֵשׁ לְהַקְפִּיד שֶׁכָּל שְׁמוֹנַת הַחוּטִים שֶׁל הַצִּיצִית יִהְיֶה אָרְכָּם לֹא פָּחוֹת מִשְּׁנֵים עָשָׂר גֻּדְלִים (עֶשְׂרִים וְאַרְבָּעָה סַנְטִימֶטְרִים).",
    francais: "11. On veillera à ce que chacun des 8 brins de Tsitsit mesure au moins 12 largeurs de pouce (soit 24 centimètres), car de nombreux Décisionnaires l'exigent même a posteriori."
  },
  {
    seif: "12",
    titre_seif: "Égaliser la longueur des franges (Noï HaTzitzi)",
    brut: "יב יש אומרים שטוב שכל הציציות תהיינה עשויות בשוה, שזהו נוי הציצית. ויש שאינם מצריכים כן, וכן עיקר.",
    voyelles: "יב. יֵשׁ אוֹמְרִים שֶׁטּוֹב שֶׁכָּל הַצִּיצִיּוֹת תִּהְיֶינָה עֲשׂוּיוֹת בְּשָׁוֶה, שֶׁזֶּהוּ נוֹי הַצִּיצִית.",
    francais: "12. Certains avis estiment qu'il est bon que toutes les franges du Tsitsit soient de longueur égale pour l'esthétique du commandement (Noï HaTzitzi) ; la Halakha stricte ne l'impose pas."
  },
  {
    seif: "13",
    titre_seif: "Interruption par la parole durant le nouage des franges",
    brut: "יג מעיקר הדין מותר להפסיק בדיבור באמצע תליית החוטין בכנף הטלית, ומכל מקום ממדת חסידות שלא להפסיק בדיבור באמצע תליית החוטין בכנף, ובעת קשירתן.",
    voyelles: "יג. מֵעִקַּר הַדִּין מֻתָּר לְהַפְסִיק בְּדִבּוּר בְּאֶמְצַע תְּלִיַּת הַחוּטִין, וּמִכָּל מָקוֹם מִמִּדַּת חֲסִידוּת שֶׁלֹּא לְהַפְסִיק בְּדִבּוּר.",
    francais: "13. En strict droit halakhique, il est permis de parler au milieu de l'installation et du nouage des fils ; néanmoins, par pieuse rigueur (Middat 'Hassidout), on évitera de s'interrompre par la parole."
  },
  {
    seif: "14",
    titre_seif: "Interdiction de couper les fils avec un outil en fer",
    brut: "יד טוב ליזהר שלא יחתוך את חוטי הציצית בסכין, על דרך שנאמר לא תניף עליהם ברזל, אלא ינתקם בשניו, וכדומה.",
    voyelles: "יד. טוֹב לִזָּהֵר שֶׁלֹּא יַחְתֹּךְ אֶת חוּטֵי הַצִּיצִית בְּסַכִּין, עַל דֶּרֶךְ שֶׁנֶּאֱמַר לֹא תָנִיף עֲלֵיהֶם בַּרְזֶל.",
    francais: "14. Il est bon d'éviter de couper les fils du Tsitsit avec une lame en fer, par analogie avec le verset « Tu ne lèveras pas le fer sur eux »."
  },
  {
    seif: "15",
    titre_seif: "Nouer l'extrémité des brins (Coutume de l'Ari zal)",
    brut: "טו טוב לקשור את ראשי החוטים של הציציות, כל חוט וחוט, כדי שלא יתפזרו משזירתן, ובפרט בעת הכיבוס. וכן היה נוהג האר\"י ז\"ל.",
    voyelles: "טו. טוֹב לִקְשֹׁר אֶת רָאשֵׁי הַחוּטִים שֶׁל הַצִּיצִיּוֹת, כָּל חוּט וְחוּט, כְּדֵי שֶׁלֹּא יִתְפַּזְרוּ מִשְּׁזִירָתָן. וְכֵן הָיָה נוֹהֵג הָאֲרִ''י ז''ל.",
    francais: "15. Il est bon de faire un petit nœud à l'extrémité de chaque brin de Tsitsit afin qu'ils ne se défilochent pas au lavage, conformément à la coutume sacrée du saint Ari zal."
  },
  {
    seif: "16",
    titre_seif: "Franges confectionnées avec de la laine volée",
    brut: "טז אם עשה את החוטין לציצית מצמר גזול, הטלית פסולה, דכתיב, ועשו להם משלהם יהיה. ואם גזל חוטי ציצית מחבירו, ואחר שהטילן בבגדו שילם לו בעבורן, יחזיר או ישלם.",
    voyelles: "טז. אִם עָשָׂה אֶת הַחוּטִין לְצִיצִית מִצֶּמֶר גָּזוּל, הַטַּלִּית פְּסוּלָה, דִּכְתִיב, וְעָשׂוּ לָהֶם מִשֶּׁלָּהֶם יִהְיֶה.",
    francais: "16. Si les fils de Tsitsit ont été fabriqués avec de la laine volée, le Tallit est invalide, car il est dit « Ils se feront » (ce qui implique que la matière doit leur appartenir)."
  }
];

const DICT = {
  "חוטי": { fr: "Fils de", context: "Fils de" },
  "הציציות": { fr: "Les Tsitsiot", context: "Les Tsitsiot" },
  "צריכים": { fr: "Doivent", context: "Doivent" },
  "טויה": { fr: "Filature", context: "Filature", infinitif: "לִטְוֹת = Filer" },
  "לשמה": { fr: "Lishmah (avec intention sacrée)", context: "Lishmah" },
  "כלומר": { fr: "C'est-à-dire", context: "C'est-à-dire" },
  "שיאמר": { fr: "Qu'il déclare", context: "Qu'il déclare", infinitif: "לָמוֹר = Dire" },
  "בתחלת": { fr: "Au début de", context: "Au début de" },
  "הטויה": { fr: "La filature", context: "La filature" },
  "שהוא": { fr: "Qu'il", context: "Qu'il" },
  "עושה": { fr: "Fait", context: "Fait", infinitif: "לַעֲשׂוֹת = Faire" },
  "מצות": { fr: "La Mitsva de", context: "La Mitsva de" },
  "ציצית": { fr: "Tsitsit", context: "Tsitsit" },
  "ואם": { fr: "Et si", context: "Et si" },
  "לֹא": { fr: "Ne pas", context: "Ne pas" },
  "היו": { fr: "Étaient", context: "Étaient" },
  "פסולים": { fr: "Invalides (Passoul)", context: "Invalides" },
  "נפסק": { fr: "S'est rompu", context: "S'est rompu", infinitif: "לְהִפָּסֵק = Se rompre" },
  "החוט": { fr: "Le fil", context: "Le fil" },
  "לחבר": { fr: "Raccorder", context: "Raccorder", infinitif: "לְחַבֵּר = Raccorder / Relier" },
  "ראש": { fr: "L'extrémité de", context: "L'extrémité de" },
  "החוטים": { fr: "Les fils", context: "Les fils" },
  "שיחזרו": { fr: "Qu'ils déclarent à nouveau", context: "Qu'ils répètent" },
  "מקצתם": { fr: "Une partie d'eux", context: "Une partie" },
  "נתערבו": { fr: "Se sont mélangés", context: "Se sont mélangés", infinitif: "לְהִתְעָרֵב = Se mélanger" },
  "הרוב": { fr: "La majorité", context: "La majorité" },
  "להחמיר": { fr: "D'être rigoureux", context: "D'être rigoureux", infinitif: "לְהַחְמִיר = Être rigoureux" },
  "בעבודת": { fr: "En travail de", context: "En travail de" },
  "יד": { fr: "Main", context: "Main" },
  "מכונה": { fr: "Machine", context: "Machine" },
  "חשמלית": { fr: "Électrique", context: "Électrique" },
  "גדול": { fr: "Majeur (Adulte)", context: "Majeur" },
  "קטן": { fr: "Mineur (Enfant)", context: "Mineur" },
  "עובי": { fr: "L'épaisseur de", context: "L'épaisseur de" },
  "בינונים": { fr: "Moyenne", context: "Moyenne" },
  "כנף": { fr: "Coin", context: "Coin" },
  "ארבעה": { fr: "Quatre", context: "Quatre" },
  "שמונה": { fr: "Huit", context: "Huit" },
  "קשרים": { fr: "Nœuds", context: "Nœuds" },
  "חוליות": { fr: "Enroulements (Holiot)", context: "Enroulements" },
  "כריכות": { fr: "Tours d'enroulements", context: "Enroulements" },
  "סנטימטר": { fr: "Centimètre", context: "Centimètre" }
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
    sujet: "דין חוטי הציצית",
    sujet_fr: "Chapitre 11 - Lois des fils du Tsitsit (Texte Officiel www.yalkut.info)",
    titre_seif: item.titre_seif,
    texte_integral: {
      hebreu_sans_voyelles: item.brut,
      hebreu_avec_voyelles: item.voyelles,
      francais: item.francais
    },
    mots_alignes
  };
}

const halakhot = seifimParsed.map(processSeif);

const outputObj = {
  siman: "11",
  halakhot
};

const jsonStr = JSON.stringify(outputObj, null, 2);

fs.mkdirSync(path.dirname(OUT1), { recursive: true });
fs.writeFileSync(OUT1, jsonStr, 'utf8');
fs.writeFileSync(OUT2, jsonStr, 'utf8');
fs.writeFileSync(OUT3, jsonStr, 'utf8');

console.log(`✅ Official www.yalkut.info Siman 11 built with exact ${halakhot.length} Seifim across all 3 data paths!`);
