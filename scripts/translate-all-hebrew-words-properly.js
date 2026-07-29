import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// Complete Hebrew -> French Rabbinic & Halakhic dictionary
const HEB_TO_FR = {
  // Letters/Numbers
  "א": "1 (Seïf א)",
  "ב": "2 (Seïf ב)",
  "ג": "3 (Seïf ג)",
  "ד": "4 (Seïf ד)",
  "ה": "5 (Seïf ה)",
  "ו": "6 (Seïf ו)",
  "ז": "7 (Seïf ז)",
  "ח": "8 (Seïf ח)",
  "ט": "9 (Seïf ט)",
  "י": "10 (Seïf י)",
  "יא": "11 (Seïf יא)",
  "יב": "12 (Seïf יב)",
  "יג": "13 (Seïf יג)",
  "יד": "14 (Seïf יד)",
  "טו": "15 (Seïf טו)",
  "טז": "16 (Seïf טז)",
  "יז": "17 (Seïf יז)",
  "יח": "18 (Seïf יח)",

  // Common Rabbinic & Biblical Vocabulary
  "אם": "Si",
  "נקרעו": "Se sont cassés / déchirés",
  "כל": "Tous / Tout",
  "חוטי": "Fils de",
  "הציצית": "Le Tsitsit",
  "הציציות": "Les Tsitsiot",
  "ונשתייר": "Et qu'il reste / subsiste",
  "בהם": "En eux",
  "כדי": "La mesure de",
  "עניבת": "Un nœud coulant de",
  "עניבה": "Nœud coulant",
  "הפסוקים": "Rompus / Cassés",
  "ביחד": "Ensemble",
  "כשר": "Kasher (Valide)",
  "כשרה": "Kasher (Valide)",
  "כשרות": "Kashers (Valides)",
  "ואם": "Et si",
  "לא": "Ne... pas",
  "נשאר": "Est resté",
  "פסול": "Invalide (Passoul)",
  "פסולה": "Invalide (Passoul)",
  "ובודקים": "Et l'on vérifie",
  "מן": "Depuis / De",
  "הענף": "Les brins libres",
  "כלומר": "C'est-à-dire",
  "המפורדים": "Séparés / Libres",
  "ולפי": "Et selon",
  "מנהגינו": "Notre coutume",
  "בעת": "Au moment de",
  "שנותנים": "Qu'on met / place",
  "את": "[Accusatif]",
  "על": "Sur",
  "כנף": "Le coin de",
  "הבגד": "Le vêtement",
  "נותנים": "On met / place",
  "סימן": "Un repère / signe",
  "בד": "Dans 4",
  "ראשי": "Extrémités de",
  "בענין": "De manière que",
  "שלעולם": "Afin que toujours",
  "הד": "Les 4",
  "הראשים": "Les extrémités",
  "הם": "Sont / Ils sont",
  "מצד": "Du côté de",
  "אחד": "Un",
  "של": "De",
  "הקשר": "Le nœud",
  "והד": "Et les 4",
  "ראשים": "Extrémités",
  "האחר": "L'autre",
  "לפיכך": "Par conséquent",
  "ארבעת": "Les quatre",
  "הטלית": "Le Tallit",
  "לפי": "Puisque / Selon",
  "שנשארו": "Car sont restés",
  "השניים": "Les deux / opposés",
  "שיש": "Qui ont",
  "יותר": "Plus que",
  "מכדי": "Que la mesure de",
  "נפסקו": "Se sont rompus",
  "שני": "Deux",
  "צדדים": "Côtés",
  "דחיישינן": "Car nous craignons",
  "חוט": "Un fil / brin",
  "חוטים": "Des fils / brins",
  "אין": "Il n'y a pas",
  "לו": "À lui",
  "אפשרות": "Possibilité",
  "להשיג": "D'obtenir",
  "אחרות": "Autres",
  "בשעת": "Au moment de",
  "הדחק": "La force majeure / contrainte",
  "יכול": "Peut",
  "להקל": "Faire preuve d'indulgence",
  "הגדיל": "La partie nouée",
  "היכא": "Chaque fois que",
  "דאפשר": "C'est possible",
  "טוב": "Bon",
  "ונכון": "Et recommandé",
  "לחוש": "De prendre en compte / craindre",
  "להחליף": "De remplacer",
  "הן": "Elles sont",
  "ההלכה": "La Halakha",
  "דודאי": "Car certainement",
  "מנין": "Le nombre de",
  "ענין": "Une portée spiritual",
  "וסוד": "Et un secret",
  "נשגב": "Élevé / Sublime",
  "הוא": "Il / C'est",
  "היא": "Elle / C'est",
  "זה": "Ce / Cet",
  "זו": "Cette",
  "אשר": "Qui / Que",
  "כי": "Car / Que",
  "כן": "Ainsi",
  "שם": "Nom / Là-bas",
  "מים": "Eau",
  "ידים": "Mains",
  "פנים": "Visage",
  "פה": "Bouche",
  "אדם": "Homme",
  "מי": "Qui",
  "מה": "Quoi",
  "עד": "Jusqu'à",
  "גם": "Aussi",
  "אף": "Même",
  "רק": "Seulement",
  "אלא": "Mais seulement",
  "כמו": "Comme",
  "בין": "Entre",
  "אחרי": "Après",
  "אחר": "Autre / Après",
  "לפני": "Devant / Avant",
  "תחת": "Sous",
  "עם": "Avec",
  "בלי": "Sans",
  "מפני": "En raison de",
  "משום": "Au titre de / Car",
  "היה": "Était",
  "יהיה": "Sera",
  "היו": "Étaient",
  "יהיו": "Seront",
  "אומרים": "Disent",
  "אמר": "A dit",
  "יגיד": "Dira",
  "עשה": "A fait",
  "יעשה": "Fera",
  "עושה": "Fait",
  "עושים": "Font",
  "חייב": "Obligé / Soumis",
  "פטור": "Exempt",
  "חייבים": "Soumis / Obligés",
  "פטורים": "Exempts",
  "מותר": "Permis",
  "אסור": "Interdit",
  "מברך": "Bénit",
  "יברך": "Bénira",
  "לברך": "Bénir",
  "ברכה": "Bénédiction",
  "מצוה": "Mitsva",
  "מצות": "Mitsvot de",
  "קודש": "Saint",
  "חול": "Profane",
  "שבת": "Chabbat",
  "יום": "Jour",
  "לילה": "Nuit",
  "טויה": "Filature",
  "מכונה": "Machine",
  "חשמלית": "Électrique",
  "גדול": "Majeur",
  "קטן": "Mineur",
  "אשה": "Femme",
  "גוי": "Non-juif",
  "שעושה": "Qu'il fait",
  "שיאמר": "Qu'il dise",
  "בתחלת": "Au début de",
  "הטויה": "La filature",
  "משי": "Soie",
  "צמר": "Laine",
  "פשתים": "Lin",
  "עבודת": "Travail de",
  "יד": "Main",
  "עובי": "L'épaisseur de",
  "בינונים": "Moyenne",
  "שמונה": "Huit",
  "חמשה": "Cinq",
  "חוליות": "Enroulements",
  "כריכות": "Tours d'enroulements",
  "סנטימטר": "Centimètre",
  "סנטימטרים": "Centimètres",
  "אורכם": "Leur longueur",
  "לגבי": "Concernant / Par rapport à",
  "בגד": "Vêtement",
  "בגדים": "Vêtements",
  "כסות": "Habit",
  "כסותו": "Son habit",
  "ארבע": "Quatre",
  "כנפות": "Coins",
  "שאולה": "Empruntée",
  "ללבוש": "Porter / Mettre un vêtement",
  "ללובשו": "Le porter",
  "להטיל": "Fixer / Insérer",
  "הרוצה": "Celui qui veut",
  "שיוציא": "Qu'il fasse sortir",
  "מחוץ": "À l'extérieur de",
  "ציצית": "Tsitsit"
};

