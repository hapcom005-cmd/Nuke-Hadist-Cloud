const fs = require('fs');

let fullData = {};
for (let i = 1; i <= 114; i++) {
    const path = `QuranHadist/data/quran/${i}.json`;
    if (fs.existsSync(path)) {
        const data = JSON.parse(fs.readFileSync(path, 'utf8'));
        fullData[i] = data;
    }
}

const jsContent = "window.FULL_QURAN = " + JSON.stringify(fullData) + ";";
fs.writeFileSync('full_quran_offline.js', jsContent);
console.log("Berhasil membuat full_quran_offline.js (" + (fs.statSync('full_quran_offline.js').size / 1024 / 1024).toFixed(2) + " MB)");
