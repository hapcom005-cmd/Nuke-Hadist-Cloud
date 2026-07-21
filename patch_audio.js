const fs = require('fs');

const target = 'HAPCOM_Premium.html';
let html = fs.readFileSync(target, 'utf8');

const p1 = html.indexOf('function getAudioUrl(surahNo, ayatNo) {');
const p2 = html.indexOf('}', p1 + 500);

const oldFunction = html.slice(p1, p2 + 1);

const newFunction = `function getAudioUrl(surahNo, ayatNo) {
            const reciter = document.getElementById('selectReciter').value;
            let folder = "Alafasy_128kbps"; 
            if (reciter === "Mishary Rashid Alafasy") folder = "Alafasy_128kbps";
            else if (reciter === "Abdul Baset Abdul Samad") folder = "Abdul_Basit_Murattal_192kbps";
            else if (reciter === "Abdur-Rahman as-Sudais") folder = "Abdurrahmaan_As-Sudais_192kbps";
            else if (reciter === "Mahmoud Khalil Al-Husary") folder = "Husary_128kbps";
            
            // Menggunakan CDN Internasional Everyayah untuk Audio Online tanpa beban storage lokal
            return 'https://everyayah.com/data/' + folder + '/' + formatNumber(surahNo) + formatNumber(ayatNo) + '.mp3';
        }`;

html = html.replace(oldFunction, newFunction);
fs.writeFileSync(target, html);
console.log('Audio URL berhasil diarahkan ke CDN Online!');
