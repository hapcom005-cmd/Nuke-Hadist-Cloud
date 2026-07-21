const fs = require('fs');
const html = fs.readFileSync('index_premium.html', 'utf8');
const lines = html.split('\n');

const startIndex = lines.findIndex(l => l.includes('window.switchTafsirTab = function(btn, tabName, containerId) {'));
if (startIndex === -1) {
    console.log("Start index not found!");
    process.exit(1);
}

const restLines = lines.slice(startIndex);
const endIndexOffset = restLines.findIndex(l => l.includes('// =========================================='));
if (endIndexOffset === -1) {
    console.log("End index not found!");
    process.exit(1);
}

const endIndex = startIndex + endIndexOffset;

console.log(`Replacing from line ${startIndex + 1} to ${endIndex + 1}`);

const correctCode = fs.readFileSync('correct_code_panel.js', 'utf8');

const newLines = [
    ...lines.slice(0, startIndex),
    correctCode,
    ...lines.slice(endIndex)
];

fs.writeFileSync('index_premium.html', newLines.join('\n'));
console.log('Panel patch applied successfully!');
