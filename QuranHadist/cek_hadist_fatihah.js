const fs = require('fs');

console.log("Membaca database...");
const dataStr = fs.readFileSync('c:/Users/Irwan Fahr/Desktop/QuranHadist/hadist_data.js', 'utf8');
const jsonStr = dataStr.replace('const HADIST_DATA = ', '').replace(/;$/, '');
const db = JSON.parse(jsonStr);

let indoCount = 0;
let arabCount = 0;
let perawiStats = {};

Object.values(db).forEach(kitab => {
    kitab.items.forEach(h => {
        const textId = (h.id || '').toLowerCase();
        const textAr = (h.arab || '');
        
        let found = false;
        if (textId.includes('fatihah')) {
            indoCount++;
            found = true;
        }
        
        // Cek bahasa Arab: الفاتحة tanpa harakat
        const arabBersih = textAr.replace(/[\u0617-\u061A\u064B-\u0652]/g, "");
        if (arabBersih.includes('الفاتحة') || arabBersih.includes('فاتحة')) {
            arabCount++;
            found = true;
        }
        
        if (found) {
            perawiStats[kitab.name] = (perawiStats[kitab.name] || 0) + 1;
        }
    });
});

console.log("=== HASIL PENCARIAN AL-FATIHAH ===");
console.log("Jumlah hadist dengan ejaan Indonesia (fatihah): " + indoCount);
console.log("Jumlah hadist dengan ejaan Arab asli (الفاتحة): " + arabCount);
console.log("Rincian Perawi:");
console.table(perawiStats);
