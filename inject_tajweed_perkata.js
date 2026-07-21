const fs = require('fs');

console.log('Converting JSON to JS for offline support...');
if (!fs.existsSync('QuranHadist/data/tajweed.js')) {
    const tajweedJson = fs.readFileSync('QuranHadist/data/tajweed.json', 'utf8');
    fs.writeFileSync('QuranHadist/data/tajweed.js', 'window.TAJWEED_DATA = ' + tajweedJson + ';');
}

if (!fs.existsSync('QuranHadist/data/wbw.js')) {
    const wbwJson = fs.readFileSync('QuranHadist/data/wbw_id.json', 'utf8');
    fs.writeFileSync('QuranHadist/data/wbw.js', 'window.WBW_DATA = ' + wbwJson + ';');
}
console.log('Converted successfully.');

// First reset build_ui_premium_v3.js to original backup if needed, but since we had an error we can just read it.
let code = fs.readFileSync('build_ui_premium_v3.js', 'utf8');

// 1. Inject Font and Mode Selectors (avoiding duplicate injection)
if (!code.includes('id="selectFont"')) {
    const fontSelectorHtml = `
                    <!-- Font Selector -->
                    <div class="reciter-selector">
                        <select id="selectFont" onchange="document.documentElement.style.setProperty('--font-arabic', this.value)">
                            <option value="'LPMQ Isep Misbah', sans-serif">LPMQ Isep Misbah (Kemenag RI)</option>
                            <option value="'KFGQPC Uthman Taha Naskh', sans-serif">Uthmani (Madinah)</option>
                            <option value="'Amiri', serif">Amiri (Klasik)</option>
                            <option value="'Me Quran', sans-serif">Me Quran</option>
                        </select>
                    </div>
                    <!-- Display Mode Selector -->
                    <div class="reciter-selector">
                        <select id="selectDisplayMode" onchange="changeDisplayMode(this.value)">
                            <option value="normal">Mode Standar</option>
                            <option value="tajweed">Tajwid Berwarna</option>
                            <option value="perkata">Terjemahan Perkata</option>
                        </select>
                    </div>
    `;
    code = code.replace('<!-- Murottal Selector -->', fontSelectorHtml + '\n                    <!-- Murottal Selector -->');
}

// 2. Inject CSS for Tajweed & Word-by-Word
if (!code.includes('.word-by-word-container')) {
    const customCSS = `
        .word-by-word-container {
            display: flex;
            flex-direction: row-reverse;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 25px;
            justify-content: flex-start;
        }
        .wbw-word {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            max-width: 120px;
        }
        .wbw-arab {
            font-family: var(--font-arabic, 'Amiri');
            font-size: 28px;
            color: var(--accent-gold);
            margin-bottom: 5px;
            direction: rtl;
        }
        .wbw-tr {
            font-size: 11px;
            color: var(--text-muted);
            line-height: 1.2;
        }
        
        /* Tajweed Colors */
        tajweed { font-family: var(--font-arabic, 'Amiri'); }
        .ham_wasl { color: #aaaaaa; }
        .sil_meem { color: #1690c8; }
        .madda_normal, .madda_permissible, .madda_necessary { color: #f2187b; }
        .qalaqah { color: #16c841; }
        .ikhafa { color: #c81616; }
        .idgham_wo_ghunnah { color: #aaaaaa; }
        .idgham_w_ghunnah { color: #c81616; }
        .iqlab { color: #c81616; }
        .ghunnah { color: #e6a414; }
`;
    code = code.replace('.dedikasi {', customCSS + '\n        .dedikasi {');
}

// 3. Update renderAyatPage logic
const replaceRender = `
                    <div id="text-arab-\\$\\{a.nomorAyat\\}" class="notranslate quran-text-container" style="font-family:var(--font-arabic, 'Amiri'); font-size:36px; line-height:2; text-align:right; margin-bottom:20px; color:var(--accent-gold);">
                        \\$\\{a.teksArab\\}
                    </div>
`;
code = code.split(`<div class="notranslate" style="font-family:'Amiri'; font-size:36px; line-height:2; text-align:right; margin-bottom:20px; color:var(--accent-gold);">\\$\{a.teksArab\}</div>`).join(replaceRender.trim());

// 4. Inject display mode logic
if (!code.includes('changeDisplayMode(mode)')) {
    const displayModeLogic = `
        async function changeDisplayMode(mode) {
            const loading = document.getElementById('loadingOverlay');
            loading.style.display = 'flex';
            try {
                if(mode === 'tajweed' && !window.TAJWEED_DATA) {
                    await loadScript('QuranHadist/data/tajweed.js');
                }
                if(mode === 'perkata' && !window.WBW_DATA) {
                    await loadScript('QuranHadist/data/wbw.js');
                }
                
                // Re-render current page
                renderAyatPage(currentAyatPage);
            } catch(e) {
                console.error(e);
                alert('Gagal memuat data mode ' + mode);
            }
            loading.style.display = 'none';
        }
        
        // Override renderAyatPage to handle modes
        const originalRenderAyatPage = renderAyatPage;
        renderAyatPage = function(page) {
            originalRenderAyatPage(page);
            applyCurrentModeToRenderedAyats();
        };
        
        function applyCurrentModeToRenderedAyats() {
            const mode = document.getElementById('selectDisplayMode') ? document.getElementById('selectDisplayMode').value : 'normal';
            if (mode === 'normal') return;
            
            const start = (currentAyatPage - 1) * ayatPerPage;
            const end = Math.min(start + ayatPerPage, currentAyatData.length);
            
            for(let i=start; i<end; i++) {
                const a = currentAyatData[i];
                const container = document.getElementById('text-arab-' + a.nomorAyat);
                if(!container) continue;
                
                if (mode === 'tajweed' && window.TAJWEED_DATA && window.TAJWEED_DATA[currentAyatSurahNo]) {
                    container.innerHTML = window.TAJWEED_DATA[currentAyatSurahNo][a.nomorAyat] || a.teksArab;
                } else if (mode === 'perkata' && window.WBW_DATA && window.WBW_DATA[currentAyatSurahNo]) {
                    const wbw = window.WBW_DATA[currentAyatSurahNo][a.nomorAyat];
                    if (wbw) {
                        let wbwHtml = '<div class="word-by-word-container">';
                        for (let j=0; j<wbw.length; j++) {
                            const word = wbw[j];
                            wbwHtml += '<div class="wbw-word">';
                            wbwHtml += '<div class="wbw-arab">' + word.text + '</div>';
                            wbwHtml += '<div class="wbw-tr">' + word.tr + '</div>';
                            wbwHtml += '</div>';
                        }
                        wbwHtml += '</div>';
                        container.innerHTML = wbwHtml;
                    }
                }
            }
        }
`;
    // We must escape backticks in displayModeLogic because build_ui_premium_v3.js wraps all html in backticks.
    // However, our code is going inside the script tag, which is STILL inside the giant backtick template literal of JS.
    // So if we use backticks in our JS code, they will terminate the template literal!
    // We already removed backticks from displayModeLogic string above. We only used string concatenation!
    code = code.replace('let currentAyatData = [];', displayModeLogic + '\n        let currentAyatData = [];');
}

fs.writeFileSync('build_ui_premium_v3.js', code);
console.log('UI Premium V3 updated with Tajweed, Word-by-Word, and Font Selector!');
const { execSync } = require('child_process');
execSync('node build_ui_premium_v3.js');
console.log('index_premium.html rebuilt!');
