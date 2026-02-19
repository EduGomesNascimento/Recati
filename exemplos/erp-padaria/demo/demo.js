(() => {
  const fsToggle = document.getElementById("fsToggle");
  const shell = document.querySelector(".demo-shell");
  if (fsToggle && shell) {
    fsToggle.addEventListener("click", () => {
      shell.classList.toggle("fullscreen");
      fsToggle.textContent = shell.classList.contains("fullscreen") ? "Sair tela cheia" : "Tela cheia";
    });
  }
  const KEYS = {
    products: "recati_demo_padaria_products",
    sales: "recati_demo_padaria_sales",
    clients: "recati_demo_padaria_clients",
  };

  const seedProducts = [
    { id: "p1", nome: "Pão francês", preco: 1.2, estoque: 120 },
    { id: "p2", nome: "Cuca", preco: 18.0, estoque: 12 },
  ];

  const menu = document.getElementById("menu");
  const content = document.getElementById("content");

  const views = [
    ["dashboard", "Dashboard"],
    ["produtos", "Produtos"],
    ["caixa", "Caixa/Vendas"],
    ["clientes", "Clientes"],
    ["relatorios", "Relatórios"],
  ];

  let state = {
    view: "dashboard",
    products: JSON.parse(localStorage.getItem(KEYS.products) || "null") || seedProducts,
    sales: JSON.parse(localStorage.getItem(KEYS.sales) || "[]"),
    clients: JSON.parse(localStorage.getItem(KEYS.clients) || "[]"),
    cart: [],
  };

  function persist() {
    localStorage.setItem(KEYS.products, JSON.stringify(state.products));
    localStorage.setItem(KEYS.sales, JSON.stringify(state.sales));
    localStorage.setItem(KEYS.clients, JSON.stringify(state.clients));
  }

  function setView(v) { state.view = v; render(); }

  function renderMenu() {
    menu.innerHTML = views
      .map(([id, label]) => `<button class="${state.view === id ? "active" : ""}" data-view="${id}">${label}</button>`)
      .join("");
    menu.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));
  }

  function money(n) { return Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }

  function totals() {
    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = dayStart - now.getDay() * 86400000;
    let day = 0;
    let week = 0;
    state.sales.forEach((s) => {
      const t = new Date(s.createdAt).getTime();
      if (t >= dayStart) day += s.total;
      if (t >= weekStart) week += s.total;
    });
    return { day, week };
  }

  function renderDashboard() {
    const t = totals();
    content.innerHTML = `
      <h2>Dashboard</h2>
      <div class="grid-2">
        <div class="panel"><strong>Produtos</strong><p>${state.products.length}</p></div>
        <div class="panel"><strong>Clientes</strong><p>${state.clients.length}</p></div>
        <div class="panel"><strong>Vendas hoje</strong><p>${money(t.day)}</p></div>
        <div class="panel"><strong>Vendas semana</strong><p>${money(t.week)}</p></div>
      </div>
    `;
  }

  function renderProdutos() {
    content.innerHTML = `
      <h2>Produtos</h2>
      <form id="productForm" class="panel">
        <label>Nome<input name="nome" required /></label>
        <div class="grid-2">
          <label>Preço<input name="preco" type="number" step="0.01" required /></label>
          <label>Estoque<input name="estoque" type="number" required /></label>
        </div>
        <button class="btn" type="submit">Adicionar produto</button>
      </form>
      <div class="panel" style="margin-top:10px;">
        <table>
          <thead><tr><th>Nome</th><th>Preço</th><th>Estoque</th><th>Ações</th></tr></thead>
          <tbody id="productRows"></tbody>
        </table>
      </div>
    `;

    const form = document.getElementById("productForm");
    const rows = document.getElementById("productRows");

    function drawRows() {
      rows.innerHTML = state.products.map((p) => `
        <tr>
          <td>${p.nome}</td>
          <td>${money(p.preco)}</td>
          <td>${p.estoque}</td>
          <td>
            <button class="btn ghost" data-act="edit" data-id="${p.id}">Editar</button>
            <button class="btn ghost" data-act="del" data-id="${p.id}">Remover</button>
          </td>
        </tr>
      `).join("");

      rows.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", () => {
          const p = state.products.find((x) => x.id === btn.dataset.id);
          if (!p) return;
          if (btn.dataset.act === "del") {
            state.products = state.products.filter((x) => x.id !== p.id);
          } else {
            const nome = prompt("Nome", p.nome) || p.nome;
            const preco = Number(prompt("Preço", String(p.preco)) || p.preco);
            const estoque = Number(prompt("Estoque", String(p.estoque)) || p.estoque);
            Object.assign(p, { nome, preco, estoque });
          }
          persist();
          drawRows();
        });
      });
    }

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);
      state.products.push({
        id: crypto.randomUUID(),
        nome: String(fd.get("nome")),
        preco: Number(fd.get("preco")),
        estoque: Number(fd.get("estoque")),
      });
      persist();
      form.reset();
      drawRows();
    });

    drawRows();
  }

  function renderCaixa() {
    content.innerHTML = `
      <h2>Caixa/Vendas</h2>
      <form id="addCartForm" class="panel">
        <div class="grid-2">
          <label>Produto
            <select name="produto" required>
              <option value="">Selecione</option>
              ${state.products.map((p) => `<option value="${p.id}">${p.nome} (${money(p.preco)})</option>`).join("")}
            </select>
          </label>
          <label>Quantidade<input name="qtd" type="number" value="1" min="1" required /></label>
        </div>
        <button class="btn" type="submit">Adicionar ao carrinho</button>
      </form>
      <div class="panel" style="margin-top:10px;" id="cartPanel"></div>
    `;

    const form = document.getElementById("addCartForm");
    const cartPanel = document.getElementById("cartPanel");

    function drawCart() {
      const total = state.cart.reduce((a, i) => a + i.preco * i.qtd, 0);
      cartPanel.innerHTML = `
        <table>
          <thead><tr><th>Item</th><th>Qtd</th><th>Preço</th></tr></thead>
          <tbody>${state.cart.map((i) => `<tr><td>${i.nome}</td><td>${i.qtd}</td><td>${money(i.preco * i.qtd)}</td></tr>`).join("")}</tbody>
        </table>
        <p><strong>Total: ${money(total)}</strong></p>
        <button id="finalizeSale" class="btn" ${state.cart.length ? "" : "disabled"}>Finalizar venda</button>
      `;

      const finalize = document.getElementById("finalizeSale");
      if (finalize) {
        finalize.addEventListener("click", () => {
          if (!state.cart.length) return;
          state.sales.push({
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            total,
            items: state.cart,
          });
          state.cart = [];
          persist();
          drawCart();
        });
      }
    }

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);
      const prod = state.products.find((p) => p.id === fd.get("produto"));
      if (!prod) return;
      const qtd = Number(fd.get("qtd"));
      state.cart.push({ id: prod.id, nome: prod.nome, preco: prod.preco, qtd });
      drawCart();
    });

    drawCart();
  }

  function renderClientes() {
    content.innerHTML = `
      <h2>Clientes</h2>
      <form id="clientForm" class="panel">
        <label>Nome<input name="nome" required /></label>
        <label>Telefone<input name="telefone" required /></label>
        <button class="btn" type="submit">Adicionar cliente</button>
      </form>
      <div class="panel" style="margin-top:10px;" id="clientList"></div>
    `;

    const form = document.getElementById("clientForm");
    const list = document.getElementById("clientList");

    function draw() {
      list.innerHTML = state.clients.length
        ? `<ul>${state.clients.map((c) => `<li>${c.nome} - ${c.telefone}</li>`).join("")}</ul>`
        : `<p class="small">Nenhum cliente cadastrado.</p>`;
    }

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);
      state.clients.push({ id: crypto.randomUUID(), nome: fd.get("nome"), telefone: fd.get("telefone") });
      persist();
      form.reset();
      draw();
    });

    draw();
  }

  function renderRelatorios() {
    const t = totals();
    content.innerHTML = `
      <h2>Relatórios</h2>
      <div class="grid-2">
        <div class="panel"><strong>Total do dia</strong><p>${money(t.day)}</p></div>
        <div class="panel"><strong>Total da semana</strong><p>${money(t.week)}</p></div>
      </div>
      <div class="panel" style="margin-top:10px;">
        <strong>Últimas vendas</strong>
        <ul>${state.sales.slice(-5).reverse().map((s) => `<li>${new Date(s.createdAt).toLocaleString('pt-BR')} - ${money(s.total)}</li>`).join("") || "<li>Nenhuma venda ainda.</li>"}</ul>
      </div>
    `;
  }

  function render() {
    renderMenu();
    if (state.view === "dashboard") renderDashboard();
    if (state.view === "produtos") renderProdutos();
    if (state.view === "caixa") renderCaixa();
    if (state.view === "clientes") renderClientes();
    if (state.view === "relatorios") renderRelatorios();
  }

  persist();
  render();
})();


