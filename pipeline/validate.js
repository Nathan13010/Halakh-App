/**
 * validate.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Validateur déterministe pour les fichiers siman_X.json de Halakh'App.
 * 
 * Effectue 12 vérifications automatiques sur chaque Seif et génère un rapport
 * JSON avec un score de qualité. Remplace 80% de la QA manuelle.
 *
 * Usage :
 *   node pipeline/validate.js --siman 1          # Valide un siman
 *   node pipeline/validate.js --all               # Valide tous les simanim
 *   node pipeline/validate.js --siman 1 --fix     # Valide + auto-fix
 *   node pipeline/validate.js --siman 1 --verbose # Affiche les détails
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  removeNikkoud, containsHebrew, containsPipes,
  checkKtivMale, splitHebrewWords, isSeifBadge,
  cleanForComparison, HEBREW_LETTERS_MAP
} from './lib/hebrew-utils.js';
import {
  REQUIRED_HALAKHA_KEYS, REQUIRED_TEXTE_KEYS, REQUIRED_MOT_KEYS,
  FORBIDDEN_TRANSLATIONS, CHECK_WEIGHTS, MAX_SCORE,
  SCORE_THRESHOLDS, CHECK_LABELS
} from './lib/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'public', 'data');
const REPORTS_DIR = path.join(__dirname, 'reports');

// ─── Vérification d'un seul Seif ──────────────────────────────────────────

/**
 * Valide un objet halakha (seif) et retourne le résultat détaillé.
 * @param {Object} halakha - L'objet seif du JSON
 * @param {number} simanNum - Le numéro du siman (pour contexte)
 * @returns {Object} Résultat de validation avec score et issues
 */
