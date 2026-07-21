const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'QuranHadist', 'data', 'tafsir');
const outputDir = path.join(__dirname, 'QuranHadist', 'data', 'tafsir_js');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

console.log("Memulai konversi data Tafsir ke format JS (Offline Bypass)...");
let successCount = 0;

for (let i = 1; i <= 114; i++) {
    const jsonPath = path.join(inputDir, `${i}.json`);
    const jsPath = path.join(outputDir, `${i}.js`);
    
    if (fs.existsSync(jsonPath)) {
        try {
            const rawData = fs.readFileSync(jsonPath, 'utf8');
            // Bungkus JSON ke dalam window.TAFSIR_DATA
            const jsContent = `window.TAFSIR_DATA = window.TAFSIR_DATA || {};\nwindow.TAFSIR_DATA[${i}] = ${rawData};`;
            fs.writeFileSync(jsPath, jsContent);
            successCount++;
        } catch (e) {
            console.error(`Gagal mengonversi Surah ${i}`, e);
        }
    }
}

console.log(`Berhasil mengonversi ${successCount} file Tafsir menjadi JS murni untuk akses offline.`);
