const DEFAULT_ERP_CONFIG = Object.freeze({
  empresa_nome: "PadariaERP",
  empresa_subtitulo: "Caixa, Pagamento e Fechamento",
  email_rodape: "PadariaERP",
  logo_url: "/static/logo.png",
  cor_primaria: "#d8252e",
  cor_secundaria: "#860f12",
  cor_topo_primaria: "#ce1d24",
  cor_topo_secundaria: "#7f0d11",
  tempo_real_segundos: 5,
  tempo_real_ativo: true,
  permitir_status_pronto: false,
  finalizar_mobile_status: "EM_PREPARO",
  impressao_cozinha_automatica: true,
  mobile_obs_rapidas: [
    "Alergico a gluten",
    "Sem cebola",
    "Sem acucar",
    "Pouco sal",
    "Bem passado",
  ],
  mobile_mais_pedidos: [],
  mobile_motivos_reabertura_entregue: [
    "Erro no status",
    "Pedido nao saiu completo",
    "Cliente solicitou ajuste",
    "Troca de item",
    "Falha na entrega",
  ],
});

const DEFAULT_UI_OPTIONS = Object.freeze({
  theme: "light",
  density: "comfortable",
  fontSize: "normal",
  radius: "normal",
  motion: true,
  contrast: "normal",
  layout: "full",
  showIcons: true,
});

const UI_PRESETS = Object.freeze({
  padrao: { ...DEFAULT_UI_OPTIONS },
  rapido: {
    theme: "dark",
    density: "compact",
    fontSize: "normal",
    radius: "sharp",
    motion: false,
    contrast: "high",
    layout: "full",
    showIcons: false,
  },
  leitura: {
    theme: "light",
    density: "comfortable",
    fontSize: "large",
    radius: "round",
    motion: true,
    contrast: "high",
    layout: "boxed",
    showIcons: true,
  },
  touch: {
    theme: "dark",
    density: "comfortable",
    fontSize: "large",
    radius: "round",
    motion: true,
    contrast: "normal",
    layout: "full",
    showIcons: true,
  },
});

const COLOR_PALETTES = Object.freeze({
  vermelho: {
    cor_primaria: "#d8252e",
    cor_secundaria: "#860f12",
    cor_topo_primaria: "#ce1d24",
    cor_topo_secundaria: "#7f0d11",
  },
  grafite: {
    cor_primaria: "#4b5563",
    cor_secundaria: "#111827",
    cor_topo_primaria: "#374151",
    cor_topo_secundaria: "#0f172a",
  },
  verde: {
    cor_primaria: "#179a58",
    cor_secundaria: "#0e5f35",
    cor_topo_primaria: "#1f8a57",
    cor_topo_secundaria: "#10472f",
  },
  azul: {
    cor_primaria: "#2276d2",
    cor_secundaria: "#13498e",
    cor_topo_primaria: "#2b74c6",
    cor_topo_secundaria: "#17365f",
  },
});

const state = {
  codigos: [],
  comandas: [],
  produtos: [],
  adicionais: [],
  mobileMaisPedidosCustom: [],
  erpConfig: { ...DEFAULT_ERP_CONFIG },
  uiOptions: { ...DEFAULT_UI_OPTIONS },
  selecionada: null,
  pagamentos: [],
  fechamentoData: null,
  faturamentoDataInicial: null,
  faturamentoDataFinal: null,
  theme: "light",
  activeTab: "comandas",
  realtime: {
    enabled: true,
    intervalMs: 5000,
    timerId: null,
    busy: false,
    lastTick: null,
  },
  quickPay: {
    pag: { mode: "total", itemIds: [], comandaId: null, itemsTouched: false },
    maq: { mode: "total", itemIds: [], comandaId: null, itemsTouched: false },
  },
};

const el = {
  appFavicon: document.getElementById("app-favicon"),
  toast: document.getElementById("toast"),
  brandAppName: document.getElementById("brand-app-name"),
  brandAppSubtitle: document.getElementById("brand-app-subtitle"),
  brandFooterLogo: document.getElementById("brand-footer-logo"),
  brandFooterText: document.getElementById("brand-footer-text"),
  tabButtons: document.querySelectorAll(".tab-btn[data-tab]"),
  tabPanels: document.querySelectorAll(".tab-panel[data-tab-panel]"),
  openPanelButtons: document.querySelectorAll("[data-open-panel]"),
  codigoForm: document.getElementById("codigo-form"),
  novoCodigo: document.getElementById("novo-codigo"),
  codigosList: document.getElementById("codigos-list"),
  produtoForm: document.getElementById("produto-form"),
  produtoEditId: document.getElementById("produto-edit-id"),
  produtoNome: document.getElementById("produto-nome"),
  produtoCategoria: document.getElementById("produto-categoria"),
  produtoPreco: document.getElementById("produto-preco"),
  produtoEstoque: document.getElementById("produto-estoque"),
  produtoImagem: document.getElementById("produto-imagem"),
  produtoImagemFile: document.getElementById("produto-imagem-file"),
  produtoImagemPreview: document.getElementById("produto-imagem-preview"),
  produtoDescricao: document.getElementById("produto-descricao"),
  produtoAtivo: document.getElementById("produto-ativo"),
  produtoAdicionaisBox: document.getElementById("produto-adicionais-box"),
  produtoSubmit: document.getElementById("produto-submit"),
  produtoCancelEdit: document.getElementById("produto-cancel-edit"),
  subpanelProdutoForm: document.getElementById("subpanel-produto-form"),
  adicionalForm: document.getElementById("adicional-form"),
  adicionalEditId: document.getElementById("adicional-edit-id"),
  adicionalNome: document.getElementById("adicional-nome"),
  adicionalPreco: document.getElementById("adicional-preco"),
  adicionalAtivo: document.getElementById("adicional-ativo"),
  adicionalSubmit: document.getElementById("adicional-submit"),
  adicionalCancelEdit: document.getElementById("adicional-cancel-edit"),
  adicionaisList: document.getElementById("adicionais-list"),
  subpanelAdicionalForm: document.getElementById("subpanel-adicional-form"),
  produtoBusca: document.getElementById("produto-busca"),
  produtoFiltroAtivo: document.getElementById("produto-filtro-ativo"),
  produtoFiltroCategoria: document.getElementById("produto-filtro-categoria"),
  buscarProdutos: document.getElementById("buscar-produtos"),
  limparProdutos: document.getElementById("limpar-produtos"),
  produtosList: document.getElementById("produtos-list"),
  mobileMaisPedidosForm: document.getElementById("mobile-mais-pedidos-form"),
  mobileMaisPedidoProduto: document.getElementById("mobile-mais-pedido-produto"),
  mobileMaisPedidoNome: document.getElementById("mobile-mais-pedido-nome"),
  mobileMaisPedidosLimpar: document.getElementById("mobile-mais-pedidos-limpar"),
  mobileMaisPedidosList: document.getElementById("mobile-mais-pedidos-list"),
  filtroCodigo: document.getElementById("filtro-codigo"),
  filtroMesa: document.getElementById("filtro-mesa"),
  filtroStatus: document.getElementById("filtro-status"),
  filtroTipoEntrega: document.getElementById("filtro-tipo-entrega"),
  filtroDataInicial: document.getElementById("filtro-data-inicial"),
  filtroDataFinal: document.getElementById("filtro-data-final"),
  filtroTotalMin: document.getElementById("filtro-total-min"),
  filtroTotalMax: document.getElementById("filtro-total-max"),
  filtroOrdemCampo: document.getElementById("filtro-ordem-campo"),
  filtroOrdemDirecao: document.getElementById("filtro-ordem-direcao"),
  buscarComandas: document.getElementById("buscar-comandas"),
  refreshComandas: document.getElementById("refresh-comandas"),
  resetarComandas: document.getElementById("resetar-comandas"),
  tempoRealToggle: document.getElementById("tempo-real-toggle"),
  tempoRealStatus: document.getElementById("tempo-real-status"),
  limparFiltros: document.getElementById("limpar-filtros"),
  comandaResumo: document.getElementById("comanda-resumo"),
  comandasList: document.getElementById("comandas-list"),
  selCodigo: document.getElementById("sel-codigo"),
  selStatus: document.getElementById("sel-status"),
  selComplexidade: document.getElementById("sel-complexidade"),
  selTotalItens: document.getElementById("sel-total-itens"),
  selTotal: document.getElementById("sel-total"),
  selPago: document.getElementById("sel-pago"),
  selSaldo: document.getElementById("sel-saldo"),
  statusButtons: document.querySelectorAll(".status-actions button[data-status]"),
  goPagamento: document.getElementById("go-pagamento"),
  printCupom: document.getElementById("print-cupom"),
  limparComanda: document.getElementById("limpar-comanda"),
  deleteComanda: document.getElementById("delete-comanda"),
  pagamentoForm: document.getElementById("pagamento-form"),
  pagMetodo: document.getElementById("pag-metodo"),
  pagValor: document.getElementById("pag-valor"),
  pixBox: document.getElementById("pix-box"),
  pixChave: document.getElementById("pix-chave"),
  pixCopiaCola: document.getElementById("pix-copia-cola"),
  pixCopy: document.getElementById("pix-copy"),
  quickPayInfoPag: document.getElementById("quick-pay-info-pag"),
  quickPayItemsPag: document.getElementById("quick-pay-items-pag"),
  maqForm: document.getElementById("maq-form"),
  maqMetodo: document.getElementById("maq-metodo"),
  maqValor: document.getElementById("maq-valor"),
  maqId: document.getElementById("maq-id"),
  quickPayInfoMaq: document.getElementById("quick-pay-info-maq"),
  quickPayItemsMaq: document.getElementById("quick-pay-items-maq"),
  quickPayButtons: document.querySelectorAll("[data-quick-pay-target][data-quick-pay-mode]"),
  pagamentosList: document.getElementById("pagamentos-list"),
  pagamentoItensList: document.getElementById("pagamento-itens-list"),
  fechamentoForm: document.getElementById("fechamento-form"),
  fechamentoData: document.getElementById("fechamento-data"),
  exportarCsv: document.getElementById("exportar-csv"),
  exportarCsvPeriodo: document.getElementById("exportar-csv-periodo"),
  exportarRelatorioPeriodo: document.getElementById("exportar-relatorio-periodo"),
  fcTotalPedidos: document.getElementById("fc-total-pedidos"),
  fcTotalVendido: document.getElementById("fc-total-vendido"),
  fcTotalRecebido: document.getElementById("fc-total-recebido"),
  fcTicketMedio: document.getElementById("fc-ticket-medio"),
  fcMetodos: document.getElementById("fc-metodos"),
  faturamentoForm: document.getElementById("faturamento-form"),
  faturamentoDataInicial: document.getElementById("faturamento-data-inicial"),
  faturamentoDataFinal: document.getElementById("faturamento-data-final"),
  ftTotalPedidos: document.getElementById("ft-total-pedidos"),
  ftTotalVendido: document.getElementById("ft-total-vendido"),
  ftTotalRecebido: document.getElementById("ft-total-recebido"),
  ftTicketMedio: document.getElementById("ft-ticket-medio"),
  ftMetodos: document.getElementById("ft-metodos"),
  ftDiasList: document.getElementById("ft-dias-list"),
  optionalProntoButtons: document.querySelectorAll(".optional-pronto"),
  filtroStatusProntoOption: document.querySelector("#filtro-status option[value='PRONTO']"),
  configForm: document.getElementById("config-form"),
  cfgEmpresaNome: document.getElementById("cfg-empresa-nome"),
  cfgEmpresaSubtitulo: document.getElementById("cfg-empresa-subtitulo"),
  cfgEmailRodape: document.getElementById("cfg-email-rodape"),
  cfgLogoUrl: document.getElementById("cfg-logo-url"),
  cfgCorPrimaria: document.getElementById("cfg-cor-primaria"),
  cfgCorSecundaria: document.getElementById("cfg-cor-secundaria"),
  cfgCorTopoPrimaria: document.getElementById("cfg-cor-topo-primaria"),
  cfgCorTopoSecundaria: document.getElementById("cfg-cor-topo-secundaria"),
  cfgTempoRealSegundos: document.getElementById("cfg-tempo-real-segundos"),
  cfgTempoRealAtivo: document.getElementById("cfg-tempo-real-ativo"),
  cfgPermitirStatusPronto: document.getElementById("cfg-permitir-status-pronto"),
  cfgFinalizarMobileStatus: document.getElementById("cfg-finalizar-mobile-status"),
  cfgImpressaoCozinhaAutomatica: document.getElementById("cfg-impressao-cozinha-automatica"),
  cfgMobileObsRapidas: document.getElementById("cfg-mobile-obs-rapidas"),
  cfgMobileMotivosReabertura: document.getElementById("cfg-mobile-motivos-reabertura"),
  cfgReload: document.getElementById("cfg-reload"),
  cfgReset: document.getElementById("cfg-reset"),
  uiOptionsForm: document.getElementById("ui-options-form"),
  uiTheme: document.getElementById("ui-theme"),
  uiDensity: document.getElementById("ui-density"),
  uiFontSize: document.getElementById("ui-font-size"),
  uiRadius: document.getElementById("ui-radius"),
  uiContrast: document.getElementById("ui-contrast"),
  uiLayout: document.getElementById("ui-layout"),
  uiMotion: document.getElementById("ui-motion"),
  uiShowIcons: document.getElementById("ui-show-icons"),
  uiOptionsReset: document.getElementById("ui-options-reset"),
};

