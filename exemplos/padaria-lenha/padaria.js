const navToggle = document.querySelector(".pd-nav-toggle");
const nav = document.querySelector(".pd-nav");

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

// Ano
const yearRef = document.getElementById("pdYear");
if (yearRef) yearRef.textContent = String(new Date().getFullYear());

// Reveal (IntersectionObserver)
const revealNodes = document.querySelectorAll(".pd-reveal");
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

// Barras de "horários de maior movimento"
function animateBars() {
  document.querySelectorAll(".pd-bar em").forEach((bar) => {
    const w = bar.style.getPropertyValue("--w") || "0%";
    bar.style.setProperty("--w", w);
    // aplica no pseudo via classe (gatilho simples)
    bar.classList.add("pd-bar-on");
  });
}
setTimeout(animateBars, 600);

// Ativar link do header conforme seção visível
const navLinks = Array.from(document.querySelectorAll(".pd-nav > a"))
  .filter((a) => (a.getAttribute("href") || "").startsWith("#"));

const sections = navLinks
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

if (sections.length) {
  const ioActive = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const id = "#" + visible.target.id;
      navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === id));
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: [0.1, 0.2, 0.35] }
  );

  sections.forEach((sec) => ioActive.observe(sec));
}

// CSS helper: anima as barras usando pseudo-element
const style = document.createElement("style");
style.textContent = `
  .pd-bar.pd-bar-on em::after { width: var(--w, 0%); }
`;
document.head.appendChild(style);