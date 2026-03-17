/* ============================================
   United Immigration Medical Exams
   Navigation JavaScript
   ============================================ */

/* --- Custom smooth-scroll with ease-in-out --- */
function smoothScrollTo(targetEl, duration) {
    duration = duration || 900;
    const navHeight = 80; // fixed nav offset
    const targetY = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
    const startY = window.scrollY;
    const diff = targetY - startY;
    let startTime = null;

    // ease-in-out cubic
    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, startY + diff * easeInOutCubic(progress));
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

/* --- Intercept same-page hash links --- */
function isHomepage() {
    const path = window.location.pathname;
    return path === '/' || path === '/index.html' || path.endsWith('/index.html');
}

function handleHashLink(e) {
    const href = e.currentTarget.getAttribute('href');
    if (!href) return;

    // Extract the hash portion
    let hash = '';
    if (href.startsWith('#')) {
        hash = href;
    } else if (href.includes('#')) {
        // e.g. /index.html#pricing — only intercept if we're already on homepage
        const url = new URL(href, window.location.origin);
        const targetIsHome = url.pathname === '/' || url.pathname === '/index.html' || url.pathname.endsWith('/index.html');
        if (!targetIsHome || !isHomepage()) return;
        hash = '#' + href.split('#')[1];
    }

    if (!hash) return;

    const target = document.querySelector(hash);
    if (!target) return;

    e.preventDefault();
    smoothScrollTo(target, 900);

    // Update URL hash without jumping
    history.replaceState(null, '', hash);
}

window.initNav = function () {

    const nav = document.querySelector('.nav');
    const hamburger = document.querySelector('.nav__hamburger');
    const drawer = document.querySelector('.nav__drawer');

    if (!nav) return;

    // Remove CSS scroll-behavior to prevent conflicts with JS scroll
    document.documentElement.style.scrollBehavior = 'auto';

    // --- Sticky Nav : add scrolled class ---
    // Pages without a dark hero should always show scrolled nav
    const hasHero = document.querySelector('.hero');
    if (!hasHero) {
        nav.classList.add('scrolled');
    }

    const handleScroll = () => {
        if (hasHero) {
            if (window.scrollY > 60) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run on load

    // --- Bind smooth-scroll to all nav hash links ---
    nav.querySelectorAll('a[href*="#"]').forEach((link) => {
        link.addEventListener('click', handleHashLink);
    });

    // --- Hamburger Toggle ---
    if (hamburger && drawer) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.toggle('open');
            drawer.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close drawer on link click + smooth-scroll for hash links
        drawer.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', (e) => {
                hamburger.classList.remove('open');
                drawer.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';

                // Also smooth-scroll if this is a hash link
                handleHashLink(e);
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (
                drawer.classList.contains('open') &&
                !drawer.contains(e.target) &&
                !hamburger.contains(e.target)
            ) {
                hamburger.classList.remove('open');
                drawer.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // --- Dropdown toggle (desktop More menu) ---
    const dropdownTrigger = nav.querySelector('.nav__dropdown-trigger');
    if (dropdownTrigger) {
        dropdownTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const parent = dropdownTrigger.closest('.nav__dropdown');
            const isOpen = parent.classList.toggle('is-open');
            dropdownTrigger.setAttribute('aria-expanded', isOpen);
        });

        document.addEventListener('click', () => {
            const openDropdown = nav.querySelector('.nav__dropdown.is-open');
            if (openDropdown) {
                openDropdown.classList.remove('is-open');
                openDropdown.querySelector('.nav__dropdown-trigger')
                    .setAttribute('aria-expanded', 'false');
            }
        });
    }

};

// If nav already exists in the DOM on load (fallback), init immediately
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.nav') && !document.getElementById('nav-placeholder')) {
        window.initNav();
    }
});
