const fs = require('fs');
const path = require('path');

const booksPath = path.join('c:/Users/natha/OneDrive/Bureau/My Apps/Halakh\'App/src/data/books.js');
let booksContent = fs.readFileSync(booksPath, 'utf8');

const extracted = JSON.parse(fs.readFileSync('c:/Users/natha/OneDrive/Bureau/My Apps/Halakh\'App/extracted_simanim.json', 'utf8'));

// Find what's already in BOOKS
const existingDataFiles = new Set();
const dataFileRegex = /"dataFile"\s*:\s*"([^"]+)"/g;
let match;
while ((match = dataFileRegex.exec(booksContent)) !== null) {
  existingDataFiles.add(match[1]);
}

let newBooksCode = '';

const colorMap = {
  'הלכות ציצית': 'bg-gradient-to-br from-blue-700 via-blue-900 to-slate-900',
  'הלכות אבלות דיני אבלות': 'bg-gradient-to-br from-gray-700 via-gray-900 to-black',
  'הלכות תפילין': 'bg-gradient-to-br from-neutral-800 via-stone-900 to-black',
  'הלכות שבת': 'bg-gradient-to-br from-teal-900 via-emerald-950 to-slate-900',
  'הלכות תפילה': 'bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900',
  'הלכות הנהגת אדם בבוקר': 'bg-gradient-to-br from-amber-900 via-amber-950 to-slate-900'
};

const titleMap = {
  'הלכות ציצית': 'Suite des lois du Tsitsit',
  'הלכות אבלות דיני אבלות': 'Suite des règles du deuil',
  'הלכות תפילין': 'Lois des Tefilines',
  'הלכות הנהגת אדם בבוקר': 'Suite de la conduite matinale'
};

const idSuffixMap = {
  'הלכות ציצית': '-tzitzit',
  'הלכות אבלות דיני אבלות': '-avelout',
  'הלכות תפילין': '-tefilin',
  'הלכות שבת': '-shabbat',
  'הלכות תפילה': '-tefila',
  'הלכות הנהגת אדם בבוקר': ''
};

// Sort extracted nicely based on siman number
extracted.sort((a, b) => {
  if (a.folder !== b.folder) return a.folder.localeCompare(b.folder);
  const aMatch = a.file.match(/siman_(\d+)/);
  const bMatch = b.file.match(/siman_(\d+)/);
  if (aMatch && bMatch) {
    return parseInt(aMatch[1]) - parseInt(bMatch[1]);
  }
  return a.file.localeCompare(b.file);
});

for (const item of extracted) {
  if (item.file.includes('knowledge')) continue;

  const dataFile = item.folder + '/' + item.file;
  if (!existingDataFiles.has(dataFile)) {
    const simanMatch = item.file.match(/siman_(.+)\.json/);
    if (!simanMatch) continue;
    const simanNum = simanMatch[1];
    const id = 'yalkout-' + simanNum + idSuffixMap[item.folder];
    
    newBooksCode += `  ,
  {
    "id": "${id}",
    "title": "${titleMap[item.folder] || 'Halakha'}",
    "hebrewTitle": "${item.folder}",
    "author": "Rav Ovadia Yossef / Rav Yitzhak Yossef",
    "category": "Halakha",
    "description": "${item.folder} - Siman ${simanNum}",
    "coverColor": "${colorMap[item.folder] || 'bg-gradient-to-br from-gray-700 via-gray-900 to-black'}",
    "isUnlocked": true,
    "dataFile": "${dataFile}",
    "chapters": [{ "id": "siman-${simanNum}", "title": "Siman ${simanNum}" }]
  }`;
  }
}

if (newBooksCode.length > 0) {
  const replaceTargetBooks = `    "chapters": [{ "id": "siman-318", "title": "Siman 318" }]
  }
];`;
  const replaceWithBooks = `    "chapters": [{ "id": "siman-318", "title": "Siman 318" }]
  }${newBooksCode}
];`;
  
  if (booksContent.includes(replaceTargetBooks)) {
    booksContent = booksContent.replace(replaceTargetBooks, replaceWithBooks);
    console.log('Successfully added new books.');
  } else {
    console.log('Could not find replace target for books.');
  }
} else {
  console.log('No new books to add.');
}

if (!booksContent.includes('id: "tefilin"')) {
  const replaceTargetCategories = `    iconName: "Deuil"
  }
];`;
  const replaceWithCategories = `    iconName: "Deuil"
  },
  {
    id: "tefilin",
    title: "Tefiline",
    description: "Les lois relatives aux Tefilines, leur pose, leur sainteté et les bénédictions associées.",
    hebrewTitle: "הלכות תפילין",
    folder: "הלכות תפילין",
    iconName: "Tefiline"
  }
];`;
  
  if (booksContent.includes(replaceTargetCategories)) {
    booksContent = booksContent.replace(replaceTargetCategories, replaceWithCategories);
    console.log('Successfully added tefilin category.');
  } else {
    console.log('Could not find replace target for categories.');
  }
}

fs.writeFileSync(booksPath, booksContent, 'utf8');
console.log('Done.');
