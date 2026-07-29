const fs = require('fs');

const dataFile = 'public/data/siman_1.json';
const booksFile = 'src/data/books.js';

let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

data.halakhot.forEach(h => {
  // 1. Remove "(Seif X)" from titre_seif
  if (h.titre_seif) {
    h.titre_seif = h.titre_seif.replace(/\s*\(Seif \d+\)$/, '');
  }

  // 2. Fix translation of numbering from "Paragraphe X." to "X."
  const seifNum = parseInt(h.seif);
  
  if (h.mots_alignes.length > 0) {
    // If the first word is the numbering (e.g. א.)
    if (h.mots_alignes[0].francais_mot.includes('Paragraphe')) {
      h.mots_alignes[0].francais_mot = `${seifNum}.`;
      h.mots_alignes[0].expression_contexte = `${seifNum}.`;
    }
  }

  // 3. Fix the global FR text
  // Remove "Paragraphe X. " if it exists
  let globalFr = h.texte_integral.francais;
  globalFr = globalFr.replace(new RegExp(`^Paragraphe ${seifNum}\\.\\s*`), '');
  // Now prepend "X. " to ensure it's there
  if (!globalFr.startsWith(`${seifNum}.`)) {
    globalFr = `${seifNum}. ` + globalFr;
  }
  h.texte_integral.francais = globalFr;
});

fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

// Update books.js
const booksContent = fs.readFileSync(booksFile, 'utf8');
const updatedBooks = booksContent.replace(/export const FALLBACK_PARAGRAPHS = \[([\s\S]*?)\];/, 'export const FALLBACK_PARAGRAPHS = ' + JSON.stringify(data.halakhot, null, 2) + ';');
fs.writeFileSync(booksFile, updatedBooks);

console.log('Fixed titles and numbering to only use numbers without "Paragraphe". Updated books.js');
