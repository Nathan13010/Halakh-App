const fs = require('fs');

const seifimTranslations = [
  {
    seif: "11",
    hebreu: `י"א. קטן היודע לדבר, טוב ונכון להרגילו לומר בקומו משנתו, "מודה אני לפניך וכו'". ולחנכו ליטול ידיו. [ילקוט יוסף על הלכות השכמת הבוקר, מהדורת תשס"ד, עמוד צג].`,
    francaisGlobal: "11. Pour un enfant mineur qui sait parler, il est bon et juste de l'habituer à dire en se levant de son sommeil : « Modé Ani Lefanékha etc. ». Et de l'éduquer à se laver les mains. [Yalkout Yossef sur les lois du réveil matinal, édition 5764, page 93].",
    mots: [
      "11.", "Un mineur", "qui sait", "parler,", "il est bon", "et juste", "de l'habituer", "à dire", "en se levant", "de son sommeil,", "\"Je reconnais", "moi", "devant Toi", "etc.\".", "Et de l'éduquer", "à laver", "ses mains.", "[Yalkout", "Yossef", "sur", "les lois (de)", "le réveil", "matinal,", "édition", "5764,", "page", "93]."
    ]
  },
  {
    seif: "12",
    hebreu: `י"ב. מה שאמר דוד המלך ע"ה (תהלים טז, ח): "שויתי ה' לנגדי תמיד", זה כלל גדול בתורה ובמעלות הצדיקים, ולכן על כל אחד לשים על לבו שהמלך הגדול הקדוש ברוך הוא, אשר מלא כל הארץ כבודו, עומד עליו ורואה במעשיו, וכמו שנאמר: "אם יסתר איש במסתרים ואני לא אראנו נאם ה'". ומיד יגיע אליו היראה וההכנעה מפני השם יתברך, ויבוש ממנו. [ילקו"י שם, מהדורת תשס"ד, עמ' צד].`,
    francaisGlobal: "12. Ce qu'a dit le Roi David, que la paix soit sur lui (Psaumes 16:8) : « J'ai placé Dieu devant moi constamment », est un grand principe dans la Torah et dans les vertus des justes. Par conséquent, chacun doit prendre à cœur que le grand Roi, le Saint béni soit-Il, dont la gloire remplit toute la terre, se tient au-dessus de lui et voit ses actions, comme il est dit : « Si un homme se cache dans des cachettes, ne le verrai-Je pas, dit l'Éternel ». Et immédiatement, la crainte et la soumission devant le Nom béni lui parviendront, et il aura honte devant Lui. [Yalkout Yossef là-bas, édition 5764, page 94].",
    mots: [
      "12.", "Ce", "qu'a dit", "David", "le Roi", "la paix soit sur lui", "(Psaumes", "16,", "8) :", "\"J'ai placé", "D.", "devant moi", "constamment\",", "ce (ci est)", "un principe", "grand", "dans la Torah", "et dans les vertus", "des justes,", "et par conséquent", "sur", "chaque", "un (chacun)", "de mettre", "sur", "son cœur", "que le Roi", "le grand", "le Saint", "béni", "soit-Il,", "que", "remplit", "toute", "la terre", "Sa gloire,", "se tient", "sur lui", "et voit", "dans ses actions,", "et comme ce", "qui est dit :", "\"Si", "se cachera", "un homme", "dans des cachettes", "et Moi", "ne (le) verrai-Je (pas)", "dit", "l'Éternel\".", "Et immédiatement", "arrivera", "à lui", "la crainte", "et la soumission", "de (devant)", "la face (de)", "le Nom", "qu'Il soit béni,", "et il aura honte", "de Lui.", "[Yalkout Yossef", "là-bas,", "édition", "5764,", "page", "94]."
    ]
  },
  {
    seif: "13",
    hebreu: `י"ג. הסגולות הנכונות לחיזוק האדם ביראת שמים, שיהיה מצוי הרבה בבית הכנסת ובבית המדרש. וכן לבקש שלום. ולהזהר לקיים מצות עשה של מפני שיבה תקום. וכן ליתן מעשר. וכן להיות נושא ונותן באמונה. [ילקו"י הל' השכמת הבוקר עמוד צו].`,
    francaisGlobal: "13. Les remèdes appropriés pour renforcer l'homme dans la crainte du Ciel sont : d'être présent fréquemment à la synagogue et à la maison d'étude. Et de même, de rechercher la paix. Et de faire attention à accomplir le commandement positif de « tu te lèveras devant les cheveux blancs ». Et de même, de donner la dîme. Et de même, de mener ses affaires avec honnêteté. [Yalkout Yossef, lois du réveil matinal, page 96].",
    mots: [
      "13.", "Les remèdes", "appropriés", "pour le renforcement (de)", "l'homme", "dans la crainte du", "Ciel,", "qu'il soit", "présent", "beaucoup (fréquemment)", "à la maison (de)", "l'assemblée (synagogue)", "et à la maison (de)", "l'étude.", "Et de même", "de rechercher", "la paix.", "Et de faire attention", "pour accomplir", "le commandement (de)", "fais (positif)", "de", "de (devant) la face", "des cheveux blancs", "tu te lèveras.", "Et de même", "de donner", "la dîme.", "Et de même", "d'être", "portant", "et donnant (négociant)", "avec foi (honnêteté).", "[Yalkout Yossef", "lois (de)", "le réveil", "matinal", "page", "96]."
    ]
  },
  {
    seif: "14",
    hebreu: `י"ד. כבר נתבאר [בסעיף א] שהמקיים את מצוות ה' אין לו להתבייש מפני בני אדם המלעיגים עליו, אך לא יתקוטט ויריב עמהם, גם כדי שלא יתרגל למדת העזות המגונה מאד. [ומה שכתבנו בסעיף א' שמותר להעיז פניו כדי להחזירם למוטב, זהו דוקא באופן שעשה הכל בדרכי נועם ולא הועיל]. [ילקו"י שם עמוד צח].`,
    francaisGlobal: "14. Il a déjà été expliqué [au paragraphe 1] que celui qui accomplit les commandements de Dieu ne doit pas avoir honte des personnes qui se moquent de lui, mais il ne doit pas se quereller et se disputer avec eux, afin de ne pas s'habituer au vilain défaut de l'effronterie. [Et ce que nous avons écrit au paragraphe 1 qu'il est permis d'être effronté afin de les ramener au bien, cela s'applique uniquement s'il a tout fait par des voies pacifiques et que cela n'a pas été utile]. [Yalkout Yossef là-bas, page 98].",
    mots: [
      "14.", "Déjà", "il a été expliqué", "[au paragraphe", "1]", "que celui qui accomplit", "(particule)", "les commandements (de)", "D.", "il n'y a pas", "pour lui", "de (à) avoir honte", "de la face (de)", "les enfants (de)", "homme (personnes)", "qui se moquent", "de lui,", "mais", "il ne", "se querellera (pas)", "et se disputera", "avec eux,", "aussi", "afin", "qu'il ne", "s'habitue (pas)", "au trait", "de l'effronterie", "méprisable", "beaucoup.", "[Et ce", "que nous avons écrit", "au paragraphe", "1", "qu'il est permis", "de rendre effrontée", "sa face", "afin", "de les faire revenir", "au bien,", "ceci est", "précisément", "de façon", "qu'il a fait", "tout", "par des voies (de)", "plaisir (pacifiques)", "et qu'il n'a pas", "été utile].", "[Yalkout Yossef", "là-bas", "page", "98]."
    ]
  },
  {
    seif: "15",
    hebreu: `ט"ו. הדר במקום של גוים, ואם ילך ברחוב לבית הכנסת כשהוא מעוטר בטלית ותפילין, הדבר יעורר את רוגזם של הגויים, ראוי לו להמנע מכך. [ילקו"י שם עמוד צט].`,
    francaisGlobal: "15. Celui qui habite dans un endroit de non-Juifs, et que s'il marche dans la rue vers la synagogue en étant couronné du talit et des tefilin, la chose éveillera la colère des non-Juifs, il convient pour lui de s'abstenir de cela. [Yalkout Yossef là-bas, page 99].",
    mots: [
      "15.", "Celui qui habite", "dans un endroit", "de", "non-Juifs,", "et si", "il marche", "dans la rue", "vers la maison (de)", "l'assemblée (synagogue)", "quand il est", "couronné", "du talit", "et des tefilin,", "la chose", "éveillera", "(particule)", "la colère", "de", "les non-Juifs,", "il convient", "pour lui", "de s'abstenir", "de cela.", "[Yalkout Yossef", "là-bas", "page", "99]."
    ]
  }
];

