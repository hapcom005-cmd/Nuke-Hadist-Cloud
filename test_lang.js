const fs = require('fs');
const langs = ['eng', 'rus', 'msa', 'fra'];
for(let l of langs){
    try {
        const data = JSON.parse(fs.readFileSync(`QuranHadist/data/lang/${l}.json`));
        console.log(`${l.toUpperCase()} (Al-Fatihah 1): ${data['1_1']}`);
        console.log(`${l.toUpperCase()} (Al-Fatihah 2): ${data['1_2']}`);
        console.log('---');
    } catch (e) {
        console.log(`${l} file not found or error.`);
    }
}
