const fs = require('fs');
let code = fs.readFileSync('build_ui_premium_v3.js', 'utf8');

const responsiveCSS = `
        /* MOBILE RESPONSIVE FIX */
        @media (max-width: 950px) {
            .main-container { flex-direction: column; overflow-y: auto; overflow-x: hidden; }
            .slim-sidebar { width: 100%; flex-direction: row; height: 70px; padding: 0 10px; justify-content: space-between; border-right: none; border-bottom: 1px solid var(--border-color); }
            .nav-icon { padding: 5px; margin: 0; width: auto; flex: 1; }
            .nav-icon.active::before { top: auto; bottom: -5px; left: 10%; width: 80%; height: 4px; border-radius: 4px 4px 0 0; }
            .list-column { width: 100%; border-right: none; border-bottom: 1px solid var(--border-color); flex: none; height: 350px; }
            .main-reader { width: 100%; flex: 1; min-height: 800px; }
            .header-controls { flex-wrap: wrap; justify-content: flex-start; }
            .jump-container { flex: 1; min-width: 150px; }
            .reciter-selector { flex: 1; min-width: 150px; }
        }
    \`;`;

// Replace the closing backtick of the css string with our new CSS
code = code.replace(/\n\s*\}\s*\`;/g, responsiveCSS);
fs.writeFileSync('build_ui_premium_v3.js', code);

const { execSync } = require('child_process');
execSync('node build_ui_premium_v3.js');
console.log('Mobile Responsive UI injected successfully!');