const money = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const PRODUTOS_PAGE_SIZE = 500;
const PRODUTOS_MAX_CAIXA = 5000;
const ADICIONAIS_PAGE_SIZE = 500;
const ADICIONAIS_MAX_CAIXA = 3000;

function showToast(message, isError = false) {
  el.toast.textContent = message;
  el.toast.style.background = isError ? "#8c1f21" : "#1d7a48";
  el.toast.classList.add("show");
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => el.toast.classList.remove("show"), 2300);
}

function badgeClass(status) {
  if (!status) return "badge";
  return `badge ${String(status).toLowerCase()}`;
}

function statusLabel(status) {
  if (status === "LIBERADO") return "Liberado";
  if (status === "EM_PREPARO") return "Em preparo";
  if (status === "PRONTO") return "Pronto";
  if (status === "ENTREGUE") return "Entregue";
  if (status === "CANCELADO") return "Cancelado";
  if (status === "ABERTO") return "Aberto";
  return status || "-";
}

function metodoLabel(metodo) {
  if (metodo === "CARTAO_CREDITO") return "Cartão crédito";
  if (metodo === "CARTAO_DEBITO") return "Cartão débito";
  if (metodo === "DINHEIRO") return "Dinheiro";
  if (metodo === "PIX") return "PIX";
  return metodo || "-";
}

function classificarComplexidade(totalItens) {
  const itens = Number(totalItens || 0);
  if (itens <= 0) return "Sem itens";
  if (itens <= 2) return "Pedido minúsculo";
  if (itens <= 5) return "Pedido pequeno";
  if (itens <= 8) return "Pedido médio";
  return "Pedido grande";
}

function totalItensComanda(comanda) {
  if (!comanda) return 0;
  if (Number.isFinite(Number(comanda.total_itens))) {
    return Number(comanda.total_itens);
  }
  if (!Array.isArray(comanda.itens)) return 0;
  return comanda.itens.reduce((acc, item) => acc + Number(item.quantidade || 0), 0);
}

async function api(path, options = {}) {
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers = { ...(options.headers || {}) };
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  const response = await fetch(path, { ...options, headers, cache: "no-store" });
  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch (_e) {
      payload = { detail: text };
    }
  }
  if (!response.ok) {
    const detail = payload && payload.detail ? payload.detail : `Erro ${response.status}`;
    throw new Error(detail);
  }
  return payload;
}

function fmtMoney(value) {
  return money.format(Number(value || 0));
}

function fmtDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function clampInt(value, min, max, fallback) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, Math.round(num)));
}

function normalizeHexColor(value, fallback) {
  const raw = String(value || "").trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(raw)) {
    return raw;
  }
  return fallback;
}

function normalizeTextList(value, fallback = []) {
  const raw = Array.isArray(value) ? value : String(value || "").split(/\r?\n/);
  const clean = [];
  const seen = new Set();
  raw.forEach((item) => {
    const text = String(item || "").trim();
    if (!text) return;
    const normalized = text.slice(0, 120);
    const key = normalized.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    clean.push(normalized);
  });
  if (clean.length) {
    return clean.slice(0, 30);
  }
  return Array.isArray(fallback) ? [...fallback] : [];
}

function normalizeHintText(value) {
  return String(value || "").trim().toLowerCase();
}

function findProdutoByHint(hint) {
  const raw = String(hint || "").trim();
  if (!raw) return null;
  if (/^\d+$/.test(raw)) {
    const byId = state.produtos.find((p) => p.id === Number(raw));
    if (byId) return byId;
  }
  const normalized = normalizeHintText(raw);
  const exact = state.produtos.find((p) => normalizeHintText(p.nome) === normalized);
  if (exact) return exact;
  return state.produtos.find((p) => normalizeHintText(p.nome).includes(normalized)) || null;
}

function parseMobileMaisPedidosCustom(rawEntries = []) {
  const rows = [];
  const seen = new Set();
  rawEntries.forEach((entryRaw) => {
    const raw = String(entryRaw || "").trim();
    if (!raw) return;

    let produto = null;
    let nomeExibicao = "";
    const splitAt = raw.indexOf("|");
    if (splitAt > 0) {
      const produtoToken = raw.slice(0, splitAt).trim();
      const nomeToken = raw.slice(splitAt + 1).trim();
      if (/^\d+$/.test(produtoToken)) {
        produto = state.produtos.find((row) => row.id === Number(produtoToken)) || null;
      }
      nomeExibicao = nomeToken;
    } else if (/^\d+$/.test(raw)) {
      produto = state.produtos.find((row) => row.id === Number(raw)) || null;
    } else {
      produto = findProdutoByHint(raw);
      nomeExibicao = raw;
    }

    if (!produto) return;
    const nomeFinal = String(nomeExibicao || produto.nome || "").trim().slice(0, 120);
    if (!nomeFinal) return;
    const dedupeKey = `${produto.id}|${nomeFinal.toLowerCase()}`;
    if (seen.has(dedupeKey)) return;
    seen.add(dedupeKey);
    rows.push({
      produto_id: produto.id,
      nome_exibicao: nomeFinal,
    });
  });
  return rows.slice(0, 30);
}

function serializeMobileMaisPedidosCustom(rows = []) {
  const clean = [];
  const seen = new Set();
  rows.forEach((row) => {
    const produtoId = Number(row && row.produto_id);
    const nome = String((row && row.nome_exibicao) || "").trim().slice(0, 120);
    if (!produtoId || !nome) return;
    const token = `${produtoId}|${nome}`;
    const key = token.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    clean.push(token);
  });
  return clean.slice(0, 30);
}

function normalizeERPConfig(payload = {}) {
  const next = { ...DEFAULT_ERP_CONFIG };
  Object.keys(next).forEach((key) => {
    if (payload[key] !== undefined && payload[key] !== null) {
      next[key] = payload[key];
    }
  });

  next.empresa_nome = String(next.empresa_nome || DEFAULT_ERP_CONFIG.empresa_nome).trim();
  if (!next.empresa_nome) {
    next.empresa_nome = DEFAULT_ERP_CONFIG.empresa_nome;
  }
  next.empresa_subtitulo = String(
    next.empresa_subtitulo || DEFAULT_ERP_CONFIG.empresa_subtitulo
  ).trim();
  if (!next.empresa_subtitulo) {
    next.empresa_subtitulo = DEFAULT_ERP_CONFIG.empresa_subtitulo;
  }
  next.email_rodape = String(next.email_rodape || DEFAULT_ERP_CONFIG.email_rodape).trim();
  if (!next.email_rodape) {
    next.email_rodape = DEFAULT_ERP_CONFIG.email_rodape;
  }
  next.logo_url = String(next.logo_url || DEFAULT_ERP_CONFIG.logo_url).trim();
  if (!next.logo_url) {
    next.logo_url = DEFAULT_ERP_CONFIG.logo_url;
  }
  next.cor_primaria = normalizeHexColor(next.cor_primaria, DEFAULT_ERP_CONFIG.cor_primaria);
  next.cor_secundaria = normalizeHexColor(next.cor_secundaria, DEFAULT_ERP_CONFIG.cor_secundaria);
  next.cor_topo_primaria = normalizeHexColor(
    next.cor_topo_primaria,
    DEFAULT_ERP_CONFIG.cor_topo_primaria
  );
  next.cor_topo_secundaria = normalizeHexColor(
    next.cor_topo_secundaria,
    DEFAULT_ERP_CONFIG.cor_topo_secundaria
  );
  next.tempo_real_segundos = clampInt(
    next.tempo_real_segundos,
    2,
    120,
    DEFAULT_ERP_CONFIG.tempo_real_segundos
  );
  next.tempo_real_ativo = Boolean(next.tempo_real_ativo);
  next.permitir_status_pronto = Boolean(next.permitir_status_pronto);
  next.finalizar_mobile_status =
    next.finalizar_mobile_status === "PRONTO" ? "PRONTO" : "EM_PREPARO";
  if (!next.permitir_status_pronto && next.finalizar_mobile_status === "PRONTO") {
    next.finalizar_mobile_status = "EM_PREPARO";
  }
  next.impressao_cozinha_automatica = Boolean(next.impressao_cozinha_automatica);
  next.mobile_obs_rapidas = normalizeTextList(
    next.mobile_obs_rapidas,
    DEFAULT_ERP_CONFIG.mobile_obs_rapidas
  );
  next.mobile_mais_pedidos = normalizeTextList(next.mobile_mais_pedidos, []);
  next.mobile_motivos_reabertura_entregue = normalizeTextList(
    next.mobile_motivos_reabertura_entregue,
    DEFAULT_ERP_CONFIG.mobile_motivos_reabertura_entregue
  );
  return next;
}

function applyBranding(config) {
  if (el.brandAppName) {
    el.brandAppName.textContent = `${config.empresa_nome} Desktop`;
  }
  if (el.brandAppSubtitle) {
    el.brandAppSubtitle.textContent = config.empresa_subtitulo;
  }
  if (el.brandFooterText) {
    el.brandFooterText.textContent = `Powered by ${config.email_rodape}`;
  }
  if (el.brandFooterLogo) {
    el.brandFooterLogo.src = config.logo_url;
  }
  if (el.appFavicon) {
    el.appFavicon.href = config.logo_url;
  }
  if (document.title) {
    document.title = `${config.empresa_nome} | Caixa Desktop`;
  }
}

function applyColors(config) {
  const root = document.documentElement;
  root.style.setProperty("--red-1", config.cor_primaria);
  root.style.setProperty("--red-2", config.cor_secundaria);
  root.style.setProperty("--top-1", config.cor_topo_primaria);
  root.style.setProperty("--top-2", config.cor_topo_secundaria);
}

function toggleProntoVisibility(allowPronto) {
  if (el.optionalProntoButtons) {
    el.optionalProntoButtons.forEach((button) => {
      button.style.display = allowPronto ? "" : "none";
      button.disabled = !allowPronto;
    });
  }
  if (el.filtroStatusProntoOption) {
    el.filtroStatusProntoOption.hidden = !allowPronto;
    el.filtroStatusProntoOption.disabled = !allowPronto;
  }
  if (!allowPronto && el.filtroStatus && el.filtroStatus.value === "PRONTO") {
    el.filtroStatus.value = "";
  }
  if (el.cfgFinalizarMobileStatus) {
    const prontoOption = el.cfgFinalizarMobileStatus.querySelector("option[value='PRONTO']");
    if (prontoOption) {
      prontoOption.hidden = !allowPronto;
      prontoOption.disabled = !allowPronto;
    }
    if (!allowPronto && el.cfgFinalizarMobileStatus.value === "PRONTO") {
      el.cfgFinalizarMobileStatus.value = "EM_PREPARO";
    }
  }
}

function fillConfigForm(config) {
  if (
    !el.configForm ||
    !el.cfgEmpresaNome ||
    !el.cfgEmpresaSubtitulo ||
    !el.cfgEmailRodape ||
    !el.cfgLogoUrl ||
    !el.cfgCorPrimaria ||
    !el.cfgCorSecundaria ||
    !el.cfgCorTopoPrimaria ||
    !el.cfgCorTopoSecundaria ||
    !el.cfgTempoRealSegundos ||
    !el.cfgTempoRealAtivo ||
    !el.cfgPermitirStatusPronto ||
    !el.cfgFinalizarMobileStatus ||
    !el.cfgImpressaoCozinhaAutomatica ||
    !el.cfgMobileObsRapidas ||
    !el.cfgMobileMotivosReabertura
  ) {
    return;
  }
  el.cfgEmpresaNome.value = config.empresa_nome;
  el.cfgEmpresaSubtitulo.value = config.empresa_subtitulo;
  el.cfgEmailRodape.value = config.email_rodape;
  el.cfgLogoUrl.value = config.logo_url;
  el.cfgCorPrimaria.value = config.cor_primaria;
  el.cfgCorSecundaria.value = config.cor_secundaria;
  el.cfgCorTopoPrimaria.value = config.cor_topo_primaria;
  el.cfgCorTopoSecundaria.value = config.cor_topo_secundaria;
  el.cfgTempoRealSegundos.value = String(config.tempo_real_segundos);
  el.cfgTempoRealAtivo.checked = Boolean(config.tempo_real_ativo);
  el.cfgPermitirStatusPronto.checked = Boolean(config.permitir_status_pronto);
  el.cfgFinalizarMobileStatus.value = config.finalizar_mobile_status;
  el.cfgImpressaoCozinhaAutomatica.checked = Boolean(config.impressao_cozinha_automatica);
  el.cfgMobileObsRapidas.value = (config.mobile_obs_rapidas || []).join("\n");
  el.cfgMobileMotivosReabertura.value = (
    config.mobile_motivos_reabertura_entregue || []
  ).join("\n");
  toggleProntoVisibility(config.permitir_status_pronto);
}

function applyERPConfig(config) {
  const normalized = normalizeERPConfig(config);
  state.erpConfig = normalized;
  syncMobileMaisPedidosCustomFromConfig();
  applyBranding(normalized);
  applyColors(normalized);
  toggleProntoVisibility(normalized.permitir_status_pronto);
  state.realtime.intervalMs = normalized.tempo_real_segundos * 1000;
  state.realtime.enabled = normalized.tempo_real_ativo;
  startRealtime();
  updateRealtimeStatusLabel();
}

