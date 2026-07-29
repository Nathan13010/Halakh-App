import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const OUT1 = path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', 'siman_12.json');
const OUT2 = path.join(ROOT, 'public', 'data', 'siman_12.json');
const OUT3 = path.join(ROOT, 'public', 'data', 'yalkout-12.json');

const raw12Seifim = [
  {
    seif: "1",
    titre_seif: "Fils cassés d'un seul côté et mesure du nœud coulant (Kedei Anivah)",
    brut: "א. אם נקרעו כל חוטי הציצית ונשתייר בהם כדי עניבת כל החוטים הפסוקים ביחד, כשר. ואם לא נשאר כדי עניבה פסול. ובודקים מן הענף, כלומר החוטים המפורדים. ולפי מנהגינו בעת שנותנים את הציצית על כנף הבגד, נותנים סימן בד' ראשי חוטים בענין שלעולם הד' הראשים הם מצד אחד של הקשר, והד' ראשים מצד האחר, לפיכך אם נקרעו חוטי הציצית מצד אחד, אפילו נקרעו כל ארבעת החוטים שמצד אחד, ולא נשאר בהם שיעור כדי עניבה, אפילו הכי הטלית כשרה, לפי שנשארו כל ד' הראשים השניים שיש בהם יותר מכדי עניבה. ואפילו לא נשאר בהם אלא כדי עניבת שמונה החוטים ביחד כשר. ואם נפסק החוט מעיקרו, דהיינו במקום שהציציות מחוברים לטלית בכנף, הטלית פסולה.",
    voyelles: "א. אִם נִקְרְעוּ כָּל חוּטֵי הַצִּיצִית וְנִשְׁתַּיֵּר בָּהֶם כְּדֵי עֲנִיבַת כָּל הַחוּטִים הַפְּסוּקִים בְּיַחַד, כָּשֵׁר. וְאִם לֹא נִשְׁאַר כְּדֵי עֲנִיבָה פָּסוּל. וּבוֹדְקִים מִן הָעָנָף. וּלְפִי מִנְהָגֵינוּ בְּעֵת שֶׁנּוֹתְנִים אֶת הַצִּיצִית עַל כָּנָף הַבֶּגֶד, נּוֹתְנִים סִימָן בְּד' רָאשֵׁי חוּטִים, לְפִיכָךְ אִם נִקְרְעוּ חוּטֵי הַצִּיצִית מִצַּד אֶחָד, אֲפִלּוּ נִקְרְעוּ כָּל אַרְבַּעַת הַחוּטִים, הַטַּלִּית כְּשֵׁרָה.",
    francais: "1. Si tous les fils de Tsitsit se sont cassés mais qu'il subsiste une longueur suffisante pour réaliser un nœud coulant (Kedei Anivah, soit environ 4 cm) réunissant l'ensemble des fils rompus, le Tsitsit demeure kasher. S'il n'en reste pas cette mesure, il est invalide. Selon notre coutume, au moment d'insérer le Tsitsit au coin du vêtement, on identifie clairement les 4 brins d'un côté du nœud et les 4 brins de l'autre côté ; par conséquent, si les 4 brins d'un même côté sont cassés ras sans Kedei Anivah, le Tallit reste kasher car les 4 autres brins opposés sont intacts et entiers."
  },
  {
    seif: "2",
    titre_seif: "Deux fils rompus de part et d'autre du nœud",
    brut: "ב. אם נפסקו ב' חוטים משני צדדים הציצית פסולה, דחיישינן שמא חוט אחד הם. ואם אין לו אפשרות להשיג ציציות אחרות, בשעת הדחק יכול להקל אם נשאר מן הגדיל כדי עניבה.",
    voyelles: "ב. אִם נִפְסְקוּ ב' חוּטִים מִשְּׁנֵי צְדָדִים הַצִּיצִית פְּסוּלָה, דְּחָיְשִׁינַן שֶׁמָּא חוּט אֶחָד הֵם. וְאִם אֵין לוֹ אֶפְשָׁרוּת לְהַשִּׂיג צִיצִיּוֹת אַחֲרוֹת, בִּשְׁעַת הַדְּחָק יָכוֹל לְהָקֵל.",
    francais: "2. Si deux fils sont rompus de deux côtés différents du nœud, le Tsitsit est invalide, car nous craignons qu'il ne s'agisse des deux extrémités d'un seul et même fil. S'il n'a aucune possibilité de se procurer d'autres Tsitsiot, il pourra faire preuve d'indulgence en cas de force majeure s'il reste une mesure de Kedei Anivah."
  },
  {
    seif: "3",
    titre_seif: "Remplacement recommandé des franges abîmées",
    brut: "ג. היכא דאפשר טוב ונכון לחוש ולהחליף את הציציות שנקרעו, אף אם הן כשרות לפי ההלכה, דודאי מנין החוטים יש בו ענין וסוד נשגב.",
    voyelles: "ג. הֵיכָא דְּאֶפְשָׁר טוֹב וְנָכוֹן לָחוּשׁ וּלְהַחְלִיף אֶת הַצִּיצִיּוֹת שֶׁנִּקְרְעוּ, אַף אִם הֵן כְּשֵׁרוֹת לְפִי הַהֲלָכָה, דְּוַדַּאי מִנְיַן הַחוּטִים יֵשׁ בּוֹ עִנְיָן וְסוֹד נִשְׂגָּב.",
    francais: "3. Chaque fois que cela est possible, il est bon et recommandé de remplacer des Tsitsiot abîmées ou déchirées, même si elles sont encore valides selon la stricte Halakha, car le nombre exact des fils renferme une intention et un secret spirituel élevé."
  }
];

