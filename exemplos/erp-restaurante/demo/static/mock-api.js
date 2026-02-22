
(() => {
  "use strict";

  const STORAGE_KEY = "recati_churrascaria_mock_backend_v1";
  const VERSION = 1;
  const ACTIVE_STATUSES = new Set(["ABERTO"]);
  const FINAL_STATUSES = new Set(["FINALIZADA", "CANCELADO"]);
  const nativeOpen = typeof window.open === "function" ? window.open.bind(window) : null;

  const DEFAULT_CONFIG = {
    empresa_nome: "ChurrascariaERP",
    empresa_subtitulo: "Caixa, Pagamento e Fechamento",
    email_rodape: "ChurrascariaERP",
    logo_url: "../static/logo.png",
    cor_primaria: "#d8252e",
    cor_secundaria: "#860f12",
    cor_topo_primaria: "#ce1d24",
    cor_topo_secundaria: "#7f0d11",
    tempo_real_segundos: 5,
    tempo_real_ativo: true,
    permitir_status_pronto: false,
    finalizar_mobile_status: "ABERTO",
    impressao_cozinha_automatica: true,
    mobile_obs_rapidas: ["Mal passado", "Ao ponto", "Bem passado", "Sem sal", "Sem cebola"],
    mobile_mais_pedidos: ["Buffet", "Mini Espeto", "Espeto Completo", "Buffet Almoco", "Bebidas"],
    mobile_motivos_reabertura_entregue: ["Erro no status", "Pedido nao saiu completo", "Cliente solicitou ajuste"],
    layout_css_custom: "",
    layout_textos_custom: {}
  };

  const fmtMoney = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const nowIso = () => new Date().toISOString();
  const toInt = (v, d = 0) => { const n = Number(v); return Number.isFinite(n) ? Math.round(n) : d; };
  const toBool = (v, d = false) => {
    if (typeof v === "boolean") return v;
    const s = String(v || "").toLowerCase();
    if (s === "true") return true;
    if (s === "false") return false;
    return d;
  };
  const txt = (v, d = "") => { const s = String(v == null ? "" : v).trim(); return s || d; };
  const money = (v) => { const n = Number(v || 0); return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0; };
  const clone = (obj) => (typeof structuredClone === "function" ? structuredClone(obj) : JSON.parse(JSON.stringify(obj)));

  function dateKey(value) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function nextId(state, key) {
    const id = Math.max(1, toInt(state.counters[key], 1));
    state.counters[key] = id + 1;
    return id;
  }

  function byId(list, id) {
    return list.find((x) => x.id === toInt(id, 0)) || null;
  }

  function codeByCode(state, code) {
    return state.codigos.find((x) => x.codigo === txt(code, "").toUpperCase()) || null;
  }

  function activeComandaByCode(state, code) {
    const key = txt(code, "").toUpperCase();
    return state.comandas.find((x) => x.comanda_codigo === key && ACTIVE_STATUSES.has(String(x.status || ""))) || null;
  }

  function complexity(totalItens) {
    if (totalItens <= 0) return "Sem itens";
    if (totalItens <= 2) return "Pedido minusculo";
    if (totalItens <= 5) return "Pedido pequeno";
    if (totalItens <= 8) return "Pedido medio";
    return "Pedido grande";
  }

  function recalcComanda(state, comanda) {
    comanda.itens = Array.isArray(comanda.itens) ? comanda.itens : [];
    comanda.itens.forEach((item) => {
      item.quantidade = Math.max(1, toInt(item.quantidade, 1));
      item.preco_unitario = money(item.preco_unitario);
      item.desconto = money(item.desconto);
      item.adicionais = Array.isArray(item.adicionais) ? item.adicionais : [];
      const addTotal = money(item.adicionais.reduce((a, ad) => a + money(ad.subtotal), 0));
      const bruto = money(item.preco_unitario * item.quantidade + addTotal);
      item.desconto = Math.max(0, Math.min(bruto, item.desconto));
      item.subtotal = money(bruto - item.desconto);
    });
    comanda.total = money(comanda.itens.reduce((a, item) => a + money(item.subtotal), 0));
    comanda.total_itens = comanda.itens.reduce((a, item) => a + toInt(item.quantidade, 0), 0);
    comanda.complexidade = complexity(comanda.total_itens);
    const pago = money(state.pagamentos.filter((p) => p.pedido_id === comanda.id && p.status === "APROVADO").reduce((a, p) => a + money(p.valor), 0));
    comanda.pagamento = { total_comanda: comanda.total, total_pago: pago, saldo_pendente: Math.max(0, money(comanda.total - pago)) };
    const code = codeByCode(state, comanda.comanda_codigo);
    if (code) code.em_uso = ACTIVE_STATUSES.has(comanda.status);
    if (comanda.status !== "CANCELADO" && comanda.pagamento.saldo_pendente <= 0 && comanda.total > 0) {
      comanda.status = "FINALIZADA";
      if (code) code.em_uso = false;
    }
  }

  function syncCodes(state) {
    state.codigos.forEach((code) => { code.em_uso = Boolean(activeComandaByCode(state, code.codigo)); });
  }

  function normalizeImage(url) {
    const raw = txt(url, "");
    if (!raw) return "../static/img/pao.svg";
    if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("data:")) return raw;
    if (raw.startsWith("/static/")) return `..${raw}`;
    if (raw.startsWith("../") || raw.startsWith("./")) return raw;
    return "../static/img/pao.svg";
  }

  function buildItem(state, pedidoId, payload) {
    const produto = byId(state.produtos, payload.produto_id);
    if (!produto) throw new Error("Produto nao encontrado.");
    const qtd = Math.max(1, toInt(payload.quantidade, 1));
    const desc = Math.max(0, money(payload.desconto || 0));
    const adicionais = (Array.isArray(payload.adicionais) ? payload.adicionais : []).map((raw) => {
      const ad = byId(state.adicionais, raw.adicional_id);
      if (!ad) return null;
      const aq = Math.max(1, toInt(raw.quantidade, 1));
      return { id: nextId(state, "itemAdicional"), adicional_id: ad.id, nome: ad.nome, quantidade: aq, preco_unitario: money(ad.preco), subtotal: money(ad.preco * aq) };
    }).filter(Boolean);
    const bruto = money(produto.preco * qtd + adicionais.reduce((a, ad) => a + money(ad.subtotal), 0));
    const desconto = Math.min(bruto, desc);
    return { id: nextId(state, "item"), pedido_id: pedidoId, produto_id: produto.id, produto_nome: produto.nome, quantidade: qtd, observacoes: txt(payload.observacoes, "") || null, preco_unitario: money(produto.preco), desconto, subtotal: money(bruto - desconto), adicionais };
  }

  function stockAdjust(state, item, addBack) {
    const produto = byId(state.produtos, item.produto_id);
    if (!produto || !produto.controla_estoque) return 0;
    const qtd = Math.max(0, toInt(item.quantidade, 0));
    produto.estoque_atual = Math.max(0, toInt(produto.estoque_atual, 0) + (addBack ? qtd : -qtd));
    return qtd;
  }

  function seed() {
    const created = nowIso();
    const state = {
      version: VERSION,
      counters: { produto: 1, adicional: 1, codigo: 1, comanda: 1, item: 1, itemAdicional: 1, pagamento: 1 },
      config: clone(DEFAULT_CONFIG),
      produtos: [], adicionais: [], codigos: [], comandas: [], pagamentos: []
    };

    [["Farofa Extra",3],["Vinagrete",2.5],["Molho de Alho",2],["Queijo Coalho Extra",4.5],["Gelo e Limao",1.5]].forEach(([nome,preco]) => {
      state.adicionais.push({ id: nextId(state,"adicional"), nome, preco, ativo: true, criado_em: created });
    });

    const adMap = Object.fromEntries(state.adicionais.map((a) => [a.nome, a.id]));
    const links = {
      "Buffet": ["Farofa Extra","Vinagrete","Molho de Alho"],
      "Mini Espeto": ["Farofa Extra","Vinagrete","Molho de Alho"],
      "Espeto Completo": ["Farofa Extra","Vinagrete","Molho de Alho","Queijo Coalho Extra"],
      "Buffet Almoco": ["Farofa Extra","Vinagrete","Molho de Alho"],
      "Bebidas": ["Gelo e Limao"],
      "Refrigerante Lata 350ml": ["Gelo e Limao"],
      "Suco Natural 500ml": ["Gelo e Limao"],
      "Cerveja Long Neck": ["Gelo e Limao"],
      "Costela Fatiada": ["Farofa Extra","Vinagrete","Molho de Alho","Queijo Coalho Extra"]
    };

    [["Buffet",59.9,120,"../static/img/sanduiche.svg","Buffet","Buffet por kg"],["Mini Espeto",12.9,180,"../static/img/esfiha.svg","Mini Espeto","Espeto individual"],["Espeto Completo",34.9,110,"../static/img/misto.svg","Espeto Completo","Espeto com acompanhamentos"],["Buffet Almoco",39.9,90,"../static/img/empada.svg","Buffet Almoco","Prato executivo de almoco"],["Bebidas",8.9,250,"../static/img/suco.svg","Bebidas","Item geral de bebidas"],["Refrigerante Lata 350ml",6.5,260,"../static/img/suco.svg","Bebidas","Coca, Guarana ou Zero"],["Suco Natural 500ml",9.5,130,"../static/img/suco.svg","Bebidas","Laranja ou abacaxi"],["Agua Mineral 500ml",4,280,"../static/img/suco.svg","Bebidas","Com ou sem gas"],["Cerveja Long Neck",12,180,"../static/img/suco.svg","Bebidas","Garrafa 355ml"],["Pao de Alho",8,140,"../static/img/pao.svg","Acompanhamento","Unidade"],["Queijo Coalho na Brasa",11,120,"../static/img/pao_queijo.svg","Acompanhamento","Espeto de queijo"],["Costela Fatiada",44.9,70,"../static/img/croissant.svg","Espeto Completo","Porcao especial"]].forEach(([nome,preco,estoque,img,cat,desc]) => {
      state.produtos.push({ id: nextId(state,"produto"), nome, preco, estoque_atual: estoque, ativo: true, controla_estoque: true, imagem_url: img, categoria: cat, descricao: desc, adicional_ids: (links[nome] || []).map((n) => adMap[n]).filter(Boolean), criado_em: created });
    });

    for (let i=1;i<=20;i+=1) state.codigos.push({ id: nextId(state,"codigo"), codigo: `C-${String(i).padStart(3,"0")}`, ativo: true, em_uso: false, criado_em: created });

    const prodId = Object.fromEntries(state.produtos.map((p) => [p.nome, p.id]));
    const mkComanda = (seedCfg) => {
      const comanda = { id: nextId(state,"comanda"), comanda_codigo: seedCfg.codigo, mesa: seedCfg.mesa || null, status: seedCfg.status, tipo_entrega: seedCfg.tipo, observacoes: seedCfg.obs || null, criado_em: new Date(Date.now() - seedCfg.offset * 60000).toISOString(), itens: [], total: 0, total_itens: 0, complexidade: "Sem itens", pagamento: { total_comanda:0, total_pago:0, saldo_pendente:0 } };
      state.comandas.push(comanda);
      seedCfg.itens.forEach((i) => {
        const item = buildItem(state, comanda.id, { produto_id: prodId[i.nome], quantidade: i.qtd, observacoes: i.obs || null, desconto: i.desc || 0, adicionais: (i.adds || []).map(([n, q]) => ({ adicional_id: adMap[n], quantidade: q })) });
        stockAdjust(state, item, false);
        comanda.itens.push(item);
      });
      recalcComanda(state, comanda);
      (seedCfg.pay || []).forEach((p) => {
        state.pagamentos.push({ id: nextId(state,"pagamento"), pedido_id: comanda.id, metodo: p.metodo, status: p.status || "APROVADO", valor: p.valor, referencia_externa: p.ref || null, maquininha_id: p.maq || null, criado_em: comanda.criado_em });
      });
      recalcComanda(state, comanda);
    };

    mkComanda({ codigo: "C-010", status: "ABERTO", tipo: "RETIRADA", obs: "Sem mesa", offset: 25, itens: [{ nome: "Mini Espeto", qtd: 2 }] });
    mkComanda({ codigo: "C-003", status: "FINALIZADA", tipo: "RETIRADA", mesa: "5", obs: "Mesa 5", offset: 300, itens: [{ nome: "Espeto Completo", qtd: 1 }, { nome: "Agua Mineral 500ml", qtd: 1 }], pay: [{ metodo: "PIX", valor: 38.9, ref: "PIX-CH-01" }] });
    mkComanda({ codigo: "C-004", status: "FINALIZADA", tipo: "ENTREGA", obs: "Rua das Brasas, 45", offset: 420, itens: [{ nome: "Buffet Almoco", qtd: 2 }, { nome: "Bebidas", qtd: 1 }], pay: [{ metodo: "CARTAO_CREDITO", valor: 88.7, ref: "NSU-CH-9001", maq: "MAQ-02" }] });
    mkComanda({ codigo: "C-007", status: "CANCELADO", tipo: "RETIRADA", mesa: "2", obs: "Cliente desistiu", offset: 540, itens: [{ nome: "Buffet", qtd: 1 }] });

    syncCodes(state);
    return state;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const seeded = seed();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
        return seeded;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== VERSION) {
        const seeded = seed();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
        return seeded;
      }
      return parsed;
    } catch (_err) {
      const seeded = seed();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
  }

  const saveState = (state) => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  function buildMetrics(state, start, end) {
    const inRange = state.comandas.filter((c) => {
      const day = dateKey(c.criado_em);
      if (!day) return false;
      if (start && day < start) return false;
      if (end && day > end) return false;
      return true;
    });

    inRange.forEach((row) => recalcComanda(state, row));
    const ids = new Set(inRange.map((row) => row.id));

    let total_pedidos = 0;
    let pedidos_cancelados = 0;
    let total_vendido = 0;
    let total_cancelado = 0;
    let total_recebido = 0;
    const pedidos_por_status = {};
    const pedidos_por_tipo_entrega = {};
    const faturamento_por_tipo_entrega = {};
    const pagamentos_por_metodo = {};

    inRange.forEach((comanda) => {
      total_pedidos += 1;
      pedidos_por_status[comanda.status] = (pedidos_por_status[comanda.status] || 0) + 1;
      pedidos_por_tipo_entrega[comanda.tipo_entrega] = (pedidos_por_tipo_entrega[comanda.tipo_entrega] || 0) + 1;
      if (comanda.status === "CANCELADO") {
        pedidos_cancelados += 1;
        total_cancelado = money(total_cancelado + comanda.total);
      } else {
        total_vendido = money(total_vendido + comanda.total);
        faturamento_por_tipo_entrega[comanda.tipo_entrega] = money((faturamento_por_tipo_entrega[comanda.tipo_entrega] || 0) + comanda.total);
      }
    });

    state.pagamentos.forEach((p) => {
      if (!ids.has(p.pedido_id) || p.status !== "APROVADO") return;
      const day = dateKey(p.criado_em);
      if (start && day < start) return;
      if (end && day > end) return;
      total_recebido = money(total_recebido + p.valor);
      pagamentos_por_metodo[p.metodo] = money((pagamentos_por_metodo[p.metodo] || 0) + p.valor);
    });

    const pedidos_validos = Math.max(0, total_pedidos - pedidos_cancelados);
    const ticket_medio = pedidos_validos ? money(total_vendido / pedidos_validos) : 0;

    return {
      total_pedidos,
      pedidos_validos,
      pedidos_cancelados,
      total_vendido,
      total_recebido,
      total_cancelado,
      ticket_medio,
      pedidos_por_status,
      pedidos_por_tipo_entrega,
      faturamento_por_tipo_entrega,
      pagamentos_por_metodo,
    };
  }

  function csvEscape(v) {
    const raw = String(v == null ? "" : v);
    if (raw.includes(",") || raw.includes("\n") || raw.includes('"')) {
      return `"${raw.replaceAll('"', '""')}"`;
    }
    return raw;
  }

  function openBlob(content, type, target, features) {
    if (!nativeOpen) return null;
    const blob = new Blob([content], { type });
    const objectUrl = URL.createObjectURL(blob);
    const win = nativeOpen(objectUrl, target || "_blank", features || "noopener");
    setTimeout(() => URL.revokeObjectURL(objectUrl), 25000);
    return win;
  }

  function patchWindowOpen() {
    if (!nativeOpen || window.__padariaMockOpenPatched) return;
    window.__padariaMockOpenPatched = true;

    window.open = function patched(urlValue, target, features) {
      try {
        const u = new URL(String(urlValue || ""), window.location.href);
        const p = u.pathname;
        const state = loadState();

        if (/^\/comandas\/\d+\/cupom$/.test(p)) {
          const id = toInt(p.match(/^\/comandas\/(\d+)\/cupom$/)[1], 0);
          const comanda = byId(state.comandas, id);
          if (!comanda) throw new Error("Comanda nao encontrada");
          recalcComanda(state, comanda);
          const cozinha = u.searchParams.get("cozinha") === "true";
          const alteracao = u.searchParams.get("alteracao") === "true";
          const autoPrint = u.searchParams.get("auto_print") === "true";
          const items = (comanda.itens || []).map((item) => `<li>${item.quantidade}x ${item.produto_nome} - R$ ${fmtMoney.format(item.subtotal)}</li>`).join("") || "<li>Sem itens.</li>";
          const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Cupom</title><style>body{font-family:Arial,sans-serif;padding:20px}ul{padding-left:20px}</style></head><body><h1>${cozinha ? "Cupom Cozinha" : "Cupom Comanda"} ${comanda.comanda_codigo}${alteracao ? " (ALTERACAO)" : ""}</h1><p>Status: ${comanda.status}</p><ul>${items}</ul><p><strong>Total: R$ ${fmtMoney.format(comanda.total)}</strong></p>${autoPrint ? "<script>window.print();</script>" : ""}</body></html>`;
          return openBlob(html, "text/html;charset=utf-8", target, features);
        }

        if (p === "/relatorios/fechamento-caixa.csv") {
          const data = txt(u.searchParams.get("data"), dateKey(nowIso()));
          const payload = { data, ...buildMetrics(state, data, data) };
          const rows = [["Data", payload.data], ["Total pedidos", payload.total_pedidos], ["Pedidos validos", payload.pedidos_validos], ["Pedidos cancelados", payload.pedidos_cancelados], ["Total vendido", payload.total_vendido], ["Total recebido", payload.total_recebido], ["Ticket medio", payload.ticket_medio], ["", ""], ["Metodo", "Total"]];
          Object.keys(payload.pagamentos_por_metodo || {}).forEach((metodo) => rows.push([metodo, payload.pagamentos_por_metodo[metodo]]));
          const csv = `\uFEFF${rows.map((row) => row.map(csvEscape).join(",")).join("\n")}`;
          return openBlob(csv, "text/csv;charset=utf-8", target, features);
        }

        if (p === "/relatorios/faturamento-periodo.csv" || p === "/relatorios/faturamento-periodo/relatorio") {
          const ini = txt(u.searchParams.get("data_inicial"), dateKey(nowIso()));
          const fim = txt(u.searchParams.get("data_final"), ini);
          const base = buildMetrics(state, ini, fim);
          const dias = [];
          for (let d = new Date(`${ini}T00:00:00`); d <= new Date(`${fim}T00:00:00`); d.setDate(d.getDate() + 1)) {
            const key = dateKey(d.toISOString());
            const day = buildMetrics(state, key, key);
            dias.push({ data: key, total_pedidos: day.total_pedidos, pedidos_cancelados: day.pedidos_cancelados, total_vendido: day.total_vendido, total_recebido: day.total_recebido });
          }
          if (p.endsWith(".csv")) {
            const rows = [["Data inicial", ini], ["Data final", fim], ["Total pedidos", base.total_pedidos], ["Total vendido", base.total_vendido], ["Total recebido", base.total_recebido], ["Ticket medio", base.ticket_medio], ["", ""], ["Dia", "Pedidos", "Cancelados", "Vendido", "Recebido"]];
            dias.forEach((dia) => rows.push([dia.data, dia.total_pedidos, dia.pedidos_cancelados, dia.total_vendido, dia.total_recebido]));
            const csv = `\uFEFF${rows.map((row) => row.map(csvEscape).join(",")).join("\n")}`;
            return openBlob(csv, "text/csv;charset=utf-8", target, features);
          }
          const htmlRows = dias.map((dia) => `<tr><td>${dia.data}</td><td>${dia.total_pedidos}</td><td>${dia.pedidos_cancelados}</td><td>R$ ${fmtMoney.format(dia.total_vendido)}</td><td>R$ ${fmtMoney.format(dia.total_recebido)}</td></tr>`).join("") || "<tr><td colspan=\"5\">Sem dados no periodo.</td></tr>";
          const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Relatorio</title><style>body{font-family:Arial,sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px}</style></head><body><h1>Relatorio de Faturamento</h1><p>Periodo: ${ini} ate ${fim}</p><table><thead><tr><th>Dia</th><th>Pedidos</th><th>Cancelados</th><th>Vendido</th><th>Recebido</th></tr></thead><tbody>${htmlRows}</tbody></table></body></html>`;
          return openBlob(html, "text/html;charset=utf-8", target, features);
        }
      } catch (_err) {
        // no-op
      }
      return nativeOpen(urlValue, target, features);
    };
  }

  function parseBody(options) {
    if (!options || !("body" in options)) return null;
    const body = options.body;
    if (body == null) return null;
    if (typeof FormData !== "undefined" && body instanceof FormData) return body;
    if (typeof body === "string") {
      const raw = body.trim();
      if (!raw) return null;
      try { return JSON.parse(raw); } catch (_err) { return null; }
    }
    if (typeof body === "object") return body;
    return null;
  }

  async function request(path, options = {}) {
    const url = new URL(String(path || ""), window.location.origin);
    const method = txt(options.method, "GET").toUpperCase();
    const body = parseBody(options);
    const state = loadState();
    let dirty = false;

    const ok = (payload) => {
      if (dirty) {
        syncCodes(state);
        state.comandas.forEach((row) => recalcComanda(state, row));
        saveState(state);
      }
      return clone(payload);
    };
    const fail = (msg) => { throw new Error(msg || "Erro na API local"); };

    if (url.pathname === "/config/erp") {
      if (method === "GET") return ok(state.config);
      if (method === "PATCH" || method === "PUT") {
        const payload = body || {};
        const next = { ...state.config };
        if (payload.empresa_nome != null) next.empresa_nome = txt(payload.empresa_nome, next.empresa_nome).slice(0, 120);
        if (payload.empresa_subtitulo != null) next.empresa_subtitulo = txt(payload.empresa_subtitulo, next.empresa_subtitulo).slice(0, 180);
        if (payload.email_rodape != null) next.email_rodape = txt(payload.email_rodape, next.email_rodape).slice(0, 180);
        if (payload.logo_url != null) next.logo_url = normalizeImage(payload.logo_url);
        const hex = /^#[0-9A-Fa-f]{6}$/;
        if (hex.test(txt(payload.cor_primaria, ""))) next.cor_primaria = payload.cor_primaria;
        if (hex.test(txt(payload.cor_secundaria, ""))) next.cor_secundaria = payload.cor_secundaria;
        if (hex.test(txt(payload.cor_topo_primaria, ""))) next.cor_topo_primaria = payload.cor_topo_primaria;
        if (hex.test(txt(payload.cor_topo_secundaria, ""))) next.cor_topo_secundaria = payload.cor_topo_secundaria;
        if (payload.tempo_real_segundos != null) next.tempo_real_segundos = Math.min(120, Math.max(2, toInt(payload.tempo_real_segundos, 5)));
        if (payload.tempo_real_ativo != null) next.tempo_real_ativo = toBool(payload.tempo_real_ativo, true);
        if (payload.permitir_status_pronto != null) next.permitir_status_pronto = toBool(payload.permitir_status_pronto, false);
        if (payload.finalizar_mobile_status != null) next.finalizar_mobile_status = payload.finalizar_mobile_status === "FINALIZADA" ? "FINALIZADA" : "ABERTO";
        if (payload.impressao_cozinha_automatica != null) next.impressao_cozinha_automatica = toBool(payload.impressao_cozinha_automatica, true);
        if (payload.mobile_obs_rapidas != null) next.mobile_obs_rapidas = Array.isArray(payload.mobile_obs_rapidas) ? payload.mobile_obs_rapidas : String(payload.mobile_obs_rapidas).split(/\r?\n/);
        if (payload.mobile_mais_pedidos != null) next.mobile_mais_pedidos = Array.isArray(payload.mobile_mais_pedidos) ? payload.mobile_mais_pedidos : String(payload.mobile_mais_pedidos).split(/\r?\n/);
        if (payload.mobile_motivos_reabertura_entregue != null) next.mobile_motivos_reabertura_entregue = Array.isArray(payload.mobile_motivos_reabertura_entregue) ? payload.mobile_motivos_reabertura_entregue : String(payload.mobile_motivos_reabertura_entregue).split(/\r?\n/);
        if (payload.layout_css_custom != null) next.layout_css_custom = String(payload.layout_css_custom || "").slice(0, 20000);
        if (payload.layout_textos_custom != null && typeof payload.layout_textos_custom === "object") next.layout_textos_custom = payload.layout_textos_custom;
        state.config = next;
        dirty = true;
        return ok(state.config);
      }
      fail("Metodo nao permitido em /config/erp.");
    }

    if (url.pathname === "/config/erp/reset") {
      if (method !== "POST") fail("Metodo nao permitido.");
      state.config = clone(DEFAULT_CONFIG);
      dirty = true;
      return ok(state.config);
    }

    if (url.pathname === "/produtos/upload-imagem") {
      if (method !== "POST") fail("Metodo nao permitido.");
      if (body && typeof FormData !== "undefined" && body instanceof FormData) {
        const file = body.get("file");
        if (file && typeof FileReader !== "undefined") {
          const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error("Falha no upload da imagem."));
            reader.readAsDataURL(file);
          });
          return ok({ imagem_url: String(dataUrl || "../static/img/pao.svg") });
        }
      }
      return ok({ imagem_url: "../static/img/pao.svg" });
    }

    if (url.pathname === "/produtos") {
      if (method === "GET") {
        let rows = state.produtos.slice();
        const q = txt(url.searchParams.get("q"), "").toLowerCase();
        const ativo = url.searchParams.has("ativo") ? toBool(url.searchParams.get("ativo"), true) : null;
        if (q) rows = rows.filter((row) => String(row.nome || "").toLowerCase().includes(q));
        if (ativo !== null) rows = rows.filter((row) => Boolean(row.ativo) === ativo);
        rows.sort((a, b) => a.id - b.id);
        const page = Math.max(1, toInt(url.searchParams.get("page"), 1));
        const pageSize = Math.max(1, Math.min(500, toInt(url.searchParams.get("page_size"), 20)));
        const start = (page - 1) * pageSize;
        return ok({ page, page_size: pageSize, total: rows.length, items: rows.slice(start, start + pageSize) });
      }
      if (method === "POST") {
        const payload = body || {};
        const nome = txt(payload.nome, "");
        const preco = money(payload.preco);
        if (!nome) fail("Nome do produto obrigatorio.");
        if (preco <= 0) fail("Preco invalido.");
        const produto = {
          id: nextId(state, "produto"),
          nome,
          categoria: txt(payload.categoria, "") || null,
          descricao: txt(payload.descricao, "") || null,
          imagem_url: normalizeImage(payload.imagem_url),
          preco,
          ativo: toBool(payload.ativo, true),
          estoque_atual: Math.max(0, toInt(payload.estoque_atual, 0)),
          controla_estoque: toBool(payload.controla_estoque, true),
          adicional_ids: Array.isArray(payload.adicional_ids) ? payload.adicional_ids.map((id) => toInt(id, 0)).filter((id) => id > 0) : [],
          criado_em: nowIso(),
        };
        state.produtos.push(produto);
        dirty = true;
        return ok(produto);
      }
      fail("Metodo nao permitido em /produtos.");
    }

    if (/^\/produtos\/\d+\/estoque$/.test(url.pathname)) {
      if (method !== "PATCH") fail("Metodo nao permitido.");
      const id = toInt(url.pathname.match(/^\/produtos\/(\d+)\/estoque$/)[1], 0);
      const produto = byId(state.produtos, id);
      if (!produto) fail("Produto nao encontrado.");
      produto.estoque_atual = Math.max(0, toInt(produto.estoque_atual, 0) + toInt(body && body.delta, 0));
      dirty = true;
      return ok(produto);
    }

    if (/^\/produtos\/\d+$/.test(url.pathname)) {
      const id = toInt(url.pathname.match(/^\/produtos\/(\d+)$/)[1], 0);
      const produto = byId(state.produtos, id);
      if (!produto) fail("Produto nao encontrado.");
      if (method === "GET") return ok(produto);
      if (method === "PUT" || method === "PATCH") {
        const payload = body || {};
        if (payload.nome != null) produto.nome = txt(payload.nome, produto.nome);
        if (payload.categoria !== undefined) produto.categoria = txt(payload.categoria, "") || null;
        if (payload.descricao !== undefined) produto.descricao = txt(payload.descricao, "") || null;
        if (payload.imagem_url !== undefined) produto.imagem_url = normalizeImage(payload.imagem_url);
        if (payload.preco != null) produto.preco = Math.max(0.01, money(payload.preco));
        if (payload.ativo != null) produto.ativo = toBool(payload.ativo, produto.ativo);
        if (payload.estoque_atual != null) produto.estoque_atual = Math.max(0, toInt(payload.estoque_atual, 0));
        if (payload.controla_estoque != null) produto.controla_estoque = toBool(payload.controla_estoque, produto.controla_estoque);
        if (Array.isArray(payload.adicional_ids)) produto.adicional_ids = payload.adicional_ids.map((x) => toInt(x, 0)).filter((x) => x > 0);
        dirty = true;
        return ok(produto);
      }
      if (method === "DELETE") {
        const hard = toBool(url.searchParams.get("hard"), false);
        if (!hard) { produto.ativo = false; dirty = true; return ok(produto); }
        state.comandas.forEach((comanda) => {
          comanda.itens = (comanda.itens || []).filter((item) => item.produto_id !== produto.id);
          recalcComanda(state, comanda);
        });
        state.produtos = state.produtos.filter((p) => p.id !== produto.id);
        dirty = true;
        return ok(produto);
      }
      fail("Metodo nao permitido em /produtos/{id}.");
    }

    if (url.pathname === "/adicionais") {
      if (method === "GET") {
        let rows = state.adicionais.slice();
        const ativo = url.searchParams.has("ativo") ? toBool(url.searchParams.get("ativo"), true) : null;
        const q = txt(url.searchParams.get("q"), "").toLowerCase();
        const offset = Math.max(0, toInt(url.searchParams.get("offset"), 0));
        const limit = Math.max(1, Math.min(5000, toInt(url.searchParams.get("limit"), 500)));
        if (ativo !== null) rows = rows.filter((row) => Boolean(row.ativo) === ativo);
        if (q) rows = rows.filter((row) => String(row.nome || "").toLowerCase().includes(q));
        rows.sort((a, b) => a.id - b.id);
        return ok(rows.slice(offset, offset + limit));
      }
      if (method === "POST") {
        const nome = txt(body && body.nome, "");
        const preco = money(body && body.preco);
        if (!nome) fail("Nome do adicional obrigatorio.");
        if (preco <= 0) fail("Preco invalido.");
        const adicional = { id: nextId(state, "adicional"), nome, preco, ativo: toBool(body && body.ativo, true), criado_em: nowIso() };
        state.adicionais.push(adicional);
        dirty = true;
        return ok(adicional);
      }
      fail("Metodo nao permitido em /adicionais.");
    }

    if (/^\/adicionais\/\d+$/.test(url.pathname)) {
      const id = toInt(url.pathname.match(/^\/adicionais\/(\d+)$/)[1], 0);
      const adicional = byId(state.adicionais, id);
      if (!adicional) fail("Adicional nao encontrado.");
      if (method === "GET") return ok(adicional);
      if (method === "PUT" || method === "PATCH") {
        if (body && body.nome != null) adicional.nome = txt(body.nome, adicional.nome);
        if (body && body.preco != null) adicional.preco = Math.max(0.01, money(body.preco));
        if (body && body.ativo != null) adicional.ativo = toBool(body.ativo, adicional.ativo);
        dirty = true;
        return ok(adicional);
      }
      if (method === "DELETE") {
        const hard = toBool(url.searchParams.get("hard"), false);
        if (!hard) { adicional.ativo = false; dirty = true; return ok(adicional); }
        state.produtos.forEach((p) => { p.adicional_ids = (p.adicional_ids || []).filter((x) => x !== adicional.id); });
        state.comandas.forEach((comanda) => {
          (comanda.itens || []).forEach((item) => { item.adicionais = (item.adicionais || []).filter((x) => x.adicional_id !== adicional.id); });
          recalcComanda(state, comanda);
        });
        state.adicionais = state.adicionais.filter((x) => x.id !== adicional.id);
        dirty = true;
        return ok(adicional);
      }
      fail("Metodo nao permitido em /adicionais/{id}.");
    }

    if (url.pathname === "/comandas/codigos") {
      if (method === "GET") {
        let rows = state.codigos.slice();
        const ativo = url.searchParams.has("ativo") ? toBool(url.searchParams.get("ativo"), true) : null;
        const emUso = url.searchParams.has("em_uso") ? toBool(url.searchParams.get("em_uso"), false) : null;
        if (ativo !== null) rows = rows.filter((row) => Boolean(row.ativo) === ativo);
        if (emUso !== null) rows = rows.filter((row) => Boolean(row.em_uso) === emUso);
        rows.sort((a, b) => a.id - b.id);
        return ok(rows.map((row) => ({ ...row, status_visual: (!row.ativo ? "CANCELADO" : (activeComandaByCode(state, row.codigo)?.status || "LIBERADO")) })));
      }
      if (method === "POST") {
        const codigo = txt(body && body.codigo, "").toUpperCase();
        if (!codigo) fail("Codigo obrigatorio.");
        if (codeByCode(state, codigo)) fail("Codigo ja existe.");
        const row = { id: nextId(state, "codigo"), codigo, ativo: true, em_uso: false, criado_em: nowIso() };
        state.codigos.push(row);
        dirty = true;
        return ok({ ...row, status_visual: "LIBERADO" });
      }
      fail("Metodo nao permitido em /comandas/codigos.");
    }

    if (/^\/comandas\/codigos\/\d+\/liberar$/.test(url.pathname)) {
      if (method !== "POST") fail("Metodo nao permitido.");
      const id = toInt(url.pathname.match(/^\/comandas\/codigos\/(\d+)\/liberar$/)[1], 0);
      const code = byId(state.codigos, id);
      if (!code) fail("Codigo nao encontrado.");
      const ativa = activeComandaByCode(state, code.codigo);
      const confirmar = toBool(body && body.confirmar, false);
      if (ativa && !confirmar && !FINAL_STATUSES.has(ativa.status)) fail("Comanda em uso. Confirme para liberar.");
      if (ativa && !FINAL_STATUSES.has(ativa.status)) ativa.status = "CANCELADO";
      code.em_uso = false;
      dirty = true;
      return ok({ ...code, status_visual: "LIBERADO" });
    }

    if (/^\/comandas\/codigos\/\d+$/.test(url.pathname)) {
      const id = toInt(url.pathname.match(/^\/comandas\/codigos\/(\d+)$/)[1], 0);
      const code = byId(state.codigos, id);
      if (!code) fail("Codigo nao encontrado.");
      if (method === "PATCH" || method === "PUT") {
        if (body && body.ativo != null) code.ativo = toBool(body.ativo, code.ativo);
        dirty = true;
        return ok({ ...code, status_visual: (!code.ativo ? "CANCELADO" : (activeComandaByCode(state, code.codigo)?.status || "LIBERADO")) });
      }
      if (method === "DELETE") {
        if (activeComandaByCode(state, code.codigo)) fail("Codigo em uso nao pode ser excluido.");
        state.codigos = state.codigos.filter((x) => x.id !== code.id);
        dirty = true;
        return ok({ id: code.id, codigo: code.codigo, removido: true });
      }
      fail("Metodo nao permitido em /comandas/codigos/{id}.");
    }

    if (url.pathname === "/comandas/painel") {
      if (method !== "GET") fail("Metodo nao permitido.");
      const ativo = url.searchParams.has("ativo") ? toBool(url.searchParams.get("ativo"), true) : null;
      let codes = state.codigos.slice();
      if (ativo !== null) codes = codes.filter((row) => Boolean(row.ativo) === ativo);
      return ok(codes.sort((a,b) => a.codigo.localeCompare(b.codigo, "pt-BR")).map((code) => {
        const c = activeComandaByCode(state, code.codigo);
        return { codigo_id: code.id, codigo: code.codigo, ativo: code.ativo, em_uso: code.em_uso, status: c ? c.status : "LIBERADO", pedido_id: c ? c.id : null, mesa: c ? c.mesa : null, tipo_entrega: c ? c.tipo_entrega : null, total: c ? c.total : 0, criado_em: c ? c.criado_em : code.criado_em };
      }));
    }

    if (url.pathname === "/comandas/historico/cupons") {
      if (method !== "GET") fail("Metodo nao permitido.");
      const status = txt(url.searchParams.get("status"), "").toUpperCase();
      const onlyFinal = url.searchParams.has("somente_finalizadas") ? toBool(url.searchParams.get("somente_finalizadas"), true) : true;
      const ini = txt(url.searchParams.get("data_inicial"), "");
      const fim = txt(url.searchParams.get("data_final"), "");
      const limit = Math.max(1, Math.min(1000, toInt(url.searchParams.get("limit"), 200)));
      let rows = state.comandas.slice();
      if (onlyFinal) rows = rows.filter((row) => FINAL_STATUSES.has(row.status));
      if (status) rows = rows.filter((row) => String(row.status || "").toUpperCase() === status);
      if (ini) rows = rows.filter((row) => dateKey(row.criado_em) >= ini);
      if (fim) rows = rows.filter((row) => dateKey(row.criado_em) <= fim);
      rows.sort((a,b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime());
      return ok(rows.slice(0, limit).map((row) => ({ id: row.id, comanda_codigo: row.comanda_codigo, status: row.status, tipo_entrega: row.tipo_entrega, total: row.total, criado_em: row.criado_em })));
    }

    if (url.pathname === "/comandas/sugestoes/mais-pedidos") {
      if (method !== "GET") fail("Metodo nao permitido.");
      const limit = Math.max(1, Math.min(30, toInt(url.searchParams.get("limit"), 8)));
      const map = new Map();
      state.comandas.forEach((comanda) => {
        (comanda.itens || []).forEach((item) => {
          const p = byId(state.produtos, item.produto_id);
          const row = map.get(item.produto_id) || { produto_id: item.produto_id, nome: item.produto_nome, imagem_url: "../static/img/pao.svg", preco: item.preco_unitario, quantidade_total: 0 };
          if (p) { row.nome = p.nome; row.imagem_url = normalizeImage(p.imagem_url); row.preco = money(p.preco); }
          row.quantidade_total += Math.max(1, toInt(item.quantidade, 1));
          map.set(item.produto_id, row);
        });
      });
      return ok(Array.from(map.values()).sort((a,b) => b.quantidade_total - a.quantidade_total).slice(0, limit));
    }

    if (url.pathname === "/comandas/resetar-ativas") {
      if (method !== "POST") fail("Metodo nao permitido.");
      let comandas_resetadas = 0; let itens_afetados = 0; let codigos_liberados = 0; let estoque_reposto_total = 0;
      state.comandas.forEach((comanda) => {
        if (!ACTIVE_STATUSES.has(comanda.status)) return;
        comandas_resetadas += 1;
        (comanda.itens || []).forEach((item) => { itens_afetados += 1; estoque_reposto_total += stockAdjust(state, item, true); });
        comanda.itens = []; comanda.status = "CANCELADO"; recalcComanda(state, comanda);
        const code = codeByCode(state, comanda.comanda_codigo);
        if (code && code.em_uso) { code.em_uso = false; codigos_liberados += 1; }
      });
      dirty = true;
      return ok({ comandas_resetadas, itens_afetados, codigos_liberados, estoque_reposto_total });
    }

    if (url.pathname === "/comandas/abrir") {
      if (method !== "POST") fail("Metodo nao permitido.");
      const codigo = txt(body && body.codigo, "").toUpperCase();
      if (!codigo) fail("Codigo obrigatorio.");
      const code = codeByCode(state, codigo);
      if (!code || !code.ativo) fail("Codigo de comanda nao disponivel.");
      if (code.em_uso || activeComandaByCode(state, codigo)) fail("Codigo de comanda em uso.");
      const comanda = { id: nextId(state, "comanda"), comanda_codigo: codigo, mesa: txt(body && body.mesa, "") || null, status: "ABERTO", tipo_entrega: txt(body && body.tipo_entrega, "RETIRADA") === "ENTREGA" ? "ENTREGA" : "RETIRADA", observacoes: txt(body && body.observacoes, "") || null, criado_em: nowIso(), itens: [], total: 0, total_itens: 0, complexidade: "Sem itens", pagamento: { total_comanda: 0, total_pago: 0, saldo_pendente: 0 } };
      state.comandas.push(comanda);
      code.em_uso = true;
      dirty = true;
      return ok(comanda);
    }

    if (url.pathname === "/comandas") {
      if (method !== "GET") fail("Metodo nao permitido em /comandas.");
      let rows = state.comandas.map((row) => ({ id: row.id, comanda_codigo: row.comanda_codigo, mesa: row.mesa, status: row.status, tipo_entrega: row.tipo_entrega, total: row.total, total_itens: row.total_itens, complexidade: row.complexidade, criado_em: row.criado_em }));
      const status = txt(url.searchParams.get("status"), "").toUpperCase();
      const tipo = txt(url.searchParams.get("tipo_entrega"), "").toUpperCase();
      const codigo = txt(url.searchParams.get("codigo"), "").toLowerCase();
      const mesa = txt(url.searchParams.get("mesa"), "").toLowerCase();
      const ini = txt(url.searchParams.get("data_inicial"), "");
      const fim = txt(url.searchParams.get("data_final"), "");
      const tMin = url.searchParams.has("total_min") ? money(url.searchParams.get("total_min")) : null;
      const tMax = url.searchParams.has("total_max") ? money(url.searchParams.get("total_max")) : null;
      if (status) rows = rows.filter((row) => String(row.status || "").toUpperCase() === status);
      if (tipo) rows = rows.filter((row) => String(row.tipo_entrega || "").toUpperCase() === tipo);
      if (codigo) rows = rows.filter((row) => String(row.comanda_codigo || "").toLowerCase().includes(codigo));
      if (mesa) rows = rows.filter((row) => String(row.mesa || "").toLowerCase().includes(mesa));
      if (ini) rows = rows.filter((row) => dateKey(row.criado_em) >= ini);
      if (fim) rows = rows.filter((row) => dateKey(row.criado_em) <= fim);
      if (typeof tMin === "number" && !Number.isNaN(tMin)) rows = rows.filter((row) => money(row.total) >= tMin);
      if (typeof tMax === "number" && !Number.isNaN(tMax)) rows = rows.filter((row) => money(row.total) <= tMax);
      const by = txt(url.searchParams.get("order_by"), "id").toLowerCase();
      const dir = txt(url.searchParams.get("order_dir"), "desc").toLowerCase() === "asc" ? 1 : -1;
      rows.sort((a,b) => {
        if (by === "codigo") return String(a.comanda_codigo).localeCompare(String(b.comanda_codigo), "pt-BR") * dir;
        if (by === "mesa") return String(a.mesa || "").localeCompare(String(b.mesa || ""), "pt-BR") * dir;
        if (by === "status") return String(a.status || "").localeCompare(String(b.status || ""), "pt-BR") * dir;
        if (by === "tipo_entrega") return String(a.tipo_entrega || "").localeCompare(String(b.tipo_entrega || ""), "pt-BR") * dir;
        if (by === "total") return (money(a.total) - money(b.total)) * dir;
        if (by === "criado_em") return (new Date(a.criado_em).getTime() - new Date(b.criado_em).getTime()) * dir;
        return (toInt(a.id,0) - toInt(b.id,0)) * dir;
      });
      const offset = Math.max(0, toInt(url.searchParams.get("offset"), 0));
      const limit = Math.max(1, Math.min(5000, toInt(url.searchParams.get("limit"), 500)));
      return ok(rows.slice(offset, offset + limit));
    }

    if (/^\/comandas\/\d+\/itens\/\d+\/forcar$/.test(url.pathname)) {
      if (method !== "DELETE") fail("Metodo nao permitido.");
      const [, pedidoIdRaw, itemIdRaw] = url.pathname.match(/^\/comandas\/(\d+)\/itens\/(\d+)\/forcar$/);
      const comanda = byId(state.comandas, toInt(pedidoIdRaw, 0));
      if (!comanda) fail("Comanda nao encontrada.");
      const idx = (comanda.itens || []).findIndex((row) => row.id === toInt(itemIdRaw, 0));
      if (idx < 0) fail("Item nao encontrado.");
      stockAdjust(state, comanda.itens[idx], toBool(url.searchParams.get("repor_estoque"), true));
      comanda.itens.splice(idx, 1);
      recalcComanda(state, comanda);
      dirty = true;
      return ok(comanda);
    }

    if (/^\/comandas\/\d+\/itens\/\d+\/mover$/.test(url.pathname)) {
      if (method !== "POST") fail("Metodo nao permitido.");
      const [, pedidoIdRaw, itemIdRaw] = url.pathname.match(/^\/comandas\/(\d+)\/itens\/(\d+)\/mover$/);
      const origem = byId(state.comandas, toInt(pedidoIdRaw, 0));
      if (!origem) fail("Comanda origem nao encontrada.");
      if (!ACTIVE_STATUSES.has(origem.status)) fail("Status atual nao permite mover itens.");
      const destino = byId(state.comandas, toInt(body && body.destino_pedido_id, 0));
      if (!destino) fail("Comanda destino nao encontrada.");
      if (!ACTIVE_STATUSES.has(destino.status)) fail("Destino invalido para mover item.");
      const idx = (origem.itens || []).findIndex((row) => row.id === toInt(itemIdRaw, 0));
      if (idx < 0) fail("Item nao encontrado.");
      const item = origem.itens[idx];
      const moved = clone(item);
      moved.id = nextId(state, "item");
      moved.pedido_id = destino.id;
      moved.adicionais = (moved.adicionais || []).map((ad) => ({ ...ad, id: nextId(state, "itemAdicional") }));
      origem.itens.splice(idx, 1);
      destino.itens.push(moved);
      recalcComanda(state, origem);
      recalcComanda(state, destino);
      dirty = true;
      return ok(origem);
    }

    if (/^\/comandas\/\d+\/itens\/\d+$/.test(url.pathname)) {
      const [, pedidoIdRaw, itemIdRaw] = url.pathname.match(/^\/comandas\/(\d+)\/itens\/(\d+)$/);
      const comanda = byId(state.comandas, toInt(pedidoIdRaw, 0));
      if (!comanda) fail("Comanda nao encontrada.");
      if (!ACTIVE_STATUSES.has(comanda.status)) fail("Status atual nao permite alterar itens.");
      const idx = (comanda.itens || []).findIndex((row) => row.id === toInt(itemIdRaw, 0));
      if (idx < 0) fail("Item nao encontrado.");
      if (method === "DELETE") {
        stockAdjust(state, comanda.itens[idx], true);
        comanda.itens.splice(idx, 1);
        recalcComanda(state, comanda);
        dirty = true;
        return ok(comanda);
      }
      if (method === "PUT" || method === "PATCH") {
        stockAdjust(state, comanda.itens[idx], true);
        const novo = buildItem(state, comanda.id, body || {});
        stockAdjust(state, novo, false);
        novo.id = comanda.itens[idx].id;
        comanda.itens[idx] = novo;
        recalcComanda(state, comanda);
        dirty = true;
        return ok(comanda);
      }
      fail("Metodo nao permitido para item.");
    }

    if (/^\/comandas\/\d+\/itens$/.test(url.pathname)) {
      if (method !== "POST") fail("Metodo nao permitido.");
      const pedidoId = toInt(url.pathname.match(/^\/comandas\/(\d+)\/itens$/)[1], 0);
      const comanda = byId(state.comandas, pedidoId);
      if (!comanda) fail("Comanda nao encontrada.");
      if (!ACTIVE_STATUSES.has(comanda.status)) fail("Status atual nao permite alterar itens.");
      const item = buildItem(state, comanda.id, body || {});
      stockAdjust(state, item, false);
      comanda.itens.push(item);
      recalcComanda(state, comanda);
      dirty = true;
      return ok(comanda);
    }

    if (/^\/comandas\/\d+\/status$/.test(url.pathname)) {
      if (method !== "PATCH" && method !== "PUT") fail("Metodo nao permitido.");
      const pedidoId = toInt(url.pathname.match(/^\/comandas\/(\d+)\/status$/)[1], 0);
      const comanda = byId(state.comandas, pedidoId);
      if (!comanda) fail("Comanda nao encontrada.");
      const nextStatus = txt(body && body.status, "").toUpperCase();
      if (!nextStatus) fail("Status obrigatorio.");
      if (nextStatus === "CANCELADO") {
        const repor = toBool(body && body.repor_estoque, true);
        (comanda.itens || []).forEach((item) => stockAdjust(state, item, repor));
      }
      comanda.status = nextStatus;
      recalcComanda(state, comanda);
      dirty = true;
      return ok(comanda);
    }

    if (/^\/comandas\/\d+\/reset$/.test(url.pathname)) {
      if (method !== "POST") fail("Metodo nao permitido.");
      const pedidoId = toInt(url.pathname.match(/^\/comandas\/(\d+)\/reset$/)[1], 0);
      const comanda = byId(state.comandas, pedidoId);
      if (!comanda) fail("Comanda nao encontrada.");
      const status_anterior = comanda.status;
      let estoque_reposto_total = 0;
      (comanda.itens || []).forEach((item) => { estoque_reposto_total += stockAdjust(state, item, true); });
      comanda.itens = [];
      comanda.status = "CANCELADO";
      recalcComanda(state, comanda);
      const code = codeByCode(state, comanda.comanda_codigo);
      if (code) code.em_uso = false;
      dirty = true;
      return ok({ pedido_id: comanda.id, comanda_codigo: comanda.comanda_codigo, status_anterior, comanda_liberada: true, estoque_reposto_total });
    }

    if (/^\/comandas\/\d+$/.test(url.pathname)) {
      const pedidoId = toInt(url.pathname.match(/^\/comandas\/(\d+)$/)[1], 0);
      const comanda = byId(state.comandas, pedidoId);
      if (!comanda) fail("Comanda nao encontrada.");
      if (method === "GET") return ok(comanda);
      if (method === "DELETE") {
        const itens_removidos = (comanda.itens || []).length;
        const pagamentos_removidos = state.pagamentos.filter((row) => row.pedido_id === comanda.id).length;
        let estoque_reposto_total = 0;
        (comanda.itens || []).forEach((item) => { estoque_reposto_total += stockAdjust(state, item, true); });
        state.pagamentos = state.pagamentos.filter((row) => row.pedido_id !== comanda.id);
        state.comandas = state.comandas.filter((row) => row.id !== comanda.id);
        const code = codeByCode(state, comanda.comanda_codigo);
        if (code) code.em_uso = false;
        dirty = true;
        return ok({ comanda_id: comanda.id, comanda_codigo: comanda.comanda_codigo, itens_removidos, pagamentos_removidos, estoque_reposto_total });
      }
      fail("Metodo nao permitido em /comandas/{id}.");
    }

    if (url.pathname === "/pagamentos") {
      if (method === "GET") {
        const pedidoId = toInt(url.searchParams.get("pedido_id"), 0);
        const offset = Math.max(0, toInt(url.searchParams.get("offset"), 0));
        const limit = Math.max(1, Math.min(5000, toInt(url.searchParams.get("limit"), 500)));
        let rows = state.pagamentos.slice().sort((a,b) => b.id - a.id);
        if (pedidoId > 0) rows = rows.filter((row) => row.pedido_id === pedidoId);
        return ok(rows.slice(offset, offset + limit));
      }
      if (method === "POST") {
        const pedidoId = toInt(body && body.pedido_id, 0);
        const comanda = byId(state.comandas, pedidoId);
        if (!comanda) fail("Comanda nao encontrada para pagamento.");
        const pagamento = { id: nextId(state, "pagamento"), pedido_id: pedidoId, metodo: txt(body && body.metodo, "DINHEIRO"), status: "APROVADO", valor: Math.max(0.01, money(body && body.valor)), referencia_externa: null, maquininha_id: null, criado_em: nowIso() };
        state.pagamentos.push(pagamento);
        recalcComanda(state, comanda);
        dirty = true;
        return ok(pagamento);
      }
      fail("Metodo nao permitido em /pagamentos.");
    }

    if (url.pathname === "/pagamentos/maquininha/iniciar") {
      if (method !== "POST") fail("Metodo nao permitido.");
      const pedidoId = toInt(body && body.pedido_id, 0);
      const comanda = byId(state.comandas, pedidoId);
      if (!comanda) fail("Comanda nao encontrada para maquininha.");
      const pagamento = { id: nextId(state, "pagamento"), pedido_id: pedidoId, metodo: txt(body && body.metodo, "CARTAO_DEBITO"), status: "PENDENTE", valor: Math.max(0.01, money(body && body.valor)), referencia_externa: `TX-${Date.now()}`, maquininha_id: txt(body && body.maquininha_id, "") || "MAQ-01", criado_em: nowIso() };
      state.pagamentos.push(pagamento);
      recalcComanda(state, comanda);
      dirty = true;
      return ok(pagamento);
    }

    if (/^\/pagamentos\/maquininha\/\d+\/confirmar$/.test(url.pathname)) {
      if (method !== "PATCH" && method !== "PUT") fail("Metodo nao permitido.");
      const pagamentoId = toInt(url.pathname.match(/^\/pagamentos\/maquininha\/(\d+)\/confirmar$/)[1], 0);
      const pagamento = byId(state.pagamentos, pagamentoId);
      if (!pagamento) fail("Pagamento nao encontrado.");
      pagamento.status = toBool(body && body.aprovado, false) ? "APROVADO" : "RECUSADO";
      if (body && body.referencia_externa) pagamento.referencia_externa = txt(body.referencia_externa, pagamento.referencia_externa || "");
      const comanda = byId(state.comandas, pagamento.pedido_id);
      if (comanda) recalcComanda(state, comanda);
      dirty = true;
      return ok(pagamento);
    }

    if (url.pathname === "/relatorios/fechamento-caixa") {
      if (method !== "GET") fail("Metodo nao permitido.");
      const data = txt(url.searchParams.get("data"), dateKey(nowIso()));
      return ok({ data, ...buildMetrics(state, data, data) });
    }

    if (url.pathname === "/relatorios/faturamento-periodo") {
      if (method !== "GET") fail("Metodo nao permitido.");
      const ini = txt(url.searchParams.get("data_inicial"), dateKey(nowIso()));
      const fim = txt(url.searchParams.get("data_final"), ini);
      if (ini > fim) fail("Data inicial deve ser menor ou igual a data final.");
      const base = buildMetrics(state, ini, fim);
      const dias = [];
      for (let d = new Date(`${ini}T00:00:00`); d <= new Date(`${fim}T00:00:00`); d.setDate(d.getDate() + 1)) {
        const key = dateKey(d.toISOString());
        const day = buildMetrics(state, key, key);
        dias.push({ data: key, total_pedidos: day.total_pedidos, pedidos_validos: day.pedidos_validos, pedidos_cancelados: day.pedidos_cancelados, total_vendido: day.total_vendido, total_recebido: day.total_recebido, total_cancelado: day.total_cancelado, ticket_medio: day.ticket_medio });
      }
      return ok({ data_inicial: ini, data_final: fim, ...base, dias });
    }

    fail(`Rota nao suportada no mock: ${url.pathname}`);
    return null;
  }

  patchWindowOpen();

  window.ChurrascariaMockApi = {
    request,
    reset() {
      localStorage.removeItem(STORAGE_KEY);
    },
    getState() {
      return clone(loadState());
    },
  };
})();
