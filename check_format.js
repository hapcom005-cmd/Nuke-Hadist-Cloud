const fs = require('fs');
const content = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
console.log('formatNumber exists:', content.includes('function formatNumber'));
