const fs = require('fs');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AL-QURAN PREMIUM V3</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet">
    <script type="text/javascript">
        function googleTranslateElementInit() {
            new google.translate.TranslateElement({pageLanguage: 'id', autoDisplay: false}, 'google_translate_element');
        }
    </script>
    <script type="text/javascript" src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
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
            top: 0 !important;
            position: static !important;
        }

        .skiptranslate iframe { display: none !important; }
        .goog-te-banner-frame { display: none !important; }
        .goog-tooltip { display: none !important; }
        .goog-tooltip:hover { display: none !important; }
        font { background: transparent !important; box-shadow: none !important; }


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
            top: 0 !important;
            position: static !important;
        }

        .skiptranslate iframe { display: none !important; }
        .goog-te-banner-frame { display: none !important; }
        .goog-tooltip { display: none !important; }
        .goog-tooltip:hover { display: none !important; }
        font { background: transparent !important; box-shadow: none !important; }


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
        .header-controls {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .jump-container {
            display: flex;
            align-items: center;
            background: var(--bg-panel);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            overflow: hidden;
            top: 0 !important;
            position: static !important;
        }

        .skiptranslate iframe { display: none !important; }
        .goog-te-banner-frame { display: none !important; }
        .goog-tooltip { display: none !important; }
        .goog-tooltip:hover { display: none !important; }
        font { background: transparent !important; box-shadow: none !important; }

        .jump-container input {
            background: transparent;
            border: none;
            color: var(--text-main);
            padding: 8px 12px;
            width: 140px;
            outline: none;
            font-size: 13px;
        }
        .btn-jump {
            background: var(--border-active);
            color: var(--bg-base);
            border: none;
            padding: 8px 15px;
            cursor: pointer;
            font-weight: bold;
            transition: 0.3s;
        }
        .btn-jump:hover { background: var(--accent-cyan); }

        .reciter-selector select {
            background: var(--bg-panel);
            color: var(--text-main);
            border: 1px solid var(--border-color);
            padding: 8px 12px;
            border-radius: 8px;
            outline: none;
            font-size: 13px;
            cursor: pointer;
            max-width: 200px;
        }

        .btn-play-pill {
            background: transparent;
            border: 2px solid var(--border-active);
            color: var(--border-active);
            height: 40px;
            border-radius: 20px;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
            transition: 0.3s;
            padding: 0 15px;
            gap: 8px;
            font-weight: 600;
            font-size: 13px;
        }
        .btn-play-pill:hover { background: rgba(0,229,255,0.1); box-shadow: 0 0 15px rgba(0,229,255,0.3); }

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

        /* Tafsir Tab Buttons */
        .tafsir-tab {
            background: rgba(255,255,255,0.05); border: 1px solid var(--border-color);
            color: var(--text-muted); padding: 5px 12px; border-radius: 20px;
            font-size: 11px; cursor: pointer; transition: all 0.3s ease;
            font-family: 'Outfit', sans-serif;
        }
        .tafsir-tab:hover { background: rgba(245,208,97,0.1); color: var(--accent-gold); border-color: var(--accent-gold); }
        .tafsir-tab.active {
            background: linear-gradient(135deg, rgba(245,208,97,0.2), rgba(245,208,97,0.05));
            color: var(--accent-gold); border-color: var(--accent-gold);
            font-weight: 700; box-shadow: 0 0 10px rgba(245,208,97,0.15);
        }

        /* Premium Modal CSS */
        .premium-modal-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(8, 12, 20, 0.9);
            backdrop-filter: blur(8px); z-index: 9999;
            display: none; justify-content: center; align-items: center;
            opacity: 0; transition: opacity 0.3s;
        }
        .premium-modal-overlay.active { display: flex; opacity: 1; }
        .premium-modal {
            background: var(--bg-panel); border: 1px solid var(--border-active);
            box-shadow: 0 10px 40px rgba(245,208,97,0.15); border-radius: 16px;
            width: 90%; max-width: 800px; max-height: 85vh;
            display: flex; flex-direction: column;
            transform: scale(0.9); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .premium-modal-overlay.active .premium-modal { transform: scale(1); }
        .modal-header {
            padding: 20px 30px; border-bottom: 1px solid var(--border-color);
            display: flex; justify-content: space-between; align-items: center;
        }
        .modal-title { color: var(--accent-gold); font-size: 20px; font-weight: bold; }
        .btn-close-modal {
            background: transparent; border: none; color: var(--text-muted);
            font-size: 24px; cursor: pointer; transition: 0.2s;
        }
        .btn-close-modal:hover { color: red; }
        .modal-body { padding: 30px; overflow-y: auto; flex: 1; }
        .hadith-group { margin-bottom: 25px; }
        .hadith-group h4 { color: var(--accent-cyan); margin-bottom: 10px; font-size:16px; border-bottom:1px solid rgba(0, 240, 255, 0.2); padding-bottom:5px;}
        .hadith-pill {
            display: inline-block; background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1); padding: 6px 12px;
            border-radius: 20px; margin: 5px; font-size: 13px; cursor: pointer;
            transition: 0.2s; color: var(--text-main);
        }
        .hadith-pill:hover {
            background: rgba(245,208,97,0.1); border-color: var(--accent-gold);
            color: var(--accent-gold); transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div id="google_translate_element" style="display:none;"></div>

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
                <select class="proLangSelector" onchange="doGTranslate(this.value)"></select>
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
                <select class="proLangSelector" onchange="doGTranslate(this.value)"></select>
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
                
                <div class="header-controls">
                    <!-- Jump Input -->
                    <div class="jump-container">
                        <input type="number" id="inputJump" placeholder="No. Ayat/Hadist..." min="1" onkeypress="if(event.key==='Enter') jumpToNumber()">
                        <button onclick="jumpToNumber()" class="btn-jump">Go</button>
                    </div>

                    <!-- Murottal Selector -->
                    <div class="reciter-selector" id="reciterContainer">
                        <select id="selectReciter" onchange="changeReciter()">
                            <optgroup label="Offline Murottal (Lokal)">
                                <option value="offline_mishary">Mishary Rashid Alafasy</option>
                                <option value="offline_abdulbaset">Abdul Baset (Mujawwad)</option>
                                <option value="offline_sudais">Abdurrahman as-Sudais</option>
                                <option value="offline_shuraim">Saud ash-Shuraim</option>
                                <option value="offline_husary">Mahmoud Khalil Al-Husary</option>
                            </optgroup>
                            <optgroup label="Online API (Cloud)">
                                <option value="ar.alafasy">Mishary Rashid (Online)</option>
                                <option value="ar.hudhaify">Ali Al-Hudhaify</option>
                                <option value="ar.abdullahbasfar">Abdullah Basfar</option>
                            </optgroup>
                        </select>
                    </div>

                    <!-- Play Button with Time -->
                    <button class="btn-play-pill" id="btnPlayMain" onclick="toggleAudio()">
                        <svg id="iconPlayMain" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        <span id="audioTime">00:00 / 00:00</span>
                    </button>
                </div>
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
                <div class="panel-title" id="tafsirPanelTitle">Tafsir Kemenag RI</div>
                <div class="panel-sub" id="tafsirPanelSub">Klik ayat untuk melihat tafsir</div>
                <div style="padding:8px 15px; border-bottom:1px solid var(--border-color);">
                    <button class="btn-open-all-tafsir" onclick="openTafsirModal()" id="btnOpenAllTafsir" disabled>📖 Buka 122 Tafsir Dunia</button>
                </div>
                <div class="panel-content" id="tafsirContent">
                    <span style="font-style:italic; color:var(--text-muted);">Klik ayat untuk melihat tafsir.</span>
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

    <!-- TAFSIR MODAL (122 TAFSIR DUNIA) -->
    <div id="tafsirModalOverlay" class="tafsir-modal-overlay" onclick="if(event.target===this) closeTafsirModal()">
        <div class="tafsir-modal-container">
            <div class="tafsir-modal-header">
                <h2 id="tafsirModalTitle">📖 122 Tafsir Dunia</h2>
                <p id="tafsirModalSub" style="color:var(--text-muted); margin:0;">Klik ayat terlebih dahulu</p>
                <button class="tafsir-modal-close" onclick="closeTafsirModal()">&times;</button>
            </div>
            <div class="tafsir-modal-body">
                <div class="tafsir-modal-sidebar" id="tafsirModalSidebar">
                    <div style="padding:10px; border-bottom:1px solid var(--border-color);">
                        <input type="text" id="tafsirSearchFilter" placeholder="Cari nama tafsir..." style="width:100%; padding:8px 12px; background:rgba(255,255,255,0.05); border:1px solid var(--border-color); border-radius:8px; color:var(--text-main); font-size:13px; outline:none;" oninput="filterTafsirList(this.value)">
                    </div>
                    <div id="tafsirModalList" style="overflow-y:auto; max-height: calc(80vh - 120px);"></div>
                </div>
                <div class="tafsir-modal-content" id="tafsirModalContent">
                    <span style="color:var(--text-muted); font-style:italic;">Pilih tafsir dari daftar di sebelah kiri.</span>
                </div>
            </div>
        </div>
    </div>

    <style>
        .btn-open-all-tafsir {
            width:100%; padding:10px; border:1px solid var(--accent-gold); background:linear-gradient(135deg, rgba(245,208,97,0.15), rgba(245,208,97,0.05));
            color:var(--accent-gold); font-weight:700; border-radius:10px; cursor:pointer; font-size:13px;
            font-family:'Outfit',sans-serif; transition:all 0.3s ease;
        }
        .btn-open-all-tafsir:hover:not(:disabled) { background:linear-gradient(135deg, rgba(245,208,97,0.3), rgba(245,208,97,0.1)); transform:translateY(-1px); box-shadow:0 4px 15px rgba(245,208,97,0.2); }
        .btn-open-all-tafsir:disabled { opacity:0.4; cursor:not-allowed; }
        .tafsir-modal-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(8,12,20,0.92); backdrop-filter:blur(10px); z-index:10000; display:none; justify-content:center; align-items:center; }
        .tafsir-modal-overlay.active { display:flex; }
        .tafsir-modal-container { width:90vw; max-width:1200px; height:85vh; background:var(--bg-panel); border:1px solid var(--accent-gold); border-radius:16px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 0 60px rgba(245,208,97,0.1); }
        .tafsir-modal-header { padding:18px 24px; border-bottom:1px solid var(--border-color); display:flex; align-items:center; gap:20px; position:relative; }
        .tafsir-modal-header h2 { color:var(--accent-gold); margin:0; font-size:20px; }
        .tafsir-modal-close { position:absolute; right:20px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--text-muted); font-size:28px; cursor:pointer; }
        .tafsir-modal-close:hover { color:var(--accent-gold); }
        .tafsir-modal-body { display:flex; flex:1; overflow:hidden; }
        .tafsir-modal-sidebar { width:280px; min-width:280px; border-right:1px solid var(--border-color); display:flex; flex-direction:column; }
        .tafsir-modal-content { flex:1; padding:20px 30px; overflow-y:auto; line-height:1.9; font-size:15px; color:var(--text-main); }
        .tafsir-list-item { padding:10px 15px; cursor:pointer; border-bottom:1px solid rgba(255,255,255,0.03); transition:all 0.2s; font-size:13px; color:var(--text-main); }
        .tafsir-list-item:hover { background:rgba(245,208,97,0.08); color:var(--accent-gold); }
        .tafsir-list-item.active { background:rgba(245,208,97,0.15); color:var(--accent-gold); border-left:3px solid var(--accent-gold); font-weight:700; }
        .tafsir-list-item .tafsir-lang { font-size:10px; color:var(--text-muted); display:block; margin-top:2px; }
    </style>

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
            if(typeof buildLanguageSelectors === 'function') buildLanguageSelectors();
            try {
                if(!window.QURAN_META) await loadScript('QuranHadist/data/meta.js');
                metaData = window.QURAN_META;
                
                // Preload Hadith Meta
                if(!window.HADITH_META) await loadScript('QuranHadist/data/hadist_js/meta.js').catch(e=>{});
                
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
                
                document.getElementById('btnPlayMain').style.display = 'flex';
                document.getElementById('reciterContainer').style.display = 'block';

                if(metaData.length > 0) loadSurah(1);
            } else if(mode === 'hadist') {
                DOM.quranListPanel.style.display = 'none';
                DOM.quranRightPanels.style.display = 'none';
                DOM.hadistListPanel.style.display = 'flex';
                DOM.hadistRightPanels.style.display = 'flex';
                document.querySelectorAll('.nav-icon').forEach(el=>el.classList.remove('active'));
                document.querySelectorAll('.nav-icon')[1].classList.add('active'); // Hadist active
                
                document.getElementById('btnPlayMain').style.display = 'none';
                document.getElementById('reciterContainer').style.display = 'none';
                
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
                <div class="surah-item" id="navHadist\${b.id}" onclick="loadHadistBook('\${b.id}', '\${b.name}', \${b.total})">
                    <span class="s-name" style="flex:1;">Imam \${b.name}</span>
                    <span class="s-lang">\${b.total} Hadist</span>
                </div>\`;
            });
            DOM.hadistKatalogList.innerHTML = html;
        }

        async function loadSurah(nomor) {
            if (typeof stopMainAudio === 'function') {
                stopMainAudio();
            }
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
                setTimeout(async () => {
                    let hCount = 0;
                    try {
                        window.TAFSIR_DATA = window.TAFSIR_DATA || {};
                        if (!window.TAFSIR_DATA[nomor]) {
                            await loadScript(\`QuranHadist/data/tafsir_js/\${nomor}.js\`);
                        }
                        if (window.TAFSIR_DATA[nomor] && window.TAFSIR_DATA[nomor].mapping_ayat) {
                            const mapA = window.TAFSIR_DATA[nomor].mapping_ayat;
                            for (const k in mapA) {
                                hCount += mapA[k].length;
                            }
                        }
                    } catch(e) { console.error("Gagal load tafsir untuk hadist", e); }
                    
                    let extraHtml = '';
                    if (hCount > 0) {
                        extraHtml = \` <button onclick="showSurahHadithSummary(\${nomor})" style="background:var(--accent-gold); color:var(--bg-base); border:none; padding:4px 10px; border-radius:15px; font-size:11px; font-weight:bold; cursor:pointer; margin-left:10px; box-shadow: 0 0 10px rgba(245,208,97,0.5);">Lihat \${hCount} Hadist Terkait</button>\`;
                    }

                    DOM.rtSubtitle.innerHTML = \`(\${surahMeta.arti}) - \${surahMeta.jumlahAyat} Ayat - Diturunkan di: <strong style="color:var(--accent-cyan);">\${surahMeta.tempatTurun}</strong>\${extraHtml}\`;
                    renderAyat(data.ayat, nomor);
                }, 800);
            } catch(e) {
                DOM.ayatContainer.innerHTML = '<div style="color:red; padding:20px;">Gagal memuat surah.</div>';
            }
        }
        
        let currentAyatData = [];
        let currentAyatSurahNo = 0;
        let currentAyatPage = 1;
        const ayatPerPage = 20;

        function renderAyatPage(page) {
            currentAyatPage = page;
            const start = (page - 1) * ayatPerPage;
            const end = Math.min(start + ayatPerPage, currentAyatData.length);
            const totalPages = Math.ceil(currentAyatData.length / ayatPerPage);
            
            let html = '';
            
            if (totalPages > 1) {
                html += \`<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <div style="color:var(--accent-cyan);">Menampilkan Ayat \${start + 1} - \${end} dari \${currentAyatData.length} (Halaman \${page} dari \${totalPages})</div>
                    <div style="display:flex; gap:10px;">
                        <button class="btn-jump" onclick="renderAyatPage(\${page > 1 ? page - 1 : 1})" \${page === 1 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>&laquo; Back</button>
                        <button class="btn-jump" onclick="renderAyatPage(\${page < totalPages ? page + 1 : totalPages})" \${page === totalPages ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>Next &raquo;</button>
                    </div>
                </div>\`;
            }
            
            for(let i=start; i<end; i++) {
                const a = currentAyatData[i];
                html += \`
                <div id="ayat-\${a.nomorAyat}" class="ayat-row" style="background:var(--bg-panel); border:1px solid var(--border-color); border-radius:12px; padding:30px; margin-bottom:20px; position:relative; cursor:pointer;" onclick="showTafsir(\${currentAyatSurahNo}, \${a.nomorAyat})">
                    <div style="position:absolute; top:-15px; right:20px; background:var(--bg-base); border:2px solid var(--border-active); color:var(--border-active); width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px;">\${a.nomorAyat}</div>
                    
                    <button id="btnPlayAyat-\${a.nomorAyat}" class="btn-play-ayat" onclick="toggleAyatAudio(\${currentAyatSurahNo}, \${a.nomorAyat}); event.stopPropagation();" style="position:absolute; top:-15px; right:60px; background:var(--accent-cyan); color:var(--bg-base); border:none; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:10; box-shadow:0 2px 10px rgba(0,229,255,0.3);" title="Putar audio ayat ini">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </button>
                    
                    <div class="notranslate" style="font-family:'Amiri'; font-size:36px; line-height:2; text-align:right; margin-bottom:20px; color:var(--accent-gold);">\${a.teksArab}</div>
                    
                    <div style="color:var(--border-active); font-weight:600; font-size:16px; margin-bottom:10px;">\${a.teksLatin}</div>
                    <div style="color:var(--text-main); font-size:14px; line-height:1.6;">\${a.teksIndonesia}</div>
                </div>\`;
            }
            
            if (totalPages > 1) {
                html += \`<div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                    <button class="btn-jump" onclick="renderAyatPage(\${page > 1 ? page - 1 : 1})" \${page === 1 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>&laquo; Back</button>
                    <button class="btn-jump" onclick="renderAyatPage(\${page < totalPages ? page + 1 : totalPages})" \${page === totalPages ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>Next &raquo;</button>
                </div>\`;
            }
            
            DOM.ayatContainer.innerHTML = html;
            const reader = document.querySelector('.main-reader');
            if(reader) reader.scrollTop = 0;
            
            if (typeof isPlaying !== 'undefined' && isPlaying && currentAyatSurahNo === currentPlaySurah) {
                setTimeout(() => { highlightPlayingAyat(currentPlayAyat, true); }, 100);
            }
        }

        function renderAyat(ayatList, surahNo) {
            currentAyatData = ayatList;
            currentAyatSurahNo = surahNo;
            renderAyatPage(1);
        }
        
        let lastTafsirSurah = null;
        let lastTafsirAyat = null;
        
        function openTafsirModal() {
            if (!lastTafsirSurah || !lastTafsirAyat) return;
            document.getElementById('tafsirModalOverlay').classList.add('active');
            document.getElementById('tafsirModalSub').innerText = 'Surah ' + lastTafsirSurah + ', Ayat ' + lastTafsirAyat;
            
            // Load meta if not loaded
            if (!window.TAFSIR_GLOBAL_META) {
                loadScript('QuranHadist/data/tafsir_all_js/meta.js').then(function() { buildTafsirList(); }).catch(function() {
                    document.getElementById('tafsirModalList').innerHTML = '<div style="padding:20px; color:red;">Gagal memuat meta.js</div>';
                });
            } else {
                buildTafsirList();
            }
        }
        
        function closeTafsirModal() {
            document.getElementById('tafsirModalOverlay').classList.remove('active');
        }
        
        function buildTafsirList() {
            var list = document.getElementById('tafsirModalList');
            var meta = window.TAFSIR_GLOBAL_META || [];
            var html = '';
            meta.forEach(function(t, idx) {
                var langTag = t.isArabic ? 'Arab' : (t.slug.startsWith('en-') ? 'English' : (t.slug.startsWith('id-') || t.slug.startsWith('in-') || t.slug.startsWith('indonesian') ? 'Indonesia' : ''));
                html += '<div class="tafsir-list-item" style="position:relative; padding-right:40px;" data-slug="' + t.slug + '" data-name="' + t.name.toLowerCase() + '" onclick="loadGlobalTafsir(this, \\'' + t.slug + '\\')">';
                html += '<div>' + t.name + '</div>';
                if (langTag) html += '<span class="tafsir-lang">' + langTag + '</span>';
                html += '<button onclick="setDefaultTafsir(\\'' + t.slug + '\\', \\'' + t.name.replace(/'/g, "&#39;") + '\\'); event.stopPropagation();" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; font-size:18px;" title="Jadikan Tafsir Default">☑️</button>';
                html += '</div>';
            });
            list.innerHTML = html;
        }
        
        function filterTafsirList(q) {
            q = q.toLowerCase();
            var items = document.querySelectorAll('.tafsir-list-item');
            items.forEach(function(el) {
                var name = el.getAttribute('data-name') || '';
                el.style.display = name.indexOf(q) !== -1 ? '' : 'none';
            });
        }
        
        let activeGlobalTafsirSlug = null;
        let activeGlobalTafsirName = null;
        
        async function loadGlobalTafsir(el, slug) {
            // Highlight
            document.querySelectorAll('.tafsir-list-item').forEach(function(e) { e.classList.remove('active'); });
            el.classList.add('active');
            
            var content = document.getElementById('tafsirModalContent');
            content.innerHTML = '<span style="color:var(--accent-cyan);">Memuat tafsir...</span>';
            
            var sNo = lastTafsirSurah;
            var aNo = lastTafsirAyat;
            
            // Load the JS file
            window.TAFSIR_GLOBAL = window.TAFSIR_GLOBAL || {};
            if (!window.TAFSIR_GLOBAL[slug] || !window.TAFSIR_GLOBAL[slug][sNo]) {
                try {
                    await loadScript('QuranHadist/data/tafsir_all_js/' + slug + '/' + sNo + '.js');
                } catch(e) {
                    content.innerHTML = '<span style="color:var(--text-muted);">File tafsir untuk surah ini tidak tersedia.</span>';
                    return;
                }
            }
            
            var d = window.TAFSIR_GLOBAL[slug] ? window.TAFSIR_GLOBAL[slug][sNo] : null;
            if (!d || !d[aNo]) {
                content.innerHTML = '<span style="color:var(--text-muted);">Tafsir tidak tersedia untuk ayat ' + aNo + '.</span>';
                return;
            }
            
            var text = d[aNo];
            var meta = (window.TAFSIR_GLOBAL_META || []).find(function(m) { return m.slug === slug; });
            var isArabic = meta ? meta.isArabic : false;
            var tName = meta ? meta.name : slug;
            
            var style = isArabic ? "font-family:'Amiri',serif; font-size:22px; line-height:2.2; direction:rtl; text-align:right;" : "font-size:15px; line-height:1.9;";

            var tafsirHtml = isArabic 
                ? ('<div class="notranslate" style="' + style + ' color:var(--text-main); margin-bottom:20px;">' + text.replace(/\\n/g, '<br>') + '</div>' + 
                   '<div style="font-size:15px; line-height:1.9; color:var(--accent-cyan); border-top:1px dashed var(--border-color); padding-top:15px;"><strong style="color:var(--text-muted); font-size:13px; display:block; margin-bottom:10px;">Terjemahan:</strong>' + text.replace(/\\n/g, '<br>') + '</div>')
                : ('<div style="' + style + ' color:var(--text-main);">' + text.replace(/\\n/g, '<br>') + '</div>');
            
            content.innerHTML = '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:15px;">' +
                '<div>' +
                    '<h3 style="color:var(--accent-gold); margin:0 0 5px 0;">' + tName + '</h3>' +
                    '<div style="color:var(--text-muted); font-size:13px;">Surah ' + sNo + ', Ayat ' + aNo + '</div>' +
                '</div>' +
                "<button onclick=\\"setDefaultTafsir('" + slug + "', '" + tName.replace(/'/g, "&#39;") + "')\\" style=\\"background:var(--accent-cyan); color:var(--bg-base); border:none; padding:8px 15px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:12px;\\">✅ Jadikan Default Panel</button>" +
                '</div>' + tafsirHtml;
        }
        
        function setDefaultTafsir(slug, name) {
            activeGlobalTafsirSlug = slug;
            activeGlobalTafsirName = name;
            document.getElementById('tafsirPanelTitle').innerText = name;
            closeTafsirModal();
            if (lastTafsirSurah && lastTafsirAyat) {
                showTafsir(lastTafsirSurah, lastTafsirAyat);
            }
        }
        
        async function showTafsir(surahNo, ayatNo) {
            DOM.tafsirContent.innerHTML = '<span style="color:var(--accent-cyan);">Menarik data tafsir...</span>';
            DOM.hadistContent.innerHTML = '<span style="color:var(--accent-cyan);">Mencari Hadist relevan...</span>';
            
            lastTafsirSurah = surahNo;
            lastTafsirAyat = ayatNo;
            
            // Enable the button
            var btn = document.getElementById('btnOpenAllTafsir');
            if (btn) btn.disabled = false;
            
            // TAFSIR (Custom global or Kemenag)
            try {
                if (activeGlobalTafsirSlug) {
                    window.TAFSIR_GLOBAL = window.TAFSIR_GLOBAL || {};
                    if (!window.TAFSIR_GLOBAL[activeGlobalTafsirSlug] || !window.TAFSIR_GLOBAL[activeGlobalTafsirSlug][surahNo]) {
                        await loadScript('QuranHadist/data/tafsir_all_js/' + activeGlobalTafsirSlug + '/' + surahNo + '.js');
                    }
                    var d = window.TAFSIR_GLOBAL[activeGlobalTafsirSlug] ? window.TAFSIR_GLOBAL[activeGlobalTafsirSlug][surahNo] : null;
                    var t = d ? d[ayatNo] : null;
                    document.getElementById('tafsirPanelSub').innerText = 'Ayat ' + ayatNo + ' \u2014 ' + activeGlobalTafsirName;
                    
                    var isArabic = (window.TAFSIR_GLOBAL_META || []).find(function(m){return m.slug===activeGlobalTafsirSlug})?.isArabic || false;
                    var style = isArabic ? "font-family:'Amiri',serif; font-size:22px; line-height:2.2; direction:rtl; text-align:right;" : "line-height:1.8;";
                    
                    if (t) {
                        var tafsirHtml = isArabic 
                            ? ('<div class="notranslate" style="' + style + ' margin-bottom:15px;">' + t.replace(/\\n/g, '<br><br>') + '</div>' + 
                               '<div style="font-size:15px; line-height:1.8; color:var(--accent-cyan); border-top:1px dashed var(--border-color); padding-top:15px;"><strong style="color:var(--text-muted); font-size:13px; display:block; margin-bottom:10px;">Terjemahan:</strong>' + t.replace(/\\n/g, '<br><br>') + '</div>')
                            : ('<div style="' + style + '">' + t.replace(/\\n/g, '<br><br>') + '</div>');
                        DOM.tafsirContent.innerHTML = '<strong style="color:var(--accent-gold); display:block; margin-bottom:10px;">Ayat ' + ayatNo + '</strong>' + tafsirHtml;
                    } else {
                        DOM.tafsirContent.innerHTML = '<span style="color:var(--text-muted);">Tafsir tidak tersedia untuk ayat ini.</span>';
                    }
                } else {
                    window.TAFSIR_DATA = window.TAFSIR_DATA || {};
                    if(!window.TAFSIR_DATA[surahNo]) await loadScript(\`QuranHadist/data/tafsir_js/\${surahNo}.js\`);
                    var data = window.TAFSIR_DATA[surahNo];
                    var t = data.kemenag ? data.kemenag[ayatNo] : null;
                    document.getElementById('tafsirPanelSub').innerText = 'Ayat ' + ayatNo + ' \u2014 Tafsir Kemenag RI';
                    if (t) {
                        DOM.tafsirContent.innerHTML = '<strong style="color:var(--accent-gold); display:block; margin-bottom:10px;">Ayat ' + ayatNo + '</strong><div style="line-height:1.8;">' + t.replace(/\\n/g, '<br><br>') + '</div>';
                    } else {
                        DOM.tafsirContent.innerHTML = '<span style="color:var(--text-muted);">Tafsir Kemenag tidak tersedia untuk ayat ini.</span>';
                    }
                }
            } catch(e) {
                DOM.tafsirContent.innerHTML = '<span style="color:red;">Gagal memuat tafsir.</span>';
            }
            
            // HADIST MAPPING
            try {
                if(!window.TAFSIR_DATA || !window.TAFSIR_DATA[surahNo] || !window.TAFSIR_DATA[surahNo].mapping_ayat) {
                    return DOM.hadistContent.innerHTML = '<span style="color:var(--text-muted);">Data mapping hadist Pro belum termuat.</span>';
                }
                const mapA = window.TAFSIR_DATA[surahNo].mapping_ayat;
                const key = surahNo + ':' + ayatNo;
                const mapping = mapA[key];
                
                if(mapping && mapping.length > 0) {
                    let html = '<h4 style="color:var(--accent-cyan); margin-bottom:15px; border-bottom:1px solid rgba(0, 240, 255, 0.2); padding-bottom:10px;">' + mapping.length + ' Hadist Pro Ditemukan</h4>';
                    mapping.forEach(function(m) {
                        html += '<div style="background:rgba(255,255,255,0.02); padding:15px; border-radius:10px; margin-bottom:15px; border-left:3px solid var(--accent-gold); position:relative; overflow:hidden;">';
                        html += '<div style="color:var(--accent-gold); font-weight:bold; font-size:14px; margin-bottom:10px;">Riwayat ' + m.p + ' (No. ' + (m.n || m.id) + ')</div>';
                        html += '<div style="font-family:\\'Amiri\\'; font-size:20px; line-height:2; direction:rtl; text-align:right; margin-bottom:10px; color:#fff;">' + (m.ar || '') + '</div>';
                        html += '<div style="color:var(--text-main); font-size:13px; line-height:1.6;">"' + (m.trj || '') + '"</div>';
                        html += '</div>';
                    });
                    DOM.hadistContent.innerHTML = html;
                } else {
                    DOM.hadistContent.innerHTML = '<span style="color:var(--text-muted);">Tidak ada referensi Hadist Pro langsung untuk ayat ini.</span>';
                }
            } catch(e) {
                DOM.hadistContent.innerHTML = '<span style="color:red;">Error sistem Hadist Pro.</span>';
            }
        }
        let currentHadithData = [];
        let currentHadithPage = 1;
        const hadithPerPage = 20;

        function renderHadithPage(page) {
            currentHadithPage = page;
            const start = (page - 1) * hadithPerPage;
            const end = Math.min(start + hadithPerPage, currentHadithData.length);
            const totalPages = Math.ceil(currentHadithData.length / hadithPerPage);
            
            let html = \`<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <div style="color:var(--accent-cyan);">Menampilkan \${start + 1} - \${end} dari \${currentHadithData.length} hadist (Halaman \${page} dari \${totalPages})</div>
                <div style="display:flex; gap:10px;">
                    <button class="btn-jump" onclick="renderHadithPage(\${page > 1 ? page - 1 : 1})" \${page === 1 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>&laquo; Back</button>
                    <button class="btn-jump" onclick="renderHadithPage(\${page < totalPages ? page + 1 : totalPages})" \${page === totalPages ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>Next &raquo;</button>
                </div>
            </div>\`;
            
            for(let i=start; i<end; i++) {
                const h = currentHadithData[i];
                html += \`
                <div id="hadist-\${h.number}" style="background:var(--bg-panel); border:1px solid var(--border-color); border-radius:12px; padding:30px; margin-bottom:20px; position:relative;">
                    <div style="color:var(--border-active); font-weight:bold; font-size:14px; margin-bottom:15px;">Hadist Nomor \${h.number}</div>
                    <div class="notranslate" style="font-family:'Amiri'; font-size:30px; line-height:2; text-align:right; margin-bottom:20px; color:var(--accent-gold);">\${h.arab}</div>
                    <div style="color:var(--text-main); font-size:14px; line-height:1.6;">\${h.id}</div>
                </div>\`;
            }
            
            html += \`<div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                <button class="btn-jump" onclick="renderHadithPage(\${page > 1 ? page - 1 : 1})" \${page === 1 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>&laquo; Back</button>
                <button class="btn-jump" onclick="renderHadithPage(\${page < totalPages ? page + 1 : totalPages})" \${page === totalPages ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>Next &raquo;</button>
            </div>\`;
            
            DOM.ayatContainer.innerHTML = html;
            const reader = document.querySelector('.main-reader');
            if(reader) reader.scrollTop = 0;
        }

        async function loadHadistBook(id, name, total) {
            document.querySelectorAll('#hadistKatalogList .surah-item').forEach(el => el.classList.remove('active'));
            const activeEl = document.getElementById('navHadist' + id);
            if(activeEl) activeEl.classList.add('active');
            
            DOM.rtTitle.innerText = \`Kitab Imam \${name}\`;
            DOM.rtSubtitle.innerText = \`Memuat \${total} riwayat dari IndexedDB lokal...\`;
            DOM.ayatContainer.innerHTML = '<div class="loading-state"><h2>🚀 Mengambil Data Hadist...</h2><p>Tunggu sebentar...</p></div>';
            
            try {
                window.GLOBAL_HADITH = window.GLOBAL_HADITH || {};
                if(!window.GLOBAL_HADITH[id]) await loadScript(\`QuranHadist/data/hadist_js/\${id}.js\`);
                const hDataObj = window.GLOBAL_HADITH[id];
                const hData = hDataObj.items || hDataObj; // Handle both arrays and objects with .items
                
                DOM.rtSubtitle.innerText = \`Berhasil memuat \${hData.length} riwayat.\`;
                
                currentHadithData = hData;
                renderHadithPage(1);
                
            } catch(e) {
                DOM.ayatContainer.innerHTML = '<div style="color:red; padding:20px;">Gagal memuat Kitab Hadist.</div>';
            }
        }

        async function showSurahHadithSummary(surahNo) {
            const surahMeta = metaData.find(s => s.nomor == surahNo);
            const overlay = document.getElementById('hadistModalOverlay');
            const title = document.getElementById('hadistModalTitle');
            const body = document.getElementById('hadistModalBody');
            
            title.innerText = \`Hadist Pro Terkait Surah \${surahMeta.namaLatin}\`;
            body.innerHTML = '<div style="text-align:center; color:var(--accent-cyan);">Memproses Data Hadist Pro...</div>';
            overlay.classList.add('active');
            
            try {
                window.TAFSIR_DATA = window.TAFSIR_DATA || {};
                if (!window.TAFSIR_DATA[surahNo]) {
                    await loadScript(\`QuranHadist/data/tafsir_js/\${surahNo}.js\`);
                }
                const mapA = window.TAFSIR_DATA[surahNo].mapping_ayat || {};
                
                let html = '';
                const keys = Object.keys(mapA);
                if (keys.length === 0) {
                    html = '<div style="color:var(--text-muted);">Tidak ada riwayat hadist langsung untuk surah ini di database pro offline.</div>';
                } else {
                    html += \`<div class="hadith-group">
                        <div style="display:flex; flex-direction:column; gap:20px;">\`;
                        
                    keys.sort((a,b) => parseInt(a.split(':')[1]) - parseInt(b.split(':')[1])).forEach(k => {
                        const ayatNo = k.split(':')[1];
                        mapA[k].forEach((m) => {
                            html += \`<div style="background:rgba(255,255,255,0.02); padding:20px; border-radius:15px; border:1px solid rgba(245,208,97,0.2); position:relative; overflow:hidden;">
                                <div style="position:absolute; top:0; left:0; width:4px; height:100%; background:var(--accent-gold);"></div>
                                <div style="color:var(--accent-gold); font-size:14px; margin-bottom:15px; font-weight:bold;">
                                    <span style="background:rgba(245,208,97,0.1); padding:4px 10px; border-radius:20px; margin-right:10px;">Ayat \${ayatNo}</span>
                                    Riwayat \${m.p} (No. \${m.n || m.id})
                                </div>
                                <div class="notranslate" style="font-family:'Amiri'; font-size:26px; line-height:2; direction:rtl; text-align:right; margin-bottom:15px; color:#fff;">\${m.ar || ''}</div>
                                <div style="color:var(--text-main); font-size:15px; line-height:1.7;">"\${m.trj || ''}"</div>
                            </div>\`;
                        });
                    });
                    html += \`</div></div>\`;
                }
                body.innerHTML = html;
            } catch (e) {
                body.innerHTML = '<div style="color:red;">Gagal memuat data hadist terkait.</div>';
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
            
            if(typeof KAMUS_AJAIB_PRO === 'undefined') {
                await loadScript('QuranHadist/kamus_ajaib_pro.js').catch(e=>{});
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
                    let textToSearch = ((h.id || "") + " " + (h.arab || "")).toLowerCase();
                    // Hilangkan harakat agar pencarian Arab lebih fleksibel
                    textToSearch = textToSearch.replace(/[\u0617-\u061A\u064B-\u0652\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '');
                    
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
                <h3 style="color:var(--accent-gold); margin-bottom:10px;">⚡ Deep Scan Selesai! Menemukan \${matches.length} Hadist (Menampilkan \${limit} Teratas).</h3>\`;
                
            kws.forEach(kw => {
                infoLog += \`<div style="color:var(--text-main); font-size:14px; margin-bottom:5px;">Pencarian Kata: <strong>"\${kw}"</strong>.\`;
                if (typeof KAMUS_AJAIB_PRO !== 'undefined' && KAMUS_AJAIB_PRO[kw]) {
                    const k = KAMUS_AJAIB_PRO[kw];
                    infoLog += \`<div style="color:var(--accent-cyan); margin-top:4px; padding-left:12px; border-left:2px solid var(--accent-cyan);">↳ Bentuk Arab: <strong>"\${k.arab}"</strong> (Di Al-Quran muncul \${k.count} kali).</div>\`;
                }
                infoLog += \`</div>\`;
            });
                
            infoLog += \`<div style="color:var(--text-muted); font-size:12px; margin-top:10px;">*(Pencarian melintasi 9 Kitab Utama secara real-time)*</div></div>\`;
                
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
                    <div class="notranslate" style="font-family:'Amiri'; font-size:30px; line-height:2; text-align:right; margin-bottom:20px; color:var(--accent-gold); margin-top:10px;">\${m.arab}</div>
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
                    if(typeof KAMUS_AJAIB_PRO === 'undefined') {
                        await loadScript('QuranHadist/kamus_ajaib_pro.js').catch(e=>{});
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
                infoLog += \`<div style="color:var(--text-main); font-size:14px; margin-bottom:5px;">Kata <strong>"\${kw}"</strong> (Terjemahan) muncul total <strong>\${totalFoundWords[kw] || 0} kali</strong> dalam Al-Quran.\`;
                
                if (typeof KAMUS_AJAIB_PRO !== 'undefined' && KAMUS_AJAIB_PRO[kw]) {
                    const k = KAMUS_AJAIB_PRO[kw];
                    infoLog += \`<div style="color:var(--accent-cyan); margin-top:4px; padding-left:12px; border-left:2px solid var(--accent-cyan);">↳ Bentuk Arab: <strong>"\${k.arab}"</strong> muncul <strong>\${k.count} kali</strong>.</div>\`;
                }
                
                infoLog += \`</div>\`;
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
                        <div class="notranslate" style="font-family:'Amiri'; font-size:36px; line-height:2; text-align:right; margin-bottom:20px; color:var(--accent-gold);">\${m.teksArab}</div>
                        <div style="color:var(--border-active); font-weight:600; font-size:16px; margin-bottom:10px;">\${m.teksLatin}</div>
                        <div style="color:var(--text-main); font-size:14px; line-height:1.6;">\${hl(m.text, kws)}</div>
                    </div>\`;
                });
                resultsHTML += \`</div>\`;
            });
            
            DOM.rtSubtitle.innerText = \`Ditemukan \${total} hasil\`;
            DOM.ayatContainer.innerHTML = resultsHTML;
        }

        // --- JUMP TO AYAT / HADIST ---
        function jumpToNumber() {
            const num = document.getElementById('inputJump').value;
            
            // Tentukan selector berdasarkan mode
            const selector = currentMode === 'quran' ? 'div[id^="ayat-"]' : 'div[id^="hadist-"]';
            const allItems = document.querySelectorAll(selector);
            
            if(!num) {
                // Jika input kosong, tampilkan semua kembali
                allItems.forEach(el => el.style.display = 'block');
                return;
            }
            
            let targetId = (currentMode === 'quran' ? 'ayat-' : 'hadist-') + num;
            const targetEl = document.getElementById(targetId);
            
            if(targetEl) {
                // SEMBUNYIKAN SEMUA
                allItems.forEach(el => el.style.display = 'none');
                
                // TAMPILKAN HANYA TARGET
                targetEl.style.display = 'block';
                
                // Animasi Sorotan
                targetEl.style.boxShadow = '0 0 20px var(--accent-gold)';
                setTimeout(() => targetEl.style.boxShadow = 'none', 2000);
            } else {
                alert((currentMode === 'quran' ? 'Ayat' : 'Hadist') + ' nomor ' + num + ' tidak ditemukan di layar ini.');
            }
        }
        // --- AUDIO PLAYER & RECITER ---
        let currentAudio = null;
        let isPlaying = false;
        let currentPlaySurah = 0;
        let currentPlayAyat = 0;
        
        function formatNumber(num) {
            return num.toString().padStart(3, '0');
        }
        
        function getAudioUrl(surahNo, ayatNo) {
            const reciter = document.getElementById('selectReciter').value;
            let folder = "Misyari_Rasyid"; 
            if (reciter === "Mishary Rashid Alafasy") folder = "Misyari_Rasyid";
            else if (reciter === "Abdul Baset Abdul Samad") folder = "Abdul_Basit";
            else if (reciter === "Abdur-Rahman as-Sudais") folder = "Abdurrahman_As_Sudais";
            else if (reciter === "Mahmoud Khalil Al-Husary") folder = "Mahmoud_Khalil_Al_Husary";
            return 'QuranHadist/data/audio/' + folder + '/' + formatNumber(surahNo) + formatNumber(ayatNo) + '.mp3';
        }
        
        function changeReciter() {
            if(currentAudio) {
                currentAudio.pause();
                currentAudio = null;
            }
            isPlaying = false;
            document.getElementById('iconPlayMain').innerHTML = '<path d="M8 5v14l11-7z"/>';
            document.getElementById('audioTime').innerText = "00:00 / 00:00";
        }
        
        function updateAudioTime() {
            if (!currentAudio) return;
            const timeTxt = document.getElementById('audioTime');
            let sec = Math.floor(currentAudio.currentTime || 0);
            let m = Math.floor(sec/60).toString().padStart(2, '0');
            let s = (sec%60).toString().padStart(2, '0');
            
            let durStr = "00:00";
            if (currentAudio.duration && !isNaN(currentAudio.duration) && currentAudio.duration !== Infinity) {
                let dSec = Math.floor(currentAudio.duration);
                let dm = Math.floor(dSec/60).toString().padStart(2, '0');
                let ds = (dSec%60).toString().padStart(2, '0');
                durStr = dm + ':' + ds;
            }
            timeTxt.innerText = m + ':' + s + ' / ' + durStr;
        }
        
        function playAyatAudio(surahNo, ayatNo, autoplayNext = false) {
            if(currentAudio) {
                currentAudio.pause();
            }
            currentPlaySurah = surahNo;
            currentPlayAyat = ayatNo;
            highlightPlayingAyat(ayatNo);
            
            const url = getAudioUrl(surahNo, ayatNo);
            currentAudio = new Audio(url);
            currentAudio.addEventListener('loadedmetadata', updateAudioTime);
            currentAudio.addEventListener('timeupdate', updateAudioTime);
            currentAudio.addEventListener('ended', function() {
                if (autoplayNext) {
                    let fullData = window.QURAN_SURAH[surahNo].ayat;
                    if (fullData && currentPlayAyat < fullData.length) {
                        playAyatAudio(surahNo, currentPlayAyat + 1, true);
                    } else {
                        stopMainAudio();
                    }
                } else {
                    stopMainAudio();
                }
            });
            currentAudio.addEventListener('error', function(e) {
                console.error("Audio error or file not found:", url);
                alert("Mohon maaf, file audio offline belum tersedia.");
                stopMainAudio();
            });
            currentAudio.play().then(() => {
                isPlaying = true;
                document.getElementById('iconPlayMain').innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
                highlightPlayingAyat(currentPlayAyat, true);
            }).catch(e => {
                console.error("Autoplay prevented:", e);
                stopMainAudio();
            });
        }
        
        function stopMainAudio() {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
            }
            isPlaying = false;
            document.getElementById('iconPlayMain').innerHTML = '<path d="M8 5v14l11-7z"/>';
            document.getElementById('audioTime').innerText = "00:00 / 00:00";
            highlightPlayingAyat(0, true); // Reset highlight
        }
        
        function toggleAudio() {
            if (!currentAyatSurahNo) return; 
            if (!isPlaying) {
                playAyatAudio(currentAyatSurahNo, currentPlayAyat || 1, true);
            } else {
                if (currentAudio) {
                    currentAudio.pause();
                }
                isPlaying = false;
                document.getElementById('iconPlayMain').innerHTML = '<path d="M8 5v14l11-7z"/>';
                highlightPlayingAyat(currentPlayAyat, true); // Pause icon
            }
        }
        
        function highlightPlayingAyat(ayatNo, skipPageCheck = false) {
            if (currentAyatSurahNo !== currentPlaySurah) return; 
            
            if (!skipPageCheck && currentAyatData.length > 0) {
                let aIdx = currentAyatData.findIndex(a => a.nomorAyat == ayatNo);
                if (aIdx >= 0) {
                    let requiredPage = Math.floor(aIdx / ayatPerPage) + 1;
                    if (requiredPage !== currentAyatPage) {
                        renderAyatPage(requiredPage);
                        return; // renderAyatPage will call this function again at the end
                    }
                }
            }
            
            document.querySelectorAll('.ayat-row').forEach(el => {
                el.style.border = '1px solid var(--border-color)';
                el.style.boxShadow = 'none';
            });
            document.querySelectorAll('.btn-play-ayat').forEach(btn => {
                btn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
            });
            
            if (ayatNo === 0) return; // just reset
            
            let el = document.getElementById('ayat-' + ayatNo);
            if (el) {
                el.style.border = '1px solid var(--accent-cyan)';
                el.style.boxShadow = '0 0 15px rgba(0,229,255,0.2)';
                el.scrollIntoView({behavior: "smooth", block: "center"});
            }
            let btn = document.getElementById('btnPlayAyat-' + ayatNo);
            if (btn && isPlaying) {
                btn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
            }
        }
        
        function toggleAyatAudio(surahNo, ayatNo) {
            if (currentPlaySurah === surahNo && currentPlayAyat === ayatNo && isPlaying) {
                toggleAudio();
            } else {
                playAyatAudio(surahNo, ayatNo, true);
            }
        }


        const proLanguages = [
            {code: 'id', name: '🇮🇩 Indonesia', flag: '🇮🇩'},
            {code: 'en', name: '🇬🇧 English', flag: '🇬🇧'},
            {code: 'ar', name: '🇸🇦 Arabic', flag: '🇸🇦'},
            {code: 'ur', name: '🇵🇰 Urdu', flag: '🇵🇰'},
            {code: 'ms', name: '🇲🇾 Malay', flag: '🇲🇾'},
            {code: 'tr', name: '🇹🇷 Turkish', flag: '🇹🇷'},
            {code: 'fa', name: '🇮🇷 Persian', flag: '🇮🇷'},
            {code: 'fr', name: '🇫🇷 French', flag: '🇫🇷'},
            {code: 'de', name: '🇩🇪 German', flag: '🇩🇪'},
            {code: 'ru', name: '🇷🇺 Russian', flag: '🇷🇺'},
            {code: 'zh-CN', name: '🇨🇳 Chinese', flag: '🇨🇳'},
            {code: 'ja', name: '🇯🇵 Japanese', flag: '🇯🇵'},
            {code: 'ko', name: '🇰🇷 Korean', flag: '🇰🇷'},
            {code: 'hi', name: '🇮🇳 Hindi', flag: '🇮🇳'},
            {code: 'bn', name: '🇧🇩 Bengali', flag: '🇧🇩'},
            {code: 'th', name: '🇹🇭 Thai', flag: '🇹🇭'},
            {code: 'es', name: '🇪🇸 Spanish', flag: '🇪🇸'},
            {code: 'pt', name: '🇵🇹 Portuguese', flag: '🇵🇹'},
            {code: 'it', name: '🇮🇹 Italian', flag: '🇮🇹'},
            {code: 'nl', name: '🇳🇱 Dutch', flag: '🇳🇱'},
            {code: 'vi', name: '🇻🇳 Vietnamese', flag: '🇻🇳'},
            {code: 'tl', name: '🇵🇭 Tagalog', flag: '🇵🇭'},
            {code: 'sw', name: '🇰🇪 Swahili', flag: '🇰🇪'},
            {code: 'ha', name: '🇳🇬 Hausa', flag: '🇳🇬'},
            {code: 'sq', name: '🇦🇱 Albanian', flag: '🇦🇱'},
            {code: 'bs', name: '🇧🇦 Bosnian', flag: '🇧🇦'},
            {code: 'uz', name: '🇺🇿 Uzbek', flag: '🇺🇿'},
            {code: 'tg', name: '🇹🇯 Tajik', flag: '🇹🇯'},
            {code: 'kk', name: '🇰🇿 Kazakh', flag: '🇰🇿'},
            {code: 'ky', name: '🇰🇬 Kyrgyz', flag: '🇰🇬'},
            {code: 'tk', name: '🇹🇲 Turkmen', flag: '🇹🇲'},
            {code: 'az', name: '🇦🇿 Azerbaijani', flag: '🇦🇿'},
            {code: 'ku', name: '🇮🇶 Kurdish', flag: '🇮🇶'},
            {code: 'ps', name: '🇦🇫 Pashto', flag: '🇦🇫'},
            {code: 'sd', name: '🇵🇰 Sindhi', flag: '🇵🇰'},
            {code: 'ug', name: '🇨🇳 Uyghur', flag: '🇨🇳'},
            {code: 'tt', name: '🇷🇺 Tatar', flag: '🇷🇺'},
            {code: 'cv', name: '🇷🇺 Chuvash', flag: '🇷🇺'},
            {code: 'ba', name: '🇷🇺 Bashkir', flag: '🇷🇺'},
            {code: 'ce', name: '🇷🇺 Chechen', flag: '🇷🇺'},
            {code: 'av', name: '🇷🇺 Avar', flag: '🇷🇺'},
            {code: 'yi', name: '🇮🇱 Yiddish', flag: '🇮🇱'},
            {code: 'he', name: '🇮🇱 Hebrew', flag: '🇮🇱'},
            {code: 'am', name: '🇪🇹 Amharic', flag: '🇪🇹'},
            {code: 'so', name: '🇸🇴 Somali', flag: '🇸🇴'},
            {code: 'yo', name: '🇳🇬 Yoruba', flag: '🇳🇬'},
            {code: 'ig', name: '🇳🇬 Igbo', flag: '🇳🇬'},
            {code: 'zu', name: '🇿🇦 Zulu', flag: '🇿🇦'},
            {code: 'xh', name: '🇿🇦 Xhosa', flag: '🇿🇦'},
            {code: 'af', name: '🇿🇦 Afrikaans', flag: '🇿🇦'},
            {code: 'mg', name: '🇲🇬 Malagasy', flag: '🇲🇬'},
            {code: 'ny', name: '🇲🇼 Chichewa', flag: '🇲🇼'},
            {code: 'st', name: '🇱🇸 Sesotho', flag: '🇱🇸'},
            {code: 'sn', name: '🇿🇼 Shona', flag: '🇿🇼'},
            {code: 'su', name: '🇮🇩 Sundanese', flag: '🇮🇩'},
            {code: 'jv', name: '🇮🇩 Javanese', flag: '🇮🇩'},
            {code: 'km', name: '🇰🇭 Khmer', flag: '🇰🇭'},
            {code: 'lo', name: '🇱🇦 Lao', flag: '🇱🇦'},
            {code: 'my', name: '🇲🇲 Burmese', flag: '🇲🇲'},
            {code: 'si', name: '🇱🇰 Sinhala', flag: '🇱🇰'},
            {code: 'ta', name: '🇮🇳 Tamil', flag: '🇮🇳'},
            {code: 'te', name: '🇮🇳 Telugu', flag: '🇮🇳'},
            {code: 'ml', name: '🇮🇳 Malayalam', flag: '🇮🇳'},
            {code: 'kn', name: '🇮🇳 Kannada', flag: '🇮🇳'},
            {code: 'mr', name: '🇮🇳 Marathi', flag: '🇮🇳'},
            {code: 'gu', name: '🇮🇳 Gujarati', flag: '🇮🇳'},
            {code: 'pa', name: '🇮🇳 Punjabi', flag: '🇮🇳'},
            {code: 'or', name: '🇮🇳 Odia', flag: '🇮🇳'},
            {code: 'as', name: '🇮🇳 Assamese', flag: '🇮🇳'},
            {code: 'mai', name: '🇮🇳 Maithili', flag: '🇮🇳'},
            {code: 'bho', name: '🇮🇳 Bhojpuri', flag: '🇮🇳'},
            {code: 'sa', name: '🇮🇳 Sanskrit', flag: '🇮🇳'},
            {code: 'ne', name: '🇳🇵 Nepali', flag: '🇳🇵'},
            {code: 'dz', name: '🇧🇹 Dzongkha', flag: '🇧🇹'},
            {code: 'bo', name: '🇨🇳 Tibetan', flag: '🇨🇳'},
            {code: 'mn', name: '🇲🇳 Mongolian', flag: '🇲🇳'},
            {code: 'ka', name: '🇬🇪 Georgian', flag: '🇬🇪'},
            {code: 'hy', name: '🇦🇲 Armenian', flag: '🇦🇲'},
            {code: 'el', name: '🇬🇷 Greek', flag: '🇬🇷'},
            {code: 'bg', name: '🇧🇬 Bulgarian', flag: '🇧🇬'},
            {code: 'mk', name: '🇲🇰 Macedonian', flag: '🇲🇰'},
            {code: 'sr', name: '🇷🇸 Serbian', flag: '🇷🇸'},
            {code: 'hr', name: '🇭🇷 Croatian', flag: '🇭🇷'},
            {code: 'sl', name: '🇸🇮 Slovenian', flag: '🇸🇮'},
            {code: 'sk', name: '🇸🇰 Slovak', flag: '🇸🇰'},
            {code: 'cs', name: '🇨🇿 Czech', flag: '🇨🇿'},
            {code: 'pl', name: '🇵🇱 Polish', flag: '🇵🇱'},
            {code: 'hu', name: '🇭🇺 Hungarian', flag: '🇭🇺'},
            {code: 'ro', name: '🇷🇴 Romanian', flag: '🇷🇴'},
            {code: 'uk', name: '🇺🇦 Ukrainian', flag: '🇺🇦'},
            {code: 'be', name: '🇧🇾 Belarusian', flag: '🇧🇾'},
            {code: 'lt', name: '🇱🇹 Lithuanian', flag: '🇱🇹'},
            {code: 'lv', name: '🇱🇻 Latvian', flag: '🇱🇻'},
            {code: 'et', name: '🇪🇪 Estonian', flag: '🇪🇪'},
            {code: 'fi', name: '🇫🇮 Finnish', flag: '🇫🇮'},
            {code: 'sv', name: '🇸🇪 Swedish', flag: '🇸🇪'},
            {code: 'no', name: '🇳🇴 Norwegian', flag: '🇳🇴'},
            {code: 'da', name: '🇩🇰 Danish', flag: '🇩🇰'},
            {code: 'is', name: '🇮🇸 Icelandic', flag: '🇮🇸'},
            {code: 'cy', name: '🏴󠁧󠁢󠁷󠁬󠁳󠁿 Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿'},
            {code: 'gd', name: '🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scottish Gaelic', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿'},
            {code: 'ga', name: '🇮🇪 Irish', flag: '🇮🇪'},
            {code: 'mt', name: '🇲🇹 Maltese', flag: '🇲🇹'},
            {code: 'eo', name: '🌍 Esperanto', flag: '🌍'},
            {code: 'la', name: '🏛️ Latin', flag: '🏛️'}
        ];

        function buildLanguageSelectors() {
            let opts = '<option value="id|id">🇮🇩 Indonesia (Baku)</option>';
            proLanguages.forEach(l => {
                if(l.code !== 'id') {
                    opts += '<option value="id|' + l.code + '">' + l.name + '</option>';
                }
            });
            document.querySelectorAll('.proLangSelector').forEach(sel => {
                sel.innerHTML = opts;
            });
        }

        function doGTranslate(langPair) {
            if(langPair.value) langPair = langPair.value;
            if(langPair == '') return;
            var el = document.querySelector('.goog-te-combo');
            if(!el) return;
            el.value = langPair.split('|')[1];
            if(document.createEvent) {
                var ev = document.createEvent("HTMLEvents");
                ev.initEvent("change", true, true);
                el.dispatchEvent(ev);
            } else {
                el.fireEvent("onchange");
            }
        }
        
        window.onload = initApp;
    </script>
<!-- Modal Container -->
<div class="premium-modal-overlay" id="hadistModalOverlay" onclick="if(event.target===this) this.classList.remove('active')">
    <div class="premium-modal">
        <div class="modal-header">
            <div class="modal-title" id="hadistModalTitle">Daftar Hadist Terkait</div>
            <button class="btn-close-modal" onclick="document.getElementById('hadistModalOverlay').classList.remove('active')">&times;</button>
        </div>
        <div class="modal-body" id="hadistModalBody">
            <!-- content -->
        </div>
    </div>
</div>

</body>
</html>`;

fs.writeFileSync('index_premium.html', html);
console.log("SUKSES: index_premium.html V3 Ultra Premium berhasil di-generate!");
