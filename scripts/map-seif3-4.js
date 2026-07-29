import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/raw/siman_1_base.json', 'utf8'));

const tr3 = [
  "Paragraphe 3.", "Il faut", "anticiper", "de se lever", "le matin", "afin", "d'avoir le temps", "de préparer", "(particule)", "soi-même",
  "pour prier", "en public (avec minyan)", "et dans la propreté,", "pour ne pas", "rater", "l'heure", "de la prière.", "Et ils ont eu l'habitude", "dans quelques", "communautés",
  "d'Israël,", "que le bedeau (chamach)", "aille", "le matin", "et frappe", "à la porte", "ou", "à la fenêtre", "pour réveiller", "ceux qui dorment",
  "pour la prière", "et le service", "de D.", "—"
];

const tr4 = [
  "Paragraphe 4.", "Ne (doit) pas", "penser", "l'homme", "au sujet", "du sommeil", "que chaque", "ce", "qu'il sera", "en abondance,",
  "il y a", "en lui", "(un) bénéfice", "pour le corps,", "car", "ont convenu", "les médecins", "experts", "que ne (doit) pas", "dormir",
  "un homme", "moins", "de six", "heures,", "et pas", "plus", "de huit", "heures.", "Et plus", "que cela",
  "nuit", "à la santé.", "Et ils ont dit", "dans la Guemara :", "Le sommeil", "pour les justes", "(est) mauvais", "pour eux", "et mauvais", "pour le monde.",
  "Car la Torah", "qu'ils", "étudient", "en elle", "protège", "sur", "la génération,", "et quand ils", "s'arrêtent", "le malheur",
  "vient", "au monde.", "Et encore", "ils ont dit", "dans la Guemara", "les élèves", "sages", "qui étudient", "la Torah", "la nuit,",
  "considère", "à leur sujet", "le texte", "comme si", "ils s'occupaient", "du service", "des sacrifices.", "Et encore", "ils ont dit", "dans le Talmud de Jérusalem",
  "celui qui se fatigue", "dans son étude", "en privé", "(virgule)", "pas", "rapidement", "il", "n'oublie.", "Et Maïmonide", "a écrit :",
  "bien", "que c'est une mitsva", "d'étudier", "le jour", "et la nuit,", "il n'y a pas", "d'homme", "qui apprenne", "la majorité", "de sa sagesse",
  "si ce n'est", "la nuit.", "C'est pourquoi", "celui", "qui veut", "mériter", "la couronne", "de la Torah,", "fera attention", "dans toutes",
  "ses nuits,", "et n'en", "perdra", "même", "une", "d'entre elles", "dans le sommeil", "et la nourriture", "et la conversation,", "mais",
  "dans la Torah", "et les paroles", "de sagesse.", "—"
];

if (tr3.length !== data[2].mots_alignes.length) console.log('Seif 3 Length mismatch! Raw:', data[2].mots_alignes.length, 'Translated:', tr3.length);
if (tr4.length !== data[3].mots_alignes.length) console.log('Seif 4 Length mismatch! Raw:', data[3].mots_alignes.length, 'Translated:', tr4.length);

if (tr3.length === data[2].mots_alignes.length && tr4.length === data[3].mots_alignes.length) {
  data[2].titre_seif = "Préparation à la prière (Seif 3)";
  data[2].texte_integral.francais = "Il faut se lever tôt le matin afin d'avoir le temps de se préparer à prier en public et dans la propreté, pour ne pas rater l'heure de la prière. Il était de coutume dans certaines communautés d'Israël que le bedeau (chamach) passe le matin frapper aux portes ou aux fenêtres pour réveiller les dormeurs pour la prière et le service de Dieu.";
  data[2].mots_alignes.forEach((m, i) => { m.francais_mot = tr3[i]; m.expression_contexte = tr3[i]; });
  
  data[3].titre_seif = "La juste mesure du sommeil (Seif 4)";
  data[3].texte_integral.francais = "L'homme ne doit pas penser que plus il dormira, plus cela sera bénéfique pour son corps. En effet, les médecins experts s'accordent à dire qu'un homme ne doit pas dormir moins de six heures, ni plus de huit heures. Dormir plus que cela nuit à la santé. Nos Sages ont dit dans la Guemara : « Le sommeil des justes est mauvais pour eux et mauvais pour le monde. » Car la Torah qu'ils étudient protège la génération, et lorsqu'ils s'interrompent de l'étudier, le malheur vient au monde. La Guemara dit aussi que le texte considère les érudits qui étudient la Torah la nuit comme s'ils accomplissaient le service des sacrifices. Le Talmud de Jérusalem ajoute que celui qui peine dans son étude en privé ne l'oublie pas de sitôt. Maïmonide a écrit : bien que ce soit une mitsva d'étudier le jour et la nuit, un homme n'acquiert la majeure partie de sa sagesse que la nuit. Par conséquent, celui qui veut mériter la couronne de la Torah veillera sur toutes ses nuits et n'en perdra aucune dans le sommeil, la nourriture et les conversations futiles, mais les consacrera à la Torah et aux paroles de sagesse.";
  data[3].mots_alignes.forEach((m, i) => { m.francais_mot = tr4[i]; m.expression_contexte = tr4[i]; });
  
  fs.writeFileSync('scripts/raw/siman_1_base.json', JSON.stringify(data, null, 2));
  console.log('Seif 3 and 4 mapped successfully.');
}
