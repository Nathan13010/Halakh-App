import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const simanimToAudit = [1, 2, 3, 4];

function auditSiman(num) {
  const filePath = path.join(ROOT, 'public', 'data', `siman_${num}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File missing: ${filePath}`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`\n========================================`);
  console.log(`🔍 AUDIT SIMAN ${num} (${data.halakhot.length} Seifim)`);
  console.log(`========================================`);

  let errors = 0;
  let warnings = 0;

  data.halakhot.forEach((h, idx) => {
    const seifId = h.seif || (idx + 1);

    // 1. Check title
    if (!h.titre_seif) {
      console.warn(`  ⚠️ [Seïf ${seifId}] Missing titre_seif`);
      warnings++;
    }

    // 2. Check texte_integral
    const ti = h.texte_integral || {};
    const fr = ti.francais || '';
    const hBrut = ti.hebreu_sans_voyelles || ti.hebreu_brut || '';
    const hVoy = ti.hebreu_avec_voyelles || ti.hebreu_voyelles || '';

    if (!fr) {
      console.error(`  ❌ [Seïf ${seifId}] Missing French translation!`);
      errors++;
    }
    if (!hBrut && !hVoy) {
      console.error(`  ❌ [Seïf ${seifId}] Missing Hebrew text!`);
      errors++;
    }

    // 3. Check mots_alignes
    const mots = h.mots_alignes || [];
    if (mots.length === 0) {
      console.warn(`  ⚠️ [Seïf ${seifId}] mots_alignes is empty`);
      warnings++;
    } else {
      let unalignedCount = 0;
      mots.forEach((m, mIdx) => {
        const wordText = m.hebreu_voyelles || m.hebreu_brut || m.mot_hebreu || '';
        const wordFr = m.francais_mot || '';
        if (!wordText) {
          console.error(`  ❌ [Seïf ${seifId}, Word ${mIdx}] Empty Hebrew word in mots_alignes`);
          errors++;
        }
        if (!wordFr) {
          unalignedCount++;
        }
      });

      if (unalignedCount > 0) {
        console.warn(`  ⚠️ [Seïf ${seifId}] ${unalignedCount}/${mots.length} words missing francais_mot translation`);
        warnings++;
      }
    }
  });

  console.log(`Audit result for Siman ${num}: ${errors} Errors, ${warnings} Warnings.`);
}

simanimToAudit.forEach(auditSiman);
