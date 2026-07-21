const https = require('https');
const fs = require('fs');
const path = require('path');

const qaris = [
    { id: 'misyari', folder: 'Alafasy_64kbps', urlPath: 'Alafasy_64kbps' },
    { id: 'sudais', folder: 'Abdurrahmaan_As-Sudais_64kbps', urlPath: 'Abdurrahmaan_As-Sudais_64kbps' },
    { id: 'abdulbasit', folder: 'Abdul_Basit_Murattal_64kbps', urlPath: 'Abdul_Basit_Murattal_64kbps' },
    { id: 'shatri', folder: 'Abu_Bakr_Ash-Shaatree_64kbps', urlPath: 'Abu_Bakr_Ash-Shaatree_64kbps' },
    { id: 'ghamidi', folder: 'Ghamadi_40kbps', urlPath: 'Ghamadi_40kbps' },
    { id: 'husary', folder: 'Husary_64kbps', urlPath: 'Husary_64kbps' },
    { id: 'hudhaify', folder: 'Hudhaify_64kbps', urlPath: 'Hudhaify_64kbps' },
    { id: 'ajamy', folder: 'Ahmed_ibn_Ali_al-Ajamy_64kbps', urlPath: 'Ahmed_ibn_Ali_al-Ajamy_64kbps' },
    { id: 'rifai', folder: 'Hani_Rifai_64kbps', urlPath: 'Hani_Rifai_64kbps' },
    { id: 'minshawi', folder: 'Minshawy_Mujawwad_64kbps', urlPath: 'Minshawy_Mujawwad_64kbps' }
];

// Verify if the endpoints exist
async function checkQaris() {
    for (let q of qaris) {
        const url = `https://everyayah.com/data/${q.urlPath}/001001.mp3`;
        await new Promise(resolve => {
            https.get(url, (res) => {
                console.log(`[${res.statusCode}] ${q.urlPath}`);
                res.resume(); // consume response data to free up memory
                resolve();
            }).on('error', (err) => {
                console.log(`[ERROR] ${q.urlPath}: ${err.message}`);
                resolve();
            });
        });
    }
}

checkQaris();
