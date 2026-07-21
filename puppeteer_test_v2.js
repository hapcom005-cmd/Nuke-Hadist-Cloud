const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new", defaultViewport: {width: 1366, height: 768} });
    const page = await browser.newPage();
    
    // Tangkap semua console log dan error
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err.toString()));
    
    console.log("Membuka index_premium.html secara lokal (file://)...");
    await page.goto('file:///' + __dirname.replace(/\\/g, '/') + '/index_premium.html');
    
    // Tunggu sedikit agar JS jalan
    await new Promise(r => setTimeout(r, 2000));
    
    await page.screenshot({ path: 'screenshot_v2_premium.png' });
    console.log("Tangkapan layar berhasil disimpan ke screenshot_v2_premium.png");
    
    await browser.close();
})();
