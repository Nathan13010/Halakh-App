import fs from 'fs';
import { buildSimanCurriculum } from '../src/services/learningPathModel.js';
import { LEARNING_SIMANS } from '../src/data/learningSimans.js';

const simansToExport = [
  { id: 'siman_2', title: 'ÉTAPE 2 · SIMAN 2 : LOIS DE L\'HABILLEMENT ET DE LA CONDUITE DU MATIN' },
  { id: 'siman_3', title: 'ÉTAPE 3 · SIMAN 3 : LOIS DE LA CONDUITE AUX TOILETTES' }
];

simansToExport.forEach(simanInfo => {
  const simanId = simanInfo.id;
  const simanConfig = LEARNING_SIMANS[simanId];
  const knowledgePath = `../public/data/הלכות הנהגת אדם בבוקר/${simanId}_knowledge.json`;
  
  if (!fs.existsSync(knowledgePath)) {
    console.log(`Le fichier ${knowledgePath} n'existe pas.`);
    return;
  }
  
  const knowledgeData = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));

  // Build curriculum exactly like the UI
  const curriculum = buildSimanCurriculum(simanConfig, knowledgeData, null, 3);

  let output = `=== ${simanInfo.title} ===\n\n`;

  curriculum.lessons.forEach(lesson => {
    output += `Leçon ${lesson.number} · ${lesson.title}\n\n`;
    
    // Apprentissages
    lesson.items.forEach(item => {
      output += `-${item.title}\n`;
      output += `${item.coreText}\n\n`;
      
      if (item.explanation) {
        output += `💡\n${item.explanation}\n\n`;
      }
      
      if (item.vocabulary && item.vocabulary.length > 0) {
        output += `Vocabulaire utile\n`;
        item.vocabulary.forEach(v => {
          output += `${v.definition}\n`; 
        });
        output += `\n\n`;
      }
      
      output += `📜\n\n`;
      output += `///\n\n`;
    });
    
    // Quiz
    output += `[Questions de la leçon]\n\n`;
    lesson.questions.forEach((q, index) => {
      output += `Question : ${q.prompt}\n`;
      if (q.kind === 'true_false') {
        output += `Choix : Vrai / Faux\n`;
      } else {
        output += `Choix :\n${q.options.map(opt => `- ${opt}`).join('\n')}\n`;
      }
      output += `Réponse attendue : ${q.correctAnswer}\n\n`;
    });
    
    output += `======================================================\n\n`;
  });

  const outputPath = `C:\\Users\\natha\\Downloads\\export_${simanId}_lessons.txt`;
  fs.writeFileSync(outputPath, output, 'utf8');
  console.log(`Export exact réussi vers ${outputPath}`);
});