function collectConfigPayloadFromForm() {
  if (
    !el.configForm ||
    !el.cfgEmpresaNome ||
    !el.cfgEmpresaSubtitulo ||
    !el.cfgEmailRodape ||
    !el.cfgLogoUrl ||
    !el.cfgCorPrimaria ||
    !el.cfgCorSecundaria ||
    !el.cfgCorTopoPrimaria ||
    !el.cfgCorTopoSecundaria ||
    !el.cfgTempoRealSegundos ||
    !el.cfgTempoRealAtivo ||
    !el.cfgPermitirStatusPronto ||
    !el.cfgFinalizarMobileStatus ||
    !el.cfgImpressaoCozinhaAutomatica ||
    !el.cfgMobileObsRapidas ||
    !el.cfgMobileMotivosReabertura
  ) {
    return { ...state.erpConfig };
  }
  const permitirStatusPronto = Boolean(el.cfgPermitirStatusPronto.checked);
  let finalizarStatus = el.cfgFinalizarMobileStatus.value === "PRONTO" ? "PRONTO" : "EM_PREPARO";
  if (!permitirStatusPronto && finalizarStatus === "PRONTO") {
    finalizarStatus = "EM_PREPARO";
  }
  return {
    empresa_nome: el.cfgEmpresaNome.value.trim(),
    empresa_subtitulo: el.cfgEmpresaSubtitulo.value.trim(),
    email_rodape: el.cfgEmailRodape.value.trim(),
    logo_url: el.cfgLogoUrl.value.trim() || DEFAULT_ERP_CONFIG.logo_url,
    cor_primaria: normalizeHexColor(el.cfgCorPrimaria.value, DEFAULT_ERP_CONFIG.cor_primaria),
    cor_secundaria: normalizeHexColor(
      el.cfgCorSecundaria.value,
      DEFAULT_ERP_CONFIG.cor_secundaria
    ),
    cor_topo_primaria: normalizeHexColor(
      el.cfgCorTopoPrimaria.value,
      DEFAULT_ERP_CONFIG.cor_topo_primaria
    ),
    cor_topo_secundaria: normalizeHexColor(
      el.cfgCorTopoSecundaria.value,
      DEFAULT_ERP_CONFIG.cor_topo_secundaria
    ),
    tempo_real_segundos: clampInt(
      el.cfgTempoRealSegundos.value,
      2,
      120,
      DEFAULT_ERP_CONFIG.tempo_real_segundos
    ),
    tempo_real_ativo: Boolean(el.cfgTempoRealAtivo.checked),
    permitir_status_pronto: permitirStatusPronto,
    finalizar_mobile_status: finalizarStatus,
    impressao_cozinha_automatica: Boolean(el.cfgImpressaoCozinhaAutomatica.checked),
    mobile_obs_rapidas: normalizeTextList(
      el.cfgMobileObsRapidas.value,
      DEFAULT_ERP_CONFIG.mobile_obs_rapidas
    ),
    mobile_mais_pedidos: serializeMobileMaisPedidosCustom(state.mobileMaisPedidosCustom),
    mobile_motivos_reabertura_entregue: normalizeTextList(
      el.cfgMobileMotivosReabertura.value,
      DEFAULT_ERP_CONFIG.mobile_motivos_reabertura_entregue
    ),
  };
}

async function loadERPConfig({ notify = false } = {}) {
  const payload = await api("/config/erp");
  applyERPConfig(payload);
  fillConfigForm(state.erpConfig);
  if (notify) {
    showToast("Configurações recarregadas.");
  }
}

async function saveERPConfig(event) {
  event.preventDefault();
  if (!el.configForm) return;
  const payload = collectConfigPayloadFromForm();
  const saved = await api("/config/erp", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  applyERPConfig(saved);
  fillConfigForm(state.erpConfig);
  showToast("Configurações salvas.");
}

async function resetERPConfig() {
  if (!window.confirm("Restaurar configurações padrão do ERP?")) return;
  const payload = await api("/config/erp/reset", { method: "POST" });
  applyERPConfig(payload);
  fillConfigForm(state.erpConfig);
  showToast("Configurações restauradas.");
}

function toMoneyNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function roundMoney(value) {
  return Math.round((toMoneyNumber(value) + Number.EPSILON) * 100) / 100;
}

function getSaldoPendenteAtual() {
  if (!state.selecionada || !state.selecionada.pagamento) return 0;
  return Math.max(0, roundMoney(state.selecionada.pagamento.saldo_pendente));
}

function validarValorPagamentoExato(valor) {
  if (!state.selecionada) throw new Error("Selecione uma comanda.");
  const saldo = getSaldoPendenteAtual();
  if (saldo <= 0) {
    throw new Error("Comanda já quitada. Não é permitido novo pagamento.");
  }
  const valorMoney = roundMoney(valor);
  if (valorMoney !== saldo) {
    throw new Error(
      `Pagamento deve ser exato. Saldo pendente: R$ ${fmtMoney(saldo)} | informado: R$ ${fmtMoney(valorMoney)}.`
    );
  }
  return saldo;
}

function getItensComandaAtual() {
  if (!state.selecionada || !Array.isArray(state.selecionada.itens)) return [];
  return state.selecionada.itens;
}

function getQuickPayState(target) {
  if (!state.quickPay[target]) {
    state.quickPay[target] = { mode: "total", itemIds: [], comandaId: null, itemsTouched: false };
  }
  return state.quickPay[target];
}

function getQuickPayElements(target) {
  if (target === "pag") {
    return {
      input: el.pagValor,
      info: el.quickPayInfoPag,
      items: el.quickPayItemsPag,
    };
  }
  if (target === "maq") {
    return {
      input: el.maqValor,
      info: el.quickPayInfoMaq,
      items: el.quickPayItemsMaq,
    };
  }
  return { input: null, info: null, items: null };
}

function syncQuickPayComanda(target) {
  const quickPay = getQuickPayState(target);
  const currentComandaId = state.selecionada ? state.selecionada.id : null;
  if (quickPay.comandaId === currentComandaId) return;
  quickPay.comandaId = currentComandaId;
  quickPay.itemIds = [];
  quickPay.itemsTouched = false;
  if (quickPay.mode === "custom") {
    quickPay.mode = "total";
  }
}

function setQuickPayInputValue(target, value) {
  const { input } = getQuickPayElements(target);
  if (!input) return;
  const safe = Math.max(0, roundMoney(value));
  input.value = safe > 0 ? safe.toFixed(2) : "";
  if (target === "pag") {
    refreshPixPanel();
  }
}

function setQuickPayButtonsActive(target, mode) {
  el.quickPayButtons.forEach((button) => {
    if (button.dataset.quickPayTarget !== target) return;
    button.classList.toggle("active", button.dataset.quickPayMode === mode);
  });
}

function quickPayModeLabel(mode) {
  if (mode === "total") return "Total restante";
  if (mode === "half") return "Metade";
  if (mode === "items") return "Seleção por itens";
  if (mode === "custom") return "Personalizado";
  return mode;
}

function calculateQuickPayItemsTotal(target) {
  const quickPay = getQuickPayState(target);
  if (!quickPay.itemIds.length) return 0;
  const selected = new Set(quickPay.itemIds);
  const total = getItensComandaAtual().reduce((acc, item) => {
    if (!selected.has(item.id)) return acc;
    return acc + toMoneyNumber(item.subtotal);
  }, 0);
  return roundMoney(total);
}

function renderQuickPayItems(target) {
  const quickPay = getQuickPayState(target);
  const { items } = getQuickPayElements(target);
  if (!items) return;
  items.innerHTML = "";

  if (quickPay.mode !== "items") {
    items.classList.remove("show");
    return;
  }

  items.classList.add("show");

  if (!state.selecionada) {
    const empty = document.createElement("p");
    empty.className = "small";
    empty.textContent = "Selecione uma comanda para escolher os itens.";
    items.appendChild(empty);
    return;
  }

  const comandaItems = getItensComandaAtual();
  if (!comandaItems.length) {
    const empty = document.createElement("p");
    empty.className = "small";
    empty.textContent = "Comanda sem itens.";
    items.appendChild(empty);
    return;
  }

  const validIds = new Set(comandaItems.map((item) => item.id));
  quickPay.itemIds = quickPay.itemIds.filter((id) => validIds.has(id));
  if (!quickPay.itemsTouched && !quickPay.itemIds.length) {
    quickPay.itemIds = comandaItems.map((item) => item.id);
  }

  const top = document.createElement("div");
  top.className = "quick-pay-items-top";
  top.innerHTML = `
    <button type="button" data-quick-pay-all="${target}">Marcar todos</button>
    <button type="button" data-quick-pay-clear="${target}" class="btn-no">Limpar</button>
  `;
  items.appendChild(top);

  const selectedSet = new Set(quickPay.itemIds);
  comandaItems.forEach((item) => {
    const row = document.createElement("label");
    row.className = "quick-pay-item-row";
    const itemTotal = roundMoney(item.subtotal);
    row.innerHTML = `
      <input type="checkbox" data-quick-pay-item-target="${target}" data-quick-pay-item-id="${item.id}" ${selectedSet.has(item.id) ? "checked" : ""}>
      <span>${item.quantidade}x ${item.produto_nome}</span>
      <strong>R$ ${fmtMoney(itemTotal)}</strong>
    `;
    items.appendChild(row);
  });
}

function updateQuickPayInfo(target) {
  const quickPay = getQuickPayState(target);
  const { info } = getQuickPayElements(target);
  if (!info) return;

  if (!state.selecionada) {
    info.textContent = "Selecione uma comanda para habilitar as opções rápidas.";
    return;
  }

  const saldo = getSaldoPendenteAtual();
  if (quickPay.mode === "custom") {
    info.textContent = `Modo ${quickPayModeLabel(quickPay.mode)}. O valor final deve ser exatamente R$ ${fmtMoney(saldo)}.`;
    return;
  }

  if (quickPay.mode === "items") {
    const totalItens = calculateQuickPayItemsTotal(target);
    const valorSugerido = Math.min(totalItens, saldo);
    const selecionados = quickPay.itemIds.length;
    const truncado = totalItens > saldo ? " (limitado ao saldo pendente)" : "";
    info.textContent =
      `Modo ${quickPayModeLabel(quickPay.mode)}: ${selecionados} item(ns), soma R$ ${fmtMoney(totalItens)}.` +
      ` Valor sugerido: R$ ${fmtMoney(valorSugerido)}${truncado}. Valor final deve fechar em R$ ${fmtMoney(saldo)}.`;
    return;
  }

  const valor = quickPay.mode === "half" ? roundMoney(saldo / 2) : saldo;
  info.textContent = `Modo ${quickPayModeLabel(quickPay.mode)}. Valor sugerido: R$ ${fmtMoney(valor)}. Valor final: R$ ${fmtMoney(saldo)}.`;
}

function applyQuickPayMode(target, mode, silent = false) {
  if (!["total", "half", "items", "custom"].includes(mode)) return;

  syncQuickPayComanda(target);
  const quickPay = getQuickPayState(target);
  quickPay.mode = mode;

  setQuickPayButtonsActive(target, mode);
  renderQuickPayItems(target);

  if (!state.selecionada) {
    setQuickPayInputValue(target, 0);
    updateQuickPayInfo(target);
    if (!silent) {
      showToast("Selecione uma comanda para usar as opções rápidas.", true);
    }
    return;
  }

  const saldo = getSaldoPendenteAtual();
  if (mode === "total") {
    setQuickPayInputValue(target, saldo);
  } else if (mode === "half") {
    setQuickPayInputValue(target, saldo / 2);
  } else if (mode === "items") {
    const totalItens = calculateQuickPayItemsTotal(target);
    setQuickPayInputValue(target, Math.min(totalItens, saldo));
  }

  updateQuickPayInfo(target);
}

function refreshQuickPayTarget(target) {
  syncQuickPayComanda(target);
  const quickPay = getQuickPayState(target);
  applyQuickPayMode(target, quickPay.mode || "total", true);
}

function refreshQuickPayAll() {
  refreshQuickPayTarget("pag");
  refreshQuickPayTarget("maq");
}

function setQuickPayCustomMode(target) {
  const quickPay = getQuickPayState(target);
  if (quickPay.mode === "custom") {
    updateQuickPayInfo(target);
    return;
  }
  quickPay.mode = "custom";
  setQuickPayButtonsActive(target, "custom");
  renderQuickPayItems(target);
  updateQuickPayInfo(target);
}

function setQuickPayItemsSelection(target, itemIds) {
  const quickPay = getQuickPayState(target);
  quickPay.itemIds = itemIds;
  quickPay.itemsTouched = true;
  if (quickPay.mode === "items") {
    const saldo = getSaldoPendenteAtual();
    const totalItens = calculateQuickPayItemsTotal(target);
    setQuickPayInputValue(target, Math.min(totalItens, saldo));
    updateQuickPayInfo(target);
  }
}

function getComandaItemIds() {
  return getItensComandaAtual().map((item) => item.id);
}

function resetQuickPayTarget(target) {
  const quickPay = getQuickPayState(target);
  quickPay.mode = "total";
  quickPay.itemIds = [];
  quickPay.itemsTouched = false;
}

function buildPixCode() {
  const comanda = state.selecionada ? state.selecionada.comanda_codigo : "SEM_COMANDA";
  const pedidoId = state.selecionada ? state.selecionada.id : "0";
  const valor = toMoneyNumber(el.pagValor ? el.pagValor.value : 0).toFixed(2);
  const chave = (el.pixChave && el.pixChave.value ? el.pixChave.value : "padaria@erp.local").trim();
  return `PIX|CHAVE=${chave}|VALOR=${valor}|COMANDA=${comanda}|PEDIDO=${pedidoId}`;
}

function refreshPixPanel() {
  if (!el.pagMetodo || !el.pixBox) return;
  const pixSelected = el.pagMetodo.value === "PIX";
  el.pixBox.classList.toggle("show", pixSelected);
  if (!pixSelected) return;
  if (el.pixCopiaCola) {
    el.pixCopiaCola.value = buildPixCode();
  }
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-10000px";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

async function copyPixCode() {
  if (!el.pixCopiaCola) return;
  const code = el.pixCopiaCola.value || buildPixCode();
  await copyTextToClipboard(code);
  showToast("Código PIX copiado.");
}

function setActiveTab(tab, persist = true) {
  const allowed = new Set(["comandas", "pagamentos", "produtos", "config"]);
  const nextTab = allowed.has(tab) ? tab : "comandas";
  state.activeTab = nextTab;
  el.tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === nextTab);
  });
  el.tabPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.tabPanel === nextTab);
  });
  if (persist) {
    localStorage.setItem("padaria_caixa_tab", nextTab);
  }
}

