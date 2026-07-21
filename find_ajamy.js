const https = require('https');

https.get('https://everyayah.com/data/', res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const matches = data.match(/href="([^"]+Ajamy[^"]+)"/ig);
        console.log(matches);
    });
});
