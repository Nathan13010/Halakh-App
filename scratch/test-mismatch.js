import fs from 'fs';
import { cleanForComparison } from './pipeline/lib/hebrew-utils.js';

const data = JSON.parse(fs.readFileSync('public/data/הלכות ציצית/siman_11.json', 'utf8'));
for (const h of data.halakhot || []) {
  if (!h.mots_alignes) continue;
  for (let i = 1; i < h.mots_alignes.length; i++) {
    const m = h.mots_alignes[i];
    const brut = cleanForComparison(m.hebreu_brut);
    const voy = cleanForComparison(m.hebreu_voyelles);
    if (brut && voy && brut[0] !== voy[0]) {
      console.log(`Seif ${h.seif}, word ${i}: brut="${brut}", voy="${voy}"`);
    }
  }
}
