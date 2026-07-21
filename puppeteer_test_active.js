const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new', defaultViewport: {width: 1366, height: 768}, args: ['--allow-file-access-from-files'] });
    const page = await browser.newPage();
    const filePath = 'file:///' + path.join(process.cwd(), 'index_premium.html').replace(/\\/g, '/');
    
    await page.goto(filePath, {waitUntil: 'networkidle0'});
    
    // Test Hadith Mode
    await page.evaluate(() => {
        document.querySelectorAll('.nav-icon')[1].click(); // switch to hadist
    });
    await new Promise(r => setTimeout(r, 1000));
    
    // Click Imam Bukhari
    await page.evaluate(() => {
        const item = document.getElementById('navHadistbukhari');
        if(item) item.click();
    });
    
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({path: 'screenshot_v21_hadist_active.png'});
    
    await browser.close();
    console.log('Screenshot captured!');
})();
