const fs = require('fs');
const content = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
const p = content.indexOf('function getAudioUrl(surahNo, ayatNo) {');
const end = content.indexOf('}', p + 500);
fs.writeFileSync('C:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/getAudio_code.txt', content.slice(p, end + 1));
