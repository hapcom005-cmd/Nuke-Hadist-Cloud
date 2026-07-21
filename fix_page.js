const fs = require('fs');
let code = fs.readFileSync('build_ui_premium_v3.js', 'utf8');

code = code.replace(/\$\{page === 1 \? 'disabled style="opacity:0\.5;cursor:not-allowed;"' : ''\}/g, '\\${page === 1 ? \'disabled style="opacity:0.5;cursor:not-allowed;"\' : \'\'}');
code = code.replace(/\$\{page === totalPages \? 'disabled style="opacity:0\.5;cursor:not-allowed;"' : ''\}/g, '\\${page === totalPages ? \'disabled style="opacity:0.5;cursor:not-allowed;"\' : \'\'}');

fs.writeFileSync('build_ui_premium_v3.js', code);
console.log('Fixed page variables');