function validateSeif(halakha, simanNum) {
  const seifNum = parseInt(halakha.seif, 10) || 0;
  const checks = {};
  const issues = [];

  // ─── 1. Structure JSON ────────────────────────────────────────────────
  {
    const missingKeys = REQUIRED_HALAKHA_KEYS.filter(k => !(k in halakha));
    const missingTexte = halakha.texte_integral
      ? REQUIRED_TEXTE_KEYS.filter(k => !(k in halakha.texte_integral))
      : REQUIRED_TEXTE_KEYS;

    const allMissing = [...missingKeys, ...missingTexte.map(k => `texte_integral.${k}`)];
    checks.json_structure = allMissing.length === 0;

    if (!checks.json_structure) {
      issues.push({
        type: 'MISSING_KEYS',
        severity: 'error',
        detail: `Clés manquantes: ${allMissing.join(', ')}`
      });
    }
  }

  // Skip remaining checks if structure is fundamentally broken
  if (!halakha.texte_integral || !halakha.mots_alignes) {
    return buildResult(seifNum, checks, issues);
  }

  const hebBrut = halakha.texte_integral.hebreu_sans_voyelles || '';
  const hebVoyelles = halakha.texte_integral.hebreu_avec_voyelles || '';
  const frText = halakha.texte_integral.francais || '';
  const mots = halakha.mots_alignes || [];

  // ─── 2. Alignement des mots ───────────────────────────────────────────
  {
    const hebrewWords = splitHebrewWords(hebBrut);
    const alignedCount = mots.length;
    const diff = Math.abs(hebrewWords.length - alignedCount);

    checks.alignment_count = diff === 0;

    if (!checks.alignment_count) {
      issues.push({
        type: 'ALIGNMENT_MISMATCH',
        severity: diff > 3 ? 'error' : 'warning',
        detail: `${alignedCount} mots alignés vs ${hebrewWords.length} mots hébreux (diff: ${diff})`,
        expected: hebrewWords.length,
        actual: alignedCount
      });
    }
  }

  // ─── 2b. Exactitude de l'alignement (mismatch voyelles vs brut) ──────
  {
    const mismatches = [];
    const normalizeHebrewConsonants = text => (text || '')
      .replace(/[אהוי]/g, '') // Matres lectionis (lettres de lecture)
      .replace(/[ןם]$/, 'מ'); // Alternance morphologique nun/mem final (ex: שמכשירין / שמכשירים)
    
    mots.forEach((m, idx) => {
      if (idx === 0) return; // Skip badge
      const brut = cleanForComparison(m.hebreu_brut);
      const voy = cleanForComparison(m.hebreu_voyelles);
      
      const bCore = normalizeHebrewConsonants(brut);
      const vCore = normalizeHebrewConsonants(voy);
      
      if (bCore !== vCore) {
        // Tolerant if one includes the other (e.g. missing prefix 'ה', 'ב', etc.)
        if (!bCore.includes(vCore) && !vCore.includes(bCore)) {
          mismatches.push({
            id: m.id ?? idx,
            hebreu_brut: m.hebreu_brut,
            hebreu_voyelles: m.hebreu_voyelles
          });
        }
      }
    });

    checks.alignment_accuracy = mismatches.length === 0;

    if (!checks.alignment_accuracy) {
      issues.push({
        type: 'ALIGNMENT_MISMATCH_WORD',
        severity: 'error',
        detail: `${mismatches.length} mot(s) ont un décalage majeur entre brut et voyelles`,
        words: mismatches.slice(0, 10)
      });
    }
  }

  // ─── 3. Pas de "Terme" ou placeholder ─────────────────────────────────
  {
    const termeWords = [];
    mots.forEach((m, idx) => {
      const fr = (m.francais_mot || '').trim();
      if (FORBIDDEN_TRANSLATIONS.some(f => fr === f)) {
        termeWords.push({ id: m.id ?? idx, word: m.hebreu_brut, francais: fr });
      }
    });

    checks.no_terme = termeWords.length === 0;

    if (!checks.no_terme) {
      issues.push({
        type: 'TERME_FOUND',
        severity: 'error',
        detail: `${termeWords.length} mot(s) avec placeholder interdit`,
        words: termeWords
      });
    }
  }

  // ─── 4. Pas de pipes | (artefact Nakdan) ──────────────────────────────
  {
    const pipeLocations = [];
    if (containsPipes(hebVoyelles)) pipeLocations.push('hebreu_avec_voyelles');
    mots.forEach((m, idx) => {
      if (containsPipes(m.hebreu_voyelles)) {
        pipeLocations.push(`mot[${m.id ?? idx}].hebreu_voyelles`);
      }
    });

    checks.no_pipes = pipeLocations.length === 0;

    if (!checks.no_pipes) {
      issues.push({
        type: 'PIPE_FOUND',
        severity: 'warning',
        detail: `Pipe(s) | trouvé(s) dans: ${pipeLocations.slice(0, 5).join(', ')}${pipeLocations.length > 5 ? '...' : ''}`
      });
    }
  }

  // ─── 5. Pas de doubles espaces ────────────────────────────────────────
  {
    const doubleSpaces = [];
    if (/  +/.test(hebBrut)) doubleSpaces.push('hebreu_sans_voyelles');
    if (/  +/.test(hebVoyelles)) doubleSpaces.push('hebreu_avec_voyelles');
    if (/  +/.test(frText)) doubleSpaces.push('francais');

    checks.no_double_spaces = doubleSpaces.length === 0;

    if (!checks.no_double_spaces) {
      issues.push({
        type: 'DOUBLE_SPACES',
        severity: 'warning',
        detail: `Doubles espaces dans: ${doubleSpaces.join(', ')}`
      });
    }
  }

  // ─── 6. Badge de numérotation correct ─────────────────────────────────
  {
    const expectedHebBadge = HEBREW_LETTERS_MAP[seifNum];
    let badgeOk = false;

    if (mots.length > 0 && expectedHebBadge) {
      const firstMot = mots[0];
      const cleanBrut = cleanForComparison(firstMot.hebreu_brut);
      const cleanFr = cleanForComparison(firstMot.francais_mot);

      badgeOk = (cleanBrut === expectedHebBadge || cleanBrut === cleanForComparison(expectedHebBadge))
        && (cleanFr === String(seifNum));
    }

    checks.badge_correct = badgeOk;

    if (!checks.badge_correct) {
      issues.push({
        type: 'BADGE_INCORRECT',
        severity: 'warning',
        detail: seifNum > 0
          ? `Badge attendu: "${expectedHebBadge}." / "${seifNum}.", trouvé: "${mots[0]?.hebreu_brut}" / "${mots[0]?.francais_mot}"`
          : 'Numéro de seif manquant ou invalide'
      });
    }
  }

  // ─── 7. titre_seif présent et valide ──────────────────────────────────
  {
    const titre = (halakha.titre_seif || '').trim();
    const hasTitre = titre.length > 0;
    const hasSeifSuffix = /\(Seif\s*\d+\)/i.test(titre);

    checks.titre_seif_present = hasTitre && !hasSeifSuffix;

    if (!checks.titre_seif_present) {
      issues.push({
        type: 'TITRE_SEIF_ISSUE',
        severity: 'warning',
        detail: !hasTitre
          ? 'titre_seif est vide'
          : `titre_seif contient "(Seif X)": "${titre}"`
      });
    }
  }

  // ─── 8. sujet et sujet_fr présents ────────────────────────────────────
  {
    const hasSujet = (halakha.sujet || halakha.sujet_he || '').trim().length > 0;
    const hasSujetFr = (halakha.sujet_fr || '').trim().length > 0;

    checks.sujet_present = hasSujet && hasSujetFr;
    
    // Désactivé à la demande de l'utilisateur : on ne le remonte plus comme problème
  }

  // ─── 9. Ktiv Male (Désactivé) ──────────────────────────────────────────
  checks.ktiv_male = true; // Toujours valide, on utilise Dicta sans modifier

  // ─── 10. Pas de ponctuation isolée comme mot ──────────────────────────
  {
    const punctWords = [];
    mots.forEach((m, idx) => {
      if (idx === 0) return; // Skip badge
      const brut = (m.hebreu_brut || '').trim();
      if (brut.length <= 1 && /^[.,;:!?\-–—]$/.test(brut)) {
        punctWords.push({ id: m.id ?? idx, word: brut });
      }
    });

    checks.no_punctuation_word = punctWords.length === 0;

    if (!checks.no_punctuation_word) {
      issues.push({
        type: 'PUNCTUATION_WORD',
        severity: 'warning',
        detail: `${punctWords.length} mot(s) ne sont que de la ponctuation isolée`,
        words: punctWords
      });
    }
  }

  // ─── 11. Pas de mots vides dans mots_alignes ─────────────────────────
  {
    const emptyWords = [];
    mots.forEach((m, idx) => {
      if (idx === 0) return; // Skip badge
      const brut = (m.hebreu_brut || '').trim();
      const fr = (m.francais_mot || '').trim();
      if (brut.length === 0 || fr.length === 0) {
        emptyWords.push({ id: m.id ?? idx, hebreu_brut: brut, francais_mot: fr });
      }
    });

    checks.no_empty_words = emptyWords.length === 0;

    if (!checks.no_empty_words) {
      issues.push({
        type: 'EMPTY_WORDS',
        severity: 'error',
        detail: `${emptyWords.length} mot(s) avec champ vide`,
        words: emptyWords.slice(0, 10)
      });
    }
  }

  // ─── 12. Pas de caractères hébreux dans francais_mot ──────────────────
  {
    const hebrewInFrench = [];
    mots.forEach((m, idx) => {
      if (idx === 0) return; // Skip badge
      const fr = (m.francais_mot || '');
      if (containsHebrew(fr)) {
        hebrewInFrench.push({ id: m.id ?? idx, francais_mot: fr, hebreu_brut: m.hebreu_brut });
      }
    });

    checks.no_hebrew_in_french = hebrewInFrench.length === 0;

    if (!checks.no_hebrew_in_french) {
      issues.push({
        type: 'HEBREW_IN_FRENCH',
        severity: 'warning',
        detail: `${hebrewInFrench.length} mot(s) avec caractères hébreux dans francais_mot`,
        words: hebrewInFrench.slice(0, 10)
      });
    }
  }

  return buildResult(seifNum, checks, issues);
}

