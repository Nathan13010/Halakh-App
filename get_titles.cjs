const fs = require('fs');
const cheerio = require('cheerio');
const content = fs.readFileSync('all-pages-הלכות דם.txt', 'utf8');
const $ = cheerio.load(content);
const titles = [];
$('.entry-title').each((i, el) => titles.push($(el).text().trim()));
console.log('Total titles found:', titles.length);
console.log(titles.join('\n'));
