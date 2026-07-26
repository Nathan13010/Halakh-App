import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const TITLES_MAP_3 = {
  "1": "Propreté et hygiène le matin",
  "2": "Interdiction de retenir ses besoins (Bal Teshaqetzo)",
  "3": "Cas des gaz abdominaux",
  "4": "Ne pas retenir les sécrétions nasales",
  "5": "Se soulager durant la Torah ou la prière",
  "6": "Posture et douceur lors de la défécation",
  "7": "Prière d'autrefois 'Hishamrou Mal'akhei HaKodesh'",
  "8": "Attitude de pudeur aux toilettes",
  "9": "Interdiction de parler aux toilettes",
  "10": "Interdiction d'étudier la Torah aux toilettes",
  "11": "Orientation des toilettes lors des constructions",
  "12": "Penser aux affaires profanes aux toilettes",
  "13": "Objets de sainteté (Téfilines) en poche",
  "14": "Interdiction d'introduire des livres sacrés",
  "15": "Interrompre l'étude pour aller aux toilettes",
  "16": "Livres de grammaire ou profanes aux toilettes",
  "17": "Penser aux affaires de Tsedaka aux toilettes",
  "18": "Nettoyage à l'eau et au papier",
  "19": "Éducation des enfants à la propreté",
  "20": "Essuyage avec la main gauche (respect du droit)",
  "21": "Attention aux éclaboussures en urinant",
  "22": "Règles de pudeur pour uriner",
  "23": "Éviter d'introduire de la nourriture aux toilettes",
  "24": "Aliments emballés ou scellés aux toilettes",
  "25": "Orientation du lit (Nord - Sud)"
};

