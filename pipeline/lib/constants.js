/**
 * constants.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Constantes partagées pour le pipeline Halakh'App :
 * - Clés JSON requises
 * - Patterns interdits
 * - Seuils de validation
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Clés requises dans chaque objet halakha ───────────────────────────────
export const REQUIRED_HALAKHA_KEYS = [
  'sujet', 'sujet_fr', 'titre_seif', 'siman', 'seif',
  'texte_integral', 'mots_alignes'
];

export const REQUIRED_TEXTE_KEYS = [
  'hebreu_sans_voyelles', 'hebreu_avec_voyelles', 'francais'
];

export const REQUIRED_MOT_KEYS = [
  'id', 'hebreu_brut', 'hebreu_voyelles', 'francais_mot', 'expression_contexte'
];

// ─── Patterns interdits dans francais_mot ──────────────────────────────────
export const FORBIDDEN_TRANSLATIONS = [
  'Terme',
  'Terme hébreu',
  'Terme hébraïque',
  '—',
  '–',
  '-',
];

// ─── Seuils de score ──────────────────────────────────────────────────────
export const SCORE_THRESHOLDS = {
  PASS: 90,   // ≥ 90% → tout est bon
  WARN: 60,   // 60-89% → quelques problèmes mineurs
  FAIL: 0,    // < 60% → problèmes critiques
};

// ─── Poids des vérifications pour le calcul du score ──────────────────────
// Plus le poids est élevé, plus l'erreur est grave
export const CHECK_WEIGHTS = {
  json_structure:     20,  // Clés manquantes → critique
  alignment_count:    20,  // Désalignement → critique
  alignment_accuracy: 20,  // Décalage brutal des mots → critique
  no_terme:           15,  // "Terme" dans francais_mot → critique
  no_pipes:            5,  // Pipes dans le texte → mineur
  no_double_spaces:    3,  // Doubles espaces → cosmétique
  badge_correct:      10,  // Badge numérotation correct → important
  titre_seif_present:  5,  // Titre du seif présent → important
  sujet_present:       0,  // Sujet et sujet_fr présents → (Désactivé pour ne pas baisser le score)
  // ktiv_male:           8,  // Ktiv Male cohérent → (Désactivé à la demande de l'utilisateur)
  no_punctuation_word: 5,  // Pas de ponctuation isolée → mineur
  no_empty_words:      7,  // Pas de mots vides → important
  no_hebrew_in_french: 7,  // Pas d'hébreu dans francais_mot → important
};

// Score maximum possible
export const MAX_SCORE = Object.values(CHECK_WEIGHTS).reduce((a, b) => a + b, 0);

// ─── Noms lisibles pour chaque vérification ─────────────────────────────────
export const CHECK_LABELS = {
  json_structure:     'Structure JSON',
  alignment_count:    'Alignement mots',
  alignment_accuracy: 'Justesse alignement',
  no_terme:           'Pas de "Terme"',
  no_pipes:           'Pas de pipes |',
  no_double_spaces:   'Pas de doubles espaces',
  badge_correct:      'Badge numérotation',
  titre_seif_present: 'Titre du Seif',
  sujet_present:      'Sujet présent',
  ktiv_male:          'Ktiv Male',
  no_punctuation_word:'Pas ponctuation isolée',
  no_empty_words:     'Pas de mots vides',
  no_hebrew_in_french:'Pas hébreu dans français',
};
