const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = path.join(__dirname, 'QuranHadist', 'data');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const outputFile = path.join(dir, 'tajweed.json');
let tajweedData = {};

async function fetchChapter(chapterId) {
    return new Promise((resolve, reject) => {
        const url = `https://api.quran.com/api/v4/verses/by_chapter/${chapterId}?fields=text_uthmani_tajweed&per_page=300`;
        
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.verses) {
                        tajweedData[chapterId] = {};
                        json.verses.forEach(v => {
                            tajweedData[chapterId][v.verse_number] = v.text_uthmani_tajweed;
                        });
                        console.log(`Fetched Tajweed for Chapter ${chapterId}`);
                    }
                    resolve();
                } catch(e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function start() {
    console.log("Starting brutal fetch for Tajweed Colored Data (114 Surahs)...");
    for (let i = 1; i <= 114; i+=10) {
        const batch = [];
        for(let j = i; j < i+10 && j <= 114; j++) {
            batch.push(fetchChapter(j));
        }
        await Promise.all(batch);
        await new Promise(r => setTimeout(r, 1000));
    }
    
    fs.writeFileSync(outputFile, JSON.stringify(tajweedData));
    console.log("SUCCESS! Tajweed Database saved to " + outputFile);
}

start();
