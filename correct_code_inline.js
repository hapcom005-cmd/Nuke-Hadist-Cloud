window.switchTafsirTab = function(btn, tabName, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.querySelectorAll('.tafsir-tab-btn').forEach(b => {
        b.style.background = 'transparent';
        b.style.color = 'var(--text-muted)';
        b.style.borderColor = 'transparent';
    });
    
    if (btn) {
        btn.style.background = 'rgba(212,175,55,0.15)';
        btn.style.color = 'var(--accent-gold)';
        btn.style.borderColor = 'var(--accent-gold)';
    }
    
    container.querySelectorAll('.tafsir-content-pane').forEach(p => p.style.display = 'none');
    
    const activePane = container.querySelector('#' + tabName);
    if (activePane) activePane.style.display = 'block';
};

window.renderHadistPendukung = async function(surahNum, ayatNum, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "<p style='color:var(--accent-cyan); text-align:center;'>Mengekstrak Hadist dari Memori... ⏳</p>";

    // Offline bypass for mapping_hadist_semantik_12core
    if (!window.HADITH_MAPPING) {
        await new Promise((resolve) => {
            const scriptId = 'mapping-hadist-js';
            if (!document.getElementById(scriptId)) {
                const script = document.createElement('script');
                script.id = scriptId;
                script.src = `QuranHadist/data/mapping_hadist_semantik_12core.js`;
                script.onload = () => resolve();
                script.onerror = () => resolve();
                document.head.appendChild(script);
            } else {
                setTimeout(resolve, 300);
            }
        });
    }

    if (!window.HADITH_MAPPING) {
        container.innerHTML = "<p style='color:red; text-align:center;'>Gagal memuat mapping hadist offline.</p>";
        return;
    }
    
    const key = `${surahNum}_${ayatNum}`;
    const mapped = window.HADITH_MAPPING[key];
    
    if (!mapped || mapped.length === 0) {
        container.innerHTML = "<p style='color:var(--text-muted); text-align:center;'>Tidak ada riwayat hadist spesifik yang ditemukan untuk ayat ini dalam database offline.</p>";
        return;
    }
    
    let html = `<h4 style="color:var(--accent-cyan); border-bottom:1px solid rgba(6,182,212,0.2); padding-bottom:10px;">Ditemukan ${mapped.length} Riwayat Hadist Terkait Ayat Ini</h4>`;
    
    window.HADITH_CACHE = window.HADITH_CACHE || {};
    for (const h of mapped) {
        const cKey = h.kitab + '_' + h.id;
        let hadithObj = window.HADITH_CACHE[cKey];
        if (!hadithObj) {
            await new Promise((resolve) => {
                const sId = 'hadith-js-' + h.kitab;
                if (!document.getElementById(sId)) {
                    const script = document.createElement('script');
                    script.id = sId;
                    script.src = `QuranHadist/data/hadith_all_js/${h.kitab}.js`;
                    script.onload = () => resolve();
                    script.onerror = () => resolve();
                    document.head.appendChild(script);
                } else {
                    setTimeout(resolve, 100);
                }
            });
            if (window.HADITH_DATA_ALL && window.HADITH_DATA_ALL[h.kitab]) {
                const found = window.HADITH_DATA_ALL[h.kitab].find(x => x.id == h.id || x.number == h.id);
                if (found) {
                    hadithObj = found;
                    window.HADITH_CACHE[cKey] = found;
                }
            }
        }

        if (hadithObj) {
            html += `<div class="linked-hadist" style="margin:15px 0; background:rgba(255,255,255,0.05); padding:15px; border-radius:10px; border-left:3px solid var(--accent-cyan);">
                <div class="perawi-tag" style="color:var(--accent-cyan); font-weight:bold; margin-bottom:10px;">Riwayat ${h.kitab.toUpperCase()} — No. ${h.id}</div>
                <div style="font-family:'Amiri',serif; font-size:1.5em; direction:rtl; text-align:right; color:#fff; margin:10px 0; line-height:2.2;">${hadithObj.arab || ""}</div>
                <div class="translation-text" style="font-size:1em; color:var(--text-main); text-align:justify; line-height:1.7;">"${hadithObj.id || ""}"</div>
            </div>`;
        }
    }
    
    container.innerHTML = html === '' ? "<p style='color:red;'>Gagal mengekstrak teks.</p>" : html;
};

