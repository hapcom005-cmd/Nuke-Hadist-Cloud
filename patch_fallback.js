const fs = require('fs');
const files = [
    'c:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/HAPCOM_Premium.html',
    'c:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/index.html',
    'c:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/index_premium.html',
    'c:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/build_ui_premium_v3.js'
];

for (let file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        const oldCatch = `            } catch(e) {
                console.error(e);
                DOM.ayatContainer.innerHTML = '<div style="color:red; padding:20px; text-align:center;"><h3>⚠️ Koneksi Satelit Gagal</h3><p>Pastikan koneksi internet aktif untuk pencarian instan online.</p></div>';
                return;
            }`;

        const newCatch = `            } catch(e) {
                console.warn("API Satelit Gagal, beralih ke Mode Offline Deep Scan...");
                DOM.ayatContainer.innerHTML = '<div class="loading-state"><h2>🛡️ Satelit Offline, Mengaktifkan Deep Scan...</h2><p>Memuat Database Cadangan Lokal (3.9MB)...</p></div>';
                
                try {
                    if(!window.QURAN_SURAH || !window.QURAN_SURAH[114]) {
                        await loadScript('QuranHadist/data/quran_all.js');
                    }
                    
                    let quranMatchesOffline = [];
                    for(let s=1; s<=114; s++) {
                        let surah = window.QURAN_SURAH[s];
                        if(!surah) continue;
                        let surahMeta = metaData.find(x => x.nomor == s);
                        surah.ayat.forEach(a => {
                            let text = (isArabic ? a.teksArab : a.teksIndonesia).toLowerCase();
                            if(text.includes(searchKw)) {
                                quranMatchesOffline.push({
                                    score: 1,
                                    surah: { number: surahMeta.nomor, name: surahMeta.nama, englishName: surahMeta.namaLatin },
                                    numberInSurah: a.nomorAyat, text: a.teksIndonesia, teksArab: a.teksArab, teksLatin: a.teksLatin
                                });
                            }
                        });
                    }
                    
                    if(quranMatchesOffline.length === 0) {
                        DOM.ayatContainer.innerHTML = \`<div style="padding:30px; text-align:center;"><h2 style="color:var(--text-muted)">Tidak ditemukan hasil untuk "\${raw}" di database lokal</h2></div>\`;
                        return;
                    }
                    
                    total = quranMatchesOffline.length;
                    quranMatches = quranMatchesOffline;
                    
                } catch(err) {
                    DOM.ayatContainer.innerHTML = '<div style="color:red; padding:20px; text-align:center;"><h3>⚠️ Kegagalan Sistem Total</h3><p>Satelit mati dan Data Cadangan Lokal (quran_all.js) tidak ditemukan.</p></div>';
                    return;
                }
            }`;
            
        // Because of formatting, string replacement might fail. Let's use regex.
        let pattern = /            } catch\(e\) \{\s+console\.error\(e\);\s+DOM\.ayatContainer\.innerHTML = '<div style="color:red; padding:20px; text-align:center;"><h3>⚠️ Koneksi Satelit Gagal.*?return;\s+\}/s;
        
        if (pattern.test(content)) {
            content = content.replace(pattern, newCatch);
            fs.writeFileSync(file, content, 'utf8');
            console.log("Patched fallback in " + file);
        } else {
            console.log("Catch block not found in " + file);
        }
    }
}
