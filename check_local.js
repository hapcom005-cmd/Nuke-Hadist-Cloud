const fs = require('fs');
const content = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
const p = content.indexOf('function processLocalResult');
if (p !== -1) {
    const end = content.indexOf('function', p + 100);
    console.log(content.slice(p, end));
}
