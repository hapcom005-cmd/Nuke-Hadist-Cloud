const fs = require('fs');
const path = require('path');
function c(d) {
    let count = 0;
    fs.readdirSync(d).forEach(f => {
        let p = path.join(d, f);
        if (fs.statSync(p).isDirectory()) count += c(p);
        else count++;
    });
    return count;
}
fs.readdirSync('QuranHadist').forEach(f => {
    let p = path.join('QuranHadist', f);
    if (fs.statSync(p).isDirectory()) {
        fs.readdirSync(p).forEach(sub => {
            let p2 = path.join(p, sub);
            if (fs.statSync(p2).isDirectory()) {
                console.log(p2 + ': ' + c(p2));
            } else {
                console.log(p2 + ' (file)');
            }
        });
    }
});
