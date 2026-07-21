const fs = require('fs');

const file1 = fs.readFileSync('HAPCOM_Premium.html', 'utf8');
const file2 = fs.readFileSync('C:/Users/Irwan Fahr/Desktop/Data_Tidak_Terpakai/index_premium.html', 'utf8');

console.log('=== HAPCOM ===');
const p1 = file1.indexOf('function showPanduan()');
if(p1!==-1) {
    console.log(file1.slice(p1, p1+600));
}

console.log('\n=== INDEX_PREMIUM ===');
const p2 = file2.indexOf('function openPanduanModal()');
if(p2!==-1) {
    console.log(file2.slice(p2, p2+600));
}
