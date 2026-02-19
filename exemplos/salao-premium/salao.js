const WHATSAPP_NUMBER = "5551997950492";
const DEFAULT_SERVICE = "Atendimento personalizado";

function buildWhatsAppLink(service = DEFAULT_SERVICE, dayHour = "a combinar") {
  const normalizedService = service && service.trim() ? service.trim() : DEFAULT_SERVICE;
  const normalizedDayHour = dayHour && dayHour.trim() ? dayHour.trim() : "a combinar";
  const message = `Olá! Quero agendar um horário no Salão Premium. Serviço: ${normalizedService}. Dia/Hora: ${normalizedDayHour}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function initHeaderNav() {
  const toggle = document.querySelector(".sp-nav-toggle");
  const nav = document.querySelector(".sp-nav");

  if (!toggle || !nav) return;

  const closeNav = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(event.target) || toggle.contains(event.target)) return;
    closeNav();
  });
}

function initHeroSlider() {
  const slides = Array.from(document.querySelectorAll(".sp-hero-slide"));
  const dotsWrap = document.querySelector(".sp-hero-dots");
  if (!slides.length || !dotsWrap) return;

  let index = 0;
  let intervalId = null;

  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.className = "sp-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir para slide ${i + 1}`);
    dot.addEventListener("click", () => {
      goTo(i);
      restart();
    });
    dotsWrap.appendChild(dot);
    return dot;
  });

  const goTo = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
  };

  const start = () => {
    if (intervalId) clearInterval(intervalId);
    intervalId = window.setInterval(() => {
      goTo(index + 1);
    }, 5600);
  };

  const restart = () => {
    if (intervalId) clearInterval(intervalId);
    start();
  };

  goTo(0);
  start();

  const hero = document.querySelector(".sp-hero");
  if (hero) {
    hero.addEventListener("mouseenter", () => {
      if (intervalId) clearInterval(intervalId);
    });
    hero.addEventListener("mouseleave", start);
  }
}

function initReveal() {
  const elements = document.querySelectorAll(".sp-reveal");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  elements.forEach((element) => observer.observe(element));
}

function updateWaLink(anchor) {
  if (!anchor) return;

  const service = anchor.dataset.service || DEFAULT_SERVICE;
  const dayInputId = anchor.dataset.dayInput;
  const serviceInputId = anchor.dataset.serviceInput;

  let dayHour = anchor.dataset.dayHour || "a combinar";

  if (dayInputId) {
    const dayInput = document.getElementById(dayInputId);
    if (dayInput && dayInput.value) {
      dayHour = dayInput.value;
    }
  }

  if (serviceInputId) {
    const serviceInput = document.getElementById(serviceInputId);
    if (serviceInput && serviceInput.value) {
      anchor.dataset.service = serviceInput.value;
    }
  }

  anchor.href = buildWhatsAppLink(anchor.dataset.service || service, dayHour);
}

function initWaLinks() {
  const links = document.querySelectorAll(".js-wa-link");
  if (!links.length) return;

  links.forEach((link) => {
    updateWaLink(link);

    link.addEventListener("click", () => {
      updateWaLink(link);
    });

    const dayInputId = link.dataset.dayInput;
    const serviceInputId = link.dataset.serviceInput;

    if (dayInputId) {
      const dayInput = document.getElementById(dayInputId);
      dayInput?.addEventListener("change", () => updateWaLink(link));
      dayInput?.addEventListener("input", () => updateWaLink(link));
    }

    if (serviceInputId) {
      const serviceInput = document.getElementById(serviceInputId);
      serviceInput?.addEventListener("change", () => updateWaLink(link));
      serviceInput?.addEventListener("input", () => updateWaLink(link));
    }
  });
}

function initGallery() {
  const lightbox = document.getElementById("spLightbox");
  const lightboxImg = lightbox?.querySelector("img");
  const closeButton = lightbox?.querySelector("button");
  const galleryButtons = document.querySelectorAll("[data-gallery-open]");

  if (lightbox && lightboxImg && galleryButtons.length) {
    galleryButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const src = button.getAttribute("data-gallery-src");
        const alt = button.getAttribute("data-gallery-alt") || "Produção do salão";
        if (!src) return;

        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.classList.add("is-open");
        document.body.style.overflow = "hidden";
      });
    });

    const close = () => {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    closeButton?.addEventListener("click", close);

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        close();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
        close();
      }
    });
  }

  const loadButton = document.getElementById("loadMoreGallery");
  if (!loadButton) return;

  loadButton.addEventListener("click", () => {
    const hiddenItems = Array.from(document.querySelectorAll(".sp-gallery-item.sp-hidden"));
    hiddenItems.slice(0, 4).forEach((item) => item.classList.remove("sp-hidden"));

    if (document.querySelectorAll(".sp-gallery-item.sp-hidden").length === 0) {
      loadButton.disabled = true;
      loadButton.textContent = "Todas as produções carregadas";
    }
  });
}

function initBlogFilters() {
  const filterButtons = document.querySelectorAll("[data-post-filter]");
  const posts = document.querySelectorAll("[data-post-tags]");
  if (!filterButtons.length || !posts.length) return;

  const applyFilter = (filter) => {
    posts.forEach((post) => {
      const tags = (post.getAttribute("data-post-tags") || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const visible = filter === "todos" || tags.includes(filter);
      post.classList.toggle("sp-hidden", !visible);
    });

    filterButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.postFilter === filter);
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.postFilter || "todos"));
  });
}

function showToast(text, type = "success") {
  const toast = document.getElementById("formToast");
  if (!toast) return;

  toast.textContent = text;
  toast.classList.remove("is-success", "is-error");
  toast.classList.add("is-show", type === "success" ? "is-success" : "is-error");

  window.setTimeout(() => {
    toast.classList.remove("is-show", "is-success", "is-error");
  }, 3200);
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      showToast("Preencha os campos obrigatórios para enviar.", "error");
      return;
    }

    const formData = new FormData(form);
    const name = (formData.get("name") || "").toString();
    const service = (formData.get("service") || DEFAULT_SERVICE).toString();
    const datetime = (formData.get("datetime") || "a combinar").toString();

    showToast(`Perfeito, ${name}! Recebemos seu pedido para ${service} (${datetime}).`);
    form.reset();

    const waButton = document.getElementById("waFromForm");
    if (waButton instanceof HTMLAnchorElement) {
      waButton.dataset.service = service;
      waButton.dataset.dayHour = datetime;
      updateWaLink(waButton);
    }
  });
}

function fillCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initHeaderNav();
  initHeroSlider();
  initReveal();
  initWaLinks();
  initGallery();
  initBlogFilters();
  initContactForm();
  fillCurrentYear();
});
