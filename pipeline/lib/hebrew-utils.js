/**
 * hebrew-utils.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Utilitaires partagés pour le traitement de l'hébreu :
 * - Conversion gematria (arabe ↔ hébreu)
 * - Manipulation du Nikkoud (voyelles)
 * - Détection Ktiv Male / Haser
 * - Nettoyage de texte
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Correspondance chiffres arabes → lettres hébraïques ───────────────────
export const HEBREW_LETTERS_MAP = {
  1:'א',2:'ב',3:'ג',4:'ד',5:'ה',6:'ו',7:'ז',8:'ח',9:'ט',10:'י',
  11:'יא',12:'יב',13:'יג',14:'יד',15:'טו',16:'טז',17:'יז',18:'יח',19:'יט',20:'כ',
  21:'כא',22:'כב',23:'כג',24:'כד',25:'כה',26:'כו',27:'כז',28:'כח',29:'כט',30:'ל',
  31:'לא',32:'לב',33:'לג',34:'לד',35:'לה',36:'לו',37:'לז',38:'לח',39:'לט',40:'מ',
  41:'מא',42:'מב',43:'מג',44:'מד',45:'מה',46:'מו',47:'מז',48:'מח',49:'מט',50:'נ',
  51:'נא',52:'נב',53:'נג',54:'נד',55:'נה',56:'נו',57:'נז',58:'נח',59:'נט',60:'ס',
  61:'סא',62:'סב',63:'סג',64:'סד',65:'סה',66:'סו',67:'סז',68:'סח',69:'סט',70:'ע',
  71:'עא',72:'עב',73:'עג',74:'עד',75:'עה',76:'עו',77:'עז',78:'עח',79:'עט',80:'פ',
  81:'פא',82:'פב',83:'פג',84:'פד',85:'פה',86:'פו',87:'פז',88:'פח',89:'פט',90:'צ',
  91:'צא',92:'צב',93:'צג',94:'צד',95:'צה',96:'צו',97:'צז',98:'צח',99:'צט',100:'ק',
  101:'קא',102:'קב',103:'קג',104:'קד',105:'קה',106:'קו',107:'קז',108:'קח',109:'קט',110:'קי',
  111:'קיא',112:'קיב',113:'קיג',114:'קיד',115:'קטו',116:'קטז',117:'קיז',118:'קיח',119:'קיט',120:'קכ',
  121:'קכא',122:'קכב',123:'קכג',124:'קכד',125:'קכה',126:'קכו',127:'קכז',128:'קכח',129:'קכט',130:'קל',
  131:'קלא',132:'קלב',133:'קלג',134:'קלד',135:'קלה',136:'קלו',137:'קלז',138:'קלח',139:'קלט',140:'קמ',
  141:'קמא',142:'קמב',143:'קמג',144:'קמד',145:'קמה',146:'קמו',147:'קמז',148:'קמח',149:'קמט',150:'קנ',
};

// Reverse map: hebrew letter → arabic number
export const HEBREW_TO_ARABIC = Object.fromEntries(
  Object.entries(HEBREW_LETTERS_MAP).map(([k, v]) => [v, parseInt(k, 10)])
);

/**
 * Convertit un numéro arabe en lettre hébraïque (gematria)
 */
export function arabicToHebrew(n) {
  return HEBREW_LETTERS_MAP[n] ?? String(n);
}

/**
 * Supprime toutes les voyelles (Nikkoud) d'un texte hébreu
 * Range Unicode : \u0591-\u05C7 (cantillation + vowels + points)
 */
export function removeNikkoud(text) {
  return (text || '').replace(/[\u0591-\u05C7]/g, '');
}

/**
 * Supprime ponctuation et diacritiques pour comparaison
 */
export function cleanForComparison(str) {
  return (str || '')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"'׳״\u05F3\u05F4\u0591-\u05C7]/g, '')
    .trim();
}

/**
 * Vérifie si un mot contient des voyelles hébraïques (Nikkoud)
 */
export function hasNikkoud(word) {
  return /[\u0591-\u05C7]/.test(word || '');
}

/**
 * Vérifie si un texte contient des caractères hébreux
 */
export function containsHebrew(text) {
  return /[\u0590-\u05FF]/.test(text || '');
}

/**
 * Vérifie si un texte contient des pipes (artefact Nakdan)
 */
export function containsPipes(text) {
  return /\|/.test(text || '');
}

/**
 * Vérifie la règle Ktiv Male : si le mot brut contient un ו (vav)
 * et que le mot vocalisé contient un Koubouts (ֻ), c'est une erreur.
 * On devrait avoir un Shourouk (וּ) à la place.
 */
export function checkKtivMale(hebreuBrut, hebreuVoyelles) {
  if (!hebreuBrut || !hebreuVoyelles) return { ok: true };
  
  const brutSansNikkoud = removeNikkoud(hebreuBrut);
  const voyellesSansNikkoud = removeNikkoud(hebreuVoyelles);
  
  // Ne vérifier que si le mot brut contient un vav
  if (!brutSansNikkoud.includes('ו')) return { ok: true };
  
  // Chercher un Koubouts (ֻ) dans le mot vocalisé
  if (hebreuVoyelles.includes('\u05BB')) { // ֻ = Koubouts
    return {
      ok: false,
      type: 'KTIV_MALE',
      detail: `Le mot brut "${hebreuBrut}" contient un ו mais le vocalisé "${hebreuVoyelles}" utilise un Koubouts (ֻ) au lieu d'un Shourouk (וּ).`
    };
  }
  
  return { ok: true };
}

/**
 * Découpe un texte hébreu en mots (split sur l'espace)
 */
export function splitHebrewWords(text) {
  return (text || '').trim().split(/\s+/).filter(Boolean);
}

/**
 * Vérifie si un mot est un badge de numérotation (ex: "א.", "יב.")
 */
export function isSeifBadge(word, seifNum) {
  const expectedLetter = HEBREW_LETTERS_MAP[seifNum];
  if (!expectedLetter) return false;
  const cleaned = cleanForComparison(word);
  return cleaned === expectedLetter || cleaned === String(seifNum);
}
