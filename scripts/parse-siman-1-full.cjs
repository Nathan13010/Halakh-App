const fs = require('fs');
let html = JSON.parse(fs.readFileSync('temp_siman_1_full.json', 'utf8'));
const regex = /<a name="([^"]+)"><\/a>\s*<b>([^<]+)<\/b>\s*(.*?)(?=<a name=|<\/p>|$)/gs;
let seifim = [];
let match;
while ((match = regex.exec(html)) !== null) {
  let text = match[3].replace(/<[^>]+>/g, '').trim();
  text = text.replace(/&nbsp;/g, ' ').replace(/&#8211;/g, '-').replace(/&quot;/g, '"');
  seifim.push({ seifLetter: match[2].trim(), text: text });
}
console.log('Total Seifim extracted:', seifim.length);
if (seifim.length >= 6) {
  console.log('Seif 6:', seifim[5].seifLetter, seifim[5].text.substring(0, 100));
}
if (seifim.length >= 10) {
  console.log('Seif 10:', seifim[9].seifLetter, seifim[9].text.substring(0, 100));
}
fs.writeFileSync('scripts/raw/yalkut_siman_1_full_parsed.json', JSON.stringify(seifim, null, 2));
