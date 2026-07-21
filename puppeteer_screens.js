const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    console.log("Launching Puppeteer...");
    const browser = await puppeteer.launch({ headless: "new", defaultViewport: {width: 1280, height: 800} });
    const page = await browser.newPage();
    
    console.log("Opening index_premium.html...");
    await page.goto('file:///C:/Users/Irwan%20Fahr/Desktop/Al-Quran-Premium-Dist/index_premium.html', { waitUntil: 'networkidle0' });

    console.log("Waiting 2 seconds for initial load...");
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'screenshot_load.png' });
    console.log("Screenshot load taken.");

    // Try to click Al-An'am (6)
    console.log("Clicking Surah Al-An'am...");
    await page.evaluate(() => {
        const surahs = Array.from(document.querySelectorAll('.surah-item'));
        const anam = surahs.find(el => el.innerText.includes("Al-An'am") || el.innerText.includes("6."));
        if (anam) anam.click();
    });

    console.log("Waiting 2 seconds for Surah to load...");
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'screenshot_surah.png' });
    console.log("Screenshot surah taken.");

    // Click Tafsir & Hadist on the first available ayat
    console.log("Clicking Tafsir & Hadist...");
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(b => b.innerText.includes('Tafsir & Hadist'));
        if (btn) btn.click();
    });

    console.log("Waiting 2 seconds for Tafsir to load...");
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'screenshot_tafsir.png' });
    console.log("Screenshot tafsir taken.");

    await browser.close();
})();
