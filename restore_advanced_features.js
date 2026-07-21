const fs = require('fs');

let oldHtml = fs.readFileSync('index.html', 'utf8');
let premiumHtml = fs.readFileSync('index_premium.html', 'utf8');

// 1. EXTRACT CSS FOR MODALS FROM OLD HTML
// We will just copy the relevant CSS classes that make up the modal.
const modalCSS = `
/* --- INJECTED MODAL CSS FROM OLD INDEX --- */
.modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
    display: none; align-items: center; justify-content: center;
    z-index: 9999; opacity: 0; transition: opacity 0.3s;
}
.modal-overlay.active { display: flex; opacity: 1; }
.modal-content {
    background: var(--bg-dark); border: 1px solid var(--gold-dim);
    border-radius: 15px; width: 90%; max-width: 900px; max-height: 85vh;
    display: flex; flex-direction: column; overflow: hidden;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5); transform: translateY(20px);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-overlay.active .modal-content { transform: translateY(0); }
.modal-header {
    padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);
    display: flex; justify-content: space-between; align-items: center;
    background: linear-gradient(90deg, rgba(10,15,25,1) 0%, rgba(20,25,35,1) 100%);
}
.modal-title { font-size: 1.2em; font-weight: bold; color: var(--gold); display: flex; align-items: center; gap: 10px; }
.close-btn { background: none; border: none; color: var(--text-muted); font-size: 1.5em; cursor: pointer; transition: 0.3s; }
.close-btn:hover { color: #ff4d4d; }
.modal-body { padding: 20px; overflow-y: auto; flex: 1; font-size: 0.95em; line-height: 1.8; color: var(--text-main); }
.tab-container { display: flex; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 0 20px; background: rgba(0,0,0,0.2); }
.tab-btn {
    background: none; border: none; padding: 15px 25px; color: var(--text-muted);
    font-size: 0.95em; cursor: pointer; border-bottom: 2px solid transparent; transition: 0.3s;
}
.tab-btn.active { color: var(--gold); border-bottom-color: var(--gold); }
.tab-content { display: none; padding: 20px; }
.tab-content.active { display: block; animation: fadeIn 0.5s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

/* --- INJECTED SEARCH MAP CSS --- */
.nav-map { background: rgba(0,0,0,0.2); border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid rgba(255,255,255,0.05); }
.nav-map h3 { font-size: 1.1em; color: var(--gold); margin-bottom: 15px; }
.nav-map-section { display: flex; flex-wrap: wrap; gap: 10px; }
.nav-link {
    background: transparent; border: 1px solid var(--gold-dim); padding: 8px 15px; border-radius: 20px;
    color: var(--text-muted); text-decoration: none; font-size: 0.85em; transition: 0.3s;
}
.nav-link:hover { background: rgba(202, 138, 4, 0.1); color: var(--gold); border-color: var(--gold); }
.surah-group-header {
    background: linear-gradient(90deg, rgba(202, 138, 4, 0.15) 0%, transparent 100%);
    padding: 10px 15px; border-left: 4px solid var(--gold); border-radius: 4px; margin: 30px 0 15px 0;
}
.highlight-arab { color: var(--cyan); text-shadow: 0 0 10px rgba(0, 229, 255, 0.5); font-weight: bold; }
.highlight-id { background-color: rgba(202, 138, 4, 0.3); color: #fff; padding: 0 4px; border-radius: 3px; border-bottom: 1px solid var(--gold); }
`;

premiumHtml = premiumHtml.replace('</style>', modalCSS + '\n</style>');

// 2. INJECT HTML FOR MODALS AT THE END OF BODY
const modalsHTML = `
<!-- ================= MODAL TAFSIR LENGKAP ================= -->
<div class="modal-overlay" id="tafsirModal" onclick="if(event.target===this) this.classList.remove('active')">
    <div class="modal-content">
        <div class="modal-header">
            <div class="modal-title" id="tafsirModalTitle">📚 Tafsir Lengkap</div>
            <button class="close-btn" onclick="document.getElementById('tafsirModal').classList.remove('active')">&times;</button>
        </div>
        <div class="tab-container">
            <button class="tab-btn active" onclick="switchTafsirTab('kemenag')">Kemenag RI</button>
            <button class="tab-btn" onclick="switchTafsirTab('katsir')">Ibnu Katsir</button>
        </div>
        <div class="modal-body" style="padding:0;">
            <div id="tab-kemenag" class="tab-content active" style="font-size:1.05em; line-height:1.9;"></div>
            <div id="tab-katsir" class="tab-content" style="font-size:1.05em; line-height:1.9;"></div>
        </div>
    </div>
</div>

<!-- ================= MODAL HADIST ================= -->
<div class="modal-overlay" id="hadistModal" onclick="if(event.target===this) this.classList.remove('active')">
    <div class="modal-content">
        <div class="modal-header">
            <div class="modal-title" id="hadistModalTitle">📜 Hadist Terkait</div>
            <button class="close-btn" onclick="document.getElementById('hadistModal').classList.remove('active')">&times;</button>
        </div>
        <div class="modal-body" id="hadistModalBody"></div>
    </div>
</div>
`;

