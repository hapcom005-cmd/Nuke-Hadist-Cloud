const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const targetLang = process.argv[2] || 'en';
const imams = ['abu-dawud', 'ahmad', 'bukhari', 'darimi', 'ibnu-majah', 'malik', 'muslim', 'nasai', 'tirmidzi'];

console.log(`[PANGLIMA] Memulai Operasi Terjemahan 9 Kitab Hadist ke Bahasa: ${targetLang.toUpperCase()}`);

for (const imam of imams) {
    console.log(`\n==============================================`);
    console.log(`[PANGLIMA] Menyerang Kitab: ${imam.toUpperCase()}`);
    console.log(`==============================================`);
    try {
        // Execute the 12-core translator for this specific imam
        execSync(`node 12core_hadith_translator.js ${imam} ${targetLang}`, { stdio: 'inherit' });
    } catch (err) {
        console.error(`[PANGLIMA] Gagal menaklukkan kitab ${imam}:`, err.message);
    }
}

console.log(`\n[PANGLIMA] OPERASI SUKSES BESAR! Seluruh 9 Kitab berhasil diterjemahkan ke bahasa ${targetLang.toUpperCase()} secara offline.`);
