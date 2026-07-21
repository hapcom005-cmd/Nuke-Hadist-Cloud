const fs = require('fs');
const path = require('path');

const asbabDir = path.join(__dirname, 'QuranHadist/data/asbab_nuzul');
const files = fs.readdirSync(asbabDir).filter(f => f.endsWith('.json'));

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log(`Found ${files.length} Asbab Al-Nuzul files to translate via MyMemory API.`);
    let translatedCount = 0;
    
    for (const file of files) {
        const filePath = path.join(asbabDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        let needsSave = false;
        
        for (let i = 0; i < data.length; i++) {
            const entry = data[i];
            
            if (entry.occasions_id && entry.occasions_id.length === entry.occasions.length && !entry.occasions_id.includes(null) && !entry.occasions_id.includes('')) {
                continue; // already fully translated
            }
            
            if (!entry.occasions_id) entry.occasions_id = new Array(entry.occasions.length).fill("");
            
            console.log(`Translating in ${file} (Ayat ${entry.ayahs.join(',')})...`);
            
            for (let j = 0; j < entry.occasions.length; j++) {
                if (entry.occasions_id[j] && entry.occasions_id[j].length > 0 && entry.occasions_id[j] !== entry.occasions[j]) continue;
                
                const text = entry.occasions[j];
                try {
                    // MyMemory API
                    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ar|id&de=irwan@hpcomtik.com`;
                    const res = await fetch(url);
                    const json = await res.json();
                    
                    if (json.responseData && json.responseData.translatedText) {
                        let tText = json.responseData.translatedText;
                        if (tText.includes('MYMEMORY WARNING')) tText = text; // fallback if quota exceeded
                        entry.occasions_id[j] = tText;
                        translatedCount++;
                        needsSave = true;
                        console.log(` -> OK (${tText.substring(0, 30)}...)`);
                    } else {
                        entry.occasions_id[j] = text;
                        console.log(` -> Failed, fallback to Arabic`);
                    }
                    await delay(500); // polite delay
                } catch(e) {
                    console.log(` -> Error: ${e.message}`);
                    entry.occasions_id[j] = text;
                }
            }
        }
        
        if (needsSave) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        }
    }
    
    console.log(`Translation complete! Translated ${translatedCount} occasions.`);
}

main().catch(console.error);
