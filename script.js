// Progressive JS: slider behavior, newsletter form, and footer year.
// Keeps functionality unobtrusive so basic experience works without JS.

document.addEventListener('DOMContentLoaded', function () {
  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Slider
  const slider = document.getElementById('slider');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (slider && prevBtn && nextBtn) {
    // Amount to scroll per click - card width or viewport fraction
    const scrollAmount = () => {
      const card = slider.querySelector('.card');
      if (!card) return Math.round(slider.clientWidth * 0.8);
      const style = window.getComputedStyle(card);
      const gap = parseFloat(style.marginRight || 16) || 16;
      return Math.round(card.offsetWidth + gap);
    };

    function updateButtons() {
      // disable prev if at start, disable next if at end
      prevBtn.disabled = slider.scrollLeft === 0;
      // check if we've reached close to the end
      nextBtn.disabled = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 1;
    }

    prevBtn.addEventListener('click', function () {
      slider.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', function () {
      slider.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });

    // Update buttons after scroll
    slider.addEventListener('scroll', throttle(updateButtons, 100));

    // Keyboard support when slider has focus
    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextBtn.click();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevBtn.click();
      }
    });

    // Initial state
    updateButtons();

    // Recalculate on resize
    window.addEventListener('resize', debounce(updateButtons, 200));
  }

  // Newsletter form
  const form = document.getElementById('newsletter');
  const emailInput = document.getElementById('email');
  const status = document.getElementById('newsletter-status');

  if (form && emailInput && status) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = '';
      const email = emailInput.value && emailInput.value.trim();

      if (!isValidEmail(email)) {
        status.textContent = 'Please enter a valid email address.';
        status.className = 'newsletter-status error';
        emailInput.focus();
        return;
      }

      // Show pending state
      status.textContent = 'Subscribing…';
      status.className = 'newsletter-status pending';

      // TODO: Replace the following mock with a real endpoint (fetch to your subscription API)
      // Example:
      // fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }), headers: { 'Content-Type': 'application/json' }})
      //   .then(...)
      setTimeout(function () {
        // Mock success
        status.textContent = 'Thanks! You are subscribed.';
        status.className = 'newsletter-status success';
        form.reset();
      }, 700);
    });
  }

  // Utility helpers
  function isValidEmail(email) {
    // Simple but robust-ish check
    if (!email) return false;
    // basic RFC-ish pattern (not perfect, but okay for client-side)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // small throttle & debounce utilities
  function throttle(fn, wait) {
    let last = 0;
    return function () {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn.apply(this, arguments);
      }
    };
  }
  function debounce(fn, wait) {
    let t;
    return function () {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, arguments), wait);
    };
  }
});
