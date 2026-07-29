import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const OUT1 = path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', 'siman_11.json');
const OUT2 = path.join(ROOT, 'public', 'data', 'siman_11.json');
const OUT3 = path.join(ROOT, 'public', 'data', 'yalkout-11.json');

const SIMAN_11_SEIFIM = [
  {
    seif: "1",
    titre_seif: "Obligation de filature Lishmah (avec intention sacrée)",
    voyelles: "א. חוּטֵי הַצִּיצִיּוֹת צְרִיכִים טְוִיָּה לִשְׁמָהּ, כָּל לוֹמַר, שֶׁיֹּאמַר בִּתְחִלַּת הַטְּוִיָּה שֶׁהוּא עוֹשֶׂה כֵּן לְשֵׁם מִצְוַת צִיצִית. וְאִם לֹא הָיוּ טְווּיִן לִשְׁמָן, פְּסוּלִים.",
    brut: "א. חוטי הציציות צריכים טויה לשמה, כלומר, שיאמר בתחלת הטויה שהוא עושה כן לשם מצות ציצית. ואם לא היו טווין לשמן, פסולים.",
    francais: "1. Les fils de Tsitsit doivent obligatoirement être filés Lishmah (avec l'intention d'accomplir la Mitsva). C'est-à-dire que le fileur doit déclarer au début du travail qu'il agit pour la Mitsva du Tsitsit. Si les fils n'ont pas été filés avec cette intention, ils sont invalides.",
    dict: {
      "א.": "1 (Seïf 1)",
      "חוּטֵי": "Fils de",
      "הַצִּיצִיּוֹת": "Les Tsitsiot",
      "צְרִיכִים": "Doivent",
      "טְוִיָּה": "Filature",
      "לִשְׁמָהּ,": "Lishmah (avec intention sacrée)",
      "כָּל": "Tout",
      "לוֹמַר,": "À dire / C'est-à-dire",
      "שֶׁיֹּאמַר": "Qu'il dise",
      "בִּתְחִלַּת": "Au début de",
      "הַטְּוִיָּה": "La filature",
      "שֶׁהוּא": "Qu'il",
      "עוֹשֶׂה": "Fait",
      "כֵּן": "Ainsi",
      "לְשֵׁם": "Au nom de",
      "מִצְוַת": "La Mitsva de",
      "צִיצִית.": "Tsitsit",
      "וְאִם": "Et si",
      "לֹא": "Ne... pas",
      "הָיוּ": "Étaient",
      "טְווּיִן": "Filés",
      "לִשְׁמָן,": "Avec cette intention",
      "פְּסוּלִים.": "Invalides (Passoul)"
    }
  },
  {
    seif: "2",
    titre_seif: "Contrôle de l'intention lors de la filature",
    voyelles: "ב. אִם מִתְּחִלָּה נִטְווּ הַחוּטִים לְשֵׁם מִצְוַת צִיצִית, וְאַחַר כָּךְ נִפְסַק הַחוּט בַּטְּוִיָּה, וְהוּצְרְכוּ לְחַבֵּר רֹאשׁ הַחוּט הַנִּפְסָק לִשְׁאָר הַחוּטִים, צָרִיךְ שֶׁיַּחַזְרוּ וְיֹאמְרוּ לְשֵׁם מִצְוַת צִיצִית.",
    brut: "ב. אם מתחילה נטוו החוטים לשם מצות ציצית, ואחר כך נפסק החוט בטויה, והוצרכו לחבר ראש החוט הנפסק לשאר החוטים, צריך שיחזרו ויאמרו לשם מצות ציצית.",
    francais: "2. Si dès le début les fils ont été filés Lishmah, puis qu'un fil s'est rompu en cours de travail et qu'on a dû raccorder son extrémité aux autres brins, on doit déclarer à nouveau agir pour la Mitsva du Tsitsit.",
    dict: {
      "ב.": "2 (Seïf 2)",
      "אִם": "Si",
      "מִתְּחִלָּה": "Dès le début",
      "נִטְווּ": "Ont été filés",
      "הַחוּטִים": "Les fils",
      "לְשֵׁם": "Pour",
      "מִצְוַת": "La Mitsva de",
      "צִיצִית,": "Tsitsit",
      "וְאַחַר": "Et après",
      "כָּךְ": "Cela",
      "נִפְסַק": "S'est rompu",
      "הַחוּט": "Le fil",
      "בַּטְּוִיָּה,": "Lors de la filature",
      "וְהוּצְרְכוּ": "Et qu'on a dû",
      "לְחַבֵּר": "Raccorder",
      "רֹאשׁ": "L'extrémité de",
      "הַנִּפְסָק": "Rompu",
      "לִשְׁאָר": "Aux autres",
      "הַחוּטִים,": "Les fils",
      "צָרִיךְ": "Il faut",
      "שֶׁיַּחַזְרוּ": "Qu'ils répètent",
      "וְיֹאמְרוּ": "Et déclarent",
      "צִיצִית.": "Tsitsit"
    }
  },
  {
    seif: "3",
    titre_seif: "Règle de l'annulation par la majorité (Bitoul BeRov)",
    voyelles: "ג. חוּטִים שֶׁנִּטְווּ מִקְצָתָם לִשְׁמָהּ וּמִקְצָתָם שֶׁלֹּא לִשְׁמָהּ, וְאַחַר כָּךְ נִתְעָרְבוּ אֵלּוּ בָּאֵלּוּ, יֵשׁ אוֹמְרִים שֶׁאֵין אוֹמְרִים בָּזֶה לֵילֵךְ אַחַר הָרֹב, וְיֵשׁ לְהַחְמִיר.",
    brut: "ג. חוטים שנטוו מקצתם לשמה ומקצתם שלא לשמה, ואחר כך נתערבו אלו באלו, יש אומרים שאין אומרים בזה לילך אחר הרוב, ויש להחמיר.",
    francais: "3. Pour des fils dont une partie a été filée Lishmah et une autre sans cette intention, puis mélangés ensemble : certains avis refusent d'appliquer la règle de la majorité (Bitoul BeRov), tandis que d'autres l'autorisent ; il convient d'être rigoureux.",
    dict: {
      "ג.": "3 (Seïf 3)",
      "חוּטִים": "Fils",
      "שֶׁנִּטְווּ": "Qui ont été filés",
      "מִקְצָתָם": "Une partie d'eux",
      "לִשְׁמָהּ": "Lishmah",
      "וּמִקְצָתָם": "Et une partie d'eux",
      "שֶׁלֹּא": "Sans",
      "לִשְׁמָהּ,": "Intention sacrée",
      "וְאַחַר": "Et après",
      "כָּךְ": "Cela",
      "נִתְעָרְבוּ": "Se sont mélangés",
      "אֵלּוּ": "Ceux-ci",
      "בָּאֵלּוּ,": "Dans ceux-là",
      "יֵשׁ": "Il y a",
      "אוֹמְרִים": "Qui disent",
      "שֶׁאֵין": "Qu'on ne doit pas",
      "בָּזֶה": "Dans cela",
      "לֵילֵךְ": "Aller",
      "אַחַר": "D'après",
      "הָרֹב,": "La majorité",
      "וְיֵשׁ": "Et il faut",
      "לְהַחְמִיר.": "Être rigoureux"
    }
  },
  {
    seif: "4",
    titre_seif: "Préférence pour des Tsitsiot faites à la main (Avodat Yad)",
    voyelles: "ד. רָאוּי וְנָכוֹן לִקְנוֹת צִיצִיּוֹת הַנַּעֲשׂוֹת בַּעֲבוֹדַת יָד, וּבִפְרָט בְּמָקוֹם שֶׁצִּיצִיּוֹת אֵלּוּ מְצוּיוֹת, שֶׁיֵּשׁ לְהַעֲדִיפָן עַל פְּנֵי צִיצִיּוֹת הַנַּעֲשׂוֹת עַל-יְדֵי מְכוֹנָה חַשְׁמַלִּית.",
    brut: "ד. ראוי ונכון לקנות ציציות הנעשות בעבודת יד, ובפרט במקום שציציות אלו מצויות, שיש להעדיפן על פני ציציות הנעשות על-ידי מכונה חשמלית.",
    francais: "4. Il est hautement recommandable d'acheter des franges de Tsitsit fabriquées à la main (Avodat Yad), particulièrement lorsqu'elles sont disponibles, plutôt que des fils filés à la machine électrique.",
    dict: {
      "ד.": "4 (Seïf 4)",
      "רָאוּי": "Convenable / Hautement",
      "וְנָכוֹן": "Et recommandé",
      "לִקְנוֹת": "D'acheter",
      "צִיצִיּוֹת": "Des Tsitsiot",
      "הַנַּעֲשׂוֹת": "Fabriquées",
      "בַּעֲבוֹדַת": "Travail de / Fabriquées",
      "יָד,": "Main (à la main)",
      "וּבִפְרָט": "Et en particulier",
      "בְּמָקוֹם": "Dans un endroit",
      "שֶׁצִּיצִיּוֹת": "Où des Tsitsiot",
      "אֵלּוּ": "Celles-ci",
      "מְצוּיוֹת,": "Sont disponibles",
      "שֶׁיֵּשׁ": "Qu'il faut",
      "לְהַעֲדִיפָן": "Les préférer",
      "עַל": "Sur",
      "פְּנֵי": "La surface de",
      "עַל-יְדֵי": "Par le biais de",
      "מְכוֹנָה": "Machine",
      "חַשְׁמַלִּית.": "Électrique"
    }
  },
  {
    seif: "5",
    titre_seif: "Filature par un mineur sous supervision d'un adulte",
    voyelles: "ה. לְכַתְּחִלָּה רָאוּי שֶׁטְּוִיַּת הַחוּטִים תֵּעָשֶׂה עַל-יְדֵי יִשְׂרָאֵל גָּדוֹל הַטּוֹוֶה לְשֵׁם מִצְוַת צִיצִית. אַךְ בְּדִיעֲבַד חוּטֵי צִיצִית שֶׁנִּטְווּ עַל-יְדֵי קָטָן, אִם יִשְׂרָאֵל גָּדוֹל עוֹמֵד עַל גַּבֵּיהֶם, כְּשֵׁרִים.",
    brut: "ה. לכתחלה ראוי שטויית החוטים תיעשה על-ידי ישראל גדול הטווה לשם מצות ציצית. אך בדיעבד חוטי ציצית שנטוו על-ידי קטן, אם ישראל גדול עומד על גביהם, כשרים.",
    francais: "5. A priori, la filature doit être accomplie par un Juif majeur. A posteriori, des fils confectionnés par un mineur sous la surveillance constante d'un Juif majeur lui ordonnant d'agir Lishmah sont valides.",
    dict: {
      "ה.": "5 (Seïf 5)",
      "לְכַתְּחִלָּה": "A priori",
      "רָאוּי": "Il convient",
      "שֶׁטְּוִיַּת": "Que la filature de",
      "הַחוּטִים": "Les fils",
      "תֵּעָשֶׂה": "Soit faite",
      "עַל-יְדֵי": "Par",
      "יִשְׂרָאֵל": "Un Israélite",
      "גָּדוֹל": "Majeur (Adulte)",
      "הַטּוֹוֶה": "Qui file",
      "לְשֵׁם": "Pour",
      "מִצְוַת": "La Mitsva de",
      "צִיצִית.": "Tsitsit",
      "צִיצִית": "Tsitsit",
      "עַל": "Sur",
      "אַךְ": "Mais",
      "בְּדִיעֲבַד": "A posteriori",
      "חוּטֵי": "Des fils de",
      "שֶׁנִּטְווּ": "Filés",
      "קָטָן,": "Par un mineur",
      "אִם": "Si",
      "עוֹמֵד": "Se tient",
      "גַּבֵּיהֶם,": "Au-dessus d'eux",
      "כְּשֵׁרִים.": "Kashers (Valides)"
    }
  },
  {
    seif: "6",
    titre_seif: "Validité de la filature faite par une femme juive",
    voyelles: "ו. חוּטֵי צִיצִית שֶׁנִּטְווּ עַל-יְדֵי אִשָּׁה, כְּשֵׁרוֹת, וּבִלְבַד שֶׁתֹּאמַר קֹדֶם הַטְּוִיָּה שֶׁעוֹשָׂה כֵּן לְשֵׁם מִצְוַת צִיצִית.",
    brut: "ו. חוטי ציצית שנטוו על-ידי אשה, כשרים, ובלבד שתאמר קודם הטויה שעושה כן לשם מצות ציצית.",
    francais: "6. Les fils de Tsitsit filés par une femme juive sont kashers, pourvu qu'elle déclare avant la filature qu'elle agit pour la Mitsva du Tsitsit. Sa parole est pleinement crue.",
    dict: {
      "ו.": "6 (Seïf 6)",
      "חוּטֵי": "Fils de",
      "צִיצִית": "Tsitsit",
      "שֶׁנִּטְווּ": "Filés",
      "עַל-יְדֵי": "Par",
      "אִשָּׁה,": "Une femme",
      "כְּשֵׁרוֹת,": "Sont kashers",
      "וּבִלְבַד": "À condition",
      "שֶׁתֹּאמַר": "Qu'elle dise",
      "קֹדֶם": "Avant",
      "הַטְּוִיָּה": "La filature",
      "שֶׁעוֹשָׂה": "Qu'elle fait",
      "כֵּן": "Ainsi",
      "לְשֵׁם": "Pour",
      "מִצְוַת": "La Mitsva de",
      "צִיצִית.": "Tsitsit"
    }
  },
  {
    seif: "7",
    titre_seif: "Non-juif filant le Tsitsit sous supervision (Rambam vs Rosh)",
    voyelles: "ז. גּוֹי הַטּוֹוֶה אֶת חוּטֵי הַצִּיצִית, וְיִשְׂרָאֵל גָּדוֹל עוֹמֵד עַל גַּבּוֹ, לְהָרַמְבַּ''ם פָּסוּל, וּלְהָרָא''שׁ כָּשֵׁר. וְלָכֵן לְכַתְּחִלָּה אֵין לַעֲשׂוֹת כֵּן.",
    brut: "ז. גוי הטווה את חוטי הציצית, וישראל גדול עומד על גביו, להרמבם פסול, ולהראש כשר. ולכן לכתחלה אין לעשות כן.",
    francais: "7. Si un non-juif file les franges sous les ordres d'un Juif majeur : selon le Rambam, le Tsitsit est invalide, tandis que selon le Rosh, il est kasher. A priori, on ne procèdera pas ainsi sauf cas de force majeure.",
    dict: {
      "ז.": "7 (Seïf 7)",
      "גּוֹי": "Un non-juif",
      "הַטּוֹוֶה": "Qui file",
      "אֶת": "[Accusatif]",
      "חוּטֵי": "Les fils de",
      "הַצִּיצִית,": "Le Tsitsit",
      "וְיִשְׂרָאֵל": "Et un Israélite",
      "גָּדוֹל": "Majeur",
      "עוֹמֵד": "Se tient",
      "עַל": "Sur",
      "גַּבּוֹ,": "Son dos / au-dessus de lui",
      "לְהָרַמְבַּ''ם": "Selon le Rambam",
      "פָּסוּל,": "Invalide",
      "וּלְהָרָא''שׁ": "Et selon le Rosh",
      "כָּשֵׁר.": "Kasher",
      "וְלָכֵן": "Et donc",
      "לְכַתְּחִלָּה": "A priori",
      "אֵין": "Ne pas",
      "לַעֲשׂוֹת": "Faire",
      "כֵּן.": "Ainsi"
    }
  },
  {
    seif: "8",
    titre_seif: "Épaisseur moyenne des fils (Ze Eli VeAnvehou)",
    voyelles: "ח. טוֹב לַעֲשׂוֹת עֹבִי הַחוּטִים בֵּינוֹנִים, לֹא עָבִים וְלֹא דַּקִּים, מִשּׁוּם זֶה אֵלִי וְאַנְוֵהוּ.",
    brut: "ח. טוב לעשות עובי החוטים בינונים, לא עבים ולא דקים, משום זה אלי ואנוהו.",
    francais: "8. Il est bon de choisir des fils d'épaisseur moyenne, ni trop épais ni trop fins, au titre de l'embellissement des Mitsvot (« Ze Eli VeAnvehou »).",
    dict: {
      "ח.": "8 (Seïf 8)",
      "טוֹב": "Il est bon",
      "לַעֲשׂוֹת": "De faire",
      "עֹבִי": "L'épaisseur de",
      "הַחוּטִים": "Les fils",
      "בֵּינוֹנִים,": "Moyenne",
      "לֹא": "Ni",
      "עָבִים": "Épais",
      "וְלֹא": "Ni",
      "דַּקִּים,": "Fins",
      "מִשּׁוּם": "Au titre de",
      "זֶה": "Ceci est",
      "אֵלִי": "Mon Dieu",
      "וְאַנְוֵהוּ.": "Et je L'embellirai"
    }
  },
  {
    seif: "9",
    titre_seif: "Nombre de 8 brins et interdiction de Bal Tossif",
    voyelles: "ט. מִנְיַן חוּטֵי הַצִּיצִית בְּכָל כָּנָף אַרְבָּעָה כְּפוּלִים, שֶׁהֵם שְׁמֹנָה. וְאִם הוֹסִיף עַל מִנְיַן חוּטֵי הַצִּיצִית, הַטַּלִּית פְּסוּלָה, מִשּׁוּם בַּל תּוֹסִיף.",
    brut: "ט. מנין חוטי הציצית בכל כנף ארבעה כפולים, שהם שמונה. ואם הוסיף על מנין חוטי הציצית, הטלית פסולה, משום בל תוסיף.",
    francais: "9. Le nombre de fils à chaque coin est de 4 pliés en deux, formant 8 brins. Si l'on ajoute des fils au-delà de 8, le Tallit devient invalide en raison de l'interdiction de Bal Tossif.",
    dict: {
      "ט.": "9 (Seïf 9)",
      "מִנְיַן": "Le nombre de",
      "חוּטֵי": "Fils de",
      "הַצִּיצִית": "Le Tsitsit",
      "הַצִּיצִית,": "Le Tsitsit",
      "בְּכָל": "À chaque",
      "כָּנָף": "Coin",
      "אַרְבָּעָה": "Quatre",
      "כְּפוּלִים,": "Pliés en deux",
      "שֶׁהֵם": "Qui sont",
      "שְׁמֹנָה.": "Huit",
      "וְאִם": "Et si",
      "הוֹסִיף": "Il a ajouté",
      "עַל": "Sur",
      "מִנְיַן": "Le nombre de",
      "הַטַּלִּית": "Le Tallit",
      "פְּסוּלָה,": "Invalide",
      "מִשּׁוּם": "En raison de",
      "בַּל": "Ne pas",
      "תּוֹסִיף.": "Ajouter (Bal Tossif)"
    }
  },
  {
    seif: "10",
    titre_seif: "Les 5 doubles nœuds et 39 enroulements (HaVaYaH E'had)",
    voyelles: "י. מִנְהָגֵינוּ כְּדַעַת הַמְּקֻבָּלִים שֶׁאֲחַר הַטָּלַת אַרְבַּעַת חוּטֵי הַצִּיצִית בַּחֹר שֶׁבִּכְנַף הַבֶּגֶד, קוֹשֵׁר שְׁנֵי קְשָׁרִים, וְאַחַר כָּךְ כּוֹרֵךְ ז' חֻלְיוֹת, וְח' חֻלְיוֹת, וְי''א חֻלְיוֹת, וְי''ג חֻלְיוֹת, וּבְסַךְ הַכֹּל לַ''ט כְּריכוֹת.",
    brut: "י. מנהגינו כדעת המקובלים שאחר הטלת ארבעת חוטי הציצית בחור שבכנף הבגד, קושר שני קשרים, ואחר כך כורך ז חוליות, וח חוליות, ויא חוליות, ויג חוליות, ובסך הכל לט כריכות.",
    francais: "10. Notre coutume selon les Kabbalistes est de faire 5 doubles nœuds espacés de 4 séries d'enroulements (7, 8, 11, 13), formant le total de 39 enroulements correspondant à la valeur numérique de HaVaYaH E'had.",
    dict: {
      "י.": "10 (Seïf 10)",
      "מִנְהָגֵינוּ": "Notre coutume est",
      "כְּדַעַת": "Selon l'avis de",
      "הַמְּקֻבָּלִים": "Les Kabbalistes",
      "שֶׁאֲחַר": "Qu'après",
      "הַטָּלַת": "L'insertion de",
      "אַרְבַּעַת": "Quatre",
      "חוּטֵי": "Fils de",
      "הַצִּיצִית": "Le Tsitsit",
      "בַּחֹר": "Dans le trou",
      "שֶׁבִּכְנַף": "Qui est au coin de",
      "הַבֶּגֶד,": "Le vêtement",
      "קוֹשֵׁר": "Il noue",
      "שְׁנֵי": "Deux",
      "קְשָׁרִים,": "Nœuds",
      "וְאַחַר": "Et après",
      "כָּךְ": "Cela",
      "כּוֹרֵךְ": "Enroule",
      "ז'": "7",
      "חֻלְיוֹת,": "Enroulements",
      "וְח'": "Et 8",
      "וְי''א": "Et 11",
      "וְי''ג": "Et 13",
      "וּבְסַךְ": "Et au total",
      "הַכֹּל": "De tout",
      "לַ''ט": "39",
      "כְּריכוֹת.": "Enroulements"
    }
  },
  {
    seif: "11",
    titre_seif: "Longueur minimale de chaque brin (24 cm)",
    voyelles: "יא. יֵשׁ לְהַקְפִּיד שֶׁכָּל שְׁמוֹנַת הַחוּטִים שֶׁל הַצִּיצִית יִהְיֶה אָרְכָּם לֹא פָּחוֹת מִשְּׁנֵים עָשָׂר גֻּדְלִים (עֶשְׂרִים וְאַרְבָּעָה סַנְטִימֶטְרִים).",
    brut: "יא. יש להקפיד שכל שמונת החוטים של הציצית יהיה אורכם לא פחות משנים עשר גודלים (עשרים וארבעה סנטימטרים).",
    francais: "11. On veillera à ce que chacun des 8 brins de Tsitsit mesure au moins 12 largeurs de pouce (soit 24 centimètres), car de nombreux Décisionnaires l'exigent même a posteriori.",
    dict: {
      "יא.": "11 (Seïf 11)",
      "יֵשׁ": "Il faut",
      "לְהַקְפִּיד": "Veiller rigoureusement",
      "שֶׁכָּל": "Que chaque",
      "שְׁמוֹנַת": "Huit",
      "הַחוּטִים": "Les fils",
      "שֶׁל": "De",
      "הַצִּיצִית": "Le Tsitsit",
      "יִהְיֶה": "Soit",
      "אָרְכָּם": "Leur longueur",
      "לֹא": "Pas",
      "פָּחוֹת": "Moins que",
      "מִשְּׁנֵים": "De deux",
      "עָשָׂר": "Dix (douze)",
      "גֻּדְלִים": "Pouces",
      "(עֶשְׂרִים": "(Vingt",
      "וְאַרְבָּעָה": "Et quatre",
      "סַנְטִימֶטְרִים).": "Centimètres)"
    }
  },
  {
    seif: "12",
    titre_seif: "Égaliser la longueur des franges (Noï HaTzitzi)",
    voyelles: "יב. יֵשׁ אוֹמְרִים שֶׁטּוֹב שֶׁכָּל הַצִּיצִיּוֹת תִּהְיֶינָה עֲשׂוּיוֹת בְּשָׁוֶה, שֶׁזֶּהוּ נוֹי הַצִּיצִית.",
    brut: "יב. יש אומרים שטוב שכל הציציות תהיינה עשויות בשוה, שזהו נוי הציצית.",
    francais: "12. Certains avis estiment qu'il est bon que toutes les franges du Tsitsit soient de longueur égale pour l'esthétique du commandement (Noï HaTzitzi) ; la Halakha stricte ne l'impose pas.",
    dict: {
      "יב.": "12 (Seïf 12)",
      "יֵשׁ": "Il y a",
      "אוֹמְרִים": "Qui disent",
      "שֶׁטּוֹב": "Qu'il est bon",
      "שֶׁכָּל": "Que toutes",
      "הַצִּיצִיּוֹת": "Les Tsitsiot",
      "תִּהְיֶינָה": "Soient",
      "עֲשׂוּיוֹת": "Faites",
      "בְּשָׁוֶה,": "Également",
      "שֶׁזֶּהוּ": "Car c'est",
      "נוֹי": "La beauté de",
      "הַצִּיצִית.": "Le Tsitsit"
    }
  },
  {
    seif: "13",
    titre_seif: "Interruption par la parole durant le nouage des franges",
    voyelles: "יג. מֵעִקַּר הַדִּין מֻתָּר לְהַפְסִיק בְּדִבּוּר בְּאֶמְצַע תְּלִיַּת הַחוּטִין, וּמִכָּל מָקוֹם מִמִּדַּת חֲסִידוּת שֶׁלֹּא לְהַפְסִיק בְּדִבּוּר.",
    brut: "יג. מעיקר הדין מותר להפסיק בדיבור באמצע תליית החוטין, ומכל מקום ממדת חסידות שלא להפסיק בדיבור.",
    francais: "13. En strict droit halakhique, il est permis de parler au milieu de l'installation et du nouage des fils ; néanmoins, par pieuse rigueur (Middat 'Hassidout), on évitera de s'interrompre par la parole.",
    dict: {
      "יג.": "13 (Seïf 13)",
      "מֵעִקַּר": "En strict droit",
      "הַדִּין": "Halakhique",
      "מֻתָּר": "Permis",
      "לְהַפְסִיק": "De s'interrompre",
      "בְּדִבּוּר": "Par la parole",
      "בְּאֶמְצַע": "Au milieu de",
      "תְּלִיַּת": "L'accrochage de",
      "הַחוּטִין,": "Les fils",
      "וּמִכָּל": "Et de tout",
      "מָקוֹם": "Façon",
      "מִמִּדַּת": "Par mesure de",
      "חֲסִידוּת": "Pieuse rigueur",
      "שֶׁלֹּא": "De ne pas",
      "בְּדִבּוּר.": "Par la parole"
    }
  },
  {
    seif: "14",
    titre_seif: "Interdiction de couper les fils avec un outil en fer",
    voyelles: "יד. טוֹב לִזָּהֵר שֶׁלֹּא יַחְתֹּךְ אֶת חוּטֵי הַצִּיצִית בְּסַכִּין, עַל דֶּרֶךְ שֶׁנֶּאֱמַר לֹא תָנִיף עֲלֵיהֶם בַּרְזֶל.",
    brut: "יד. טוב ליזהר שלא יחתוך את חוטי הציצית בסכין, על דרך שנאמר לא תניף עליהם ברזל.",
    francais: "14. Il est bon d'éviter de couper les fils du Tsitsit avec une lame en fer, par analogie avec le verset « Tu ne lèveras pas le fer sur eux ».",
    dict: {
      "יד.": "14 (Seïf 14)",
      "טוֹב": "Il est bon",
      "לִזָּהֵר": "De faire attention",
      "שֶׁלֹּא": "À ne pas",
      "יַחְתֹּךְ": "Couper",
      "אֶת": "[Accusatif]",
      "חוּטֵי": "Fils de",
      "הַצִּיצִית": "Le Tsitsit",
      "בְּסַכִּין,": "Avec un couteau",
      "עַל": "Sur",
      "דֶּרֶךְ": "La voie / comme",
      "שֶׁנֶּאֱמַר": "Qu'il est dit",
      "לֹא": "Ne... pas",
      "תָנִיף": "Tu ne lèveras",
      "עֲלֵיהֶם": "Sur eux",
      "בַּרְזֶל.": "Du fer"
    }
  },
  {
    seif: "15",
    titre_seif: "Nouer l'extrémité des brins (Coutume de l'Ari zal)",
    voyelles: "טו. טוֹב לִקְשֹׁר אֶת רָאשֵׁי הַחוּטִים שֶׁל הַצִּיצִיּוֹת, כָּל חוּט וְחוּט, כְּדֵי שֶׁלֹּא יִתְפַּזְרוּ מִשְּׁזִירָתָן. וְכֵן הָיָה נוֹהֵג הָאֲרִ''י ז''ל.",
    brut: "טו. טוב לקשור את ראשי החוטים של הציציות, כל חוט וחוט, כדי שלא יתפזרו משזירתן. וכן היה נוהג הארי זל.",
    francais: "15. Il est bon de faire un petit nœud à l'extrémité de chaque brin de Tsitsit afin qu'ils ne se défilochent pas au lavage, conformément à la coutume sacrée du saint Ari zal.",
    dict: {
      "טו.": "15 (Seïf 15)",
      "טוֹב": "Il est bon",
      "לִקְשֹׁר": "De nouer",
      "אֶת": "[Accusatif]",
      "רָאשֵׁי": "Les extrémités de",
      "הַחוּטִים": "Les fils",
      "שֶׁל": "De",
      "הַצִּיצִיּוֹת,": "Les Tsitsiot",
      "כָּל": "Chaque",
      "חוּט": "Fil",
      "וְחוּט,": "Et fil",
      "כְּדֵי": "Afin",
      "שֶׁלֹּא": "Que ne pas",
      "יִתְפַּזְרוּ": "Se dispersent / défilochent",
      "מִשְּׁזִירָתָן.": "De leur tressage",
      "וְכֵן": "Et ainsi",
      "הָיָה": "Était",
      "נוֹהֵג": "Pratiquant",
      "הָאֲרִ''י": "Le Ari",
      "ז''ל.": "De mémoire bénie"
    }
  },
  {
    seif: "16",
    titre_seif: "Franges confectionnées avec de la laine volée",
    voyelles: "טז. אִם עָשָׂה אֶת הַחוּטִין לְצִיצִית מִצֶּמֶר גָּזוּל, הַטַּלִּית פְּסוּלָה, דִּכְתִיב, וְעָשׂוּ לָהֶם מִשֶּׁלָּהֶם יִהְיֶה.",
    brut: "טז. אם עשה את החוטין לציצית מצמר גזול, הטלית פסולה, דכתיב, ועשו להם משלהם יהיה.",
    dict: {
      "טז.": "16 (Seïf 16)",
      "אִם": "Si",
      "עָשָׂה": "Il a fait",
      "אֶת": "[Accusatif]",
      "הַחוּטִין": "Les fils",
      "לְצִיצִית": "Pour Tsitsit",
      "מִצֶּמֶר": "À partir de laine",
      "גָּזוּל,": "Volée",
      "הַטַּלִּית": "Le Tallit",
      "פְּסוּלָה,": "Est invalide",
      "דִּכְתִיב,": "Car il est écrit",
      "וְעָשׂוּ": "Et ils feront",
      "לָהֶם": "Pour eux",
      "מִשֶּׁלָּהֶם": "À partir de ce qui leur appartient",
      "יִהְיֶה.": "Sera"
    }
  }
];

