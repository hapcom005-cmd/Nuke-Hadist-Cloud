const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    
    await page.setContent(`
        <html>
            <body>
                <button onclick="console.log(this, 8, 1, \`Al-Anfal\`)">Click Me Backtick</button>
                <button onclick="console.log(this, 8, 1, 'Al-An\\'am')">Click Me Escaped Single</button>
                <button onclick="console.log(this, 8, 1, 'Al-An&#39;am')">Click Me HTML Entity</button>
                <script>
                    setTimeout(() => {
                        document.querySelectorAll('button')[0].click();
                        document.querySelectorAll('button')[1].click();
                        document.querySelectorAll('button')[2].click();
                    }, 500);
                </script>
            </body>
        </html>
    `);

    await new Promise(r => setTimeout(r, 1000));
    await browser.close();
})();
