const fs = require('fs');
const content = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
if(content.includes('asbab')) console.log('Found asbab in HAPCOM');
else console.log('No asbab in HAPCOM');
