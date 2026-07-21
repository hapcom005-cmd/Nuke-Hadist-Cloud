const fs = require('fs');
let code = fs.readFileSync('build_ui_premium_v3.js', 'utf8');

const regex = /id="ayat-\$\{a\.nomorAyat\}"/g;
if (code.match(regex)) {
    code = code.replace(/\$\{a\.nomorAyat\}/g, '\\${a.nomorAyat}');
    code = code.replace(/\$\{a\.teksArab\}/g, '\\${a.teksArab}');
    code = code.replace(/\$\{a\.teksLatin\}/g, '\\${a.teksLatin}');
    code = code.replace(/\$\{a\.teksIndonesia\}/g, '\\${a.teksIndonesia}');
    code = code.replace(/\$\{currentAyatSurahNo\}/g, '\\${currentAyatSurahNo}');
    
    code = code.replace(/\$\{start \+ 1\}/g, '\\${start + 1}');
    code = code.replace(/\$\{end\}/g, '\\${end}');
    code = code.replace(/\$\{currentAyatData\.length\}/g, '\\${currentAyatData.length}');
    code = code.replace(/\$\{page\}/g, '\\${page}');
    code = code.replace(/\$\{totalPages\}/g, '\\${totalPages}');
    code = code.replace(/\$\{page > 1 \? page - 1 : 1\}/g, '\\${page > 1 ? page - 1 : 1}');
    code = code.replace(/\$\{page < totalPages \? page \+ 1 : totalPages\}/g, '\\${page < totalPages ? page + 1 : totalPages}');
    
    fs.writeFileSync('build_ui_premium_v3.js', code);
    console.log('Fixed variables');
} else {
    console.log('No literal ${a.nomorAyat} found');
}
