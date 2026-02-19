(() => {
  const fsToggle = document.getElementById("fsToggle");
  const shell = document.querySelector(".demo-shell");
  if (fsToggle && shell) {
    fsToggle.addEventListener("click", () => {
      shell.classList.toggle("fullscreen");
      fsToggle.textContent = shell.classList.contains("fullscreen") ? "Sair tela cheia" : "Tela cheia";
    });
  }

  const STORAGE_KEY = "recati_demo_salao_agenda";
  const menu = document.getElementById("menu");
  const content = document.getElementById("content");

  const views = [
    { id: "home", label: "Home" },
    { id: "servicos", label: "Serviços" },
    { id: "agenda", label: "Agenda" },
    { id: "contato", label: "Contato" },
  ];

  const seedAppointments = [
    {
      id: crypto.randomUUID(),
      nome: "Camila Rocha",
      servico: "Coloração Rosé",
      profissional: "Júlia",
      datahora: "2026-02-24T14:30",
      telefone: "(51) 99999-1111",
    },
    {
      id: crypto.randomUUID(),
      nome: "Mariana Luz",
      servico: "Escova Premium",
      profissional: "Renata",
      datahora: "2026-02-25T10:00",
      telefone: "(51) 98888-2222",
    },
  ];

  const state = {
    view: "home",
    appointments: JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || seedAppointments,
  };

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.appointments));
  }

  function setView(viewId) {
    state.view = viewId;
    render();
  }

  function formatDateTime(value) {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function renderMenu() {
    menu.innerHTML = views
      .map((view) => `<button class="${state.view === view.id ? "active" : ""}" data-view="${view.id}">${view.label}</button>`)
      .join("");

    menu.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => setView(button.dataset.view));
    });
  }

  function renderHome() {
    content.innerHTML = `
      <div class="view">
        <section class="hero-grid">
          <div class="panel">
            <h2 class="hero-title">Beleza com experiência premium e agenda inteligente.</h2>
            <p class="small">Um exemplo real de salão com foco em conversão, atendimento humanizado e organização completa da rotina.</p>
            <div class="actions">
              <button class="btn" type="button" id="goAgenda">Agendar horário</button>
              <button class="btn secondary" type="button" id="goContato">Falar com o salão</button>
            </div>
            <div class="stats">
              <div class="stat-box"><strong>+1.200</strong><span class="small">Atendimentos/ano</span></div>
              <div class="stat-box"><strong>98%</strong><span class="small">Satisfação de clientes</span></div>
              <div class="stat-box"><strong>4 min</strong><span class="small">Tempo médio de resposta</span></div>
            </div>
          </div>
          <div class="panel">
            <h3 class="gold">Destaques do Studio</h3>
            <ul>
              <li>Especialistas em corte, coloração e finalização.</li>
              <li>Confirmação de horários via WhatsApp.</li>
              <li>Fluxo visual e intuitivo para equipe e cliente.</li>
              <li>Layout elegante em rosa, branco, dourado e rose gold.</li>
            </ul>
          </div>
        </section>
      </div>
    `;

    const goAgenda = document.getElementById("goAgenda");
    const goContato = document.getElementById("goContato");
    if (goAgenda) goAgenda.addEventListener("click", () => setView("agenda"));
    if (goContato) goContato.addEventListener("click", () => setView("contato"));
  }

  function renderServicos() {
    const cards = [
      { titulo: "Corte & Finalização", desc: "Corte feminino/masculino com escova e finalização personalizada.", preco: "a partir de R$ 95" },
      { titulo: "Coloração Rosé", desc: "Técnicas de cor com análise de fio, contraste e manutenção programada.", preco: "a partir de R$ 210" },
      { titulo: "Tratamento Gold Repair", desc: "Reconstrução profunda e brilho imediato com ativos premium.", preco: "a partir de R$ 180" },
      { titulo: "Noiva & Eventos", desc: "Pacote completo para penteado e maquiagem com prova antecipada.", preco: "sob consulta" },
    ];

    content.innerHTML = `
      <div class="view">
        <h2>Serviços em destaque</h2>
        <p class="small">Serviços pensados para fidelizar clientes e elevar o ticket com experiência premium.</p>
        <div class="grid-2">
          ${cards
            .map(
              (card) => `
                <article class="service-card">
                  <h3>${card.titulo}</h3>
                  <p class="small">${card.desc}</p>
                  <span class="service-price">${card.preco}</span>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function removeAppointment(id) {
    state.appointments = state.appointments.filter((appointment) => appointment.id !== id);
    persist();
    renderAgenda();
  }

  function renderAgenda() {
    const sortedAppointments = [...state.appointments].sort((a, b) => String(a.datahora).localeCompare(String(b.datahora)));

    content.innerHTML = `
      <div class="view">
        <h2>Agenda inteligente</h2>
        <p class="small">Cadastre horários, acompanhe atendimentos e mantenha o salão sempre organizado.</p>

        <form id="appointmentForm" class="panel">
          <div class="grid-2">
            <label>Nome da cliente
              <input name="nome" required placeholder="Ex: Ana Martins" />
            </label>
            <label>Telefone
              <input name="telefone" required placeholder="(51) 99999-0000" />
            </label>
          </div>
          <div class="grid-2">
            <label>Serviço
              <select name="servico" required>
                <option value="">Selecione</option>
                <option>Corte & Finalização</option>
                <option>Coloração Rosé</option>
                <option>Escova Premium</option>
                <option>Tratamento Gold Repair</option>
                <option>Noiva & Eventos</option>
              </select>
            </label>
            <label>Profissional
              <select name="profissional" required>
                <option value="">Selecione</option>
                <option>Júlia</option>
                <option>Renata</option>
                <option>Bruna</option>
              </select>
            </label>
          </div>
          <label>Data e hora
            <input name="datahora" type="datetime-local" required />
          </label>
          <div class="actions">
            <button class="btn" type="submit">Criar agendamento</button>
          </div>
        </form>

        <div class="panel" style="margin-top:10px;">
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Serviço</th>
                <th>Profissional</th>
                <th>Data/Hora</th>
                <th>Contato</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody id="appointmentsBody"></tbody>
          </table>
        </div>
      </div>
    `;

    const form = document.getElementById("appointmentForm");
    const body = document.getElementById("appointmentsBody");

    body.innerHTML = sortedAppointments.length
      ? sortedAppointments
          .map(
            (appointment) => `
              <tr>
                <td>${appointment.nome}</td>
                <td>${appointment.servico}</td>
                <td>${appointment.profissional}</td>
                <td>${formatDateTime(appointment.datahora)}</td>
                <td>${appointment.telefone}</td>
                <td><button class="remove-btn" type="button" data-id="${appointment.id}">Remover</button></td>
              </tr>
            `
          )
          .join("")
      : `<tr><td colspan="6" class="small">Nenhum agendamento cadastrado.</td></tr>`;

    body.querySelectorAll("button[data-id]").forEach((button) => {
      button.addEventListener("click", () => removeAppointment(button.dataset.id));
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      state.appointments.push({
        id: crypto.randomUUID(),
        nome: String(data.get("nome") || "").trim(),
        telefone: String(data.get("telefone") || "").trim(),
        servico: String(data.get("servico") || "").trim(),
        profissional: String(data.get("profissional") || "").trim(),
        datahora: String(data.get("datahora") || "").trim(),
      });
      persist();
      renderAgenda();
    });
  }

  function renderContato() {
    const whatsMsg = encodeURIComponent("Olá! Vi o demo do Studio Rosé no site da RECATI e quero um sistema assim para meu salão.");
    const emailSubject = encodeURIComponent("Quero um site para salão com agenda");
    const emailBody = encodeURIComponent(
      "Olá, equipe RECATI!\n\nVi o demo do salão e quero uma proposta para criar meu site com agenda online, WhatsApp e área de serviços.\n\nNome:\nCidade:\nObjetivo do projeto:\nPrazo estimado:\n"
    );

    content.innerHTML = `
      <div class="view">
        <h2>Contato que converte</h2>
        <p class="small">Canais prontos para receber leads com mensagem já direcionada para fechamento.</p>

        <div class="contact-grid">
          <article class="link-box">
            <strong>WhatsApp direto</strong>
            <span class="small">Atendimento rápido para orçamento e implantação.</span>
            <a class="btn" target="_blank" rel="noreferrer" href="https://wa.me/5551997950492?text=${whatsMsg}">Falar no WhatsApp</a>
          </article>

          <article class="link-box">
            <strong>E-mail profissional</strong>
            <span class="small">Assunto e mensagem já preenchidos para facilitar.</span>
            <a class="btn" href="mailto:recati.com@gmail.com?subject=${emailSubject}&body=${emailBody}">Enviar e-mail</a>
          </article>

          <article class="link-box">
            <strong>Instagram (temporário)</strong>
            <span class="small">Até o perfil oficial da RECATI ficar pronto.</span>
            <a class="btn" target="_blank" rel="noreferrer" href="https://www.instagram.com/">Abrir Instagram</a>
          </article>

          <article class="link-box">
            <strong>Próximo passo</strong>
            <span class="small">Se quiser, a RECATI já entrega esse template personalizado para sua marca.</span>
            <button class="btn" type="button" id="goAgendaFromContact">Quero agendar uma demonstração</button>
          </article>
        </div>

        <div class="contact-note">
          Dica comercial: combine este fluxo com confirmação automática de horário e lembrete em WhatsApp para reduzir faltas e aumentar retorno.
        </div>
      </div>
    `;

    const goAgenda = document.getElementById("goAgendaFromContact");
    if (goAgenda) {
      goAgenda.addEventListener("click", () => setView("agenda"));
    }
  }

  function render() {
    renderMenu();
    if (state.view === "home") renderHome();
    if (state.view === "servicos") renderServicos();
    if (state.view === "agenda") renderAgenda();
    if (state.view === "contato") renderContato();
  }

  persist();
  render();
})();
