import { templates } from "../data/templates.js";

const slug = "erp-padaria";
const template = templates.find((t) => t.slug === slug);
const hero = document.getElementById("detailHero");
const demoLink = document.getElementById("demoLink");
const baseBtn = document.getElementById("baseBtn");

if (!template) {
  hero.innerHTML = "<h1>Template não encontrado</h1>";
} else {
  hero.innerHTML = `
    <h1>${template.title}</h1>
    <p>${template.summary}</p>
    <div class="meta">
      <span class="badge">${template.category}</span>
      <span class="badge">${template.segment}</span>
      <span class="badge">${template.level}</span>
      <span class="badge">${template.stack}</span>
    </div>
    <ul class="checklist">
      ${template.features.map((f) => `<li>✓ ${f}</li>`).join("")}
    </ul>
  `;
  demoLink.href = `./demo/`;
}

baseBtn.addEventListener("click", () => {
  alert("Em breve vamos gerar sua base personalizada com esse template.");
});
