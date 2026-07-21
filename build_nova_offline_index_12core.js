const fs = require('fs');
const path = require('path');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const QURAN_DIR = path.join(__dirname, 'QuranHadist', 'data', 'quran');
const HADIST_DIR = path.join(__dirname, 'QuranHadist', 'data', 'hadist');
const OUT_DIR = path.join(__dirname, 'QuranHadist', 'data', 'offline_index_v2');
const TEMP_DIR = path.join(__dirname, 'QuranHadist', 'data', 'temp_index_v2');

const MAX_WORDS = 2;
const CORES = 12;

function stripHarakat(text) {
    if (!text) return '';
    return text.replace(/[\u064B-\u065F\u0670]/g, '').replace(/[^\u0600-\u06FF\s]/g, '').trim();
}

function cleanLatinIndo(text) {
    if (!text) return '';
    // Hapus tanda baca umum dan jadikan lowercase
    return text.replace(/[.,:;!?'"()[\]{}\\-]/g, ' ').replace(/\s+/g, ' ').toLowerCase().trim();
}

if (isMainThread) {
    console.log('🔥 [MASTER] MEMBANGUNKAN OTAK NOVA 12 CORE (MULTI-BAHASA) 🔥');
    console.log('Tujuan: Merender N-Gram 1-10 Kata (Arab, Latin, Indonesia) -> Chunked Prefix Index');
    
    if (fs.existsSync(OUT_DIR)) {
        fs.rmSync(OUT_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(OUT_DIR, { recursive: true });
    
    if (fs.existsSync(TEMP_DIR)) {
        fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(TEMP_DIR, { recursive: true });

    let tasks = [];
    
    if (fs.existsSync(QURAN_DIR)) {
        const quranFiles = fs.readdirSync(QURAN_DIR).filter(f => f.endsWith('.json'));
        quranFiles.forEach(f => tasks.push({ type: 'quran', path: path.join(QURAN_DIR, f), id: f.replace('.json', '') }));
    }
    
    if (fs.existsSync(HADIST_DIR)) {
        const hadistFiles = fs.readdirSync(HADIST_DIR).filter(f => f.endsWith('.json'));
        hadistFiles.forEach(f => tasks.push({ type: 'hadist', path: path.join(HADIST_DIR, f), id: f.replace('.json', '') }));
    }
    
    console.log(`📦 Ditemukan total ${tasks.length} file untuk diproses.`);
    
    const chunks = Array.from({ length: CORES }, () => []);
    tasks.forEach((t, i) => {
        chunks[i % CORES].push(t);
    });

    let activeWorkers = 0;
    let allPrefixes = new Set();
    
    for (let i = 0; i < CORES; i++) {
        if (chunks[i].length === 0) continue;
        activeWorkers++;
        
        const worker = new Worker(__filename, {
            workerData: { coreId: i + 1, tasks: chunks[i], tempDir: TEMP_DIR }
        });
        
        worker.on('message', (msg) => {
            if (msg.status === 'done') {
                activeWorkers--;
                msg.prefixes.forEach(p => allPrefixes.add(p));
                console.log(`✅ [CORE ${msg.coreId}] Selesai! (Menghasilkan ${msg.prefixes.length} prefix)`);
                
                if (activeWorkers === 0) {
                    console.log('⏳ [MASTER] Semua Core selesai tahap pertama. Mulai tahap penggabungan (Merge)...');
                    mergeAllPrefixes(Array.from(allPrefixes));
                }
            }
        });
        
        worker.on('error', (err) => {
            console.error(`❌ [CORE ${i + 1}] ERROR:`, err);
        });
    }
    
    function mergeAllPrefixes(prefixes) {
        console.log(`🔄 Menggabungkan ${prefixes.length} file prefix unik secara efisien...`);
        let mergedCount = 0;
        
        for (const prefix of prefixes) {
            let combined = {};
            for (let i = 1; i <= CORES; i++) {
                const tmpFile = path.join(TEMP_DIR, `temp_${i}_${prefix}.json`);
                if (fs.existsSync(tmpFile)) {
                    const data = JSON.parse(fs.readFileSync(tmpFile, 'utf8'));
                    for (const term in data) {
                        if (!combined[term]) combined[term] = [];
                        combined[term].push(...data[term]);
                    }
                }
            }
            // Deduplicate ID
            for (const term in combined) {
                combined[term] = Array.from(new Set(combined[term]));
            }
            
            fs.writeFileSync(path.join(OUT_DIR, `idx_${prefix}.json`), JSON.stringify(combined));
            mergedCount++;
        }
        
        console.log(`✅ Berhasil menggabungkan ${mergedCount} file index final di folder: ${OUT_DIR}`);
        console.log('🧹 Membersihkan file temporary (Sapu Bersih)...');
        fs.rmSync(TEMP_DIR, { recursive: true, force: true });
        console.log('🏆 MESIN PENCARI OFFLINE (OTAK NOVA MULTI-BAHASA) SELESAI DIBANGUN! SIAP DIGUNAKAN!');
    }

} else {
    // ---- AREA WORKER THREAD ----
    const { coreId, tasks, tempDir } = workerData;
    console.log(`🚀 [CORE ${coreId}] Menyala! Membedah ${tasks.length} file...`);
    
    let localIndex = {}; // Format: prefix -> { term -> [ids] }
    
    const STOP_WORDS = new Set(['telah', 'dan', 'yang', 'dari', 'kepada', 'untuk', 'dengan', 'ini', 'itu', 'di', 'ke', 'pada', 'dalam', 'kami', 'aku', 'dia', 'mereka']);

    function indexWords(words, docId) {
        if (!words || words.length === 0) return;
        for (let start = 0; start < words.length; start++) {
            if (STOP_WORDS.has(words[start])) continue; // Skip jika kata pertama adalah stop word
            let termArr = [];
            for (let len = 0; len < MAX_WORDS; len++) {
                if (start + len < words.length) {
                    termArr.push(words[start + len]);
                    const term = termArr.join(' ');
                    let prefix = term.substring(0, 3);
                    prefix = prefix.replace(/[^a-z0-9\u0600-\u06FF]/gi, '_'); // Hanya izinkan huruf, angka, dan Arab
                    if (prefix.length > 0) {
                        if (!localIndex[prefix]) localIndex[prefix] = {};
                        if (!localIndex[prefix][term]) localIndex[prefix][term] = [];
                        localIndex[prefix][term].push(docId);
                    }
                }
            }
        }
    }

    tasks.forEach(task => {
        const data = JSON.parse(fs.readFileSync(task.path, 'utf8'));
        
        if (task.type === 'quran' && data.ayat) {
            data.ayat.forEach(ayat => {
                const id = `q_${task.id}_${ayat.nomorAyat}`;
                
                // 1. Index Teks Arab
                const textArab = stripHarakat(ayat.teksArab);
                indexWords(textArab.split(/\s+/).filter(w => w.length > 0), id);
                
                // 2. Index Teks Latin
                const textLatin = cleanLatinIndo(ayat.teksLatin);
                indexWords(textLatin.split(/\s+/).filter(w => w.length > 0), id);
                
                // 3. Index Teks Indonesia
                const textIndo = cleanLatinIndo(ayat.teksIndonesia);
                indexWords(textIndo.split(/\s+/).filter(w => w.length > 0), id);
            });
        } else if (task.type === 'hadist' && data.items) {
            data.items.forEach(item => {
                const id = `h_${task.id}_${item.number}`;
                
                // 1. Index Teks Arab Hadist
                if (item.arab) {
                    const textArab = stripHarakat(item.arab);
                    indexWords(textArab.split(/\s+/).filter(w => w.length > 0), id);
                }
                
                // 2. Index Teks Terjemahan Indonesia (Biasanya ada di properti "id" di JSON Hadist)
                // "id": "Telah menceritakan kepada kami..."
                if (item.id && typeof item.id === 'string') {
                    const textIndo = cleanLatinIndo(item.id);
                    indexWords(textIndo.split(/\s+/).filter(w => w.length > 0), id);
                }
            });
        }
    });
    
    // Tulis hasil ke file temporary
    let prefixes = Object.keys(localIndex);
    prefixes.forEach(prefix => {
        for (let term in localIndex[prefix]) {
            localIndex[prefix][term] = Array.from(new Set(localIndex[prefix][term]));
        }
        const tmpPath = path.join(tempDir, `temp_${coreId}_${prefix}.json`);
        fs.writeFileSync(tmpPath, JSON.stringify(localIndex[prefix]));
    });
    
    parentPort.postMessage({ status: 'done', coreId, prefixes });
}
