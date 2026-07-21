const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'QuranHadist', 'data', 'offline_index_v2');
const destDir = path.join(__dirname, 'QuranHadist', 'data', 'offline_index_v3');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

console.log('Membaca direktori offline_index_v2...');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.json'));

const combinedData = {};

let count = 0;
for (const file of files) {
    const srcPath = path.join(srcDir, file);
    try {
        const data = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
        for (const word in data) {
            let prefix2 = word.substring(0, 2);
            if (prefix2.length < 2) continue;
            
            // Sanitize prefix for Windows filename
            prefix2 = prefix2.replace(/[<>:"/\\|?*]/g, '_');
            
            if (!combinedData[prefix2]) {
                combinedData[prefix2] = {};
            }
            combinedData[prefix2][word] = data[word];
        }
    } catch(e) {
        console.error('Error membaca file:', file);
    }
    count++;
    if (count % 1000 === 0) console.log(`Memproses... ${count}/${files.length}`);
}

console.log('Menulis file offline_index_v3...');
let outCount = 0;
for (const prefix in combinedData) {
    const outPath = path.join(destDir, `idx_${prefix}.json`);
    fs.writeFileSync(outPath, JSON.stringify(combinedData[prefix]));
    outCount++;
}

console.log(`Selesai! Berhasil memadatkan ${files.length} file menjadi ${outCount} file.`);
