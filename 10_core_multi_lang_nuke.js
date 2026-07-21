const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const path = require('path');
const https = require('https');

// ==========================================
// NOVA 10-CORE OMNI-SOURCE RESURRECTION
// ==========================================

const targetLanguages = ['ru', 'es', 'fr', 'zh', 'ja', 'ko', 'tr', 'de', 'it', 'hi']; 

if (isMainThread) {
    console.log("==================================================");
    console.log("🌌 NOVA OMNI-SOURCE RESURRECTION PROTOCOL 🌌");
    console.log("==================================================");
    console.log(`Mengalokasikan 10 Core CPU untuk 10 Bahasa berbeda secara paralel!`);
    console.log(`Fitur Aktif: JURUS SERIBU PINTU (Bypass Banned) & PHOENIX WATCHDOG`);
    console.log("Mulai bekerja menembus ruang dan waktu...\n");

    const imam = 'bukhari'; 

    for (let i = 0; i < targetLanguages.length; i++) {
        const lang = targetLanguages[i];
        const worker = new Worker(__filename, {
            workerData: { workerId: i + 1, targetLang: lang, imam: imam }
        });

        worker.on('message', (msg) => {
            if (msg.type === 'log') {
                console.log(`[CORE-${i+1}][${lang.toUpperCase()}] ${msg.text}`);
            } else if (msg.type === 'done') {
                console.log(`\n✅ [CORE-${i+1}][${lang.toUpperCase()}] 100% SELESAI!\n`);
            }
        });
        worker.on('error', (err) => {
            console.error(`[CORE-${i+1}] ERROR FATAL:`, err);
            process.exit(1); // Paksa exit agar Watchdog bisa membangkitkan ulang!
        });
    }
} else {
    // --- WORKER SILUMAN OMNI-SOURCE ---
    const { workerId, targetLang, imam } = workerData;
    
    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/114.0.0.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X)',
        'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0'
    ];

    // JURUS SERIBU PINTU: Merotasi 5 "Pintu" rahasia Google agar tidak pernah diblokir
    const apiClients = ['gtx', 'dict-chrome-ex', 'webapp', 't', 'te'];

    function getRandomUserAgent() { return userAgents[Math.floor(Math.random() * userAgents.length)]; }
    function getRandomClient() { return apiClients[Math.floor(Math.random() * apiClients.length)]; }

    function translateText(text, targetLang) {
        return new Promise((resolve, reject) => {
            const client = getRandomClient();
            const url = `https://translate.googleapis.com/translate_a/single?client=${client}&sl=id&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
            const options = { headers: { 'User-Agent': getRandomUserAgent(), 'Accept': '*/*' } };

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
                        } catch (e) { reject(new Error('Parse JSON Gagal')); }
                    } else if (res.statusCode === 429) {
                        // OMNI-SOURCE FALLBACK: Gunakan MyMemory API jika Google Banned!
                        const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=id|${targetLang}`;
                        https.get(myMemoryUrl, { headers: { 'User-Agent': getRandomUserAgent() } }, (resMM) => {
                            let dataMM = '';
                            resMM.on('data', chunk => dataMM += chunk);
                            resMM.on('end', () => {
                                try {
                                    const jsonMM = JSON.parse(dataMM);
                                    if (jsonMM.responseData && jsonMM.responseData.translatedText) {
                                        resolve(jsonMM.responseData.translatedText);
                                    } else {
                                        reject(new Error('BANNED'));
                                    }
                                } catch (e) { reject(new Error('BANNED')); }
                            });
                        }).on('error', () => reject(new Error('BANNED')));
                    } else { reject(new Error(`API Error: ${res.statusCode}`)); }
                });
            }).on('error', (err) => reject(err));
        });
    }

    async function execute() {
        const inputPath = path.join(__dirname, 'QuranHadist', 'data', 'hadist_js', `${imam}.js`);
        const outputDir = path.join(__dirname, 'QuranHadist', 'data', 'hadist_lang', targetLang);
        const outputFile = path.join(outputDir, `${imam}.json`);

        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        // Load DB Asli
        let rawContent = fs.readFileSync(inputPath, 'utf8');
        rawContent = rawContent.substring(rawContent.indexOf('{"name"')).trim();
        if (rawContent.endsWith(';')) rawContent = rawContent.slice(0, -1);
        let hadithData = JSON.parse(rawContent);
        const originalItems = hadithData.items;

        let translatedItems = [];
        let startIndex = 0;

        // PROTOKOL AUTO-RESUME
        if (fs.existsSync(outputFile)) {
            try {
                const existingData = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
                if (existingData.items && existingData.items.length > 0) {
                    translatedItems = existingData.items;
                    startIndex = translatedItems.length;
                    parentPort.postMessage({ type: 'log', text: `Bangkit dari kubur! Melanjutkan dari index ke-${startIndex}...` });
                }
            } catch (e) {
                parentPort.postMessage({ type: 'log', text: `File lama corrupt/tidak valid. Memulai dari awal...` });
            }
        }

        if (startIndex >= originalItems.length) {
            parentPort.postMessage({ type: 'done' });
            return;
        }

        for (let i = startIndex; i < originalItems.length; i++) {
            const item = originalItems[i];
            let success = false;
            
            while (!success) {
                try {
                    const result = await translateText(item.id, targetLang);
                    translatedItems.push({ number: item.number, arab: item.arab, id: result });
                    success = true;
                    
                    if (translatedItems.length % 50 === 0) {
                        hadithData.items = translatedItems;
                        fs.writeFileSync(outputFile, JSON.stringify(hadithData, null, 2));
                        parentPort.postMessage({ type: 'log', text: `Auto-Save sukses. Progress: ${translatedItems.length} / ${originalItems.length}` });
                    }
                    
                    // KARENA PAKAI OMNI-SOURCE, delay dikurangi tapi tidak boleh 0!
                    await new Promise(r => setTimeout(r, 600)); // 0.6 detik
                } catch (err) {
                    if (err.message === 'BANNED') {
                        parentPort.postMessage({ type: 'log', text: `Pintu terblokir! Merotasi API & Menyamar selama 10 Detik...` });
                        await new Promise(r => setTimeout(r, 10000)); // Tiarap 10 detik agar IP refresh
                    } else {
                        await new Promise(r => setTimeout(r, 2000));
                    }
                }
            }
        }

        hadithData.items = translatedItems;
        fs.writeFileSync(outputFile, JSON.stringify(hadithData, null, 2));
        parentPort.postMessage({ type: 'done' });
    }

    execute();
}
