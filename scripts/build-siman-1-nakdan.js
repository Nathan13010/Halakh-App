import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const RAW_FILE = path.join(ROOT, 'scripts', 'raw', '106_1_KITZUR_YALKUT_YOSEF.txt');
const OUT_FILE = path.join(ROOT, 'scripts', 'raw', 'siman_1_voweled.json');

function cleanText(raw) {
  return raw
    .replace(/<[^>]+>/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/\{.*?\}/g, '')
    .replace(/~.*?~/g, '')
    .replace(/_nbsp/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8217;/g, "'")
    .replace(/&#8221;/g, '"')
    .replace(/&#8220;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

async function getVowelsFromNakdan(text) {
  try {
    const res = await fetch('https://nakdan-2-0.loadbalancer.dicta.org.il/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task: 'nakdan',
        data: text,
        genre: 'rabbinic',
        addmorph: true,
        keepqq: false,
        matchpartial: true,
        keepmetagim: false,
        keephtml: false
      })
    });
    const data = await res.json();
    let result = '';
    for (const item of data) {
      if (item.sep) {
        result += item.word;
      } else {
        // Take the first option which is usually the best voweled match
        if (item.options && item.options.length > 0) {
          result += item.options[0][0];
        } else {
          result += item.word;
        }
      }
    }
    return result;
  } catch (e) {
    console.error("Nakdan error:", e);
    return text;
  }
}

async function main() {
  let rawText = fs.readFileSync(RAW_FILE, 'utf8');
  
  const siman1Start = rawText.indexOf('~ סימן א - הלכות השכמת הבוקר');
  const siman2Start = rawText.indexOf('~ סימן ב');
  
  const seifimRaw = rawText.substring(siman1Start, siman2Start);
  const lines = seifimRaw.split('\n').map(l => cleanText(l)).filter(Boolean);
  
  const rawSeifim = [];
  let currentSeifNum = null;
  
  for (let line of lines) {
    const match = line.match(/^!\s*([א-ת]{1,2})\s*$/);
    if (match) {
      currentSeifNum = match[1];
    } else if (currentSeifNum && line.trim().length > 0) {
      rawSeifim.push(`${currentSeifNum}. ${line.trim()}`);
      currentSeifNum = null;
    }
  }

  console.log(`Parsed ${rawSeifim.length} Seifim. Fetching Nakdan vowels...`);
  
  const results = [];
  
  for (let i = 0; i < rawSeifim.length; i++) {
    const rawText = rawSeifim[i].replace(/\s+/g, ' ').trim();
    console.log(`Processing Seif ${i+1}/${rawSeifim.length}...`);
    
    // Nakdan sometimes fails on very large texts, but a seif should be fine
    const voweledText = await getVowelsFromNakdan(rawText);
    
    // Double check word count strictly!
    const rawWords = rawText.split(' ');
    const vowWords = voweledText.split(' ');
    
    if (rawWords.length !== vowWords.length) {
      console.warn(`WARNING: Length mismatch in Seif ${i+1}. Raw: ${rawWords.length}, Vow: ${vowWords.length}`);
      // Fallback: we map them exactly to ensure length matches
      const fixedVowWords = rawWords.map((rw, idx) => {
        return vowWords[idx] || rw; // Just a fallback, but Nakdan usually preserves words exactly
      });
      results.push({
        seif: String(i+1),
        raw: rawText,
        voweled: fixedVowWords.join(' ')
      });
    } else {
      results.push({
        seif: String(i+1),
        raw: rawText,
        voweled: voweledText
      });
    }
    
    // Small delay
    await new Promise(r => setTimeout(r, 500));
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(results, null, 2));
  console.log(`Saved to ${OUT_FILE}`);
}

main().catch(console.error);
