/* ============================================================
   VERIFICAÇÃO AUTOMÁTICA DE REDAÇÃO (heurística, 100% local)
   Aponta possíveis desvios de norma padrão — é um APOIO de
   estudo, não substitui a correção humana. Pode ter falsos
   positivos; sempre confirme.

   Cobre: ortografia, acentuação, regência verbal, vírgula em
   adjunto adverbial deslocado (3+ palavras), truncamento,
   justaposição / excesso de elementos sintáticos e paralelismo.
   ============================================================ */
window.RedacaoCheck = (function () {

  // palavras que, sem acento, não formam palavra válida do português
  // (seguras para sinalizar). Homógrafos ambíguos foram evitados.
  const ACENTOS = {
    voce: "você", voces: "vocês", nao: "não", tambem: "também", porem: "porém",
    alem: "além", atraves: "através", necessario: "necessário", necessaria: "necessária",
    possivel: "possível", responsavel: "responsável", historia: "história", familia: "família",
    saude: "saúde", dificil: "difícil", facil: "fácil", util: "útil", nivel: "nível",
    publico: "público", publica: "pública", politica: "política", politico: "político",
    economico: "econômico", economica: "econômica", ultimo: "último", ultima: "última",
    proprio: "próprio", propria: "própria", area: "área", consequencia: "consequência",
    experiencia: "experiência", ciencia: "ciência", individuo: "indivíduo", periodo: "período",
    tres: "três", heroi: "herói", juizo: "juízo", saida: "saída", analise: "análise",
    basico: "básico", basica: "básica", medico: "médico", fisica: "física", quimica: "química",
    matematica: "matemática", portugues: "português", ingles: "inglês", pais: "país",
    series: "séries", memoria: "memória", teoria: "teoria", democracia: "democracia",
    sociedade: "sociedade", tragedia: "tragédia", maioria: "maioria", relatorio: "relatório",
    orgao: "órgão", cidadao: "cidadão", padrao: "padrão", solucao: "solução", questao: "questão",
    educacao: "educação", populacao: "população", situacao: "situação", informacao: "informação"
  };
  // 'sociedade','teoria','democracia','maioria' não levam acento — removidos abaixo:
  delete ACENTOS.sociedade; delete ACENTOS.teoria; delete ACENTOS.democracia;
  delete ACENTOS.maioria; delete ACENTOS.series; delete ACENTOS.pais;

  // erros ortográficos frequentes e internetês
  const ORTO = {
    concerteza: "com certeza", derrepente: "de repente", apartir: "a partir",
    excessão: "exceção", excesao: "exceção", previlegio: "privilégio", previlégio: "privilégio",
    frustado: "frustrado", adiquirir: "adquirir", advinhar: "adivinhar",
    beneficiente: "beneficente", entitular: "intitular", asim: "assim",
    menas: "menos", seje: "seja", estrupo: "estupro", mindigo: "mendigo",
    previlégios: "privilégios", impecilho: "empecilho", empencilho: "empecilho",
    cincoenta: "cinquenta", mortandela: "mortadela", poblema: "problema", pobrema: "problema",
    iorgute: "iogurte", supertição: "superstição", metereologia: "meteorologia",
    reinvidicar: "reivindicar", reinvindicar: "reivindicar", indiginação: "indignação",
    discursão: "discussão", concenso: "consenso", excessivel: "acessível",
    vc: "você", vcs: "vocês", pq: "porque", tbm: "também", tb: "também", q: "que",
    naum: "não", mto: "muito", mta: "muita", agnt: "a gente", blz: "beleza",
    atoa: "à toa", porisso: "por isso", apesarde: "apesar de", amais: "a mais"
  };

  // padrões de regência verbal (texto em minúsculas) → {re, msg, grav}
  const REGENCIA = [
    { re: /\b(assisti|assistiu|assistir|assistimos|assistiram|assiste|assistem|assistindo)\s+(o|os|a|as)\s+(filme|jogo|aula|novela|programa|show|v[ií]deo|partida|document[áa]rio)/g,
      msg: "Regência: 'assistir' (no sentido de ver) exige preposição 'a' — assistir AO filme, À aula." },
    { re: /\b(obedec\w+|desobedec\w+)\s+(o|os|a|as)\s+/g,
      msg: "Regência: 'obedecer/desobedecer' pede 'a' — obedecer AO sinal, ÀS regras." },
    { re: /\b(vou|vai|vamos|v[ãa]o|ir)\s+(no|na)\s+/g,
      msg: "Regência: verbo de movimento pede 'a' — vou À escola, AO trabalho (não 'na/no')." },
    { re: /\b(cheguei|chegou|chegaram|chegamos|chega|chegam|chegar)\s+(no|na)\s+/g,
      msg: "Regência: 'chegar' pede 'a' — cheguei À escola, AO cinema (não 'na/no')." },
    { re: /\b(implica|implicam|implicou|implicaram|implicar)\s+em\s+/g,
      msg: "Regência: 'implicar' (acarretar) é transitivo direto — implica mudanças (sem 'em')." },
    { re: /\bhouveram\b/g,
      msg: "Concordância: 'haver' (existir/ocorrer) é impessoal — use 'houve', sempre no singular." },
    { re: /\bfazem\s+(muitos|alguns|v[áa]rios|\d+|dois|tr[êe]s|quatro|cinco|seis|sete|oito|nove|dez|vinte|trinta|cem)\s+(anos|meses|dias|s[ée]culos|semanas|horas|d[ée]cadas)/g,
      msg: "Concordância: 'fazer' indicando tempo é impessoal — 'faz X anos', no singular." },
    { re: /\bexiste\s+(muitos|v[áa]rios|diversos|in[úu]meros|alguns)\b/g,
      msg: "Concordância: 'existir' concorda com o sujeito — 'existem vários'." },
    { re: /\bentre\s+eu\b/g,
      msg: "Pronome: após preposição, use o pronome oblíquo — 'entre mim e você'." },
    { re: /\bpara\s+mim\s+(fazer|ver|dizer|resolver|entender|ir|poder|conseguir|ter|comprar|estudar)\b/g,
      msg: "Pronome: antes de infinitivo, use 'eu' — 'para eu fazer', não 'para mim fazer'." },
    { re: /\bmeia?\s+(cansad\w+|nervos\w+|chatead\w+|irritad\w+|triste)\b/g,
      msg: "'Meio' como advérbio é invariável — 'meio cansada', não 'meia cansada'." },
    { re: /\ba\s+n[íi]vel\s+de\b/g,
      msg: "Vício de linguagem: evite 'a nível de' — prefira 'em nível de' ou 'no âmbito de'." },

    /* ---- Concordância nominal: "é necessário / é necessária" (e proibido, permitido, preciso, bom) ----
       Regra: SEM determinante (artigo/pronome) o adjetivo fica no masculino singular:
              "É necessário paciência", "É proibido entrada".
              COM determinante, concorda com o substantivo:
              "É necessária a paciência", "É necessária muita paciência", "É proibida a entrada". */
    { re: /\b(é|era|será|foi|seria)\s+(necessário|proibido|permitido)\s+(?!a\s+gente\b)(a|as|uma|umas|esta|essa|aquela|estas|essas|muita|muitas|toda|tamanha|sua|nossa)\s+/g,
      msg: "Concordância nominal: com determinante feminino, o adjetivo concorda — 'É necessária A paciência', 'É proibida A entrada' (se o substantivo for plural, verbo também: 'São necessárias AS medidas')." },
    // "É necessária paciência" (substantivo sem determinante logo após) → "É necessário paciência".
    // Exclui preposições/advérbios/conjunções para não pegar "A ajuda é necessária para todos".
    { re: /\bé\s+necessária\s+(?!(?:a|as|uma|umas|esta|essa|aquela|muita|muitas|toda|sua|nossa|tamanha|que|para|por|pela|pelo|pelas|pelos|em|no|na|nos|nas|ao|à|aos|às|com|sem|sob|sobre|entre|desde|durante|após|e|ou|mas|pois|porque|quando|hoje|agora|também|ainda|sempre|aqui|mais|tanto|nesse|neste|nessa|nesta|diante|frente)\b)(?![a-zà-ÿ]+mente\b)[a-zà-ÿ]+/g,
      msg: "Concordância nominal (verifique): sem determinante, o adjetivo fica no masculino — 'É necessário paciência'; com determinante, concorda — 'É necessária A paciência'." },
    // singular com substantivo plural: "É necessário medidas" → "São necessárias medidas"
    { re: /\bé\s+(necessário|necessária)\s+(medidas|ações|políticas|mudanças|investimentos|soluções|campanhas)\b/g,
      msg: "Concordância: com substantivo plural, verbo e adjetivo vão ao plural — 'SÃO NECESSÁRIAS medidas'." },
    // verbo plural com adjetivo singular: "São necessário…" → "São necessários/necessárias"
    { re: /\bsão\s+(necessário|necessária|proibido|proibida|permitido|permitida)\s+/g,
      msg: "Concordância: com 'são', o adjetivo vai ao plural — 'são necessários/necessárias', 'são proibidos/proibidas'." },
    { re: /\b(anexo|incluso|obrigado|quite)\s+(as|os|às)\s+/g,
      msg: "Concordância: 'anexo/incluso/obrigado/quite' concordam com o termo — 'Seguem ANEXAS as fotos', 'Muito obrigadA' (se for mulher)." },
    // ---- conectivos (coesão) ----
    { cat: "coesao", re: /\b(sociedade|contexto|cenário|situação|época|momento|realidade|sistema|cultura|relação|período|caso)\s+onde\b/g,
      msg: "Conectivo: 'onde' indica lugar físico. Use 'em que' ou 'na qual/no qual' — 'uma sociedade em que…'." },
    { cat: "coesao", re: /\bna\s+medida\s+que\b/g,
      msg: "Conectivo: a forma correta é 'na medida em que' (causa) ou 'à medida que' (proporção)." },
    { cat: "coesao", re: /\bà\s+medida\s+em\s+que\b/g,
      msg: "Conectivo: 'à medida em que' não existe. Use 'à medida que' (proporção) ou 'na medida em que' (causa)." },
    { cat: "coesao", re: /\b(embora|ainda\s+que|conquanto)\s+(é|são|existe|existem|há|tem|têm|está|estão|possui|possuem|pode|podem|deve|devem)\b/g,
      msg: "Conectivo: 'embora/ainda que' pedem subjuntivo — 'embora SEJA', 'embora EXISTA', 'embora HAJA', 'embora TENHA'." },
    { cat: "coesao", re: /\bcujo\s+(o|a|os|as)\s+/g,
      msg: "'Cujo' não admite artigo depois: 'cujo pai', nunca 'cujo o pai'." },
    { re: /\b(bastante)\s+(pessoas|motivos|problemas|casos|vezes|alunos|jovens)\b/g,
      msg: "Concordância: 'bastante' como adjetivo (= muitos) varia — 'bastanteS pessoas', 'bastanteS motivos'." }
  ];

  /* O "\b" nativo do JavaScript não considera letras acentuadas (é, ó, ã…) como parte
     da palavra — "\bé" e "só\b" falham. Trocamos todo "\b" por uma fronteira que
     reconhece acentos. */
  const L = "a-zà-ÿ0-9";
  const WB = `(?:(?<![${L}])(?=[${L}])|(?<=[${L}])(?![${L}]))`;
  const R = re => new RegExp(re.source.replace(/\\b/g, WB), re.flags.includes("g") ? re.flags : re.flags + "g");
  REGENCIA.forEach(r => { r.re = R(r.re); });
  const RE_NAO_SO = R(/\bnão (só|somente|apenas)\b/);
  const RE_MAS_TAMBEM = R(/\b(mas também|mas ainda|como também|bem como|mas sim)\b/);
  const RE_TANTO = R(/\btanto\b/);
  const RE_QUANTO = R(/\b(quanto|como)\b/);

  // começos de adjunto adverbial (preposições) deslocado
  const ADV_START = new Set([
    "em", "no", "na", "nos", "nas", "num", "numa", "com", "por", "pela", "pelo",
    "durante", "após", "apos", "diante", "segundo", "sob", "sobre", "entre", "desde",
    "para", "conforme", "mediante", "perante", "ante", "apesar", "sem", "contra", "ao", "até"
  ]);

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ctx = (texto, idx, len) => {
    const ini = Math.max(0, idx - 18), fim = Math.min(texto.length, idx + len + 18);
    return (ini > 0 ? "…" : "") + texto.slice(ini, fim).replace(/\s+/g, " ").trim() + (fim < texto.length ? "…" : "");
  };

  function analisar(texto) {
    const achados = [];
    if (!texto || !texto.trim()) return { achados, resumo: { total: 0, cats: {} }, palavras: 0, vazio: true };
    const low = texto.toLowerCase();

    // ---- ortografia e acentuação (por token) ----
    const tokenRe = /[A-Za-zÀ-ÿ]+/g;
    let m;
    while ((m = tokenRe.exec(texto))) {
      const lw = m[0].toLowerCase();
      if (ORTO[lw]) achados.push({ cat: "ortografia", grav: "alta", trecho: m[0], idx: m.index,
        msg: `Possível erro de ortografia: "${m[0]}" → "${ORTO[lw]}".` });
      else if (ACENTOS[lw]) {
        const temCedilhaOuTil = /[çãõ]/.test(ACENTOS[lw]) && !/[áéíóúâêô]/.test(ACENTOS[lw]);
        achados.push({ cat: "acentuacao", grav: "media", trecho: m[0], idx: m.index,
          msg: temCedilhaOuTil
            ? `Grafia: falta til/cedilha — "${m[0]}" → "${ACENTOS[lw]}".`
            : `Acentuação: "${m[0]}" → "${ACENTOS[lw]}".` });
      }
    }

    // ---- regência / concordância / pronomes ----
    REGENCIA.forEach(r => {
      r.re.lastIndex = 0; let g;
      while ((g = r.re.exec(low))) {
        achados.push({ cat: r.cat || "regencia", grav: "alta", trecho: ctx(texto, g.index, g[0].length), idx: g.index, msg: r.msg });
        if (r.re.lastIndex === g.index) r.re.lastIndex++;
      }
    });

    // ---- análise por frase ----
    const sentRe = /[^.!?\n]+[.!?]*/g; let s;
    while ((s = sentRe.exec(texto))) {
      const bruto = s[0];
      const frase = bruto.trim();
      if (frase.length < 2) continue;
      const idx = s.index + (bruto.length - bruto.trimStart().length);
      const palavras = frase.split(/\s+/).filter(Boolean);
      const nPal = palavras.length;
      const virgulas = (frase.match(/,/g) || []).length;
      const low1 = palavras[0] ? palavras[0].toLowerCase().replace(/[^a-zà-ÿ]/g, "") : "";

      // truncamento: frase muito curta (fragmento)
      if (nPal > 0 && nPal <= 3 && /[.!?]$/.test(frase)) {
        achados.push({ cat: "truncamento", grav: "media", trecho: frase, idx,
          msg: "Período muito curto — risco de truncamento/fragmento (talvez falte ligar à oração anterior)." });
      }
      // frase começando com minúscula (pontuação/truncamento)
      if (/^[a-zà-ÿ]/.test(frase) && nPal >= 2) {
        achados.push({ cat: "truncamento", grav: "baixa", trecho: ctx(texto, idx, 20), idx,
          msg: "Frase iniciada com letra minúscula — verifique a pontuação (ponto indevido) ou a maiúscula." });
      }
      // período longo demais: justaposição / excesso de elementos
      if (nPal > 42) {
        achados.push({ cat: "justaposicao", grav: "media", trecho: frase.slice(0, 60) + "…", idx,
          msg: `Período muito longo (${nPal} palavras) — risco de justaposição e excesso de elementos sintáticos. Divida ou use subordinação.` });
      } else if (virgulas >= 7) {
        achados.push({ cat: "justaposicao", grav: "baixa", trecho: frase.slice(0, 60) + "…", idx,
          msg: `Muitas vírgulas (${virgulas}) em um só período — risco de excesso de segmentação/elementos. Revise a estrutura.` });
      }
      // adjunto adverbial deslocado (3+ palavras) sem vírgula:
      // frase começa com preposição e NÃO há vírgula fechando o adjunto (procura até a 16ª palavra,
      // pois adjuntos longos como "Sem aprender a checar fontes e a identificar manchetes enganosas," existem)
      if (ADV_START.has(low1) && nPal >= 7) {
        const posVirg = palavras.slice(0, 16).findIndex(w => /,$/.test(w));
        if (posVirg === -1) {
          achados.push({ cat: "pontuacao", grav: "media", trecho: palavras.slice(0, 6).join(" ") + "…", idx,
            msg: "Adjunto adverbial longo (3+ palavras) deslocado para o início sem vírgula — isole-o: 'No Brasil atual, a desigualdade…'." });
        }
      }
      // paralelismo: correlações incompletas
      const fl = frase.toLowerCase();
      RE_NAO_SO.lastIndex = 0; RE_MAS_TAMBEM.lastIndex = 0;
      if (RE_NAO_SO.test(fl) && !(RE_MAS_TAMBEM.lastIndex = 0, RE_MAS_TAMBEM.test(fl))) {
        achados.push({ cat: "paralelismo", grav: "media", trecho: frase.slice(0, 60) + "…", idx,
          msg: "Paralelismo: 'não só…' pede o par 'mas também…' (correlação incompleta)." });
      }
      RE_TANTO.lastIndex = 0; RE_QUANTO.lastIndex = 0;
      if (RE_TANTO.test(fl) && !(RE_QUANTO.lastIndex = 0, RE_QUANTO.test(fl)) && nPal >= 6) {
        achados.push({ cat: "paralelismo", grav: "baixa", trecho: frase.slice(0, 60) + "…", idx,
          msg: "Paralelismo: 'tanto…' costuma pedir 'quanto…'. Verifique a correlação." });
      }
    }

    // ---- tamanho dos parágrafos (meta: 6 a 8 linhas) e total de linhas ----
    // Estimativa: ~11 palavras por linha da folha do ENEM (letra de tamanho médio).
    const PAL_POR_LINHA = 11;
    const paragrafos = [];
    const parRe = /[^\n]+/g; let pm;
    while ((pm = parRe.exec(texto))) {
      const t = pm[0].trim();
      const np = (t.match(/\S+/g) || []).length;
      if (np >= 5) paragrafos.push({ idx: pm.index, np, linhas: Math.max(1, Math.round(np / PAL_POR_LINHA)), ini: t.slice(0, 40) });
    }
    paragrafos.forEach((p, i) => {
      if (p.linhas < 6) achados.push({ cat: "paragrafo", grav: "baixa", trecho: `§${i + 1}: ${p.ini}…`, idx: p.idx,
        msg: `Parágrafo ${i + 1} curto: ~${p.linhas} linha(s) (${p.np} palavras). Meta: 6 a 8 linhas (≈ 65–90 palavras) — desenvolva mais o argumento.` });
      else if (p.linhas > 8) achados.push({ cat: "paragrafo", grav: "baixa", trecho: `§${i + 1}: ${p.ini}…`, idx: p.idx,
        msg: `Parágrafo ${i + 1} longo: ~${p.linhas} linhas (${p.np} palavras). Meta: 6 a 8 linhas — corte repetições para não passar de 30 linhas.` });
    });
    const linhasTot = paragrafos.reduce((s, p) => s + p.linhas, 0);
    if (paragrafos.length && paragrafos.length !== 4) achados.push({ cat: "paragrafo", grav: "baixa", trecho: `${paragrafos.length} parágrafo(s)`, idx: 0,
      msg: `O texto tem ${paragrafos.length} parágrafo(s). A estrutura mais segura é 4: introdução, 2 desenvolvimentos e conclusão (separe os parágrafos com Enter).` });
    if (linhasTot > 30) achados.push({ cat: "paragrafo", grav: "alta", trecho: `~${linhasTot} linhas`, idx: 0,
      msg: `Estimativa de ~${linhasTot} linhas: passa do limite de 30 linhas da folha. Enxugue o texto.` });

    // ordena por posição e monta resumo
    achados.sort((a, b) => a.idx - b.idx);
    const cats = {};
    achados.forEach(a => { cats[a.cat] = (cats[a.cat] || 0) + 1; });
    const palavras = (texto.trim().match(/\S+/g) || []).length;
    return { achados, resumo: { total: achados.length, cats }, palavras, vazio: false,
      paragrafos: paragrafos.map(p => p.linhas), linhasEstimadas: linhasTot };
  }

  const CAT_META = {
    ortografia: { rotulo: "Ortografia", emoji: "🔤", chip: "vermelho" },
    acentuacao: { rotulo: "Acentuação", emoji: "´", chip: "amarelo" },
    regencia: { rotulo: "Regência/Concordância", emoji: "🧷", chip: "roxo" },
    pontuacao: { rotulo: "Vírgula (adjunto adverbial)", emoji: "，", chip: "azul" },
    truncamento: { rotulo: "Truncamento", emoji: "✂️", chip: "amarelo" },
    justaposicao: { rotulo: "Justaposição/Excesso", emoji: "📏", chip: "azul" },
    paralelismo: { rotulo: "Paralelismo", emoji: "⚖️", chip: "roxo" },
    paragrafo: { rotulo: "Tamanho dos parágrafos", emoji: "📐", chip: "cinza" },
    coesao: { rotulo: "Conectivos/Coesão", emoji: "🔗", chip: "verde" }
  };

  return { analisar, CAT_META, esc };
})();
