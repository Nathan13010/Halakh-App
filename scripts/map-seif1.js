import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/raw/siman_1_base.json', 'utf8'));

// Seif 1 words 
const tr1 = [
  "Paragraphe 1.", "Nous avons appris", "dans le traité", "Avot", "(que) Yehouda", "fils de", "Teima", "dit,", "sois", "fort", 
  "comme un léopard,", "et léger", "comme un aigle,", "et rapide", "comme un cerf,", "et courageux", "comme un lion,", "pour faire", "la volonté", "de ton Père", 
  "qui est aux cieux.", "Et ils ont appris", "d'ici", "quatre", "choses", "dans le service", "du Créateur,", "sois", "fort", "comme un léopard,",
  "car", "lorsque", "accomplira", "un homme", "une mitsva", "il ne (doit) pas", "avoir honte", "devant", "les fils", "d'homme (les gens)",
  "qui se moquent", "de lui.", "Et léger", "comme un aigle,", "de se dépêcher", "de fermer", "ses yeux", "de voir", "le mal,", "car",
  "la vision", "des yeux", "est", "le début", "de la faute.", "Et rapide", "comme un cerf,", "que les jambes", "courent", "pour une chose",
  "bonne.", "Et courageux", "comme un lion,", "c'est", "le courage", "du cœur", "pour vaincre", "le penchant (au mal).", "Et c'est pourquoi", "il se renforcera",
  "comme un lion", "pour se lever", "le matin", "pour le service", "de son Créateur,", "afin qu'il soit", "lui", "qui réveille", "l'aube.", "Et sur",
  "chaque", "face (en tout cas)", "il ne (doit) pas", "retarder", "l'heure", "de la prière", "et de la lecture", "du Chema.", "—", "—",
  "Et bien", "que", "—", "celui qui accomplit", "(particule)", "les commandements", "de D.",
  "il n'y a pas", "pour lui", "à avoir honte", "devant", "ceux qui se moquent", "de lui,", "de tout", "lieu (toutefois)", "il ne (doit) pas", "se quereller",
  "et se disputer", "avec eux,", "aussi", "afin", "qu'il ne", "s'habitue", "au trait (de caractère)", "de l'effronterie", "méprisable", "beaucoup.",
  "—", "—"
];

if (tr1.length !== data[0].mots_alignes.length) {
  console.log('Seif 1 Length mismatch!', 'Raw:', data[0].mots_alignes.length, 'Translated:', tr1.length);
} else {
  data[0].titre_seif = "Se lever avec force et courage (Seif 1)";
  data[0].texte_integral.francais = "Nous avons appris dans le traité Avot (5:20) : Yehouda ben Téma disait : « Sois fort comme le léopard, léger comme l'aigle, rapide comme le cerf et courageux comme le lion, pour faire la volonté de ton Père qui est aux cieux. » Les Sages en ont déduit quatre qualités requises dans le service du Créateur. « Sois fort comme le léopard » signifie que, lorsqu’un homme accomplit une Mitsva, il ne doit pas avoir honte de ceux qui se moquent de lui. « Léger comme un aigle » signifie de se dépêcher de fermer les yeux pour ne pas voir le mal, car la vue est le commencement du péché. « Rapide comme un cerf » signifie que les jambes doivent courir pour accomplir de bonnes choses. « Et courageux comme un lion » désigne le courage du cœur nécessaire pour vaincre le mauvais penchant. C’est pourquoi, il faut se renforcer comme un lion pour se lever le matin au service de son Créateur, afin que ce soit lui qui éveille l'aube. En tout cas, il ne doit absolument pas retarder l'heure de la prière et de la lecture du Chema. L'essentiel du courage réside dans le cœur, pour dominer son penchant et le vaincre, à l'image d'un guerrier qui prend le dessus sur son ennemi, le bat et le jette à terre. Ainsi, chaque individu doit se renforcer contre son penchant, tel un lion, pour se lever de son sommeil et servir son Créateur. Cependant, bien que celui qui accomplit les commandements divins ne doive pas avoir honte des moqueurs, il ne doit pas pour autant se quereller ou se disputer avec eux, afin de ne pas s'habituer au vilain défaut de l'effronterie. Mais si son but est d’influencer la communauté pour la Torah et les Mitsvot, et qu'il a tenté de le faire par des voies pacifiques sans succès, il lui est alors permis de s'opposer fermement et de les confronter pour déjouer leurs mauvais desseins.";
  data[0].mots_alignes.forEach((m, i) => {
    m.francais_mot = tr1[i];
    m.expression_contexte = tr1[i];
  });
}

// Write the modified data back
fs.writeFileSync('scripts/raw/siman_1_base.json', JSON.stringify(data, null, 2));
console.log('Seif 1 mapped successfully.');
