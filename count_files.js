const fs = require('fs');
const path = require('path');

function countFiles(dir) {
    let count = 0;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        if (item === 'node_modules' || item === '.git' || item === 'Backup_Level3' || item === 'offline_index' || item === 'temp_index' || item === 'temp_index_v2') continue;
        const p = path.join(dir, item);
        if (fs.statSync(p).isDirectory()) {
            count += countFiles(p);
        } else {
            count++;
        }
    }
    return count;
}
console.log('Total files to deploy: ' + countFiles('.'));
