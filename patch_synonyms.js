const fs = require('fs');
const files_to_patch = [
    'c:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/HAPCOM_Premium.html',
    'c:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/index.html',
    'c:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/index_premium.html',
    'c:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/build_ui_premium_v3.js'
];

for (let file of files_to_patch) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        let oldStr = `const isArabic = /[\\u0600-\\u06FF]/.test(kw);`;
        let newStr = `// Interceptor Kamus Satelit (Mengubah bahasa gaul ke bahasa baku API)
            let searchKw = kw;
            const kamusSatelit = { "setan": "syaitan", "solat": "shalat", "sholat": "shalat", "neraka": "neraka" };
            if (kamusSatelit[searchKw]) { searchKw = kamusSatelit[searchKw]; }
            
            const isArabic = /[\\u0600-\\u06FF]/.test(searchKw);`;
            
        let oldStr2 = `fetch(\`https://api.alquran.cloud/v1/search/\${encodeURIComponent(kw)}/all/\${edition}\`);`;
        let newStr2 = `fetch(\`https://api.alquran.cloud/v1/search/\${encodeURIComponent(searchKw)}/all/\${edition}\`);`;
        
        // Also update highlight kws to highlight both
        let oldStr3 = `let kws = [kw]; // Simple array for highlight`;
        let newStr3 = `let kws = [kw, searchKw]; // Array for highlight`;
        
        content = content.replace(oldStr, newStr);
        content = content.replace(oldStr2, newStr2);
        content = content.replace(oldStr3, newStr3);
        
        fs.writeFileSync(file, content, 'utf8');
        console.log("Patched " + file);
    }
}
