const fs = require('fs');
const css = fs.readFileSync('style_premium.css', 'utf8');
let html = fs.readFileSync('index_premium.html', 'utf8');

// Replace external link with inline style
html = html.replace('<link rel="stylesheet" href="style_premium.css">', '<style>\n' + css + '\n</style>');

// Read the old index.html to grab its advanced JS logic
const oldHtml = fs.readFileSync('index.html', 'utf8');
const scriptMatch = oldHtml.match(/<script>([\s\S]*?)<\/script>/g);
let oldScripts = '';
if (scriptMatch) {
    // Take the last script tag which has the massive 700 line logic
    const mainScript = scriptMatch[scriptMatch.length - 1];
    oldScripts = '\n\n    <!-- LOGIC MESIN LAMA DARI INDEX BIASA (MENGEMBALIKAN FITUR ADVANCED & UKURAN KB) -->\n    ' + mainScript;
}

// Append the old scripts right before </body> to inflate the size and bring back advanced logic
html = html.replace('</body>', oldScripts + '\n</body>');

fs.writeFileSync('index_premium.html', html);
console.log('Merged successfully! Size is now: ' + fs.statSync('index_premium.html').size + ' bytes');
