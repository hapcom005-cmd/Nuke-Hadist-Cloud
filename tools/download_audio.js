const fs = require('fs');
const https = require('https');
const path = require('path');

const RECITER_CONFIG = [
    { name: 'mishary', remoteFolder: 'Alafasy_128kbps' },
    // Only doing Mishary first to respect Github 1GB soft limit for repo
];

const BASE_URL = 'https://everyayah.com/data';
const OUT_DIR_BASE = path.join(__dirname, '..', 'QuranHadist', 'data', 'audio');

const surahAyatCounts = [
    7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
    112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53,
    89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12,
    12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26,
    30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6
];

function formatNumber(num) {
    return num.toString().padStart(3, '0');
}

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(dest)) {
            return resolve(); // Skip if exists
        }
        const file = fs.createWriteStream(dest);
        const req = https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            } else {
                fs.unlink(dest, () => {});
                if (response.statusCode === 404) {
                    console.log(`[404] Not Found: ${url}`);
                    resolve(); // Ignore 404
                } else {
                    reject(new Error(`Server responded with ${response.statusCode}: ${response.statusMessage}`));
                }
            }
        });
        req.on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function run() {
    for (const reciter of RECITER_CONFIG) {
        const outDir = path.join(OUT_DIR_BASE, reciter.name, 'ayat');
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }
        console.log(`Downloading ${reciter.name} to ${outDir}...`);
        
        let promises = [];
        let total = 0;
        let downloaded = 0;
        for (let i = 0; i < 114; i++) {
            const surah = i + 1;
            const ayats = surahAyatCounts[i];
            for (let j = 0; j < ayats; j++) {
                const ayat = j + 1;
                const fileName = `${formatNumber(surah)}${formatNumber(ayat)}.mp3`;
                const url = `${BASE_URL}/${reciter.remoteFolder}/${fileName}`;
                const dest = path.join(outDir, fileName);
                
                promises.push(downloadFile(url, dest).then(() => {
                    downloaded++;
                    if (downloaded % 100 === 0) console.log(`Downloaded ${downloaded} files...`);
                }).catch(e => {
                    console.log(`Failed to download ${fileName}: ${e.message}`);
                }));

                // Limit concurrency to 50
                if (promises.length >= 50) {
                    await Promise.all(promises);
                    promises = [];
                }
                total++;
            }
        }
        if (promises.length > 0) {
            await Promise.all(promises);
        }
        console.log(`Finished ${reciter.name}. Total: ${total}`);
    }
}

run().catch(console.error);
