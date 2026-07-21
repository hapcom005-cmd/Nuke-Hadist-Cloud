const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const ZIP_PATH = path.join(__dirname, 'tafsir_global.zip');
const OUT_DIR = path.join(__dirname, 'QuranHadist', 'data', 'tafsir_global');

if (isMainThread) {
    console.log("🔥 [MASTER] MEMBANGUNKAN 12 CORE UNTUK EKSTRAKSI BRUTAL 1.5 GB!");
    
    if (!fs.existsSync(OUT_DIR)) {
        fs.mkdirSync(OUT_DIR, { recursive: true });
    }
    
    console.log("⏱️ [MASTER] Membaca peta indeks file ZIP...");
    let entries = [];
    try {
        const zip = new AdmZip(ZIP_PATH);
        entries = zip.getEntries();
    } catch(e) {
        console.log("❌ Gagal membaca ZIP:", e.message);
        process.exit(1);
    }
    
    const totalFiles = entries.length;
    console.log(`📦 [MASTER] Ditemukan ${totalFiles} file di dalam ZIP.`);
    
    if (totalFiles === 0) {
        console.log("⚠️ ZIP Kosong atau tidak valid.");
        process.exit(1);
    }

    console.log(`⚔️ [MASTER] Memecah beban kerja (Load Balancing) ke 12 Core secara merata...`);
    const numCores = 12;
    const chunkSize = Math.ceil(totalFiles / numCores);
    
    let activeWorkers = 0;
    
    for (let i = 0; i < numCores; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, totalFiles);
        const chunk = entries.slice(start, end).map(e => e.entryName);
        
        if (chunk.length === 0) continue;
        
        activeWorkers++;
        
        const worker = new Worker(__filename, {
            workerData: { 
                coreId: i + 1, 
                entryNames: chunk, 
                zipPath: ZIP_PATH, 
                outDir: OUT_DIR 
            }
        });

        worker.on('message', (msg) => {
            if (msg.status === 'done') {
                activeWorkers--;
                console.log(`✅ [CORE ${msg.coreId}] Selesai mengekstrak ${msg.count} file.`);
                if (activeWorkers === 0) {
                    console.log("🏆 [MASTER] SEMUA 12 CORE SELESAI! EKSTRAKSI BRUTAL BERHASIL!");
                }
            } else if (msg.status === 'progress') {
                console.log(`⏳ [CORE ${msg.coreId}] Progress: ${msg.count} file...`);
            }
        });
        
        worker.on('error', (err) => {
            console.error(`❌ [CORE ${i + 1}] ERROR:`, err);
        });
    }
} else {
    // ---- AREA 12 CORE (WORKER THREAD) ----
    const { coreId, entryNames, zipPath, outDir } = workerData;
    console.log(`🚀 [CORE ${coreId}] Menyala! Memproses ${entryNames.length} file...`);
    
    let zip;
    try {
        zip = new AdmZip(zipPath);
    } catch(e) {
        parentPort.postMessage({ status: 'done', coreId, count: 0 });
        process.exit(0);
    }

    let count = 0;
    
    for (const entryName of entryNames) {
        try {
            // Extract maintain folder structure
            zip.extractEntryTo(entryName, outDir, true, true);
            count++;
            
            // Report progress every 5000 files to avoid spamming console
            if (count % 5000 === 0) {
                parentPort.postMessage({ status: 'progress', coreId, count });
            }
        } catch(e) {
            // abaikan error minor seperti path kosong
        }
    }
    
    parentPort.postMessage({ status: 'done', coreId, count });
}
