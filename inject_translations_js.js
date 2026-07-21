const fs = require('fs');

const html = fs.readFileSync('HAPCOM_Premium.html', 'utf8');

const jsCode = `
        // FITUR 100 BAHASA DUNIA
        let currentTranslationLang = 'id_indonesian';
        let translationCache = {};

        async function loadTranslationList() {
            try {
                const res = await fetch('QuranHadist/data/lang/languages.json');
                const langs = await res.json();
                const select = document.getElementById('selectTranslation');
                
                // Clear existing and keep indonesian
                select.innerHTML = '<option value="id_indonesian">🇮🇩 Indonesia (Kemenag)</option>';
                
                langs.forEach(lang => {
                    if (lang.code !== 'id') { // Skip indonesian as it's already there
                        const opt = document.createElement('option');
                        opt.value = lang.code;
                        opt.textContent = \`🌐 \${lang.name}\`;
                        select.appendChild(opt);
                    }
                });
            } catch(e) {
                console.error('Gagal memuat daftar bahasa:', e);
            }
        }

        async function changeTranslationLanguage(langCode) {
            currentTranslationLang = langCode;
            
            // Tampilkan loading indikator
            document.getElementById('rtSubtitle').innerHTML = '<span style="color:var(--accent-gold);">Menerjemahkan ke bahasa ' + langCode + '...</span>';
            
            if (langCode === 'id_indonesian') {
                if (window.currentView === 'quran') {
                    loadSurah(currentSurah);
                } else if (window.currentView === 'hadist') {
                    if (window.currentHadithBookId && window.GLOBAL_HADITH && window.GLOBAL_HADITH[window.currentHadithBookId]) {
                        currentHadithData = window.GLOBAL_HADITH[window.currentHadithBookId].items || window.GLOBAL_HADITH[window.currentHadithBookId];
                        renderHadithPage(1);
                        document.getElementById('rtSubtitle').innerText = \`Berhasil memuat \${currentHadithData.length} riwayat.\`;
                    }
                }
                return;
            }

            try {
                if (window.currentView === 'quran') {
                    if (!translationCache[langCode]) {
                        const res = await fetch(\`QuranHadist/data/lang/\${langCode}.json\`);
                        if (!res.ok) throw new Error('File bahasa tidak ditemukan!');
                        translationCache[langCode] = await res.json();
                    }
                    applyTranslationToScreen(translationCache[langCode]);
                } else if (window.currentView === 'hadist') {
                    if (!window.currentHadithBookId) return;
                    
                    const res = await fetch(\`QuranHadist/data/hadist_lang/\${langCode}/\${window.currentHadithBookId}.json\`);
                    if (!res.ok) throw new Error('Translasi Hadist belum selesai diproses oleh Mesin 12-Core untuk bahasa ini.');
                    
                    const translatedData = await res.json();
                    currentHadithData = translatedData.items || translatedData;
                    renderHadithPage(1);
                    document.getElementById('rtSubtitle').innerText = \`Berhasil menerjemahkan \${currentHadithData.length} riwayat ke \${langCode}.\`;
                }
            } catch(e) {
                console.error(e);
                alert('Gagal memuat translasi: ' + e.message);
                document.getElementById('rtSubtitle').textContent = 'Gagal menerjemahkan.';
            }
        }

        function applyTranslationToScreen(transData) {
            // Find current surah data in the loaded variables
            const surahData = window.quranData ? window.quranData.find(s => s.nomor == currentSurah) : null;
            if (!surahData) return;

            document.getElementById('rtTitle').textContent = \`Surah \${surahData.nama}\`;
            document.getElementById('rtSubtitle').textContent = \`Surah ke-\${surahData.nomor} • \${surahData.arti} • \${surahData.ayat.length} Ayat\`;

            let html = '';
            
            // Basmalah except for Surah 1 and 9
            if (surahData.nomor != 1 && surahData.nomor != 9) {
                html += \`<div class="bismillah">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</div>\`;
            }

            let displayMode = document.getElementById('selectDisplayMode').value;

            surahData.ayat.forEach(a => {
                let textArab = (displayMode === 'tajweed' && a.teksTajwid) ? a.teksTajwid : a.teksArab;
                
                // MENGAMBIL TERJEMAHAN DARI DATABASE 100 BAHASA!
                let translationText = transData[\`\${currentSurah}_\${a.nomorAyat}\`] || a.teksIndonesia;

                // Check bookmark
                let savedBookmarks = JSON.parse(localStorage.getItem('quran_bookmarks') || '[]');
                let isBookmarked = savedBookmarks.some(b => b.s == currentSurah && b.a == a.nomorAyat);
                let btnMark = isBookmarked ? 
                    \`<button class="btn-action active" onclick="toggleBookmark(\${currentSurah}, \${a.nomorAyat}, this)" title="Hapus Penanda"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg></button>\` :
                    \`<button class="btn-action" onclick="toggleBookmark(\${currentSurah}, \${a.nomorAyat}, this)" title="Tandai Terakhir Dibaca"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/></svg></button>\`;

                html += \`
                <div class="ayat-card" id="ayat-\${a.nomorAyat}">
                    <div class="ayat-header">
                        <div class="ayat-number">\${currentSurah}:\${a.nomorAyat}</div>
                        <div class="ayat-actions">
                            \${btnMark}
                            <button class="btn-action" onclick="playSingleAyat(\${currentSurah}, \${a.nomorAyat})" title="Putar Audio"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button>
                            <button class="btn-action" onclick="copyAyat(\${currentSurah}, \${a.nomorAyat}, '\${textArab.replace(/'/g, "\\\\'")}', '\${translationText.replace(/'/g, "\\\\'")}')" title="Salin"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
                        </div>
                    </div>
                    
                    <div class="ayat-arab">\${textArab}</div>\`;

                if (displayMode === 'perkata' && a.teksPerkata) {
                    html += \`<div class="word-by-word-container">\`;
                    let kataList = a.teksPerkata.split(';;');
                    kataList.forEach(k => {
                        let parts = k.split('|');
                        let ar = parts[0] || '';
                        let tr = parts[1] || '';
                        html += \`<div class="wbw-word"><div class="wbw-arab">\${ar}</div><div class="wbw-tr">\${tr}</div></div>\`;
                    });
                    html += \`</div>\`;
                }

                html += \`
                    <div class="ayat-latin">\${a.teksLatin}</div>
                    <div class="ayat-terjemahan">\${translationText}</div>
                </div>\`;
            });

            document.getElementById('ayatContainer').innerHTML = html;
        }

        // Call loadTranslationList on init
        document.addEventListener('DOMContentLoaded', () => {
            loadTranslationList();
        });
</script>`;

const newHtml = html.replace('</script>', jsCode);
fs.writeFileSync('HAPCOM_Premium.html', newHtml);
console.log('Injected translation functions into HAPCOM_Premium.html');
