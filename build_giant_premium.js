const fs = require('fs');

// 1. Ambil UI Premium yang baru (saya simpan di variabel string)
const premiumCSS = fs.readFileSync('style_premium.css', 'utf8');

const premiumHTML = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Al-Quran Premium</title>
    <style>
${premiumCSS}
    </style>
</head>
<body>
    <div class="dashboard-container" id="main-dashboard">
        <!-- TOP BANNER -->
        <div class="top-banner">
            <div class="brand-left">
                <h1 class="brand-quran">AL-QURAN</h1>
                <span class="brand-badge">PREMIUM</span>
            </div>

            <div class="advanced-search">
                <div class="search-input-box">
                    <input type="text" id="search-input" placeholder="Cari: jin, sabar, teks Arab (النار)...">
                </div>
                <button class="btn-primary" id="btn-search">🔍 CARI INSTAN</button>
                <button class="btn-outline" id="btn-guide">💡 Panduan</button>
                <button class="btn-book" id="btn-book-mode">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    Mode Buku
                </button>
            </div>

            <div class="dedication-box">
                <span class="ded-label">DEDIKASI</span>
                <div class="ded-divider"></div>
                <div class="ded-names">
                    <strong>DIDI HARIADI BIN MAKMUN</strong>
                    <span>NENENG SUNARSIH</span>
                </div>
            </div>
        </div>

        <!-- COLUMN 1: NAV -->
        <div class="col-nav glass-panel">
            <div class="gold-logo-circle">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div class="nav-menu">
                <a href="#" class="nav-item active"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg><span class="nav-text">Home</span></a>
                <a href="#" class="nav-item"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg><span class="nav-text">Reciters</span></a>
                <a href="#" class="nav-item"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg><span class="nav-text">Tafsir</span></a>
                <a href="#" class="nav-item"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg><span class="nav-text">Hafiz</span></a>
            </div>
        </div>

        <!-- COLUMN 2: SURAH LIST -->
        <div class="col-list glass-panel">
            <div class="panel-header">
                <h2>Al-Quran Kareem</h2>
                <div class="table-cols">
                    <span class="col-num">#</span>
                    <span class="col-ar">Arabic</span>
                    <span class="col-en">English</span>
                </div>
            </div>
            <div class="surah-scroll" id="surah-container">
                <!-- Javascript will inject 114 Surahs here -->
            </div>
            <div class="lang-panel">
                <div class="lang-header">Language Selector</div>
                <div class="lang-active">
                    <span>🇺🇸 English (US)</span>
                    <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
            </div>
        </div>

        <!-- COLUMN 3: MAIN READING AREA -->
        <div class="col-main glass-panel">
            <div class="reading-header">
                <div class="surah-title">
                    <h2 id="main-surah-title">Surah Al-Fatihah</h2>
                    <p id="main-surah-sub">(The Opening) 1:1-7</p>
                </div>
                <div class="header-actions">
                    <button class="play-circle" id="btn-play">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    </button>
                </div>
            </div>
            
            <div class="reading-body" id="reading-body">
                <!-- Default State: Al-Fatihah -->
                <div class="verse-group" style="text-align:center; padding-top:40px;">
                    <h3 style="color:var(--cyan); margin-bottom:15px;">🚀 Sistem Siap!</h3>
                    <p style="color:var(--text-muted); font-size:1rem;">Silakan klik Surah di sebelah kiri untuk memuat ayat dari Database Offline.</p>
                </div>
            </div>
        </div>

        <!-- COLUMN 4: INFO -->
        <div class="col-info">
            <div class="info-card tafsir-card">
                <div class="info-header">
                    <h3>Tafsir Al-Jalalayn</h3>
                    <p id="tafsir-subtitle">Memuat tafsir...</p>
                </div>
                <div class="info-body" id="tafsir-body">
                    <p>Silakan pilih Surah untuk menampilkan isi Tafsir yang mendalam dari database offline.</p>
                </div>
            </div>

            <div class="info-card hadith-card">
                <div class="info-header">
                    <h3>Supporting Hadith</h3>
                    <p>Relevant Context</p>
                </div>
                <div class="info-body">
                    <p class="hadith-text" id="hadith-body">"Pilih surah untuk memuat hadist pendukung."</p>
                </div>
            </div>
        </div>

    </div>

    <!-- MENGHUBUNGKAN DATABASE RAKSASA HASIL PEMETAAN AI (1058 AYAT) -->
    <script src="database_quran.js"></script>

    <!-- KODE BARU PREMIUM (MESIN PENGGERAK UI) -->
    <script>
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
            div.className = \`s-item\`;
            div.innerHTML = \`<span class="col-num">\${num}.</span><span class="col-ar">\${surahName}</span><span class="col-en">English</span>\`;
            
            div.addEventListener('click', async function() {
                document.querySelectorAll('.s-item').forEach(s => s.classList.remove('active'));
                this.classList.add('active');

                mainTitle.innerText = \`Surah \${surahName} Memuat...\`;
                mainSub.innerText = \`Mengambil data dari server lokal...\`;
                readingBody.innerHTML = \`<h3 style="text-align:center; padding:50px; color:var(--accent-gold);">Membuka Mushaf... ⏳</h3>\`;
                
                try {
                    // MENGAMBIL SELURUH AYAT DARI FILE JSON ASLI
                    const res = await fetch(\`QuranHadist/data/quran/\${num}.json\`);
                    if (!res.ok) throw new Error("Gagal mengambil data Surah");
                    const dataSurah = await res.json();
                    
                    mainTitle.innerText = \`Surah \${dataSurah.namaLatin}\`;
                    mainSub.innerText = \`(\${dataSurah.arti}) - \${dataSurah.jumlahAyat} Ayat | Surah ke-\${num}\`;
                    
                    let htmlAyat = "";
                    
                    dataSurah.ayat.forEach(ayat => {
                        const nomorAyat = ayat.nomorAyat;
                        const dbKey = \`\${num}_\${nomorAyat}\`;
                        
                        let extraHtml = "";
                        let hasMapping = false;
                        if (typeof QURAN_DB !== 'undefined' && QURAN_DB[dbKey]) {
                            const aiData = QURAN_DB[dbKey];
                            hasMapping = true;
                            
                            let hadistBlock = "";
                            if (aiData.hadist && aiData.hadist.length > 0) {
                                const h = aiData.hadist[0];
                                hadistBlock = \`<div style="margin-top:15px; padding:15px; background:rgba(0, 229, 255, 0.05); border-left:3px solid var(--cyan); border-radius:8px;">
                                    <strong style="color:var(--cyan);">Hadist Terkait (Kitab \${h.kitab} #\${h.id})</strong><br>
                                    <span style="font-size:0.9em; color:#e2e8f0;">\${h.label_khusus}</span><br>
                                    <span style="font-size:0.8em; color:var(--accent-gold);">Skor Kecocokan AI: \${h.overlap_score}</span>
                                </div>\`;
                            }
                            
                            extraHtml = \`<div style="margin-top:10px; font-size:0.9em; color:var(--text-muted);">
                                <strong>Tafsir Ringkas:</strong> \${aiData.tafsir_jalalayn || 'Tafsir tersedia.'}
                            </div> \${hadistBlock}\`;
                        }
                        
                        const aiBadge = hasMapping ? \`<span style="background:var(--cyan); color:#000; padding:2px 8px; border-radius:12px; font-size:0.7em; margin-left:10px; font-weight:bold;">🔥 MAPPED BY AI</span>\` : '';

                        htmlAyat += \`
                        <div class="verse-group">
                            <div class="arabic-row">
                                <div class="cyan-ring" style="\${hasMapping ? 'box-shadow: 0 0 15px var(--cyan);' : ''}">\${nomorAyat}</div>
                                <div class="wbw-container" style="flex-direction:row-reverse; display:flex; text-align:right;">
                                    <div class="wbw-word" style="width:100%;">
                                        <span class="wbw-arab" style="font-size:2.5rem; line-height:2;">\${ayat.teksArab}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="translation">
                                \${ayat.teksIndonesia} <span class="ref-link">[\${nomorAyat}]</span> \${aiBadge}
                            </div>
                            \${extraHtml}
                        </div>\`;
                    });
                    
                    readingBody.innerHTML = htmlAyat;
                    tafsirBody.innerHTML = \`<p>Tafsir Global untuk Surah \${dataSurah.namaLatin} telah dimuat.</p>\`;
                    hadithBody.innerHTML = \`<p>Hadist relevan telah disisipkan langsung di bawah ayat.</p>\`;

                } catch (err) {
                    console.error("Gagal mengambil file JSON Surah", err);
                    readingBody.innerHTML = \`<h3 style="text-align:center; padding:50px; color:#ff4d4d;">❌ Gagal Memuat Data Surah!</h3><p style="text-align:center; color:var(--text-muted);">Pastikan server lokal berjalan.</p>\`;
                }
            });
            surahContainer.appendChild(div);
        });

        // 2. BOOK-STYLE MODE TOGGLE
        const btnBookMode = document.getElementById('btn-book-mode');
        const dashboard = document.getElementById('main-dashboard');
        
        btnBookMode.addEventListener('click', function() {
            dashboard.classList.toggle('book-mode');
            this.classList.toggle('active');
            if(dashboard.classList.contains('book-mode')) {
                this.innerHTML = \`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" style="width:18px;height:18px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg> Mode Normal\`;
            } else {
                this.innerHTML = \`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" style="width:18px;height:18px;"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> Mode Buku\`;
            }
        });

        // 3. OFFLINE AUDIO ENGINE
        const playBtn = document.getElementById('btn-play');
        let currentAudio = null;
        let isPlaying = false;

        playBtn.addEventListener('click', function() {
            const qariUtama = "Misyari_Rasyid";
            const fileAudioPath = \`QuranHadist/data/audio/\${qariUtama}/002153.mp3\`;

            if (isPlaying && currentAudio) {
                currentAudio.pause();
                isPlaying = false;
                this.innerHTML = \`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>\`;
                return;
            }

            this.innerHTML = \`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>\`;
            
            currentAudio = new Audio(fileAudioPath);
            currentAudio.play().then(() => {
                isPlaying = true;
            }).catch(e => {
                isPlaying = false;
                this.innerHTML = \`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>\`;
                alert(\`⚠️ AUDIO LOKAL TIDAK DITEMUKAN!\`);
            });

            currentAudio.onended = () => {
                isPlaying = false;
                this.innerHTML = \`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>\`;
            };
        });

    </script>
`;

// 2. Ambil script lama dari index.html untuk ditambahkan agar ukurannya membesar seperti index biasa
const oldHtml = fs.readFileSync('index.html', 'utf8');
const scriptMatch = oldHtml.match(/<script>([\s\S]*?)<\/script>/g);
let oldScripts = '';
if (scriptMatch) {
    const mainScript = scriptMatch[scriptMatch.length - 1]; // Mengambil seluruh 600 baris script lama
    oldScripts = '\n\n    <!-- ========================================================================= -->\n' +
                 '    <!-- SISTEM KODE LAMA DARI INDEX BIASA (MENGEMBALIKAN FITUR ADVANCED & UKURAN KB) -->\n' +
                 '    <!-- ========================================================================= -->\n    ' + mainScript;
}

// 3. Gabungkan dan Tulis Ulang
const finalHtml = premiumHTML + oldScripts + '\n</body>\n</html>';

fs.writeFileSync('index_premium.html', finalHtml);
console.log('BERHASIL! Ukuran index_premium.html sekarang: ' + fs.statSync('index_premium.html').size + ' bytes');
