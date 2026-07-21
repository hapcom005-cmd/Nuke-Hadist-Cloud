const fs = require('fs');
const content = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
console.log(content.slice(18755, 18900));
