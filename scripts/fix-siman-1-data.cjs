const fs = require('fs');

const dataFile = 'public/data/siman_1.json';
const booksFile = 'src/data/books.js';

let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

const numberings = {
  "6": { heb: "ו.", fr: "Paragraphe 6." },
  "7": { heb: "ז.", fr: "Paragraphe 7." },
  "8": { heb: "ח.", fr: "Paragraphe 8." },
  "9": { heb: "ט.", fr: "Paragraphe 9." },
  "10": { heb: "י.", fr: "Paragraphe 10." }
};

const titles = {
  "6": "L'horaire idéal pour dormir et étudier",
  "7": "Étudier tard dans la nuit",
  "8": "Se lever avec vivacité et éviter la paresse",
  "9": "Le Modé Ani dès le réveil",
  "10": "Consacrer le début de sa journée à Dieu"
};

data.halakhot.forEach(h => {
  // 1. Remove standalone dots from mots_alignes
  h.mots_alignes = h.mots_alignes.filter(m => m.hebreu_brut !== '.');
  
  // Clean up extra dots in texte_integral
  h.texte_integral.hebreu_sans_voyelles = h.texte_integral.hebreu_sans_voyelles.replace(/\s\.\s\.\s\./g, '...').replace(/\s\.\s/g, ' ');
  h.texte_integral.hebreu_avec_voyelles = h.texte_integral.hebreu_avec_voyelles.replace(/\s\.\s\.\s\./g, '...').replace(/\s\.\s/g, ' ');

  // 2. Add numbering and titre_seif to 6-10
  if (parseInt(h.seif) >= 6 && parseInt(h.seif) <= 10) {
    if (!h.titre_seif) {
      h.titre_seif = titles[h.seif];
    }
    
    // Add numbering if not present
    const num = numberings[h.seif];
    if (h.mots_alignes.length > 0 && h.mots_alignes[0].hebreu_brut !== num.heb) {
      h.mots_alignes.unshift({
        id: 0,
        hebreu_brut: num.heb,
        hebreu_voyelles: num.heb,
        francais_mot: num.fr,
        expression_contexte: num.fr
      });
      h.texte_integral.hebreu_sans_voyelles = num.heb + " " + h.texte_integral.hebreu_sans_voyelles;
      h.texte_integral.hebreu_avec_voyelles = num.heb + " " + h.texte_integral.hebreu_avec_voyelles;
      h.texte_integral.francais = num.fr + " " + h.texte_integral.francais;
    }
  }

  // Fix ID sequence
  h.mots_alignes.forEach((m, index) => {
    m.id = index + 1;
  });
});

fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

// Update books.js
const booksContent = fs.readFileSync(booksFile, 'utf8');
const updatedBooks = booksContent.replace(/export const FALLBACK_PARAGRAPHS = \[([\s\S]*?)\];/, 'export const FALLBACK_PARAGRAPHS = ' + JSON.stringify(data.halakhot, null, 2) + ';');
fs.writeFileSync(booksFile, updatedBooks);

console.log('Fixed dots, numbering, titles, and updated books.js');
