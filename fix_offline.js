const fs = require('fs');

let html = fs.readFileSync('index_premium.html', 'utf8');

// Tambahkan script di sebelah database_quran.js
html = html.replace('<script src="database_quran.js"></script>', 
                    '<script src="database_quran.js"></script>\n    <script src="full_quran_offline.js"></script>');

// Ganti blok try/catch fetch dengan pembacaan dari window.FULL_QURAN
const oldFetchBlock = `try {
                    // MENGAMBIL SELURUH AYAT DARI FILE JSON ASLI
                    const res = await fetch(\`QuranHadist/data/quran/\${num}.json\`);
                    if (!res.ok) throw new Error("Gagal mengambil data Surah");
                    const dataSurah = await res.json();`;

const newReadBlock = `try {
                    // MEMBACA DARI DATABASE OFFLINE MURNI (TANPA FETCH/CORS GOOGLE CHROME)
                    if (!window.FULL_QURAN || !window.FULL_QURAN[num]) throw new Error("Gagal memuat dari FULL_QURAN");
                    const dataSurah = window.FULL_QURAN[num];`;

html = html.replace(oldFetchBlock, newReadBlock);

fs.writeFileSync('index_premium.html', html);
console.log("Berhasil mengupdate index_premium.html untuk mode offline murni!");
