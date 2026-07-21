const fs = require('fs');
const path = require('path');

console.log("==================================================");
console.log("🕵️ DETEKTIF NOVA: PROTOKOL VERIFIKASI TRANSLASI");
console.log("==================================================");

const langsToCheck = ['en']; // Kita cek data Bahasa Inggris yang SUDAH SELESAI dari Mesin 12-Core sebelumnya!
const imam = 'bukhari';

langsToCheck.forEach(lang => {
    const filePath = path.join(__dirname, 'QuranHadist', 'data', 'hadist_lang', lang, `${imam}.json`);
    
    if (fs.existsSync(filePath)) {
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const items = data.items || data;
            
            if (items.length > 0) {
                const sample = items[0].id;
                console.log(`✅ [${lang.toUpperCase()}] File ada. Tersimpan ${items.length} riwayat.`);
                console.log(`   📝 Sampel Terjemahan (Hadist #1): "${sample.substring(0, 80)}..."`);
                
                // Pengecekan Kualitas (apakah kosong atau undefined?)
                if (sample === 'undefined' || sample === '' || sample === null) {
                    console.log(`   ❌ ERROR: Terjemahan KOSONG atau UNDEFINED!`);
                } else {
                    console.log(`   🔥 STATUS: AMAN & TERVERIFIKASI!`);
                }
            } else {
                console.log(`❌ [${lang.toUpperCase()}] ERROR: File terbuat tapi isinya KOSONG!`);
            }
        } catch (e) {
            console.log(`❌ [${lang.toUpperCase()}] ERROR: JSON Rusak/Corrupt!`);
        }
    } else {
        console.log(`⏳ [${lang.toUpperCase()}] Menunggu proses dari Mesin Nuke...`);
    }
});
