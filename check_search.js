const fs = require('fs');
const content = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
const start = content.indexOf('async function searchQuran(');
console.log(content.slice(start, start + 2000));
