const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: "new", defaultViewport: {width: 1366, height: 768}, args: ['--allow-file-access-from-files'] });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    console.log("Membuka index_premium.html secara 100% OFFLINE...");
    await page.goto('file:///' + __dirname.replace(/\\/g, '/') + '/index_premium.html');
    
    // Tunggu inisialisasi awal (termasuk meta.js)
    await new Promise(r => setTimeout(r, 2000));
    
    // Pindah ke Mode Hadist
    console.log("Berpindah ke Mode Hadist...");
    await page.evaluate(() => switchMode('hadist'));
    await new Promise(r => setTimeout(r, 1000));
    
    // Ketik pencarian 3 kata (misal: "salat nabi malam")
    const keywords = "nabi salat malam";
    console.log(`Mencari kombinasi kata: "${keywords}"`);
    await page.type('#searchInput', keywords);
    await page.click('#btnSearch');
    
    // Tunggu 5-10 detik agar memanaskan 9 mesin kitab dan deep scan
    console.log("Menunggu proses Deep Scan 9 Kitab...");
    await new Promise(r => setTimeout(r, 10000));
    
    await page.screenshot({ path: 'screenshot_v9_search_hadist_global.png' });
    console.log("Tangkapan layar Global Hadist Search disimpan.");

    await browser.close();
})();
