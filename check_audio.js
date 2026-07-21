const fs = require('fs');
const content = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
    if(l.toLowerCase().includes('audio') || l.toLowerCase().includes('play')) {
        console.log((i+1) + ': ' + l.trim());
    }
});
