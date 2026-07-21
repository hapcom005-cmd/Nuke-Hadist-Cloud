const { Worker } = require('worker_threads');
const fs = require('fs');
const path = require('path');

const NUM_CORES = process.env.NUM_CORES || 12;
const IMAM = process.argv[2] || 'bukhari';
const TARGET_LANG = process.argv[3] || 'en'; // e.g. en, ru, ms
const INPUT_FILE = path.join(__dirname, `QuranHadist/data/hadist_js/${IMAM}.js`);
const OUTPUT_DIR = path.join(__dirname, `QuranHadist/data/hadist_lang/${TARGET_LANG}`);
const OUTPUT_FILE = path.join(OUTPUT_DIR, `${IMAM}.json`);

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log(`[MASTER] Memulai Mesin Penerjemah 12-Core untuk Kitab: ${IMAM}`);
console.log(`[MASTER] Bahasa Target: ${TARGET_LANG.toUpperCase()}`);

// Membaca file javascript
let rawContent = fs.readFileSync(INPUT_FILE, 'utf8');
// Membersihkan prefix window.GLOBAL_HADITH... untuk parse JSON
rawContent = rawContent.substring(rawContent.indexOf('{"name"')).trim();
if (rawContent.endsWith(';')) rawContent = rawContent.slice(0, -1);

let hadithData;
try {
    hadithData = JSON.parse(rawContent);
} catch (e) {
    console.error('[MASTER] Gagal mem-parsing file hadist JS', e.message);
    process.exit(1);
}

const items = hadithData.items;
const totalItems = items.length;
console.log(`[MASTER] Ditemukan ${totalItems} hadist.`);

// Matikan TESTING_MODE agar memproses ribuan hadist secara penuh
const TESTING_MODE = false;
const maxItems = TESTING_MODE ? 100 : totalItems;
const itemsToProcess = items.slice(0, maxItems);

// Membagi data ke dalam 12 chunk
const chunkSize = Math.ceil(itemsToProcess.length / NUM_CORES);
const chunks = [];
for (let i = 0; i < itemsToProcess.length; i += chunkSize) {
    chunks.push(itemsToProcess.slice(i, i + chunkSize));
}

console.log(`[MASTER] Membagi ${itemsToProcess.length} hadist ke dalam ${chunks.length} pekerja (Maks ${chunkSize} per pekerja).`);

let completedWorkers = 0;
let translatedItems = [];
const startTime = Date.now();

for (let i = 0; i < chunks.length; i++) {
    const worker = new Worker(path.join(__dirname, 'worker_translator.js'), {
        workerData: {
            workerId: i + 1,
            targetLang: TARGET_LANG,
            chunk: chunks[i]
        }
    });

    worker.on('message', (resultChunk) => {
        translatedItems = translatedItems.concat(resultChunk);
        completedWorkers++;
        console.log(`[MASTER] Pekerja ${i + 1} Selesai! Progress: ${completedWorkers}/${chunks.length}`);
        
        if (completedWorkers === chunks.length) {
            const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log(`[MASTER] Seluruh 12-Core selesai dalam ${timeTaken} detik.`);
            
            // Sort back based on number just in case
            translatedItems.sort((a, b) => a.number - b.number);
            
            hadithData.items = translatedItems;
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(hadithData, null, 2));
            console.log(`[MASTER] Hasil disimpan di ${OUTPUT_FILE}`);
        }
    });

    worker.on('error', (err) => {
        console.error(`[MASTER] Pekerja ${i + 1} Error:`, err);
    });

    worker.on('exit', (code) => {
        if (code !== 0) {
            console.error(`[MASTER] Pekerja ${i + 1} terhenti dengan kode ${code}`);
        }
    });
}
