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
    products: "recati_padaria_products_v2",
    extras: "recati_padaria_extras_v2",
    comandas: "recati_padaria_comandas_v2",
    payments: "recati_padaria_payments_v2",
    config: "recati_padaria_config_v2",
    selected: "recati_padaria_selected_v2",
  };

  const seedProducts = [
    { id: crypto.randomUUID(), nome: "Pão francês", preco: 1.2, estoque: 150, categoria: "Padaria" },
    { id: crypto.randomUUID(), nome: "Cuca de uva", preco: 21.9, estoque: 12, categoria: "Doces" },
    { id: crypto.randomUUID(), nome: "Café coado", preco: 4.5, estoque: 80, categoria: "Bebidas" },
    { id: crypto.randomUUID(), nome: "Salgado assado", preco: 8.9, estoque: 40, categoria: "Lanches" },
  ];

  const seedExtras = [
    { id: crypto.randomUUID(), nome: "Queijo extra", preco: 2.5, ativo: true },
    { id: crypto.randomUUID(), nome: "Borda recheada", preco: 4.0, ativo: true },
  ];

  const seedComandas = [
    {
      id: crypto.randomUUID(),
      codigo: "C-101",
      mesa: "Balcão",
      status: "ABERTO",
      criadoEm: new Date().toISOString(),
      itens: [],
      total: 0,
    },
    {
      id: crypto.randomUUID(),
      codigo: "C-202",
      mesa: "Mesa 4",
      status: "EM_PREPARO",
      criadoEm: new Date(Date.now() - 3600000).toISOString(),
      itens: [{ nome: "Cuca de uva", qtd: 1, preco: 21.9 }],
      total: 21.9,
    },
  ];

  const menu = document.getElementById("menu");
  const content = document.getElementById("content");
  const views = [
    ["comandas", "Comandas"],
    ["pagamentos", "Pagamentos"],
    ["produtos", "Produtos e Serviços"],
    ["opcoes", "Opções"],
  ];

  const state = {
    view: "comandas",
    products: JSON.parse(localStorage.getItem(KEYS.products) || "null") || seedProducts,
    extras: JSON.parse(localStorage.getItem(KEYS.extras) || "null") || seedExtras,
    comandas: JSON.parse(localStorage.getItem(KEYS.comandas) || "null") || seedComandas,
    payments: JSON.parse(localStorage.getItem(KEYS.payments) || "[]"),
    config: JSON.parse(localStorage.getItem(KEYS.config) || "null") || {
      empresa: "PadariaERP Desktop",
      subtitulo: "Caixa, Pagamento e Fechamento",
      pix: "padaria@erp.local",
      temaEscuro: false,
    },
    selectedId: localStorage.getItem(KEYS.selected) || "",
  };

  function money(value) {
    return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function persist() {
    localStorage.setItem(KEYS.products, JSON.stringify(state.products));
    localStorage.setItem(KEYS.extras, JSON.stringify(state.extras));
    localStorage.setItem(KEYS.comandas, JSON.stringify(state.comandas));
    localStorage.setItem(KEYS.payments, JSON.stringify(state.payments));
    localStorage.setItem(KEYS.config, JSON.stringify(state.config));
    localStorage.setItem(KEYS.selected, state.selectedId || "");
  }

  function getSelectedComanda() {
    return state.comandas.find((comanda) => comanda.id === state.selectedId) || null;
  }

  function recalcComanda(comanda) {
    comanda.total = comanda.itens.reduce((acc, item) => acc + item.preco * item.qtd, 0);
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

  function renderComandas() {
    const selected = getSelectedComanda();

    content.innerHTML = `
      <h2>Códigos de Comanda</h2>
      <form id="novaComandaForm" class="panel">
        <div class="grid-2">
          <label>Código
            <input name="codigo" required placeholder="Ex.: C-303" />
          </label>
          <label>Mesa/Identificação
            <input name="mesa" required placeholder="Ex.: Mesa 8 ou Balcão" />
          </label>
        </div>
        <button class="action-btn" type="submit">Cadastrar comanda</button>
      </form>

      <div class="panel" style="margin-top:10px;">
        <strong>Comandas</strong>
        <table>
          <thead><tr><th>Código</th><th>Mesa</th><th>Status</th><th>Total</th><th>Ações</th></tr></thead>
          <tbody id="comandasRows"></tbody>
        </table>
      </div>

      <div class="panel" style="margin-top:10px;">
        <strong>Comanda Selecionada</strong>
        <div id="selectedBox" class="small" style="margin-top:6px;"></div>
      </div>
    `;

    const form = document.getElementById("novaComandaForm");
    const rows = document.getElementById("comandasRows");
    const selectedBox = document.getElementById("selectedBox");

    function drawRows() {
      rows.innerHTML = state.comandas
        .map((comanda) => {
          const isSelected = comanda.id === state.selectedId;
          return `
            <tr>
              <td>${comanda.codigo}</td>
              <td>${comanda.mesa}</td>
              <td><span class="status-chip">${comanda.status}</span></td>
              <td>${money(comanda.total)}</td>
              <td>
                <button class="mini-btn" data-act="select" data-id="${comanda.id}">${isSelected ? "Selecionada" : "Selecionar"}</button>
                <button class="mini-btn" data-act="status" data-id="${comanda.id}">Mudar status</button>
                <button class="mini-btn" data-act="del" data-id="${comanda.id}">Excluir</button>
              </td>
            </tr>
          `;
        })
        .join("");

      rows.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
          const comanda = state.comandas.find((item) => item.id === button.dataset.id);
          if (!comanda) return;

          if (button.dataset.act === "select") {
            state.selectedId = comanda.id;
            persist();
            drawRows();
            drawSelected();
            return;
          }

          if (button.dataset.act === "status") {
            const statuses = ["ABERTO", "EM_PREPARO", "PRONTO", "ENTREGUE", "CANCELADO"];
            const nextStatus = prompt(`Status atual: ${comanda.status}\nNovo status: ${statuses.join(", ")}`, comanda.status);
            if (nextStatus && statuses.includes(nextStatus)) {
              comanda.status = nextStatus;
              persist();
              drawRows();
              drawSelected();
            }
            return;
          }

          state.comandas = state.comandas.filter((item) => item.id !== comanda.id);
          if (state.selectedId === comanda.id) state.selectedId = "";
          persist();
          drawRows();
          drawSelected();
        });
      });
    }

    function drawSelected() {
      const current = getSelectedComanda();
      if (!current) {
        selectedBox.innerHTML = "Selecione uma comanda para adicionar itens e seguir para pagamentos.";
        return;
      }

      selectedBox.innerHTML = `
        <div class="grid-2">
          <div>
            <div><strong>${current.codigo}</strong> - ${current.mesa}</div>
            <div>Status: ${current.status}</div>
            <div>Total: <strong>${money(current.total)}</strong></div>
          </div>
          <form id="itemForm" class="inline-form">
            <label>Item
              <select name="produto" required>
                <option value="">Selecione</option>
                ${state.products.map((p) => `<option value="${p.id}">${p.nome} (${money(p.preco)})</option>`).join("")}
              </select>
            </label>
            <label>Qtd
              <input name="qtd" type="number" min="1" value="1" required />
            </label>
            <button class="action-btn" type="submit">Adicionar item</button>
          </form>
        </div>
        <table style="margin-top:8px;">
          <thead><tr><th>Item</th><th>Qtd</th><th>Valor</th><th></th></tr></thead>
          <tbody>
            ${current.itens.length
              ? current.itens
                  .map(
                    (item, index) => `
                    <tr>
                      <td>${item.nome}</td>
                      <td>${item.qtd}</td>
                      <td>${money(item.preco * item.qtd)}</td>
                      <td><button class="mini-btn" data-rm="${index}">Remover</button></td>
                    </tr>
                  `
                  )
                  .join("")
              : `<tr><td colspan="4" class="small">Sem itens.</td></tr>`}
          </tbody>
        </table>
      `;

      const itemForm = document.getElementById("itemForm");
      itemForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(itemForm);
        const product = state.products.find((item) => item.id === data.get("produto"));
        if (!product) return;
        const qtd = Number(data.get("qtd"));
        current.itens.push({ nome: product.nome, qtd, preco: Number(product.preco) });
        recalcComanda(current);
        persist();
        drawRows();
        drawSelected();
      });

      selectedBox.querySelectorAll("button[data-rm]").forEach((button) => {
        button.addEventListener("click", () => {
          const index = Number(button.dataset.rm);
          current.itens.splice(index, 1);
          recalcComanda(current);
          persist();
          drawRows();
          drawSelected();
        });
      });
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const comanda = {
        id: crypto.randomUUID(),
        codigo: String(data.get("codigo") || "").trim(),
        mesa: String(data.get("mesa") || "").trim(),
        status: "ABERTO",
        criadoEm: new Date().toISOString(),
        itens: [],
        total: 0,
      };
      state.comandas.unshift(comanda);
      state.selectedId = comanda.id;
      persist();
      form.reset();
      drawRows();
      drawSelected();
    });

    if (!selected && state.comandas.length) {
      state.selectedId = state.comandas[0].id;
      persist();
    }

    drawRows();
    drawSelected();
  }

  function renderPagamentos() {
    const selected = getSelectedComanda();
    const totais = state.payments.reduce(
      (acc, payment) => {
        acc.total += payment.valor;
        const dayKey = new Date(payment.data).toISOString().slice(0, 10);
        const todayKey = new Date().toISOString().slice(0, 10);
        if (dayKey === todayKey) acc.hoje += payment.valor;
        return acc;
      },
      { total: 0, hoje: 0 }
    );

    content.innerHTML = `
      <h2>Pagamento Manual</h2>
      <div class="grid-2">
        <form id="paymentForm" class="panel">
          <label>Comanda
            <select name="comanda" required>
              <option value="">Selecione</option>
              ${state.comandas.map((comanda) => `<option value="${comanda.id}" ${selected && comanda.id === selected.id ? "selected" : ""}>${comanda.codigo} - ${comanda.mesa}</option>`).join("")}
            </select>
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
          <button class="action-btn" type="submit">Registrar pagamento</button>
          <p class="small" style="margin-top:8px;">PIX da empresa: <strong>${state.config.pix}</strong></p>
        </form>

        <div class="panel">
          <strong>Fechamento de caixa</strong>
          <p class="small">Total recebido hoje: <strong>${money(totais.hoje)}</strong></p>
          <p class="small">Total geral recebido: <strong>${money(totais.total)}</strong></p>
          <p class="small">Pagamentos registrados: <strong>${state.payments.length}</strong></p>
        </div>
      </div>

      <div class="panel" style="margin-top:10px;">
        <strong>Pagamentos da comanda</strong>
        <table>
          <thead><tr><th>Data</th><th>Comanda</th><th>Método</th><th>Valor</th></tr></thead>
          <tbody>
            ${state.payments.length
              ? state.payments
                  .slice()
                  .reverse()
                  .map((payment) => {
                    const comanda = state.comandas.find((item) => item.id === payment.comandaId);
                    return `<tr><td>${new Date(payment.data).toLocaleString("pt-BR")}</td><td>${comanda ? comanda.codigo : "-"}</td><td>${payment.metodo}</td><td>${money(payment.valor)}</td></tr>`;
                  })
                  .join("")
              : `<tr><td colspan="4" class="small">Sem pagamentos registrados.</td></tr>`}
          </tbody>
        </table>
      </div>
    `;

    const paymentForm = document.getElementById("paymentForm");
    paymentForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(paymentForm);
      const comanda = state.comandas.find((item) => item.id === data.get("comanda"));
      if (!comanda) return;

      const valor = Number(data.get("valor") || 0);
      state.payments.push({
        id: crypto.randomUUID(),
        comandaId: comanda.id,
        metodo: String(data.get("metodo") || "DINHEIRO"),
        valor,
        data: new Date().toISOString(),
      });

      const totalPago = state.payments
        .filter((payment) => payment.comandaId === comanda.id)
        .reduce((acc, payment) => acc + payment.valor, 0);

      if (totalPago >= comanda.total && comanda.total > 0) {
        comanda.status = "ENTREGUE";
      }

      persist();
      renderPagamentos();
    });
  }

  function renderProdutos() {
    content.innerHTML = `
      <h2>Produtos e Serviços</h2>
      <div class="grid-2">
        <form id="productForm" class="panel">
          <label>Nome
            <input name="nome" required />
          </label>
          <label>Categoria
            <input name="categoria" required placeholder="Padaria, Bebidas, etc." />
          </label>
          <div class="grid-2">
            <label>Preço
              <input name="preco" type="number" min="0.01" step="0.01" required />
            </label>
            <label>Estoque
              <input name="estoque" type="number" min="0" required />
            </label>
          </div>
          <button class="action-btn" type="submit">Adicionar produto</button>
        </form>

        <form id="extraForm" class="panel">
          <label>Adicional
            <input name="nome" required placeholder="Ex.: Embalagem premium" />
          </label>
          <label>Preço
            <input name="preco" type="number" min="0.01" step="0.01" required />
          </label>
          <button class="action-btn" type="submit">Adicionar adicional</button>
          <ul id="extrasList" style="margin-top:10px;"></ul>
        </form>
      </div>

      <div class="panel" style="margin-top:10px;">
        <table>
          <thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Ações</th></tr></thead>
          <tbody id="productRows"></tbody>
        </table>
      </div>
    `;

    const productForm = document.getElementById("productForm");
    const extraForm = document.getElementById("extraForm");
    const productRows = document.getElementById("productRows");
    const extrasList = document.getElementById("extrasList");

    function drawProducts() {
      productRows.innerHTML = state.products
        .map(
          (product) => `
          <tr>
            <td>${product.nome}</td>
            <td>${product.categoria}</td>
            <td>${money(product.preco)}</td>
            <td>${product.estoque}</td>
            <td>
              <button class="mini-btn" data-act="edit" data-id="${product.id}">Editar</button>
              <button class="mini-btn" data-act="del" data-id="${product.id}">Remover</button>
            </td>
          </tr>
        `
        )
        .join("");

      productRows.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
          const product = state.products.find((item) => item.id === button.dataset.id);
          if (!product) return;
          if (button.dataset.act === "del") {
            state.products = state.products.filter((item) => item.id !== product.id);
          } else {
            const nome = prompt("Nome", product.nome) || product.nome;
            const categoria = prompt("Categoria", product.categoria) || product.categoria;
            const preco = Number(prompt("Preço", String(product.preco)) || product.preco);
            const estoque = Number(prompt("Estoque", String(product.estoque)) || product.estoque);
            Object.assign(product, { nome, categoria, preco, estoque });
          }
          persist();
          drawProducts();
        });
      });
    }

    function drawExtras() {
      extrasList.innerHTML = state.extras
        .map(
          (extra) => `<li>${extra.nome} - ${money(extra.preco)} <button class="mini-btn" data-extra="${extra.id}">Excluir</button></li>`
        )
        .join("");

      extrasList.querySelectorAll("button[data-extra]").forEach((button) => {
        button.addEventListener("click", () => {
          state.extras = state.extras.filter((extra) => extra.id !== button.dataset.extra);
          persist();
          drawExtras();
        });
      });
    }

    productForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(productForm);
      state.products.push({
        id: crypto.randomUUID(),
        nome: String(data.get("nome") || "").trim(),
        categoria: String(data.get("categoria") || "").trim(),
        preco: Number(data.get("preco") || 0),
        estoque: Number(data.get("estoque") || 0),
      });
      persist();
      productForm.reset();
      drawProducts();
    });

    extraForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(extraForm);
      state.extras.push({
        id: crypto.randomUUID(),
        nome: String(data.get("nome") || "").trim(),
        preco: Number(data.get("preco") || 0),
        ativo: true,
      });
      persist();
      extraForm.reset();
      drawExtras();
    });

    drawProducts();
    drawExtras();
  }

  function renderOpcoes() {
    content.innerHTML = `
      <h2>Parâmetros customizáveis</h2>
      <form id="configForm" class="panel">
        <label>Nome da empresa
          <input name="empresa" value="${state.config.empresa}" required />
        </label>
        <label>Subtítulo
          <input name="subtitulo" value="${state.config.subtitulo}" required />
        </label>
        <label>PIX
          <input name="pix" value="${state.config.pix}" required />
        </label>
        <label class="small" style="display:flex;gap:8px;align-items:center;">
          <input type="checkbox" name="temaEscuro" ${state.config.temaEscuro ? "checked" : ""} style="width:auto;margin:0;" />
          Simular tema escuro na operação
        </label>
        <button class="action-btn" type="submit">Salvar configurações</button>
      </form>
      <div class="panel" style="margin-top:10px;">
        <p class="small">Essas opções simulam o painel de configuração do ERP original e ficam salvas localmente no navegador.</p>
      </div>
    `;

    const configForm = document.getElementById("configForm");
    configForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(configForm);
      state.config = {
        empresa: String(data.get("empresa") || "").trim(),
        subtitulo: String(data.get("subtitulo") || "").trim(),
        pix: String(data.get("pix") || "").trim(),
        temaEscuro: data.get("temaEscuro") === "on",
      };
      persist();
      alert("Configurações salvas.");
    });
  }

  function render() {
    renderMenu();
    if (state.view === "comandas") renderComandas();
    if (state.view === "pagamentos") renderPagamentos();
    if (state.view === "produtos") renderProdutos();
    if (state.view === "opcoes") renderOpcoes();
  }

  persist();
  render();
})();
