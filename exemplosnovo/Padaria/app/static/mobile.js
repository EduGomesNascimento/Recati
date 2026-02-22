const DEFAULT_ERP_CONFIG = Object.freeze({
  empresa_nome: "PadariaERP",
  empresa_subtitulo: "Anotação de pedido",
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
    "Pedido não saiu completo",
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
  catalogCompact: false,
  contrast: "normal",
  layout: "full",
  showIcons: true,
});

const MOBILE_UI_PRESETS = Object.freeze({
  padrao: { ...DEFAULT_UI_OPTIONS },
  balcao: {
    theme: "dark",
    density: "compact",
    fontSize: "normal",
    radius: "sharp",
    motion: false,
    catalogCompact: false,
    contrast: "high",
    layout: "full",
    showIcons: false,
  },
  toque: {
    theme: "dark",
    density: "comfortable",
    fontSize: "large",
    radius: "round",
    motion: true,
    catalogCompact: false,
    contrast: "normal",
    layout: "full",
    showIcons: true,
  },
  catalogo: {
    theme: "light",
    density: "compact",
    fontSize: "small",
    radius: "normal",
    motion: true,
    catalogCompact: true,
    contrast: "normal",
    layout: "boxed",
    showIcons: true,
  },
});

const state = {
  codigos: [],
  produtos: [],
  adicionais: [],
  sugestoes: [],
  comandas: [],
  painelComandas: [],
  painelFiltroStatus: "EM_PREPARO",
  historicoCupons: [],
  erpConfig: { ...DEFAULT_ERP_CONFIG },
  uiOptions: { ...DEFAULT_UI_OPTIONS },
  selecionada: null,
  itemEditId: null,
  catalogQuickQty: {},
  anotando: false,
  ajusteFinoAberto: false,
  theme: "light",
  activeTab: "pedidos",
  realtime: {
    enabled: true,
    intervalMs: 5000,
    timerId: null,
    busy: false,
  },
};

const el = {
  appFavicon: document.getElementById("app-favicon"),
  brandAppName: document.getElementById("brand-app-name"),
  brandPageTitle: document.getElementById("brand-page-title"),
  brandFooterLogo: document.getElementById("brand-footer-logo"),
  brandFooterText: document.getElementById("brand-footer-text"),
  toast: document.getElementById("toast"),
  tabButtons: document.querySelectorAll(".mobile-tab-btn[data-tab]"),
  tabPanels: document.querySelectorAll(".mobile-tab-panel[data-tab-panel]"),
  menuToggle: document.getElementById("menu-toggle"),
  sidebar: document.getElementById("sidebar"),
  sidebarClose: document.getElementById("sidebar-close"),
  sidebarBackdrop: document.getElementById("sidebar-backdrop"),
  abrirSidebar: document.getElementById("abrir-sidebar"),
  abrirSidebarClose: document.getElementById("abrir-sidebar-close"),
  abrirSidebarBackdrop: document.getElementById("abrir-sidebar-backdrop"),
  openAbrirSidebar: document.getElementById("open-abrir-sidebar"),
  abrirComandaForm: document.getElementById("abrir-comanda-form"),
  codigoComanda: document.getElementById("codigo-comanda"),
  tipoEntrega: document.getElementById("tipo-entrega"),
  mesaComanda: document.getElementById("mesa-comanda"),
  obsComanda: document.getElementById("obs-comanda"),
  comandaSearch: document.getElementById("comanda-search"),
  comandaSelecionadaAlert: document.getElementById("comanda-selecionada-alert"),
  comandaAtivaSelect: document.getElementById("comanda-ativa-select"),
  usarComandaBtn: document.getElementById("usar-comanda-btn"),
  refreshComandasBtn: document.getElementById("refresh-comandas-btn"),
  painelComandasSearch: document.getElementById("painel-comandas-search"),
  painelComandasRefresh: document.getElementById("painel-comandas-refresh"),
  painelComandasFiltros: document.getElementById("painel-comandas-filtros"),
  painelComandasGrid: document.getElementById("painel-comandas-grid"),
  entregaControlList: document.getElementById("entrega-control-list"),
  comandaUsoCard: document.getElementById("comanda-uso-card"),
  selCodigo: document.getElementById("sel-codigo"),
  selMesa: document.getElementById("sel-mesa"),
  selComplexidade: document.getElementById("sel-complexidade"),
  selMesaSide: document.getElementById("sel-mesa-side"),
  selComplexidadeSide: document.getElementById("sel-complexidade-side"),
  selTotalItens: document.getElementById("sel-total-itens"),
  selStatus: document.getElementById("sel-status"),
  selTotal: document.getElementById("sel-total"),
  selPago: document.getElementById("sel-pago"),
  selSaldo: document.getElementById("sel-saldo"),
  statusButtons: document.querySelectorAll(".status-actions button[data-status]"),
  printCupom: document.getElementById("print-cupom"),
  finalizarImprimir: document.getElementById("finalizar-imprimir"),
  anotacaoCard: document.getElementById("anotacao-card"),
  stopAnotacaoBtn: document.getElementById("stop-anotacao-btn"),
  anotacaoLockMessage: document.getElementById("anotacao-lock-message"),
  produtoSearch: document.getElementById("produto-search"),
  sugestoesMaisPedidos: document.getElementById("sugestoes-mais-pedidos"),
  catalogoProdutos: document.getElementById("catalogo-produtos"),
  ajusteFinoSection: document.getElementById("ajuste-fino-section"),
  itemForm: document.getElementById("item-form"),
  itemFormTitle: document.getElementById("item-form-title"),
  itemFormMode: document.getElementById("item-form-mode"),
  itemSubmitBtn: document.getElementById("item-submit-btn"),
  itemCancelEdit: document.getElementById("item-cancel-edit"),
  produtoId: document.getElementById("produto-id"),
  produtoSelecionadoNome: document.getElementById("produto-selecionado-nome"),
  produtoSelecionadoTotal: document.getElementById("produto-selecionado-total"),
  itemQtd: document.getElementById("item-qtd"),
  itemDesconto: document.getElementById("item-desconto"),
  itemObs: document.getElementById("item-obs"),
  itemValorFinal: document.getElementById("item-valor-final"),
  adicionaisBox: document.getElementById("adicionais-box"),
  itensCard: document.getElementById("itens-card"),
  itensTotalNota: document.getElementById("itens-total-nota"),
  itensList: document.getElementById("itens-list"),
  historicoRefresh: document.getElementById("historico-refresh"),
  historicoSearch: document.getElementById("historico-search"),
  historicoList: document.getElementById("historico-list"),
  obsRapidas: document.getElementById("obs-rapidas"),
  mobileOptionsForm: document.getElementById("mobile-options-form"),
  mobileUiTheme: document.getElementById("mobile-ui-theme"),
  mobileUiDensity: document.getElementById("mobile-ui-density"),
  mobileUiFontSize: document.getElementById("mobile-ui-font-size"),
  mobileUiRadius: document.getElementById("mobile-ui-radius"),
  mobileUiContrast: document.getElementById("mobile-ui-contrast"),
  mobileUiLayout: document.getElementById("mobile-ui-layout"),
  mobileUiMotion: document.getElementById("mobile-ui-motion"),
  mobileUiCatalogCompact: document.getElementById("mobile-ui-catalog-compact"),
  mobileUiShowIcons: document.getElementById("mobile-ui-show-icons"),
  mobileUiReset: document.getElementById("mobile-ui-reset"),
  confirmCheckDialog: document.getElementById("confirm-check-dialog"),
  confirmCheckTitle: document.getElementById("confirm-check-title"),
  confirmCheckMessage: document.getElementById("confirm-check-message"),
  confirmCheckBox: document.getElementById("confirm-check-box"),
  confirmCheckLabel: document.getElementById("confirm-check-label"),
  confirmCheckReasons: document.getElementById("confirm-check-reasons"),
  confirmCheckReasonsTitle: document.getElementById("confirm-check-reasons-title"),
  confirmCheckReasonsList: document.getElementById("confirm-check-reasons-list"),
  confirmCheckCancel: document.getElementById("confirm-check-cancel"),
  confirmCheckConfirm: document.getElementById("confirm-check-confirm"),
};

const money = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const STATUS_EDITAVEIS_ITENS = new Set(["ABERTO", "EM_PREPARO", "PRONTO"]);
const STATUS_PAINEL_EDITAVEL = new Set(["ABERTO", "EM_PREPARO", "PRONTO"]);
const PRODUTOS_PAGE_SIZE = 500;
const PRODUTOS_MAX_MOBILE = 5000;
const ADICIONAIS_PAGE_SIZE = 500;
const ADICIONAIS_MAX_MOBILE = 3000;
const CATALOG_QUICK_QTY_MIN = 1;
const CATALOG_QUICK_QTY_MAX = 99;
const CATALOG_QUICK_QTY_DEFAULT = 1;

function showToast(msg, error = false) {
  el.toast.textContent = msg;
  el.toast.style.background = error ? "#891d1f" : "#1c7c49";
  el.toast.classList.add("show");
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => el.toast.classList.remove("show"), 2300);
}

