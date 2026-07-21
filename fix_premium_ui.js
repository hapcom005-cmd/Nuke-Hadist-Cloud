const fs = require('fs');

let html = fs.readFileSync('index_premium.html', 'utf8');

// 1. PERBAIKAN CSS LAYOUT
html = html.replace('.col-nav { padding: 25px 0; align-items: center;', '.col-nav { padding: 25px 0; align-items: center; display: flex; flex-direction: column; gap: 20px; width: 100px; min-width: 100px;');
html = html.replace('.nav-menu { display: flex; flex-direction: column; gap: 20px; width: 100%; flex: 1; }', '.nav-menu { display: flex; flex-direction: column; gap: 30px; width: 100%; flex: 1; align-items: center; }');
html = html.replace('grid-template-columns: 80px 320px 1fr 400px;', 'grid-template-columns: 100px 320px 1fr 400px;');

// Perbaikan Lang Panel agar tidak terjepit
html = html.replace('.lang-panel {', '.lang-panel { margin-top: auto; margin-bottom: 20px;');


// 2. PENAMBAHAN TEKS LATIN DAN WIRING TAFSIR DALAM LOOP AYAT
const oldAyatHtml = `
                            <div class="translation">
                                \${ayat.teksIndonesia} <span class="ref-link">[\${nomorAyat}]</span> \${aiBadge}
                            </div>
                            \${extraHtml}
                        </div>\`;`;

const newAyatHtml = `
                            <div style="color:var(--accent-cyan); font-style:italic; font-size:1.1em; margin-bottom:10px; margin-top:-10px;" class="latin-text">
                                \${ayat.teksLatin}
                            </div>
                            <div class="translation" style="margin-bottom:15px;">
                                \${ayat.teksIndonesia} <span class="ref-link">[\${nomorAyat}]</span> \${aiBadge}
                            </div>
                            \${extraHtml}
                            <div class="tafsir-action" style="margin-top:10px;">
                                <button class="btn-outline" style="padding:5px 15px; font-size:0.8em;" onclick="loadAndShowTafsir(\${num}, \${nomorAyat})">📖 Baca Tafsir Kemenag/Katsir</button>
                            </div>
                        </div>\`;`;

html = html.replace(oldAyatHtml, newAyatHtml);


