const navToggle = document.querySelector(".mk-nav-toggle");
const nav = document.querySelector(".mk-nav");

function closeNav() {
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
      if ((link.getAttribute("href") || "").startsWith("#")) closeNav();
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(target) || navToggle.contains(target)) return;
    closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });
}

const yearRef = document.getElementById("mkYear");
if (yearRef) yearRef.textContent = String(new Date().getFullYear());

const revealNodes = document.querySelectorAll(".mk-reveal");
if (revealNodes.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        entry.target.querySelectorAll(".mk-bar em[data-fill]").forEach((bar, index) => {
          const fill = Number(bar.getAttribute("data-fill") || "0");
          bar.style.setProperty("--mkFill", `${Math.max(0, Math.min(100, fill))}%`);
          window.setTimeout(() => bar.classList.add("is-on"), index * 120);
        });

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));
}

const counterRoot = document.querySelector("[data-counter]");
if (counterRoot) {
  const counters = counterRoot.querySelectorAll("[data-count]");

  const runCounter = () => {
    counters.forEach((counter) => {
      const target = Number(counter.getAttribute("data-count") || "0");
      const duration = 900;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = String(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    });
  };

  runCounter();
}

document.querySelectorAll(".mk-quote-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const service = button.getAttribute("data-quote") || "Servico";
    const select = document.getElementById("qServico");
    if (select) select.value = service;

    const section = document.getElementById("orcamentos");
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const quoteForm = document.querySelector("[data-quote-form]");
if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(quoteForm);

    const nome = String(data.get("nome") || "").trim();
    const carro = String(data.get("carro") || "").trim();
    const servico = String(data.get("servico") || "").trim();
    const sintomas = String(data.get("sintomas") || "").trim();

    const message =
      "Ola! Quero um orcamento na MECA Torque.\n\n" +
      `Nome: ${nome || "Nao informado"}\n` +
      `Carro: ${carro || "Nao informado"}\n` +
      `Servico: ${servico || "Nao informado"}\n` +
      `Sintomas: ${sintomas || "Nao informado"}\n\n` +
      "Podem me enviar opcoes de pecas e prazo?";

    const url = `https://wa.me/5551997950492?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

const leadForm = document.getElementById("mkLeadForm");
if (leadForm) {
  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = String((document.getElementById("mkNome") || {}).value || "").trim();
    const telefone = String((document.getElementById("mkTelefone") || {}).value || "").trim();
    const servico = String((document.getElementById("mkServico") || {}).value || "").trim();

    const message =
      "Ola! Quero agendar um atendimento na MECA Torque.\n\n" +
      `Nome: ${nome || "Nao informado"}\n` +
      `Telefone: ${telefone || "Nao informado"}\n` +
      `Servico: ${servico || "Nao informado"}\n\n` +
      "Podem me enviar os horarios disponiveis?";

    const url = `https://wa.me/5551997950492?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
}