function confirmWithCheckbox({
  title = "Confirmar ação",
  message = "Confirme para continuar.",
  checkboxLabel = "Confirmo que desejo continuar.",
  confirmText = "Confirmar",
  reasonsTitle = "Selecione o motivo:",
  reasonOptions = [],
  requireReason = false,
} = {}) {
  if (
    !el.confirmCheckDialog ||
    !el.confirmCheckTitle ||
    !el.confirmCheckMessage ||
    !el.confirmCheckBox ||
    !el.confirmCheckLabel ||
    !el.confirmCheckReasons ||
    !el.confirmCheckReasonsTitle ||
    !el.confirmCheckReasonsList ||
    !el.confirmCheckCancel ||
    !el.confirmCheckConfirm ||
    typeof el.confirmCheckDialog.showModal !== "function"
  ) {
    const accepted = window.confirm(message);
    return Promise.resolve({ confirmed: accepted, reasons: [] });
  }

  return new Promise((resolve) => {
    const dialog = el.confirmCheckDialog;
    if (dialog.open) {
      dialog.close("cancel");
    }

    const options = Array.isArray(reasonOptions) ? reasonOptions : [];
    el.confirmCheckTitle.textContent = title;
    el.confirmCheckMessage.textContent = message;
    el.confirmCheckLabel.textContent = checkboxLabel;
    el.confirmCheckConfirm.textContent = confirmText;
    el.confirmCheckBox.checked = false;
    el.confirmCheckReasonsTitle.textContent = reasonsTitle;
    el.confirmCheckReasonsList.innerHTML = "";

    if (options.length) {
      el.confirmCheckReasons.classList.remove("is-hidden");
      options.forEach((item, index) => {
        const texto = String(item || "").trim();
        if (!texto) return;
        const id = `confirm-check-reason-${index}`;
        const row = document.createElement("label");
        row.innerHTML = `
          <input type="checkbox" id="${id}" value="${texto}" data-confirm-reason>
          <span>${texto}</span>
        `;
        el.confirmCheckReasonsList.appendChild(row);
      });
    } else {
      el.confirmCheckReasons.classList.add("is-hidden");
    }

    const getSelectedReasons = () =>
      Array.from(el.confirmCheckReasonsList.querySelectorAll("input[data-confirm-reason]:checked"))
        .map((node) => String(node.value || "").trim())
        .filter(Boolean);

    const updateConfirmState = () => {
      const okByCheck = Boolean(el.confirmCheckBox.checked);
      const okByReason = !requireReason || getSelectedReasons().length > 0;
      el.confirmCheckConfirm.disabled = !(okByCheck && okByReason);
    };
    updateConfirmState();

    const cleanup = () => {
      dialog.removeEventListener("close", onClose);
      el.confirmCheckBox.removeEventListener("change", onToggle);
      el.confirmCheckReasonsList.removeEventListener("change", onReasonsChange);
      el.confirmCheckCancel.removeEventListener("click", onCancel);
      el.confirmCheckConfirm.removeEventListener("click", onConfirm);
      el.confirmCheckReasonsList.innerHTML = "";
    };

    const onClose = () => {
      const accepted = dialog.returnValue === "confirm";
      const reasons = accepted ? getSelectedReasons() : [];
      cleanup();
      resolve({ confirmed: accepted, reasons });
    };

    const onToggle = () => updateConfirmState();
    const onReasonsChange = () => updateConfirmState();

    const onCancel = () => dialog.close("cancel");
    const onConfirm = () => {
      if (el.confirmCheckConfirm.disabled) return;
      dialog.close("confirm");
    };

    dialog.addEventListener("close", onClose);
    el.confirmCheckBox.addEventListener("change", onToggle);
    el.confirmCheckReasonsList.addEventListener("change", onReasonsChange);
    el.confirmCheckCancel.addEventListener("click", onCancel);
    el.confirmCheckConfirm.addEventListener("click", onConfirm);

    dialog.showModal();
  });
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
  const catalogCompact = Boolean(payload.catalogCompact);
  const contrast = payload.contrast === "high" ? "high" : "normal";
  const layout = payload.layout === "boxed" ? "boxed" : "full";
  const showIcons = payload.showIcons !== false;
  return { theme, density, fontSize, radius, motion, catalogCompact, contrast, layout, showIcons };
}

function fillUIOptionsForm(options) {
  if (
    !el.mobileUiTheme ||
    !el.mobileUiDensity ||
    !el.mobileUiFontSize ||
    !el.mobileUiRadius ||
    !el.mobileUiContrast ||
    !el.mobileUiLayout ||
    !el.mobileUiMotion ||
    !el.mobileUiCatalogCompact ||
    !el.mobileUiShowIcons
  ) {
    return;
  }
  el.mobileUiTheme.value = options.theme;
  el.mobileUiDensity.value = options.density;
  el.mobileUiFontSize.value = options.fontSize;
  el.mobileUiRadius.value = options.radius;
  el.mobileUiContrast.value = options.contrast;
  el.mobileUiLayout.value = options.layout;
  el.mobileUiMotion.checked = options.motion;
  el.mobileUiCatalogCompact.checked = options.catalogCompact;
  el.mobileUiShowIcons.checked = options.showIcons;
}

function collectUIOptionsFromForm() {
  if (
    !el.mobileUiTheme ||
    !el.mobileUiDensity ||
    !el.mobileUiFontSize ||
    !el.mobileUiRadius ||
    !el.mobileUiContrast ||
    !el.mobileUiLayout ||
    !el.mobileUiMotion ||
    !el.mobileUiCatalogCompact ||
    !el.mobileUiShowIcons
  ) {
    return { ...state.uiOptions };
  }
  return normalizeUIOptions({
    theme: el.mobileUiTheme.value,
    density: el.mobileUiDensity.value,
    fontSize: el.mobileUiFontSize.value,
    radius: el.mobileUiRadius.value,
    contrast: el.mobileUiContrast.value,
    layout: el.mobileUiLayout.value,
    motion: Boolean(el.mobileUiMotion.checked),
    catalogCompact: Boolean(el.mobileUiCatalogCompact.checked),
    showIcons: Boolean(el.mobileUiShowIcons.checked),
  });
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
  document.body.setAttribute("data-catalog", next.catalogCompact ? "compact" : "normal");
  document.body.setAttribute("data-contrast", next.contrast);
  document.body.setAttribute("data-layout", next.layout);
  document.body.setAttribute("data-icons", next.showIcons ? "on" : "off");
  if (persist) {
    localStorage.setItem("padaria_mobile_ui_options", JSON.stringify(next));
  }
  if (syncForm) {
    fillUIOptionsForm(next);
  }
}

function loadUIOptions() {
  let parsed = null;
  try {
    const raw = localStorage.getItem("padaria_mobile_ui_options");
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

function applyMobileUIPreset(name) {
  const preset = MOBILE_UI_PRESETS[name];
  if (!preset) return;
  applyUIOptions(preset, { persist: true, syncForm: true });
  showToast(`Preset '${name}' aplicado.`);
}

function setActiveTab(tab, persist = true) {
  const allowed = new Set(["pedidos", "comandas", "opcoes"]);
  const nextTab = allowed.has(tab) ? tab : "pedidos";
  state.activeTab = nextTab;
  el.tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === nextTab);
  });
  el.tabPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.tabPanel === nextTab);
  });
  if (persist) {
    localStorage.setItem("padaria_mobile_tab", nextTab);
  }
}

function loadActiveTab() {
  const saved = localStorage.getItem("padaria_mobile_tab") || "pedidos";
  setActiveTab(saved, false);
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
  raw.forEach((entry) => {
    const text = String(entry || "").trim();
    if (!text) return;
    const clipped = text.slice(0, 120);
    const key = clipped.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    clean.push(clipped);
  });
  if (clean.length) {
    return clean.slice(0, 30);
  }
  return Array.isArray(fallback) ? [...fallback] : [];
}

function normalizeERPConfig(payload = {}) {
  const next = { ...DEFAULT_ERP_CONFIG };
  Object.keys(next).forEach((key) => {
    if (payload[key] !== undefined && payload[key] !== null) {
      next[key] = payload[key];
    }
  });
  next.empresa_nome = String(next.empresa_nome || DEFAULT_ERP_CONFIG.empresa_nome).trim();
  if (!next.empresa_nome) next.empresa_nome = DEFAULT_ERP_CONFIG.empresa_nome;
  next.empresa_subtitulo = String(
    next.empresa_subtitulo || DEFAULT_ERP_CONFIG.empresa_subtitulo
  ).trim();
  if (!next.empresa_subtitulo) next.empresa_subtitulo = DEFAULT_ERP_CONFIG.empresa_subtitulo;
  next.email_rodape = String(next.email_rodape || DEFAULT_ERP_CONFIG.email_rodape).trim();
  if (!next.email_rodape) next.email_rodape = DEFAULT_ERP_CONFIG.email_rodape;
  next.logo_url = String(next.logo_url || DEFAULT_ERP_CONFIG.logo_url).trim();
  if (!next.logo_url) next.logo_url = DEFAULT_ERP_CONFIG.logo_url;
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
    el.brandAppName.textContent = `${config.empresa_nome} Mobile`;
  }
  if (el.brandPageTitle) {
    el.brandPageTitle.textContent = "Anotar pedido";
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
    document.title = `${config.empresa_nome} Mobile | Comandas`;
  }
}

function applyColors(config) {
  const root = document.documentElement;
  root.style.setProperty("--red-1", config.cor_primaria);
  root.style.setProperty("--red-2", config.cor_secundaria);
  root.style.setProperty("--top-1", config.cor_topo_primaria);
  root.style.setProperty("--top-2", config.cor_topo_secundaria);
}

function applyERPConfig(config) {
  const normalized = normalizeERPConfig(config);
  state.erpConfig = normalized;
  applyBranding(normalized);
  applyColors(normalized);
  renderObsRapidas();
  renderSugestoes();
  state.realtime.intervalMs = normalized.tempo_real_segundos * 1000;
  state.realtime.enabled = normalized.tempo_real_ativo;
  startRealtimeMobile();
}

async function loadERPConfig() {
  const payload = await api("/config/erp");
  applyERPConfig(payload);
}

function statusClass(status) {
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

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
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
    const message = payload && payload.detail ? payload.detail : `Erro ${response.status}`;
    throw new Error(message);
  }
  return payload;
}

function normalizeText(value) {
  return String(value || "").toLowerCase().trim();
}

function moneyValue(value) {
  return Number(value || 0);
}

function clampInteger(value, { min = 0, max = 999999, fallback = 0 } = {}) {
  const raw = Number(value);
  if (!Number.isFinite(raw)) return fallback;
  const normalized = Math.round(raw);
  if (normalized < min) return min;
  if (normalized > max) return max;
  return normalized;
}

