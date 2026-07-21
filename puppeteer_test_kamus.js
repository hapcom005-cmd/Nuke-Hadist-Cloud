const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new', defaultViewport: {width: 1366, height: 768}, args: ['--allow-file-access-from-files'] });
    const page = await browser.newPage();
    const filePath = 'file:///' + path.join(process.cwd(), 'index_premium.html').replace(/\\/g, '/');
    
    await page.goto(filePath, {waitUntil: 'networkidle0'});
    
    // Test Quran Search
    await page.evaluate(() => {
        window.searchQuran('setan');
    });
    
    await new Promise(r => setTimeout(r, 4000));
    await page.screenshot({path: 'screenshot_v19_search_quran_kamus.png'});
    
    // Test Hadith Search
    await page.evaluate(() => {
        document.querySelectorAll('.nav-icon')[1].click(); // switch to hadist
    });
    
    await new Promise(r => setTimeout(r, 1000));
    
    await page.evaluate(() => {
        window.searchHadist('akhirat');
    });
    
    await new Promise(r => setTimeout(r, 4000));
    await page.screenshot({path: 'screenshot_v20_search_hadist_kamus.png'});
    
    await browser.close();
    console.log('Screenshots captured!');
})();
