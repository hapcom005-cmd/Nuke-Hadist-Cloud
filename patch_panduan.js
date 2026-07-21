const fs = require('fs');
const files = [
    'c:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/HAPCOM_Premium.html',
    'c:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/index.html',
    'c:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/index_premium.html',
    'c:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/build_ui_premium_v3.js'
];

const panduanFunction = `
        function showPanduan() {
            DOM.rtTitle.innerText = "💡 Panduan Penggunaan HAPCOM";
            DOM.rtSubtitle.innerText = "Mesin Pencari Hibrida (Satelit & Offline)";
            
            DOM.ayatContainer.innerHTML = \`<div style="padding:40px; background:var(--bg-panel); border-radius:16px; border:1px solid var(--accent-gold); max-width:900px; margin:0 auto; line-height:1.8; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <h2 style="color:var(--accent-gold); margin-bottom:20px; font-weight:800; font-size:28px;">🚀 Panduan Pencarian Tingkat Dewa</h2>
                <p style="font-size:1.1em; color:var(--text-main);">HAPCOM dilengkapi dengan Arsitektur Mesin Pencari Hibrida yang super hemat kuota dan kebal-offline. Berikut cara kerjanya:</p>
                
                <div style="margin-top:30px; background:rgba(0,0,0,0.2); padding:20px; border-radius:12px; border-left:4px solid var(--accent-cyan);">
                    <h3 style="color:var(--accent-cyan);">🛰️ 1. Pencarian API Satelit (Online First)</h3>
                    <p style="color:var(--text-muted);">Mesin akan otomatis menembak server Al-Quran internasional untuk mencari kata. Mesin HANYA mendownload surah spesifik yang memuat kata tersebut, bukan seluruh Al-Quran. Ini menghemat kuota hingga 99%!</p>
                </div>
                
                <div style="margin-top:20px; background:rgba(0,0,0,0.2); padding:20px; border-radius:12px; border-left:4px solid var(--accent-emerald);">
                    <h3 style="color:var(--accent-emerald);">🛡️ 2. Auto-Fallback (Kebal Offline)</h3>
                    <p style="color:var(--text-muted);">Jika internet Anda mati atau server Satelit tumbang, jangan khawatir! Mesin akan otomatis berubah wujud menjadi <strong>Deep Scan Lokal (Offline)</strong> yang mengekstrak data dari memori cadangan tanpa butuh sinyal sedikit pun.</p>
                </div>
                
                <div style="margin-top:20px; background:rgba(0,0,0,0.2); padding:20px; border-radius:12px; border-left:4px solid var(--accent-gold);">
                    <h3 style="color:var(--accent-gold);">🧠 3. Kamus Interceptor Cerdas</h3>
                    <p style="color:var(--text-muted);">Database internasional kadang menggunakan kata baku Kemenag. Sistem HAPCOM telah dilengkapi kecerdasan buatan untuk mengartikan bahasa Anda. Contoh: ketik <strong>"setan"</strong>, mesin otomatis akan meretas satelit untuk mencari kata <strong>"syaitan"</strong>.</p>
                </div>
                
                <div style="margin-top:40px; text-align:center;">
                    <p style="color:var(--border-active); font-style:italic;">"Direkayasa untuk kecepatan maksimum dan ketahanan abadi."</p>
                </div>
            </div>\`;
        }
`;

for (let file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Add onclick to Panduan button
        const oldBtn = `<button class="btn-outline"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/></svg> Panduan</button>`;
        const newBtn = `<button class="btn-outline" onclick="showPanduan()"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/></svg> Panduan</button>`;
        
        content = content.replace(oldBtn, newBtn);
        
        // Inject showPanduan function right before "// --- JUMP TO AYAT" or at the end of the script block
        if (!content.includes('function showPanduan()')) {
            let injectPos = content.indexOf('        // --- JUMP TO AYAT');
            if (injectPos !== -1) {
                content = content.substring(0, injectPos) + panduanFunction + '\n' + content.substring(injectPos);
            }
        }
        
        fs.writeFileSync(file, content, 'utf8');
        console.log("Patched Panduan in " + file);
    }
}
