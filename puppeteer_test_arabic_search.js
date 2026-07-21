const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new', defaultViewport: {width: 1366, height: 768}, args: ['--allow-file-access-from-files'] });
    const page = await browser.newPage();
    const filePath = 'file:///' + path.join(process.cwd(), 'index_premium.html').replace(/\\/g, '/');
    
    await page.goto(filePath, {waitUntil: 'networkidle0'});
    
    // Stay on Al-Quran mode (default)
    await new Promise(r => setTimeout(r, 1000));
    
    // Type Arabic text in search
    await page.type('#searchInput', 'الدار');
    
    // Trigger search
    await page.evaluate(() => {
        doSearch();
    });
    
    // Wait for Inverted Index to load + process
    await new Promise(r => setTimeout(r, 8000));
    
    await page.screenshot({path: 'screenshot_v31_search_quran_arabic.png'});
    
    await browser.close();
    console.log('Test completed!');
})();
