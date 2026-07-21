const fs = require('fs');
let code = fs.readFileSync('build_ui_premium_v3.js', 'utf8');
console.log('Contains replaceRender?', code.includes('id="text-arab'));
