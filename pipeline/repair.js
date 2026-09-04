/**
 * repair.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Applique les corrections proposées par critic.js sur les fichiers JSON.
 * 
 * Lit les rapports de critique (siman_X_critic.json) et applique les fixes
 * sur les données, puis re-lance la validation pour confirmer.
 *
 * Usage :
 *   node pipeline/repair.js --siman 1
 *   node pipeline/repair.js --all
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'public', 'data');
const REPORTS_DIR = path.join(__dirname, 'reports');

/**
 * Applique les fixes du rapport critique sur le fichier JSON
 */
function repairSiman(filePath) {
  const parentDir = path.basename(path.dirname(filePath));
  const categorie = parentDir === 'data' ? '' : parentDir;
  const simanMatch = filePath.match(/siman_([\d-]+)\.json$/);
  const simanNum = simanMatch ? simanMatch[1] : 'null';
  const uniqueKey = categorie ? `${simanNum}::${categorie}` : String(simanNum);
  const safeKey = uniqueKey.replace(/[^Ѐ-ӿ\w]/g, '_');
  
  const criticPath = path.join(REPORTS_DIR, `${safeKey}_critic.json`);
  if (!fs.existsSync(criticPath)) {
    console.log(`⏭️  Siman ${simanNum}: Aucun rapport de critique trouvé`);
    return { applied: 0 };
  }

  const criticReport = JSON.parse(fs.readFileSync(criticPath, 'utf8'));
  const fixes = criticReport.fixes || [];

  if (fixes.length === 0) {
    console.log(`✅ Siman ${simanNum}: Aucun fix à appliquer`);
    return { applied: 0 };
  }

  const dataPath = filePath;
  if (!fs.existsSync(dataPath)) {
    console.error(`❌ Fichier de données introuvable: ${dataPath}`);
    return { applied: 0 };
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const halakhot = data.halakhot || [];
  let appliedCount = 0;
  const repairLog = [];

  for (const fix of fixes) {
    const halakha = halakhot.find(h => parseInt(h.seif) === fix.seif);
    if (!halakha || !halakha.mots_alignes) continue;

    const individualFixes = fix.fixes || [];
    for (const f of individualFixes) {
      const wordId = f.word_id;
      const field = f.field;
      const newValue = f.new;

      if (wordId == null || !field || !newValue) continue;

      // Trouver le mot par son ID
      const mot = halakha.mots_alignes.find(m => m.id === wordId);
      if (!mot) {
        repairLog.push(`⚠️  Seif ${fix.seif}, mot[${wordId}]: ID introuvable`);
        continue;
      }

      const oldValue = mot[field];
      if (oldValue === newValue) continue; // Déjà corrigé

      mot[field] = newValue;
      appliedCount++;
      repairLog.push(`✅ Seif ${fix.seif}, mot[${wordId}].${field}: "${oldValue}" → "${newValue}" (${f.reason || ''})`);
    }
  }

  if (appliedCount > 0) {
    // Sauvegarder les données corrigées
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');

    // Sauvegarder le log des réparations
    const repairReportPath = path.join(REPORTS_DIR, `siman_${simanNum}_repairs.json`);
    fs.writeFileSync(repairReportPath, JSON.stringify({
      siman: simanNum,
      timestamp: new Date().toISOString(),
      total_applied: appliedCount,
      details: repairLog
    }, null, 2), 'utf8');
  }

  console.log(`🔧 Siman ${simanNum}: ${appliedCount} correction(s) appliquée(s)`);
  for (const log of repairLog.slice(0, 10)) {
    console.log(`   ${log}`);
  }
  if (repairLog.length > 10) {
    console.log(`   ... et ${repairLog.length - 10} autre(s)`);
  }

  return { applied: appliedCount };
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  let simanNum = null;
  let specificFile = null;
  let all = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' && args[i + 1]) { specificFile = args[++i]; } else if (args[i] === '--siman' && args[i + 1]) simanNum = args[++i];
    else if (args[i] === '--all') all = true;
  }

  return { simanNum, all, specificFile };
}

async function main() {
  const { simanNum, all, specificFile } = parseArgs();

  if (!all && simanNum === null && specificFile === null) {
    console.log('💡 Usage :');
    console.log('  node pipeline/repair.js --siman 1   # Répare le siman 1');
    console.log('  node pipeline/repair.js --all        # Répare tous les simanim');
    process.exit(0);
  }

  if (all) {
    const criticFiles = fs.readdirSync(REPORTS_DIR)
      .filter(f => /^siman_\d+_critic\.json$/.test(f))
      .sort();

    let total = 0;
    for (const file of criticFiles) {
      const num = parseInt(file.match(/siman_(\d+)/)?.[1] || '0', 10);
      const result = repairSiman(num);
      total += result.applied;
    }
    console.log(`\n📊 Total: ${total} correction(s) appliquée(s)`);
  } else if (specificFile) {
    repairSiman(specificFile);
  } else {
    const filePath = path.join(DATA_DIR, `siman_${simanNum}.json`);
    repairSiman(filePath);
  }
}

main().catch(err => {
  console.error('❌ Erreur fatale :', err.message);
  process.exit(1);
});
