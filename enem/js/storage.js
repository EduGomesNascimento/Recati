/* ============================================================
   STORAGE — persistência 100% local (localStorage).
   Guarda nome, progresso, histórico de simulados, redações,
   lições concluídas, preferências e conquistas.
   ============================================================ */
window.Store = (function () {
  const KEY = "rumo_enem_v1";

  const inicial = () => ({
    nome: null,
    avatar: "🚀",            // emoji escolhido pelo usuário
    objetivo: null,          // curso/meta do usuário
    estiloAprendizado: null, // visual/auditivo/etc
    criadoEm: Date.now(),
    ultimoAcesso: Date.now(),
    licoesConcluidas: [],    // ids de lições
    simulados: [],           // {id, data, area, config, questoes[], respostas[], acertos, total, tempo}
    redacoes: [],            // {id, data, tema, texto, notas{c1..c5}, total}
    respostasQuestoes: {},   // qId -> {acertou:bool, tentativas:n, ultima:ts}
    conquistas: [],          // ids de badges
    streak: { dias: 0, ultimoDia: null },
    metaDiaria: 20,          // questões/dia
    metaSemanal: 100,        // questões/semana
    streakRecord: 0,         // maior sequência de dias já atingida
    nivelVisto: 1,           // último nível de XP já celebrado
    diario: {}               // "YYYY-MM-DD" -> nº de questões respondidas no dia
  });

  let cache = null;

  function load() {
    if (cache) return cache;
    try {
      const raw = localStorage.getItem(KEY);
      cache = raw ? Object.assign(inicial(), JSON.parse(raw)) : inicial();
    } catch (e) {
      cache = inicial();
    }
    return cache;
  }

  function save() {
    if (!cache) return;
    cache.ultimoAcesso = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(cache)); }
    catch (e) { console.warn("Falha ao salvar:", e); }
  }

  function get() { return load(); }

  function set(patch) {
    load();
    Object.assign(cache, patch);
    save();
    return cache;
  }

  function reset() {
    cache = inicial();
    save();
  }

  // ---- helpers de progresso ----
  function marcarLicao(id) {
    load();
    if (!cache.licoesConcluidas.includes(id)) {
      cache.licoesConcluidas.push(id);
      save();
    }
  }

  function registrarSimulado(sim) {
    load();
    cache.simulados.push(sim);
    // atualiza mapa de questões
    sim.questoes.forEach((q, i) => {
      const r = cache.respostasQuestoes[q.id] || { acertou: false, tentativas: 0, ultima: 0 };
      r.tentativas += 1;
      r.acertou = sim.respostas[i] === q.correta;
      r.ultima = sim.data;
      cache.respostasQuestoes[q.id] = r;
    });
    // contagem diária de questões respondidas (para a meta do dia)
    const hojeKey = new Date(sim.data).toISOString().slice(0, 10);
    cache.diario[hojeKey] = (cache.diario[hojeKey] || 0) + (sim.total || 0);
    registrarStreak();
    save();
  }

  function registrarRedacao(red) {
    load();
    cache.redacoes.push(red);
    save();
  }

  function registrarStreak() {
    load();
    const hoje = new Date().toDateString();
    const ontem = new Date(Date.now() - 864e5).toDateString();
    if (cache.streak.ultimoDia === hoje) return;
    if (cache.streak.ultimoDia === ontem) cache.streak.dias += 1;
    else cache.streak.dias = 1;
    cache.streak.ultimoDia = hoje;
    if ((cache.streak.dias || 0) > (cache.streakRecord || 0)) cache.streakRecord = cache.streak.dias;
  }

  function adicionarConquista(id) {
    load();
    if (!cache.conquistas.includes(id)) {
      cache.conquistas.push(id);
      save();
      return true; // nova
    }
    return false;
  }

  return { get, set, reset, marcarLicao, registrarSimulado, registrarRedacao, adicionarConquista, save };
})();