const DICT = {
  "אם": { fr: "Si", context: "Si" },
  "נקרעו": { fr: "Se sont cassés / déchirés", context: "Se sont cassés", infinitif: "לְהִקָּרַע = Se déchirer" },
  "כל": { fr: "Tous / Tout", context: "Tous" },
  "חוטי": { fr: "Fils de", context: "Fils de" },
  "הציצית": { fr: "Le Tsitsit", context: "Le Tsitsit" },
  "ונשתייר": { fr: "Et qu'il reste", context: "Et qu'il reste", infinitif: "לְהִשָּׁאֵר = Rester" },
  "בהם": { fr: "En eux", context: "En eux" },
  "כדי": { fr: "La mesure de / Afin", context: "La mesure de" },
  "עניבת": { fr: "Un nœud coulant de", context: "Nœud coulant" },
  "הפסוקים": { fr: "Rompus / Cassés", context: "Rompus" },
  "ביחד": { fr: "Ensemble", context: "Ensemble" },
  "כשר": { fr: "Kasher", context: "Kasher" },
  "ואם": { fr: "Et si", context: "Et si" },
  "לֹא": { fr: "Ne pas", context: "Ne pas" },
  "נשאר": { fr: "Est resté", context: "Est resté" },
  "פסול": { fr: "Invalide (Passoul)", context: "Invalide" },
  "ובודקים": { fr: "Et l'on vérifie", context: "Et l'on vérifie", infinitif: "לִבְדֹּק = Vérifier" },
  "מן": { fr: "Depuis", context: "Depuis" },
  "הענף": { fr: "Les brins libres (Anaf)", context: "Les brins libres" },
  "מנהגנו": { fr: "Notre coutume", context: "Notre coutume" },
  "שנותנים": { fr: "Qu'on met / place", context: "Qu'on met" },
  "הבגד": { fr: "Le vêtement", context: "Le vêtement" },
  "סימן": { fr: "Un signe / repère", context: "Un repère" },
  "ראשי": { fr: "Extrémités de", context: "Extrémités de" },
  "הקשר": { fr: "Le nœud", context: "Le nœud" },
  "לפיכך": { fr: "Par conséquent", context: "Par conséquent" },
  "ארבעת": { fr: "Les quatre", context: "Les quatre" },
  "הטלית": { fr: "Le Tallit", context: "Le Tallit" },
  "כשרה": { fr: "Kasher", context: "Kasher" },
  "שנשארו": { fr: "Car sont restés", context: "Car sont restés" },
  "השניים": { fr: "Les deux / opposés", context: "Les opposés" },
  "שמונה": { fr: "Huit", context: "Huit" },
  "נפסק": { fr: "S'est rompu", context: "S'est rompu", infinitif: "לְהִפָּסֵק = Se rompre" },
  "מעיקרו": { fr: "Depuis sa base", context: "Depuis sa base" },
  "במקום": { fr: "À l'endroit où", context: "À l'endroit où" },
  "מחוברים": { fr: "Raccordés / Attachés", context: "Raccordés" },
  "פסולה": { fr: "Invalide", context: "Invalide" },
  "נפסקו": { fr: "Se sont rompus", context: "Se sont rompus" },
  "שני": { fr: "Deux", context: "Deux" },
  "צדדים": { fr: "Côtés", context: "Côtés" },
  "שמא": { fr: "De peur que", context: "De peur que" },
  "אחד": { fr: "Un seul", context: "Un seul" },
  "הם": { fr: "Ils sont", context: "Ils sont" },
  "אפשרות": { fr: "Possibilité", context: "Possibilité" },
  "להשיג": { fr: "D'obtenir", context: "D'obtenir", infinitif: "לְהַשִּׂיג = Obtenir" },
  "בבשעת": { fr: "Au moment de", context: "Au moment de" },
  "הדחק": { fr: "La force majeure", context: "La force majeure" },
  "להקל": { fr: "Faire preuve d'indulgence", context: "Faire preuve d'indulgence", infinitif: "לְהָקֵל = Alléger / Être indulgent" },
  "הגדיל": { fr: "La partie nouée (Guedil)", context: "Guedil" },
  "היכא": { fr: "Où / Chaque fois que (Araméen)", context: "Chaque fois que" },
  "דאפשר": { fr: "C'est possible", context: "C'est possible" },
  "טוב": { fr: "Bon", context: "Bon" },
  "ונכון": { fr: "Et recommandé", context: "Et recommandé" },
  "להחליף": { fr: "De remplacer", context: "De remplacer", infinitif: "לְהַחְלִיף = Remplacer" },
  "את": { fr: "[Particule COD]", context: "[Accusatif]" },
  "לפי": { fr: "Selon", context: "Selon" },
  "ההלכה": { fr: "La Halakha", context: "La Halakha" },
  "מנין": { fr: "Le compte / nombre", context: "Le compte" },
  "עניין": { fr: "Une portée / idée", context: "Une portée" },
  "וסוד": { fr: "Et un secret", context: "Et un secret" },
  "נשגב": { fr: "Élevé / Sublime", context: "Élevé" }
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
    sujet: "דברים הפוסלים בציצית",
    sujet_fr: "Lois des facteurs invalidants du Tsitsit",
    titre_seif: item.titre_seif,
    texte_integral: {
      hebreu_sans_voyelles: item.brut,
      hebreu_avec_voyelles: item.voyelles,
      francais: item.francais
    },
    mots_alignes
  };
}

const halakhot = raw12Seifim.map(processSeif);

const outputObj = {
  siman: "12",
  halakhot
};

const jsonStr = JSON.stringify(outputObj, null, 2);

fs.mkdirSync(path.dirname(OUT1), { recursive: true });
fs.writeFileSync(OUT1, jsonStr, 'utf8');
fs.writeFileSync(OUT2, jsonStr, 'utf8');
fs.writeFileSync(OUT3, jsonStr, 'utf8');

console.log(`✅ Official www.yalkut.info Siman 12 built with ${halakhot.length} Seifim across all 3 data paths!`);
