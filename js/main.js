/* ============================================
   United Medical Immigration Exams
   Main JavaScript — Components + Scroll Animations
   ============================================ */

/* ---- Component Loader ---- */
const loadComponent = async (placeholderId, componentPath) => {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) return null;

  try {
    const resp = await fetch(componentPath);
    if (resp.ok) {
      const html = await resp.text();
      placeholder.outerHTML = html;
      return true;
    }
  } catch (e) {
    console.warn(`Failed to load component ${placeholderId}:`, e);
  }
  return null;
};

document.addEventListener('DOMContentLoaded', async () => {

  /* === 1. Shared components ===
     These are now INLINED into the static HTML at build time by
     build.js (so their ~20 internal links are crawlable, not
     JS-injected). The fetch path below is a legacy fallback: it
     only fires if a placeholder is still present — i.e. a page
     that hasn't been run through build.js yet. */
  const ctaPlaceholder = document.getElementById('cta-placeholder');
  let ctaOverrides = {};
  if (ctaPlaceholder) {
    // Capture data-* overrides BEFORE the placeholder is replaced
    ctaOverrides = {
      heading: ctaPlaceholder.dataset.ctaHeading,
      text: ctaPlaceholder.dataset.ctaText,
      btn1Text: ctaPlaceholder.dataset.ctaBtn1Text,
      btn1Href: ctaPlaceholder.dataset.ctaBtn1Href,
      btn2Text: ctaPlaceholder.dataset.ctaBtn2Text,
      btn2Href: ctaPlaceholder.dataset.ctaBtn2Href,
    };
  }

  await loadComponent('nav-placeholder', '/components/nav.html');
  await loadComponent('cta-placeholder', '/components/cta-banner.html');
  await loadComponent('footer-placeholder', '/components/footer.html');

  /* === 2. Apply CTA overrides (fallback path only) === */
  if (ctaOverrides.heading || ctaOverrides.text) {
    const ctaHeading = document.querySelector('.cta-banner__heading');
    const ctaText = document.querySelector('.cta-banner__text');
    const ctaBtn1 = document.querySelector('.cta-banner__btn1');
    const ctaBtn2 = document.querySelector('.cta-banner__btn2');

    if (ctaOverrides.heading && ctaHeading) ctaHeading.textContent = ctaOverrides.heading;
    if (ctaOverrides.text && ctaText) ctaText.textContent = ctaOverrides.text;
    if (ctaOverrides.btn1Text && ctaBtn1) ctaBtn1.textContent = ctaOverrides.btn1Text;
    if (ctaOverrides.btn1Href && ctaBtn1) ctaBtn1.href = ctaOverrides.btn1Href;
    if (ctaOverrides.btn2Text && ctaBtn2) ctaBtn2.textContent = ctaOverrides.btn2Text;
    if (ctaOverrides.btn2Href && ctaBtn2) ctaBtn2.href = ctaOverrides.btn2Href;
  }

  /* === 3. Init nav — whether it was inlined or fetched ===
     Guarded so it never double-binds if nav.js already ran it. */
  if (typeof window.initNav === 'function' && !window.__navInited) {
    window.initNav();
  }

  /* === 4. Re-init Lucide icons (for dynamically injected HTML) === */
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }

  /* ========================================
     Existing functionality below
     ======================================== */

  // --- Fade-in on scroll (Intersection Observer) ---
  const fadeEls = document.querySelectorAll('.fade-in');

  if (fadeEls.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: show everything
    fadeEls.forEach((el) => el.classList.add('visible'));
  }

  // --- Stagger fade-in for grouped items ---
  const staggerGroups = document.querySelectorAll('[data-stagger]');
  staggerGroups.forEach((group) => {
    const children = group.querySelectorAll('.fade-in');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 100}ms`;
    });
  });

  // --- Hero Image Carousel (soft fade) ---
  const heroSlides = document.querySelectorAll('.hero__slide');
  if (heroSlides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
      heroSlides[currentSlide].classList.remove('hero__slide--active');
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add('hero__slide--active');
    }, 5000);
  }

  // --- Testimonials Carousel Navigation ---
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.querySelector('.testimonials__arrow--prev');
  const nextBtn = document.querySelector('.testimonials__arrow--next');

  if (track && prevBtn && nextBtn) {
    const scrollAmount = () => {
      const card = track.querySelector('.testimonial-card');
      return card ? card.offsetWidth + 24 : 344; // card width + gap
    };

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });

    const updateArrows = () => {
      prevBtn.style.opacity = track.scrollLeft <= 10 ? '0.3' : '1';
      prevBtn.style.pointerEvents = track.scrollLeft <= 10 ? 'none' : 'auto';
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 10;
      nextBtn.style.opacity = atEnd ? '0.3' : '1';
      nextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
    };

    track.addEventListener('scroll', updateArrows);
    updateArrows();
  }

  // --- Show More Reviews (mobile stacked layout) ---
  const showMoreBtn = document.getElementById('showMoreReviews');
  if (showMoreBtn && track) {
    const carousel = track.closest('.testimonials__carousel');
    showMoreBtn.addEventListener('click', () => {
      const expanded = track.classList.toggle('is-expanded');
      if (carousel) carousel.classList.toggle('is-expanded', expanded);
      showMoreBtn.textContent = expanded ? 'Show Less ↑' : 'Show More Reviews ↓';
    });
  }


  /* --- Social-proof toasts: REMOVED 2026-07-22 ---------------------------
     This block injected rotating pop-ups reading "N people are finding times
     right now" and "N people booked today". Both numbers were generated with
     Math.random() and were not connected to any real booking or session data.

     Removed at the client's direction. Presenting invented figures to patients
     as fact is a deceptive-practice ("dark pattern") risk, and it contradicts
     the project's own standing rule never to publish fabricated numbers — a
     rule that matters more, not less, on a medical practice's website.

     The site's real proof does this job honestly: verified Google reviews,
     500+ completed exams, and the testimonial carousel.

     Do not reinstate. If live booking activity is ever surfaced, it must be
     driven by real data from the booking system.
     ---------------------------------------------------------------------- */

});
