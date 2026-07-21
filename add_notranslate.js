const fs = require('fs');
let html = fs.readFileSync('build_ui_premium_v3.js', 'utf8');
html = html.replace(/<div style=\"font-family:'Amiri'/g, `<div class="notranslate" style="font-family:'Amiri'`);
html = html.replace(/<div style=\"font-family:\\\\'Amiri\\\\'/g, `<div class="notranslate" style="font-family:\\\\'Amiri\\\\'`);
fs.writeFileSync('build_ui_premium_v3.js', html);
