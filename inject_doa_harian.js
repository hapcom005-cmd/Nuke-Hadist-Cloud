const fs = require('fs');

let html = fs.readFileSync('build_ui_premium_v3.js', 'utf8');

// Doa data
const doaJson = `
const HISNUL_MUSLIM = [
    { title: "Doa Bangun Tidur", arab: "الْحَمْدُ للهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", id: "Segala puji bagi Allah, yang telah membangunkan kami setelah menidurkan kami, dan kepada-Nya lah kami dibangkitkan." },
    { title: "Doa Masuk WC", arab: "بِسْمِ اللهِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ", id: "Dengan nama Allah. Ya Allah, sesungguhnya aku berlindung kepada-Mu dari godaan syaitan laki-laki dan perempuan." },
    { title: "Doa Keluar WC", arab: "غُفْرَانَكَ", id: "Aku memohon ampunan-Mu." },
    { title: "Doa Sebelum Makan", arab: "بِسْمِ اللهِ", id: "Dengan nama Allah." },
    { title: "Doa Setelah Makan", arab: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا الطَّعَامَ وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ", id: "Segala puji bagi Allah yang telah memberiku makanan ini dan merezekikannya kepadaku tanpa daya dan kekuatanku." }
];
`;

const doaModal = `
html += '<div id="doaModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; justify-content:center; align-items:center;">';
html += '<div style="background:var(--bg-base); width:90%; max-width:500px; max-height:80vh; border-radius:15px; padding:20px; overflow-y:auto; position:relative; box-shadow:0 0 20px rgba(0,0,0,0.5); border:1px solid var(--border-color);">';
html += '<button onclick="document.getElementById(\\'doaModal\\').style.display=\\'none\\'" style="position:absolute; top:15px; right:15px; background:var(--bg-elevated); border:none; color:var(--text-main); font-size:20px; width:35px; height:35px; border-radius:50%; cursor:pointer;">&times;</button>';
html += '<h2 style="color:var(--accent-gold); margin-top:0; text-align:center;">Hisnul Muslim (Kumpulan Doa)</h2>';
html += '<div id="doaListContainer"></div>';
html += '</div>';
html += '</div>';

html += '<script>';
html += doaJson;
html += 'function openDoaModal() {';
html += '    var list = document.getElementById("doaListContainer");';
html += '    list.innerHTML = "";';
html += '    HISNUL_MUSLIM.forEach(function(d) {';
html += '        list.innerHTML += "<div style=\\'background:var(--bg-elevated); margin-bottom:15px; padding:15px; border-radius:10px; border-left:3px solid var(--accent-gold);\\'>" +';
html += '            "<div style=\\'font-weight:bold; color:var(--accent-cyan); margin-bottom:10px;\\'>" + d.title + "</div>" +';
html += '            "<div class=\\'notranslate\\' style=\\'font-family:Amiri,serif; font-size:24px; color:var(--text-main); text-align:right; margin-bottom:10px;\\'>" + d.arab + "</div>" +';
html += '            "<div style=\\'font-size:14px; color:var(--text-muted);\\'>" + d.id + "</div>" +';
html += '        "</div>";';
html += '    });';
html += '    document.getElementById("doaModal").style.display = "flex";';
html += '}';
html += '</script>';
`;

html = html.replace("html += '</body>';", doaModal + "\\nhtml += '</body>';");

// Add button to main UI
const doaBtn = `<button onclick="openDoaModal()" style="background:var(--bg-elevated); color:var(--accent-gold); border:1px solid var(--accent-gold); padding:10px 15px; border-radius:10px; font-weight:bold; cursor:pointer; flex:1; text-align:center;">🤲 Kumpulan Doa</button>`;

html = html.replace('<!-- PLACEHOLDER_TOOLS -->', doaBtn + '\\n<!-- PLACEHOLDER_TOOLS -->');
// Wait, is there a PLACEHOLDER_TOOLS? No. Let's find a good spot.
// Like right after the surah selector
const mainHeaderInject = `
html += '<div style="display:flex; gap:10px; margin-bottom:20px;">';
html += '<button onclick="openDoaModal()" style="background:var(--bg-elevated); color:var(--accent-gold); border:1px solid var(--accent-gold); padding:10px 15px; border-radius:10px; font-weight:bold; cursor:pointer; flex:1;">🤲 Kumpulan Doa (Hisnul Muslim)</button>';
html += '<button onclick="window.scrollTo(0, document.body.scrollHeight)" style="background:var(--bg-elevated); color:var(--accent-cyan); border:1px solid var(--accent-cyan); padding:10px 15px; border-radius:10px; font-weight:bold; cursor:pointer; flex:1;">📊 Statistik & Khatam Tracker</button>';
html += '</div>';
`;
html = html.replace("html += '<div class=\"content-wrapper\">';", "html += '<div class=\"content-wrapper\">';\n" + mainHeaderInject);

fs.writeFileSync('build_ui_premium_v3.js', html);
console.log("Doa Harian & Quick Navigation injected into UI Build Script.");