function tabFromPanelId(panelId) {
  const map = {
    "panel-codigos": "comandas",
    "panel-comandas": "comandas",
    "panel-selecionada": "comandas",
    "panel-pagamento": "pagamentos",
    "panel-maquininha": "pagamentos",
    "panel-pagamentos": "pagamentos",
    "panel-fechamento": "pagamentos",
    "panel-produtos": "produtos",
    "panel-adicionais": "produtos",
    "panel-config": "config",
  };
  return map[panelId] || "comandas";
}

function loadActiveTab() {
  const saved = localStorage.getItem("padaria_caixa_tab") || "comandas";
  setActiveTab(saved, false);
}

function irParaPagamentoDaComandaSelecionada() {
  if (!state.selecionada) {
    showToast("Selecione uma comanda primeiro.", true);
    return;
  }
  setActiveTab("pagamentos");
  const panel = document.getElementById("panel-pagamento");
  if (panel) {
    panel.open = true;
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  applyQuickPayMode("pag", "total", true);
  showToast(`Pagamento pronto para ${state.selecionada.comanda_codigo}.`);
}

function formatTimeClock(date) {
  if (!date) return "--:--:--";
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function updateRealtimeStatusLabel() {
  if (!el.tempoRealStatus || !el.tempoRealToggle) return;
  const onOff = state.realtime.enabled ? "ON" : "OFF";
  el.tempoRealToggle.textContent = `Tempo real: ${onOff}`;
  if (!state.realtime.enabled) {
    el.tempoRealStatus.textContent = "Atualização automática pausada.";
    return;
  }
  el.tempoRealStatus.textContent =
    `Atualização automática a cada ${Math.round(state.realtime.intervalMs / 1000)}s. ` +
    `Ultima: ${formatTimeClock(state.realtime.lastTick)}.`;
}

async function tickRealtime() {
  if (!state.realtime.enabled || state.realtime.busy || document.hidden) return;
  state.realtime.busy = true;
  try {
    await refreshComandasESelecionada();
    state.realtime.lastTick = new Date();
    updateRealtimeStatusLabel();
  } catch (_err) {
    // Evita poluir com toasts em falhas temporarias de rede durante auto refresh.
  } finally {
    state.realtime.busy = false;
  }
}

function startRealtime() {
  if (state.realtime.timerId) {
    window.clearInterval(state.realtime.timerId);
  }
  if (!state.realtime.enabled) {
    updateRealtimeStatusLabel();
    return;
  }
  state.realtime.timerId = window.setInterval(() => {
    run(tickRealtime);
  }, state.realtime.intervalMs);
  updateRealtimeStatusLabel();
}

function toggleRealtime() {
  state.realtime.enabled = !state.realtime.enabled;
  if (el.cfgTempoRealAtivo) {
    el.cfgTempoRealAtivo.checked = state.realtime.enabled;
  }
  startRealtime();
}

function productImageSrc(imagemUrl) {
  const raw = (imagemUrl || "").trim();
  if (!raw) return "/static/img/pao.svg";
  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/")) {
    return raw;
  }
  return "/static/img/pao.svg";
}

function adicionalNome(adicionalId) {
  const found = state.adicionais.find((ad) => ad.id === adicionalId);
  return found ? found.nome : `Adicional ${adicionalId}`;
}

function renderProdutoAdicionaisBox(selectedIds = []) {
  el.produtoAdicionaisBox.innerHTML = "";
  const adicionaisAtivos = state.adicionais.filter((ad) => ad.ativo);
  if (!adicionaisAtivos.length) {
    const p = document.createElement("p");
    p.className = "small";
    p.textContent = "Nenhum adicional ativo cadastrado.";
    el.produtoAdicionaisBox.appendChild(p);
    return;
  }
  const selected = new Set(selectedIds.map((id) => Number(id)));
  adicionaisAtivos.forEach((adicional) => {
    const row = document.createElement("label");
    row.className = "produto-ad-row";
    row.innerHTML = `
      <input type="checkbox" data-produto-adicional="${adicional.id}" ${selected.has(adicional.id) ? "checked" : ""}>
      <span>${adicional.nome} (R$ ${fmtMoney(adicional.preco)})</span>
    `;
    el.produtoAdicionaisBox.appendChild(row);
  });
}

function renderMobileMaisPedidosProdutoSelect() {
  if (!el.mobileMaisPedidoProduto) return;
  const atual = Number(el.mobileMaisPedidoProduto.value || "0");
  el.mobileMaisPedidoProduto.innerHTML = "";
  const produtosDisponiveis = state.produtos.filter((produto) => produto.ativo);
  if (!produtosDisponiveis.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Sem produtos ativos";
    el.mobileMaisPedidoProduto.appendChild(opt);
    return;
  }
  produtosDisponiveis.forEach((produto) => {
    const opt = document.createElement("option");
    opt.value = String(produto.id);
    opt.textContent = `${produto.nome} (ID ${produto.id})`;
    el.mobileMaisPedidoProduto.appendChild(opt);
  });
  if (atual && produtosDisponiveis.some((row) => row.id === atual)) {
    el.mobileMaisPedidoProduto.value = String(atual);
  } else {
    el.mobileMaisPedidoProduto.value = String(produtosDisponiveis[0].id);
  }
}

function renderMobileMaisPedidosCustomList() {
  if (!el.mobileMaisPedidosList) return;
  el.mobileMaisPedidosList.innerHTML = "";
  if (!state.mobileMaisPedidosCustom.length) {
    const empty = document.createElement("p");
    empty.className = "small";
    empty.textContent = "Nenhum atalho configurado para o mobile.";
    el.mobileMaisPedidosList.appendChild(empty);
    return;
  }
  state.mobileMaisPedidosCustom.forEach((row, index) => {
    const produto = state.produtos.find((item) => item.id === Number(row.produto_id));
    const nomeProduto = produto ? produto.nome : `Produto ID ${row.produto_id}`;
    const linha = document.createElement("div");
    linha.className = "mobile-mais-pedido-row";
    linha.innerHTML = `
      <div>
        <strong>${row.nome_exibicao}</strong>
        <p class="small">${nomeProduto}</p>
      </div>
      <button type="button" class="btn-no" data-mobile-mais-pedido-remove="${index}">Remover</button>
    `;
    el.mobileMaisPedidosList.appendChild(linha);
  });
}

function syncMobileMaisPedidosCustomFromConfig() {
  state.mobileMaisPedidosCustom = parseMobileMaisPedidosCustom(
    state.erpConfig.mobile_mais_pedidos || []
  );
  renderMobileMaisPedidosCustomList();
}

async function persistirMobileMaisPedidosCustom({ notify = true } = {}) {
  const payload = {
    mobile_mais_pedidos: serializeMobileMaisPedidosCustom(state.mobileMaisPedidosCustom),
  };
  const saved = await api("/config/erp", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  applyERPConfig(saved);
  fillConfigForm(state.erpConfig);
  if (notify) {
    showToast("Mais pedidos do mobile atualizados.");
  }
}

async function adicionarMobileMaisPedidoCustom(event) {
  event.preventDefault();
  const produtoId = Number(el.mobileMaisPedidoProduto ? el.mobileMaisPedidoProduto.value : "0");
  if (!produtoId) throw new Error("Selecione um produto para o atalho.");
  const produto = state.produtos.find((row) => row.id === produtoId);
  if (!produto) throw new Error("Produto selecionado nao encontrado.");
  const nomeDigitado = String(el.mobileMaisPedidoNome ? el.mobileMaisPedidoNome.value : "").trim();
  const nomeExibicao = (nomeDigitado || produto.nome).slice(0, 120);
  if (!nomeExibicao) throw new Error("Informe um nome para exibicao no mobile.");
  const chave = `${produtoId}|${nomeExibicao}`.toLowerCase();
  const existe = state.mobileMaisPedidosCustom.some(
    (row) => `${row.produto_id}|${row.nome_exibicao}`.toLowerCase() === chave
  );
  if (existe) throw new Error("Esse atalho ja foi configurado.");

  state.mobileMaisPedidosCustom.push({
    produto_id: produtoId,
    nome_exibicao: nomeExibicao,
  });
  await persistirMobileMaisPedidosCustom();
  if (el.mobileMaisPedidoNome) {
    el.mobileMaisPedidoNome.value = "";
  }
}

async function removerMobileMaisPedidoCustom(index) {
  if (!Number.isInteger(index) || index < 0 || index >= state.mobileMaisPedidosCustom.length) {
    return;
  }
  state.mobileMaisPedidosCustom.splice(index, 1);
  await persistirMobileMaisPedidosCustom();
}

async function limparMobileMaisPedidosCustom() {
  if (!state.mobileMaisPedidosCustom.length) return;
  const confirmar = window.confirm("Limpar todos os atalhos de 'Mais pedidos' do mobile?");
  if (!confirmar) return;
  state.mobileMaisPedidosCustom = [];
  await persistirMobileMaisPedidosCustom();
}

function renderAdicionaisAdmin() {
  el.adicionaisList.innerHTML = "";
  if (!state.adicionais.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Nenhum adicional cadastrado.";
    el.adicionaisList.appendChild(empty);
    return;
  }

  state.adicionais.forEach((adicional) => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <div class="row-head">
        <strong>${adicional.nome}</strong>
        <span class="${badgeClass(adicional.ativo ? "PRONTO" : "CANCELADO")}">
          ${adicional.ativo ? "Ativo" : "Inativo"}
        </span>
      </div>
      <div>Preço: R$ ${fmtMoney(adicional.preco)}</div>
      <div class="payment-actions">
        <button type="button" data-adicional-edit="${adicional.id}">Editar</button>
        <button type="button" data-adicional-toggle="${adicional.id}" data-next-ativo="${adicional.ativo ? "false" : "true"}">
          ${adicional.ativo ? "Desativar" : "Reativar"}
        </button>
        <button type="button" class="btn-no" data-adicional-delete="${adicional.id}">Excluir</button>
      </div>
    `;
    el.adicionaisList.appendChild(row);
  });
}

function getProdutoAdicionalIdsSelecionados() {
  return Array.from(el.produtoAdicionaisBox.querySelectorAll("[data-produto-adicional]:checked"))
    .map((node) => Number(node.dataset.produtoAdicional))
    .filter((id) => id > 0);
}

function updateProdutoImagemPreview() {
  if (el.produtoImagemFile.files && el.produtoImagemFile.files[0]) {
    const objectUrl = URL.createObjectURL(el.produtoImagemFile.files[0]);
    el.produtoImagemPreview.src = objectUrl;
    return;
  }
  el.produtoImagemPreview.src = productImageSrc(el.produtoImagem.value);
}

function renderCodigos() {
  el.codigosList.innerHTML = "";
  state.codigos.forEach((code) => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <div class="row-head">
        <strong>${code.codigo}</strong>
        <span>${code.em_uso ? "EM USO" : "LIVRE"}</span>
      </div>
      <div>Ativo: ${code.ativo ? "SIM" : "NAO"}</div>
      <div>Status visual: ${statusLabel(code.status_visual)}</div>
      <div class="payment-actions">
        <button type="button" data-toggle-codigo="${code.id}">${code.ativo ? "Desativar" : "Ativar"}</button>
        <button type="button" class="btn-no" data-delete-codigo="${code.id}">Excluir</button>
      </div>
    `;
    el.codigosList.appendChild(row);
  });
}

function renderProdutos() {
  el.produtosList.innerHTML = "";
  if (!state.produtos.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Nenhum produto encontrado.";
    el.produtosList.appendChild(empty);
    return;
  }

  state.produtos.forEach((produto) => {
    const adicionaisIds = Array.isArray(produto.adicional_ids) ? produto.adicional_ids : [];
    const adicionaisNomes = adicionaisIds.map((id) => adicionalNome(Number(id)));
    const categoria = produto.categoria ? produto.categoria : "Sem categoria";
    const row = document.createElement("div");
    row.className = "row produto-row";
    row.innerHTML = `
      <div class="produto-head">
        <div class="produto-media">
          <img src="${productImageSrc(produto.imagem_url)}" alt="${produto.nome}">
          <div>
            <strong>${produto.nome}</strong>
            <div class="produto-meta">ID ${produto.id} | ${fmtDateTime(produto.criado_em)} | ${categoria}</div>
            <div class="produto-preco">R$ ${fmtMoney(produto.preco)}</div>
            ${produto.descricao ? `<div class="produto-desc">${produto.descricao}</div>` : ""}
          </div>
        </div>
        <span class="${badgeClass(produto.ativo ? "PRONTO" : "CANCELADO")}">
          ${produto.ativo ? "Ativo" : "Inativo"}
        </span>
      </div>
      <div class="produto-ad-tags">
        ${adicionaisNomes.length ? adicionaisNomes.map((nome) => `<span class="produto-tag">${nome}</span>`).join("") : '<span class="produto-tag muted">Todos adicionais permitidos</span>'}
      </div>
      <div class="produto-controls">
        <span class="produto-stock">Estoque: <strong>${produto.estoque_atual}</strong></span>
        <div class="payment-actions">
          <button type="button" data-produto-edit="${produto.id}">Editar</button>
          <button type="button" data-produto-delta="${produto.id}" data-delta="-10">-10</button>
          <button type="button" data-produto-delta="${produto.id}" data-delta="-1">-1</button>
          <button type="button" data-produto-delta="${produto.id}" data-delta="1">+1</button>
          <button type="button" data-produto-delta="${produto.id}" data-delta="10">+10</button>
          <button class="btn-no" type="button" data-produto-toggle-ativo="${produto.id}" data-next-ativo="${produto.ativo ? "false" : "true"}">
            ${produto.ativo ? "Desativar" : "Reativar"}
          </button>
          <button class="btn-no" type="button" data-produto-delete="${produto.id}">Excluir</button>
        </div>
      </div>
    `;
    el.produtosList.appendChild(row);
  });
}

function renderComandas() {
  renderComandasResumo();
  el.comandasList.innerHTML = "";
  if (!state.comandas.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Nenhuma comanda encontrada com esses filtros.";
    el.comandasList.appendChild(empty);
    return;
  }

  state.comandas.forEach((c) => {
    const totalItens = totalItensComanda(c);
    const complexidade = c.complexidade || classificarComplexidade(totalItens);
    const row = document.createElement("div");
    row.className = "row comanda-row";
    if (state.selecionada && state.selecionada.id === c.id) {
      row.classList.add("active");
    }
    row.innerHTML = `
      <div class="row-head">
        <strong>${c.comanda_codigo}</strong>
        <span class="${badgeClass(c.status)}">${statusLabel(c.status)}</span>
      </div>
      <div>Total: R$ ${fmtMoney(c.total)} | ${c.tipo_entrega} | Itens: ${totalItens}</div>
      <div class="small">${complexidade}</div>
      <div class="comanda-row-actions">
        <button type="button" data-select-comanda="${c.id}">Selecionar</button>
        <button type="button" class="btn-no" data-reset-comanda="${c.id}">Resetar</button>
      </div>
    `;
    el.comandasList.appendChild(row);
  });
}

function renderComandasResumo() {
  if (!el.comandaResumo) return;
  const total = state.comandas.length;
  const emPreparo = state.comandas.filter((c) => c.status === "EM_PREPARO").length;
  const abertas = state.comandas.filter((c) => c.status === "ABERTO").length;
  const entregue = state.comandas.filter((c) => c.status === "ENTREGUE").length;
  const canceladas = state.comandas.filter((c) => c.status === "CANCELADO").length;

  el.comandaResumo.innerHTML = `
    <span class="resumo-chip">Total: ${total}</span>
    <span class="resumo-chip">Abertas: ${abertas}</span>
    <span class="resumo-chip">Em preparo: ${emPreparo}</span>
    <span class="resumo-chip">Entregues: ${entregue}</span>
    <span class="resumo-chip">Canceladas: ${canceladas}</span>
  `;
}

function renderSelecionada() {
  if (!state.selecionada) {
    el.selCodigo.textContent = "-";
    el.selStatus.textContent = "-";
    if (el.selComplexidade) el.selComplexidade.textContent = "-";
    if (el.selTotalItens) el.selTotalItens.textContent = "0";
    el.selTotal.textContent = "0.00";
    el.selPago.textContent = "0.00";
    el.selSaldo.textContent = "0.00";
    el.pagamentosList.innerHTML = "";
    renderAjustesItensPagamento();
    refreshPixPanel();
    refreshQuickPayAll();
    if (el.limparComanda) {
      el.limparComanda.disabled = true;
      el.limparComanda.textContent = "Limpar Comanda";
    }
    return;
  }
  const c = state.selecionada;
  const totalItens = totalItensComanda(c);
  const complexidade = c.complexidade || classificarComplexidade(totalItens);
  el.selCodigo.textContent = c.comanda_codigo;
  el.selStatus.textContent = statusLabel(c.status);
  if (el.selComplexidade) el.selComplexidade.textContent = complexidade;
  if (el.selTotalItens) el.selTotalItens.textContent = String(totalItens);
  el.selTotal.textContent = fmtMoney(c.total);
  el.selPago.textContent = fmtMoney(c.pagamento.total_pago);
  el.selSaldo.textContent = fmtMoney(c.pagamento.saldo_pendente);
  if (el.limparComanda) {
    const saldo = Number(c.pagamento?.saldo_pendente || 0);
    el.limparComanda.disabled = false;
    el.limparComanda.textContent = saldo <= 0
      ? "Limpar Comanda (Quitada)"
      : "Limpar Comanda";
  }
  renderAjustesItensPagamento();
  refreshPixPanel();
  refreshQuickPayAll();
}

function renderPagamentos() {
  el.pagamentosList.innerHTML = "";
  if (!state.pagamentos.length) {
    const p = document.createElement("p");
    p.textContent = "Sem pagamentos para a comanda selecionada.";
    el.pagamentosList.appendChild(p);
    return;
  }
  state.pagamentos.forEach((p) => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <div class="row-head">
        <strong>${metodoLabel(p.metodo)}</strong>
        <span class="${badgeClass(p.status)}">${statusLabel(p.status)}</span>
      </div>
      <div>Valor: R$ ${fmtMoney(p.valor)}</div>
      <div>Referência: ${p.referencia_externa || "-"}</div>
      <div>Maquininha: ${p.maquininha_id || "-"}</div>
      ${p.status === "PENDENTE" ? `
      <div class="payment-actions">
        <button class="btn-ok" type="button" data-approve="${p.id}">Aprovar</button>
        <button class="btn-no" type="button" data-reject="${p.id}">Recusar</button>
      </div>` : ""}
    `;
    el.pagamentosList.appendChild(row);
  });
}

function renderAjustesItensPagamento() {
  if (!el.pagamentoItensList) return;
  el.pagamentoItensList.innerHTML = "";
  if (!state.selecionada) {
    const p = document.createElement("p");
    p.className = "small";
    p.textContent = "Selecione uma comanda para ajustar itens.";
    el.pagamentoItensList.appendChild(p);
    return;
  }

  const itens = state.selecionada.itens || [];
  if (!itens.length) {
    const p = document.createElement("p");
    p.className = "small";
    p.textContent = "Sem itens para ajuste.";
    el.pagamentoItensList.appendChild(p);
    return;
  }

  const bloqueado = ["ENTREGUE", "CANCELADO"].includes(state.selecionada.status);
  itens.forEach((item) => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <div class="row-head">
        <strong>${item.produto_nome} x${item.quantidade}</strong>
        <span>R$ ${fmtMoney(item.subtotal)}</span>
      </div>
      <div class="small">Ajuste avançado para fechamento</div>
      <div class="payment-actions">
        <button type="button" data-force-remove-item="${item.id}" data-restock="true" ${bloqueado ? "disabled" : ""}>
          Retirar e repor estoque
        </button>
        <button type="button" class="btn-no" data-force-remove-item="${item.id}" data-restock="false" ${bloqueado ? "disabled" : ""}>
          Retirar como perdido
        </button>
      </div>
    `;
    el.pagamentoItensList.appendChild(row);
  });
}

