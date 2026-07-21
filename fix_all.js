const fs = require('fs');
let code = fs.readFileSync('build_ui_premium_v3.js', 'utf8');

// 1. Fix Hardcoded Amiri
code = code.replace(/font-family:'Amiri',serif/g, "font-family:var(--font-arabic, 'Amiri'),serif");
code = code.replace(/font-family:'Amiri'/g, "font-family:var(--font-arabic, 'Amiri')");

// 2. Fix Font Options (Google Fonts)
code = code.replace(
    /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Amiri:wght@400;700&display=swap" rel="stylesheet">/g,
    `<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Noto+Naskh+Arabic:wght@400;700&family=Scheherazade+New:wght@400;700&family=Lateef:wght@400;700&display=swap" rel="stylesheet">`
);
code = code.replace(
    /<option value="'LPMQ Isep Misbah', sans-serif">LPMQ Isep Misbah \(Kemenag RI\)<\/option>/g,
    `<option value="'Noto Naskh Arabic', serif">Noto Naskh (Mirip Madinah)</option>`
);
code = code.replace(
    /<option value="'KFGQPC Uthman Taha Naskh', sans-serif">Uthmani \(Madinah\)<\/option>/g,
    `<option value="'Scheherazade New', serif">Scheherazade (Uthmani Klasik)</option>`
);
code = code.replace(
    /<option value="'Me Quran', sans-serif">Me Quran<\/option>/g,
    `<option value="'Lateef', serif">Lateef (Gaya Kaligrafi)</option>`
);

// 3. Fix Tajwid/Perkata Bug (Add missing ID)
code = code.replace(
    /<div class="notranslate" style="font-family:var\(--font-arabic, 'Amiri'\); font-size:36px; line-height:2; text-align:right; margin-bottom:20px; color:var\(--accent-gold\);">\$\{a\.teksArab\}<\/div>/g,
    `<div id="text-arab-\${a.nomorAyat}" class="notranslate" style="font-family:var(--font-arabic, 'Amiri'); font-size:36px; line-height:2; text-align:right; margin-bottom:20px; color:var(--accent-gold);">\${a.teksArab}</div>`
);

fs.writeFileSync('build_ui_premium_v3.js', code);
console.log('ALL BUGS FIXED!');
