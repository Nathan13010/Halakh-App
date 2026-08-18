/**
 * auto-fix.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Corrections déterministes automatiques pour les fichiers siman_X.json.
 * 
 * Corrige les problèmes que le CODE peut résoudre sans IA :
 * - Suppression des pipes | (artefact Nakdan)
 * - Ktiv Male (Koubouts → Shourouk)
 * - Doubles espaces
 * - Points isolés
 * - Re-indexation des IDs
 * - Nettoyage points finaux parasites
 *
 * Usage :
 *   node pipeline/auto-fix.js --siman 1        # Fixe un siman
 *   node pipeline/auto-fix.js --all             # Fixe tous les simanim
 *   node pipeline/auto-fix.js --siman 1 --dry   # Mode dry-run (aucune écriture)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { removeNikkoud, HEBREW_LETTERS_MAP, cleanForComparison } from './lib/hebrew-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'public', 'data');
const REPORTS_DIR = path.join(__dirname, 'reports');

// ─── Corrections individuelles ────────────────────────────────────────────

/**
 * Supprime les pipes | (artefact Nakdan)
 */
function fixPipes(str) {
  return (str || '').replace(/\|/g, '');
}

/**
 * Supprime les doubles espaces
 */
function fixDoubleSpaces(str) {
  return (str || '').replace(/  +/g, ' ').trim();
}

/**
 * Corrige le Ktiv Male : remplace Koubouts (ֻ) par Shourouk (וּ)
 * quand le mot brut original contient un ו (vav)
 */
function fixKtivMale(hebreuBrut, hebreuVoyelles) {
  if (!hebreuBrut || !hebreuVoyelles) return hebreuVoyelles;

  const brutSansNikkoud = removeNikkoud(hebreuBrut);

  // Ne corriger que si le mot brut contient un vav
  if (!brutSansNikkoud.includes('ו')) return hebreuVoyelles;

  // Remplacer Koubouts (ֻ) par la lettre vav + dagesh (וּ = Shourouk)
  // La logique : si on trouve un ֻ dans le mot vocalisé, et que le mot brut
  // a un ו à cet endroit, alors on doit utiliser le Shourouk
  if (hebreuVoyelles.includes('\u05BB')) { // ֻ = Koubouts
    // Stratégie simple : remplacer la première occurrence de ֻ par וּ
    // en vérifiant que ça ne casse pas le mot
    return hebreuVoyelles.replace('\u05BB', 'וּ');
  }

  return hebreuVoyelles;
}

/**
 * Supprime les diacritiques dupliqués (ex: שָׁשָׁ → שָׁ)
 */
function fixDuplicateDiacritics(str) {
  return (str || '').replace(/([\u0591-\u05C7])\1+/g, '$1');
}

/**
 * Nettoie les `. .` et points parasites en fin de texte intégral
 */
function fixTrailingPunctuation(str) {
  return (str || '')
    .replace(/\.\s*\.\s*$/g, '.')  // ". ." → "."
    .replace(/\s+\.\s*$/g, '.')     // " ." → "."
    .trim();
}

/**
 * Corrige le décalage (offset) de 1 mot dans mots_alignes si le premier mot des voyelles
 * contient une puce alphabétique alors que hebreu_brut l'a supprimée.
 */
