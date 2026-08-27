const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'public', 'data', 'הלכות הנהגת אדם בבוקר', 'siman_1_knowledge.json');
const knowledgeData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

let auditLines = [];
let stats = {
  total: 0,
  fiche: 0,
  qcm: 0,
  vf: 0,
  situation: 0,
  ordre: 0,
  association: 0,
  flashcard: 0
};

const sequenceWords = ['avant', 'après', "d'abord", 'ensuite', 'puis', 'ordre', 'précède', 'suit', 'קודם', 'סדר', 'אחר כך', 'לפני', 'לאחר', 'תחילה'];

knowledgeData.knowledge_points.forEach(kp => {
  stats.total++;
  
  // 1. Fiche / Flashcard (always safe)
  const fiche = 'safe';
  const flashcard = 'safe';
  stats.fiche++;
  stats.flashcard++;

  // 2. QCM & V/F
  // Safe IF: common_trap exists OR multiple opinions OR multiple distinct elements in claims
  let qcm = 'unsafe';
  let vf = 'unsafe';
  let qcmReason = '';
  
  if (kp.common_trap) {
    qcm = 'safe';
    vf = 'safe';
    qcmReason = 'common_trap';
  } else if (kp.halakha_status === 'multiple_opinions') {
    qcm = 'safe';
    vf = 'safe';
    qcmReason = 'opinions multiples';
  } else if (kp.claims && kp.claims.length > 1) {
    qcm = 'safe'; // We can use claims to build options
    vf = 'safe';
    qcmReason = 'multiples claims';
  } else {
    qcm = 'insufficient_data';
    vf = 'insufficient_data';
  }

  if (qcm === 'safe') stats.qcm++;
  if (vf === 'safe') stats.vf++;

  // 3. Situation
  let situation = 'insufficient_data';
  let situationReason = '';
  if (kp.practical_example) {
    situation = 'safe';
    situationReason = 'practical_example';
  } else if (kp.halakha_status === 'conditional' || (kp.rule && (kp.rule.toLowerCase().includes('si ') || kp.rule.toLowerCase().includes('lorsque ')))) {
    situation = 'safe';
    situationReason = 'condition explicite';
  }
  
  if (situation === 'safe') stats.situation++;

  // 4. Ordre
  let ordre = 'insufficient_data';
  let ordreReason = '';
  const ruleText = (kp.rule + " " + (kp.explanation || "")).toLowerCase();
  for (const word of sequenceWords) {
    if (ruleText.includes(word)) {
      ordre = 'safe';
      ordreReason = `mot-clé: ${word}`;
      break;
    }
  }
  
  if (ordre === 'safe') stats.ordre++;

  // 5. Association
  let association = 'insufficient_data';
  let assocReason = '';
  if (kp.halakha_status === 'multiple_opinions' && kp.claims && kp.claims.length > 1) {
    association = 'safe';
    assocReason = 'opinions vs auteurs';
  } else if (kp.claims && kp.claims.length > 2) { // Au moins 3 éléments pour une association intéressante
    association = 'safe';
    assocReason = 'claims multiples (>2)';
  }

  if (association === 'safe') stats.association++;

  let comment = [qcmReason, situationReason, ordreReason, assocReason].filter(Boolean).join(', ');
  if (!comment) comment = '-';

  auditLines.push(`| ${kp.id} | ${kp.learning_level} | ${kp.importance} | ${fiche} | ${qcm} | ${vf} | ${situation} | ${ordre} | ${association} | ${comment} |`);
});

let md = `# Audit Pédagogique du Siman 1

| KP | Niveau | Importance | Fiche | QCM | V/F | Situation | Ordre | Association | Commentaire |
|---|---|---|---|---|---|---|---|---|---|
${auditLines.join('\n')}

## Statistiques du Potentiel Pédagogique

- **KP total** : ${stats.total}
- **Fiches possibles** : ${stats.fiche}
- **QCM possibles** : ${stats.qcm}
- **V/F possibles** : ${stats.vf}
- **Situations possibles** : ${stats.situation}
- **Classements possibles** : ${stats.ordre}
- **Associations possibles** : ${stats.association}
- **Flashcards possibles** : ${stats.flashcard}

**Analyse** :
Le JSON actuel permet de générer de façon sûre ${stats.qcm} QCM et V/F (grâce aux \`common_trap\`, opinions multiples ou claims détaillés).
Nous avons également un très bon potentiel pour les Situations Pratiques (${stats.situation}), souvent grâce aux \`practical_example\` ou aux conditions explicites.
Les exercices d'ordre (${stats.ordre}) et d'association (${stats.association}) sont plus rares, ce qui reflète la nature ponctuelle de certaines halakhot.
`;

fs.writeFileSync(path.join(__dirname, 'audit_report.md'), md);
console.log("Audit terminé.");
