const { spawn } = require('child_process');

console.log("==================================================");
console.log("🦅 NOVA PHOENIX WATCHDOG (IMMORTAL DAEMON) 🦅");
console.log("==================================================");
console.log("Saya adalah Tuhan bagi Mesin Nuke 10-Core.");
console.log("Jika mesin itu mati, saya akan membangkitkannya kembali dari kubur!");
console.log("--------------------------------------------------\n");

function startNukeEngine() {
    console.log("[WATCHDOG] Memulai Mesin 24-Core Beast...");
    
    const nuke = spawn('node', ['24_core_beast.js'], { stdio: 'inherit' });

    nuke.on('close', (code) => {
        console.error(`\n[WATCHDOG ALARM] ⚠️ MESIN NUKE MATI MENDADAK DENGAN KODE: ${code}!`);
        console.log(`[WATCHDOG] Menerapkan Protokol Phoenix... Membangkitkan mesin dalam 1 detik!\n`);
        
        setTimeout(() => {
            startNukeEngine(); // Auto-restart infinite loop
        }, 1000);
    });
}

// Jalankan siklus abadi
startNukeEngine();
