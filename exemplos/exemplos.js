import { templates } from "./data/templates.js";

const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const segmentSelect = document.getElementById("segmentSelect");
const cardsGrid = document.getElementById("cardsGrid");

const unique = (arr) => [...new Set(arr)].sort((a, b) => a.localeCompare(b));

function fillFilters() {
  const categories = unique(templates.map((t) => t.category));
  const segments = unique(templates.map((t) => t.segment));

  categories.forEach((category) => {
    const op = document.createElement("option");
    op.value = category;
    op.textContent = category;
    categorySelect.appendChild(op);
  });

  segments.forEach((segment) => {
    const op = document.createElement("option");
    op.value = segment;
    op.textContent = segment;
    segmentSelect.appendChild(op);
  });
}

function cardHtml(template) {
  const tags = template.tags.join(", ");
  const detailHref = template.detailPath || `./${template.slug}/`;
  const demoHref = template.demoPath || `./${template.slug}/demo/`;

  return `
    <article class="card">
      <h2>${template.title}</h2>
      <div class="meta">
        <span class="badge">${template.category}</span>
        <span class="badge">${template.segment}</span>
        <span class="badge">${template.level}</span>
      </div>
      <p>${template.summary}</p>
      <div class="tags">Tags: ${tags}</div>
      <div class="actions">
        <a class="btn ghost" href="${detailHref}">Detalhes</a>
        <a class="btn" href="${demoHref}">Ver demo</a>
      </div>
    </article>
  `;
}

function render() {
  const query = (searchInput.value || "").trim().toLowerCase();
  const category = categorySelect.value;
  const segment = segmentSelect.value;

  const filtered = templates.filter((template) => {
    const target = `${template.title} ${template.tags.join(" ")}`.toLowerCase();
    const matchQ = !query || target.includes(query);
    const matchC = !category || template.category === category;
    const matchS = !segment || template.segment === segment;
    return matchQ && matchC && matchS;
  });

  if (!filtered.length) {
    cardsGrid.innerHTML = '<div class="empty">Nenhum template encontrado com esse filtro.</div>';
    return;
  }

  cardsGrid.innerHTML = filtered.map(cardHtml).join("");
}

fillFilters();
render();

[searchInput, categorySelect, segmentSelect].forEach((el) => {
  el.addEventListener("input", render);
  el.addEventListener("change", render);
});
