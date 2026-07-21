const fs = require('fs');
const file1 = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
const p1 = file1.indexOf('function showPanduan() {');
const p2 = file1.indexOf('}', p1 + 500);
fs.writeFileSync('C:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/show_panduan_code.txt', file1.slice(p1, p2+1));
