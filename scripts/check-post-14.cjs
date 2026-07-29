const fs = require('fs');
fetch('https://www.yalkut.info/wp-json/wp/v2/posts/14').then(r=>r.json()).then(d => {
  const content = d.content.rendered;
  const regex = /<a name="([^"]+)"><\/a>\s*<b>([^<]+)<\/b>\s*(.*?)(?=<a name=|<\/p>|$)/gs;
  let count = 0;
  let match;
  let seifim = [];
  while ((match = regex.exec(content)) !== null) {
    count++;
    seifim.push(match[2].trim());
  }
  console.log('Total Seifim in post 14:', count);
  console.log('Seifim letters:', seifim);
}).catch(console.error);
