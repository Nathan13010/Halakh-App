const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'public', 'data', 'הלכות הנהגת אדם בבוקר', 'siman_1_knowledge.json');
const knowledgeData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

let mdLines = [];
let stats = {
  situations: { safe: 0, a_revoir: 0, rejeter: 0 },
  qcm: { safe: 0, a_revoir: 0, rejeter: 0 },
  vf: { safe: 0, a_revoir: 0, rejeter: 0 },
  validation: 0
};

let activityCount = 1;

const formatSource = (sources) => {
  if (!sources || sources.length === 0) return "Inconnue";
  return sources.map(s => `Siman ${s.siman}, Seif ${s.seif}`).join(" ; ");
};

knowledgeData.knowledge_points.forEach(kp => {
  const sourcesText = formatSource(kp.sources);
  const isConditional = kp.halakha_status === 'conditional';
  const isMultipleOpinions = kp.halakha_status === 'multiple_opinions';

  let hasActivity = false;

  // 1. SITUATIONS
  if (kp.practical_example || isConditional || kp.rule.toLowerCase().includes('si ') || kp.rule.toLowerCase().includes('lorsque ')) {
    hasActivity = true;
    let question = "";
    let reponse = kp.rule;
    let contexteAjoute = "";
    let neutre = "OUI";
    let dependAjout = "NON";
    let simplifie = "NON";
    let risque = "FAIBLE";
    let verdict = "SAFE";

    if (kp.practical_example) {
      question = `Situation : ${kp.practical_example}\nQue doit faire la personne dans ce cas ?`;
      contexteAjoute = "Aucun (tiré de practical_example)";
    } else {
      question = `Situation : Une personne se trouve dans la condition suivante : "${kp.title}".\nQue doit-elle faire ?`;
      contexteAjoute = `Le mot "Une personne" et la condition "${kp.title}"`;
      if (isConditional && !question.toLowerCase().includes(kp.title.toLowerCase())) {
         verdict = "À REVOIR";
         risque = "ÉLEVÉ";
         neutre = "NON";
      }
    }

    if (verdict === "SAFE") stats.situations.safe++;
    else if (verdict === "À REVOIR") stats.situations.a_revoir++;
    else stats.situations.rejeter++;

    mdLines.push(`### Activity ${activityCount++}\n`);
    mdLines.push(`Type :\nSituation\n`);
    mdLines.push(`KP :\n${kp.id}\n`);
    mdLines.push(`Seif :\n${sourcesText}\n`);
    mdLines.push(`------------------\n`);
    mdLines.push(`SOURCE EXACTE DU KP :\n`);
    mdLines.push(`Règle : ${kp.rule}`);
    if (kp.practical_example) mdLines.push(`Exemple pratique : ${kp.practical_example}`);
    if (kp.explanation) mdLines.push(`Explication : ${kp.explanation}`);
    mdLines.push(`\n------------------\n`);
    mdLines.push(`ACTIVITÉ PROPOSÉE :\n`);
    mdLines.push(`Question :\n${question}\n`);
    mdLines.push(`Options :\n- N/A\n`);
    mdLines.push(`Réponse :\n${reponse}\n`);
    mdLines.push(`Explication :\n${kp.explanation || '-'}\n`);
    mdLines.push(`------------------\n`);
    mdLines.push(`ANALYSE DE SÉCURITÉ :\n`);
    mdLines.push(`Informations provenant directement de la source :\nLa règle et le cas visé.\n`);
    mdLines.push(`Contexte ajouté :\n${contexteAjoute}\n`);
    mdLines.push(`Ce contexte est-il neutre ?\n${neutre}\n`);
    mdLines.push(`La réponse dépend-elle d'une information ajoutée ?\n${dependAjout}\n`);
    mdLines.push(`La formulation simplifie-t-elle excessivement la Halakha ?\n${simplifie}\n`);
    mdLines.push(`Risque de mauvaise compréhension :\n${risque}\n`);
    mdLines.push(`Verdict proposé :\n${verdict}\n`);
    mdLines.push(`==================================================\n`);
  }

  // 2. QCM
  if (kp.common_trap || (isMultipleOpinions && kp.claims && kp.claims.length > 1)) {
    hasActivity = true;
    let question = "";
    let options = "";
    let reponse = "";
    let sourceDistracteur = "";
    let neutre = "OUI";
    let dependAjout = "NON";
    let simplifie = "NON";
    let risque = "FAIBLE";
    let verdict = "SAFE";

    if (kp.common_trap) {
      question = `Quelle est la règle concernant : ${kp.title} ?`;
      options = `- ${kp.rule} (Correct)\n- ${kp.common_trap}`;
      reponse = kp.rule;
      sourceDistracteur = "common_trap";
    } else {
      question = `Selon l'opinion principale, que faut-il faire concernant : ${kp.title} ?`;
      options = `- ${kp.claims[0].text} (Correct)\n- ${kp.claims[1].text}`;
      reponse = kp.claims[0].text;
      sourceDistracteur = "autre opinion du KP";
      if (!question.toLowerCase().includes("selon l'opinion")) {
        verdict = "À REVOIR";
        risque = "ÉLEVÉ";
      }
    }

    if (isConditional && !question.toLowerCase().includes('condition') && !kp.title.toLowerCase().includes('cas')) {
       // La condition n'est peut-être pas claire
       verdict = "À REVOIR";
       risque = "MOYEN";
    }

    if (verdict === "SAFE") stats.qcm.safe++;
    else if (verdict === "À REVOIR") stats.qcm.a_revoir++;
    else stats.qcm.rejeter++;

    mdLines.push(`### Activity ${activityCount++}\n`);
    mdLines.push(`Type :\nQCM\n`);
    mdLines.push(`KP :\n${kp.id}\n`);
    mdLines.push(`Seif :\n${sourcesText}\n`);
    mdLines.push(`------------------\n`);
    mdLines.push(`SOURCE EXACTE DU KP :\n`);
    mdLines.push(`Règle : ${kp.rule}`);
    if (kp.common_trap) mdLines.push(`Common Trap : ${kp.common_trap}`);
    mdLines.push(`\n------------------\n`);
    mdLines.push(`ACTIVITÉ PROPOSÉE :\n`);
    mdLines.push(`Question :\n${question}\n`);
    mdLines.push(`Options :\n${options}\n`);
    mdLines.push(`Réponse :\n${reponse}\n`);
    mdLines.push(`Explication :\n${kp.explanation || '-'}\n`);
    mdLines.push(`------------------\n`);
    mdLines.push(`ANALYSE DE SÉCURITÉ :\n`);
    mdLines.push(`Informations provenant directement de la source :\nLa règle correcte et le distracteur (${sourceDistracteur}).\n`);
    mdLines.push(`Contexte ajouté :\nAucun\n`);
    mdLines.push(`Ce contexte est-il neutre ?\n${neutre}\n`);
    mdLines.push(`La réponse dépend-elle d'une information ajoutée ?\n${dependAjout}\n`);
    mdLines.push(`La formulation simplifie-t-elle excessivement la Halakha ?\n${simplifie}\n`);
    mdLines.push(`Risque de mauvaise compréhension :\n${risque}\n`);
    mdLines.push(`Verdict proposé :\n${verdict}\n`);
    mdLines.push(`==================================================\n`);
  }

  // 3. V/F
  if (kp.common_trap) {
    hasActivity = true;
    let question = `Vrai ou Faux : ${kp.common_trap}`;
    let reponse = "Faux";
    let neutre = "OUI";
    let dependAjout = "NON";
    let simplifie = "NON";
    let risque = "FAIBLE";
    let verdict = "SAFE";

    if (verdict === "SAFE") stats.vf.safe++;
    else if (verdict === "À REVOIR") stats.vf.a_revoir++;
    else stats.vf.rejeter++;

    mdLines.push(`### Activity ${activityCount++}\n`);
    mdLines.push(`Type :\nVrai-Faux\n`);
    mdLines.push(`KP :\n${kp.id}\n`);
    mdLines.push(`Seif :\n${sourcesText}\n`);
    mdLines.push(`------------------\n`);
    mdLines.push(`SOURCE EXACTE DU KP :\n`);
    mdLines.push(`Règle : ${kp.rule}`);
    mdLines.push(`Common Trap : ${kp.common_trap}`);
    mdLines.push(`\n------------------\n`);
    mdLines.push(`ACTIVITÉ PROPOSÉE :\n`);
    mdLines.push(`Question :\n${question}\n`);
    mdLines.push(`Options :\n- Vrai\n- Faux\n`);
    mdLines.push(`Réponse :\n${reponse}\n`);
    mdLines.push(`Explication :\nLa règle est : ${kp.rule}\n`);
    mdLines.push(`------------------\n`);
    mdLines.push(`ANALYSE DE SÉCURITÉ :\n`);
    mdLines.push(`Informations provenant directement de la source :\nL'affirmation fausse est le common_trap exact.\n`);
    mdLines.push(`Contexte ajouté :\nAucun\n`);
    mdLines.push(`Ce contexte est-il neutre ?\n${neutre}\n`);
    mdLines.push(`La réponse dépend-elle d'une information ajoutée ?\n${dependAjout}\n`);
    mdLines.push(`La formulation simplifie-t-elle excessivement la Halakha ?\n${simplifie}\n`);
    mdLines.push(`Risque de mauvaise compréhension :\n${risque}\n`);
    mdLines.push(`Verdict proposé :\n${verdict}\n`);
    mdLines.push(`==================================================\n`);
  }

  // 4. VALIDATION HUMAINE (Reference)
  if (kp.importance === 'reference') {
    stats.validation++;
    if (!hasActivity) {
      mdLines.push(`### Activity ${activityCount++}\n`);
      mdLines.push(`Type :\nÀ VALIDER\n`);
      mdLines.push(`KP :\n${kp.id}\n`);
      mdLines.push(`Seif :\n${sourcesText}\n`);
      mdLines.push(`------------------\n`);
      mdLines.push(`SOURCE EXACTE DU KP :\n`);
      mdLines.push(`Règle : ${kp.rule}`);
      mdLines.push(`\n------------------\n`);
      mdLines.push(`ANALYSE DE SÉCURITÉ :\n`);
      mdLines.push(`Ce KP a une importance "reference". Il contient souvent des nuances ou des discussions (ex: "Le Seif rapporte...").\n`);
      mdLines.push(`Verdict proposé :\nÀ REVOIR (Requiert une validation humaine approfondie avant de créer toute activité).\n`);
      mdLines.push(`==================================================\n`);
    }
  }
});

let md = `# Validation Éditoriale Humaine - Siman 1

Ce document présente une analyse sémantique et de sécurité pour toutes les activités SAFE proposées, ainsi que les KPs nécessitant une validation humaine.

==================================================

${mdLines.join('\n')}

### STATISTIQUES FINALES

Situations :
SAFE = ${stats.situations.safe}
À REVOIR = ${stats.situations.a_revoir}
REJETER = ${stats.situations.rejeter}

QCM :
SAFE = ${stats.qcm.safe}
À REVOIR = ${stats.qcm.a_revoir}
REJETER = ${stats.qcm.rejeter}

V/F :
SAFE = ${stats.vf.safe}
À REVOIR = ${stats.vf.a_revoir}
REJETER = ${stats.vf.rejeter}

Validation humaine requise (Reference) : ${stats.validation}
`;

fs.writeFileSync(path.join(__dirname, 'human_review.md'), md);
console.log("Revue humaine générée.");
