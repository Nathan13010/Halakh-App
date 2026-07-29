import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const file = path.join(ROOT, 'yalkut_tzitzit_scraped.json');
const rawData = JSON.parse(fs.readFileSync(file, 'utf8'));

console.log("Analyzing text of all Tzitzit Simanim from www.yalkut.info:\n");

rawData.forEach(item => {
  console.log(`========================================`);
  console.log(`📌 ${item.title}`);
  console.log(`========================================`);
  console.log(item.content);
  console.log('\n');
});