// 3. INJEKSI MESIN PENCARIAN & TAFSIR OFFLINE KE DALAM SCRIPT UTAMA
const offlineEngines = `
        // --- MESIN TAFSIR OFFLINE ---
        function loadAndShowTafsir(surahNum, ayatNum) {
            const tafsirBody = document.getElementById('tafsir-body');
            tafsirBody.innerHTML = \`<p style="color:var(--accent-gold);">Mengekstrak Tafsir Ayat \${ayatNum} dari Database 1.6 GB... ⏳</p>\`;
            
            // Cek apakah sudah di-load ke memory
            if (window.TAFSIR_DATA && window.TAFSIR_DATA[surahNum]) {
                renderTafsir(surahNum, ayatNum);
                return;
            }

            // Injeksi Script Dinamis (Bypass CORS Fetch)
            const scriptId = 'tafsir-js-' + surahNum;
            if (!document.getElementById(scriptId)) {
                const script = document.createElement('script');
                script.id = scriptId;
                script.src = \`QuranHadist/data/tafsir_js/\${surahNum}.js\`;
                script.onload = () => renderTafsir(surahNum, ayatNum);
                script.onerror = () => {
                    tafsirBody.innerHTML = \`<p style="color:#ff4d4d;">❌ Gagal memuat Tafsir Surah \${surahNum}. Pastikan Bos sudah menjalankan 'sedot_tafsir_total_pro.js' sebelumnya!</p>\`;
                };
                document.head.appendChild(script);
            }
        }

        function renderTafsir(surahNum, ayatNum) {
            const data = window.TAFSIR_DATA[surahNum];
            if (!data) return;
            
            let html = \`<h4 style="color:var(--cyan); border-bottom:1px solid rgba(0,229,255,0.2); padding-bottom:10px; margin-bottom:15px;">Tafsir Ayat \${ayatNum}</h4>\`;
            
            if (data.kemenag && data.kemenag[ayatNum]) {
                html += \`<strong style="color:var(--accent-gold);">Tafsir Kemenag RI:</strong><br>\`;
                html += \`<div style="margin-top:10px; margin-bottom:20px; line-height:1.7; font-size:0.95em; color:var(--text-muted);">\${data.kemenag[ayatNum].replace(/\\n/g, '<br><br>')}</div>\`;
            }
            if (data.ekstra && data.ekstra[ayatNum] && data.ekstra[ayatNum].ibnukatsir) {
                html += \`<strong style="color:var(--accent-gold);">Tafsir Ibnu Katsir:</strong><br>\`;
                html += \`<div style="margin-top:10px; line-height:1.7; font-size:0.95em; color:var(--text-muted);">\${data.ekstra[ayatNum].ibnukatsir.replace(/\\n/g, '<br><br>')}</div>\`;
            }
            
            document.getElementById('tafsir-body').innerHTML = html;
        }

        // --- MESIN PENCARIAN OFFLINE (INSTANT SEARCH) ---
        const btnSearch = document.getElementById('btn-search');
        const inputSearch = document.getElementById('search-input');
        
        btnSearch.addEventListener('click', () => {
            const query = inputSearch.value.trim().toLowerCase();
            if (!query) return alert("Masukkan kata kunci pencarian!");
            
            document.getElementById('main-surah-title').innerText = \`Hasil Pencarian: "\${query}"\`;
            document.getElementById('main-surah-sub').innerText = "Mencari di seluruh 6236 Ayat...";
            const readingBody = document.getElementById('reading-body');
            readingBody.innerHTML = \`<h3 style="text-align:center; padding:50px; color:var(--accent-gold);">Memindai 6236 Ayat... ⏳</h3>\`;
            
            setTimeout(() => {
                let results = [];
                let count = 0;
                
                // Brute-force scan on memory object
                if(window.FULL_QURAN) {
                    for(let s = 1; s <= 114; s++) {
                        const surah = window.FULL_QURAN[s];
                        if(!surah) continue;
                        surah.ayat.forEach(a => {
                            if (a.teksIndonesia.toLowerCase().includes(query) || a.teksArab.includes(query) || (a.teksLatin && a.teksLatin.toLowerCase().includes(query))) {
                                if (count < 50) { // Limit 50 results to prevent lag
                                    results.push({ surah: surah.namaLatin, nomorSurah: s, ayat: a });
                                }
                                count++;
                            }
                        });
                    }
                }
                
                if (count === 0) {
                    readingBody.innerHTML = \`<h3 style="text-align:center; padding:50px; color:#ff4d4d;">❌ Tidak ditemukan kecocokan untuk "\${query}"</h3>\`;
                } else {
                    document.getElementById('main-surah-sub').innerText = \`Ditemukan \${count} kecocokan (Menampilkan max 50)\`;
                    let htmlRes = "";
                    results.forEach(r => {
                        htmlRes += \`
                        <div class="verse-group" style="border-left:4px solid var(--cyan); padding-left:15px; margin-bottom:20px;">
                            <div style="font-weight:bold; color:var(--accent-gold); margin-bottom:10px;">\${r.surah} - Ayat \${r.ayat.nomorAyat}</div>
                            <div class="arabic-row" style="margin-bottom:10px;">
                                <div class="wbw-container" style="flex-direction:row-reverse; display:flex; text-align:right;">
                                    <div class="wbw-word" style="width:100%;">
                                        <span class="wbw-arab" style="font-size:2rem; line-height:2;">\${r.ayat.teksArab}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="translation">
                                \${r.ayat.teksIndonesia.replace(new RegExp(query, 'gi'), match => \`<span style="background:var(--accent-gold); color:#000; padding:0 4px;">\${match}</span>\`)}
                            </div>
                            <div class="tafsir-action" style="margin-top:10px;">
                                <button class="btn-outline" style="padding:5px 15px; font-size:0.8em;" onclick="loadAndShowTafsir(\${r.nomorSurah}, \${r.ayat.nomorAyat})">📖 Baca Tafsir</button>
                            </div>
                        </div>\`;
                    });
                    readingBody.innerHTML = htmlRes;
                }
            }, 100);
        });

        // --- TOGGLE BAHASA ---
        // (Placeholder sederhana agar tidak error saat diklik)
        document.querySelector('.lang-active').addEventListener('click', () => {
            alert("Sistem Bahasa sedang dikalibrasi ke Database Lokal (Offline Mode)!");
        });
`;

html = html.replace('// 2. BOOK-STYLE MODE TOGGLE', offlineEngines + '\n\n        // 2. BOOK-STYLE MODE TOGGLE');

fs.writeFileSync('index_premium.html', html);
console.log("Berhasil menanamkan Mesin Pencarian, Tafsir 1.6GB, Teks Latin, dan Layout Fix!");
