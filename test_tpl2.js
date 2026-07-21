const m = {surah: {number: 6, englishName: "Al-An'am"}, numberInSurah: 1};
let searchResultHTML = `<div class="ayat-card glass" onclick="showTafsirs(this, ${m.surah.number}, ${m.numberInSurah}, \`${m.surah.englishName.replace(/'/g, ' ')}\`)">`;
console.log(searchResultHTML);
