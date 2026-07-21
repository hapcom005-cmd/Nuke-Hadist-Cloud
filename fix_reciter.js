const fs = require('fs');

const html = fs.readFileSync('HAPCOM_Premium.html', 'utf8');

const targetFunction = `function getAudioUrl(surahNo, ayatNo) {
            const reciter = document.getElementById('selectReciter').value;
            let folder = "Alafasy_128kbps"; 
            if (reciter === "offline_mishary") folder = "Alafasy_128kbps";
            else if (reciter === "offline_abdulbaset") folder = "Abdul_Basit_Murattal_192kbps";
            else if (reciter === "offline_sudais") folder = "Abdurrahmaan_As-Sudais_192kbps";
            else if (reciter === "offline_husary") folder = "Husary_128kbps";
            
            // Menggunakan CDN Internasional Everyayah untuk Audio Online tanpa beban storage lokal
            return 'https://everyayah.com/data/' + folder + '/' + formatNumber(surahNo) + formatNumber(ayatNo) + '.mp3';
        }`;

// Replace the old one with the correct if conditions
const replacedHtml = html.replace(/function getAudioUrl\(surahNo, ayatNo\) \{[\s\S]*?return 'https:\/\/everyayah\.com[^}]*\}/, targetFunction);

fs.writeFileSync('HAPCOM_Premium.html', replacedHtml);
console.log('Fixed getAudioUrl logic for selectReciter values!');
