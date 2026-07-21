const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'QuranHadist', 'data', 'hadist');
const outDir = path.join(__dirname, 'QuranHadist', 'data', 'hadith_all_js');
const CHUNK_SIZE = 500; // 500 hadiths per file

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

let files = fs.readdirSync(srcDir).filter(f => f.endsWith('.json') && f !== 'meta.json');
let metaList = [];

for (let file of files) {
    let bookId = file.replace('.json', '');
    let rawData = fs.readFileSync(path.join(srcDir, file), 'utf8');
    let parsed = JSON.parse(rawData);
    
    let items = parsed.items || [];
    let total = items.length;
    
    metaList.push({
        id: bookId,
        name: parsed.name,
        total: total
    });
    
    // Process items in chunks
    for (let i = 0; i < total; i += CHUNK_SIZE) {
        let chunkIndex = Math.floor(i / CHUNK_SIZE);
        let chunkItems = items.slice(i, i + CHUNK_SIZE);
        
        // Ensure array mapping is accurate (number as key if possible, but some might be out of order)
        // Best approach: create a dictionary by hadith 'number' for O(1) access
        let dict = {};
        for(let item of chunkItems) {
            dict[item.number] = { ar: item.arab, id: item.id };
        }
        
        let jsContent = `window.HADITH_CACHE = window.HADITH_CACHE || {};\n`;
        jsContent += `window.HADITH_CACHE["${bookId}_${chunkIndex}"] = ${JSON.stringify(dict)};\n`;
        
        fs.writeFileSync(path.join(outDir, `${bookId}_${chunkIndex}.js`), jsContent, 'utf8');
    }
    console.log(`Processed ${parsed.name} (${total} hadiths) into ${Math.ceil(total/CHUNK_SIZE)} chunks.`);
}

// Generate a list file for the UI to know what books exist and their total lengths
let listContent = `window.HADITH_LIST = ${JSON.stringify(metaList)};\n`;
fs.writeFileSync(path.join(outDir, `hadith_list.js`), listContent, 'utf8');
console.log('Finished compiling 9 Hadith books.');
