/* ============================================================
   APP — roteamento (hash), onboarding e todas as telas.
   ============================================================ */
(function () {
  const view = document.getElementById("view");
  const topbar = document.getElementById("topbar");
  const footer = document.getElementById("footer");
  const C = window.ENEM_CONTENT;
  const Q = window.ENEM_QUESTIONS;
  const R = window.ENEM_REDACAO;
  const RES = window.ENEM_RESOURCES;
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // avatares disponíveis para o perfil
  const AVATARES = ["🚀", "🦉", "🦊", "🐱", "🐼", "🦁", "🐢", "🦄", "🤓", "😎", "🧠", "⭐", "🔥", "🌱", "👩‍🎓", "👨‍🎓"];

  // metadados das fontes de questões
  const FONTE_META = {
    enem: { rotulo: "ENEM", emoji: "📘", chip: "azul" },
    vestibular: { rotulo: "Vestibular", emoji: "🎓", chip: "amarelo" },
    ia: { rotulo: "Gerada por IA", emoji: "🤖", chip: "roxo" }
  };
  // modos de fonte oferecidos no "Praticar"
  const FONTE_MODOS = {
    enem: { label: "Só ENEM", desc: "Questões baseadas em edições anteriores do ENEM", fontes: ["enem"] },
    enem_vest: { label: "ENEM + vestibulares", desc: "ENEM mais questões de vestibulares e outras provas", fontes: ["enem", "vestibular"] },
    todas: { label: "ENEM + vestibulares + IA", desc: "Tudo: ENEM, vestibulares e questões geradas por IA", fontes: ["enem", "vestibular", "ia"] }
  };
  const fonteContaPorArea = (fontes) => {
    const o = {};
    Q.forEach(q => { if (fontes.includes(q.fonte)) o[q.area] = (o[q.area] || 0) + 1; });
    return o;
  };

  // estado volátil de um simulado em andamento
  let examState = null;
  let examTimer = null;

  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg; t.classList.remove("hidden");
    clearTimeout(t._to);
    t._to = setTimeout(() => t.classList.add("hidden"), 2600);
  }

  function celebrarConquistas() {
    const novas = Engine.verificarConquistas();
    if (novas.length) {
      novas.forEach((b, i) => setTimeout(() => toast(`${b.emoji} Conquista: ${b.nome}!`), i * 1200));
    }
  }

  // verifica subida de nível de XP e comemora
  function celebrarProgresso() {
    const up = Engine.checarLevelUp();
    if (up.subiu) {
      setTimeout(() => toast(`${up.emoji} Subiu para o Nível ${up.para} — ${up.titulo}!`), 300);
    }
  }

  // ---------------- Router ----------------
  function go(hash) { location.hash = hash; }
  function router() {
    const s = Store.get();
    if (!s.nome) { renderOnboarding(); return; }
    topbar.classList.remove("hidden");
    footer.classList.remove("hidden");

    const raw = location.hash || "#/home";
    const [path, param] = raw.replace(/^#\//, "").split("/");
    window.scrollTo(0, 0);

    switch (path) {
      case "": case "home": renderHome(); break;
      case "trilhas": param ? renderMateria(param) : renderTrilhas(); break;
      case "licao": renderLicao(param); break;
      case "praticar": renderPraticarConfig(); break;
      case "simulado": renderSimulado(); break;
      case "resultado": renderResultado(param); break;
      case "redacao": renderRedacao(); break;
      case "plano": renderPlano(); break;
      case "recursos": renderRecursos(); break;
      case "perfil": renderPerfil(); break;
      default: renderHome();
    }
    // marca nav ativa
    document.querySelectorAll("#mainnav button").forEach(b => {
      b.classList.toggle("active", b.dataset.nav === "#/" + (path || "home") ||
        (path === "" && b.dataset.nav === "#/home"));
    });
  }

  // ---------------- Onboarding ----------------
  function renderOnboarding() {
    topbar.classList.add("hidden"); footer.classList.add("hidden");
    view.innerHTML = `
      <div class="onboard">
        <div class="mascote">🚀</div>
        <h1>Bem-vindo(a) à sua jornada rumo ao ENEM!</h1>
        <p class="muted">Coloque seu nome uma vez. Vou lembrar de você e do seu progresso — tudo fica salvo só aqui no seu navegador.</p>
        <input type="text" id="ob-nome" placeholder="Como posso te chamar?" maxlength="24" autocomplete="off"/>
        <h3 style="text-align:left;margin-top:8px">Escolha seu avatar</h3>
        <div class="avatar-pick" id="ob-avatar">
          ${AVATARES.map((a, i) => `<button type="button" class="avatar-opt ${i === 0 ? "selected" : ""}" data-val="${a}">${a}</button>`).join("")}
        </div>
        <h3 style="text-align:left;margin-top:8px">Qual seu maior objetivo? <span class="muted small">(opcional)</span></h3>
        <div class="opt-cards" id="ob-objetivo">
          ${[["🎓", "Passar na faculdade", "Vaga no curso dos sonhos"], ["🩺", "Curso concorrido", "Medicina, Direito, Engenharia..."], ["📜", "Certificar o Ensino Médio", "450+ por área e 500 na redação"], ["🌟", "Melhorar minha nota", "Evoluir no meu ritmo"]]
        .map(([e, t, d]) => `<div class="opt-card" data-val="${t}"><span class="emoji">${e}</span><span><b>${t}</b><span class="muted small">${d}</span></span></div>`).join("")}
        </div>
        <h3 style="text-align:left">Como você aprende melhor? <span class="muted small">(opcional)</span></h3>
        <div class="opt-cards" id="ob-estilo">
          ${RES.estilos.map(e => `<div class="opt-card" data-val="${e.nome}"><span class="emoji">${e.icone}</span><span><b>${e.nome}</b><span class="muted small">${esc(e.dica)}</span></span></div>`).join("")}
        </div>
        <button class="btn btn-primary block" id="ob-go" style="margin-top:10px">Começar minha jornada 🚀</button>
      </div>`;

    let objetivo = null, estilo = null, avatar = AVATARES[0];
    view.querySelectorAll("#ob-avatar .avatar-opt").forEach(c => c.onclick = () => {
      view.querySelectorAll("#ob-avatar .avatar-opt").forEach(x => x.classList.remove("selected"));
      c.classList.add("selected"); avatar = c.dataset.val;
    });
    view.querySelectorAll("#ob-objetivo .opt-card").forEach(c => c.onclick = () => {
      view.querySelectorAll("#ob-objetivo .opt-card").forEach(x => x.classList.remove("selected"));
      c.classList.add("selected"); objetivo = c.dataset.val;
    });
    view.querySelectorAll("#ob-estilo .opt-card").forEach(c => c.onclick = () => {
      view.querySelectorAll("#ob-estilo .opt-card").forEach(x => x.classList.remove("selected"));
      c.classList.add("selected"); estilo = c.dataset.val;
    });
    const start = () => {
      const nome = view.querySelector("#ob-nome").value.trim();
      if (!nome) { view.querySelector("#ob-nome").focus(); toast("Digite seu nome para começar 🙂"); return; }
      Store.set({ nome, avatar, objetivo, estiloAprendizado: estilo });
      go("#/home"); router();
      setTimeout(() => toast(`Vamos nessa, ${nome}! ${avatar}`), 400);
    };
    view.querySelector("#ob-go").onclick = start;
    view.querySelector("#ob-nome").addEventListener("keydown", e => { if (e.key === "Enter") start(); });
  }

  // ---------------- Home / Dashboard ----------------
  function renderHome() {
    const s = Store.get();
    const nv = Engine.nivel();
    const prof = Engine.proficienciaGeral();
    const areas = Engine.statsPorArea();
    const recs = Engine.recomendacoes();
    const curva = Engine.curvaAprendizagem();
    const totalQ = Object.keys(s.respostasQuestoes).length;
    const licoesTotal = Object.values(C.materias).reduce((a, m) => a + m.licoes.length, 0);
    const prog = Engine.progressao();
    const meta = Engine.metaDiaria();

    const radarData = Engine.AREAS.map((a, i) => ({
      nome: Engine.AREA_NOME[a], v: areas[a].pct, cor: Charts.cores["s" + (i + 1)]
    }));

    view.innerHTML = `
      <div class="card nivel-banner">
        <div class="nivel-avatar">${esc(s.avatar || "🚀")}</div>
        <div style="flex:1;min-width:180px">
          <div class="muted small">Olá, ${esc(s.nome)}! ${prog.emoji}</div>
          <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap">
            <h2 style="margin:0">Nível ${prog.nivel}</h2>
            <span class="chip roxo">${esc(prog.titulo)}</span>
          </div>
          <div class="progress" style="margin:8px 0 4px"><span style="width:${prog.pct}%"></span></div>
          <div class="muted small">${prog.noNivel} / ${prog.need} XP · faltam <b>${prog.falta} XP</b> para o Nível ${prog.nivel + 1}</div>
        </div>
        <div class="nivel-meta">
          ${ringMeta(meta.feitas, meta.meta)}
          <div class="muted small" style="text-align:center">meta do dia${meta.batida ? " ✅" : ""}</div>
        </div>
      </div>

      <div class="grid cols-2" style="align-items:stretch">
        <div class="card">
          <div style="display:flex;gap:14px;align-items:center">
            <div style="font-size:3rem">${nv.emoji}</div>
            <div>
              <div class="muted small">Sua classificação de preparo</div>
              <h2 style="margin:0">${nv.rotulo}</h2>
              <span class="chip roxo">${nv.faixa}</span>
            </div>
          </div>
          <p class="muted" style="margin-top:12px">${nv.desc}</p>
          <div style="margin-top:10px">${Charts.donut(prof, { rotulo: "preparo geral" })}</div>
        </div>
        <div class="card">
          <h2>📊 Sua proficiência por área</h2>
          ${totalQ > 0 ? Charts.radar(radarData, {}) :
        `<p class="muted" style="margin:20px 0">Faça seu primeiro simulado para ver seu mapa de forças e fraquezas aqui. 🎯</p>
             <button class="btn btn-primary" onclick="location.hash='#/praticar'">Fazer diagnóstico</button>`}
        </div>
      </div>

      <div class="grid cols-4" style="margin-top:16px">
        ${statTile("🔥", s.streak.dias, "dias seguidos")}
        ${statTile("✅", totalQ, "questões feitas")}
        ${statTile("📚", `${s.licoesConcluidas.length}/${licoesTotal}`, "lições")}
        ${statTile("🏅", s.conquistas.length, "conquistas")}
      </div>

      ${(() => { const ms = Engine.metaSemanal(); return `<div class="card" style="margin-top:16px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
          <h2 style="margin:0">🗓️ Meta da semana</h2>
          <span class="chip ${ms.batida ? "verde" : "roxo"}">${ms.feitas}/${ms.meta} questões${ms.batida ? " ✅" : ""}</span>
        </div>
        <div class="progress ${ms.batida ? "verde" : ""}" style="margin:10px 0 4px"><span style="width:${ms.pct}%"></span></div>
        <p class="muted small">${ms.batida ? "Meta semanal batida, parabéns! 🎉" : `Faltam <b>${Math.max(0, ms.meta - ms.feitas)} questões</b> para bater a meta`} · estudou em ${ms.dias} ${ms.dias === 1 ? "dia" : "dias"} esta semana</p>
      </div>`; })()}

      <div class="card" style="margin-top:16px">
        <h2>🏆 Seus recordes</h2>
        <div class="grid cols-3 recordes-grid" style="margin-top:6px">
          ${Engine.recordes().map(r => `<div class="recorde-item">
            <div class="emoji">${r.icone}</div>
            <div class="valor">${r.valor}</div>
            <div class="rot">${esc(r.titulo)}</div>
            <div class="det muted small">${esc(r.detalhe)}</div>
          </div>`).join("")}
        </div>
      </div>

      ${curva.length >= 2 ? `<div class="card" style="margin-top:16px">
        <h2>📈 Sua curva de aprendizagem</h2>
        <p class="muted small">Percentual de acerto em cada simulado — veja sua evolução.</p>
        ${Charts.linha(curva, {})}
      </div>` : ""}

      <div class="card" style="margin-top:16px">
        <h2>🧭 O que você precisa melhorar</h2>
        ${recs.map(r => `<div class="resultado-topico" style="align-items:flex-start">
          <span style="font-size:1.2rem">${r.icone}</span>
          <span class="nome">${r.texto}${r.area ? ` <a href="#/trilhas/${areaMateriaLink(r.area, r.topico)}" class="chip azul" style="text-decoration:none">estudar →</a>` : ""}</span>
        </div>`).join("")}
      </div>

      <div class="section-title">Atalhos rápidos</div>
      <div class="grid cols-3">
        ${atalho("✏️", "Praticar / Simulado", "Monte uma prova customizada", "#/praticar")}
        ${atalho("🗺️", "Trilhas de estudo", "Do zero ao avançado", "#/trilhas")}
        ${atalho("📝", "Treinar Redação", "Estrutura, notas e repertório", "#/redacao")}
      </div>`;
    celebrarConquistas();
  }

  function statTile(icone, valor, rotulo) {
    return `<div class="card stat-tile"><div class="icone">${icone}</div>
      <div class="valor">${valor}</div><div class="rotulo">${rotulo}</div></div>`;
  }
  // anel SVG de meta diária (feitas/meta)
  function ringMeta(feitas, meta) {
    const r = 30, c = 2 * Math.PI * r, pct = Math.min(1, meta ? feitas / meta : 0);
    const off = c * (1 - pct);
    const cor = pct >= 1 ? "var(--verde)" : "var(--roxo)";
    return `<svg viewBox="0 0 76 76" width="76" height="76" aria-label="Meta: ${feitas} de ${meta}">
      <circle cx="38" cy="38" r="${r}" fill="none" stroke="var(--grid)" stroke-width="7"/>
      <circle cx="38" cy="38" r="${r}" fill="none" stroke="${cor}" stroke-width="7" stroke-linecap="round"
        stroke-dasharray="${c}" stroke-dashoffset="${off}" transform="rotate(-90 38 38)"/>
      <text x="38" y="35" text-anchor="middle" font-size="16" font-weight="800" fill="var(--ink)">${feitas}</text>
      <text x="38" y="50" text-anchor="middle" font-size="10" fill="var(--ink-mute)">/${meta}</text>
    </svg>`;
  }
  function atalho(emoji, titulo, desc, hash) {
    return `<div class="card clickable" onclick="location.hash='${hash}'">
      <div style="font-size:1.8rem">${emoji}</div><h3>${titulo}</h3>
      <p class="muted small">${desc}</p></div>`;
  }
  function areaMateriaLink(area, topico) {
    // acha a matéria da área para linkar
    const mid = Object.keys(C.materias).find(k => C.materias[k].area === area);
    return mid || "";
  }

  // ---------------- Trilhas (áreas → matérias) ----------------
  function renderTrilhas() {
    const s = Store.get();
    let html = `<div class="section-title">🗺️ Trilhas de estudo <small>do zero ao avançado</small></div>`;
    C.areas.filter(a => a.id !== "redacao").forEach(area => {
      const materias = Object.entries(C.materias).filter(([, m]) => m.area === area.id);
      html += `<div class="section-title" style="font-size:1.05rem;margin-top:20px">${area.emoji} ${area.nome}</div>
        <div class="grid cols-3">`;
      materias.forEach(([id, m]) => {
        const feitas = m.licoes.filter(l => s.licoesConcluidas.includes(l.id)).length;
        const pct = Math.round((feitas / m.licoes.length) * 100);
        html += `<div class="card clickable" onclick="location.hash='#/trilhas/${id}'">
          <div class="materia-icone">${m.emoji}</div>
          <h3>${esc(m.nome)}</h3>
          <p class="muted small">${esc(m.resumo)}</p>
          <div class="progress ${pct === 100 ? "verde" : ""}" style="margin-top:10px"><span style="width:${pct}%"></span></div>
          <p class="muted small" style="margin-top:6px">${feitas}/${m.licoes.length} lições · ${esc(m.incidencia)}</p>
        </div>`;
      });
      html += `</div>`;
    });
    html += `<div class="card clickable" style="margin-top:20px" onclick="location.hash='#/redacao'">
      <div class="materia-icone">📝</div><h3>Redação</h3>
      <p class="muted small">Estrutura, 5 competências, repertórios e treino guiado.</p></div>`;
    view.innerHTML = html;
  }

  // ---------------- Matéria (lista de lições) ----------------
  function renderMateria(mid) {
    const m = C.materias[mid];
    if (!m) { renderTrilhas(); return; }
    const s = Store.get();
    const feitasTot = m.licoes.filter(l => s.licoesConcluidas.includes(l.id)).length;
    // agrupa lições por módulo, preservando a ordem de aparição
    const modulos = [];
    m.licoes.forEach(l => {
      const nome = l.modulo || "Conteúdo";
      let g = modulos.find(x => x.nome === nome);
      if (!g) { g = { nome, licoes: [] }; modulos.push(g); }
      g.licoes.push(l);
    });
    let html = `<button class="btn btn-ghost small" onclick="location.hash='#/trilhas'">← Trilhas</button>
      <div class="section-title" style="margin-top:12px">${m.emoji} ${esc(m.nome)}</div>
      <p class="muted">${esc(m.resumo)}</p>
      <div class="progress ${feitasTot === m.licoes.length ? "verde" : ""}" style="margin:10px 0"><span style="width:${Math.round(feitasTot / m.licoes.length * 100)}%"></span></div>
      <p class="muted small">${feitasTot}/${m.licoes.length} lições concluídas · ${modulos.length} módulos</p>`;
    let i = 0;
    modulos.forEach(mod => {
      const feitasMod = mod.licoes.filter(l => s.licoesConcluidas.includes(l.id)).length;
      html += `<div class="section-title" style="font-size:1.02rem;margin:20px 0 10px">📦 ${esc(mod.nome)}
        <small>${feitasMod}/${mod.licoes.length}</small></div>`;
      mod.licoes.forEach(l => {
        i++;
        const done = s.licoesConcluidas.includes(l.id);
        html += `<div class="licao-item ${done ? "done" : ""}" onclick="location.hash='#/licao/${l.id}'">
          <div class="num">${done ? "✓" : i}</div>
          <div style="flex:1">
            <b>${esc(l.titulo)}</b>
            <div class="muted small">${esc(l.objetivo)}</div>
          </div>
          <span class="chip ${l.nivel === "Básico" ? "verde" : l.nivel === "Avançado" ? "vermelho" : "amarelo"}">${l.nivel}</span>
        </div>`;
      });
    });
    html += `
      <div class="card" style="margin-top:16px;text-align:center">
        <p class="muted">Terminou de estudar? Fixe o conteúdo praticando!</p>
        <button class="btn btn-primary" onclick="location.hash='#/praticar'">✏️ Praticar ${esc(m.nome)}</button>
      </div>`;
    view.innerHTML = html;
  }

  // ---------------- Lição (conteúdo) ----------------
  function renderLicao(lid) {
    let materiaId = null, licao = null;
    for (const [mid, m] of Object.entries(C.materias)) {
      const l = m.licoes.find(x => x.id === lid);
      if (l) { materiaId = mid; licao = l; break; }
    }
    if (!licao) { renderTrilhas(); return; }
    const s = Store.get();
    const done = s.licoesConcluidas.includes(lid);

    const teoriaHtml = licao.teoria.map(bloco => {
      switch (bloco.t) {
        case "h4": return `<h4>${esc(bloco.c)}</h4>`;
        case "formula": return `<div class="formula">${esc(bloco.c)}</div>`;
        case "ex": return `<div class="bloco-especial bloco-dica"><b>💡 Exemplo</b>${esc(bloco.c)}</div>`;
        case "atencao": return `<div class="bloco-especial bloco-atencao"><b>⚠️ Atenção</b>${esc(bloco.c)}</div>`;
        default: return `<p>${esc(bloco.c)}</p>`;
      }
    }).join("");

    let graficoHtml = "";
    if (licao.grafico) {
      if (licao.grafico.tipo === "barras")
        graficoHtml = `<div class="bloco-especial bloco-grafico"><b>📊 Representação gráfica</b>${Charts.barras(licao.grafico.dados, { titulo: licao.grafico.titulo, sufixo: "%", cor: Charts.cores.roxo })}</div>`;
      else if (licao.grafico.tipo === "funcao")
        graficoHtml = `<div class="bloco-especial bloco-grafico"><b>📊 Representação gráfica</b>${Charts.parabola({ titulo: licao.grafico.titulo })}</div>`;
    }

    view.innerHTML = `
      <button class="btn btn-ghost small" onclick="location.hash='#/trilhas/${materiaId}'">← ${esc(C.materias[materiaId].nome)}</button>
      <div class="card conteudo-licao" style="margin-top:12px">
        ${licao.modulo ? `<span class="chip roxo">📦 ${esc(licao.modulo)}</span>` : ""}
        <span class="chip ${licao.nivel === "Básico" ? "verde" : licao.nivel === "Avançado" ? "vermelho" : "amarelo"}">${licao.nivel}</span>
        <span class="chip cinza">Incidência: ${esc(licao.incidencia)}</span>
        <h2 style="margin-top:8px">${esc(licao.titulo)}</h2>
        <p class="muted"><b>Objetivo:</b> ${esc(licao.objetivo)}</p>
        <hr style="border:none;border-top:1px solid var(--grid);margin:14px 0">
        ${teoriaHtml}
        ${licao.mnemonico ? `<div class="bloco-especial bloco-mnemonico"><b>🧠 Mnemônico</b>${esc(licao.mnemonico)}</div>` : ""}
        ${licao.analogia ? `<div class="bloco-especial bloco-analogia"><b>🔗 Analogia</b>${esc(licao.analogia)}</div>` : ""}
        ${licao.dica ? `<div class="bloco-especial bloco-dica"><b>✅ Dica de ouro</b>${esc(licao.dica)}</div>` : ""}
        ${graficoHtml}
      </div>
      <div class="card" style="margin-top:14px;text-align:center">
        ${done ? `<span class="chip verde">✓ Lição concluída</span>` :
        `<button class="btn btn-success" id="concluir">✓ Marcar como concluída</button>`}
        <button class="btn btn-primary" onclick="location.hash='#/praticar'" style="margin-left:8px">✏️ Praticar agora</button>
      </div>`;

    const btn = view.querySelector("#concluir");
    if (btn) btn.onclick = () => {
      Store.marcarLicao(lid);
      toast("Lição concluída! +" + Engine.XP.licao + " XP 🎉");
      celebrarConquistas();
      celebrarProgresso();
      renderLicao(lid);
    };
  }

  // ---------------- Praticar (config do simulado) ----------------
  function renderPraticarConfig() {
    const areasLista = C.areas.filter(a => a.id !== "redacao");

    const fonteOpts = Object.entries(FONTE_MODOS).map(([k, m], i) =>
      `<label class="radio-card ${k === "todas" ? "selected" : ""}">
         <input type="radio" name="cfg-fonte" value="${k}" ${k === "todas" ? "checked" : ""}>
         <span><b>${esc(m.label)}</b><span class="muted small">${esc(m.desc)}</span></span>
       </label>`).join("");

    const areaOpts = areasLista.map(a =>
      `<label class="check-row"><input type="checkbox" class="area-chk" value="${a.id}" checked>
       <span>${a.emoji} ${esc(a.nome)} <span class="muted small cnt" data-area="${a.id}"></span></span></label>`).join("");

    const areaBtns = areasLista.map(a =>
      `<button type="button" class="btn btn-ghost small area-solo" data-area="${a.id}">${a.emoji} ${esc(a.nome)}</button>`).join("");

    view.innerHTML = `
      <div class="section-title">✏️ Monte sua prova customizada</div>
      <div class="card">
        <h3>📚 Fonte das questões</h3>
        <div class="radio-cards" id="cfg-fontes">${fonteOpts}</div>

        <h3 style="margin-top:16px">🧭 Áreas do conhecimento</h3>
        <p class="muted small" style="margin:-4px 0 8px">Marque as áreas ou toque abaixo para um simulado só de uma área:</p>
        <div class="area-solo-row">${areaBtns}</div>
        ${areaOpts}

        <h3 style="margin-top:16px">Quantidade de questões</h3>
        <select id="cfg-qtd">
          <option value="5">5 — rápido</option>
          <option value="10" selected>10 — treino</option>
          <option value="20">20 — simulado</option>
          <option value="45">45 — prova de área</option>
          <option value="0">Todas disponíveis</option>
        </select>
        <h3 style="margin-top:16px">Dificuldade</h3>
        <select id="cfg-nivel">
          <option value="todas" selected>Todas</option>
          <option value="Fácil">Fácil</option>
          <option value="Médio">Médio</option>
          <option value="Difícil">Difícil</option>
        </select>
        <h3 style="margin-top:16px">Modo</h3>
        <label class="check-row"><input type="checkbox" id="cfg-tempo"><span>⏱️ Cronometrar (modo prova real)</span></label>
        <label class="check-row"><input type="checkbox" id="cfg-explica" checked><span>💬 Mostrar explicação após cada resposta</span></label>
        <p class="muted small" id="cfg-disp" style="margin:14px 0 0"></p>
        <button class="btn btn-primary block" style="margin-top:10px" id="cfg-start">Começar simulado 🚀</button>
      </div>
      <p class="muted small" style="text-align:center;margin-top:10px">Dica: comece com "ENEM + vestibulares + IA" e todas as áreas para o app diagnosticar seu nível.</p>`;

    // recalcula contagens por área conforme a fonte escolhida
    function fonteSelecionada() {
      const v = (view.querySelector("input[name=cfg-fonte]:checked") || {}).value || "todas";
      return FONTE_MODOS[v];
    }
    function atualizarContagens() {
      const modo = fonteSelecionada();
      const cont = fonteContaPorArea(modo.fontes);
      view.querySelectorAll(".cnt").forEach(el => {
        const n = cont[el.dataset.area] || 0;
        el.textContent = `(${n} questões)`;
      });
      const areasSel = [...view.querySelectorAll(".area-chk:checked")].map(c => c.value);
      const total = areasSel.reduce((s, a) => s + (cont[a] || 0), 0);
      view.querySelector("#cfg-disp").innerHTML = `✅ <b>${total}</b> questões disponíveis com esses filtros.`;
    }
    view.querySelectorAll("input[name=cfg-fonte]").forEach(r => r.onchange = () => {
      view.querySelectorAll("#cfg-fontes .radio-card").forEach(c => c.classList.toggle("selected", c.querySelector("input").checked));
      atualizarContagens();
    });
    view.querySelectorAll(".area-chk").forEach(c => c.onchange = atualizarContagens);
    // botões de "simulado por área": marca só aquela área
    view.querySelectorAll(".area-solo").forEach(b => b.onclick = () => {
      view.querySelectorAll(".area-chk").forEach(c => { c.checked = (c.value === b.dataset.area); });
      atualizarContagens();
      toast(`Foco em ${b.textContent.trim()} 🎯`);
    });
    atualizarContagens();

    view.querySelector("#cfg-start").onclick = () => {
      const areas = [...view.querySelectorAll(".area-chk:checked")].map(c => c.value);
      if (!areas.length) { toast("Escolha ao menos uma área 🙂"); return; }
      const qtd = parseInt(view.querySelector("#cfg-qtd").value, 10);
      const nivel = view.querySelector("#cfg-nivel").value;
      const comTempo = view.querySelector("#cfg-tempo").checked;
      const comExplica = view.querySelector("#cfg-explica").checked;
      const modoFonte = fonteSelecionada();

      let pool = Q.filter(q => areas.includes(q.area)
        && modoFonte.fontes.includes(q.fonte)
        && (nivel === "todas" || q.nivel === nivel));
      pool = embaralhar(pool);
      if (qtd > 0) pool = pool.slice(0, qtd);
      if (!pool.length) { toast("Sem questões para esse filtro. Tente outro."); return; }

      examState = {
        questoes: pool, respostas: new Array(pool.length).fill(null),
        atual: 0, comTempo, comExplica, revelada: new Array(pool.length).fill(false),
        inicio: Date.now(), tempoRestante: comTempo ? pool.length * 180 : null // 3min/questão
      };
      go("#/simulado"); router();
    };
  }

  function embaralhar(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  // ---------------- Simulado (execução) ----------------
  function renderSimulado() {
    if (!examState) { go("#/praticar"); router(); return; }
    const st = examState;
    const q = st.questoes[st.atual];
    const areaObj = C.areas.find(a => a.id === q.area);
    const revelada = st.revelada[st.atual];
    const escolhida = st.respostas[st.atual];

    const alts = q.alternativas.map((alt, i) => {
      let cls = "alternativa";
      if (revelada) {
        if (i === q.correta) cls += " correta";
        else if (i === escolhida) cls += " errada";
      } else if (i === escolhida) cls += " selecionada";
      const letra = String.fromCharCode(65 + i);
      return `<button class="${cls}" data-i="${i}" ${revelada ? "disabled" : ""}>
        <span class="letra">${letra}</span><span>${esc(alt)}</span></button>`;
    }).join("");

    const dots = st.questoes.map((_, i) => {
      let cls = "q-dot";
      if (i === st.atual) cls += " atual";
      if (st.revelada[i]) cls += st.respostas[i] === st.questoes[i].correta ? " certa" : " errada";
      else if (st.respostas[i] != null) cls += " respondida";
      return `<button class="${cls}" data-goto="${i}">${i + 1}</button>`;
    }).join("");

    view.innerHTML = `
      <div class="exam-header">
        <div>
          <span class="chip roxo">${areaObj ? areaObj.emoji : ""} ${esc(q.area === "matematica" ? "Matemática" : Engine.AREA_NOME[q.area] || q.area)}</span>
          <span class="chip cinza">${esc(q.topico)}</span>
          <span class="chip ${q.nivel === "Fácil" ? "verde" : q.nivel === "Difícil" ? "vermelho" : "amarelo"}">${q.nivel}</span>
          ${q.fonte && FONTE_META[q.fonte] ? `<span class="chip ${FONTE_META[q.fonte].chip}">${FONTE_META[q.fonte].emoji} ${FONTE_META[q.fonte].rotulo}${q.banca ? " · " + esc(q.banca) : ""}</span>` : ""}
        </div>
        ${st.comTempo ? `<div class="timer" id="timer">--:--</div>` : `<div class="muted small">Questão ${st.atual + 1} de ${st.questoes.length}</div>`}
      </div>
      <div class="q-dots">${dots}</div>
      <div class="card">
        <div class="muted small">Questão ${st.atual + 1} de ${st.questoes.length}</div>
        <div class="questao-texto">${esc(q.enunciado)}</div>
        <div id="alts">${alts}</div>
        <div id="feedback"></div>
      </div>
      <div style="display:flex;gap:8px;justify-content:space-between;margin-top:14px;flex-wrap:wrap">
        <button class="btn btn-ghost" id="prev" ${st.atual === 0 ? "disabled" : ""}>← Anterior</button>
        <button class="btn btn-danger small" id="encerrar">Encerrar e ver resultado</button>
        <button class="btn btn-primary" id="next">${st.atual === st.questoes.length - 1 ? "Finalizar ✓" : "Próxima →"}</button>
      </div>`;

    // handlers alternativas
    view.querySelectorAll(".alternativa").forEach(b => b.onclick = () => {
      if (st.revelada[st.atual]) return;
      st.respostas[st.atual] = parseInt(b.dataset.i, 10);
      if (st.comExplica) { st.revelada[st.atual] = true; }
      renderSimulado();
    });

    // feedback (explicação)
    if (revelada) {
      const acertou = escolhida === q.correta;
      view.querySelector("#feedback").innerHTML = `
        <div class="explicacao" style="border-left-color:${acertou ? "var(--verde)" : "var(--vermelho)"};background:${acertou ? "var(--verde-claro)" : "var(--vermelho-claro)"}">
          <b>${acertou ? "✅ Você acertou!" : "❌ Resposta correta: " + String.fromCharCode(65 + q.correta)}</b>
          <p style="margin-top:6px">${esc(q.explicacao)}</p>
          ${q.dica ? `<p style="margin-top:6px"><b>💡 Dica:</b> ${esc(q.dica)}</p>` : ""}
        </div>`;
    }

    view.querySelectorAll(".q-dot").forEach(d => d.onclick = () => { st.atual = parseInt(d.dataset.goto, 10); renderSimulado(); });
    view.querySelector("#prev").onclick = () => { if (st.atual > 0) { st.atual--; renderSimulado(); } };
    view.querySelector("#next").onclick = () => {
      // se não usa explicação inline, revela ao avançar não é necessário
      if (st.atual < st.questoes.length - 1) { st.atual++; renderSimulado(); }
      else finalizarSimulado();
    };
    view.querySelector("#encerrar").onclick = () => {
      if (confirm("Encerrar o simulado agora e ver seu resultado?")) finalizarSimulado();
    };

    // timer
    if (st.comTempo) startTimer();
  }

  function startTimer() {
    clearInterval(examTimer);
    const upd = () => {
      if (!examState || !examState.comTempo) return;
      const el = document.getElementById("timer");
      if (!el) return;
      const t = examState.tempoRestante;
      const m = String(Math.floor(t / 60)).padStart(2, "0");
      const s = String(t % 60).padStart(2, "0");
      el.textContent = `${m}:${s}`;
      el.classList.toggle("urgente", t <= 60);
      if (t <= 0) { clearInterval(examTimer); toast("⏰ Tempo esgotado!"); finalizarSimulado(); return; }
      examState.tempoRestante--;
    };
    upd();
    examTimer = setInterval(upd, 1000);
  }

  function finalizarSimulado() {
    clearInterval(examTimer);
    const st = examState;
    if (!st) { go("#/home"); return; }
    let acertos = 0;
    st.questoes.forEach((q, i) => { if (st.respostas[i] === q.correta) acertos++; });
    const sim = {
      id: "sim-" + Date.now(), data: Date.now(),
      questoes: st.questoes.map(q => ({ id: q.id, area: q.area, topico: q.topico, correta: q.correta })),
      respostas: st.respostas, acertos, total: st.questoes.length,
      tempo: Math.round((Date.now() - st.inicio) / 1000)
    };
    Store.registrarSimulado(sim);
    examState = null;
    go("#/resultado/" + sim.id); router();
    celebrarConquistas();
    celebrarProgresso();
  }

  // ---------------- Resultado ----------------
  function renderResultado(simId) {
    const s = Store.get();
    const sim = s.simulados.find(x => x.id === simId) || s.simulados[s.simulados.length - 1];
    if (!sim) { go("#/home"); router(); return; }
    const pct = Math.round((sim.acertos / sim.total) * 100);
    const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "🎉" : pct >= 40 ? "💪" : "🌱";
    const msg = pct >= 80 ? "Excelente! Você mandou muito bem." :
      pct >= 60 ? "Bom trabalho! Já é um resultado sólido." :
        pct >= 40 ? "Você está no caminho. Vamos reforçar os pontos fracos." :
          "Todo mundo começa em algum lugar. Bora estudar e voltar mais forte!";

    // desempenho por tópico neste simulado
    const porTopico = {};
    sim.questoes.forEach((q, i) => {
      if (!porTopico[q.topico]) porTopico[q.topico] = { c: 0, t: 0, area: q.area };
      porTopico[q.topico].t++;
      if (sim.respostas[i] === q.correta) porTopico[q.topico].c++;
    });
    const topicoRows = Object.entries(porTopico).map(([nome, d]) => {
      const p = Math.round((d.c / d.t) * 100);
      const cls = p >= 70 ? "verde" : p >= 40 ? "amarelo" : "";
      return `<div class="resultado-topico">
        <span class="nome">${esc(nome)} <span class="muted small">(${d.c}/${d.t})</span></span>
        <div class="progress ${cls}" style="width:120px"><span style="width:${p}%"></span></div>
        <b style="min-width:42px;text-align:right">${p}%</b>
      </div>`;
    }).join("");

    const nv = Engine.nivel();
    const tempoMin = Math.floor(sim.tempo / 60), tempoSeg = sim.tempo % 60;

    view.innerHTML = `
      <div class="card nota-hero">
        <div class="emoji">${emoji}</div>
        <div class="nota">${sim.acertos}/${sim.total}</div>
        <div class="chip roxo" style="font-size:1rem">${pct}% de acerto</div>
        <p class="muted" style="margin-top:10px">${msg}</p>
        <p class="muted small">Tempo: ${tempoMin}min ${tempoSeg}s</p>
      </div>

      <div class="card" style="margin-top:16px">
        <h2>${nv.emoji} Seu nível atual: ${nv.rotulo}</h2>
        <p class="muted">${nv.desc}</p>
      </div>

      <div class="card" style="margin-top:16px">
        <h2>🎯 Desempenho por tópico</h2>
        ${topicoRows}
      </div>

      <div class="card" style="margin-top:16px">
        <h2>🧭 Próximos passos recomendados</h2>
        ${Engine.recomendacoes().map(r => `<div class="resultado-topico" style="align-items:flex-start">
          <span>${r.icone}</span><span class="nome">${r.texto}</span></div>`).join("")}
      </div>

      <div style="display:flex;gap:8px;justify-content:center;margin-top:18px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="location.hash='#/praticar'">✏️ Novo simulado</button>
        <button class="btn btn-secondary" onclick="location.hash='#/home'">🏠 Ver meu progresso</button>
      </div>`;
  }

  // ---------------- Redação ----------------
  function renderRedacao() {
    const s = Store.get();
    view.innerHTML = `
      <div class="section-title">📝 Redação nota 1000 <small>dissertativo-argumentativo</small></div>
      <div class="card"><p>${esc(R.intro)}</p></div>

      <div class="section-title" style="font-size:1.1rem">🏗️ Estrutura em 4 partes</div>
      <div class="grid cols-2">
        ${R.estrutura.map(e => `<div class="card">
          <h3>${esc(e.parte)}</h3>
          <p class="small">${esc(e.meta)}</p>
          <div class="bloco-especial bloco-dica" style="margin:8px 0 0"><b>Modelo</b>${esc(e.modelo)}</div>
        </div>`).join("")}
      </div>

      <div class="section-title" style="font-size:1.1rem">🎯 As 5 competências (200 pts cada)</div>
      ${R.competencias.map(c => `<div class="card comp-card" style="margin-bottom:10px">
        <h3>${c.n} — ${esc(c.titulo)}</h3>
        <p class="small">${esc(c.desc)}</p>
        <div class="bloco-especial bloco-mnemonico" style="margin:8px 0 0"><b>💡 Como pontuar</b>${esc(c.dica)}</div>
      </div>`).join("")}

      <div class="section-title" style="font-size:1.1rem">🛠️ Proposta de intervenção — os 5 elementos</div>
      <div class="card">
        ${R.propostaChecklist.map(p => `<div class="resultado-topico" style="align-items:flex-start">
          <span class="chip roxo">${esc(p.el)}</span><span class="nome small">${esc(p.ex)}</span></div>`).join("")}
      </div>

      <div class="section-title" style="font-size:1.1rem">📚 Repertórios coringa</div>
      <div class="scroll-x"><table class="tabela-simples">
        <tr><th>Eixo</th><th>Fontes legitimadas</th><th>Como usar</th></tr>
        ${R.repertorios.map(r => `<tr><td><b>${esc(r.eixo)}</b></td><td>${esc(r.fontes)}</td><td>${esc(r.uso)}</td></tr>`).join("")}
      </table></div>

      <div class="section-title" style="font-size:1.1rem">✍️ Treinar uma redação</div>
      <div class="card">
        <label class="small"><b>Escolha um tema:</b></label>
        <select id="red-tema" style="width:100%;margin:8px 0">
          ${R.temas.map((t, i) => `<option value="${i}">${esc(t.titulo)} — ${t.nivel}</option>`).join("")}
        </select>
        <p class="muted small" id="red-eixo"></p>
        <textarea id="red-texto" placeholder="Escreva sua redação aqui (introdução, 2 desenvolvimentos e conclusão com proposta de intervenção)..."
          style="width:100%;min-height:200px;padding:14px;border-radius:12px;border:1.5px solid var(--grid);font-family:inherit;font-size:0.95rem;margin-top:6px"></textarea>
        <div class="muted small" id="red-contador" style="margin-top:6px">0 palavras · mínimo recomendado: 8 linhas autorais</div>

        <h3 style="margin-top:16px">Autoavaliação guiada (arraste cada competência)</h3>
        <div id="red-sliders">
          ${R.competencias.map(c => `<div class="slider-row">
            <span style="min-width:150px" class="small"><b>${c.n}</b> ${esc(c.titulo)}</span>
            <input type="range" min="0" max="200" step="40" value="120" class="comp-slider" data-c="${c.n}">
            <span class="val" data-for="${c.n}">120</span>
          </div>`).join("")}
        </div>
        <div class="card" style="background:var(--roxo-claro);text-align:center;margin-top:12px">
          <div class="muted small">Nota estimada</div>
          <div style="font-size:2rem;font-weight:800;color:var(--roxo)" id="red-total">600</div>
        </div>
        <button class="btn btn-primary block" id="red-salvar" style="margin-top:12px">💾 Salvar redação e nota</button>
      </div>

      ${s.redacoes.length ? `<div class="section-title" style="font-size:1.1rem">📈 Suas redações (${s.redacoes.length})</div>
        ${s.redacoes.slice().reverse().map(r => `<div class="card" style="margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
            <b class="small">${esc(r.tema)}</b>
            <span class="chip ${r.total >= 800 ? "verde" : r.total >= 500 ? "amarelo" : "vermelho"}">${r.total} pts</span>
          </div>
          <p class="muted small">${new Date(r.data).toLocaleDateString("pt-BR")} · ${(r.texto || "").split(/\s+/).filter(Boolean).length} palavras</p>
        </div>`).join("")}` : ""}`;

    const temaSel = view.querySelector("#red-tema");
    const eixoP = view.querySelector("#red-eixo");
    const updEixo = () => { eixoP.textContent = "Eixo temático: " + R.temas[temaSel.value].eixo; };
    temaSel.onchange = updEixo; updEixo();

    const texto = view.querySelector("#red-texto");
    const contador = view.querySelector("#red-contador");
    texto.oninput = () => {
      const n = texto.value.split(/\s+/).filter(Boolean).length;
      contador.textContent = `${n} palavras · mínimo recomendado: 8 linhas autorais`;
    };

    const sliders = view.querySelectorAll(".comp-slider");
    const totalEl = view.querySelector("#red-total");
    const recalc = () => {
      let tot = 0;
      sliders.forEach(sl => {
        tot += parseInt(sl.value, 10);
        view.querySelector(`.val[data-for="${sl.dataset.c}"]`).textContent = sl.value;
      });
      totalEl.textContent = tot;
    };
    sliders.forEach(sl => sl.oninput = recalc);
    recalc();

    view.querySelector("#red-salvar").onclick = () => {
      const notas = {};
      let tot = 0;
      sliders.forEach(sl => { notas[sl.dataset.c] = parseInt(sl.value, 10); tot += notas[sl.dataset.c]; });
      Store.registrarRedacao({
        id: "red-" + Date.now(), data: Date.now(),
        tema: R.temas[temaSel.value].titulo, texto: texto.value, notas, total: tot
      });
      toast(`Redação salva! Nota: ${tot} · +${Engine.XP.redacaoBase + Math.round(tot / 10)} XP 📝`);
      celebrarConquistas();
      celebrarProgresso();
      renderRedacao();
    };
  }

  // ---------------- Plano de estudos ----------------
  function renderPlano() {
    const fases = [
      { f: "Fase 1 — Diagnóstico e base", dur: "Semanas 1–11", obj: "Simulados diagnósticos, base teórica dos temas de alta incidência, resumos ativos.", cor: "var(--s2)" },
      { f: "Fase 2 — Expansão", dur: "Semanas 12–24", obj: "Conteúdos intermediários, +50 questões por sessão, correção analítica dos erros.", cor: "var(--s1)" },
      { f: "Fase 3 — Consolidação", dur: "Semanas 25–30", obj: "Revisão espaçada (1, 7 e 30 dias), simulados mensais cronometrados, 2 redações/semana.", cor: "var(--s3)" },
      { f: "Fase 4 — Reta final", dur: "Semanas 31–32", obj: "Sem conteúdo novo. Só provas anteriores, controle do tempo e do emocional.", cor: "var(--s6)" }
    ];
    const semana = [
      ["Segunda", "Matemática básica", "Geografia", "Revisão + interpretação"],
      ["Terça", "Física (mecânica)", "História do Brasil", "Gramática"],
      ["Quarta", "Química", "Sociologia", "Redação (estrutura)"],
      ["Quinta", "Biologia", "Filosofia", "Leitura + repertório"],
      ["Sexta", "Matemática (geometria)", "Literatura/Artes", "Língua estrangeira"],
      ["Sábado", "Simulado completo", "Correção dos erros", "Descanso ativo"],
      ["Domingo", "Descanso / exercício", "Planejar a semana", "Sono em dia"]
    ];
    view.innerHTML = `
      <div class="section-title">📅 Plano de estudos de alta performance</div>
      <div class="card">
        <h3>🧠 Técnicas que multiplicam o aprendizado</h3>
        <div class="bloco-especial bloco-mnemonico"><b>Repetição espaçada</b>Revise o conteúdo em 1, 7 e 30 dias. A memória se fixa quando é resgatada aos poucos, não decorada de uma vez.</div>
        <div class="bloco-especial bloco-analogia"><b>Estudo intercalado</b>Misture matérias na semana em vez de ficar dias no mesmo assunto. O cérebro aprende melhor alternando temas.</div>
        <div class="bloco-especial bloco-dica"><b>Técnica Pomodoro</b>25–50 min de foco total + intervalo curto. Evita a saturação e mantém a concentração alta.</div>
      </div>

      <div class="section-title" style="font-size:1.1rem">🗓️ As 4 fases da preparação</div>
      ${fases.map(f => `<div class="card" style="border-left:5px solid ${f.cor};margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px">
          <h3 style="margin:0">${esc(f.f)}</h3><span class="chip cinza">${esc(f.dur)}</span></div>
        <p class="small" style="margin-top:6px">${esc(f.obj)}</p>
      </div>`).join("")}

      <div class="section-title" style="font-size:1.1rem">📆 Cronograma semanal sugerido</div>
      <div class="scroll-x"><table class="tabela-simples">
        <tr><th>Dia</th><th>Manhã</th><th>Tarde</th><th>Noite</th></tr>
        ${semana.map(r => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join("")}
      </table></div>
      <p class="muted small" style="margin-top:10px">Adapte à sua rotina — o importante é a constância, não a perfeição. 💜</p>`;
  }

  // ---------------- Recursos ----------------
  function renderRecursos() {
    const s = Store.get();
    const estilo = RES.estilos.find(e => e.nome === s.estiloAprendizado);
    view.innerHTML = `
      <div class="section-title">🔗 Recursos, vídeos e materiais</div>
      ${estilo ? `<div class="card" style="border-left:5px solid var(--roxo)">
        <h3>${estilo.icone} Você aprende melhor de forma ${esc(estilo.nome)}</h3>
        <p class="small">${esc(estilo.sugestao)}</p></div>` : ""}

      <div class="section-title" style="font-size:1.1rem">🖥️ Plataformas de estudo</div>
      ${RES.plataformas.map(linkItem).join("")}

      <div class="section-title" style="font-size:1.1rem">▶️ Canais e videoaulas</div>
      ${RES.canaisYoutube.map(linkItem).join("")}

      <div class="section-title" style="font-size:1.1rem">📄 Materiais oficiais e provas</div>
      ${RES.materiais.map(linkItem).join("")}

      <div class="section-title" style="font-size:1.1rem">🎓 Estilos de aprendizagem</div>
      ${RES.estilos.map(e => `<details class="acordeao"><summary>${e.icone} ${esc(e.nome)}</summary>
        <div class="corpo"><p>${esc(e.dica)}</p><p class="muted"><b>Sugestão:</b> ${esc(e.sugestao)}</p></div></details>`).join("")}`;
  }
  function linkItem(l) {
    return `<a class="link-item" href="${esc(l.url)}" target="_blank" rel="noopener">
      <span class="chip azul">${esc(l.tag)}</span> <b>${esc(l.nome)}</b>
      <div class="small">${esc(l.desc)}</div><div class="url">${esc(l.url)}</div></a>`;
  }

  // ---------------- Perfil ----------------
  function renderPerfil() {
    const s = Store.get();
    const badges = Engine.todasBadges();
    const nv = Engine.nivel();
    const prof = Engine.proficienciaGeral();
    const areas = Engine.statsPorArea();
    const prog = Engine.progressao();
    const meta = Engine.metaDiaria();
    const totalQ = Object.keys(s.respostasQuestoes).length;
    const acertosGerais = Object.values(s.respostasQuestoes).filter(r => r.acertou).length;

    view.innerHTML = `
      <div class="section-title">👤 Perfil de ${esc(s.nome)}</div>
      <div class="card nivel-banner">
        <button class="nivel-avatar avatar-btn" id="avatar-btn" title="Trocar avatar">${esc(s.avatar || "🚀")}</button>
        <div style="flex:1;min-width:180px">
          <h2 style="margin:0">${esc(s.nome)}</h2>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:4px 0">
            <span class="chip roxo">${prog.emoji} Nível ${prog.nivel} · ${esc(prog.titulo)}</span>
            <span class="chip azul">${prog.xp} XP</span>
            <span class="chip cinza">${nv.rotulo} (${prof}%)</span>
          </div>
          <div class="progress" style="margin:6px 0 4px"><span style="width:${prog.pct}%"></span></div>
          <div class="muted small">${prog.noNivel} / ${prog.need} XP · faltam <b>${prog.falta} XP</b> para o Nível ${prog.nivel + 1}</div>
          <div style="margin-top:8px">
            ${s.objetivo ? `<span class="chip roxo">🎯 ${esc(s.objetivo)}</span>` : ""}
            ${s.estiloAprendizado ? `<span class="chip azul">Aprende ${esc(s.estiloAprendizado)}</span>` : ""}
          </div>
        </div>
        <div class="nivel-meta">
          ${ringMeta(meta.feitas, meta.meta)}
          <div class="muted small" style="text-align:center">meta do dia${meta.batida ? " ✅" : ""}</div>
        </div>
      </div>
      <div class="card hidden" id="avatar-picker" style="margin-top:10px">
        <h3>Escolha seu avatar</h3>
        <div class="avatar-pick">
          ${AVATARES.map(a => `<button type="button" class="avatar-opt ${a === (s.avatar || "🚀") ? "selected" : ""}" data-val="${a}">${a}</button>`).join("")}
        </div>
      </div>
      <p class="muted small" style="margin:10px 2px 0">Estudando desde ${new Date(s.criadoEm).toLocaleDateString("pt-BR")} · ${s.simulados.length} simulados · ${s.redacoes.length} redações</p>

      <div class="grid cols-4" style="margin-top:16px">
        ${statTile("⭐", prog.xp, "XP total")}
        ${statTile("🔥", s.streak.dias, "dias de foco")}
        ${statTile("✅", `${acertosGerais}/${totalQ}`, "acertos")}
        ${statTile("🏅", `${s.conquistas.length}/${badges.length}`, "conquistas")}
      </div>

      ${totalQ > 0 ? `<div class="card" style="margin-top:16px">
        <h2>📊 Proficiência por área</h2>
        ${Charts.barras(Engine.AREAS.map(a => ({ r: Engine.AREA_NOME[a], v: areas[a].pct })), { sufixo: "%", cor: Charts.cores.roxo, max: 100 })}
      </div>` : ""}

      <div class="section-title" style="font-size:1.1rem">🏆 Recordes pessoais</div>
      <div class="grid cols-3 recordes-grid">
        ${Engine.recordes().map(r => `<div class="card recorde-item">
          <div class="emoji">${r.icone}</div>
          <div class="valor">${r.valor}</div>
          <div class="rot">${esc(r.titulo)}</div>
          <div class="det muted small">${esc(r.detalhe)}</div>
        </div>`).join("")}
      </div>

      <div class="card" style="margin-top:16px">
        <h3>🎯 Minhas metas</h3>
        <div class="meta-edit">
          <span>Meta diária de questões</span>
          <input type="number" id="meta-dia" min="1" max="200" value="${s.metaDiaria || 20}">
        </div>
        <div class="meta-edit">
          <span>Meta semanal de questões</span>
          <input type="number" id="meta-semana" min="1" max="2000" value="${s.metaSemanal || 100}">
        </div>
        <button class="btn btn-secondary small" id="salvar-metas" style="margin-top:8px">💾 Salvar metas</button>
      </div>

      <div class="section-title" style="font-size:1.1rem">🏅 Conquistas</div>
      <div class="grid cols-4">
        ${badges.map(b => `<div class="badge-item ${b.conquistada ? "" : "bloqueada"}">
          <div class="emoji">${b.emoji}</div><b>${esc(b.nome)}</b><span>${esc(b.desc)}</span></div>`).join("")}
      </div>

      <div class="card" style="margin-top:20px">
        <h3>⚙️ Meus dados</h3>
        <p class="muted small">Tudo é salvo apenas neste navegador (armazenamento local). Nada vai para a internet.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
          <button class="btn btn-secondary small" id="exportar">⬇️ Exportar meu progresso</button>
          <button class="btn btn-ghost small" id="trocar-nome">✏️ Trocar meu nome</button>
          <button class="btn btn-danger small" id="resetar">🗑️ Apagar tudo e recomeçar</button>
        </div>
      </div>`;

    const salvarMetas = view.querySelector("#salvar-metas");
    if (salvarMetas) salvarMetas.onclick = () => {
      const md = Math.max(1, parseInt(view.querySelector("#meta-dia").value, 10) || 20);
      const ms = Math.max(1, parseInt(view.querySelector("#meta-semana").value, 10) || 100);
      Store.set({ metaDiaria: md, metaSemanal: ms });
      toast("Metas atualizadas! 🎯");
      renderPerfil();
    };

    const picker = view.querySelector("#avatar-picker");
    view.querySelector("#avatar-btn").onclick = () => picker.classList.toggle("hidden");
    view.querySelectorAll("#avatar-picker .avatar-opt").forEach(b => b.onclick = () => {
      Store.set({ avatar: b.dataset.val });
      toast(`Avatar atualizado! ${b.dataset.val}`);
      renderPerfil();
    });

    view.querySelector("#exportar").onclick = () => {
      const blob = new Blob([JSON.stringify(s, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `rumo-enem-${s.nome}.json`;
      a.click(); URL.revokeObjectURL(a.href);
      toast("Progresso exportado! 💾");
    };
    view.querySelector("#trocar-nome").onclick = () => {
      const novo = prompt("Novo nome:", s.nome);
      if (novo && novo.trim()) { Store.set({ nome: novo.trim() }); toast("Nome atualizado!"); renderPerfil(); }
    };
    view.querySelector("#resetar").onclick = () => {
      if (confirm("Tem certeza? Isso apaga TODO o seu progresso e não dá pra desfazer.")) {
        Store.reset(); location.hash = "#/home"; router();
      }
    };
  }

  // ---------------- Boot ----------------
  document.querySelectorAll("#mainnav button, .brand").forEach(b => {
    if (b.dataset.nav) b.onclick = () => go(b.dataset.nav);
  });
  window.addEventListener("hashchange", router);
  router();
})();
