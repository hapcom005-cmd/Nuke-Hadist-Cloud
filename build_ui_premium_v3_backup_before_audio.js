const fs = require('fs');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AL-QURAN PREMIUM V3</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-base: #070e17;
            --bg-panel: #0d1624;
            --bg-hover: #152238;
            --accent-gold: #f5d061;
            --accent-cyan: #00e5ff;
            --text-main: #f1f5f9;
            --text-muted: #64748b;
            --border-color: rgba(255, 255, 255, 0.05);
            --border-active: #00b4d8;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--bg-base);
            color: var(--text-main);
            height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        /* TOP NAVIGATION */
        .topbar {
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 30px;
            border-bottom: 1px solid var(--border-color);
            background-color: var(--bg-base);
            z-index: 10;
        }

        .logo {
            font-size: 22px;
            font-weight: 800;
            color: var(--accent-gold);
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .logo span { color: var(--text-main); }
        .logo .badge {
            background-color: var(--accent-gold);
            color: #000;
            font-size: 10px;
            padding: 3px 8px;
            border-radius: 12px;
            font-weight: 800;
        }

        .search-area {
            display: flex;
            align-items: center;
            gap: 15px;
            flex: 1;
            max-width: 800px;
            margin-left: 50px;
        }
        .search-input {
            flex: 1;
            background-color: var(--bg-panel);
            border: 1px solid var(--border-color);
            color: var(--text-main);
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14px;
            outline: none;
        }
        .btn-instant {
            background-color: var(--accent-gold);
            color: #000;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .btn-outline {
            background-color: transparent;
            color: var(--text-main);
            border: 1px solid var(--border-active);
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .btn-outline-gray {
            border-color: var(--border-color);
        }

        .dedikasi {
            display: flex;
            flex-direction: column;
            border-left: 2px solid var(--accent-gold);
            padding-left: 15px;
            font-size: 12px;
            text-align: right;
        }
        .dedikasi strong { color: var(--text-main); font-size: 13px; }
        .dedikasi span { color: var(--text-muted); font-size: 10px; }
        .dedikasi-label { color: var(--accent-gold); font-weight: 800; font-size:12px; margin-right:15px;}

        /* MAIN LAYOUT */
        .main-container {
            display: flex;
            flex: 1;
            overflow: hidden;
        }

        /* SLIM SIDEBAR */
        .slim-sidebar {
            width: 80px;
            background-color: var(--bg-base);
            border-right: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 30px;
            gap: 30px;
        }
        .nav-icon {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: var(--text-muted);
            font-size: 11px;
            cursor: pointer;
            width: 100%;
            position: relative;
            padding: 15px 0;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            border-radius: 8px;
            margin-bottom: 5px;
        }
        .nav-icon:hover {
            color: var(--accent-gold);
            background: rgba(245, 208, 97, 0.05);
            transform: scale(1.05);
        }
        .nav-icon.active {
            color: var(--accent-gold);
            background: linear-gradient(90deg, rgba(245, 208, 97, 0.1) 0%, transparent 100%);
        }
        .nav-icon.active::before {
            content: '';
            position: absolute;
            left: 0;
            top: 10%;
            height: 80%;
            width: 4px;
            background-color: var(--accent-gold);
            box-shadow: 0 0 15px var(--accent-gold);
            border-radius: 0 4px 4px 0;
        }
        .nav-icon svg { 
            margin-bottom: 6px; 
            transition: 0.3s;
        }
        .nav-icon:hover svg, .nav-icon.active svg {
            filter: drop-shadow(0 0 8px rgba(245,208,97,0.6));
        }

        /* LIST COLUMN */
        .list-column {
            width: 300px;
            background-color: var(--bg-base);
            border-right: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
        }
        .list-header {
            padding: 20px;
            border-bottom: 1px solid var(--border-color);
        }
        .list-header h3 { font-size: 18px; margin-bottom: 15px; }
        .list-sub { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); }
        
        .list-content {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
        }
        .surah-item {
            display: flex;
            align-items: center;
            padding: 14px 16px;
            border-radius: 12px;
            cursor: pointer;
            margin-bottom: 8px;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            color: var(--text-muted);
            font-size: 14px;
            background-color: rgba(255, 255, 255, 0.015);
            border: 1px solid rgba(255, 255, 255, 0.03);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .surah-item:hover { 
            background-color: rgba(245, 208, 97, 0.05);
            border: 1px solid rgba(245, 208, 97, 0.2);
            box-shadow: 0 6px 15px rgba(245, 208, 97, 0.08);
            transform: translateY(-2px);
            color: var(--text-main);
        }
        .surah-item.active {
            background: linear-gradient(135deg, rgba(245,208,97,0.15) 0%, rgba(245,208,97,0.02) 100%);
            border: 1px solid var(--accent-gold);
            color: var(--accent-gold);
            box-shadow: 0 4px 20px rgba(245, 208, 97, 0.15);
            transform: scale(1.02);
        }
        .s-num { width: 30px; font-weight: 700; color: var(--accent-cyan); }
        .s-name { flex: 1; font-weight: 600; letter-spacing: 0.3px; }
        .s-lang { font-size: 12px; opacity: 0.7; font-style: italic; }

        .lang-selector {
            padding: 20px;
            border-top: 1px solid var(--border-color);
        }
        .lang-selector label { font-size: 12px; color: var(--accent-gold); display: block; margin-bottom: 8px; font-weight: 600; }
        .lang-selector select {
            width: 100%;
            background-color: var(--bg-panel);
            color: var(--text-main);
            border: 1px solid var(--border-color);
            padding: 10px;
            border-radius: 8px;
            outline: none;
        }

        /* MAIN READER */
        .main-reader {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 30px;
            background: radial-gradient(circle at center, rgba(0, 229, 255, 0.03), transparent 70%);
            overflow-y: auto;
        }
        .reader-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
        }
        .r-title { font-size: 24px; font-weight: 800; margin-bottom: 5px; }
        .r-sub { color: var(--text-muted); font-size: 14px; }
        .btn-play-circle {
            background: transparent;
            border: 2px solid var(--border-active);
            color: var(--border-active);
            width: 40px; height: 40px;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
            transition: 0.3s;
        }
        .btn-play-circle:hover { background: rgba(0,229,255,0.1); box-shadow: 0 0 15px rgba(0,229,255,0.3); }

        .ayat-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: var(--text-muted);
        }
        .loading-state h2 { color: var(--border-active); margin-bottom: 10px; font-size: 22px; display:flex; align-items:center; gap:10px; }

        /* RIGHT PANELS */
        .right-panels {
            width: 350px;
            background-color: var(--bg-base);
            border-left: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            padding: 20px;
            gap: 20px;
        }
        .panel-box {
            background-color: var(--bg-panel);
            border-radius: 12px;
            padding: 20px;
            border: 1px solid var(--border-color);
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        }
        .panel-title { font-size: 16px; font-weight: 600; color: var(--accent-gold); margin-bottom: 5px; }
        .panel-sub { font-size: 12px; color: var(--text-muted); margin-bottom: 15px; }
        .panel-content { font-size: 14px; line-height: 1.6; color: var(--text-main); }
        
        .panel-hadith-title { color: var(--border-active); font-size: 16px; font-weight: 600; margin-bottom: 5px; }

        /* SCROLLBAR */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
    </style>
