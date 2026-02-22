const state = {
  clientes: [],
  produtos: [],
  comandas: [],
  historicoCupons: [],
  comandaDetalhe: null,
  selectedComandaId: null,
};

const el = {
  flash: document.getElementById("flash"),
  clienteForm: document.getElementById("cliente-form"),
  produtoForm: document.getElementById("produto-form"),
  comandaForm: document.getElementById("comanda-form"),
  itemForm: document.getElementById("item-form"),
  resumoForm: document.getElementById("resumo-form"),
  fechamentoForm: document.getElementById("fechamento-form"),
  historicoForm: document.getElementById("historico-form"),
  resumoData: document.getElementById("resumo-data"),
  fechamentoData: document.getElementById("fechamento-data"),
  historicoDataInicial: document.getElementById("historico-data-inicial"),
  historicoDataFinal: document.getElementById("historico-data-final"),
  historicoStatus: document.getElementById("historico-status"),
  historicoSomenteFinalizados: document.getElementById("historico-somente-finalizados"),
  clientesSelect: document.getElementById("pedido-cliente-id"),
  itemProdutoSelect: document.getElementById("item-produto-id"),
  comandaSelect: document.getElementById("comanda-id-select"),
  comandaList: document.getElementById("comanda-list"),
  historicoList: document.getElementById("historico-list"),
  itensBody: document.getElementById("itens-body"),
  refreshComandasBtn: document.getElementById("refresh-comandas"),
  printCupomBtn: document.getElementById("print-cupom-btn"),
  exportCsvBtn: document.getElementById("fc-export-csv-btn"),
  detalheId: document.getElementById("comanda-detalhe-id"),
  detalheStatus: document.getElementById("comanda-detalhe-status"),
  detalheTotal: document.getElementById("comanda-detalhe-total"),
  kpiTotal: document.getElementById("kpi-total"),
  kpiAberto: document.getElementById("kpi-aberto"),
  kpiPreparo: document.getElementById("kpi-em-preparo"),
  kpiPronto: document.getElementById("kpi-pronto"),
  resumoTotal: document.getElementById("resumo-total"),
  resumoStatus: document.getElementById("resumo-status"),
  resumoTop: document.getElementById("resumo-top"),
  fcTotalPedidos: document.getElementById("fc-total-pedidos"),
  fcValidos: document.getElementById("fc-validos"),
  fcCancelados: document.getElementById("fc-cancelados"),
  fcTicketMedio: document.getElementById("fc-ticket-medio"),
  fcTotalVendido: document.getElementById("fc-total-vendido"),
  fcTotalCancelado: document.getElementById("fc-total-cancelado"),
  fcTipoLista: document.getElementById("fc-tipo-lista"),
  statusButtons: document.querySelectorAll(".status-actions button"),
};

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function asMoney(value) {
  return moneyFormatter.format(Number(value || 0));
}

function asTagClass(status) {
  return `status-tag st-${String(status).toLowerCase()}`;
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }
  const dt = new Date(value);
  return dt.toLocaleString("pt-BR");
}

function showFlash(message, isError = false) {
  el.flash.textContent = message;
  el.flash.style.background = isError ? "#8e1717" : "#15693b";
  el.flash.classList.add("show");
  window.clearTimeout(showFlash.timer);
  showFlash.timer = window.setTimeout(() => {
    el.flash.classList.remove("show");
  }, 2600);
}

async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const response = await fetch(path, { ...options, headers });
  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch (_error) {
      payload = { detail: text };
    }
  }

  if (!response.ok) {
    const detail = payload && payload.detail ? payload.detail : `Erro ${response.status}`;
    throw new Error(detail);
  }
  return payload;
}

function setSelectOptions(target, items, labelBuilder, valueBuilder, placeholder) {
  target.innerHTML = "";
  if (placeholder) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = placeholder;
    target.appendChild(option);
  }
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = String(valueBuilder(item));
    option.textContent = labelBuilder(item);
    target.appendChild(option);
  });
}

