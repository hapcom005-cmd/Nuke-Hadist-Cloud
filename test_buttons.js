const puppeteer = require('puppeteer');
const fs = require('fs');

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    console.log("Starting Puppeteer browser...");
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Catch console logs to report any JS errors
    page.on('console', msg => {
        if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text());
        else console.log('PAGE LOG:', msg.text());
    });
    
    page.on('pageerror', err => {
        console.log('PAGE EXCEPTION:', err.message);
    });

    console.log("Navigating to http://localhost:8080...");
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });
    
    console.log("Waiting for surah cards to load...");
    await page.waitForSelector('.card.glass', { timeout: 10000 });
    
    // Click Al-Baqarah
    console.log("Clicking Al-Baqarah...");
    const surahs = await page.$$('.card.glass');
    await surahs[1].click();
    
    console.log("Waiting for ayats to load...");
    await page.waitForSelector('.ayat-card', { timeout: 10000 });
    await delay(2000);
    
    // Test Play Button
    console.log("Testing Play Button (Tafsir Hadist/Tafsir Lengkap/Putar)...");
    const ayatCards = await page.$$('.ayat-card');
    console.log(`Found ${ayatCards.length} ayats on the page.`);
    
    if (ayatCards.length > 0) {
        const firstAyat = ayatCards[0];
        
        // 1. Click Play Button
        console.log("Clicking Play button...");
        const playBtn = await firstAyat.$('button[onclick*="playAudio"]');
        if (playBtn) {
            await playBtn.click();
            console.log("Play button clicked.");
            await delay(2000); // Wait for audio to start/catch
        } else {
            console.log("Play button not found.");
        }
        
        // 2. Click Tafsir Hadist Button
        console.log("Clicking Tafsir Hadist button on Ayat 1...");
        const hadistBtn = await firstAyat.$('button[onclick*="findHadistForAyat"]');
        if (hadistBtn) {
            await hadistBtn.click();
            await delay(3000); // Wait for fetch
            
            // Capture screenshot
            await page.screenshot({ path: 'test_hadist.png', fullPage: false });
            console.log("Captured test_hadist.png");
            
            // Check if tafsir container appeared
            const container = await firstAyat.$('.tafsir-container');
            if (container) {
                const text = await page.evaluate(el => el.innerText, container);
                console.log("Tafsir Container Content preview:", text.substring(0, 150).replace(/\n/g, ' '));
            } else {
                console.log("ERROR: Tafsir container did not appear!");
            }
        } else {
            console.log("Tafsir Hadist button not found.");
        }
        
        // 3. Test Tafsir Lengkap button
        console.log("Clicking Tafsir Lengkap button on Ayat 1...");
        const tafsirBtn = await firstAyat.$('button[onclick*="showTafsir"]');
        if (tafsirBtn) {
            await tafsirBtn.click();
            await delay(2000);
            
            // Check Modal
            const modal = await page.$('#tafsirModal');
            const display = await page.evaluate(el => el ? el.style.display : 'none', modal);
            if (display === 'block' || display === 'flex') {
                console.log("Modal opened successfully.");
            } else {
                console.log("ERROR: Modal did not open properly. Display:", display);
            }
            
            // Close modal
            const closeBtn = await page.$('#closeModalBtn');
            if (closeBtn) await closeBtn.click();
        } else {
            console.log("Tafsir Lengkap button not found.");
        }
    }
    
    await browser.close();
    console.log("Done checking UI.");
})();
