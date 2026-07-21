const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new', defaultViewport: {width: 1366, height: 768}, args: ['--allow-file-access-from-files'] });
    const page = await browser.newPage();
    const filePath = 'file:///' + path.join(process.cwd(), 'index_premium.html').replace(/\\/g, '/');
    
    await page.goto(filePath, {waitUntil: 'networkidle0'});
    
    // Load Al-Baqarah (has 286 ayats)
    await page.evaluate(() => {
        document.getElementById('navSurah2').click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({path: 'screenshot_v22_quran_page1.png'});
    
    // Scroll down to the bottom
    await page.evaluate(() => {
        const reader = document.querySelector('.main-reader');
        reader.scrollTop = reader.scrollHeight;
    });
    
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({path: 'screenshot_v23_quran_page1_bottom.png'});
    
    // Click Next Page
    await page.evaluate(() => {
        const btns = document.querySelectorAll('.btn-jump');
        // Find the 'Next' button
        for (let btn of btns) {
            if (btn.innerText.includes('Next')) {
                btn.click();
                break;
            }
        }
    });
    
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({path: 'screenshot_v24_quran_page2_top.png'});
    
    await browser.close();
    console.log('Screenshots captured!');
})();
