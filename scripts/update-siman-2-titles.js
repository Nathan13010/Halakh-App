import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const PATH_1 = path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', 'siman_2.json');
const PATH_2 = path.join(ROOT, 'public', 'data', 'siman_2.json');
const PATH_3 = path.join(ROOT, 'public', 'data', 'yalkout-2.json');

const TITLES_MAP_2 = {
  "1": "Pudeur lors de l'habillage",
  "2": "Pudeur dans l'obscurité et les pièces fermées",
  "3": "Propreté et tenue correcte des vêtements",
  "4": "Éviter les mauvaises odeurs sur les vêtements",
  "5": "Ordre d'enfilage : priorité au côté droit",
  "6": "Ordre du chaussage : pied droit puis pied gauche",
  "7": "Ordre du lacet pour un gaucher",
  "8": "Chaussures sans lacet spécifique",
  "9": "Ordre du lacet pour les femmes",
  "10": "Changer de chaussures",
  "11": "Interdiction d'enfiler deux vêtements à la fois",
  "12": "Chaussures avec surchaussures d'hiver",
  "13": "Ne pas placer ses vêtements sous son chevet",
  "14": "Interdiction de la démarche hautaine",
  "15": "Couverture de la tête (Kippa)",
  "16": "Marcher 4 coudées la tête couverte",
  "17": "Couverture de la tête durant la chaleur",
  "18": "Couvrir la tête des jeunes enfants",
  "19": "Couverture de la tête des femmes et jeunes filles",
  "20": "Réciter des bénédictions la tête couverte",
  "21": "Prononcer le Nom de D.ieu la tête couverte",
  "22": "Entrer à la synagogue la tête couverte",
  "23": "Se couvrir la tête avec la main ou la manche",
  "24": "Se couvrir la tête avec la main d'un ami",
  "25": "Couvre-chef et chapeau pour la prière",
  "26": "Interdiction d'abîmer ou mépriser ses vêtements",
  "27": "Se déshabiller avec pudeur le soir",
  "28": "Ordre pour retirer ses chaussures (gauche puis droit)"
};

function updateSimanFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  data.halakhot.forEach((h) => {
    const seifKey = String(h.seif);
    h.titre_seif = TITLES_MAP_2[seifKey] || `Seïf ${seifKey}`;
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${path.basename(filePath)} with ${data.halakhot.length} seif titles.`);
}

updateSimanFile(PATH_1);
updateSimanFile(PATH_2);
updateSimanFile(PATH_3);

console.log("✅ Siman 2 successfully updated with all Seif mini-titles!");
