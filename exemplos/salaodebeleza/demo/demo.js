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

  let state = {
    view: "home",
    appointments: JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"),
  };

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.appointments));
  }

  function setView(view) {
    state.view = view;
    render();
  }

  function removeAppointment(id) {
    state.appointments = state.appointments.filter((a) => a.id !== id);
    persist();
    renderAgenda();
  }

  function renderMenu() {
    menu.innerHTML = views
      .map((v) => `<button class="${state.view === v.id ? "active" : ""}" data-view="${v.id}">${v.label}</button>`)
      .join("");

    menu.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => setView(btn.dataset.view));
    });
  }

  function renderHome() {
    content.innerHTML = `
      <h2>Bem-vindo ao salão</h2>
      <p class="small">Exemplo de site funcional com agenda e contato direto.</p>
      <div class="grid-2">
        <div class="panel"><strong>Atendimento</strong><p class="small">Terça a sábado, 9h às 19h.</p></div>
        <div class="panel"><strong>Equipe</strong><p class="small">Profissionais por especialidade.</p></div>
      </div>
    `;
  }

  function renderServicos() {
    content.innerHTML = `
      <h2>Serviços</h2>
      <ul>
        <li>Corte feminino/masculino</li>
        <li>Escova e finalização</li>
        <li>Coloração</li>
        <li>Tratamentos capilares</li>
      </ul>
    `;
  }

  function renderAgenda() {
    content.innerHTML = `
      <h2>Agenda</h2>
      <form id="appointmentForm" class="panel">
        <label>Nome<input name="nome" required /></label>
        <label>Serviço
          <select name="servico" required>
            <option value="">Selecione</option>
            <option>Corte</option>
            <option>Escova</option>
            <option>Coloração</option>
          </select>
        </label>
        <label>Data e hora<input name="datahora" type="datetime-local" required /></label>
        <button class="btn" type="submit">Criar agendamento</button>
      </form>
      <div class="panel" style="margin-top:10px;">
        <table>
          <thead><tr><th>Nome</th><th>Serviço</th><th>Data/Hora</th><th>Ação</th></tr></thead>
          <tbody id="appointmentsBody"></tbody>
        </table>
      </div>
    `;

    const form = document.getElementById("appointmentForm");
    const body = document.getElementById("appointmentsBody");

    body.innerHTML = state.appointments
      .map((a) => `<tr><td>${a.nome}</td><td>${a.servico}</td><td>${a.datahora}</td><td><button class="btn ghost" data-id="${a.id}">Remover</button></td></tr>`)
      .join("");

    body.querySelectorAll("button[data-id]").forEach((btn) => {
      btn.addEventListener("click", () => removeAppointment(btn.dataset.id));
    });

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);
      state.appointments.push({
        id: crypto.randomUUID(),
        nome: fd.get("nome"),
        servico: fd.get("servico"),
        datahora: fd.get("datahora"),
      });
      persist();
      renderAgenda();
    });
  }

  function renderContato() {
    const msg = encodeURIComponent("Olá! Vi o demo do salão e quero um sistema parecido.");
    content.innerHTML = `
      <h2>Contato</h2>
      <p class="small">Fale agora no WhatsApp.</p>
      <a class="btn" target="_blank" rel="noreferrer" href="https://wa.me/5551997950492?text=${msg}">Chamar no WhatsApp</a>
    `;
  }

  function render() {
    renderMenu();
    if (state.view === "home") renderHome();
    if (state.view === "servicos") renderServicos();
    if (state.view === "agenda") renderAgenda();
    if (state.view === "contato") renderContato();
  }

  render();
})();


