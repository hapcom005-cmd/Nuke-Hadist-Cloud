const fs = require('fs');
const html = fs.readFileSync('index_premium.html', 'utf8');
const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
if (scripts) {
    scripts.forEach((s, i) => {
        const code = s.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
        fs.writeFileSync('temp_script_' + i + '.js', code);
        console.log('Script ' + i + ' saved. Length: ' + code.length);
    });
}
