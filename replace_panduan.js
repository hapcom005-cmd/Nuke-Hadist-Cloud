const fs = require('fs');

const target = 'HAPCOM_Premium.html';
let html = fs.readFileSync(target, 'utf8');

const p1 = html.indexOf('function showPanduan() {');
const p2 = html.indexOf('}', p1 + 500);

const oldFunction = html.slice(p1, p2 + 1);

const newFunction = `function showPanduan() {
            DOM.rtTitle.innerText = "💡 Panduan Penggunaan HAPCOM";
            DOM.rtSubtitle.innerText = "Mesin Pencari O(1) Otak Nova (100% Offline)";
            
            DOM.ayatContainer.innerHTML = \`<div style="padding:40px; background:var(--bg-panel); border-radius:16px; border:1px solid var(--accent-gold); max-width:900px; margin:0 auto; line-height:1.8; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                
                <!-- Dedication Section -->
                <div style="background: linear-gradient(135deg, rgba(245,208,97,0.1), rgba(0,229,255,0.05)); border: 1px solid var(--accent-gold); border-radius: 12px; padding: 25px; margin-bottom: 30px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
                    <h3 style="color: var(--accent-gold); font-size: 1.4em; margin-bottom: 10px; font-weight: 800;">✨ Sebuah Dedikasi & Mahakarya ✨</h3>
                    <p style="color: var(--text-main); font-size: 1.1em; font-style: italic; margin-bottom: 15px;">Website ini dipersembahkan sebagai wujud bakti dari <strong>Irwan Fahruji, S.Kom.</strong> teruntuk kedua orang tua tercinta.</p>
                    <div style="width: 50px; height: 2px; background: var(--accent-cyan); margin: 0 auto 15px;"></div>
                    <p style="color: var(--text-muted); font-size: 1.05em; line-height: 1.6;">Dan didedikasikan bagi mereka di luar sana yang mencari ilmu data dengan kelengkapan mutlak: <strong>100+ Bahasa Terjemahan, 9 Kitab Hadist Utama, Asbabun Nuzul, Tafsir Kemenag & Jalalayn, dan Tajwid Warna.</strong></p>
                </div>

                <h2 style="color:var(--accent-gold); margin-bottom:20px; font-weight:800; font-size:28px;">🚀 Panduan Pencarian Tingkat Dewa</h2>
                <p style="font-size:1.1em; color:var(--text-main);">HAPCOM kini ditenagai oleh <strong>Mesin Otak Nova</strong> dengan arsitektur O(1) Hash Map yang 100% Offline & Anti-Lemot. Berikut keunggulannya:</p>
                
                <div style="margin-top:30px; background:rgba(0,0,0,0.2); padding:20px; border-radius:12px; border-left:4px solid var(--accent-cyan);">
                    <h3 style="color:var(--accent-cyan);">⚡ 1. Kecepatan Cahaya (Direct Map)</h3>
                    <p style="color:var(--text-muted);">Tidak perlu lagi menekan tombol enter! Begitu Anda mengetik 3 huruf, Mesin Nova langsung mengekstrak ribuan ayat dalam hitungan milidetik dari RAM (Index_v2).</p>
                </div>
                
                <div style="margin-top:20px; background:rgba(0,0,0,0.2); padding:20px; border-radius:12px; border-left:4px solid var(--accent-emerald);">
                    <h3 style="color:var(--accent-emerald);">🛡️ 2. Kebal Putus Internet (100% Offline)</h3>
                    <p style="color:var(--text-muted);">Satelit online sudah dipensiunkan! Seluruh pencarian murni ditarik dari database internal yang sangat efisien. Anda bisa mencari ayat bahkan di tengah hutan atau di atas pesawat tanpa sinyal.</p>
                </div>
                
                <div style="margin-top:20px; background:rgba(0,0,0,0.2); padding:20px; border-radius:12px; border-left:4px solid var(--accent-gold);">
                    <h3 style="color:var(--accent-gold);">🧠 3. Lazy Loading & Smart Cache</h3>
                    <p style="color:var(--text-muted);">Aplikasi hanya mengunduh data yang Anda minta saja. Data yang sudah dibuka akan dikunci ke dalam Cache browser, menjadikannya abadi dan 0 detik saat dibuka kembali.</p>
                </div>
                
                <div style="margin-top:40px; text-align:center;">
                    <p style="color:var(--border-active); font-style:italic;">"Direkayasa untuk kecepatan maksimum dan ketahanan abadi."</p>
                </div>
            </div>\`;
        }`;

html = html.replace(oldFunction, newFunction);
fs.writeFileSync(target, html);
console.log('Panduan berhasil direstorasi dan diupdate!');
