const ALL_SURAHS = ["Al-Fatihah","Al-Baqarah","Ali 'Imran"];
ALL_SURAHS.forEach((namaLatin, i) => {
    const num = i + 1;
    const str = `<button onclick="showTafsirs(this, ${num}, 1, '${namaLatin.replace(/'/g, "\'")}')">`;
    console.log(namaLatin, "==>", str);
});
