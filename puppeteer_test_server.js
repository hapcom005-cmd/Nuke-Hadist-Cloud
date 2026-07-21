const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath == './') filePath = './index_premium.html';
    
    // Support file extensions
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js': contentType = 'text/javascript'; break;
        case '.css': contentType = 'text/css'; break;
        case '.json': contentType = 'application/json'; break;
        case '.png': contentType = 'image/png'; break;      
        case '.jpg': contentType = 'image/jpg'; break;
        case '.wav': contentType = 'audio/wav'; break;
        case '.mp3': contentType = 'audio/mpeg'; break;
    }
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                res.writeHead(404);
                res.end('File not found', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server error: '+error.code+' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(8125, async () => {
    console.log("Server running on port 8125");
    
    const browser = await puppeteer.launch({ headless: "new", defaultViewport: {width: 1366, height: 768} });
    const page = await browser.newPage();
    
    await page.goto('http://127.0.0.1:8125/index_premium.html');
    
    // Wait for meta to load
    await new Promise(r => setTimeout(r, 2000));
    
    // Click Surah Al-Baqarah (nomor 2)
    const items = await page.$$('.surah-item');
    if(items.length > 1) {
        await items[1].click();
        await new Promise(r => setTimeout(r, 2000));
        
        // Click Tafsir on first ayat
        const btns = await page.$$('.action-btn');
        if(btns.length > 0) {
            await btns[0].click();
            await new Promise(r => setTimeout(r, 1000));
        }
    }
    
    await page.screenshot({ path: 'screenshot_v2_premium.png' });
    console.log("Tangkapan layar berhasil disimpan ke screenshot_v2_premium.png");
    
    await browser.close();
    server.close();
});
