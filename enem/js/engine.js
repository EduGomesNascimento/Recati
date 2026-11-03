/* ============================================================
   ENGINE — inteligência do app: diagnóstico de nível,
   proficiência por área/tópico, recomendações e conquistas.
   ============================================================ */
window.Engine = (function () {
  const AREAS = ["linguagens", "humanas", "natureza", "matematica"];
  const AREA_NOME = {
    linguagens: "Linguagens", humanas: "Humanas", natureza: "Natureza", matematica: "Matemática"
  };

  // Proficiência = % de acerto (com peso maior para respostas recentes)
  function statsPorArea() {
    const s = Store.get();
    const out = {};
    AREAS.forEach(a => out[a] = { certos: 0, total: 0 });
    s.simulados.forEach(sim => {
      sim.questoes.forEach((q, i) => {
        const a = q.area;
        if (!out[a]) out[a] = { certos: 0, total: 0 };
        out[a].total += 1;
        if (sim.respostas[i] === q.correta) out[a].certos += 1;
      });
    });
    AREAS.forEach(a => {
      out[a].pct = out[a].total ? Math.round((out[a].certos / out[a].total) * 100) : 0;
      out[a].nome = AREA_NOME[a];
    });
    return out;
  }

  function statsPorTopico() {
    const s = Store.get();
    const out = {};
    s.simulados.forEach(sim => {
      sim.questoes.forEach((q, i) => {
        const k = q.topico + "||" + q.area;
        if (!out[k]) out[k] = { topico: q.topico, area: q.area, certos: 0, total: 0 };
        out[k].total += 1;
        if (sim.respostas[i] === q.correta) out[k].certos += 1;
      });
    });
    return Object.values(out).map(t => ({ ...t, pct: Math.round((t.certos / t.total) * 100) }));
  }

  // Proficiência geral ponderada pelo peso das áreas no ENEM
  function proficienciaGeral() {
    const st = statsPorArea();
    let somaPct = 0, comDados = 0;
    AREAS.forEach(a => { if (st[a].total > 0) { somaPct += st[a].pct; comDados++; } });
    return comDados ? Math.round(somaPct / comDados) : 0;
  }

  // Nível textual baseado na proficiência e volume de prática
  function nivel() {
    const s = Store.get();
    const totalQ = Object.values(s.respostasQuestoes).length;
    const prof = proficienciaGeral();
    if (totalQ < 5) return { rotulo: "Explorador", emoji: "🌱", cor: "var(--s3)", faixa: "Início", desc: "Você está começando! Faça um simulado diagnóstico para o app te conhecer." };
    if (prof < 40) return { rotulo: "Aprendiz", emoji: "📗", cor: "var(--vermelho)", faixa: "0–40%", desc: "Base em construção. Foque nas trilhas do nível Básico." };
    if (prof < 55) return { rotulo: "Estudante", emoji: "📘", cor: "var(--s3)", faixa: "40–55%", desc: "Você já anda com as próprias pernas. Ataque suas áreas mais fracas." };
    if (prof < 70) return { rotulo: "Vestibulando", emoji: "📙", cor: "var(--s1)", faixa: "55–70%", desc: "Bom nível! Perto da média de aprovação em muitos cursos." };
    if (prof < 85) return { rotulo: "Avançado", emoji: "🎯", cor: "var(--verde)", faixa: "70–85%", desc: "Nível forte. Refine detalhes e mantenha a constância." };
    return { rotulo: "Craque do ENEM", emoji: "🏆", cor: "var(--roxo)", faixa: "85%+", desc: "Nível de medicina/elite. Mantenha o ritmo e cuide do emocional." };
  }

  // Recomendações: onde melhorar (tópicos e áreas mais fracas com dados suficientes)
  function recomendacoes() {
    const topicos = statsPorTopico().filter(t => t.total >= 1);
    const fracos = topicos.filter(t => t.pct < 60).sort((a, b) => a.pct - b.pct).slice(0, 4);
    const areas = statsPorArea();
    const areaFraca = AREAS.filter(a => areas[a].total > 0).sort((x, y) => areas[x].pct - areas[y].pct)[0];
    const recs = [];
    if (areaFraca && areas[areaFraca].pct < 60) {
      recs.push({ tipo: "area", texto: `Sua área mais frágil é <b>${AREA_NOME[areaFraca]}</b> (${areas[areaFraca].pct}%). Dedique blocos extras a ela nesta semana.`, icone: "🎯" });
    }
    fracos.forEach(t => {
      recs.push({ tipo: "topico", texto: `Reforce <b>${t.topico}</b> (${AREA_NOME[t.area]}) — só ${t.pct}% de acerto. Revise a lição e refaça questões do tema.`, icone: "🔧", area: t.area });
    });
    if (recs.length === 0) {
      const s = Store.get();
      if (Object.keys(s.respostasQuestoes).length === 0)
        recs.push({ tipo: "start", texto: "Faça seu <b>primeiro simulado diagnóstico</b> para descobrir onde focar.", icone: "🚀" });
      else
        recs.push({ tipo: "ok", texto: "Você está indo muito bem! Mantenha a constância e aumente aos poucos a dificuldade.", icone: "✨" });
    }
    return recs;
  }

  // Série temporal da curva de aprendizagem (% por simulado)
  function curvaAprendizagem() {
    const s = Store.get();
    return s.simulados.map((sim, i) => ({
      x: "S" + (i + 1),
      v: sim.total ? Math.round((sim.acertos / sim.total) * 100) : 0
    }));
  }

  // ---- Conquistas / badges ----
  const BADGES = [
    { id: "primeiro-passo", emoji: "👣", nome: "Primeiro Passo", desc: "Concluiu 1 lição", cond: s => s.licoesConcluidas.length >= 1 },
    { id: "estudioso", emoji: "📚", nome: "Estudioso", desc: "Concluiu 5 lições", cond: s => s.licoesConcluidas.length >= 5 },
    { id: "maratonista", emoji: "🏃", nome: "Maratonista", desc: "Concluiu 12 lições", cond: s => s.licoesConcluidas.length >= 12 },
    { id: "estreante", emoji: "🎬", nome: "Estreante", desc: "Fez 1 simulado", cond: s => s.simulados.length >= 1 },
    { id: "persistente", emoji: "💪", nome: "Persistente", desc: "Fez 5 simulados", cond: s => s.simulados.length >= 5 },
    { id: "afiado", emoji: "🎯", nome: "Afiado", desc: "Acertou 100% em um simulado", cond: s => s.simulados.some(x => x.total > 0 && x.acertos === x.total) },
    { id: "redator", emoji: "✍️", nome: "Redator", desc: "Escreveu 1 redação", cond: s => s.redacoes.length >= 1 },
    { id: "nota-alta", emoji: "🌟", nome: "Nota Alta", desc: "Redação com 800+ pontos", cond: s => s.redacoes.some(r => r.total >= 800) },
    { id: "streak-3", emoji: "🔥", nome: "Em Chamas", desc: "3 dias seguidos estudando", cond: s => s.streak.dias >= 3 },
    { id: "streak-7", emoji: "⚡", nome: "Imparável", desc: "7 dias seguidos", cond: s => s.streak.dias >= 7 },
    { id: "avancado", emoji: "🏆", nome: "Nível Avançado", desc: "Atingiu 70% de proficiência", cond: () => proficienciaGeral() >= 70 }
  ];

  function verificarConquistas() {
    const s = Store.get();
    const novas = [];
    BADGES.forEach(b => {
      if (b.cond(s) && !s.conquistas.includes(b.id)) {
        Store.adicionarConquista(b.id);
        novas.push(b);
      }
    });
    return novas;
  }

  function todasBadges() {
    const s = Store.get();
    return BADGES.map(b => ({ ...b, conquistada: s.conquistas.includes(b.id) }));
  }

  return {
    statsPorArea, statsPorTopico, proficienciaGeral, nivel, recomendacoes,
    curvaAprendizagem, verificarConquistas, todasBadges, AREA_NOME, AREAS
  };
})();
