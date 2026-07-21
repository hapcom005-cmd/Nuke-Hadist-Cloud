const fs = require('fs');
const content = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
const p = content.indexOf('function doSmartDirectSearch');
if (p !== -1) {
    const end = content.indexOf('}', p + 5000);
    console.log(content.slice(p + 1500, end));
}
