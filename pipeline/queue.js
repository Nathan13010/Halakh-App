/**
 * queue.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Orchestrateur du pipeline automatisé Halakh'App.
 * 
 * Lit les fichiers source dans complet/, et pour chaque Siman non encore traité :
 *   1. Prépare le fichier entree.txt depuis le fichier _complet.json
 *   2. Lance generate-from-file.js pour générer le JSON
 *   3. Lance auto-fix.js pour les corrections déterministes
 *   4. Lance validate.js pour calculer le score
 *   5. Si score < 90%, lance critic.js puis repair.js
 *   6. Met à jour pipeline/state.json pour la reprise
 *
 * Le pipeline gère automatiquement les quotas API (pause + reprise).
 *
 *   node pipeline/queue.js                        # Traite tous les simanim manquants
 *   node pipeline/queue.js --from 10 --to 50      # Traite simanim 10 à 50
 *   node pipeline/queue.js --siman 66              # Traite un seul siman
 *   node pipeline/queue.js --categorie "הלכות ציצית" # Traite une catégorie
 *   node pipeline/queue.js --status                # Affiche l'état actuel
 *   node pipeline/queue.js --dry                   # Dry-run (aucune génération)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync, spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const COMPLET_DIR = path.join(ROOT, 'complet');
// Les fichiers sont stockés par catégorie : public/data/<categorie>/siman_X.json
// Ceci évite les collisions (ex: siman 1 existe dans 3 catégories différentes)
const DATA_DIR = path.join(ROOT, 'public', 'data');
const ENTREE_FILE = path.join(ROOT, 'entree.txt');
const STATE_FILE = path.join(__dirname, 'state.json');
const REPORTS_DIR = path.join(__dirname, 'reports');

// ─── Utilitaires ──────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadState() {
  if (fs.existsSync(STATE_FILE)) {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  }
  return { simanim: {}, last_updated: null };
}

function saveState(state) {
  state.last_updated = new Date().toISOString();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

// ─── Correspondance gematria simplifiée ───────────────────────────────────────
const HEBREW_NUMERALS = {};
const hebrewLetters = 'אבגדהוזחטיכלמנסעפצקרשת';
const units = [1,2,3,4,5,6,7,8,9];
const tens = [10,20,30,40,50,60,70,80,90];
const hundreds = [100,200,300,400];
for (let i = 0; i < units.length; i++) HEBREW_NUMERALS[units[i]] = hebrewLetters[i];
for (let i = 0; i < tens.length; i++) HEBREW_NUMERALS[tens[i]] = hebrewLetters[9 + i];
for (let i = 0; i < hundreds.length; i++) HEBREW_NUMERALS[hundreds[i]] = hebrewLetters[18 + i];

function arabicToHebrewNumeral(n) {
  if (n === 15) return 'טו';
  if (n === 16) return 'טז';
  let result = '';
  if (n >= 100) { result += HEBREW_NUMERALS[Math.floor(n / 100) * 100] || ''; n %= 100; }
  if (n >= 10) { result += HEBREW_NUMERALS[Math.floor(n / 10) * 10] || ''; n %= 10; }
  if (n > 0) result += HEBREW_NUMERALS[n] || '';
  return result;
}

// ─── Charger l'ordre canonique des catégories depuis all_category.txt ─────────

function loadCategoryOrder() {
  const allCategoryPath = path.join(ROOT, 'all_category.txt');
  const dirToOrder = new Map();
  if (!fs.existsSync(allCategoryPath)) return dirToOrder;

  const content = fs.readFileSync(allCategoryPath, 'utf8');
  const lines = content.split('\n');
  const orderList = [];
  for (const line of lines) {
    const match = line.match(/^(\d+)\.\s*(.*)/);
    if (match) {
      let cat = match[2].trim();
      if (cat.includes('—')) cat = cat.split('—')[0].trim();
      orderList.push({ index: parseInt(match[1], 10), name: cat });
    }
  }

  const dirs = fs.existsSync(COMPLET_DIR)
    ? fs.readdirSync(COMPLET_DIR).filter(f => {
        try { return fs.statSync(path.join(COMPLET_DIR, f)).isDirectory(); } catch { return false; }
      })
    : [];

  function simplify(s) {
    return s.replace(/[\(\)\-\—\'\"\s,]/g, '').replace(/י/g, '');
  }

  orderList.forEach(item => {
    let found = dirs.find(d => d === item.name);
    if (!found) found = dirs.find(d => simplify(d) === simplify(item.name));
    if (!found) found = dirs.find(d => simplify(d).includes(simplify(item.name)) || simplify(item.name).includes(simplify(d)));
    if (found && !dirToOrder.has(found)) {
      dirToOrder.set(found, item.index);
    }
  });

  // Alias connus pour les répertoires réels de complet/
  dirs.forEach(d => {
    if (!dirToOrder.has(d)) {
      if (d.includes('כבוד רבו')) dirToOrder.set(d, 53);
      else if (d.includes('נחלות')) dirToOrder.set(d, 77);
      else dirToOrder.set(d, 999);
    }
  });

  return dirToOrder;
}

// ─── Scanner les fichiers source (complet/) ───────────────────────────────────

function scanCompletDir() {
  const simanim = [];
  const categoryOrder = loadCategoryOrder();

  function walk(dir, category) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const full = path.join(dir, item);
      if (fs.statSync(full).isDirectory()) {
        walk(full, item); // Le nom du sous-dossier = catégorie
      } else if (item.endsWith('_complet.json')) {
        try {
          const data = JSON.parse(fs.readFileSync(full, 'utf8'));
          const simanNum = data.siman;
          const totalSeifim = data.total_seifim || 0;
          const categorie = data.categorie || category;

          // Récupérer tous les seifim bruts
          const seifimBruts = [];
          for (const sc of (data.sous_chapitres || [])) {
            for (const seif of (sc.seifim || [])) {
              seifimBruts.push({
                seif_global: seif.seif_global,
                hebreu_brut: seif.hebreu_brut
              });
            }
          }

          // Clé unique = siman::categorie (évite les collisions de numéros)
          const uniqueKey = `${simanNum}::${categorie}`;
          const catOrder = categoryOrder.get(categorie) ?? 999;

          simanim.push({
            siman: simanNum,
            categorie,
            category_order: catOrder,
            total_seifim: totalSeifim,
            source_path: full,
            seifim: seifimBruts,
            unique_key: uniqueKey,
            // Chemin de sortie : public/data/<categorie>/siman_X.json
            output_path: path.join(DATA_DIR, categorie, `siman_${simanNum}.json`)
          });
        } catch (e) {
          console.warn(`⚠️  Erreur lecture ${full}: ${e.message}`);
        }
      }
    }
  }

  walk(COMPLET_DIR, '');
  simanim.sort((a, b) => {
    // 1. Ordre canonique des catégories selon all_category.txt (1..86)
    const orderA = a.category_order ?? 999;
    const orderB = b.category_order ?? 999;
    if (orderA !== orderB) return orderA - orderB;

    // 2. Ordre des simanim à l'intérieur d'une catégorie
    const numA = parseInt(String(a.siman).split('-')[0], 10) || 0;
    const numB = parseInt(String(b.siman).split('-')[0], 10) || 0;
    return numA - numB;
  });
  return simanim;
}

// ─── Vérifier si un siman est déjà traité ─────────────────────────────────────

function isSimanProcessed(simanInfo) {
  const filePath = simanInfo.output_path;
  if (!fs.existsSync(filePath)) return false;

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const halakhot = (data.halakhot || []).filter(h => !h._error);
    return halakhot.length > 0;
  } catch {
    return false;
  }
}

// ─── Préparer entree.txt depuis un fichier _complet.json ──────────────────────

function prepareEntreeFile(simanInfo) {
  /**
   * Le format entree.txt attendu par generate-from-file.js :
   *
   * SEIF 1
   * TITRE: <titre du seif>
   * HEBREU: <texte hébreu brut sans voyelles>
   * FRANCAIS: <traduction française>
   * ---
   *
   * Note: La traduction française sera générée par Gemini.
   * On ne fournit ici que l'hébreu brut, et generate-from-file.js
   * s'occupe de la vocalisation (Nakdan) + traduction + alignement.
   */
  const lines = [];
  const hebrewLetter = arabicToHebrewNumeral(simanInfo.siman);
  
  for (const seif of simanInfo.seifim) {
    const seifNum = seif.seif_global;
    const hebreuBrut = seif.hebreu_brut || '';

    // Extraire un titre depuis le texte (les premiers mots significatifs)
    const titreMatch = hebreuBrut.match(/^[א-ת]{1,3}[\.\s]+(.{10,80}?)(?:[,\.]|$)/);
    const titre = titreMatch ? titreMatch[1].trim() : `Seif ${seifNum}`;

    lines.push(`SEIF ${seifNum}`);
    lines.push(`TITRE: ${titre}`);
    lines.push(`HEBREU: ${hebreuBrut}`);
    // Pas de FRANCAIS — generate-from-file.js utilisera Gemini pour traduire
    lines.push('---');
    lines.push('');
  }

  fs.writeFileSync(ENTREE_FILE, lines.join('\n'), 'utf8');
  return lines.length;
}

