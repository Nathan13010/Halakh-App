const fs = require('fs');

function fixSiman(file) {
  let changed = false;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const halakha of data.halakhot || []) {
    if (!halakha.texte_integral || !halakha.mots_alignes) continue;
    
    const mots = halakha.mots_alignes;
    if (mots.length < 3) continue;
    
    const removeNikkoud = text => (text || '').replace(/[\u0591-\u05C7]/g, '');
    const clean = text => removeNikkoud(text).replace(/[.,'"]/g,'').trim();

    const brut1 = clean(mots[1].hebreu_brut);
    const voy1 = clean(mots[1].hebreu_voyelles);
    const voy2 = clean(mots[2].hebreu_voyelles);
    
    // Si brut1 ne matche pas voy1, mais que brut1 matche voy2, alors voy1 est un intrus (ex: lettre de badge)
    if (brut1 !== voy1 && brut1 === voy2) {
      console.log(`Mismatch in Seif ${halakha.seif}: brut1="${brut1}", voy1="${voy1}", voy2="${voy2}". Shifting voyelles...`);
      
      for (let i = 1; i < mots.length - 1; i++) {
        mots[i].hebreu_voyelles = mots[i+1].hebreu_voyelles;
      }
      
      const textVoy = halakha.texte_integral.hebreu_avec_voyelles;
      const partsVoy = textVoy.split(/\s+/);
      
      if (partsVoy.length > 1) {
        partsVoy.splice(1, 1); // enlever l'intrus
        halakha.texte_integral.hebreu_avec_voyelles = partsVoy.join(' ');
      }
      
      for (let i = 0; i < mots.length; i++) {
        if (i < partsVoy.length) {
          mots[i].hebreu_voyelles = partsVoy[i];
        } else {
          mots[i].hebreu_voyelles = "";
        }
      }
      
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Fixed ${file}`);
  }
}

fixSiman('public/data/הלכות ציצית/siman_11.json');
fixSiman('public/data/הלכות ציצית/siman_12.json');
