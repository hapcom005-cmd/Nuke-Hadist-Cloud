const puppeteer = require('puppeteer');

(async () => {
    console.log("Launching Puppeteer...");
    const browser = await puppeteer.launch({ headless: "new", defaultViewport: {width: 1280, height: 800} });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    
    console.log("Opening index_premium.html...");
    await page.goto('file:///C:/Users/Irwan%20Fahr/Desktop/Al-Quran-Premium-Dist/index_premium.html', { waitUntil: 'networkidle0' });

    await new Promise(r => setTimeout(r, 1000));
    
    await page.evaluate(() => {
        const surahs = Array.from(document.querySelectorAll('.surah-item'));
        const anfal = surahs.find(el => el.innerText.includes("Al-Anfal") || el.innerText.includes("8."));
        if (anfal) anfal.click();
    });

    await new Promise(r => setTimeout(r, 2000));

    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(b => b.innerText.includes('Tafsir & Hadist'));
        if (btn) {
            console.log("Clicking Tafsir button!");
            btn.click();
        } else {
            console.log("Button not found!");
        }
    });

    await new Promise(r => setTimeout(r, 2000));
    
    const panel = await page.$('#col-info');
    if (panel) {
        await panel.screenshot({ path: 'screenshot_panel.png' });
    }

    const html = await page.evaluate(() => {
        const t = document.getElementById('tafsir-body');
        return t ? t.innerHTML.substring(0, 1000) : "No tafsir body";
    });
    console.log("Panel Content:", html);

    await browser.close();
})();
