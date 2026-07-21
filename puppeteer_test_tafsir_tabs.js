const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new', defaultViewport: {width: 1366, height: 768}, args: ['--allow-file-access-from-files'] });
    const page = await browser.newPage();
    const filePath = 'file:///' + path.join(process.cwd(), 'index_premium.html').replace(/\\/g, '/');
    
    await page.goto(filePath, {waitUntil: 'networkidle0'});
    
    // Surah 2 Al-Baqarah (has asbab_nuzul & full tafsir)
    await page.evaluate(() => { document.getElementById('navSurah2').click(); });
    await new Promise(r => setTimeout(r, 2000));
    
    // Click Ayat 1
    await page.evaluate(() => { document.getElementById('ayat-1').click(); });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({path: 'screenshot_v32_tafsir_kemenag.png'});
    
    // Click Ibnu Katsir tab
    await page.evaluate(() => {
        const tabs = document.querySelectorAll('.tafsir-tab');
        tabs[1].click(); // Ibnu Katsir
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({path: 'screenshot_v33_tafsir_ibnukatsir.png'});
    
    // Click Quraish tab
    await page.evaluate(() => {
        const tabs = document.querySelectorAll('.tafsir-tab');
        tabs[3].click(); // Quraish
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({path: 'screenshot_v34_tafsir_quraish.png'});
    
    await browser.close();
    console.log('Test completed!');
})();
