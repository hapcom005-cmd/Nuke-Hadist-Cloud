const fs = require('fs');
let code = fs.readFileSync('inject_tajweed_perkata.js', 'utf8');

const target = 'const renderAyatRegex = /<div class="notranslate" style="font-family:\\'Amiri\\';[^>]+>\\\\$\\\\{a\\\\.teksArab\\\\}<\\\\/div>/g;';
const replacement = `const renderAyatRegex = /<div class="notranslate" style="font-family:'Amiri';[^>]+>\\\\$\\\\{a\\\\.teksArab\\\\}<\\/div>/g;`;

// Wait, I will just rewrite the whole section of inject_tajweed_perkata.js using a simple string replacement in build_ui_premium_v3.js

let injectCode = fs.readFileSync('inject_tajweed_perkata.js', 'utf8');
injectCode = injectCode.replace(
    'code = code.replace(renderAyatRegex, replaceRender.trim());',
    'code = code.split(`<div class="notranslate" style="font-family:\\'Amiri\\'; font-size:36px; line-height:2; text-align:right; margin-bottom:20px; color:var(--accent-gold);">\\\\${a.teksArab}</div>`).join(replaceRender.trim());'
);
fs.writeFileSync('inject_tajweed_perkata.js', injectCode);
console.log('Fixed inject_tajweed_perkata.js!');
