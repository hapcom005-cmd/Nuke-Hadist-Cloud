const fs = require('fs');
const path = require('path');

const hadistDir = path.join(__dirname, 'QuranHadist/data/hadist');
const tafsirDir = path.join(__dirname, 'QuranHadist/data/tafsir');
const quranDir = path.join(__dirname, 'QuranHadist/data/quran');

const surahs = JSON.parse(fs.readFileSync(path.join(quranDir, 'meta.json'), 'utf8'));

const hadistBooks = [
  { file: 'abu-dawud.json', name: 'Abu Dawud' },
  { file: 'ahmad.json', name: 'Ahmad' },
  { file: 'bukhari.json', name: 'Bukhari' },
  { file: 'darimi.json', name: 'Darimi' },
  { file: 'ibnu-majah.json', name: 'Ibnu Majah' },
  { file: 'malik.json', name: 'Malik' },
  { file: 'muslim.json', name: 'Muslim' },
  { file: 'nasai.json', name: 'Nasa\'i' },
  { file: 'tirmidzi.json', name: 'Tirmidzi' }
];

console.log("Loading hadist books...");
const allHadists = [];
for (const b of hadistBooks) {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(hadistDir, b.file), 'utf8'));
    allHadists.push({ name: b.name, data });
  } catch(e) {}
}

const globalMappingSurah = {}; 
const globalMappingAyat = {};  

for (const s of surahs) {
    globalMappingSurah[s.nomor] = [];
}

console.log("Scanning all hadiths for aggressive mapping...");

// Precompute variants of surah names
const surahMatchers = surahs.map(s => {
    let name = s.namaLatin.toLowerCase().replace(/[']/g, '');
    let nameAlt = name.replace(/-/g, ' ');
    let nameAlt2 = name.replace(/-/g, '');
    let nameID = s.arti.toLowerCase();
    
    return {
        nomor: s.nomor,
        jumlahAyat: s.jumlahAyat,
        // Match: surat X, surah X, qs. X, qs X
        // We look for patterns like 'qs. al baqarah', 'surat al-baqarah', 'qs al baqarah'
        patterns: [
            name, nameAlt, nameAlt2, nameID
        ].filter((v, i, a) => a.indexOf(v) === i)
    };
});

for (const book of allHadists) {
    for (const h of book.data.items) {
        const text = h.id ? h.id.toLowerCase() : "";
        if (!text) continue;
        
        for (const s of surahMatchers) {
            let foundSurah = false;
            
            for(const pat of s.patterns) {
                // Check if text has any mention of the surah
                if (text.includes(`surat ${pat}`) || 
                    text.includes(`surah ${pat}`) || 
                    text.includes(`qs. ${pat}`) ||
                    text.includes(`qs ${pat}`)) {
                    foundSurah = true;
                    break;
                }
            }
            
            if (foundSurah) {
                // To support older code if any, output both n and id!
                globalMappingSurah[s.nomor].push({ p: book.name, n: h.number, id: h.number });
                
                // Now look for ayat numbers near this match, or anywhere in the hadith
                // "ayat 5" or "ayat ke 5" or "ayat: 5" or "159-160"
                // Often: (Qs. Al Baqarah: 159-160)
                // Let's use a regex to find numbers after the surah name.
                // We'll just extract all numbers in the text that could be an ayat.
                
                const ayatMatches = text.match(/(?:ayat|qs\.|surah|surat)[\s\w\-\.:]+?(\d+)(?:\s*-\s*(\d+))?/gi);
                let ayatsFound = new Set();
                
                if (ayatMatches) {
                    for(const am of ayatMatches) {
                        const nums = am.match(/\d+/g);
                        if(nums) {
                            for(const num of nums) {
                                const aNum = parseInt(num);
                                if (aNum > 0 && aNum <= s.jumlahAyat) {
                                    ayatsFound.add(aNum);
                                }
                            }
                        }
                    }
                }
                
                // If it mentions "ayat X" explicitly anywhere in the text:
                const explicitAyat = text.match(/ayat (?:\w+ )?(\d+)/g);
                if (explicitAyat) {
                    for(const am of explicitAyat) {
                        const nums = am.match(/\d+/g);
                        if(nums && nums[0]) {
                            const aNum = parseInt(nums[0]);
                            if (aNum > 0 && aNum <= s.jumlahAyat) ayatsFound.add(aNum);
                        }
                    }
                }
                
                // Also check for "Qs. Al Baqarah: 159" -> "baqarah: 159"
                const colonMatch = text.match(/:\s*(\d+)/g);
                if (colonMatch) {
                    for(const cm of colonMatch) {
                        const m = cm.match(/\d+/);
                        if(m) {
                            const aNum = parseInt(m[0]);
                            if (aNum > 0 && aNum <= s.jumlahAyat) ayatsFound.add(aNum);
                        }
                    }
                }
                
                // Register found ayats
                for(const aNum of ayatsFound) {
                    const key = `${s.nomor}:${aNum}`;
                    if(!globalMappingAyat[key]) globalMappingAyat[key] = [];
                    globalMappingAyat[key].push({ p: book.name, n: h.number, id: h.number });
                }
            }
        }
    }
}

console.log("Saving to tafsir files...");
for (const s of surahs) {
    const tFile = path.join(tafsirDir, `${s.nomor}.json`);
    if (fs.existsSync(tFile)) {
        const tData = JSON.parse(fs.readFileSync(tFile, 'utf8'));
        tData.mapping_surah = globalMappingSurah[s.nomor] || [];
        
        tData.mapping_ayat = {};
        for(let i = 1; i <= s.jumlahAyat; i++) {
            const key = `${s.nomor}:${i}`;
            if (globalMappingAyat[key]) {
                tData.mapping_ayat[key] = globalMappingAyat[key];
            }
        }
        
        fs.writeFileSync(tFile, JSON.stringify(tData));
    }
}
console.log("Done!");
