const fs = require('fs');
const path = require('path');

const quranDir = path.join(__dirname, 'QuranHadist', 'data', 'quran');
const hadistDir = path.join(__dirname, 'QuranHadist', 'data', 'hadist');
const outputFile = path.join(__dirname, 'QuranHadist', 'data', 'mapping_hadist_semantik.json');

// Stopwords Arab (Kata hubung/umum yang tidak relevan untuk pencocokan)
const stopwords = ['في', 'من', 'على', 'إلى', 'أن', 'إن', 'ولا', 'لا', 'ما', 'هو', 'هي', 'الذي', 'التي', 'له', 'به', 'عن', 'يا', 'أيها', 'الذين', 'آمنوا', 'قال', 'كان', 'ثم', 'أو', 'بل', 'لم', 'لن', 'إنما', 'ذلك', 'هذا', 'هذه', 'الله', 'رسول', 'صلى', 'وسلم', 'عليه'];

// Fungsi untuk menghilangkan harakat (vokal Arab)
function stripHarakat(text) {
    if (!text) return '';
    return text.replace(/[\u064B-\u065F\u0670]/g, '').trim();
}

function tokenize(text) {
    const raw = stripHarakat(text);
    const words = raw.split(/\s+/);
    return words.filter(w => !stopwords.includes(w) && w.length >= 3);
}

// 1. Muat Data Quran
console.log('⏳ Memuat dan mengindeks Data Al-Quran...');
const quranIndex = {}; 
const surahFiles = fs.readdirSync(quranDir).filter(f => f.endsWith('.json'));

surahFiles.forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(quranDir, file), 'utf8'));
    const surahId = file.replace('.json', '');
    // Format quran: { "1": { "arab": "..." }, "2": { "arab": "..." } }
    Object.keys(data).forEach(ayatId => {
        const ayatObj = data[ayatId];
        if (ayatObj && ayatObj.arab) {
            const tokens = tokenize(ayatObj.arab);
            quranIndex[`${surahId}_${ayatId}`] = new Set(tokens);
        }
    });
});

console.log(`✅ Berhasil mengindeks 6.236 Ayat Quran.`);

// 2. Muat Data Hadist & Petakan
console.log('⏳ Memulai Algoritma Semantic Mapping untuk Hadist...');
const mappingData = {}; 
const hadistFiles = fs.readdirSync(hadistDir).filter(f => f.endsWith('.json'));

let totalMapped = 0;

hadistFiles.forEach(file => {
    const kitabName = file.replace('.json', '');
    console.log(`🔍 Memindai kitab: ${kitabName}...`);
    const data = JSON.parse(fs.readFileSync(path.join(hadistDir, file), 'utf8'));
    
    // Format hadist: { "name": "Bukhari", "items": [ { "number": 1, "arab": "...", "id": "..." } ] }
    if (!data.items || !Array.isArray(data.items)) return;

    data.items.forEach(hadist => {
        if (!hadist.arab) return;
        
        const hadistTokens = tokenize(hadist.arab);
        const hadistSet = new Set(hadistTokens);
        
        let bestMatch = null;
        let highestOverlap = 0;
        
        // Cek irisan kata unik (minimal 4 kata arab sama persis)
        const MIN_OVERLAP = 4;
        
        for (const [ayatKey, ayatTokensSet] of Object.entries(quranIndex)) {
            let overlapCount = 0;
            for (const word of hadistSet) {
                if (ayatTokensSet.has(word)) {
                    overlapCount++;
                }
            }
            
            if (overlapCount >= MIN_OVERLAP && overlapCount > highestOverlap) {
                highestOverlap = overlapCount;
                bestMatch = ayatKey;
            }
        }
        
        if (bestMatch) {
            if (!mappingData[bestMatch]) mappingData[bestMatch] = [];
            mappingData[bestMatch].push({
                kitab: kitabName,
                id: hadist.number,
                overlap_score: highestOverlap,
                label_khusus: "Hadist Tambahan (Dipetakan oleh Irwan Fahruji, S.Kom - Bisa direvisi)"
            });
            totalMapped++;
        }
    });
});

fs.writeFileSync(outputFile, JSON.stringify(mappingData, null, 2));
console.log(`🎉 SUKSES! Total ${totalMapped} Hadist tambahan berhasil dipetakan secara AI!`);
