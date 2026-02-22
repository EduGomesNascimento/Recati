const navToggle = document.querySelector(".mk-nav-toggle");
const nav = document.querySelector(".mk-nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const yearRef = document.getElementById("mkYear");
if (yearRef) {
  yearRef.textContent = String(new Date().getFullYear());
}

const revealNodes = document.querySelectorAll(".mk-reveal");
if (revealNodes.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealNodes.forEach((node) => io.observe(node));
}
