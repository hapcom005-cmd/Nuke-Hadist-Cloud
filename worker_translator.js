const { workerData, parentPort } = require('worker_threads');
const https = require('https');
const fs = require('fs');

const { workerId, targetLang, chunk } = workerData;

// Kumpulan User-Agents untuk menyamar sebagai berbagai browser
const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.51'
];

function getRandomUserAgent() {
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// Fungsi Delay Acak ("Pelan dan Mematikan")
function randomDelay(min, max) {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fungsi Terjemahan via Google Translate (Bypass)
function translateText(text, targetLang) {
    return new Promise((resolve, reject) => {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=id&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        
        const options = {
            headers: {
                'User-Agent': getRandomUserAgent(),
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        };

        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(data);
                        let translated = '';
                        if (json[0]) {
                            json[0].forEach(part => {
                                translated += part[0];
                            });
                        }
                        resolve(translated || text);
                    } catch (e) {
                        reject(new Error('Gagal parse JSON dari Google API'));
                    }
                } else if (res.statusCode === 429) {
                    reject(new Error('BANNED (429)'));
                } else {
                    reject(new Error(`API Error: ${res.statusCode}`));
                }
            });
        }).on('error', (err) => reject(err));
    });
}

async function processChunk() {
    console.log(`[WORKER ${workerId}] Menyusup perlahan... (Target: ${chunk.length} hadist)`);
    const translatedChunk = [];

    for (let i = 0; i < chunk.length; i++) {
        const item = chunk[i];
        let retries = 5; // Maksimal coba 5 kali kalau kena block
        let success = false;
        
        while (retries > 0 && !success) {
            try {
                const result = await translateText(item.id, targetLang);
                
                translatedChunk.push({
                    number: item.number,
                    arab: item.arab,
                    id: result
                });
                
                success = true;
                
                // Jeda siluman acak antara 1 hingga 2.5 detik (Elegan & Pelan)
                await randomDelay(1000, 2500);
            } catch (err) {
                retries--;
                if (err.message === 'BANNED (429)') {
                    console.log(`[WORKER ${workerId}] Terdeteksi! Menghilang sementara selama 30 detik...`);
                    // Menghilang sangat lama jika kena blokir IP
                    await randomDelay(30000, 45000);
                } else {
                    console.log(`[WORKER ${workerId}] Hadist No ${item.number} gagal. Sisa percobaan: ${retries}`);
                    await randomDelay(3000, 5000);
                }

                if (retries === 0) {
                    // Fallback ke bahasa asli jika 5 kali gagal
                    translatedChunk.push(item);
                }
            }
        }
    }

    // Mengirim hasil pengerjaan ke Master
    parentPort.postMessage(translatedChunk);
}

processChunk();
