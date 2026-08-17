const fs = require('fs');
const htmlContent = fs.readFileSync('body-הלכות אבלות דיני אבלות.txt', 'utf8');
const morceaux = htmlContent.split(/<a[^>]*name="[^"]*"[^>]*><\/a>/i);
console.log(morceaux.length);
