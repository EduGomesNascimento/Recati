const navToggle = document.querySelector(".pd-nav-toggle");
const nav = document.querySelector(".pd-nav");

function closeMenu() {
  if (!nav || !navToggle) return;
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if ((link.getAttribute("href") || "").startsWith("#")) closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(target) || navToggle.contains(target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const yearRef = document.getElementById("pdYear");
if (yearRef) yearRef.textContent = String(new Date().getFullYear());

const revealNodes = document.querySelectorAll(".pd-reveal");
if (revealNodes.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));
}

const sectionLinks = Array.from(document.querySelectorAll(".pd-nav > a"))
  .filter((link) => (link.getAttribute("href") || "").startsWith("#"));

const trackedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function setActiveNav(hash) {
  sectionLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === hash);
  });
}

if (window.location.hash) setActiveNav(window.location.hash);

if (trackedSections.length) {
  const activeObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      setActiveNav(`#${visible.target.id}`);
    },
    { rootMargin: "-36% 0px -52% 0px", threshold: [0.2, 0.4, 0.65] }
  );

  trackedSections.forEach((section) => activeObserver.observe(section));
}

window.addEventListener("hashchange", () => {
  if (window.location.hash) setActiveNav(window.location.hash);
});

const bars = document.querySelectorAll(".pd-bar em");
const processSection = document.getElementById("processo");

if (bars.length && processSection) {
  const barObserver = new IntersectionObserver(
    (entries, observer) => {
      const [entry] = entries;
      if (!entry || !entry.isIntersecting) return;

      bars.forEach((bar, index) => {
        window.setTimeout(() => {
          bar.classList.add("is-on");
        }, index * 120);
      });

      observer.disconnect();
    },
    { threshold: 0.35 }
  );

  barObserver.observe(processSection);
}

const form = document.querySelector(".pd-form");
if (form) {
  const sendButton = form.querySelector("button[type='button']");

  if (sendButton) {
    sendButton.addEventListener("click", () => {
      const nome = String((document.getElementById("pdNome") || {}).value || "").trim();
      const telefone = String((document.getElementById("pdTelefone") || {}).value || "").trim();
      const tipo = String((document.getElementById("pdTipo") || {}).value || "").trim();
      const obs = String((document.getElementById("pdObs") || {}).value || "").trim();

      const msg =
        "Ola! Quero fazer um pedido na Padaria Lenha Viva.\n\n" +
        `Nome: ${nome || "Nao informado"}\n` +
        `Telefone: ${telefone || "Nao informado"}\n` +
        `Tipo de pedido: ${tipo || "Nao informado"}\n` +
        `Observacoes: ${obs || "Sem observacoes"}`;

      const url = `https://wa.me/5551997950492?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }
}
