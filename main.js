/* ============================================================
   Marwan Shara — site interactions
   - reveal-on-scroll (IntersectionObserver)
   - nav border on scroll
   - hero typing effect
   - current year
   All guarded for prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- current year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- nav border on scroll ---------- */
  const nav = document.querySelector(".nav");
  if (nav) {
    const onScroll = () =>
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- hero typing effect ---------- */
  const typeEl = document.querySelector(".type");
  if (typeEl) {
    let phrases;
    try {
      phrases = JSON.parse(typeEl.dataset.type || "[]");
    } catch (e) {
      phrases = [];
    }

    if (reduceMotion || phrases.length === 0) {
      typeEl.textContent = phrases[0] || "";
    } else {
      let pi = 0; // phrase index
      let ci = 0; // char index
      let deleting = false;

      const tick = () => {
        const phrase = phrases[pi];
        typeEl.textContent = phrase.slice(0, ci);

        if (!deleting && ci < phrase.length) {
          ci++;
          setTimeout(tick, 65);
        } else if (!deleting && ci === phrase.length) {
          deleting = true;
          setTimeout(tick, 1800);
        } else if (deleting && ci > 0) {
          ci--;
          setTimeout(tick, 32);
        } else {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          setTimeout(tick, 350);
        }
      };
      tick();
    }
  }
})();