const dataFile = 'public/data/siman_1.json';
const booksFile = 'src/data/books.js';

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
    const https = require('https');
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
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function applyKtivMaleVowels(rawWord, vowelledWord) {
  if (rawWord.includes('ו') && vowelledWord.includes('ֻ')) {
    return vowelledWord.replace(/ֻ/g, 'וּ');
  }
  return vowelledWord;
}

const TITLES = {
  "11": "Le Modé Ani pour les enfants",
  "12": "Garder Dieu à l'esprit en permanence",
  "13": "Ségoulot pour renforcer la crainte du Ciel",
  "14": "Ne pas se quereller avec les moqueurs",
  "15": "Porter le Talit et les Téfilines en public"
};

async function run() {
  let finalJson = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

  // Remove existing seifim 11 to 15 to avoid duplicates
  finalJson.halakhot = finalJson.halakhot.filter(h => parseInt(h.seif) < 11);

  for (let s of seifimTranslations) {
    const hebWords = s.hebreu.trim().split(' ');
    
    if (hebWords.length !== s.mots.length) {
      console.error("Mismatch for Seif " + s.seif + ": Hebrew has " + hebWords.length + ", French has " + s.mots.length);
      console.error(hebWords);
      console.error(s.mots);
      process.exit(1);
    }

    let nakdanRes;
    try {
       nakdanRes = await fetchNakdan(s.hebreu);
    } catch(e) {
       console.error("Failed to fetch nakdan:", e);
       process.exit(1);
    }
    
    let fullVowelledStr = nakdanRes.data.map(t => {
      if (t.sep) return t.str;
      if (t.nakdan && t.nakdan.options && t.nakdan.options.length > 0) return t.nakdan.options[0].w.replace(/\\|/g, '');
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

    // Manual audit post-Nakdan
    wordsAlignes.forEach(m => {
       if (m.hebreu_voyelles.includes("כְּשִׁעוּר")) m.hebreu_voyelles = m.hebreu_voyelles.replace("כְּשִׁעוּר", "כְּשֶׁיֵּעוֹר");
       if (m.hebreu_voyelles.includes("הֶעֱבִירָהּ")) m.hebreu_voyelles = m.hebreu_voyelles.replace("הֶעֱבִירָהּ", "הָעֲבֵרָה");
       if (m.hebreu_voyelles.includes("מָשִׁינָה")) m.hebreu_voyelles = m.hebreu_voyelles.replace("מָשִׁינָה", "מִשֵּׁנָה");
       if (m.hebreu_voyelles.includes("בְּשֶׁיָּנָתַם")) m.hebreu_voyelles = m.hebreu_voyelles.replace("בְּשֶׁיָּנָתַם", "בִּשְׁנָתָם");
       if (m.hebreu_voyelles.includes("שֵׁיְנָה")) m.hebreu_voyelles = m.hebreu_voyelles.replace("שֵׁיְנָה", "שֵׁנָה");
    });
    
    // Update trailing dot bug
    fullVowelledStr = fullVowelledStr.replace(/ \. \./g, '.').replace(/\.\s\./g, '.');
    let fullHebrewStr = s.hebreu.replace(/ \. \./g, '.').replace(/\.\s\./g, '.');

    finalJson.halakhot.push({
      id: "p" + s.seif,
      numero: s.seif,
      sujet: "הלכות השכמת הבוקר",
      sujet_fr: "Lois du réveil du matin",
      seif: s.seif,
      titre_seif: TITLES[s.seif],
      texte_integral: {
        hebreu_sans_voyelles: fullHebrewStr,
        hebreu_avec_voyelles: fullVowelledStr,
        francais: s.francaisGlobal
      },
      mots_alignes: wordsAlignes
    });
    
    console.log("Seif " + s.seif + " prepared successfully.");
  }

  fs.writeFileSync(dataFile, JSON.stringify(finalJson, null, 2));
  console.log("Updated siman_1.json successfully!");

  // Update books.js
  const booksContent = fs.readFileSync(booksFile, 'utf8');
  const updatedBooks = booksContent.replace(/export const FALLBACK_PARAGRAPHS = \[[\\s\\S]*?\];/, 'export const FALLBACK_PARAGRAPHS = ' + JSON.stringify(finalJson.halakhot, null, 2) + ';');
  fs.writeFileSync(booksFile, updatedBooks);
  console.log("Updated books.js successfully!");
}

run();
