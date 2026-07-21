const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'HAPCOM_Premium.html');
let html = fs.readFileSync(targetFile, 'utf8');

// Cek apakah function-nya (bukan pemanggilannya) sudah ada
if (html.includes('function doSmartDirectSearch')) {
    console.log('Function already injected!');
    process.exit(0);
}

// 2. Suntikkan fungsi
const scriptToInject = `
<script>
        // === [OTA NOVA] SMART DIRECT SEARCH (O(1) HASH MAP) ===
        window.INDEX_CACHE = {}; 
        
        (function bypassCache() {
            const currentVersion = "v4.0_direct_search_v2";
            if (localStorage.getItem('HAPCOM_VERSION') !== currentVersion) {
                localStorage.setItem('HAPCOM_VERSION', currentVersion);
            }
        })();

        function stripHarakatSearch(text) {
            if (!text) return '';
            return text.replace(/[\\u064B-\\u065F\\u0670]/g, '').replace(/[^\\u0600-\\u06FF\\s]/g, '').trim();
        }

        async function doSmartDirectSearch(query) {
            const container = document.getElementById('ayatContainer');
            if (!query || query.trim() === '') {
                if (window.currentMode === 'quran') {
                    container.innerHTML = '<div class="loading-state"><h2>✨ Siap Mencari...</h2><p>Ketikkan kata untuk mulai mencari secara instan.</p></div>';
                } else if (window.currentMode === 'hadist') {
                    container.innerHTML = '<div class="loading-state"><h2>✨ Siap Mencari...</h2><p>Ketikkan kata untuk mencari hadist secara instan.</p></div>';
                }
                return;
            }

            query = query.trim().toLowerCase();
            const arabicQuery = stripHarakatSearch(query);
            const isArabic = /[\\u0600-\\u06FF]/.test(query);
            let searchKey = isArabic ? arabicQuery : query;
            
            const STOP_WORDS = ['telah', 'dan', 'yang', 'dari', 'kepada', 'untuk', 'dengan', 'ini', 'itu', 'di', 'ke', 'pada', 'dalam', 'kami', 'aku', 'dia', 'mereka'];
            let queryWords = searchKey.split(/\\s+/);
            while(queryWords.length > 0 && STOP_WORDS.includes(queryWords[0])) {
                queryWords.shift();
            }
            searchKey = queryWords.join(' ');
            
            if (searchKey.trim() === '') {
                 container.innerHTML = \`<div class="loading-state"><h2>🤷‍♂️ Kata Terlalu Umum</h2><p>Silakan gunakan kata kunci yang lebih spesifik.</p></div>\`;
                 return;
            }
            
            const prefix = searchKey.substring(0, 3);
            if (prefix.length < 1) return; 
            
            if (!window.INDEX_CACHE[prefix]) {
                try {
                    document.body.style.cursor = 'wait';
                    const response = await fetch(\`QuranHadist/data/offline_index_v2/idx_\${prefix}.json\`);
                    if (!response.ok) {
                        document.body.style.cursor = 'default';
                        container.innerHTML = \`<div class="loading-state"><h2>🤷‍♂️ Tidak Ditemukan</h2><p>Kata kunci "\${query}" tidak ditemukan dalam database.</p></div>\`;
                        return;
                    }
                    const data = await response.json();
                    window.INDEX_CACHE[prefix] = data;
                    document.body.style.cursor = 'default';
                } catch(e) {
                    document.body.style.cursor = 'default';
                    return; 
                }
            }

            const hasil = window.INDEX_CACHE[prefix][searchKey];
            
            if (!hasil || hasil.length === 0) {
                container.innerHTML = \`<div class="loading-state"><h2>🤷‍♂️ Tidak Ditemukan</h2><p>Kata "\${query}" tidak ditemukan.</p></div>\`;
                return;
            }

            renderDirectSearchResults(hasil, query);
        }

        function renderDirectSearchResults(idList, query) {
            const container = document.getElementById('ayatContainer');
            container.innerHTML = \`<div style="padding:15px; background:rgba(0,229,255,0.1); border:1px solid var(--accent-cyan); border-radius:8px; margin-bottom:15px; color:var(--text-main); font-weight:bold;">⚡ \${idList.length} Hasil Instan ditemukan untuk "\${query}"</div>\`;
            
            document.getElementById('rtTitle').innerText = \`Pencarian Instan\`;
            document.getElementById('rtSubtitle').innerText = \`\${idList.length} kecocokan untuk "\${query}"\`;

            const limit = Math.min(idList.length, 50);
            let htmlBuffer = '';
            for(let i = 0; i < limit; i++) {
                const docId = idList[i];
                if (docId.startsWith('q_')) {
                    const parts = docId.split('_');
                    const surahId = parts[1];
                    const ayatNo = parts[2];
                    htmlBuffer += \`<div style="background:var(--bg-panel); border:1px solid var(--border-color); border-radius:12px; padding:20px; margin-bottom:15px; cursor:pointer; transition:0.3s;" onmouseover="this.style.borderColor='var(--accent-gold)'" onmouseout="this.style.borderColor='var(--border-color)'" onclick="loadSurah(\${surahId}); setTimeout(()=>document.getElementById('inputJump').value=\${ayatNo}; jumpToNumber(), 500);">
                        <div style="color:var(--accent-gold); font-size:12px; font-weight:bold; margin-bottom:10px;">QURAN - Surah \${surahId} Ayat \${ayatNo}</div>
                        <div style="font-size:14px; color:var(--text-main);">Tekan untuk melompat ke Surah dan Ayat ini.</div>
                    </div>\`;
                } else if (docId.startsWith('h_')) {
                    const parts = docId.split('_');
                    const kitab = parts[1];
                    const no = parts[2];
                    htmlBuffer += \`<div style="background:var(--bg-panel); border:1px solid var(--border-color); border-radius:12px; padding:20px; margin-bottom:15px; cursor:pointer; transition:0.3s;" onmouseover="this.style.borderColor='var(--accent-gold)'" onmouseout="this.style.borderColor='var(--border-color)'" onclick="switchMode('hadist'); loadHadist('\${kitab}'); setTimeout(()=>document.getElementById('inputJump').value=\${no}; jumpToNumber(), 1000);">
                        <div style="color:var(--accent-cyan); font-size:12px; font-weight:bold; margin-bottom:10px;">HADIST - \${kitab.toUpperCase()} No. \${no}</div>
                        <div style="font-size:14px; color:var(--text-main);">Tekan untuk membuka kitab dan hadist ini.</div>
                    </div>\`;
                }
            }
            if (idList.length > 50) {
                htmlBuffer += \`<div style="text-align:center; padding:15px; color:var(--text-muted); font-style:italic;">Menampilkan 50 hasil pertama untuk menjaga kecepatan.</div>\`;
            }
            container.innerHTML += htmlBuffer;
        }
</script>
</body>`;

html = html.replace('</body>', scriptToInject);
fs.writeFileSync(targetFile, html);
console.log('Patch success!');
