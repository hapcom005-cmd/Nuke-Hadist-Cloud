const fs = require('fs');
const content = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
const p = content.indexOf('function doSmartDirectSearch');
if (p !== -1) {
    console.log(content.slice(p, p + 2000));
}