function setDefaultDate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const date = `${y}-${m}-${d}`;
  el.fechamentoData.value = date;
  state.fechamentoData = date;

  const start = new Date(now);
  start.setDate(now.getDate() - 6);
  const ys = start.getFullYear();
  const ms = String(start.getMonth() + 1).padStart(2, "0");
  const ds = String(start.getDate()).padStart(2, "0");
  const startDate = `${ys}-${ms}-${ds}`;
  el.faturamentoDataInicial.value = startDate;
  el.faturamentoDataFinal.value = date;
  state.faturamentoDataInicial = startDate;
  state.faturamentoDataFinal = date;
}

async function loadCodigos() {
  state.codigos = await api("/comandas/codigos");
  renderCodigos();
}

async function loadAdicionais() {
  const adicionais = [];
  let offset = 0;
  while (adicionais.length < ADICIONAIS_MAX_CAIXA) {
    const batch = await api(`/adicionais?offset=${offset}&limit=${ADICIONAIS_PAGE_SIZE}`);
    if (!Array.isArray(batch) || !batch.length) {
      break;
    }
    adicionais.push(...batch);
    if (batch.length < ADICIONAIS_PAGE_SIZE) {
      break;
    }
    offset += ADICIONAIS_PAGE_SIZE;
  }
  state.adicionais = adicionais.slice(0, ADICIONAIS_MAX_CAIXA);
  renderProdutoAdicionaisBox(getProdutoAdicionalIdsSelecionados());
  renderAdicionaisAdmin();
  if (state.produtos.length) {
    renderProdutos();
  }
}

async function loadProdutos() {
  const params = new URLSearchParams({
    page_size: String(PRODUTOS_PAGE_SIZE),
  });
  const busca = el.produtoBusca.value.trim();
  const ativo = el.produtoFiltroAtivo.value;
  const categoria = el.produtoFiltroCategoria.value.trim().toLowerCase();
  if (busca) params.set("q", busca);
  if (ativo === "true" || ativo === "false") params.set("ativo", ativo);
  const rows = [];
  let page = 1;
  let total = null;
  while (rows.length < PRODUTOS_MAX_CAIXA) {
    params.set("page", String(page));
    const query = params.toString() ? `?${params.toString()}` : "";
    const payload = await api(`/produtos${query}`);
    const batch = Array.isArray(payload.items) ? payload.items : [];
    rows.push(...batch);
    if (total === null && Number.isFinite(Number(payload.total))) {
      total = Number(payload.total);
    }
    if (!batch.length || batch.length < PRODUTOS_PAGE_SIZE) {
      break;
    }
    if (total !== null && rows.length >= total) {
      break;
    }
    page += 1;
  }
  const loadedRows = rows.slice(0, PRODUTOS_MAX_CAIXA);
  state.produtos = categoria
    ? loadedRows.filter((p) => String(p.categoria || "").toLowerCase().includes(categoria))
    : loadedRows;
  renderProdutos();
  renderMobileMaisPedidosProdutoSelect();
  syncMobileMaisPedidosCustomFromConfig();
}

async function loadComandas() {
  const params = new URLSearchParams();
  params.set("limit", "1000");
  const codigo = el.filtroCodigo.value.trim();
  const mesa = el.filtroMesa.value.trim();
  const status = el.filtroStatus.value;
  const tipoEntrega = el.filtroTipoEntrega.value;
  const dataInicial = el.filtroDataInicial.value;
  const dataFinal = el.filtroDataFinal.value;
  const totalMin = el.filtroTotalMin.value.trim();
  const totalMax = el.filtroTotalMax.value.trim();
  const orderBy = el.filtroOrdemCampo.value;
  const orderDir = el.filtroOrdemDirecao.value;

  if (codigo) params.set("codigo", codigo);
  if (mesa) params.set("mesa", mesa);
  if (status) params.set("status", status);
  if (tipoEntrega) params.set("tipo_entrega", tipoEntrega);
  if (dataInicial) params.set("data_inicial", dataInicial);
  if (dataFinal) params.set("data_final", dataFinal);
  if (totalMin) params.set("total_min", Number(totalMin).toFixed(2));
  if (totalMax) params.set("total_max", Number(totalMax).toFixed(2));
  if (orderBy) params.set("order_by", orderBy);
  if (orderDir) params.set("order_dir", orderDir);

  const query = params.toString() ? `?${params.toString()}` : "";
  state.comandas = await api(`/comandas${query}`);
  renderComandas();
}

async function refreshComandasESelecionada() {
  const selectedId = state.selecionada ? state.selecionada.id : null;
  await loadComandas();
  await loadCodigos();
  if (selectedId) {
    const exists = state.comandas.some((row) => row.id === selectedId);
    if (exists) {
      await selecionarComanda(selectedId);
    } else {
      state.selecionada = null;
      renderSelecionada();
      await loadPagamentos();
    }
  }
}

