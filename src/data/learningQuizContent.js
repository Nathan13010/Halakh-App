const QUIZ_OVERRIDES = Object.freeze({
  "s1-kp-001": { answer: "Accomplir une Mitsva sans avoir honte des moqueries." },
  "s1-kp-002": { answer: "Rester fidèle aux Mitsvot sans se quereller avec les moqueurs." },
  "s1-kp-003": { answer: "Détourner rapidement les yeux de ce qu'il ne faut pas regarder." },
  "s1-kp-007": { answer: "Garder un équilibre entre le repos, l'étude, la prière et les bonnes actions." },
  "s1-kp-009": { answer: "Le texte rapporte une durée de sommeil de six à huit heures." },
  "s1-kp-010": { answer: "Réserver aussi un moment calme à l'étude pendant la soirée ou la nuit." },
  "s1-kp-011": { answer: "Éviter qu'un long sommeil dans la journée remplace le temps d'étude." },
  "s1-kp-012": { answer: "Une sieste peut être permise si elle aide à étudier ensuite, ainsi que pendant Chabbat." },
  "s1-kp-013": { answer: "Le texte présente le sommeil de fin de nuit comme particulièrement reposant." },
  "s1-kp-014": { answer: "Étudier la nuit sans manquer l'heure du Chema du matin." },
  "s1-kp-015": { answer: "Dans certains cas, ne pas prier à Nets sans dépasser l'heure du Chema et de la prière." },
  "s1-kp-017": { answer: "Selon cette pratique, éviter les paroles profanes avant les cantiques du matin." },
  "s1-kp-022": { answer: "Se rappeler que Dieu voit nos actions." },
  "s1-kp-023": { answer: "Renforcer la crainte du Ciel par la prière, la paix, le respect et l'honnêteté." },
  "s1-kp-024": { answer: "N'affronter qu'en dernier recours ceux qui empêchent les intérêts de la Torah." },
  "s1-kp-025": { answer: "Éviter un signe religieux visible s'il provoque un danger ou une forte hostilité locale." },
  "s1-kp-026": { answer: "Garder ses bonnes actions discrètes autant que possible." },
  "s1-kp-027": { answer: "On peut rester discret sur un acte pieux pour éviter de paraître orgueilleux." },
  "s1-kp-028": { answer: "Penser à l'amour de Dieu avant la prière du matin." },
  "s1-kp-029": { answer: "Accepter avant la prière la Mitsva d'aimer son prochain comme soi-même." },
  "s1-kp-030": { answer: "Mieux vaut peu de prières avec attention que beaucoup sans attention." },
  "s1-kp-031": { answer: "Dormir suffisamment pour pouvoir étudier avec force et profondeur." },
  "s1-kp-032": { answer: "Choisir la voix et les mouvements qui aident réellement à se concentrer." },
  "s1-kp-033": { answer: "Il est bon de réciter la Parachat HaAkéda avant Cha'harit." },
  "s1-kp-034": { answer: "Ne pas réciter la Parachat HaAkéda à Min'ha, sauf le jour de Kippour." },
  "s1-kp-035": { answer: "Réciter aussi la Parachat HaAkéda le Chabbat et les jours de fête." },
  "s1-kp-036": { answer: "En cas de retard, sauter certains passages pour prier avec la communauté." },
  "s1-kp-037": { answer: "Le Chabbat, donner priorité à la Parachat HaAkéda selon l'avis retenu." },
  "s1-kp-038": { answer: "Après la Parachat HaAkéda, la coutume séfarade récite le verset indiqué." },
  "s1-kp-039": { answer: "Réciter chaque jour le sacrifice perpétuel et Ézéhou Mekoman." },
  "s1-kp-040": { answer: "Réciter les Korbanot aussi le Chabbat et les jours de fête." },
  "s1-kp-041": { answer: "La récitation des Korbanot possède une grande valeur spirituelle." },
  "s1-kp-042": { answer: "Ne pas réciter séparément certains sacrifices déjà inclus dans Ézéhou Mekoman." },
  "s1-kp-043": { answer: "Réciter les Korbanot dans une maison de deuil, selon la coutume locale." },
  "s1-kp-044": { answer: "Ne pas se lever seul pour les Korbanot lorsque toute la communauté reste assise." },
  "s1-kp-045": { answer: "Ne pas ajouter la formule indiquée au Yehi Ratzon après les Korbanot." },
  "s1-kp-046": { answer: "Les Korbanot ne constituent pas une obligation stricte pour les femmes." },
  "s1-kp-047": { answer: "Réciter les Korbanot soigneusement avant Baroukh Chéamar." },
  "s1-kp-048": { answer: "En cas de retard, reporter les Korbanot après la prière pour prier avec la communauté." },
  "s1-kp-049": { answer: "Écouter la Hazarah et répondre Amen au lieu de réciter les Korbanot." },
  "s1-kp-050": { answer: "Réciter les Korbanot pendant la journée, à partir de l'aube." },
  "s1-kp-051": { answer: "Pour un réveil très matinal, suivre l'horaire particulier rapporté par la source." },
  "s1-kp-052": { answer: "Marquer de préférence une légère pause entre « Abayé » et « havé »." },
  "s1-kp-053": { answer: "Réciter le Pitoum HaKetoret avec concentration le matin et à Min'ha." },
  "s1-kp-054": { answer: "Penser sans le dire que la récitation de l'encens remplace l'offrande." },
  "s1-kp-055": { answer: "La source discute l'écriture du Pitoum HaKetoret seul sur un parchemin." },
  "s1-kp-056": { answer: "L'écriture de versets sur des objets demande des précautions halakhiques." },
  "s1-kp-057": { answer: "Lire les Dix Commandements et la Manne en privé, pas dans l'office public." },
  "s1-kp-058": { answer: "Exprimer la peine liée à la destruction du Temple et à l'exil de la Chékhina." },
  "s1-kp-059": { answer: "Prier et étudier avec joie, même après avoir exprimé la peine de l'exil." },
  "s1-kp-060": { answer: "S'asseoir par terre ou sur un petit support pour Tikkoun Rachel." },
  "s1-kp-061": { answer: "Pendant les Ben HaMetsarim, réciter le Tikkoun l'après-midi après le milieu du jour." },
  "s1-kp-062": { answer: "En général, ne pas réciter le Tikkoun ni des Psaumes avant le milieu de la nuit." },
  "s1-kp-063": { answer: "Certaines nuits et certains besoins permettent les Psaumes avant 'Hatsot." },
  "s1-kp-064": { answer: "Calculer 'Hatsot selon le lieu et le milieu entre lever et coucher du soleil." },
  "s1-kp-065": { answer: "Après l'aube, Tikkoun Léa peut encore être récité, mais pas Tikkoun Rachel." },
  "s1-kp-066": { answer: "Une partie de la communauté peut réciter Tikkoun 'Hatsot publiquement." },
  "s1-kp-067": { answer: "Les femmes n'en ont pas la coutume, mais on ne les empêche pas de le réciter." },
  "s1-kp-068": { answer: "Après le Tikkoun, le Talmid 'Hakham doit préserver son temps d'étude." },
  "s1-kp-069": { answer: "Si les deux sont impossibles, donner priorité au Tikkoun 'Hatsot sur les Séli'hot." },
  "s1-kp-070": { answer: "Certaines situations de mariage ou de Brit Mila dispensent du Tikkoun." },
  "s1-kp-071": { answer: "Tikkoun Rachel exprime la peine ; Tikkoun Léa contient louanges et demandes." },
  "s1-kp-072": { answer: "Selon le jour, omettre Tikkoun Rachel ou les deux parties du Tikkoun." },
  "s1-kp-073": { answer: "La nuit de Ticha Béav, réciter Tikkoun Rachel sans Tikkoun Léa." },
  "s1-kp-074": { answer: "La pratique de Tikkoun Rachel en Chémita diffère entre Israël et la diaspora." },
  "s1-kp-075": { answer: "Réciter le Vidouï avant le Tikkoun sans le répéter s'il vient d'être dit." },
  "s1-kp-076": { answer: "Dans une maison de deuil, plusieurs avis prévoient l'omission d'une ou des deux parties." },

  "s2-kp-001": {
    prompt: "Comment préserver sa pudeur en s'habillant ou en se déshabillant ?",
    answer: "Se couvrir autant que possible, même lorsque personne ne regarde."
  },
  "s2-kp-002": {
    prompt: "Comment se comporter dans un lieu de baignade ?",
    answer: "Ne découvrir son corps que lorsque cela est nécessaire."
  },
  "s2-kp-003": {
    prompt: "Comment prendre soin de ses vêtements ?",
    answer: "Les porter propres et correctement mis, sans paraître négligé."
  },
  "s2-kp-004": {
    prompt: "Quelle propreté vestimentaire est demandée ?",
    answer: "Éviter notamment toute mauvaise odeur sur ses vêtements."
  },
  "s2-kp-005": {
    prompt: "Par quelle partie du corps commencer à s'habiller ?",
    answer: "Commencer par la tête."
  },
  "s2-kp-006": {
    prompt: "Dans quel ordre mettre et lacer ses chaussures ?",
    answer: "Enfiler la droite, puis la gauche ; lacer la gauche, puis la droite."
  },
  "s2-kp-007": {
    prompt: "Par quelle chaussure un gaucher commence-t-il ?",
    answer: "Comme tout le monde, il commence par la chaussure droite."
  },
  "s2-kp-008": {
    prompt: "Quel côté lacer en premier si les deux côtés se lacent ?",
    answer: "Lacer d'abord le côté gauche, puis le côté droit."
  },
  "s2-kp-009": {
    prompt: "Quel ordre de chaussage une femme suit-elle ?",
    answer: "Les avis diffèrent sur le côté à lacer en premier."
  },
  "s2-kp-010": {
    prompt: "Quelle chaussure retirer d'abord pour accomplir une Mitsva ?",
    answer: "Retirer d'abord la chaussure droite."
  },
  "s2-kp-011": {
    prompt: "Peut-on enfiler deux vêtements en même temps ?",
    answer: "Non, il faut enfiler les vêtements un par un."
  },
  "s2-kp-012": {
    prompt: "Peut-on enfiler des couvre-chaussures sur ses chaussures ?",
    answer: "Oui, cela n'est pas considéré comme deux vêtements en même temps."
  },
  "s2-kp-013": {
    prompt: "Peut-on dormir avec des vêtements sous la tête ?",
    answer: "Il faut éviter de placer ses vêtements sous sa tête."
  },
  "s2-kp-014": {
    prompt: "Quelle posture faut-il éviter en marchant ?",
    answer: "Une posture excessivement droite et orgueilleuse."
  },
  "s2-kp-015": {
    prompt: "Peut-on marcher quatre coudées la tête découverte ?",
    answer: "Non, il faut se couvrir la tête."
  },
  "s2-kp-016": {
    prompt: "Quelle taille de Kippa est considérée comme préférable ?",
    answer: "Une Kippa couvrant toute la tête ou sa majorité."
  },
  "s2-kp-017": {
    prompt: "Peut-on garder la tête découverte dans des bains publics ?",
    answer: "Oui, cela est permis dans ce lieu."
  },
  "s2-kp-018": {
    prompt: "Faut-il se couvrir la tête pour dormir ?",
    answer: "Ce n'est pas obligatoire, mais c'est une bonne conduite lorsque c'est possible."
  },
  "s2-kp-019": {
    prompt: "Quand habituer un enfant à porter une Kippa ?",
    answer: "Dès qu'il commence à marcher, ou au plus tard vers trois ans selon la source."
  },
  "s2-kp-020": {
    prompt: "Comment aller chercher une Kippa tombée plus loin ?",
    answer: "Se couvrir provisoirement la tête avec une manche ou un autre objet."
  },
  "s2-kp-021": {
    prompt: "Peut-on réciter une bénédiction la tête découverte ?",
    answer: "Non, il faut se couvrir la tête."
  },
  "s2-kp-022": {
    prompt: "Peut-on penser à la Torah lorsque la tête doit rester découverte ?",
    answer: "Oui, si la personne est contrainte de rester ainsi."
  },
  "s2-kp-023": {
    prompt: "Peut-on répondre Amen la tête découverte ?",
    answer: "Oui, il est permis de répondre Amen."
  },
  "s2-kp-024": {
    prompt: "Peut-on travailler sans couvre-chef si l'employeur l'impose ?",
    answer: "Certains avis le permettent si aucun autre moyen de subsistance n'existe."
  },
  "s2-kp-025": {
    prompt: "Peut-on dire Chalom à une personne tête découverte ?",
    answer: "Oui, il est permis de la saluer en premier."
  },
  "s2-kp-026": {
    prompt: "Peut-on répondre Chalom chez le coiffeur, tête découverte ?",
    answer: "Oui, il est permis de rendre le salut."
  },
  "s2-kp-027": {
    prompt: "Peut-on marcher pieds nus sur un sol non pavé ?",
    answer: "Non, il faut éviter de marcher ainsi."
  },
  "s2-kp-028": {
    prompt: "Faut-il marcher pieds nus pour expier ses fautes ?",
    answer: "Non, cette forme de pénitence est déconseillée."
  },

  "s3-kp-001": {
    prompt: "Quand est-il conseillé d'aller aux toilettes ?",
    answer: "Le matin et le soir, notamment avant les prières."
  },
  "s3-kp-002": {
    prompt: "Peut-on retenir longtemps ses besoins naturels ?",
    answer: "Non, il faut aller aux toilettes sans attendre inutilement."
  },
  "s3-kp-003": {
    prompt: "Retenir des gaz relève-t-il du même interdit ?",
    answer: "Non, cela ne relève pas de cet interdit précis."
  },
  "s3-kp-004": {
    prompt: "Faut-il attendre avant de se moucher ?",
    answer: "Non, il ne convient pas de garder les mucosités nasales."
  },
  "s3-kp-005": {
    prompt: "Que faire si un besoin survient pendant une lecture sacrée ?",
    answer: "Terminer le passage en cours, puis aller se soulager."
  },
  "s3-kp-006": {
    prompt: "Quelle attitude physique adopter aux toilettes ?",
    answer: "S'asseoir calmement et ne pas forcer excessivement."
  },
  "s3-kp-007": {
    prompt: "Récite-t-on encore une formule avant d'entrer aux toilettes ?",
    answer: "Cette formule appartenait à la pratique de l'époque du Talmud."
  },
  "s3-kp-008": {
    prompt: "Comment préserver sa pudeur aux toilettes ?",
    answer: "Ne découvrir que la partie du corps strictement nécessaire."
  },
  "s3-kp-009": {
    prompt: "Peut-on parler ou téléphoner aux toilettes ?",
    answer: "Non, il faut éviter les conversations."
  },
  "s3-kp-010": {
    prompt: "Peut-on penser à des paroles de Torah aux toilettes ?",
    answer: "Non, ce lieu doit rester séparé des paroles de Torah."
  },
  "s3-kp-011": {
    prompt: "Où placer des toilettes par rapport au lieu d'étude ?",
    answer: "Assez loin pour éviter odeurs et paroles de Torah audibles."
  },
  "s3-kp-012": {
    prompt: "Peut-on penser à la Torah pour repousser une pensée interdite ?",
    answer: "Oui, uniquement lorsque cela sert à éviter la faute."
  },
  "s3-kp-013": {
    prompt: "Peut-on entrer avec un livre saint dans sa poche ?",
    answer: "A priori, il faut laisser le livre à l'extérieur."
  },
  "s3-kp-014": {
    prompt: "Quelle attention porter aux livres saints ?",
    answer: "Préserver soigneusement leur sainteté."
  },
  "s3-kp-015": {
    prompt: "Une réflexion halakhique empêche-t-elle d'aller aux toilettes ?",
    answer: "Non, on peut interrompre l'étude et entrer aux toilettes."
  },
  "s3-kp-016": {
    prompt: "Peut-on lire aux toilettes un livre d'hébreu fondé sur des versets ?",
    answer: "Non, cette lecture risque d'amener à penser aux textes bibliques."
  },
  "s3-kp-017": {
    prompt: "Peut-on penser aux besoins pratiques d'une Mitsva aux toilettes ?",
    answer: "Oui, la stricte loi permet ces calculs pratiques."
  },
  "s3-kp-018": {
    prompt: "Comment assurer le nettoyage après les toilettes ?",
    answer: "S'essuyer avec du papier, puis se laver à l'eau."
  },
  "s3-kp-019": {
    prompt: "Quelle habitude apprendre à un enfant après ses besoins ?",
    answer: "Veiller à ce que son corps reste propre."
  },
  "s3-kp-020": {
    prompt: "Quelle main ne faut-il pas utiliser pour s'essuyer ?",
    answer: "La main droite."
  },
  "s3-kp-021": {
    prompt: "Peut-on uriner debout directement sur le sol ?",
    answer: "Non, sauf si l'on évite les éclaboussures grâce au terrain."
  },
  "s3-kp-022": {
    prompt: "Quelle précaution prendre en urinant ?",
    answer: "Ne pas tenir le membre au-delà de la limite indiquée par la loi."
  },
  "s3-kp-023": {
    prompt: "Peut-on stocker de la nourriture emballée aux toilettes ?",
    answer: "A priori non, même si l'emballage est fermé."
  },
  "s3-kp-024": {
    prompt: "Peut-on garder un médicament dans sa poche aux toilettes ?",
    answer: "Oui, sauf précaution particulière pour un médicament sucré à sucer."
  },
  "s3-kp-025": {
    prompt: "Comment orienter son lit lorsque c'est possible ?",
    answer: "De préférence, la tête à l'est et les pieds à l'ouest."
  }
});

export const getLearningQuizOverride = (knowledgePointId) => {
  const override = QUIZ_OVERRIDES[knowledgePointId];
  if (!override) return null;
  return {
    quizPrompt: override.prompt,
    quizAnswer: override.answer
  };
};
