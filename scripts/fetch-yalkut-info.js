import https from 'https';
import fs from 'fs';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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

async function main() {
  console.log("Fetching categories from www.yalkut.info...");
  try {
    const categories = await fetchUrl("https://www.yalkut.info/wp-json/wp/v2/categories?per_page=100");
    console.log(`Found ${categories.length} categories:`);
    categories.forEach(c => console.log(` - ID ${c.id}: ${c.name} (${c.slug}) - ${c.count} posts`));
  } catch (err) {
    console.error("Categories fetch failed:", err);
  }

  console.log("\nFetching sample posts from www.yalkut.info...");
  try {
    const posts = await fetchUrl("https://www.yalkut.info/wp-json/wp/v2/posts?per_page=10");
    console.log(`Fetched ${posts.length} posts. Sample titles:`);
    posts.forEach(p => console.log(` - [ID ${p.id}] ${p.title.rendered}`));
  } catch (err) {
    console.error("Posts fetch failed:", err);
  }
}

main();