function limparFiltrosComandas() {
  el.filtroCodigo.value = "";
  el.filtroMesa.value = "";
  el.filtroStatus.value = "";
  el.filtroTipoEntrega.value = "";
  el.filtroDataInicial.value = "";
  el.filtroDataFinal.value = "";
  el.filtroTotalMin.value = "";
  el.filtroTotalMax.value = "";
  el.filtroOrdemCampo.value = "id";
  el.filtroOrdemDirecao.value = "desc";
}

function limparFiltrosProdutos() {
  el.produtoBusca.value = "";
  el.produtoFiltroAtivo.value = "";
  el.produtoFiltroCategoria.value = "";
}

async function selecionarComanda(id) {
  state.selecionada = await api(`/comandas/${id}`);
  renderSelecionada();
  renderComandas();
  await loadPagamentos();
}

async function loadPagamentos() {
  if (!state.selecionada) {
    state.pagamentos = [];
    renderPagamentos();
    return;
  }
  state.pagamentos = await api(`/pagamentos?pedido_id=${state.selecionada.id}&limit=2000`);
  renderPagamentos();
}

async function criarCodigo(event) {
  event.preventDefault();
  const code = el.novoCodigo.value.trim();
  if (!code) throw new Error("Informe o código.");
  await api("/comandas/codigos", {
    method: "POST",
    body: JSON.stringify({ codigo: code }),
  });
  el.codigoForm.reset();
  await loadCodigos();
  showToast("Código de comanda cadastrado.");
}

function resetProdutoForm() {
  el.produtoEditId.value = "";
  el.produtoForm.reset();
  el.produtoEstoque.value = "0";
  el.produtoAtivo.value = "true";
  el.produtoSubmit.textContent = "Cadastrar Produto";
  el.produtoCancelEdit.style.display = "none";
  renderProdutoAdicionaisBox([]);
  updateProdutoImagemPreview();
}

function resetAdicionalForm() {
  el.adicionalEditId.value = "";
  el.adicionalForm.reset();
  el.adicionalAtivo.value = "true";
  el.adicionalSubmit.textContent = "Salvar";
  el.adicionalCancelEdit.style.display = "none";
}

function montarPayloadProduto(imagemUrlFinal = null) {
  const nome = el.produtoNome.value.trim();
  const categoria = el.produtoCategoria.value.trim();
  const descricao = el.produtoDescricao.value.trim();
  const preco = Number(el.produtoPreco.value);
  const estoque = Number.parseInt(el.produtoEstoque.value || "0", 10);
  const ativo = el.produtoAtivo.value !== "false";

  if (!nome) throw new Error("Informe o nome do produto.");
  if (!Number.isFinite(preco) || preco <= 0) {
    throw new Error("Informe um preço válido.");
  }
  if (!Number.isInteger(estoque) || estoque < 0) {
    throw new Error("Informe um estoque válido (0 ou maior).");
  }
  return {
    nome,
    categoria: categoria || null,
    descricao: descricao || null,
    preco: preco.toFixed(2),
    estoque_atual: estoque,
    ativo,
    imagem_url: imagemUrlFinal || el.produtoImagem.value.trim() || null,
    adicional_ids: getProdutoAdicionalIdsSelecionados(),
  };
}

async function uploadProdutoImagemSeNecessario() {
  if (!el.produtoImagemFile.files || !el.produtoImagemFile.files[0]) {
    return null;
  }
  const file = el.produtoImagemFile.files[0];
  const form = new FormData();
  form.append("file", file);
  const payload = await api("/produtos/upload-imagem", {
    method: "POST",
    body: form,
  });
  const imagemUrl = payload && payload.imagem_url ? payload.imagem_url : null;
  if (!imagemUrl) {
    throw new Error("Falha no upload da imagem do produto.");
  }
  el.produtoImagem.value = imagemUrl;
  return imagemUrl;
}

function preencherFormProdutoParaEdicao(produtoId) {
  const produto = state.produtos.find((p) => p.id === produtoId);
  if (!produto) throw new Error("Produto não encontrado para edição.");

  openPanelById("panel-produtos");
  if (el.subpanelProdutoForm) {
    el.subpanelProdutoForm.open = true;
  }

  el.produtoEditId.value = String(produto.id);
  el.produtoNome.value = produto.nome || "";
  el.produtoCategoria.value = produto.categoria || "";
  el.produtoDescricao.value = produto.descricao || "";
  el.produtoPreco.value = Number(produto.preco || 0).toFixed(2);
  el.produtoEstoque.value = String(produto.estoque_atual || 0);
  el.produtoImagem.value = produto.imagem_url || "";
  el.produtoAtivo.value = produto.ativo ? "true" : "false";
  el.produtoSubmit.textContent = "Salvar Alterações";
  el.produtoCancelEdit.style.display = "inline-flex";
  renderProdutoAdicionaisBox(produto.adicional_ids || []);
  updateProdutoImagemPreview();
}

function preencherFormAdicionalParaEdicao(adicionalId) {
  const adicional = state.adicionais.find((row) => row.id === adicionalId);
  if (!adicional) throw new Error("Adicional não encontrado.");

  openPanelById("panel-adicionais");
  if (el.subpanelAdicionalForm) {
    el.subpanelAdicionalForm.open = true;
  }

  el.adicionalEditId.value = String(adicional.id);
  el.adicionalNome.value = adicional.nome || "";
  el.adicionalPreco.value = Number(adicional.preco || 0).toFixed(2);
  el.adicionalAtivo.value = adicional.ativo ? "true" : "false";
  el.adicionalSubmit.textContent = "Salvar alterações";
  el.adicionalCancelEdit.style.display = "inline-flex";
}

