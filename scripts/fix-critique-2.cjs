const fs = require('fs');

const dataFile = 'public/data/siman_1.json';
const booksFile = 'src/data/books.js';

let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

data.halakhot.forEach(h => {
  // 1. Fix the '. .' typgraphy in texts
  if (h.texte_integral.hebreu_sans_voyelles) {
    h.texte_integral.hebreu_sans_voyelles = h.texte_integral.hebreu_sans_voyelles.replace(/\s\.\s\./g, '.').replace(/\.\s\./g, '.');
  }
  if (h.texte_integral.hebreu_avec_voyelles) {
    h.texte_integral.hebreu_avec_voyelles = h.texte_integral.hebreu_avec_voyelles.replace(/\s\.\s\./g, '.').replace(/\.\s\./g, '.');
  }

  // Nikkoud Corrections within mots_alignes (using includes to handle attached punctuation)
  h.mots_alignes.forEach(m => {
    if (h.seif === "1") {
      if (m.hebreu_voyelles.includes("הֶעֱבִירָהּ")) m.hebreu_voyelles = m.hebreu_voyelles.replace("הֶעֱבִירָהּ", "הָעֲבֵרָה");
    }
    if (h.seif === "2") {
      if (m.hebreu_voyelles.includes("בְּשֶׁיָּנָתַם")) m.hebreu_voyelles = m.hebreu_voyelles.replace("בְּשֶׁיָּנָתַם", "בִּשְׁנָתָם");
    }
    if (h.seif === "4") {
      if (m.hebreu_voyelles.includes("שֵׁיְנָה")) m.hebreu_voyelles = m.hebreu_voyelles.replace("שֵׁיְנָה", "שֵׁנָה");
    }
    if (h.seif === "9") {
      if (m.hebreu_voyelles.includes("כְּשִׁעוּר")) m.hebreu_voyelles = m.hebreu_voyelles.replace("כְּשִׁעוּר", "כְּשֶׁיֵּעוֹר");
    }
  });
});

let fullStr = JSON.stringify(data, null, 2);

// Apply to texte_integral as well by globally replacing in the JSON string
fullStr = fullStr.replace(/הֶעֱבִירָהּ/g, 'הָעֲבֵרָה');
fullStr = fullStr.replace(/בְּשֶׁיָּנָתַם/g, 'בִּשְׁנָתָם');
fullStr = fullStr.replace(/שֵׁיְנָה/g, 'שֵׁנָה');
fullStr = fullStr.replace(/כְּשִׁעוּר/g, 'כְּשֶׁיֵּעוֹר');

// Double check trailing dot bugs
fullStr = fullStr.replace(/ \. \./g, '.');
fullStr = fullStr.replace(/\.\s\./g, '.');

data = JSON.parse(fullStr);

fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

// Update books.js
const booksContent = fs.readFileSync(booksFile, 'utf8');
const updatedBooks = booksContent.replace(/export const FALLBACK_PARAGRAPHS = \[([\s\S]*?)\];/, 'export const FALLBACK_PARAGRAPHS = ' + JSON.stringify(data.halakhot, null, 2) + ';');
fs.writeFileSync(booksFile, updatedBooks);

console.log('Fixed omitted Nikkoud errors and typography.');
