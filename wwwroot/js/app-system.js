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

    let currentLang = localStorage.getItem('app-lang') || 'en';

    function applyLocalization(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[lang] && dict[lang][key]) {
                if (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'search')) {
                    el.placeholder = dict[lang][key];
                } else if (el.hasAttribute('title') && el.classList.contains('icon-btn')) {
                    el.title = dict[lang][key];
                    el.setAttribute('data-bs-original-title', dict[lang][key]); 
                } else {
                    el.innerText = dict[lang][key];
                }
            }
        });
    }

    applyLocalization(currentLang);

    document.querySelectorAll('.lang-switch').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLang = btn.getAttribute('data-lang');
            localStorage.setItem('app-lang', selectedLang);
            applyLocalization(selectedLang);
        });
    });

    const toggleBtn = document.getElementById('toggleDarkMode');
    const darkModeIcon = document.getElementById('darkModeIcon');

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

    window.changeThemeColor = function (colorKey) {
        localStorage.setItem('app-color-theme', colorKey);

        let existingLink = document.getElementById('color-theme-override');

        if (colorKey === 'default') {
            if (existingLink) existingLink.remove();
            return;
        }

        if (existingLink) {
            existingLink.href = `/css/themes/${colorKey}.css`;
        } else {
            let themeLink = document.createElement('link');
            themeLink.rel = 'stylesheet';
            themeLink.id = 'color-theme-override';
            themeLink.href = `/css/themes/${colorKey}.css`;
            document.head.appendChild(themeLink);
        }

        let img = document.getElementById('headerProfileImage');
        if (img) {
            let hex = "3b9d82"; 
            if (colorKey === "blue") hex = "2563eb";
            if (colorKey === "purple") hex = "7c3aed";
            if (colorKey === "orange") hex = "ea580c";
            img.src = `https://ui-avatars.com/api/?name=Admin+User&background=${hex}&color=fff`;
        }
    };

    // Auto-init Barcode Generator UI if present
    if (document.getElementById('bcText')) {
        if (!document.getElementById('bcText').value) {
            document.getElementById('bcText').value = "https://example.com";
        }
        document.getElementById('bcColor').addEventListener('input', function() {
            const val = document.getElementById('bcColorValue');
            if(val) val.innerText = this.value;
        });
        document.getElementById('bcBgColor').addEventListener('input', function() {
            const val = document.getElementById('bcBgColorValue');
            if(val) val.innerText = this.value;
        });
        setTimeout(window.generateBarcode, 200);
    }
});

// --- KUDAKIT BARCODE GENERATOR MODULE ---
window.kudaBarcodeTypingTimer = null;
window.debounceGenerate = function() {
    clearTimeout(window.kudaBarcodeTypingTimer);
    window.kudaBarcodeTypingTimer = setTimeout(window.generateBarcode, 300);
};

window.generateBarcode = function() {
    if (typeof bwipjs === 'undefined') {
        const errorMsg = document.getElementById('errorMsg');
        if (errorMsg) {
            errorMsg.innerText = "Loading barcode engine...";
            errorMsg.classList.remove('text-danger', 'd-none');
            errorMsg.classList.add('text-info');
        }
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/bwip-js/3.4.1/bwip-js-min.js";
        script.onload = () => {
            if (errorMsg) {
                errorMsg.classList.remove('text-info');
                errorMsg.classList.add('text-danger', 'd-none');
                errorMsg.innerText = "Invalid data for the selected barcode type.";
            }
            window.generateBarcode(); 
        };
        document.head.appendChild(script);
        return;
    }

    const textEl = document.getElementById('bcText');
    if (!textEl) return;
    
    const text = textEl.value;
    const typeD = document.getElementById('bcid');
    if (!typeD) return;
    
    const type = typeD.value;
    const color = document.getElementById('bcColor').value.replace('#', '');
    const bgColor = document.getElementById('bcBgColor').value.replace('#', '');
    const incText = document.getElementById('bcIncludeText').checked;
    const scale = document.getElementById('bcScale').value;
    const height = document.getElementById('bcHeight').value;

    const emptyState = document.getElementById('emptyState');
    const previewCard = document.getElementById('previewCard');
    const actions = document.getElementById('previewActions');
    const errorMsg = document.getElementById('errorMsg');

    if (!text.trim()) {
        if(emptyState) emptyState.classList.remove('d-none');
        if(previewCard) previewCard.classList.add('d-none');
        if(actions) actions.classList.add('d-none');
        if(errorMsg) errorMsg.classList.add('d-none');
        return;
    }

    try {
        const canvas = document.getElementById('barcodeCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        bwipjs.toCanvas('barcodeCanvas', {
            bcid: type,       
            text: text,       
            scale: parseInt(scale), 
            height: parseInt(height), 
            includetext: incText, 
            textxalign: 'center', 
            barcolor: color,
            backgroundcolor: bgColor
        });

        if(emptyState) emptyState.classList.add('d-none');
        if(previewCard) previewCard.classList.remove('d-none');
        if(actions) actions.classList.remove('d-none');
        if(errorMsg) errorMsg.classList.add('d-none');

        previewCard.style.backgroundColor = '#' + bgColor;
    } catch (e) {
        console.error(e);
        if(errorMsg) {
            errorMsg.innerText = e.message || "Invalid input for this barcode type.";
            errorMsg.classList.remove('d-none');
        }
        if(emptyState) emptyState.classList.remove('d-none');
        if(previewCard) previewCard.classList.add('d-none');
        if(actions) actions.classList.add('d-none');
    }
};

window.downloadBarcode = function(format) {
    const canvas = document.getElementById('barcodeCanvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `barcode_${Date.now()}.${format}`;

    if(format === 'png') {
        link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
