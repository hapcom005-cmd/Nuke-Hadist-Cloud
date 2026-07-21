const fs = require('fs');
const content = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
console.log('selectReciter exists:', content.includes('id="selectReciter"'));
