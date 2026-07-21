const fs = require('fs');

const html = fs.readFileSync('HAPCOM_Premium.html', 'utf8');

const targetFunction = `function getAudioUrl(surahNo, ayatNo) {
            const reciter = document.getElementById('selectReciter').value;
            let folder = "Alafasy_128kbps"; // Default
            
            // Mapping Offline Murottal (Lokal) -> CDN Everyayah
            if (reciter === "offline_mishary") folder = "Alafasy_128kbps";
            else if (reciter === "offline_abdulbaset") folder = "Abdul_Basit_Mujawwad_128kbps";
            else if (reciter === "offline_sudais") folder = "Abdurrahmaan_As-Sudais_192kbps";
            else if (reciter === "offline_shuraim") folder = "Saood_ash-Shuraym_128kbps";
            else if (reciter === "offline_husary") folder = "Husary_128kbps";
            
            // Mapping Online API (Cloud) -> CDN Everyayah
            else if (reciter === "ar.alafasy") folder = "Alafasy_128kbps";
            else if (reciter === "ar.hudhaify") folder = "Hudhaify_128kbps";
            else if (reciter === "ar.abdullahbasfar") folder = "Abdullah_Basfar_192kbps";
            
            // Menggunakan CDN Internasional Everyayah untuk Audio Online tanpa beban storage lokal
            return 'https://everyayah.com/data/' + folder + '/' + formatNumber(surahNo) + formatNumber(ayatNo) + '.mp3';
        }`;

const replacedHtml = html.replace(/function getAudioUrl\(surahNo, ayatNo\) \{[\s\S]*?return 'https:\/\/everyayah\.com[^}]*\}/, targetFunction);

fs.writeFileSync('HAPCOM_Premium.html', replacedHtml);
console.log('Fixed ALL 8 reciter values in getAudioUrl!');
