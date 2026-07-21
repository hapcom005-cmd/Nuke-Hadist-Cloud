const fs = require('fs');
const html = fs.readFileSync('index_premium.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
    if (l.includes('tafsir-body')) console.log((i+1) + ': ' + l.trim());
});
