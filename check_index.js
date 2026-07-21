const fs = require('fs');
const content = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
if(content.includes('offline_index_v2')) console.log('Found offline_index_v2');
else console.log('No offline_index_v2!');
