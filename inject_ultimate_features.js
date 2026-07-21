const fs = require('fs');
let html = fs.readFileSync('build_ui_premium_v3.js', 'utf8');

// 1. Tambahkan CSS untuk Hafiz Mode (Blur)
const cssInjection = `
.hafiz-blur {
    filter: blur(8px);
    transition: filter 0.3s ease;
    cursor: pointer;
}
.hafiz-blur:hover {
    filter: blur(4px);
}
.hafiz-blur.revealed {
    filter: blur(0);
}
.note-button {
    background: transparent; border: 1px solid var(--accent-cyan); color: var(--accent-cyan); 
    padding: 5px 10px; border-radius: 6px; font-size: 11px; cursor: pointer; margin-right: 5px;
    transition: all 0.2s ease;
}
.note-button:hover {
    background: var(--accent-cyan); color: var(--bg-base);
}
.share-button {
    background: transparent; border: 1px solid var(--accent-gold); color: var(--accent-gold); 
    padding: 5px 10px; border-radius: 6px; font-size: 11px; cursor: pointer;
    transition: all 0.2s ease;
}
.share-button:hover {
    background: var(--accent-gold); color: var(--bg-base);
}
`;
html = html.replace("html += '</style>';", cssInjection + "\nhtml += '</style>';");

// 2. Injeksi Tombol ke Setiap Ayat (dalam renderAyatPage)
const ayatButtons = `
html += '<div style="margin-top:15px; display:flex; gap:10px; align-items:center;">';
html += '<button class="note-button" onclick="openNoteModal(' + surahNo + ', ' + ayatNo + ')">📝 Catatan Pribadi</button>';
html += '<button class="note-button" onclick="toggleHafizMode(' + surahNo + ', ' + ayatNo + ')">🧠 Mode Hafalan</button>';
html += '<button class="share-button" onclick="shareToQuranReflect(' + surahNo + ', ' + ayatNo + ')">🌐 Share Tadabbur</button>';
html += '</div>';
`;
// Find where the translation is rendered
html = html.replace(/html \+= '<div class="trans".*?<\/div>';/g, function(match) {
    return match + "\n" + ayatButtons;
});

// 3. Tambahkan JS global functions
const globalJs = `
html += '<script>';
html += 'function openNoteModal(s, a) {';
html += '    var existing = UserDataEngine.getNote(s, a);';
html += '    var note = prompt("Tulis Tadabbur/Catatan untuk Surah " + s + " Ayat " + a + ":", existing);';
html += '    if(note !== null) { UserDataEngine.saveNote(s, a, note); }';
html += '}';
html += 'function toggleHafizMode(s, a) {';
html += '    var el = document.getElementById("ayat-text-" + s + "-" + a);';
html += '    if(el) {';
html += '       if(el.classList.contains("hafiz-blur")) { el.classList.remove("hafiz-blur"); el.classList.remove("revealed"); }';
html += '       else { el.classList.add("hafiz-blur"); }';
html += '    }';
html += '}';
html += 'function shareToQuranReflect(s, a) {';
html += '    var note = UserDataEngine.getNote(s, a);';
html += '    var text = "Tadabbur Surah " + s + " Ayat " + a + ":\\n" + (note || "Subhanallah...");';
html += '    var url = "https://quranreflect.com/?text=" + encodeURIComponent(text);';
html += '    window.open(url, "_blank");';
html += '}';
// Klik untuk membuka blur satu per satu
html += 'document.addEventListener("click", function(e) {';
html += '    if(e.target.classList.contains("hafiz-blur")) {';
html += '        e.target.classList.add("revealed");';
html += '    }';
html += '});';
html += '</script>';
`;

html = html.replace('html += \'</body>\';', globalJs + "\nhtml += '</body>';");

// 4. Tambahkan ID unik ke div arab
html = html.replace("html += '<div class=\"arab notranslate\"", "html += '<div id=\"ayat-text-' + surahNo + '-' + ayatNo + '\" class=\"arab notranslate\"");

// Simpan kembali
fs.writeFileSync('build_ui_premium_v3.js', html);
console.log("Ultimate Features Phase 1 & 2 injected into UI Build Script.");
