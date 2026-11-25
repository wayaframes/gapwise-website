/* Booking button: Google Calendar appointment scheduling.
   Each <span class="book-slot" data-cta="book" data-utm-button="..."> on the page becomes Google's scheduling
   button (the popup). The link inside the slot is the fallback if Google's script is blocked or slow.
   Tracking: analytics.js counts a click anywhere inside a data-cta slot as booking_clicked, with the button name
   from data-utm-button and the visit's first-touch campaign tags. Google's popup is on Google's domain, so what
   happens inside it (a slot picked, a booking made) is not visible to this page. */
(function () {
  'use strict';
  var SCHEDULE_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ13zI0KzS1G6w1dsvMrgZ2a-RIdBd2OoTkei-ESkUsRDbGc-vluOXRKlP6QI1Dwrj0Nc-JU0v-1?gv=true';
  var COLOR = '#039BE5';
  var LABEL = 'Book an appointment';

  // Google's button is a normal <button> in this page. Give it the page's own button look (the classes of the fallback link,
  // without Google's blue and fonts) so it matches the other buttons; its click still opens Google's booking window.
  function restyle(slot, fallback) {
    var tries = 0;
    (function wait() {
      var btn = slot.querySelector('button');
      if (!btn) { if (++tries < 20) setTimeout(wait, 100); return; }
      var cls = fallback ? fallback.className.replace(/book-slot__fallback/, '').trim() : 'button button--primary';
      btn.removeAttribute('style');
      btn.className = (cls + ' book-slot__button').trim();
      btn.classList.remove('book-slot__fallback');   // the fallback link stays hidden; only the link's look is copied
    })();
  }

  function mount() {
    if (!window.calendar || !window.calendar.schedulingButton) return false;
    var slots = document.querySelectorAll('.book-slot');
    for (var i = 0; i < slots.length; i++) {
      (function (slot) {
        if (slot.getAttribute('data-ready')) return;
        var fallback = slot.querySelector('.book-slot__fallback');
        window.calendar.schedulingButton.load({ url: SCHEDULE_URL, color: COLOR, label: LABEL, target: fallback || slot });
        slot.setAttribute('data-ready', 'yes');
        if (fallback) fallback.style.display = 'none';
        restyle(slot, fallback);
      })(slots[i]);
    }
    return true;
  }

  function start() {
    var tries = 0;
    (function wait() {
      if (mount()) return;
      if (++tries < 40) setTimeout(wait, 250);   // wait up to 10 seconds for Google's script; the fallback links stay if it never loads
    })();
  }
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start);
})();
