const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    
    await page.goto('https://assyifa-quran.pages.dev', { waitUntil: 'networkidle0' });
    
    console.log('Page loaded. Typing search query...');
    await page.type('#searchInput', 'jin');
    
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for search results
    
    console.log('Searching for play buttons...');
    const playButtons = await page.$$('.btn-play-ayat');
    console.log(`Found ${playButtons.length} play buttons`);
    
    if (playButtons.length > 0) {
        console.log('Clicking the first play button...');
        await playButtons[0].click();
        
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait to see if it plays or errors
    } else {
        console.log('No play buttons found!');
    }
    
    await browser.close();
})();