function fixAlignmentOffset(halakha, mots, ti, log) {
  if (mots.length < 3) return 0;
  
  const clean = text => removeNikkoud(text).replace(/[.,'"]/g,'').trim();
  
  const brut1 = clean(mots[1].hebreu_brut);
  const voy1 = clean(mots[1].hebreu_voyelles);
  const voy2 = clean(mots[2].hebreu_voyelles);
  
  if (brut1 !== voy1 && brut1 === voy2) {
    log.push(`Décalage d'alignement détecté (intrus: "${voy1}"). Réalignement...`);
    
    // Décaler les mots dans mots_alignes
    for (let i = 1; i < mots.length - 1; i++) {
      mots[i].hebreu_voyelles = mots[i+1].hebreu_voyelles;
    }
    
    // Corriger texte_integral
    const textVoy = ti.hebreu_avec_voyelles;
    const partsVoy = textVoy.split(/\s+/);
    
    if (partsVoy.length > 1) {
      partsVoy.splice(1, 1); // Enlever l'intrus
      ti.hebreu_avec_voyelles = partsVoy.join(' ');
    }
    
    // Resynchroniser mots_alignes complet avec le nouveau tableau de voyelles
    for (let i = 0; i < mots.length; i++) {
      if (i < partsVoy.length) {
        mots[i].hebreu_voyelles = partsVoy[i];
      } else {
        mots[i].hebreu_voyelles = "";
      }
    }
    
    return 1;
  }
  return 0;
}

// ─── Application des fixes sur un seif ────────────────────────────────────

/**
 * Applique toutes les corrections déterministes sur un seif.
 * Retourne le nombre de corrections effectuées.
 */
function fixSeifData(halakha) {
  let fixCount = 0;
  const log = [];

  if (!halakha.texte_integral || !halakha.mots_alignes) return { fixCount, log };

  // 1. Fixer les textes intégraux
  const ti = halakha.texte_integral;

  // Pipes
  const hv = fixPipes(ti.hebreu_avec_voyelles);
  if (hv !== ti.hebreu_avec_voyelles) {
    log.push('Suppression pipes dans hebreu_avec_voyelles');
    ti.hebreu_avec_voyelles = hv;
    fixCount++;
  }

  // Doubles espaces
  for (const key of ['hebreu_sans_voyelles', 'hebreu_avec_voyelles', 'francais']) {
    const fixed = fixDoubleSpaces(ti[key]);
    if (fixed !== ti[key]) {
      log.push(`Doubles espaces dans ${key}`);
      ti[key] = fixed;
      fixCount++;
    }
  }

  // Points parasites en fin de texte
  for (const key of ['hebreu_sans_voyelles', 'hebreu_avec_voyelles', 'francais']) {
    const fixed = fixTrailingPunctuation(ti[key]);
    if (fixed !== ti[key]) {
      log.push(`Points parasites dans ${key}`);
      ti[key] = fixed;
      fixCount++;
    }
  }

  // Diacritiques dupliqués
  const hvClean = fixDuplicateDiacritics(ti.hebreu_avec_voyelles);
  if (hvClean !== ti.hebreu_avec_voyelles) {
    log.push('Diacritiques dupliqués dans hebreu_avec_voyelles');
    ti.hebreu_avec_voyelles = hvClean;
    fixCount++;
  }

  const mots = halakha.mots_alignes;

  // Offset d'alignement (à faire AVANT les autres corrections sur les mots)
  const offsetFixed = fixAlignmentOffset(halakha, mots, ti, log);
  if (offsetFixed > 0) {
    fixCount += offsetFixed;
  }

  // 2. Fixer les mots alignés individuellement
  for (let i = 0; i < mots.length; i++) {
    const m = mots[i];

    // Pipes dans hebreu_voyelles
    const mvFixed = fixPipes(m.hebreu_voyelles);
    if (mvFixed !== m.hebreu_voyelles) {
      log.push(`Pipe dans mot[${i}].hebreu_voyelles: "${m.hebreu_voyelles}"`);
      m.hebreu_voyelles = mvFixed;
      fixCount++;
    }

    // Ktiv Male (Désactivé)
    if (i > 0) {
      // Diacritiques dupliqués dans les mots
      const mClean = fixDuplicateDiacritics(m.hebreu_voyelles);
      if (mClean !== m.hebreu_voyelles) {
        log.push(`Diacritiques dupliqués mot[${i}]: "${m.hebreu_voyelles}"`);
        m.hebreu_voyelles = mClean;
        fixCount++;
      }
    }

    // Re-indexation des IDs (toujours)
    if (m.id !== i) {
      m.id = i;
      // Pas de log pour ça, c'est cosmétique
    }
  }

  // 3. Re-synchroniser hebreu_sans_voyelles depuis mots_alignes
  const rebuiltBrut = mots.map(m => m.hebreu_brut).join(' ');
  if (rebuiltBrut !== ti.hebreu_sans_voyelles) {
    const oldLen = ti.hebreu_sans_voyelles.split(/\s+/).filter(Boolean).length;
    const newLen = mots.length;
    // Ne re-synchroniser que si les longueurs correspondent
    if (oldLen === newLen || Math.abs(oldLen - newLen) <= 1) {
      log.push('Re-synchronisation hebreu_sans_voyelles depuis mots_alignes');
      ti.hebreu_sans_voyelles = rebuiltBrut;
      fixCount++;
    }
  }

  return { fixCount, log };
}

// ─── Traitement d'un fichier siman ────────────────────────────────────────

/**
 * Applique les auto-fix sur un fichier siman_X.json
 * @param {string} filePath - Chemin vers le fichier
 * @param {boolean} dryRun - Si true, ne modifie pas le fichier
 * @returns {Object} Résumé des corrections
 */
export function autoFixSiman(filePath, dryRun = false) {
  const basename = path.basename(filePath);
  const simanMatch = basename.match(/siman_(\d+)\.json/);
  const simanNum = simanMatch ? parseInt(simanMatch[1], 10) : 0;

  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.error(`❌ Impossible de lire ${basename}: ${e.message}`);
    return { siman: simanNum, totalFixes: 0, seifimFixed: 0 };
  }

  const halakhot = data.halakhot || [];
  let totalFixes = 0;
  let seifimFixed = 0;
  const allLogs = [];

  for (const h of halakhot) {
    if (h._error) continue; // Skip erreurs de génération

    const { fixCount, log } = fixSeifData(h);
    if (fixCount > 0) {
      totalFixes += fixCount;
      seifimFixed++;
      allLogs.push({
        seif: h.seif,
        fixes: fixCount,
        details: log
      });
    }
  }

  // Sauvegarder si pas dry-run et des corrections ont été faites
  if (totalFixes > 0 && !dryRun) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  // Sauvegarder le rapport
  if (totalFixes > 0) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
    const reportPath = path.join(REPORTS_DIR, `siman_${simanNum}_autofix.json`);
    const report = {
      siman: simanNum,
      timestamp: new Date().toISOString(),
      dryRun,
      totalFixes,
      seifimFixed,
      details: allLogs
    };
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  }

  return { siman: simanNum, totalFixes, seifimFixed, logs: allLogs };
}

