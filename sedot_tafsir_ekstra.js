const puppeteer = require('puppeteer');
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

async function scrapeTafsir() {
    console.log("=========================================");
    console.log("🕷️ MULAI OPERASI SCRAPER BUAS TAFSIR 🕸️");
    console.log("=========================================");

    const browser = await puppeteer.launch({ 
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

    for (let surahNum = 1; surahNum <= 114; surahNum++) {
        const quranFile = path.join(quranDir, `${surahNum}.json`);
        if (!fs.existsSync(quranFile)) continue;
        
        const quranData = JSON.parse(fs.readFileSync(quranFile, 'utf8'));
        const surahName = Object.values(quranData)[0].name;
        const slug = `${surahNum}-${slugify(surahName)}`;
        
        const tafsirFile = path.join(tafsirDir, `${surahNum}.json`);
        let tafsirData = {};
        if (fs.existsSync(tafsirFile)) {
            tafsirData = JSON.parse(fs.readFileSync(tafsirFile, 'utf8'));
        }
        
        if (!tafsirData.ekstra) tafsirData.ekstra = {};

        const totalAyat = Object.keys(quranData).length;

        for (let ayatNum = 1; ayatNum <= totalAyat; ayatNum++) {
            const currentEkstra = tafsirData.ekstra[ayatNum.toString()] || {};
            
            const jalalainEmpty = !currentEkstra.jalalain || currentEkstra.jalalain.includes("tidak tersedia");
            const quraishEmpty = !currentEkstra.quraish || currentEkstra.quraish.includes("tidak tersedia") || currentEkstra.quraish.includes("Al-Mishbahul Munir");
            const katsirEmpty = !currentEkstra.ibnukatsir || currentEkstra.ibnukatsir.includes("tidak tersedia");

            if (jalalainEmpty || quraishEmpty || katsirEmpty) {
                const url = `https://tafsirq.com/${slug}/ayat-${ayatNum}`;
                console.log(`[SEDOT] Menuju: ${url}`);
                
                try {
                    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
                    
                    const extractedData = await page.evaluate(() => {
                        let jalalain = "", quraish = "", katsir = "";
                        
                        // tafsirq.com typically puts the tafsir in blockquotes or specific divs.
                        // We extract all text from the page and try to find the relevant sections, 
                        // or better, find specific headings.
                        const sections = Array.from(document.querySelectorAll('.panel-body, .tafsir-content, blockquote'));
                        
                        sections.forEach(sec => {
                            const html = sec.innerHTML || "";
                            const text = sec.innerText || "";
                            if (html.toLowerCase().includes("jalalain")) jalalain = text;
                            if (html.toLowerCase().includes("quraish shihab") || html.toLowerCase().includes("mishbah")) quraish = text;
                            if (html.toLowerCase().includes("ibnu katsir")) katsir = text;
                        });
                        
                        return { jalalain, quraish, katsir };
                    });

                    if (jalalainEmpty && extractedData.jalalain) currentEkstra.jalalain = extractedData.jalalain.trim();
                    if (quraishEmpty && extractedData.quraish) currentEkstra.quraish = extractedData.quraish.trim();
                    if (katsirEmpty && extractedData.katsir) currentEkstra.ibnukatsir = extractedData.katsir.trim();
                    
                    tafsirData.ekstra[ayatNum.toString()] = currentEkstra;
                    
                    fs.writeFileSync(tafsirFile, JSON.stringify(tafsirData, null, 2));
                    console.log(`[SUCCESS] Surah ${surahNum} Ayat ${ayatNum} tersimpan.`);
                    
                    const delay = Math.floor(Math.random() * 2000) + 1000;
                    await new Promise(r => setTimeout(r, delay));
                    
                } catch (err) {
                    console.log(`[ERROR] Gagal menyedot ${url} : ${err.message}`);
                }
            } else {
                console.log(`[SKIP] Surah ${surahNum} Ayat ${ayatNum} sudah lengkap.`);
            }
        }
    }
    
    await browser.close();
    console.log("=========================================");
    console.log("🎉 OPERASI SCRAPER SELESAI!");
    console.log("=========================================");
}

scrapeTafsir();
