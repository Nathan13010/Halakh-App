const fs = require('fs');

const dataFile = 'public/data/siman_1.json';
const booksFile = 'src/data/books.js';

let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

// The exact replacement string for Seif 1 translation
const seif1Fr = "1. Nous avons appris dans le traité Avot : Yehouda ben Téma disait : « Sois fort comme le léopard, léger comme l'aigle, rapide comme le cerf et courageux comme le lion, pour faire la volonté de ton Père qui est aux cieux. » Et on en a déduit quatre choses pour le service du Créateur. « Sois fort comme le léopard », car lorsqu’un homme accomplit une Mitsva, il ne doit pas avoir honte des gens qui se moquent de lui. « Léger comme un aigle », pour se dépêcher de fermer les yeux afin de ne pas voir le mal, car la vue des yeux est le commencement du péché. « Rapide comme un cerf », pour que les jambes courent vers une bonne chose. « Et courageux comme un lion », c'est le courage du cœur pour vaincre le penchant. C’est pourquoi, il se renforcera comme un lion pour se lever le matin au service de son Créateur, afin que ce soit lui qui éveille l'aube. En tout cas, il ne retardera pas l'heure de la prière et de la lecture du Chema. Et bien que celui qui accomplit les commandements de Dieu n'ait pas à avoir honte de ceux qui se moquent de lui, de toute façon, il ne se querellera pas et ne se disputera pas avec eux, afin de ne pas s'habituer au vilain défaut de l'effronterie.";

data.halakhot.forEach(h => {
  // 1. Structure unity
  if (parseInt(h.seif) >= 6) {
    h.sujet = "הלכות השכמת הבוקר";
    h.sujet_fr = "Lois du réveil du matin";
  } else {
    h.id = "p" + h.seif;
    h.numero = h.seif;
  }

  // 2. Fix the '. .' typgraphy in texts
  if (h.texte_integral.hebreu_sans_voyelles) {
    h.texte_integral.hebreu_sans_voyelles = h.texte_integral.hebreu_sans_voyelles.replace(/\s\.\s\./g, '.');
  }
  if (h.texte_integral.hebreu_avec_voyelles) {
    h.texte_integral.hebreu_avec_voyelles = h.texte_integral.hebreu_avec_voyelles.replace(/\s\.\s\./g, '.');
  }

  // 3. Translations
  if (h.seif === "1") {
    h.texte_integral.francais = seif1Fr;
  }
  if (h.seif === "9") {
    h.texte_integral.francais = h.texte_integral.francais.replace(", car il ne contient aucun des Noms divins", "");
  }

  // 4. Nikkoud Corrections
  h.mots_alignes.forEach(m => {
    if (h.seif === "1") {
      if (m.id === 46 && m.hebreu_voyelles === "לְעִצּוּם") m.hebreu_voyelles = "לַעֲצֹם";
      if (m.id === 55 && m.hebreu_voyelles === "הֶעֱבִירָהּ") m.hebreu_voyelles = "הָעֲבֵרָה";
    }
    if (h.seif === "2") {
      if (m.id === 14 && m.hebreu_voyelles === "בְּשֶׁיָּנָתַם") m.hebreu_voyelles = "בִּשְׁנָתָם";
    }
    if (h.seif === "4") {
      if (m.id === 6 && m.hebreu_voyelles === "הַשֶּׁינָה") m.hebreu_voyelles = "הַשֵּׁנָה";
      if (m.id === 45 && m.hebreu_voyelles === "מֻגֶּינָה") m.hebreu_voyelles = "מְגִנָּה";
    }
    if (h.seif === "5") {
      if (m.id === 6 && m.hebreu_voyelles === "מָשִׁינָה") m.hebreu_voyelles = "מִשֵּׁנָה";
      if (m.id === 9 && m.hebreu_voyelles === "בְּיִטּוֹל") m.hebreu_voyelles = "בִּטּוּל";
    }
    if (h.seif === "9") {
      if (m.id === 32 && m.hebreu_voyelles === "הָכֵי") m.hebreu_voyelles = "הָכִי";
    }
  });

  // Since we replaced the Nikkouds, update the hebreu_avec_voyelles as well
  let updatedVowels = [];
  h.mots_alignes.forEach(m => {
    updatedVowels.push(m.hebreu_voyelles);
  });
  // Note: we can't just join() because of punctuation. But we can string replace the bad words in the full string.
  // Actually, replacing in the full string is safer.
});

// String replacements for global vowels
let fullStr = JSON.stringify(data, null, 2);
fullStr = fullStr.replace(/"לְעִצּוּם"/g, '"לַעֲצֹם"');
fullStr = fullStr.replace(/"הֶעֱבִירָהּ"/g, '"הָעֲבֵרָה"');
fullStr = fullStr.replace(/"בְּשֶׁיָּנָתַם"/g, '"בִּשְׁנָתָם"');
fullStr = fullStr.replace(/"הַשֶּׁינָה"/g, '"הַשֵּׁנָה"');
fullStr = fullStr.replace(/"מֻגֶּינָה"/g, '"מְגִנָּה"');
fullStr = fullStr.replace(/"מָשִׁינָה"/g, '"מִשֵּׁנָה"');
fullStr = fullStr.replace(/"בְּיִטּוֹל"/g, '"בִּטּוּל"');
fullStr = fullStr.replace(/"הָכֵי"/g, '"הָכִי"');

data = JSON.parse(fullStr);

fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

// Update books.js
const booksContent = fs.readFileSync(booksFile, 'utf8');
const updatedBooks = booksContent.replace(/export const FALLBACK_PARAGRAPHS = \[([\s\S]*?)\];/, 'export const FALLBACK_PARAGRAPHS = ' + JSON.stringify(data.halakhot, null, 2) + ';');
fs.writeFileSync(booksFile, updatedBooks);

console.log('Fixed Nikkoud, Structure, Typo, and Translations');
