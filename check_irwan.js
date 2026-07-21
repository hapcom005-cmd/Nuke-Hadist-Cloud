const fs = require('fs');
const file1 = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
console.log('Contains Irwan:', file1.includes('Irwan Fahruji'));
