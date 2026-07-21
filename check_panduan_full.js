const fs = require('fs');
const file1 = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
const p = file1.indexOf('function showPanduan()');
if(p!==-1) console.log(file1.slice(p, p+2000));
