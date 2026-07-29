import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/raw/siman_1_base.json', 'utf8'));

const tr5 = [
  "Paragraphe 5.", "Il convient", "pour lui", "pour l'homme", "de s'abstenir", "du sommeil", "le jour,", "à cause (de la)", "perte", "Torah.",
  "Cependant", "si", "par", "le moyen", "qu'il dorme", "un peu", "le jour", "il pourra", "étudier", "la nuit",
  "jusqu'à", "une heure", "tardive", "plus,", "ou", "qu'il pourra", "étudier", "plus", "avec concentration", "et en profondeur,",
  "il est permis", "de dormir", "le jour.", "Mais", "(qu')il ne", "multiplie pas", "dans le sommeil.", "—", "Et de même", "pendant le Chabbat",
  "il est permis", "de dormir", "le jour.", "—"
];

if (tr5.length !== data[4].mots_alignes.length) {
  console.log('Seif 5 Length mismatch! Raw:', data[4].mots_alignes.length, 'Translated:', tr5.length);
} else {
  data[4].titre_seif = "Le sommeil pendant la journée (Seif 5)";
  data[4].texte_integral.francais = "Il convient à l'homme de s'abstenir de dormir la journée afin de ne pas perdre de temps d'étude de la Torah. Cependant, si le fait de dormir un peu la journée lui permet d'étudier la nuit jusqu'à une heure plus tardive, ou s'il pourra étudier avec plus de concentration et d'approfondissement, il lui est alors permis de dormir de jour. Mais il ne devra pas dormir excessivement. De même, pendant le Chabbat, il est permis de dormir la journée.";
  data[4].mots_alignes.forEach((m, i) => { m.francais_mot = tr5[i]; m.expression_contexte = tr5[i]; });
  
  // Wrap into the final required schema format
  const finalJson = {
    titre: "הלכות השכמת הבוקר - Lois du réveil",
    description: "Les lois concernant le lever du matin et la Zrizout.",
    halakhot: data
  };
  
  fs.writeFileSync('public/data/kitzur_yalkut_yosef/shabbat/siman_1.json', JSON.stringify(finalJson, null, 2));
  console.log('Seif 5 mapped and siman_1.json completely written with the first 5 seifim!');
}
