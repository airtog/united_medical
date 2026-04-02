// ============================================================
// tracking.js v3 — United Medical Exams
// GA4: G-M6D4QHH38F
// ============================================================

(function () {
  'use strict';

  // ----------------------------------------------------------
  // Deduplication flags (per page load)
  // ----------------------------------------------------------
  let bookingTracked = false;
  let ctaClickTracked = false;

  // Helper: safe gtag check
  function fireEvent(eventName, params) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params || {});
    }
  }

  // ----------------------------------------------------------
  // 1. CLICK-TO-CALL TRACKING
  //    Fires once per page load when user taps any tel: link
  // ----------------------------------------------------------
  let callTracked = false;
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="tel:"]');
    if (link && !callTracked) {
      callTracked = true;
      fireEvent('click_to_call', {
        event_category: 'engagement',
        event_label: link.href
      });
    }
  });

  // ----------------------------------------------------------
  // 2. CALENDLY BOOKING COMPLETED
  //    Listens for postMessage from Calendly iframe.
  //    Calendly can fire event_scheduled more than once per
  //    booking — the flag prevents duplicate GA4 hits.
  // ----------------------------------------------------------
  window.addEventListener('message', function (e) {
    if (e.data && e.data.event === 'calendly.event_scheduled' && !bookingTracked) {
      bookingTracked = true;
      fireEvent('invitee_meeting_scheduled', {
        event_category: 'conversion',
        event_label: 'calendly_booking',
        value: 599
      });
    }
  });

  // ----------------------------------------------------------
  // 3. SCHEDULE CTA CLICK (homepage only)
  //    Uses beacon transport so the hit completes before
  //    the browser navigates to /appointments.html.
  //    Fires once per page load.
  // ----------------------------------------------------------
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href*="appointments"]');
    if (link && !ctaClickTracked) {
      ctaClickTracked = true;
      // Use sendBeacon transport to survive page navigation
      if (typeof gtag === 'function') {
        gtag('event', 'schedule_cta_click', {
          event_category: 'engagement',
          event_label: link.textContent.trim(),
          transport_type: 'beacon'
        });
      }
      // Don't preventDefault — let the link navigate naturally
    }
  });

})();
