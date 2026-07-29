import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const dataDir = path.join(ROOT, 'public', 'data');

function cleanSujetString(str) {
  if (!str) return str;
  return str
    .replace(/\s*\([^)]*yalkut\.info[^)]*\)/gi, '')
    .replace(/\s*\([^)]*Texte Officiel[^)]*\)/gi, '')
    .replace(/^Chapitre\s+\d+\s*[-–:]\s*/i, '')
    .trim();
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.endsWith('.json')) {
      cleanJsonFile(fullPath);
    }
  }
}

function cleanJsonFile(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!data.halakhot || !Array.isArray(data.halakhot)) return;

    let modified = false;
    data.halakhot.forEach(h => {
      if (h.sujet_fr) {
        const cleaned = cleanSujetString(h.sujet_fr);
        if (cleaned !== h.sujet_fr) {
          h.sujet_fr = cleaned;
          modified = true;
        }
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Cleaned sujet_fr in ${path.basename(filePath)}`);
    }
  } catch (e) {
    // Ignore invalid JSON
  }
}

processDirectory(dataDir);
console.log("✅ All JSON data files cleaned!");
