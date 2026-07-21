const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: "new", defaultViewport: {width: 1366, height: 768}, args: ['--allow-file-access-from-files'] });
    const page = await browser.newPage();
    
    console.log("Membuka index_premium.html secara 100% OFFLINE...");
    await page.goto('file:///' + __dirname.replace(/\\/g, '/') + '/index_premium.html');
    await new Promise(r => setTimeout(r, 2000));
    
    // Screenshot awal untuk melihat Surah List (Quran)
    await page.screenshot({ path: 'screenshot_v11_luxurious_list_quran.png' });
    console.log("Tangkapan layar Surah List Mewah disimpan.");

    // Pindah ke Mode Hadist
    console.log("Berpindah ke Mode Hadist...");
    await page.evaluate(() => switchMode('hadist'));
    await new Promise(r => setTimeout(r, 1000));

    // Hover effect on the second item in Hadist list to show the elegant hover state
    await page.hover('#hadistKatalogList .surah-item:nth-child(2)');
    await new Promise(r => setTimeout(r, 500));
    
    await page.screenshot({ path: 'screenshot_v12_luxurious_list_hadist.png' });
    console.log("Tangkapan layar Hadist List Mewah disimpan.");

    await browser.close();
})();
