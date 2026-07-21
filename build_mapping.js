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
    console.log(`Loaded ${b.name}`);
  } catch(e) {
    console.error(`Failed to load ${b.name}`);
  }
}

console.log("Preparing mapping structures...");
const globalMappingSurah = {}; // surahNum -> [{p: 'Bukhari', id: number}]
const globalMappingAyat = {};  // 'surahNum:ayatNum' -> [{p: 'Bukhari', id: number}]

for (const s of surahs) {
    globalMappingSurah[s.nomor] = [];
}

console.log("Scanning all hadiths...");
for (const book of allHadists) {
    for (const h of book.data.items) {
        const text = h.id ? h.id.toLowerCase() : "";
        if (!text) continue;
        
        for (const s of surahs) {
            const sNameLatin = s.namaLatin.toLowerCase();
            if (text.includes(`surat ${sNameLatin}`) || text.includes(`surah ${sNameLatin}`)) {
                globalMappingSurah[s.nomor].push({ p: book.name, id: h.number });
                
                // check for ayat
                // looking for "ayat X" or "ayat ke X"
                const ayatMatch = text.match(/ayat (?:ke )?(\d+)/g);
                if (ayatMatch) {
                    for(const am of ayatMatch) {
                        const m = am.match(/(\d+)/);
                        if (m && m[1]) {
                            const aNum = parseInt(m[1]);
                            if (aNum > 0 && aNum <= s.jumlahAyat) {
                                const key = `${s.nomor}:${aNum}`;
                                if(!globalMappingAyat[key]) globalMappingAyat[key] = [];
                                globalMappingAyat[key].push({ p: book.name, id: h.number });
                            }
                        }
                    }
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
        
        // collect ayat mappings for this surah
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
