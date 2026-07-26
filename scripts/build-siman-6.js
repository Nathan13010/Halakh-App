import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const OUTPUT_SHABBAT = path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', 'siman_6.json');
const OUTPUT_DATA_SIMAN = path.join(ROOT, 'public', 'data', 'siman_6.json');
const OUTPUT_DATA_YALKOUT = path.join(ROOT, 'public', 'data', 'yalkout-6.json');

const rawSeifim = [
  {
    seif: "1",
    brut: "א. אחר עשיית צרכיו, גדולים או קטנים, צריך ליטול ידיו ולברך אשר יצר וכו'. ויתבונן בחכמה הנפלאה של הקדוש ברוך הוא שבה נעשה האדם על כל מערכותיו הגופניות, המורכבות מתאים רבים, וכל תא פועל באופן מדוייק, ויש תאים רבים המגינים על הגוף מאלפי חיידקים הנכנסים לגוף בכל רגע, ועל כל זה יש להודות להקדוש ברוך הוא בשמחה על הטובה הזו. ומודה על מערכת העיכול שבגופו, שהיא המצילתו מכל מיני חולאים וגורמת לו שיחיה. ומזכירים בברכה זו לפני כסא כבודך, להוציא מדעת הכופרים האומרים שהקדוש ברוך הוא לא משגיח על העולם השפל. ומפליא לעשות, במה ששומר רוח האדם בקרבו וקושר דבר רוחני בדבר גשמי, וזאת בזכות שהוא רופא כל בשר, כי אז האדם בקו הבריאות ונשמתו משתמרת בקרבו.",
    voyelles: "א. אַחַר עֲשִׂיַּת צְרָכָיו, גְּדוֹלִים אוֹ קְטַנִּים, צָרִיךְ לִטֹּל יָדָיו וּלְבָרֵךְ אֲשֶׁר יָצַר וְכוּ'. וְיִתְבּוֹנֵן בַּחָכְמָה הַנִּפְלָאָה שֶׁל הַקָּדוֹשׁ בָּרוּךְ הוּא שֶׁבָּהּ נַעֲשָׂה הָאָדָם עַל כָּל מַעַרְכוֹתָיו הַגּוּפָנִיּוֹת, הַמֻּרְכָּבוֹת מִתָּאִים רַבִּים, וְכָל תָּא פּוֹעֵל בְּאֹפֶן מְדֻיָּק, וְיֵשׁ תָּאִים רַבִּים הַמְּגִנִּים עַל הַגּוּף מֵאַלְפֵי חַיְדַקִּים הַנִּכְנָסִים לַגּוּף בְּכָל רֶגַע, וְעַל כָּל זֶה יֵשׁ לְהוֹדוֹת לַהַקָּדוֹשׁ בָּרוּךְ הוּא בְּשִׂמְחָה עַל הַטּוֹבָה הַזֹּאת. וּמוֹדֶה עַל מַעֲרֶכֶת הָעִכּוּל שֶׁבְּגוּפוֹ, שֶׁהִיא הַמַּצִּילָתוֹ מִכָּל מִינֵי חוֹלָאִים וְגוֹרֶמֶת לוֹ שֶׁיִּחְיֶה. וּמַזְכִּירִים בִּבְרָכָה זוֹ לִפְנֵי כִּסֵּא כְבוֹדֶךָ, לְהוֹצִיא מִדַּעַת הַכּוֹפְרִים הָאוֹמְרִים שֶׁהַקָּדוֹשׁ בָּרוּךְ הוּא לֹא מַשְׁגִּיחַ עַל הָעוֹלָם הַשָּׁפָל. וּמַפְלִיא לַעֲשׂוֹת, בַּמֶּה שֶׁשּׁוֹמֵר רוּחַ הָאָדָם בְּקִרְבּוֹ וְקוֹשֵׁר דָּבָר רוּחָנִי בְּדָבָר גַּשְׁמִי, וְזֹאת בִּזְכוּת שֶׁהוּא רוֹפֵא כָל בָּשָׂר, כִּי אָז הָאָדָם בְּקַו הַבְּרִיאוּת וְנִשְׁמָתוֹ מִשְׁתַּמֶּרֶת בְּקִרְבּוֹ.",
    francais: "1. Après avoir satisfait ses besoins naturels (grands ou petits), il faut se laver les mains et réciter la bénédiction Asher Yatsar. On réfléchira à la sagesse merveilleuse du Saint béni soit-Il par laquelle l'homme a été façonné avec tous ses systèmes corporels composés de nombreuses cellules, où chaque cellule fonctionne avec une précision absolue, et de nombreuses cellules protègent l'organisme contre des milliers de bactéries. Il convient de remercier le Saint béni soit-Il avec joie pour ce bienfait. Il rendra grâce pour le système digestif qui le préserve des maladies et lui permet de vivre. On mentionne 'devant le Trône de Ta Gloire' pour réfuter l'opinion des hérétiques qui prétendent que D.ieu ne veille pas sur le monde d'ici-bas. Et Il accomplit des merveilles en préservant l'esprit de l'homme en lui et en liant une entité spirituelle à un corps matériel, car Il est le Guérisseur de toute chair."
  },
  {
    seif: "2",
    brut: "ב. כבר נתבאר לעיל שאין צריך כלי לנטילה זו, אלא יוכל ליטול מהברז. ומכל מקום יטול ג' פעמים. והמחמיר ליטול מכלי, תבוא עליו ברכה.",
    voyelles: "ב. כְּבָר נִתְבָּאֵר לְעֵיל שֶׁאֵין צָרִיךְ כְּלִי לִנְטִילָה זוֹ, אֶלָּא יוּכַל לִטֹּל מֵהַבֶּרֶז. וּמִכָּל מָקוֹם יִטֹּל ג' פְּעָמִים. וְהַמַּחְמִיר לִטֹּל מִכְּלִי, תָּבֹוא עָלָיו בְּרָכָה.",
    francais: "2. Il a déjà été expliqué précédemment qu'il n'est pas obligatoire d'utiliser un récipient pour cette ablution ; on peut verser l'eau directement du robinet. Néanmoins, on versera de l'eau trois fois sur les mains. Et celui qui est rigoureux et utilise un récipient sera béni."
  },
  {
    seif: "3",
    brut: "ג. גם הנשים חייבות בברכת אשר יצר שנתקנה על ידי אנשי כנסת הגדולה. וכן יש לחנך את הקטנים שיטלו ידיהם אחר שעשו צרכיהם, ויברכו ברכת אשר יצר. ועל הנשים ללמוד ברכה זו בעל פה, כי היא צריכה מאד, ונעשה בה תיקון גדול, וכל אדם צריך להבין את פירוש הפשטי של נוסח הברכה, שידע מה הוא אומר.",
    voyelles: "ג. גַּם הַנָּשִׁים חַיָּבוֹת בִּבְרַכַּת אֲשֶׁר יָצַר שֶׁנִּתְקְנָה עַל יְדֵי אַנְשֵׁי כְּנֶסֶת הַגְּדוֹלָה. וְכֵן יֵשׁ לְחַנֵּךְ אֶת הַקְּטַנִּים שֶׁיִּטְלוּ יְדֵיהֶם אַחַר שֶׁעָשׂוּ צְרָכֵיהֶם, וִיבָרְכוּ בִּרְכַּת אֲשֶׁר יָצַר. וְעַל הַנָּשִׁים לִלְמֹד בְּרָכָה זוֹ בְּעַל פֶּה, כִּי הִיא צְרִיכָה מְאֹד, וְנַעֲשָׂה בָּהּ תִּקּוּן גָּדוֹל, וְכָל אָדָם צָרִיךְ לְהָבִין אֶת פֵּרוּשׁ הַפַּשְׁטִי שֶׁל נֻסַּח הַבְּרָכָה, שֶׁיֵּדַע מָה הוּא אוֹמֵר.",
    francais: "3. Les femmes aussi sont tenues de réciter la bénédiction Asher Yatsar instituée par les Hommes de la Grande Assemblée. De même, il faut éduquer les enfants à se laver les mains et à réciter Asher Yatsar après avoir satisfait leurs besoins. Il incombe aux femmes d'apprendre cette bénédiction par cœur car elle est essentielle. Chaque personne doit comprendre le sens littéral des mots afin de savoir ce qu'elle dit."
  },
  {
    seif: "4",
    brut: "ד. העושה צרכיו, בין גדולים בין קטנים, ושכח לברך מיד ברכת ''אשר יצר'', אם נזכר תוך שיעור פרסה, יברך אשר יצר, ואאם לאו לא יברך. והשומע ברכת אשר יצר מחבירו המברך לאחר שיעור פרסה, לא יענה אחריו, מספק אמן יתומה. ואאם נתעורר שוב לנקביו בתוך השיעור הנ''ל לא יברך ''אשר יצר'' עד לאחר שיסך רגליו.",
    voyelles: "ד. הָעוֹשֶׂה צְרָכָיו, בֵּין גְּדוֹלִים בֵּין קְטַנִּים, וְשָׁכַח לְבָרֵךְ מִיָּד בִּרְכַּת ''אֲשֶׁר יָצַר'', אִם נִזְכַּר תּוֹךְ שִׁעוּר פַּרְסָה, יְבָרֵךְ אֲשֶׁר יָצַר, וְאִם לָאו לֹא יְבָרֵךְ. וְהַשּׁוֹמֵעַ בִּרְכַּת אֲשֶׁר יָצַר מֵחֲבֵרוֹ הַמְּבָרֵךְ לְאַחַר שִׁעוּר פַּרְסָה, לֹא יַעֲנֶה אַחֲרָיו, מִסָּפֵק אָמֵן יְתוֹמָה. וְאִם נִתְעוֹרֵר שׁוּב לִנְקָבָיו בְּתוֹךְ הַשִּׁעוּר הַנִּזְכָּר לְעֵיל לֹא יְבָרֵךְ ''אֲשֶׁר יָצַר'' עַד לְאַחַר שֶׁיָּסֵךְ רַגְלָיו.",
    francais: "4. Celui qui a fait ses besoins et qui a oublié de réciter immédiatement Asher Yatsar : s'il s'en rappelle dans l'intervalle d'une parassa (72 minutes), il la récitera ; sinon, il ne la récitera pas. Celui qui entend un ami réciter Asher Yatsar après ce délai de 72 minutes ne répondra pas 'Amen' après lui. S'il ressent à nouveau le besoin d'aller aux toilettes durant ce délai, il ne récitera pas Asher Yatsar avant d'avoir à nouveau satisfait ses besoins."
  },
  {
    seif: "5",
    brut: "ה. מי שהוצרך לנקביו ואאם יברך אשר יצר יפסיד תפלה בצבור, ואאם יניח את הברכה לאחר התפלה, יש לחוש שמא ישכח מלברך, יברך עכשו אשר יצר, ואחר כך יזדרז להתפלל עם הצבור, ואאם יצטרך, ידלג כמה מהמזמורים, כדי שיוכל להספיק להתפלל בצבור. אך אם נותן סימן ולא ישכח מלברך אחר התפלה, וגם לא יעברו ע''ב דקות, עדיף שיניח את ברכת אשר יצר לאחר התפלה, ויתפלל כסדר בלא דילוגים.",
    voyelles: "ה. מִי שֶׁהֻצְרַךְ לִנְקָבָיו וְאִם יְבָרֵךְ אֲשֶׁר יָצַר יַפְסִיד תְּפִלָּה בְּצִבּוּר, וְאִם יַנִּיחַ אֶת הַבְּרָכָה לְאַחַר הַתְּפִלָּה, יֵשׁ לָחוּשׁ שֶׁמָּא יִשְׁכַּח מִלְּבָרֵךְ, יְבָרֵךְ עַכְשָׁו אֲשֶׁר יָצַר, וְאַחַר כָּךְ יִזְדָּרֵז לְהִתְפַּלֵּל עִם הַצִּבּוּר, וְאִם יִצְטָרֵךְ, יְדַלֵּג כַּמָּה מֵהַמִּזְמוֹרִים, כְּדֵי שֶׁיּוּכַל לְהַסְפִּיק לְהִתְפַּלֵּל בְּצִבּוּר. אַךְ אִם נוֹתֵן סִימָן וְלֹא יִשְׁכַּח מִלְּבָרֵךְ אַחַר הַתְּפִלָּה, וְגַם לֹא יַעַבְרוּ 72 דַּקּוֹת, עָדִיף שֶׁיַּנִּיחַ אֶת בִּרְכַּת אֲשֶׁר יָצַר לְאַחַר הַתְּפִלָּה, וְיִתְפַּלֵּל כְּסֵדֶר בְּלֹא דִּלּוּגִים.",
    francais: "5. Quelqu'un qui avait besoin d'aller aux toilettes : s'il récite Asher Yatsar maintenant et qu'il risque de rater la prière en communauté (Minyan), mais qu'il craint d'oublier de réciter la bénédiction après la prière, il récitera Asher Yatsar tout de suite puis se hâtera de prier avec la communauté. Cependant, s'il se met un pense-bête et qu'il ne risque pas d'oublier et que les 72 minutes ne passeront pas, il vaut mieux qu'il reporte Asher Yatsar après la prière afin de prier dans l'ordre sans sauter de psaumes."
  },
  {
    seif: "6",
    brut: "ו. בברכת אשר יצר יש הנוהגים לומר ''אֵי אפשר'' א' בצירי, ויש הנוהגים לומר אִי אפשר, הא' בניקוד חיריק, ואין הכרע בדבר, ומי שאומר בניקוד חיריק יש לו על מה לסמוך, וכן מי שאומר בניקוד צירי יש לו על מה לסמוך.",
    voyelles: "ו. בְּבִרְכַּת אֲשֶׁר יָצַר יֵשׁ הַנּוֹהֲגִים לֵאמֹר ''אֵי אֶפְשָׁר'' א' בְּצֵירֵי, וְיֵשׁ הַנּוֹהֲגִים לֵאמֹר אִי אֶפְשָׁר, הָא' בִּנִקּוּד חִירִיק, וְאֵין הַכְרָע בַּדָּבָר, וּמִי שֶׁאוֹמֵר בִּנִקּוּד חִירִיק יֵשׁ לוֹ עַל מָה לִסְמֹךְ, וְכֵן מִי שֶׁאוֹמֵר בִּנִקּוּד צֵירֵי יֵשׁ לוֹ עַל מָה לִסְמֹךְ.",
    francais: "6. Dans la bénédiction Asher Yatsar, certains ont pour coutume de dire 'Ei Efshar' (avec la voyelle Tséré sous la lettre Aleph), tandis que d'autres dicen 'Ii Efshar' (avec la voyelle 'Hiriq). Il n'y a pas de tranchant absolu sur cette question, et les deux coutumes s'appuient sur des autorités halakhiques valides."
  },
  {
    seif: "7",
    brut: "ז. מנהגינו לומר ''אפילו שעה אחת''. והטעם לזה, שגבול יש לאדם שיכולים נקביו ליסתם ולא ימות, וכיון שעבר אותו גבול אי אפשר להתקיים יותר אפילו שעה אחת. ועוד, שהרי יש איברים שאם נפתחים או נסתמים אי אפשר להתקיים שעה אחת. ואין לשנות מן המנהג.",
    voyelles: "ז. מִנְהָגֵנוּ לֵאמֹר ''אֲפִילוּ שָׁעָה אַחַת''. וְהַטַּעַם לָזֶה, שֶׁגְּבוּל יֵשׁ לָאָדָם שֶׁיְּכוֹלִים נְקָבָיו לְהִסָּתֵם וְלֹא יָמוּת, וְכֵיוָן שֶׁעָבַר אוֹתוֹ גְּבוּל אֵין אֶפְשָׁר לְהִתְקַיֵּם יוֹתֵר אֲפִילוּ שָׁעָה אַחַת. וְעוֹד, שֶׁהֲרֵי יֵשׁ אֵבָרִים שֶׁאִם נִפְתָּחִים אוֹ נִסְתָּמִים אֵין אֶפְשָׁר לְהִתְקַיֵּם שָׁעָה אַחַת. וְאֵין לַשֲׁנוֹת מִן הַמִּנְהָג.",
    francais: "7. Notre coutume est de réciter la formule 'Afilou sha'ah e'hat' (pas même une seule heure). La raison est qu'il existe une limite physique qu'un homme peut supporter sans mourir si ses conduits se bouchent. De plus, certains organes vitaux entraînent la mort immédiate s'ils se bouchent ou s'ouvrent anormalement. Il ne faut pas modifier cette coutume."
  },
  {
    seif: "8",
    brut: "ח. מנהגינו לחתום ''רופא כל בשר ומפליא לעשות'', וכן הוא הגירסא בגמרא ובהרי''ף והרמב''ם. ויש גורסים: ''רופא חולי כל בשר'', אך אין לשנות מהמנהג.",
    voyelles: "ח. מִנְהָגֵנוּ לַחְתֹּם ''רוֹפֵא כָל בָּשָׂר וּמַפְלִיא לַעֲשׂוֹת'', וְכֵן הוּא הַגִּרְסָא בַּגְּמָרָא וּבָרִי''ף וְהָרַמְבַּ''ם. וְיֵשׁ גּוֹרְסִים: ''רוֹפֵא חוֹלֵי כָל בָּשָׂר'', אַךְ אֵין לַשֲׁנוֹת מֵהַמִּנְהָג.",
    francais: "8. Notre coutume est de conclure la bénédiction par la formule 'Rofeh kol basar oumafli la'assot' (Guérisseur de toute chair et accomplit des merveilles), conformément à la version de la Gemara, du Rif et du Rambam. Bien que certains ajoutent le mot 'Holei' ('Rofeh holei kol basar'), il ne faut pas déroger à notre coutume."
  },
  {
    seif: "9",
    brut: "ט. מי שטעה ולא סיים בברכת אשר יצר ''ומפליא לעשות'' אינו חוזר לברך, דספק ברכות להקל.",
    voyelles: "ט. מִי שֶׁטָּעָה וְלֹא סִיֵּם בִּבְרַכַּת אֲשֶׁר יָצַר ''וּמַפְלִיא לַעֲשׂוֹת'' אֵינוֹ חוֹזֵר לְבָרֵךְ, דִּסְפֵק בְּרָכוֹת לְהָקֵל.",
    francais: "9. Quelqu'un qui s'est trompé et a oublié de conclure par les mots 'oumafli la'assot' ne recommence pas la bénédiction, selon le principe 'Safek berakhot lehakel' (en cas de doute sur une bénédiction, on est souple et on ne récite pas)."
  },
  {
    seif: "10",
    brut: "י. ראוי ונכון שלא ינגב את ידיו בעת שמברך אשר יצר, שאין להתעסק בשום עסק באמצע ברכה שאדם מברך. ובפרט במי שיודע שיכוין יותר אם יברך אחר הניגוב, שיש לו להמתין מלברך עד אחר שינגב ידיו.",
    voyelles: "י. רָאוּי וְנָכוֹן שֶׁלֹּא יְנַגֵּב אֶת יָדָיו בְּעֵת שֶׁמְּבָרֵךְ אֲשֶׁר יָצַר, שֶׁאֵין לְהִתְעַסֵּק בְּשׁוּם עֵסֶק בְּאֶמְצַע בְּרָכָה שֶׁאָדָם מְבָרֵךְ. וּבִפְרָט בְּמִי שֶׁיּוֹדֵעַ שֶׁיְּכַוֵּן יוֹתֵר אִם יְבָרֵךְ אַחַר הַנִּגּוּב, שֶׁיֵּשׁ לוֹ לְהַמְתִּין מִלְּבָרֵךְ עַד אַחַר שֶׁיְּנַגֵּב יָדָיו.",
    francais: "10. Il est digne et approprié de ne pas s'essuyer les mains tout en récitant la bénédiction Asher Yatsar, car on ne doit faire aucune activité au milieu d'une bénédiction. En particulier pour celui qui sait qu'il aura une meilleure intention s'il récite la bénédiction après s'être essuyé les mains."
  },
  {
    seif: "11",
    brut: "יא. מי שהוצרך לנקביו, ואחר שהתפנה בירך ברכת אשר יצר, ואחר כך חבירו הוצרך לנקביו ומבקש שיחזור לברך ברכת אשר יצר כדי להוציאו ידי חובה, אין אומרים כלל זה בברכות השבח.",
    voyelles: "יא. מִי שֶׁהֻצְרַךְ לִנְקָבָיו, וְאַחַר שֶׁהִתְפַּנָּה בֵּרֵךְ בִּרְכַּת אֲשֶׁר יָצַר, וְאַחַר כָּךְ חֲבֵרוֹ הֻצְרַךְ לִנְקָבָיו וּמְבַקֵּשׁ שֶׁיַּחֲזֹר לְבָרֵךְ בִּרְכַּת אֲשֶׁר יָצַר כְּדֵי לְהוֹצִיאוֹ יְדֵי חוֹבָה, אֵין אוֹמְרִים כְּלָל זֶה בִּבְרָכוֹת הַשֶּׁבַח.",
    francais: "11. Quelqu'un qui a déjà récité la bénédiction Asher Yatsar pour lui-même ne peut pas la répéter afin d'acquitter un ami qui sort à son tour des toilettes, car le principe d'acquitter autrui ne s'applique pas aux bénédictions de louange individuelle."
  },
  {
    seif: "12",
    brut: "יב. מי ששכח לברך אשר יצר קודם התפלה, יברך אחר התפלה, והוא שלא יעבור זמן שיעור מהלך פרסה, שהוא שבעים ושתים דקות.",
    voyelles: "יב. מִי שֶׁשָּׁכַח לְבָרֵךְ אֲשֶׁר יָצַר קֹדֶם הַתְּפִלָּה, יְבָרֵךְ אַחַר הַתְּפִלָּה, וְהוּא שֶׁלֹּא יַעֲבֹר זְמַן שִׁעוּר מַהֲלַךְ פַּרְסָה, שֶׁהוּא 72 דַּקּוֹת.",
    francais: "12. Si quelqu'un a oublié de réciter Asher Yatsar avant d'entamer la prière, il la récitera immédiatement après la prière, à condition que le délai de 72 minutes depuis la sortie des toilettes n'ait pas expiré."
  },
  {
    seif: "13",
    brut: "יג. הקם בבוקר ומרגיש שצריך מאד לנקביו, אין לו להחמיר על עצמו ולשהות עד שיטול ידיו, אלא יפנה קודם שיטול ידיו. אך יזהר שלא יגע באבריו עד שיטול ידיו. ומעיקר הדין מותר לו לילך לבית הכסא לעשיית צרכיו, ורק אחר כך ליטול ידיו שחרית.",
    voyelles: "יג. הַקָּם בַּבֹּקֶר וּמַרְגִּישׁ שֶׁצָּרִיךְ מְאֹד לִנְקָבָיו, אֵין לוֹ לְהַחְמִיר עַל עַצְמוֹ וְלִשְׁהוֹת עַד שֶׁיִּטֹּל יָדָיו, אֶלָּא יִפְנֶה קֹדֶם שֶׁיִּטֹּל יָדָיו. אַךְ יִזָּהֵר שֶׁלֹּא יִגַּע בְּאֵבָרָיו עַד שֶׁיִּטֹּל יָדָיו. וּמֵעִקַּר הַדִּין מוּתָּר לוֹ לֵילֵךְ לְבֵית הַכִּסֵּא לַעֲשִׂיַּת צְרָכָיו, וְרַק אַחַר כָּךְ לִטֹּל יָדָיו שַׁחֲרִית.",
    francais: "13. Celui qui se réveille le matin et ressent un besoin pressant d'aller aux toilettes ne doit pas retarder son besoin pour se laver les mains d'abord : il ira aux toilettes directement, puis se lavera les mains. Il veillera seulement à ne pas toucher les ouvertures du corps avant l'ablution."
  },
  {
    seif: "14",
    brut: "יד. מי שניעור בלילה לעשות צרכיו ודעתו לחזור מיד ולישון, אם חוזר לישן באופן שיש לחוש שיעבור זמן כדי שיוכל לברך אשר יצר, יטול ידיו כדי לברך אשר יצר. בשעת הדחק כזו יוכל לנקות ידיו במידי דמנקי, כדי לברך אשר יצר.",
    voyelles: "יד. מִי שֶׁנֵּעוֹר בַּלַּיְלָה לַעֲשׂוֹת צְרָכָיו וְדַעְתּוֹ לַחֲזֹר מִיָּד וְלִישֹׁן, אִם חוֹזֵר לִישֹׁן בְּאֹפֶן שֶׁיֵּשׁ לָחוּשׁ שֶׁיַּעֲבֹר זְמַן כְּדֵי שֶׁיּוּכַל לְבָרֵךְ אֲשֶׁר יָצַר, יִטֹּל יָדָיו כְּדֵי לְבָרֵךְ אֲשֶׁר יָצַר. בִּשְׁעַת הַדְּחָק כָּזוֹ יוּכַל לְנַקּוֹת יָדָיו בְּמִידֵי דִּמְנַקֵּי, כְּדֵי לְבָרֵךְ אֲשֶׁר יָצַר.",
    francais: "14. Quelqu'un qui se réveille la nuit pour aller aux toilettes et souhaite se rendormir : s'il craint de dépasser le délai de 72 minutes en dormant, il se lavera les mains et récitera Asher Yatsar avant de se rendormir. En cas de force majeure, il pourra se frotter les mains sur un tissu pour pouvoir réciter la bénédiction."
  },
  {
    seif: "15",
    brut: "טו. הנפנה לצרכיו ויצא מבית הכסא, וקודם שנטל ידיו שמע קדיש או קדושה, ישפשף ידיו במידי דמנקי, או בבגדו, ויענה אמן וקדושה עם הצבור. וכן היוצא מבית הכסא וטרם שנטל ידיו ראה ברקים או שמע רעמים, יברך והגאם שעדיין לא נטל ידיו.",
    voyelles: "טו. הַנִּפְנֶה לִצְרָכָיו וְיָצָא מִבֵּית הַכִּסֵּא, וְקֹדֶם שֶׁנָּטַל יָדָיו שָׁמַע קַדִּישׁ אוֹ קְדוּשָׁה, יְשַׁפְשֵׁף יָדָיו בְּמִידֵי דִּמְנַקֵּי, אוֹ בְּבִגְדוֹ, וְיַעֲנֶה אָמֵן וּקְדוּשָׁה עִם הַצִּבּוּר. וְכֵן הַיּוֹצֵא מִבֵּית הַכִּסֵּא וְטֶרֶם שֶׁנָּטַל יָדָיו רָאָה בְּרָקִים אוֹ שָׁמַע רְעָמִים, יְבָרֵךְ אַף עַל פִּי שֶׁעֲדַיִן לֹא נָטַל יָדָיו.",
    francais: "15. Celui qui sort des toilettes et qui entend le Kaddish ou la Kedousha avant de s'être lavé les mains se frottera les mains sur son vêtement ou une lingette et répondra Amen avec la communauté. De même pour les bénédictions sur l'éclair ou le tonnerre."
  },
  {
    seif: "16",
    brut: "טז. מברכים בשחר כל ברכות השחר אף שלא נתחייב בהם, וכגון מי שהיה ניעור כל הלילה, מברך כל ברכות השחר, חוץ מברכת על נטילת ידים.",
    voyelles: "טז. מְבָרְכִים בַּשַּׁחַר כָּל בִּרְכוֹת הַשַּׁחַר אַף שֶׁלֹּא נִתְחַיֵּב בָּהֶם, וּכְגוֹן מִי שֶׁהָיָה נֵעוֹר כָּל הַלַּיְלָה, מְבָרֵךְ כָּל בִּרְכוֹת הַשַּׁחַר, חוּץ מִבִּרְכַּת עַל נְטִילַת יָדָיִם.",
    francais: "16. On récite le matin toutes les bénédictions du matin (Birkot HaSha'har) même si l'on n'a pas été directement soumis à leur événement (par exemple quelqu'un qui a veille toute la nuit récite toutes les bénédictions du matin, sauf l'ablution des mains qu'il accomplit sans bénédiction)."
  },
  {
    seif: "17",
    brut: "יז. ברכת ''אלהי נשמה'' באה להודות להשי''ת על בריאת הנשמה, ועל נתינתה וחזרתה לתוך הגוף. ובאה להזכיר לאדם את שבועתו אשר נשבע להקדוש ברוך הוא בירחי קדם, לשמור את נשמתו בטהרתה, ולא להכתימה בחטאים. ומעיקר הדין אין צריך להסמיך ברכה זו לברכת אשר יצר. ומכל מקום טוב ונכון לסמוך ברכת אלהי נשמה לברכת אשר יצר.",
    voyelles: "יז. בִּרְכַּת ''אֱלֹהַי נְשָׁמָה'' בָּאָה לְהוֹדוֹת לַהַשֵּׁם יִתְבָּרַךְ עַל בְּרִיאַת הַנְּשָׁמָה, וְעַל נְתִינָתָהּ וַחֲזָרָתָהּ לְתוֹךְ הַגּוּף. וּבָאָה לְהַזְכִּיר לָאָדָם אֶת שְׁבוּעָתוֹ אֲשֶׁר נִשְׁבַּע לַהַקָּדוֹשׁ בָּרוּךְ הוּא, לִשְׁמֹר אֶת נִשְׁמָתוֹ בְּטָהֳרָתָהּ, וְלֹא לְהַכְתִּימָהּ בַּחֲטָאִים. וּמֵעִקַּר הַדִּין אֵין צָרִיךְ לְהַסְמִיךְ בְּרָכָה זוֹ לִבְרַכַּת אֲשֶׁר יָצַר. וּמִכָּל מָקוֹם טוֹב וְנָכוֹן לְהַסְמִיךְ בִּרְכַּת אֱלֹהַי נְשָׁמָה לִבְרַכַּת אֲשֶׁר יָצַר.",
    francais: "17. La bénédiction 'Elohaï Neshaman' vient exprimer notre gratitude à D.ieu pour la création de l'âme, son don et son retour quotidien dans le corps. Elle rappelle à l'homme le serment de préserver la pureté de son âme sans la souiller par les fautes. Bien qu'il ne soit pas strictement obligatoire d'enchaîner cette bénédiction immédiatement après Asher Yatsar, il est bon et recommandé de les réciter à la suite."
  },
  {
    seif: "18",
    brut: "יח. יש נוהגים שאחר שבירך אחד ברכות השחר וענו אחריו אמן, חוזר אחד מהעונים אמן ומברך ועונים אחריו אמן, ואין לערער עליהם ולומר שכבר יצאו ידי חובת הברכות בעניית אמן, מפני שהמברך אינו מכוין להוציאם י''ח.",
    voyelles: "יח. יֵשׁ נוֹהֲגִים שֶׁאַחַר שֶׁבֵּרֵךְ אֶחָד בִּרְכוֹת הַשַּׁחַר וְעָנוּ אַחֲרָיו אָמֵן, חוֹזֵר אֶחָד מֵהָעוֹנִים אָמֵן וּמְבָרֵךְ וְעוֹנִים אַחֲרָיו אָמֵן, וְאֵין לְעַרְעֵר עֲלֵיהֶם וְלֹאמֹר שֶׁכְּבָר יָצְאוּ יְדֵי חוֹבַת הַבְּרָכוֹת בַּעֲנִיַּת אָמֵן, מִפְּנֵי שֶׁהַמְּבָרֵךְ אֵינוֹ מִתְכַּוֵּן לְהוֹצִיאָם יְדֵי חוֹבָה.",
    francais: "18. Certains ont pour coutume que lorsqu'une personne récite les bénédictions du matin et que les autres répondent Amen, chacun répète ensuite les bénédictions à son tour en répondant Amen. On ne remettra pas en cause ce fait sous prétexte qu'ils seraient déjà acquittés en répondant Amen, car le premier récitant n'avait pas l'intention d'acquitter l'assemblée."
  }
];

