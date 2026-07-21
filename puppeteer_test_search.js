const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: "new", defaultViewport: {width: 1366, height: 768}, args: ['--allow-file-access-from-files'] });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    console.log("Membuka index_premium.html secara 100% OFFLINE (file://)...");
    await page.goto('file:///' + __dirname.replace(/\\/g, '/') + '/index_premium.html');
    
    // Tunggu render awal
    await new Promise(r => setTimeout(r, 2000));
    
    // Ketik pencarian
    await page.type('#searchInput', 'jin');
    await page.click('#btnSearch');
    
    // Tunggu 5 detik agar memanaskan mesin pencari (load 6 index parts) + ekstrak surah
    console.log("Memanaskan mesin pencari...");
    await new Promise(r => setTimeout(r, 5000));
    
    await page.screenshot({ path: 'screenshot_v8_search_results.png' });
    console.log("Tangkapan layar Search Results disimpan.");

    await browser.close();
})();
