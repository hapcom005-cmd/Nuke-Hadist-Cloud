const fs = require('fs');
const path = require('path');
const https = require('https');

// ==========================================
// 🌩️ GITHUB ACTIONS CLOUD NUKE 🌩️
// ==========================================

const allLanguages = [
    'ru', 'es', 'fr', 'zh', 'ja', 'ko', 'tr', 'de', 'it', 'hi',
    'ar', 'ur', 'fa', 'bn', 'id', 'ms', 'th', 'vi', 'nl', 'pt'
]; // Simplified for cloud execution chunk

const targetLanguages = [...new Set(allLanguages)];
const imam = 'bukhari';
const CONCURRENCY = 3; 

function translateText(text, targetLang) {
    return new Promise((resolve, reject) => {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=id&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const options = { headers: { 'User-Agent': 'Mozilla/5.0' } };

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
                    resolve(text); // Fallback to original on error
                }
            });
        }).on('error', () => resolve(text));
    });
}

async function runCloudNuke() {
    console.log("==================================================");
    console.log("☁️ STARTING CLOUD NUKE ON GITHUB ACTIONS ☁️");
    console.log("==================================================");
    
    // Process only the first language that needs processing to avoid 6-hour timeout
    for (const lang of targetLanguages) {
        const outputDir = path.join(__dirname, 'QuranHadist', 'data', 'hadist_lang', lang);
        const outputFile = path.join(outputDir, `${imam}.json`);
        
        let existingData = [];
        if (fs.existsSync(outputFile)) {
            try {
                existingData = JSON.parse(fs.readFileSync(outputFile, 'utf8')).items || [];
            } catch(e){}
        }

        const inputPath = path.join(__dirname, 'QuranHadist', 'data', 'hadist_js', `${imam}.js`);
        if (!fs.existsSync(inputPath)) {
            console.log("Data sumber tidak ditemukan.");
            continue;
        }

        let rawContent = fs.readFileSync(inputPath, 'utf8');
        rawContent = rawContent.substring(rawContent.indexOf('{"name"')).trim();
        if (rawContent.endsWith(';')) rawContent = rawContent.slice(0, -1);
        let originalItems = JSON.parse(rawContent).items;

        if (existingData.length >= originalItems.length) {
            console.log(`[${lang.toUpperCase()}] Sudah 100% selesai. Lanjut ke bahasa berikutnya...`);
            continue; 
        }

        console.log(`\n[${lang.toUpperCase()}] Memulai terjemahan dari index ${existingData.length}...`);
        
        let translatedItems = [...existingData];
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        // Translate a batch of 500 items per GitHub Action run to avoid timeout
        const MAX_PER_RUN = 500;
        let processedCount = 0;

        for (let i = translatedItems.length; i < originalItems.length && processedCount < MAX_PER_RUN; i += CONCURRENCY) {
            const chunk = originalItems.slice(i, Math.min(i + CONCURRENCY, originalItems.length));
            
            const promises = chunk.map(async (item) => {
                const resultText = await translateText(item.id, lang);
                return { number: item.number, arab: item.arab, id: resultText };
            });

            const results = await Promise.all(promises);
            translatedItems.push(...results);
            processedCount += results.length;

            console.log(`[${lang.toUpperCase()}] Progress: ${translatedItems.length} / ${originalItems.length}`);
            
            // Sleep slightly to respect rate limits
            await new Promise(r => setTimeout(r, 500));
        }

        // Save
        const finalJson = { name: imam, items: translatedItems };
        fs.writeFileSync(outputFile, JSON.stringify(finalJson, null, 2));
        
        console.log(`\n✅ [${lang.toUpperCase()}] Selesai memproses batch ini. Menyimpan dan keluar untuk auto-commit!`);
        break; // Hanya proses 1 bahasa per trigger (GitHub Actions akan run lagi 6 jam kemudian)
    }
}

runCloudNuke();
