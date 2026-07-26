import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const TITLES_MAP_318 = {
  "1": "Interdiction biblique de cuisiner le Chabbat",
  "2": "Rôtir de la viande ou du pain le Chabbat",
  "3": "Fondre de la cire, de la graisse ou du goudron",
  "4": "Secourir des objets d'un incendie",
  "5": "Transgression volontaire ou par erreur de cuisson",
  "6": "Retirer de la pâte d'un four avant cuisson",
  "7": "Pâte cuite au four pendant le Chabbat",
  "8": "Champ d'application du travail de Bishoul",
  "9": "Degré de cuisson minimal (Ma'akhal Ben Deroussaï)",
  "10": "La cuisson sans lien avec le feu",
  "11": "Chauffer de l'eau ou du lait (Yad Soledet Bo)",
  "12": "Poser de l'eau face au feu",
  "13": "Sécher un vêtement mouillé près du feu",
  "14": "Cuisson des fruits le Chabbat",
  "15": "Fruits consommables crus cuits au feu",
  "16": "Réchauffer de l'eau déjà bouillie",
  "17": "Erreur de réchauffement d'eau crue",
  "18": "Poser du lait cuit près du feu",
  "19": "Interdiction d'employer un non-Juif pour cuisiner",
  "20": "Cuisson au moyen d'un appareil électrique",
  "21": "Cuisson au four à micro-ondes le Chabbat",
  "22": "Réchauffer un aliment sec au micro-ondes",
  "23": "Allumer un feu au moyen d'une loupe",
  "24": "Cuisson dans les sources chaudes de Tibériade",
  "25": "Permission de cuire directement au soleil (Hammah)",
  "26": "Utiliser une loupe face au soleil",
  "27": "Griller un œuf sur un toit brûlé par le soleil",
  "28": "Ouvrir le robinet d'eau chaude d'un chauffe-eau solaire",
  "29": "Mélanger de l'eau chaude solaire avec de l'eau froide",
  "30": "Pouvoir de cuisson du Kli Rishon (premier récipient)",
  "31": "Aliments non consommables cuits dans un Kli Rishon",
  "32": "Effusion (Irouï) à partir d'un Kli Rishon",
  "33": "Verser de l'eau chaude sur un aliment cuit",
  "34": "Interdiction d'ouvrir l'eau chaude d'un chauffe-eau électrique/gaz",
  "35": "Robinets d'eau chaude centralisés",
  "36": "Tuyauteries d'eau chaude sous pression",
  "37": "Samovar / Urne à eau le Chabbat",
  "38": "Retirer de l'eau d'un chauffe-eau à thermostat",
  "39": "Verser de l'eau chaude dans une tasse vide",
  "40": "Verser de l'eau chaude sur des feuilles de thé fraîches",
  "41": "Essence de thé préparée avant Chabbat",
  "42": "Utilisation des sachets de thé le Chabbat",
  "43": "Préparation du thé dans un Kli Shelishi",
  "44": "Rigueur pour le thé dans un Kli Sheni",
  "45": "Chose sèche trempée avant Chabbat",
  "46": "Plat cuit sur la plaque (Plata) avant Chabbat",
  "47": "Verser de l'eau chaude dans une soupe sèche",
  "48": "Verser de l'eau froide dans de l'eau chaude en Kli Rishon",
  "49": "Le Kli Sheni (second récipient) ne cuit pas",
  "50": "Aliments faciles à cuire (Kalei HaBishoul) en Kli Sheni",
  "51": "Verser du Kli Sheni sur un aliment non cuit",
  "52": "Mettre des feuilles de menthe dans du thé chaud",
  "53": "Épices et herbes en Kli Sheni",
  "54": "Poudre de café ou cacao dans un Kli Sheni",
  "55": "Statut des liquides vis-à-vis des Kalei HaBishoul",
  "56": "Mettre un aliment cru dans un Kli Sheni",
  "57": "Pas de cuisson après cuisson pour les aliments secs (Ein Bishoul Ahar Bishoul)",
  "58": "Plats à majorité sèche avec un peu de sauce",
  "59": "Séfarades suivant la coutume d'Ovadia Yossef",
  "60": "Réchauffer un plat sec sur la Plata le Chabbat",
  "61": "Plat congelé ou glace réchauffée",
  "62": "Poser un pâté (Pishtida) face au feu",
  "63": "Superposer une marmite sur une autre marmite",
  "64": "Seconde cuisson des solides déjà cuits",
  "65": "Griller du pain sur la Plata",
  "66": "Mettre du pain dans une soupe chaude",
  "67": "Mettre des croûtons cuits dans la soupe",
  "68": "Mettre du sel dans un Kli Sheni ou Kli Rishon",
  "69": "Mettre du poivre moulu ou du curcuma chaud",
  "70": "Ajouter de l'eau bouillante dans le Cholent/Dafina",
  "71": "Coutumes rigoureuses ou indulgentes sur le liquide",
  "72": "Étudiants en Yéchiva ashkénaze et règles de cuisson",
  "73": "Poser un plat non cuit sur le feu avant Chabbat",
  "74": "Poser un plat partiellement cuit sur le feu",
  "75": "Couvrir une marmite non cuite avant Chabbat",
  "76": "Œuf ébouillanté avant Chabbat",
  "77": "Tremper un œuf dur dans l'eau chaude",
  "78": "Verser de l'eau chaude sur du café soluble ou lait en poudre",
  "79": "Soulever et reposer la bouilloire d'eau sur la Plata",
  "80": "Mettre du sucre dans un verre et verser de l'eau chaude",
  "81": "Couvrir une marmite contenant des oignons cuits",
  "82": "Mélanger (Mégasef) un plat sur le feu",
  "83": "Remettre le couvercle sur une marmite cuite à point",
  "84": "Marmite partiellement cuite sur la Plata",
  "85": "Kli Rishon retiré du feu",
  "86": "Plat liquide bouillant sur plaque recouverte",
  "87": "Versement (Irouï) depuis un Kli Rishon",
  "88": "Interdiction de mariner des légumes le Chabbat (Kavoush)",
  "89": "Mettre des raisins secs dans de l'eau",
  "90": "Fruits très secs réhydratés",
  "91": "Placer un sac de riz dans la marmite avant Chabbat"
};

function updateSiman318() {
  const paths = [
    path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', 'siman_318.json'),
    path.join(ROOT, 'public', 'data', 'siman_318.json'),
    path.join(ROOT, 'public', 'data', 'yalkout-318.json')
  ];

  paths.forEach(p => {
    if (!fs.existsSync(p)) return;
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    data.halakhot.forEach(h => {
      const seifKey = String(h.seif);
      h.titre_seif = TITLES_MAP_318[seifKey] || `Seïf ${seifKey}`;
    });
    fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${path.basename(p)} for Siman 318 with ${data.halakhot.length} seif titles.`);
  });
}

updateSiman318();

console.log("✅ Siman 318 successfully updated with all 91 Seif mini-titles!");
