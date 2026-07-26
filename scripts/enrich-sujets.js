import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const TRANSLATIONS = {
  // Siman 1
  'הלכות השכמת הבוקר': 'Lois du réveil du matin',
  'סימן א - הלכות השכמת הבוקר': 'Lois du réveil du matin',
  'דיני תיקון חצות': 'Lois de la prière de minuit (Tikoun Hatsot)',

  // Siman 318
  'דין הנאה ממעשה שבת': 'Profiter d\'une action faite le Chabbat',
  'סימן שיח סעיף א\' - דין הנאה ממעשה שבת': 'Profiter d\'une action faite le Chabbat',
  'סימן שיח - דין הנאה ממעשה שבת': 'Profiter d\'une action faite le Chabbat',
  'דין הנאה מחשמל המיוצר בשבת': 'Profiter de l\'électricité produite le Chabbat',
  'הנאה ממעשה שבת - בדברים שיש בהם מחלוקת': 'Profiter du Chabbat — Cas de divergences d\'opinions',
  'הנאה ממעשה שבת - בדברים האסורים מדרבנן': 'Profiter du Chabbat — Interdits rabbiniques (Derabanan)',
  'הנאה ממעשה שבת - בדבר שלא נעשה איסור בגוף הדבר': 'Profiter du Chabbat — Sans infraction directe sur l\'aliment',
  'הנאה בימות החול מדברים שנעשו בשבת': 'Usage en semaine des actes accomplis le Chabbat',
  'סימן שיח סעיף ב - השוחט והמבשל לחולה': 'Abattage ritualisé et cuisson pour une personne malade',
  'השוחט והמבשל לחולה': 'Abattage ritualisé et cuisson pour une personne malade',
  'סימן שיח סעיף ג\' והלאה - דיני בישול בשבת': 'Règles générales de la cuisson le Chabbat',
  'סימן שיח - בישול בתולדות האש': 'Cuisson par une source issue du feu (Toldot HaEsh)',
  'בישול בתולדות האש': 'Cuisson par une source issue du feu (Toldot HaEsh)',
  'סימן שיח - בישול בחמה ותולדותיה': 'Cuisson par le soleil et ses dérivés (Hama)',
  'בישול בחמה ותולדותיה': 'Cuisson par le soleil et ses dérivés (Hama)',
  'סימן שיח - בישול בכלי ראשון': 'Cuisson dans un premier récipient (Kéli Rishon)',
  'בישול בכלי ראשון': 'Cuisson dans un premier récipient (Kéli Rishon)',
  'סימן שיח - עשיית תה בשבת': 'Préparation et service du thé le Chabbat',
  'עשיית תה בשבת': 'Préparation et service du thé le Chabbat',
  'סימן שיח - בישול אחר שרייה בכלי ראשון': 'Cuisson après trempage préalable dans un Kéli Rishon',
  'בישול אחר שרייה בכלי ראשון': 'Cuisson après trempage préalable dans un Kéli Rishon',
  'סימן שיח - דין בחישת תבשיל': 'Action de remuer ou mélanger un plat chaud',
  'דין בחישת תבשיל': 'Action de remuer ou mélanger un plat chaud',
  'סימן שיח - דין תתאה גבר': 'Règle du liquide inférieur prédominant (Tataa Gavar)',
  'דין תתאה גבר': 'Règle du liquide inférieur prédominant (Tataa Gavar)',
  'סימן שיח - דיני כלי שני': 'Lois du second récipient (Kéli Chéni)',
  'דיני כלי שני': 'Lois du second récipient (Kéli Chéni)',
  'סימן שיח - דין בישול אחר בישול': 'Principe de cuisson sur un plat déjà cuit (Bishul Ahar Bishul)',
  'דין בישול אחר בישול': 'Principe de cuisson sur un plat déjà cuit (Bishul Ahar Bishul)',
  'סימן שיח - בישול אחר אפייה וקליה': 'Cuisson liquide après cuisson au four ou grillage',
  'בישול אחר אפייה וקליה': 'Cuisson liquide après cuisson au four ou grillage',
  'סימן שיח סעיף ה - עשיית קפה בשבת': 'Préparation du café chaud le Chabbat',
  'עשיית קפה בשבת': 'Préparation du café chaud le Chabbat',
  'סימן שיח - עוד מדיני בישול': 'Compléments et cas particuliers des lois de cuisson',
  'עוד מדיני בישול': 'Compléments et cas particuliers des lois de cuisson'
};

