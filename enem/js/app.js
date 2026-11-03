/* ============================================================
   APP — roteamento (hash), onboarding e todas as telas.
   ============================================================ */
(function () {
  const view = document.getElementById("view");
  const topbar = document.getElementById("topbar");
  const footer = document.getElementById("footer");
  const C = window.ENEM_CONTENT;
  const Q = window.ENEM_QUESTIONS;
  const EX = window.ENEM_EXEMPLOS || {};
  // incidência de cada tópico no ENEM (alta | media | baixa), vinda do banco de questões
  const INC_TOP = {};
  Q.forEach(q => { if (q.incidencia) INC_TOP[q.topico] = q.incidencia; });
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
    pararCarrossel();

    switch (path) {
      case "": case "home": renderHome(); break;
      case "intensivao": renderIntensivao(); break;
      case "trilhas": param ? renderMateria(param) : renderTrilhas(); break;
      case "licao": renderLicao(param); break;
      case "exemplos": renderExemplos(param); break;
      case "praticar": renderPraticarConfig(); break;
      case "simulado": renderSimulado(); break;
      case "resultado": renderResultado(param); break;
      case "redacao": renderRedacao(); break;
      case "temas": param ? renderTemaDetalhe(param) : renderTemas(); break;
      case "treino": renderTreino(param); break;
      case "modelos": renderModelos(); break;
      case "vocabulario": renderVocabulario(); break;
      case "plano": renderPlano(); break;
      case "recursos": renderRecursos(); break;
      case "perfil": renderPerfil(); break;
      default: renderHome();
    }
    // marca nav ativa (temas/treino/modelos ficam sob "Redação")
    const navPath = ["temas", "treino", "modelos", "vocabulario"].includes(path) ? "redacao" : path === "exemplos" ? "trilhas" : (path || "home");
    document.querySelectorAll("#mainnav button").forEach(b => {
      b.classList.toggle("active", b.dataset.nav === "#/" + navPath);
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
        <button class="btn btn-ghost block" id="ob-skip" style="margin-top:8px">⚡ Pular e estudar agora</button>
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
      go("#/intensivao");
      setTimeout(() => toast(`Vamos nessa, ${nome}! ${avatar}`), 400);
    };
    view.querySelector("#ob-go").onclick = start;
    view.querySelector("#ob-skip").onclick = () => {
      const nome = view.querySelector("#ob-nome").value.trim() || "Estudante";
      Store.set({ nome, avatar, objetivo, estiloAprendizado: estilo });
      go("#/intensivao");
    };
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
      <a class="cta-intensivao" href="#/intensivao">⚡ <b>Modo Intensivão</b> — questões por área e tópico, reforço dos seus erros e redação em 1 clique <span>→</span></a>
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
    if (EX[mid]) html = html.replace(`<p class="muted small">${feitasTot}`, `<a class="cta-intensivao" style="margin:12px 0" href="#/exemplos/${mid}">🧪 <span><b>Exemplos resolvidos de ${esc(m.nome)}</b><br><span class="small">${EX[mid].length} situações do cotidiano, passo a passo, com a pegadinha</span></span></a><p class="muted small">${feitasTot}`);
    html += `
      <div class="card" style="margin-top:16px;text-align:center">
        <p class="muted">Terminou de estudar? Fixe o conteúdo praticando!</p>
        <button class="btn btn-primary" onclick="location.hash='#/praticar'">✏️ Praticar ${esc(m.nome)}</button>
      </div>`;
    view.innerHTML = html;
  }

  // ---------------- Exemplos resolvidos ----------------
  function renderExemplos(mid) {
    const lista = EX[mid];
    if (!lista) {
      view.innerHTML = `<div class="section-title">🧪 Exemplos resolvidos</div>
        <p class="muted">Escolha a matéria:</p><div class="grid cols-4">${Object.keys(EX).filter(k => C.materias[k])
          .map(k => atalho(C.materias[k].emoji, C.materias[k].nome, `${EX[k].length} exemplos`, "#/exemplos/" + k)).join("")}</div>`;
      return;
    }
    const m = C.materias[mid] || { nome: mid, emoji: "🧪" };
    const outras = Object.keys(EX).filter(k => k !== mid && C.materias[k]);
    view.innerHTML = `
      <button class="btn btn-ghost small" onclick="location.hash='#/trilhas/${mid}'">← ${esc(m.nome)}</button>
      <div class="section-title" style="margin-top:12px">🧪 Exemplos resolvidos — ${m.emoji} ${esc(m.nome)}</div>
      <div class="card"><p class="small" style="margin:0"><b>Como estudar:</b> leia a situação e o que se pede, <b>tente resolver sozinho</b> (papel e caneta!) e só depois toque em <b>“Ver resolução”</b>. Tentar antes de ver a resposta fixa muito mais.</p></div>
      ${lista.map((e, i) => `<div class="card exemplo" style="margin-top:12px">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start;flex-wrap:wrap">
          <h3 style="margin:0">${i + 1}. ${esc(e.titulo)}</h3><span class="chip roxo">${esc(e.tema)}</span>
        </div>
        <p style="margin:10px 0 6px">📍 ${esc(e.situacao)}</p>
        <p style="margin:0"><b>❓ O que se pede:</b> ${esc(e.pede)}</p>
        <button class="btn btn-secondary small ver-res" style="margin-top:10px" data-i="${i}">👀 Ver resolução</button>
        <div class="resolucao" id="res-${i}" hidden>
          <div class="bloco-especial bloco-dica"><b>💡 Conceito</b>${esc(e.conceito)}</div>
          ${e.formula ? `<div class="formula">${esc(e.formula)}</div>` : ""}
          <ol class="passos">${e.passos.map(p => `<li>${esc(p)}</li>`).join("")}</ol>
          <div class="bloco-especial bloco-mnemonico"><b>✅ Resposta</b>${esc(e.resposta)}</div>
          <div class="bloco-especial bloco-atencao"><b>⚠️ Pegadinha</b>${esc(e.pegadinha)}</div>
        </div>
      </div>`).join("")}
      <div class="card" style="margin-top:16px;text-align:center">
        <p class="muted">Agora aplique: questões de ${esc(m.nome)} (as de alta incidência primeiro).</p>
        <button class="btn btn-primary" id="ex-praticar">✏️ 10 questões de ${esc(m.nome)}</button>
        ${outras.length ? `<p class="small" style="margin-top:12px">Outros exemplos: ${outras.map(k => `<a href="#/exemplos/${k}">${C.materias[k].emoji} ${esc(C.materias[k].nome)}</a>`).join(" · ")}</p>` : ""}
      </div>`;
    view.querySelectorAll(".ver-res").forEach(b => b.onclick = () => {
      const box = view.querySelector("#res-" + b.dataset.i);
      box.hidden = !box.hidden;
      b.textContent = box.hidden ? "👀 Ver resolução" : "🙈 Esconder resolução";
    });
    view.querySelector("#ex-praticar").onclick = () => iniciarSimulado({ materias: [mid], qtd: 10, incidencia: ["alta", "media"] });
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
        <label class="check-row"><input type="checkbox" id="cfg-alta"><span>🔥 Só assuntos que MAIS caem no ENEM (alta incidência)</span></label>
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
      const soAlta = view.querySelector("#cfg-alta").checked;
      const modoFonte = fonteSelecionada();

      iniciarSimulado({ areas, fontes: modoFonte.fontes, nivel, qtd, comTempo, comExplica, incidencia: soAlta ? ["alta"] : null });
    };
  }

  /* Cria e abre um simulado a partir de filtros. Usado pelo Praticar e pelo Intensivão.
     opts: { areas?, fontes?, nivel?, qtd?, topicos?, materias?, comTempo?, comExplica?, priorizarErros? } */
  function iniciarSimulado(opts) {
    const o = Object.assign({ fontes: ["enem", "vestibular", "ia"], nivel: "todas", qtd: 10, comTempo: false, comExplica: true }, opts || {});
    let pool = Q.filter(q =>
      (!o.areas || o.areas.includes(q.area)) &&
      (!o.materias || o.materias.includes(q.materia)) &&
      (!o.topicos || o.topicos.includes(q.topico)) &&
      (!o.ids || o.ids.includes(q.id)) &&
      (!o.incidencia || o.incidencia.includes(q.incidencia)) &&
      o.fontes.includes(q.fonte) &&
      (o.nivel === "todas" || q.nivel === o.nivel));
    pool = embaralhar(pool);
    if (o.priorizarErros) {
      // coloca primeiro as questões que a pessoa já errou
      const rq = Store.get().respostasQuestoes || {};
      pool.sort((a, b) => (rq[a.id] && !rq[a.id].acertou ? 0 : 1) - (rq[b.id] && !rq[b.id].acertou ? 0 : 1));
    }
    if (o.qtd > 0) pool = pool.slice(0, o.qtd);
    if (!pool.length) { toast("Sem questões para esse filtro. Tente outro."); return; }
    examState = {
      questoes: pool, respostas: new Array(pool.length).fill(null),
      atual: 0, comTempo: o.comTempo, comExplica: o.comExplica, revelada: new Array(pool.length).fill(false),
      inicio: Date.now(), tempoRestante: o.comTempo ? pool.length * 180 : null // 3 min/questão
    };
    if (location.hash === "#/simulado") router(); else go("#/simulado");
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
          ${q.incidencia === "alta" ? `<span class="chip vermelho" title="Assunto de alta incidência no ENEM">🔥 Cai muito</span>` : q.incidencia === "baixa" ? `<span class="chip cinza" title="Assunto raro no ENEM">🧊 Cai pouco</span>` : ""}
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

  // ================================================================
  //  REDAÇÃO (hub) · TEMAS · TREINADOR · MODELOS · REPERTÓRIO · INTENSIVÃO
  // ================================================================
  const T = window.ENEM_TEMAS;
  const REP = window.ENEM_REPERTORIO;
  const NORMA = window.ENEM_NORMA;
  const ORDEM_PROB = ["quase-certo", "muito-provavel", "provavel", "pouco-provavel"];
  const DIF_CHIP = { "Fácil": "verde", "Médio": "amarelo", "Difícil": "vermelho", "Extrema": "roxo" };
  const chipProb = p => { const m = T.probabilidades[p]; return `<span class="chip ${m.chip}">${m.emoji} ${m.rotulo}</span>`; };
  const chipDif = d => `<span class="chip ${DIF_CHIP[d] || "cinza"}">${d === "Extrema" ? "💀" : "🎚️"} ${d}</span>`;

  // bloco "repertório pertinente" (exemplo certo × errado)
  function blocoPertinencia() {
    const P = R.pertinencia;
    return `<div class="card">
      <p>${esc(P.regra)}</p>
      <p class="small muted" style="margin-top:6px"><b>Exemplo — tema:</b> ${esc(P.exemplo.tema)}</p>
      <div class="bloco-especial bloco-atencao"><b>❌ Repertório sem relação</b>${esc(P.exemplo.errado)}</div>
      <div class="bloco-especial bloco-dica"><b>✅ Repertórios pertinentes</b><ul class="lista">${P.exemplo.certo.map(c => `<li>${esc(c)}</li>`).join("")}</ul></div>
      <p class="small"><b>🧪 ${esc(P.teste)}</b></p>
    </div>`;
  }

  // ---------- Redação: hub ----------
  function renderRedacao() {
    view.innerHTML = `
      <div class="section-title">📝 Redação nota 1000 <small>tudo em um lugar</small></div>
      <div class="grid cols-4">
        ${atalho("🎯", "Temas prováveis", `${T.temas.length} temas com folha de estudo`, "#/temas")}
        ${atalho("✍️", "Escrever e verificar", "Sem corretor + verificação de norma", "#/treino")}
        ${atalho("🧩", "Exercícios de norma", "Acento, crase, concordância…", "#/treino/exercicios")}
        ${atalho("📐", "Modelos e dicas", "Esqueletos prontos + redação-modelo", "#/modelos")}
      </div>
      <div class="grid cols-2" style="margin-top:16px">
        ${atalho("🔗", "Guia de conectivos", "Sentido, pontuação e armadilhas de cada conectivo", "#/modelos")}
        ${atalho("📖", "Dicionário de vocabulário formal", `${window.ENEM_VOCABULARIO.palavras.length} palavras e expressões formais, claras e atuais`, "#/vocabulario")}
      </div>

      <div class="section-title" style="font-size:1.1rem">💡 Enriquecedor de repertório</div>
      <div id="carrossel"></div>

      <div class="card" style="margin-top:16px"><p>${esc(R.intro)}</p></div>

      <div class="section-title" style="font-size:1.1rem">🏗️ Estrutura em 4 parágrafos <small>6 a 8 linhas cada</small></div>
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

      <div class="section-title" style="font-size:1.1rem">⛔ O que zera a redação</div>
      <div class="card">
        <ul class="lista">${R.zeram.map(z => `<li>${esc(z)}</li>`).join("")}</ul>
        <div class="bloco-especial bloco-atencao"><b>⚖️ Direitos Humanos</b>${esc(R.avisoDH)}</div>
      </div>

      <div class="section-title" style="font-size:1.1rem">🎯 Repertório tem que ter relação com o tema</div>
      ${blocoPertinencia()}

      <div class="section-title" style="font-size:1.1rem">📚 Repertórios por eixo</div>
      <div class="scroll-x"><table class="tabela-simples">
        <tr><th>Eixo</th><th>Fontes legitimadas</th><th>Como usar</th></tr>
        ${R.repertorios.map(r => `<tr><td><b>${esc(r.eixo)}</b></td><td>${esc(r.fontes)}</td><td>${esc(r.uso)}</td></tr>`).join("")}
      </table></div>`;
    montarCarrossel("carrossel");
  }

  // ---------- Temas: lista ----------
  function renderTemas() {
    let filtroP = "todos", filtroD = "todos";
    view.innerHTML = `
      <button class="btn btn-ghost small" onclick="location.hash='#/redacao'">← Redação</button>
      <div class="section-title" style="margin-top:12px">🎯 Temas prováveis — ENEM 2026 <small id="temas-cont"></small></div>
      <div class="bloco-especial bloco-atencao"><b>⚠️ Leia antes</b>${esc(T.disclaimer)}</div>
      <div class="filtros">
        <div class="filtro-grupo"><span class="muted small">Probabilidade:</span>
          ${[["todos", "Todos"]].concat(ORDEM_PROB.map(p => [p, T.probabilidades[p].emoji + " " + T.probabilidades[p].rotulo]))
        .map(([v, l]) => `<button class="filtro ${v === "todos" ? "ativo" : ""}" data-fp="${v}">${l}</button>`).join("")}
        </div>
        <div class="filtro-grupo"><span class="muted small">Dificuldade:</span>
          ${["todos", "Fácil", "Médio", "Difícil", "Extrema"].map(v => `<button class="filtro ${v === "todos" ? "ativo" : ""}" data-fd="${v}">${v === "todos" ? "Todas" : v}</button>`).join("")}
        </div>
      </div>
      <div class="grid cols-2" id="temas-lista"></div>
      <details class="acordeao" style="margin-top:16px"><summary>📜 Temas que já caíram (não aposte neles)</summary>
        <div class="corpo"><ul class="lista">${T.jaCairam.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div></details>`;

    const desenhar = () => {
      const lista = T.temas
        .filter(t => (filtroP === "todos" || t.probabilidade === filtroP) && (filtroD === "todos" || t.dificuldade === filtroD))
        .sort((a, b) => ORDEM_PROB.indexOf(a.probabilidade) - ORDEM_PROB.indexOf(b.probabilidade));
      view.querySelector("#temas-lista").innerHTML = lista.map(t => `
        <div class="card clickable tema-card prob-${t.probabilidade}" onclick="location.hash='#/temas/${t.id}'">
          <div class="tema-chips">${chipProb(t.probabilidade)} ${chipDif(t.dificuldade)} <span class="chip cinza">${esc(t.eixo)}</span></div>
          <h3>${esc(t.titulo)}</h3>
          <p class="muted small">${esc(t.porque)}</p>
          <span class="link-mais">Abrir folha de estudo →</span>
        </div>`).join("") || `<p class="muted">Nenhum tema com esse filtro.</p>`;
      view.querySelector("#temas-cont").textContent = `${lista.length} tema(s)`;
    };
    view.querySelectorAll("[data-fp]").forEach(b => b.onclick = () => {
      filtroP = b.dataset.fp; view.querySelectorAll("[data-fp]").forEach(x => x.classList.toggle("ativo", x === b)); desenhar();
    });
    view.querySelectorAll("[data-fd]").forEach(b => b.onclick = () => {
      filtroD = b.dataset.fd; view.querySelectorAll("[data-fd]").forEach(x => x.classList.toggle("ativo", x === b)); desenhar();
    });
    desenhar();
  }

  // ---------- Tema: folha de estudo ----------
  function renderTemaDetalhe(id) {
    const t = T.temas.find(x => x.id === id);
    if (!t) { renderTemas(); return; }
    const prop = esc(t.proposta).replace(/\((AGENTE|AÇÃO|MEIO|FINALIDADE|DETALHAMENTO)\)/g, (m, k) => ` <span class="tag-el">${k}</span>`);
    view.innerHTML = `
      <div class="no-print" style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-ghost small" onclick="location.hash='#/temas'">← Temas</button>
        <button class="btn btn-secondary small" id="imprimir">🖨️ Imprimir / salvar PDF</button>
        <button class="btn btn-primary small" onclick="location.hash='#/treino/escrever-${t.id}'">✍️ Escrever sobre este tema</button>
      </div>
      <div class="card folha" style="margin-top:12px">
        <div class="tema-chips">${chipProb(t.probabilidade)} ${chipDif(t.dificuldade)} <span class="chip cinza">${esc(t.eixo)}</span></div>
        <h2 style="margin-top:8px">${esc(t.titulo)}</h2>
        <p class="muted small"><b>Por que pode cair:</b> ${esc(t.porque)}</p>

        <h3>📌 Resumo</h3>
        <p>${esc(t.resumo)}</p>
        <div class="bloco-especial bloco-analogia"><b>🎯 Tese pronta</b>${esc(t.tese)}</div>

        <h3>🧱 Construção dos argumentos</h3>
        <ol class="lista">${t.argumentos.map(a => `<li>${esc(a)}</li>`).join("")}</ol>

        <h3>📊 Dados e fontes</h3>
        <ul class="lista">${t.dados.map(d => `<li>${esc(d.texto)} <span class="fonte">— ${esc(d.fonte)}</span></li>`).join("")}</ul>

        <h3>📚 Repertórios pertinentes a este tema</h3>
        <ul class="lista">${t.repertorios.map(r => `<li><b>${esc(r.ref)}:</b> ${esc(r.uso)}</li>`).join("")}</ul>
        <p class="small muted">Cada repertório acima está ligado ao assunto do tema. Use-o explicando essa ligação — não apenas citando.</p>

        <div class="bloco-especial bloco-mnemonico"><b>🧠 Jeito de lembrar</b>${esc(t.lembrar)}</div>

        <h3>🛠️ Proposta de intervenção (5 elementos)</h3>
        <p class="proposta">${prop}</p>
        <p class="muted small" style="margin-top:12px">Dados são referências de estudo: cite a fonte e o ano na redação e, se der tempo, confirme no site oficial.</p>
      </div>`;
    view.querySelector("#imprimir").onclick = () => window.print();
  }

  // ---------- Treinador de norma padrão ----------
  const RASCUNHO_KEY = "rumo_enem_rascunho";
  const lerRascunho = () => { try { return JSON.parse(localStorage.getItem(RASCUNHO_KEY) || "{}"); } catch (e) { return {}; } };
  const salvarRascunho = o => { try { localStorage.setItem(RASCUNHO_KEY, JSON.stringify(o)); } catch (e) { /* armazenamento indisponível */ } };

  function renderTreino(param) {
    let aba = "escrever", temaInicial = null;
    if (param === "exercicios") aba = "exercicios";
    else if (param === "regras") aba = "regras";
    else if (param && param.indexOf("escrever-") === 0) temaInicial = param.slice(9);
    view.innerHTML = `
      <button class="btn btn-ghost small" onclick="location.hash='#/redacao'">← Redação</button>
      <div class="section-title" style="margin-top:12px">✍️ Treinador de norma padrão</div>
      <div class="abas">
        <button class="aba" data-aba="escrever">✍️ Escrever e verificar</button>
        <button class="aba" data-aba="exercicios">🧩 Exercícios</button>
        <button class="aba" data-aba="regras">📌 Regras rápidas</button>
      </div>
      <div id="aba-conteudo"></div>`;
    const abrir = a => {
      view.querySelectorAll(".aba").forEach(b => b.classList.toggle("ativa", b.dataset.aba === a));
      const box = view.querySelector("#aba-conteudo");
      if (a === "escrever") abaEscrever(box, temaInicial);
      else if (a === "exercicios") abaExercicios(box);
      else abaRegras(box, () => abrir("exercicios"));
    };
    view.querySelectorAll(".aba").forEach(b => b.onclick = () => abrir(b.dataset.aba));
    abrir(aba);
  }

  function abaEscrever(box, temaInicial) {
    const s = Store.get();
    const rasc = lerRascunho();
    const temaSel = temaInicial || rasc.tema || T.temas[0].id;
    box.innerHTML = `
      <div class="card">
        <label class="small"><b>Tema:</b></label>
        <select id="tr-tema" style="width:100%;margin:6px 0">
          ${ORDEM_PROB.map(p => `<optgroup label="${T.probabilidades[p].emoji} ${T.probabilidades[p].rotulo}">
            ${T.temas.filter(t => t.probabilidade === p).map(t => `<option value="${t.id}" ${t.id === temaSel ? "selected" : ""}>${esc(t.titulo)}</option>`).join("")}
          </optgroup>`).join("")}
        </select>
        <p class="small" id="tr-tese"></p>
        <div class="bloco-especial bloco-dica" style="margin:8px 0"><b>✍️ Modo prova: sem corretor</b>O corretor do navegador está desligado neste campo, como na folha do ENEM. Separe os parágrafos com Enter. Meta: 4 parágrafos de 6 a 8 linhas (≈ 24 a 30 linhas). O texto é salvo automaticamente neste aparelho.</div>
        <textarea id="tr-texto" class="folha-texto" spellcheck="false" autocorrect="off" autocapitalize="off" autocomplete="off"
          data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false" placeholder="Escreva sua redação aqui…">${esc(rasc.texto || "")}</textarea>
        <div class="contadores" id="tr-cont"></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
          <button class="btn btn-primary" id="tr-verificar">🔍 Verificar norma padrão</button>
          <button class="btn btn-ghost" id="tr-limpar">🗑️ Limpar</button>
        </div>
      </div>
      <div id="tr-relatorio"></div>

      <div class="card" style="margin-top:16px">
        <h3>📷 Escreveu no papel? Envie a foto</h3>
        <p class="muted small">A foto fica só neste aparelho, ao lado do campo de texto, para você revisar com calma. O app não lê letra manuscrita: para a verificação automática, digite o texto (ou o trecho que quiser conferir) no campo acima.</p>
        <input type="file" id="tr-foto" accept="image/*">
        <div id="tr-foto-prev"></div>
      </div>

      <details class="acordeao" style="margin-top:16px"><summary>🧮 Autoavaliação e salvar no histórico</summary>
        <div class="corpo">
          <p class="muted small">Dê a nota de cada competência com base no relatório e nas dicas. A nota entra no seu progresso (XP e recordes).</p>
          ${R.competencias.map(c => `<div class="slider-row">
            <span style="min-width:150px" class="small"><b>${c.n}</b> ${esc(c.titulo)}</span>
            <input type="range" min="0" max="200" step="40" value="120" class="comp-slider" data-c="${c.n}">
            <span class="val" data-for="${c.n}">120</span>
          </div>`).join("")}
          <div class="card" style="background:var(--roxo-claro);text-align:center;margin-top:12px">
            <div class="muted small">Nota estimada</div>
            <div style="font-size:2rem;font-weight:800;color:var(--roxo)" id="tr-total">600</div>
          </div>
          <button class="btn btn-primary block" id="tr-salvar" style="margin-top:12px">💾 Salvar redação e nota</button>
        </div>
      </details>

      ${s.redacoes.length ? `<div class="section-title" style="font-size:1.05rem">📈 Suas redações (${s.redacoes.length})</div>
        ${s.redacoes.slice().reverse().map(r => `<div class="card" style="margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
            <b class="small">${esc(r.tema)}</b>
            <span class="chip ${r.total >= 800 ? "verde" : r.total >= 500 ? "amarelo" : "vermelho"}">${r.total} pts</span>
          </div>
          <p class="muted small">${new Date(r.data).toLocaleDateString("pt-BR")} · ${(r.texto || "").split(/\s+/).filter(Boolean).length} palavras${r.alertas != null ? ` · ${r.alertas} alerta(s) de norma` : ""}</p>
        </div>`).join("")}` : ""}`;

    const ta = box.querySelector("#tr-texto"), sel = box.querySelector("#tr-tema");
    const temaAtual = () => T.temas.find(x => x.id === sel.value);
    const atualizarTese = () => {
      const t = temaAtual();
      box.querySelector("#tr-tese").innerHTML = t ? `<b>Ideia de tese:</b> ${esc(t.tese)} <a href="#/temas/${t.id}">ver folha do tema →</a>` : "";
    };
    const contar = () => {
      const pars = ta.value.split(/\n+/).map(p => p.trim()).filter(p => (p.match(/\S+/g) || []).length >= 5);
      const pal = (ta.value.match(/\S+/g) || []).length;
      const linhas = pars.map(p => Math.max(1, Math.round((p.match(/\S+/g) || []).length / 11)));
      const tot = linhas.reduce((a, b) => a + b, 0);
      box.querySelector("#tr-cont").innerHTML =
        `<span>📝 ${pal} palavras</span><span>¶ ${pars.length} parágrafo(s)</span>` +
        `<span class="${tot > 30 || (pal > 0 && tot <= 7) ? "alerta" : ""}">📏 ~${tot} linhas (máx. 30)</span>` +
        linhas.map((l, i) => `<span class="${l < 6 || l > 8 ? "alerta" : "ok"}">§${i + 1}: ~${l} lin.</span>`).join("");
      salvarRascunho({ tema: sel.value, texto: ta.value });
    };
    ta.oninput = contar;
    sel.onchange = () => { atualizarTese(); contar(); };
    atualizarTese(); contar();

    box.querySelector("#tr-verificar").onclick = () => {
      mostrarRelatorio(box.querySelector("#tr-relatorio"), ta.value);
      box.querySelector("#tr-relatorio").scrollIntoView({ behavior: "smooth", block: "start" });
    };
    box.querySelector("#tr-limpar").onclick = () => {
      if (ta.value && !confirm("Apagar o texto?")) return;
      ta.value = ""; contar(); box.querySelector("#tr-relatorio").innerHTML = "";
    };

    // foto (só pré-visualização local)
    box.querySelector("#tr-foto").onchange = ev => {
      const f = ev.target.files && ev.target.files[0];
      if (!f) return;
      const url = URL.createObjectURL(f);
      box.querySelector("#tr-foto-prev").innerHTML = `<img src="${url}" alt="Foto da redação" class="foto-redacao">`;
    };

    // autoavaliação
    const sliders = box.querySelectorAll(".comp-slider");
    const recalc = () => {
      let tot = 0;
      sliders.forEach(sl => { tot += +sl.value; box.querySelector(`.val[data-for="${sl.dataset.c}"]`).textContent = sl.value; });
      box.querySelector("#tr-total").textContent = tot;
    };
    sliders.forEach(sl => sl.oninput = recalc); recalc();
    box.querySelector("#tr-salvar").onclick = () => {
      if ((ta.value.match(/\S+/g) || []).length < 30) { toast("Escreva um pouco mais antes de salvar 🙂"); return; }
      const notas = {}; let tot = 0;
      sliders.forEach(sl => { notas[sl.dataset.c] = +sl.value; tot += +sl.value; });
      const t = temaAtual();
      const rel = RedacaoCheck.analisar(ta.value);
      Store.registrarRedacao({ id: "red-" + Date.now(), data: Date.now(), tema: t ? t.titulo : "", texto: ta.value, notas, total: tot, alertas: rel.resumo.total });
      toast(`Redação salva! Nota: ${tot} · +${Engine.XP.redacaoBase + Math.round(tot / 10)} XP 📝`);
      celebrarConquistas(); celebrarProgresso();
      abaEscrever(box, sel.value);
    };
  }

  function mostrarRelatorio(el, texto) {
    const r = RedacaoCheck.analisar(texto);
    if (r.vazio) { el.innerHTML = `<div class="card" style="margin-top:16px"><p class="muted">Escreva algo para verificar.</p></div>`; return; }
    const M = RedacaoCheck.CAT_META;
    const grupos = {};
    r.achados.forEach(a => (grupos[a.cat] = grupos[a.cat] || []).push(a));
    el.innerHTML = `<div class="card" style="margin-top:16px">
      <h3>🔍 Relatório de norma padrão</h3>
      <p class="muted small">${r.palavras} palavras · ~${r.linhasEstimadas} linhas estimadas · <b>${r.resumo.total}</b> ponto(s) de atenção</p>
      ${r.resumo.total === 0 ? `<div class="bloco-especial bloco-dica"><b>✅ Nada encontrado</b>Nenhum desvio detectado pelos verificadores automáticos. Mesmo assim, releia: sentido, coesão e argumentação exigem leitura humana.</div>` : ""}
      <div class="tema-chips">${Object.keys(grupos).map(c => `<span class="chip ${M[c].chip}">${M[c].emoji} ${M[c].rotulo}: ${grupos[c].length}</span>`).join(" ")}</div>
      ${Object.keys(grupos).map(c => `<details class="acordeao" open><summary>${M[c].emoji} ${M[c].rotulo} (${grupos[c].length})</summary>
        <div class="corpo">${grupos[c].map(a => `<div class="achado grav-${a.grav}"><div class="trecho">“${esc(a.trecho)}”</div><div class="small">${esc(a.msg)}</div></div>`).join("")}</div>
      </details>`).join("")}
      <p class="muted small" style="margin-top:8px">⚠️ A verificação automática é um apoio de treino: verifica truncamento, justaposição, excesso de elementos, paralelismo, regência, concordância, acentuação, ortografia, vírgula em adjunto adverbial longo e tamanho dos parágrafos. Pode deixar passar erros e, raramente, apontar algo correto.</p>
    </div>`;
  }

  function registrarNorma(ok) {
    const ns = Object.assign({ feitos: 0, acertos: 0 }, Store.get().normaStats || {});
    ns.feitos += 1; if (ok) ns.acertos += 1;
    Store.set({ normaStats: ns });
    if (ok) celebrarProgresso();
  }

  function abaExercicios(box) {
    const cats = NORMA.categorias;
    let cat = "todos", fila = [], i = 0, acertos = 0, feitos = 0;
    const semAcento = x => x.normalize("NFD").replace(/[̀-ͯ]/g, "");
    const nova = () => {
      fila = embaralhar(NORMA.exercicios.filter(e => cat === "todos" || e.cat === cat));
      i = 0; acertos = 0; feitos = 0; desenhar();
    };
    const ligarFiltros = () => box.querySelectorAll("[data-cat]").forEach(b => b.onclick = () => { cat = b.dataset.cat; nova(); });
    function desenhar() {
      const e = fila[i];
      const ns = Store.get().normaStats || { feitos: 0, acertos: 0 };
      const topo = `<div class="filtros"><div class="filtro-grupo">
          ${[["todos", "Todos"]].concat(Object.entries(cats)).map(([k, l]) => `<button class="filtro ${k === cat ? "ativo" : ""}" data-cat="${k}">${esc(l)}</button>`).join("")}
        </div></div>
        <div class="muted small" style="margin:6px 0">Rodada: <b>${acertos}/${feitos}</b> · exercício ${Math.min(i + 1, fila.length)} de ${fila.length} · total geral: ${ns.acertos}/${ns.feitos}</div>`;
      if (!e) {
        box.innerHTML = topo + `<div class="card nota-hero"><div class="emoji">🏁</div><div class="nota">${acertos}/${feitos}</div>
          <p class="muted">Rodada concluída!</p><button class="btn btn-primary" id="ex-de-novo">🔁 Nova rodada</button></div>`;
        ligarFiltros(); box.querySelector("#ex-de-novo").onclick = nova; return;
      }
      const corpo = e.tipo === "digitar"
        ? `<div class="questao-texto">${esc(e.pergunta)}</div>
           <input type="text" id="ex-resp" class="input-norma" spellcheck="false" autocorrect="off" autocapitalize="off" autocomplete="off" placeholder="Digite a palavra correta">
           <div style="margin-top:10px"><button class="btn btn-primary" id="ex-conferir">Conferir</button></div>
           <p class="muted small" style="margin-top:6px">No celular, segure a vogal no teclado para ver os acentos.</p>`
        : `<div class="questao-texto">${esc(e.pergunta)}</div>
           <div>${e.alternativas.map((a, k) => `<button class="alternativa" data-k="${k}"><span class="letra">${String.fromCharCode(65 + k)}</span><span>${esc(a)}</span></button>`).join("")}</div>`;
      box.innerHTML = topo + `<div class="card">
        <div class="tema-chips"><span class="chip roxo">${esc(cats[e.cat])}</span> <span class="chip ${DIF_CHIP[e.nivel] || "cinza"}">${e.nivel}</span></div>
        ${corpo}<div id="ex-fb"></div></div>`;
      ligarFiltros();

      const responder = (ok, titulo) => {
        feitos++; if (ok) acertos++;
        registrarNorma(ok);
        box.querySelector("#ex-fb").innerHTML = `<div class="explicacao" style="border-left-color:${ok ? "var(--verde)" : "var(--vermelho)"};background:${ok ? "var(--verde-claro)" : "var(--vermelho-claro)"}">
            <b>${titulo}</b><p style="margin-top:6px">${esc(e.explicacao)}</p></div>
          <button class="btn btn-primary" id="ex-prox" style="margin-top:10px">Próximo →</button>`;
        const prox = box.querySelector("#ex-prox");
        prox.onclick = () => { i++; desenhar(); };
        prox.focus();
      };
      if (e.tipo === "digitar") {
        const inp = box.querySelector("#ex-resp");
        const conferir = () => {
          const v = inp.value.trim().toLowerCase();
          if (!v || inp.disabled) return;
          const certo = e.resposta.toLowerCase();
          const ok = v === certo;
          const quase = !ok && semAcento(v) === semAcento(certo);
          inp.disabled = true; box.querySelector("#ex-conferir").disabled = true;
          responder(ok, ok ? "✅ Correto!" : quase
            ? `🟡 Quase! As letras estão certas, mas o acento não. Resposta: ${esc(e.resposta)}`
            : `❌ Resposta correta: ${esc(e.resposta)}`);
        };
        box.querySelector("#ex-conferir").onclick = conferir;
        inp.addEventListener("keydown", ev => { if (ev.key === "Enter") conferir(); });
        inp.focus();
      } else {
        box.querySelectorAll(".alternativa").forEach(b => b.onclick = () => {
          const k = +b.dataset.k, ok = k === e.correta;
          box.querySelectorAll(".alternativa").forEach((x, j) => {
            x.disabled = true;
            if (j === e.correta) x.classList.add("correta"); else if (j === k) x.classList.add("errada");
          });
          responder(ok, ok ? "✅ Correto!" : `❌ Resposta correta: ${String.fromCharCode(65 + e.correta)}`);
        });
      }
    }
    nova();
  }

  function abaRegras(box, irParaExercicios) {
    const porCat = {};
    NORMA.regras.forEach(r => (porCat[r.cat] = porCat[r.cat] || []).push(r));
    box.innerHTML = Object.entries(porCat).map(([c, rs]) => `<div class="card" style="margin-bottom:12px">
        <h3>${esc(NORMA.categorias[c])}</h3>
        ${rs.map(r => `<div class="regra"><b>${esc(r.titulo)}:</b> ${esc(r.texto)}</div>`).join("")}
      </div>`).join("") + `<button class="btn btn-primary" id="ir-ex">🧩 Treinar com exercícios</button>`;
    box.querySelector("#ir-ex").onclick = irParaExercicios;
  }

  // ---------- Modelos prontos e dicas ----------
  function renderModelos() {
    const M = R.modelos;
    const marca = s => esc(s).replace(/\[([^\]]+)\]/g, '<span class="lacuna">[$1]</span>');
    const bloco = (titulo, texto) => `<div class="card modelo">
        <h3>${esc(titulo)}</h3><p>${marca(texto)}</p>
        <button class="btn btn-ghost small copiar" data-txt="${esc(texto)}">📋 Copiar</button></div>`;
    view.innerHTML = `
      <button class="btn btn-ghost small" onclick="location.hash='#/redacao'">← Redação</button>
      <div class="section-title" style="margin-top:12px">📐 Modelos prontos e dicas</div>
      <div class="bloco-especial bloco-atencao"><b>⚠️ Como usar</b>${esc(M.aviso)}</div>

      <div class="section-title" style="font-size:1.05rem">1️⃣ Introdução — escolha um modelo</div>
      ${M.introducoes.map(m => bloco(m.nome, m.texto)).join("")}
      <div class="section-title" style="font-size:1.05rem">2️⃣ Desenvolvimento 1</div>
      ${bloco("Argumento 1", M.desenvolvimento1)}
      <div class="section-title" style="font-size:1.05rem">3️⃣ Desenvolvimento 2</div>
      ${bloco("Argumento 2", M.desenvolvimento2)}
      <div class="section-title" style="font-size:1.05rem">4️⃣ Conclusão</div>
      ${M.conclusoes.map(m => bloco(m.nome, m.texto)).join("")}

      <div class="section-title" style="font-size:1.05rem">📄 Redação-modelo comentada</div>
      <div class="card">
        <p class="muted small"><b>Tema:</b> ${esc(M.exemplo.tema)} · 4 parágrafos de ~7 linhas</p>
        ${M.exemplo.paragrafos.map((p, i) => `<p class="par-modelo"><span class="num-par">§${i + 1}</span>${esc(p)}</p>`).join("")}
        <h3>🔎 Por que funciona</h3>
        <ul class="lista">${M.exemplo.anotacoes.map(a => `<li>${esc(a)}</li>`).join("")}</ul>
      </div>

      <div class="section-title" style="font-size:1.05rem" id="conectivos">🔗 Como usar os conectivos (C4)</div>
      <div class="card">
        <h3>📏 Regras de ouro</h3>
        <ol class="lista">${R.regrasConectivos.map(r => `<li>${esc(r)}</li>`).join("")}</ol>
      </div>
      ${R.conectivos.map(g => `<details class="acordeao"><summary>${esc(g.funcao)} <span class="muted small">(${g.itens.length})</span></summary>
        <div class="corpo">${g.itens.map(it => `<div class="conectivo">
          <div class="conectivo-topo"><span class="conectivo-c">${esc(it.c)}</span><span class="chip cinza">${esc(it.sentido)}</span></div>
          <div class="voc-ex small">“${esc(it.ex)}”</div>
          <div class="small conectivo-cuidado">⚠️ ${esc(it.cuidado)}</div>
        </div>`).join("")}</div>
      </details>`).join("")}

      <div class="section-title" style="font-size:1.05rem">🎯 Repertório pertinente (C2)</div>
      ${blocoPertinencia()}

      <div class="section-title" style="font-size:1.05rem">💡 Dicas de prova</div>
      <div class="grid cols-2">${R.dicas.map(d => `<div class="card"><h3>${esc(d.titulo)}</h3><p class="small">${esc(d.texto)}</p></div>`).join("")}</div>`;
    view.querySelectorAll(".copiar").forEach(b => b.onclick = () => {
      const txt = b.dataset.txt;
      const ok = () => toast("Modelo copiado! 📋");
      try { navigator.clipboard.writeText(txt).then(ok, () => toast("Não foi possível copiar — selecione o texto.")); }
      catch (e) { toast("Não foi possível copiar — selecione o texto."); }
    });
  }

  // ---------- Dicionário de vocabulário formal ----------
  function renderVocabulario() {
    const V = window.ENEM_VOCABULARIO;
    let cat = "todos", busca = "";
    const semAcento = x => x.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    view.innerHTML = `
      <button class="btn btn-ghost small" onclick="location.hash='#/redacao'">← Redação</button>
      <div class="section-title" style="margin-top:12px">📖 Dicionário de vocabulário formal <small id="voc-cont"></small></div>
      <div class="bloco-especial bloco-dica"><b>💡 Como usar</b>${esc(V.aviso)}</div>
      <input type="search" id="voc-busca" class="input-busca" placeholder="Buscar palavra ou significado (ex.: diminuir, urgente)…" autocomplete="off">
      <div class="filtros"><div class="filtro-grupo">
        ${[["todos", "Todas"]].concat(Object.entries(V.categorias)).map(([k, l]) => `<button class="filtro ${k === "todos" ? "ativo" : ""}" data-vc="${k}">${esc(l)}</button>`).join("")}
      </div></div>
      <div class="grid cols-2" id="voc-lista"></div>`;
    const desenhar = () => {
      const b = semAcento(busca.trim());
      const lista = V.palavras.filter(w => (cat === "todos" || w.cat === cat) &&
        (!b || semAcento(w.p + " " + w.sig + " " + (w.troca || "")).includes(b)));
      view.querySelector("#voc-cont").textContent = `${lista.length} de ${V.palavras.length}`;
      view.querySelector("#voc-lista").innerHTML = lista.map(w => `<div class="card voc-card">
          <div class="voc-topo"><span class="voc-palavra">${esc(w.p)}</span>
            <span class="chip cinza">${esc(V.categorias[w.cat])}</span>${w.moderacao ? ` <span class="chip amarelo">⚠️ use com moderação</span>` : ""}</div>
          <p class="small"><b>Significa:</b> ${esc(w.sig)}</p>
          ${w.troca && w.cat !== "troca" && w.cat !== "paronimo" ? `<p class="small muted"><b>Em vez de:</b> ${esc(w.troca)}</p>` : ""}
          <p class="small voc-ex">“${esc(w.ex)}”</p>
        </div>`).join("") || `<p class="muted">Nada encontrado.</p>`;
    };
    view.querySelector("#voc-busca").oninput = ev => { busca = ev.target.value; desenhar(); };
    view.querySelectorAll("[data-vc]").forEach(b => b.onclick = () => {
      cat = b.dataset.vc; view.querySelectorAll("[data-vc]").forEach(x => x.classList.toggle("ativo", x === b)); desenhar();
    });
    desenhar();
  }

  // ---------- Carrossel de repertório ----------
  let carrosselTimer = null;
  function pararCarrossel() { if (carrosselTimer) { clearInterval(carrosselTimer); carrosselTimer = null; } }
  function montarCarrossel(elId) {
    const el = document.getElementById(elId);
    if (!el) return;
    let cat = "todos", idx = 0, lista = [], pausado = false;
    el.innerHTML = `<div class="carrossel">
      <div class="filtros"><div class="filtro-grupo">
        ${[["todos", "Todos"]].concat(Object.entries(REP.categorias).map(([k, v]) => [k, v.emoji + " " + v.rotulo]))
        .map(([k, l]) => `<button class="filtro ${k === "todos" ? "ativo" : ""}" data-rc="${k}">${l}</button>`).join("")}
      </div></div>
      <div class="card rep-card" aria-live="polite"></div>
      <div class="rep-ctrl">
        <button class="btn btn-ghost small" data-mv="-1">← Anterior</button>
        <span class="muted small rep-pos"></span>
        <button class="btn btn-ghost small" data-pausa>⏸️ Pausar</button>
        <button class="btn btn-ghost small" data-mv="1">Próximo →</button>
      </div></div>`;
    const filtrar = () => { lista = embaralhar(REP.cards.filter(c => cat === "todos" || c.cat === cat)); idx = 0; };
    const desenhar = () => {
      const c = lista[idx], m = REP.categorias[c.cat];
      el.querySelector(".rep-card").innerHTML = `
        <div class="rep-cat">${m.emoji} ${m.rotulo}</div>
        <div class="rep-titulo">${esc(c.titulo)}</div>
        <div class="rep-texto">${esc(c.texto)}</div>
        <div class="rep-fonte">${esc(c.fonte)}</div>
        <div class="rep-uso"><b>Use em:</b> ${esc(c.uso)}</div>`;
      el.querySelector(".rep-pos").textContent = `${idx + 1}/${lista.length}`;
    };
    const avancar = d => { idx = (idx + d + lista.length) % lista.length; desenhar(); };
    const iniciar = () => { pararCarrossel(); if (!pausado) carrosselTimer = setInterval(() => avancar(1), 8000); };
    el.querySelectorAll("[data-mv]").forEach(b => b.onclick = () => { avancar(+b.dataset.mv); iniciar(); });
    el.querySelector("[data-pausa]").onclick = ev => {
      pausado = !pausado; ev.currentTarget.textContent = pausado ? "▶️ Continuar" : "⏸️ Pausar"; iniciar();
    };
    el.querySelectorAll("[data-rc]").forEach(b => b.onclick = () => {
      cat = b.dataset.rc; el.querySelectorAll("[data-rc]").forEach(x => x.classList.toggle("ativo", x === b));
      filtrar(); desenhar(); iniciar();
    });
    filtrar(); desenhar(); iniciar();
  }

  // ---------- Intensivão (reta final) ----------
  function renderIntensivao() {
    const s = Store.get();
    const fracos = Engine.statsPorTopico().filter(t => t.total >= 2 && t.pct < 70).sort((a, b) => a.pct - b.pct).slice(0, 6);
    const nErros = Object.values(s.respostasQuestoes || {}).filter(r => !r.acertou).length;
    const porArea = {};
    Q.forEach(q => { porArea[q.area] = porArea[q.area] || {}; porArea[q.area][q.topico] = (porArea[q.area][q.topico] || 0) + 1; });
    const areasLista = C.areas.filter(a => a.id !== "redacao");
    const quick = (emoji, titulo, desc, acao) => `<button class="card clickable quick" data-acao="${acao}">
        <div class="quick-emoji">${emoji}</div><b>${esc(titulo)}</b><span class="muted small">${esc(desc)}</span></button>`;
    const temasTop = T.temas.filter(t => t.probabilidade === "quase-certo");

    view.innerHTML = `
      <div class="card intensivao-hero">
        <div style="font-size:2.4rem">⚡</div>
        <div>
          <h2 style="margin:0">Intensivão — reta final</h2>
          <p class="muted small">Sem rotina, sem enrolação: escolha e comece. Tudo liberado — ${Q.length} questões, ${T.temas.length} temas de redação e ${NORMA.exercicios.length} exercícios de norma.</p>
        </div>
      </div>

      <div class="section-title">🚀 Comece agora <small>1 clique</small></div>
      <div class="grid cols-4">
        ${quick("🎲", "10 questões mistas", "todas as áreas", "mix10")}
        ${quick("⏱️", "Simulado de 20", "cronometrado, 3 min/questão", "sim20")}
        ${quick("🔁", "Refazer meus erros", nErros ? `${nErros} questão(ões) errada(s)` : "nenhum erro ainda", "erros")}
        ${quick("📘", "Só questões ENEM", "10 questões estilo oficial", "enem10")}
        ${quick("🔥", "O que mais cai", "10 questões de alta incidência", "alta10")}
        ${areasLista.map(a => quick(a.emoji, a.nome, "10 questões da área", "area:" + a.id)).join("")}
      </div>

      <div class="section-title">🧪 Aprenda com exemplos resolvidos <small>situação → conceito → passo a passo → pegadinha</small></div>
      <div class="grid cols-4">
        ${Object.keys(EX).filter(k => C.materias[k]).map(k => atalho(C.materias[k].emoji, C.materias[k].nome, `${EX[k].length} exemplos resolvidos`, "#/exemplos/" + k)).join("")}
      </div>

      <div class="section-title">🔧 Reforce seus pontos fracos</div>
      ${fracos.length ? `<div class="grid cols-2">${fracos.map(t => `<button class="card clickable reforco" data-topico="${esc(t.topico)}">
          <div style="display:flex;justify-content:space-between;gap:8px;align-items:center">
            <b>${esc(t.topico)}</b><span class="chip ${t.pct < 40 ? "vermelho" : "amarelo"}">${t.pct}% de acerto</span>
          </div>
          <div class="muted small">${esc(Engine.AREA_NOME[t.area] || t.area)} · ${t.certos}/${t.total} · treinar 10 questões (seus erros primeiro)</div>
        </button>`).join("")}</div>`
        : `<div class="card"><p class="muted">Ainda não sei seus pontos fracos. Faça as <b>10 questões mistas</b> acima e o reforço aparece aqui automaticamente.</p></div>`}

      <div class="section-title">🎯 Escolha o tópico <small>🔥 cai muito · 🧊 cai pouco — priorize os 🔥</small></div>
      ${areasLista.map(a => `<details class="acordeao"><summary>${a.emoji} ${esc(a.nome)} <span class="muted small">(${Object.keys(porArea[a.id] || {}).length} tópicos)</span></summary>
        <div class="corpo topicos">${Object.entries(porArea[a.id] || {}).sort((x, y) => y[1] - x[1])
          .map(([tp, n]) => `<button class="filtro topico-btn" data-topico="${esc(tp)}">${INC_TOP[tp] === "alta" ? "🔥 " : INC_TOP[tp] === "baixa" ? "🧊 " : ""}${esc(tp)} <span class="muted">(${n})</span></button>`).join("")}</div>
      </details>`).join("")}

      <div class="section-title">📝 Redação</div>
      <div class="card">
        <h3>🔥 Temas "quase certos"</h3>
        ${temasTop.map(t => `<a class="link-item" href="#/temas/${t.id}"><b>${esc(t.titulo)}</b><div class="small muted">${esc(t.porque)}</div></a>`).join("")}
      </div>
      <div class="grid cols-4" style="margin-top:12px">
        ${atalho("🎯", "Todos os temas", `${T.temas.length} folhas de estudo`, "#/temas")}
        ${atalho("✍️", "Escrever e verificar", "sem corretor", "#/treino")}
        ${atalho("🧩", "Exercícios de norma", "acento, crase…", "#/treino/exercicios")}
        ${atalho("📐", "Modelos prontos", "esqueletos + exemplo", "#/modelos")}
      </div>
      <div style="margin-top:12px">${atalho("📖", "Vocabulário formal", "palavras para elevar a C1", "#/vocabulario")}</div>

      <div class="section-title" style="font-size:1.1rem">💡 Repertório rápido</div>
      <div id="carrossel"></div>

      <div class="section-title">🧠 Revisão relâmpago <small>mnemônicos e dicas de ouro</small></div>
      ${Object.entries(C.materias).map(([mid, m]) => `<details class="acordeao"><summary>${m.emoji} ${esc(m.nome)}</summary>
        <div class="corpo">${m.licoes.map(l => `<div class="revisao-item"><b>${esc(l.titulo)}</b>
          ${l.mnemonico ? `<div class="small">🧠 ${esc(l.mnemonico)}</div>` : ""}
          ${l.dica ? `<div class="small">✅ ${esc(l.dica)}</div>` : ""}</div>`).join("")}
          <a href="#/trilhas/${mid}" class="small">ver lições completas →</a></div>
      </details>`).join("")}

      <div class="section-title">🎒 Checklist da véspera</div>
      <div class="card"><ul class="lista">
        <li>Documento oficial com foto, original (documentos digitais só nos formatos aceitos pelo edital).</li>
        <li>Caneta esferográfica de tinta <b>preta</b>, fabricada em material transparente.</li>
        <li>Cartão de Confirmação da Inscrição: confira local, sala e horário.</li>
        <li>Nas últimas edições, os portões abriram às 12h e fecharam às 13h (horário de Brasília), com início às 13h30 — <b>confirme no seu cartão</b>.</li>
        <li>1º dia: Linguagens, Humanas e Redação (5h30). 2º dia: Natureza e Matemática (5h).</li>
        <li>Na véspera: revise só mnemônicos e modelos, durma bem e separe água e lanche.</li>
      </ul></div>`;

    view.querySelectorAll("[data-acao]").forEach(b => b.onclick = () => acaoRapida(b.dataset.acao));
    view.querySelectorAll(".reforco, .topico-btn").forEach(b => b.onclick = () =>
      iniciarSimulado({ topicos: [b.dataset.topico], qtd: 10, priorizarErros: true }));
    montarCarrossel("carrossel");
  }

  function acaoRapida(a) {
    if (a === "mix10") iniciarSimulado({ qtd: 10 });
    else if (a === "sim20") iniciarSimulado({ qtd: 20, comTempo: true, comExplica: false });
    else if (a === "enem10") iniciarSimulado({ qtd: 10, fontes: ["enem"] });
    else if (a === "alta10") iniciarSimulado({ qtd: 10, incidencia: ["alta"] });
    else if (a === "erros") {
      const rq = Store.get().respostasQuestoes || {};
      const ids = Object.keys(rq).filter(k => !rq[k].acertou);
      if (!ids.length) { toast("Você ainda não errou nenhuma questão 🎉"); return; }
      iniciarSimulado({ ids, qtd: 20 });
    }
    else if (a.indexOf("area:") === 0) iniciarSimulado({ areas: [a.slice(5)], qtd: 10 });
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
