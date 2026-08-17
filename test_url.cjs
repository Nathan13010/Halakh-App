const axios = require('axios');
const cheerio = require('cheerio');

async function testUrl() {
    const url = "https://www.yalkut.info/2019/01/31/%d7%a1%d7%99%d7%9e%d7%9f-%d7%99%d7%98-%d7%94%d7%90%d7%91%d7%9c-%d7%90%d7%a1%d7%95%d7%a8-%d7%91%d7%aa%d7%a9%d7%9e%d7%99%d7%a9-%d7%94%d7%9e%d7%98%d7%94/";
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const htmlContent = $('.entry-content').html();
    const morceaux = htmlContent.split(/<a[^>]*name="[^"]*"[^>]*><\/a>/i);
    let seifimCourants = [];
    
    for (let i = 1; i < morceaux.length; i++) {
        let texteHebreu = cheerio.load(morceaux[i]).text().trim();
        texteHebreu = texteHebreu.replace(/\s+/g, ' ');
        if (texteHebreu) {
            seifimCourants.push({
                seif: seifimCourants.length + 1,
                hebreu_brut: texteHebreu.substring(0, 50) + "..."
            });
        }
    }
    
    console.log("Seifim extrated:", seifimCourants.length);
    if(seifimCourants.length > 0) {
        console.log("First seif:", seifimCourants[0]);
    }
}
testUrl();
