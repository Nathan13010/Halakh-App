import fs from 'fs';
import { getBeginnerLearningContent } from '../src/data/beginnerLearningContent.js';

const jsonPath = '../public/data/הלכות הנהגת אדם בבוקר/siman_1_knowledge.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let output = '=== ÉTAPE 1 · SIMAN 1 : LE RÉVEIL ET LES PRIÈRES DU MATIN ===\n\n';

let lessonCounter = 1;
for (let i = 0; i < data.knowledge_points.length; i += 3) {
  const points = data.knowledge_points.slice(i, i + 3);
  
  output += `--- LEÇON ${lessonCounter} ---\n\n`;
  
  points.forEach(kp => {
    const content = getBeginnerLearningContent(kp, kp.rule);
    
    output += `Titre: ${content.title || kp.title}\n`;
    output += `Apprentissage: ${content.coreText}\n`;
    output += `Explication: ${content.explanation}\n`;
    
    if (content.quizPrompt) {
      output += `\n[Jeu - QCM]\n`;
      output += `Question: ${content.quizPrompt}\n`;
      if (content.quizOptions) {
        output += `Choix:\n${content.quizOptions.map(opt => `  - ${opt}`).join('\n')}\n`;
      }
      output += `Réponse attendue: ${content.quizAnswer}\n`;
    } else if (content.quizTrueFalse) {
      output += `\n[Jeu - Vrai/Faux]\n`;
      output += `Affirmation: ${content.quizTrueFalse.statement}\n`;
      output += `Réponse attendue: ${content.quizTrueFalse.answer}\n`;
    }
    
    output += `\n`;
  });
  
  output += `======================================================\n\n`;
  lessonCounter++;
}

fs.writeFileSync('export_siman1_lessons.txt', output, 'utf8');
console.log('Export réussi vers export_siman1_lessons.txt');
