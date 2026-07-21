const fs = require('fs');
const path = require('path');
const http = require('http');

// Konfigurasi
const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'dolphin-mistral-nemo:12b'; // Model Nova Offline
const PASSES_REQUIRED = 5; // Jumlah putaran validasi (Multi-Pass)

const candidatesFile = path.join(__dirname, 'QuranHadist', 'data', 'kandidat_hadist.json');
const validatedFile = path.join(__dirname, 'QuranHadist', 'data', 'hadist_tervalidasi_ai.json');

// Fungsi untuk bertanya ke Ollama (Nova Offline)
function askNovaOffline(promptText) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            model: MODEL_NAME,
            prompt: promptText,
            stream: false,
            options: {
                temperature: 0.1, // Suhu rendah agar AI konsisten dan logis
                top_p: 0.9
            }
        });

        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };

        const req = http.request(OLLAMA_URL, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve(response.response.trim());
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(payload);
        req.end();
    });
}

async function runMultiPassValidation() {
    console.log('🤖 MENGAKTIFKAN PROTOKOL MULTI-PASS AI VERIFICATION 5X PUTARAN 🤖');
    console.log(`Menggunakan Model: ${MODEL_NAME}`);
    
    // (Simulasi/Mock) Jika file kandidat belum ada, kita buatkan contoh struktur.
    if (!fs.existsSync(candidatesFile)) {
        console.log('File kandidat tidak ditemukan. Membuat contoh kandidat untuk pengujian...');
        fs.writeFileSync(candidatesFile, JSON.stringify([
            {
                surah_ayat: "2_183", // Ayat tentang Puasa
                ayat_teks: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ",
                hadist_teks: "بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: ... وَصَوْمِ رَمَضَانَ",
                kitab: "bukhari",
                id: 8
            }
        ], null, 2));
    }

    const candidates = JSON.parse(fs.readFileSync(candidatesFile, 'utf8'));
    const validatedData = [];

    console.log(`🔍 Memulai validasi untuk ${candidates.length} kandidat hadist...`);

    for (const candidate of candidates) {
        console.log(`\n===========================================`);
        console.log(`Menguji Ayat ${candidate.surah_ayat} vs Hadist ${candidate.kitab}:${candidate.id}`);
        
        let passCount = 0;
        let isRejected = false;

        for (let i = 1; i <= PASSES_REQUIRED; i++) {
            console.log(`  🔄 Putaran ke-${i}...`);
            const prompt = `Kamu adalah ahli tafsir dan hadist yang teliti.
Tugasmu hanya mengecek apakah konteks perintah/makna dari Hadist ini berkaitan dengan Ayat Al-Quran ini.
Ayat Al-Quran: "${candidate.ayat_teks}"
Hadist: "${candidate.hadist_teks}"
Jawab HANYA dengan kata "YA" jika berkaitan/mirip maknanya, atau "TIDAK" jika tidak nyambung. Jangan beri penjelasan apapun.`;

            try {
                const answer = await askNovaOffline(prompt);
                
                if (answer.toUpperCase().includes("YA")) {
                    console.log(`    ✅ AI menjawab: YA`);
                    passCount++;
                } else {
                    console.log(`    ❌ AI menjawab: ${answer} -> [DITOLAK]`);
                    isRejected = true;
                    break; // Berhenti menguji jika 1 kali saja ditolak
                }
            } catch (error) {
                console.error(`    ⚠️ Gagal terhubung ke Nova Offline. Pastikan Ollama berjalan.`, error.message);
                isRejected = true;
                break;
            }
        }

        if (!isRejected && passCount === PASSES_REQUIRED) {
            console.log(`🎉 KANDIDAT LOLOS UJIAN NERAKA 5X! Data disahkan.`);
            candidate.label_khusus = "👑 Hadist Tambahan (Dipetakan oleh Irwan Fahruji, S.Kom - Telah Divalidasi 5x oleh AI Nova Offline)";
            validatedData.push(candidate);
        } else {
            console.log(`🚮 Kandidat dibuang karena keraguan AI.`);
        }
    }

    fs.writeFileSync(validatedFile, JSON.stringify(validatedData, null, 2));
    console.log(`\n===========================================`);
    console.log(`✅ PROSES SELESAI! ${validatedData.length} dari ${candidates.length} kandidat berhasil divalidasi mutlak.`);
    console.log(`📁 File hasil tersimpan di: ${validatedFile}`);
}

runMultiPassValidation();
