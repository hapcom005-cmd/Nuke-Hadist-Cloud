const fs = require('fs');

const html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AL-QURAN PREMIUM</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-main: #060b14; 
            --bg-sidebar: #0a1120;
            --bg-panel: #0d1527;
            --bg-card: #111a2f;
            --accent-cyan: #00e5ff;
            --accent-cyan-glow: rgba(0, 229, 255, 0.3);
            --accent-cyan-bg: rgba(0, 229, 255, 0.1);
            --accent-yellow: #fbbf24;
            --accent-green: #10b981;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --border-color: #1e293b;
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Outfit', sans-serif; background-color: var(--bg-main); color: var(--text-main); display: flex; height: 100vh; overflow: hidden; }

        /* 1. SIDEBAR KIRI */
        .sidebar { width: 80px; background-color: var(--bg-sidebar); border-right: 1px solid var(--border-color); display: flex; flex-direction: column; align-items: center; padding: 20px 0; z-index: 10; }
        .sidebar-logo { margin-bottom: 30px; width: 40px; height: 40px; background: linear-gradient(135deg, var(--accent-cyan), #0077ff); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 20px; color: #fff; box-shadow: 0 0 15px var(--accent-cyan-glow); }
        .nav-item { width: 100%; padding: 15px 0; display: flex; flex-direction: column; align-items: center; cursor: pointer; color: var(--text-muted); transition: 0.3s; position: relative; }
        .nav-item svg { width: 24px; height: 24px; margin-bottom: 5px; fill: currentColor; }
        .nav-item span { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .nav-item:hover, .nav-item.active { color: var(--accent-cyan); background-color: var(--accent-cyan-bg); }
        .nav-item.active::before { content: ''; position: absolute; left: 0; top: 0; height: 100%; width: 4px; background-color: var(--accent-cyan); box-shadow: 0 0 10px var(--accent-cyan); }

        /* 2. DAFTAR SURAH */
        .surah-list-panel { width: 320px; background-color: var(--bg-panel); border-right: 1px solid var(--border-color); display: flex; flex-direction: column; position: relative; }
        .panel-header { padding: 20px; border-bottom: 1px solid var(--border-color); }
        .panel-header h2 { font-size: 18px; font-weight: 800; letter-spacing: 1px; margin-bottom: 15px; display:flex; align-items:center; gap:10px; }
        .offline-badge { font-size: 9px; background: var(--accent-cyan); color: #000; padding: 3px 6px; border-radius: 4px; font-weight: 800; }
        .search-box { width: 100%; background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 15px; color: white; font-family: 'Outfit'; outline: none; font-size: 14px; transition: 0.3s; }
        .search-box:focus { border-color: var(--accent-cyan); box-shadow: 0 0 10px var(--accent-cyan-glow); }
        .surah-table-header { display: grid; grid-template-columns: 30px 1fr 60px; padding: 10px 20px; font-size: 12px; color: var(--text-muted); font-weight: 600; border-bottom: 1px solid var(--border-color); background: rgba(0,0,0,0.2); }
        .surah-list-container { flex-grow: 1; overflow-y: auto; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg-main); }
        ::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--accent-cyan); }
        .surah-item { display: grid; grid-template-columns: 30px 1fr 60px; padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.02); cursor: pointer; transition: 0.2s; align-items: center; }
        .surah-item:hover, .surah-item.active { background-color: var(--accent-cyan-bg); border-left: 3px solid var(--accent-cyan); padding-left: 17px; }
        .surah-number { font-size: 12px; color: var(--text-muted); }
        .surah-item.active .surah-number { color: var(--accent-cyan); }
        .surah-name { display: flex; flex-direction: column; }
        .surah-name-id { font-size: 14px; font-weight: 600; color: var(--text-main); margin-bottom: 2px; }
        .surah-item.active .surah-name-id { color: var(--accent-cyan); }
        .surah-name-ar { font-family: 'Amiri', serif; font-size: 18px; color: var(--accent-yellow); text-align: right; }
        .surah-meaning { font-size: 11px; color: var(--text-muted); }
        .language-selector { padding: 15px 20px; border-top: 1px solid var(--border-color); background: rgba(0,0,0,0.3); display: flex; flex-direction: column; gap: 8px; }
        .language-selector label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
        .language-select { width: 100%; background: var(--bg-main); border: 1px solid var(--border-color); color: white; padding: 8px 12px; border-radius: 6px; font-family: 'Outfit'; outline: none; cursor: pointer; }

        /* 3. PEMBACA AYAT */
        .main-reader { flex-grow: 1; display: flex; flex-direction: column; position: relative; background: var(--bg-main); }
        .reader-header { padding: 20px 40px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; background: var(--bg-panel); }
        .reader-title-box { display: flex; flex-direction: column; }
        .reader-title { font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 4px; display:flex; align-items:center; gap:10px;}
        .reader-subtitle { font-size: 13px; color: var(--text-muted); font-weight: 600; letter-spacing: 0.5px; }
        .play-btn { background: linear-gradient(45deg, var(--accent-cyan), #0077ff); color: #000; border: none; padding: 10px 20px; border-radius: 20px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px var(--accent-cyan-glow); transition: 0.3s; }
        .play-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px var(--accent-cyan-glow); }
        .ayat-container { flex-grow: 1; padding: 30px 40px; overflow-y: auto; scroll-behavior: smooth; }
        .bismillah { text-align: center; font-family: 'Amiri', serif; font-size: 32px; color: var(--accent-yellow); margin-bottom: 40px; text-shadow: 0 2px 10px rgba(251, 191, 36, 0.3); }
        .ayat-card { background: var(--bg-card); border: 1px solid var(--accent-cyan); border-radius: 16px; padding: 25px; margin-bottom: 25px; box-shadow: 0 0 15px var(--accent-cyan-glow); position: relative; transition: 0.3s; }
        .ayat-card:hover { box-shadow: 0 0 25px rgba(0, 229, 255, 0.4); transform: translateY(-2px); }
        .ayat-number-circle { position: absolute; right: -15px; top: -15px; width: 35px; height: 35px; background: var(--bg-main); border: 2px solid var(--accent-cyan); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--accent-cyan); font-weight: 800; font-size: 14px; box-shadow: 0 0 10px var(--accent-cyan-glow), inset 0 0 10px var(--accent-cyan-glow); }
        .ayat-arab { font-family: 'Amiri', serif; font-size: 36px; color: #fff; text-align: right; line-height: 1.8; margin-bottom: 20px; padding-right: 20px; }
        .ayat-latin { color: var(--accent-cyan); font-size: 15px; line-height: 1.6; margin-bottom: 10px; font-weight: 500; }
        .ayat-arti { color: var(--text-main); font-size: 15px; line-height: 1.6; margin-bottom: 20px; }
        .action-buttons { display: flex; gap: 10px; }
        .action-btn { background: var(--accent-cyan-bg); border: 1px solid var(--accent-cyan); color: var(--accent-cyan); padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 6px; }
        .action-btn:hover { background: var(--accent-cyan); color: #000; box-shadow: 0 0 15px var(--accent-cyan-glow); }
        
        /* 4. PANEL TAFSIR & HADIST */
        .context-panel { width: 0; background-color: var(--bg-panel); border-left: 1px solid var(--border-color); display: flex; flex-direction: column; transition: width 0.3s ease; overflow: hidden; }
        .context-panel.active { width: 400px; flex-shrink: 0; }
        .context-header { padding: 20px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
        .context-header h3 { font-size: 16px; font-weight: 800; color: #fff; display:flex; align-items:center; gap:8px;}
        .close-btn { background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:20px; transition:0.2s;}
        .close-btn:hover { color: #ef4444; }
        .context-content { flex-grow: 1; overflow-y: auto; padding: 20px; width: 400px; }
        .kitab-selector { background: rgba(251, 191, 36, 0.1); border: 1px solid var(--accent-yellow); color: var(--accent-yellow); padding: 10px 15px; border-radius: 8px; width: 100%; display: flex; justify-content: space-between; align-items: center; font-family: 'Outfit'; font-weight: 600; cursor: pointer; margin-bottom: 20px; }
        .kitab-selector:hover { background: rgba(251, 191, 36, 0.2); }
        .tafsir-text { color: var(--text-main); font-size: 14px; line-height: 1.7; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px dashed var(--border-color); }
        .hadist-btn { background: rgba(16, 185, 129, 0.1); border: 1px solid var(--accent-green); color: var(--accent-green); padding: 10px 15px; border-radius: 8px; width: 100%; font-weight: 600; cursor: pointer; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.3s; }
        .hadist-btn:hover { background: var(--accent-green); color: #000; box-shadow: 0 0 15px rgba(16, 185, 129, 0.4); }

        /* DEDIKASI */
        .top-brand-dedikasi { position: absolute; top: 15px; right: 40px; z-index: 50; display: flex; align-items: center; gap: 15px; }
        .brand-text { font-size: 20px; font-weight: 900; color: var(--accent-cyan); letter-spacing: 2px; text-shadow: 0 0 10px var(--accent-cyan-glow); }
        .dedikasi-box { display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.5); padding: 5px 15px; border-radius: 20px; border: 1px solid var(--border-color); }
        .dedikasi-label { font-size: 10px; color: var(--accent-yellow); font-weight: 800; text-transform: uppercase; }
        .dedikasi-names { font-size: 11px; color: #fff; font-weight: 600; display:flex; flex-direction:column; line-height:1.2; border-left:1px solid rgba(255,255,255,0.2); padding-left:10px;}
        
        #loadingOverlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(6, 11, 20, 0.95); z-index: 9999; display: flex; flex-direction: column; justify-content: center; align-items: center; backdrop-filter: blur(10px); }
        .loader { width: 60px; height: 60px; border: 4px solid rgba(0,229,255,0.1); border-top-color: var(--accent-cyan); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div id="loadingOverlay">
        <div class="loader"></div>
        <h2 style="color:var(--accent-cyan); margin-bottom:10px;">MEMUAT DATA AL-QURAN...</h2>
        <p style="color:var(--text-muted); font-size:14px;" id="loadingText">Sedang menyinkronkan 114 Surah (Mode Offline)</p>
    </div>

    <div class="top-brand-dedikasi">
        <div class="brand-text">AL-QURAN PREMIUM</div>
        <div class="dedikasi-box">
            <span class="dedikasi-label">Dedikasi</span>
            <div class="dedikasi-names">
                <span>DIDI HARIADI BIN MAKMUN</span>
                <span style="color:var(--text-muted); font-size:9px;">NENENG SUNARSIH</span>
            </div>
        </div>
    </div>

    <!-- 1. SIDEBAR KIRI -->
    <div class="sidebar">
        <div class="sidebar-logo">AQ</div>
        <div class="nav-item" onclick="alert('Fitur Home akan segera hadir!')">
            <svg viewBox="0 0 24 24"><path d="M12 3l8 6v12h-5v-7h-6v7H4V9l8-6z"/></svg><span>Home</span>
        </div>
        <div class="nav-item active">
            <svg viewBox="0 0 24 24"><path d="M4 6H2v14a2 2 0 0 0 2 2h14v-2H4V6zm16-4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm0 16H8V4h12v14zM10 9h8v2h-8zm0 3h4v2h-4z"/></svg><span>Al-Qur'an</span>
        </div>
        <div class="nav-item" onclick="alert('Fitur Hadist Global akan segera hadir!')">
            <svg viewBox="0 0 24 24"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zM21 18.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/></svg><span>Hadist</span>
        </div>
        <div class="nav-item" onclick="alert('Fitur Komunitas akan segera hadir!')">
            <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg><span>Komunitas</span>
        </div>
    </div>

    <!-- 2. DAFTAR SURAH -->
    <div class="surah-list-panel">
        <div class="panel-header">
            <h2>Al-Qur'an <span class="offline-badge">OFFLINE</span></h2>
            <input type="text" class="search-box" placeholder="Cari Surah (Contoh: Yasin)..." id="searchInput">
        </div>
        <div class="surah-table-header"><span>#</span><span>Surah</span><span style="text-align:right;">Arab</span></div>
        <div class="surah-list-container" id="surahList"></div>
        <div class="language-selector">
            <label>Language Selector</label>
            <select class="language-select" id="langSelect"><option value="id">🇮🇩 Indonesia</option></select>
        </div>
    </div>

    <!-- 3. PEMBACA AYAT -->
    <div class="main-reader">
        <div class="reader-header" id="readerHeader" style="display:none;">
            <div class="reader-title-box">
                <div class="reader-title" id="rtTitle">Surah ...</div>
                <div class="reader-subtitle" id="rtSubtitle">... Ayat | Surah ke-...</div>
            </div>
            <button class="play-btn" id="playSurahBtn" onclick="togglePlaySurah()"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Putar Surah</button>
            <audio id="globalAudioPlayer" style="display:none;"></audio>
        </div>
        <div class="ayat-container" id="ayatContainer">
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:var(--text-muted); opacity:0.5;">
                <svg viewBox="0 0 24 24" width="80" height="80" fill="currentColor" style="margin-bottom:20px;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
                <h3>Silakan Pilih Surah di Panel Kiri</h3>
                <p>Ensiklopedia Al-Quran & Hadist Terpadu</p>
            </div>
        </div>
    </div>

    <!-- 4. PANEL TAFSIR & HADIST -->
    <div class="context-panel" id="contextPanel">
        <div class="context-header">
            <h3><span style="color:var(--accent-cyan);">📚 Tafsir:</span> Kemenag RI</h3>
            <button class="close-btn" onclick="closeContextPanel()">×</button>
        </div>
        <div class="context-content">
            <div class="kitab-selector">
                <span>Kitab: Tafsir Tahlili (Kemenag)</span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
            </div>
            <div id="tafsirContent" class="tafsir-text">Pilih ayat untuk melihat tafsirnya.</div>
            <h4 style="color:#fff; margin-bottom:15px;">Supporting Hadith</h4>
            <button class="hadist-btn"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg> Hadist 9 Imam (Relevan)</button>
            <div id="hadistContent" class="tafsir-text" style="border:none;">(Fungsi sinkronisasi Hadist akan disempurnakan sesuai perintah Bos)</div>
        </div>
    </div>

    <script>
        const DOM = {
            loading: document.getElementById('loadingOverlay'),
            surahList: document.getElementById('surahList'),
            ayatContainer: document.getElementById('ayatContainer'),
            searchInput: document.getElementById('searchInput'),
            readerHeader: document.getElementById('readerHeader'),
            rtTitle: document.getElementById('rtTitle'),
            rtSubtitle: document.getElementById('rtSubtitle'),
            contextPanel: document.getElementById('contextPanel'),
            tafsirContent: document.getElementById('tafsirContent'),
            hadistContent: document.getElementById('hadistContent'),
            audioPlayer: document.getElementById('globalAudioPlayer')
        };
        let metaData = [];
        let currentSurah = null;

        function loadScript(src) {
            return new Promise((resolve, reject) => {
                const s = document.createElement('script');
                s.src = src;
                s.onload = resolve;
                s.onerror = reject;
                document.head.appendChild(s);
            });
        }

        async function initApp() {
            try {
                if(!window.QURAN_META) await loadScript('QuranHadist/data/meta.js');
                metaData = window.QURAN_META;
                
                // Preload Hadith Mapping (Silent)
                if(!window.HADITH_MAPPING) loadScript('QuranHadist/data/mapping_hadist_semantik_12core.js').catch(e=>{});
                
                renderSurahList(metaData);
                DOM.loading.style.display = 'none';
            } catch(e) {
                console.error("Gagal load meta:", e);
                DOM.loading.innerHTML = '<div style="color:#ef4444; font-size:40px; margin-bottom:20px;">⚠️</div><h2 style="color:#ef4444;">GAGAL MEMUAT DATA OFFLINE</h2><p>Pastikan file JS tersedia.</p>';
            }
        }

        function renderSurahList(data) {
            DOM.surahList.innerHTML = '';
            data.forEach(s => {
                const div = document.createElement('div');
                div.className = 'surah-item';
                div.onclick = () => loadSurah(s.nomor, div);
                div.innerHTML = \`<div class="surah-number">\${s.nomor}</div><div class="surah-name"><span class="surah-name-id">\${s.namaLatin}</span><span class="surah-meaning">\${s.arti} • \${s.jumlahAyat} Ayat</span></div><div class="surah-name-ar">\${s.nama}</div>\`;
                DOM.surahList.appendChild(div);
            });
        }

        async function loadSurah(nomor, element) {
            document.querySelectorAll('.surah-item').forEach(el => el.classList.remove('active'));
            if(element) element.classList.add('active');
            const surahMeta = metaData.find(s => s.nomor == nomor);
            if(!surahMeta) return;

            DOM.readerHeader.style.display = 'flex';
            DOM.rtTitle.innerHTML = \`Surah \${surahMeta.namaLatin} <span style="font-family:'Amiri'; color:var(--accent-yellow); font-weight:normal; margin-left:15px; font-size:30px;">\${surahMeta.nama}</span>\`;
            DOM.rtSubtitle.innerText = \`(\${surahMeta.arti}) - \${surahMeta.jumlahAyat} Ayat | Surah ke-\${surahMeta.nomor}\`;
            DOM.ayatContainer.innerHTML = '<div style="text-align:center; padding:50px; color:var(--accent-cyan);">Memuat ayat...</div>';
            closeContextPanel();

            try {
                window.QURAN_SURAH = window.QURAN_SURAH || {};
                if(!window.QURAN_SURAH[nomor]) await loadScript(\`QuranHadist/data/quran_js/\${nomor}.js\`);
                const data = window.QURAN_SURAH[nomor];
                currentSurah = data;
                renderAyat(data.ayat, surahMeta);
            } catch(e) {
                DOM.ayatContainer.innerHTML = '<div style="color:#ef4444; padding:20px;">Gagal memuat isi surah.</div>';
            }
        }

        function renderAyat(ayatList, surahMeta) {
            DOM.ayatContainer.innerHTML = '';
            if(surahMeta.nomor != 1 && surahMeta.nomor != 9) {
                const basmalah = document.createElement('div');
                basmalah.className = 'bismillah'; basmalah.innerText = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
                DOM.ayatContainer.appendChild(basmalah);
            }
            ayatList.forEach(a => {
                const div = document.createElement('div');
                div.className = 'ayat-card';
                div.innerHTML = \`<div class="ayat-number-circle">\${a.nomorAyat}</div><div class="ayat-arab">\${a.teksArab}</div><div class="ayat-latin">\${a.teksLatin}</div><div class="ayat-arti">\${a.teksIndonesia}</div><div class="action-buttons"><button class="action-btn" onclick="showTafsir(\${surahMeta.nomor}, \${a.nomorAyat})"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg> Tafsir & Hadist</button><button class="action-btn" onclick="playAyat('\${a.audio['01']}')"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Putar</button></div>\`;
                DOM.ayatContainer.appendChild(div);
            });
        }

        async function showTafsir(surahNo, ayatNo) {
            DOM.contextPanel.classList.add('active');
            DOM.tafsirContent.innerHTML = '<div style="color:var(--accent-cyan); text-align:center;">Mencari takarir Tafsir...</div>';
            DOM.hadistContent.innerHTML = '<div style="color:var(--accent-cyan); text-align:center;">Mencari Hadist relevan...</div>';
            
            // 1. TAFSIR LOGIC
            try {
                window.TAFSIR_DATA = window.TAFSIR_DATA || {};
                if(!window.TAFSIR_DATA[surahNo]) await loadScript(\`QuranHadist/data/tafsir_js/\${surahNo}.js\`);
                const data = window.TAFSIR_DATA[surahNo];
                const t = data.kemenag ? data.kemenag[ayatNo] : null;
                if(t) DOM.tafsirContent.innerHTML = \`<strong style="color:var(--accent-yellow); display:block; margin-bottom:10px;">Surah \${surahNo} Ayat \${ayatNo}</strong>\${t.replace(/\\n/g, '<br><br>')}\`;
                else DOM.tafsirContent.innerHTML = 'Tafsir Kemenag tidak ditemukan untuk ayat ini.';
            } catch(e) {
                DOM.tafsirContent.innerHTML = '<span style="color:#ef4444;">Gagal memuat file tafsir.</span>';
            }
            
            // 2. HADITH LOGIC (Semantic Mapping)
            try {
                if(!window.HADITH_MAPPING) {
                    DOM.hadistContent.innerHTML = '<span style="color:#ef4444;">Mapping Hadist belum dimuat.</span>';
                    return;
                }
                const key = \`\${surahNo}_\${ayatNo}\`;
                const mapping = window.HADITH_MAPPING[key];
                if(mapping && mapping.length > 0) {
                    let html = \`<h4 style="color:var(--accent-cyan); margin-bottom:10px;">\${mapping.length} Hadist Relevan Ditemukan</h4>\`;
                    mapping.forEach(m => {
                        html += \`
                        <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; margin-bottom:10px; border-left:3px solid var(--accent-cyan);">
                            <div style="color:var(--accent-yellow); font-weight:bold; font-size:14px; margin-bottom:5px;">Kitab: \${m.kitab.toUpperCase()} (ID: \${m.id})</div>
                            <div style="color:#aaa; font-size:12px;">Skor Relevansi: \${m.overlap_score} | \${m.label_khusus}</div>
                        </div>\`;
                    });
                    html += '<div style="margin-top:15px; font-size:12px; color:#888;">*Catatan: Modul pemuatan teks asli (Arab/Indo) Hadist sedang dalam penyempurnaan offline.</div>';
                    DOM.hadistContent.innerHTML = html;
                } else {
                    DOM.hadistContent.innerHTML = '<span style="color:#aaa;">Tidak ada referensi Hadist langsung yang dipetakan untuk ayat ini.</span>';
                }
            } catch(e) {
                DOM.hadistContent.innerHTML = '<span style="color:#ef4444;">Terjadi kesalahan sistem Hadist.</span>';
            }
        }

        function closeContextPanel() { DOM.contextPanel.classList.remove('active'); }
        function playAyat(url) { DOM.audioPlayer.src = url; DOM.audioPlayer.play(); }

        let isPlayingSurah = false;
        function togglePlaySurah() {
            if(!currentSurah) return;
            const btn = document.getElementById('playSurahBtn');
            if(isPlayingSurah) { DOM.audioPlayer.pause(); btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Putar Surah'; isPlayingSurah = false; } 
            else { DOM.audioPlayer.src = currentSurah.audioFull['01']; DOM.audioPlayer.play(); btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> Jeda Putar'; isPlayingSurah = true; }
        }

        DOM.searchInput.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            const items = DOM.surahList.querySelectorAll('.surah-item');
            items.forEach(item => {
                const text = item.innerText.toLowerCase();
                if(text.includes(val)) item.style.display = 'grid';
                else item.style.display = 'none';
            });
        });

        window.onload = initApp;
    </script>
</body>
</html>`;

fs.writeFileSync('index_premium.html', html);
console.log("SUKSES: index_premium.html berhasil di-rebuild dengan layout baru yang mewah sesuai screenshot!");
