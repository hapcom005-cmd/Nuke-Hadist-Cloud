const fs = require('fs');

async function countWords() {
    let quranContent = fs.readFileSync('c:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/QuranHadist/data/quran_all.js', 'utf8');
    // It's a JS file defining window.QURAN_SURAH. Let's eval it.
    let window = {};
    eval(quranContent);
    
    let uniqueWords = new Set();
    
    for (let s = 1; s <= 114; s++) {
        let surah = window.QURAN_SURAH[s];
        if (surah) {
            surah.ayat.forEach(a => {
                let text = a.teksIndonesia.toLowerCase().replace(/[^a-z0-9\s]/g, '');
                let words = text.split(/\s+/);
                words.forEach(w => {
                    if (w.length > 2) uniqueWords.add(w);
                });
            });
        }
    }
    
    console.log("Unique Indonesian words in Quran (>2 chars):", uniqueWords.size);
}
countWords();
