const https = require('https');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'QuranHadist', 'data', 'lang');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

async function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch(e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function run() {
    console.log('Fetching editions list...');
    const editionsList = await fetchJson('https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions.json');
    
    const selected = [];
    const foundLanguages = new Set();
    
    for (const key in editionsList) {
        const ed = editionsList[key];
        
        // Pick 1 translation per language name (e.g. "English", "Russian")
        // No 'type' check needed because all in this file are translations
        if (!foundLanguages.has(ed.language)) {
            foundLanguages.add(ed.language);
            
            // Extract the prefix code from the name (e.g. "eng-sahih" -> "eng")
            let code = ed.name;
            if (ed.name && ed.name.includes('-')) {
                code = ed.name.split('-')[0];
            }
            
            selected.push({
                code: code,
                edition: ed.name,
                name: ed.language,
                author: ed.author
            });
        }
    }

    console.log(`Found ${selected.length} unique languages.`);
    if (selected.length === 0) return;
    
    // Sort selected by language name alphabetically
    selected.sort((a, b) => a.name.localeCompare(b.name));
    
    fs.writeFileSync(path.join(outDir, 'languages.json'), JSON.stringify(selected, null, 2));

    let successCount = 0;
    for (let i = 0; i < selected.length; i++) {
        const lang = selected[i];
        const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/${lang.edition}.json`;
        console.log(`[${i+1}/${selected.length}] Downloading ${lang.name} (${lang.edition})...`);
        
        try {
            const transData = await fetchJson(url);
            const formatted = {};
            if (transData.quran) {
                for (const ayah of transData.quran) {
                    formatted[`${ayah.chapter}_${ayah.verse}`] = ayah.text;
                }
                fs.writeFileSync(path.join(outDir, `${lang.code}.json`), JSON.stringify(formatted));
                successCount++;
            } else {
                console.error(`  => Format error for ${lang.edition}`);
            }
        } catch (e) {
            console.error(`  => Failed to fetch ${lang.edition}:`, e.message);
        }
    }
    
    console.log(`Semua ${successCount} bahasa berhasil diunduh dan dipadatkan!`);
}

run();
