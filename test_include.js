const fs = require('fs');
let code = fs.readFileSync('build_ui_premium_v3.js', 'utf8');

const t1 = '<div class="notranslate" style="font-family:\\'Amiri\\'; font-size:36px; line-height:2; text-align:right; margin-bottom:20px; color:var(--accent-gold);">';
console.log('Includes t1?', code.includes(t1));

const t2 = '\\${a.teksArab}</div>';
console.log('Includes t2?', code.includes(t2));

console.log('Includes combined?', code.includes(t1 + t2));
