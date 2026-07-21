const fs = require('fs');
const content = fs.readFileSync('HAPCOM_Premium.html', 'utf8');

function formatNumber(num) {
    return num.toString().padStart(3, '0');
}

function getAudioUrl(surahNo, ayatNo) {
    const reciter = "Mishary Rashid Alafasy"; // default
    let folder = "Alafasy_128kbps"; 
    if (reciter === "Mishary Rashid Alafasy") folder = "Alafasy_128kbps";
    else if (reciter === "Abdul Baset Abdul Samad") folder = "Abdul_Basit_Murattal_192kbps";
    else if (reciter === "Abdur-Rahman as-Sudais") folder = "Abdurrahmaan_As-Sudais_192kbps";
    else if (reciter === "Mahmoud Khalil Al-Husary") folder = "Husary_128kbps";
    
    return 'https://everyayah.com/data/' + folder + '/' + formatNumber(surahNo) + formatNumber(ayatNo) + '.mp3';
}

console.log('Testing getAudioUrl(1, 1):', getAudioUrl(1, 1));
console.log('Testing getAudioUrl(114, 6):', getAudioUrl(114, 6));
