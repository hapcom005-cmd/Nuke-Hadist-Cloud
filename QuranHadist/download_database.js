const fs = require('fs');
const https = require('https');

const BASE_DIR = "c:\\Users\\Irwan Fahr\\Desktop\\QuranHadist";
const API_QURAN = "https://equran.id/api/v2/surat";
const API_HADITH = "https://hadis-api-id.vercel.app/hadith";

const PERAWI = [
    {slug:'bukhari', name:'Bukhari'},
    {slug:'muslim', name:'Muslim'},
    {slug:'abu-dawud', name:'Abu Dawud'},
    {slug:'tirmidzi', name:'Tirmidzi'},
    {slug:'nasai', name:"Nasa'i"},
    {slug:'ibnu-majah', name:'Ibnu Majah'},
    {slug:'ahmad', name:'Ahmad'},
    {slug:'darimi', name:'Darimi'},
    {slug:'malik', name:'Malik'}
];

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
            });
        }).on('error', reject);
    });
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadQuran() {
    console.log("========================================");
    console.log("  MENGUNDUH 114 SURAH AL-QURAN...");
    console.log("========================================");
    let allSurah = [];
    
    for (let i = 1; i <= 114; i++) {
        try {
            const data = await fetchJson(`${API_QURAN}/${i}`);
            if (data.code === 200) {
                const s = data.data;
                const surah = {
                    nomor: s.nomor, nama: s.nama, namaLatin: s.namaLatin,
                    arti: s.arti, tempatTurun: s.tempatTurun, jumlahAyat: s.jumlahAyat,
                    audioFull: s.audioFull ? s.audioFull["05"] : "",
                    ayat: s.ayat.map(a => ({
                        nomorAyat: a.nomorAyat, teksArab: a.teksArab,
                        teksLatin: a.teksLatin, teksIndonesia: a.teksIndonesia,
                        audio: a.audio ? a.audio["05"] : ""
                    }))
                };
                allSurah.push(surah);
                console.log(`  [OK] Surah ${i}/114: ${s.namaLatin}`);
            }
        } catch (e) {
            console.log(`  [ERROR] Gagal surah ${i}: ${e.message}`);
        }
        await delay(150); // Jeda agar tidak diblokir
    }
    
    const content = `const QURAN_DATA = ${JSON.stringify(allSurah)};`;
    fs.writeFileSync(`${BASE_DIR}\\quran_data.js`, content, 'utf8');
    console.log("\n✅ AL-QURAN SELESAI!");
}

async function downloadHadith() {
    console.log("\n========================================");
    console.log("  MENGUNDUH HADIST DARI 9 KITAB PERAWI...");
    console.log("========================================");
    
    let allHadist = {};
    
    for (const p of PERAWI) {
        console.log(`\n📚 Mengunduh Kitab ${p.name}...`);
        let items = [];
        let page = 1;
        let limit = 300;
        let hasMore = true;
        
        while (hasMore) {
            try {
                const data = await fetchJson(`${API_HADITH}/${p.slug}?page=${page}&limit=${limit}`);
                if (data.items && data.items.length > 0) {
                    const mapped = data.items.map(h => ({
                        number: h.number, arab: h.arab, id: h.id
                    }));
                    items.push(...mapped);
                    console.log(`  [OK] Halaman ${page}: +${data.items.length} hadist (Total: ${items.length})`);
                    
                    if (data.items.length < limit) {
                        hasMore = false;
                    } else {
                        page++;
                        await delay(300);
                    }
                } else {
                    hasMore = false;
                }
            } catch (e) {
                console.log(`  [ERROR] Gagal halaman ${page}: ${e.message}`);
                hasMore = false;
            }
        }
        allHadist[p.slug] = { name: p.name, total: items.length, items: items };
        console.log(`  ✅ ${p.name}: ${items.length} hadist diunduh!`);
    }
    
    const content = `const HADIST_DATA = ${JSON.stringify(allHadist)};`;
    fs.writeFileSync(`${BASE_DIR}\\hadist_data.js`, content, 'utf8');
    console.log("\n✅ HADIST SELESAI!");
}

async function main() {
    await downloadQuran();
    await downloadHadith();
    console.log("\n========================================");
    console.log("  ✅ SEMUA DATA BERHASIL DIUNDUH LOKAL!");
    console.log("========================================");
}

main();
