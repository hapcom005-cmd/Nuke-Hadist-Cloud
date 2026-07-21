import os
import re

files_to_patch = [
    'c:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/HAPCOM_Premium.html',
    'c:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/index.html',
    'c:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/index_premium.html',
    'c:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/build_ui_premium_v3.js'
]

new_search_logic = """        async function searchQuran(raw) {
            DOM.rtTitle.innerText = `Mencari: "${raw}"`;
            DOM.rtSubtitle.innerText = "🚀 Menghubungkan ke Satelit Pencari...";
            
            if(!raw || raw.trim() === '') return;
            const kw = raw.trim().toLowerCase();
            const isArabic = /[\u0600-\u06FF]/.test(kw);
            const edition = isArabic ? "quran-uthmani" : "id.indonesian";
            
            DOM.ayatContainer.innerHTML = '<div class="loading-state"><h2>🚀 Memanggil Satelit Pencari...</h2><p>Mencari kata "'+kw+'" dari Database Pusat...</p></div>';
            
            let quranMatches = [];
            let total = 0;
            let kws = [kw]; // Simple array for highlight
            
            try {
                // Panggil API Online (Tarik Hanya Yang Disentuh)
                let res = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(kw)}/all/${edition}`);
                let data = await res.json();
                
                if (data.code !== 200 || !data.data || !data.data.matches || data.data.matches.length === 0) {
                    DOM.ayatContainer.innerHTML = `<div style="padding:30px; text-align:center;"><h2 style="color:var(--text-muted)">Tidak ditemukan hasil untuk "${raw}"</h2></div>`;
                    return;
                }
                
                total = data.data.count;
                let matches = data.data.matches;
                
                DOM.ayatContainer.innerHTML = '<div class="loading-state"><h2>📥 Menarik Ayat Relevan...</h2><p>Mendownload HANYA surah yang memuat kata "'+kw+'"...</p></div>';
                
                let neededSurahs = new Set(matches.map(m => m.surah.number));
                
                window.QURAN_SURAH = window.QURAN_SURAH || {};
                for (let s of neededSurahs) {
                    if(!window.QURAN_SURAH[s]) {
                        try { await loadScript(`QuranHadist/data/quran_js/${s}.js`); } catch(e){}
                    }
                }
                
                matches.forEach(m => {
                    const s = m.surah.number;
                    const a = m.numberInSurah;
                    
                    const surahMeta = metaData.find(x => x.nomor == s);
                    if(!surahMeta || !window.QURAN_SURAH[s]) return;
                    
                    const surah = window.QURAN_SURAH[s];
                    const ayat = surah.ayat.find(x => x.nomorAyat == a);
                    if(!ayat) return;
                    
                    quranMatches.push({
                        score: 1, // API already sorts it sequentially
                        surah: { number: surahMeta.nomor, name: surahMeta.nama, englishName: surahMeta.namaLatin },
                        numberInSurah: ayat.nomorAyat, text: ayat.teksIndonesia, teksArab: ayat.teksArab, teksLatin: ayat.teksLatin
                    });
                });
                
            } catch(e) {
                console.error(e);
                DOM.ayatContainer.innerHTML = '<div style="color:red; padding:20px; text-align:center;"><h3>⚠️ Koneksi Satelit Gagal</h3><p>Pastikan koneksi internet aktif untuk pencarian instan online.</p></div>';
                return;
            }
            
            let infoLog = `<div style="background:var(--bg-panel); padding:20px; border-radius:12px; margin-bottom:20px; border:1px solid var(--border-color);">
                <h3 style="color:var(--accent-gold); margin-bottom:10px;">⚡ Pencarian Satelit Aktif! Menemukan ${total} Ayat.</h3>
                <div style="color:var(--text-main); font-size:14px; margin-bottom:5px;">Kata <strong>"${kw}"</strong> diunduh langsung dari Satelit (Online API).</div>
                <div style="color:var(--text-muted); font-size:12px; margin-top:10px;">*(Tafsir & Hadist terkait dapat dilihat dengan mengklik ayat)*</div></div>`;

            const surahGroups = {};
            quranMatches.forEach(m => {
                const key = m.surah.englishName;
                if (!surahGroups[key]) surahGroups[key] = { surah: m.surah, ayat: [] };
                surahGroups[key].ayat.push(m);
            });

            let mapHTML = `<div style="background:var(--bg-panel); padding:20px; border-radius:12px; margin-bottom:30px; border:1px solid var(--border-color);">
                <h3 style="color:var(--accent-gold); margin-bottom:15px;">🗺️ PETA NAVIGASI (Klik Melompat)</h3>
                <div style="display:flex; flex-wrap:wrap; gap:10px;">`;
                
            Object.entries(surahGroups).forEach(([name, g]) => {
                mapHTML += `<button onclick="document.getElementById('surah_${name.replace(/[^a-zA-Z]/g,'')}').scrollIntoView({behavior:'smooth'})" style="background:transparent; border:1px solid var(--border-active); color:var(--accent-gold); padding:8px 15px; border-radius:20px; cursor:pointer;">${name} (${g.ayat.length} ayat)</button>`;
            });
            mapHTML += `</div></div>`;

            let resultsHTML = infoLog + mapHTML;
            
            function hl(text, keywords) {
                let highlighted = text;
                keywords.forEach(keyword => {
                    const re = new RegExp(`(${keyword})`, 'gi');
                    highlighted = highlighted.replace(re, '<span style="background:rgba(245,208,97,0.3); color:var(--accent-gold); padding:0 3px; border-radius:3px;">$1</span>');
                });
                return highlighted;
            }

            Object.entries(surahGroups).forEach(([name, g]) => {
                resultsHTML += `<div id="surah_${name.replace(/[^a-zA-Z]/g,'')}" style="margin-bottom:30px; padding:15px; background:rgba(0,0,0,0.2); border-radius:12px; border-left:4px solid var(--accent-gold);">
                    <h3 style="color:var(--accent-gold); font-size:20px; margin-bottom:20px;">📖 Surah ${name}</h3>`;
                    
                g.ayat.forEach(m => {
                    resultsHTML += `
                    <div style="background:var(--bg-panel); border:1px solid var(--border-color); border-radius:12px; padding:30px; margin-bottom:20px; position:relative; cursor:pointer;" onclick="showTafsir(${m.surah.number}, ${m.numberInSurah})">
                        <div style="position:absolute; top:-15px; right:20px; background:var(--bg-base); border:2px solid var(--border-active); color:var(--border-active); width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px;">${m.numberInSurah}</div>
                        <div class="notranslate" style="font-family:var(--font-arabic, 'Amiri'); font-size:36px; line-height:2; text-align:right; margin-bottom:20px; color:var(--accent-gold);">${m.teksArab}</div>
                        <div style="color:var(--border-active); font-weight:600; font-size:16px; margin-bottom:10px;">${m.teksLatin}</div>
                        <div style="color:var(--text-main); font-size:14px; line-height:1.6;">${hl(m.text, kws)}</div>
                    </div>`;
                });
                resultsHTML += `</div>`;
            });
            
            DOM.rtSubtitle.innerText = `Ditemukan ${total} hasil`;
            DOM.ayatContainer.innerHTML = resultsHTML;
        }"""

