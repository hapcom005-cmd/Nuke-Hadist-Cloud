const fs = require('fs');
const content = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
const start = content.indexOf('<input type="text" id="searchInput"');
console.log(content.slice(start, start + 300));
