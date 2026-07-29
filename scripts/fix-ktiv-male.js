import fs from 'fs';

const stripVowels = str => str.replace(/[\u0591-\u05C7]/g, '').replace(/\|/g, '');

async function fixKtivMale() {
  const filePath = 'public/data/kitzur_yalkut_yosef/shabbat/siman_1.json';
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let correctionsCount = 0;

  for (const seif of data.halakhot) {
    for (const mot of seif.mots_alignes) {
      // Remove punctuation for comparison
      const cleanBrut = mot.hebreu_brut.replace(/[.,:;?!\[\]\(\)]/g, '');
      const cleanVoyelles = stripVowels(mot.hebreu_voyelles.replace(/[.,:;?!\[\]\(\)]/g, ''));

      if (cleanBrut !== cleanVoyelles && cleanBrut.length > 0) {
        // We have a Ktiv mismatch (e.g. מותר vs מתר)
        try {
          const res = await fetch('https://nakdan-2-0.loadbalancer.dicta.org.il/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              task: 'nakdan',
              data: cleanBrut, // query just the word
              genre: 'rabbinic',
              addmorph: false,
              keepqq: true,
              matchpartial: true,
              keepmetagim: false,
              keephtml: false
            })
          });
          
          const result = await res.json();
          if (result && result.length > 0 && result[0].options) {
            // Find the option that matches the exact letters of cleanBrut
            const bestOption = result[0].options.find(opt => {
              // Sometimes options are arrays (if addmorph:true) or strings
              const strOpt = typeof opt === 'string' ? opt : opt[0];
              return stripVowels(strOpt) === cleanBrut;
            });

            if (bestOption) {
              const finalStr = typeof bestOption === 'string' ? bestOption : bestOption[0];
              
              // Restore punctuation if there was any at the end
              const punctuationMatch = mot.hebreu_brut.match(/[.,:;?!\[\]\(\)]+$/);
              const punctuation = punctuationMatch ? punctuationMatch[0] : '';
              const prefixMatch = mot.hebreu_brut.match(/^[.,:;?!\[\]\(\)]+/);
              const prefix = prefixMatch ? prefixMatch[0] : '';
              
              mot.hebreu_voyelles = prefix + finalStr + punctuation;
              correctionsCount++;
              console.log(`Corrected: ${mot.hebreu_brut} -> ${mot.hebreu_voyelles}`);
            }
          }
        } catch (e) {
          console.error("Error fetching Nakdan for", cleanBrut, e);
        }
      }
    }
  }

  if (correctionsCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Fixed ${correctionsCount} Ktiv Male mismatches in siman_1.json!`);
  } else {
    console.log("No mismatches found, everything is already perfect.");
  }
}

fixKtivMale();
