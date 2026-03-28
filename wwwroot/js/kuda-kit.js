const KudaKit = {

    initTheme: function() {
        const savedTheme = localStorage.getItem('kuda-theme') || 
                          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        this.setTheme(savedTheme);

        const themeToggle = document.getElementById('toggleDarkMode');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                this.setTheme(currentTheme === 'dark' ? 'light' : 'dark');
            });
        }
    },

    setTheme: function(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('kuda-theme', theme);

        const icon = document.getElementById('darkModeIcon');
        if (icon) {
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    },

    initSidebar: function() {
        const sidebar = document.querySelector('.sidebar-wrapper');
        const toggleBtn = document.getElementById('toggleSidebar');
        const overlay = document.querySelector('.sidebar-overlay');

        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                if (window.innerWidth > 991) {
                    sidebar.classList.toggle('collapsed');
                } else {
                    sidebar.classList.toggle('mobile-open');
                    if (overlay) overlay.classList.toggle('show');
                }
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('show');
            });
        }
    },

    initDataTable: function(tableId, options = {}) {
        const $table = document.getElementById(tableId);
        if (!$table) return null;

        const $headers = $table.querySelectorAll('thead th[data-search="true"]');
        $headers.forEach(th => {
            const title = th.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'col-search-input';
            input.placeholder = `Search ${title}`;

            input.addEventListener('click', (e) => e.stopPropagation());
            input.addEventListener('mousedown', (e) => e.stopPropagation());

            th.appendChild(input);
        });

        const dtOptions = {
            pageLength: options.pageLength || 10,
            responsive: options.responsive !== undefined ? options.responsive : true,
            initComplete: function () {
                const api = this.api();
                api.columns().every(function () {
                    const column = this;
                    const input = column.header().querySelector('input.col-search-input');
                    if (input) {
                        input.addEventListener('keyup', function() {
                            if (column.search() !== this.value) {
                                column.search(this.value).draw();
                            }
                        });
                    }
                });
            },
            ...options
        };

        return window.jQuery ? window.jQuery(`#${tableId}`).DataTable(dtOptions) : null;
    }
};

if (window.jQuery && !window.$) {
    window.$ = window.jQuery;
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 KudaKit [CDN] Version 1.5 - Loading dependencies...');
    if (typeof bootstrap !== 'undefined') {
        console.log('✅ Bootstrap detected');
    } else {
        console.error('❌ Bootstrap NOT detected');
    }
    
    KudaKit.initTheme();
    KudaKit.initSidebar();
    
    // Auto-init Barcode Generator UI if present
    if (document.getElementById('bcText')) {
        if (!document.getElementById('bcText').value) {
            document.getElementById('bcText').value = "https://example.com";
        }
        
        const bcColor = document.getElementById('bcColor');
        const bcBgColor = document.getElementById('bcBgColor');
        
        if(bcColor) {
            bcColor.addEventListener('input', function() {
                const val = document.getElementById('bcColorValue');
                if(val) val.innerText = this.value;
                window.debounceGenerate();
            });
        }
        
        if(bcBgColor) {
            bcBgColor.addEventListener('input', function() {
                const val = document.getElementById('bcBgColorValue');
                if(val) val.innerText = this.value;
                window.debounceGenerate();
            });
        }
        
        setTimeout(window.generateBarcode, 200);
    }

    // --- PORTABLE COMPONENT COPY LOGIC ---
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            if(targetId) {
                const targetEl = document.getElementById(targetId);
                if(targetEl) {
                    const htmlContent = targetEl.outerHTML;
                    
                    // Use a simple prompt if the global modal isn't present
                    const textarea = document.getElementById('globalCopyHtmlTextarea');
                    if (textarea) {
                        textarea.value = htmlContent;
                        if (typeof bootstrap !== 'undefined') {
                            const modalEl = document.getElementById('globalCopyHtmlModal');
                            if (modalEl) {
                                const myModal = bootstrap.Modal.getOrCreateInstance(modalEl);
                                myModal.show();
                            }
                        }
                    } else {
                        // Fallback: Copy to clipboard directly and show alert
                        navigator.clipboard.writeText(htmlContent).then(() => {
                            const origText = this.innerHTML;
                            this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                            setTimeout(() => { this.innerHTML = origText; }, 2000);
                        });
                    }
                }
            }
        });
    });
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
    const color = (document.getElementById('bcColor')?.value || '#000000').replace('#', '');
    const bgColor = (document.getElementById('bcBgColor')?.value || '#ffffff').replace('#', '');
    const incText = document.getElementById('bcIncludeText')?.checked || false;
    const scale = document.getElementById('bcScale')?.value || 3;
    const height = document.getElementById('bcHeight')?.value || 10;

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
