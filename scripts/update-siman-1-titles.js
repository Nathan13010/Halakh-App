import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const PATH_1 = path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', 'siman_1.json');
const PATH_2 = path.join(ROOT, 'public', 'data', 'siman_1.json');
const PATH_3 = path.join(ROOT, 'public', 'data', 'yalkout-1.json');

const TITLES_MAP = {
  "1": "Audace et force dans le service divin",
  "2": "L'empressement pour l'accomplissement des Mitsvot",
  "3": "Le réveil matinal et l'aube",
  "4": "Modération et sagesse dans le sommeil",
  "5": "Le sommeil durant la journée",
  "6": "Sieste de Chabbat et des Érudits",
  "7": "Réveil avant le lever du soleil",
  "8": "Manière de se lever au réveil",
  "9": "La prière de Modé Ani",
  "10": "Importance des premières pensées du matin",
  "11": "Éducation des enfants dès le réveil",
  "12": "Le principe de Shiviti Hashem",
  "13": "Moyens d'acquérir la crainte du Ciel",
  "14": "Nécessité de la discrétion (Tzniout)",
  "15": "Fermeté et courage face aux moqueries",
  "16": "Dissimuler ses bonnes actions",
  "17": "Pureté d'intention dans les Mitsvot",
  "18": "L'amour du prochain avant la prière",
  "19": "Récitation de 'Hareni Mekabel'",
  "20": "Priorité à la Kavanah (concentration)",
  "21": "Prières à voix basse selon le Ari zal",
  "22": "Récitation de la Akéda (Ligature d'Isaac)",
  "23": "Coutume de lire la Akéda chaque jour",
  "24": "Retardataires et omission de la Akéda",
  "25": "Verset 'Lema'an Yekhazek' après la Akéda",
  "26": "Passages du Korban Tamid (sacrifice quotidien)",
  "27": "Obligation pour les sages d'étudier les sacrifices",
  "28": "Chapitre 'Ei-zehou Mekoman' des sacrifices",
  "29": "Récitation des sacrifices pendant le jour",
  "30": "Section de l'hologauste (Olah) et des dons",
  "31": "Les sacrifices dans la maison du deuil",
  "32": "Récitation des sacrifices en position assise",
  "33": "Récitation des sacrifices par les femmes",
  "34": "Lecture de la Parashat HaMan (la Manne)",
  "35": "Moment de récitation des sacrifices",
  "36": "Récitation matinale pour les ouvriers",
  "37": "Récitation de 'Abaye Havah Mesader'",
  "38": "Récitation du Pitoum HaKetoret (Encens)",
  "39": "Lecture du Pitoum HaKetoret dans un livre",
  "40": "Écriture du Pitoum HaKetoret sur parchemin",
  "41": "Emplacement du verset 'Shiviti Hashem'",
  "42": "Lecture des Dix Commandements",
  "43": "Récitation du Tikoun Hatsot (lamentation de minuit)",
  "44": "Posture assise et sans chaussures pour Tikoun Hatsot",
  "45": "Tikoun Hatsot pendant les Trois Semaines",
  "46": "Interdiction du Tikoun Hatsot avant minuit",
  "47": "Calcul de l'heure exacte de minuit halakhique",
  "48": "Calcul de Hatsot selon la montre et le soleil",
  "49": "Tikoun Léa avant l'aube",
  "50": "Récitation du Tikoun Hatsot en communauté",
  "51": "Tikoun Hatsot pour les femmes",
  "52": "Priorité à l'étude de la Halakha ou Hatsot",
  "53": "Récitation du Tikoun Hatsot durant la fatigue",
  "54": "Exemption pour le marié et lors d'une brith",
  "55": "Structure de Tikoun Rachel et Tikoun Léa",
  "56": "Tikoun Hatsot la nuit du 9 Av",
  "57": "Tikoun Rachel durant l'année de la Shmita",
  "58": "Le Vidouy (confession) durant Tikoun Hatsot",
  "59": "Tikoun Hatsot dans la maison de l'endeuillé"
};

function updateSimanFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  data.halakhot.forEach((h) => {
    const seifKey = String(h.seif);
    h.titre_seif = TITLES_MAP[seifKey] || `Seïf ${seifKey}`;
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${path.basename(filePath)} with ${data.halakhot.length} seif titles.`);
}

updateSimanFile(PATH_1);
updateSimanFile(PATH_2);
updateSimanFile(PATH_3);

console.log("✅ Siman 1 successfully updated with all Seif mini-titles!");