window.showTafsirs = async function(btn, surahNum, ayatNum, surahName) {
    const existing = btn.parentElement.parentElement.parentElement.querySelector('.tafsir-kemenag-container');
    if (existing) { existing.remove(); return; }

    const container = document.createElement('div');
    const containerId = 'tafsir_box_' + Date.now();
    container.id = containerId;
    container.className = 'tafsir-kemenag-container';
    container.style = "margin-top:15px; background:rgba(212,175,55,0.05); border:1px solid rgba(212,175,55,0.3); border-radius:12px; padding:20px; animation:fadeIn 0.3s ease;";

    btn.parentElement.parentElement.parentElement.appendChild(container);

    container.innerHTML = "<p style='color:var(--cyan); text-align:center;'>Menyedot Tafsir & Hadist Offline... ⏳</p>";
    
    const renderData = (data) => {
        if(!data) { container.innerHTML = "<p style='color:red;'>Data gagal dimuat</p>"; return; }
        const txtKemenag = (data.kemenag && data.kemenag[ayatNum]) ? data.kemenag[ayatNum].replace(/\n/g, '<br><br>') : "Data Kemenag belum tersedia";
        
        let txtKatsir = "Belum Tersedia", txtJalalain = "Belum Tersedia", txtQuraish = "Belum Tersedia";
        if(data.ekstra && data.ekstra[ayatNum]){
            txtKatsir = (data.ekstra[ayatNum].ibnukatsir || "").replace(/\n/g, '<br>');
            txtJalalain = (data.ekstra[ayatNum].jalalain || "").replace(/\n/g, '<br>');
            txtQuraish = (data.ekstra[ayatNum].quraish || "").replace(/\n/g, '<br>');
        }

        container.innerHTML = `
            <h4 style="color:var(--accent-gold); margin-top:0; border-bottom:1px solid rgba(212,175,55,0.2); padding-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                <span>📚 Tafsir & Hadist — Surah ${surahName} Ayat ${ayatNum}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer; font-size:1.2em;">✕</button>
            </h4>
            
            <div style="display:flex; gap:10px; margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px; overflow-x:auto;">
                <button class="tafsir-tab-btn active" onclick="switchTafsirTab(this, 'pane_kemenag', '${containerId}')" style="background:rgba(212,175,55,0.15); color:var(--accent-gold); border:1px solid var(--accent-gold); padding:6px 12px; border-radius:6px; cursor:pointer; white-space:nowrap; font-weight:bold;">Kemenag RI</button>
                <button class="tafsir-tab-btn" onclick="switchTafsirTab(this, 'pane_katsir', '${containerId}')" style="background:transparent; color:var(--text-muted); border:1px solid transparent; padding:6px 12px; border-radius:6px; cursor:pointer; white-space:nowrap; font-weight:bold;">Ibnu Katsir</button>
                <button class="tafsir-tab-btn" onclick="switchTafsirTab(this, 'pane_jalalain', '${containerId}')" style="background:transparent; color:var(--text-muted); border:1px solid transparent; padding:6px 12px; border-radius:6px; cursor:pointer; white-space:nowrap; font-weight:bold;">Jalalain</button>
                <button class="tafsir-tab-btn" onclick="switchTafsirTab(this, 'pane_quraish', '${containerId}')" style="background:transparent; color:var(--text-muted); border:1px solid transparent; padding:6px 12px; border-radius:6px; cursor:pointer; white-space:nowrap; font-weight:bold;">Al-Mishbah</button>
                <button class="tafsir-tab-btn" onclick="switchTafsirTab(this, 'pane_hadist', '${containerId}'); renderHadistPendukung(${surahNum}, ${ayatNum}, 'pane_hadist_${containerId}');" style="background:rgba(6, 182, 212, 0.1); color:var(--accent-cyan); border:1px solid var(--accent-cyan); padding:6px 12px; border-radius:6px; cursor:pointer; white-space:nowrap; font-weight:bold; margin-left:auto;">📜 Hadist Terkait</button>
            </div>

            <div id="pane_kemenag" class="tafsir-content-pane" style="max-height:400px; overflow-y:auto; padding-right:10px; color:#fff; line-height:1.7; font-size:1.05em; text-align:justify;">
                ${txtKemenag}
            </div>
            
            <div id="pane_katsir" class="tafsir-content-pane" style="display:none; max-height:400px; overflow-y:auto; padding-right:10px; color:#fff; line-height:1.7; font-size:1.05em; text-align:justify;">
                ${txtKatsir}
            </div>
            
            <div id="pane_jalalain" class="tafsir-content-pane" style="display:none; max-height:400px; overflow-y:auto; padding-right:10px; color:#fff; line-height:1.7; font-size:1.05em; text-align:justify;">
                ${txtJalalain}
            </div>
            
            <div id="pane_quraish" class="tafsir-content-pane" style="display:none; max-height:400px; overflow-y:auto; padding-right:10px; color:#fff; line-height:1.7; font-size:1.05em; text-align:justify;">
                ${txtQuraish}
            </div>

            <div id="pane_hadist" class="tafsir-content-pane" style="display:none; max-height:400px; overflow-y:auto; padding-right:10px; color:#fff; line-height:1.7; font-size:1.05em; text-align:justify;">
                <div id="pane_hadist_${containerId}"></div>
            </div>
        `;
    };

    if (window.TAFSIR_DATA && window.TAFSIR_DATA[surahNum]) {
        renderData(window.TAFSIR_DATA[surahNum]);
    } else {
        const scriptId = 'tafsir-js-' + surahNum;
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = `QuranHadist/data/tafsir_js/${surahNum}.js`;
            script.onload = () => renderData(window.TAFSIR_DATA[surahNum]);
            script.onerror = () => {
                container.innerHTML = "<p style='color:#ff4d4d;'>Gagal memuat tafsir. Pastikan file tafsir offline sudah dibuat.</p>";
            };
            document.head.appendChild(script);
        } else {
            setTimeout(() => { renderData(window.TAFSIR_DATA[surahNum]); }, 500);
        }
    }
};
