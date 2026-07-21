const fs = require('fs');
const path = require('path');
const https = require('https');

const outputDir = path.join(__dirname, 'QuranHadist/data/asbab_nuzul');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

function download(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return download(res.headers.location).then(resolve).catch(reject);
            }
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve(data));
            res.on('error', reject);
        }).on('error', reject);
    });
}

async function main() {
    console.log("=== TAHAP 1: Download Asbab Al-Nuzul Dataset ===");
    
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 1; i <= 114; i++) {
        const num = String(i).padStart(3, '0');
        const url = `https://raw.githubusercontent.com/mostafaahmed97/asbab-al-nuzul-dataset/master/data/structured/json/${num}.json`;
        const outFile = path.join(outputDir, `${num}.json`);
        
        try {
            const data = await download(url);
            // Validate JSON
            const parsed = JSON.parse(data);
            fs.writeFileSync(outFile, JSON.stringify(parsed, null, 2), 'utf8');
            successCount++;
            if (successCount % 10 === 0) console.log(`  Downloaded ${successCount}/114...`);
        } catch(e) {
            // Some surahs might not have asbab al-nuzul data
            failCount++;
        }
    }
    
    console.log(`\nDownload complete! Success: ${successCount}, Not available: ${failCount}`);
    
    // === TAHAP 1.2: Inject Asbab Al-Nuzul into Tafsir files ===
    console.log("\n=== TAHAP 1.2: Injecting Asbab Al-Nuzul into Tafsir files ===");
    
    const tafsirDir = path.join(__dirname, 'QuranHadist/data/tafsir');
    
    for (let i = 1; i <= 114; i++) {
        const num = String(i).padStart(3, '0');
        const asbabFile = path.join(outputDir, `${num}.json`);
        const tafsirFile = path.join(tafsirDir, `${i}.json`);
        
        if (!fs.existsSync(asbabFile) || !fs.existsSync(tafsirFile)) continue;
        
        const asbabData = JSON.parse(fs.readFileSync(asbabFile, 'utf8'));
        const tafsirData = JSON.parse(fs.readFileSync(tafsirFile, 'utf8'));
        
        const asbabMap = {};
        for (const entry of asbabData) {
            if (entry.ayahs && entry.occasions) {
                for (const ayah of entry.ayahs) {
                    if (!asbabMap[ayah]) asbabMap[ayah] = [];
                    for (let j = 0; j < entry.occasions.length; j++) {
                        asbabMap[ayah].push({
                            ar: entry.occasions[j],
                            id: entry.occasions_id ? entry.occasions_id[j] : ""
                        });
                    }
                }
            }
        }
        
        tafsirData.asbab_nuzul = asbabMap;
        fs.writeFileSync(tafsirFile, JSON.stringify(tafsirData));
    }
    
    console.log("Asbab Al-Nuzul injection complete!");
    
    // === TAHAP 2: Super Aggressive Regex Mapping V3 ===
    console.log("\n=== TAHAP 2: Super Aggressive Hadist Mapping V3 ===");
    
    const hadistDir = path.join(__dirname, 'QuranHadist/data/hadist');
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
        { file: 'nasai.json', name: "Nasa'i" },
        { file: 'tirmidzi.json', name: 'Tirmidzi' }
    ];
    
    console.log("Loading hadist books...");
    const allBooks = [];
    for (const b of hadistBooks) {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(hadistDir, b.file), 'utf8'));
            allBooks.push({ name: b.name, data });
            console.log(`  Loaded ${b.name}: ${data.items.length} hadist`);
        } catch(e) {
            console.log(`  Skipped ${b.name}: ${e.message}`);
        }
    }
    
    // Build comprehensive surah name variants
    const surahVariants = surahs.map(s => {
        const latin = s.namaLatin;
        const variants = new Set();
        
        // Original name
        variants.add(latin.toLowerCase());
        
        // Without apostrophe
        variants.add(latin.toLowerCase().replace(/[''`]/g, ''));
        
        // Without hyphen
        variants.add(latin.toLowerCase().replace(/-/g, ' '));
        variants.add(latin.toLowerCase().replace(/-/g, ''));
        
        // Without both
        variants.add(latin.toLowerCase().replace(/[''`-]/g, '').replace(/\s+/g, ' '));
        variants.add(latin.toLowerCase().replace(/[''`-]/g, '').replace(/\s+/g, ''));
        
        // Common Indonesian transliterations
        const name = latin.toLowerCase();
        if (name.includes('al-')) {
            const withoutAl = name.replace(/^al-/, '');
            variants.add(withoutAl);
            variants.add(withoutAl.replace(/[''`]/g, ''));
        }
        
        // Add the Indonesian meaning as a variant
        if (s.arti) variants.add(s.arti.toLowerCase());
        
        // Common alternate spellings
        const alts = {
            "al-fatihah": ["fatiha", "fatihah", "al fatiha", "al fatihah"],
            "al-baqarah": ["baqarah", "al baqarah", "albaqarah"],
            "ali 'imran": ["ali imran", "al imran", "ali-imran", "al-imran", "imran"],
            "an-nisa'": ["an nisa", "annisa", "nisa", "an-nisa"],
            "al-ma'idah": ["al maidah", "almaidah", "maidah", "al-maidah"],
            "al-an'am": ["al anam", "alanam", "anam", "al-anam"],
            "al-a'raf": ["al araf", "alaraf", "araf", "al-araf"],
            "at-taubah": ["at taubah", "taubah", "tawbah", "at-tawbah"],
            "yunus": ["yonus"],
            "hud": ["huud"],
            "yusuf": ["yusup"],
            "ar-ra'd": ["ar rad", "arrad", "rad"],
            "ibrahim": ["ibrahiim"],
            "al-hijr": ["alhijr", "hijr"],
            "an-nahl": ["annahl", "nahl"],
            "al-isra'": ["al isra", "alisra", "isra", "bani israil"],
            "al-kahf": ["alkahf", "kahf", "kahfi"],
            "maryam": ["mariam"],
            "taha": ["thaha", "ta ha", "ta-ha"],
            "al-anbiya'": ["al anbiya", "anbiya", "alanbiya"],
            "al-hajj": ["alhajj", "hajj"],
            "al-mu'minun": ["al mukminun", "almukminun", "mukminun", "al-mukminun"],
            "an-nur": ["annur", "nur"],
            "al-furqan": ["alfurqan", "furqan"],
            "asy-syu'ara'": ["asy syuara", "syuara", "syu'ara"],
            "an-naml": ["annaml", "naml"],
            "al-qasas": ["alqasas", "qasas"],
            "al-'ankabut": ["al ankabut", "ankabut", "alankabut"],
            "ar-rum": ["arrum", "rum"],
            "luqman": ["lukman"],
            "as-sajdah": ["assajdah", "sajdah"],
            "al-ahzab": ["alahzab", "ahzab"],
            "saba'": ["saba", "sabaa"],
            "fatir": ["faathir"],
            "yasin": ["ya sin", "ya-sin", "yasiin"],
            "as-saffat": ["assaffat", "saffat"],
            "sad": ["shaad"],
            "az-zumar": ["azzumar", "zumar"],
            "gafir": ["ghafir", "al-mukmin", "almukmin"],
            "fussilat": ["fushshilat", "ha mim sajdah"],
            "asy-syura": ["asy syura", "syura", "assyura"],
            "az-zukhruf": ["azzukhruf", "zukhruf"],
            "ad-dukhan": ["addukhan", "dukhan"],
            "al-jasiyah": ["aljasiyah", "jasiyah", "jatsiyah"],
            "al-ahqaf": ["alahqaf", "ahqaf"],
            "muhammad": ["muhammed"],
            "al-fath": ["alfath", "fath"],
            "al-hujurat": ["alhujurat", "hujurat"],
            "qaf": ["qaaf"],
            "az-zariyat": ["azzariyat", "zariyat", "adz-dzariyat"],
            "at-tur": ["attur", "tur", "thuur"],
            "an-najm": ["annajm", "najm"],
            "al-qamar": ["alqamar", "qamar"],
            "ar-rahman": ["arrahman", "rahman"],
            "al-waqi'ah": ["al waqiah", "waqiah", "alwaqiah"],
            "al-hadid": ["alhadid", "hadid", "hadiid"],
            "al-mujadalah": ["almujadalah", "mujadalah", "mujadilah"],
            "al-hasyr": ["alhasyr", "hasyr"],
            "al-mumtahanah": ["almumtahanah", "mumtahanah"],
            "as-saff": ["assaff", "saff"],
            "al-jumu'ah": ["al jumuah", "jumuah", "aljumuah"],
            "al-munafiqun": ["almunafiqun", "munafiqun"],
            "at-tagabun": ["attagabun", "tagabun", "taghabun"],
            "at-talaq": ["attalaq", "talaq", "thalaq"],
            "at-tahrim": ["attahrim", "tahrim"],
            "al-mulk": ["almulk", "mulk"],
            "al-qalam": ["alqalam", "qalam"],
            "al-haqqah": ["alhaqqah", "haqqah"],
            "al-ma'arij": ["al maarij", "maarij", "almaarij"],
            "nuh": ["nuuh"],
            "al-jinn": ["aljinn", "jinn", "jin"],
            "al-muzzammil": ["almuzzammil", "muzzammil"],
            "al-muddassir": ["almuddassir", "muddassir", "muddatstsir"],
            "al-qiyamah": ["alqiyamah", "qiyamah"],
            "al-insan": ["alinsan", "insan", "ad-dahr"],
            "al-mursalat": ["almursalat", "mursalat"],
            "an-naba'": ["an naba", "annaba", "naba"],
            "an-nazi'at": ["an naziat", "annaziat", "naziat"],
            "'abasa": ["abasa"],
            "at-takwir": ["attakwir", "takwir"],
            "al-infitar": ["alinfitar", "infitar"],
            "al-mutaffifin": ["almutaffifin", "mutaffifin", "tathfif"],
            "al-insyiqaq": ["alinsyiqaq", "insyiqaq"],
            "al-buruj": ["alburuj", "buruj", "buruuj"],
            "at-tariq": ["attariq", "tariq"],
            "al-a'la": ["al ala", "alala", "ala"],
            "al-gasiyah": ["algasiyah", "gasiyah", "ghasyiyah"],
            "al-fajr": ["alfajr", "fajr"],
            "al-balad": ["albalad", "balad"],
            "asy-syams": ["asy syams", "syams", "assyams"],
            "al-lail": ["allail", "lail"],
            "ad-duha": ["adduha", "duha", "dhuha"],
            "asy-syarh": ["asy syarh", "syarh", "insyirah", "al-insyirah"],
            "at-tin": ["attin", "tin"],
            "al-'alaq": ["al alaq", "alalaq", "alaq"],
            "al-qadr": ["alqadr", "qadr"],
            "al-bayyinah": ["albayyinah", "bayyinah"],
            "az-zalzalah": ["azzalzalah", "zalzalah"],
            "al-'adiyat": ["al adiyat", "aladiyat", "adiyat"],
            "al-qari'ah": ["al qariah", "alqariah", "qariah"],
            "at-takasur": ["attakasur", "takasur", "takaatsur"],
            "al-'asr": ["al asr", "alasr", "asr"],
            "al-humazah": ["alhumazah", "humazah"],
            "al-fil": ["alfil", "fil"],
            "quraisy": ["quraish", "qurais"],
            "al-ma'un": ["al maun", "almaun", "maun"],
            "al-kausar": ["alkausar", "kausar", "kautsar"],
            "al-kafirun": ["alkafirun", "kafirun"],
            "an-nasr": ["annasr", "nasr"],
            "al-lahab": ["allahab", "lahab", "al-masad"],
            "al-ikhlas": ["alikhlas", "ikhlas"],
            "al-falaq": ["alfalaq", "falaq"],
            "an-nas": ["annas", "nas"]
        };
        
        const key = latin.toLowerCase();
        if (alts[key]) {
            for (const alt of alts[key]) variants.add(alt);
        }
        
        return {
            nomor: s.nomor,
            jumlahAyat: s.jumlahAyat,
            namaLatin: latin,
            variants: [...variants]
        };
    });
    
    console.log("Scanning all hadiths with aggressive pattern matching...");
    
    const globalMappingSurah = {};
    const globalMappingAyat = {};
    
    for (const s of surahs) {
        globalMappingSurah[s.nomor] = [];
    }
    
    let totalMatches = 0;
    let totalAyatMatches = 0;
    
    for (const book of allBooks) {
        let bookMatches = 0;
        
        for (const h of book.data.items) {
            const text = h.id ? h.id.toLowerCase().replace(/[''`]/g, '') : "";
            if (!text || text.length < 20) continue;
            
            for (const s of surahVariants) {
                let foundSurah = false;
                let matchedVariant = '';
                
                for (const variant of s.variants) {
                    // Check multiple patterns:
                    // 1. "surat X" / "surah X"
                    // 2. "qs. X" / "qs X" / "(qs. X" / "(qs X"
                    // 3. "X: <number>" (direct surah reference)
                    // 4. Just the surah name if it's specific enough (>5 chars)
                    
                    const patterns = [
                        `surat ${variant}`,
                        `surah ${variant}`,
                        `qs. ${variant}`,
                        `qs ${variant}`,
                        `(qs. ${variant}`,
                        `(qs ${variant}`,
                        `q.s. ${variant}`,
                        `q.s ${variant}`,
                    ];
                    
                    // Hapus standalone match karena menyebabkan false positive yang sangat parah 
                    // (contoh: kata "muhammad" ada di hampir seluruh hadist, membuat file 47.json bengkak jadi 31MB!)
                    
                    for (const pat of patterns) {
                        if (text.includes(pat)) {
                            foundSurah = true;
                            matchedVariant = variant;
                            break;
                        }
                    }
                    if (foundSurah) break;
                }
                
                if (foundSurah) {
                    globalMappingSurah[s.nomor].push({ p: book.name, n: h.number, ar: h.arab, trj: h.id });
                    bookMatches++;
                    totalMatches++;
                    
                    // Extract ayat numbers
                    const ayatsFound = new Set();
                    
                    // Pattern: "(Qs. Al Baqarah: 159-160)" or "(QS. 2: 159)"
                    const refPatterns = [
                        /(?:qs\.?|q\.s\.?|surat|surah)\s*[\w\s\-']+?[:\s]+(\d+)(?:\s*[-–]\s*(\d+))?/gi,
                        /ayat\s+(?:ke\s*)?(\d+)(?:\s*[-–]\s*(\d+))?/gi,
                        /\(\s*(?:qs\.?|q\.s\.?)?\s*[\w\s\-']+?:\s*(\d+)(?:\s*[-–]\s*(\d+))?\s*\)/gi,
                        /\[\s*[\w\s\-']+?:\s*(\d+)(?:\s*[-–]\s*(\d+))?\s*\]/gi,
                    ];
                    
                    for (const rp of refPatterns) {
                        let m;
                        rp.lastIndex = 0;
                        while ((m = rp.exec(text)) !== null) {
                            const start = parseInt(m[1]);
                            const end = m[2] ? parseInt(m[2]) : start;
                            
                            for (let a = start; a <= Math.min(end, start + 20); a++) {
                                if (a > 0 && a <= s.jumlahAyat) {
                                    ayatsFound.add(a);
                                }
                            }
                        }
                    }
                    
                    // Also extract standalone numbers after colon
                    const colonNums = text.match(/:\s*(\d+)/g);
                    if (colonNums) {
                        for (const cn of colonNums) {
                            const num = parseInt(cn.match(/\d+/)[0]);
                            if (num > 0 && num <= s.jumlahAyat && num <= 300) {
                                ayatsFound.add(num);
                            }
                        }
                    }
                    
                    for (const aNum of ayatsFound) {
                        const key = `${s.nomor}:${aNum}`;
                        if (!globalMappingAyat[key]) globalMappingAyat[key] = [];
                        // Prevent duplicates
                        const exists = globalMappingAyat[key].some(x => x.p === book.name && x.n === h.number);
                        if (!exists) {
                            globalMappingAyat[key].push({ p: book.name, n: h.number, ar: h.arab, trj: h.id });
                            totalAyatMatches++;
                        }
                    }
                }
            }
        }
        
        console.log(`  ${book.name}: ${bookMatches} matches found`);
    }
    
    console.log(`\nTotal surah-level matches: ${totalMatches}`);
    console.log(`Total ayat-level matches: ${totalAyatMatches}`);
    console.log(`Unique ayat keys: ${Object.keys(globalMappingAyat).length}`);
    
    // Save to tafsir files
    console.log("\nSaving mappings to tafsir files...");
    for (const s of surahs) {
        const tFile = path.join(tafsirDir, `${s.nomor}.json`);
        if (fs.existsSync(tFile)) {
            const tData = JSON.parse(fs.readFileSync(tFile, 'utf8'));
            
            // Deduplicate surah mappings
            const seen = new Set();
            tData.mapping_surah = (globalMappingSurah[s.nomor] || []).filter(x => {
                const key = `${x.p}-${x.n}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
            
            tData.mapping_ayat = {};
            for (let i = 1; i <= s.jumlahAyat; i++) {
                const key = `${s.nomor}:${i}`;
                if (globalMappingAyat[key]) {
                    tData.mapping_ayat[key] = globalMappingAyat[key];
                }
            }
            
            fs.writeFileSync(tFile, JSON.stringify(tData));
        }
    }
    
    console.log("\n=== ALL DONE! ===");
    console.log(`Asbab Al-Nuzul: ${successCount} surahs enriched`);
    console.log(`Hadist mapping: ${totalMatches} surah-level, ${totalAyatMatches} ayat-level`);
}

main().catch(e => console.error("FATAL:", e));
