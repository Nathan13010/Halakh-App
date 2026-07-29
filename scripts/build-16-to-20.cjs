const fs = require('fs');
const https = require('https');

const dataFile = 'public/data/siman_1.json';
const booksFile = 'src/data/books.js';

// Hebrew numbering for seifim 16-20
const HEB_NUMS = { "16": 'ט"ז.', "17": 'י"ז.', "18": 'י"ח.', "19": 'י"ט.', "20": 'כ.' };

const seifimData = [
  {
    seif: "16",
    hebreu_raw: 'ומכל מקום על האדם להסתיר ולהצניע את מעשיו הטובים ככל שיוכל. ששכר העובד את ה\' בסתר הוא על ידי הקדוש ברוך הוא עצמו, ושכר העושים בפרהסיא הוא על ידי המלאכים. [ילקוט יוסף על הלכות השכמת הבוקר, מהדורת תשס"ד, עמוד צט].',
    titre_seif: "Accomplir les Mitsvot en secret",
    francaisGlobal: "16. De toute façon, l'homme doit cacher et dissimuler ses bonnes actions autant qu'il le peut. Car la récompense de celui qui sert Dieu en secret est donnée par le Saint béni soit-Il Lui-même, tandis que la récompense de ceux qui agissent en public est donnée par les anges. [Yalkout Yossef sur les lois du réveil matinal, édition 5764, page 99].",
    mots: [
      "16.", "Et de toute façon", "de toute façon", "sur", "l'homme", "de cacher", "et de dissimuler", "(particule)", "ses actions", "les bonnes", "autant", "qu'il peut.", "Car la récompense (de)", "celui qui sert", "(particule)", "D.", "en secret", "est (lui)", "par", "l'intermédiaire (de)", "le Saint", "béni", "soit-Il", "Lui-même,", "et la récompense (de)", "ceux qui agissent", "en public", "est (elle)", "par", "l'intermédiaire (de)", "les anges.", "[Yalkout", "Yossef", "sur", "les lois (de)", "le réveil", "matinal,", "édition", "5764,", "page", "99]."
    ]
  },
  {
    seif: "17",
    hebreu_raw: 'העושה מצוה או דבר חסידות, ורוצה לשנות בדיבורו משום ענוה, או שלא יחשב כיוהרא, מותר לו לשנות, כדי לקיים והצנע לכת עם אלהיך. [ילקו"י שם עמוד קא. שאר"י ח"א עמ\' ד\'].',
    titre_seif: "Modifier ses paroles par humilité",
    francaisGlobal: "17. Celui qui accomplit une Mitsva ou un acte de piété, et qui souhaite modifier ses paroles par humilité, ou afin de ne pas paraître orgueilleux, il lui est permis de modifier, afin d'accomplir « et marche humblement avec ton Dieu ». [Yalkout Yossef là-bas, page 101. Che'ar Yossef tome 1, page 4].",
    mots: [
      "17.", "Celui qui fait", "une Mitsva", "ou", "un acte (de)", "piété,", "et il souhaite", "modifier", "dans ses paroles", "en raison de", "l'humilité,", "ou", "afin que ne (pas)", "il soit considéré", "comme orgueilleux,", "il est permis", "pour lui", "de modifier,", "afin", "d'accomplir", "et marche humblement", "marcher", "avec", "ton Dieu.", "[Yalkout Yossef", "là-bas", "page", "101.", "Che'ar Yossef", "tome 1", "page", "4]."
    ]
  },
  {
    seif: "18",
    hebreu_raw: 'קודם תפלת שחרית צריך אדם לקבל עליו אהבת ה\', ובזה מקיים "ובו תדבק", וכמו שאמרו חכמים ואתם הדבקים בה\' וגו\', וכי אפשר לו לאדם להידבק בשכינה, אלא הדבק במצוותיו. ולכן יקדיש את מחשבתו הראשונה להקב"ה, ואחר כך יהיו כל מעשיו לטובה. [ילקו"י שם עמוד קג].',
    titre_seif: "Accepter l'amour de Dieu avant la prière",
    francaisGlobal: "18. Avant la prière du matin, l'homme doit accepter sur lui l'amour de Dieu, et par cela il accomplit « et à Lui tu t'attacheras ». Et comme l'ont dit les Sages : « Et vous qui êtes attachés à Dieu etc. », est-il possible pour l'homme de s'attacher à la Présence Divine ? Mais plutôt, attache-toi à Ses commandements. C'est pourquoi il consacrera sa première pensée au Saint béni soit-Il, et ensuite toutes ses actions seront pour le bien. [Yalkout Yossef là-bas, page 103].",
    mots: [
      "18.", "Avant", "la prière (de)", "le matin (Cha'harit)", "doit", "l'homme", "accepter", "sur lui", "l'amour (de)", "D.,", "et par cela", "il accomplit", "\"et à Lui", "tu t'attacheras\",", "et comme ce", "qu'ont dit", "les Sages", "et vous", "les attachés", "à D.", "etc.,", "et est-ce (que)", "possible", "pour lui", "pour l'homme", "de s'attacher", "à la Présence Divine,", "mais plutôt", "attache-toi", "à Ses commandements.", "Et c'est pourquoi", "il consacrera", "(particule)", "sa pensée", "la première", "au Saint béni soit-Il,", "et après", "cela", "seront", "toutes", "ses actions", "pour le bien.", "[Yalkout Yossef", "là-bas", "page", "103]."
    ]
  },
  {
    seif: "19",
    hebreu_raw: 'נהגו לומר בכל בוקר קודם התפלה, "הריני מקבל עלי מצות עשה של ואהבת לרעך כמוך וכו\'". ועל ידי זה תפלתו תהיה כלולה בכלל תפלות כל ישראל, ותעשה פרי למעלה, אף שלא כיוון כל כך. [ועל ידי שיאהב את חבירו ממילא לא יגנוב את ממונו, לא יונהו בממון או בדברים, ולא ישיג גבולו, ולא יגרום נזק לממונו, ויקפיד בדברים שבין אדם לחבירו]. [ילקוט יוסף על הלכות השכמת הבוקר, עמ\' קד. ושם בהערה אריכות בענין מצוות שבין אדם לחבירו, ודברי מוסר לחיזוק המדות, וראה עוד בזה בסי\' נג].',
    titre_seif: "Aimer son prochain avant la prière",
    francaisGlobal: "19. On a pris l'habitude de dire chaque matin avant la prière : « J'accepte sur moi le commandement positif de tu aimeras ton prochain comme toi-même etc. ». Et grâce à cela, sa prière sera incluse dans l'ensemble des prières de tout Israël, et portera des fruits en Haut, même s'il n'a pas eu une intention parfaite. [Et grâce au fait qu'il aimera son prochain, de fait il ne volera pas son argent, ne le trompera pas en affaires ou en paroles, n'empiétera pas sur ses limites, ne causera pas de dommage à ses biens, et sera attentif aux choses entre l'homme et son prochain]. [Yalkout Yossef sur les lois du réveil matinal, page 104. Et là-bas en note une longue discussion sur les commandements entre l'homme et son prochain, des paroles de morale pour le renforcement des vertus, et voir encore à ce sujet au Siman 53].",
    mots: [
      "19.", "On a l'habitude", "de dire", "chaque", "matin", "avant", "la prière,", "\"Me voici", "acceptant", "sur moi", "le commandement (de)", "fais (positif)", "de", "et tu aimeras", "ton prochain", "comme toi-même", "etc.\".", "Et grâce à", "l'intermédiaire (de)", "cela", "sa prière", "sera", "incluse", "dans l'ensemble (de)", "les prières (de)", "tout", "Israël,", "et elle portera", "des fruits", "en Haut,", "même", "s'il n'a pas", "eu l'intention (de)", "tout", "autant.", "[Et grâce à", "l'intermédiaire (de)", "le fait qu'il aimera", "(particule)", "son prochain", "de fait", "il ne", "volera (pas)", "(particule)", "son argent,", "il ne", "le trompera (pas)", "en argent", "ou", "en paroles,", "et il ne", "empiétera (pas)", "sur ses limites,", "et il ne", "causera (pas)", "de dommage", "à ses biens,", "et il sera attentif", "aux choses", "qui sont entre", "l'homme", "et son prochain].", "[Yalkout", "Yossef", "sur", "les lois (de)", "le réveil", "matinal,", "page", "104.", "Et là-bas", "en note", "une longue discussion", "au sujet (de)", "les commandements", "qui sont entre", "l'homme", "et son prochain,", "et des paroles (de)", "morale", "pour le renforcement (de)", "les vertus,", "et voir", "encore", "à ce sujet", "au Siman", "53]."
    ]
  },
  {
    seif: "20",
    hebreu_raw: 'טוב מעט תחנונים בכוונה מהרבות בלא כוונה. [ולכן מי שיש לו אונס שאינו יכול להאריך בתחנונים, וממעט בהם ואומרם בכוונה, נחשב לפני הקדוש ברוך הוא כמו אותו שיש לו פנאי ומאריך בתחנונים בכוונה]. ואחד המרבה ואחד הממעיט ובלבד שיכוין לבו לשמים. ואמנם כל מי שבידו האפשרות להרבות בתורה ובמצוות, לא שייך לומר בו אחד המרבה ואחד הממעיט וכו\'. ומה שמצינו תלמידי חכמים שישנים בלילה היטב, וכן מרבים באכילה ושתיה, עושים כן כדי שיהיה להם כח ללמוד תורה בעיון, ובהבנה ישרה. ואותם המנדדים שינה מעיניהם, ואחר כך לומדים שלא בעומק העיון, אין זו הדרך הנכונה. [ילקוט יוסף על הלכות השכמת הבוקר, עמ\' קיא].',
    titre_seif: "Peu de supplications avec intention valent mieux que beaucoup sans",
    francaisGlobal: "20. Peu de supplications avec intention valent mieux que beaucoup sans intention. [C'est pourquoi, celui qui est contraint et ne peut pas s'étendre dans les supplications, et qui les réduit en les disant avec intention, est considéré devant le Saint béni soit-Il comme celui qui a du temps libre et s'étend dans les supplications avec intention]. Que l'on fasse beaucoup ou peu, pourvu que l'on dirige son cœur vers le Ciel. Cependant, quiconque a la possibilité de multiplier la Torah et les Mitsvot, on ne peut pas dire à son sujet « que l'on fasse beaucoup ou peu » etc. Et ce que l'on trouve que des Sages dormaient bien la nuit, et de même mangeaient et buvaient abondamment, ils faisaient ainsi afin d'avoir la force d'étudier la Torah en profondeur, et avec une compréhension juste. Et ceux qui chassent le sommeil de leurs yeux, et qui ensuite étudient sans profondeur d'analyse, ce n'est pas la bonne voie. [Yalkout Yossef sur les lois du réveil matinal, page 111].",
    mots: [
      "20.", "Peu (de)", "quelques", "supplications", "avec intention", "est mieux que beaucoup", "sans", "intention.", "[Et c'est pourquoi", "celui qui", "il y a", "pour lui", "une contrainte", "qu'il ne (peut)", "il ne peut (pas)", "s'étendre", "dans les supplications,", "et il réduit", "en eux (les)", "et il les dit", "avec intention,", "il est considéré", "devant", "le Saint", "béni", "soit-Il", "comme", "celui", "qui a", "pour lui", "du temps libre", "et qui s'étend", "dans les supplications", "avec intention].", "Et l'un", "qui multiplie", "et l'un", "qui réduit", "et pourvu que", "il dirige", "son cœur", "vers le Ciel.", "Et cependant", "tout", "celui qui", "en sa main (est)", "la possibilité", "de multiplier", "dans la Torah", "et dans les Mitsvot,", "il n'est pas", "possible", "de dire", "à son sujet", "l'un", "qui multiplie", "et l'un", "qui réduit", "etc.", "Et ce", "que l'on trouve (de)", "des disciples (de)", "des Sages", "qui dorment", "la nuit", "bien,", "et de même", "ils multiplient", "dans la nourriture", "et la boisson,", "ils font", "ainsi", "afin", "qu'il y ait", "pour eux", "la force", "d'étudier", "la Torah", "en profondeur,", "et avec une compréhension", "juste.", "Et ceux (qui)", "chassent", "le sommeil", "de leurs yeux,", "et après", "cela", "ils étudient", "sans", "la profondeur (de)", "l'analyse,", "il n'y a pas", "ceci (est)", "la voie", "la bonne.", "[Yalkout", "Yossef", "sur", "les lois (de)", "le réveil", "matinal,", "page", "111]."
    ]
  }
];

