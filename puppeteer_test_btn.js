const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    await page.goto('file:///C:/Users/Irwan%20Fahr/Desktop/Al-Quran-Premium-Dist/index_premium.html', { waitUntil: 'networkidle0' });

    await new Promise(r => setTimeout(r, 1000));
    
    await page.evaluate(() => {
        const surahs = Array.from(document.querySelectorAll('.surah-item'));
        const anfal = surahs.find(el => el.innerText.includes("Al-Anfal") || el.innerText.includes("8."));
        if (anfal) anfal.click();
    });

    await new Promise(r => setTimeout(r, 2000));

    const html = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(b => b.innerText.includes('Tafsir & Hadist'));
        return btn ? btn.outerHTML : "Not found";
    });
    console.log("Button HTML:", html);

    await browser.close();
})();
