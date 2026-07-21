const fs = require('fs');
let code = fs.readFileSync('build_ui_premium_v3.js', 'utf8');

// Replace font-family:'Amiri',serif
code = code.replace(/font-family:'Amiri',serif/g, "font-family:var(--font-arabic, 'Amiri'),serif");

// Replace font-family:'Amiri'
code = code.replace(/font-family:'Amiri'/g, "font-family:var(--font-arabic, 'Amiri')");

fs.writeFileSync('build_ui_premium_v3.js', code);
console.log('Fixed hardcoded Amiri');
