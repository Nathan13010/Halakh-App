import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/raw/siman_1_base.json', 'utf8'));

const tr2 = [
  "Paragraphe 2.", "Il faut", "(que) l'homme", "qu'il soit", "chez lui", "par nature", "et habitude", "constante", "de courir", "pour une affaire",
  "de mitsva,", "et il y a", "ceux qui s'attardent", "dans leur sommeil,", "et qui s'attardent", "dans leur maison,", "et après", "cela", "ils courent", "à la maison",
  "d'assemblée (la synagogue),", "et ce n'est pas", "cela", "le trait (de caractère)", "de l'empressement (zrizout),", "car bien", "qu'on voit", "eux", "courir", "et s'empresser,",
  "c'est", "parce", "qu'ils ont retardé", "de se lever tôt", "(pour se lever),", "et c'est pourquoi", "ils courent", "pour rattraper (le temps)", "(et) arriver", "à la prière",
  "à la maison", "d'assemblée.", "Et toujours", "sera", "un homme", "empressé", "pour la prière", "et pour la Torah,", "et il ne (doit) pas", "être attiré",
  "après", "le sommeil", "et les plaisirs,", "et (que) ne", "le séduise (pas)", "son penchant", "pour être négligent", "à cause", "de sa richesse", "et de ses biens,",
  "car tout", "passe", "et périt,", "alors que", "(la) Torah", "et sa récompense", "se tiennent (restent)", "pour toujours.", "—"
];

if (tr2.length !== data[1].mots_alignes.length) {
  console.log('Seif 2 Length mismatch!', 'Raw:', data[1].mots_alignes.length, 'Translated:', tr2.length);
} else {
  data[1].titre_seif = "L'empressement pour les Mitsvot (Seif 2)";
  data[1].texte_integral.francais = "L'homme doit faire en sorte que ce soit chez lui une nature et une habitude constante de courir pour accomplir une Mitsva. Certains s'attardent dans leur sommeil et traînent chez eux, puis courent ensuite à la synagogue. Ce n'est pas là la qualité de l'empressement (Zrizout) ; car bien qu'on les voie courir et se presser, c'est uniquement parce qu'ils ont retardé leur lever, et courent donc pour rattraper le temps et arriver à la prière à la synagogue. Un homme doit toujours être empressé pour la prière et la Torah. Il ne doit pas se laisser entraîner par le sommeil et les plaisirs, ni laisser son mauvais penchant le séduire à la négligence à cause de sa richesse et de ses biens, car tout est éphémère et voué à disparaître, tandis que la Torah et sa récompense subsistent éternellement.";
  data[1].mots_alignes.forEach((m, i) => {
    m.francais_mot = tr2[i];
    m.expression_contexte = tr2[i];
  });
  fs.writeFileSync('scripts/raw/siman_1_base.json', JSON.stringify(data, null, 2));
  console.log('Seif 2 mapped successfully.');
}
