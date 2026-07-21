const fs = require('fs');
const content = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
console.log('Count of getAudioUrl:', content.split('function getAudioUrl').length - 1);
console.log('Count of playAyatAudio:', content.split('function playAyatAudio').length - 1);
