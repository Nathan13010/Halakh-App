import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, '..', 'public', 'data', 'הלכות הנהגת אדם בבוקר', 'siman_2_knowledge.json');

const rawData = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(rawData);

// Index de la leçon -> paragraphes sources
const sourceMapping = [
  [1, 3, 4],           // Leçon 1
  [5, 6, 11],          // Leçon 2
  [14, 25],            // Leçon 3
  [15, 16],            // Leçon 4
  [17, 21, 22, 24],    // Leçon 5
  [27, 28]             // Leçon 6
];

// Chaque leçon contient 3 notions
let kpIndex = 0;

for (let lessonIndex = 0; lessonIndex < 6; lessonIndex++) {
  const sources = sourceMapping[lessonIndex].map(s => ({ siman: 2, seif: s }));
  
  for (let notionIndex = 0; notionIndex < 3; notionIndex++) {
    if (data.knowledge_points[kpIndex]) {
      data.knowledge_points[kpIndex].sources = sources;
    }
    kpIndex++;
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log("Les sources du siman 2 ont été mises à jour !");
