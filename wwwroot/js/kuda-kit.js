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
    KudaKit.initTheme();
    KudaKit.initSidebar();
});
