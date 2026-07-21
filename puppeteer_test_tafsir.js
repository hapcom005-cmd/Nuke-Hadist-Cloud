const puppeteer = require('puppeteer');

(async () => {
    console.log("Launching Puppeteer...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Capture page errors
    page.on('pageerror', err => {
        console.error('PAGE ERROR (STACK):', err.stack || err.toString());
    });
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.error('PAGE CONSOLE ERROR:', msg.text());
        } else {
            console.log('PAGE CONSOLE:', msg.text());
        }
    });

    console.log("Opening index_premium.html...");
    await page.goto('file:///C:/Users/Irwan%20Fahr/Desktop/Al-Quran-Premium-Dist/index_premium.html', { waitUntil: 'networkidle0' });

    console.log("Checking if reader is populated...");
    const html = await page.evaluate(() => {
        return document.querySelector('#reader') ? document.querySelector('#reader').innerHTML.substring(0, 500) : "No reader";
    });
    console.log("Reader start:", html);

    await browser.close();
})();
