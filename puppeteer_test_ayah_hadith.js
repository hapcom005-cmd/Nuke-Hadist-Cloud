const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new', defaultViewport: {width: 1366, height: 768}, args: ['--allow-file-access-from-files'] });
    const page = await browser.newPage();
    const filePath = 'file:///' + path.join(process.cwd(), 'index_premium.html').replace(/\\/g, '/');
    
    await page.goto(filePath, {waitUntil: 'networkidle0'});
    
    // Al-Fatihah
    await page.evaluate(() => {
        document.getElementById('navSurah1').click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
    // Click Ayah 3
    await page.evaluate(() => {
        document.getElementById('ayat-3').click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({path: 'screenshot_v29_ayah_hadith.png'});
    
    await browser.close();
    console.log('Test completed!');
})();
