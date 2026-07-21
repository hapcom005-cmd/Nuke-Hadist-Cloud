const fs = require('fs');
const path = require('path');
function getFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    for(const item of items) {
        if(item === '.git' || item === '.wrangler') continue;
        const p = path.join(dir, item);
        if(fs.statSync(p).isDirectory()) getFiles(p, files);
        else files.push(p);
    }
    return files;
}
const all = getFiles('.');
const exts = {};
all.forEach(f => {
    const ext = path.extname(f).toLowerCase();
    exts[ext] = (exts[ext] || 0) + 1;
});
console.log('Extensions:', exts);
console.log('\n--- Large files (>5MB) ---');
all.forEach(f => {
    const s = fs.statSync(f).size;
    if(s > 5*1024*1024) console.log(f + ' - ' + (s/(1024*1024)).toFixed(2) + ' MB');
});
console.log('\n--- ZIP/RAR/LOG/TXT files ---');
all.forEach(f => {
    const ext = path.extname(f).toLowerCase();
    if(['.zip','.rar','.log','.txt'].includes(ext)) console.log(f);
});
