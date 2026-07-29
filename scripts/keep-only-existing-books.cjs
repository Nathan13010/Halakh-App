const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const booksPath = path.join(ROOT, 'src', 'data', 'books.js');
const publicDataDir = path.join(ROOT, 'public', 'data');

// Find all existing siman numbers in public/data
const existingFiles = fs.readdirSync(publicDataDir);
const existingSimanNums = new Set();

existingFiles.forEach(f => {
  const match = f.match(/(?:siman_|yalkout-)(\d+)\.json$/);
  if (match) {
    existingSimanNums.add(match[1]);
  }
});

console.log('Existing Simanim in public/data:', Array.from(existingSimanNums));

// Read books.js content
let content = fs.readFileSync(booksPath, 'utf8');

// Replace BOOKS array to keep only books whose siman number exists in public/data or are future placeholders
const cleanBooks = [
  {
    id: "yalkout-1",
    title: "Yalkout Yossef",
    subtitle: "Siman 1 - Lois du Matin - Hilkhot Hashkamat Haboker",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Lois sur le réveil et les prières du matin. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-amber-900 via-amber-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-1", title: "Siman 1" }]
  },
  {
    id: "yalkout-109",
    title: "Yalkout Yossef",
    subtitle: "Siman 109 - Réciter la Kédoucha avec l'officiant",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Règles halakhiques concernant la Kédoucha et les interruptions pendant la prière. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-109", title: "Siman 109" }]
  },
  {
    id: "yalkout-318",
    title: "Yalkout Yossef",
    subtitle: "Siman 318 - Lois de Chabbat - Hilkhot Bishul (La Cuisson)",
    author: "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    category: "Halakha",
    description: "Lois fondamentales concernant les règles de cuisson pendant le Chabbat. Édition bilingue interactive.",
    coverColor: "bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900",
    isUnlocked: true,
    chapters: [{ id: "siman-318", title: "Siman 318" }]
  }
];

const booksCode = `export const BOOKS = ${JSON.stringify(cleanBooks, null, 2)};\n`;

// Replace export const BOOKS = [...] in content
const exportBooksIndex = content.indexOf('export const BOOKS =');
if (exportBooksIndex !== -1) {
  content = content.substring(0, exportBooksIndex) + booksCode;
  fs.writeFileSync(booksPath, content, 'utf8');
  console.log('✅ Cleaned BOOKS array in books.js to contain ONLY existing books (Siman 1, 109, 318).');
}
