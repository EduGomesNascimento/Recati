/* ============================================================
   REDAÇÃO — estrutura, competências, repertórios e temas.
   ============================================================ */
window.ENEM_REDACAO = {
  intro: "A redação vale até 1000 pontos e pode inflar dramaticamente sua média. É um texto dissertativo-argumentativo em prosa, com tese sobre um problema social brasileiro e proposta de intervenção que respeite os Direitos Humanos.",

  estrutura: [
    { parte: "Introdução", meta: "Apresente o tema, contextualize com um repertório e termine com sua TESE (seu ponto de vista claro).", modelo: "Contextualização (repertório) + problematização + tese." },
    { parte: "Desenvolvimento 1", meta: "Um argumento com tópico frasal + repertório legitimado + análise + fechamento.", modelo: "Tópico frasal → prova (dado/autor/fato) → explicação → arremate." },
    { parte: "Desenvolvimento 2", meta: "Outro argumento, sob ângulo diferente (causa, consequência ou outro agente).", modelo: "Mesma estrutura, novo enfoque, sem repetir o D1." },
    { parte: "Conclusão", meta: "Retome a tese e apresente a proposta de intervenção COMPLETA (5 elementos).", modelo: "Retomada + agente + ação + meio + finalidade + detalhamento." }
  ],

  competencias: [
    { n: "C1", titulo: "Modalidade escrita formal", desc: "Domínio da norma culta: ortografia, concordância, regência, crase, pontuação e períodos complexos bem construídos.", dica: "Prefira períodos completos e variados; evite gírias, oralidade e repetição. Um deslize pontual não zera, mas a reincidência derruba." },
    { n: "C2", titulo: "Compreensão do tema + repertório", desc: "Não fugir/tangenciar o tema, respeitar o modelo dissertativo e usar repertório sociocultural legitimado, pertinente e produtivo.", dica: "Repertório bom é usado (integrado ao argumento), não só citado. Cite fonte real (História, Ciência, Literatura, dados)." },
    { n: "C3", titulo: "Projeto de texto e argumentação", desc: "Selecionar, relacionar e organizar informações em defesa de um ponto de vista, com progressão lógica.", dica: "Cada parágrafo, um tópico frasal. Não deixe 'pontas soltas' (argumento levantado e não desenvolvido)." },
    { n: "C4", titulo: "Coesão", desc: "Uso variado de conectivos e mecanismos de referência entre e dentro dos parágrafos.", dica: "Comece cada parágrafo com um conectivo diferente. Varie: 'Ademais', 'Outrossim', 'Nesse sentido', 'Por conseguinte'." },
    { n: "C5", titulo: "Proposta de intervenção", desc: "Solução detalhada, exequível e que respeite os Direitos Humanos, com 5 elementos.", dica: "AÇÃO + AGENTE + MEIO/MODO + FINALIDADE + DETALHAMENTO. Falta de um elemento tira pontos preciosos." }
  ],

  propostaChecklist: [
    { el: "Agente", ex: "Quem faz? Ministério da Educação, escolas, mídia, ONGs, famílias." },
    { el: "Ação", ex: "O que deve ser feito? Criar campanhas, implementar programas, reformar currículos." },
    { el: "Meio/Modo", ex: "Como? Por meio de verbas, parcerias, plataformas digitais, capacitação." },
    { el: "Finalidade", ex: "Para quê? A fim de reduzir a evasão, conscientizar a população, garantir direitos." },
    { el: "Detalhamento", ex: "Um aprofundamento de qualquer elemento acima (explique melhor o agente ou o modo)." }
  ],

  repertorios: [
    { eixo: "Educação e Cidadania", fontes: "Paulo Freire ('Pedagogia do Oprimido'); Darcy Ribeiro; LDB; Malala.", uso: "Educação como emancipação; analfabetismo funcional; evasão; valorização docente." },
    { eixo: "Tecnologia e Comportamento", fontes: "George Orwell ('1984'); Byung-Chul Han ('Sociedade do Cansaço'); Milton Santos (meio técnico-científico-informacional).", uso: "Vigilância, polarização por algoritmos, privacidade, hiperconectividade." },
    { eixo: "Saúde Pública", fontes: "Constituição de 1988 (Art. 196 – SUS); Josué de Castro ('Geografia da Fome'); Machado de Assis ('O Alienista').", uso: "Saneamento, saúde mental, desertos alimentares, acesso à saúde." },
    { eixo: "Meio Ambiente", fontes: "Ailton Krenak ('Ideias para Adiar o Fim do Mundo'); racismo ambiental; Lei de Crimes Ambientais.", uso: "Mudanças climáticas, enchentes em comunidades vulneráveis, desmatamento." },
    { eixo: "Desigualdade e Minorias", fontes: "Zygmunt Bauman ('Modernidade Líquida'); Durkheim (anomia); DUDH (1948).", uso: "Racismo estrutural, etarismo, população em situação de rua, meritocracia." },
    { eixo: "Cultura e Identidade", fontes: "Gilberto Freyre; Escola de Frankfurt (Adorno/Horkheimer – Indústria Cultural); Lei Rouanet.", uso: "Apropriação cultural, gentrificação de polos culturais, padronização estética." }
  ],

  temas: [
    { titulo: "Caminhos para combater o analfabetismo funcional no Brasil", eixo: "Educação e Cidadania", nivel: "Clássico" },
    { titulo: "Desafios da valorização da saúde mental na sociedade contemporânea", eixo: "Saúde Pública", nivel: "Muito provável" },
    { titulo: "O impacto das fake news e dos algoritmos na democracia", eixo: "Tecnologia e Comportamento", nivel: "Muito provável" },
    { titulo: "Caminhos para mitigar os efeitos das mudanças climáticas nas cidades", eixo: "Meio Ambiente", nivel: "Muito provável" },
    { titulo: "A invisibilidade da população em situação de rua no Brasil", eixo: "Desigualdade e Minorias", nivel: "Provável" },
    { titulo: "Preservação do patrimônio cultural imaterial brasileiro", eixo: "Cultura e Identidade", nivel: "Provável" },
    { titulo: "Desafios para a inclusão digital de idosos no Brasil", eixo: "Tecnologia e Comportamento", nivel: "Provável" },
    { titulo: "O combate ao etarismo no mercado de trabalho", eixo: "Desigualdade e Minorias", nivel: "Possível" }
  ],

  frasesProntas: {
    conectivos: ["Nesse sentido", "Ademais", "Outrossim", "Por conseguinte", "Sob esse viés", "Em contrapartida", "Dessa forma", "Diante do exposto"],
    intervencao: ["Portanto, cabe ao Ministério da Educação...", "A fim de mitigar tal problemática, é imprescindível que...", "Para tanto, por meio de...", "com o objetivo de garantir..."]
  }
};
