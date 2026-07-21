const fs = require('fs');
const content = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
    if (line.includes('QuranHadist/data')) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
    }
});
