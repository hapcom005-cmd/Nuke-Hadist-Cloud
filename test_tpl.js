const num = 6;
const nomorAyat = 1;
const dataSurah = { namaLatin: "Al-An'am" };
const htmlAyat = `<button onclick="showTafsirs(this, ${num}, ${nomorAyat}, \`${dataSurah.namaLatin.replace(/'/g, ' ')}\`)">`;
console.log(htmlAyat);
