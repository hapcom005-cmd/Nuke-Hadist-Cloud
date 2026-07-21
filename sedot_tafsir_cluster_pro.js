const { Cluster } = require('puppeteer-cluster');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Target directory
const dataDir = path.join(__dirname, 'QuranHadist', 'data');
const tafsirDir = path.join(dataDir, 'tafsir');
const quranDir = path.join(dataDir, 'quran');

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

async function translateToIndonesian(text) {
    try {
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'cognitivecomputations/dolphin-mistral-nemo:12b',
            prompt: `Translate the following Arabic text to Indonesian perfectly without conversational filler or explanations:\n\n${text}`,
            stream: false
        }, { timeout: 45000 });
        
        if (response.data && response.data.response) {
            return response.data.response.trim();
        }
    } catch (e) {
        console.log("⚠️ Ollama 12B failed. Fallback to MyMemory API...");
        try {
            const res = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.substring(0, 500))}&langpair=ar|id`);
            if (res.data && res.data.responseData) {
                return res.data.responseData.translatedText;
            }
        } catch (err) {}
    }
    return text;
}

(async () => {
    // 12 Core Cluster Configuration
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_PAGE,
        maxConcurrency: 12,
        puppeteerOptions: {
            headless: "new", // Run in background invisibly
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-web-security'
            ]
        },
        timeout: 120000 
    });

    cluster.on('taskerror', (err, data) => {
        console.log(`❌ [CORE FATAL ERROR] Failed ${data.url}: ${err.message}`);
    });

    // Worker Definition
    await cluster.task(async ({ page, data: taskData }) => {
        const { target, url, surahNum, ayatNum, type } = taskData;
        const coreId = Math.floor(Math.random() * 12) + 1;
        
        console.log(`🚀 [CORE ${coreId}] Scraping [${type}] from: ${url}`);
        
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
        ];
        await page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);
        
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
            const delay = Math.floor(Math.random() * 3000) + 1500;
            await new Promise(r => setTimeout(r, delay));

            let extractedText = "";

            if (target === 'tafsirq') {
                extractedText = await page.evaluate(() => {
                    let txt = "";
                    document.querySelectorAll('.panel-body, .tafsir-content, blockquote').forEach(sec => txt += sec.innerText + "\n");
                    return txt;
                });
            } else if (target === 'tafsirweb') {
                extractedText = await page.evaluate(() => {
                    let txt = "";
                    document.querySelectorAll('.content, .entry-content, p').forEach(sec => txt += sec.innerText + "\n");
                    return txt;
                });
            } else if (target === 'qurancom') {
                extractedText = await page.evaluate(() => {
                    return document.body.innerText; // Simplified for API or raw body
                });
            }

            if (!extractedText.trim()) return;

            // OMNIVORE MODE: Ambil seluruh teks tafsir dari halaman tanpa kecuali
            const extractedData = {};
            extractedData[`sumber_lengkap_${target}`] = extractedText.trim();

            const tafsirFile = path.join(tafsirDir, `${surahNum}.json`);
            let tafsirData = {};
            if (fs.existsSync(tafsirFile)) {
                tafsirData = JSON.parse(fs.readFileSync(tafsirFile, 'utf8'));
            }
            if (!tafsirData.ekstra) tafsirData.ekstra = {};
            const currentEkstra = tafsirData.ekstra[ayatNum.toString()] || {};

            const isArabicText = (text) => {
                const arabicCharCount = (text.match(/[\u0600-\u06FF]/g) || []).length;
                return text.length > 0 && (arabicCharCount / text.length) > 0.5;
            };

            let dataUpdated = false;
            for (const [key, value] of Object.entries(extractedData)) {
                if (value && value.trim()) {
                    let finalValue = value.trim();
                    // Terjemahan Otomatis dengan AI (Pertahankan teks Arab asli)
                    if (isArabicText(finalValue)) {
                        console.log(`🤖 [CORE ${coreId}] Ditemukan teks Arab di ${key}. Memulai proses translasi AI...`);
                        const terjemahan = await translateToIndonesian(finalValue);
                        finalValue = finalValue + "\n\nTerjemahan Indonesia:\n" + terjemahan;
                    }
                    if (!currentEkstra[key] || currentEkstra[key].length < finalValue.length) {
                        currentEkstra[key] = finalValue;
                        dataUpdated = true;
                    }
                }
            }
            
            if (dataUpdated) {
                tafsirData.ekstra[ayatNum.toString()] = currentEkstra;
                fs.writeFileSync(tafsirFile, JSON.stringify(tafsirData, null, 2));
                console.log(`✅ [CORE ${coreId}] Saved ${type} for Surah ${surahNum}:${ayatNum}.`);
            }

        } catch (e) {
            console.log(`❌ [CORE ${coreId}] Error on ${url}: ${e.message}`);
        }
    });

    console.log("==================================================================");
    console.log("🕷️ MESIN MULTI-SOURCE 12-CORE AKTIF! (PROTOKOL HANTU) 🕸️");
    console.log("==================================================================");

    for (let surahNum = 1; surahNum <= 114; surahNum++) {
        const quranFile = path.join(quranDir, `${surahNum}.json`);
        if (!fs.existsSync(quranFile)) continue;
        
        const quranData = JSON.parse(fs.readFileSync(quranFile, 'utf8'));
        const surahName = quranData.namaLatin || "unknown";
        const slug = `${surahNum}-${slugify(surahName)}`;
        const totalAyat = quranData.jumlahAyat || quranData.ayat.length;

        // Batasan uji coba DIHAPUS. MESIN DILEPAS KENDALI UNTUK 114 SURAH!
        // if (surahNum > 1) continue; 

        for (let ayatNum = 1; ayatNum <= totalAyat; ayatNum++) {
            // Queue multiple sources distributed across the 12 cores
            cluster.queue({ target: 'tafsirq', url: `https://tafsirq.com/${slug}/ayat-${ayatNum}`, surahNum, ayatNum, type: 'Mixed' });
            cluster.queue({ target: 'tafsirweb', url: `https://tafsirweb.com/${surahNum}-${slugify(surahName)}-ayat-${ayatNum}.html`, surahNum, ayatNum, type: 'Quraish/Katsir' });
            // Add more sources as needed...
        }
    }

    await cluster.idle();
    await cluster.close();
    console.log("==================================================================");
    console.log("🎉 OPERASI BRUTAL SELESAI!");
    console.log("==================================================================");
})();
