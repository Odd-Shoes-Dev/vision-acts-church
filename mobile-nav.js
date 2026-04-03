(function () {
    function setupMobileNav() {
        const navbar = document.querySelector('.navbar');
        const navContainer = navbar ? navbar.querySelector('.container') : null;
        const navMenu = navbar ? navbar.querySelector('.nav-menu') : null;

        if (!navContainer || !navMenu) {
            return;
        }

        let toggleBtn = navContainer.querySelector('.menu-toggle');

        if (!toggleBtn) {
            toggleBtn = document.createElement('button');
            toggleBtn.type = 'button';
            toggleBtn.className = 'menu-toggle';
            toggleBtn.setAttribute('aria-label', 'Toggle navigation menu');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
            navContainer.insertBefore(toggleBtn, navMenu);
        }

        const closeMenu = function () {
            navMenu.classList.remove('nav-open');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        };

        const openMenu = function () {
            navMenu.classList.add('nav-open');
            toggleBtn.setAttribute('aria-expanded', 'true');
            toggleBtn.innerHTML = '<i class="fas fa-xmark"></i>';
        };

        toggleBtn.addEventListener('pointerup', function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (navMenu.classList.contains('nav-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('pointerdown', function (event) {
            if (!navContainer.contains(event.target)) {
                closeMenu();
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupMobileNav);
    } else {
        setupMobileNav();
    }
})();