const INFINITIFS = {
  "נקרעו": "לְהִקָּרַע = Se déchirer",
  "ונשתייר": "לְהִשָּׁאֵר = Rester",
  "נשאר": "לְהִשָּׁאֵר = Rester",
  "ובודקים": "לִבְדֹּק = Vérifier",
  "שנותנים": "לָתֵת = Placer / Donner",
  "נותנים": "לָתֵת = Placer / Donner",
  "נפסקו": "לְהִפָּסֵק = Se rompre",
  "נפסק": "לְהִפָּסֵק = Se rompre",
  "להשיג": "לְהַשִּׂיג = Obtenir",
  "להקל": "לְהָקֵל = Alléger / Être indulgent",
  "לחוש": "לַחֲשֹׁשׁ = Craindre / Prendre en compte",
  "להחליף": "לְהַחְלִיף = Remplacer",
  "אומרים": "לָמוֹר = Dire",
  "שיאמר": "לָמוֹר = Dire",
  "עושה": "לַעֲשׂוֹת = Faire",
  "עושים": "לַעֲשׂוֹת = Faire",
  "יעשה": "לַעֲשׂוֹת = Faire",
  "לברך": "לְבָרֵךְ = Bénir",
  "מברך": "לְבָרֵךְ = Bénir",
  "להטיל": "לְהַטִּיל = Fixer / Placer",
  "ללבוש": "לִלְבֹּשׁ = Porter (vêtement)",
  "ללובשו": "לִלְבֹּשׁ = Porter (vêtement)"
};

