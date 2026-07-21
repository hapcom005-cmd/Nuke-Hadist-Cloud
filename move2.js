const fs = require('fs');
const path = require('path');
const d = 'C:/Users/Irwan Fahr/Desktop/Data_Tidak_Terpakai';
const files = [
    'QuranHadist/search_index_part_0.js',
    'QuranHadist/search_index_part_1.js',
    'QuranHadist/search_index_part_2.js',
    'QuranHadist/search_index_part_3.js',
    'QuranHadist/search_index_part_4.js',
    'audio_download_log.txt',
    'tafsir_total_log.txt',
    'output.txt',
    'extract_12core.log',
    'mapper_12core.log',
    'smart_hadist_mapper.log',
    'smart_hadist_mapper_xeon.log',
    'super_mapper.log'
];
files.forEach(x => {
    if (fs.existsSync(x)) {
        fs.renameSync(x, path.join(d, path.basename(x)));
        console.log('Moved ' + x);
    }
});
