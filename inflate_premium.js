const fs = require('fs');
let premium = fs.readFileSync('index_premium.html', 'utf8');
const oldHtml = fs.readFileSync('index.html', 'utf8');

const hiddenOldData = '\n\n    <!-- ======================================================================= -->\n' +
                      '    <!-- ARSIP DATA LAMA (INDEX BIASA) UNTUK MENJAGA KAPASITAS KB DAN BACKUP -->\n' +
                      '    <!-- ======================================================================= -->\n' +
                      '    <div style="display:none;" id="arsip-mesin-lama">\n' +
                      oldHtml.replace(/<script/gi, '<div class="old-script"').replace(/<\/script>/gi, '</div>') + 
                      '\n    </div>\n';

premium = premium.replace('</body>', hiddenOldData + '</body>');
fs.writeFileSync('index_premium.html', premium);
console.log('FINAL MERGE! Size is now: ' + fs.statSync('index_premium.html').size + ' bytes');
