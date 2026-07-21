const fs = require('fs');
const content = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
const p = content.indexOf('function playAyatAudio(surahNo, ayatNo');
if (p !== -1) {
    const end = content.indexOf('}', p + 1000);
    console.log(content.slice(p, end + 100)); // Get a generous chunk
}
