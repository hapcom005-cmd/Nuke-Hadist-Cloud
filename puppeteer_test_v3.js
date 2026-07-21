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
    
    // 1. Screenshot mode Al-Quran
    await page.screenshot({ path: 'screenshot_v6_quran_ui.png' });
    console.log("Tangkapan layar Al-Quran UI disimpan.");
    
    // 2. Switch to Hadist Mode
    await page.evaluate(() => switchMode('hadist'));
    await new Promise(r => setTimeout(r, 1000));
    
    // Click Bukhari (first item in catalog)
    // we need to wait for catalog to render or evaluate directly
    await page.evaluate(() => loadHadistBook('bukhari', 'Bukhari', 7008));
    await new Promise(r => setTimeout(r, 3000));
    
    await page.screenshot({ path: 'screenshot_v7_hadist_global_ui.png' });
    console.log("Tangkapan layar Hadist Global disimpan.");

    await browser.close();
})();
