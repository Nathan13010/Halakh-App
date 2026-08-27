const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'public', 'data', 'הלכות הנהגת אדם בבוקר', 'siman_1_knowledge.json');
const knowledgeData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

let blueprintLines = [];
let stats = {
  flashcard_safe: 0,
  qcm_safe: 0,
  vf_safe: 0,
  situation_safe: 0,
  classement_safe: 0,
  association_safe: 0,
  conditionally_safe: 0,
  unsafe: 0,
  insufficient_data: 0
};

let activityCounter = 1;

const formatSource = (sources) => {
  if (!sources || sources.length === 0) return "Inconnue";
  return sources.map(s => `Siman ${s.siman}, Seif ${s.seif}`).join(" ; ");
};

knowledgeData.knowledge_points.forEach(kp => {
  // Flashcard
  stats.flashcard_safe++;
  blueprintLines.push(`### Activity ${activityCounter++}
Type : Flashcard
Knowledge Point : ${kp.id}
Source : ${formatSource(kp.sources)}
Safety : SAFE
Question : Que dit la Halakha concernant : ${kp.title} ?
Réponse : ${kp.rule}
Explication : ${kp.explanation || '-'}
Justification : La fiche d'apprentissage est toujours SAFE car elle présente la règle sans modification.
`);

  // QCM
  if (kp.common_trap) {
    stats.qcm_safe++;
    blueprintLines.push(`### Activity ${activityCounter++}
Type : QCM
Knowledge Point : ${kp.id}
Source : ${formatSource(kp.sources)}
Safety : SAFE
Question : Quelle est la règle concernant : ${kp.title} ?
Options : 
- ${kp.rule} (Correct)
- ${kp.common_trap}
Réponse : ${kp.rule}
Explication : ${kp.explanation || '-'}
Justification : Le distracteur est explicitement présent dans le champ common_trap de la source.
`);
  } else if (kp.halakha_status === 'multiple_opinions' && kp.claims && kp.claims.length > 1) {
    stats.qcm_safe++;
    const opt1 = kp.claims[0].text;
    const opt2 = kp.claims[1].text;
    blueprintLines.push(`### Activity ${activityCounter++}
Type : QCM
Knowledge Point : ${kp.id}
Source : ${formatSource(kp.sources)}
Safety : SAFE
Question : Selon l'opinion principale, que faut-il faire concernant : ${kp.title} ?
Options : 
- ${opt1} (Correct)
- ${opt2}
Réponse : ${opt1}
Explication : ${kp.explanation || '-'}
Justification : Distracteur créé à partir d'une autre opinion légitime explicitement mentionnée dans le KP.
`);
  } else {
    stats.insufficient_data++;
  }

  // Vrai/Faux
  if (kp.common_trap) {
    stats.vf_safe++;
    blueprintLines.push(`### Activity ${activityCounter++}
Type : V/F
Knowledge Point : ${kp.id}
Source : ${formatSource(kp.sources)}
Safety : SAFE
Question : Vrai ou Faux ? ${kp.common_trap}
Réponse : Faux
Explication : ${kp.rule} - ${kp.explanation || ''}
Justification : L'affirmation fausse est issue du piège classique (common_trap) défini dans la source.
`);
  } else {
    stats.insufficient_data++;
  }

  // Situation Pratique
  if (kp.practical_example) {
    stats.situation_safe++;
    blueprintLines.push(`### Activity ${activityCounter++}
Type : Situation Pratique
Knowledge Point : ${kp.id}
Source : ${formatSource(kp.sources)}
Safety : SAFE
Question : Situation : ${kp.practical_example} Que doit-on faire ?
Réponse : ${kp.rule}
Explication : ${kp.explanation || '-'}
Justification : La situation est directement tirée du champ practical_example du KP, sans ajout de contexte externe.
`);
  } else {
    stats.insufficient_data++;
  }

  // Classement (Ordre)
  // On cherche une énumération claire dans la règle (ex: "D'abord... ensuite... puis...")
  const ruleText = (kp.rule || "").toLowerCase();
  if (ruleText.includes("d'abord") && (ruleText.includes("ensuite") || ruleText.includes("puis"))) {
    stats.classement_safe++;
    blueprintLines.push(`### Activity ${activityCounter++}
Type : Classement
Knowledge Point : ${kp.id}
Source : ${formatSource(kp.sources)}
Safety : SAFE
Question : Dans quel ordre faut-il procéder pour : ${kp.title} ?
Réponse : Se référer à la règle : ${kp.rule}
Explication : ${kp.explanation || '-'}
Justification : Le KP indique explicitement une séquence temporelle complète avec des mots comme 'd'abord' et 'ensuite'.
`);
  } else if (ruleText.includes("avant") || ruleText.includes("après")) {
    stats.unsafe++; // Considéré comme UNSAFE pour un classement car souvent incomplet
  } else {
    stats.insufficient_data++;
  }

  // Association
  if (kp.halakha_status === 'multiple_opinions' && kp.claims && kp.claims.length > 1) {
    stats.association_safe++;
    blueprintLines.push(`### Activity ${activityCounter++}
Type : Association
Knowledge Point : ${kp.id}
Source : ${formatSource(kp.sources)}
Safety : SAFE
Question : Associez chaque opinion à la règle correspondante concernant : ${kp.title}
Réponse : Selon les opinions : ${kp.claims.map(c => c.text).join(' vs ')}
Explication : ${kp.explanation || '-'}
Justification : Le KP liste clairement des opinions distinctes qui peuvent être associées à leurs auteurs ou courants.
`);
  } else {
    stats.insufficient_data++;
  }
});

let md = `# Blueprint Pédagogique du Siman 1

Ce document liste les activités pouvant être générées **sans aucune invention**, directement à partir de \`siman_1_knowledge.json\`.

## Statistiques

- **Flashcards SAFE** : ${stats.flashcard_safe}
- **QCM SAFE** : ${stats.qcm_safe}
- **V/F SAFE** : ${stats.vf_safe}
- **Situations SAFE** : ${stats.situation_safe}
- **Classements SAFE** : ${stats.classement_safe}
- **Associations SAFE** : ${stats.association_safe}
- **CONDITIONALLY_SAFE** : ${stats.conditionally_safe}
- **UNSAFE** : ${stats.unsafe} (ex: mot "avant" sans séquence complète)
- **INSUFFICIENT_DATA** : ${stats.insufficient_data}

---

${blueprintLines.join('\n')}
`;

fs.writeFileSync(path.join(__dirname, 'blueprint.md'), md);
console.log("Blueprint généré.");
