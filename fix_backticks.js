const fs = require('fs');
let code = fs.readFileSync('build_ui_premium_v3.js', 'utf8');

// I need to find `html += ` and replace it with `html += \``
code = code.replace(/html \+= `\n                <div id="ayat/g, "html += \\`\\n                <div id=\"ayat");
code = code.replace(/<\/div>`;\n            }/g, "</div>\\`;\n            }");
code = code.replace(/html \+= `<div style="display:flex/g, "html += \\`<div style=\"display:flex");
code = code.replace(/<\/div>`;\n            }\n            \n            for/g, "</div>\\`;\n            }\n            \n            for");

fs.writeFileSync('build_ui_premium_v3.js', code);
console.log('Fixed backticks!');
