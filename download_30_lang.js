const https = require('https');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'QuranHadist', 'data', 'lang');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

// 30 Priority language codes
const priorityCodes = new Set([
    'en', 'ru', 'es', 'fr', 'zh', 'ur', 'hi', 'ms', 'tr', 'ar',
    'de', 'it', 'pt', 'nl', 'ja', 'ko', 'bn', 'fa', 'id', 'th',
    'vi', 'sw', 'ta', 'te', 'ml', 'uz', 'az', 'bs', 'sq', 'sv'
]);

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
    const foundCodes = new Set();
    
    for (const key in editionsList) {
        const ed = editionsList[key];
        // If it's a translation, and its language code is in our priority list, and we haven't picked it yet
        // The iso code is sometimes in ed.language, wait, ed.language is the name like "English".
        // In the URL it's "en-editionName".
        // The key itself is usually like "en_sahih" or "eng_sahih"
        
        let code = '';
        if (ed.name && ed.name.includes('-')) {
            code = ed.name.split('-')[0];
        }
        // map 3 letter to 2 letter if needed
        if (code === 'eng') code = 'en';
        if (code === 'rus') code = 'ru';
        if (code === 'spa') code = 'es';
        if (code === 'fra') code = 'fr';
        if (code === 'zho') code = 'zh';
        if (code === 'urd') code = 'ur';
        if (code === 'hin') code = 'hi';
        if (code === 'msa') code = 'ms';
        if (code === 'tur') code = 'tr';
        if (code === 'ara') code = 'ar';
        if (code === 'deu') code = 'de';
        if (code === 'ita') code = 'it';
        if (code === 'por') code = 'pt';
        if (code === 'nld') code = 'nl';
        if (code === 'jpn') code = 'ja';
        if (code === 'kor') code = 'ko';
        if (code === 'ben') code = 'bn';
        if (code === 'fas') code = 'fa';
        if (code === 'ind') code = 'id';
        if (code === 'tha') code = 'th';
        if (code === 'vie') code = 'vi';
        if (code === 'swa') code = 'sw';
        if (code === 'tam') code = 'ta';
        if (code === 'tel') code = 'te';
        if (code === 'mal') code = 'ml';
        if (code === 'uzb') code = 'uz';
        if (code === 'aze') code = 'az';
        if (code === 'bos') code = 'bs';
        if (code === 'sqi') code = 'sq';
        if (code === 'swe') code = 'sv';

        if (ed.type === 'translation' && priorityCodes.has(code) && !foundCodes.has(code)) {
            foundCodes.add(code);
            selected.push({
                code: code,
                edition: ed.name,
                name: ed.language,
                author: ed.author
            });
        }
    }

    console.log(`Found ${selected.length} priority languages.`);
    if (selected.length === 0) return;
    
    fs.writeFileSync(path.join(outDir, 'languages.json'), JSON.stringify(selected, null, 2));

    for (let i = 0; i < selected.length; i++) {
        const lang = selected[i];
        const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/${lang.edition}.json`;
        console.log(`[${i+1}/${selected.length}] Downloading ${lang.name} (${lang.edition}) from ${url}...`);
        
        try {
            const transData = await fetchJson(url);
            const formatted = {};
            if (transData.quran) {
                for (const ayah of transData.quran) {
                    formatted[`${ayah.chapter}_${ayah.verse}`] = ayah.text;
                }
                fs.writeFileSync(path.join(outDir, `${lang.code}.json`), JSON.stringify(formatted));
                console.log(`  => Saved ${lang.code}.json`);
            } else {
                console.error(`  => Format error for ${lang.edition}`);
            }
        } catch (e) {
            console.error(`  => Failed to fetch ${lang.edition}:`, e.message);
        }
    }
    
    console.log('Semua bahasa berhasil diunduh dan dipadatkan!');
}

run();
