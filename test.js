const fs = require('fs');
let code = fs.readFileSync('build_ui_premium_v3.js', 'utf8');
let idx = code.indexOf("font-family:'Amiri';");
console.log(code.substring(idx, code.indexOf('</div>', idx) + 6));