function cleanHeb(str) {
  return (str || '').replace(/[\u0591-\u05C7]/g, '').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"'׳״\u05F3\u05F4]/g, '').trim();
}

// Precision Word-by-Word Dictionary for Hebrew terms in Siman 6
const DICT = {
  "אחר": "Après",
  "עשיית": "l'accomplissement de",
  "צרכיו": "ses besoins (naturels)",
  "גדולים": "grands (défécation)",
  "או": "ou",
  "קטנים": "petits (miction)",
  "צריך": "il doit / il faut",
  "ליטול": "laver (verser l'eau sur)",
  "ידיו": "ses mains",
  "ולברך": "et bénir",
  "אשר": "qui / que",
  "יצר": "a formé / créé",
  "וכו": "etc.",
  "ויתבונן": "et il méditera",
  "בחכמה": "à la sagesse",
  "הנפלאה": "merveilleuse",
  "של": "de",
  "הקדוש": "le Saint",
  "ברוך": "béni soit",
  "הוא": "Il",
  "שבה": "par laquelle",
  "נעשה": "a été façonné / fait",
  "האדם": "l'homme",
  "על": "sur",
  "כל": "tous / toute",
  "מערכותיו": "ses systèmes (organes)",
  "הגופניות": "corporels",
  "המורכבות": "composés",
  "מתאים": "de cellules",
  "רבים": "nombreuses / multiples",
  "וכל": "et chaque",
  "תא": "cellule",
  "פועל": "fonctionne",
  "באופן": "de manière",
  "מדוייק": "précise",
  "מדויק": "précise",
  "ויש": "et il y a",
  "תאים": "des cellules",
  "המגינים": "qui protègent",
  "הגוף": "le corps",
  "מאלפי": "contre des milliers de",
  "חיידקים": "bactéries",
  "הנכנסים": "qui entrent",
  "לגוף": "dans le corps",
  "בכל": "à chaque",
  "רגע": "instant / moment",
  "ועל": "et sur",
  "זה": "cela",
  "יש": "il faut",
  "להודות": "remercier / rendre grâce",
  "להקדוש": "le Saint",
  "בשמחה": "avec joie",
  "הטובה": "le bienfait",
  "הזו": "ceci / cette",
  "הזאת": "ceci / cette",
  "ומודה": "et il rend grâce",
  "מערכת": "le système",
  "העיכול": "digestif",
  "שבגופו": "qui est dans son corps",
  "שהיא": "qui est",
  "המצילתו": "ce qui le sauve",
  "מכל": "de toutes",
  "מיני": "sortes de",
  "חולאים": "maladies",
  "וגורמת": "et lui permet",
  "לו": "à lui",
  "שיחיה": "de vivre",
  "ומזכירים": "et l'on mentionne",
  "בברכה": "dans la bénédiction",
  "זו": "cette",
  "לפני": "devant",
  "כסא": "le Trône de",
  "כבודך": "Ta Gloire",
  "להוציא": "pour réfuter / exclure",
  "מדעת": "l'opinion de",
  "הכופרים": "les hérétiques / dénégateurs",
  "האומרים": "qui disent",
  "שהקדוש": "que le Saint",
  "לא": "ne... pas",
  "משגיח": "supervise / veille sur",
  "העולם": "le monde",
  "השפל": "d'ici-bas / bas",
  "ומפליא": "et accomplit des merveilles",
  "לעשות": "à faire",
  "במה": "en ce",
  "ששומר": "qu'Il préserve",
  "רוח": "l'esprit de",
  "בקרבו": "en lui / en son sein",
  "וקושר": "et lie",
  "דבר": "une chose",
  "רוחני": "spirituelle",
  "בדבר": "à une chose",
  "גשמי": "matérielle",
  "וזאת": "et cela",
  "בזכות": "grâce à / au mérite de",
  "שהוא": "qu'Il est",
  "רופא": "le guérisseur de",
  "בשר": "chair",
  "כי": "car",
  "אז": "alors",
  "בקו": "dans la ligne de",
  "הבריאות": "la santé",
  "ונשמתו": "et son âme",
  "משתמרת": "est préservée",
  "כבר": "déjà",
  "נתבאר": "a été expliqué",
  "לעיל": "ci-dessus",
  "שאין": "qu'il n'y a pas",
  "כלי": "récipient",
  "לנטילה": "pour l'ablution",
  "מהברז": "du robinet",
  "מכל": "de tout",
  "מקום": "lieu / néanmoins",
  "יטול": "il versera (l'eau)",
  "פעמים": "fois",
  "והמחמיר": "et celui qui est rigoureux",
  "מכלי": "d'un récipient",
  "תבוא": "viendra",
  "עליו": "sur lui",
  "ברכה": "une bénédiction",
  "גם": "Aussi / Même",
  "הנשים": "les femmes",
  "חייבות": "sont tenues",
  "בברכת": "de la bénédiction de",
  "שנתקנה": "qui a été instituée",
  "ידי": "les mains de / par",
  "אנשי": "les Hommes de",
  "כנסת": "l'Assemblée",
  "הגדולה": "la Grande",
  "לחנך": "éduquer",
  "את": "les / le",
  "הקטנים": "les enfants",
  "שיטלו": "à se laver",
  "ידיהם": "leurs mains",
  "שעשו": "qu'ils ont fait",
  "צרכיהם": "leurs besoins",
  "ויברכו": "et bénir",
  "ברכת": "la bénédiction de",
  "ללמוד": "d'apprendre",
  "בעל": "par",
  "פה": "bouche (cœur)",
  "היא": "elle",
  "צריכה": "est nécessaire",
  "מאד": "très",
  "ונעשה": "et il est accompli",
  "בה": "en elle",
  "תיקון": "une réparation / rectification",
  "גדול": "grande",
  "אדם": "homme / personne",
  "להבין": "comprendre",
  "פירוש": "le sens",
  "הפשטי": "littéral",
  "נוסח": "la formule de",
  "שידע": "afin qu'il sache",
  "מה": "ce que",
  "אומר": "dit",
  "העושה": "Celui qui fait",
  "בין": "soit / entre",
  "ושכח": "et a oublié",
  "לברך": "de bénir",
  "מיד": "immédiatement",
  "אם": "si",
  "נזכר": "il s'en rappelle",
  "תוך": "dans / au cours de",
  "שיעור": "le délai de",
  "פרסה": "72 minutes (parassa)",
  "יברך": "il récitera",
  "ואאם": "et si",
  "ואאם": "et si",
  "לאו": "non",
  "והשומע": "et celui qui entend",
  "מחבירו": "de son ami",
  "המברך": "qui bénit",
  "לאחר": "après",
  "יענה": "répondra",
  "אחריו": "après lui",
  "מספק": "par doute de",
  "אמן": "Amen",
  "יתומה": "orphelin",
  "נתעורר": "il ressent à nouveau le besoin",
  "שוב": "à nouveau",
  "לנקביו": "à ses besoins",
  "בתוך": "dans",
  "השיעור": "le délai", "הנל": "susmentionné", "הניזכר": "susmentionné",
  "עד": "jusqu'à",
  "שיסך": "qu'il satisfasse",
  "רגליו": "ses besoins",
  "שהוצרך": "qui avait besoin",
  "יפסיד": "il ratera",
  "תפלה": "la prière",
  "בצבור": "en communauté",
  "יניח": "il reporte / laisse",
  "הברכה": "la bénédiction",
  "התפלה": "la prière",
  "לחוש": "à craindre",
  "שמא": "de peur que",
  "ישכח": "il oublie",
  "מלברך": "de bénir",
  "עכשו": "maintenant",
  "ואחר": "et après",
  "כך": "cela",
  "יזדרז": "il se hâtera",
  "להתפלל": "de prier",
  "עם": "avec",
  "הצבור": "la communauté",
  "יצטרך": "il le faut",
  "ידלג": "il sautera",
  "כמה": "quelques",
  "מהמזמורים": "des psaumes",
  "כדי": "afin de",
  "שיוכל": "qu'il puisse",
  "להספיק": "réussir à temps",
  "אך": "Mais",
  "נותן": "il met",
  "סימן": "un signe / pense-bête",
  "ולא": "et ne... pas",
  "וגם": "et aussi",
  "יעברו": "passeront",
  "72": "72",
  "דקות": "minutes",
  "עדיף": "il vaut mieux",
  "שיניח": "qu'il reporte",
  "ויתפלל": "et priera",
  "כסדר": "dans l'ordre",
  "בלא": "sans",
  "דילוגים": "sauts",
  "הנוהגים": "qui ont pour coutume",
  "לאמר": "de dire",
  "א": "lettre Aleph",
  "בצירי": "avec Tséré",
  "אי": "Ei / Ii",
  "אפשר": "possible",
  "הא": "la lettre Aleph",
  "בניקוד": "avec la voyelle",
  "חיריק": "Hiriq",
  "ואין": "et il n'y a pas de",
  "הכרע": "décision / tranchant",
  "בדבר": "dans ce sujet",
  "שאומר": "qui dit",
  "לסמוך": "s'appuyer",
  "צירי": "Tséré",
  "מנהגינו": "Notre coutume",
  "אפילו": "même",
  "שעה": "une heure",
  "אחת": "seule / une",
  "והטעם": "Et la raison",
  "לזה": "à cela",
  "שגבול": "qu'une limite",
  "נקביו": "ses ouvertures / conduits",
  "להסתם": "se boucher",
  "ימות": "mourir",
  "שעבר": "qu'a passé",
  "אותו": "cette / ce",
  "גבול": "limite",
  "להתקיים": "subsister / rester en vie",
  "יותר": "plus",
  "ועוד": "Et de plus",
  "שהרי": "car voici",
  "איברים": "des organes", "אברים": "des organes",
  "שאאם": "qui si",
  "נפתחים": "s'ouvrent",
  "נסתמים": "se bouchent",
  "לשנות": "modifier",
  "מן": "de",
  "המנהג": "la coutume",
  "לחתום": "de conclure",
  "ומפליא": "et accomplit des merveilles",
  "הגירסא": "la version",
  "בגמרא": "dans la Gemara",
  "ובהריף": "et dans le Rif",
  "והרמבם": "et le Rambam",
  "גורסים": "ont pour version",
  "חולי": "des maladies de",
  "שטעה": "qui s'est trompé",
  "סיים": "conclu",
  "אינו": "il ne... pas",
  "חוזר": "recommence",
  "דספק": "car doute de",
  "ברכות": "bénédictions",
  "להקל": "d'être souple",
  "ראוי": "Il est digne",
  "ונכון": "et approprié",
  "שלא": "de ne pas",
  "ינגב": "s'essuie",
  "בעת": "au moment où",
  "שמברך": "l'on bénit",
  "להתעסק": "s'occuper",
  "בשום": "dans aucune",
  "עסק": "activité / affaire",
  "באמצע": "au milieu de", "שאדם": "qu'un homme", "מברך": "bénit", "ובפרט": "Et en particulier", "במי": "pour celui", "שיודע": "qui sait", "שיכוין": "qu'il sera plus concentré", "הניגוב": "l'essuyage", "להמתין": "attendre", "שינגב": "qu'il s'essuie", "שהתפנה": "qu'il soit sorti des toilettes", "בירך": "a béni", "חבירו": "son ami", "ומבקש": "et demande", "שיחזור": "qu'il répète", "להוציאו": "pour l'acquitter", "חובה": "d'obligation", "אומרים": "on ne dit pas", "כלל": "ce principe", "השבח": "louange", "ששכח": "qui a oublié", "קודם": "avant", "והוא": "et cela", "שיעור": "le délai de", "מהלך": "la marche de", "שבעים": "soixante-dix", "וששתים": "et deux", "הקם": "Celui qui se lève", "בבוקר": "le matin", "ומרגיש": "et ressent", "להחמיר": "d'être rigoureux", "עצמו": "lui-même", "ולישהות": "et d'attendre", "יפנה": "il ira aux toilettes", "יזהר": "il veillera", "יגע": "touchera", "באבריו": "ses ouvertures corporelles", "ומעיקר": "Et selon le fondement de", "הדין": "la loi", "מותר": "il est permis", "לילך": "d'aller", "לבית": "à la maison de", "הכסא": "les toilettes", "לעשיית": "pour faire", "ורק": "et seulement", "שחרית": "du matin", "שניעור": "qui se réveille", "בלילה": "la nuit", "ודעתו": "et son intention", "לחזור": "de revenir", "לישון": "dormir", "לישן": "dormir", "בשעת": "en temps de", "הדחק": "difficulté / force majeure", "כזו": "telle", "לנקות": "nettoyer", "במידי": "avec un objet", "דמנקי": "qui nettoie (linge)", "הנפנה": "Celui qui fait ses besoins", "לצרכיו": "ses besoins", "ויצא": "et sort", "מבית": "de la maison de", "שנטל": "qu'il se lave", "שמע": "a entendu", "קדיש": "Kaddish", "קדושה": "Kedousha", "ישפשף": "il frottera", "בבגדו": "sur son vêtement", "וקדושה": "et Kedousha", "היוצא": "celui qui sort", "וטרם": "et avant", "ראה": "a vu", "ברקים": "des éclairs", "רעמים": "des tonnerres", "אף": "même", "פי": "la bouche / bien que", "שעדיין": "que jusqu'à présent", "מברכים": "On bénit", "בשחר": "le matin", "השחר": "le matin", "נתחייב": "été tenu", "בהם": "en elles", "וכגון": "et comme", "שהיה": "qui était", "ניעור": "éveillé", "חוץ": "sauf", "מברכת": "la bénédiction de", "נטילת": "l'ablution de", "ידים": "les mains", "אלהי": "Elohaï (Mon D.ieu)", "נשמה": "Neshaman (l'âme)", "באה": "vient", "להשי\"ת": "à D.ieu béni soit-Il", "בריאת": "la création de", "הנשמה": "l'âme", "נתינתה": "son don", "וחזרתה": "et son retour", "לתוך": "à l'intérieur de", "להזכיר": "rappeler", "שבועתו": "son serment", "נשבע": "a juré", "לשמור": "de garder", "בטהרתה": "dans sa pureté", "להכתימה": "la souiller", "בחטאים": "par des fautes", "להסמיך": "d'enchaîner / accoler", "טוב": "il est bon", "אחד": "un", "וענו": "et ont répondu", "מהעונים": "parmi ceux qui répondent", "לערער": "contester", "עליהם": "sur eux", "שכבר": "qu'ils ont déjà", "יצאו": "été acquittés", "חובת": "l'obligation de", "הברכות": "les bénédictions", "בעניית": "en répondant", "מפני": "parce", "שהמברך": "que celui qui bénit", "מכוין": "ayant l'intention", "להוציאם": "de les acquitter"
};

