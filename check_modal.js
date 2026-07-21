const fs = require('fs');
const file2 = fs.readFileSync('C:/Users/Irwan Fahr/Desktop/Data_Tidak_Terpakai/index_premium.html', 'utf8');
const p = file2.indexOf('id="panduanModalOverlay"');
if(p!==-1) console.log(file2.slice(p, p+1500));
