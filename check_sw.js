const fs = require('fs');
const content = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
console.log('serviceWorker exists:', content.includes('serviceWorker'));
