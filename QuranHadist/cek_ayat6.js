const fs = require('fs');

const dataStr = fs.readFileSync('c:/Users/Irwan Fahr/Desktop/QuranHadist/hadist_data.js', 'utf8');
const jsonStr = dataStr.replace('const HADIST_DATA = ', '').replace(/;$/, '');
const db = JSON.parse(jsonStr);

let count = 0;
Object.values(db).forEach(kitab => {
    kitab.items.forEach(h => {
        const textAr = h.arab || '';
        const textId = h.id || '';
        const arabBersih = textAr.replace(/[\u0617-\u061A\u064B-\u0652]/g, "");
        
        // Ayat 6: Ihdinas siratal mustaqim
        if (arabBersih.includes('اهدنا الصراط المستقيم') || textId.toLowerCase().includes('tunjukilah kami jalan')) {
            console.log(`[${kitab.name} No. ${h.number}] Match found!`);
            count++;
        }
    });
});
console.log("Total found:", count);