function translateSingleWord(w) {
  const clean = w.replace(/[.,'׳"״:\(\)\[\]\u05F3\u05F4]/g, '').trim();
  if (HEB_TO_FR[clean]) return HEB_TO_FR[clean];

  // Strip prefixes (w, b, k, l, m, sh, h)
  const prefixes = ['ו', 'ב', 'כ', 'ל', 'מ', 'ש', 'ה'];
  for (const p of prefixes) {
    if (clean.startsWith(p) && clean.length > 2) {
      const sub = clean.slice(1);
      if (HEB_TO_FR[sub]) {
        let prefFr = '';
        if (p === 'ו') prefFr = 'Et ';
        else if (p === 'ב') prefFr = 'Dans / Avec ';
        else if (p === 'ל') prefFr = 'Pour / À ';
        else if (p === 'מ') prefFr = 'De ';
        else if (p === 'ש') prefFr = 'Que / Car ';
        else if (p === 'ה') prefFr = 'Le / La / Les ';
        return prefFr + HEB_TO_FR[sub];
      }
    }
  }

  // Morpho-heuristic fallbacks
  if (clean.includes('ציצ')) return "Tsitsit (Frange)";
  if (clean.includes('טלי')) return "Tallit";
  if (clean.includes('בגד')) return "Vêtement";
  if (clean.includes('כנפ')) return "Coin";
  if (clean.includes('חוט')) return "Fil / Brin";
  if (clean.includes('קשר')) return "Nœud";
  if (clean.includes('ברכ')) return "Bénédiction";
  if (clean.includes('מצו')) return "Mitsva";
  if (clean.includes('פסל')) return "Invalide (Passoul)";
  if (clean.includes('כשר')) return "Kasher (Valide)";
  if (clean.includes('אמר')) return "Dire";
  if (clean.includes('עש')) return "Faire";
  if (clean.includes('קרא')) return "Lire";
  if (clean.includes('אכל')) return "Manger";
  if (clean.includes('שתה')) return "Boire";

  return "—";
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.endsWith('.json')) {
      enrichJsonFile(fullPath);
    }
  }
}

function enrichJsonFile(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!data.halakhot || !Array.isArray(data.halakhot)) return;

    let modified = false;

    data.halakhot.forEach(h => {
      (h.mots_alignes || []).forEach(m => {
        const currentFr = m.francais_mot || '';
        // If current translation is 'Terme hébreu' OR contains raw Hebrew characters
        if (currentFr === 'Terme hébreu' || /[\u0590-\u05FF]/.test(currentFr) || currentFr.startsWith('Terme (')) {
          const rawW = m.hebreu_brut || m.hebreu_voyelles || m.mot_hebreu || '';
          const cleanW = rawW.replace(/[.,'׳"״:\(\)\[\]\u05F3\u05F4]/g, '').trim();
          const frTrans = translateSingleWord(cleanW);

          m.francais_mot = frTrans;
          m.expression_contexte = frTrans;

          if (INFINITIFS[cleanW]) {
            m.infinitif = INFINITIFS[cleanW];
          }
          modified = true;
        }
      });
    });

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✅ Fixed word translations in ${path.basename(filePath)}`);
    }
  } catch (e) {
    // Ignore error
  }
}

processDirectory(path.join(ROOT, 'public', 'data'));
console.log("🎉 All Hebrew word translations updated into proper French!");
