const fs = require('fs');
const content = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
const p = content.indexOf('function doSmartDirectSearch');
if (p !== -1) {
    const end = content.indexOf('}', p + 500);
    console.log(content.slice(p, end + 1000));
}
