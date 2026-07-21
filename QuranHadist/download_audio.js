const fs = require('fs');
const https = require('https');
const path = require('path');

const BASE_DIR = "c:\\Users\\Irwan Fahr\\Desktop\\QuranHadist";
const QURAN_DATA_FILE = path.join(BASE_DIR, 'quran_data.js');

// Load Quran Data
let rawData = fs.readFileSync(QURAN_DATA_FILE, 'utf8');
// Hapus "const QURAN_DATA = " di awal dan ";" di akhir untuk diparsing sebagai JSON
rawData = rawData.replace("const QURAN_DATA = ", "").trim();
if (rawData.endsWith(";")) rawData = rawData.slice(0, -1);
const quranData = JSON.parse(rawData);

// Fungsi download file dengan sistem retry
async function downloadFile(url, dest, maxRetries = 3) {
    if (fs.existsSync(dest)) {
        // Jika file sudah ada, skip (Fitur Resume)
        return true;
    }
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await new Promise((resolve, reject) => {
                const file = fs.createWriteStream(dest);
                https.get(url, (response) => {
                    if (response.statusCode === 200) {
                        response.pipe(file);
                        file.on('finish', () => {
                            file.close(resolve);
                        });
                    } else {
                        file.close();
                        fs.unlink(dest, () => reject(new Error(`Server merespon ${response.statusCode}`)));
                    }
                }).on('error', (err) => {
                    file.close();
                    fs.unlink(dest, () => reject(err));
                });
            });
            return true; // Sukses
        } catch (e) {
            if (attempt === maxRetries) {
                console.error(`  ❌ Gagal mengunduh ${path.basename(dest)} setelah ${maxRetries} percobaan: ${e.message}`);
                return false;
            }
            await new Promise(r => setTimeout(r, 1000 * attempt)); // Jeda sebelum retry
        }
    }
}

// Gunakan antrian Paralel agar cepat (5 file bersamaan)
async function downloadQueue(tasks, concurrency = 5) {
    let index = 0;
    let completed = 0;
    
    async function worker() {
        while (index < tasks.length) {
            const current = index++;
            const task = tasks[current];
            await downloadFile(task.url, task.dest);
            completed++;
            if (completed % 100 === 0 || completed === tasks.length) {
                console.log(`  [Progress] ${completed} dari ${tasks.length} file audio selesai...`);
            }
        }
    }
    
    const workers = [];
    for (let i = 0; i < concurrency; i++) {
        workers.push(worker());
    }
    
    await Promise.all(workers);
}

async function main() {
    console.log("==================================================");
    console.log("  MENGUNDUH AUDIO IMAM ABDURRAHMAN AS-SUDAIS");
    console.log("==================================================");
    
    const tasks = [];
    
    quranData.forEach(surah => {
        // 1. Audio Full Surah
        // API Asli (equran.id) asalnya kita simpan audio 05.
        // Tapi format URL dari API aslinya adalah:
        // https://equran.nos.wjv-1.neo.id/audio-full/Abdurrahman-As-Sudais/001.mp3
        // Untuk amannya, kita fetch ulang dari API untuk mendapatkan semua URL audio jika di quran_data.js tidak ada.
        
        // Asumsi: Karena di quran_data.js kita hanya simpan "05", kita buat URL As-Sudais ("03") secara manual:
        const surahNumStr = String(surah.nomor).padStart(3, '0');
        const fullAudioUrl = `https://equran.nos.wjv-1.neo.id/audio-full/Abdurrahman-As-Sudais/${surahNumStr}.mp3`;
        const fullAudioDest = path.join(BASE_DIR, 'audio', 'sudais', 'full', `${surahNumStr}.mp3`);
        
        tasks.push({ url: fullAudioUrl, dest: fullAudioDest });
        
        // 2. Audio Per Ayat
        // Format: https://equran.nos.wjv-1.neo.id/audio-partial/Abdurrahman-As-Sudais/001001.mp3
        surah.ayat.forEach(a => {
            const ayatNumStr = String(a.nomorAyat).padStart(3, '0');
            const ayatAudioUrl = `https://equran.nos.wjv-1.neo.id/audio-partial/Abdurrahman-As-Sudais/${surahNumStr}${ayatNumStr}.mp3`;
            const ayatAudioDest = path.join(BASE_DIR, 'audio', 'sudais', 'ayat', `${surahNumStr}${ayatNumStr}.mp3`);
            
            tasks.push({ url: ayatAudioUrl, dest: ayatAudioDest });
        });
    });
    
    console.log(`Menyiapkan ${tasks.length} file untuk diunduh (Surah & Ayat)...`);
    console.log("Fitur Resume aktif: File yang sudah ada akan dilewati.");
    
    await downloadQueue(tasks, 10); // Download 10 file sekaligus
    
    console.log("==================================================");
    console.log("  ✅ SEMUA AUDIO AS-SUDAIS BERHASIL DIUNDUH!");
    console.log("==================================================");
}

main();