function clampMoney(value, { min = 0, max = 999999.99, fallback = 0 } = {}) {
  const raw = Number(value);
  if (!Number.isFinite(raw)) return fallback;
  const normalized = Math.round(raw * 100) / 100;
  if (normalized < min) return min;
  if (normalized > max) return max;
  return normalized;
}

function parsePositiveIntegerInput(value, fieldName, { min = 1, max = 999 } = {}) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`${fieldName} inválida. Use inteiro entre ${min} e ${max}.`);
  }
  return parsed;
}

function parseNonNegativeMoneyInput(value, fieldName, { max = 999999.99 } = {}) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > max) {
    throw new Error(`${fieldName} inválido.`);
  }
  return Math.round(parsed * 100) / 100;
}

function sanitizeOptionalText(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  return raw.replace(/\s+/g, " ");
}

function formatDateTime(value) {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

function getImagemProduto(produto) {
  if (produto && produto.imagem_url) return produto.imagem_url;
  return "/static/img/pao.svg";
}

function getProdutoSelecionado() {
  const produtoId = Number(el.produtoId.value || "0");
  if (!produtoId) return null;
  return state.produtos.find((p) => p.id === produtoId) || null;
}

function getCatalogQuickQty(produtoId) {
  return clampInteger(state.catalogQuickQty[produtoId], {
    min: CATALOG_QUICK_QTY_MIN,
    max: CATALOG_QUICK_QTY_MAX,
    fallback: CATALOG_QUICK_QTY_DEFAULT,
  });
}

function adjustCatalogQuickQty(produtoId, delta) {
  const current = getCatalogQuickQty(produtoId);
  const nextQty = clampInteger(current + Number(delta || 0), {
    min: CATALOG_QUICK_QTY_MIN,
    max: CATALOG_QUICK_QTY_MAX,
    fallback: CATALOG_QUICK_QTY_DEFAULT,
  });
  state.catalogQuickQty[produtoId] = nextQty;
  return nextQty;
}

function setCatalogQuickQty(produtoId, rawValue) {
  const digits = String(rawValue ?? "").replace(/[^\d]/g, "");
  const parsed = Number.parseInt(digits, 10);
  const nextQty = clampInteger(parsed, {
    min: CATALOG_QUICK_QTY_MIN,
    max: CATALOG_QUICK_QTY_MAX,
    fallback: getCatalogQuickQty(produtoId),
  });
  state.catalogQuickQty[produtoId] = nextQty;
  return nextQty;
}

function findProdutoByHint(hint) {
  const raw = String(hint || "").trim();
  if (!raw) return null;
  if (/^\d+$/.test(raw)) {
    const byId = state.produtos.find((p) => p.id === Number(raw));
    if (byId) return byId;
  }
  const normalized = normalizeText(raw);
  const exact = state.produtos.find((p) => normalizeText(p.nome) === normalized);
  if (exact) return exact;
  return state.produtos.find((p) => normalizeText(p.nome).includes(normalized)) || null;
}

function parseMobileMaisPedidoHint(hint) {
  const raw = String(hint || "").trim();
  if (!raw) return null;

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
  } else {
    produto = findProdutoByHint(raw);
    if (!/^\d+$/.test(raw)) {
      nomeExibicao = raw;
    }
  }

  if (!produto) return null;
  const nomeFinal = String(nomeExibicao || produto.nome || "").trim().slice(0, 120);
  if (!nomeFinal) return null;
  return {
    produto_id: produto.id,
    nome: nomeFinal,
  };
}

function getAdicionaisPermitidos(produto) {
  if (!produto) {
    return [];
  }
  if (!Array.isArray(produto.adicional_ids) || !produto.adicional_ids.length) {
    return state.adicionais;
  }
  const allowedIds = new Set(produto.adicional_ids.map((id) => Number(id)));
  return state.adicionais.filter((ad) => allowedIds.has(ad.id));
}

function renderComandaSelecionadaAlert() {
  if (!el.comandaSelecionadaAlert) return;
  if (!state.selecionada) {
    el.comandaSelecionadaAlert.innerHTML = "Comanda selecionada para alterar: <strong>nenhuma</strong>";
    return;
  }
  el.comandaSelecionadaAlert.innerHTML =
    `Comanda selecionada para alterar: <strong>${state.selecionada.comanda_codigo}</strong>`;
}

function atualizarVisibilidadeFluxo() {
  if (!state.selecionada) {
    state.anotando = false;
  }
  const mostrarAnotacao = Boolean(state.anotando && state.selecionada);
  if (el.comandaUsoCard) {
    el.comandaUsoCard.classList.toggle("is-hidden", mostrarAnotacao);
  }
  if (el.anotacaoCard) {
    el.anotacaoCard.classList.toggle("is-hidden", !mostrarAnotacao);
  }
  if (el.itensCard) {
    el.itensCard.classList.toggle("is-hidden", !mostrarAnotacao);
  }
}

function setModoAnotacao(ativo, { focusSearch = false } = {}) {
  state.anotando = Boolean(ativo && state.selecionada);
  if (!state.anotando) {
    state.ajusteFinoAberto = false;
    if (el.ajusteFinoSection) {
      el.ajusteFinoSection.classList.add("is-hidden");
    }
  }
  atualizarVisibilidadeFluxo();
  atualizarEstadoAnotacao();
  if (focusSearch && state.anotando && el.produtoSearch) {
    el.produtoSearch.focus();
  }
}

function abrirAjusteFino(produtoId, { focusQtd = true } = {}) {
  if (!podeUsarFormularioItem()) {
    throw new Error("Ative uma comanda editável para abrir a edição do item.");
  }
  const produto = state.produtos.find((row) => row.id === Number(produtoId));
  if (!produto) {
    throw new Error("Produto não encontrado para ajuste.");
  }
  el.produtoId.value = String(produto.id);
  state.ajusteFinoAberto = true;
  if (el.ajusteFinoSection) {
    el.ajusteFinoSection.classList.remove("is-hidden");
  }
  renderAdicionaisPicker();
  atualizarValorFinalEstimado();
  if (focusQtd && el.itemQtd) {
    el.itemQtd.focus();
    el.itemQtd.select();
  }
}

function isComandaEditavel(comanda) {
  return Boolean(comanda && STATUS_EDITAVEIS_ITENS.has(comanda.status));
}

function podeUsarFormularioItem() {
  return Boolean(state.anotando && isComandaEditavel(state.selecionada));
}

function comandasParaAlteracao() {
  return state.comandas.filter((c) => STATUS_EDITAVEIS_ITENS.has(c.status));
}

function atualizarEstadoAnotacao() {
  const emFluxoAnotacao = Boolean(state.anotando && state.selecionada);
  const habilitado = podeUsarFormularioItem();
  if (el.anotacaoCard) {
    el.anotacaoCard.classList.toggle("locked", emFluxoAnotacao && !habilitado);
  }
  if (el.anotacaoLockMessage) {
    if (!emFluxoAnotacao) {
      el.anotacaoLockMessage.textContent =
        "Abra/selecione uma comanda e toque em 'Usar' para iniciar a anotação.";
      el.anotacaoLockMessage.classList.remove("is-hidden");
    } else if (!state.selecionada) {
      el.anotacaoLockMessage.textContent = "Selecione uma comanda para liberar a anotação.";
      el.anotacaoLockMessage.classList.remove("is-hidden");
    } else if (!habilitado) {
      el.anotacaoLockMessage.textContent =
        "Esta comanda não aceita alteração de itens no status atual.";
      el.anotacaoLockMessage.classList.remove("is-hidden");
    } else {
      el.anotacaoLockMessage.classList.add("is-hidden");
    }
  }

  const controls = [
    el.itemForm,
    el.produtoSearch,
    el.sugestoesMaisPedidos,
    el.catalogoProdutos,
    el.obsRapidas,
    el.stopAnotacaoBtn,
  ];
  controls.forEach((node) => {
    if (!node) return;
    const elements = node.matches("input, select, button, textarea")
      ? [node]
      : Array.from(node.querySelectorAll("input, select, button, textarea"));
    elements.forEach((control) => {
      if (control.id === "stop-anotacao-btn") return;
      if (control.id === "item-cancel-edit" && state.itemEditId) return;
      control.disabled = !habilitado;
    });
  });
  if (el.ajusteFinoSection) {
    const mostrarAjuste = Boolean(state.ajusteFinoAberto && emFluxoAnotacao);
    el.ajusteFinoSection.classList.toggle("is-hidden", !mostrarAjuste);
  }
  atualizarValorFinalEstimado();
  renderSugestoes();
  renderCatalogo();
}

function resetItemFormMode({ clearForm = true } = {}) {
  state.itemEditId = null;
  state.ajusteFinoAberto = false;
  if (el.itemFormTitle) {
    el.itemFormTitle.textContent = "Adicionar na comanda";
  }
  if (el.itemFormMode) {
    el.itemFormMode.classList.add("is-hidden");
  }
  if (el.itemSubmitBtn) {
    el.itemSubmitBtn.textContent = "Adicionar Item";
  }
  if (el.itemCancelEdit) {
    el.itemCancelEdit.classList.add("is-hidden");
  }
  if (clearForm && el.itemForm) {
    el.itemForm.reset();
    if (el.itemDesconto) {
      el.itemDesconto.value = "0.00";
    }
    if (el.produtoId) {
      el.produtoId.value = "";
    }
  }
  if (el.ajusteFinoSection) {
    el.ajusteFinoSection.classList.add("is-hidden");
  }
  renderAdicionaisPicker();
  atualizarValorFinalEstimado();
  atualizarEstadoAnotacao();
}