async function salvarAdicional(event) {
  event.preventDefault();
  const editId = Number(el.adicionalEditId.value || "0");
  const nome = el.adicionalNome.value.trim();
  const preco = Number(el.adicionalPreco.value);
  const ativo = el.adicionalAtivo.value !== "false";

  if (!nome) throw new Error("Informe o nome do adicional.");
  if (!Number.isFinite(preco) || preco <= 0) {
    throw new Error("Informe um preço válido para o adicional.");
  }

  const payload = {
    nome,
    preco: preco.toFixed(2),
    ativo,
  };

  if (editId > 0) {
    await api(`/adicionais/${editId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  } else {
    await api("/adicionais", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  resetAdicionalForm();
  await loadAdicionais();
  showToast(editId > 0 ? "Adicional atualizado." : "Adicional criado.");
}

async function alternarAtivoAdicional(adicionalId, proximoAtivo) {
  const adicional = state.adicionais.find((row) => row.id === adicionalId);
  if (!adicional) throw new Error("Adicional não encontrado.");

  await api(`/adicionais/${adicionalId}`, {
    method: "PUT",
    body: JSON.stringify({
      nome: adicional.nome,
      preco: Number(adicional.preco).toFixed(2),
      ativo: proximoAtivo,
    }),
  });
  await loadAdicionais();
  showToast(proximoAtivo ? "Adicional reativado." : "Adicional desativado.");
}

async function excluirAdicional(adicionalId) {
  const adicional = state.adicionais.find((row) => row.id === adicionalId);
  if (!adicional) throw new Error("Adicional não encontrado.");
  const confirmar = window.confirm(
    `Excluir definitivamente '${adicional.nome}'?`
  );
  if (!confirmar) return;

  await api(`/adicionais/${adicionalId}?hard=true`, { method: "DELETE" });
  if (Number(el.adicionalEditId.value || "0") === adicionalId) {
    resetAdicionalForm();
  }
  await loadAdicionais();
  showToast("Adicional excluído.");
}

async function criarProduto(event) {
  event.preventDefault();
  const editId = Number(el.produtoEditId.value || "0");
  const uploadedImage = await uploadProdutoImagemSeNecessario();
  const payload = montarPayloadProduto(uploadedImage);

  if (editId > 0) {
    await api(`/produtos/${editId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  } else {
    await api("/produtos", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  resetProdutoForm();
  await loadProdutos();
  showToast(editId > 0 ? "Produto atualizado." : "Produto cadastrado.");
}

async function ajustarEstoqueProduto(produtoId, delta) {
  if (!produtoId || !delta) return;
  await api(`/produtos/${produtoId}/estoque`, {
    method: "PATCH",
    body: JSON.stringify({ delta }),
  });
  await loadProdutos();
  showToast(`Estoque atualizado (${delta > 0 ? `+${delta}` : delta}).`);
}

async function alternarProdutoAtivo(produtoId, proximoAtivo) {
  const produto = state.produtos.find((p) => p.id === produtoId);
  if (!produto) throw new Error("Produto não encontrado.");
  const payload = {
    nome: produto.nome,
    categoria: produto.categoria || null,
    descricao: produto.descricao || null,
    preco: Number(produto.preco).toFixed(2),
    ativo: proximoAtivo,
    estoque_atual: produto.estoque_atual,
    imagem_url: produto.imagem_url || null,
    adicional_ids: produto.adicional_ids || [],
  };
  await api(`/produtos/${produtoId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  await loadProdutos();
  showToast(proximoAtivo ? "Produto reativado." : "Produto desativado.");
}

async function excluirProdutoDefinitivo(produtoId) {
  const produto = state.produtos.find((p) => p.id === produtoId);
  if (!produto) throw new Error("Produto não encontrado.");
  const confirmou = window.confirm(
    `Excluir definitivamente '${produto.nome}'? Essa ação não pode ser desfeita.`
  );
  if (!confirmou) return;

  await api(`/produtos/${produtoId}?hard=true`, { method: "DELETE" });
  if (Number(el.produtoEditId.value || "0") === produtoId) {
    resetProdutoForm();
  }
  await loadProdutos();
  showToast("Produto excluído definitivamente.");
}

async function toggleCodigo(codigoId) {
  const code = state.codigos.find((c) => c.id === codigoId);
  if (!code) return;
  await api(`/comandas/codigos/${codigoId}`, {
    method: "PATCH",
    body: JSON.stringify({ ativo: !code.ativo }),
  });
  await loadCodigos();
  showToast("Código atualizado.");
}

async function excluirCodigo(codigoId) {
  const code = state.codigos.find((c) => c.id === codigoId);
  if (!code) return;
  const confirmou = window.confirm(
    `Excluir o código '${code.codigo}' definitivamente?`
  );
  if (!confirmou) return;
  await api(`/comandas/codigos/${codigoId}`, { method: "DELETE" });
  await loadCodigos();
  showToast("Código excluído.");
}

async function resetarComandasAtivas() {
  const confirmar = window.confirm(
    "Resetar todas as comandas da lista? Elas serao zeradas, a lista sera limpa e os codigos voltarao para LIBERADO."
  );
  if (!confirmar) return;

  const payload = await api("/comandas/resetar-ativas", {
    method: "POST",
  });

  await loadComandas();
  await loadCodigos();
  if (state.selecionada) {
    try {
      await selecionarComanda(state.selecionada.id);
    } catch (_e) {
      state.selecionada = null;
      renderSelecionada();
      await loadPagamentos();
    }
  }
  showToast(
    `Reset concluido: ${payload.comandas_resetadas} comandas e ${payload.codigos_liberados} codigos liberados.`
  );
}

async function resetarComandaIndividual(comandaId) {
  const comanda = state.comandas.find((row) => row.id === comandaId);
  if (!comanda) throw new Error("Comanda nao encontrada.");
  const confirmar = window.confirm(
    `Resetar a comanda ${comanda.comanda_codigo}? Os itens serao zerados e o codigo ficara liberado.`
  );
  if (!confirmar) return;

  const payload = await api(`/comandas/${comandaId}/reset`, { method: "POST" });
  await loadComandas();
  await loadCodigos();
  if (state.selecionada && state.selecionada.id === comandaId) {
    state.selecionada = null;
    renderSelecionada();
    await loadPagamentos();
  } else if (state.selecionada) {
    try {
      await selecionarComanda(state.selecionada.id);
    } catch (_err) {
      state.selecionada = null;
      renderSelecionada();
      await loadPagamentos();
    }
  }
  showToast(`Comanda ${payload.comanda_codigo} resetada e liberada.`);
}

async function alterarStatus(status) {
  if (!state.selecionada) throw new Error("Selecione uma comanda.");
  let reporEstoque = true;
  if (status === "CANCELADO") {
    const confirma = window.confirm("Cancelar a comanda selecionada?");
    if (!confirma) return;
    reporEstoque = window.confirm(
      "Ao cancelar, deseja readicionar os itens ao estoque?\nOK = readicionar\nCancelar = considerar itens perdidos"
    );
  }
  await api(`/comandas/${state.selecionada.id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, repor_estoque: reporEstoque }),
  });
  await loadComandas();
  try {
    await selecionarComanda(state.selecionada.id);
  } catch (_e) {
    state.selecionada = null;
    renderSelecionada();
    await loadPagamentos();
  }
  await loadCodigos();
  showToast(`Status alterado para ${statusLabel(status)}.`);
}

async function registrarPagamentoManual(event) {
  event.preventDefault();
  if (!state.selecionada) throw new Error("Selecione uma comanda.");
  const valor = toMoneyNumber(el.pagValor.value);
  if (valor <= 0) throw new Error("Informe um valor de pagamento maior que zero.");
  validarValorPagamentoExato(valor);
  await api("/pagamentos", {
    method: "POST",
    body: JSON.stringify({
      pedido_id: state.selecionada.id,
      metodo: el.pagMetodo.value,
      valor: valor.toFixed(2),
    }),
  });
  el.pagamentoForm.reset();
  refreshPixPanel();
  resetQuickPayTarget("pag");
  await selecionarComanda(state.selecionada.id);
  showToast("Pagamento registrado.");
}

async function limparComandaSelecionada() {
  if (!state.selecionada) throw new Error("Selecione uma comanda.");
  const saldo = Number(state.selecionada.pagamento?.saldo_pendente || 0);
  const codigo = state.selecionada.comanda_codigo || `#${state.selecionada.id}`;
  const confirmar = window.confirm(
    saldo > 0
      ? `A comanda ${codigo} ainda tem saldo pendente de R$ ${fmtMoney(saldo)}. Limpar mesmo assim?`
      : `Limpar a comanda ${codigo}?`
  );
  if (!confirmar) return;
  if (saldo > 0) {
    const chave = window.prompt("Para confirmar, digite LIMPAR");
    if (chave !== "LIMPAR") return;
  }
  await api(`/comandas/${state.selecionada.id}/reset`, { method: "POST" });
  state.selecionada = null;
  renderSelecionada();
  await loadPagamentos();
  await loadComandas();
  await loadCodigos();
  showToast("Comanda limpa e codigo liberado.");
}

async function iniciarMaquininha(event) {
  event.preventDefault();
  if (!state.selecionada) throw new Error("Selecione uma comanda.");
  const valor = toMoneyNumber(el.maqValor.value);
  if (valor <= 0) throw new Error("Informe um valor de pagamento maior que zero.");
  validarValorPagamentoExato(valor);
  await api("/pagamentos/maquininha/iniciar", {
    method: "POST",
    body: JSON.stringify({
      pedido_id: state.selecionada.id,
      metodo: el.maqMetodo.value,
      valor: valor.toFixed(2),
      maquininha_id: el.maqId.value.trim() || null,
    }),
  });
  el.maqForm.reset();
  resetQuickPayTarget("maq");
  await selecionarComanda(state.selecionada.id);
  showToast("Transação enviada para maquininha.");
}

async function confirmarMaquininha(pagamentoId, aprovado) {
  await api(`/pagamentos/maquininha/${pagamentoId}/confirmar`, {
    method: "PATCH",
    body: JSON.stringify({ aprovado }),
  });
  if (state.selecionada) {
    await selecionarComanda(state.selecionada.id);
  }
  showToast(aprovado ? "Pagamento aprovado." : "Pagamento recusado.");
}

function imprimirCupom() {
  if (!state.selecionada) throw new Error("Selecione uma comanda.");
  window.open(`/comandas/${state.selecionada.id}/cupom`, "_blank", "noopener");
}

async function excluirComandaSelecionada() {
  if (!state.selecionada) throw new Error("Selecione uma comanda.");
  const id = state.selecionada.id;
  const codigo = state.selecionada.comanda_codigo || `#${id}`;
  const confirmar = window.confirm(
    `Excluir a comanda ${codigo} definitivamente?`
  );
  if (!confirmar) return;

  const payload = await api(`/comandas/${id}`, { method: "DELETE" });
  state.selecionada = null;
  renderSelecionada();
  await loadPagamentos();
  await loadComandas();
  await loadCodigos();
  if (state.comandas.length) {
    await selecionarComanda(state.comandas[0].id);
  }
  showToast(
    `Comanda excluída (${payload.itens_removidos} itens, ${payload.pagamentos_removidos} pagamentos).`
  );
}

async function forcarRetiradaItemNoPagamento(itemId, reporEstoque) {
  if (!state.selecionada) throw new Error("Selecione uma comanda.");
  const item = (state.selecionada.itens || []).find((row) => row.id === itemId);
  if (!item) throw new Error("Item não encontrado na comanda selecionada.");
  const confirmacao = window.prompt(
    `Confirme a retirada de '${item.produto_nome}' digitando REMOVER`
  );
  if (confirmacao !== "REMOVER") return;
  await api(
    `/comandas/${state.selecionada.id}/itens/${itemId}/forcar?repor_estoque=${reporEstoque ? "true" : "false"}`,
    { method: "DELETE" }
  );
  await selecionarComanda(state.selecionada.id);
  await loadComandas();
  showToast(reporEstoque ? "Item removido e estoque reposto." : "Item removido como perdido.");
}

function renderFechamento(data) {
  el.fcTotalPedidos.textContent = String(data.total_pedidos);
  el.fcTotalVendido.textContent = `R$ ${fmtMoney(data.total_vendido)}`;
  el.fcTotalRecebido.textContent = `R$ ${fmtMoney(data.total_recebido)}`;
  el.fcTicketMedio.textContent = `R$ ${fmtMoney(data.ticket_medio)}`;

  el.fcMetodos.innerHTML = "";
  Object.keys(data.pagamentos_por_metodo || {}).forEach((metodo) => {
    const li = document.createElement("li");
    li.textContent = `${metodo}: R$ ${fmtMoney(data.pagamentos_por_metodo[metodo])}`;
    el.fcMetodos.appendChild(li);
  });
}

function renderFaturamentoPeriodo(data) {
  el.ftTotalPedidos.textContent = String(data.total_pedidos || 0);
  el.ftTotalVendido.textContent = `R$ ${fmtMoney(data.total_vendido)}`;
  el.ftTotalRecebido.textContent = `R$ ${fmtMoney(data.total_recebido)}`;
  el.ftTicketMedio.textContent = `R$ ${fmtMoney(data.ticket_medio)}`;

  el.ftMetodos.innerHTML = "";
  Object.keys(data.pagamentos_por_metodo || {}).forEach((metodo) => {
    const li = document.createElement("li");
    li.textContent = `${metodo}: R$ ${fmtMoney(data.pagamentos_por_metodo[metodo])}`;
    el.ftMetodos.appendChild(li);
  });

  el.ftDiasList.innerHTML = "";
  const dias = data.dias || [];
  if (!dias.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Sem dados no período.";
    el.ftDiasList.appendChild(empty);
    return;
  }

  dias.forEach((dia) => {
    const dataTxt = new Date(`${dia.data}T00:00:00`).toLocaleDateString("pt-BR");
    const row = document.createElement("div");
    row.className = "fat-dia-row";
    row.innerHTML = `
      <strong>${dataTxt}</strong>
      <span>Pedidos: ${dia.total_pedidos} (${dia.pedidos_cancelados} cancelados)</span>
      <span>Vendido: R$ ${fmtMoney(dia.total_vendido)}</span>
      <span>Recebido: R$ ${fmtMoney(dia.total_recebido)}</span>
    `;
    el.ftDiasList.appendChild(row);
  });
}

async function carregarFechamento(event) {
  event.preventDefault();
  const data = el.fechamentoData.value;
  if (!data) throw new Error("Informe a data.");
  state.fechamentoData = data;
  const payload = await api(`/relatorios/fechamento-caixa?data=${data}`);
  renderFechamento(payload);
  showToast("Fechamento carregado.");
}

async function carregarFaturamentoPeriodo(event) {
  event.preventDefault();
  const { dataInicial, dataFinal } = getPeriodoFaturamentoSelecionado();
  state.faturamentoDataInicial = dataInicial;
  state.faturamentoDataFinal = dataFinal;
  const payload = await api(
    `/relatorios/faturamento-periodo?data_inicial=${dataInicial}&data_final=${dataFinal}`
  );
  renderFaturamentoPeriodo(payload);
  showToast("Faturamento do período carregado.");
}

function exportarCsv() {
  const data = state.fechamentoData || el.fechamentoData.value;
  if (!data) throw new Error("Informe a data para exportar.");
  window.open(`/relatorios/fechamento-caixa.csv?data=${data}`, "_blank", "noopener");
}

function getPeriodoFaturamentoSelecionado() {
  const dataInicial = state.faturamentoDataInicial || el.faturamentoDataInicial.value;
  const dataFinal = state.faturamentoDataFinal || el.faturamentoDataFinal.value;
  if (!dataInicial || !dataFinal) {
    throw new Error("Informe data inicial e data final.");
  }
  return { dataInicial, dataFinal };
}

function exportarCsvPeriodo() {
  const { dataInicial, dataFinal } = getPeriodoFaturamentoSelecionado();
  window.open(
    `/relatorios/faturamento-periodo.csv?data_inicial=${dataInicial}&data_final=${dataFinal}`,
    "_blank",
    "noopener"
  );
}

function exportarRelatorioPeriodo() {
  const { dataInicial, dataFinal } = getPeriodoFaturamentoSelecionado();
  window.open(
    `/relatorios/faturamento-periodo/relatorio?data_inicial=${dataInicial}&data_final=${dataFinal}`,
    "_blank",
    "noopener"
  );
}

function normalizeUIOptions(payload = {}) {
  const theme = payload.theme === "dark" ? "dark" : "light";
  const density = payload.density === "compact" ? "compact" : "comfortable";
  const fontSize = ["small", "normal", "large"].includes(payload.fontSize)
    ? payload.fontSize
    : "normal";
  const radius = ["sharp", "normal", "round"].includes(payload.radius)
    ? payload.radius
    : "normal";
  const motion = payload.motion !== false;
  const contrast = payload.contrast === "high" ? "high" : "normal";
  const layout = payload.layout === "boxed" ? "boxed" : "full";
  const showIcons = payload.showIcons !== false;
  return { theme, density, fontSize, radius, motion, contrast, layout, showIcons };
}

function collectUIOptionsFromForm() {
  if (
    !el.uiTheme ||
    !el.uiDensity ||
    !el.uiFontSize ||
    !el.uiRadius ||
    !el.uiContrast ||
    !el.uiLayout ||
    !el.uiMotion ||
    !el.uiShowIcons
  ) {
    return { ...state.uiOptions };
  }
  return normalizeUIOptions({
    theme: el.uiTheme.value,
    density: el.uiDensity.value,
    fontSize: el.uiFontSize.value,
    radius: el.uiRadius.value,
    contrast: el.uiContrast.value,
    layout: el.uiLayout.value,
    motion: Boolean(el.uiMotion.checked),
    showIcons: Boolean(el.uiShowIcons.checked),
  });
}

function fillUIOptionsForm(options) {
  if (
    !el.uiTheme ||
    !el.uiDensity ||
    !el.uiFontSize ||
    !el.uiRadius ||
    !el.uiContrast ||
    !el.uiLayout ||
    !el.uiMotion ||
    !el.uiShowIcons
  ) {
    return;
  }
  el.uiTheme.value = options.theme;
  el.uiDensity.value = options.density;
  el.uiFontSize.value = options.fontSize;
  el.uiRadius.value = options.radius;
  el.uiContrast.value = options.contrast;
  el.uiLayout.value = options.layout;
  el.uiMotion.checked = options.motion;
  el.uiShowIcons.checked = options.showIcons;
}

function applyUIOptions(options, { persist = true, syncForm = true } = {}) {
  const next = normalizeUIOptions(options);
  state.uiOptions = next;
  state.theme = next.theme;
  document.body.setAttribute("data-theme", next.theme);
  document.body.setAttribute("data-density", next.density);
  document.body.setAttribute("data-font-size", next.fontSize);
  document.body.setAttribute("data-radius", next.radius);
  document.body.setAttribute("data-motion", next.motion ? "on" : "off");
  document.body.setAttribute("data-contrast", next.contrast);
  document.body.setAttribute("data-layout", next.layout);
  document.body.setAttribute("data-icons", next.showIcons ? "on" : "off");
  if (persist) {
    localStorage.setItem("padaria_caixa_ui_options", JSON.stringify(next));
  }
  if (syncForm) {
    fillUIOptionsForm(next);
  }
}

function loadUIOptions() {
  let parsed = null;
  try {
    const raw = localStorage.getItem("padaria_caixa_ui_options");
    parsed = raw ? JSON.parse(raw) : null;
  } catch (_err) {
    parsed = null;
  }
  applyUIOptions(parsed || DEFAULT_UI_OPTIONS, { persist: false, syncForm: true });
}

function applyUIOptionsFromForm() {
  const payload = collectUIOptionsFromForm();
  applyUIOptions(payload);
}

function resetUIOptions() {
  applyUIOptions(DEFAULT_UI_OPTIONS, { persist: true, syncForm: true });
  showToast("Aparência restaurada para o padrão.");
}

function applyUIPreset(name) {
  const preset = UI_PRESETS[name];
  if (!preset) return;
  applyUIOptions(preset, { persist: true, syncForm: true });
  showToast(`Preset '${name}' aplicado.`);
}

function applyColorPalette(name) {
  const palette = COLOR_PALETTES[name];
  if (
    !palette ||
    !el.cfgCorPrimaria ||
    !el.cfgCorSecundaria ||
    !el.cfgCorTopoPrimaria ||
    !el.cfgCorTopoSecundaria
  ) {
    return;
  }
  el.cfgCorPrimaria.value = palette.cor_primaria;
  el.cfgCorSecundaria.value = palette.cor_secundaria;
  el.cfgCorTopoPrimaria.value = palette.cor_topo_primaria;
  el.cfgCorTopoSecundaria.value = palette.cor_topo_secundaria;
  applyColors(palette);
  showToast(`Paleta '${name}' aplicada.`);
}

function applyTheme(theme) {
  applyUIOptions({ ...state.uiOptions, theme }, { persist: true, syncForm: true });
}

function toggleTheme() {
  applyTheme(state.theme === "dark" ? "light" : "dark");
}

function loadTheme() {
  loadUIOptions();
}

function openPanelById(panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  setActiveTab(tabFromPanelId(panelId));
  panel.open = true;
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function run(action) {
  try {
    await action();
  } catch (error) {
    showToast(error.message || "Erro inesperado.", true);
  }
}

function on(node, eventName, handler) {
  if (node) {
    node.addEventListener(eventName, handler);
  }
}

function enableAccordion() {
  const panels = document.querySelectorAll("details.panel");
  panels.forEach((panel) => {
    panel.addEventListener("toggle", () => {
      if (!panel.open) return;
      panels.forEach((other) => {
        if (other !== panel) {
          other.open = false;
        }
      });
    });
  });
}

function bindQuickPayItemContainer(container, target) {
  if (!container) return;

  container.addEventListener("click", (event) => {
    const allBtn = event.target.closest(`button[data-quick-pay-all="${target}"]`);
    if (allBtn) {
      setQuickPayItemsSelection(target, getComandaItemIds());
      renderQuickPayItems(target);
      return;
    }

    const clearBtn = event.target.closest(`button[data-quick-pay-clear="${target}"]`);
    if (clearBtn) {
      setQuickPayItemsSelection(target, []);
      renderQuickPayItems(target);
    }
  });

  container.addEventListener("change", (event) => {
    const checkbox = event.target.closest(
      `input[data-quick-pay-item-target="${target}"][data-quick-pay-item-id]`
    );
    if (!checkbox) return;
    const selectedIds = Array.from(
      container.querySelectorAll(`input[data-quick-pay-item-target="${target}"]:checked`)
    )
      .map((node) => Number(node.dataset.quickPayItemId))
      .filter((id) => id > 0);
    setQuickPayItemsSelection(target, selectedIds);
  });
}

function bindQuickPayCore() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-quick-pay-target][data-quick-pay-mode]");
    if (!button) return;
    const target = button.dataset.quickPayTarget;
    const mode = button.dataset.quickPayMode;
    applyQuickPayMode(target, mode);
  });

  bindQuickPayItemContainer(el.quickPayItemsPag, "pag");
  bindQuickPayItemContainer(el.quickPayItemsMaq, "maq");
  on(el.pagValor, "input", () => {
    setQuickPayCustomMode("pag");
    refreshPixPanel();
  });
  on(el.maqValor, "input", () => setQuickPayCustomMode("maq"));
}

