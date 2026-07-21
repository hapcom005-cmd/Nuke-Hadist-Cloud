const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = path.join(__dirname, 'QuranHadist', 'data');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const outputFile = path.join(dir, 'wbw_id.json');
let wbwData = {};

async function fetchChapter(chapterId) {
    return new Promise((resolve, reject) => {
        // translations=33 (Indonesian translation for words)
        // language=id (Indonesian UI language for words translation)
        // word_fields=text_uthmani,translation
        const url = `https://api.quran.com/api/v4/verses/by_chapter/${chapterId}?words=true&word_fields=text_uthmani,translation&language=id&per_page=300`;
        
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.verses) {
                        wbwData[chapterId] = {};
                        json.verses.forEach(v => {
                            const ayatNo = v.verse_number;
                            wbwData[chapterId][ayatNo] = v.words.map(w => ({
                                id: w.id,
                                text: w.text_uthmani || w.text,
                                tr: w.translation ? w.translation.text : ''
                            }));
                        });
                        console.log(`Fetched Chapter ${chapterId}`);
                    }
                    resolve();
                } catch(e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function start() {
    console.log("Starting brutal multi-threading fetch for Word-by-Word data (114 Surahs)...");
    const promises = [];
    // We will do it in batches of 10 to avoid rate limits
    for (let i = 1; i <= 114; i+=10) {
        const batch = [];
        for(let j = i; j < i+10 && j <= 114; j++) {
            batch.push(fetchChapter(j));
        }
        await Promise.all(batch);
        await new Promise(r => setTimeout(r, 1000)); // 1 second delay
    }
    
    fs.writeFileSync(outputFile, JSON.stringify(wbwData));
    console.log("SUCCESS! Word-by-Word Database saved to " + outputFile);
    
    // Create an injection for build_ui_premium_v3 to use this data
    createUIInjection();
}

function createUIInjection() {
    let html = fs.readFileSync('build_ui_premium_v3.js', 'utf8');
    
    // Inject the CSS for WBW
    const css = `
    .wbw-container { display:flex; flex-direction:row-reverse; flex-wrap:wrap; margin-bottom:15px; }
    .wbw-word { display:flex; flex-direction:column; align-items:center; margin:0 5px 15px 5px; cursor:pointer; }
    .wbw-word:hover { background: rgba(255, 215, 0, 0.1); border-radius: 8px; }
    .wbw-arab { font-family:'Amiri', serif; font-size:32px; color:var(--accent-gold); line-height:2; }
    .wbw-trans { font-size:12px; color:var(--text-muted); text-align:center; max-width:80px; }
    `;
    html = html.replace("html += '</style>';", css + "\\nhtml += '</style>';");
    
    // Inject the logic to load the JSON
    const scriptInj = `
    html += '<script>';
    html += 'var WBW_DATA = null;';
    html += 'fetch("QuranHadist/data/wbw_id.json").then(r=>r.json()).then(d => { WBW_DATA = d; console.log("WBW Loaded"); }).catch(e=>console.log("WBW Failed", e));';
    html += '</script>';
    `;
    html = html.replace("html += '</body>';", scriptInj + "\\nhtml += '</body>';");
    
    // Inject the button to toggle WBW
    const wbwBtn = `
    html += '<button class="share-button" onclick="toggleWBW(' + surahNo + ', ' + ayatNo + ')" style="border-color:var(--accent-purple); color:var(--accent-purple)">🔍 Terjemah Per Kata</button>';
    `;
    html = html.replace("html += '</div>'; // End ayatButtons", wbwBtn + "\\nhtml += '</div>'; // End ayatButtons");
    
    const wbwFunc = `
    html += '<script>';
    html += 'function toggleWBW(s, a) {';
    html += '    var el = document.getElementById("ayat-text-" + s + "-" + a);';
    html += '    if(el) {';
    html += '        if(el.getAttribute("data-wbw-active") === "true") {';
    html += '            el.innerHTML = el.getAttribute("data-original-html");';
    html += '            el.setAttribute("data-wbw-active", "false");';
    html += '            el.classList.remove("wbw-container");';
    html += '        } else {';
    html += '            if(!WBW_DATA) { alert("Data Word-by-Word sedang diunduh/belum tersedia."); return; }';
    html += '            var words = (WBW_DATA[s] && WBW_DATA[s][a]) ? WBW_DATA[s][a] : [];';
    html += '            if(words.length === 0) return;';
    html += '            el.setAttribute("data-original-html", el.innerHTML);';
    html += '            var newHtml = "";';
    html += '            for(var i=0; i<words.length; i++) {';
    html += '                var w = words[i];';
    html += '                if(w.text.includes("۩") || w.text.includes("bismillah")) continue;'; // skip some empty tokens
    html += '                newHtml += "<div class=\\'wbw-word\\'><div class=\\'wbw-arab\\'>" + w.text + "</div><div class=\\'wbw-trans\\'>" + w.tr + "</div></div>";';
    html += '            }';
    html += '            el.innerHTML = newHtml;';
    html += '            el.classList.add("wbw-container");';
    html += '            el.setAttribute("data-wbw-active", "true");';
    html += '        }';
    html += '    }';
    html += '}';
    html += '</script>';
    `;
    html = html.replace("html += '</body>';", wbwFunc + "\\nhtml += '</body>';");

    fs.writeFileSync('build_ui_premium_v3.js', html);
    console.log("WBW UI Injection inserted into build_ui_premium_v3.js");
}

start();
