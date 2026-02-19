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
    mesas: "recati_rest_mesas_v2",
    pedidos: "recati_rest_pedidos_v2",
    pagamentos: "recati_rest_pagamentos_v2",
    delivery: "recati_rest_delivery_v2",
    selectedMesa: "recati_rest_selected_mesa_v2",
  };

  const seedMesas = Array.from({ length: 10 }).map((_, index) => ({
    id: String(index + 1),
    status: index < 3 ? "OCUPADA" : "LIVRE",
  }));

  const seedPedidos = [
    {
      id: crypto.randomUUID(),
      mesa: "1",
      item: "Picanha + Fritas",
      observacao: "Sem cebola",
      status: "PREPARO",
      tipo: "MESA",
      valor: 78,
      criadoEm: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      mesa: "2",
      item: "Buffet kg",
      observacao: "",
      status: "RECEBIDO",
      tipo: "MESA",
      valor: 49.9,
      criadoEm: new Date(Date.now() - 2000000).toISOString(),
    },
  ];

  const menu = document.getElementById("menu");
  const content = document.getElementById("content");
  const views = [
    ["comandas", "Comandas / Mesas"],
    ["cozinha", "Cozinha"],
    ["pagamentos", "Pagamentos"],
    ["delivery", "Delivery"],
  ];

  const state = {
    view: "comandas",
    mesas: JSON.parse(localStorage.getItem(KEYS.mesas) || "null") || seedMesas,
    pedidos: JSON.parse(localStorage.getItem(KEYS.pedidos) || "null") || seedPedidos,
    pagamentos: JSON.parse(localStorage.getItem(KEYS.pagamentos) || "[]"),
    delivery: JSON.parse(localStorage.getItem(KEYS.delivery) || "[]"),
    selectedMesa: localStorage.getItem(KEYS.selectedMesa) || "1",
  };

  function money(value) {
    return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function persist() {
    localStorage.setItem(KEYS.mesas, JSON.stringify(state.mesas));
    localStorage.setItem(KEYS.pedidos, JSON.stringify(state.pedidos));
    localStorage.setItem(KEYS.pagamentos, JSON.stringify(state.pagamentos));
    localStorage.setItem(KEYS.delivery, JSON.stringify(state.delivery));
    localStorage.setItem(KEYS.selectedMesa, state.selectedMesa || "");
  }

  function renderMenu() {
    menu.innerHTML = views
      .map(([id, label]) => `<button class="${state.view === id ? "active" : ""}" data-view="${id}">${label}</button>`)
      .join("");

    menu.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        state.view = button.dataset.view;
        render();
      });
    });
  }

  function getMesaPedidos(mesaId) {
    return state.pedidos.filter((pedido) => pedido.mesa === mesaId && pedido.tipo === "MESA");
  }

  function renderComandas() {
    content.innerHTML = `
      <h2>Comandas e mesas</h2>
      <div class="panel">
        <div id="mesasGrid" class="grid-2"></div>
      </div>

      <div class="panel" style="margin-top:10px;">
        <strong>Mesa selecionada</strong>
        <div id="mesaBox" style="margin-top:8px;"></div>
      </div>
    `;

    const mesasGrid = document.getElementById("mesasGrid");
    const mesaBox = document.getElementById("mesaBox");

    function drawMesas() {
      mesasGrid.innerHTML = state.mesas
        .map((mesa) => {
          const totalMesa = getMesaPedidos(mesa.id).reduce((acc, pedido) => acc + pedido.valor, 0);
          const active = mesa.id === state.selectedMesa;
          return `
            <article class="panel">
              <strong>Mesa ${mesa.id}</strong>
              <p class="small">Status: <span class="status-chip">${mesa.status}</span></p>
              <p class="small">Total parcial: ${money(totalMesa)}</p>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <button class="mini-btn" data-act="select" data-id="${mesa.id}">${active ? "Selecionada" : "Selecionar"}</button>
                <button class="mini-btn" data-act="toggle" data-id="${mesa.id}">${mesa.status === "LIVRE" ? "Abrir" : "Fechar"}</button>
              </div>
            </article>
          `;
        })
        .join("");

      mesasGrid.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
          const mesa = state.mesas.find((item) => item.id === button.dataset.id);
          if (!mesa) return;

          if (button.dataset.act === "select") {
            state.selectedMesa = mesa.id;
          } else {
            mesa.status = mesa.status === "LIVRE" ? "OCUPADA" : "LIVRE";
          }

          persist();
          drawMesas();
          drawMesaBox();
        });
      });
    }

    function drawMesaBox() {
      const mesa = state.mesas.find((item) => item.id === state.selectedMesa);
      if (!mesa) {
        mesaBox.innerHTML = `<p class="small">Selecione uma mesa.</p>`;
        return;
      }

      const pedidosMesa = getMesaPedidos(mesa.id);
      mesaBox.innerHTML = `
        <div class="grid-2">
          <div>
            <h3>Mesa ${mesa.id}</h3>
            <p class="small">Status atual: ${mesa.status}</p>
          </div>
          <form id="pedidoMesaForm" class="inline-form">
            <label>Pedido
              <input name="item" required placeholder="Ex.: Maminha + Polenta" />
            </label>
            <label>Valor
              <input name="valor" type="number" min="0.01" step="0.01" required />
            </label>
            <button class="action-btn" type="submit">Adicionar pedido</button>
          </form>
        </div>

        <table style="margin-top:8px;">
          <thead><tr><th>Item</th><th>Status</th><th>Valor</th><th></th></tr></thead>
          <tbody>
            ${pedidosMesa.length
              ? pedidosMesa
                  .map(
                    (pedido) => `
                    <tr>
                      <td>${pedido.item}</td>
                      <td>${pedido.status}</td>
                      <td>${money(pedido.valor)}</td>
                      <td><button class="mini-btn" data-rm="${pedido.id}">Remover</button></td>
                    </tr>
                  `
                  )
                  .join("")
              : `<tr><td colspan="4" class="small">Sem pedidos nesta mesa.</td></tr>`}
          </tbody>
        </table>
      `;

      const pedidoMesaForm = document.getElementById("pedidoMesaForm");
      pedidoMesaForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(pedidoMesaForm);
        state.pedidos.push({
          id: crypto.randomUUID(),
          mesa: mesa.id,
          item: String(data.get("item") || "").trim(),
          observacao: "",
          status: "RECEBIDO",
          tipo: "MESA",
          valor: Number(data.get("valor") || 0),
          criadoEm: new Date().toISOString(),
        });
        mesa.status = "OCUPADA";
        persist();
        drawMesas();
        drawMesaBox();
      });

      mesaBox.querySelectorAll("button[data-rm]").forEach((button) => {
        button.addEventListener("click", () => {
          state.pedidos = state.pedidos.filter((pedido) => pedido.id !== button.dataset.rm);
          persist();
          drawMesas();
          drawMesaBox();
        });
      });
    }

    drawMesas();
    drawMesaBox();
  }

  function renderCozinha() {
    const pedidosCozinha = state.pedidos.filter((pedido) => pedido.tipo === "MESA" || pedido.tipo === "DELIVERY");

    content.innerHTML = `
      <h2>Cozinha</h2>
      <div class="panel" id="cozinhaList"></div>
    `;

    const cozinhaList = document.getElementById("cozinhaList");
    cozinhaList.innerHTML = pedidosCozinha.length
      ? pedidosCozinha
          .map(
            (pedido) => `
            <div class="panel" style="margin-bottom:8px;">
              <strong>${pedido.tipo === "DELIVERY" ? "Delivery" : `Mesa ${pedido.mesa}`}</strong>
              <p class="small">${pedido.item}</p>
              <p class="small">${pedido.observacao || "Sem observação"}</p>
              <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
                <span class="status-chip">${pedido.status}</span>
                <select data-status="${pedido.id}">
                  <option ${pedido.status === "RECEBIDO" ? "selected" : ""}>RECEBIDO</option>
                  <option ${pedido.status === "PREPARO" ? "selected" : ""}>PREPARO</option>
                  <option ${pedido.status === "PRONTO" ? "selected" : ""}>PRONTO</option>
                  <option ${pedido.status === "ENTREGUE" ? "selected" : ""}>ENTREGUE</option>
                </select>
              </div>
            </div>
          `
          )
          .join("")
      : `<p class="small">Sem pedidos em produção.</p>`;

    cozinhaList.querySelectorAll("select[data-status]").forEach((select) => {
      select.addEventListener("change", () => {
        const pedido = state.pedidos.find((item) => item.id === select.dataset.status);
        if (!pedido) return;
        pedido.status = select.value;
        persist();
      });
    });
  }

  function renderPagamentos() {
    const mesaOptions = state.mesas.map((mesa) => `<option value="${mesa.id}">Mesa ${mesa.id}</option>`).join("");
    const totais = state.pagamentos.reduce((acc, payment) => acc + payment.valor, 0);

    content.innerHTML = `
      <h2>Pagamentos</h2>
      <div class="grid-2">
        <form id="pagamentoForm" class="panel">
          <label>Mesa
            <select name="mesa" required>${mesaOptions}</select>
          </label>
          <label>Método
            <select name="metodo" required>
              <option>DINHEIRO</option>
              <option>PIX</option>
              <option>CARTAO_DEBITO</option>
              <option>CARTAO_CREDITO</option>
            </select>
          </label>
          <label>Valor
            <input name="valor" type="number" min="0.01" step="0.01" required />
          </label>
          <button class="action-btn" type="submit">Registrar</button>
        </form>

        <div class="panel">
          <strong>Resumo</strong>
          <p class="small">Total em pagamentos: <strong>${money(totais)}</strong></p>
          <p class="small">Registros: <strong>${state.pagamentos.length}</strong></p>
        </div>
      </div>

      <div class="panel" style="margin-top:10px;">
        <table>
          <thead><tr><th>Data</th><th>Mesa</th><th>Método</th><th>Valor</th></tr></thead>
          <tbody>
            ${state.pagamentos.length
              ? state.pagamentos
                  .slice()
                  .reverse()
                  .map(
                    (payment) => `<tr><td>${new Date(payment.data).toLocaleString("pt-BR")}</td><td>Mesa ${payment.mesa}</td><td>${payment.metodo}</td><td>${money(payment.valor)}</td></tr>`
                  )
                  .join("")
              : `<tr><td colspan="4" class="small">Sem pagamentos.</td></tr>`}
          </tbody>
        </table>
      </div>
    `;

    const pagamentoForm = document.getElementById("pagamentoForm");
    pagamentoForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(pagamentoForm);
      state.pagamentos.push({
        id: crypto.randomUUID(),
        mesa: String(data.get("mesa") || ""),
        metodo: String(data.get("metodo") || "DINHEIRO"),
        valor: Number(data.get("valor") || 0),
        data: new Date().toISOString(),
      });
      persist();
      renderPagamentos();
    });
  }

  function renderDelivery() {
    content.innerHTML = `
      <h2>Delivery</h2>
      <form id="deliveryForm" class="panel">
        <div class="grid-2">
          <label>Cliente
            <input name="cliente" required />
          </label>
          <label>Telefone
            <input name="telefone" required />
          </label>
        </div>
        <label>Endereço
          <input name="endereco" required />
        </label>
        <div class="grid-2">
          <label>Pedido
            <input name="pedido" required placeholder="Ex.: Alcatra + Arroz" />
          </label>
          <label>Valor
            <input name="valor" type="number" min="0.01" step="0.01" required />
          </label>
        </div>
        <button class="action-btn" type="submit">Adicionar delivery</button>
      </form>

      <div class="panel" style="margin-top:10px;" id="deliveryList"></div>
    `;

    const deliveryForm = document.getElementById("deliveryForm");
    const deliveryList = document.getElementById("deliveryList");

    function drawDelivery() {
      deliveryList.innerHTML = state.delivery.length
        ? state.delivery
            .map(
              (item) => `
                <article class="panel" style="margin-bottom:8px;">
                  <strong>${item.cliente}</strong>
                  <p class="small">${item.pedido} - ${money(item.valor)}</p>
                  <p class="small">${item.endereco}</p>
                  <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
                    <span class="status-chip">${item.status}</span>
                    <select data-delivery="${item.id}">
                      <option ${item.status === "RECEBIDO" ? "selected" : ""}>RECEBIDO</option>
                      <option ${item.status === "EM_ROTA" ? "selected" : ""}>EM_ROTA</option>
                      <option ${item.status === "ENTREGUE" ? "selected" : ""}>ENTREGUE</option>
                    </select>
                  </div>
                </article>
              `
            )
            .join("")
        : `<p class="small">Sem entregas ativas.</p>`;

      deliveryList.querySelectorAll("select[data-delivery]").forEach((select) => {
        select.addEventListener("change", () => {
          const delivery = state.delivery.find((item) => item.id === select.dataset.delivery);
          if (!delivery) return;
          delivery.status = select.value;
          persist();
        });
      });
    }

    deliveryForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(deliveryForm);
      const pedido = {
        id: crypto.randomUUID(),
        cliente: String(data.get("cliente") || "").trim(),
        telefone: String(data.get("telefone") || "").trim(),
        endereco: String(data.get("endereco") || "").trim(),
        pedido: String(data.get("pedido") || "").trim(),
        valor: Number(data.get("valor") || 0),
        status: "RECEBIDO",
      };
      state.delivery.unshift(pedido);

      state.pedidos.unshift({
        id: crypto.randomUUID(),
        mesa: "DELIVERY",
        item: pedido.pedido,
        observacao: `Cliente: ${pedido.cliente}`,
        status: "RECEBIDO",
        tipo: "DELIVERY",
        valor: pedido.valor,
        criadoEm: new Date().toISOString(),
      });

      persist();
      deliveryForm.reset();
      drawDelivery();
    });

    drawDelivery();
  }

  function render() {
    renderMenu();
    if (state.view === "comandas") renderComandas();
    if (state.view === "cozinha") renderCozinha();
    if (state.view === "pagamentos") renderPagamentos();
    if (state.view === "delivery") renderDelivery();
  }

  persist();
  render();
})();
