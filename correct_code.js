window.switchTafsirTab = function(tabName) {
    const tafsirBody = document.getElementById('tafsir-body');
    if (!tafsirBody) return;
    
    tafsirBody.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    tafsirBody.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    
    const activeBtn = tafsirBody.querySelector(`[onclick*="${tabName}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    const activePane = document.getElementById('pane_' + tabName);
    if (activePane) activePane.classList.add('active');
};

window.renderHadistPendukung = async function(surahNum, ayatNum) {
    const container = document.getElementById('pane_hadist');
    if (!container) return;
    container.innerHTML = "<p style='color:var(--accent-cyan);'>Mengekstrak Hadist dari Memori... ⏳</p>";

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
        container.innerHTML = "<p style='color:red;'>Gagal memuat mapping hadist offline.</p>";
        return;
    }
    
    const key = `${surahNum}_${ayatNum}`;
    const mapped = window.HADITH_MAPPING[key];
    
    if (!mapped || mapped.length === 0) {
        container.innerHTML = "<p style='color:var(--text-muted);'>Tidak ada riwayat hadist spesifik yang ditemukan untuk ayat ini dalam database offline.</p>";
        return;
    }
    
    let html = `<h4 style="color:var(--accent-cyan); border-bottom:1px solid rgba(6,182,212,0.2); padding-bottom:10px;">Ditemukan ${mapped.length} Riwayat Hadist</h4>`;
    
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
                <div style="font-family:'Amiri',serif; font-size:1.5em; direction:rtl; text-align:right; color:#fff; margin:10px 0;">${hadithObj.arab || ""}</div>
                <div class="translation-text" style="font-size:1em; color:var(--text-main); text-align:justify;">"${hadithObj.id || ""}"</div>
            </div>`;
        }
    }
    
    container.innerHTML = html === '' ? "<p style='color:red;'>Gagal mengekstrak teks.</p>" : html;
};

window.showTafsirs = async function(btn, surahNum, ayatNum, surahName) {
    const tafsirBody = document.getElementById('tafsir-body');
    const colInfo = document.getElementById('col-info');
    if (!tafsirBody) return;
    
    if (colInfo) {
        colInfo.style.display = 'flex';
        if(window.innerWidth <= 992) {
            colInfo.scrollIntoView({behavior: 'smooth'});
        }
    }

    tafsirBody.innerHTML = "<p style='color:var(--cyan);'>Mengurai Tafsir & Hadist... ⏳</p>";
    
    const panelTitle = document.getElementById('panel-tafsir-title');
    if (panelTitle) panelTitle.innerText = `📖 Surah ${surahName} Ayat ${ayatNum}`;
    
    const renderData = (data) => {
        if(!data) { tafsirBody.innerHTML = "<p style='color:red;'>Data gagal dimuat</p>"; return; }
        const txtKemenag = (data.kemenag && data.kemenag[ayatNum]) ? data.kemenag[ayatNum].replace(/\n/g, '<br><br>') : "Data Kemenag belum tersedia";
        
        let txtKatsir = "Belum Tersedia", txtJalalain = "Belum Tersedia", txtQuraish = "Belum Tersedia";
        if(data.ekstra && data.ekstra[ayatNum]){
            txtKatsir = (data.ekstra[ayatNum].ibnukatsir || "").replace(/\n/g, '<br>');
            txtJalalain = (data.ekstra[ayatNum].jalalain || "").replace(/\n/g, '<br>');
            txtQuraish = (data.ekstra[ayatNum].quraish || "").replace(/\n/g, '<br>');
        }

        tafsirBody.innerHTML = `
            <div class="tafsir-tabs">
                <button class="tab-btn active" onclick="switchTafsirTab('kemenag')">Kemenag RI</button>
                <button class="tab-btn" onclick="switchTafsirTab('katsir')">Ibnu Katsir</button>
                <button class="tab-btn" onclick="switchTafsirTab('jalalain')">Jalalain</button>
                <button class="tab-btn" onclick="switchTafsirTab('quraish')">Al-Mishbah</button>
                <button class="tab-btn" onclick="switchTafsirTab('hadist'); renderHadistPendukung(${surahNum}, ${ayatNum});" style="background:rgba(6, 182, 212, 0.1); color:var(--accent-cyan); border:1px solid var(--accent-cyan);">📜 Hadist Terkait</button>
            </div>
            <div id="pane_kemenag" class="tab-pane active" style="overflow-y:auto; max-height:calc(100vh - 250px); padding-right:10px;">${txtKemenag}</div>
            <div id="pane_katsir" class="tab-pane" style="overflow-y:auto; max-height:calc(100vh - 250px); padding-right:10px;">${txtKatsir}</div>
            <div id="pane_jalalain" class="tab-pane" style="overflow-y:auto; max-height:calc(100vh - 250px); padding-right:10px;">${txtJalalain}</div>
            <div id="pane_quraish" class="tab-pane" style="overflow-y:auto; max-height:calc(100vh - 250px); padding-right:10px;">${txtQuraish}</div>
            <div id="pane_hadist" class="tab-pane" style="overflow-y:auto; max-height:calc(100vh - 250px); padding-right:10px;">
                <p style="color:var(--text-muted); text-align:center;">Klik tab ini untuk mengekstrak riwayat hadist dari memori...</p>
            </div>
        `;
    };

    if (window.TAFSIR_DATA && window.TAFSIR_DATA[surahNum]) {
        renderData(window.TAFSIR_DATA[surahNum]);
    } else {
        const scriptId = 'tafsir-js-' + surahNum;
        if (!document.getElementById(scriptId)) {
            tafsirBody.innerHTML = "<p style='color:var(--cyan);'>Menyedot Tafsir 1.6GB dari database offline... ⏳</p>";
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = `QuranHadist/data/tafsir_js/${surahNum}.js`;
            script.onload = () => renderData(window.TAFSIR_DATA[surahNum]);
            script.onerror = () => {
                tafsirBody.innerHTML = "<p style='color:#ff4d4d;'>Gagal memuat tafsir. Pastikan file tafsir offline sudah dibuat.</p>";
            };
            document.head.appendChild(script);
        } else {
            setTimeout(() => { renderData(window.TAFSIR_DATA[surahNum]); }, 500);
        }
    }
};
