const fs = require('fs');
const path = require('path');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const os = require('os');

const quranDir = path.join(__dirname, 'QuranHadist', 'data', 'quran');
const hadistDir = path.join(__dirname, 'QuranHadist', 'data', 'hadist');
const outputFile = path.join(__dirname, 'QuranHadist', 'data', 'mapping_hadist_semantik_12core.json');

const stopwords = ['في', 'من', 'على', 'إلى', 'أن', 'إن', 'ولا', 'لا', 'ما', 'هو', 'هي', 'الذي', 'التي', 'له', 'به', 'عن', 'يا', 'أيها', 'الذين', 'آمنوا', 'قال', 'كان', 'ثم', 'أو', 'بل', 'لم', 'لن', 'إنما', 'ذلك', 'هذا', 'هذه', 'الله', 'رسول', 'صلى', 'وسلم', 'عليه', 'بما', 'فما', 'كما', 'مما', 'عما', 'إذا', 'لما', 'كل', 'أنا', 'نحن', 'أنت', 'أنتم', 'هم', 'هن'];

function stripHarakat(text) {
    if (!text) return '';
    return text.replace(/[\u064B-\u065F\u0670]/g, '').trim();
}

function stemArabic(word) {
    let w = word;
    if (w.startsWith('وال')) w = w.substring(3);
    else if (w.startsWith('ال') || w.startsWith('فا')) w = w.substring(2);
    else if (w.startsWith('و') || w.startsWith('ف') || w.startsWith('ب') || w.startsWith('ل')) w = w.substring(1);
    return w;
}

function tokenize(text) {
    const raw = stripHarakat(text);
    const words = raw.split(/\s+/);
    return words.map(w => stemArabic(w)).filter(w => !stopwords.includes(w) && w.length >= 3);
}

if (isMainThread) {
    console.log('🔥 MENGAKTIFKAN PROTOKOL XEON 12-CORE & 12GB RAM 🔥');
    
    // Muat seluruh Quran ke RAM Utama (Shared Data)
    console.log('⏳ Memuat seluruh data Quran ke dalam Memory (RAM)...');
    const quranIndex = {}; 
    const surahFiles = fs.readdirSync(quranDir).filter(f => f.endsWith('.json'));

    surahFiles.forEach(file => {
        const data = JSON.parse(fs.readFileSync(path.join(quranDir, file), 'utf8'));
        const surahId = file.replace('.json', '');
        if (data.ayat && Array.isArray(data.ayat)) {
            data.ayat.forEach(ayatObj => {
                if (ayatObj && ayatObj.teksArab) {
                    quranIndex[`${surahId}_${ayatObj.nomorAyat}`] = Array.from(new Set(tokenize(ayatObj.teksArab)));
                }
            });
        }
    });

    console.log('⏳ Mengumpulkan seluruh tugas Hadist...');
    let hadistTasks = [];
    const hadistFiles = fs.readdirSync(hadistDir).filter(f => f.endsWith('.json'));
    
    hadistFiles.forEach(file => {
        const kitabName = file.replace('.json', '');
        const data = JSON.parse(fs.readFileSync(path.join(hadistDir, file), 'utf8'));
        if (data.items && Array.isArray(data.items)) {
            data.items.forEach(h => {
                if(h.arab) {
                    hadistTasks.push({ kitab: kitabName, id: h.number, arab: h.arab });
                }
            });
        }
    });

    const totalCores = 12; // PAKSA 12 CORE sesuai perintah Bos
    console.log(`🚀 Menembakkan ${hadistTasks.length} Hadist ke dalam ${totalCores} CORE prosesor secara brutal!`);
    
    // Pecah tugas ke 12 array
    const chunks = Array.from({ length: totalCores }, () => []);
    hadistTasks.forEach((task, index) => {
        chunks[index % totalCores].push(task);
    });

    let completedWorkers = 0;
    const finalMapping = {};
    let totalMapped = 0;

    for (let i = 0; i < totalCores; i++) {
        const worker = new Worker(__filename, {
            workerData: { quranIndex: quranIndex, hadistChunk: chunks[i], coreId: i + 1 }
        });

        worker.on('message', (msg) => {
            // Gabungkan hasil dari tiap core
            for (const [ayat, hadists] of Object.entries(msg.mappings)) {
                if (!finalMapping[ayat]) finalMapping[ayat] = [];
                finalMapping[ayat].push(...hadists);
                totalMapped += hadists.length;
            }
        });

        worker.on('exit', () => {
            completedWorkers++;
            if (completedWorkers === totalCores) {
                fs.writeFileSync(outputFile, JSON.stringify(finalMapping, null, 2));
                console.log(`\n🎉 [SELESAI] Operasi 12-Core Berhasil!`);
                console.log(`Total ${totalMapped} Hadist tambahan berhasil direntangkan dan dipetakan secara AI!`);
                console.log(`📁 File tersimpan di: ${outputFile}`);
            }
        });
    }

} else {
    // KODE WORKER (DIEKSEKUSI OLEH TIAP CORE)
    const { quranIndex, hadistChunk, coreId } = workerData;
    const mappingResult = {};
    
    // Kembalikan Set dari Array
    for (const key in quranIndex) {
        quranIndex[key] = new Set(quranIndex[key]);
    }

    hadistChunk.forEach(hadist => {
        const hadistTokens = tokenize(hadist.arab);
        const hadistSet = new Set(hadistTokens);
        let bestMatch = null;
        let highestOverlap = 0;
        const MIN_OVERLAP = 3; // Syarat minimal irisan 3 kata inti Arab

        for (const [ayatKey, ayatTokensSet] of Object.entries(quranIndex)) {
            let overlapCount = 0;
            for (const word of hadistSet) {
                if (ayatTokensSet.has(word)) overlapCount++;
            }
            if (overlapCount >= MIN_OVERLAP && overlapCount > highestOverlap) {
                highestOverlap = overlapCount;
                bestMatch = ayatKey;
            }
        }

        if (bestMatch) {
            if (!mappingResult[bestMatch]) mappingResult[bestMatch] = [];
            mappingResult[bestMatch].push({
                kitab: hadist.kitab,
                id: hadist.id,
                overlap_score: highestOverlap,
                label_khusus: "Hadist Tambahan (Dipetakan oleh Irwan Fahruji, S.Kom - Bisa direvisi)"
            });
        }
    });

    parentPort.postMessage({ mappings: mappingResult });
}
