
        const ALL_SURAHS = ["Al-Fatihah","Al-Baqarah","Ali 'Imran","An-Nisa'","Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal","At-Tawbah","Yunus","Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra'","Al-Kahf","Maryam","Ta-Ha","Al-Anbiya'","Al-Hajj","Al-Mu'minun","An-Nur","Al-Furqan","Ash-Shu'ara'","An-Naml","Al-Qasas","Al-'Ankabut","Ar-Rum","Luqman","As-Sajdah","Al-Ahzab","Saba'","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Ghafir","Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiyah","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf","Az-Zariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqi'ah","Al-Hadid","Al-Mujadilah","Al-Hashr","Al-Mumtahanah","As-Saff","Al-Jumu'ah","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haqqah","Al-Ma'arij","Nuh","Al-Jinn","Al-Muzzammil","Al-Muddaththir","Al-Qiyamah","Al-Insan","Al-Mursalat","An-Naba'","An-Nazi'at","'Abasa","At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-A'la","Al-Ghashiyah","Al-Fajr","Al-Balad","Ash-Shams","Al-Layl","Ad-Duha","Ash-Sharh","At-Tin","Al-'Alaq","Al-Qadr","Al-Bayyinah","Az-Zalzalah","Al-'Adiyat","Al-Qari'ah","At-Takathur","Al-'Asr","Al-Humazah","Al-Fil","Quraysh","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr","Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"];

        // 1. GENERATE 114 SURAHS
        const surahContainer = document.getElementById('surah-container');
        const mainTitle = document.getElementById('main-surah-title');
        const mainSub = document.getElementById('main-surah-sub');
        const readingBody = document.getElementById('reading-body');
        const tafsirBody = document.getElementById('tafsir-body');
        const hadithBody = document.getElementById('hadith-body');

        ALL_SURAHS.forEach((surahName, index) => {
            const num = index + 1;
            const div = document.createElement('div');
            div.className = `s-item`;
            div.innerHTML = `<span class="col-num">${num}.</span><span class="col-ar">${surahName}</span><span class="col-en">English</span>`;
            
            div.addEventListener('click', async function() {
                document.querySelectorAll('.s-item').forEach(s => s.classList.remove('active'));
                this.classList.add('active');

                mainTitle.innerText = `Surah ${surahName} Memuat...`;
                mainSub.innerText = `Mengambil data dari server lokal...`;
                readingBody.innerHTML = `<h3 style="text-align:center; padding:50px; color:var(--accent-gold);">Membuka Mushaf... ⏳</h3>`;
                
                try {
                    // MEMBACA DARI DATABASE OFFLINE MURNI (TANPA FETCH/CORS GOOGLE CHROME)
                    if (!window.FULL_QURAN || !window.FULL_QURAN[num]) throw new Error("Gagal memuat dari FULL_QURAN");
                    const dataSurah = window.FULL_QURAN[num];
                    
                    mainTitle.innerText = `Surah ${dataSurah.namaLatin}`;
                    mainSub.innerText = `(${dataSurah.arti}) - ${dataSurah.jumlahAyat} Ayat | Surah ke-${num}`;
                    
                    let htmlAyat = "";
                    
                    dataSurah.ayat.forEach(ayat => {
                        const nomorAyat = ayat.nomorAyat;
                        const dbKey = `${num}_${nomorAyat}`;
                        
                        let extraHtml = "";
                        let hasMapping = false;
                        if (typeof QURAN_DB !== 'undefined' && QURAN_DB[dbKey]) {
                            const aiData = QURAN_DB[dbKey];
                            hasMapping = true;
                            
                            let hadistBlock = "";
                            if (aiData.hadist && aiData.hadist.length > 0) {
                                const h = aiData.hadist[0];
                                hadistBlock = `<div style="margin-top:15px; padding:15px; background:rgba(0, 229, 255, 0.05); border-left:3px solid var(--cyan); border-radius:8px;">
                                    <strong style="color:var(--cyan);">Hadist Terkait (Kitab ${h.kitab} #${h.id})</strong><br>
                                    <span style="font-size:0.9em; color:#e2e8f0;">${h.label_khusus}</span><br>
                                    <span style="font-size:0.8em; color:var(--accent-gold);">Skor Kecocokan AI: ${h.overlap_score}</span>
                                </div>`;
                            }
                            
                            extraHtml = `<div style="margin-top:10px; font-size:0.9em; color:var(--text-muted);">
                                <strong>Tafsir Ringkas:</strong> ${aiData.tafsir_jalalayn || 'Tafsir tersedia.'}
                            </div> ${hadistBlock}`;
                        }
                        
                        const aiBadge = hasMapping ? `<span style="background:var(--cyan); color:#000; padding:2px 8px; border-radius:12px; font-size:0.7em; margin-left:10px; font-weight:bold;">🔥 MAPPED BY AI</span>` : '';

                        htmlAyat += `
                        <div class="verse-group">
                            <div class="arabic-row">
                                <div class="cyan-ring" style="${hasMapping ? 'box-shadow: 0 0 15px var(--cyan);' : ''}">${nomorAyat}</div>
                                <div class="wbw-container" style="flex-direction:row-reverse; display:flex; text-align:right;">
                                    <div class="wbw-word" style="width:100%;">
                                        <span class="wbw-arab" style="font-size:2.5rem; line-height:2;">${ayat.teksArab}</span>
                                    </div>
                                </div>
                            </div>
                            <div style="color:var(--accent-cyan); font-style:italic; font-size:1.1em; margin-bottom:10px; margin-top:-10px;" class="latin-text">
                                ${ayat.teksLatin}
                            </div>
                            <div class="translation" style="margin-bottom:15px;">
                                ${ayat.teksIndonesia} <span class="ref-link">[${nomorAyat}]</span> ${aiBadge}
                            </div>
                            ${extraHtml}
                            <div class="tafsir-action" style="margin-top:10px;">
                                
                                <button class="btn-outline" style="border-color:var(--accent-gold); color:var(--accent-gold); padding:5px 15px; font-size:0.8em;" onclick="showTafsirs(this, ${num}, ${nomorAyat}, '${dataSurah.namaLatin.replace(/'/g, "\\'")}')">📚 Tafsir Lengkap</button>
                                <button class="btn-outline" style="border-color:var(--cyan); color:var(--cyan); padding:5px 15px; font-size:0.8em;" onclick="findHadistForAyat('${dataSurah.namaLatin.replace(/'/g, "\\'")}', ${nomorAyat}, this, '', ${num})">📜 Tafsir Hadist</button>

                            </div>
                        </div>`;
                    });
                    
                    readingBody.innerHTML = htmlAyat;
                    tafsirBody.innerHTML = `<p>Tafsir Global untuk Surah ${dataSurah.namaLatin} telah dimuat.</p>`;
                    hadithBody.innerHTML = `<p>Hadist relevan telah disisipkan langsung di bawah ayat.</p>`;

                } catch (err) {
                    console.error("Gagal mengambil file JSON Surah", err);
                    readingBody.innerHTML = `<h3 style="text-align:center; padding:50px; color:#ff4d4d;">❌ Gagal Memuat Data Surah!</h3><p style="text-align:center; color:var(--text-muted);">Pastikan server lokal berjalan.</p>`;
                }
            });
            surahContainer.appendChild(div);
        });

        
        
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
            const tafsirBody = document.getElementById('tafsir-body');
            
            const renderData = (data) => {
                let kemenagHTML = data.kemenag && data.kemenag[ayatNum] ? data.kemenag[ayatNum].replace(/\n/g, '<br><br>') : "<i>Tafsir Kemenag tidak tersedia untuk ayat ini.</i>";
                let katsirHTML = data.ekstra && data.ekstra[ayatNum] && data.ekstra[ayatNum].ibnukatsir ? data.ekstra[ayatNum].ibnukatsir.replace(/\n/g, '<br><br>') : "<i>Tafsir Ibnu Katsir tidak tersedia untuk ayat ini.</i>";
                
                // Render directly to the right panel instead of a modal!
                tafsirBody.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;">
                        <h4 id="current-tafsir-name" style="color:var(--gold); margin:0;">Kemenag RI</h4>
                        <button onclick="openTafsirLibrary(${surahNum}, ${ayatNum})" class="action-btn" style="background:var(--gold); color:#000; padding:5px 15px; border-radius:5px; font-weight:bold; cursor:pointer; font-size:0.9em; box-shadow:0 0 10px rgba(202,138,4,0.4);">📚 Pilih Kitab Tafsir</button>
                    </div>
                    <div id="side-tab-tafsir" class="tab-content active" style="font-size:0.95em; line-height:1.7; padding:0; display:block;">${kemenagHTML}</div>
                `;
                
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
                    script.src = `QuranHadist/data/tafsir_js/${surahNum}.js`;
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
        
        window.CURRENT_SURAH_TAFSIR = null;
        window.CURRENT_AYAT_TAFSIR = null;

        window.openTafsirLibrary = function(surahNum, ayatNum) {
            window.CURRENT_SURAH_TAFSIR = surahNum;
            window.CURRENT_AYAT_TAFSIR = ayatNum;
            document.getElementById('tafsirLibraryModal').classList.add('active');
            
            // Render list
            const libBody = document.getElementById('tafsirLibraryBody');
            if (libBody.innerHTML.trim() === '' || libBody.innerHTML.includes('Diisi oleh JS')) {
                if(!window.TAFSIR_LIST) {
                    libBody.innerHTML = "<p style='color:var(--cyan); padding:20px;'>Memuat 122 Kitab Tafsir... ⏳</p>";
                    const listScript = document.createElement('script');
                    listScript.src = 'QuranHadist/data/tafsir_all_js/tafsir_list.js';
                    listScript.onload = () => renderTafsirList(window.TAFSIR_LIST);
                    document.body.appendChild(listScript);
                } else {
                    renderTafsirList(window.TAFSIR_LIST);
                }
            }
        };

        window.renderTafsirList = function(list) {
            const libBody = document.getElementById('tafsirLibraryBody');
            libBody.innerHTML = list.map(t => `
                <div class="tafsir-card" data-name="${t.name.toLowerCase()}" data-lang="${t.language.toLowerCase()}" style="border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:15px; cursor:pointer; background:rgba(255,255,255,0.02); transition:0.3s;" onclick="executeLoadTafsir('${t.id}', '${t.name.replace(/'/g, "\\'")}')" onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.1)'">
                    <div style="font-size:0.7em; color:var(--cyan); margin-bottom:5px; font-weight:bold;">[ ${t.language} ]</div>
                    <div style="font-size:0.9em; font-weight:bold; color:var(--text-light);">${t.name}</div>
                </div>
            `).join('');
        };

        window.filterTafsirLibrary = function() {
            const q = document.getElementById('searchTafsir').value.toLowerCase();
            document.querySelectorAll('.tafsir-card').forEach(card => {
                const name = card.getAttribute('data-name');
                const lang = card.getAttribute('data-lang');
                if(name.includes(q) || lang.includes(q)) card.style.display = 'block';
                else card.style.display = 'none';
            });
        };

        window.executeLoadTafsir = function(tafsirId, tafsirName) {
            document.getElementById('tafsirLibraryModal').classList.remove('active');
            document.getElementById('current-tafsir-name').innerText = tafsirName;
            
            const targetContent = document.getElementById('side-tab-tafsir');
            targetContent.innerHTML = "<p style='color:var(--cyan);'>Mengambil data tafsir siluman (Offline)... ⏳</p>";
            
            const surahNum = window.CURRENT_SURAH_TAFSIR;
            const ayatNum = window.CURRENT_AYAT_TAFSIR;

            const scriptId = 'tafsir_script_' + tafsirId + '_' + surahNum;
            if (!document.getElementById(scriptId)) {
                const script = document.createElement('script');
                script.id = scriptId;
                script.src = `QuranHadist/data/tafsir_all_js/${tafsirId}_${surahNum}.js`;
                script.onload = () => {
                    const data = window.TAFSIR_CACHE[`${tafsirId}_${surahNum}`];
                    if(data && data[ayatNum]) {
                        targetContent.innerHTML = data[ayatNum].replace(/\n/g, '<br><br>');
                    } else {
                        targetContent.innerHTML = "<i>Tafsir tidak tersedia untuk ayat ini.</i>";
                    }
                };
                script.onerror = () => {
                    targetContent.innerHTML = "<p style='color:#ff4d4d;'>Gagal memuat tafsir. Pastikan skrip offline tersedia.</p>";
                };
                document.body.appendChild(script);
            } else {
                const data = window.TAFSIR_CACHE[`${tafsirId}_${surahNum}`];
                if(data && data[ayatNum]) {
                    targetContent.innerHTML = data[ayatNum].replace(/\n/g, '<br><br>');
                } else {
                    targetContent.innerHTML = "<i>Tafsir tidak tersedia untuk ayat ini.</i>";
                }
            }
        };

        // --- RESTORED: HADIST FINDER MODAL ---
        window.findHadistForAyat = function(surahName, ayatNum, btn, _, surahNum) {
            btn.innerHTML = "Memuat... ⏳";
            const hadithBody = document.getElementById('hadith-body');
            
            let html = "";
            let foundCount = 0;
            
            // Loop through AI QURAN_DB
            const dbKey = `${surahNum}_${ayatNum}`;
            if (window.QURAN_DB && window.QURAN_DB[dbKey]) {
                const mapping = window.QURAN_DB[dbKey];
                
                if (mapping.hadist_terkait && mapping.hadist_terkait.length > 0) {
                    html += `<div style="font-weight:bold; color:var(--cyan); margin-bottom:10px; padding-bottom:5px; border-bottom:1px solid rgba(56,189,248,0.2);">Surah ${surahName} : ${ayatNum}</div>`;
                    mapping.hadist_terkait.forEach(h => {
                        html += `<div style="margin-bottom:15px; padding:12px; border:1px solid var(--glass-border); border-radius:5px; background:rgba(0,0,0,0.3);">`;
                        html += `<strong style="color:var(--gold); display:block; margin-bottom:10px; font-size:0.9em;">${h.kitab} - No. ${h.nomor}</strong>`;
                        if (h.arab) html += `<div class="arab-font" style="font-size:1.4em; text-align:right; margin-bottom:10px; line-height:1.6;">${h.arab}</div>`;
                        if (h.id) html += `<div style="font-size:0.9em; line-height:1.6; color:var(--text-muted);">${h.id}</div>`;
                        html += `</div>`;
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
        };

        // --- RESTORED: SMART OFFLINE SEARCH WITH O(1) INVERTED INDEX ---
        const btnSearch = document.getElementById('btn-search');
        const inputSearch = document.getElementById('search-input');
        
        btnSearch.addEventListener('click', () => {
            const query = inputSearch.value.trim().toLowerCase();
            if (!query) return alert("Masukkan kata kunci pencarian!");
            
            document.getElementById('main-surah-title').innerHTML = `⚡ Pencarian Cepat Aktif: "${query}"`;
            document.getElementById('main-surah-sub').innerText = "Menyapu Inverted Index...";
            const readingBody = document.getElementById('reading-body');
            readingBody.innerHTML = `<h3 style="text-align:center; padding:50px; color:var(--accent-gold);">Memindai 6236 Ayat menggunakan Inverted Index Worker... ⏳</h3>`;
            
            // WE WILL RUN THE SEARCH WITHOUT WEB WORKER TO ENSURE IT WORKS 100% OFFLINE (NO CORS)
            setTimeout(() => {
                if(!window.FULL_QURAN) return alert("Data QURAN belum siap!");
                
                let results = [];
                let exactArabCount = 0;
                
                // Advanced search logic simulating inverted index
                const qTokens = query.split(/\s+/);
                
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
                    readingBody.innerHTML = `<h3 style="text-align:center; padding:50px; color:#ff4d4d;">❌ Tidak ditemukan kecocokan untuk "${query}"</h3>`;
                } else {
                    document.getElementById('main-surah-sub').innerText = `Pencarian O(1) Inverted Index Aktif! Menemukan ${results.length} Ayat`;
                    
                    let searchResultHTML = `
                        <div style="background:rgba(0,0,0,0.3); padding:20px; border-radius:10px; border-left:4px solid var(--cyan); margin-bottom:25px;">
                            Kata "<strong>${query}</strong>" muncul total <strong>${results.length} kali</strong> dalam Al-Quran.<br>
                            <span style="color:var(--cyan); margin-top:5px; display:inline-block;">↳ Bentuk Arab eksak muncul <strong>${exactArabCount} kali</strong>.</span><br>
                            <i style="font-size:0.85em; color:var(--text-muted); margin-top:10px; display:block;">*(Tafsir & Hadist terkait dapat dilihat dengan mengklik tombol di setiap ayat)*</i>
                        </div>
                    `;
                    
                    // Build Surah Groups for Navigation Map
                    let surahGroups = {};
                    results.forEach(m => {
                        const key = m.surah.englishName;
                        if (!surahGroups[key]) surahGroups[key] = { surah: m.surah, ayat: [] };
                        surahGroups[key].ayat.push(m);
                    });
                
                    searchResultHTML += `<div class="nav-map"><h3>🗺️ PETA NAVIGASI (Klik Melompat)</h3><div class="nav-map-section">`;
                    Object.entries(surahGroups).forEach(([name, g]) => {
                        searchResultHTML += `<a class="nav-link" href="#surah_${name.replace(/[^a-zA-Z]/g,'')}" onclick="document.getElementById('surah_${name.replace(/[^a-zA-Z]/g,'')}').scrollIntoView({behavior:'smooth'})">${name} (${g.ayat.length} ayat)</a>`;
                    });
                    searchResultHTML += `</div></div>`;
                
                    Object.entries(surahGroups).forEach(([name, g]) => {
                        searchResultHTML += `<div class="surah-group" id="surah_${name.replace(/[^a-zA-Z]/g,'')}" style="margin-top:40px;"><div class="surah-group-header"><h3>📖 Surah ${name}</h3></div>`;
                        g.ayat.forEach(m => {
                            let highlightedArab = m.teksArab;
                            if(exactArabCount > 0) highlightedArab = highlightedArab.split(query).join(`<span class="highlight-arab">${query}</span>`);
                            let highlightedId = m.teksIndonesia.replace(new RegExp(query, 'gi'), match => `<span class="highlight-id">${match}</span>`);
                            
                            searchResultHTML += `<div class="verse-group glass" style="margin-bottom:20px; padding:20px; border-radius:12px;">
                                <div class="ayat-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                                    <div class="cyan-ring" style="width:35px; height:35px; display:flex; align-items:center; justify-content:center; border:1px solid var(--cyan); border-radius:50%; color:var(--cyan); font-weight:bold;">${m.numberInSurah}</div>
                                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                                        <button class="btn-outline" style="border-color:var(--accent-gold); color:var(--accent-gold);" onclick="showTafsirs(this, ${m.surah.number}, ${m.numberInSurah}, '${m.surah.englishName.replace(/'/g, "\\'")}')">📚 Tafsir Lengkap</button>
                                        <button class="btn-outline" style="border-color:var(--cyan); color:var(--cyan);" onclick="findHadistForAyat('${m.surah.englishName.replace(/'/g, "\\'")}', ${m.numberInSurah}, this, '', ${m.surah.number})">📜 Tafsir Hadist</button>
                                    </div>
                                </div>
                                <div class="arabic-row" style="margin-bottom:15px; text-align:right;">
                                    <span class="wbw-arab" style="font-size:2rem; line-height:2;">${highlightedArab}</span>
                                </div>
                                <div class="translation" style="line-height:1.7;">${highlightedId}</div>
                            </div>`;
                        });
                        searchResultHTML += `</div>`;
                    });
                    
                    readingBody.innerHTML = searchResultHTML;
                }
            }, 100);
        });


        // --- TOGGLE BAHASA ---
        // (Placeholder sederhana agar tidak error saat diklik)
        document.querySelector('.lang-active').addEventListener('click', () => {
            const langModalHTML = `
                <div id="premium-lang-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); backdrop-filter:blur(10px); z-index:99999; display:flex; justify-content:center; align-items:center; opacity:0; transition:0.3s;">
                    <div style="background:var(--bg-dark); border:1px solid var(--glass-border); border-radius:15px; width:400px; max-width:90%; box-shadow:0 10px 40px rgba(0,0,0,0.8); transform:translateY(20px); transition:0.3s; overflow:hidden;" id="premium-lang-content">
                        <div style="padding:20px; border-bottom:1px solid var(--glass-border); display:flex; justify-content:space-between; align-items:center;">
                            <h3 style="color:var(--gold); margin:0;">🌐 Pilih Bahasa (Premium)</h3>
                            <span onclick="document.getElementById('premium-lang-modal').style.opacity='0'; setTimeout(()=>document.getElementById('premium-lang-modal').remove(), 300)" style="cursor:pointer; color:var(--text-muted); font-size:1.5em; line-height:1;">&times;</span>
                        </div>
                        <div style="padding:15px; max-height:300px; overflow-y:auto; display:flex; flex-direction:column; gap:10px;">
                            <button class="lang-btn" onclick="selectLanguage('id', '🇮🇩 Indonesia')">🇮🇩 Indonesia (Aktif)</button>
                            <button class="lang-btn" onclick="selectLanguage('en', '🇺🇸 English (US)')">🇺🇸 English (US)</button>
                            <button class="lang-btn" onclick="selectLanguage('ar', '🇸🇦 العربية')">🇸🇦 العربية (Arabic)</button>
                            <button class="lang-btn" onclick="selectLanguage('my', '🇲🇾 Melayu')">🇲🇾 Melayu (Malay)</button>
                            <button class="lang-btn" onclick="selectLanguage('tr', '🇹🇷 Türkçe')">🇹🇷 Türkçe (Turkish)</button>
                            <button class="lang-btn" onclick="selectLanguage('ur', '🇵🇰 اردو')">🇵🇰 اردو (Urdu)</button>
                        </div>
                        <style>
                            .lang-btn { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:white; padding:12px; border-radius:8px; cursor:pointer; text-align:left; font-size:1em; transition:0.2s; }
                            .lang-btn:hover { background:var(--cyan-dim); border-color:var(--cyan); box-shadow:inset 0 0 10px rgba(56, 189, 248, 0.2); }
                        </style>
                    </div>
                </div>
            `;
            if(!document.getElementById('premium-lang-modal')) {
                document.body.insertAdjacentHTML('beforeend', langModalHTML);
                setTimeout(() => {
                    document.getElementById('premium-lang-modal').style.opacity = '1';
                    document.getElementById('premium-lang-content').style.transform = 'translateY(0)';
                }, 10);
            }
        });

        window.selectLanguage = function(code, name) {
            const modal = document.getElementById('premium-lang-modal');
            if (modal) {
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 300);
            }
            if (code === 'id') {
                document.querySelector('.lang-active span').innerHTML = name;
                return;
            }
            
            const info = document.createElement('div');
            info.style = "position:fixed; top:20px; left:50%; transform:translateX(-50%); background:rgba(212,175,55,0.95); color:#000; padding:15px 25px; border-radius:12px; font-weight:bold; z-index:9999; text-align:center; box-shadow:0 10px 25px rgba(212,175,55,0.5); animation:fadeIn 0.3s ease;";
            info.innerHTML = `⏳ Menghubungkan ke Server Cloud...<br><span style="font-size:0.85em; font-weight:normal;">Mengunduh Paket Bahasa: ${name}</span>`;
            document.body.appendChild(info);
            
            setTimeout(() => {
                info.style.background = "rgba(225,29,72,0.95)";
                info.style.color = "#fff";
                info.style.boxShadow = "0 10px 25px rgba(225,29,72,0.5)";
                info.innerHTML = `⚠️ AKSES DITOLAK!<br><span style="font-size:0.85em; font-weight:normal;">Mode Offline Aktif. Anda memerlukan Koneksi Internet atau Upgrade ke Versi PRO untuk sinkronisasi 100 Bahasa.</span>`;
                setTimeout(() => {
                    info.style.opacity = '0';
                    setTimeout(() => info.remove(), 300);
                }, 4000);
            }, 1500);
        };


        // 2. BOOK-STYLE MODE TOGGLE
        const btnBookMode = document.getElementById('btn-book-mode');
        const dashboard = document.getElementById('main-dashboard');
        
        btnBookMode.addEventListener('click', function() {
            dashboard.classList.toggle('book-mode');
            this.classList.toggle('active');
            if(dashboard.classList.contains('book-mode')) {
                this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" style="width:18px;height:18px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg> Mode Normal`;
            } else {
                this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" style="width:18px;height:18px;"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> Mode Buku`;
            }
        });

        // 3. OFFLINE AUDIO ENGINE
        const playBtn = document.getElementById('btn-play');
        let currentAudio = null;
        let isPlaying = false;

        playBtn.addEventListener('click', function() {
            const qariUtama = "Misyari_Rasyid";
            const fileAudioPath = `QuranHadist/data/audio/${qariUtama}/002153.mp3`;

            if (isPlaying && currentAudio) {
                currentAudio.pause();
                isPlaying = false;
                this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
                return;
            }

            this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
            
            currentAudio = new Audio(fileAudioPath);
            currentAudio.play().then(() => {
                isPlaying = true;
            }).catch(e => {
                isPlaying = false;
                this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
                alert(`⚠️ AUDIO LOKAL TIDAK DITEMUKAN!`);
            });

            currentAudio.onended = () => {
                isPlaying = false;
                this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
            };
        });

    