async function loadClientes() {
  const data = await api("/clientes?page=1&page_size=100");
  state.clientes = data.items || [];
  setSelectOptions(
    el.clientesSelect,
    state.clientes,
    (c) => `${c.id} - ${c.nome}`,
    (c) => c.id,
    "Selecione um cliente"
  );
}

async function loadProdutos() {
  const data = await api("/produtos?page=1&page_size=100");
  state.produtos = data.items || [];
  const ativos = state.produtos.filter((p) => p.ativo);

  setSelectOptions(
    el.itemProdutoSelect,
    ativos,
    (p) => `${p.id} - ${p.nome} (R$ ${asMoney(p.preco)})`,
    (p) => p.id,
    "Selecione um produto"
  );
}

function renderComandasList() {
  el.comandaList.innerHTML = "";
  const sorted = [...state.comandas].sort((a, b) => b.id - a.id);

  sorted.forEach((pedido) => {
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "comanda-pill";
    if (state.selectedComandaId === pedido.id) {
      pill.classList.add("active");
    }
    pill.innerHTML = `
      <strong>#${pedido.id}</strong> - Cliente ${pedido.cliente_id}<br>
      <span class="${asTagClass(pedido.status)}">${pedido.status}</span>
      <small> R$ ${asMoney(pedido.total)}</small>
    `;
    pill.addEventListener("click", () => selectComanda(pedido.id));
    el.comandaList.appendChild(pill);
  });
}

function renderKpis() {
  const total = state.comandas.length;
  const byStatus = state.comandas.reduce((acc, pedido) => {
    acc[pedido.status] = (acc[pedido.status] || 0) + 1;
    return acc;
  }, {});

  el.kpiTotal.textContent = String(total);
  el.kpiAberto.textContent = String(byStatus.ABERTO || 0);
  el.kpiPreparo.textContent = String(byStatus.EM_PREPARO || 0);
  el.kpiPronto.textContent = String(byStatus.PRONTO || 0);
}

async function loadComandas() {
  const data = await api("/pedidos?page=1&page_size=100");
  state.comandas = data.items || [];
  setSelectOptions(
    el.comandaSelect,
    state.comandas,
    (p) => `Comanda #${p.id} | ${p.status} | R$ ${asMoney(p.total)}`,
    (p) => p.id,
    "Selecione a comanda"
  );
  renderKpis();
  renderComandasList();

  if (!state.comandas.length) {
    state.selectedComandaId = null;
    renderComandaDetalhe(null);
    return;
  }

  if (!state.selectedComandaId || !state.comandas.some((p) => p.id === state.selectedComandaId)) {
    const first = state.comandas[0];
    await selectComanda(first.id);
    return;
  }

  el.comandaSelect.value = String(state.selectedComandaId);
}

function findProdutoNomeById(produtoId) {
  const produto = state.produtos.find((p) => p.id === produtoId);
  return produto ? produto.nome : `Produto ${produtoId}`;
}

function renderItensTable(items) {
  el.itensBody.innerHTML = "";
  items.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${findProdutoNomeById(item.produto_id)}</td>
      <td>R$ ${asMoney(item.preco_unitario)}</td>
      <td>
        <input class="qty-input" id="qty-${item.id}" type="number" min="1" value="${item.quantidade}">
      </td>
      <td>R$ ${asMoney(item.subtotal)}</td>
      <td class="actions">
        <button type="button" data-action="update-item" data-item-id="${item.id}">Salvar</button>
        <button type="button" data-action="delete-item" data-item-id="${item.id}">Remover</button>
      </td>
    `;
    el.itensBody.appendChild(tr);
  });
}

function renderComandaDetalhe(pedido) {
  if (!pedido) {
    el.detalheId.textContent = "-";
    el.detalheStatus.textContent = "-";
    el.detalheTotal.textContent = "0.00";
    el.printCupomBtn.disabled = true;
    renderItensTable([]);
    return;
  }

  el.detalheId.textContent = `#${pedido.id}`;
  el.detalheStatus.innerHTML = `<span class="${asTagClass(pedido.status)}">${pedido.status}</span>`;
  el.detalheTotal.textContent = asMoney(pedido.total);
  el.printCupomBtn.disabled = false;
  renderItensTable(pedido.itens || []);
}

