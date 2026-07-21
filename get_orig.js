const fs = require('fs');
const html = fs.readFileSync('C:/Users/Irwan Fahr/Desktop/Al-Quran-Premium/index.html', 'utf8');
const lines = html.split('\n');

let start = -1;
let end = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('window.showTafsirs =')) {
        start = i;
    }
    if (start !== -1 && i > start + 10 && lines[i].includes('// ==========================================')) {
        end = i;
        break;
    }
}

if (start !== -1) {
    console.log(lines.slice(start, end).join('\n'));
} else {
    console.log("showTafsirs not found!");
}
