const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const res = await axios.get('https://tafsirweb.com/3774-surat-yasin-ayat-1.html', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        }
    });
    const $ = cheerio.load(res.data);
    
    let results = {};
    
    $('h2, h3').each((i, el) => {
        const title = $(el).text().trim();
        if (title.toLowerCase().includes('tafsir') && title.length < 50) {
            let body = "";
            let next = $(el).next();
            while (next.length && !next.is('h2, h3, h4')) {
                body += next.text().trim() + "\n";
                next = next.next();
            }
            results[title] = body.trim();
        }
    });
    
    console.log("TAFSIR WEB:");
    console.log(Object.keys(results));
    
    const res2 = await axios.get('https://tafsirq.com/1-al-fatihah/ayat-1', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        }
    });
    const $2 = cheerio.load(res2.data);
    let results2 = {};
    $2('.panel').each((i, el) => {
        const title = $2(el).find('.panel-title, .panel-heading').text().trim();
        const body = $2(el).find('.panel-body').text().trim();
        if (title) {
            results2[title] = body;
        }
    });
    
    console.log("\nTAFSIR Q:");
    console.log(Object.keys(results2));
}

test();
