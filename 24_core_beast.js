const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const path = require('path');
const https = require('https');

// ==========================================
// 💥 THE 24-CORE BEAST PROTOCOL (XEON UNLEASHED) 💥
// ==========================================

const allLanguages = [
    'ru', 'es', 'fr', 'zh', 'ja', 'ko', 'tr', 'de', 'it', 'hi',
    'ar', 'ur', 'fa', 'bn', 'id', 'ms', 'th', 'vi', 'nl', 'pt',
    'sv', 'fi', 'no', 'da', 'pl', 'cs', 'el', 'he', 'ro', 'hu',
    'bg', 'uk', 'sr', 'hr', 'sk', 'sl', 'lt', 'lv', 'et', 'is',
    'ga', 'cy', 'mt', 'sq', 'mk', 'bs', 'km', 'lo', 'my', 'ka',
    'hy', 'az', 'uz', 'kk', 'ky', 'tg', 'tk', 'mn', 'ne', 'si',
    'am', 'sw', 'yo', 'ig', 'zu', 'xh', 'af', 'st', 'tn', 'ts',
    'ss', 've', 'nr', 'nso', 'tso', 'ven', 'xho', 'zul', 'afr', 'sot',
    'nbl', 'ssw', 'tsn', 'tso', 'ven', 'xho', 'zul', 'afr', 'sot', 'nbl',
    'ssw', 'tsn', 'tso', 'ven', 'xho', 'zul', 'afr', 'sot', 'nbl', 'ssw'
]; // Hanya contoh, pastikan 100 bahasa

// Filter duplicate languages just in case
const targetLanguages = [...new Set(allLanguages)].slice(0, 100);
const imam = 'bukhari';
const MAX_CORES = 24; 
const CONCURRENCY_PER_CORE = 5; // 5 Request paralel per core

if (isMainThread) {
    console.log("==================================================");
    console.log("🔥 THE 24-CORE BEAST PROTOCOL (XEON UNLEASHED) 🔥");
    console.log("==================================================");
    console.log(`Mengalokasikan ${MAX_CORES} Core CPU dari Xeon E5-2690 v3!`);
    console.log(`Menjalankan Queue System untuk ${targetLanguages.length} Bahasa.`);
    console.log(`Concurrency: ${MAX_CORES * CONCURRENCY_PER_CORE} tembakan per detik!`);
    console.log("Awas PC terbang... 🚀\n");

    let languageQueue = [...targetLanguages];
    let activeWorkers = 0;

    function spawnWorker() {
        if (languageQueue.length === 0) return;
        const lang = languageQueue.shift();
        activeWorkers++;

        const worker = new Worker(__filename, {
            workerData: { lang: lang, imam: imam, concurrency: CONCURRENCY_PER_CORE }
        });

        worker.on('message', (msg) => {
            if (msg.type === 'log') {
                console.log(`[XEON-CORE][${lang.toUpperCase()}] ${msg.text}`);
            } else if (msg.type === 'done') {
                console.log(`\n✅ [XEON-CORE][${lang.toUpperCase()}] 100% SELESAI!\n`);
                activeWorkers--;
                spawnWorker(); // Tarik bahasa berikutnya dari antrean
                
                if (activeWorkers === 0 && languageQueue.length === 0) {
                    console.log("🎉 SEMUA BAHASA TELAH SELESAI DITERJEMAHKAN! 🎉");
                    process.exit(0);
                }
            }
        });

        worker.on('error', (err) => {
            console.error(`[XEON-CORE][${lang.toUpperCase()}] ERROR FATAL:`, err);
            process.exit(1); // Memicu Watchdog
        });
    }

    // Spawn 24 Workers sekaligus!
    for (let i = 0; i < MAX_CORES; i++) {
        spawnWorker();
    }

} else {
    // --- WORKER 24-CORE ---
    const { lang, imam, concurrency } = workerData;
    
    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/114.0.0.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0'
    ];
    const apiClients = ['gtx', 'dict-chrome-ex', 'webapp'];

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
                        // OMNI-SOURCE FALLBACK MYMEMORY
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
        const outputDir = path.join(__dirname, 'QuranHadist', 'data', 'hadist_lang', lang);
        const outputFile = path.join(outputDir, `${imam}.json`);

        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        let rawContent = fs.readFileSync(inputPath, 'utf8');
        rawContent = rawContent.substring(rawContent.indexOf('{"name"')).trim();
        if (rawContent.endsWith(';')) rawContent = rawContent.slice(0, -1);
        let hadithData = JSON.parse(rawContent);
        const originalItems = hadithData.items;

        let translatedItems = [];
        let startIndex = 0;

        if (fs.existsSync(outputFile)) {
            try {
                const existingData = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
                if (existingData.items && existingData.items.length > 0) {
                    translatedItems = existingData.items;
                    startIndex = translatedItems.length;
                    parentPort.postMessage({ type: 'log', text: `Melanjutkan dari index ke-${startIndex}...` });
                }
            } catch (e) {}
        }

        if (startIndex >= originalItems.length) {
            parentPort.postMessage({ type: 'done' });
            return;
        }

        // FASE CONCURRENCY: Proses 5 Request sekaligus!
        for (let i = startIndex; i < originalItems.length; i += concurrency) {
            const chunk = originalItems.slice(i, i + concurrency);
            const promises = chunk.map(async (item) => {
                let success = false;
                let resultText = '';
                while (!success) {
                    try {
                        resultText = await translateText(item.id, lang);
                        success = true;
                    } catch (err) {
                        await new Promise(r => setTimeout(r, 2000)); // Delay jika API rate limit
                    }
                }
                return { number: item.number, arab: item.arab, id: resultText };
            });

            // Tunggu 5 request selesai serentak
            const results = await Promise.all(promises);
            translatedItems.push(...results);

            // Auto Save setiap kali memproses 50
            if (translatedItems.length % 50 === 0 || translatedItems.length === originalItems.length) {
                hadithData.items = translatedItems;
                fs.writeFileSync(outputFile, JSON.stringify(hadithData, null, 2));
                parentPort.postMessage({ type: 'log', text: `Auto-Save. Progress: ${translatedItems.length} / ${originalItems.length}` });
            }
        }

        parentPort.postMessage({ type: 'done' });
    }

    execute();
}
