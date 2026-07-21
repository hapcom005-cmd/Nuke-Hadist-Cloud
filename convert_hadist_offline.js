const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'QuranHadist', 'data', 'hadist');
const destDir = path.join(__dirname, 'QuranHadist', 'data', 'hadist_js');

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file.replace('.json', '.js'));
    const content = fs.readFileSync(srcPath, 'utf8');
    const name = file.replace('.json', '');
    
    if (file === 'meta.json') {
        const out = `window.HADITH_META = ${content};`;
        fs.writeFileSync(destPath, out);
    } else {
        const out = `window.GLOBAL_HADITH = window.GLOBAL_HADITH || {};\nwindow.GLOBAL_HADITH['${name}'] = ${content};`;
        fs.writeFileSync(destPath, out);
    }
    console.log(`Berhasil mengkonversi ${file} ke JS offline.`);
});

console.log("Konversi 9 Imam Hadist ke JS Offline selesai!");
