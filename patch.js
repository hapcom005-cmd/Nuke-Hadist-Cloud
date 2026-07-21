const fs = require('fs');
let html = fs.readFileSync('c:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/index_premium.html', 'utf8');
const startMatch = '        async function searchQuran(raw) {';
const endMatch = '            function hl(text, keywords) {';
const startIndex = html.indexOf(startMatch);
const endIndex = html.indexOf(endMatch);
if (startIndex === -1 || endIndex === -1) throw new Error('Not found');

const newCode = `        async function searchQuran(raw) {
            DOM.rtTitle.innerText = \`Mencari: "\${raw}"\`;
            DOM.rtSubtitle.innerText = "Deep Scan Al-Quran...";
            
            if(!window.QURAN_SURAH || !window.QURAN_SURAH[114]) {
                DOM.ayatContainer.innerHTML = '<div class="loading-state"><h2>🚀 Menarik Data Super Ringan...</h2><p>Memuat Teks Al-Quran (HANYA 3.9 MB) ke RAM HP Anda...</p></div>';
                try {
                    await loadScript('QuranHadist/data/quran_all.js');
                    if(typeof KAMUS_AJAIB_PRO === 'undefined') {
                        await loadScript('QuranHadist/kamus_ajaib_pro.js').catch(e=>{});
                    }
                } catch(e) {
                    console.error(e);
                    DOM.ayatContainer.innerHTML = '<div style="color:red; padding:20px;">Gagal memuat teks Al-Quran. Pastikan file quran_all.js tersedia!</div>';
                    return;
                }
            }
            
            const kws = extractKW(raw);
            if(kws.length === 0) {
                DOM.ayatContainer.innerHTML = '<div style="padding:30px; text-align:center;"><h2 style="color:var(--text-muted)">Kata kunci terlalu umum atau diabaikan</h2></div>';
                return;
            }
            
            DOM.ayatContainer.innerHTML = '<div class="loading-state"><h2>⚡ Memindai 6.236 Ayat...</h2><p>Mencocokkan kata kunci secara Deep Scan...</p></div>';
            await new Promise(r => setTimeout(r, 50));

            let quranMatches = [];
            let totalFoundWords = {};
            
            for(let s=1; s<=114; s++) {
                const surah = window.QURAN_SURAH[s];
                if(!surah) continue;
                const surahMeta = metaData ? metaData.find(x => x.nomor == s) : { nomor: s, nama: surah.nama, englishName: surah.namaLatin };
                
                for(let i=0; i<surah.ayat.length; i++) {
                    const ayat = surah.ayat[i];
                    let textToSearch = ((ayat.teksIndonesia || "") + " " + (ayat.teksArab || "")).toLowerCase();
                    textToSearch = textToSearch.replace(/[ؗ-ًؚ-ْۖ-ۜ۟-۪ۨ-ۭ]/g, '');
                    
                    let matchAll = true;
                    for(let kw of kws) {
                        if(textToSearch.indexOf(kw) === -1) {
                            matchAll = false;
                            break;
                        } else {
                            totalFoundWords[kw] = (totalFoundWords[kw] || 0) + 1;
                        }
                    }
                    
                    if(matchAll) {
                        quranMatches.push({
                            score: 1,
                            surah: { number: surahMeta.nomor, name: surahMeta.nama, englishName: surahMeta.namaLatin },
                            numberInSurah: ayat.nomorAyat, text: ayat.teksIndonesia, teksArab: ayat.teksArab, teksLatin: ayat.teksLatin
                        });
                    }
                }
            }
            
            if(quranMatches.length === 0) {
                DOM.ayatContainer.innerHTML = \`<div style="padding:30px; text-align:center;"><h2 style="color:var(--text-muted)">Tidak ditemukan hasil untuk "\${raw}"</h2></div>\`;
                return;
            }
            
            const total = quranMatches.length;
            quranMatches = quranMatches.slice(0, 50);

            let infoLog = \`<div style="background:var(--bg-panel); padding:20px; border-radius:12px; margin-bottom:20px; border:1px solid var(--border-color);">
                <h3 style="color:var(--accent-gold); margin-bottom:10px;">⚡ Deep Scan Al-Quran Aktif! Menemukan \${total} Ayat (Menampilkan 50 Teratas).</h3>\`;
                
            kws.forEach(kw => {
                infoLog += \`<div style="color:var(--text-main); font-size:14px; margin-bottom:5px;">Kata <strong>"\${kw}"</strong> terdeteksi dalam pencarian.\`;
                if (typeof KAMUS_AJAIB_PRO !== 'undefined' && KAMUS_AJAIB_PRO[kw]) {
                    const k = KAMUS_AJAIB_PRO[kw];
                    infoLog += \`<div style="color:var(--accent-cyan); margin-top:4px; padding-left:12px; border-left:2px solid var(--accent-cyan);">↳ Bentuk Arab: <strong>"\${k.arab}"</strong> (Di Al-Quran muncul \${k.count} kali).</div>\`;
                }
                infoLog += \`</div>\`;
            });
            infoLog += \`<div style="color:var(--text-muted); font-size:12px; margin-top:10px;">*(Tafsir & Hadist terkait dapat dilihat dengan mengklik ayat)*</div></div>\`;

            const surahGroups = {};
            quranMatches.forEach(m => {
                const key = m.surah.englishName;
                if (!surahGroups[key]) surahGroups[key] = { surah: m.surah, ayat: [] };
                surahGroups[key].ayat.push(m);
            });

            let mapHTML = \`<div style="background:var(--bg-panel); padding:20px; border-radius:12px; margin-bottom:30px; border:1px solid var(--border-color);">
                <h3 style="color:var(--accent-gold); margin-bottom:15px;">🗺️ PETA NAVIGASI (Klik Melompat)</h3>
                <div style="display:flex; flex-wrap:wrap; gap:10px;">\`;
                
            Object.entries(surahGroups).forEach(([name, g]) => {
                mapHTML += \`<button onclick="document.getElementById('surah_\${name.replace(/[^a-zA-Z]/g,'')}').scrollIntoView({behavior:'smooth'})" style="background:transparent; border:1px solid var(--border-active); color:var(--accent-gold); padding:8px 15px; border-radius:20px; cursor:pointer;">\${name} (\${g.ayat.length} ayat)</button>\`;
            });
            mapHTML += \`</div></div>\`;

            let resultsHTML = infoLog + mapHTML;
            
`;

fs.writeFileSync('c:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/index_premium.html', html.substring(0, startIndex) + newCode + html.substring(endIndex));
