import fs from 'fs';
import path from 'path';

function patchCritic() {
  const file = 'pipeline/critic.js';
  let c = fs.readFileSync(file, 'utf8');
  
  c = c.replace(/async function criticSiman\(simanNum\) \{/, `async function criticSiman(filePath) {
  const parentDir = path.basename(path.dirname(filePath));
  const categorie = parentDir === 'data' ? '' : parentDir;
  const simanMatch = filePath.match(/siman_(\\d+)\\.json$/);
  const simanNum = simanMatch ? simanMatch[1] : 'null';
  const uniqueKey = categorie ? \`\${simanNum}::\${categorie}\` : String(simanNum);
  const safeKey = uniqueKey.replace(/[^Ѐ-ӿ\\w]/g, '_');
  const reportPath = path.join(REPORTS_DIR, \`\${safeKey}_report.json\`);`);
  
  c = c.replace(/const reportPath = path.join\(REPORTS_DIR, `siman_\$\{simanNum\}_report\.json`\);/, '');
  
  c = c.replace(/const dataPath = path.join\(DATA_DIR, `siman_\$\{simanNum\}\.json`\);/g, 'const dataPath = filePath;');
  
  c = c.replace(/const reviewPath = path.join\(REPORTS_DIR, `siman_\$\{simanNum\}_review\.json`\);/g, 'const reviewPath = path.join(REPORTS_DIR, `${safeKey}_review.json`);');

  c = c.replace(/await criticSiman\(simanNum\);/g, `if (specificFile) {
      await criticSiman(specificFile);
    } else {
      const filePath = path.join(DATA_DIR, \`siman_\${simanNum}.json\`);
      await criticSiman(filePath);
    }`);

  c = c.replace(/for \(const file of reportFiles\) \{[\s\S]*?await criticSiman\(num\);\s*\}/, `// Mode all needs custom traversal if we use files instead of simanNum
    console.error('--all non supporté avec le nouveau système sans dossier spécifique');`);

  fs.writeFileSync(file, c);
  console.log('Patched critic.js');
}

function patchRepair() {
  const file = 'pipeline/repair.js';
  let c = fs.readFileSync(file, 'utf8');

  c = c.replace(/async function repairSiman\(simanNum\) \{/, `async function repairSiman(filePath) {
  const parentDir = path.basename(path.dirname(filePath));
  const categorie = parentDir === 'data' ? '' : parentDir;
  const simanMatch = filePath.match(/siman_(\\d+)\\.json$/);
  const simanNum = simanMatch ? simanMatch[1] : 'null';
  const uniqueKey = categorie ? \`\${simanNum}::\${categorie}\` : String(simanNum);
  const safeKey = uniqueKey.replace(/[^Ѐ-ӿ\\w]/g, '_');
  const reviewPath = path.join(REPORTS_DIR, \`\${safeKey}_review.json\`);`);
  
  c = c.replace(/const reviewPath = path.join\(REPORTS_DIR, `siman_\$\{simanNum\}_review\.json`\);/, '');

  c = c.replace(/const dataPath = path.join\(DATA_DIR, `siman_\$\{simanNum\}\.json`\);/g, 'const dataPath = filePath;');
  
  c = c.replace(/await repairSiman\(simanNum\);/g, `if (specificFile) {
      await repairSiman(specificFile);
    } else {
      const filePath = path.join(DATA_DIR, \`siman_\${simanNum}.json\`);
      await repairSiman(filePath);
    }`);

  fs.writeFileSync(file, c);
  console.log('Patched repair.js');
}

patchCritic();
patchRepair();
