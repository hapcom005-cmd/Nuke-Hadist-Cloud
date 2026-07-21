const fs = require('fs');
let code = fs.readFileSync('build_ui_premium_v3.js', 'utf8');

const regex1 = /for\(let i=start; i<end; i\+\+\) \{[\s\S]*?if \(totalPages > 1\)/;
const replacement1 = `for(let i=start; i<end; i++) {
                const a = currentAyatData[i];
                html += \`
                <div id="ayat-\${a.nomorAyat}" class="ayat-row" style="background:var(--bg-panel); border:1px solid var(--border-color); border-radius:12px; padding:30px; margin-bottom:20px; position:relative; cursor:pointer;" onclick="showTafsir(\${currentAyatSurahNo}, \${a.nomorAyat})">
                    <div style="position:absolute; top:-15px; right:20px; background:var(--bg-base); border:2px solid var(--border-active); color:var(--border-active); width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px;">\${a.nomorAyat}</div>
                    
                    <button id="btnPlayAyat-\${a.nomorAyat}" class="btn-play-ayat" onclick="toggleAyatAudio(\${currentAyatSurahNo}, \${a.nomorAyat}); event.stopPropagation();" style="position:absolute; top:-15px; right:60px; background:var(--accent-cyan); color:var(--bg-base); border:none; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:10; box-shadow:0 2px 10px rgba(0,229,255,0.3);" title="Putar audio ayat ini">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </button>
                    
                    <div id="text-arab-\${a.nomorAyat}" class="notranslate quran-text-container" style="font-family:var(--font-arabic, 'Amiri'); font-size:36px; line-height:2; text-align:right; margin-bottom:20px; color:var(--accent-gold);">\${a.teksArab}</div>
                    
                    <div style="color:var(--border-active); font-weight:600; font-size:16px; margin-bottom:10px;">\${a.teksLatin}</div>
                    <div style="color:var(--text-main); font-size:14px; line-height:1.6;">\${a.teksIndonesia}</div>
                </div>\`;
            }
            
            if (totalPages > 1)`;

code = code.replace(regex1, replacement1);

// Also remove any duplicated for(let) blocks that got inserted by my bad replacements.
const regex2 = /if \(totalPages > 1\) \{[\s\S]*?for\(let i=start; i<end; i\+\+\) \{/;
const replacement2 = `if (totalPages > 1) {
                html += \`<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <div style="color:var(--accent-cyan);">Menampilkan Ayat \${start + 1} - \${end} dari \${currentAyatData.length} (Halaman \${page} dari \${totalPages})</div>
                    <div style="display:flex; gap:10px;">
                        <button class="btn-jump" onclick="renderAyatPage(\${page > 1 ? page - 1 : 1})" \${page === 1 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>&laquo; Back</button>
                        <button class="btn-jump" onclick="renderAyatPage(\${page < totalPages ? page + 1 : totalPages})" \${page === totalPages ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>Next &raquo;</button>
                    </div>
                </div>\`;
            }
            
            for(let i=start; i<end; i++) {`;
            
// Wait, regex2 is trying to clean up duplicate `for` block, but since I replaced the WHOLE block in regex1, the second `for` block might be after `if (totalPages > 1)`.
// Actually let's just make it simpler.
fs.writeFileSync('build_ui_premium_v3.js', code);