/**
 * Construit l'objet résultat avec le score calculé
 */
function buildResult(seifNum, checks, issues) {
  // Calcul du score
  let earned = 0;
  for (const [checkName, passed] of Object.entries(checks)) {
    if (passed && CHECK_WEIGHTS[checkName]) {
      earned += CHECK_WEIGHTS[checkName];
    }
  }

  const score = Math.round((earned / MAX_SCORE) * 100);
  let status;
  if (score >= SCORE_THRESHOLDS.PASS) status = 'PASS';
  else if (score >= SCORE_THRESHOLDS.WARN) status = 'WARN';
  else status = 'FAIL';

  return { seif: seifNum, status, score, checks, issues };
}

// ─── Validation d'un fichier siman complet ────────────────────────────────

/**
 * Valide un fichier siman_X.json entier
 * @param {string} filePath - Chemin vers le fichier JSON
 * @returns {Object} Rapport de validation complet
 */
function validateSiman(filePath) {
  const basename = path.basename(filePath);
  const simanMatch = basename.match(/siman_([\d-]+)\.json/);
  let simanNum = simanMatch ? simanMatch[1] : 0;

  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (data && data.siman !== undefined) {
      simanNum = data.siman;
    }
  } catch (e) {
    return {
      siman: simanNum,
      file: basename,
      error: `Fichier JSON invalide: ${e.message}`,
      summary: { total: 0, pass: 0, warn: 0, fail: 0 },
      seifim: []
    };
  }

  const halakhot = data.halakhot || [];
  if (halakhot.length === 0) {
    return {
      siman: simanNum,
      file: basename,
      error: 'Aucun seif trouvé dans le fichier',
      summary: { total: 0, pass: 0, warn: 0, fail: 0 },
      seifim: []
    };
  }

  // Filtrer les seifim en erreur (ceux avec _error)
  const validHalakhot = halakhot.filter(h => !h._error);
  const errorHalakhot = halakhot.filter(h => h._error);

  const results = halakhot.map(halakha => {
    const issues = [];
    
    // Vérification de crash API
    if (halakha._error) {
      issues.push({ type: 'GENERATION_ERROR', severity: 'error', detail: 'Le script de génération a planté sur ce seif.' });
    }

    // Vérification du texte français
    if (!halakha.texte_integral?.francais?.trim()) {
      issues.push({ type: 'EMPTY_FRENCH', severity: 'error', detail: 'La traduction française est manquante ou vide.' });
    }

    // Vérification du tableau mots_alignes
    const mots = halakha.mots_alignes;
    if (!Array.isArray(mots)) {
      issues.push({ type: 'INVALID_TYPE', severity: 'error', detail: 'mots_alignes n\'est pas un tableau' });
    } else if (mots.length === 0) {
      issues.push({ type: 'EMPTY_ARRAY', severity: 'error', detail: 'Le tableau mots_alignes est vide.' });
    }

    if (issues.length > 0) {
      return {
        seif: parseInt(halakha.seif, 10) || 0,
        status: 'FAIL',
        score: 0,
        checks: {},
        issues: issues
      };
    }
    
    return validateSeif(halakha, simanNum);
  });

  // Trier par numéro de seif
  results.sort((a, b) => a.seif - b.seif);

  const summary = {
    total: results.length,
    pass: results.filter(r => r.status === 'PASS').length,
    warn: results.filter(r => r.status === 'WARN').length,
    fail: results.filter(r => r.status === 'FAIL').length,
    avg_score: results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
      : 0
  };

  return {
    siman: simanNum,
    file: basename,
    timestamp: new Date().toISOString(),
    summary,
    seifim: results
  };
}

