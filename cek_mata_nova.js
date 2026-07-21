const fs = require('fs');
const path = require('path');

const targetLanguages = ['ru', 'es', 'fr', 'zh', 'ja', 'ko', 'tr', 'de', 'it', 'hi']; 
const imam = 'bukhari';
const totalData = 6638; // Jumlah hadist Bukhari

console.log("==================================================");
console.log("👁️ MATA ASTRAL NOVA: SCANNING PROGRESS...");
console.log("==================================================");

let totalTranslated = 0;

targetLanguages.forEach(lang => {
    const file = path.join(__dirname, 'QuranHadist', 'data', 'hadist_lang', lang, `${imam}.json`);
    if(fs.existsSync(file)) {
        try {
            const data = JSON.parse(fs.readFileSync(file, 'utf8'));
            const items = data.items || [];
            
            let emptyCount = 0;
            items.forEach(item => {
                if (!item.id || item.id.trim() === '' || item.id === 'undefined' || item.id === item.arab) {
                    emptyCount++;
                }
            });

            totalTranslated += items.length;
            if (emptyCount > 0) {
                console.log(`[${lang.toUpperCase()}] ⚠️ BAHAYA! Progress: ${items.length}, TAPI ADA ${emptyCount} DATA KOSONG/GAGAL!`);
            } else {
                console.log(`[${lang.toUpperCase()}] ✅ AMAN! Progress: ${items.length} / ${totalData} (${((items.length/totalData)*100).toFixed(2)}%) -> 0 Data Kosong!`);
            }
        } catch(e) {
            console.log(`[${lang.toUpperCase()}] Progress: Membaca file terganggu (Sedang di-write oleh Mesin Nuke)`);
        }
    } else {
        console.log(`[${lang.toUpperCase()}] Progress: 0 / ${totalData} (0.00%)`);
    }
});

console.log("==================================================");
console.log(`🔥 TOTAL TERJEMAHAN SAAT INI: ${totalTranslated} Baris Data!`);
console.log("==================================================");
