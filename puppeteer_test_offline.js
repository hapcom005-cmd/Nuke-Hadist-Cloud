const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new", defaultViewport: {width: 1366, height: 768}, args: ['--allow-file-access-from-files'] });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    console.log("Membuka index_premium.html secara 100% OFFLINE (file://)...");
    await page.goto('file:///' + __dirname.replace(/\\/g, '/') + '/index_premium.html');
    
    // Tunggu render awal
    await new Promise(r => setTimeout(r, 2000));
    
    // Buka surah Al-Baqarah
    await page.evaluate(() => loadSurah(2));
    await new Promise(r => setTimeout(r, 2000));
    
    // Panggil langsung fungsi Tafsir & Hadist untuk Surah 2 Ayat 196
    await page.evaluate(() => showTafsir(2, 196));
    await new Promise(r => setTimeout(r, 2000));
    
    // Scroll Panel Kanan ke bawah
    await page.evaluate(() => {
        const panel = document.querySelector('.context-content');
        if (panel) panel.scrollTop = panel.scrollHeight;
    });
    await new Promise(r => setTimeout(r, 1000));
    
    await page.screenshot({ path: 'screenshot_v5_offline_hadith_scrolled.png' });
    console.log("Tangkapan layar OFFLINE (Hadith Scrolled) berhasil disimpan.");
    
    await browser.close();
})();
