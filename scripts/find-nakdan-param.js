import fs from 'fs';
fetch('https://nakdan.dicta.org.il/assets/index-CObTnVui.js')
  .then(r=>r.text())
  .then(t => {
    const idx = t.indexOf('task:"nakdan"');
    if (idx !== -1) {
      console.log('Found:', t.substring(idx - 100, idx + 300));
    } else {
      console.log('Not found "task:"nakdan""');
    }
    
    // Also try to find genre:
    const idx2 = t.indexOf('genre:');
    if (idx2 !== -1) {
      console.log('Found genre:', t.substring(idx2 - 100, idx2 + 300));
    }
  });
