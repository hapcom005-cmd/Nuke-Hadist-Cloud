const fs = require('fs');

const html = fs.readFileSync('HAPCOM_Premium.html', 'utf8');

// The old search logic:
// const prefix = searchKey.substring(0, 3);
// if (prefix.length < 1) return; 
// const response = await fetch(`QuranHadist/data/offline_index_v2/idx_${prefix}.json`);

let newHtml = html.replace(/const prefix = searchKey\.substring\(0, 3\);/g, `let prefix = searchKey.substring(0, 2);\n            prefix = prefix.replace(/[<>:"/\\\\|?*]/g, '_');`);
newHtml = newHtml.replace(/offline_index_v2/g, 'offline_index_v3');

fs.writeFileSync('HAPCOM_Premium.html', newHtml);
console.log('HAPCOM_Premium.html updated to use 2-letter prefix offline_index_v3');