const INFINITIVES = {
  "עשיית": "לַעֲשׂוֹת = Faire / Accomplir",
  "ליטול": "לִטֹּל = Prendre / Laver (les mains)",
  "ולברך": "לְבָרֵךְ = Bénir",
  "ויתבונן": "לְהִתְבּוֹנֵן = Méditer / Réfléchir",
  "נעשה": "לְהֵעָשׂוֹת = Être fait / Façonné",
  "פועל": "לִפְעֹל = Agir / Fonctionner",
  "המגינים": "לְהָגֵן = Protéger",
  "הנכנסים": "לְהִכָּנֵס = Entrer",
  "להודות": "לְהוֹדוֹת = Remercier / Rendre grâce",
  "ומודה": "לְהוֹדוֹת = Remercier / Rendre grâce",
  "שיחיה": "לִחְיוֹת = Vivre",
  "ומזכירים": "לְהַזְכִּיר = Mentionner",
  "להוציא": "לְהוֹצִיא = Faire sortir / Réfuter",
  "האומרים": "לוֹמַר = Dire",
  "משגיח": "לְהַשְׁגִּיחַ = Surveiller / Veiller sur",
  "ומפליא": "לַהֲפְלִיא = Faire des merveilles",
  "ששומר": "לִשְׁמֹר = Garder / Préserver",
  "וקושר": "לִקְשֹׁר = Lier / Attacher",
  "משתמרת": "לְהִשְׁתַּמֵּר = Être préservé",
  "יוכל": "לִיכֹל = Pouvoir",
  "יטול": "לִטֹּל = Prendre / Laver",
  "והמחמיר": "לְהַחְמִיר = Être rigoureux",
  "תבוא": "לָבוֹא = Venir",
  "לחנך": "לְחַנֵּךְ = Éduquer",
  "שיטלו": "לִטֹּל = Laver",
  "עשו": "לַעֲשׂוֹת = Faire",
  "ויברכו": "לְבָרֵךְ = Bénir",
  "ללמוד": "לִלְמֹד = Apprendre",
  "להבין": "לְהָבִין = Comprendre",
  "שידע": "לָדַעַת = Savoir",
  "ושכח": "לִשְׁכֹּחַ = Oublier",
  "נזכר": "לְהִזָּכֵר = Se rappeler",
  "יברך": "לְבָרֵךְ = Bénir",
  "והשומע": "לִשְׁמֹעַ = Entendre / Écouter",
  "המברך": "לְבָרֵךְ = Bénir",
  "יענה": "לַעֲנוֹת = Répondre",
  "נתעורר": "לְהִתְעוֹרֵר = S'éveiller / Avoir envie",
  "שיסך": "לָסוּךְ = Couvrir / Faire ses besoins",
  "יפסיד": "לְהַפְסִיד = Perdre / Rater",
  "יניח": "לְהַנִּיחַ = Laisser / Reporter",
  "ישכח": "לִשְׁכֹּחַ = Oublier",
  "יזדרז": "לְהִזְדָּרֵז = Se hâter",
  "להתפלל": "לְהִתְפַּלֵּל = Prier",
  "ידלג": "לְדַלֵּג = Sauter",
  "להספיק": "לְהַסְפִּיק = Réussir à temps",
  "נותן": "לָתֵת = Donner",
  "יעברו": "לַעֲבֹר = Passer / Dépasser",
  "לסמוך": "לִסְמֹךְ = S'appuyer",
  "ליסתם": "לְהִסָּתֵם = Se boucher",
  "ימות": "לָמוּת = Mourir",
  "להתקיים": "לְהִתְקַיֵּם = Subsister / Rester en vie",
  "נפתחים": "לְהִפָּתַח = S'ouvrir",
  "נסתמים": "לְהִסָּתֵם = Se boucher",
  "לשנות": "לַשֲׁנוֹת = Modifier",
  "לחתום": "לַחְתֹּם = Conclure / Sceller",
  "שטעה": "לִטְעוֹת = Se tromper",
  "חוזר": "לַחֲזֹר = Recommencer / Revenir",
  "ינגב": "לְנַגֵּב = S'essuyer",
  "להתעסק": "לְהִתְעַסֵּק = S'occuper / Se distraire",
  "להמתין": "לְהַמְתִּין = Patienter / Attendre",
  "מבקש": "לְבַקֵּשׁ = Demander",
  "ירצה": "לִרְצוֹת = Vouloir",
  "לילך": "לָלֶכֶת = Aller",
  "שניעור": "לְהֵעוֹר = S'éveiller",
  "וראה": "לִרְאוֹת = Voir",
  "להסמיך": "לְהַסְמִיךְ = Enchaîner / Juxtaposer"
};

