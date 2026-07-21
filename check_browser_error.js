const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        
        page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
        page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
        page.on('requestfailed', request => console.log('BROWSER REQUEST FAILED:', request.url(), request.failure().errorText));
        
        await page.goto('file:///c:/Users/Irwan Fahr/Desktop/Al-Quran-Premium-Dist/index_premium.html');
        
        console.log('Page loaded. Waiting 2 seconds...');
        await new Promise(r => setTimeout(r, 2000));
        
        await browser.close();
    } catch (e) {
        console.error('Puppeteer Error:', e);
    }
})();
