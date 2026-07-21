const fs = require('fs');
const path = require('path');

const quranDir = path.join(__dirname, 'QuranHadist/data/quran');
const quranJsDir = path.join(__dirname, 'QuranHadist/data/quran_js');

// Create quran_js dir
if (!fs.existsSync(quranJsDir)) fs.mkdirSync(quranJsDir, { recursive: true });

// Convert meta.json to meta.js
const metaPath = path.join(quranDir, 'meta.json');
if (fs.existsSync(metaPath)) {
    const metaData = fs.readFileSync(metaPath, 'utf8');
    fs.writeFileSync(
        path.join(__dirname, 'QuranHadist/data/meta.js'), 
        `window.QURAN_META = ${metaData};`, 
        'utf8'
    );
    console.log("meta.js created.");
}

// Convert surah 1-114 json to js
for (let i = 1; i <= 114; i++) {
    const jsonPath = path.join(quranDir, `${i}.json`);
    if (fs.existsSync(jsonPath)) {
        const jsonData = fs.readFileSync(jsonPath, 'utf8');
        fs.writeFileSync(
            path.join(quranJsDir, `${i}.js`),
            `window.QURAN_SURAH = window.QURAN_SURAH || {}; window.QURAN_SURAH[${i}] = ${jsonData};`,
            'utf8'
        );
    }
}
console.log("Quran 1-114 JS files created.");
