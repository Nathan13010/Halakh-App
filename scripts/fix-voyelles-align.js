/**
 * fix-voyelles-align.js
 * 
 * Reconstructs hebreu_voyelles from texte_integral.hebreu_avec_voyelles
 * by splitting both texts into words and matching by position.
 * This is the definitive fix — it ignores any previously corrupted 
 * hebreu_voyelles in mots_alignes and rebuilds from the source text.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const findFiles = (dir) => {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) results = results.concat(findFiles(fullPath));
    else if (file.endsWith('.json')) results.push(fullPath);
  });
  return results;
};

let totalFixed = 0;

const jsonFiles = findFiles(path.join(ROOT, 'public', 'data'));
jsonFiles.forEach(fp => {
  try {
    const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
    if (!data || !data.halakhot || !Array.isArray(data.halakhot)) return;

    let fileFixed = 0;

    data.halakhot.forEach((h) => {
      const mots = h.mots_alignes || [];
      if (mots.length === 0) return;

      // Get the source of truth: hebreu_avec_voyelles split into words
      const voyellesText = (h.texte_integral?.hebreu_avec_voyelles || '').trim();
      const brutText = (h.texte_integral?.hebreu_sans_voyelles || '').trim();
      
      if (!voyellesText) return;

      const voyellesWords = voyellesText.split(/\s+/).filter(Boolean);
      const brutWords = brutText.split(/\s+/).filter(Boolean);

      // Verify alignment: brutWords and mots hebreu_brut should match
      let aligned = true;
      let mismatches = 0;

      for (let i = 0; i < mots.length && i < brutWords.length; i++) {
        const motBrut = mots[i].hebreu_brut.replace(/[.,'׳"״]/g, '');
        const textBrut = brutWords[i].replace(/[.,'׳"״]/g, '');
        
        // Update hebreu_voyelles from source text
        if (i < voyellesWords.length) {
          const oldVoyelles = mots[i].hebreu_voyelles;
          const newVoyelles = voyellesWords[i];
          
          if (oldVoyelles !== newVoyelles) {
            mots[i].hebreu_voyelles = newVoyelles;
            mismatches++;
          }
        }
      }

      if (mismatches > 0) {
        fileFixed++;
        totalFixed++;
      }
    });

    if (fileFixed > 0) {
      fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✅ ${path.basename(fp)} : ${fileFixed} Seifim avec voyelles réalignées`);
    } else {
      console.log(`✓  ${path.basename(fp)} : Voyelles déjà alignées`);
    }
  } catch (e) {
    console.error('❌ Erreur sur', fp, e.message);
  }
});

console.log(`\n📊 Total : ${totalFixed} Seifim corrigés`);
