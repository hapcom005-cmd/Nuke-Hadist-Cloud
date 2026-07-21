const fs = require('fs');
let html = fs.readFileSync('build_ui_premium_v3.js', 'utf8');

const jsCode = `
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
            let opts = '<option value="id|id">🇮🇩 Indonesia (Default)</option>';
            proLanguages.forEach(l => {
                if(l.code !== 'id') {
                    opts += \`<option value="id|\${l.code}">\${l.name}</option>\`;
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

html = html.replace('window.onload = initApp;', jsCode + '\n        window.onload = initApp;');
fs.writeFileSync('build_ui_premium_v3.js', html);