function ativarEdicaoItem(itemId) {
  if (!state.selecionada) throw new Error("Selecione uma comanda.");
  const item = (state.selecionada.itens || []).find((row) => row.id === itemId);
  if (!item) throw new Error("Item não encontrado.");
  if (!isComandaEditavel(state.selecionada)) {
    throw new Error("Status atual não permite alterar itens.");
  }
  setModoAnotacao(true);

  state.itemEditId = item.id;
  state.ajusteFinoAberto = true;
  if (el.ajusteFinoSection) {
    el.ajusteFinoSection.classList.remove("is-hidden");
  }
  if (el.itemFormTitle) {
    el.itemFormTitle.textContent = `Alterar item #${item.id}`;
  }
  if (el.itemFormMode) {
    el.itemFormMode.classList.remove("is-hidden");
  }
  if (el.itemSubmitBtn) {
    el.itemSubmitBtn.textContent = "Salvar alteração";
  }
  if (el.itemCancelEdit) {
    el.itemCancelEdit.classList.remove("is-hidden");
  }

  el.produtoId.value = String(item.produto_id);
  el.itemQtd.value = String(item.quantidade);
  el.itemDesconto.value = String(item.desconto ?? "0.00");
  el.itemObs.value = item.observacoes || "";
  renderAdicionaisPicker();
  (item.adicionais || []).forEach((adicional) => {
    const check = el.adicionaisBox.querySelector(`[data-add-check="${adicional.adicional_id}"]`);
    if (check) {
      check.checked = true;
    }
    const qtdInput = el.adicionaisBox.querySelector(`[data-add-qtd="${adicional.adicional_id}"]`);
    if (qtdInput) {
      qtdInput.value = String(adicional.quantidade || 1);
    }
  });
  atualizarValorFinalEstimado();
  atualizarEstadoAnotacao();
  setActiveTab("pedidos");
}

function atualizarValorFinalEstimado() {
  if (!el.itemValorFinal) return 0;
  const produto = getProdutoSelecionado();
  const quantidade = clampInteger(el.itemQtd.value, { min: 0, max: 999, fallback: 0 });
  const desconto = clampMoney(el.itemDesconto.value, { min: 0, max: 999999.99, fallback: 0 });
  if (!produto || quantidade <= 0) {
    el.itemValorFinal.value = "R$ 0,00";
    if (el.produtoSelecionadoNome) {
      el.produtoSelecionadoNome.textContent = produto ? produto.nome : "Nenhum produto selecionado";
    }
    if (el.produtoSelecionadoTotal) {
      el.produtoSelecionadoTotal.textContent = "R$ 0,00";
    }
    return 0;
  }

  const base = moneyValue(produto.preco) * quantidade;
  let adicionaisTotal = 0;
  const adicionais = getAdicionaisPermitidos(produto);
  adicionais.forEach((ad) => {
    const check = el.adicionaisBox.querySelector(`[data-add-check="${ad.id}"]`);
    if (!check || !check.checked) return;
    const qtdInput = el.adicionaisBox.querySelector(`[data-add-qtd="${ad.id}"]`);
    const qtd = clampInteger(qtdInput ? qtdInput.value : "1", { min: 0, max: 99, fallback: 0 });
    if (qtd > 0) {
      adicionaisTotal += moneyValue(ad.preco) * qtd;
    }
  });

  const total = Math.max(0, base + adicionaisTotal - Math.max(0, desconto));
  el.itemValorFinal.value = `R$ ${money.format(total)}`;
  if (el.produtoSelecionadoNome) {
    el.produtoSelecionadoNome.textContent = produto.nome;
  }
  if (el.produtoSelecionadoTotal) {
    el.produtoSelecionadoTotal.textContent = `R$ ${money.format(total)}`;
  }
  return total;
}

function openSidebar() {
  closeAbrirSidebar();
  el.sidebar.classList.add("open");
  el.sidebarBackdrop.classList.add("show");
  el.sidebar.setAttribute("aria-hidden", "false");
}

function closeSidebar() {
  el.sidebar.classList.remove("open");
  el.sidebarBackdrop.classList.remove("show");
  el.sidebar.setAttribute("aria-hidden", "true");
}

function openAbrirSidebar() {
  closeSidebar();
  el.abrirSidebar.classList.add("open");
  el.abrirSidebarBackdrop.classList.add("show");
  el.abrirSidebar.setAttribute("aria-hidden", "false");
}

function closeAbrirSidebar() {
  el.abrirSidebar.classList.remove("open");
  el.abrirSidebarBackdrop.classList.remove("show");
  el.abrirSidebar.setAttribute("aria-hidden", "true");
}

function closeAllSidebars() {
  closeSidebar();
  closeAbrirSidebar();
}

function renderAdicionaisPicker() {
  el.adicionaisBox.innerHTML = "";
  const produto = getProdutoSelecionado();
  const adicionaisVisiveis = getAdicionaisPermitidos(produto);

  if (!adicionaisVisiveis.length) {
    const p = document.createElement("p");
    p.className = "small";
    p.textContent = produto ? "Sem adicionais permitidos para este item." : "Selecione um produto para ver os adicionais.";
    el.adicionaisBox.appendChild(p);
    return;
  }

  adicionaisVisiveis.forEach((ad) => {
    const row = document.createElement("label");
    row.className = "add-row";
    row.innerHTML = `
      <input type="checkbox" data-add-check="${ad.id}">
      <span>${ad.nome} (R$ ${money.format(moneyValue(ad.preco))})</span>
      <input type="number" min="1" value="1" data-add-qtd="${ad.id}">
    `;
    el.adicionaisBox.appendChild(row);
  });
  atualizarValorFinalEstimado();
}

function renderObsRapidas() {
  if (!el.obsRapidas) return;
  el.obsRapidas.innerHTML = "";
  const itens = (state.erpConfig.mobile_obs_rapidas || []).length
    ? state.erpConfig.mobile_obs_rapidas
    : DEFAULT_ERP_CONFIG.mobile_obs_rapidas;
  itens.forEach((texto) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.obsQuick = texto;
    btn.textContent = texto;
    el.obsRapidas.appendChild(btn);
  });
  const clearBtn = document.createElement("button");
  clearBtn.type = "button";
  clearBtn.dataset.obsClear = "1";
  clearBtn.className = "btn-ghost";
  clearBtn.textContent = "Limpar";
  el.obsRapidas.appendChild(clearBtn);
}

function renderSugestoes() {
  el.sugestoesMaisPedidos.innerHTML = "";
  const canAdd = podeUsarFormularioItem();
  const customHints = state.erpConfig.mobile_mais_pedidos || [];
  const customRows = [];
  const customIds = new Set();
  customHints.forEach((hint) => {
    const parsed = parseMobileMaisPedidoHint(hint);
    if (!parsed) return;
    const key = `${parsed.produto_id}|${parsed.nome.toLowerCase()}`;
    if (customIds.has(key)) return;
    customIds.add(key);
    customRows.push({
      produto_id: parsed.produto_id,
      nome: parsed.nome,
      quantidade_total: null,
      customizado: true,
    });
  });
  const customProdutoIds = new Set(customRows.map((row) => row.produto_id));
  const dynamicRows = (state.sugestoes || []).filter((row) => !customProdutoIds.has(row.produto_id));
  const rows = customRows.length ? customRows : dynamicRows;

  if (!rows.length) {
    const fallback = document.createElement("span");
    fallback.className = "small";
    fallback.textContent = "Sem histórico ainda. Use o catálogo abaixo.";
    el.sugestoesMaisPedidos.appendChild(fallback);
    return;
  }

  rows.forEach((s) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sugestao-btn";
    btn.dataset.sugestaoProdutoId = String(s.produto_id);
    btn.disabled = !canAdd;
    btn.textContent = s.nome;
    el.sugestoesMaisPedidos.appendChild(btn);
  });
}

function renderCatalogo() {
  const searchTerm = normalizeText(el.produtoSearch.value);
  const filtered = state.produtos.filter((p) => normalizeText(p.nome).includes(searchTerm));
  el.catalogoProdutos.innerHTML = "";
  const canAdd = podeUsarFormularioItem();

  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "small";
    empty.textContent = "Nenhum produto encontrado.";
    el.catalogoProdutos.appendChild(empty);
    return;
  }

  filtered.forEach((produto) => {
    const card = document.createElement("article");
    card.className = "produto-card";
    const quickQty = getCatalogQuickQty(produto.id);
    card.innerHTML = `
      <button
        type="button"
        class="produto-image-pick"
        data-pick-produto-id="${produto.id}"
        aria-label="Abrir edição do item ${produto.nome}"
        ${canAdd ? "" : "disabled"}
      >
        <img src="${getImagemProduto(produto)}" alt="${produto.nome}">
      </button>
      <div class="produto-card-body">
        <div class="produto-card-title">${produto.nome}</div>
        <div class="produto-card-price">R$ ${money.format(moneyValue(produto.preco))}</div>
        <div class="produto-actions">
          <div class="produto-qtd-quick">
            <button
              type="button"
              class="produto-qtd-step"
              data-quick-produto="${produto.id}"
              data-quick-delta="-1"
              aria-label="Diminuir quantidade rapida"
              ${canAdd ? "" : "disabled"}
            >-</button>
            <input
              type="text"
              class="produto-qtd-input"
              inputmode="numeric"
              pattern="[0-9]*"
              value="${quickQty}"
              data-quick-produto-input="${produto.id}"
              aria-label="Quantidade para ${produto.nome}"
              ${canAdd ? "" : "disabled"}
            >
            <button
              type="button"
              class="produto-qtd-step"
              data-quick-produto="${produto.id}"
              data-quick-delta="1"
              aria-label="Aumentar quantidade rapida"
              ${canAdd ? "" : "disabled"}
            >+</button>
          </div>
          <button
            type="button"
            class="produto-add-btn"
            data-add-produto-custom="${produto.id}"
            aria-label="Adicionar item ${produto.nome}"
            ${canAdd ? "" : "disabled"}
          >Adicionar</button>
        </div>
      </div>
    `;
    el.catalogoProdutos.appendChild(card);
  });
}

