const fs = require('fs');
const path = require('path');

const sourceDir = __dirname;
const targetDir = 'C:/Users/Irwan Fahr/Desktop/Data_Tidak_Terpakai';

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir);

files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    
    // Pindahkan semua file HTML KECUALI HAPCOM_Premium.html
    if (ext === '.html' && file !== 'HAPCOM_Premium.html') {
        const oldPath = path.join(sourceDir, file);
        const newPath = path.join(targetDir, file);
        try {
            fs.renameSync(oldPath, newPath);
            console.log('Moved: ' + file);
        } catch (e) {
            console.error('Failed to move ' + file, e);
        }
    }
});

console.log('Pembersihan file HTML backup selesai!');
