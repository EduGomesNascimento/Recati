const SB_WHATSAPP = "5551997950492";

function sbBuildWhatsApp(service = "Atendimento", schedule = "a combinar") {
  const finalService = service && String(service).trim() ? String(service).trim() : "Atendimento";
  const finalSchedule = schedule && String(schedule).trim() ? String(schedule).trim() : "a combinar";
  const text = `Olá! Quero agendar um horário no Salão Essencial. Serviço: ${finalService}. Dia/Hora: ${finalSchedule}`;
  return `https://wa.me/${SB_WHATSAPP}?text=${encodeURIComponent(text)}`;
}

function initMobileMenu() {
  const toggle = document.querySelector(".sb-menu-toggle");
  const nav = document.querySelector(".sb-nav");
  if (!toggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(event.target) || toggle.contains(event.target)) return;
    closeMenu();
  });
}

function initHeroSlider() {
  const slides = Array.from(document.querySelectorAll(".sb-hero-slide"));
  const dotsWrap = document.querySelector(".sb-hero-dots");

  if (!slides.length || !dotsWrap) return;

  let current = 0;
  let intervalId = null;

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "sb-dot";
    dot.setAttribute("aria-label", `Ir para slide ${index + 1}`);
    dot.addEventListener("click", () => {
      goTo(index);
      restart();
    });
    dotsWrap.appendChild(dot);
    return dot;
  });

  const goTo = (next) => {
    current = (next + slides.length) % slides.length;
    slides.forEach((slide, index) => slide.classList.toggle("is-active", index === current));
    dots.forEach((dot, index) => dot.classList.toggle("is-active", index === current));
  };

  const start = () => {
    intervalId = window.setInterval(() => {
      goTo(current + 1);
    }, 5600);
  };

  const stop = () => {
    if (!intervalId) return;
    clearInterval(intervalId);
    intervalId = null;
  };

  const restart = () => {
    stop();
    start();
  };

  goTo(0);
  start();

  const hero = document.querySelector(".sb-hero");
  if (!hero) return;

  hero.addEventListener("mouseenter", stop);
  hero.addEventListener("mouseleave", start);
}

function initReveal() {
  const items = document.querySelectorAll(".sb-reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  items.forEach((item) => observer.observe(item));
}

function initWaLinks() {
  document.querySelectorAll(".js-sb-wa").forEach((anchor) => {
    const baseService = anchor.dataset.service || "Atendimento";
    anchor.href = sbBuildWhatsApp(baseService);

    anchor.addEventListener("click", () => {
      const scheduleInputId = anchor.dataset.scheduleInput;
      const serviceInputId = anchor.dataset.serviceInput;

      let schedule = "a combinar";
      let finalService = baseService;

      if (serviceInputId) {
        const serviceInput = document.getElementById(serviceInputId);
        if (serviceInput && serviceInput.value) finalService = serviceInput.value;
      }

      if (scheduleInputId) {
        const scheduleInput = document.getElementById(scheduleInputId);
        if (scheduleInput && scheduleInput.value) schedule = scheduleInput.value;
      }

      anchor.href = sbBuildWhatsApp(finalService, schedule);
    });
  });
}

function initContactForm() {
  const form = document.getElementById("sbContactForm");
  const toast = document.getElementById("sbToast");
  if (!form || !toast) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      toast.textContent = "Preencha os campos obrigatórios.";
      toast.classList.add("is-show");
      setTimeout(() => toast.classList.remove("is-show"), 2600);
      return;
    }

    const nameInput = form.elements.namedItem("nome");
    const name = nameInput && "value" in nameInput ? nameInput.value : "";

    toast.textContent = `Mensagem enviada, ${name}! Retornaremos em breve.`;
    toast.classList.add("is-show");
    setTimeout(() => toast.classList.remove("is-show"), 3200);

    form.reset();
  });
}

function fillCurrentYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll("[data-current-year]").forEach((item) => {
    item.textContent = year;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initHeroSlider();
  initReveal();
  initWaLinks();
  initContactForm();
  fillCurrentYear();
});