function renderComandaPicker() {
  el.comandaAtivaSelect.innerHTML = "";
  const listaBase = comandasParaAlteracao();
  const termo = normalizeText(el.comandaSearch ? el.comandaSearch.value : "");
  const filtradas = !termo
    ? listaBase
    : listaBase.filter((c) => {
        const codigo = normalizeText(c.comanda_codigo);
        const status = normalizeText(statusLabel(c.status));
        const entrega = normalizeText(c.tipo_entrega);
        const mesa = normalizeText(c.mesa);
        return codigo.includes(termo) || status.includes(termo) || entrega.includes(termo) || mesa.includes(termo);
      });

  if (!filtradas.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = termo ? "Nenhuma comanda encontrada" : "Nenhuma comanda alterável";
    el.comandaAtivaSelect.appendChild(opt);
    return;
  }

  filtradas.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = String(c.id);
    const mesaTxt = c.mesa ? `Mesa ${c.mesa}` : "Sem mesa";
    opt.textContent = `${c.comanda_codigo} | ${statusLabel(c.status)} | ${mesaTxt} | R$ ${money.format(moneyValue(c.total))}`;
    el.comandaAtivaSelect.appendChild(opt);
  });

  if (state.selecionada) {
    const exists = filtradas.some((c) => c.id === state.selecionada.id);
    if (exists) {
      el.comandaAtivaSelect.value = String(state.selecionada.id);
      return;
    }
  }
  el.comandaAtivaSelect.value = String(filtradas[0].id);
}

function setPainelFiltroStatus(status) {
  state.painelFiltroStatus = status || "TODOS";
  if (el.painelComandasFiltros) {
    const buttons = el.painelComandasFiltros.querySelectorAll("button[data-cmd-filter]");
    buttons.forEach((button) => {
      button.classList.toggle("active", button.dataset.cmdFilter === state.painelFiltroStatus);
    });
  }
  renderPainelComandas();
}

function renderPainelComandas() {
  const termo = normalizeText(el.painelComandasSearch ? el.painelComandasSearch.value : "");
  renderControleEntrega(termo);
  if (!el.painelComandasGrid) return;
  el.painelComandasGrid.innerHTML = "";
  const filtro = state.painelFiltroStatus || "TODOS";

  let rows = state.painelComandas || [];
  if (filtro !== "TODOS") {
    rows = rows.filter((row) => row.status === filtro);
  }
  if (termo) {
    rows = rows.filter((row) => {
      const codigo = normalizeText(row.codigo);
      const statusTxt = normalizeText(statusLabel(row.status));
      const mesa = normalizeText(row.mesa);
      return codigo.includes(termo) || statusTxt.includes(termo) || mesa.includes(termo);
    });
  }

  if (!rows.length) {
    const empty = document.createElement("p");
    empty.className = "small";
    empty.textContent = "Nenhuma comanda encontrada com esse filtro.";
    el.painelComandasGrid.appendChild(empty);
    return;
  }

  rows.forEach((row) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `comanda-status-card status-${String(row.status || "").toLowerCase()}`;
    card.dataset.painelCodigoId = String(row.codigo_id);
    card.dataset.painelStatus = row.status || "";
    card.dataset.painelPedidoId = row.pedido_id ? String(row.pedido_id) : "";
    if (state.selecionada && row.pedido_id && state.selecionada.id === row.pedido_id) {
      card.classList.add("active");
    }
    const mesaTxt = row.mesa ? `Mesa ${row.mesa}` : "Sem mesa";
    let acao = "Toque para abrir";
    if (STATUS_PAINEL_EDITAVEL.has(row.status || "")) {
      acao = row.status === "EM_PREPARO" ? "Toque para alterar" : "Toque para editar";
    } else if (row.status === "ENTREGUE" || row.status === "CANCELADO") {
      acao = "Toque para liberar";
    }
    card.innerHTML = `
      <span class="codigo">${row.codigo}</span>
      <span class="meta">${statusLabel(row.status)} | ${mesaTxt}</span>
      <span class="acao">${acao}</span>
    `;
    el.painelComandasGrid.appendChild(card);
  });
}

function renderControleEntrega(termo = "") {
  if (!el.entregaControlList) return;
  el.entregaControlList.innerHTML = "";
  let rows = (state.painelComandas || []).filter(
    (row) => row.status === "EM_PREPARO" || row.status === "ENTREGUE"
  );
  if (termo) {
    rows = rows.filter((row) => {
      const codigo = normalizeText(row.codigo);
      const statusTxt = normalizeText(statusLabel(row.status));
      const mesa = normalizeText(row.mesa);
      return codigo.includes(termo) || statusTxt.includes(termo) || mesa.includes(termo);
    });
  }
  if (!rows.length) {
    const empty = document.createElement("p");
    empty.className = "small";
    empty.textContent = "Nenhuma comanda em preparo/entregue para controle rápido.";
    el.entregaControlList.appendChild(empty);
    return;
  }

  rows.sort((a, b) => {
    const rankA = a.status === "EM_PREPARO" ? 0 : 1;
    const rankB = b.status === "EM_PREPARO" ? 0 : 1;
    if (rankA !== rankB) return rankA - rankB;
    return String(a.codigo || "").localeCompare(String(b.codigo || ""), "pt-BR");
  });

  rows.forEach((row) => {
    const container = document.createElement("div");
    container.className = "entrega-control-row";

    const copy = document.createElement("div");
    copy.className = "entrega-control-copy";
    const strong = document.createElement("strong");
    strong.textContent = String(row.codigo || "-");
    const meta = document.createElement("span");
    meta.className = "small";
    meta.textContent = `${statusLabel(row.status)} | ${row.mesa ? `Mesa ${row.mesa}` : "Sem mesa"}`;
    copy.appendChild(strong);
    copy.appendChild(meta);

    const action = document.createElement("button");
    action.type = "button";
    const destino = row.status === "EM_PREPARO" ? "ENTREGUE" : "EM_PREPARO";
    action.className = destino === "ENTREGUE" ? "btn-entregue" : "btn-ghost";
    action.textContent = destino === "ENTREGUE" ? "Marcar entregue" : "Voltar preparo";
    action.dataset.entregaPedidoId = row.pedido_id ? String(row.pedido_id) : "";
    action.dataset.entregaCodigo = String(row.codigo || "");
    action.dataset.entregaFromStatus = String(row.status || "");
    action.dataset.entregaToStatus = destino;
    action.disabled = !row.pedido_id;

    container.appendChild(copy);
    container.appendChild(action);
    el.entregaControlList.appendChild(container);
  });
}

function renderHistoricoCupons() {
  if (!el.historicoList) return;
  el.historicoList.innerHTML = "";
  const termo = normalizeText(el.historicoSearch ? el.historicoSearch.value : "");
  const rows = (state.historicoCupons || []).filter((row) => {
    if (!termo) return true;
    const codigo = normalizeText(row.comanda_codigo);
    const statusTxt = normalizeText(statusLabel(row.status));
    const criado = normalizeText(formatDateTime(row.criado_em));
    return codigo.includes(termo) || statusTxt.includes(termo) || criado.includes(termo);
  });
  if (!rows.length) {
    const empty = document.createElement("p");
    empty.className = "small";
    empty.textContent = "Sem histórico para exibir.";
    el.historicoList.appendChild(empty);
    return;
  }

  rows.forEach((row) => {
    const item = document.createElement("div");
    item.className = "historico-row";
    item.innerHTML = `
      <strong>${row.comanda_codigo}</strong>
      <span class="small">${statusLabel(row.status)} | ${row.tipo_entrega || "-"} | R$ ${money.format(moneyValue(row.total))}</span>
      <span class="small">${formatDateTime(row.criado_em)}</span>
    `;
    el.historicoList.appendChild(item);
  });
}

function setComandaResumoVazia() {
  el.selCodigo.textContent = "Sem comanda";
  el.selMesa.textContent = "Mesa -";
  el.selComplexidade.textContent = "Complexidade -";
  el.selMesaSide.textContent = "-";
  el.selComplexidadeSide.textContent = "-";
  el.selTotalItens.textContent = "0";
  el.selStatus.textContent = "-";
  el.selStatus.className = "badge";
  el.selTotal.textContent = "0.00";
  el.selPago.textContent = "0.00";
  el.selSaldo.textContent = "0.00";
  if (el.itensTotalNota) {
    el.itensTotalNota.textContent = "R$ 0,00";
  }
  el.itensList.innerHTML = "";
  resetItemFormMode();
  setModoAnotacao(false);
  renderComandaSelecionadaAlert();
  atualizarVisibilidadeFluxo();
}

