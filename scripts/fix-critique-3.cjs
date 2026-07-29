const fs = require('fs');

const dataFile = 'public/data/siman_1.json';
const booksFile = 'src/data/books.js';

let raw = fs.readFileSync(dataFile, 'utf8');

// 1. Remove ALL pipe characters from the entire JSON
raw = raw.replace(/\|/g, '');

let data = JSON.parse(raw);

data.halakhot.forEach(h => {
  // 2. Fix לדבר in Seif 11 (Lédavar → Lédaber)
  if (h.seif === "11") {
    h.mots_alignes.forEach(m => {
      if (m.hebreu_voyelles.includes("לְדָבָר")) {
        m.hebreu_voyelles = m.hebreu_voyelles.replace("לְדָבָר", "לְדַבֵּר");
      }
    });
    h.texte_integral.hebreu_avec_voyelles = h.texte_integral.hebreu_avec_voyelles.replace(/לְדָבָר/g, "לְדַבֵּר");
  }

  // 3. Fix המגונה in Seif 14 to match Seif 1 (הַמְגוּנֶּה → הַמְגֻנֶּה)
  if (h.seif === "14") {
    h.mots_alignes.forEach(m => {
      if (m.hebreu_voyelles.includes("הַמְגוּנֶּה")) {
        m.hebreu_voyelles = m.hebreu_voyelles.replace("הַמְגוּנֶּה", "הַמְגֻנֶּה");
      }
    });
    h.texte_integral.hebreu_avec_voyelles = h.texte_integral.hebreu_avec_voyelles.replace(/הַמְגוּנֶּה/g, "הַמְגֻנֶּה");
  }
});

fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

// Update books.js
const booksContent = fs.readFileSync(booksFile, 'utf8');
const updatedBooks = booksContent.replace(/export const FALLBACK_PARAGRAPHS = \[[\s\S]*?\];/, 'export const FALLBACK_PARAGRAPHS = ' + JSON.stringify(data.halakhot, null, 2) + ';');
fs.writeFileSync(booksFile, updatedBooks);

console.log('Done: removed pipes, fixed Ledaber, fixed Hamegounah.');
