(() => {
  const fsToggle = document.getElementById("fsToggle");
  const shell = document.querySelector(".demo-shell");
  if (fsToggle && shell) {
    fsToggle.addEventListener("click", () => {
      shell.classList.toggle("fullscreen");
      fsToggle.textContent = shell.classList.contains("fullscreen") ? "Sair tela cheia" : "Tela cheia";
    });
  }

  const LOG_KEY = "recati_demo_aen_logs";
  const menu = document.getElementById("menu");
  const content = document.getElementById("content");
  const views = [
    ["espelho", "Espelho do Site"],
    ["institucional", "Institucional"],
    ["servicos", "Serviços"],
    ["cases", "Cases"],
    ["painel", "Painel"],
  ];

  const state = {
    view: "espelho",
    logs: JSON.parse(localStorage.getItem(LOG_KEY) || "[]"),
  };

  if (!state.logs.length) {
    state.logs = [
      { data: new Date().toISOString(), evento: "Sincronização de dados finalizada", modulo: "ERP" },
      { data: new Date().toISOString(), evento: "Relatório semanal gerado", modulo: "BI" },
    ];
  }

  function persist() {
    localStorage.setItem(LOG_KEY, JSON.stringify(state.logs));
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

  function renderEspelho() {
    content.innerHTML = `
      <h2>Espelho do Site AEN Systems</h2>
      <p class="small">Visualização integrada do site oficial dentro da RECATI.</p>
      <div class="panel mirror-wrap">
        <iframe
          class="site-mirror"
          title="AEN Systems"
          src="https://www.aensystems.com.br"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <p class="small">Se o navegador bloquear o espelho por segurança (X-Frame-Options/CSP), use o botão abaixo.</p>
      <a class="btn mirror-link" target="_blank" rel="noreferrer" href="https://www.aensystems.com.br">Abrir AEN Systems em nova aba</a>
    `;
  }

  function renderInstitucional() {
    content.innerHTML = `
      <h2>Institucional</h2>
      <p class="small">Posicionamento técnico com foco em automação, integração e eficiência operacional.</p>
      <div class="grid-2">
        <div class="panel"><strong>Missão</strong><p class="small">Transformar processos em resultados.</p></div>
        <div class="panel"><strong>Visão</strong><p class="small">Tecnologia aplicada ao crescimento real.</p></div>
      </div>
    `;
  }

  function renderServicos() {
    content.innerHTML = `
      <h2>Serviços</h2>
      <ul>
        <li>Apps web sob medida</li>
        <li>Integrações entre sistemas</li>
        <li>Automações com notificações inteligentes</li>
      </ul>
    `;
  }

  function renderCases() {
    content.innerHTML = `
      <h2>Cases</h2>
      <div class="grid-2">
        <div class="panel"><strong>Case 1</strong><p class="small">Redução de retrabalho em 40%.</p></div>
        <div class="panel"><strong>Case 2</strong><p class="small">Aumento de produtividade de atendimento.</p></div>
      </div>
    `;
  }

  function renderPainel() {
    const totalLogs = state.logs.length;
    content.innerHTML = `
      <h2>Painel</h2>
      <div class="grid-2">
        <div class="panel"><strong>Automações ativas</strong><p>${Math.max(3, totalLogs)}</p></div>
        <div class="panel"><strong>Eventos registrados</strong><p>${totalLogs}</p></div>
      </div>
      <div class="actions">
        <button id="newLog" class="btn" type="button">Gerar log</button>
        <button id="exportCsv" class="btn ghost" type="button">Exportar relatório (CSV)</button>
      </div>
      <div class="panel" style="margin-top:10px;">
        <table>
          <thead><tr><th>Data</th><th>Módulo</th><th>Evento</th></tr></thead>
          <tbody id="logRows"></tbody>
        </table>
      </div>
    `;

    const rows = document.getElementById("logRows");
    rows.innerHTML = state.logs
      .slice()
      .reverse()
      .map((log) => `<tr><td>${new Date(log.data).toLocaleString("pt-BR")}</td><td>${log.modulo}</td><td>${log.evento}</td></tr>`)
      .join("");

    document.getElementById("newLog").addEventListener("click", () => {
      const events = ["Webhook processado", "Lead sincronizado", "Relatório diário enviado", "Integração conciliada"];
      const modules = ["ERP", "CRM", "BI", "Financeiro"];
      state.logs.push({
        data: new Date().toISOString(),
        evento: events[Math.floor(Math.random() * events.length)],
        modulo: modules[Math.floor(Math.random() * modules.length)],
      });
      persist();
      renderPainel();
    });

    document.getElementById("exportCsv").addEventListener("click", () => {
      const header = ["data", "modulo", "evento"];
      const lines = [header.join(",")].concat(
        state.logs.map((log) =>
          [log.data, log.modulo, log.evento]
            .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
            .join(",")
        )
      );
      const csv = lines.join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "relatorio-aen.csv";
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  function render() {
    renderMenu();
    if (state.view === "espelho") renderEspelho();
    if (state.view === "institucional") renderInstitucional();
    if (state.view === "servicos") renderServicos();
    if (state.view === "cases") renderCases();
    if (state.view === "painel") renderPainel();
  }

  persist();
  render();
})();
