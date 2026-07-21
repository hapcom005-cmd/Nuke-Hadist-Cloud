const fs = require('fs');

const file1 = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
const file2 = fs.readFileSync('C:/Users/Irwan Fahr/Desktop/Data_Tidak_Terpakai/index_premium.html', 'utf8');

function extractPanduan(html) {
    const start = html.toLowerCase().indexOf('panduan');
    if (start === -1) return "Tidak ditemukan";
    return html.substring(start - 50, start + 300); // Ambil 350 karakter di sekitar kata "panduan"
}

console.log("=== HAPCOM_Premium.html ===");
console.log(extractPanduan(file1));

console.log("\n=== index_premium.html ===");
console.log(extractPanduan(file2));
