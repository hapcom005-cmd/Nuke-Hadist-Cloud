const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'QuranHadist', 'data', 'tafsir');
const outDir = path.join(__dirname, 'QuranHadist', 'data', 'asbab_nuzul_js');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

let files = fs.readdirSync(srcDir).filter(f => f.endsWith('.json'));

let totalExtracted = 0;

for (let file of files) {
    let surah = file.replace('.json', '');
    let content = JSON.parse(fs.readFileSync(path.join(srcDir, file), 'utf8'));
    
    let outData = {};
    let hasData = false;
    
    if (content.asbab_nuzul) {
        outData.asbab_nuzul = content.asbab_nuzul;
        hasData = true;
    }
    if (content.mapping_ayat) {
        outData.mapping_ayat = content.mapping_ayat;
        hasData = true;
    }
    if (content.mapping_surah) {
        outData.mapping_surah = content.mapping_surah;
        hasData = true;
    }
    
    if (hasData) {
        let jsContent = `window.ASBAB_NUZUL_CACHE = window.ASBAB_NUZUL_CACHE || {};\n`;
        jsContent += `window.ASBAB_NUZUL_CACHE["${surah}"] = ${JSON.stringify(outData)};\n`;
        
        fs.writeFileSync(path.join(outDir, `${surah}.js`), jsContent, 'utf8');
        totalExtracted++;
    }
}

console.log(`Berhasil mengekstrak Asbab Nuzul/Mapping Hadist untuk ${totalExtracted} Surah.`);
