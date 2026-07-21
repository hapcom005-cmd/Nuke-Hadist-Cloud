const fs = require('fs');
let code = fs.readFileSync('build_ui_premium_v3.js', 'utf8');

// Replace Google Fonts Link
code = code.replace(
    /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Amiri:wght@400;700&display=swap" rel="stylesheet">/g,
    `<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Noto+Naskh+Arabic:wght@400;700&family=Scheherazade+New:wght@400;700&family=Lateef:wght@400;700&display=swap" rel="stylesheet">`
);

// Replace Font Options using backticks to avoid escaping hell
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

fs.writeFileSync('build_ui_premium_v3.js', code);
console.log('Replaced with Reliable Google Fonts!');