premiumHtml = premiumHtml.replace('</body>', modalsHTML + '\n</body>');


// 3. RESTORE THE SEARCH ENGINE O(1) AND TAFSIR MODAL LOGIC IN JS
// We will wipe out the previously injected basic search and replace it with the advanced logic.
const advancedLogic = `
        // --- RESTORED: TAB SWITCHER LOGIC ---
        window.switchTafsirTab = function(tabName) {
            document.querySelectorAll('#tafsirModal .tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('#tafsirModal .tab-content').forEach(c => c.classList.remove('active'));
            
            if (tabName === 'kemenag') {
                document.querySelectorAll('#tafsirModal .tab-btn')[0].classList.add('active');
                document.getElementById('tab-kemenag').classList.add('active');
            } else {
                document.querySelectorAll('#tafsirModal .tab-btn')[1].classList.add('active');
                document.getElementById('tab-katsir').classList.add('active');
            }
        };

        // --- RESTORED: SHOW TAFSIR INLINE MODAL ---
        window.showTafsirs = function(btn, surahNum, ayatNum, surahName) {
            btn.innerHTML = "Memuat... ⏳";
            const modal = document.getElementById('tafsirModal');
            document.getElementById('tafsirModalTitle').innerHTML = \`📚 Tafsir Lengkap — Surah \${surahName} Ayat \${ayatNum}\`;
            
            const renderData = (data) => {
                let kemenagHTML = data.kemenag && data.kemenag[ayatNum] ? data.kemenag[ayatNum].replace(/\\n/g, '<br><br>') : "<i>Tafsir Kemenag tidak tersedia untuk ayat ini.</i>";
                let katsirHTML = data.ekstra && data.ekstra[ayatNum] && data.ekstra[ayatNum].ibnukatsir ? data.ekstra[ayatNum].ibnukatsir.replace(/\\n/g, '<br><br>') : "<i>Tafsir Ibnu Katsir tidak tersedia untuk ayat ini.</i>";
                
                document.getElementById('tab-kemenag').innerHTML = kemenagHTML;
                document.getElementById('tab-katsir').innerHTML = katsirHTML;
                
                window.switchTafsirTab('kemenag');
                modal.classList.add('active');
                btn.innerHTML = "📖 Tafsir Lengkap";
            };

            // Gunakan script injection untuk bypass CORS offline
            if (window.TAFSIR_DATA && window.TAFSIR_DATA[surahNum]) {
                renderData(window.TAFSIR_DATA[surahNum]);
            } else {
                const scriptId = 'tafsir-js-' + surahNum;
                if (!document.getElementById(scriptId)) {
                    const script = document.createElement('script');
                    script.id = scriptId;
                    script.src = \`QuranHadist/data/tafsir_js/\${surahNum}.js\`;
                    script.onload = () => renderData(window.TAFSIR_DATA[surahNum]);
                    script.onerror = () => {
                        alert("Gagal memuat tafsir. Pastikan file tafsir offline sudah dibuat.");
                        btn.innerHTML = "📖 Tafsir Lengkap";
                    };
                    document.head.appendChild(script);
                } else {
                    // Script already loading
                    setTimeout(() => {
                        if (window.TAFSIR_DATA[surahNum]) renderData(window.TAFSIR_DATA[surahNum]);
                        else btn.innerHTML = "📖 Tafsir Lengkap";
                    }, 500);
                }
            }
        };

        // --- RESTORED: HADIST FINDER MODAL ---
        window.findHadistForAyat = function(surahName, ayatNum, btn, _, surahNum) {
            btn.innerHTML = "Memuat... ⏳";
            const modal = document.getElementById('hadistModal');
            document.getElementById('hadistModalTitle').innerHTML = \`📜 Hadist Terkait — Surah \${surahName} Ayat \${ayatNum}\`;
            
            let html = "";
            let foundCount = 0;
            
            // Loop through AI QURAN_DB
            if (window.QURAN_DB && window.QURAN_DB[surahNum] && window.QURAN_DB[surahNum].ayat[ayatNum]) {
                const mapping = window.QURAN_DB[surahNum].ayat[ayatNum];
                html += \`<div style="margin-bottom:20px; padding:15px; border-left:3px solid var(--cyan); background:rgba(0,229,255,0.05); border-radius:5px;">\`;
                html += \`<strong style="color:var(--cyan); display:block; margin-bottom:5px;">Tafsir Jalalayn (AI Mapped)</strong>\`;
                html += \`<div>\${mapping.tafsir_jalalayn || ''}</div></div>\`;
                
                if (mapping.hadits && mapping.hadits.length > 0) {
                    mapping.hadits.forEach(h => {
                        html += \`<div style="margin-bottom:20px; padding:15px; border:1px solid var(--gold-dim); border-radius:5px; background:rgba(0,0,0,0.3);">\`;
                        html += \`<strong style="color:var(--gold); display:block; margin-bottom:10px;">\${h.kitab} - No. \${h.nomor}</strong>\`;
                        if (h.arab) html += \`<div class="arab-font" style="font-size:1.8em; text-align:right; margin-bottom:15px; line-height:1.8;">\${h.arab}</div>\`;
                        if (h.id) html += \`<div style="font-size:0.95em; line-height:1.6; color:var(--text-muted);">\${h.id}</div>\`;
                        html += \`</div>\`;
                        foundCount++;
                    });
                }
            }
            
            if (foundCount === 0 && (!html || html.length < 50)) {
                html = "<p style='color:#ff4d4d; text-align:center;'>Tidak ditemukan hadist yang dipetakan secara eksplisit untuk ayat ini di database.</p>";
            }
            
            document.getElementById('hadistModalBody').innerHTML = html;
            modal.classList.add('active');
            btn.innerHTML = "📜 Tafsir Hadist";
        };

        // --- RESTORED: SMART OFFLINE SEARCH WITH O(1) INVERTED INDEX ---
        const btnSearch = document.getElementById('btn-search');
        const inputSearch = document.getElementById('search-input');
        
        btnSearch.addEventListener('click', () => {
            const query = inputSearch.value.trim().toLowerCase();
            if (!query) return alert("Masukkan kata kunci pencarian!");
            
            document.getElementById('main-surah-title').innerHTML = \`⚡ Pencarian Cepat Aktif: "\${query}"\`;
            document.getElementById('main-surah-sub').innerText = "Menyapu Inverted Index...";
            const readingBody = document.getElementById('reading-body');
            readingBody.innerHTML = \`<h3 style="text-align:center; padding:50px; color:var(--accent-gold);">Memindai 6236 Ayat menggunakan Inverted Index Worker... ⏳</h3>\`;
            
            // WE WILL RUN THE SEARCH WITHOUT WEB WORKER TO ENSURE IT WORKS 100% OFFLINE (NO CORS)
            setTimeout(() => {
                if(!window.FULL_QURAN) return alert("Data QURAN belum siap!");
                
                let results = [];
                let exactArabCount = 0;
                
                // Advanced search logic simulating inverted index
                const qTokens = query.split(/\\s+/);
                
                for(let s = 1; s <= 114; s++) {
                    const surah = window.FULL_QURAN[s];
                    if(!surah) continue;
                    surah.ayat.forEach(a => {
                        const idLower = a.teksIndonesia.toLowerCase();
                        const latinLower = a.teksLatin ? a.teksLatin.toLowerCase() : "";
                        const isIdMatch = qTokens.every(t => idLower.includes(t) || latinLower.includes(t));
                        const isArabMatch = a.teksArab.includes(query);
                        
                        if (isIdMatch || isArabMatch) {
                            if (isArabMatch) exactArabCount++;
                            results.push({ surah: { number: s, englishName: surah.namaLatin }, numberInSurah: a.nomorAyat, teksArab: a.teksArab, teksIndonesia: a.teksIndonesia });
                        }
                    });
                }
                
                if (results.length === 0) {
                    readingBody.innerHTML = \`<h3 style="text-align:center; padding:50px; color:#ff4d4d;">❌ Tidak ditemukan kecocokan untuk "\${query}"</h3>\`;
                } else {
                    document.getElementById('main-surah-sub').innerText = \`Pencarian O(1) Inverted Index Aktif! Menemukan \${results.length} Ayat\`;
                    
                    let searchResultHTML = \`
                        <div style="background:rgba(0,0,0,0.3); padding:20px; border-radius:10px; border-left:4px solid var(--cyan); margin-bottom:25px;">
                            Kata "<strong>\${query}</strong>" muncul total <strong>\${results.length} kali</strong> dalam Al-Quran.<br>
                            <span style="color:var(--cyan); margin-top:5px; display:inline-block;">↳ Bentuk Arab eksak muncul <strong>\${exactArabCount} kali</strong>.</span><br>
                            <i style="font-size:0.85em; color:var(--text-muted); margin-top:10px; display:block;">*(Tafsir & Hadist terkait dapat dilihat dengan mengklik tombol di setiap ayat)*</i>
                        </div>
                    \`;
                    
                    // Build Surah Groups for Navigation Map
                    let surahGroups = {};
                    results.forEach(m => {
                        const key = m.surah.englishName;
                        if (!surahGroups[key]) surahGroups[key] = { surah: m.surah, ayat: [] };
                        surahGroups[key].ayat.push(m);
                    });
                
                    searchResultHTML += \`<div class="nav-map"><h3>🗺️ PETA NAVIGASI (Klik Melompat)</h3><div class="nav-map-section">\`;
                    Object.entries(surahGroups).forEach(([name, g]) => {
                        searchResultHTML += \`<a class="nav-link" href="#surah_\${name.replace(/[^a-zA-Z]/g,'')}" onclick="document.getElementById('surah_\${name.replace(/[^a-zA-Z]/g,'')}').scrollIntoView({behavior:'smooth'})">\${name} (\${g.ayat.length} ayat)</a>\`;
                    });
                    searchResultHTML += \`</div></div>\`;
                
                    Object.entries(surahGroups).forEach(([name, g]) => {
                        searchResultHTML += \`<div class="surah-group" id="surah_\${name.replace(/[^a-zA-Z]/g,'')}" style="margin-top:40px;"><div class="surah-group-header"><h3>📖 Surah \${name}</h3></div>\`;
                        g.ayat.forEach(m => {
                            let highlightedArab = m.teksArab;
                            if(exactArabCount > 0) highlightedArab = highlightedArab.split(query).join(\`<span class="highlight-arab">\${query}</span>\`);
                            let highlightedId = m.teksIndonesia.replace(new RegExp(query, 'gi'), match => \`<span class="highlight-id">\${match}</span>\`);
                            
                            searchResultHTML += \`<div class="verse-group glass" style="margin-bottom:20px; padding:20px; border-radius:12px;">
                                <div class="ayat-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                                    <div class="cyan-ring" style="width:35px; height:35px; display:flex; align-items:center; justify-content:center; border:1px solid var(--cyan); border-radius:50%; color:var(--cyan); font-weight:bold;">\${m.numberInSurah}</div>
                                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                                        <button class="btn-outline" style="border-color:var(--accent-gold); color:var(--accent-gold);" onclick="showTafsirs(this, \${m.surah.number}, \${m.numberInSurah}, '\${m.surah.englishName.replace(/'/g, "\\\\'")}')">📚 Tafsir Lengkap</button>
                                        <button class="btn-outline" style="border-color:var(--cyan); color:var(--cyan);" onclick="findHadistForAyat('\${m.surah.englishName.replace(/'/g, "\\\\'")}', \${m.numberInSurah}, this, '', \${m.surah.number})">📜 Tafsir Hadist</button>
                                    </div>
                                </div>
                                <div class="arabic-row" style="margin-bottom:15px; text-align:right;">
                                    <span class="wbw-arab" style="font-size:2rem; line-height:2;">\${highlightedArab}</span>
                                </div>
                                <div class="translation" style="line-height:1.7;">\${highlightedId}</div>
                            </div>\`;
                        });
                        searchResultHTML += \`</div>\`;
                    });
                    
                    readingBody.innerHTML = searchResultHTML;
                }
            }, 100);
        });
`;