function renderSelecionada() {
  if (!state.selecionada) {
    setComandaResumoVazia();
    return;
  }

  const c = state.selecionada;
  const totalItens = totalItensComanda(c);
  const complexidade = c.complexidade || classificarComplexidade(totalItens);
  el.selCodigo.textContent = c.comanda_codigo;
  el.selMesa.textContent = c.mesa ? `Mesa ${c.mesa}` : "Mesa -";
  el.selComplexidade.textContent = complexidade;
  el.selMesaSide.textContent = c.mesa || "-";
  el.selComplexidadeSide.textContent = complexidade;
  el.selTotalItens.textContent = String(totalItens);
  el.selStatus.textContent = statusLabel(c.status);
  el.selStatus.className = statusClass(c.status);
  el.selTotal.textContent = money.format(moneyValue(c.total));
  el.selPago.textContent = money.format(moneyValue(c.pagamento.total_pago));
  el.selSaldo.textContent = money.format(moneyValue(c.pagamento.saldo_pendente));
  if (el.itensTotalNota) {
    el.itensTotalNota.textContent = `R$ ${money.format(moneyValue(c.total))}`;
  }
  renderComandaSelecionadaAlert();
  atualizarVisibilidadeFluxo();
  atualizarEstadoAnotacao();

  el.itensList.innerHTML = "";
  if (!c.itens.length) {
    const empty = document.createElement("p");
    empty.className = "small";
    empty.textContent = "Sem itens nesta comanda.";
    el.itensList.appendChild(empty);
    return;
  }

  const alteravel = isComandaEditavel(c);
  const destinosTransferencia = comandasParaAlteracao().filter((row) => row.id !== c.id);

  c.itens.forEach((item) => {
    const adicionaisHtml = (item.adicionais || []).length
      ? (item.adicionais || [])
          .map(
            (ad) =>
              `<li>+ ${ad.nome} x${ad.quantidade} (R$ ${money.format(moneyValue(ad.subtotal))})</li>`
          )
          .join("")
      : "<li>Sem adicionais</li>";
    const destinoOptions = destinosTransferencia.length
      ? destinosTransferencia
          .map(
            (destino) =>
              `<option value="${destino.id}">${destino.comanda_codigo} (${statusLabel(destino.status)})</option>`
          )
          .join("")
      : '<option value="">Sem destino</option>';
    const disabledEdit = alteravel ? "" : "disabled";
    const disabledTransfer = alteravel && destinosTransferencia.length ? "" : "disabled";

    const details = document.createElement("details");
    details.className = "item-row";
    details.innerHTML = `
      <summary>
        <span>${item.produto_nome} x${item.quantidade}</span>
        <span>R$ ${money.format(moneyValue(item.subtotal))}</span>
      </summary>
      <div class="item-body">
        <p class="small"><strong>Obs:</strong> ${item.observacoes || "Sem observações"}</p>
        <p class="small"><strong>Desconto:</strong> R$ ${money.format(moneyValue(item.desconto))}</p>
        <div class="small"><strong>Adicionais:</strong></div>
        <ul class="small">${adicionaisHtml}</ul>
        <div class="item-actions">
          <button type="button" data-edit-item="${item.id}" class="btn-neutral" ${disabledEdit}>Alterar item</button>
          <button type="button" data-remove-item="${item.id}" class="btn-danger" ${disabledEdit}>Remover item</button>
        </div>
        <div class="item-transfer">
          <select data-transfer-dest="${item.id}" ${disabledTransfer}>
            ${destinoOptions}
          </select>
          <button type="button" data-transfer-item="${item.id}" class="btn-neutral" ${disabledTransfer}>Passar item</button>
        </div>
      </div>
    `;
    el.itensList.appendChild(details);
  });
}

function getAdicionaisSelecionados() {
  const selected = [];
  state.adicionais.forEach((ad) => {
    const check = el.adicionaisBox.querySelector(`[data-add-check="${ad.id}"]`);
    if (check && check.checked) {
      const qtdInput = el.adicionaisBox.querySelector(`[data-add-qtd="${ad.id}"]`);
      const qtd = parsePositiveIntegerInput(qtdInput ? qtdInput.value : 1, "Quantidade do adicional", {
        min: 1,
        max: 99,
      });
      selected.push({ adicional_id: ad.id, quantidade: qtd });
    }
  });
  return selected;
}

function aplicarObservacaoRapida(texto) {
  const atual = (el.itemObs.value || "").trim();
  if (!atual) {
    el.itemObs.value = texto;
    return;
  }
  if (!atual.toLowerCase().includes(texto.toLowerCase())) {
    el.itemObs.value = `${atual}; ${texto}`;
  }
}

async function carregarCodigosDisponiveis() {
  const codigos = await api("/comandas/codigos?ativo=true&em_uso=false");
  state.codigos = (codigos || []).filter((row) => row.status_visual === "LIBERADO");
  el.codigoComanda.innerHTML = "";
  if (!state.codigos.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Sem códigos livres";
    el.codigoComanda.appendChild(opt);
    return;
  }
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Selecione o código";
  el.codigoComanda.appendChild(placeholder);
  state.codigos.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.codigo;
    opt.textContent = c.codigo;
    el.codigoComanda.appendChild(opt);
  });
}

async function carregarProdutos() {
  const produtos = [];
  let page = 1;
  let total = null;
  while (produtos.length < PRODUTOS_MAX_MOBILE) {
    const data = await api(`/produtos?page=${page}&page_size=${PRODUTOS_PAGE_SIZE}&ativo=true`);
    const items = Array.isArray(data.items) ? data.items : [];
    produtos.push(...items);
    if (total === null && Number.isFinite(Number(data.total))) {
      total = Number(data.total);
    }
    if (!items.length || items.length < PRODUTOS_PAGE_SIZE) {
      break;
    }
    if (total !== null && produtos.length >= total) {
      break;
    }
    page += 1;
  }
  state.produtos = produtos.slice(0, PRODUTOS_MAX_MOBILE);
  const produtoAtual = Number(el.produtoId.value || "0");
  el.produtoId.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Selecione um produto";
  el.produtoId.appendChild(placeholder);
  state.produtos.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = String(p.id);
    opt.textContent = p.nome;
    el.produtoId.appendChild(opt);
  });
  if (produtoAtual && state.produtos.some((p) => p.id === produtoAtual)) {
    el.produtoId.value = String(produtoAtual);
  }
  renderAdicionaisPicker();
  renderSugestoes();
  renderCatalogo();
}

async function carregarAdicionais() {
  const adicionais = [];
  let offset = 0;
  while (adicionais.length < ADICIONAIS_MAX_MOBILE) {
    const batch = await api(
      `/adicionais?ativo=true&offset=${offset}&limit=${ADICIONAIS_PAGE_SIZE}`
    );
    if (!Array.isArray(batch) || !batch.length) {
      break;
    }
    adicionais.push(...batch);
    if (batch.length < ADICIONAIS_PAGE_SIZE) {
      break;
    }
    offset += ADICIONAIS_PAGE_SIZE;
  }
  state.adicionais = adicionais.slice(0, ADICIONAIS_MAX_MOBILE);
  renderAdicionaisPicker();
}

async function carregarPainelComandas() {
  state.painelComandas = await api("/comandas/painel?ativo=true");
  renderPainelComandas();
}

async function carregarHistoricoCupons() {
  state.historicoCupons = await api("/comandas/historico/cupons?somente_finalizadas=true&limit=300");
  renderHistoricoCupons();
}

async function agirComandaPainel(codigoId, status, pedidoId) {
  const codigo = Number(codigoId || 0);
  if (!codigo) throw new Error("Comanda inválida.");
  const row = (state.painelComandas || []).find((item) => item.codigo_id === codigo);
  if (!row) throw new Error("Comanda não encontrada no painel.");

  if (status === "LIBERADO") {
    await carregarCodigosDisponiveis();
    if (el.codigoComanda) {
      const existe = Array.from(el.codigoComanda.options).some((opt) => opt.value === row.codigo);
      if (existe) {
        el.codigoComanda.value = row.codigo;
      }
    }
    setActiveTab("pedidos");
    openAbrirSidebar();
    showToast(`Código ${row.codigo} pronto para abrir.`);
    return;
  }

  if (STATUS_PAINEL_EDITAVEL.has(status)) {
    if (!pedidoId) {
      throw new Error("Comanda sem pedido vinculado para alteração.");
    }
    await selecionarComanda(Number(pedidoId));
    setActiveTab("pedidos");
    setModoAnotacao(true, { focusSearch: status === "ABERTO" });
    if (status === "EM_PREPARO" || status === "PRONTO") {
      showToast("Comanda em preparo: somente alteração de itens.");
    } else {
      showToast("Comanda carregada para edição.");
    }
    return;
  }

  if (status === "ENTREGUE" || status === "CANCELADO") {
    const confirmacao = await confirmWithCheckbox({
      title: "Liberar comanda",
      message: `Comanda ${row.codigo} está ${statusLabel(status)}. Deseja liberar para novo uso?`,
      checkboxLabel: "Confirmo que desejo liberar esta comanda.",
      confirmText: "Liberar comanda",
    });
    if (!confirmacao.confirmed) return;
    await api(`/comandas/codigos/${codigo}/liberar`, {
      method: "POST",
      body: JSON.stringify({ confirmar: true }),
    });
    await carregarPainelComandas();
    await carregarCodigosDisponiveis();
    showToast(`Comanda ${row.codigo} liberada.`);
  }
}

async function carregarComandasAbertas() {
  const list = await api("/comandas?limit=1000&order_by=id&order_dir=desc");
  state.comandas = (list || []).filter((c) => c.status !== "CANCELADO");
  renderComandaPicker();
  await carregarPainelComandas();

  if (state.selecionada) {
    const existeSelecionada = state.comandas.some((row) => row.id === state.selecionada.id);
    if (!existeSelecionada) {
      state.selecionada = null;
      renderSelecionada();
    }
  }

  const editaveis = comandasParaAlteracao();
  if (state.anotando && !state.selecionada && editaveis.length) {
    await selecionarComanda(editaveis[0].id);
  }
}

async function carregarSugestoes() {
  state.sugestoes = await api("/comandas/sugestoes/mais-pedidos?limit=10");
  renderSugestoes();
}

async function selecionarComanda(id) {
  state.selecionada = await api(`/comandas/${id}`);
  if (
    state.itemEditId &&
    !(state.selecionada.itens || []).some((item) => item.id === state.itemEditId)
  ) {
    resetItemFormMode({ clearForm: false });
  }
  renderSelecionada();
  renderComandaPicker();
  renderPainelComandas();
}

async function usarComandaSelecionada() {
  const id = Number(el.comandaAtivaSelect.value);
  if (!id) throw new Error("Selecione uma comanda para alterar.");
  await selecionarComanda(id);
  setModoAnotacao(true, { focusSearch: true });
  showToast("Comanda carregada.");
}

