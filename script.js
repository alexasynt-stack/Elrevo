// script.js - accessible slider, form handling, reduced-motion handling, footer year
(function () {
  // Utility
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Year in footer
  const yearEl = qs("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Respect prefers-reduced-motion: pause/hide autoplay video
  const video = qs(".hero-video");
  try {
    const prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (video && prefersReduce) {
      video.pause();
      // ensure poster/background still visible; video is hidden via CSS (prefers-reduced-motion)
    }
  } catch (e) {
    // ignore
  }

  // Accessible slider implementation
  const slider = qs("#slider");
  const prevBtn = qs("#prevBtn");
  const nextBtn = qs("#nextBtn");

  function scrollByCard(direction = 1) {
    if (!slider) return;
    const card = slider.querySelector(".card");
    if (!card) return;
    const style = window.getComputedStyle(card);
    const gap = parseFloat(style.marginRight || 0) + parseFloat(style.marginLeft || 0);
    const cardWidth = card.getBoundingClientRect().width + gap;
    slider.scrollBy({ left: cardWidth * direction, behavior: "smooth" });
  }

  if (prevBtn) prevBtn.addEventListener("click", () => scrollByCard(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => scrollByCard(1));

  // Keyboard support for slider (when focused)
  if (slider) {
    slider.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          scrollByCard(-1);
          break;
        case "ArrowRight":
          e.preventDefault();
          scrollByCard(1);
          break;
        case "Home":
          e.preventDefault();
          slider.scrollTo({ left: 0, behavior: "smooth" });
          break;
        case "End":
          e.preventDefault();
          slider.scrollTo({ left: slider.scrollWidth, behavior: "smooth" });
          break;
      }
    });

    // Make sure cards are reachable by keyboard (they have tabindex="0" in markup)
    // Provide focus-visible outline via CSS class (handled by :focus)
  }

  // Newsletter form handling (client-side)
  const newsletter = qs("#newsletter");
  const emailInput = qs("#email");
  const statusEl = qs("#newsletter-status");

  function showStatus(message, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.style.color = isError ? "crimson" : "green";
    // set a timeout to clear success messages
    if (!isError) setTimeout(() => { statusEl.textContent = ""; }, 6000);
  }

  if (newsletter && emailInput) {
    newsletter.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const val = emailInput.value.trim();

      // basic email validation
      const simpleEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!simpleEmail.test(val)) {
        showStatus("Please enter a valid email address.", true);
        emailInput.focus();
        return;
      }

      // Simulate submission - replace with real endpoint
      try {
        // Show immediate optimistic feedback
        showStatus("Subscribing…");

        // Example: replace with your API endpoint
        // const resp = await fetch("/api/newsletter", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ email: val })
        // });
        // const data = await resp.json();
        // if (!resp.ok) throw new Error(data?.message || "Subscription failed");

        // Simulated network delay for demo
        await new Promise((r) => setTimeout(r, 700));
        newsletter.reset();
        showStatus("Thanks — you're on the list!");
      } catch (err) {
        showStatus("Subscription failed. Please try again later.", true);
        console.error(err);
      }
    });
  }

  // Improve focus management for click on arrows (so keyboard focus remains consistent)
  [prevBtn, nextBtn].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Make sure product images load lazily on older browsers fallback
  // IntersectionObserver-based lazy-loading polyfill behavior: modern browsers already support loading="lazy"
  // Add no-op in case we want to extend

  // Small enhancement: When focus lands on a card, ensure it's scrolled into view (centered)
  if (slider) {
    qsa(".card", slider).forEach((card) => {
      card.addEventListener("focus", () => {
        card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      });
    });
  }
})();