import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const OUT1 = path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', 'siman_11.json');
const OUT2 = path.join(ROOT, 'public', 'data', 'siman_11.json');
const OUT3 = path.join(ROOT, 'public', 'data', 'yalkout-11.json');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        } else {
          reject(`HTTP Error ${res.statusCode}: ${data.slice(0, 200)}`);
        }
      });
    }).on('error', (err) => reject(err));
  });
}

function cleanHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/&#8221;/g, '"')
    .replace(/&#8220;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\r/g, '')
    .trim();
}

async function main() {
  console.log("🌐 Fetching Siman 11 directly from www.yalkut.info...");
  // Query posts with slug containing siman 11 or search query
  const posts = await fetchUrl("https://www.yalkut.info/wp-json/wp/v2/posts?search=%D7%A1%D7%99%D7%9E%D7%9F%20%D7%99%D7%90");
  
  const siman11Post = posts.find(p => p.title.rendered.includes("סימן יא"));
  
  if (!siman11Post) {
    console.error("❌ Siman 11 post not found on www.yalkut.info!");
    return;
  }

  console.log(`✅ Found Post ID ${siman11Post.id}: ${siman11Post.title.rendered}`);
  console.log(`🔗 Link: ${siman11Post.link}`);

  const rawHtml = siman11Post.content.rendered;
  const cleanedText = cleanHtml(rawHtml);
  console.log("\n--- RAW TEXT EXTRACTED FROM WWW.YALKUT.INFO ---");
  console.log(cleanedText);
  console.log("-----------------------------------------------\n");

  // Parse paragraphs (seifim)
  const lines = cleanedText.split('\n').map(l => l.trim()).filter(Boolean);
  
  // Create structured Seifim array
  const rawSeifim = lines.map((line, idx) => {
    // Extract Hebrew seif letter (e.g. א, ב, ג...)
    const letterMatch = line.match(/^([א-ת]['\s\.]?)\s*(.*)/);
    const seifLetter = letterMatch ? letterMatch[1].replace(/['\.]/g, '').trim() : String(idx + 1);
    const textContent = line;

    return {
      seifNumber: String(idx + 1),
      seifLetter,
      text: textContent
    };
  });

  console.log(`Parsed ${rawSeifim.length} Seifim from www.yalkut.info text.`);
}

main().catch(console.error);