function bind() {
  el.tabButtons.forEach((button) => {
    button.addEventListener("click", () => setActiveTab(button.dataset.tab));
  });
  el.openPanelButtons.forEach((btn) => {
    btn.addEventListener("click", () => openPanelById(btn.dataset.openPanel));
  });
  on(el.codigoForm, "submit", (event) => run(() => criarCodigo(event)));
  on(el.produtoForm, "submit", (event) => run(() => criarProduto(event)));
  on(el.produtoCancelEdit, "click", () => resetProdutoForm());
  on(el.adicionalForm, "submit", (event) => run(() => salvarAdicional(event)));
  on(el.adicionalCancelEdit, "click", () => resetAdicionalForm());
  on(el.buscarProdutos, "click", () => run(loadProdutos));
  on(el.limparProdutos, "click", () => run(async () => {
    limparFiltrosProdutos();
    await loadProdutos();
  }));
  [el.produtoBusca, el.produtoFiltroAtivo, el.produtoFiltroCategoria].filter(Boolean).forEach((control) => {
    control.addEventListener("change", () => run(loadProdutos));
  });
  on(el.produtoBusca, "keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      run(loadProdutos);
    }
  });
  on(el.produtoFiltroCategoria, "keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      run(loadProdutos);
    }
  });
  on(el.produtoImagem, "input", updateProdutoImagemPreview);
  on(el.produtoImagemFile, "change", updateProdutoImagemPreview);
  on(el.mobileMaisPedidosForm, "submit", (event) => run(() => adicionarMobileMaisPedidoCustom(event)));
  on(el.mobileMaisPedidoProduto, "change", () => {
    if (!el.mobileMaisPedidoNome || el.mobileMaisPedidoNome.value.trim()) return;
    const produtoId = Number(el.mobileMaisPedidoProduto.value || "0");
    const produto = state.produtos.find((row) => row.id === produtoId);
    if (produto) {
      el.mobileMaisPedidoNome.value = produto.nome;
    }
  });
  on(el.mobileMaisPedidosLimpar, "click", () => run(() => limparMobileMaisPedidosCustom()));
  on(el.mobileMaisPedidosList, "click", (event) => {
    const removeBtn = event.target.closest("button[data-mobile-mais-pedido-remove]");
    if (!removeBtn) return;
    run(() => removerMobileMaisPedidoCustom(Number(removeBtn.dataset.mobileMaisPedidoRemove)));
  });
  on(el.buscarComandas, "click", () => run(refreshComandasESelecionada));
  on(el.refreshComandas, "click", () => run(refreshComandasESelecionada));
  on(el.resetarComandas, "click", () => run(() => resetarComandasAtivas()));
  on(el.comandasList, "click", (event) => {
    const resetBtn = event.target.closest("button[data-reset-comanda]");
    if (resetBtn) {
      run(() => resetarComandaIndividual(Number(resetBtn.dataset.resetComanda)));
      return;
    }
    const selectBtn = event.target.closest("button[data-select-comanda]");
    if (selectBtn) {
      run(() => selecionarComanda(Number(selectBtn.dataset.selectComanda)));
    }
  });
  on(el.tempoRealToggle, "click", () => toggleRealtime());
  on(el.limparFiltros, "click", () => run(async () => {
    limparFiltrosComandas();
    await refreshComandasESelecionada();
  }));
  [el.filtroCodigo, el.filtroMesa, el.filtroStatus, el.filtroTipoEntrega, el.filtroDataInicial, el.filtroDataFinal, el.filtroTotalMin, el.filtroTotalMax, el.filtroOrdemCampo, el.filtroOrdemDirecao]
    .filter(Boolean)
    .forEach((control) => control.addEventListener("change", () => run(refreshComandasESelecionada)));
  on(el.filtroCodigo, "keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      run(refreshComandasESelecionada);
    }
  });
  on(el.filtroMesa, "keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      run(refreshComandasESelecionada);
    }
  });
  el.statusButtons.forEach((button) => {
    button.addEventListener("click", () => run(() => alterarStatus(button.dataset.status)));
  });
  on(el.printCupom, "click", () => run(() => imprimirCupom()));
  on(el.limparComanda, "click", () => run(() => limparComandaSelecionada()));
  on(el.goPagamento, "click", () => irParaPagamentoDaComandaSelecionada());
  on(el.deleteComanda, "click", () => run(() => excluirComandaSelecionada()));
  on(el.pagamentoForm, "submit", (event) => run(() => registrarPagamentoManual(event)));
  on(el.maqForm, "submit", (event) => run(() => iniciarMaquininha(event)));
  on(el.pagMetodo, "change", refreshPixPanel);
  on(el.pixCopy, "click", () => run(() => copyPixCode()));
  on(el.fechamentoForm, "submit", (event) => run(() => carregarFechamento(event)));
  on(el.faturamentoForm, "submit", (event) => run(() => carregarFaturamentoPeriodo(event)));
  on(el.exportarCsv, "click", () => run(() => exportarCsv()));
  on(el.exportarCsvPeriodo, "click", () => run(() => exportarCsvPeriodo()));
  on(el.exportarRelatorioPeriodo, "click", () => run(() => exportarRelatorioPeriodo()));
  [el.uiTheme, el.uiDensity, el.uiFontSize, el.uiRadius, el.uiContrast, el.uiLayout, el.uiMotion, el.uiShowIcons]
    .filter(Boolean)
    .forEach((control) => {
      control.addEventListener("change", () => {
        applyUIOptionsFromForm();
      });
    });
  on(el.uiOptionsForm, "click", (event) => {
    const button = event.target.closest("button[data-ui-preset]");
    if (!button) return;
    applyUIPreset(button.dataset.uiPreset);
  });
  on(el.uiOptionsReset, "click", () => resetUIOptions());
  on(el.configForm, "submit", (event) => run(() => saveERPConfig(event)));
  on(el.configForm, "click", (event) => {
    const paletteButton = event.target.closest("button[data-cfg-palette]");
    if (!paletteButton) return;
    applyColorPalette(paletteButton.dataset.cfgPalette);
  });
  on(el.cfgReload, "click", () => run(() => loadERPConfig({ notify: true })));
  on(el.cfgReset, "click", () => run(() => resetERPConfig()));
  on(el.cfgPermitirStatusPronto, "change", () => {
    toggleProntoVisibility(Boolean(el.cfgPermitirStatusPronto.checked));
  });
  [el.cfgCorPrimaria, el.cfgCorSecundaria, el.cfgCorTopoPrimaria, el.cfgCorTopoSecundaria]
    .filter(Boolean)
    .forEach((input) => {
      input.addEventListener("input", () => {
        applyColors({
          cor_primaria: normalizeHexColor(el.cfgCorPrimaria.value, state.erpConfig.cor_primaria),
          cor_secundaria: normalizeHexColor(
            el.cfgCorSecundaria.value,
            state.erpConfig.cor_secundaria
          ),
          cor_topo_primaria: normalizeHexColor(
            el.cfgCorTopoPrimaria.value,
            state.erpConfig.cor_topo_primaria
          ),
          cor_topo_secundaria: normalizeHexColor(
            el.cfgCorTopoSecundaria.value,
            state.erpConfig.cor_topo_secundaria
          ),
        });
      });
    });

  on(el.codigosList, "click", (event) => {
    const btn = event.target.closest("button[data-toggle-codigo]");
    if (btn) {
      run(() => toggleCodigo(Number(btn.dataset.toggleCodigo)));
      return;
    }
    const delBtn = event.target.closest("button[data-delete-codigo]");
    if (delBtn) {
      run(() => excluirCodigo(Number(delBtn.dataset.deleteCodigo)));
    }
  });

  on(el.adicionaisList, "click", (event) => {
    const edit = event.target.closest("button[data-adicional-edit]");
    if (edit) {
      run(() => preencherFormAdicionalParaEdicao(Number(edit.dataset.adicionalEdit)));
      return;
    }
    const toggle = event.target.closest("button[data-adicional-toggle]");
    if (toggle) {
      run(() => alternarAtivoAdicional(
        Number(toggle.dataset.adicionalToggle),
        toggle.dataset.nextAtivo === "true"
      ));
      return;
    }
    const del = event.target.closest("button[data-adicional-delete]");
    if (del) {
      run(() => excluirAdicional(Number(del.dataset.adicionalDelete)));
    }
  });

  on(el.produtosList, "click", (event) => {
    const ajuste = event.target.closest("button[data-produto-delta]");
    if (ajuste) {
      run(() => ajustarEstoqueProduto(Number(ajuste.dataset.produtoDelta), Number(ajuste.dataset.delta)));
      return;
    }
    const edit = event.target.closest("button[data-produto-edit]");
    if (edit) {
      run(async () => {
        preencherFormProdutoParaEdicao(Number(edit.dataset.produtoEdit));
      });
      return;
    }
    const toggle = event.target.closest("button[data-produto-toggle-ativo]");
    if (toggle) {
      run(() => alternarProdutoAtivo(
        Number(toggle.dataset.produtoToggleAtivo),
        toggle.dataset.nextAtivo === "true"
      ));
      return;
    }
    const deleteBtn = event.target.closest("button[data-produto-delete]");
    if (deleteBtn) {
      run(() => excluirProdutoDefinitivo(Number(deleteBtn.dataset.produtoDelete)));
    }
  });

  on(el.pagamentosList, "click", (event) => {
    const approve = event.target.closest("button[data-approve]");
    if (approve) {
      run(() => confirmarMaquininha(Number(approve.dataset.approve), true));
      return;
    }
    const reject = event.target.closest("button[data-reject]");
    if (reject) {
      run(() => confirmarMaquininha(Number(reject.dataset.reject), false));
    }
  });

  on(el.pagamentoItensList, "click", (event) => {
    const removeBtn = event.target.closest("button[data-force-remove-item]");
    if (!removeBtn) return;
    const itemId = Number(removeBtn.dataset.forceRemoveItem);
    const reporEstoque = removeBtn.dataset.restock !== "false";
    run(() => forcarRetiradaItemNoPagamento(itemId, reporEstoque));
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  loadTheme();
  loadActiveTab();
  enableAccordion();
  setDefaultDate();
  bindQuickPayCore();
  bind();
  await run(() => loadERPConfig());
  refreshPixPanel();
  refreshQuickPayAll();
  updateRealtimeStatusLabel();
  startRealtime();
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      run(tickRealtime);
    }
  });
  resetProdutoForm();
  resetAdicionalForm();
  await run(loadAdicionais);
  await run(loadProdutos);
  await run(refreshComandasESelecionada);
  await run(() => carregarFechamento(new Event("submit")));
  await run(() => carregarFaturamentoPeriodo(new Event("submit")));
});



