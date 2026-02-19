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
    tables: "recati_demo_rest_tables",
    orders: "recati_demo_rest_orders",
    delivery: "recati_demo_rest_delivery",
  };

  const seedTables = Array.from({ length: 8 }).map((_, i) => ({ id: String(i + 1), status: "livre" }));

  const menu = document.getElementById("menu");
  const content = document.getElementById("content");
  const views = [["mesas", "Mesas"], ["pedidos", "Pedidos"], ["cozinha", "Cozinha"], ["delivery", "Delivery"]];

  let state = {
    view: "mesas",
    tables: JSON.parse(localStorage.getItem(KEYS.tables) || "null") || seedTables,
    orders: JSON.parse(localStorage.getItem(KEYS.orders) || "[]"),
    delivery: JSON.parse(localStorage.getItem(KEYS.delivery) || "[]"),
  };

  function persist() {
    localStorage.setItem(KEYS.tables, JSON.stringify(state.tables));
    localStorage.setItem(KEYS.orders, JSON.stringify(state.orders));
    localStorage.setItem(KEYS.delivery, JSON.stringify(state.delivery));
  }

  function renderMenu() {
    menu.innerHTML = views.map(([id, label]) => `<button class="${state.view===id?'active':''}" data-view="${id}">${label}</button>`).join("");
    menu.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { state.view = b.dataset.view; render(); }));
  }

  function renderMesas() {
    content.innerHTML = `
      <h2>Mesas</h2>
      <div class="grid-2" id="tablesGrid"></div>
      <form id="tableOrderForm" class="panel" style="margin-top:10px;">
        <label>Mesa
          <select name="mesa">${state.tables.map((t)=>`<option value="${t.id}">Mesa ${t.id}</option>`).join("")}</select>
        </label>
        <label>Pedido<input name="item" required placeholder="Ex: X-Burger + Suco" /></label>
        <button class="btn" type="submit">Adicionar pedido à mesa</button>
      </form>
    `;

    const grid = document.getElementById("tablesGrid");
    grid.innerHTML = state.tables.map((t) => `
      <div class="panel">
        <strong>Mesa ${t.id}</strong>
        <p class="small">Status: ${t.status}</p>
        <button class="btn ghost" data-id="${t.id}">${t.status === 'livre' ? 'Abrir mesa' : 'Fechar mesa'}</button>
      </div>
    `).join("");

    grid.querySelectorAll("button[data-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const table = state.tables.find((t) => t.id === btn.dataset.id);
        if (!table) return;
        table.status = table.status === "livre" ? "ocupada" : "livre";
        persist();
        renderMesas();
      });
    });

    const form = document.getElementById("tableOrderForm");
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);
      const mesa = String(fd.get("mesa"));
      const item = String(fd.get("item"));
      state.orders.push({ id: crypto.randomUUID(), mesa, item, status: "recebido", createdAt: new Date().toISOString() });
      const table = state.tables.find((t) => t.id === mesa);
      if (table) table.status = "ocupada";
      persist();
      form.reset();
      renderMesas();
    });
  }

  function renderPedidos() {
    content.innerHTML = `
      <h2>Pedidos</h2>
      <div class="panel">
        <table>
          <thead><tr><th>Mesa</th><th>Item</th><th>Status</th></tr></thead>
          <tbody>${state.orders.map((o)=>`<tr><td>${o.mesa}</td><td>${o.item}</td><td>${o.status}</td></tr>`).join("") || "<tr><td colspan='3'>Sem pedidos.</td></tr>"}</tbody>
        </table>
      </div>
    `;
  }

  function renderCozinha() {
    content.innerHTML = `
      <h2>Cozinha</h2>
      <div class="panel" id="kitchenList"></div>
    `;

    const list = document.getElementById("kitchenList");
    list.innerHTML = state.orders.length
      ? state.orders.map((o) => `
        <div class="panel" style="margin-bottom:8px;">
          <strong>Mesa ${o.mesa}</strong> - ${o.item}
          <p class="small">Status atual: ${o.status}</p>
          <select data-id="${o.id}">
            <option ${o.status==='recebido'?'selected':''}>recebido</option>
            <option ${o.status==='preparo'?'selected':''}>preparo</option>
            <option ${o.status==='pronto'?'selected':''}>pronto</option>
          </select>
        </div>
      `).join("")
      : "<p class='small'>Sem pedidos na cozinha.</p>";

    list.querySelectorAll("select[data-id]").forEach((sel) => {
      sel.addEventListener("change", () => {
        const order = state.orders.find((o) => o.id === sel.dataset.id);
        if (!order) return;
        order.status = sel.value;
        persist();
      });
    });
  }

  function renderDelivery() {
    content.innerHTML = `
      <h2>Delivery</h2>
      <form id="deliveryForm" class="panel">
        <label>Cliente<input name="cliente" required /></label>
        <label>Endereço<input name="endereco" required /></label>
        <label>Pedido<input name="pedido" required /></label>
        <button class="btn" type="submit">Adicionar delivery</button>
      </form>
      <div class="panel" style="margin-top:10px;">
        <ul id="deliveryList"></ul>
      </div>
    `;

    const form = document.getElementById("deliveryForm");
    const ul = document.getElementById("deliveryList");

    function draw() {
      ul.innerHTML = state.delivery.map((d) => `<li>${d.cliente} - ${d.pedido} (${d.status})</li>`).join("") || "<li>Sem entregas no momento.</li>";
    }

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);
      state.delivery.push({
        id: crypto.randomUUID(),
        cliente: fd.get("cliente"),
        endereco: fd.get("endereco"),
        pedido: fd.get("pedido"),
        status: "em rota",
      });
      persist();
      form.reset();
      draw();
    });

    draw();
  }

  function render() {
    renderMenu();
    if (state.view === "mesas") renderMesas();
    if (state.view === "pedidos") renderPedidos();
    if (state.view === "cozinha") renderCozinha();
    if (state.view === "delivery") renderDelivery();
  }

  persist();
  render();
})();


