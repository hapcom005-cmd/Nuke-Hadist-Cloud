const fs = require('fs');
const content = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
console.log('doSmartDirectSearch index:', content.indexOf('doSmartDirectSearch'));
console.log('offline_index_v2 index:', content.indexOf('offline_index_v2'));