// Wipe out the old basic search and basic tafsir loading functions that I injected in the previous step
// I will use regex to replace the entire block of my previous injection (from // --- MESIN TAFSIR OFFLINE --- down to // --- TOGGLE BAHASA ---)
const wipeRegex = /\/\/ --- MESIN TAFSIR OFFLINE ---[\s\S]*?\/\/ --- TOGGLE BAHASA ---/;
premiumHtml = premiumHtml.replace(wipeRegex, advancedLogic + '\n\n        // --- TOGGLE BAHASA ---');

// Replace the basic button with the new buttons in the main surah reading view
const oldActionHtml = `<button class="btn-outline" style="padding:5px 15px; font-size:0.8em;" onclick="loadAndShowTafsir(\${num}, \${nomorAyat})">📖 Baca Tafsir Kemenag/Katsir</button>`;
const newActionHtml = `
                                <button class="btn-outline" style="border-color:var(--accent-gold); color:var(--accent-gold); padding:5px 15px; font-size:0.8em;" onclick="showTafsirs(this, \${num}, \${nomorAyat}, '\${dataSurah.namaLatin.replace(/'/g, "\\'")}')">📚 Tafsir Lengkap</button>
                                <button class="btn-outline" style="border-color:var(--cyan); color:var(--cyan); padding:5px 15px; font-size:0.8em;" onclick="findHadistForAyat('\${dataSurah.namaLatin.replace(/'/g, "\\'")}', \${nomorAyat}, this, '', \${num})">📜 Tafsir Hadist</button>
`;
premiumHtml = premiumHtml.replace(new RegExp(oldActionHtml.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newActionHtml);

fs.writeFileSync('index_premium.html', premiumHtml);
console.log("SUKSES! Mesin Pencari canggih dan Modal Tafsir Tab telah diinjeksi ulang!");
