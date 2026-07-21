const fs = require('fs');

let html = fs.readFileSync('index_premium.html', 'utf8');

// We will replace the entire showTafsirs and findHadistForAyat functions using RegEx
const showTafsirsRegex = /window\.showTafsirs = function[\s\S]*?btn\.innerHTML = "📖 Tafsir Lengkap";\n\s*},\s*500\);\n\s*}\n\s*}\n\s*};/g;

const newShowTafsirs = `window.showTafsirs = function(btn, surahNum, ayatNum, surahName) {
            btn.innerHTML = "Memuat... ⏳";
            const tafsirBody = document.getElementById('tafsir-body');
            
            const renderData = (data) => {
                let kemenagHTML = data.kemenag && data.kemenag[ayatNum] ? data.kemenag[ayatNum].replace(/\\n/g, '<br><br>') : "<i>Tafsir Kemenag tidak tersedia untuk ayat ini.</i>";
                let katsirHTML = data.ekstra && data.ekstra[ayatNum] && data.ekstra[ayatNum].ibnukatsir ? data.ekstra[ayatNum].ibnukatsir.replace(/\\n/g, '<br><br>') : "<i>Tafsir Ibnu Katsir tidak tersedia untuk ayat ini.</i>";
                
                // Render directly to the right panel instead of a modal!
                tafsirBody.innerHTML = \`
                    <div style="border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px; margin-bottom:15px;">
                        <h4 style="color:var(--gold); margin:0;">Surah \${surahName} Ayat \${ayatNum}</h4>
                    </div>
                    <div class="tab-container" style="padding:0; background:none; border:none; margin-bottom:15px; display:flex; gap:10px;">
                        <button class="tab-btn active" onclick="switchSideTafsirTab(this, 'kemenag')" style="padding:8px 15px; font-size:0.85em; border-radius:5px; border:1px solid var(--gold); color:var(--gold); background:rgba(202,138,4,0.1);">Kemenag RI</button>
                        <button class="tab-btn" onclick="switchSideTafsirTab(this, 'katsir')" style="padding:8px 15px; font-size:0.85em; border-radius:5px; border:1px solid var(--text-muted); color:var(--text-muted);">Ibnu Katsir</button>
                    </div>
                    <div id="side-tab-kemenag" class="tab-content active" style="font-size:0.95em; line-height:1.7; padding:0; display:block;">\${kemenagHTML}</div>
                    <div id="side-tab-katsir" class="tab-content" style="font-size:0.95em; line-height:1.7; padding:0; display:none;">\${katsirHTML}</div>
                \`;
                
                // Highlight the side panel to draw attention
                tafsirBody.parentElement.style.boxShadow = "0 0 20px rgba(202, 138, 4, 0.4)";
                setTimeout(() => tafsirBody.parentElement.style.boxShadow = "none", 1500);
                
                btn.innerHTML = "📖 Tafsir Lengkap";
            };

            // Gunakan script injection untuk bypass CORS offline
            if (window.TAFSIR_DATA && window.TAFSIR_DATA[surahNum]) {
                renderData(window.TAFSIR_DATA[surahNum]);
            } else {
                const scriptId = 'tafsir-js-' + surahNum;
                if (!document.getElementById(scriptId)) {
                    tafsirBody.innerHTML = "<p style='color:var(--cyan);'>Menyedot Tafsir 1.6GB dari database offline... ⏳</p>";
                    const script = document.createElement('script');
                    script.id = scriptId;
                    script.src = \`QuranHadist/data/tafsir_js/\${surahNum}.js\`;
                    script.onload = () => renderData(window.TAFSIR_DATA[surahNum]);
                    script.onerror = () => {
                        tafsirBody.innerHTML = "<p style='color:#ff4d4d;'>Gagal memuat tafsir. Pastikan file tafsir offline sudah dibuat.</p>";
                        btn.innerHTML = "📖 Tafsir Lengkap";
                    };
                    document.head.appendChild(script);
                } else {
                    setTimeout(() => {
                        if (window.TAFSIR_DATA[surahNum]) renderData(window.TAFSIR_DATA[surahNum]);
                        else btn.innerHTML = "📖 Tafsir Lengkap";
                    }, 500);
                }
            }
        };
        
        window.switchSideTafsirTab = function(btn, tab) {
            const container = btn.parentElement.parentElement;
            container.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
                b.style.color = "var(--text-muted)";
                b.style.borderColor = "var(--text-muted)";
                b.style.background = "transparent";
            });
            container.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
            
            btn.classList.add('active');
            btn.style.color = "var(--gold)";
            btn.style.borderColor = "var(--gold)";
            btn.style.background = "rgba(202,138,4,0.1)";
            container.querySelector('#side-tab-' + tab).style.display = 'block';
        };`;


const findHadistRegex = /window\.findHadistForAyat = function[\s\S]*?btn\.innerHTML = "📜 Tafsir Hadist";\n\s*};/g;

const newFindHadist = `window.findHadistForAyat = function(surahName, ayatNum, btn, _, surahNum) {
            btn.innerHTML = "Memuat... ⏳";
            const hadithBody = document.getElementById('hadith-body');
            
            let html = "";
            let foundCount = 0;
            
            // Loop through AI QURAN_DB
            if (window.QURAN_DB && window.QURAN_DB[surahNum] && window.QURAN_DB[surahNum].ayat[ayatNum]) {
                const mapping = window.QURAN_DB[surahNum].ayat[ayatNum];
                
                if (mapping.hadits && mapping.hadits.length > 0) {
                    html += \`<div style="font-weight:bold; color:var(--cyan); margin-bottom:10px; padding-bottom:5px; border-bottom:1px solid rgba(56,189,248,0.2);">Surah \${surahName} : \${ayatNum}</div>\`;
                    mapping.hadits.forEach(h => {
                        html += \`<div style="margin-bottom:15px; padding:12px; border:1px solid var(--glass-border); border-radius:5px; background:rgba(0,0,0,0.3);">\`;
                        html += \`<strong style="color:var(--gold); display:block; margin-bottom:10px; font-size:0.9em;">\${h.kitab} - No. \${h.nomor}</strong>\`;
                        if (h.arab) html += \`<div class="arab-font" style="font-size:1.4em; text-align:right; margin-bottom:10px; line-height:1.6;">\${h.arab}</div>\`;
                        if (h.id) html += \`<div style="font-size:0.9em; line-height:1.6; color:var(--text-muted);">\${h.id}</div>\`;
                        html += \`</div>\`;
                        foundCount++;
                    });
                }
            }
            
            if (foundCount === 0) {
                html = "<p style='color:var(--text-muted); text-align:center;'>Tidak ditemukan hadist yang dipetakan secara eksplisit untuk ayat ini di database.</p>";
            }
            
            hadithBody.innerHTML = html;
            
            // Highlight the side panel to draw attention
            hadithBody.parentElement.style.boxShadow = "0 0 20px rgba(56, 189, 248, 0.4)";
            setTimeout(() => hadithBody.parentElement.style.boxShadow = "none", 1500);
            
            btn.innerHTML = "📜 Tafsir Hadist";
        };`;

html = html.replace(showTafsirsRegex, newShowTafsirs);
html = html.replace(findHadistRegex, newFindHadist);

fs.writeFileSync('index_premium.html', html);
console.log("Berhasil memindahkan Modal ke Panel Samping!");
