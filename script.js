// The Mugumo Valley Resort — site scripts (cleaned up, single IIFE, no undefined calls)
(function () {
  "use strict";

  if (window.gsap && window.ScrollTrigger) {
    try { gsap.registerPlugin(ScrollTrigger); } catch (e) {}
  }

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = !!window.gsap;

  /* ---------------- Loader ---------------- */
  function initLoader() {
    const loader = document.getElementById("loader");
    if (!loader) return;
    window.addEventListener("load", () => {
      setTimeout(() => {
        loader.style.opacity = "0";
        loader.style.visibility = "hidden";
      }, 1200);
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  function initReveal() {
    const sections = document.querySelectorAll(".reveal");
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) en.target.classList.add("show"); }),
      { threshold: 0.12 }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* ---------------- Progress bar ---------------- */
  function initProgressBar() {
    const bar = document.getElementById("progress-bar");
    if (!bar) return;
    function update() {
      const st = document.documentElement.scrollTop || document.body.scrollTop;
      const sh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = (sh > 0 ? (st / sh) * 100 : 0) + "%";
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------------- Hero parallax (desktop pointer only) ---------------- */
  function initParallax() {
    const hero = document.querySelector(".hero");
    if (!hero || !window.matchMedia("(min-width:800px) and (hover:hover)").matches) return;
    hero.addEventListener("mousemove", (e) => {
      const rX = (e.clientX / window.innerWidth - 0.5) * 6;
      const rY = (e.clientY / window.innerHeight - 0.5) * 4;
      hero.style.backgroundPosition = `${50 + rX}% ${50 + rY}%`;
    });
    hero.addEventListener("mouseleave", () => { hero.style.backgroundPosition = "center center"; });
  }

  /* ---------------- Navbar hide-on-scroll ---------------- */
  function initNavbarScroll() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
      const current = window.pageYOffset || document.documentElement.scrollTop;
      const menu = document.getElementById("primary-menu");
      const menuOpen = menu && menu.classList.contains("mobile-open");
      if (!menuOpen && current > lastScroll && current > 120) navbar.style.top = "-120px";
      else navbar.style.top = "0";
      lastScroll = current;
    }, { passive: true });
  }

  /* ---------------- Mobile hamburger menu ---------------- */
  function initHamburger() {
    const btn = document.getElementById("hamburger");
    const menu = document.getElementById("primary-menu");
    if (!btn || !menu) return;
    btn.addEventListener("click", () => {
      const open = menu.classList.toggle("mobile-open");
      btn.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        menu.classList.remove("mobile-open");
        btn.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------------- Gallery lightbox ---------------- */
  function initLightbox() {
    const galleryImgs = document.querySelectorAll(".gallery-container img, .gallery-item img");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    if (!galleryImgs.length || !lightbox || !lightboxImg) return;
    const closeBtn = lightbox.querySelector(".close");

    galleryImgs.forEach((img) => {
      img.style.cursor = "pointer";
      img.addEventListener("click", () => {
        lightboxImg.src = img.currentSrc || img.src;
        lightboxImg.alt = img.alt || "";
        lightbox.classList.add("show");
        lightbox.setAttribute("aria-hidden", "false");
        if (hasGSAP && !prefersReduced) {
          gsap.fromTo(lightboxImg, { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" });
        }
      });
    });

    function closeLB() {
      lightbox.classList.remove("show");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImg.src = "";
    }
    closeBtn && closeBtn.addEventListener("click", closeLB);
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLB(); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLB(); });
  }

  /* ---------------- Animated counters (trigger once, when visible) ---------------- */
  function initCounters() {
    const counters = document.querySelectorAll(".counter");
    if (!counters.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const counter = entry.target;
        const target = Number(counter.dataset.target) || 0;
        let count = 0;
        const step = Math.max(1, Math.round(target / 60));
        const timer = setInterval(() => {
          count += step;
          if (count >= target) {
            counter.textContent = target + "+";
            clearInterval(timer);
          } else {
            counter.textContent = count;
          }
        }, 25);
        io.unobserve(counter);
      });
    }, { threshold: 0.4 });
    counters.forEach((c) => io.observe(c));
  }

  /* ---------------- Back to top ---------------- */
  function initTopButton() {
    const topBtn = document.getElementById("topBtn");
    if (!topBtn) return;
    window.addEventListener("scroll", () => {
      topBtn.style.display = window.scrollY > 420 ? "block" : "none";
    }, { passive: true });
    topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------------- Cursor glow (pointer devices only) ---------------- */
  function initCursorGlow() {
    const glow = document.querySelector(".cursor-glow");
    if (!glow || !window.matchMedia("(hover:hover)").matches) return;
    document.addEventListener("mousemove", (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    });
  }

  /* ---------------- Booking form (AJAX) ---------------- */
  function initBookingForm() {
    const bookingForm = document.getElementById("bookingForm");
    if (!bookingForm) return;
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!bookingForm.checkValidity()) {
  bookingForm.reportValidity();
  return;
}
      const data = {
        fullName: bookingForm.fullName.value.trim(),
        email: bookingForm.email.value.trim(),
        roomType:bookingForm.roomType.value,
        dateFrom: bookingForm.dateFrom.value,
        dateTo: bookingForm.dateTo.value,
        specialRequests: bookingForm.specialRequests.value.trim(),
         
      };
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerText : "Book Now";
      if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = "Sending..."; 
        }

      try {
        const API_BASE = window.API_BASE_URL || "";
        const res = await fetch(API_BASE + "/api/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (res.ok && result.success) {
          alert("Booking received — thank you! We will contact you shortly.");
          bookingForm.reset();
        } else {
          const msg = (result && result.errors && result.errors.map((e) => e.msg).join(", ")) || (result && result.error) || "Booking failed";
          alert("Error: " + msg);
        }
      } catch (err) {
        console.error(err);
        alert("Network error — please try again later.");
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = originalText; }
      }
    });
  }

  /* ---------------- Ambient particles ---------------- */
  function initParticles() {
    const container = document.getElementById("particles");
    if (!container || prefersReduced) return;
    const count = window.innerWidth <= 600 ? 25 : 60;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      const size = 2 + Math.random() * 4;
      particle.style.width = size + "px";
      particle.style.height = size + "px";
      particle.style.animationDuration = (8 + Math.random() * 10) + "s";
      particle.style.animationDelay = (-Math.random() * 12) + "s";
      particle.style.setProperty("--drift", (-50 + Math.random() * 100) + "px");
      frag.appendChild(particle);
    }
    container.appendChild(frag);
  }

  /* ---------------- GSAP hero intro ---------------- */
  function initHeroMotion() {
    if (!hasGSAP || prefersReduced) return;
    gsap.from(".hero-content > *", { y: 18, opacity: 0, stagger: 0.08, duration: 0.7, ease: "power2.out", delay: 0.3 });
    gsap.utils.toArray(".service-card, .preview-card").forEach((c, i) => {
      gsap.from(c, { y: 18, opacity: 0, delay: 0.1 + i * 0.06, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: c, start: "top 90%" } });
    });
  }

  /* ---------------- Init everything ---------------- */
  function initAll() {
    initLoader();
    initReveal();
    initProgressBar();
    initParallax();
    initNavbarScroll();
    initHamburger();
    initLightbox();
    initCounters();
    initTopButton();
    initCursorGlow();
    initBookingForm();
    initParticles();
    initHeroMotion();
  }

  document.addEventListener("DOMContentLoaded", initAll);
})();
