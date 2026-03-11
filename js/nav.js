/* ============================================
   United Immigration Medical Exams
   Navigation JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    const nav = document.querySelector('.nav');
    const hamburger = document.querySelector('.nav__hamburger');
    const drawer = document.querySelector('.nav__drawer');

    // --- Sticky Nav : add scrolled class ---
    const handleScroll = () => {
        if (window.scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run on load

    // --- Hamburger Toggle ---
    if (hamburger && drawer) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.toggle('open');
            drawer.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close drawer on link click
        drawer.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                drawer.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
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

});
