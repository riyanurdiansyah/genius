// Language Dictionary
const dict = {
    'en': {
        'dark_mode_title': 'Toggle Dark Mode',
        'language_title': 'Language',
        'admin_user': 'Admin',
        'search_placeholder': 'Search menu or type command...',
        'menu_dashboards': 'Dashboards',
        'menu_applications': 'Applications',
        'menu_components': 'Forms & Tables',
        'menu_docs': 'System & Guides'
    },
    'id': {
        'dark_mode_title': 'Ganti Mode Gelap',
        'language_title': 'Pilih Bahasa',
        'admin_user': 'Administrator',
        'search_placeholder': 'Cari menu atau perintah...',
        'menu_dashboards': 'Dasbor',
        'menu_applications': 'Aplikasi',
        'menu_components': 'Borang & Tabel',
        'menu_docs': 'Sistem & Panduan'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Language Mapping Logic
    // ==========================================
    let currentLang = localStorage.getItem('app-lang') || 'en';

    function applyLocalization(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[lang] && dict[lang][key]) {
                if (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'search')) {
                    el.placeholder = dict[lang][key];
                } else if (el.hasAttribute('title') && el.classList.contains('icon-btn')) {
                    el.title = dict[lang][key];
                    el.setAttribute('data-bs-original-title', dict[lang][key]); // Bootstrap Tooltip update if exists
                } else {
                    el.innerText = dict[lang][key];
                }
            }
        });
    }

    // Apply localization safely on load
    applyLocalization(currentLang);

    // Bind dropdown click events
    document.querySelectorAll('.lang-switch').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLang = btn.getAttribute('data-lang');
            localStorage.setItem('app-lang', selectedLang);
            applyLocalization(selectedLang);
        });
    });

    // ==========================================
    // 2. Dark Mode Toggle Buttons Logic
    // ==========================================
    const toggleBtn = document.getElementById('toggleDarkMode');
    const darkModeIcon = document.getElementById('darkModeIcon');

    // Check state from what the inline script generated
    let isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    function syncIconState(dark) {
        if (!darkModeIcon) return;
        if (dark) {
            darkModeIcon.classList.remove('fa-moon');
            darkModeIcon.classList.add('fa-sun');
        } else {
            darkModeIcon.classList.remove('fa-sun');
            darkModeIcon.classList.add('fa-moon');
        }
    }

    syncIconState(isDark);

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            isDark = !isDark;
            localStorage.setItem('app-theme', isDark ? 'dark' : 'light');

            if (isDark) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }

            syncIconState(isDark);
        });
    }
});