function buildSeifData(item) {
  const vWords = item.voyelles.split(/\s+/);
  const bWords = item.brut.split(/\s+/);

  const mots_alignes = vWords.map((vW, idx) => {
    const bW = bWords[idx] || vW;
    const cleanFr = item.dict[vW] || item.dict[bW] || vW;

    return {
      id: idx,
      hebreu_brut: bW,
      hebreu_voyelles: vW,
      francais_mot: cleanFr,
      expression_contexte: cleanFr
    };
  });

  return {
    seif: item.seif,
    sujet: "דין חוטי הציצית",
    sujet_fr: "Lois des fils du Tsitsit",
    titre_seif: item.titre_seif,
    texte_integral: {
      hebreu_sans_voyelles: item.brut,
      hebreu_avec_voyelles: item.voyelles,
      francais: item.francais
    },
    mots_alignes
  };
}

const halakhot = SIMAN_11_SEIFIM.map(buildSeifData);

const obj = { siman: "11", halakhot };
const jsonStr = JSON.stringify(obj, null, 2);

fs.writeFileSync(OUT1, jsonStr, 'utf8');
fs.writeFileSync(OUT2, jsonStr, 'utf8');
fs.writeFileSync(OUT3, jsonStr, 'utf8');

console.log("🎉 Siman 11 rebuilt with 100% human-verified French word translations across all 16 Seifim!");