async function selectComanda(comandaId) {
  if (!comandaId) {
    return;
  }

  state.selectedComandaId = Number(comandaId);
  el.comandaSelect.value = String(state.selectedComandaId);
  const detalhe = await api(`/pedidos/${state.selectedComandaId}`);
  state.comandaDetalhe = detalhe;
  renderComandaDetalhe(detalhe);
  renderComandasList();
}

async function refreshAll() {
  await loadClientes();
  await loadProdutos();
  await loadComandas();
  await loadHistorico();
}

async function handleCreateCliente(event) {
  event.preventDefault();
  const formData = new FormData(el.clienteForm);

  const payload = {
    nome: String(formData.get("nome") || "").trim(),
    telefone: String(formData.get("telefone") || "").trim() || null,
    endereco: String(formData.get("endereco") || "").trim() || null,
  };
  await api("/clientes", { method: "POST", body: JSON.stringify(payload) });
  el.clienteForm.reset();
  await loadClientes();
  showFlash("Cliente cadastrado com sucesso.");
}

async function handleCreateProduto(event) {
  event.preventDefault();
  const formData = new FormData(el.produtoForm);
  const payload = {
    nome: String(formData.get("nome") || "").trim(),
    preco: Number(formData.get("preco")).toFixed(2),
    ativo: true,
    estoque_atual: Number(formData.get("estoque_atual")),
  };
  await api("/produtos", { method: "POST", body: JSON.stringify(payload) });
  el.produtoForm.reset();
  await loadProdutos();
  showFlash("Produto cadastrado com sucesso.");
}

async function handleCreateComanda(event) {
  event.preventDefault();
  const formData = new FormData(el.comandaForm);
  const clienteId = Number(formData.get("cliente_id"));
  if (!clienteId) {
    throw new Error("Selecione um cliente para abrir a comanda.");
  }

  const payload = {
    cliente_id: clienteId,
    tipo_entrega: String(formData.get("tipo_entrega") || "RETIRADA"),
    observacoes: String(formData.get("observacoes") || "").trim() || null,
  };
  const created = await api("/pedidos", { method: "POST", body: JSON.stringify(payload) });
  el.comandaForm.reset();
  await loadComandas();
  await selectComanda(created.id);
  showFlash(`Comanda #${created.id} aberta.`);
}

async function handleAddItem(event) {
  event.preventDefault();
  if (!state.selectedComandaId) {
    throw new Error("Selecione uma comanda antes de adicionar itens.");
  }
  const formData = new FormData(el.itemForm);
  const payload = {
    produto_id: Number(formData.get("produto_id")),
    quantidade: Number(formData.get("quantidade")),
  };
  if (!payload.produto_id || payload.quantidade <= 0) {
    throw new Error("Informe produto e quantidade válida.");
  }

  await api(`/pedidos/${state.selectedComandaId}/itens`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  await loadComandas();
  await selectComanda(state.selectedComandaId);
  el.itemForm.reset();
  showFlash("Item adicionado na comanda.");
}

async function handleStatusChange(status) {
  if (!state.selectedComandaId) {
    throw new Error("Selecione uma comanda.");
  }
  await api(`/pedidos/${state.selectedComandaId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  await loadComandas();
  await selectComanda(state.selectedComandaId);
  showFlash(`Status alterado para ${status}.`);
}

function handlePrintCupom() {
  if (!state.selectedComandaId) {
    throw new Error("Selecione uma comanda para imprimir.");
  }
  window.open(`/pedidos/${state.selectedComandaId}/cupom`, "_blank", "noopener");
}

function handleExportFechamentoCsv() {
  const selectedDate = el.fechamentoData.value;
  if (!selectedDate) {
    throw new Error("Informe a data para exportar o fechamento.");
  }
  window.open(`/relatorios/fechamento-caixa.csv?data=${selectedDate}`, "_blank", "noopener");
}

async function handleItemAction(event) {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const itemId = Number(button.dataset.itemId);
  if (!action || !itemId || !state.selectedComandaId) {
    return;
  }

  if (action === "delete-item") {
    await api(`/pedidos/${state.selectedComandaId}/itens/${itemId}`, { method: "DELETE" });
    await loadComandas();
    await selectComanda(state.selectedComandaId);
    showFlash("Item removido da comanda.");
    return;
  }

  if (action === "update-item") {
    const qtyInput = document.getElementById(`qty-${itemId}`);
    const quantidade = Number(qtyInput ? qtyInput.value : 0);
    if (quantidade <= 0) {
      throw new Error("Quantidade deve ser maior que zero.");
    }

    await api(`/pedidos/${state.selectedComandaId}/itens/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantidade }),
    });
    await loadComandas();
    await selectComanda(state.selectedComandaId);
    showFlash("Quantidade atualizada.");
  }
}