async function alterarStatusControleEntrega(pedidoId, codigo, fromStatus, toStatus) {
  const pedido = Number(pedidoId || 0);
  if (!pedido) throw new Error("Comanda sem pedido vinculado para alteração.");
  const voltarPreparo = toStatus === "EM_PREPARO";
  let motivoStatus = null;
  if (voltarPreparo) {
    const motivos = state.erpConfig.mobile_motivos_reabertura_entregue || [];
    const confirmacao = await confirmWithCheckbox({
      title: "Reabrir comanda",
      message: `A comanda ${codigo || ""} vai voltar para EM_PREPARO.`,
      checkboxLabel: "Confirmo a reabertura desta comanda.",
      confirmText: "Voltar para preparo",
      reasonsTitle: "Selecione ao menos um motivo:",
      reasonOptions: motivos,
      requireReason: true,
    });
    if (!confirmacao.confirmed) return;
    motivoStatus = (confirmacao.reasons || []).join("; ");
  } else {
    const confirmacao = await confirmWithCheckbox({
      title: "Marcar entregue",
      message: `Alterar a comanda ${codigo || ""} para ENTREGUE?`,
      checkboxLabel: "Confirmo que este pedido foi entregue.",
      confirmText: "Marcar entregue",
    });
    if (!confirmacao.confirmed) return;
  }

  await api(`/comandas/${pedido}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      status: toStatus,
      repor_estoque: true,
      confirmar_reabertura: voltarPreparo,
      motivo_status: motivoStatus,
    }),
  });
  await carregarComandasAbertas();
  await carregarCodigosDisponiveis();
  if (fromStatus === "ENTREGUE" || toStatus === "ENTREGUE") {
    await carregarHistoricoCupons();
  }
  if (state.selecionada) {
    const atualId = state.selecionada.id;
    const existeAtual = state.comandas.some((row) => row.id === atualId);
    if (existeAtual) {
      await selecionarComanda(atualId);
    } else {
      state.selecionada = null;
      renderSelecionada();
    }
  }
  showToast(`Comanda ${codigo || ""} atualizada para ${statusLabel(toStatus)}.`);
}

async function abrirComanda(event) {
  event.preventDefault();
  const codigo = el.codigoComanda.value;
  if (!codigo) throw new Error("Selecione um código.");
  const tipoEntrega = String(el.tipoEntrega.value || "RETIRADA");
  const mesa = sanitizeOptionalText(el.mesaComanda.value);
  if (tipoEntrega === "ENTREGA" && !mesa) {
    throw new Error("Mesa e obrigatoria para comandas do tipo ENTREGA.");
  }
  const created = await api("/comandas/abrir", {
    method: "POST",
    body: JSON.stringify({
      codigo,
      tipo_entrega: tipoEntrega,
      mesa,
      observacoes: sanitizeOptionalText(el.obsComanda.value),
    }),
  });
  el.abrirComandaForm.reset();
  syncMesaObrigatoriaPorTipoEntrega();
  await carregarCodigosDisponiveis();
  await carregarComandasAbertas();
  await selecionarComanda(created.id);
  setModoAnotacao(true, { focusSearch: true });
  closeAbrirSidebar();
  showToast(`Comanda ${created.comanda_codigo} aberta.`);
}

function syncMesaObrigatoriaPorTipoEntrega() {
  const entrega = String(el.tipoEntrega.value || "RETIRADA") === "ENTREGA";
  el.mesaComanda.required = entrega;
  el.mesaComanda.placeholder = entrega ? "Obrigatório para ENTREGA" : "Ex.: 12";
}

async function adicionarItem(event) {
  event.preventDefault();
  if (!state.selecionada) throw new Error("Selecione uma comanda.");
  if (!isComandaEditavel(state.selecionada)) {
    throw new Error("Status atual não permite alterar itens.");
  }

  const produtoId = parsePositiveIntegerInput(el.produtoId.value, "Produto", {
    min: 1,
    max: 999999,
  });
  const quantidade = parsePositiveIntegerInput(el.itemQtd.value, "Quantidade", {
    min: 1,
    max: 999,
  });
  const desconto = parseNonNegativeMoneyInput(el.itemDesconto.value || "0", "Desconto");
  const produtoExiste = state.produtos.some((row) => row.id === produtoId);
  if (!produtoExiste) throw new Error("Produto inválido.");

  const payload = {
    produto_id: produtoId,
    quantidade,
    desconto: desconto.toFixed(2),
    observacoes: sanitizeOptionalText(el.itemObs.value),
    adicionais: getAdicionaisSelecionados(),
  };
  const editando = Boolean(state.itemEditId);
  if (editando) {
    await api(`/comandas/${state.selecionada.id}/itens/${state.itemEditId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  } else {
    await api(`/comandas/${state.selecionada.id}/itens`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  resetItemFormMode();
  await selecionarComanda(state.selecionada.id);
  await carregarComandasAbertas();
  await carregarSugestoes();
  showToast(editando ? "Item alterado na comanda." : "Item anotado na comanda.");
}

async function adicionarItemRapido(produtoId, quantidade = 1) {
  if (!state.selecionada) throw new Error("Selecione uma comanda para usar atalhos.");
  if (!isComandaEditavel(state.selecionada)) {
    throw new Error("Status atual não permite adicionar itens.");
  }
  const produtoValido = parsePositiveIntegerInput(produtoId, "Produto", {
    min: 1,
    max: 999999,
  });
  const quantidadeValida = parsePositiveIntegerInput(quantidade, "Quantidade", {
    min: 1,
    max: CATALOG_QUICK_QTY_MAX,
  });
  if (!state.produtos.some((row) => row.id === produtoValido)) {
    throw new Error("Produto não encontrado.");
  }
  await api(`/comandas/${state.selecionada.id}/itens`, {
    method: "POST",
    body: JSON.stringify({
      produto_id: produtoValido,
      quantidade: quantidadeValida,
      desconto: "0.00",
      observacoes: null,
      adicionais: [],
    }),
  });
  await selecionarComanda(state.selecionada.id);
  await carregarComandasAbertas();
  await carregarSugestoes();
  showToast("Item adicionado rapidamente.");
}

async function mudarStatus(status) {
  if (!state.selecionada) throw new Error("Selecione uma comanda.");
  const comandaId = state.selecionada.id;
  let reporEstoque = true;
  if (status === "CANCELADO") {
    const confirma = window.confirm("Cancelar a comanda selecionada?");
    if (!confirma) return;
    reporEstoque = window.confirm(
      "Repor itens no estoque?\nOK = sim\nCancelar = considerar itens perdidos"
    );
  }
  await api(`/comandas/${state.selecionada.id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, repor_estoque: reporEstoque }),
  });
  await carregarComandasAbertas();
  try {
    await selecionarComanda(comandaId);
  } catch (_e) {
    const editaveis = comandasParaAlteracao();
    if (editaveis.length) {
      await selecionarComanda(editaveis[0].id);
    } else {
      state.selecionada = null;
      renderSelecionada();
    }
  }
  if (status === "CANCELADO") {
    resetItemFormMode();
  }
  await carregarCodigosDisponiveis();
  if (status === "ENTREGUE" || status === "CANCELADO") {
    await carregarHistoricoCupons();
  }
  showToast(`Status alterado para ${statusLabel(status)}.`);
}

async function removerItem(itemId) {
  if (!state.selecionada) throw new Error("Selecione uma comanda.");
  if (!isComandaEditavel(state.selecionada)) {
    throw new Error("Status atual não permite remover itens.");
  }
  await api(`/comandas/${state.selecionada.id}/itens/${itemId}`, { method: "DELETE" });
  if (state.itemEditId === itemId) {
    resetItemFormMode();
  }
  await selecionarComanda(state.selecionada.id);
  await carregarComandasAbertas();
  showToast("Item removido.");
}

async function moverItem(itemId) {
  if (!state.selecionada) throw new Error("Selecione uma comanda.");
  if (!isComandaEditavel(state.selecionada)) {
    throw new Error("Status atual não permite mover itens.");
  }
  const destinoSelect = el.itensList.querySelector(`[data-transfer-dest="${itemId}"]`);
  const destinoPedidoId = Number(destinoSelect ? destinoSelect.value : "0");
  if (!destinoPedidoId) {
    throw new Error("Selecione uma comanda de destino.");
  }
  await api(`/comandas/${state.selecionada.id}/itens/${itemId}/mover`, {
    method: "POST",
    body: JSON.stringify({ destino_pedido_id: destinoPedidoId }),
  });
  if (state.itemEditId === itemId) {
    resetItemFormMode();
  }
  await selecionarComanda(state.selecionada.id);
  await carregarComandasAbertas();
  showToast("Item transferido para outra comanda.");
}

function imprimirCupom() {
  if (!state.selecionada) throw new Error("Selecione uma comanda.");
  window.open(`/comandas/${state.selecionada.id}/cupom`, "_blank", "noopener");
}

async function finalizarPedidoEImprimirCozinha() {
  if (!state.selecionada) throw new Error("Selecione uma comanda.");
  const comandaId = state.selecionada.id;
  const origemEhAlteracao = state.selecionada.status !== "ABERTO";
  if (state.selecionada.status === "ENTREGUE" || state.selecionada.status === "CANCELADO") {
    throw new Error("Comanda finalizada/cancelada não pode ser enviada para cozinha.");
  }
  if (!state.selecionada.itens || !state.selecionada.itens.length) {
    throw new Error("Adicione pelo menos um item antes de finalizar.");
  }
  if (state.selecionada.status === "ABERTO") {
    await api(`/comandas/${comandaId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "EM_PREPARO" }),
    });
  }

  if (state.erpConfig.impressao_cozinha_automatica) {
    window.open(
      `/comandas/${comandaId}/cupom?cozinha=true&auto_print=true&alteracao=${
        origemEhAlteracao ? "true" : "false"
      }`,
      "_blank",
      "noopener"
    );
  }

  await carregarComandasAbertas();
  state.selecionada = null;
  resetItemFormMode();
  setModoAnotacao(false);
  renderSelecionada();
  renderComandaPicker();
  showToast("Pedido enviado para cozinha. Comanda desmarcada.");
}

async function run(fn) {
  try {
    await fn();
  } catch (error) {
    showToast(error.message || "Erro inesperado.", true);
  }
}

