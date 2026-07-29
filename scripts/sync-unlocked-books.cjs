const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const booksPath = path.join(ROOT, 'src', 'data', 'books.js');
const publicDataDir = path.join(ROOT, 'public', 'data');

let content = fs.readFileSync(booksPath, 'utf8');

// Find all existing siman numbers in public/data
const existingFiles = fs.readdirSync(publicDataDir);
const existingSimanNums = new Set();

existingFiles.forEach(f => {
  const match = f.match(/^siman_(\d+)\.json$/);
  if (match) {
    existingSimanNums.add(match[1]);
  }
});

console.log('Existing Simanim in public/data:', Array.from(existingSimanNums));

// Regex to update isUnlocked based on whether siman file exists
// We replace isUnlocked for each book block
const bookBlockRegex = /\{\s*id:\s*"([^"]+)"[\s\S]*?isUnlocked:\s*(true|false)[\s\S]*?\}/g;

let updatedCount = 0;
let newContent = content.replace(bookBlockRegex, (block, bookId, isUnlockedStr) => {
  const numMatch = bookId.match(/(\d+)/);
  if (numMatch) {
    const num = numMatch[1];
    const shouldBeUnlocked = existingSimanNums.has(num);
    const currentUnlocked = isUnlockedStr === 'true';

    if (shouldBeUnlocked !== currentUnlocked) {
      updatedCount++;
      console.log(`Updating ${bookId}: isUnlocked = ${shouldBeUnlocked}`);
      return block.replace(`isUnlocked: ${isUnlockedStr}`, `isUnlocked: ${shouldBeUnlocked}`);
    }
  }
  return block;
});

if (updatedCount > 0) {
  fs.writeFileSync(booksPath, newContent, 'utf8');
  console.log(`✅ Updated ${updatedCount} books in books.js`);
} else {
  console.log('No book status changes needed.');
}