// ─── Exécuter un script Node.js en sous-processus ─────────────────────────────

function runScript(script, args = []) {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', [script, ...args], {
      cwd: ROOT,
      stdio: ['inherit', 'pipe', 'pipe'],
      env: { ...process.env }
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', d => {
      const text = d.toString();
      stdout += text;
      process.stdout.write(text);
    });

    proc.stderr.on('data', d => {
      const text = d.toString();
      stderr += text;
      process.stderr.write(text);
    });

    proc.on('close', code => {
      if (code === 0) resolve(stdout);
      else reject(new Error(`Script ${script} exited with code ${code}\n${stderr}`));
    });

    proc.on('error', reject);
  });
}

// ─── Traitement d'un Siman ────────────────────────────────────────────────────

async function processSiman(simanInfo, state, dryRun = false) {
  const simanNum = simanInfo.siman;
  const outputDir = path.dirname(simanInfo.output_path);
  const stateKey = simanInfo.unique_key;
  const catOrderStr = simanInfo.category_order && simanInfo.category_order < 999 ? `[Catégorie ${simanInfo.category_order}/86] ` : '';
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📖 ${catOrderStr}Siman ${simanNum} — ${simanInfo.categorie}`);
  console.log(`   ${simanInfo.total_seifim} seifim`);
  console.log(`   Sortie: public/data/${simanInfo.categorie}/siman_${simanNum}.json`);
  console.log('═'.repeat(60));

  // Créer le dossier de sortie par catégorie
  fs.mkdirSync(outputDir, { recursive: true });

  if (dryRun) {
    console.log('   🔍 [DRY-RUN] Pas de traitement');
    const dryRecord = { status: 'dry_run', total_seifim: simanInfo.total_seifim, categorie: simanInfo.categorie, category_order: simanInfo.category_order };
    state.simanim[stateKey] = dryRecord;
    state.simanim[simanNum] = dryRecord;
    return;
  }

  const inProgressRecord = { status: 'in_progress', started: new Date().toISOString(), total_seifim: simanInfo.total_seifim, categorie: simanInfo.categorie, category_order: simanInfo.category_order };
  state.simanim[stateKey] = inProgressRecord;
  state.simanim[simanNum] = inProgressRecord;
  saveState(state);

  try {
    // Étape 1: Préparer entree.txt
    console.log('\n   📝 Étape 1/5: Préparation de entree.txt...');
    prepareEntreeFile(simanInfo);

    // Étape 2: Générer le JSON via generate-from-file.js
    // On passe --output pour spécifier le chemin de sortie avec la catégorie
    console.log('   🤖 Étape 2/5: Génération via Gemini...');
    try {
      await runScript('scripts/generate-from-file.js', [
        '--siman', String(simanNum),
        '--output', simanInfo.output_path,
        '--categorie', simanInfo.categorie
      ]);
    } catch (e) {
      // La génération peut échouer partiellement (quota), on continue quand même
      console.log(`   ⚠️  Génération partielle: ${e.message.slice(0, 100)}`);
    }

    // Vérifier que le fichier a bien été créé
    const outputPath = simanInfo.output_path;
    if (!fs.existsSync(outputPath)) {
      state.simanim[simanNum] = { status: 'failed', error: 'Fichier non généré', total_seifim: simanInfo.total_seifim };
      saveState(state);
      return;
    }

    // Étape 3: Auto-fix
    console.log('   🔧 Étape 3/5: Auto-fix...');
    try {
      await runScript('pipeline/auto-fix.js', ['--file', simanInfo.output_path]);
    } catch (e) {
      console.log(`   ⚠️  Auto-fix: ${e.message.slice(0, 100)}`);
    }

    // Étape 4: Validation
    console.log('   📊 Étape 4/5: Validation...');
    try {
      await runScript('pipeline/validate.js', ['--file', simanInfo.output_path]);
    } catch (e) {
      // validate.js retourne exit code 1 s'il y a des FAIL, c'est normal
    }

    // Le rapport est nommé par clé unique: siman_NUM__CATEGORIE_report.json
    const safeKey = simanInfo.unique_key.replace(/[^Ѐ-ӿ\w]/g, '_');
    const reportPath = path.join(REPORTS_DIR, `${safeKey}_report.json`);
    let score = 0;
    if (fs.existsSync(reportPath)) {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
      score = report.summary?.avg_score || 0;
    }

    // Étape 5: Critique IA si score < 90% ou s'il y a des Seifim avec problèmes
    let reportData = null;
    if (fs.existsSync(reportPath)) {
      reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    }
    const hasIssues = reportData && reportData.seifim && reportData.seifim.some(s => s.status !== 'PASS');

    if (score < 90 || hasIssues) {
      const reason = score < 90 ? `score moyen: ${score}%` : 'seifim avec avertissements détectés';
      console.log(`   🔍 Étape 5/5: Critique IA (${reason})...`);
      try {
        await runScript('pipeline/critic.js', ['--file', simanInfo.output_path]);
        await runScript('pipeline/repair.js', ['--file', simanInfo.output_path]);
        // Re-valider après repair
        try {
          await runScript('pipeline/validate.js', ['--file', simanInfo.output_path]);
        } catch (e) { /* ignore */ }

        // Relire le score
        if (fs.existsSync(reportPath)) {
          const report2 = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
          score = report2.summary?.avg_score || score;
        }
      } catch (e) {
        console.log(`   ⚠️  Critique/Repair: ${e.message.slice(0, 100)}`);
      }
    } else {
      console.log(`   ⏭️  Étape 5/5: Critique IA non nécessaire (score: ${score}%)`);
    }

    // Lire le rapport final
    let finalReport = null;
    if (fs.existsSync(reportPath)) {
      finalReport = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    }

    const simanRecord = {
      status: 'complete',
      score,
      categorie: simanInfo.categorie,
      category_order: simanInfo.category_order,
      total_seifim: simanInfo.total_seifim,
      seifim_pass: finalReport?.summary?.pass !== undefined ? finalReport.summary.pass : (score === 100 ? simanInfo.total_seifim : 0),
      seifim_warn: finalReport?.summary?.warn ?? 0,
      seifim_fail: finalReport?.summary?.fail ?? 0,
      completed: new Date().toISOString()
    };
    state.simanim[stateKey] = simanRecord;
    state.simanim[simanNum] = simanRecord;
    saveState(state);

    console.log(`\n   ✅ Siman ${simanNum} terminé — Score: ${score}%`);

  } catch (error) {
    const errorRecord = {
      status: 'error',
      error: error.message,
      categorie: simanInfo.categorie,
      category_order: simanInfo.category_order,
      total_seifim: simanInfo.total_seifim,
      completed: new Date().toISOString()
    };
    state.simanim[stateKey] = errorRecord;
    state.simanim[simanNum] = errorRecord;
    saveState(state);
    console.error(`   ❌ Erreur: ${error.message}`);
  }
}

// ─── Affichage du statut ──────────────────────────────────────────────────────

function showStatus() {
  const state = loadState();
  const allSimanim = scanCompletDir();
  const processed = Object.entries(state.simanim || {}).filter(([, v]) => v.status === 'complete');
  const failed = Object.entries(state.simanim || {}).filter(([, v]) => v.status === 'error' || v.status === 'failed');
  const pending = allSimanim.filter(s => !state.simanim?.[s.siman]);

  console.log('');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log("║  📊 HALAKH'APP — État du Pipeline                        ║");
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log(`║  Total Simanim    : ${String(allSimanim.length).padEnd(37)}║`);
  console.log(`║  ✅ Traités       : ${String(processed.length).padEnd(37)}║`);
  console.log(`║  ❌ En erreur     : ${String(failed.length).padEnd(37)}║`);
  console.log(`║  ⏳ En attente    : ${String(pending.length).padEnd(37)}║`);

  const totalSeifim = allSimanim.reduce((s, a) => s + a.total_seifim, 0);
  const processedSeifim = processed.reduce((s, [, v]) => s + (v.total_seifim || 0), 0);
  const pct = totalSeifim > 0 ? Math.round(processedSeifim / totalSeifim * 100) : 0;
  
  console.log(`║  📊 Progression   : ${String(processedSeifim + '/' + totalSeifim + ' seifim (' + pct + '%)').padEnd(37)}║`);
  console.log('╚══════════════════════════════════════════════════════════╝');

  if (processed.length > 0) {
    console.log('\n  Derniers traités :');
    const sorted = processed.sort((a, b) => (b[1].completed || '') > (a[1].completed || '') ? 1 : -1);
    for (const [num, info] of sorted.slice(0, 10)) {
      const passCount = info.seifim_pass !== undefined && info.seifim_pass !== null ? info.seifim_pass : '?';
      console.log(`   Siman ${num}: score ${info.score}% (${passCount}/${info.total_seifim} PASS)`);
    }
  }

  if (failed.length > 0) {
    console.log('\n  ❌ Erreurs :');
    for (const [num, info] of failed) {
      console.log(`   Siman ${num}: ${info.error || 'inconnu'}`);
    }
  }

  console.log('');
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  let from = null, to = null, simanNum = null, status = false, dryRun = false, categorie = null, all = false;
  let fromCat = null, toCat = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--from' && args[i + 1]) from = parseInt(args[++i], 10);
    else if (args[i] === '--to' && args[i + 1]) to = parseInt(args[++i], 10);
    else if (args[i] === '--siman' && args[i + 1]) simanNum = parseInt(args[++i], 10);
    else if (args[i] === '--categorie' && args[i + 1]) categorie = args[++i];
    else if (args[i] === '--status') status = true;
    else if (args[i] === '--dry') dryRun = true;
    else if (args[i] === '--all') all = true;
    else if (args[i] === '--from-cat' && args[i + 1]) fromCat = parseInt(args[++i], 10);
    else if (args[i] === '--to-cat' && args[i + 1]) toCat = parseInt(args[++i], 10);
  }

  return { from, to, simanNum, status, dryRun, categorie, all, fromCat, toCat };
}

async function main() {
  const { from, to, simanNum, status, dryRun, categorie, all, fromCat, toCat } = parseArgs();

  // Créer les répertoires nécessaires
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  if (status) {
    showStatus();
    return;
  }

  if (!from && !to && !simanNum && !categorie && !all && !fromCat && !toCat) {
    console.log('💡 Usage :');
    console.log('  node pipeline/queue.js --all                 # Traite TOUTES les catégories dans l\'ordre canonique (1..86)');
    console.log('  node pipeline/queue.js --from-cat 4          # Démarre à partir de la catégorie numéro 4');
    console.log('  node pipeline/queue.js --from-cat 4 --to-cat 10 # Traite les catégories 4 à 10');
    console.log('  node pipeline/queue.js --categorie "הלכות ציצית" # Traite une seule catégorie');
    console.log('  node pipeline/queue.js --siman 66            # Traite un siman spécifique');
    console.log('  node pipeline/queue.js --status              # Affiche l\'état');
    console.log('  node pipeline/queue.js --all --dry           # Aperçu de l\'ordre sans exécuter (dry-run)');
    process.exit(0);
  }

  // Scanner les sources
  console.log('🔍 Scan du dossier complet/...');
  const allSimanim = scanCompletDir();
  console.log(`📚 ${allSimanim.length} Simanim trouvés (${allSimanim.reduce((s, a) => s + a.total_seifim, 0)} seifim)`);

  // Filtrer les simanim à traiter
  let simaninToProcess = [];

  if (simanNum) {
    simaninToProcess = allSimanim.filter(s => s.siman === simanNum);
    if (categorie) {
      simaninToProcess = simaninToProcess.filter(s => s.categorie === categorie);
    }
    if (simaninToProcess.length === 0) {
      console.error(`❌ Siman ${simanNum} introuvable dans complet/${categorie ? ' pour la catégorie ' + categorie : ''}`);
      process.exit(1);
    }
  } else if (categorie) {
    simaninToProcess = allSimanim.filter(s => s.categorie === categorie);
    if (simaninToProcess.length === 0) {
      console.error(`❌ Aucun siman trouvé pour la catégorie "${categorie}" dans complet/`);
      process.exit(1);
    }
    if (from || to) {
      const fromNum = from || 1;
      const toNum = to || 999;
      simaninToProcess = simaninToProcess.filter(s => s.siman >= fromNum && s.siman <= toNum);
    }
  } else {
    // Mode global (--all, ou --from-cat / --to-cat, ou --from / --to)
    simaninToProcess = [...allSimanim];
    if (fromCat || toCat) {
      const minCat = fromCat || 1;
      const maxCat = toCat || 999;
      simaninToProcess = simaninToProcess.filter(s => {
        const catIdx = s.category_order ?? 999;
        return catIdx >= minCat && catIdx <= maxCat;
      });
    }
    if (from || to) {
      const fromNum = from || 1;
      const toNum = to || 999;
      simaninToProcess = simaninToProcess.filter(s => s.siman >= fromNum && s.siman <= toNum);
    }
  }

  // Exclure les simanim déjà traités (sauf si --siman spécifique)
  if (!simanNum) {
    const state = loadState();
    simaninToProcess = simaninToProcess.filter(s => {
      // La clé d'état est la clé unique (siman::categorie) pour éviter les collisions
      const existing = state.simanim?.[s.unique_key] || state.simanim?.[s.siman];
      if (!existing) return true;
      if (existing.status === 'complete' && existing.score >= 90) return false; // Déjà OK
      // Si erreur, failed, ou score < 90, on le refait
      return true;
    });
  }

  if (simaninToProcess.length === 0) {
    console.log('✅ Aucun siman à traiter (tous déjà complétés ou hors plage)');
    showStatus();
    return;
  }

  console.log(`\n🚀 ${simaninToProcess.length} Siman(im) à traiter${dryRun ? ' (DRY-RUN)' : ''}`);

  const state = loadState();
  let processed = 0;

  for (const siman of simaninToProcess) {
    await processSiman(siman, state, dryRun);
    processed++;

    // Progress bar
    const pct = Math.round(processed / simaninToProcess.length * 100);
    console.log(`\n   📈 Progression: ${processed}/${simaninToProcess.length} (${pct}%)`);

    // Petite pause entre les simanim pour ne pas surcharger l'API
    if (processed < simaninToProcess.length && !dryRun) {
      console.log('   ⏳ Pause inter-siman (5s)...');
      await sleep(5000);
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('🏁 Pipeline terminé !');
  showStatus();
}

main().catch(err => {
  console.error('❌ Erreur fatale :', err.message);
  process.exit(1);
});