async function fetchNakdan(text) {
  const payload = JSON.stringify({
    task: "nakdan",
    data: text,
    addmorph: false,
    keepqq: true,
    matchpartial: true,
    useTokenization: true,
    genre: "rabbinic"
  });

  return new Promise((resolve, reject) => {
    const req = https.request('https://nakdan-2-0.loadbalancer.dicta.org.il/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function applyKtivMale(rawWord, vowelledWord) {
  if (rawWord.includes('\u05D5') && vowelledWord.includes('\u05BB')) {
    return vowelledWord.replace(/\u05BB/g, '\u05D5\u05BC');
  }
  return vowelledWord;
}

async function run() {
  let finalJson = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

  // Remove existing seifim 16-20 to avoid duplicates
  finalJson.halakhot = finalJson.halakhot.filter(h => parseInt(h.seif) < 16 || parseInt(h.seif) > 20);

  for (const s of seifimData) {
    // Prepend Hebrew numbering
    const fullHebreu = HEB_NUMS[s.seif] + ' ' + s.hebreu_raw;
    const hebWords = fullHebreu.trim().split(' ');

    if (hebWords.length !== s.mots.length) {
      console.error("MISMATCH Seif " + s.seif + ": Hebrew=" + hebWords.length + " French=" + s.mots.length);
      console.error("Hebrew words:", hebWords);
      console.error("French words:", s.mots);
      process.exit(1);
    }

    // Fetch Nakdan
    let nakdanRes;
    try { nakdanRes = await fetchNakdan(fullHebreu); }
    catch(e) { console.error("Nakdan API error:", e); process.exit(1); }

    // Reconstruct vowelled string (handling sep tokens)
    let fullVowelledStr = nakdanRes.data.map(t => {
      if (t.sep) return t.str;
      if (t.nakdan && t.nakdan.options && t.nakdan.options.length > 0) {
        return t.nakdan.options[0].w;
      }
      return t.str;
    }).join('');

    // CRITICAL: Remove pipes inserted by Nakdan
    fullVowelledStr = fullVowelledStr.replace(/\|/g, '');

    // Clean trailing dot artifacts
    fullVowelledStr = fullVowelledStr.replace(/ \. \./g, '.').replace(/\.\s\./g, '.');
    let cleanHebreu = fullHebreu.replace(/ \. \./g, '.').replace(/\.\s\./g, '.');

    let vowelledWords = fullVowelledStr.trim().split(' ');

    // Build mots_alignes
    let wordsAlignes = [];
    for (let i = 0; i < hebWords.length; i++) {
      let rawWord = hebWords[i];
      let frWord = s.mots[i];
      let nakdanWord = vowelledWords[i] || rawWord;

      // Apply Ktiv Male correction
      nakdanWord = applyKtivMale(rawWord, nakdanWord);

      // Context (surrounding words)
      let ctxStart = Math.max(0, i - 1);
      let ctxEnd = Math.min(hebWords.length - 1, i + 1);
      let context = s.mots.slice(ctxStart, ctxEnd + 1).join(" ");

      wordsAlignes.push({
        id: i + 1,
        hebreu_brut: rawWord,
        hebreu_voyelles: nakdanWord,
        francais_mot: frWord,
        expression_contexte: context
      });
    }

    // Post-Nakdan audit: known historical corrections
    wordsAlignes.forEach(m => {
      if (m.hebreu_voyelles.includes("\u05DE\u05B8\u05E9\u05C1\u05B4\u05D9\u05E0\u05B8\u05D4")) m.hebreu_voyelles = m.hebreu_voyelles.replace("\u05DE\u05B8\u05E9\u05C1\u05B4\u05D9\u05E0\u05B8\u05D4", "\u05DE\u05B4\u05E9\u05BC\u05C1\u05B5\u05E0\u05B8\u05D4");
      if (m.hebreu_voyelles.includes("\u05DB\u05B0\u05E9\u05C1\u05B4\u05E2\u05D5\u05BC\u05E8")) m.hebreu_voyelles = m.hebreu_voyelles.replace("\u05DB\u05B0\u05E9\u05C1\u05B4\u05E2\u05D5\u05BC\u05E8", "\u05DB\u05B0\u05E9\u05C1\u05B6\u05D9\u05BC\u05B5\u05E2\u05D5\u05B9\u05E8");
      if (m.hebreu_voyelles.includes("\u05E9\u05C1\u05B5\u05D9\u05B0\u05E0\u05B8\u05D4")) m.hebreu_voyelles = m.hebreu_voyelles.replace("\u05E9\u05C1\u05B5\u05D9\u05B0\u05E0\u05B8\u05D4", "\u05E9\u05C1\u05B5\u05E0\u05B8\u05D4");
    });

    finalJson.halakhot.push({
      id: "p" + s.seif,
      numero: s.seif,
      sujet: "\u05D4\u05DC\u05DB\u05D5\u05EA \u05D4\u05E9\u05DB\u05DE\u05EA \u05D4\u05D1\u05D5\u05E7\u05E8",
      sujet_fr: "Lois du r\u00E9veil du matin",
      seif: s.seif,
      titre_seif: s.titre_seif,
      texte_integral: {
        hebreu_sans_voyelles: cleanHebreu,
        hebreu_avec_voyelles: fullVowelledStr,
        francais: s.francaisGlobal
      },
      mots_alignes: wordsAlignes
    });

    console.log("Seif " + s.seif + " OK (" + hebWords.length + " words aligned)");
  }

  fs.writeFileSync(dataFile, JSON.stringify(finalJson, null, 2));
  console.log("siman_1.json updated.");

  // Update books.js fallback
  const booksContent = fs.readFileSync(booksFile, 'utf8');
  const updatedBooks = booksContent.replace(
    /export const FALLBACK_PARAGRAPHS = \[[\s\S]*?\];/,
    'export const FALLBACK_PARAGRAPHS = ' + JSON.stringify(finalJson.halakhot, null, 2) + ';'
  );
  fs.writeFileSync(booksFile, updatedBooks);
  console.log("books.js updated.");
}

run();
