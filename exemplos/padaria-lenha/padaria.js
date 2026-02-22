const navToggle = document.querySelector(".pd-nav-toggle");
const nav = document.querySelector(".pd-nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const yearEl = document.getElementById("pdYear");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const revealEls = document.querySelectorAll(".pd-reveal");
if (revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  revealEls.forEach((el) => io.observe(el));
}
