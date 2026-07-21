const fs = require('fs');
const content = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
const p = content.indexOf(`currentAudio.play()`);
if (p !== -1) {
    const end = content.indexOf('}', p + 200);
    console.log(content.slice(p, end + 1));
}
