const fs = require('fs');
const path = require('path');
const targetFile = path.join(__dirname, 'HAPCOM_Premium.html');
let html = fs.readFileSync(targetFile, 'utf8');

// Arahkan tombol CARI INSTAN ke Mesin Nova
html = html.replace(/onclick="doSearch\(\)"/g, 'onclick="doSmartDirectSearch(document.getElementById(\'searchInput\').value)"');

// Jika masih ada sisa onkeydown yang memanggil doSearch, ganti ke doSmartDirectSearch
html = html.replace(/if\(event\.key==='Enter'\) doSearch\(\)/g, "if(event.key==='Enter') doSmartDirectSearch(this.value)");

fs.writeFileSync(targetFile, html);
console.log('Semua jalur pencarian sudah diarahkan ke Mesin Nova (Offline)!');
