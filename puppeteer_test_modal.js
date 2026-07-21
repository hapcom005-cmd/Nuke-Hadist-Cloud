const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new', defaultViewport: {width: 1366, height: 768}, args: ['--allow-file-access-from-files'] });
    const page = await browser.newPage();
    const filePath = 'file:///' + path.join(process.cwd(), 'index_premium.html').replace(/\\/g, '/');
    
    await page.goto(filePath, {waitUntil: 'networkidle0'});
    
    // Al-Fatihah (Surah 1)
    await page.evaluate(() => {
        document.getElementById('navSurah1').click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
    // Open modal
    await page.evaluate(() => {
        const btns = document.querySelectorAll('button');
        for (let b of btns) {
            if (b.innerText.includes('Hadist Terkait')) {
                b.click();
                break;
            }
        }
    });
    
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({path: 'screenshot_v28_modal_pro_summary.png'});
    
    await browser.close();
    console.log('Test completed!');
})();
