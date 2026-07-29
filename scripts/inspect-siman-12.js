import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const rawData = JSON.parse(fs.readFileSync(path.join(ROOT, 'yalkut_tzitzit_scraped.json'), 'utf8'));
const siman12Post = rawData.find(p => p.title.includes('סימן יב'));

if (siman12Post) {
  console.log(`📌 Title: ${siman12Post.title}`);
  console.log(`🔗 Link: ${siman12Post.link}`);
  console.log(`\n--- CONTENT ---`);
  console.log(siman12Post.content);
} else {
  console.log("Not found in scraped file");
}
