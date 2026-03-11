/* ============================================
   United Immigration Medical Exams
   Analytics & Conversion Tracking
   GA4: G-M6D4QHH38F
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Click-to-Call Tracking ---
  // Fires GA4 key event "click_to_call" when any tel: link is clicked
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'click_to_call', {
          event_category: 'engagement',
          event_label: link.href.replace('tel:', ''),
          value: 1
        });
      }
    });
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
  document.querySelectorAll('a[href="appointments.html"], a[href="./appointments.html"], a[href="../appointments.html"], [data-open-calendly]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'schedule_cta_click', {
          event_category: 'engagement',
          event_label: btn.textContent.trim().substring(0, 50),
          page_location: window.location.href
        });
      }
    });
  });

  // --- Outbound Link Tracking (Google Reviews, etc.) ---
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'outbound_click', {
          event_category: 'engagement',
          event_label: link.href,
          page_location: window.location.href
        });
      }
    });
  });

});
