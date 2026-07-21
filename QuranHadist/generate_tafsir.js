const fs = require('fs');
const path = require('path');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

function hapusHarakat(str) {
    return str.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, "");
}

if (isMainThread) {
    console.log("🚀 Memulai proses Pre-computation Tafsir (VERSI 12-CORE LINGUISTIC ROOT NETWORK)...");
    const startTime = Date.now();
    
    const quranStr = fs.readFileSync(path.join(__dirname, 'quran_data.js'), 'utf8')
        .replace('const QURAN_DATA = ', '').replace(/;$/, '');
    const QURAN_DATA = JSON.parse(quranStr);
    
    const NUM_THREADS = 12;
    const chunkSize = Math.ceil(QURAN_DATA.length / NUM_THREADS);
    const chunks = [];
    for (let i = 0; i < QURAN_DATA.length; i += chunkSize) {
        chunks.push(QURAN_DATA.slice(i, i + chunkSize));
    }
    
    let activeWorkers = chunks.length;
    const finalMapping = { surah: {}, ayat: {} };
    let totalSurahMatches = 0;
    let totalAyatMatches = 0;
    
    console.log(`⚡ Mengerahkan ${chunks.length} Worker Threads! Membuka batas RAM hingga 12 GB untuk menampung Jaringan Akar Kata...`);
    
    chunks.forEach((chunk, index) => {
        const worker = new Worker(__filename, {
            workerData: { chunk, workerId: index + 1 }
        });
        
        worker.on('message', (msg) => {
            if (msg.type === 'done') {
                Object.assign(finalMapping.surah, msg.surah);
                Object.assign(finalMapping.ayat, msg.ayat);
                totalSurahMatches += msg.totalSurahMatches;
                totalAyatMatches += msg.totalAyatMatches;
            }
        });
        
        worker.on('error', (err) => console.error(`❌ Worker ${index+1} Error:`, err));
        worker.on('exit', () => {
            activeWorkers--;
            if (activeWorkers === 0) {
                const endTime = Date.now();
                const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
                console.log(`✅ Operasi Jaringan Akar Kata (Linguistic Root Network) selesai dalam ${timeTaken} detik!`);
                console.log(`🔍 Ditemukan ${totalSurahMatches} hadist surah, dan ${totalAyatMatches} hadist ayat dengan presisi ilmiah.`);
                console.log("💾 Menyimpan ke tafsir_mapping.js...");
                const fileOutput = `const TAFSIR_MAPPING = ${JSON.stringify(finalMapping)};`;
                fs.writeFileSync(path.join(__dirname, 'tafsir_mapping.js'), fileOutput, 'utf8');
                console.log("🎉 BERHASIL! Kecerdasan buatan dan data ahli telah menyatu secara sempurna!");
            }
        });
    });
    
} else {
    // ---------------- WORKER THREAD LOGIC ----------------
    // Setiap worker membaca data secara independen di RAM-nya masing-masing
    const hadistStr = fs.readFileSync(path.join(__dirname, 'hadist_data.js'), 'utf8')
        .replace('const HADIST_DATA = ', '').replace(/;$/, '');
    const HADIST_DATA = JSON.parse(hadistStr);

    let kamusStr = fs.readFileSync(path.join(__dirname, 'kamus_ajaib_pro.js'), 'utf8');
    const firstBrace = kamusStr.indexOf('{');
    const lastBrace = kamusStr.lastIndexOf('}');
    const KAMUS_AJAIB_PRO = JSON.parse(kamusStr.substring(firstBrace, lastBrace + 1));

    const wordToRoot = {};
    for (let word in KAMUS_AJAIB_PRO) {
        wordToRoot[word] = KAMUS_AJAIB_PRO[word].arab;
    }
    
    const STOP_WORDS = new Set(['yang','dan','atau','di','ke','dari','untuk','pada','adalah','ini','itu','apa','siapa','bagaimana','kenapa','mengapa','kapan','dimana','cari','bisa','dapat','akan','sudah','belum','tidak','bukan','semua','dengan','dalam','bahwa','oleh','sebagai','kepada','mereka','kita','kami','saya','dia','ia','kamu','kalian']);

    function extractKeywords(text) {
        if (!text) return [];
        const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
        return [...new Set(words.filter(w => w.length > 2 && !STOP_WORDS.has(w)))];
    }

    function extractRoots(text) {
        if (!text) return [];
        const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
        const roots = new Set();
        words.forEach(w => {
            if (wordToRoot[w]) {
                roots.add(wordToRoot[w]);
            }
        });
        return [...roots];
    }
    
    let allHadiths = [];
    Object.values(HADIST_DATA).forEach(kitab => {
        kitab.items.forEach(h => {
            const txt = (h.id||'').toLowerCase();
            allHadiths.push({
                p: kitab.name,
                n: h.number,
                txtId: txt,
                txtAr: hapusHarakat(h.arab||''),
                wordsSet: new Set(extractKeywords(txt)),
                rootsSet: new Set(extractRoots(txt))
            });
        });
    });
    
    const { chunk, workerId } = workerData;
    const mapping = { surah: {}, ayat: {} };
    let sMatches = 0;
    let aMatches = 0;
    
    chunk.forEach(s => {
        const nomorSurah = s.nomor;
        const namaSurah = s.namaLatin.replace(/'/g, "\\'");
        const nS = namaSurah.toLowerCase();
        const baseName = nS.replace(/al-/g, '').replace(/al /g, '').trim();
        const arabBersihSurah = hapusHarakat(s.nama);
        
        // 1. PENCARIAN TAFSIR UNTUK SURAH
        let surahMatches = [];
        allHadiths.forEach(h => {
            let score = 0;
            if (h.txtAr.includes(arabBersihSurah)) score += 20;
            if (h.txtAr.includes('سورة ' + arabBersihSurah)) score += 30; 
            if (h.txtId.includes(nS)) score += 10;
            if (h.txtId.includes(baseName)) score += 5;
            if (h.txtId.includes(`surat ${baseName}`)) score += 15;
            if (h.txtId.includes(`surah ${baseName}`)) score += 15;
            if (h.txtId.includes(`surah ke-${nomorSurah}`) || h.txtId.includes(`surat ke-${nomorSurah}`)) score += 5;
            
            if (score > 0) surahMatches.push({ score, p: h.p, n: h.n });
        });
        
        if (surahMatches.length > 0) {
            surahMatches.sort((a, b) => b.score - a.score);
            mapping.surah[nomorSurah] = surahMatches.slice(0, 100).map(x => ({ p: x.p, n: x.n }));
            sMatches += mapping.surah[nomorSurah].length;
        }
        
        // 2. PENCARIAN TAFSIR UNTUK AYAT (LINGUISTIC ROOT NETWORK)
        s.ayat.forEach(a => {
            const nomorAyat = a.nomorAyat;
            const ayatKeywords = extractKeywords(a.teksIndonesia);
            const ayatRoots = extractRoots(a.teksIndonesia);
            
            // PRE-COMPUTE AYAH STRINGS TO AVOID 37 MILLION REGEX CALLS!
            const exactSearch1 = `${nS} ayat ${nomorAyat}`;
            const exactSearch2 = `${baseName} ayat ${nomorAyat}`;
            const exactSearch3 = `surat ${baseName} ayat ${nomorAyat}`;
            const exactSearch4 = `surah ${baseName} ayat ${nomorAyat}`;
            const cleanIndo = (a.teksIndonesia || '').toLowerCase().replace(/[^a-z0-9\s]/g, '');
            const cleanIndoValid = cleanIndo.length > 10;
            
            let ayatMatches = [];
            allHadiths.forEach(h => {
                let score = 0;
                
                // Cek irisan kata kunci semantic (Jaccard-like Overlap) O(1) Hash Set
                ayatKeywords.forEach(kw => {
                    if (h.wordsSet.has(kw)) score++;
                });

                // LINGUISTIC ROOT MATCH (KEKUATAN UTAMA BARU) O(1) Hash Set
                // Memberikan bobot tinggi karena dua terjemahan berbeda tapi memiliki akar kata asli yang sama
                ayatRoots.forEach(root => {
                    if (h.rootsSet.has(root)) score += 4;
                });
                
                // Tambahan bobot eksplisit (Tafsir Langsung)
                if (h.txtId.includes(exactSearch1)) score += 10;
                if (h.txtId.includes(exactSearch2)) score += 8;
                if (h.txtId.includes(exactSearch3)) score += 15;
                if (h.txtId.includes(exactSearch4)) score += 15;
                
                // Exact Match translation
                if (cleanIndoValid && h.txtId.includes(cleanIndo)) score += 50;

                // Threshold Semantic: Dinaikkan menjadi 5 karena adanya ledakan skor dari Akar Kata (menghindari false positive)
                if (score >= 5) {
                    ayatMatches.push({ score, p: h.p, n: h.n });
                }
            });
            
            if (ayatMatches.length > 0) {
                ayatMatches.sort((a, b) => b.score - a.score);
                mapping.ayat[`${nomorSurah}:${nomorAyat}`] = ayatMatches.slice(0, 50).map(x => ({ p: x.p, n: x.n }));
                aMatches += mapping.ayat[`${nomorSurah}:${nomorAyat}`].length;
            }
        });
    });
    
    // Kirim hasil ke Main Thread
    parentPort.postMessage({
        type: 'done',
        surah: mapping.surah,
        ayat: mapping.ayat,
        totalSurahMatches: sMatches,
        totalAyatMatches: aMatches
    });
}
