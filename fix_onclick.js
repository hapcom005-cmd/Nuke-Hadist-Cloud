const fs = require('fs');
let content = fs.readFileSync('index_premium.html', 'utf8');

// The original code has: '${dataSurah.namaLatin.replace(/'/g, "\\'")}'
// We want to replace it with: \`${dataSurah.namaLatin.replace(/'/g, ' ')}\`
// Wait, no, we can just replace the string literal syntax to use html entities!
// Or even simpler: remove the replace call and use escape()!
// Actually, let's just make it \`${...replace(/'/g, ' ')}\` to avoid quotes entirely in the onclick arg!

// Let's replace: '${dataSurah.namaLatin.replace(/\'/g, "\\'")}'
content = content.replace(/'\$\{dataSurah\.namaLatin\.replace\(\/'\/g, "\\\\'"\)\}'/g, "\\`${dataSurah.namaLatin.replace(/'/g, ' ')}\\`");

content = content.replace(/'\$\{m\.surah\.englishName\.replace\(\/'\/g, "\\\\'"\)\}'/g, "\\`${m.surah.englishName.replace(/'/g, ' ')}\\`");

content = content.replace(/'\$\{s\.namaLatin\.replace\(\/'\/g, "\\\\'"\)\}'/g, "\\`${s.namaLatin.replace(/'/g, ' ')}\\`");

fs.writeFileSync('index_premium.html', content);
console.log("Fixed onclick templates.");
