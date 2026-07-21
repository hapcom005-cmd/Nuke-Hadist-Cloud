const fs = require('fs');
let code = fs.readFileSync('build_ui_premium_v3.js', 'utf8');

const t = 'font-family:var(--font-arabic, \\'Amiri\\'); font-size:36px; line-height:2; text-align:right; margin-bottom:20px; color:var(--accent-gold);">${a.teksArab}</div>';
const target = '<div class="notranslate" style="' + t;
const replacement = '<div id="text-arab-${a.nomorAyat}" class="notranslate" style="' + t;

code = code.replace(target, replacement);

fs.writeFileSync('build_ui_premium_v3.js', code);
console.log('Fixed Tajwid ID!');
