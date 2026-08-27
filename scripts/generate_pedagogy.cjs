const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'public', 'data', 'הלכות הנהגת אדם בבוקר', 'siman_1_knowledge.json');
const knowledgeData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

let mdLines = [];
let stats = {
  situations: 0,
  qcm: 0,
  vf: 0,
  classement: 0,
  association: 0,
  flashcard: 0,
  human_validation: 0,
  no_activity: 0
};

knowledgeData.knowledge_points.forEach(kp => {
  const isLevel1Or2 = kp.learning_level <= 2;
  const isEssentialOrImportant = kp.importance === 'essential' || kp.importance === 'important';
  
  // Pedagogical analysis
  const objectif = `L'apprenant doit retenir la règle concernant : ${kp.title.toLowerCase()}.`;
  const formulation = kp.rule;
  
  let situationText = "NON RECOMMANDÉE";
  let situationStatus = "NOT_RECOMMENDED";
  let situationReason = "Risque d'ajouter un contexte modifiant la Halakha.";
  
  if (kp.practical_example) {
    situationStatus = "SAFE";
    situationText = `Situation : ${kp.practical_example}\nQuestion : Que doit faire la personne dans ce cas ?\nRéponse : ${kp.rule}\nContexte ajouté : Aucun (tiré du practical_example).\nJustification : Ce contexte est neutre et ne modifie pas la règle.`;
    stats.situations++;
  } else if (kp.halakha_status === 'conditional' || kp.rule.toLowerCase().includes('si ') || kp.rule.toLowerCase().includes('lorsque ')) {
    situationStatus = "SAFE";
    situationText = `Situation : Une personne se trouve dans la condition suivante : "${kp.title}".\nQuestion : Que doit-elle faire ?\nRéponse : ${kp.rule}\nContexte ajouté : "Une personne se trouve dans la condition".\nJustification : Ce contexte est neutre, c'est une simple incarnation de la condition.`;
    stats.situations++;
  }

  const contextesInterdits = "Heure précise, lieu, ou état d'esprit si non mentionnés dans le Seif.";

  // Activities
  stats.flashcard++;
  const flashcardStatus = "SAFE";
  
  let qcmStatus = "NOT_RECOMMENDED";
  let qcmReason = "Pas de distracteur explicitement sûr dans les données.";
  if (kp.common_trap) {
    qcmStatus = "SAFE";
    qcmReason = "Distracteur issu du common_trap.";
    stats.qcm++;
  } else if (kp.halakha_status === 'multiple_opinions' && kp.claims && kp.claims.length > 1) {
    qcmStatus = "SAFE";
    qcmReason = "Distracteurs issus des différentes opinions (claims).";
    stats.qcm++;
  }

  let vfStatus = "NOT_RECOMMENDED";
  let vfReason = "Risque d'inversion arbitraire créant une fausse Halakha.";
  if (kp.common_trap) {
    vfStatus = "SAFE";
    vfReason = "Affirmation fausse tirée du common_trap.";
    stats.vf++;
  }

  let classementStatus = "NOT_RECOMMENDED";
  let classementReason = "Pas de séquence d'étapes claire et ordonnée.";
  const ruleLow = kp.rule.toLowerCase();
  if (ruleLow.includes("d'abord") && (ruleLow.includes("ensuite") || ruleLow.includes("puis"))) {
    classementStatus = "SAFE";
    classementReason = "Séquence explicite présente (d'abord... ensuite).";
    stats.classement++;
  }

  let associationStatus = "NOT_RECOMMENDED";
  let associationReason = "Pas de couples naturels identifiables.";
  if (kp.halakha_status === 'multiple_opinions' && kp.claims && kp.claims.length > 1) {
    associationStatus = "SAFE";
    associationReason = "Couples Opinion -> Position possibles.";
    stats.association++;
  }

  if (qcmStatus === "NOT_RECOMMENDED" && vfStatus === "NOT_RECOMMENDED" && situationStatus === "NOT_RECOMMENDED" && classementStatus === "NOT_RECOMMENDED" && associationStatus === "NOT_RECOMMENDED") {
    stats.no_activity++;
  }
  
  if (kp.importance === 'reference') {
    stats.human_validation++;
  }

  // Generate Markdown for KP
  mdLines.push(`### KP ${kp.id} - ${kp.title}`);
  mdLines.push(`\n**Niveau**: ${kp.learning_level} | **Importance**: ${kp.importance} | **Statut**: ${kp.halakha_status}`);
  mdLines.push(`\n#### Règle source\n${kp.rule}`);
  mdLines.push(`\n#### Objectif pédagogique\n${objectif}`);
  mdLines.push(`\n#### Formulation simple\n${formulation}`);
  mdLines.push(`\n#### Situation pédagogique possible\n${situationText}`);
  mdLines.push(`\n#### Contextes interdits\n${contextesInterdits}`);
  
  mdLines.push(`\n#### Types d'activités possibles\n`);
  mdLines.push(`- **Flashcard** : ${flashcardStatus} (Permet la lecture simple)`);
  mdLines.push(`- **QCM** : ${qcmStatus} (${qcmReason})`);
  mdLines.push(`- **Vrai/Faux** : ${vfStatus} (${vfReason})`);
  mdLines.push(`- **Situation** : ${situationStatus} (${situationReason})`);
  mdLines.push(`- **Classement** : ${classementStatus} (${classementReason})`);
  mdLines.push(`- **Association** : ${associationStatus} (${associationReason})`);

  mdLines.push(`\n#### Questions proposées\n`);
  if (qcmStatus === "SAFE") {
    mdLines.push(`**Question Principale (QCM)** : Quelle est la règle concernant : ${kp.title} ?`);
    mdLines.push(`- Bonne réponse : ${kp.rule}`);
    if (kp.common_trap) mdLines.push(`- Distracteur : ${kp.common_trap}`);
    else if (kp.claims) mdLines.push(`- Distracteur : ${kp.claims[1] ? kp.claims[1].text : 'Autre opinion'}`);
  } else if (vfStatus === "SAFE") {
    mdLines.push(`**Question Principale (V/F)** : Vrai ou Faux : ${kp.common_trap}`);
    mdLines.push(`- Bonne réponse : Faux`);
  } else if (situationStatus === "SAFE") {
    mdLines.push(`**Question Principale (Situation)** : Une personne est concernée par : ${kp.title}. Que doit-elle faire ?`);
    mdLines.push(`- Bonne réponse : ${kp.rule}`);
  } else {
    mdLines.push(`**Question Principale (Flashcard)** : Que faut-il retenir sur : ${kp.title} ?`);
    mdLines.push(`- Bonne réponse : ${kp.rule}`);
  }
  
  mdLines.push(`\n---\n`);
});

let md = `# Propositions Pédagogiques - Siman 1

Ce document propose une **couche d'édition pédagogique** pour chaque Knowledge Point du Siman 1.
L'objectif est d'expliquer *comment* enseigner l'information halakhique sans jamais l'altérer.

${mdLines.join('\n')}

## Statistiques de l'Édition Pédagogique

- **Situations proposées (SAFE)** : ${stats.situations}
- **QCM proposés (SAFE)** : ${stats.qcm}
- **V/F proposés (SAFE)** : ${stats.vf}
- **Classements proposés (SAFE)** : ${stats.classement}
- **Associations proposées (SAFE)** : ${stats.association}
- **Flashcards** : ${stats.flashcard}
- **KP nécessitant une validation humaine (Niveau Référence/Complexe)** : ${stats.human_validation}
- **KP pour lesquels seule la Flashcard est pertinente** : ${stats.no_activity}
`;

fs.writeFileSync(path.join(__dirname, 'pedagogy_proposals.md'), md);
console.log("Propositions générées.");
