
        // Theme Engine
        function toggleThemeMenu() {
            document.getElementById('themeMenu').classList.toggle('active');
        }
        function setTheme(themeName) {
            document.documentElement.setAttribute('data-theme', themeName);
            localStorage.setItem('hapcom-theme', themeName);
            document.getElementById('themeMenu').classList.remove('active');
        }
        // Load saved theme on startup
        (function() {
            const savedTheme = localStorage.getItem('hapcom-theme') || 'gold';
            setTheme(savedTheme);
        })();
    