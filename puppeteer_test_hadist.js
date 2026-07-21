const puppeteer = require('puppeteer');

(async () => {
    console.log("Launching Puppeteer...");
    const browser = await puppeteer.launch({ headless: "new", defaultViewport: {width: 1280, height: 800} });
    const page = await browser.newPage();
    
    console.log("Opening index_premium.html...");
    await page.goto('file:///C:/Users/Irwan%20Fahr/Desktop/Al-Quran-Premium-Dist/index_premium.html', { waitUntil: 'networkidle0' });

    await new Promise(r => setTimeout(r, 1000));
    
    // Click Surah Al-Fatihah (1)
    await page.evaluate(() => {
        const surahs = Array.from(document.querySelectorAll('.surah-item'));
        const fatihah = surahs.find(el => el.innerText.includes("Al-Fatihah") || el.innerText.includes("1."));
        if (fatihah) fatihah.click();
    });

    await new Promise(r => setTimeout(r, 2000));

    // Click Tafsir & Hadist on the first ayat
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(b => b.innerText.includes('Tafsir & Hadist'));
        if (btn) btn.click();
    });

    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'screenshot_test1.png' });
    console.log("Screenshot after Tafsir click.");

    // Click Hadist Terkait tab
    await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('.tafsir-tab-btn'));
        const hadistBtn = tabs.find(b => b.innerText.includes('Hadist Terkait'));
        if (hadistBtn) hadistBtn.click();
    });

    console.log("Waiting 3 seconds for Hadist extraction...");
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: 'screenshot_test2.png' });
    console.log("Screenshot after Hadist tab click.");
    
    const html = await page.evaluate(() => {
        const pane = document.querySelector('[id^="pane_hadist_"]');
        return pane ? pane.innerHTML.substring(0, 500) : "Not found";
    });
    console.log("Hadist content: ", html);

    await browser.close();
})();
