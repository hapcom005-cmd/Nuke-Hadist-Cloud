const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: "new", defaultViewport: {width: 1366, height: 768}, args: ['--allow-file-access-from-files'] });
    const page = await browser.newPage();
    const filePath = 'file:///' + path.join(__dirname, 'index_premium.html').replace(/\\/g, '/');
    
    await page.goto(filePath, {waitUntil: 'networkidle0'});
    
    // Test 1: Quran Mode Header
    await page.screenshot({path: 'screenshot_v13_quran_header.png'});
    
    // Type into input
    await page.type('#inputJump', '5');
    await page.click('.btn-jump');
    await page.waitForTimeout(500);
    await page.screenshot({path: 'screenshot_v14_quran_jump.png'});

    // Click play button
    await page.click('#btnPlayMain');
    await page.waitForTimeout(200);
    await page.screenshot({path: 'screenshot_v15_quran_play.png'});
    
    // Switch to Hadist mode
    await page.evaluate(() => {
        document.querySelectorAll('.nav-icon')[1].click(); // Click Hadist
    });
    await page.waitForTimeout(500);
    await page.screenshot({path: 'screenshot_v16_hadist_header.png'});

    await browser.close();
    console.log("Screenshots captured!");
})();