async function tickRealtimeMobile() {
  if (!state.realtime.enabled || state.realtime.busy || document.hidden) return;
  state.realtime.busy = true;
  try {
    const selectedId = state.selecionada ? state.selecionada.id : null;
    await carregarComandasAbertas();
    if (selectedId) {
      const exists = state.comandas.some((row) => row.id === selectedId);
      if (exists) {
        await selecionarComanda(selectedId);
      } else {
        const editaveis = comandasParaAlteracao();
        if (state.anotando && editaveis.length) {
          await selecionarComanda(editaveis[0].id);
        } else if (!state.comandas.length) {
          state.selecionada = null;
          renderSelecionada();
        } else {
          state.selecionada = null;
          renderSelecionada();
        }
      }
    } else {
      const editaveis = comandasParaAlteracao();
      if (state.anotando && editaveis.length) {
        await selecionarComanda(editaveis[0].id);
      } else if (!state.comandas.length) {
        state.selecionada = null;
        renderSelecionada();
      }
    }
  } catch (_err) {
    // Atualização em segundo plano: ignora falhas transitórias.
  } finally {
    state.realtime.busy = false;
  }
}

function startRealtimeMobile() {
  if (state.realtime.timerId) {
    window.clearInterval(state.realtime.timerId);
  }
  if (!state.realtime.enabled) return;
  state.realtime.timerId = window.setInterval(() => {
    run(tickRealtimeMobile);
  }, state.realtime.intervalMs);
}

function bind() {
  el.tabButtons.forEach((button) => {
    button.addEventListener("click", () => setActiveTab(button.dataset.tab));
  });
  el.menuToggle.addEventListener("click", openSidebar);
  el.sidebarClose.addEventListener("click", closeSidebar);
  el.sidebarBackdrop.addEventListener("click", closeSidebar);
  el.openAbrirSidebar.addEventListener("click", openAbrirSidebar);
  el.abrirSidebarClose.addEventListener("click", closeAbrirSidebar);
  el.abrirSidebarBackdrop.addEventListener("click", closeAbrirSidebar);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAllSidebars();
  });

  el.abrirComandaForm.addEventListener("submit", (event) => run(() => abrirComanda(event)));
  el.tipoEntrega.addEventListener("change", syncMesaObrigatoriaPorTipoEntrega);
  syncMesaObrigatoriaPorTipoEntrega();
  el.usarComandaBtn.addEventListener("click", () => run(() => usarComandaSelecionada()));
  if (el.stopAnotacaoBtn) {
    el.stopAnotacaoBtn.addEventListener("click", () => {
      setModoAnotacao(false);
      showToast("Anotação encerrada.");
    });
  }
  el.refreshComandasBtn.addEventListener("click", () => run(() => carregarComandasAbertas()));
  if (el.painelComandasRefresh) {
    el.painelComandasRefresh.addEventListener("click", () => run(() => carregarComandasAbertas()));
  }
  if (el.painelComandasSearch) {
    el.painelComandasSearch.addEventListener("input", renderPainelComandas);
  }
  if (el.painelComandasFiltros) {
    el.painelComandasFiltros.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-cmd-filter]");
      if (!button) return;
      setPainelFiltroStatus(button.dataset.cmdFilter);
    });
  }
  if (el.painelComandasGrid) {
    el.painelComandasGrid.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-painel-codigo-id]");
      if (!button) return;
      run(() => agirComandaPainel(
        Number(button.dataset.painelCodigoId || "0"),
        button.dataset.painelStatus || "",
        Number(button.dataset.painelPedidoId || "0")
      ));
    });
  }
  if (el.entregaControlList) {
    el.entregaControlList.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-entrega-to-status]");
      if (!button) return;
      run(() =>
        alterarStatusControleEntrega(
          Number(button.dataset.entregaPedidoId || "0"),
          button.dataset.entregaCodigo || "",
          button.dataset.entregaFromStatus || "",
          button.dataset.entregaToStatus || ""
        )
      );
    });
  }
  if (el.historicoRefresh) {
    el.historicoRefresh.addEventListener("click", () => run(() => carregarHistoricoCupons()));
  }
  if (el.historicoSearch) {
    el.historicoSearch.addEventListener("input", renderHistoricoCupons);
  }
  el.comandaSearch.addEventListener("input", renderComandaPicker);
  el.itemForm.addEventListener("submit", (event) => run(() => adicionarItem(event)));
  if (el.itemCancelEdit) {
    el.itemCancelEdit.addEventListener("click", () => resetItemFormMode());
  }
  el.statusButtons.forEach((button) => {
    button.addEventListener("click", () => run(() => mudarStatus(button.dataset.status)));
  });
  el.printCupom.addEventListener("click", () => run(() => imprimirCupom()));
  if (el.finalizarImprimir) {
    el.finalizarImprimir.addEventListener("click", () =>
      run(() => finalizarPedidoEImprimirCozinha())
    );
  }

  el.itensList.addEventListener("click", (event) => {
    const editBtn = event.target.closest("button[data-edit-item]");
    if (editBtn) {
      run(() => ativarEdicaoItem(Number(editBtn.dataset.editItem)));
      return;
    }
    const removeBtn = event.target.closest("button[data-remove-item]");
    if (removeBtn) {
      run(() => removerItem(Number(removeBtn.dataset.removeItem)));
      return;
    }
    const transferBtn = event.target.closest("button[data-transfer-item]");
    if (transferBtn) {
      run(() => moverItem(Number(transferBtn.dataset.transferItem)));
    }
  });
  el.produtoSearch.addEventListener("input", renderCatalogo);
  el.produtoId.addEventListener("change", () => {
    renderAdicionaisPicker();
    atualizarValorFinalEstimado();
  });
  el.itemQtd.addEventListener("input", atualizarValorFinalEstimado);
  el.itemDesconto.addEventListener("input", atualizarValorFinalEstimado);
  el.adicionaisBox.addEventListener("change", atualizarValorFinalEstimado);
  el.adicionaisBox.addEventListener("input", atualizarValorFinalEstimado);
  el.sugestoesMaisPedidos.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-sugestao-produto-id]");
    if (!btn) return;
    const produtoId = Number(btn.dataset.sugestaoProdutoId);
    run(() => adicionarItemRapido(produtoId, 1));
  });
  el.catalogoProdutos.addEventListener("click", (event) => {
    const quickAdjustBtn = event.target.closest("button[data-quick-produto][data-quick-delta]");
    if (quickAdjustBtn) {
      const produtoId = Number(quickAdjustBtn.dataset.quickProduto || "0");
      if (!produtoId) return;
      const delta = Number(quickAdjustBtn.dataset.quickDelta || "0");
      const nextQty = adjustCatalogQuickQty(produtoId, delta);
      const card = quickAdjustBtn.closest(".produto-card");
      const qtyInput = card
        ? card.querySelector(`input[data-quick-produto-input="${produtoId}"]`)
        : null;
      if (qtyInput) {
        qtyInput.value = String(nextQty);
      }
      return;
    }
    const customBtn = event.target.closest("button[data-add-produto-custom]");
    if (customBtn) {
      const produtoId = Number(customBtn.dataset.addProdutoCustom || "0");
      if (!produtoId) return;
      const quantidade = getCatalogQuickQty(produtoId);
      run(() => adicionarItemRapido(produtoId, quantidade));
      return;
    }
    const imageBtn = event.target.closest("button[data-pick-produto-id]");
    if (!imageBtn) return;
    const produtoId = Number(imageBtn.dataset.pickProdutoId || "0");
    if (!produtoId) return;
    run(async () => {
      abrirAjusteFino(produtoId);
      showToast("Produto aberto para edição.");
    });
  });
  el.catalogoProdutos.addEventListener("input", (event) => {
    const input = event.target.closest("input[data-quick-produto-input]");
    if (!input) return;
    const produtoId = Number(input.dataset.quickProdutoInput || "0");
    if (!produtoId) return;
    setCatalogQuickQty(produtoId, input.value);
  });
  el.catalogoProdutos.addEventListener("change", (event) => {
    const input = event.target.closest("input[data-quick-produto-input]");
    if (!input) return;
    const produtoId = Number(input.dataset.quickProdutoInput || "0");
    if (!produtoId) return;
    const nextQty = setCatalogQuickQty(produtoId, input.value);
    input.value = String(nextQty);
  });
  el.obsRapidas.addEventListener("click", (event) => {
    const clearButton = event.target.closest("button[data-obs-clear]");
    if (clearButton) {
      el.itemObs.value = "";
      return;
    }
    const chip = event.target.closest("button[data-obs-quick]");
    if (!chip) return;
    aplicarObservacaoRapida(chip.dataset.obsQuick);
  });

  [el.mobileUiTheme, el.mobileUiDensity, el.mobileUiFontSize, el.mobileUiRadius, el.mobileUiContrast, el.mobileUiLayout, el.mobileUiMotion, el.mobileUiCatalogCompact, el.mobileUiShowIcons]
    .filter(Boolean)
    .forEach((control) => {
      control.addEventListener("change", () => {
        applyUIOptionsFromForm();
      });
    });
  if (el.mobileOptionsForm) {
    el.mobileOptionsForm.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-mobile-ui-preset]");
      if (!button) return;
      applyMobileUIPreset(button.dataset.mobileUiPreset);
    });
  }
  if (el.mobileUiReset) {
    el.mobileUiReset.addEventListener("click", resetUIOptions);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  loadUIOptions();
  loadActiveTab();
  bind();
  setPainelFiltroStatus("EM_PREPARO");
  renderObsRapidas();
  setModoAnotacao(false);
  await run(loadERPConfig);
  renderComandaSelecionadaAlert();
  atualizarVisibilidadeFluxo();
  atualizarValorFinalEstimado();
  startRealtimeMobile();
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      run(tickRealtimeMobile);
    }
  });
  await run(carregarProdutos);
  await run(carregarAdicionais);
  await run(carregarSugestoes);
  await run(carregarCodigosDisponiveis);
  await run(carregarComandasAbertas);
  await run(carregarHistoricoCupons);
});

