import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const file = path.join(ROOT, 'yalkut_tzitzit_scraped.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

console.log(`Analyzing ${data.length} scraped Simanim for Hilkhot Tzitzit:`);

data.forEach((item) => {
  // Extract seifim by matching Hebrew paragraphs (e.g. א, ב, ג, ד...)
  const text = item.content;
  // Match paragraphs starting with Hebrew letter followed by space or quote
  const seifim = text.split(/\n+/).filter(line => /^[א-ת]['\s\.]/.test(line.trim()));
  console.log(`\n========================================`);
  console.log(`📌 Title: ${item.title}`);
  console.log(`🔗 Link: ${item.link}`);
  console.log(`🔢 Paragraphs/Seifim count: ${seifim.length}`);
  if (seifim.length > 0) {
    console.log(`   Seif 1 preview: ${seifim[0].slice(0, 100)}...`);
    if (seifim.length > 1) {
      console.log(`   Seif 2 preview: ${seifim[1].slice(0, 100)}...`);
    }
  }
});
