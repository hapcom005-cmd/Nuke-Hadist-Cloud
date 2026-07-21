/**
 * SKRIP KONVERSI TAFSIR GLOBAL → JS OFFLINE
 * Menggunakan 6 Worker Threads (sesuai perintah Bos)
 * Mengekstrak 26 tafsir dari tafsir_api-main ke format window.TAFSIR_GLOBAL
 */

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'tafsir_global/tafsir_api-main/tafsir');
const DST = path.join(__dirname, 'QuranHadist/data/tafsir_all_js');
const EDITIONS_FILE = path.join(__dirname, 'tafsir_global/tafsir_api-main/tafsir/editions.json');
const NUM_WORKERS = 12;

if (isMainThread) {
    console.time('TOTAL WAKTU');
    
    // Read editions for name mapping
    const editions = JSON.parse(fs.readFileSync(EDITIONS_FILE, 'utf8'));
    const nameMap = {};
    editions.forEach(e => { nameMap[e.slug] = e.name; });
    
    // Get all available tafsir folders
    const tafsirFolders = fs.readdirSync(SRC).filter(f => {
        const p = path.join(SRC, f);
        return fs.statSync(p).isDirectory();
    });
    
    console.log(`🔥 Ditemukan ${tafsirFolders.length} Tafsir di folder download!`);
    console.log(`⚡ Memulai konversi dengan ${NUM_WORKERS} Worker Threads...`);
    
    // Create output dir
    if (!fs.existsSync(DST)) fs.mkdirSync(DST, { recursive: true });
    
    // Save meta file for UI
    const meta = tafsirFolders.map(slug => ({
        slug,
        name: nameMap[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        isArabic: slug.startsWith('ar-') || ['abu-bakr-jabir-al-jazairi', 'adwa-al-bayan', 'al-bahr-al-muhit', 'al-basit', 'al-dur-al-masun-lil-samin-al-halabi', 'al-durr-al-manthur', 'al-i-rab-al-muyassar', 'al-jadwal-fi-i-rab-al-quran', 'al-kashshaf-al-zamakhshari', 'al-lubab-fi-ulum-al-kitab', 'al-muharrar-al-wajiz-ibn-atiyyah', 'al-muyassar-fi-al-gharib', 'al-nashr-li-ibn-al-jazari', 'al-qira-at-al-mawsoo-ah-al-qur-aniyyah', 'al-wajiz-wahidi', 'alrab-al-quran-li-da-as'].includes(slug)
    }));
    
    fs.writeFileSync(path.join(DST, 'meta.js'), 
        'window.TAFSIR_GLOBAL_META = ' + JSON.stringify(meta, null, 0) + ';',
        'utf8'
    );
    console.log(`📝 meta.js tersimpan (${meta.length} tafsir terdaftar)`);
    
    // Build task list: each task = { slug, surahNo }
    const tasks = [];
    for (const slug of tafsirFolders) {
        for (let s = 1; s <= 114; s++) {
            const jsonFile = path.join(SRC, slug, s + '.json');
            if (fs.existsSync(jsonFile)) {
                tasks.push({ slug, surahNo: s, jsonFile });
            }
        }
    }
    
    console.log(`📦 Total tugas: ${tasks.length} file JSON untuk dikonversi`);
    
    // Split tasks among workers
    const chunkSize = Math.ceil(tasks.length / NUM_WORKERS);
    let completed = 0;
    let totalFiles = 0;
    
    for (let i = 0; i < NUM_WORKERS; i++) {
        const chunk = tasks.slice(i * chunkSize, (i + 1) * chunkSize);
        if (chunk.length === 0) continue;
        
        const worker = new Worker(__filename, { workerData: { chunk, dst: DST } });
        
        worker.on('message', (msg) => {
            if (msg.type === 'done') {
                completed++;
                totalFiles += msg.filesWritten;
                console.log(`✅ Worker-${i} selesai: ${msg.filesWritten} file (${completed}/${NUM_WORKERS})`);
                
                if (completed === Math.min(NUM_WORKERS, Math.ceil(tasks.length / chunkSize))) {
                    console.log(`\n🎉 KONVERSI SELESAI! Total: ${totalFiles} file JS offline`);
                    console.timeEnd('TOTAL WAKTU');
                }
            }
        });
        
        worker.on('error', (err) => {
            console.error(`❌ Worker-${i} error:`, err.message);
        });
    }
    
} else {
    // WORKER THREAD
    const { chunk, dst } = workerData;
    let filesWritten = 0;
    
    for (const task of chunk) {
        try {
            const raw = fs.readFileSync(task.jsonFile, 'utf8');
            const data = JSON.parse(raw);
            
            // data bisa berupa object keyed by index, atau array
            let ayahMap = {};
            
            if (Array.isArray(data)) {
                data.forEach(item => {
                    if (item.ayah !== undefined) {
                        ayahMap[item.ayah] = item.text || '';
                    }
                });
            } else {
                // Object with numeric keys
                const keys = Object.keys(data);
                keys.forEach(k => {
                    const item = data[k];
                    if (item && item.ayah !== undefined) {
                        ayahMap[item.ayah] = item.text || '';
                    }
                });
            }
            
            // Write as JS
            const outDir = path.join(dst, task.slug);
            if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
            
            const outFile = path.join(outDir, task.surahNo + '.js');
            const content = `window.TAFSIR_GLOBAL=window.TAFSIR_GLOBAL||{};window.TAFSIR_GLOBAL["${task.slug}"]=window.TAFSIR_GLOBAL["${task.slug}"]||{};window.TAFSIR_GLOBAL["${task.slug}"][${task.surahNo}]=${JSON.stringify(ayahMap)};`;
            
            fs.writeFileSync(outFile, content, 'utf8');
            filesWritten++;
        } catch (e) {
            // Skip broken files silently
        }
    }
    
    parentPort.postMessage({ type: 'done', filesWritten });
}
