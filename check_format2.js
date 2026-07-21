const fs = require('fs');
const content = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
const p = content.indexOf('function formatNumber');
if (p !== -1) {
    const end = content.indexOf('}', p);
    console.log(content.slice(p, end + 1));
}
