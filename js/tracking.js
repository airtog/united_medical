/* ============================================
   United Immigration Medical Exams
   Analytics & Conversion Tracking
   GA4: G-M6D4QHH38F

   NOTE: Uses event delegation (document-level listeners)
   so tracking works on dynamically loaded components
   (nav, footer, cta-banner loaded via fetch in main.js).
   ============================================ */

(function () {

  // --- Click-to-Call Tracking ---
  // Fires GA4 key event "click_to_call" when any tel: link is clicked
  // Uses event delegation to catch links injected by component loader
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="tel:"]');
    if (link && typeof gtag === 'function') {
      gtag('event', 'click_to_call', {
        event_category: 'engagement',
        event_label: link.href.replace('tel:', ''),
        value: 1
      });
    }
  });

  // --- Calendly Booking Tracking ---
  // Fires GA4 key event "invitee_meeting_scheduled" when a Calendly booking completes
  // Calendly sends a postMessage event when scheduling is complete
  window.addEventListener('message', (e) => {
    if (e.origin && e.origin.indexOf('calendly.com') !== -1) {
      if (e.data && e.data.event === 'calendly.event_scheduled') {
        if (typeof gtag === 'function') {
          gtag('event', 'invitee_meeting_scheduled', {
            event_category: 'conversion',
            event_label: 'calendly_booking',
            value: 449
          });
        }
      }
    }
  });

  // --- Schedule Appointment Button Click Tracking ---
  // Track clicks on schedule/appointment CTAs for funnel analysis
  // Uses event delegation to catch dynamically loaded nav/footer/cta links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href="/appointments.html"], a[href="appointments.html"], a[href="./appointments.html"], a[href="../appointments.html"], [data-open-calendly]');
    if (link && typeof gtag === 'function') {
      gtag('event', 'schedule_cta_click', {
        event_category: 'engagement',
        event_label: link.textContent.trim().substring(0, 50),
        page_location: window.location.href
      });
    }
  });

  // --- Outbound Link Tracking (Google Reviews, etc.) ---
  // Uses event delegation for dynamically loaded footer/nav links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[target="_blank"]');
    if (link && typeof gtag === 'function') {
      gtag('event', 'outbound_click', {
        event_category: 'engagement',
        event_label: link.href,
        page_location: window.location.href
      });
    }
  });

})();
