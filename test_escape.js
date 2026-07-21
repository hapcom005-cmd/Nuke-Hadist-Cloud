let s = '<div class="notranslate"';
let out = s.replace('<div class="notranslate"', '<div id="text-arab-\\\\$$\\{a.nomorAyat}" class="notranslate"');
const fs = require('fs');
fs.writeFileSync('output.txt', out);
console.log("Written to output.txt");
