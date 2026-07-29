import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

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
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
}

async function main() {
  console.log("📥 Scraping category 66 (הלכות ציצית) from www.yalkut.info...");
  const posts = await fetchUrl("https://www.yalkut.info/wp-json/wp/v2/posts?categories=66&per_page=100");
  console.log(`Received ${posts.length} posts for Hilkhot Tzitzit.`);

  const scraped = posts.map(p => {
    const title = p.title.rendered.replace(/&#8211;/g, '–').replace(/<[^>]+>/g, '').trim();
    const content = cleanHtml(p.content.rendered);
    return {
      id: p.id,
      title,
      slug: p.slug,
      link: p.link,
      content
    };
  });

  const outPath = path.join(ROOT, 'yalkut_tzitzit_scraped.json');
  fs.writeFileSync(outPath, JSON.stringify(scraped, null, 2), 'utf8');
  console.log(`✅ Saved ${scraped.length} Simanim of Tzitzit to ${outPath}`);

  scraped.forEach(s => {
    console.log(`\n📌 ${s.title}`);
    console.log(`   Content preview: ${s.content.slice(0, 150)}...`);
  });
}

main().catch(console.error);