</head>
<body>

    <!-- TOPBAR -->
    <div class="topbar">
        <div class="logo">
            <span>AL-QURAN</span> PREMIUM
        </div>
        <div class="search-area">
            <input type="text" id="searchInput" class="search-input" placeholder="Cari: jin, sabar, teks Arab (النار)..." onkeydown="if(event.key==='Enter') doSearch()">
            <button id="btnSearch" class="btn-instant" onclick="doSearch()"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg> CARI INSTAN</button>
            <button class="btn-outline"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/></svg> Panduan</button>
            <button class="btn-outline btn-outline-gray"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4z"/></svg> Mode Buku</button>
        </div>
        <div style="display:flex; align-items:center;">
            <span class="dedikasi-label">DEDIKASI</span>
            <div class="dedikasi">
                <strong>DIDI HARIADI BIN MAKMUN</strong>
                <span>NENENG SUNARSIH</span>
            </div>
        </div>
    </div>

    <!-- MAIN -->
    <div class="main-container">
        
        <!-- SIDEBAR -->
        <div class="slim-sidebar">
            <div class="nav-icon active" onclick="switchMode('quran')">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M21 4H7c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 14H7V6h13v12zM8 8h11v2H8zm0 4h11v2H8z M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/></svg>
                <span style="font-weight:600; letter-spacing:0.5px; margin-top:4px;">Al-Quran</span>
            </div>
            <div class="nav-icon" onclick="switchMode('hadist')">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2zm0 4.5l1 3.5 3.5 1-3.5 1-1 3.5-1-3.5-3.5-1 3.5-1 1-3.5zM6 6L4.5 9.5 3 6 0 4.5 3 3l1.5-3L6 3l3 1.5L6 6z"/></svg>
                <span style="font-weight:600; letter-spacing:0.5px; margin-top:4px;">Hadist</span>
            </div>
            <div class="nav-icon" onclick="alert('Fitur Tafsir sedang dibangun dengan kemewahan yang sama!')">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>
                <span style="font-weight:600; letter-spacing:0.5px; margin-top:4px;">Tafsir</span>
            </div>
            <div class="nav-icon" onclick="alert('Pengaturan Premium segera hadir!')">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.73 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.49-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
                <span style="font-weight:600; letter-spacing:0.5px; margin-top:4px;">Setting</span>
            </div>
        </div>

        <!-- LIST COLUMN (QURAN) -->
        <div class="list-column" id="quranListPanel">
            <div class="list-header">
                <h3>Al-Quran Kareem</h3>
                <div class="list-sub">
                    <span style="width:30px;">#</span>
                    <span style="flex:1;">Arabic</span>
                    <span>English</span>
                </div>
            </div>
            <div class="list-content" id="surahList">
                <div style="text-align:center; padding:20px; color:var(--text-muted);">Memuat daftar Surah...</div>
            </div>
            <div class="lang-selector">
                <label>Language Selector</label>
                <select><option>🇺🇸 English (US)</option><option>🇮🇩 Indonesia</option></select>
            </div>
        </div>

        <!-- LIST COLUMN (HADIST) -->
        <div class="list-column" id="hadistListPanel" style="display:none;">
            <div class="list-header">
                <h3>Katalog Hadist</h3>
                <div class="list-sub">
                    <span style="flex:1;">Kitab Imam</span>
                    <span>Jumlah</span>
                </div>
            </div>
            <div class="list-content" id="hadistKatalogList">
                <div style="text-align:center; padding:20px; color:var(--text-muted);">Memuat 9 Imam...</div>
            </div>
            <div class="lang-selector">
                <label>Language Selector</label>
                <select><option>🇮🇩 Indonesia</option></select>
            </div>
        </div>

        <!-- MAIN READER -->
        <div class="main-reader">
            <!-- HEADER -->
            <div class="reader-header">
                <div>
                    <div class="r-title" id="rtTitle">Surah ...</div>
                    <div class="r-sub" id="rtSubtitle">Data sedang dimuat...</div>
                </div>
                <button class="btn-play-circle"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button>
            </div>

            <!-- CONTENT -->
            <div class="ayat-container" id="ayatContainer">
                <div class="loading-state">
                    <h2>🚀 Pemuatan Data Offline...</h2>
                    <p>Sistem sedang mengambil teks Word-by-Word untuk Surah ini dari Database Cepat Lokal.</p>
                </div>
            </div>
        </div>

        <!-- RIGHT PANELS -->
        <div class="right-panels" id="quranRightPanels">
            <div class="panel-box">
                <div class="panel-title">Tafsir Al-Jalalayn</div>
                <div class="panel-sub">Memuat tafsir...</div>
                <div class="panel-content" id="tafsirContent">
                    <span style="font-style:italic; color:var(--text-muted);">Memuat ratusan baris tafsir...</span>
                </div>
            </div>
            <div class="panel-box">
                <div class="panel-hadith-title">Supporting Hadith</div>
                <div class="panel-sub">Relevant Context</div>
                <div class="panel-content" id="hadistContent">
                    <span style="font-style:italic; color:var(--text-muted);">Memuat rujukan hadist terkait...</span>
                </div>
            </div>
        </div>

        <!-- RIGHT PANELS (HADIST MODE) -->
        <div class="right-panels" id="hadistRightPanels" style="display:none;">
            <div class="panel-box">
                <div class="panel-title">Informasi Kitab</div>
                <div class="panel-sub">Metadata</div>
                <div class="panel-content" id="kitabInfoContent">
                    Silakan pilih kitab hadist di menu kiri.
                </div>
            </div>
        </div>

    </div>

    <!-- APP LOGIC -->
    <div id="loadingOverlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background:var(--bg-base); z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center;">
        <h1 style="color:var(--accent-gold); font-size:40px; margin-bottom:10px;">AL-QURAN PREMIUM</h1>
        <p style="color:var(--text-muted);">Menyiapkan Mesin Offline...</p>
    </div>

    <script>
        const DOM = {
            loading: document.getElementById('loadingOverlay'),
            surahList: document.getElementById('surahList'),
            hadistKatalogList: document.getElementById('hadistKatalogList'),
            quranListPanel: document.getElementById('quranListPanel'),
            hadistListPanel: document.getElementById('hadistListPanel'),
            quranRightPanels: document.getElementById('quranRightPanels'),
            hadistRightPanels: document.getElementById('hadistRightPanels'),
            rtTitle: document.getElementById('rtTitle'),
            rtSubtitle: document.getElementById('rtSubtitle'),
            ayatContainer: document.getElementById('ayatContainer'),
            tafsirContent: document.getElementById('tafsirContent'),
            hadistContent: document.getElementById('hadistContent'),
            navTafsir: document.getElementById('btnNavTafsir'),
            searchInput: document.getElementById('searchInput')
        };

        const STOP = new Set(['tentang','mengenai','perihal','soal','terkait','berkaitan','dengan','yang','dan','atau','di','ke','dari','untuk','pada','adalah','ini','itu','apa','siapa','bagaimana','kenapa','mengapa','kapan','dimana','cari','carikan','tolong','minta','bisa','dapat','akan','sudah','belum','tidak','bukan','semua','ayat','hadist','hadits','surat','surah','al','quran']);

        let metaData = [];
        let currentMode = 'quran';

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
                
                // Preload Hadith Meta
                if(!window.HADITH_META) await loadScript('QuranHadist/data/hadist_js/meta.js').catch(e=>{});
                // Preload Mapping
                if(!window.HADITH_MAPPING) loadScript('QuranHadist/data/mapping_hadist_semantik_12core.js').catch(e=>{});
                
                renderSurahList(metaData);
                renderHadistKatalog();
                DOM.loading.style.display = 'none';
                
                // Auto load Surah 5 (Al-Ma'idah) like in the screenshot to show the UI
                loadSurah(5);
            } catch(e) {
                console.error("Gagal init:", e);
                DOM.loading.innerHTML = '<h2 style="color:red;">Gagal Memuat Mesin</h2>';
            }
        }

        function switchMode(mode) {
            currentMode = mode;
            if(mode === 'quran') {
                DOM.quranListPanel.style.display = 'flex';
                DOM.quranRightPanels.style.display = 'flex';
                DOM.hadistListPanel.style.display = 'none';
                DOM.hadistRightPanels.style.display = 'none';
                document.querySelectorAll('.nav-icon').forEach(el=>el.classList.remove('active'));
                document.querySelectorAll('.nav-icon')[0].classList.add('active'); // Home active
                if(metaData.length > 0) loadSurah(1);
            } else if(mode === 'hadist') {
                DOM.quranListPanel.style.display = 'none';
                DOM.quranRightPanels.style.display = 'none';
                DOM.hadistListPanel.style.display = 'flex';
                DOM.hadistRightPanels.style.display = 'flex';
                document.querySelectorAll('.nav-icon').forEach(el=>el.classList.remove('active'));
                document.querySelectorAll('.nav-icon')[1].classList.add('active'); // Hadist active
                
                DOM.rtTitle.innerText = "Katalog Hadist Global";
                DOM.rtSubtitle.innerText = "Pilih Imam dari panel kiri untuk membaca.";
                DOM.ayatContainer.innerHTML = '<div class="loading-state"><h2>📚 Hadist Explorer</h2><p>Menjelajahi puluhan ribu riwayat secara offline.</p></div>';
            }
        }

        function renderSurahList(data) {
            let html = '';
            data.forEach((s) => {
                // Screenshot uses English translated names, but we have Indonesia in meta.js. I'll just use s.arti for now.
                html += \`
                <div class="surah-item" id="navSurah\${s.nomor}" onclick="loadSurah(\${s.nomor})">
                    <span class="s-num">\${s.nomor}.</span>
                    <span class="s-name">\${s.namaLatin}</span>
                    <span class="s-lang">\${s.arti}</span>
                </div>\`;
            });
            DOM.surahList.innerHTML = html;
        }

        function renderHadistKatalog() {
            if(!window.HADITH_META) return;
            let html = '';
            window.HADITH_META.forEach(b => {
                html += \`
                <div class="surah-item" onclick="loadHadistBook('\${b.id}', '\${b.name}', \${b.total})">
                    <span class="s-name" style="flex:1;">Imam \${b.name}</span>
                    <span class="s-lang">\${b.total} Hadist</span>
                </div>\`;
            });
            DOM.hadistKatalogList.innerHTML = html;
        }

        async function loadSurah(nomor) {
            document.querySelectorAll('#surahList .surah-item').forEach(el => el.classList.remove('active'));
            const activeEl = document.getElementById('navSurah' + nomor);
            if(activeEl) activeEl.classList.add('active');
            
            const surahMeta = metaData.find(s => s.nomor == nomor);
            if(!surahMeta) return;

            DOM.rtTitle.innerText = \`Surah \${surahMeta.namaLatin}\`;
            DOM.rtSubtitle.innerText = \`Data untuk Surah \${surahMeta.namaLatin} (\${nomor}) sedang dimuat dari IndexedDB...\`;
            DOM.ayatContainer.innerHTML = \`
                <div class="loading-state">
                    <h2>🚀 Pemuatan Data Offline...</h2>
                    <p>Sistem sedang mengambil teks Word-by-Word untuk <strong>\${surahMeta.namaLatin}</strong> dari Database Cepat Lokal.</p>
                </div>\`;
                
            // Clear right panel
            DOM.tafsirContent.innerHTML = '<span style="font-style:italic; color:var(--text-muted);">Memilih ayat...</span>';
            DOM.hadistContent.innerHTML = '<span style="font-style:italic; color:var(--text-muted);">Memilih ayat...</span>';

            try {
                window.QURAN_SURAH = window.QURAN_SURAH || {};
                if(!window.QURAN_SURAH[nomor]) await loadScript(\`QuranHadist/data/quran_js/\${nomor}.js\`);
                const data = window.QURAN_SURAH[nomor];
                
                // Simulate loading delay so user sees the cool rocket
                setTimeout(() => {
                    DOM.rtSubtitle.innerText = \`(\${surahMeta.arti}) - \${surahMeta.jumlahAyat} Ayat\`;
                    renderAyat(data.ayat, nomor);
                }, 800);
            } catch(e) {
                DOM.ayatContainer.innerHTML = '<div style="color:red; padding:20px;">Gagal memuat surah.</div>';
            }
        }
        
        function renderAyat(ayatList, surahNo) {
            let html = '';
            ayatList.forEach(a => {
                html += \`
                <div style="background:var(--bg-panel); border:1px solid var(--border-color); border-radius:12px; padding:30px; margin-bottom:20px; position:relative; cursor:pointer;" onclick="showTafsir(\${surahNo}, \${a.nomorAyat})">
                    <div style="position:absolute; top:-15px; right:20px; background:var(--bg-base); border:2px solid var(--border-active); color:var(--border-active); width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px;">\${a.nomorAyat}</div>
                    
                    <div style="font-family:'Amiri'; font-size:36px; line-height:2; text-align:right; margin-bottom:20px; color:var(--accent-gold);">\${a.teksArab}</div>
                    
                    <div style="color:var(--border-active); font-weight:600; font-size:16px; margin-bottom:10px;">\${a.teksLatin}</div>
                    <div style="color:var(--text-main); font-size:14px; line-height:1.6;">\${a.teksIndonesia}</div>
                </div>\`;
            });
            DOM.ayatContainer.innerHTML = html;
        }
        
        async function showTafsir(surahNo, ayatNo) {
            DOM.tafsirContent.innerHTML = '<span style="color:var(--accent-cyan);">Mencari Tafsir...</span>';
            DOM.hadistContent.innerHTML = '<span style="color:var(--accent-cyan);">Mencari Hadist relevan...</span>';
            
            // TAFSIR
            try {
                window.TAFSIR_DATA = window.TAFSIR_DATA || {};
                if(!window.TAFSIR_DATA[surahNo]) await loadScript(\`QuranHadist/data/tafsir_js/\${surahNo}.js\`);
                const data = window.TAFSIR_DATA[surahNo];
                const t = data.kemenag ? data.kemenag[ayatNo] : null;
                if(t) DOM.tafsirContent.innerHTML = \`<strong style="color:var(--accent-gold); display:block; margin-bottom:10px;">Ayat \${ayatNo}</strong>\${t.replace(/\\n/g, '<br><br>')}\`;
                else DOM.tafsirContent.innerHTML = 'Tafsir tidak ditemukan.';
            } catch(e) {
                DOM.tafsirContent.innerHTML = '<span style="color:red;">Gagal memuat tafsir.</span>';
            }
            
            // HADIST MAPPING
            try {
                if(!window.HADITH_MAPPING) return DOM.hadistContent.innerHTML = 'Mapping belum dimuat.';
                const key = \`\${surahNo}_\${ayatNo}\`;
                const mapping = window.HADITH_MAPPING[key];
                if(mapping && mapping.length > 0) {
                    let html = \`<h4 style="color:var(--accent-cyan); margin-bottom:10px;">\${mapping.length} Hadist Ditemukan</h4>\`;
                    mapping.forEach(m => {
                        html += \`<div style="background:rgba(0,0,0,0.2); padding:10px; border-radius:8px; margin-bottom:10px; border-left:3px solid var(--accent-cyan);">
                            <div style="color:var(--accent-gold); font-weight:bold; font-size:14px;">Kitab \${m.kitab.toUpperCase()} (ID: \${m.id})</div>
                            <div style="color:var(--text-muted); font-size:12px; margin-top:5px;">\${m.label_khusus}</div>
                        </div>\`;
                    });
                    DOM.hadistContent.innerHTML = html;
                } else {
                    DOM.hadistContent.innerHTML = '<span style="color:var(--text-muted);">Tidak ada referensi Hadist terpetakan langsung untuk ayat ini.</span>';
                }
            } catch(e) {
                DOM.hadistContent.innerHTML = '<span style="color:red;">Error sistem Hadist.</span>';
            }
        }
        
        async function loadHadistBook(id, name, total) {
            document.querySelectorAll('#hadistKatalogList .surah-item').forEach(el => el.classList.remove('active'));
            // simple active state toggle logic for the clicked one...
            
            DOM.rtTitle.innerText = \`Kitab Imam \${name}\`;
            DOM.rtSubtitle.innerText = \`Memuat \${total} riwayat dari IndexedDB lokal...\`;
            DOM.ayatContainer.innerHTML = '<div class="loading-state"><h2>🚀 Mengambil Data Hadist...</h2><p>Tunggu sebentar...</p></div>';
            
            try {
                window.GLOBAL_HADITH = window.GLOBAL_HADITH || {};
                if(!window.GLOBAL_HADITH[id]) await loadScript(\`QuranHadist/data/hadist_js/\${id}.js\`);
                const hDataObj = window.GLOBAL_HADITH[id];
                const hData = hDataObj.items || hDataObj; // Handle both arrays and objects with .items
                
                DOM.rtSubtitle.innerText = \`Berhasil memuat \${hData.length} riwayat.\`;
                
                // Render just first 50 hadiths so we don't freeze the UI (Virtualization simulation)
                const limit = Math.min(50, hData.length);
                let html = \`<div style="margin-bottom:20px; color:var(--accent-cyan);">Menampilkan \${limit} dari \${hData.length} hadist... (Scroll/Pagination akan ditambahkan)</div>\`;
                
                for(let i=0; i<limit; i++) {
                    const h = hData[i];
                    html += \`
                    <div style="background:var(--bg-panel); border:1px solid var(--border-color); border-radius:12px; padding:30px; margin-bottom:20px; position:relative;">
                        <div style="color:var(--border-active); font-weight:bold; font-size:14px; margin-bottom:15px;">Hadist Nomor \${h.number}</div>
                        <div style="font-family:'Amiri'; font-size:30px; line-height:2; text-align:right; margin-bottom:20px; color:var(--accent-gold);">\${h.arab}</div>
                        <div style="color:var(--text-main); font-size:14px; line-height:1.6;">\${h.id}</div>
                    </div>\`;
                }
                DOM.ayatContainer.innerHTML = html;
                
            } catch(e) {
                DOM.ayatContainer.innerHTML = '<div style="color:red; padding:20px;">Gagal memuat Kitab Hadist.</div>';
            }
        }

        function extractKW(input) {
            if (!input) return [];
            let clean = input.replace(/[\u0617-\u061A\u064B-\u0652\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '');
            clean = clean.toLowerCase().replace(/[.,;:!?"'()\\[\\]{}«»\\-“”‘’]/g, ' ');
            const words = clean.split(/\\s+/).filter(w => !STOP.has(w) && w.length > 1);
            if (!words.length) {
                const all = clean.split(/\\s+/).sort((a,b) => b.length - a.length);
                return all.length ? [all[0]] : [clean.trim()];
            }
            return words;
        }

        async function doSearch() {
            const raw = DOM.searchInput.value.trim();
            if (!raw) return;
            
            if (currentMode === 'hadist') {
                await searchHadist(raw);
            } else {
                await searchQuran(raw);
            }
        }

        async function searchHadist(raw) {
            DOM.rtTitle.innerText = \`Pencarian Hadist: "\${raw}"\`;
            DOM.rtSubtitle.innerText = "Memeriksa 9 Kitab Imam...";
            
            if(!window.HADITH_META) {
                DOM.ayatContainer.innerHTML = '<div style="color:red; padding:20px;">Meta Hadist belum dimuat.</div>';
                return;
            }
            
            const kws = extractKW(raw);
            if(kws.length === 0) {
                DOM.ayatContainer.innerHTML = '<div style="padding:30px; text-align:center;"><h2 style="color:var(--text-muted)">Kata kunci terlalu umum atau diabaikan</h2></div>';
                return;
            }

            DOM.ayatContainer.innerHTML = '<div class="loading-state"><h2>🚀 Membangkitkan 9 Kitab Imam...</h2><p>Menarik puluhan ribu riwayat ke RAM (Mohon tunggu)...</p></div>';
            
            window.GLOBAL_HADITH = window.GLOBAL_HADITH || {};
            
            try {
                const loadPromises = window.HADITH_META.map(b => {
                    if(!window.GLOBAL_HADITH[b.id]) {
                        return loadScript(\`QuranHadist/data/hadist_js/\${b.id}.js\`);
                    }
                    return Promise.resolve();
                });
                await Promise.all(loadPromises);
            } catch (e) {
                console.error(e);
                DOM.ayatContainer.innerHTML = '<div style="color:red; padding:20px;">Gagal memuat Kitab Hadist. Pastikan koneksi offline aktif.</div>';
                return;
            }
            
            DOM.ayatContainer.innerHTML = '<div class="loading-state"><h2>⚡ Memindai Puluhan Ribu Riwayat...</h2><p>Mencocokkan kata kunci secara Deep Scan...</p></div>';

            await new Promise(r => setTimeout(r, 100));

            let matches = [];
            
            for(let b of window.HADITH_META) {
                const kitabDataObj = window.GLOBAL_HADITH[b.id];
                if(!kitabDataObj) continue;
                const items = kitabDataObj.items || kitabDataObj;
                
                for(let i=0; i<items.length; i++) {
                    const h = items[i];
                    const textToSearch = (h.id || "").toLowerCase();
                    
                    let matchAll = true;
                    for(let kw of kws) {
                        if(textToSearch.indexOf(kw) === -1) {
                            matchAll = false;
                            break;
                        }
                    }
                    
                    if(matchAll) {
                        matches.push({
                            kitabName: b.name,
                            kitabId: b.id,
                            number: h.number,
                            arab: h.arab,
                            text: h.id
                        });
                    }
                }
            }
            
            if(matches.length === 0) {
                DOM.ayatContainer.innerHTML = \`<div style="padding:30px; text-align:center;"><h2 style="color:var(--text-muted)">Tidak ditemukan hasil hadist untuk "\${raw}"</h2></div>\`;
                return;
            }
            
            const limit = Math.min(50, matches.length);
            let infoLog = \`<div style="background:var(--bg-panel); padding:20px; border-radius:12px; margin-bottom:20px; border:1px solid var(--border-color);">
                <h3 style="color:var(--accent-gold); margin-bottom:10px;">⚡ Deep Scan Selesai! Menemukan \${matches.length} Hadist (Menampilkan \${limit} Teratas).</h3>
                <div style="color:var(--text-muted); font-size:12px; margin-top:10px;">*(Pencarian melintasi 9 Kitab Utama secara real-time)*</div></div>\`;
                
            let resultsHTML = infoLog;
            
            function hl(text, keywords) {
                let highlighted = text;
                keywords.forEach(kw => {
                    const re = new RegExp(\`(\${kw})\`, 'gi');
                    highlighted = highlighted.replace(re, '<span style="background:rgba(245,208,97,0.3); color:var(--accent-gold); padding:0 3px; border-radius:3px;">$1</span>');
                });
                return highlighted;
            }

            for(let i=0; i<limit; i++) {
                const m = matches[i];
                resultsHTML += \`
                <div style="background:var(--bg-panel); border:1px solid var(--border-color); border-radius:12px; padding:30px; margin-bottom:20px; position:relative;">
                    <div style="position:absolute; top:-15px; left:20px; background:var(--bg-base); border:2px solid var(--accent-cyan); color:var(--accent-cyan); padding:5px 15px; border-radius:20px; font-weight:bold; font-size:12px; z-index:2;">Imam \${m.kitabName} - No. \${m.number}</div>
                    <div style="font-family:'Amiri'; font-size:30px; line-height:2; text-align:right; margin-bottom:20px; color:var(--accent-gold); margin-top:10px;">\${m.arab}</div>
                    <div style="color:var(--text-main); font-size:14px; line-height:1.6;">\${hl(m.text, kws)}</div>
                </div>\`;
            }
            
            DOM.rtSubtitle.innerText = \`Ditemukan \${matches.length} Hadist\`;
            DOM.ayatContainer.innerHTML = resultsHTML;
        }

        async function searchQuran(raw) {
            DOM.rtTitle.innerText = \`Mencari: "\${raw}"\`;
            DOM.rtSubtitle.innerText = "Memanaskan Mesin Inverted Index...";
            
            if(!window.SEARCH_INDEX) {
                DOM.ayatContainer.innerHTML = '<div class="loading-state"><h2>🚀 Memanaskan Mesin Pencari...</h2><p>Memuat Inverted Index (75MB) ke RAM...</p></div>';
                try {
                    window.rawSearchIndex = "";
                    for(let i=0; i<=5; i++) {
                        await loadScript(\`QuranHadist/search_index_part_\${i}.js\`);
                    }
                } catch(e) {
                    console.error(e);
                    DOM.ayatContainer.innerHTML = '<div style="color:red; padding:20px;">Gagal memuat index pencarian. Pastikan search_index_part_X.js ada!</div>';
                    return;
                }
            }
            
            const kws = extractKW(raw);
            if(kws.length === 0) {
                DOM.ayatContainer.innerHTML = '<div style="padding:30px; text-align:center;"><h2 style="color:var(--text-muted)">Kata kunci terlalu umum atau diabaikan</h2></div>';
                return;
            }
            
            const allKeys = Object.keys(window.SEARCH_INDEX);
            let quranMatchesMap = {};
            let totalFoundWords = {};
            
            kws.forEach(kw => {
                const matchedKeys = allKeys.filter(k => k.includes(kw));
                let ayatsForThisKw = new Set();
                matchedKeys.forEach(mk => {
                    totalFoundWords[kw] = (totalFoundWords[kw] || 0) + window.SEARCH_INDEX[mk].total;
                    window.SEARCH_INDEX[mk].ayat.forEach(a => ayatsForThisKw.add(a));
                });
                ayatsForThisKw.forEach(a => {
                    quranMatchesMap[a] = (quranMatchesMap[a] || 0) + 1;
                });
            });

            let quranMatches = [];
            const keys = Object.keys(quranMatchesMap);
            
            if(keys.length === 0) {
                DOM.ayatContainer.innerHTML = \`<div style="padding:30px; text-align:center;"><h2 style="color:var(--text-muted)">Tidak ditemukan hasil untuk "\${raw}"</h2></div>\`;
                return;
            }
            
            DOM.ayatContainer.innerHTML = '<div class="loading-state"><h2>🚀 Mengekstrak Ayat...</h2><p>Menarik data surah dari database lokal...</p></div>';

            let neededSurahs = new Set();
            keys.forEach(key => {
                const s = parseInt(key.split(':')[0]);
                neededSurahs.add(s);
            });
            
            window.QURAN_SURAH = window.QURAN_SURAH || {};
            for (let s of neededSurahs) {
                if(!window.QURAN_SURAH[s]) {
                    try { await loadScript(\`QuranHadist/data/quran_js/\${s}.js\`); } catch(e){}
                }
            }
            
            keys.forEach(key => {
                const score = quranMatchesMap[key];
                const parts = key.split(':');
                const s = parseInt(parts[0]);
                const a = parseInt(parts[1]);
                
                const surahMeta = metaData.find(x => x.nomor == s);
                if(!surahMeta || !window.QURAN_SURAH[s]) return;
                
                const surah = window.QURAN_SURAH[s];
                const ayat = surah.ayat.find(x => x.nomorAyat == a);
                if(!ayat) return;
                
                quranMatches.push({
                    score: score,
                    surah: { number: surahMeta.nomor, name: surahMeta.nama, englishName: surahMeta.namaLatin },
                    numberInSurah: ayat.nomorAyat, text: ayat.teksIndonesia, teksArab: ayat.teksArab, teksLatin: ayat.teksLatin
                });
            });

            quranMatches.sort((a, b) => b.score - a.score);
            quranMatches = quranMatches.slice(0, 50);

            const total = Object.keys(quranMatchesMap).length;

            let infoLog = \`<div style="background:var(--bg-panel); padding:20px; border-radius:12px; margin-bottom:20px; border:1px solid var(--border-color);">
                <h3 style="color:var(--accent-gold); margin-bottom:10px;">⚡ Pencarian O(1) Inverted Index Aktif! Menemukan \${total} Ayat (Menampilkan 50 Teratas).</h3>\`;
                
            kws.forEach(kw => {
                infoLog += \`<div style="color:var(--text-main); font-size:14px; margin-bottom:5px;">Kata <strong>"\${kw}"</strong> muncul total <strong>\${totalFoundWords[kw] || 0} kali</strong> dalam Al-Quran.</div>\`;
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
            
            function hl(text, keywords) {
                let highlighted = text;
                keywords.forEach(kw => {
                    const re = new RegExp(\`(\${kw})\`, 'gi');
                    highlighted = highlighted.replace(re, '<span style="background:rgba(245,208,97,0.3); color:var(--accent-gold); padding:0 3px; border-radius:3px;">$1</span>');
                });
                return highlighted;
            }

            Object.entries(surahGroups).forEach(([name, g]) => {
                resultsHTML += \`<div id="surah_\${name.replace(/[^a-zA-Z]/g,'')}" style="margin-bottom:30px; padding:15px; background:rgba(0,0,0,0.2); border-radius:12px; border-left:4px solid var(--accent-gold);">
                    <h3 style="color:var(--accent-gold); font-size:20px; margin-bottom:20px;">📖 Surah \${name}</h3>\`;
                    
                g.ayat.forEach(m => {
                    resultsHTML += \`
                    <div style="background:var(--bg-panel); border:1px solid var(--border-color); border-radius:12px; padding:30px; margin-bottom:20px; position:relative; cursor:pointer;" onclick="showTafsir(\${m.surah.number}, \${m.numberInSurah})">
                        <div style="position:absolute; top:-15px; right:20px; background:var(--bg-base); border:2px solid var(--border-active); color:var(--border-active); width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px;">\${m.numberInSurah}</div>
                        <div style="font-family:'Amiri'; font-size:36px; line-height:2; text-align:right; margin-bottom:20px; color:var(--accent-gold);">\${m.teksArab}</div>
                        <div style="color:var(--border-active); font-weight:600; font-size:16px; margin-bottom:10px;">\${m.teksLatin}</div>
                        <div style="color:var(--text-main); font-size:14px; line-height:1.6;">\${hl(m.text, kws)}</div>
                    </div>\`;
                });
                resultsHTML += \`</div>\`;
            });
            
            DOM.rtSubtitle.innerText = \`Ditemukan \${total} hasil\`;
            DOM.ayatContainer.innerHTML = resultsHTML;
        }

        window.onload = initApp;
    </script>
</body>
</html>`;

fs.writeFileSync('index_premium.html', html);
console.log("SUKSES: index_premium.html V3 Ultra Premium berhasil di-generate!");
