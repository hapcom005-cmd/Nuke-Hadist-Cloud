const fs = require('fs');
const path = require('path');
const https = require('https');

// ==========================================
// 🌩️ GITHUB ACTIONS CLOUD NUKE (MATRIX EDITION) 🌩️
// ==========================================

const allLanguages = [
    'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg', 'ca', 'ceb', 'ny', 'zh', 'co',
    'hr', 'cs', 'da', 'nl', 'en', 'eo', 'et', 'fi', 'fr', 'fy', 'gl', 'ka', 'de', 'el', 'gu',
    'ht', 'ha', 'haw', 'iw', 'hi', 'hmn', 'hu', 'is', 'ig', 'id', 'ga', 'it', 'ja', 'jw', 'kn',
    'kk', 'km', 'rw', 'ko', 'ku', 'ky', 'lo', 'la', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml',
    'mt', 'mi', 'mr', 'mn', 'my', 'ne', 'no', 'or', 'ps', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru',
    'sm', 'gd', 'sr', 'st', 'sn', 'sd', 'si', 'sk', 'sl', 'so', 'es', 'su', 'sw', 'sv', 'tg',
    'ta', 'tt', 'te', 'th', 'tr', 'tk', 'uk', 'ur', 'ug', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu'
];

const targetLanguages = [...new Set(allLanguages)];
const imam = 'bukhari';

// Get chunk ID from command line (1 to 10)
const chunkId = parseInt(process.argv[2]) || 1;
const langPerChunk = Math.ceil(targetLanguages.length / 10);
const startIdx = (chunkId - 1) * langPerChunk;
const myLanguages = targetLanguages.slice(startIdx, startIdx + langPerChunk);

function translateText(text, targetLang) {
    return new Promise((resolve) => {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=id&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const options = { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } };

        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(data);
                        let translated = '';
                        if (json[0]) json[0].forEach(part => { translated += part[0]; });
                        resolve(translated || text);
                    } catch (e) { resolve(text); }
                } else {
                    resolve(text);
                }
            });
        }).on('error', () => resolve(text));
    });
}

async function runMatrix() {
    console.log(`[VM-${chunkId}] 🔥 MATRIX NODE ONLINE. Processing ${myLanguages.length} languages: ${myLanguages.join(', ')}`);
    
    const inputPath = path.join(__dirname, 'QuranHadist', 'data', 'hadist_js', `${imam}.js`);
    let rawContent = fs.readFileSync(inputPath, 'utf8');
    rawContent = rawContent.substring(rawContent.indexOf('{"name"')).trim();
    if (rawContent.endsWith(';')) rawContent = rawContent.slice(0, -1);
    let originalItems = JSON.parse(rawContent).items;

    for (const lang of myLanguages) {
        const outputDir = path.join(__dirname, 'QuranHadist', 'data', 'hadist_lang', lang);
        const outputFile = path.join(outputDir, `${imam}.json`);
        
        let existingData = [];
        if (fs.existsSync(outputFile)) {
            try {
                existingData = JSON.parse(fs.readFileSync(outputFile, 'utf8')).items || [];
            } catch(e){}
        }

        if (existingData.length >= originalItems.length) {
            console.log(`[${lang.toUpperCase()}] Selesai 100%. Melewati...`);
            continue; 
        }

        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        console.log(`\n[VM-${chunkId}] [${lang.toUpperCase()}] Melanjutkan dari index ${existingData.length}...`);
        
        // Aturan Jenderal Irwan: ANTI SERAKAH! Ambil 1, Terjemahkan, SAVE LANGSUNG KE DISK!
        for (let i = existingData.length; i < originalItems.length; i++) {
            const item = originalItems[i];
            const resultText = await translateText(item.id, lang);
            
            existingData.push({ number: item.number, arab: item.arab, id: resultText });
            
            // SAVE KE DISK SETIAP 1 ITEM! 100% FAIL-SAFE!
            const finalJson = { name: imam, items: existingData };
            fs.writeFileSync(outputFile, JSON.stringify(finalJson, null, 2));
            
            console.log(`[VM-${chunkId}] [${lang.toUpperCase()}] Tersimpan -> Hadist #${item.number} (${existingData.length}/${originalItems.length})`);
            
            await new Promise(r => setTimeout(r, 100)); // Delay aman
        }
    }
}

runMatrix();
