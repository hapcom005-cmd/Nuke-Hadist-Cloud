const fs = require('fs');
let code = fs.readFileSync('build_ui_premium_v3.js', 'utf8');
const renderAyatRegex = /<div class="notranslate" style="font-family:'Amiri';[^>]+>\\$\\{a\.teksArab\\}<\/div>/g;
const match = code.match(renderAyatRegex);
console.log('Match found:', match);
