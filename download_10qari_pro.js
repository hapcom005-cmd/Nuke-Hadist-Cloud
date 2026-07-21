const https = require('https');
const fs = require('fs');
const path = require('path');
const cluster = require('cluster');

const AUDIO_DIR = path.join(__dirname, 'QuranHadist', 'data', 'audio');

// 10 Qaris
const qaris = [
    { id: 'misyari', folder: 'Misyari_Rasyid', urlPath: 'Alafasy_64kbps' },
    { id: 'sudais', folder: 'Abdurrahman_As_Sudais', urlPath: 'Abdurrahmaan_As-Sudais_64kbps' },
    { id: 'abdulbasit', folder: 'Abdul_Basit', urlPath: 'Abdul_Basit_Murattal_64kbps' },
    { id: 'shatri', folder: 'Abu_Bakr_Ash_Shatri', urlPath: 'Abu_Bakr_Ash-Shaatree_64kbps' },
    { id: 'ghamidi', folder: 'Saad_Al_Ghamidi', urlPath: 'Ghamadi_40kbps' },
    { id: 'husary', folder: 'Mahmoud_Khalil_Al_Husary', urlPath: 'Husary_64kbps' },
    { id: 'hudhaify', folder: 'Ali_Al_Huthaify', urlPath: 'Hudhaify_64kbps' },
    { id: 'ajamy', folder: 'Ahmed_Al_Ajamy', urlPath: 'Ahmed_ibn_Ali_al-Ajamy_64kbps_QuranExplorer.Com' },
    { id: 'rifai', folder: 'Hani_Ar_Rifai', urlPath: 'Hani_Rifai_64kbps' },
    { id: 'minshawi', folder: 'Muhammad_Siddiq_Al_Minshawi', urlPath: 'Minshawy_Mujawwad_64kbps' }
];

const totalSurahs = 114;
const quranDir = path.join(__dirname, 'QuranHadist', 'data', 'quran');

// Generate all tasks
let tasks = [];
for (let qari of qaris) {
    for (let surahNum = 1; surahNum <= totalSurahs; surahNum++) {
        let surahPath = path.join(quranDir, `${surahNum}.json`);
        if (!fs.existsSync(surahPath)) continue;
        let surahData = JSON.parse(fs.readFileSync(surahPath, 'utf8'));
        let numAyat = surahData.jumlahAyat || (surahData.ayat ? surahData.ayat.length : 0);
        
        for (let ayat = 1; ayat <= numAyat; ayat++) {
            let sNumStr = surahNum.toString().padStart(3, '0');
            let aNumStr = ayat.toString().padStart(3, '0');
            let fileName = `${sNumStr}${aNumStr}.mp3`;
            let url = `https://everyayah.com/data/${qari.urlPath}/${fileName}`;
            let destFolder = path.join(AUDIO_DIR, qari.folder);
            let destPath = path.join(destFolder, fileName);
            tasks.push({ url, destPath, destFolder, name: `${qari.folder}/${fileName}` });
        }
    }
}

if (cluster.isPrimary) {
    console.log(`==================================================================`);
    console.log(`🎧 MESIN DOWNLOADER AUDIO (10 QARI - 62.360 FILE) AKTIF!`);
    console.log(`==================================================================`);
    console.log(`Total File yang akan didownload: ${tasks.length}`);
    
    // Create folders
    for (let qari of qaris) {
        let p = path.join(AUDIO_DIR, qari.folder);
        if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
    }

    // Filter already downloaded
    tasks = tasks.filter(t => !fs.existsSync(t.destPath));
    console.log(`Sisa file yang perlu didownload: ${tasks.length}`);

    const numCPUs = 12; // 12-core
    let activeWorkers = 0;
    let taskIndex = 0;
    
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    
    let completedCount = 0;
    
    cluster.on('message', (worker, msg) => {
        if (msg.cmd === 'GET_TASK') {
            if (taskIndex < tasks.length) {
                worker.send({ cmd: 'TASK', task: tasks[taskIndex++] });
            } else {
                worker.send({ cmd: 'DONE' });
            }
        } else if (msg.cmd === 'SUCCESS') {
            completedCount++;
            if (completedCount % 50 === 0) {
                console.log(`[PROGRESS] Berhasil didownload: ${completedCount} / ${tasks.length} file.`);
            }
        } else if (msg.cmd === 'ERROR') {
            console.log(`[ERROR] Gagal download: ${msg.name} -> ${msg.error}`);
            // Auto retry can be implemented by pushing back to tasks, but let's keep it simple
            tasks.push(msg.task);
        }
    });

    cluster.on('exit', (worker, code, signal) => {
        activeWorkers = Object.keys(cluster.workers).length;
        if (activeWorkers === 0) {
            console.log(`\n🎉 [SELESAI] SELURUH AUDIO (62.360 FILE) TELAH BERHASIL DIDOWNLOAD!`);
        }
    });

} else {
    // Worker Process
    const https = require('https');
    
    const download = (url, dest) => {
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(dest);
            const request = https.get(url, function(response) {
                if (response.statusCode === 200) {
                    response.pipe(file);
                    file.on('finish', function() {
                        file.close(resolve);
                    });
                } else {
                    file.close();
                    fs.unlink(dest, () => {}); // Delete the file async
                    reject(new Error(`Server responded with ${response.statusCode}`));
                }
            }).on('error', function(err) {
                file.close();
                fs.unlink(dest, () => {});
                reject(err);
            });
            
            request.setTimeout(15000, function() {
                request.abort();
                reject(new Error('Timeout'));
            });
        });
    };

    process.on('message', async (msg) => {
        if (msg.cmd === 'TASK') {
            try {
                await download(msg.task.url, msg.task.destPath);
                process.send({ cmd: 'SUCCESS' });
            } catch (err) {
                process.send({ cmd: 'ERROR', name: msg.task.name, error: err.message, task: msg.task });
            }
            process.send({ cmd: 'GET_TASK' });
        } else if (msg.cmd === 'DONE') {
            process.exit(0);
        }
    });

    // Request first task
    process.send({ cmd: 'GET_TASK' });
}
