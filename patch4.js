const fs = require('fs');
let html = fs.readFileSync('c:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/index.html', 'utf8');

const s1 = `            // Load meta if not loaded
            if (!window.TAFSIR_GLOBAL_META) {
                loadScript('QuranHadist/data/tafsir_all_js/meta.js').then(function() { buildTafsirList(); }).catch(function() {
                    document.getElementById('tafsirModalList').innerHTML = '<div style="padding:20px; color:red;">Gagal memuat meta.js</div>';
                });
            } else {
                buildTafsirList();
            }`;

const r1 = `            // Load meta if not loaded (Dari Cloud JSDelivr)
            if (!window.TAFSIR_GLOBAL_META) {
                document.getElementById('tafsirModalList').innerHTML = '<div style="padding:20px; color:var(--accent-cyan);">🚀 Memanggil Satelit JSDelivr...<br><span style="font-size:12px;color:var(--text-muted);">Menarik 122 Peta Tafsir Dunia (Online First)</span></div>';
                fetch('https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/editions.json')
                .then(r => r.json())
                .then(data => {
                    window.TAFSIR_GLOBAL_META = data.map(t => ({
                        slug: t.slug,
                        name: t.name,
                        isArabic: t.language_name === 'arabic'
                    }));
                    buildTafsirList();
                })
                .catch(function() {
                    document.getElementById('tafsirModalList').innerHTML = '<div style="padding:20px; color:red;">Gagal memuat peta dari satelit (Pastikan Internet Aktif).</div>';
                });
            } else {
                buildTafsirList();
            }`;

const s2 = `            // Load the JS file
            window.TAFSIR_GLOBAL = window.TAFSIR_GLOBAL || {};
            if (!window.TAFSIR_GLOBAL[slug] || !window.TAFSIR_GLOBAL[slug][sNo]) {
                try {
                    await loadScript('QuranHadist/data/tafsir_all_js/' + slug + '/' + sNo + '.js');
                } catch(e) {
                    content.innerHTML = '<span style="color:var(--text-muted);">File tafsir untuk surah ini tidak tersedia.</span>';
                    return;
                }
            }`;

const r2 = `            // Load JSON dari Cloud JSDelivr
            window.TAFSIR_GLOBAL = window.TAFSIR_GLOBAL || {};
            window.TAFSIR_GLOBAL[slug] = window.TAFSIR_GLOBAL[slug] || {};
            if (!window.TAFSIR_GLOBAL[slug][sNo]) {
                try {
                    let res = await fetch('https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/' + slug + '/' + sNo + '.json');
                    let data = await res.json();
                    let obj = {};
                    data.ayahs.forEach(a => { obj[a.ayah] = a.text; });
                    window.TAFSIR_GLOBAL[slug][sNo] = obj;
                } catch(e) {
                    content.innerHTML = '<span style="color:var(--text-muted);">Tafsir sedang offline atau tidak tersedia di server Global.</span>';
                    return;
                }
            }`;

const s3 = `                    if (!window.TAFSIR_GLOBAL[activeGlobalTafsirSlug] || !window.TAFSIR_GLOBAL[activeGlobalTafsirSlug][surahNo]) {
                        await loadScript('QuranHadist/data/tafsir_all_js/' + activeGlobalTafsirSlug + '/' + surahNo + '.js');
                    }`;

const r3 = `                    window.TAFSIR_GLOBAL[activeGlobalTafsirSlug] = window.TAFSIR_GLOBAL[activeGlobalTafsirSlug] || {};
                    if (!window.TAFSIR_GLOBAL[activeGlobalTafsirSlug][surahNo]) {
                        let res = await fetch('https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/' + activeGlobalTafsirSlug + '/' + surahNo + '.json');
                        let data = await res.json();
                        let obj = {};
                        data.ayahs.forEach(a => { obj[a.ayah] = a.text; });
                        window.TAFSIR_GLOBAL[activeGlobalTafsirSlug][surahNo] = obj;
                    }`;

html = html.replace(s1, r1);
html = html.replace(s2, r2);
html = html.replace(s3, r3);

fs.writeFileSync('c:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/index.html', html);
