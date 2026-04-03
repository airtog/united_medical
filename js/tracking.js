// ============================================================
// tracking.js v5 — United Medical Exams
// GA4: G-M6D4QHH38F
// 7 tracked events per v2 brief
// ============================================================

(function () {
  'use strict';

  let bookingTracked = false;
  let callTracked = false;
  let scheduleTracked = false;

  function fire(name, params) {
    if (typeof gtag === 'function') gtag('event', name, params || {});
  }

  // 1. click_to_call
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="tel:"]');
    if (link && !callTracked) {
      callTracked = true;
      fire('click_to_call', { event_category: 'conversion', event_label: link.href });
    }
  });

  // 2. schedule_click
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href*="appointments"]');
    if (link && !scheduleTracked) {
      scheduleTracked = true;
      fire('schedule_click', { event_category: 'conversion', event_label: link.textContent.trim(), transport_type: 'beacon' });
    }
  });

  // 3. calendly_confirmed
  window.addEventListener('message', function (e) {
    if (e.data && e.data.event === 'calendly.event_scheduled' && !bookingTracked) {
      bookingTracked = true;
      fire('calendly_confirmed', { event_category: 'conversion', event_label: 'calendly_booking', value: 599 });
    }
  });

  // 4. scroll_depth (25%, 50%, 75%, 90%)
  var scrollMarks = { 25: false, 50: false, 75: false, 90: false };
  window.addEventListener('scroll', function () {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    var pct = Math.round((scrollTop / docHeight) * 100);
    [25, 50, 75, 90].forEach(function (mark) {
      if (pct >= mark && !scrollMarks[mark]) {
        scrollMarks[mark] = true;
        fire('scroll_depth', { event_category: 'engagement', event_label: mark + '%' });
      }
    });
  }, { passive: true });

  // 5. faq_expand
  document.addEventListener('toggle', function (e) {
    if (e.target.matches('.faq-item') && e.target.open) {
      var q = e.target.querySelector('summary');
      fire('faq_expand', { event_category: 'engagement', event_label: q ? q.textContent.trim() : 'unknown' });
    }
  }, true);

  // 6. sticky_cta_click
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('#sticky-call-cta, #sticky-book-cta');
    if (btn) {
      fire('sticky_cta_click', { event_category: 'conversion', event_label: btn.textContent.trim() });
    }
  });

  // 7. google_reviews_click
  document.addEventListener('click', function (e) {
    var link = e.target.closest('#google-reviews-link');
    if (link) {
      fire('google_reviews_click', { event_category: 'engagement', event_label: 'see_all_reviews_google' });
    }
  });

})();
