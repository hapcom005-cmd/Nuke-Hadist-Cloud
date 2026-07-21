const fs = require('fs');
const content = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
const p = content.indexOf('class="btn-play-ayat"');
if (p !== -1) {
    console.log(content.slice(Math.max(0, p - 500), p + 500));
}
