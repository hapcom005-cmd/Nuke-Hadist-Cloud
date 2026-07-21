const fs = require('fs');
const path = require('path');

function hapusHarakat(str) {
    return str.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, "");
}

console.log("🚀 Memulai proses Pre-computation Tafsir (VERSI SINGLE-CORE O(1) LINGUISTIC ROOT NETWORK)...");
const startTime = Date.now();

// 1. LOAD SEMUA DATA
const vm = require('vm');
function parseJsFile(filename, varName) {
    const content = fs.readFileSync(path.join(__dirname, filename), 'utf8');
    const context = {};
    vm.createContext(context);
    vm.runInContext(content, context);
    return context[varName];
}

console.log("📦 Memuat Kamus Ajaib...");
const KAMUS_AJAIB_PRO = parseJsFile('kamus_ajaib_pro.js', 'KAMUS_AJAIB_PRO');

console.log("📦 Memuat Data Al-Quran...");
const QURAN_DATA = parseJsFile('quran_data.js', 'QURAN_DATA');

console.log("📦 Memuat Data Hadist...");
const HADIST_DATA = parseJsFile('hadist_data.js', 'HADIST_DATA');

const STOP_WORDS = new Set(['dan', 'atau', 'dengan', 'yang', 'di', 'ke', 'dari', 'pada', 'dalam', 'untuk', 'adalah', 'ini', 'itu', 'juga', 'akan', 'oleh', 'kepada']);

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
        if (KAMUS_AJAIB_PRO[w]) {
            roots.add(KAMUS_AJAIB_PRO[w]);
        }
    });
    return [...roots];
}

// 2. PARSING HADIST DATA (ONCE)
console.log("⚙️  Mem-parsing 25.000+ Hadist menjadi struktur O(1) Hash Map...");
let allHadiths = [];
Object.values(HADIST_DATA).forEach(kitab => {
    kitab.items.forEach(h => {
        const txt = (h.id || '').toLowerCase();
        allHadiths.push({
            p: kitab.name,
            n: h.number,
            txtId: txt,
            wordsSet: new Set(extractKeywords(txt)),
            rootsSet: new Set(extractRoots(txt))
        });
    });
});

console.log(`✅ Berhasil mem-parsing ${allHadiths.length} Hadist. Memulai pencocokan 155 Juta Iterasi...`);

// 3. PENCOCOKAN
const finalMapping = { surah: {}, ayat: {} };
let totalSurahMatches = 0;
let totalAyatMatches = 0;

QURAN_DATA.forEach(s => {
    const nS = s.nomorSurah;
    const baseName = (s.namaLatin || '').toLowerCase().replace(/[^a-z0-9\s]/g, '');
    
    // SURAH LEVEL
    const surahKeywords = extractKeywords(s.namaLatin + " " + s.arti);
    let surahMatches = [];
    
    allHadiths.forEach(h => {
        let score = 0;
        if (h.txtId.includes(`surat ${baseName}`)) score += 20;
        if (h.txtId.includes(`surah ${baseName}`)) score += 20;
        if (h.txtId.includes(`tafsir ${baseName}`)) score += 30;
        
        surahKeywords.forEach(kw => {
            if (h.wordsSet.has(kw)) score++;
        });
        
        if (score >= 5) {
            surahMatches.push({ score, p: h.p, n: h.n });
        }
    });
    
    if (surahMatches.length > 0) {
        surahMatches.sort((a, b) => b.score - a.score);
        finalMapping.surah[nS] = surahMatches.slice(0, 10);
        totalSurahMatches += finalMapping.surah[nS].length;
    }
    
    // AYAH LEVEL
    s.ayat.forEach(a => {
        const nomorAyat = a.nomorAyat;
        const ayatKeywords = extractKeywords(a.teksIndonesia);
        const ayatRoots = extractRoots(a.teksIndonesia);
        
        const exactSearch1 = `${nS} ayat ${nomorAyat}`;
        const exactSearch2 = `${baseName} ayat ${nomorAyat}`;
        const exactSearch3 = `surat ${baseName} ayat ${nomorAyat}`;
        const exactSearch4 = `surah ${baseName} ayat ${nomorAyat}`;
        const cleanIndo = (a.teksIndonesia || '').toLowerCase().replace(/[^a-z0-9\s]/g, '');
        const cleanIndoValid = cleanIndo.length > 10;
        
        let ayatMatches = [];
        
        for (let i = 0; i < allHadiths.length; i++) {
            const h = allHadiths[i];
            let score = 0;
            
            for (let j = 0; j < ayatKeywords.length; j++) {
                if (h.wordsSet.has(ayatKeywords[j])) score++;
            }
            
            for (let j = 0; j < ayatRoots.length; j++) {
                if (h.rootsSet.has(ayatRoots[j])) score += 4;
            }
            
            if (h.txtId.includes(exactSearch1)) score += 10;
            if (h.txtId.includes(exactSearch2)) score += 8;
            if (h.txtId.includes(exactSearch3)) score += 15;
            if (h.txtId.includes(exactSearch4)) score += 15;
            
            if (cleanIndoValid && h.txtId.includes(cleanIndo)) score += 50;
            
            if (score >= 5) {
                ayatMatches.push({ score, p: h.p, n: h.n });
            }
        }
        
        if (ayatMatches.length > 0) {
            ayatMatches.sort((a, b) => b.score - a.score);
            finalMapping.ayat[`${nS}_${nomorAyat}`] = ayatMatches.slice(0, 5);
            totalAyatMatches += finalMapping.ayat[`${nS}_${nomorAyat}`].length;
        }
    });
});

console.log(`🎉 Pemetaan Selesai! Ditemukan: ${totalSurahMatches} rujukan Surah, ${totalAyatMatches} rujukan Ayat.`);
const timeTaken = (Date.now() - startTime) / 1000;
console.log(`⏱️ Waktu Eksekusi: ${timeTaken.toFixed(2)} detik!`);

const output = `const TAFSIR_MAPPING = ${JSON.stringify(finalMapping, null, 0)};`;
fs.writeFileSync(path.join(__dirname, 'tafsir_mapping.js'), output);
console.log("💾 File tafsir_mapping.js berhasil diperbarui secara offline!");
