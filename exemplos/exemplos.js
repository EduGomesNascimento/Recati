import { templates } from "./data/templates.js";

const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const segmentSelect = document.getElementById("segmentSelect");
const cardsGrid = document.getElementById("cardsGrid");

const unique = (arr) => [...new Set(arr)].sort((a, b) => a.localeCompare(b));

function fillFilters() {
  const categories = unique(templates.map((t) => t.category));
  const segments = unique(templates.map((t) => t.segment));

  categories.forEach((c) => {
    const op = document.createElement("option");
    op.value = c;
    op.textContent = c;
    categorySelect.appendChild(op);
  });

  segments.forEach((s) => {
    const op = document.createElement("option");
    op.value = s;
    op.textContent = s;
    segmentSelect.appendChild(op);
  });
}

function cardHtml(t) {
  const tags = t.tags.join(", ");
  return `
    <article class="card">
      <h2>${t.title}</h2>
      <div class="meta">
        <span class="badge">${t.category}</span>
        <span class="badge">${t.segment}</span>
        <span class="badge">${t.level}</span>
      </div>
      <p>${t.summary}</p>
      <div class="tags">Tags: ${tags}</div>
      <div class="actions">
        <a class="btn ghost" href="./${t.slug}/">Detalhes</a>
        <a class="btn" href="./${t.slug}/demo/">Ver demo</a>
      </div>
    </article>
  `;
}

function render() {
  const q = (searchInput.value || "").trim().toLowerCase();
  const c = categorySelect.value;
  const s = segmentSelect.value;

  const filtered = templates.filter((t) => {
    const matchQ = !q || (`${t.title} ${t.tags.join(" ")}`.toLowerCase().includes(q));
    const matchC = !c || t.category === c;
    const matchS = !s || t.segment === s;
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