function renderResumo(data) {
  el.resumoTotal.textContent = `R$ ${asMoney(data.total_vendido)}`;

  el.resumoStatus.innerHTML = "";
  Object.keys(data.pedidos_por_status).forEach((status) => {
    const li = document.createElement("li");
    li.textContent = `${status}: ${data.pedidos_por_status[status]}`;
    el.resumoStatus.appendChild(li);
  });

  el.resumoTop.innerHTML = "";
  (data.top_produtos || []).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.nome} | qtd ${item.quantidade} | R$ ${asMoney(item.total)}`;
    el.resumoTop.appendChild(li);
  });
}

async function handleResumo(event) {
  event.preventDefault();
  const selectedDate = el.resumoData.value;
  if (!selectedDate) {
    throw new Error("Informe a data para o resumo.");
  }
  const data = await api(`/relatorios/resumo-dia?data=${selectedDate}`);
  renderResumo(data);
  showFlash("Resumo carregado.");
}

function renderFechamento(data) {
  el.fcTotalPedidos.textContent = String(data.total_pedidos);
  el.fcValidos.textContent = String(data.pedidos_validos);
  el.fcCancelados.textContent = String(data.pedidos_cancelados);
  el.fcTicketMedio.textContent = `R$ ${asMoney(data.ticket_medio)}`;
  el.fcTotalVendido.textContent = `R$ ${asMoney(data.total_vendido)}`;
  el.fcTotalCancelado.textContent = `R$ ${asMoney(data.total_cancelado)}`;

  el.fcTipoLista.innerHTML = "";
  Object.keys(data.pedidos_por_tipo_entrega || {}).forEach((tipo) => {
    const pedidos = data.pedidos_por_tipo_entrega[tipo] || 0;
    const total = data.faturamento_por_tipo_entrega
      ? data.faturamento_por_tipo_entrega[tipo] || 0
      : 0;
    const li = document.createElement("li");
    li.textContent = `${tipo}: ${pedidos} pedidos | R$ ${asMoney(total)}`;
    el.fcTipoLista.appendChild(li);
  });
}

async function handleFechamento(event) {
  event.preventDefault();
  const selectedDate = el.fechamentoData.value;
  if (!selectedDate) {
    throw new Error("Informe a data para o fechamento.");
  }
  const data = await api(`/relatorios/fechamento-caixa?data=${selectedDate}`);
  renderFechamento(data);
  showFlash("Fechamento carregado.");
}

function buildHistoricoQuery() {
  const params = new URLSearchParams();
  const dataInicial = el.historicoDataInicial.value;
  const dataFinal = el.historicoDataFinal.value;
  const status = el.historicoStatus.value;
  const somenteFinalizados = el.historicoSomenteFinalizados.value;

  if (dataInicial) {
    params.set("data_inicial", dataInicial);
  }
  if (dataFinal) {
    params.set("data_final", dataFinal);
  }
  if (status) {
    params.set("status", status);
  }
  params.set("somente_finalizados", String(somenteFinalizados === "true"));
  params.set("limit", "200");
  return params.toString();
}

function renderHistorico(items) {
  el.historicoList.innerHTML = "";
  if (!items.length) {
    const empty = document.createElement("p");
    empty.textContent = "Nenhum cupom encontrado para os filtros selecionados.";
    el.historicoList.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "historico-item";
    div.innerHTML = `
      <div>
        <p><strong>Comanda #${item.pedido_id}</strong> | ${item.cliente_nome}</p>
        <p><span class="${asTagClass(item.status)}">${item.status}</span> | ${item.tipo_entrega}</p>
        <p>${formatDateTime(item.criado_em)} | Total R$ ${asMoney(item.total)}</p>
      </div>
      <div>
        <button type="button" data-action="print-historico" data-pedido-id="${item.pedido_id}">
          Reimprimir Cupom
        </button>
      </div>
    `;
    el.historicoList.appendChild(div);
  });
}

async function loadHistorico() {
  const query = buildHistoricoQuery();
  const data = await api(`/pedidos/historico/cupons?${query}`);
  state.historicoCupons = data || [];
  renderHistorico(state.historicoCupons);
}

async function handleHistorico(event) {
  event.preventDefault();
  await loadHistorico();
  showFlash("Histórico de cupons atualizado.");
}

function handleHistoricoClick(event) {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }
  const action = button.dataset.action;
  if (action !== "print-historico") {
    return;
  }
  const pedidoId = Number(button.dataset.pedidoId);
  if (!pedidoId) {
    throw new Error("Comanda inválida para reimpressão.");
  }
  window.open(`/pedidos/${pedidoId}/cupom`, "_blank", "noopener");
}

function setDefaultDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const localDate = `${year}-${month}-${day}`;
  el.resumoData.value = localDate;
  el.fechamentoData.value = localDate;
  el.historicoDataInicial.value = localDate;
  el.historicoDataFinal.value = localDate;
}

function bindEvents() {
  el.clienteForm.addEventListener("submit", (event) => runAction(() => handleCreateCliente(event)));
  el.produtoForm.addEventListener("submit", (event) => runAction(() => handleCreateProduto(event)));
  el.comandaForm.addEventListener("submit", (event) => runAction(() => handleCreateComanda(event)));
  el.itemForm.addEventListener("submit", (event) => runAction(() => handleAddItem(event)));
  el.resumoForm.addEventListener("submit", (event) => runAction(() => handleResumo(event)));
  el.fechamentoForm.addEventListener("submit", (event) => runAction(() => handleFechamento(event)));
  el.historicoForm.addEventListener("submit", (event) => runAction(() => handleHistorico(event)));

  el.refreshComandasBtn.addEventListener("click", () => runAction(loadComandas));
  el.printCupomBtn.addEventListener("click", () => runAction(() => handlePrintCupom()));
  el.exportCsvBtn.addEventListener("click", () => runAction(() => handleExportFechamentoCsv()));
  el.comandaSelect.addEventListener("change", (event) => {
    const value = Number(event.target.value);
    if (value) {
      runAction(() => selectComanda(value));
    }
  });

  el.statusButtons.forEach((button) => {
    button.addEventListener("click", () => runAction(() => handleStatusChange(button.dataset.status)));
  });

  el.itensBody.addEventListener("click", (event) => runAction(() => handleItemAction(event)));
  el.historicoList.addEventListener("click", (event) => runAction(() => handleHistoricoClick(event)));
}

async function runAction(action) {
  try {
    await action();
  } catch (error) {
    showFlash(error.message || "Erro inesperado.", true);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  setDefaultDate();
  bindEvents();
  await runAction(refreshAll);
  await runAction(() => handleResumo(new Event("submit")));
  await runAction(() => handleFechamento(new Event("submit")));
  await runAction(() => handleHistorico(new Event("submit")));
});
