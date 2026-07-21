const https = require('https');
https.get('https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions.json', res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log(data.slice(0, 500));
    });
});