function translateSujet(raw) {
  if (!raw) return 'Lois générales';
  if (TRANSLATIONS[raw]) return TRANSLATIONS[raw];
  const clean = raw.replace(/^סימן\s+[\u0590-\u05FF0-9\'\"\s-]+\s*-\s*/, '').trim();
  if (TRANSLATIONS[clean]) return TRANSLATIONS[clean];
  return clean || raw;
}

function cleanHeb(str) {
  return (str || '').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"'׳״\u05F3\u05F4]/g, '').trim();
}

function fixMotsAlignes(h) {
  const hebBrut = (h.texte_integral?.hebreu_sans_voyelles || '').trim();
  const hebVoyelles = (h.texte_integral?.hebreu_avec_voyelles || hebBrut).trim();

  const brutWords = hebBrut.split(/\s+/).filter(Boolean);
  const voyellesWords = hebVoyelles.split(/\s+/).filter(Boolean);
  let existing = [...(h.mots_alignes || [])];

  // Purge leading paragraph index if text doesn't start with it (e.g. "א.", "1.")
  if (existing.length > 0 && brutWords.length > 0) {
    const textStart = cleanHeb(brutWords[0]);
    const motStart = cleanHeb(existing[0].hebreu_brut);
    if (textStart !== motStart && /^[0-9א-ת]+$/.test(motStart)) {
      existing.shift();
    }
  }

  // Exact word matching to align translations
  let lastFindIndex = 0;
  const full = brutWords.map((bWord, idx) => {
    const targetClean = cleanHeb(bWord);
    let matchedItem = null;

    for (let i = lastFindIndex; i < existing.length; i++) {
      const candidateClean = cleanHeb(existing[i].hebreu_brut);
      if (candidateClean === targetClean || (targetClean.length > 1 && candidateClean.includes(targetClean))) {
        matchedItem = existing[i];
        lastFindIndex = i + 1;
        break;
      }
    }

    return {
      id: idx,
      hebreu_brut: bWord,
      hebreu_voyelles: voyellesWords[idx] || bWord,
      francais_mot: matchedItem ? (matchedItem.francais_mot || '') : '',
      expression_contexte: matchedItem ? (matchedItem.expression_contexte || '') : '',
      infinitif: matchedItem ? matchedItem.infinitif : null
    };
  });

  return full;
}

const files = [
  path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', 'siman_318.json'),
  path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', 'siman_1.json'),
  path.join(ROOT, 'public', 'data', 'siman_318.json'),
  path.join(ROOT, 'public', 'data', 'siman_1.json'),
  path.join(ROOT, 'public', 'data', 'yalkout-318.json'),
  path.join(ROOT, 'public', 'data', 'yalkout-1.json')
];

files.forEach(fp => {
  if (fs.existsSync(fp)) {
    try {
      const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
      let updated = 0;
      data.halakhot.forEach(h => {
        const rawSujet = h.sujet || 'Général';
        h.sujet_he = rawSujet;
        h.sujet_fr = translateSujet(rawSujet);
        h.mots_alignes = fixMotsAlignes(h);
        updated++;
      });
      fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf8');
      console.log('✅ Synchronisé', path.basename(fp), ':', updated, 'halakhot parfaitement réalignées!');
    } catch (e) {
      console.error('❌ Erreur sur', fp, e.message);
    }
  }
});
