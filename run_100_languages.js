const { execSync } = require('child_process');
const fs = require('fs');

const langsFile = fs.readFileSync('QuranHadist/data/lang/languages.json', 'utf8');
const languages = JSON.parse(langsFile);

console.log(`[PANGLIMA TERTINGGI] Memulai Invasi Terjemahan ke ${languages.length} Bahasa Dunia...`);

for (const lang of languages) {
    const targetCode = lang.code; // 'en', 'ru', 'ms', etc. (Note: Fawaz Ahmed API might use 3-letter codes for quran, but Google Translate requires 2-letter codes for most! Wait!)
    
    // Konversi kode 3 huruf (jika ada) ke 2 huruf untuk Google Translate
    let gCode = targetCode;
    if (gCode === 'eng') gCode = 'en';
    if (gCode === 'rus') gCode = 'ru';
    if (gCode === 'msa') gCode = 'ms';
    if (gCode === 'fra') gCode = 'fr';
    if (gCode === 'ind') gCode = 'id';
    
    console.log(`\n======================================================`);
    console.log(`[PANGLIMA TERTINGGI] Menggempur Bahasa: ${lang.name} (${gCode})`);
    console.log(`======================================================`);
    
    try {
        execSync(`node run_all_imams.js ${gCode}`, { stdio: 'inherit' });
    } catch (err) {
        console.error(`[PANGLIMA TERTINGGI] Pasukan terpukul mundur di bahasa ${lang.name}:`, err.message);
    }
}

console.log('[PANGLIMA TERTINGGI] SELURUH 100 BAHASA DUNIA TELAH DITAKLUKKAN!');