const TITLES_MAP_4 = {
  "1": "L'ablution des mains du matin (Netilat Yadaïm)",
  "2": "Ablution sans récipient (directement du robinet)",
  "3": "Ablution par immersion dans une source ou la mer",
  "4": "Ordre du versage : 3 fois en alternant droite et gauche",
  "5": "Ablution des mains pour un gaucher",
  "6": "Zone d'ablution : jusqu'au poignet",
  "7": "Propreté des mains avant la bénédiction",
  "8": "Ablution sur une main blessée ou plâtrée",
  "9": "Ablution pour celui qui a veillé toute la nuit",
  "10": "Cas de l'éveillé après minuit halakhique",
  "11": "Dormir après minuit halakhique",
  "12": "Réveil avant l'aube et ré-ablution",
  "13": "Ablution après une sieste durant la journée",
  "14": "Ne pas recevoir l'ablution d'une personne non-lavée",
  "15": "Répétition de l'ablution après s'être essuyé",
  "16": "Obligation de l'ablution pour les femmes",
  "17": "Éducation des jeunes enfants à Netilat Yadaïm",
  "18": "L'eau usée de l'ablution : interdiction du sol",
  "19": "Verser l'eau usée dans un évier ou lavabo",
  "20": "Récitation de la bénédiction 'Al Netilat Yadaïm'",
  "21": "Doute sur la récitation de la bénédiction",
  "22": "Oubli de l'ablution avant la prière",
  "23": "Récitation de la bénédiction sans ablution",
  "24": "Ablution après les besoins et bénédiction",
  "25": "Boire de l'eau durant la nuit sans ablution",
  "26": "Impossibilité de se lever pour faire l'ablution",
  "27": "Étude et prière avant l'ablution matinale",
  "28": "Réponse aux bénédictions au réveil avant l'ablution",
  "29": "Absence d'eau au réveil et nettoyage sur un tissu",
  "30": "Étudier avec des enfants sans ablution",
  "31": "Dormir avec des gants la nuit",
  "32": "Interdiction de toucher les aliments avant l'ablution",
  "33": "Interdiction de toucher les livres sacrés avant l'ablution",
  "34": "Achat de pain touché sans ablution",
  "35": "Statut des aliments touchés avant l'ablution",
  "36": "Aliments et boissons touchés à posteriori",
  "37": "Utiliser l'eau d'ablution pour d'autres usages",
  "38": "Ablution après un sommeil fixe la journée",
  "39": "Priser du tabac avant l'ablution matinale",
  "40": "Toucher ses habits avant l'ablution matinale",
  "41": "Étudier la Torah face à l'eau usée d'ablution",
  "42": "Cas nécessitant une ablution des mains sans bénédiction",
  "43": "Ablution après s'être coupé les ongles",
  "44": "Ablution après une coupe de cheveux",
  "45": "Répondre au Kaddish les mains non-lavées",
  "46": "Toucher des parties couvertes du corps",
  "47": "Toucher ses chaussures ou des sandales",
  "48": "Retirer ses chaussures sans les toucher à la main",
  "49": "Toucher des pantoufles de maison",
  "50": "Toucher des bottes ou des chaussettes",
  "51": "Frictionner les cheveux de sa tête",
  "52": "Se gratter la barbe",
  "53": "Coupe de cheveux partielle ou rasage",
  "54": "Coiffer ou couper les cheveux d'autrui",
  "55": "Sortie d'un cimetière ou retour d'enterrement",
  "56": "Visite des tombes des Tsadikim (Pèlerinage)",
  "57": "Entrer dans un cimetière non-juif",
  "58": "Ablution après la visite d'un hôpital",
  "59": "Coutume de ne pas se sécher les mains après le cimetière",
  "60": "Règles d'ablution au retour d'un enterrement",
  "61": "Toucher la peau ou le corps nu",
  "62": "Sortie du bain ou de la douche",
  "63": "Toucher ses pieds",
  "64": "Toucher un non-juif",
  "65": "Toucher le mucus du nez ou des oreilles",
  "66": "Élèves se grattant la tête durant l'étude",
  "67": "Toucher une impureté avec une seule main",
  "68": "Toucher les cuisses ou les jambes",
  "69": "Toucher des zones couvertes lors du port des Tefillines",
  "70": "Porter des manches courtes durant la prière",
  "71": "Prise de sang ou don du sang",
  "72": "Toucher un pou ou un parasite",
  "73": "Toucher des animaux (chien, chat)",
  "74": "Toucher une personne qui n'a pas fait l'ablution",
  "75": "Frottement des mains sur un vêtement en l'absence d'eau",
  "76": "Rinçage de la bouche le matin",
  "77": "Toucher le pot de chambre des enfants",
  "78": "Ablution après la sortie des toilettes",
  "79": "Entrer aux toilettes sans s'y soulager",
  "80": "Répondre aux bénédictions au sortir des toilettes",
  "81": "Toucher les oreilles au sortir des toilettes",
  "82": "Essuyer ses mains après les toilettes",
  "83": "Salle de bain sans toilettes (bain/douche)",
  "84": "Robinets situés à l'intérieur des toilettes",
  "85": "Séparation par cloison dans une salle d'eau",
  "86": "Toilettes des trains et des avions",
  "87": "Eaux découvertes durant la nuit",
  "88": "Cabinet de toilette sans défécation",
  "89": "Statut halakhique de la salle de bain moderne",
  "90": "Nourriture introduite dans la salle de bain",
  "91": "Traverser une salle de bain",
  "92": "Boire de l'eau dans la salle de bain",
  "93": "Étude et bénédictions dans les bains publics",
  "94": "Vestiaire des bains publics",
  "95": "Penser aux affaires financières dans le bain",
  "96": "Entrer au Mikvé de l'Ari zal à Safed",
  "97": "Se laver dans une baignoire ou un Mikvé",
  "98": "Vestiaire et entrée au Mikvé",
  "99": "Introduire une main aux toilettes",
  "100": "Ablution à la sortie des bains publics"
};

function updateSiman(simanNum, map) {
  const paths = [
    path.join(ROOT, 'public', 'data', 'kitzur_yalkut_yosef', 'shabbat', `siman_${simanNum}.json`),
    path.join(ROOT, 'public', 'data', `siman_${simanNum}.json`),
    path.join(ROOT, 'public', 'data', `yalkout-${simanNum}.json`)
  ];

  paths.forEach(p => {
    if (!fs.existsSync(p)) return;
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    data.halakhot.forEach(h => {
      const seifKey = String(h.seif);
      h.titre_seif = map[seifKey] || `Seïf ${seifKey}`;
    });
    fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${path.basename(p)} for Siman ${simanNum} with ${data.halakhot.length} seif titles.`);
  });
}

updateSiman(3, TITLES_MAP_3);
updateSiman(4, TITLES_MAP_4);

console.log("✅ Siman 3 and Siman 4 successfully updated with all Seif mini-titles!");