const SEIF_TITLES_6 = [
  "Signification de la bénédiction Asher Yatsar",
  "Ablution directe au robinet",
  "Obligation des femmes et des enfants",
  "Délai de 72 minutes (Parassa)",
  "Priorité à la bénédiction ou au Minyan",
  "Prononciation 'Ei Efshar' ou 'Ii Efshar'",
  "Formule 'Afilou sha'ah e'hat'",
  "Conclusion 'Rofeh kol basar'",
  "Oubli de la formule finale",
  "Interdiction de s'essuyer pendant la bénédiction",
  "Pas de répétition pour acquitter un ami",
  "Oubli avant la prière",
  "Besoin pressant au réveil",
  "Ablution lors d'un réveil nocturne",
  "Réponse au Kaddish avant l'ablution",
  "Bénédictions du matin pour un éveillé",
  "Bénédiction Elohaï Neshaman",
  "Répétition individuelle des bénédictions"
];

function buildHalakhot() {
  const hebBadges = ['א.', 'ב.', 'ג.', 'ד.', 'ה.', 'ו.', 'ז.', 'ח.', 'ט.', 'י.', 'יא.', 'יב.', 'יג.', 'יד.', 'טו.', 'טז.', 'יז.', 'יח.'];

  return rawSeifim.map((item, sIdx) => {
    const brutWords = item.brut.split(/\s+/).filter(Boolean);
    const voyellesWords = item.voyelles.split(/\s+/).filter(Boolean);

    const badgeHebLetter = hebBadges[sIdx];
    const badgeNum = `${item.seif}.`;

    const mots_alignes = [
      {
        id: 0,
        hebreu_brut: badgeHebLetter,
        hebreu_voyelles: badgeHebLetter,
        francais_mot: badgeNum,
        expression_contexte: ""
      }
    ];

    const validBrutWords = [];
    const validVoyellesWords = [];
    brutWords.forEach((bw, idx) => {
      if (idx === 0 && cleanHeb(bw) === cleanHeb(badgeHebLetter)) return;
      validBrutWords.push(bw);
      validVoyellesWords.push(voyellesWords[idx] || bw);
    });

    validBrutWords.forEach((bWord, wIdx) => {
      const vWord = validVoyellesWords[wIdx] || bWord;
      const bClean = cleanHeb(bWord);

      const wordFr = DICT[bClean] || bClean;
      const inf = INFINITIVES[bClean] || null;

      mots_alignes.push({
        id: mots_alignes.length,
        hebreu_brut: bWord,
        hebreu_voyelles: vWord,
        francais_mot: wordFr,
        expression_contexte: "",
        ...(inf ? { infinitif: inf } : {})
      });
    });

    return {
      livre: "Kitzur Yalkout Yossef",
      sujet: "הלכות אשר יצר ואלהי נשמה",
      sujet_he: "הִלְכוֹת אֲשֶׁר יָצַר וֶאֱלֹהַי נְשָׁמָה",
      sujet_fr: "Lois des bénédictions Asher Yatsar et Elohaï Neshaman",
      titre_seif: SEIF_TITLES_6[sIdx] || `Seïf ${item.seif}`,
      siman: "6",
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

const siman6Data = {
  _meta: {
    source: "106_1_KITZUR_YALKUT_YOSEF.txt",
    siman: 6,
    siman_hebrew: "ו",
    generated_at: new Date().toISOString(),
    total_seifim: rawSeifim.length
  },
  halakhot: buildHalakhot()
};

fs.mkdirSync(path.dirname(OUTPUT_SHABBAT), { recursive: true });
fs.writeFileSync(OUTPUT_SHABBAT, JSON.stringify(siman6Data, null, 2), 'utf8');
fs.writeFileSync(OUTPUT_DATA_SIMAN, JSON.stringify(siman6Data, null, 2), 'utf8');
fs.writeFileSync(OUTPUT_DATA_YALKOUT, JSON.stringify(siman6Data, null, 2), 'utf8');

console.log("✅ Siman 6 regenerated with clean contextual word dictionary!");