// ─── Affichage terminal ──────────────────────────────────────────────────

function printReport(report, verbose = false) {
  const { siman, summary, seifim, error } = report;

  console.log('');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log(`║  📊 HALAKH'APP — Validation Siman ${String(siman).padEnd(24)}║`);
  console.log('╠══════════════════════════════════════════════════════════╣');

  if (error) {
    console.log(`║  ❌ ${error.padEnd(53)}║`);
    console.log('╚══════════════════════════════════════════════════════════╝');
    return;
  }

  console.log(`║  Total : ${String(summary.total).padEnd(48)}║`);
  console.log(`║  ✅ PASS : ${String(summary.pass).padEnd(4)} (${String(Math.round(summary.pass / summary.total * 100)).padStart(3)}%)${' '.repeat(35)}║`);
  console.log(`║  ⚠️  WARN : ${String(summary.warn).padEnd(4)} (${String(Math.round(summary.warn / summary.total * 100)).padStart(3)}%)${' '.repeat(35)}║`);
  console.log(`║  ❌ FAIL : ${String(summary.fail).padEnd(4)} (${String(Math.round(summary.fail / summary.total * 100)).padStart(3)}%)${' '.repeat(35)}║`);
  console.log(`║  📈 Score moyen : ${String(summary.avg_score + '%').padEnd(39)}║`);
  console.log('╚══════════════════════════════════════════════════════════╝');

  // Afficher les problèmes et avertissements
  const problemSeifim = seifim.filter(s => s.score < 100);
  if (problemSeifim.length > 0) {
    console.log('');
    console.log('  Détail des avertissements et problèmes :');
    console.log('  ─────────────────────────────────────────────────────');

    for (const s of problemSeifim) {
      const icon = s.status === 'FAIL' ? '❌' : '⚠️ ';
      console.log(`  ${icon} Seif ${String(s.seif).padEnd(3)} (score: ${s.score}%)`);
      for (const issue of s.issues) {
        const sevIcon = issue.severity === 'error' ? '🔴' : '🟡';
        console.log(`     ${sevIcon} ${issue.type}: ${issue.detail}`);

        // Montrer les mots problématiques en détail
        if (issue.words) {
          for (const w of issue.words.slice(0, 5)) {
            const wordInfo = w.hebreu_brut
              ? `   mot[${w.word_id ?? w.id}] "${w.hebreu_brut}" → "${w.francais_mot || w.francais || w.hebreu_voyelles || ''}"`
              : `   mot[${w.word_id ?? w.id}]`;
            console.log(`       ${wordInfo}`);
          }
          if (issue.words.length > 5) {
            console.log(`       ... et ${issue.words.length - 5} autre(s)`);
          }
        }
      }
    }
  } else {
    console.log('');
    console.log('  ✨ Perfection ! Tous les Seifim ont un score de 100% !');
  }
  console.log('');
}

