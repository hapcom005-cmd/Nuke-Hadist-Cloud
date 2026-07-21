const fs = require('fs');
const path = require('path');
function countFiles(dir) {
    let count = 0;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        if (['node_modules', '.git', 'Backup_Level3', 'offline_index', 'temp_index', 'temp_index_v2'].includes(item)) continue;
        const p = path.join(dir, item);
        if (fs.statSync(p).isDirectory()) count += countFiles(p);
        else count++;
    }
    return count;
}
fs.readdirSync('.').forEach(f => {
    if (['node_modules', '.git', 'Backup_Level3', 'offline_index', 'temp_index', 'temp_index_v2'].includes(f)) return;
    if (fs.statSync(f).isDirectory()) console.log(f + ': ' + countFiles(f));
});