// ─── CLI ──────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  let simanNum = null;
  let all = false;
  let dryRun = false;
  let specificFile = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' && args[i + 1]) {
      specificFile = args[++i];
    } else if (args[i] === '--siman' && args[i + 1]) {
      simanNum = parseInt(args[++i], 10);
    } else if (args[i] === '--all') {
      all = true;
    } else if (args[i] === '--dry') {
      dryRun = true;
    }
  }

  return { simanNum, all, dryRun, specificFile };
}

// Exécuter seulement si lancé directement (pas importé)
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);

if (isMain) {
  const { simanNum, all, dryRun, specificFile } = parseArgs();

  if (!all && simanNum === null && specificFile === null) {
    console.log('💡 Usage :');
    console.log('  node pipeline/auto-fix.js --siman 1       # Fixe le siman 1');
    console.log('  node pipeline/auto-fix.js --file path.json # Fixe un fichier spécifique');
    console.log('  node pipeline/auto-fix.js --all            # Fixe tous les simanim');
    console.log('  node pipeline/auto-fix.js --siman 1 --dry  # Mode dry-run');
    process.exit(0);
  }

  let files = [];
  if (specificFile) {
    if (!fs.existsSync(specificFile)) {
      console.error(`❌ Fichier introuvable : ${specificFile}`);
      process.exit(1);
    }
    files = [specificFile];
  } else if (all) {
    // Scan root and category subdirectories for siman_X.json
    const rootItems = fs.readdirSync(DATA_DIR);
    for (const item of rootItems) {
      const fullPath = path.join(DATA_DIR, item);
      if (fs.statSync(fullPath).isDirectory()) {
        const catFiles = fs.readdirSync(fullPath).filter(f => /^siman_\d+\.json$/.test(f));
        files.push(...catFiles.map(f => path.join(fullPath, f)));
      } else if (/^siman_\d+\.json$/.test(item)) {
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

  if (dryRun) {
    console.log('🔍 Mode DRY-RUN : aucune modification ne sera écrite\n');
  }

  let grandTotal = 0;
  for (const filePath of files) {
    const result = autoFixSiman(filePath, dryRun);
    grandTotal += result.totalFixes;

    if (result.totalFixes > 0) {
      console.log(`🔧 Siman ${result.siman} : ${result.totalFixes} correction(s) sur ${result.seifimFixed} seif(im)${dryRun ? ' (dry-run)' : ''}`);
      for (const log of result.logs) {
        console.log(`   Seif ${log.seif} (${log.fixes} fixes):`);
        for (const detail of log.details) {
          console.log(`     • ${detail}`);
        }
      }
    } else {
      console.log(`✅ Siman ${result.siman} : aucune correction nécessaire`);
    }
  }

  console.log(`\n📊 Total : ${grandTotal} correction(s) appliquée(s)${dryRun ? ' (dry-run, non sauvegardées)' : ''}`);
}
