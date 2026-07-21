const fs = require('fs');
const path = require('path');
const d = 'C:/Users/Irwan Fahr/Desktop/Data_Tidak_Terpakai';
if (!fs.existsSync(d)) fs.mkdirSync(d);
const f = [
    'QuranHadist/data/audio',
    'QuranHadist/data/quran',
    'QuranHadist/data/hadist',
    'QuranHadist/data/tafsir',
    'QuranHadist/data/asbab_nuzul',
    'node_modules'
];
f.forEach(x => {
    if (fs.existsSync(x)) {
        fs.renameSync(x, path.join(d, path.basename(x)));
        console.log('Moved ' + x);
    }
});
