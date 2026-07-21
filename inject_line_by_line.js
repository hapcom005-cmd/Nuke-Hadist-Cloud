const fs = require('fs');
let content = fs.readFileSync('build_ui_premium_v3_backup_level4.js', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // 1. Google Translate CSS
    if (line.includes('overflow: hidden;')) {
        if (lines[i+1] && !lines[i+1].includes('top: 0 !important')) {
            lines[i] = `            overflow: hidden;\n            top: 0 !important;\n            position: static !important;\n        }\n\n        .skiptranslate iframe { display: none !important; }\n        .goog-te-banner-frame { display: none !important; }\n        .goog-tooltip { display: none !important; }\n        .goog-tooltip:hover { display: none !important; }\n        font { background: transparent !important; box-shadow: none !important; }`;
            lines[i+1] = '';
        }
    }

    // 2. Head Script
    if (line.includes('rel="stylesheet">') && line.includes('Amiri')) {
        lines[i] = line + `\n    <script type="text/javascript">\n        function googleTranslateElementInit() {\n            new google.translate.TranslateElement({pageLanguage: 'id', autoDisplay: false}, 'google_translate_element');\n        }\n    </script>\n    <script type="text/javascript" src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>`;
    }

    // 3. Body GT Div
    if (line.trim() === '<body>') {
        lines[i] = `<body>\n    <div id="google_translate_element" style="display:none;"></div>`;
    }

    // 4. Selectors
    if (line.includes('<label>Language Selector</label>')) {
        if (lines[i+1].includes('<select>')) {
            lines[i+1] = `                <select class="proLangSelector" onchange="doGTranslate(this.value)"></select>`;
        }
    }

    // 5. Arabic Notranslate
    if (line.includes(`font-family:'Amiri'`)) {
        lines[i] = line.replace(/<div style="font-family:'Amiri'/g, `<div class="notranslate" style="font-family:'Amiri'`);
    }
    if (line.includes(`font-family:\\'Amiri\\'`)) {
        lines[i] = line.replace(/<div style="font-family:\\\\'Amiri\\\\'/g, `<div class="notranslate" style="font-family:\\\\'Amiri\\\\'`);
    }

    // 6. initApp injection
    if (line.includes('async function initApp() {')) {
        lines[i] = `        async function initApp() {\n            if(typeof buildLanguageSelectors === 'function') buildLanguageSelectors();`;
    }

    // 7. JS Arrays and Functions injection
    if (line.includes('window.onload = initApp;')) {
        const jsFuncs = `
        const proLanguages = [
            {code: 'id', name: '🇮🇩 Indonesia', flag: '🇮🇩'},
            {code: 'en', name: '🇬🇧 English', flag: '🇬🇧'},
            {code: 'ar', name: '🇸🇦 Arabic', flag: '🇸🇦'},
            {code: 'ur', name: '🇵🇰 Urdu', flag: '🇵🇰'},
            {code: 'ms', name: '🇲🇾 Malay', flag: '🇲🇾'},
            {code: 'tr', name: '🇹🇷 Turkish', flag: '🇹🇷'},
            {code: 'fa', name: '🇮🇷 Persian', flag: '🇮🇷'},
            {code: 'fr', name: '🇫🇷 French', flag: '🇫🇷'},
            {code: 'de', name: '🇩🇪 German', flag: '🇩🇪'},
            {code: 'ru', name: '🇷🇺 Russian', flag: '🇷🇺'},
            {code: 'zh-CN', name: '🇨🇳 Chinese', flag: '🇨🇳'},
            {code: 'ja', name: '🇯🇵 Japanese', flag: '🇯🇵'},
            {code: 'ko', name: '🇰🇷 Korean', flag: '🇰🇷'},
            {code: 'hi', name: '🇮🇳 Hindi', flag: '🇮🇳'},
            {code: 'bn', name: '🇧🇩 Bengali', flag: '🇧🇩'},
            {code: 'th', name: '🇹🇭 Thai', flag: '🇹🇭'},
            {code: 'es', name: '🇪🇸 Spanish', flag: '🇪🇸'},
            {code: 'pt', name: '🇵🇹 Portuguese', flag: '🇵🇹'},
            {code: 'it', name: '🇮🇹 Italian', flag: '🇮🇹'},
            {code: 'nl', name: '🇳🇱 Dutch', flag: '🇳🇱'},
            {code: 'vi', name: '🇻🇳 Vietnamese', flag: '🇻🇳'},
            {code: 'tl', name: '🇵🇭 Tagalog', flag: '🇵🇭'},
            {code: 'sw', name: '🇰🇪 Swahili', flag: '🇰🇪'},
            {code: 'ha', name: '🇳🇬 Hausa', flag: '🇳🇬'},
            {code: 'sq', name: '🇦🇱 Albanian', flag: '🇦🇱'},
            {code: 'bs', name: '🇧🇦 Bosnian', flag: '🇧🇦'},
            {code: 'uz', name: '🇺🇿 Uzbek', flag: '🇺🇿'},
            {code: 'tg', name: '🇹🇯 Tajik', flag: '🇹🇯'},
            {code: 'kk', name: '🇰🇿 Kazakh', flag: '🇰🇿'},
            {code: 'ky', name: '🇰🇬 Kyrgyz', flag: '🇰🇬'},
            {code: 'tk', name: '🇹🇲 Turkmen', flag: '🇹🇲'},
            {code: 'az', name: '🇦🇿 Azerbaijani', flag: '🇦🇿'},
            {code: 'ku', name: '🇮🇶 Kurdish', flag: '🇮🇶'},
            {code: 'ps', name: '🇦🇫 Pashto', flag: '🇦🇫'},
            {code: 'sd', name: '🇵🇰 Sindhi', flag: '🇵🇰'},
            {code: 'ug', name: '🇨🇳 Uyghur', flag: '🇨🇳'},
            {code: 'tt', name: '🇷🇺 Tatar', flag: '🇷🇺'},
            {code: 'cv', name: '🇷🇺 Chuvash', flag: '🇷🇺'},
            {code: 'ba', name: '🇷🇺 Bashkir', flag: '🇷🇺'},
            {code: 'ce', name: '🇷🇺 Chechen', flag: '🇷🇺'},
            {code: 'av', name: '🇷🇺 Avar', flag: '🇷🇺'},
            {code: 'yi', name: '🇮🇱 Yiddish', flag: '🇮🇱'},
            {code: 'he', name: '🇮🇱 Hebrew', flag: '🇮🇱'},
            {code: 'am', name: '🇪🇹 Amharic', flag: '🇪🇹'},
            {code: 'so', name: '🇸🇴 Somali', flag: '🇸🇴'},
            {code: 'yo', name: '🇳🇬 Yoruba', flag: '🇳🇬'},
            {code: 'ig', name: '🇳🇬 Igbo', flag: '🇳🇬'},
            {code: 'zu', name: '🇿🇦 Zulu', flag: '🇿🇦'},
            {code: 'xh', name: '🇿🇦 Xhosa', flag: '🇿🇦'},
            {code: 'af', name: '🇿🇦 Afrikaans', flag: '🇿🇦'},
            {code: 'mg', name: '🇲🇬 Malagasy', flag: '🇲🇬'},
            {code: 'ny', name: '🇲🇼 Chichewa', flag: '🇲🇼'},
            {code: 'st', name: '🇱🇸 Sesotho', flag: '🇱🇸'},
            {code: 'sn', name: '🇿🇼 Shona', flag: '🇿🇼'},
            {code: 'su', name: '🇮🇩 Sundanese', flag: '🇮🇩'},
            {code: 'jv', name: '🇮🇩 Javanese', flag: '🇮🇩'},
            {code: 'km', name: '🇰🇭 Khmer', flag: '🇰🇭'},
            {code: 'lo', name: '🇱🇦 Lao', flag: '🇱🇦'},
            {code: 'my', name: '🇲🇲 Burmese', flag: '🇲🇲'},
            {code: 'si', name: '🇱🇰 Sinhala', flag: '🇱🇰'},
            {code: 'ta', name: '🇮🇳 Tamil', flag: '🇮🇳'},
            {code: 'te', name: '🇮🇳 Telugu', flag: '🇮🇳'},
            {code: 'ml', name: '🇮🇳 Malayalam', flag: '🇮🇳'},
            {code: 'kn', name: '🇮🇳 Kannada', flag: '🇮🇳'},
            {code: 'mr', name: '🇮🇳 Marathi', flag: '🇮🇳'},
            {code: 'gu', name: '🇮🇳 Gujarati', flag: '🇮🇳'},
            {code: 'pa', name: '🇮🇳 Punjabi', flag: '🇮🇳'},
            {code: 'or', name: '🇮🇳 Odia', flag: '🇮🇳'},
            {code: 'as', name: '🇮🇳 Assamese', flag: '🇮🇳'},
            {code: 'mai', name: '🇮🇳 Maithili', flag: '🇮🇳'},
            {code: 'bho', name: '🇮🇳 Bhojpuri', flag: '🇮🇳'},
            {code: 'sa', name: '🇮🇳 Sanskrit', flag: '🇮🇳'},
            {code: 'ne', name: '🇳🇵 Nepali', flag: '🇳🇵'},
            {code: 'dz', name: '🇧🇹 Dzongkha', flag: '🇧🇹'},
            {code: 'bo', name: '🇨🇳 Tibetan', flag: '🇨🇳'},
            {code: 'mn', name: '🇲🇳 Mongolian', flag: '🇲🇳'},
            {code: 'ka', name: '🇬🇪 Georgian', flag: '🇬🇪'},
            {code: 'hy', name: '🇦🇲 Armenian', flag: '🇦🇲'},
            {code: 'el', name: '🇬🇷 Greek', flag: '🇬🇷'},
            {code: 'bg', name: '🇧🇬 Bulgarian', flag: '🇧🇬'},
            {code: 'mk', name: '🇲🇰 Macedonian', flag: '🇲🇰'},
            {code: 'sr', name: '🇷🇸 Serbian', flag: '🇷🇸'},
            {code: 'hr', name: '🇭🇷 Croatian', flag: '🇭🇷'},
            {code: 'sl', name: '🇸🇮 Slovenian', flag: '🇸🇮'},
            {code: 'sk', name: '🇸🇰 Slovak', flag: '🇸🇰'},
            {code: 'cs', name: '🇨🇿 Czech', flag: '🇨🇿'},
            {code: 'pl', name: '🇵🇱 Polish', flag: '🇵🇱'},
            {code: 'hu', name: '🇭🇺 Hungarian', flag: '🇭🇺'},
            {code: 'ro', name: '🇷🇴 Romanian', flag: '🇷🇴'},
            {code: 'uk', name: '🇺🇦 Ukrainian', flag: '🇺🇦'},
            {code: 'be', name: '🇧🇾 Belarusian', flag: '🇧🇾'},
            {code: 'lt', name: '🇱🇹 Lithuanian', flag: '🇱🇹'},
            {code: 'lv', name: '🇱🇻 Latvian', flag: '🇱🇻'},
            {code: 'et', name: '🇪🇪 Estonian', flag: '🇪🇪'},
            {code: 'fi', name: '🇫🇮 Finnish', flag: '🇫🇮'},
            {code: 'sv', name: '🇸🇪 Swedish', flag: '🇸🇪'},
            {code: 'no', name: '🇳🇴 Norwegian', flag: '🇳🇴'},
            {code: 'da', name: '🇩🇰 Danish', flag: '🇩🇰'},
            {code: 'is', name: '🇮🇸 Icelandic', flag: '🇮🇸'},
            {code: 'cy', name: '🏴󠁧󠁢󠁷󠁬󠁳󠁿 Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿'},
            {code: 'gd', name: '🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scottish Gaelic', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿'},
            {code: 'ga', name: '🇮🇪 Irish', flag: '🇮🇪'},
            {code: 'mt', name: '🇲🇹 Maltese', flag: '🇲🇹'},
            {code: 'eo', name: '🌍 Esperanto', flag: '🌍'},
            {code: 'la', name: '🏛️ Latin', flag: '🏛️'}
        ];

        function buildLanguageSelectors() {
            let opts = '<option value="id|id">🇮🇩 Indonesia (Baku)</option>';
            proLanguages.forEach(l => {
                if(l.code !== 'id') {
                    opts += '<option value="id|' + l.code + '">' + l.name + '</option>';
                }
            });
            document.querySelectorAll('.proLangSelector').forEach(sel => {
                sel.innerHTML = opts;
            });
        }

        function doGTranslate(langPair) {
            if(langPair.value) langPair = langPair.value;
            if(langPair == '') return;
            var el = document.querySelector('.goog-te-combo');
            if(!el) return;
            el.value = langPair.split('|')[1];
            if(document.createEvent) {
                var ev = document.createEvent("HTMLEvents");
                ev.initEvent("change", true, true);
                el.dispatchEvent(ev);
            } else {
                el.fireEvent("onchange");
            }
        }
        `;
        lines[i] = jsFuncs + '\n' + line;
    }
}

fs.writeFileSync('build_ui_premium_v3.js', lines.join('\n'));
console.log('Successfully injected line by line.');
