const { Cluster } = require('puppeteer-cluster');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

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
            prompt: `Terjemahkan teks tafsir berbahasa Arab berikut ini ke dalam bahasa Indonesia secara akurat, formal, dan lengkap tanpa menambahkan opini atau awalan percakapan:\n\n${text}`,
            stream: false
        }, { timeout: 45000 });
        
        if (response.data && response.data.response) {
            return response.data.response.trim();
        }
    } catch (e) {
        console.log("⚠️ Ollama 12B failed. Fallback to API...");
        try {
            const res = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.substring(0, 400))}&langpair=ar|id`);
            if (res.data && res.data.responseData) {
                return res.data.responseData.translatedText;
            }
        } catch (err) {}
    }
    return text;
}

(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_PAGE,
        maxConcurrency: 12,
        puppeteerOptions: {
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
        },
        timeout: 120000 
    });

    cluster.on('taskerror', (err, data) => {
        console.log(`❌ [CORE FATAL ERROR] Failed ${data.url}: ${err.message}`);
    });

    const discoveredTafsirs = new Set();

    await cluster.task(async ({ page, data: taskData }) => {
        const { target, url, surahNum, ayatNum, type } = taskData;
        const coreId = Math.floor(Math.random() * 12) + 1;
        
        console.log(`[CORE ${coreId}] Mengeksekusi task: ${url}`);
        
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        ];
        await page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);
        
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
            await new Promise(r => setTimeout(r, Math.floor(Math.random() * 2000) + 1000));

            let extractedData = {};

            if (target === 'tafsirweb') {
                const rawText = await page.evaluate(() => {
                    let txt = "";
                    document.querySelectorAll('h2, h3, h4, p, .content').forEach(el => txt += el.innerText.trim() + "\n");
                    return txt;
                });
                
                // Parse the rawText using Regex in NodeJS
                let currentTafsir = "Tafsir Umum";
                let currentBody = "";
                rawText.split('\n').forEach(line => {
                    line = line.trim();
                    if (!line) return;
                    if ((line.toLowerCase().startsWith('tafsir') || line.toLowerCase().includes('📚 tafsir')) && line.length < 60) {
                        if (currentBody && currentTafsir !== "Tafsir Umum") {
                            extractedData[currentTafsir] = currentBody;
                        }
                        currentTafsir = line.replace(/📚/g, '').trim();
                        currentBody = "";
                    } else {
                        if (currentTafsir !== "Tafsir Umum") {
                            currentBody += line + "\n";
                        }
                    }
                });
                if (currentBody && currentTafsir !== "Tafsir Umum") {
                    extractedData[currentTafsir] = currentBody;
                }
                
            } else if (target === 'tafsirq') {
                const rawText = await page.evaluate(() => {
                    let txt = "";
                    document.querySelectorAll('.panel').forEach(panel => {
                        const titleEl = panel.querySelector('.panel-title');
                        const bodyEl = panel.querySelector('.panel-body');
                        if (titleEl && bodyEl) {
                            txt += titleEl.innerText.trim() + "\n" + bodyEl.innerText.trim() + "\n\n";
                        }
                    });
                    return txt;
                });
                
                let currentTafsir = "Tafsir Umum";
                let currentBody = "";
                rawText.split('\n').forEach(line => {
                    line = line.trim();
                    if (!line) return;
                    if ((line.toLowerCase().includes('tafsir') || line.toLowerCase().includes('katsir')) && line.length < 60) {
                        if (currentBody && currentTafsir !== "Tafsir Umum") {
                            extractedData[currentTafsir] = currentBody;
                        }
                        currentTafsir = line.trim();
                        currentBody = "";
                    } else {
                        if (currentTafsir !== "Tafsir Umum") {
                            currentBody += line + "\n";
                        }
                    }
                });
                if (currentBody && currentTafsir !== "Tafsir Umum") {
                    extractedData[currentTafsir] = currentBody;
                }
            }

            if (Object.keys(extractedData).length === 0) return;

            const tafsirFile = path.join(tafsirDir, `${surahNum}.json`);
            let tafsirData = {};
            if (fs.existsSync(tafsirFile)) {
                tafsirData = JSON.parse(fs.readFileSync(tafsirFile, 'utf8'));
            }
            if (!tafsirData.tafsir_total) tafsirData.tafsir_total = {};
            const currentEkstra = tafsirData.tafsir_total[ayatNum.toString()] || {};

            const isArabicText = (text) => {
                const arabicCharCount = (text.match(/[\u0600-\u06FF]/g) || []).length;
                return text.length > 50 && (arabicCharCount / text.length) > 0.4;
            };

            let dataUpdated = false;
            for (let [key, value] of Object.entries(extractedData)) {
                if (value && value.trim() && value.trim().length > 10) {
                    let finalValue = value.trim();
                    discoveredTafsirs.add(key);

                    if (isArabicText(finalValue)) {
                        console.log(`🤖 [CORE ${coreId}] Arab murni terdeteksi di "${key}". Menerjemahkan via Ollama...`);
                        const terjemahan = await translateToIndonesian(finalValue);
                        finalValue = `--- Teks Arab Asli ---\n${finalValue}\n\n--- Terjemahan Indonesia (Ollama 12B) ---\n${terjemahan}`;
                    }
                    
                    if (!currentEkstra[key] || currentEkstra[key].length < finalValue.length) {
                        currentEkstra[key] = finalValue;
                        dataUpdated = true;
                    }
                }
            }
            
            if (dataUpdated) {
                tafsirData.tafsir_total[ayatNum.toString()] = currentEkstra;
                fs.writeFileSync(tafsirFile, JSON.stringify(tafsirData, null, 2));
                console.log(`✅ [CORE ${coreId}] Disimpan: Surah ${surahNum}:${ayatNum} (${Object.keys(extractedData).length} macam tafsir).`);
            }

        } catch (e) {
            console.log(`❌ [CORE ${coreId}] Error on ${url}: ${e.message}`);
        }
    });

    console.log("==================================================================");
    console.log("🕷️ MESIN SAPU BERSIH TAFSIR (DYNAMIC ALL) AKTIF! 🕸️");
    console.log("==================================================================");

    for (let surahNum = 1; surahNum <= 114; surahNum++) {
        const quranFile = path.join(quranDir, `${surahNum}.json`);
        if (!fs.existsSync(quranFile)) {
            console.log("File tidak ditemukan: " + quranFile);
            continue;
        }
        
        const quranData = JSON.parse(fs.readFileSync(quranFile, 'utf8'));
        const surahName = quranData.namaLatin || "unknown";
        const slug = `${surahNum}-${slugify(surahName)}`;
        const totalAyat = quranData.jumlahAyat || quranData.ayat.length;

        // DRY RUN DIHAPUS, MESIN LEPAS KENDALI UNTUK 114 SURAH
        
        console.log(`Menambahkan task untuk Surah ${surahNum} (${totalAyat} Ayat)...`);

        for (let ayatNum = 1; ayatNum <= totalAyat; ayatNum++) {
            cluster.queue({ target: 'tafsirweb', url: `https://tafsirweb.com/${surahNum}-${slugify(surahName)}-ayat-${ayatNum}.html`, surahNum, ayatNum, type: 'Dynamic' });
            cluster.queue({ target: 'tafsirq', url: `https://tafsirq.com/${slug}/ayat-${ayatNum}`, surahNum, ayatNum, type: 'Dynamic' });
        }
    }

    await cluster.idle();
    await cluster.close();
    
    console.log("==================================================================");
    console.log("🎉 UJI COBA AL-FATIHAH SELESAI!");
    console.log("DAFTAR SELURUH TAFSIR YANG BERHASIL DITANGKAP (SAPU BERSIH):");
    Array.from(discoveredTafsirs).forEach((t, i) => console.log(`${i+1}. ${t}`));
    console.log("==================================================================");
})();
