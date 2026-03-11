/* ============================================
   United Immigration Medical Exams
   Main JavaScript — Scroll Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

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

  function openCalendlyModal() {
    modal.classList.add('is-open');
    document.body.classList.add('cal-modal-open');
    loadCalendlySDK(() => {
      Calendly.initInlineWidget({
        url: CALENDLY_URL,
        parentElement: container
      });
    });
  }

  function closeCalendlyModal() {
    modal.classList.remove('is-open');
    document.body.classList.remove('cal-modal-open');
    // Clear widget after transition
    setTimeout(() => { container.innerHTML = ''; }, 300);
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
      openCalendlyModal();
    });
  });

  // Intercept all appointment links on the same site
  document.querySelectorAll('a[href="appointments.html"], a[href="./appointments.html"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openCalendlyModal();
    });
  });

  // Auto-open modal on appointments page
  if (document.querySelector('[data-auto-open-calendly]')) {
    setTimeout(openCalendlyModal, 500);
  }

});
