const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: "new", defaultViewport: {width: 1366, height: 768}, args: ['--allow-file-access-from-files'] });
    const page = await browser.newPage();
    
    console.log("Membuka index_premium.html secara 100% OFFLINE...");
    await page.goto('file:///' + __dirname.replace(/\\/g, '/') + '/index_premium.html');
    await new Promise(r => setTimeout(r, 2000));
    
    // Screenshot awal untuk melihat sidebar mewah
    await page.screenshot({ path: 'screenshot_v10_luxurious_sidebar.png' });
    console.log("Tangkapan layar Sidebar Mewah disimpan.");

    await browser.close();
})();
