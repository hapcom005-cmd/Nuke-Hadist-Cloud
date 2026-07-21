const fs = require('fs');
const path = require('path');
const https = require('https');

// ==========================================
// 🏴‍☠️ NOVA GHOST PROTOCOL (THE BACKDOOR HIJACK) 🏴‍☠️
// ==========================================
// Mengekstrak database Expert-Corrected dari fawazahmed0/hadith-api

console.log("=========================================================");
console.log("🏴‍☠️ MENGAKTIFKAN GHOST PROTOCOL (JALAN BELAKANG) 🏴‍☠️");
console.log("=========================================================");
console.log("Menyiapkan 8 Core Jaringan untuk menyedot 8 Bahasa Ahli secara serentak...");

const apiBase = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/";

// Pemetaan bahasa dari API ke kode folder kita
const expertLanguages = [
    { code: 'en', apiCode: 'eng-bukhari' },
    { code: 'bn', apiCode: 'ben-bukhari' },
    { code: 'fr', apiCode: 'fra-bukhari' },
    { code: 'id', apiCode: 'ind-bukhari' },
    { code: 'ru', apiCode: 'rus-bukhari' },
    { code: 'ta', apiCode: 'tam-bukhari' },
    { code: 'tr', apiCode: 'tur-bukhari' },
    { code: 'ur', apiCode: 'urd-bukhari' }
];

const imam = 'bukhari';

function downloadJson(url, dest) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                return reject(new Error(`Gagal (Status ${res.statusCode})`));
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function executeHijack() {
    const startTime = Date.now();
    const promises = expertLanguages.map(async (lang) => {
        const outputDir = path.join(__dirname, 'QuranHadist', 'data', 'hadist_lang', lang.code);
        const outputFile = path.join(outputDir, `${imam}.json`);
        
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        const url = `${apiBase}${lang.apiCode}.min.json`;
        
        try {
            console.log(`[GHOST-CORE] Mengunduh ${lang.apiCode} (Expert) -> Folder [${lang.code}]...`);
            await downloadJson(url, outputFile);
            console.log(`✅ [GHOST-CORE] Sukses merampok ${lang.apiCode}! (Tersimpan di [${lang.code}])`);
        } catch (e) {
            console.error(`❌ [GHOST-CORE] Gagal merampok ${lang.apiCode}:`, e.message);
        }
    });

    // Jalankan semua unduhan secara PARALEL SERENTAK (Concurrency)!
    await Promise.all(promises);

    const endTime = Date.now();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

    console.log("=========================================================");
    console.log(`💥 Misi Selesai dalam ${timeTaken} Detik!`);
    console.log(`8 Bahasa dengan Kualitas Ahli (Expert-Corrected) telah diamankan!`);
    console.log("=========================================================");
}

executeHijack();