for file_path in files_to_patch:
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Regex to find the entire async function searchQuran(raw) { ... }
        # We find the start and the next function declaration (which is jumpToNumber)
        pattern = re.compile(r'        async function searchQuran\(raw\).*?        // --- JUMP TO AYAT', re.DOTALL)
        
        # In index_premium.html, the structure might be different due to the previous patch, let's just do a simpler replacement.
        # Find start: "async function searchQuran(raw) {"
        # Find end of it: we know the next function is usually jumpToNumber or playAyat.
        
        # Let's use a robust approach: replace from "async function searchQuran(raw) {" up to "DOM.ayatContainer.innerHTML = resultsHTML;\n        }" or similar.
        
        # Let's just find the exact block by counting braces.
        start_idx = content.find("async function searchQuran(raw) {")
        if start_idx == -1:
            continue
            
        brace_count = 0
        end_idx = -1
        in_function = False
        
        for i in range(start_idx, len(content)):
            if content[i] == '{':
                brace_count += 1
                in_function = True
            elif content[i] == '}':
                brace_count -= 1
                if in_function and brace_count == 0:
                    end_idx = i + 1
                    break
                    
        if end_idx != -1:
            old_block = content[start_idx:end_idx]
            # Replace the block
            # Add back the leading spaces that were in front of 'async'
            spaces = content[:start_idx].split('\\n')[-1]
            if not spaces.isspace():
                spaces = '        '
            
            # The new logic block
            new_block = new_search_logic.strip()
            
            content = content[:start_idx] + new_block + content[end_idx:]
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Patched {file_path}")
"""
