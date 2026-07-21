const fs = require('fs');

let html = fs.readFileSync('build_ui_premium_v3.js', 'utf8');

// 1. Move Doa button out of top header and add Tajweed Toggle
const oldHeader = `html += '<button onclick="openDoaModal()" style="background:var(--bg-elevated); color:var(--accent-gold); border:1px solid var(--accent-gold); padding:10px 15px; border-radius:10px; font-weight:bold; cursor:pointer; flex:1;">🤲 Kumpulan Doa (Hisnul Muslim)</button>';`;
const newTajweedToggle = `
html += '<div style="flex:1; display:flex; align-items:center; justify-content:center; background:var(--bg-elevated); border:1px solid var(--accent-purple); padding:10px; border-radius:10px;">';
html += '<label style="color:var(--accent-purple); font-weight:bold; margin-right:10px; cursor:pointer;"><input type="checkbox" id="tajweedToggle" onchange="toggleTajweedGlobal(this.checked)" style="margin-right:5px; transform:scale(1.2);">Mode Tajwid</label>';
html += '</div>';
`;
html = html.replace(oldHeader, newTajweedToggle);

// 2. Insert Doa button under the Hadist Panel
// Where to insert? Let's insert it inside the Hadist Panel header.
// `DOM.hadistContent.innerHTML = '...'` inside `showHadist`? No, let's just insert it in the DOM setup near the Hadist panel.
// Actually, it's easier to append it to the Hadist container inside index_premium.html
// Let's inject a button into the "panel-container" that holds Tafsir and Hadith.
const oldPanelHeaders = `html += '<h2 style="margin-top:0; color:var(--accent-gold); border-bottom:1px solid var(--border-color); padding-bottom:15px; display:flex; justify-content:space-between; align-items:center;">';`;
const newPanelHeadersWithDoa = `
html += '<div style="margin-bottom:15px;"><button onclick="openDoaModal()" style="background:var(--bg-elevated); color:var(--accent-gold); border:1px solid var(--accent-gold); padding:10px 15px; border-radius:10px; font-weight:bold; cursor:pointer; width:100%; box-shadow:0 4px 10px rgba(0,0,0,0.3);">🤲 Buka Kumpulan Doa (Hisnul Muslim)</button></div>';
` + oldPanelHeaders;
html = html.replace(oldPanelHeaders, newPanelHeadersWithDoa);


// 3. Inject Tajweed CSS and Data loading
const tajweedCSS = `
.tajweed-active tajweed[class="ham_wasl"], .tajweed-active tajweed[class="silent"] { color: #aaaaaa; }
.tajweed-active tajweed[class="madda_normal"], .tajweed-active tajweed[class="madda_permissible"], .tajweed-active tajweed[class="madda_necessary"] { color: #537CE5; }
.tajweed-active tajweed[class="qalaqah"] { color: #DD0008; }
.tajweed-active tajweed[class="idgham_wo_ghunnah"], .tajweed-active tajweed[class="idgham_ghunnah"], .tajweed-active tajweed[class="idgham_mutajanisayn"], .tajweed-active tajweed[class="idgham_mutaqaribayn"] { color: #169200; }
.tajweed-active tajweed[class="ghunnah"], .tajweed-active tajweed[class="ikhfa_shafawi"], .tajweed-active tajweed[class="ikhfa"] { color: #9400D3; }
.tajweed-active tajweed[class="iqlab"] { color: #26BFF0; }
`;
html = html.replace("html += '</style>';", tajweedCSS + "\\nhtml += '</style>';");

const tajweedJS = `
html += '<script>';
html += 'var TAJWEED_DATA = null;';
html += 'fetch("QuranHadist/data/tajweed.json").then(r=>r.json()).then(d => { TAJWEED_DATA = d; console.log("Tajweed Loaded"); }).catch(e=>console.log("Tajweed Failed"));';
html += 'var isTajweedActive = false;';
html += 'function toggleTajweedGlobal(state) {';
html += '    isTajweedActive = state;';
html += '    if(state && !TAJWEED_DATA) { alert("Data Tajwid sedang diunduh/belum tersedia."); document.getElementById("tajweedToggle").checked = false; isTajweedActive = false; return; }';
html += '    var list = document.querySelectorAll(".arab.notranslate");';
html += '    list.forEach(el => {';
html += '        var sid = el.id.replace("ayat-text-", "").split("-");';
html += '        var s = sid[0], a = sid[1];';
html += '        if(state) {';
html += '            el.setAttribute("data-normal-text", el.innerHTML);';
html += '            if(TAJWEED_DATA[s] && TAJWEED_DATA[s][a]) {';
html += '                el.innerHTML = TAJWEED_DATA[s][a];';
html += '                el.classList.add("tajweed-active");';
html += '            }';
html += '        } else {';
html += '            if(el.getAttribute("data-normal-text")) {';
html += '                el.innerHTML = el.getAttribute("data-normal-text");';
html += '                el.classList.remove("tajweed-active");';
html += '            }';
html += '        }';
html += '    });';
html += '}';
html += '</script>';
`;
html = html.replace("html += '</body>';", tajweedJS + "\\nhtml += '</body>';");

fs.writeFileSync('build_ui_premium_v3.js', html);
console.log("Tajweed & UI adjustments injected!");