// Affichage du résumé global (pour --all)
function printGlobalSummary(reports) {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  📊 HALAKH\'APP — Résumé Global de Validation            ║');
  console.log('╠══════════════════════════════════════════════════════════╣');

  let totalSeifim = 0, totalPass = 0, totalWarn = 0, totalFail = 0;

  for (const r of reports) {
    totalSeifim += r.summary.total;
    totalPass += r.summary.pass;
    totalWarn += r.summary.warn;
    totalFail += r.summary.fail;
  }

  console.log(`║  Simanim analysés : ${String(reports.length).padEnd(37)}║`);
  console.log(`║  Seifim totaux    : ${String(totalSeifim).padEnd(37)}║`);
  console.log(`║  ✅ PASS : ${String(totalPass).padEnd(4)} (${String(totalSeifim > 0 ? Math.round(totalPass / totalSeifim * 100) : 0).padStart(3)}%)${' '.repeat(35)}║`);
  console.log(`║  ⚠️  WARN : ${String(totalWarn).padEnd(4)} (${String(totalSeifim > 0 ? Math.round(totalWarn / totalSeifim * 100) : 0).padStart(3)}%)${' '.repeat(35)}║`);
  console.log(`║  ❌ FAIL : ${String(totalFail).padEnd(4)} (${String(totalSeifim > 0 ? Math.round(totalFail / totalSeifim * 100) : 0).padStart(3)}%)${' '.repeat(35)}║`);
  console.log('╚══════════════════════════════════════════════════════════╝');

  console.log('');
  console.log('  Détail par Siman :');
  console.log('  ┌─────────┬──────────┬───────┬────────┐');
  console.log('  │ Siman   │ Seifim   │ Score │ Status │');
  console.log('  ├─────────┼──────────┼───────┼────────┤');

  for (const r of reports) {
    const statusIcon = r.summary.fail > 0 ? '❌' : r.summary.warn > 0 ? '⚠️ ' : '✅';
    console.log(`  │ ${String(r.siman).padEnd(7)} │ ${String(r.summary.total).padEnd(8)} │ ${String(r.summary.avg_score + '%').padEnd(5)} │ ${statusIcon}     │`);
  }

  console.log('  └─────────┴──────────┴───────┴────────┘');
  console.log('');
}

