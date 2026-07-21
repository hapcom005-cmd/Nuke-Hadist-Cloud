const https = require('https');
https.get('https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions.json', res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const editions = JSON.parse(data);
            const langs = new Set();
            for(let key in editions) {
                langs.add(editions[key].language);
            }
            console.log(`Available languages for Hadith: ${langs.size}`);
            console.log(Array.from(langs).join(', '));
            console.log(`Total editions: ${Object.keys(editions).length}`);
            
            // Print out one entry as sample
            const firstKey = Object.keys(editions)[0];
            console.log("Sample:", editions[firstKey]);
            
        } catch(e) {
            console.log('Error parsing or no editions.json found');
        }
    });
});
