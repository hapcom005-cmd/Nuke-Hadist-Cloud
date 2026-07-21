
                window.CURRENT_INFO_FONT_SIZE = 1.0;
                window.changeInfoFontSize = function(delta) {
                    window.CURRENT_INFO_FONT_SIZE += delta;
                    if(window.CURRENT_INFO_FONT_SIZE < 0.6) window.CURRENT_INFO_FONT_SIZE = 0.6;
                    if(window.CURRENT_INFO_FONT_SIZE > 2.5) window.CURRENT_INFO_FONT_SIZE = 2.5;
                    document.documentElement.style.setProperty('--info-fs', window.CURRENT_INFO_FONT_SIZE + 'rem');
                };
                // Set default saat load
                document.documentElement.style.setProperty('--info-fs', '1.0rem');
            