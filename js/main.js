/* ============================================
   United Immigration Medical Exams
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

  /* === 1. Load shared components === */
  const navLoaded = await loadComponent('nav-placeholder', '/components/nav.html');
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
  await loadComponent('cta-placeholder', '/components/cta-banner.html');
  await loadComponent('footer-placeholder', '/components/footer.html');

  /* === 2. Apply CTA overrides === */
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

  /* === 3. Init nav (after it's loaded into DOM) === */
  if (navLoaded && typeof window.initNav === 'function') {
    window.initNav();
  }

  /* === 4. Re-init Lucide icons (for dynamically injected HTML) === */
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }

  /* === 5. Rebind appointment-link interceptors (Calendly modal) === */
  // These run after nav/footer inject new appointment links
  document.querySelectorAll('a[href="/appointments.html"], a[href="appointments.html"], a[href="./appointments.html"], a[href="../appointments.html"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof openCalendlyModal === 'function') openCalendlyModal();
    });
  });

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

  // --- Calendly Modal ---
  const CALENDLY_URL = 'https://calendly.com/unitedmedicalexams-info/30min?hide_event_type_details=1';

  // Build modal DOM
  const modal = document.createElement('div');
  modal.className = 'cal-modal';
  modal.innerHTML = `
    <div class="cal-modal__backdrop"></div>
    <div class="cal-modal__card">
      <div class="cal-modal__body" id="calendly-modal-container"></div>
    </div>
    <button class="cal-modal__close" aria-label="Close">✕ Close</button>
  `;
  document.body.appendChild(modal);

  const container = document.getElementById('calendly-modal-container');
  const closeBtn = modal.querySelector('.cal-modal__close');
  const backdrop = modal.querySelector('.cal-modal__backdrop');
  let widgetLoaded = false;

  function loadCalendlySDK(cb) {
    if (widgetLoaded) return cb();
    const s = document.createElement('script');
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.onload = () => { widgetLoaded = true; cb(); };
    document.head.appendChild(s);
  }

  let savedScrollY = 0;

  // Expose globally so component-injected links can call it
  window.openCalendlyModal = function () {
    savedScrollY = window.scrollY;
    modal.classList.add('is-open');
    document.body.classList.add('cal-modal-open');
    loadCalendlySDK(() => {
      Calendly.initInlineWidget({
        url: CALENDLY_URL,
        parentElement: container
      });
    });
  };

  function closeCalendlyModal() {
    modal.classList.remove('is-open');
    document.body.classList.remove('cal-modal-open');
    // Restore scroll position before body overflow was locked
    window.scrollTo(0, savedScrollY);
    // Clear widget after transition
    setTimeout(() => { container.innerHTML = ''; }, 300);
    // Force nav scroll recheck after Safari settles
    setTimeout(() => {
      const nav = document.querySelector('.nav');
      if (nav) {
        if (window.scrollY > 60) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }
    }, 100);
  }

  closeBtn.addEventListener('click', closeCalendlyModal);
  backdrop.addEventListener('click', closeCalendlyModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeCalendlyModal();
  });

  // Attach to explicit data-open-calendly buttons
  document.querySelectorAll('[data-open-calendly]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.openCalendlyModal();
    });
  });

  // Intercept all appointment links (including dynamically loaded from components)
  document.querySelectorAll('a[href="/appointments.html"], a[href="appointments.html"], a[href="./appointments.html"], a[href="../appointments.html"]').forEach((link) => {
    // Avoid double-binding
    if (!link.dataset.calendlyBound) {
      link.dataset.calendlyBound = 'true';
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.openCalendlyModal();
      });
    }
  });

  // Auto-open modal on appointments page
  if (document.querySelector('[data-auto-open-calendly]')) {
    setTimeout(window.openCalendlyModal, 500);
  }

  // --- Social Proof Toast Notifications ---
  const toast = document.createElement('div');
  toast.className = 'social-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);

  let bookedCount = Math.floor(Math.random() * 3) + 1; // start at 1–3

  const toastMessages = [
    () => {
      const n = Math.floor(Math.random() * 3) + 1; // 1–3, fluctuates naturally
      return {
        icon: '<span class="social-toast__dot"></span>',
        text: `${n} ${n === 1 ? 'person is' : 'people are'} finding times right now`
      };
    },
    () => {
      // Only increment (0 or 1), never decrease, cap at 5
      if (bookedCount < 5) bookedCount += Math.round(Math.random());
      return {
        icon: '<span class="social-toast__icon">📅</span>',
        text: `${bookedCount} ${bookedCount === 1 ? 'person' : 'people'} booked today`
      };
    }
  ];

  let toastTimeout;
  function showToast() {
    const msg = toastMessages[Math.floor(Math.random() * toastMessages.length)]();
    toast.innerHTML = `${msg.icon}<span>${msg.text}</span>`;
    toast.classList.add('is-visible');

    // Auto-hide after 4.5s
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('is-visible');
      // Schedule next toast 20–40s later
      setTimeout(showToast, (Math.random() * 20000) + 20000);
    }, 4500);
  }

  // First toast after 5 seconds
  setTimeout(showToast, 5000);

});