// ─── CLI ──────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  let simanNum = null;
  let specificFile = null;
  let all = false;
  let verbose = false;
  let fix = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' && args[i + 1]) { specificFile = args[++i]; } else if (args[i] === '--siman' && args[i + 1]) {
      simanNum = args[++i];
    } else if (args[i] === '--all') {
      all = true;
    } else if (args[i] === '--verbose' || args[i] === '-v') {
      verbose = true;
    } else if (args[i] === '--fix') {
      fix = true;
    }
  }

  return { simanNum, all, verbose, fix, specificFile };
}

async function main() {
  const { simanNum, all, verbose, fix, specificFile } = parseArgs();

  // Créer le dossier reports
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  if (!all && simanNum === null && specificFile === null) {
    console.log('💡 Usage :');
    console.log('  node pipeline/validate.js --siman 1       # Valide le siman 1');
    console.log('  node pipeline/validate.js --all            # Valide tous les simanim');
    console.log('  node pipeline/validate.js --siman 1 -v     # Mode verbose');
    console.log('  node pipeline/validate.js --siman 1 --fix  # Valide + auto-fix');
    process.exit(0);
  }

  // Trouver les fichiers à valider
  let files = [];
  if (specificFile) {
    if (!fs.existsSync(specificFile)) {
      console.error(`❌ Fichier ou dossier introuvable : ${specificFile}`);
      process.exit(1);
    }
    if (fs.statSync(specificFile).isDirectory()) {
      const catFiles = fs.readdirSync(specificFile).filter(f => /^siman_[\d-]+\.json$/.test(f));
      files.push(...catFiles.map(f => path.join(specificFile, f)));
    } else {
      files = [specificFile];
    }
  } else if (all) {
    const rootItems = fs.readdirSync(DATA_DIR);
    for (const item of rootItems) {
      const fullPath = path.join(DATA_DIR, item);
      if (fs.statSync(fullPath).isDirectory()) {
        const catFiles = fs.readdirSync(fullPath).filter(f => /^siman_[\d-]+\.json$/.test(f));
        files.push(...catFiles.map(f => path.join(fullPath, f)));
      } else if (/^siman_[\d-]+\.json$/.test(item)) {
        files.push(fullPath);
      }
    }
    files.sort();
  } else {
    const filePath = path.join(DATA_DIR, `siman_${simanNum}.json`);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Fichier introuvable : ${filePath}`);
      process.exit(1);
    }
    files = [filePath];
  }

  if (files.length === 0) {
    console.error('❌ Aucun fichier siman_X.json trouvé dans public/data/');
    process.exit(1);
  }

  // Auto-fix si demandé (importer dynamiquement)
  let autoFix = null;
  if (fix) {
    try {
      const mod = await import('./auto-fix.js');
      autoFix = mod.autoFixSiman;
    } catch (e) {
      console.warn('⚠️  Module auto-fix.js non trouvé, --fix ignoré');
    }
  }

  // Valider chaque fichier
  const reports = [];
  for (const filePath of files) {
    // Auto-fix avant validation si demandé
    if (autoFix) {
      console.log(`🔧 Auto-fix en cours pour ${path.basename(filePath)}...`);
      autoFix(filePath);
    }

    const report = validateSiman(filePath);
    reports.push(report);

    if (!all || verbose) {
      printReport(report, verbose);
    }

    // Extraire la catégorie du chemin (le dossier parent)
    const parentDir = path.basename(path.dirname(filePath));
    const categorie = parentDir === 'data' ? '' : parentDir;
    const uniqueKey = categorie ? `${report.siman}::${categorie}` : String(report.siman);
    const safeKey = uniqueKey.replace(/[^Ѐ-ӿ\w]/g, '_');
    
    const reportPath = path.join(REPORTS_DIR, `${safeKey}_report.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  }

  // Résumé global si --all
  if (all) {
    printGlobalSummary(reports);
    reports.forEach(r => {
      if (!verbose) printReport(r, false);
    });
  }

  // Code de sortie
  const hasFailures = reports.some(r => r.summary.fail > 0);
  process.exit(hasFailures ? 1 : 0);
}

main().catch(err => {
  console.error('❌ Erreur fatale :', err.message);
  console.error(err.stack);
  process.exit(1);
});
