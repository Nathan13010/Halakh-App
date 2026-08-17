/**
 * critic.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Critique IA ciblée — appelle Gemini UNIQUEMENT sur les Seifim en WARN/FAIL.
 * 
 * Au lieu de faire vérifier chaque Seif par IA (comme l'ancien workflow),
 * ce script ne soumet à Gemini que les Seifim ayant des problèmes détectés
 * par le validateur déterministe (validate.js).
 *
 * Trois verdicts possibles :
 *   - PASS     : L'IA confirme que le problème est un faux positif
 *   - FIX      : L'IA propose une correction précise
 *   - ESCALATE : L'IA ne peut pas corriger, intervention humaine requise
 *
 * Usage :
 *   node pipeline/critic.js --siman 1
 *   node pipeline/critic.js --all
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initGeminiClient, callGemini } from './lib/gemini-client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'public', 'data');
const REPORTS_DIR = path.join(__dirname, 'reports');

// ─── Prompt de critique ───────────────────────────────────────────────────────

function buildCriticPrompt(halakha, issues) {
  const issueDescriptions = issues.map((issue, i) => {
    let desc = `${i + 1}. [${issue.type}] ${issue.detail}`;
    if (issue.words) {
      desc += '\n   Mots concernés:';
      for (const w of issue.words.slice(0, 5)) {
        desc += `\n   - mot[${w.word_id ?? w.id}] hebreu_brut="${w.hebreu_brut || ''}" francais_mot="${w.francais_mot || ''}" hebreu_voyelles="${w.hebreu_voyelles || ''}"`;
      }
    }
    return desc;
  }).join('\n\n');

  return `Tu es un expert en halakha et en hébreu rabbinique. Tu reçois un Seif du Yalkout Yossef avec des problèmes détectés automatiquement.

SEIF ${halakha.seif} — "${halakha.titre_seif || ''}"

TEXTE HÉBREU (sans voyelles):
${halakha.texte_integral?.hebreu_sans_voyelles?.slice(0, 500) || 'N/A'}

TEXTE FRANÇAIS:
${halakha.texte_integral?.francais?.slice(0, 500) || 'N/A'}

PROBLÈMES DÉTECTÉS:
${issueDescriptions}

Pour chaque problème, donne ton verdict :
- "PASS" si c'est un faux positif (le texte est correct tel quel)
- "FIX" si tu peux proposer une correction précise
- "ESCALATE" si tu ne peux pas résoudre avec certitude

Réponds UNIQUEMENT en JSON avec ce format exact :
{
  "verdicts": [
    {
      "issue_index": 0,
      "issue_type": "KTIV_MALE_ERROR",
      "verdict": "FIX",
      "fixes": [
        {
          "word_id": 12,
          "field": "hebreu_voyelles",
          "old": "מֻתָּר",
          "new": "מוּתָּר",
          "reason": "Ktiv Male: le mot brut contient un vav, donc Shourouk"
        }
      ]
    }
  ]
}`;
}

// ─── Critique d'un Seif ───────────────────────────────────────────────────────

async function critiqueSeif(halakha, issues) {
  const prompt = buildCriticPrompt(halakha, issues);

  try {
    const result = await callGemini({
      prompt,
      jsonMode: true,
    });

    return result;
  } catch (error) {
    console.error(`   ❌ Erreur IA pour seif ${halakha.seif}: ${error.message}`);
    return {
      verdicts: issues.map((issue, i) => ({
        issue_index: i,
        issue_type: issue.type,
        verdict: 'ESCALATE',
        reason: `Erreur IA: ${error.message}`
      }))
    };
  }
}

// ─── Traitement d'un Siman ────────────────────────────────────────────────────

async function criticSiman(filePath) {
  const parentDir = path.basename(path.dirname(filePath));
  const categorie = parentDir === 'data' ? '' : parentDir;
  const simanMatch = filePath.match(/siman_(\d+)\.json$/);
  const simanNum = simanMatch ? simanMatch[1] : 'null';
  const uniqueKey = categorie ? `${simanNum}::${categorie}` : String(simanNum);
  const safeKey = uniqueKey.replace(/[^Ѐ-ӿ\w]/g, '_');
  const reportPath = path.join(REPORTS_DIR, `${safeKey}_report.json`);
  // Charger le rapport de validation
  
  if (!fs.existsSync(reportPath)) {
    console.error(`❌ Rapport de validation introuvable pour siman ${simanNum}. Lance d'abord: npm run validate -- --siman ${simanNum}`);
    return null;
  }

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const problemSeifim = report.seifim.filter(s => s.status !== 'PASS' && s.issues.length > 0);

  if (problemSeifim.length === 0) {
    console.log(`✅ Siman ${simanNum}: Aucun Seif à critiquer (tous PASS)`);
    return { siman: simanNum, reviews: [], escalations: [] };
  }

  // Charger les données JSON
  const dataPath = filePath;
  if (!fs.existsSync(dataPath)) {
    console.error(`❌ Fichier de données introuvable: ${dataPath}`);
    return null;
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const halakhot = data.halakhot || [];

  console.log(`\n🔍 Critique IA pour Siman ${simanNum}: ${problemSeifim.length} Seif(im) à analyser...`);

  const reviews = [];
  const escalations = [];
  const fixes = [];

  for (const seifReport of problemSeifim) {
    const seifNum = seifReport.seif;
    const halakha = halakhot.find(h => parseInt(h.seif) === seifNum);

    if (!halakha || halakha._error) {
      escalations.push({
        seif: seifNum,
        reason: halakha?._error || 'Seif introuvable dans les données',
        issues: seifReport.issues
      });
      continue;
    }

    // Filtrer les issues qui ne sont pas des faux positifs évidents
    // (les GENERATION_ERROR ne peuvent pas être critiqués par IA)
    const critiquableIssues = seifReport.issues.filter(i => i.type !== 'GENERATION_ERROR');
    if (critiquableIssues.length === 0) {
      escalations.push({
        seif: seifNum,
        reason: 'Erreur de génération — re-génération nécessaire',
        issues: seifReport.issues
      });
      continue;
    }

    console.log(`   📝 Seif ${seifNum} (score: ${seifReport.score}%, ${critiquableIssues.length} problème(s))...`);
    
    const result = await critiqueSeif(halakha, critiquableIssues);

    if (result?.verdicts) {
      for (const v of result.verdicts) {
        if (v.verdict === 'FIX' && v.fixes) {
          fixes.push({ seif: seifNum, ...v });
        } else if (v.verdict === 'ESCALATE') {
          escalations.push({
            seif: seifNum,
            issue_type: v.issue_type,
            reason: v.reason || 'IA ne peut pas résoudre avec certitude'
          });
        }
        // PASS = faux positif, rien à faire
      }
    }

    reviews.push({
      seif: seifNum,
      original_score: seifReport.score,
      result
    });
  }

  // Sauvegarder le résultat
  const criticReport = {
    siman: simanNum,
    timestamp: new Date().toISOString(),
    total_reviewed: reviews.length,
    total_fixes: fixes.length,
    total_escalations: escalations.length,
    fixes,
    escalations,
    reviews
  };

  const criticPath = path.join(REPORTS_DIR, `${safeKey}_critic.json`);
  fs.writeFileSync(criticPath, JSON.stringify(criticReport, null, 2), 'utf8');

  // Sauvegarder les escalations dans un fichier review.json dédié
  if (escalations.length > 0) {
    const reviewPath = path.join(REPORTS_DIR, `${safeKey}_review.json`);
    fs.writeFileSync(reviewPath, JSON.stringify({
      siman: simanNum,
      timestamp: new Date().toISOString(),
      message: 'Ces Seifim nécessitent une vérification humaine.',
      escalations
    }, null, 2), 'utf8');
    console.log(`   📋 ${escalations.length} escalation(s) → ${path.basename(reviewPath)}`);
  }

  console.log(`   ✅ Critique terminée: ${fixes.length} fix(es), ${escalations.length} escalation(s)`);
  return criticReport;
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  let simanNum = null;
  let specificFile = null;
  let all = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' && args[i + 1]) { specificFile = args[++i]; } else if (args[i] === '--siman' && args[i + 1]) simanNum = parseInt(args[++i], 10);
    else if (args[i] === '--all') all = true;
  }

  return { simanNum, all, specificFile };
}

async function main() {
  const { simanNum, all, specificFile } = parseArgs();

  if (!all && simanNum === null && specificFile === null) {
    console.log('💡 Usage :');
    console.log('  node pipeline/critic.js --siman 1   # Critique le siman 1');
    console.log('  node pipeline/critic.js --all        # Critique tous les simanim');
    process.exit(0);
  }

  initGeminiClient();
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  if (all) {
    const reportFiles = fs.readdirSync(REPORTS_DIR)
      .filter(f => /^siman_\d+_report\.json$/.test(f))
      .sort();

    // Mode all needs custom traversal if we use files instead of simanNum
    console.error('--all non supporté avec le nouveau système sans dossier spécifique');
  } else {
    if (specificFile) {
      await criticSiman(specificFile);
    } else {
      const filePath = path.join(DATA_DIR, `siman_${simanNum}.json`);
      await criticSiman(filePath);
    }
  }
}

main().catch(err => {
  console.error('❌ Erreur fatale :', err.message);
  process.exit(1);
});
