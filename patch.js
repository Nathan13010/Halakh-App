import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const files = ['pipeline/validate.js', 'pipeline/critic.js', 'pipeline/repair.js'];

for (const p of files) {
  let c = fs.readFileSync(p, 'utf8');
  
  c = c.replace(/let simanNum = null;/, 'let simanNum = null;\n  let specificFile = null;');
  c = c.replace(/if \(args\[i\] === '--siman'/g, "if (args[i] === '--file' && args[i + 1]) { specificFile = args[++i]; } else if (args[i] === '--siman'");
  c = c.replace(/return \{ simanNum(.*?) \};/, 'return { simanNum$1, specificFile };');
  c = c.replace(/if \(!all && simanNum === null\) \{/, 'if (!all && simanNum === null && specificFile === null) {');
  c = c.replace(/const \{ simanNum(.*?) \} = parseArgs\(\);/, 'const { simanNum$1, specificFile } = parseArgs();');
  
  const filesRegex = /let files = \[\];\s*if \(all\) \{[\s\S]*?else \{[\s\S]*?files = \[filePath\];\s*\}/;
  
  const replacement = `let files = [];
  if (specificFile) {
    if (!fs.existsSync(specificFile)) {
      console.error(\`❌ Fichier introuvable : \${specificFile}\`);
      process.exit(1);
    }
    files = [specificFile];
  } else if (all) {
    const rootItems = fs.readdirSync(DATA_DIR);
    for (const item of rootItems) {
      const fullPath = path.join(DATA_DIR, item);
      if (fs.statSync(fullPath).isDirectory()) {
        const catFiles = fs.readdirSync(fullPath).filter(f => /^siman_\\d+\\.json$/.test(f));
        files.push(...catFiles.map(f => path.join(fullPath, f)));
      } else if (/^siman_\\d+\\.json$/.test(item)) {
        files.push(fullPath);
      }
    }
    files.sort();
  } else {
    const filePath = path.join(DATA_DIR, \`siman_\${simanNum}.json\`);
    if (!fs.existsSync(filePath)) {
      console.error(\`❌ Fichier introuvable : \${filePath}\`);
      process.exit(1);
    }
    files = [filePath];
  }`;
  
  c = c.replace(filesRegex, replacement);
  fs.writeFileSync(p, c);
  console.log('Patched ' + p);
}
