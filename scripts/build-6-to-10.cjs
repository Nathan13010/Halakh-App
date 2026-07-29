const fs = require('fs');
const http = require('http');
const https = require('https');

const dataFile = 'public/data/siman_1.json';

// Fetch function for Nakdan
function fetchNakdan(text) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            task: 'nakdan',
            data: text,
            addmorph: false,
            keepqq: true,
            matchpartial: true,
            useTokenization: true,
            genre: 'rabbinic'
        });

        const req = https.request('https://nakdan-2-0.loadbalancer.dicta.org.il/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

function applyKtivMaleVowels(rawWord, nakdanWord) {
    if (rawWord.includes('ו') && nakdanWord.includes('ֻ')) {
        return nakdanWord.replace(/ֻ/g, 'וּ');
    }
    return nakdanWord;
}

const seifimTranslations = [
  {
    seif: "6",
    hebreu: "יש אומרים שראוי לו לאדם לישון בחצי הראשון של הלילה, ויעסוק בתורה בחצי השני של הלילה, ויש בזה תועלת לאדם הן מצד בריאות גופו, והן מצד הרוחניות בתיקון הנפש, אולם בתלמוד שלנו ובדברי הרמב\"ם מבואר, שהשינה בסוף הלילה, בזמן עמוה\"ש, מועילה לבריאות הגוף, ולכן אם רצה ללמוד בתחלת הלילה, ולישון בחצי השני של הלילה, יכול לעשות כן. ואם אפשר טוב שילמד סמוך לשקיעת החמה עד אחר צאת הכוכבים, ובבוקר סמוך לעלות השחר עד אחר עלות השחר, כדי לחבר היום ללילה בלימוד התורה, ולקיים \"והגית בו יומם ולילה\". ומכל מקום רבים אינם נוהגים כן, ואינם מחברים יום ללילה כנז', שסמכו על הגמרא שלנו החולקת בזה על הירושלמי. ובלבד שיעסוק בתורה ביום ובלילה. [ילקו\"י על הל' השכמת הבוקר, מהדורת תשס\"ד, עמוד עה].",
    francaisGlobal: "Certains disent qu'il convient à l'homme de dormir pendant la première moitié de la nuit, et d'étudier la Torah pendant la seconde moitié. Cela est bénéfique tant pour la santé du corps que pour la spiritualité et la réparation de l'âme. Cependant, dans notre Talmud et selon le Rambam, il est expliqué que le sommeil de fin de nuit, à l'approche de l'aube, est celui qui est bénéfique pour le corps. C'est pourquoi, s'il préfère étudier en début de nuit et dormir en seconde moitié, il y est autorisé. Si possible, il est bon d'étudier du coucher du soleil jusqu'à la sortie des étoiles, puis le matin avant et après l'aube, afin de joindre le jour et la nuit par l'étude de la Torah. Beaucoup ne le font toutefois pas, s'appuyant sur notre Guemara. L'essentiel est d'étudier de jour comme de nuit.",
    mots: [
      "Il y a", "(ceux) qui disent", "qu'il convient", "pour lui", "à l'homme", "de dormir", "dans la moitié", "première", "de", "la nuit,",
      "et qu'il étudie", "la Torah", "dans la moitié", "seconde", "de", "la nuit,",
      "et il y a", "en cela", "un avantage", "pour l'homme", "tant", "du côté", "de la santé", "de son corps,", "que (tant)", "du côté", "de la spiritualité", "pour la réparation", "de l'âme,",
      "cependant", "dans le Talmud", "le nôtre", "et dans les paroles", "du Rambam", "il est expliqué,", "que le sommeil", "à la fin", "de la nuit,", "au moment", "de l'aube,", "est bénéfique", "pour la santé", "du corps,",
      "et c'est pourquoi", "si", "il a voulu", "étudier", "au début", "de la nuit,", "et dormir", "dans la moitié", "seconde", "de", "la nuit,", "il peut", "faire", "ainsi.",
      "Et si", "c'est possible", "c'est bien", "qu'il étudie", "près", "du coucher", "du soleil", "jusqu'à", "après", "la sortie", "des étoiles,", "et le matin", "près", "du lever", "de l'aube", "jusqu'à", "après", "le lever", "de l'aube,", "afin", "de relier", "le jour", "à la nuit", "par l'étude", "de la Torah,", "et d'accomplir", "\"Tu la méditeras", "en elle", "jour", "et nuit\".",
      "Et de tout", "lieu (néanmoins)", "beaucoup", "ne", "se comportent (pas)", "ainsi,", "et ne", "relient (pas)", "le jour", "à la nuit", "comme mentionné,", "car ils se sont appuyés", "sur", "la Guemara", "la nôtre", "qui diverge", "sur cela", "par rapport (au Talmud de)", "Jérusalem.",
      "Pourvu", "qu'il étudie", "la Torah", "le jour", "et la nuit.", "[Yalkout Yossef", "sur", "les lois (de)", "le réveil", "matinal,", "édition", "5764,", "page", "75]."
    ]
  },
  {
    seif: "7",
    hebreu: "הלומד תורה בלילה עד שעה מאוחרת, ועל ידי כך קיים ספק אם יוכל לקום להתפלל קודם שיעבור זמן קריאת שמע ותפלה, יש לו להפסיק מלימודו, ויסדר זמן לימודו באופן שלא יאחר זמן קריאת שמע ותפלה. אבל אם רוצה להתאחר מלישון ולעסוק בלימוד התורה, ועקב כך יבטל רק תפלה בהנץ החמה, רשאי לנהוג כן, כל שהדבר גורם לו לחיזוק ההתמדה בלימוד התורה. ובלבד שלא יתאחר מזמן קריאת שמע ותפלה. ואם על ידי שילמד עד שעת לילה מאוחרת יצטרך לקום מאוחר, באופן שיבטל זמן קריאת שמע לפי זמן המגן אברהם, ויצטרך לסמוך על זמן קריאת שמע של הגר\"א, המיקל בזה לצורך לימוד תורה יש לו על מה לסמוך. [ואין לחוש בזה לחילול ה']. ואמנם מי שאינו טרוד בלימוד התורה, מצוה מן המובחר להשתדל מאד להתפלל בהנץ החמה בכל יום, שיש לזה חשיבות גדולה. [ילקו\"י על הלכות השכמת הבוקר, מהדורת תשס\"ד, עמ' עז].",
    francaisGlobal: "Celui qui étudie la Torah tard la nuit et risque de ne pas se réveiller à temps pour lire le Chema et prier, doit s'arrêter d'étudier et réorganiser son temps. Mais s'il étudie tard et manque seulement la prière au lever du soleil (Nets), il y est autorisé si cela renforce son assiduité, à condition de ne pas rater l'heure limite du Chema. S'il doit se fier à l'horaire plus tardif du Gaon de Vilna au lieu du Magen Avraham pour l'heure du Chema en raison de son étude nocturne, il a sur qui s'appuyer. Toutefois, celui qui n'est pas absorbé par l'étude se doit de faire le maximum pour prier au lever du soleil (Nets) chaque jour.",
    mots: [
      "Celui qui étudie", "la Torah", "la nuit", "jusqu'à", "une heure", "tardive,", "et par", "le biais", "de cela", "il existe", "un doute", "si", "il pourra", "se lever", "pour prier", "avant", "que ne passe", "l'heure", "de la lecture", "du Chema", "et de la prière,", "il y a", "pour lui (obligation)", "d'interrompre", "son étude,", "et qu'il organise", "le temps", "de son étude", "de façon", "à ce qu'il ne", "retarde (pas)", "l'heure", "de la lecture", "du Chema", "et de la prière.",
      "Mais", "si", "il veut", "retarder", "de dormir", "et s'occuper", "par l'étude", "de la Torah,", "et suite", "à cela", "il annulera", "seulement", "la prière", "au lever", "du soleil,", "il est autorisé", "à se comporter", "ainsi,", "tant", "que la chose", "cause", "pour lui", "un renforcement", "de l'assiduité", "par l'étude", "de la Torah.",
      "Pourvu", "qu'il ne", "retarde (pas)", "de l'heure", "de la lecture", "du Chema", "et de la prière.", "Et si", "par", "le biais", "qu'il étudiera", "jusqu'à", "l'heure", "de la nuit", "tardive", "il devra", "se lever", "tard,", "de façon", "qu'il annulera", "l'heure", "de la lecture", "du Chema", "selon", "l'heure", "du Magen", "Avraham,", "et il devra", "s'appuyer", "sur", "l'heure", "de la lecture", "du Chema", "de", "le Gaon de Vilna,", "qui se montre indulgent", "sur cela", "pour les besoins", "de l'étude", "de la Torah", "il a", "pour lui", "sur", "quoi", "s'appuyer.",
      "[Et il n'y a pas", "à craindre", "par cela", "à une profanation", "de D.].", "Et cependant", "celui", "qui n'est pas", "préoccupé", "par l'étude", "de la Torah,", "c'est une mitsva", "parmi", "l'élite (préférable)", "de s'efforcer", "beaucoup", "de prier", "au lever", "du soleil", "dans chaque", "jour,", "car il y a", "à cela", "une importance", "grande.", "[Yalkout Yossef", "sur", "les lois (de)", "le réveil", "matinal,", "édition", "5764,", "page", "77]."
    ]
  },
  {
    seif: "8",
    hebreu: "כאשר יתעורר משנתו ימתין מעט, ויקום בזריזות לעבודת בוראו יתברך ויתעלה, כי לכך נברא האדם. אך לא יעמוד בפתאומיות מיד אחר השינה, כי הדבר מזיק לבריאות. ואף אם הוא קם מיד לעבודת הבורא ולתפלה, או לשאר דבר מצוה, גם בזה ישהה מעט ואחר כך יקום. ואמנם הסכנה היא דוקא בעומד על רגליו מיד, אבל בקם ממטתו להתלבש וכדו', ואינו עומד על רגליו אלא נשאר יושב על מטתו, אין בכך סכנה. ועל כל פנים אל ישכב על מטתו ויפנה לבו לבטלה, וכבר הזהיר שלמה המלך ע\"ה: עד מתי עצל תשכב, מתי תקום משנתך. וגדולי המקובלים היו נזהרים מלדבר דברי חול קודם שיתחילו הזמירות. [ילקו\"י על הלכות השכמת הבוקר, מהדורת תשס\"ד, עמוד פז].",
    francaisGlobal: "Lorsqu'il se réveille de son sommeil, il patientera un instant, puis se lèvera avec empressement pour le service de son Créateur, car c'est pour cela que l'homme a été créé. Toutefois, il ne se tiendra pas debout brusquement juste après le sommeil, car cela nuit à la santé. Même pour se lever pour la prière ou une mitsva, il doit patienter un peu avant de se lever. Le danger réside uniquement dans le fait de se lever sur ses pieds immédiatement ; s'asseoir sur son lit pour s'habiller ne comporte aucun risque. Cependant, il ne doit pas rester allongé oisivement. Les grands cabalistes veillaient à ne pas prononcer de paroles profanes avant d'avoir commencé les cantiques.",
    mots: [
      "Lorsque", "il se réveillera", "de son sommeil", "il patientera", "un peu,", "et se lèvera", "avec empressement", "pour le service", "de son Créateur", "qu'Il soit béni", "et qu'Il soit exalté,", "car", "pour cela", "a été créé", "l'homme.", "Toutefois", "il ne", "se tiendra (pas) debout", "soudainement", "immédiatement", "après", "le sommeil,", "car", "la chose", "nuit", "à la santé.",
      "Et même", "si", "il", "se lève", "immédiatement", "pour le service", "du Créateur", "et pour la prière,", "ou", "pour le reste", "d'une chose", "de mitsva,", "même", "dans cela", "il patientera", "un peu", "et ensuite", "ainsi", "il se lèvera.",
      "Et cependant", "le danger", "est", "précisément", "en se tenant debout", "sur", "ses pieds", "immédiatement,", "mais", "en se levant", "de son lit", "pour s'habiller", "et similaire,", "et qu'il n'est pas", "debout", "sur", "ses pieds", "mais", "il reste", "assis", "sur", "son lit,", "il n'y a pas", "dans cela", "de danger.",
      "Et sur", "toute", "face (en tout cas)", "il ne (faut) pas", "qu'il s'allonge", "sur", "son lit", "et qu'il tourne", "son cœur", "à l'oisiveté,", "et déjà", "a averti", "Salomon", "le Roi", "la paix soit sur lui :", "jusqu'à", "quand", "paresseux", "t'allongeras-tu,", "quand", "te lèveras-tu", "de ton sommeil.",
      "Et les grands", "des cabalistes", "étaient", "prudents", "de ne pas parler", "des paroles", "profanes", "avant", "qu'ils ne commencent", "les cantiques.", "[Yalkout Yossef", "sur", "les lois (de)", "le réveil", "matinal,", "édition", "5764,", "page", "87]."
    ]
  },
  {
    seif: "9",
    hebreu: "מיד כשיעור משנתו יעיד על עצמו אמונתו בבורא יתברך, ויאמר: \"מודה אני לפניך וכו'\". ויפסיק בין תיבת בחמלה, לרבה אמונתך. ואף שעדיין לא נטל ידיו ויש עליהם רוח רעה, אפילו הכי מותר לומר מודה אני. וגם אם יש לכלוך בחדר ואי אפשר לומר שם דברי תורה, אפילו הכי יאמר נוסח מודה אני. והאשה אומרת מודָה אני [הדל\"ת בקמץ]. ויש המקפידים ליטול ידיהם מיד עם הקיצם משינתם, קודם שילבשו את מלבושיהם, ומעיקר הדין על פי הגמרא והפוסקים מותר ללבוש את המלבושים קודם הנטילה, ולילך להתפנות לצרכיו, ואחר כך יטול ידיו. והמחמיר כהזוה\"ק ליטול ידיו עם הקיצו משינתו, תבוא עליו ברכה. [שו\"ת יביע אומר ח\"ה סי' א', ובתוספת בילקוט יוסף החדש, מהדורת תשס\"ד, ספר על הלכות השכמת הבוקר עמוד פח, ומהדורת תשמ\"ה, עמוד ז', ושאר\"י עמו' ב].",
    francaisGlobal: "Dès son réveil, il témoignera de sa foi envers le Créateur et récitera le Modé Ani. Il marquera une pause entre le mot 'bechemla' (avec miséricorde) et 'rabba emounatekha' (grande est Ta fidélité). Bien qu'il n'ait pas encore fait Nétilat Yadaïm et qu'un esprit d'impureté repose sur ses mains, ou que la chambre ne soit pas propre pour étudier la Torah, il est tout de même permis de dire le Modé Ani, car il ne contient aucun des Noms divins. La femme dira \"Modah Ani\". Certains veillent à se laver les mains immédiatement avant même de s'habiller, mais selon la stricte loi, on peut s'habiller et aller aux toilettes avant de faire l'ablution. Celui qui est strict selon le Zohar sera béni.",
    mots: [
      "Immédiatement", "lorsqu'il se réveille", "de son sommeil", "il témoignera", "sur", "lui-même", "de sa foi", "dans le Créateur", "qu'Il soit béni,", "et il dira :", "\"Je reconnais", "moi", "devant Toi", "etc.\".", "Et il fera une pause", "entre", "le mot", "avec miséricorde,", "à (et) grande", "est Ta fidélité.",
      "Et bien", "que jusqu'à présent", "il n'a pas", "lavé", "ses mains", "et qu'il y a", "sur elles", "un esprit", "mauvais,", "même", "ainsi", "il est permis", "de dire", "Je reconnais", "moi.", "Et même", "si", "il y a", "de la saleté", "dans la chambre", "et qu'il n'est pas", "possible", "de dire", "là-bas", "des paroles", "de Torah,", "même", "ainsi", "il dira", "la version", "Je reconnais", "moi.",
      "Et la femme", "dit", "Je reconnais (au féminin)", "moi", "[le Dalet", "avec un Kamats].", "Et il y a (ceux)", "qui sont méticuleux", "de laver", "leurs mains", "immédiatement", "avec", "leur réveil", "de leur sommeil,", "avant", "qu'ils ne portent", "(particule)", "leurs vêtements,",
      "et du principe", "de la loi", "sur", "la bouche", "de la Guemara", "et des Décisionnaires", "il est permis", "de porter", "(particule)", "les vêtements", "avant", "l'ablution,", "et d'aller", "se vider (aux toilettes)", "pour ses besoins,", "et après", "ainsi", "il lavera", "ses mains.", "Et celui qui est strict", "comme le Zohar Saint", "de laver", "ses mains", "avec", "son réveil", "de son sommeil,", "viendra", "sur lui", "une bénédiction.",
      "[Responsa", "Yabia", "Omer", "partie 5", "chapitre", "1,", "et en supplément", "dans le Yalkout", "Yossef", "le nouveau,", "édition", "5764,", "livre", "sur", "les lois (de)", "le réveil", "matinal", "page", "88,", "et édition", "5745,", "page", "7,", "et Sheérit Yossef", "page", "2]."
    ]
  },
  {
    seif: "10",
    hebreu: "עיקר היום הוא הראשית וההתחלה, ולכן ראוי שיקדיש ראשית היום בעמדו בבוקר לעבודת השי\"ת. וגם מחשבתו הראשונה תהיה לחשוב בגדלות הבורא יתברך, ובחסדו שעשה לו במה שהחזיר לו נשמתו. וגם הליכה ראשונה שלו תהיה לעבודת השי\"ת, והדיבור הראשון יהיה בדברי תורה ותפלה, ועשייה ראשונה תהיה לשם השי\"ת, ואז הכל נגרר אחר ההתחלה. [ילקו\"י על הל' השכמת הבוקר, מהדורת תשס\"ד, עמוד צב].",
    francaisGlobal: "L'essentiel du jour réside dans son commencement. C'est pourquoi il convient de consacrer le début de sa journée, dès le lever matin, au service de Dieu. Sa toute première pensée sera pour la grandeur du Créateur et pour la bonté qu'Il lui a témoignée en lui restituant son âme. De même, sa première marche, sa première parole et sa première action devront être orientées vers l'étude, la prière et le service divin, car tout découle du commencement.",
    mots: [
      "L'essentiel", "du jour", "il (est)", "le commencement", "et le début,", "et c'est pourquoi", "il convient", "qu'il consacre", "le début", "du jour", "en se levant", "le matin", "pour le service", "de D.", "Et aussi", "sa pensée", "la première", "sera", "de penser", "à la grandeur", "du Créateur", "qu'Il soit béni,", "et à Sa bonté", "qu'Il a faite", "pour lui", "dans ce", "qu'Il a restitué", "à lui", "son âme.",
      "Et aussi", "la marche", "la première", "de lui", "sera", "pour le service", "de D.,", "et la parole", "la première", "sera", "dans des paroles", "de Torah", "et de prière,", "et l'action", "la première", "sera", "au Nom", "de D.,", "et alors", "tout", "est entraîné", "après", "le début.", "[Yalkout Yossef", "sur", "les lois (de)", "le réveil", "matinal,", "édition", "5764,", "page", "92]."
    ]
  }
];

async function run() {
  let finalJson = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

  // Remove existing seifim 6 to 10 to avoid duplicates
  finalJson.halakhot = finalJson.halakhot.filter(h => parseInt(h.seif) < 6);

  for (let s of seifimTranslations) {
    const hebWords = s.hebreu.trim().split(' ');
    
    if (hebWords.length !== s.mots.length) {
      console.error(`Mismatch for Seif ${s.seif}: Hebrew has ${hebWords.length}, French has ${s.mots.length}`);
      process.exit(1);
    }
    
    // Call Nakdan for the entire string
    let nakdanRes;
    try {
       nakdanRes = await fetchNakdan(s.hebreu);
    } catch(e) {
       console.error("Failed to fetch nakdan:", e);
       process.exit(1);
    }
    
    let fullVowelledStr = nakdanRes.data.map(t => {
      if (t.sep) return t.str;
      if (t.nakdan && t.nakdan.options && t.nakdan.options.length > 0) return t.nakdan.options[0].w.replace(/\|/g, '');
      return t.str;
    }).join('');
    
    let vowelledWordsArray = fullVowelledStr.trim().split(' ');

    let wordsAlignes = [];
    for (let i = 0; i < hebWords.length; i++) {
        let rawWord = hebWords[i];
        let frWord = s.mots[i];
        
        let nakdanWord = vowelledWordsArray[i] || rawWord;
        let correctedVowels = applyKtivMaleVowels(rawWord, nakdanWord);
        
        // build context
        let contextStart = Math.max(0, i - 1);
        let contextEnd = Math.min(hebWords.length - 1, i + 1);
        let context = s.mots.slice(contextStart, contextEnd + 1).join(" ");
        
        wordsAlignes.push({
            id: i + 1,
            hebreu_brut: rawWord,
            hebreu_voyelles: correctedVowels,
            francais_mot: frWord,
            expression_contexte: context
        });
    }
    
    finalJson.halakhot.push({
        id: `p${s.seif}`,
        seif: s.seif,
        numero: s.seif,
        texte_integral: {
            hebreu_sans_voyelles: s.hebreu,
            hebreu_avec_voyelles: wordsAlignes.map(w => w.hebreu_voyelles).join(" "),
            francais: s.francaisGlobal
        },
        mots_alignes: wordsAlignes
    });
    
    console.log(`Seif ${s.seif} prepared successfully.`);
  }
  
  fs.writeFileSync(dataFile, JSON.stringify(finalJson, null, 2));
  console.log("Updated siman_1.json successfully!");
}

run();
