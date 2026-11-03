/* ============================================================
   REDAÇÃO — estrutura, competências, regras, modelos prontos,
   dicas, conectivos e repertórios.
   Base: Cartilha do Participante (Inep) e matriz de correção.
   ============================================================ */
window.ENEM_REDACAO = {
  intro: "A redação vale até 1000 pontos (5 competências de até 200 pontos cada). É um texto dissertativo-argumentativo em prosa, de no máximo 30 linhas, que defende uma tese sobre um problema social e termina com uma proposta de intervenção que respeite os Direitos Humanos.",

  estrutura: [
    { parte: "Introdução", meta: "Apresente o tema, contextualize com um repertório e termine com sua TESE (seu ponto de vista) e, de preferência, anuncie os dois argumentos.", modelo: "Repertório/contexto + apresentação do problema + tese com os 2 argumentos." },
    { parte: "Desenvolvimento 1", meta: "Desenvolva o 1º argumento: tópico frasal + repertório legitimado + explicação + fechamento.", modelo: "Tópico frasal → prova (dado/autor/lei) → explicação → arremate ligado à tese." },
    { parte: "Desenvolvimento 2", meta: "Desenvolva o 2º argumento, com outro ângulo (outra causa, consequência ou agente), sem repetir o D1.", modelo: "Mesma estrutura do D1, novo enfoque e novo repertório." },
    { parte: "Conclusão", meta: "Retome a tese e apresente a proposta de intervenção COMPLETA, ligada aos problemas que você discutiu.", modelo: "Retomada + agente + ação + meio/modo + finalidade + detalhamento." }
  ],

  competencias: [
    { n: "C1", titulo: "Domínio da norma padrão", desc: "Ortografia, acentuação, concordância, regência, crase, pontuação e boa construção sintática (sem truncamento, justaposição ou excesso de elementos).", dica: "Para 200, a Cartilha só aceita desvios como exceção e sem reincidência (como referência prática, cursinhos usam: no máximo 2 desvios e 1 falha de estrutura). Releia procurando acento, crase, concordância e vírgulas." },
    { n: "C2", titulo: "Compreensão do tema + repertório", desc: "Não fugir nem tangenciar o tema, respeitar o tipo dissertativo-argumentativo e usar repertório sociocultural legitimado, pertinente ao tema e de uso produtivo.", dica: "Repertório bom é USADO para provar o argumento, não apenas citado. Use as palavras-chave do tema ao longo do texto para não tangenciar." },
    { n: "C3", titulo: "Projeto de texto e argumentação", desc: "Selecionar, relacionar, organizar e interpretar informações em defesa de um ponto de vista, com progressão lógica.", dica: "Anuncie os argumentos na introdução e desenvolva cada um num parágrafo. Não deixe 'pontas soltas' (ideia citada e não desenvolvida)." },
    { n: "C4", titulo: "Coesão", desc: "Conectivos variados e adequados entre e dentro dos parágrafos, além de boa referenciação (retomar termos sem repeti-los).", dica: "Use um conectivo no início de cada parágrafo e conectivos dentro deles. Evite repetir o mesmo conectivo e o mesmo termo — use sinônimos e pronomes." },
    { n: "C5", titulo: "Proposta de intervenção", desc: "Proposta detalhada e articulada à discussão, com 5 elementos: agente, ação, modo/meio, finalidade/efeito e detalhamento — sempre respeitando os Direitos Humanos.", dica: "Na correção, quanto mais elementos válidos e bem articulados, maior a nota: os 5 elementos levam aos 200. Proposta que desrespeite os Direitos Humanos recebe 0 nesta competência." }
  ],

  propostaChecklist: [
    { el: "Agente", ex: "QUEM faz? Seja específico: Ministério da Educação, escolas, mídia, ONGs, família, Congresso." },
    { el: "Ação", ex: "O QUE deve ser feito? Criar campanhas, ampliar programas, fiscalizar, reformular currículos." },
    { el: "Meio/Modo", ex: "COMO? 'Por meio de' verbas, parcerias, plataformas digitais, capacitação, leis." },
    { el: "Finalidade/Efeito", ex: "PARA QUÊ? 'A fim de' reduzir a evasão, conscientizar a população, garantir direitos." },
    { el: "Detalhamento", ex: "Um aprofundamento de qualquer elemento (ex.: explicar melhor o meio ou o público-alvo)." }
  ],

  // situações que levam a nota ZERO (Cartilha do Participante / Inep)
  zeram: [
    "Fuga total ao tema proposto.",
    "Não obedecer ao tipo dissertativo-argumentativo (ex.: escrever narração ou poema).",
    "Texto com até 7 linhas (insuficiente). Linhas copiadas dos textos motivadores não contam como linhas suas.",
    "Cópia dos textos motivadores ou da prova (trechos copiados são desconsiderados).",
    "Impropérios, desenhos ou outras formas propositais de anulação.",
    "Parte do texto deliberadamente desconectada do tema.",
    "Identificação do participante (nome, assinatura, apelido) fora do local indicado.",
    "Texto predominantemente em língua estrangeira.",
    "Folha de redação em branco — mesmo que haja texto no rascunho."
  ],
  avisoDH: "Desde 2017, desrespeitar os Direitos Humanos NÃO zera a redação inteira: a proposta que fere os Direitos Humanos recebe nota 0 na Competência 5. Nunca proponha violência, pena de morte, tortura, 'justiça com as próprias mãos' ou exclusão de grupos.",

  // MODELOS PRONTOS — preencha os [COLCHETES]. Adapte sempre ao tema!
  modelos: {
    aviso: "Modelos são esqueletos para ganhar tempo — não um texto decorado. Troque os [colchetes] por ideias do SEU tema e use as palavras-chave da proposta. Texto genérico, que caberia em qualquer tema, perde pontos em C2 e C3.",
    introducoes: [
      { nome: "Alusão a obra (livro, filme, série)", texto: "Na obra \"[OBRA]\", [AUTOR/DIREÇÃO] [ideia central da obra ligada ao tema]. Fora da ficção, essa realidade [aproxima-se do/contrasta com o] cenário brasileiro, no qual [TEMA] persiste. Esse quadro se mantém em virtude de [ARGUMENTO 1] e de [ARGUMENTO 2]." },
      { nome: "Constituição ou lei", texto: "A Constituição Federal de 1988 assegura, em seu artigo [Nº], [DIREITO] a todos os brasileiros. No entanto, [TEMA] revela que essa garantia ainda não se concretiza plenamente, seja por [ARGUMENTO 1], seja por [ARGUMENTO 2]." },
      { nome: "Dado ou fato histórico", texto: "Segundo [FONTE: IBGE, OMS, Anuário…], [DADO]. Esse cenário evidencia que [TEMA] continua sendo um desafio no Brasil, sobretudo devido a [ARGUMENTO 1] e a [ARGUMENTO 2]." }
    ],
    desenvolvimento1: "Em primeira análise, é fundamental destacar [ARGUMENTO 1] como fator central do problema. Isso porque [EXPLICAÇÃO: por que isso causa/agrava o tema]. Sob essa ótica, [REPERTÓRIO: autor, lei ou dado] [como o repertório comprova o argumento]. Dessa forma, [CONSEQUÊNCIA / retomada da tese].",
    desenvolvimento2: "Além disso, [ARGUMENTO 2] também contribui para o agravamento da questão. [EXPLICAÇÃO]. Nesse sentido, [REPERTÓRIO] [relação com o argumento]. Por conseguinte, [CONSEQUÊNCIA], o que reforça a urgência de medidas eficazes.",
    conclusoes: [
      { nome: "Uma proposta completa", texto: "Portanto, é imprescindível enfrentar [TEMA]. Para isso, [AGENTE] deve [AÇÃO], por meio de [MEIO/MODO], a fim de [FINALIDADE]. Essa medida deve [DETALHAMENTO: priorizar quem, como, onde]. Assim, [retomada da alusão da introdução]." },
      { nome: "Duas propostas (uma para cada argumento)", texto: "Diante do exposto, cabe a [AGENTE 1] [AÇÃO 1], por meio de [MEIO 1], a fim de [FINALIDADE 1], [DETALHAMENTO]. Paralelamente, [AGENTE 2] deve [AÇÃO 2], mediante [MEIO 2], para que [FINALIDADE 2]. Desse modo, [retomada da introdução]." }
    ],
    // redação-modelo completa (tema: desinformação)
    exemplo: {
      tema: "Combate à desinformação nas redes sociais no Brasil",
      paragrafos: [
        "No romance \"1984\", de George Orwell, o Estado manipula a informação para controlar a população, pois, segundo a obra, quem controla o passado controla o futuro. Fora da ficção, embora não haja um governo totalitário no Brasil, a lógica da manipulação se manifesta na disseminação de notícias falsas nas redes sociais. Esse quadro se mantém em virtude do modelo de negócio das plataformas, que lucra com o engajamento, e da carência de educação midiática da população.",
        "Em primeira análise, é fundamental destacar o funcionamento dos algoritmos como fator central do problema. Isso porque as plataformas priorizam conteúdos que geram mais interação, e informações falsas e sensacionalistas costumam engajar mais do que as verdadeiras. Sob essa ótica, um estudo do MIT publicado na revista Science, em 2018, mostrou que notícias falsas tinham cerca de 70% mais chance de serem compartilhadas do que as verdadeiras. Dessa forma, a mentira se torna lucrativa, e o debate público fica contaminado.",
        "Além disso, a falta de educação midiática também contribui para o agravamento da questão. Sem aprender a checar fontes e a identificar manchetes enganosas, muitos usuários compartilham conteúdos falsos de boa-fé. Nesse sentido, o conceito de \"infocracia\", do filósofo Byung-Chul Han, ajuda a compreender como o excesso de informação fragmenta a esfera pública e dificulta a distinção entre fato e opinião. Por conseguinte, decisões coletivas importantes, como o voto e a vacinação, passam a ser influenciadas por mentiras.",
        "Portanto, é imprescindível combater a desinformação no Brasil. Para isso, o Ministério da Educação deve incluir a educação midiática no currículo escolar, por meio de oficinas que ensinem a verificar fontes e a reconhecer notícias falsas, a fim de formar cidadãos críticos. Essa medida deve ser feita em parceria com agências de checagem, que podem levar exemplos reais às salas de aula. Assim, a sociedade brasileira estará mais protegida contra a manipulação descrita por Orwell."
      ],
      anotacoes: [
        "Introdução: alusão (Orwell) + tese + 2 argumentos anunciados (algoritmos e falta de educação midiática).",
        "D1: tópico frasal + explicação + repertório produtivo (estudo do MIT/Science) + fechamento.",
        "D2: novo argumento + repertório (Byung-Chul Han) + consequência.",
        "Conclusão: agente (MEC) + ação (incluir educação midiática) + meio (oficinas) + finalidade (cidadãos críticos) + detalhamento (parceria com agências de checagem) + retomada de Orwell."
      ]
    }
  },

  // GUIA DE CONECTIVOS (C4) — sentido, uso, pontuação e armadilhas
  conectivos: [
    { funcao: "Abrir o 1º desenvolvimento", itens: [
      { c: "Em primeira análise,", sentido: "começo da argumentação", ex: "Em primeira análise, é preciso considerar o papel dos algoritmos.", cuidado: "Use só no D1; vírgula depois." },
      { c: "Inicialmente,", sentido: "começo", ex: "Inicialmente, cabe analisar a origem do problema.", cuidado: "Vírgula depois." }
    ]},
    { funcao: "Adição (abrir o 2º desenvolvimento)", itens: [
      { c: "Além disso,", sentido: "acrescenta argumento", ex: "Além disso, a falta de fiscalização agrava o quadro.", cuidado: "Abre o D2 retomando que já houve um argumento antes." },
      { c: "Ademais,", sentido: "além disso (mais formal)", ex: "Ademais, a omissão estatal perpetua a exclusão.", cuidado: "Equivale a 'além disso'; não use os dois seguidos." },
      { c: "Somado a isso,", sentido: "acrescenta", ex: "Somado a isso, a publicidade normaliza as apostas.", cuidado: "'Isso' precisa retomar uma ideia clara do parágrafo anterior." }
    ]},
    { funcao: "Oposição / ressalva", itens: [
      { c: "Entretanto / No entanto / Contudo / Todavia", sentido: "oposição (= porém)", ex: "A lei existe. No entanto, não é cumprida.", cuidado: "No início da frase: vírgula depois. No meio: entre vírgulas ('A lei, contudo, não é cumprida')." },
      { c: "mas", sentido: "oposição", ex: "O Brasil produz alimentos, mas milhões passam fome.", cuidado: "Vírgula ANTES de 'mas'. Prefira não começar período com 'Mas'." },
      { c: "Em contrapartida,", sentido: "por outro lado, contraste", ex: "O agronegócio cresce; em contrapartida, a fome persiste.", cuidado: "Contraste entre dois fatos, não simples adição." }
    ]},
    { funcao: "Concessão (admite um fato, mas mantém a ideia)", itens: [
      { c: "Embora / Ainda que / Conquanto", sentido: "apesar de que", ex: "Embora a lei exista, a violência persiste.", cuidado: "Pedem verbo no SUBJUNTIVO: 'embora EXISTA', nunca 'embora existe'." },
      { c: "Apesar de / A despeito de", sentido: "concessão", ex: "Apesar dos avanços, a desigualdade persiste.", cuidado: "Seguidos de substantivo ou infinitivo: 'apesar de haver leis'." }
    ]},
    { funcao: "Causa / explicação", itens: [
      { c: "Isso porque", sentido: "explica a frase anterior", ex: "O problema persiste. Isso porque faltam investimentos.", cuidado: "Ótimo para explicar o tópico frasal do parágrafo." },
      { c: "visto que / uma vez que / já que", sentido: "porque", ex: "A medida é urgente, visto que vidas estão em risco.", cuidado: "Verbo no INDICATIVO ('visto que ESTÃO'). Vírgula antes." },
      { c: "em virtude de / devido a", sentido: "por causa de", ex: "Em virtude da omissão estatal, o problema se agrava.", cuidado: "Seguidos de substantivo. 'Devido a' + feminino pede crase: 'devido à falta'." },
      { c: "na medida em que", sentido: "CAUSA (= porque)", ex: "A educação é essencial, na medida em que forma cidadãos críticos.", cuidado: "Não confunda com 'à medida que' (proporção). 'Na medida que' (sem 'em') está errado." }
    ]},
    { funcao: "Proporção", itens: [
      { c: "à medida que", sentido: "PROPORÇÃO (= conforme, ao passo que)", ex: "À medida que a tecnologia avança, novos desafios surgem.", cuidado: "Sempre com crase. Indica que duas coisas variam juntas — não é causa." }
    ]},
    { funcao: "Consequência / conclusão parcial", itens: [
      { c: "Por conseguinte, / Consequentemente,", sentido: "como resultado", ex: "Por conseguinte, a confiança nas instituições diminui.", cuidado: "Ótimo para fechar o desenvolvimento com o efeito do argumento." },
      { c: "Dessa forma, / Desse modo, / Assim,", sentido: "como resultado, então", ex: "Dessa forma, a desigualdade se perpetua.", cuidado: "Use no fim do parágrafo para amarrar com a tese." }
    ]},
    { funcao: "Finalidade (essencial na proposta)", itens: [
      { c: "a fim de / para que / com o intuito de", sentido: "objetivo", ex: "…a fim de reduzir a evasão escolar.", cuidado: "'A fim de' é separado ('afim' = semelhante). 'Para que' pede SUBJUNTIVO: 'para que os jovens TENHAM'." },
      { c: "por meio de / mediante", sentido: "modo / meio", ex: "…por meio de campanhas nas escolas.", cuidado: "Marca o elemento MEIO da proposta. Prefira 'por meio de': parte dos gramáticos condena 'através de' com sentido de meio." }
    ]},
    { funcao: "Conclusão (abrir o último parágrafo)", itens: [
      { c: "Portanto, / Diante do exposto, / Em suma,", sentido: "conclusão", ex: "Portanto, é imprescindível combater a desinformação.", cuidado: "'Portanto' no meio da frase vem entre vírgulas: 'Cabe, portanto, ao Estado…'." }
    ]},
    { funcao: "Retomar sem repetir (referenciação)", itens: [
      { c: "tal problemática / esse cenário / a referida questão", sentido: "retoma o tema", ex: "Tal problemática exige ação conjunta.", cuidado: "O termo retomado precisa estar claro. Varie para não repetir." },
      { c: "pronomes: este, esse, aquele, o qual, cujo", sentido: "retomam termos", ex: "A escola, cujo papel é formar cidadãos, …", cuidado: "'Cujo' não leva artigo depois: 'cujo papel', nunca 'cujo o papel'." }
    ]}
  ],
  regrasConectivos: [
    "Use um conectivo DIFERENTE para abrir cada parágrafo: D1 (Em primeira análise), D2 (Além disso), Conclusão (Portanto). Isso é coesão entre parágrafos (C4).",
    "Use também conectivos DENTRO dos parágrafos (isso porque, visto que, dessa forma). A C4 avalia as duas coisas: entre e dentro dos parágrafos.",
    "Conectivo errado muda o sentido: 'Portanto' depois de uma causa, ou 'Além disso' para uma oposição, são erros de coesão. Pergunte: qual é a relação entre as ideias?",
    "Pontuação: conectivo no início da frase → vírgula depois ('No entanto, …'). Conectivo deslocado → entre vírgulas ('A lei, no entanto, …'). 'Mas' → vírgula antes.",
    "Modo verbal: 'embora, ainda que, caso, para que' pedem subjuntivo; 'visto que, uma vez que, já que' pedem indicativo.",
    "Evite 'onde' para o que não é lugar: 'uma sociedade em que (na qual)…', não 'uma sociedade onde…'.",
    "Não empilhe conectivos ('Além disso, ademais, …') nem repita o mesmo várias vezes. Variedade com precisão vale mais que quantidade."
  ],

  // PERTINÊNCIA DO REPERTÓRIO (C2)
  pertinencia: {
    regra: "Repertório só pontua bem quando é PERTINENTE ao tema e PRODUTIVO no argumento: ele precisa explicar ou comprovar a ideia do parágrafo. Citação famosa sem ligação com o tema é 'repertório de bolso' e não ajuda a nota.",
    exemplo: {
      tema: "Desafios para a valorização da herança africana no Brasil (ENEM 2024)",
      errado: "Citar Platão e o Mito da Caverna para falar da herança africana: o filósofo grego não tem relação com a cultura afro-brasileira — a ligação seria forçada e genérica.",
      certo: [
        "Lei 10.639/2003: tornou obrigatório o ensino de história e cultura afro-brasileira nas escolas.",
        "Abdias do Nascimento e o Teatro Experimental do Negro (1944): valorização da cultura e do protagonismo negro.",
        "Samba de Roda do Recôncavo Baiano: proclamado pela UNESCO Obra-Prima do Patrimônio Oral e Imaterial da Humanidade (2005).",
        "Lélia Gonzalez: o conceito de 'amefricanidade', sobre a influência africana na formação cultural das Américas."
      ]
    },
    teste: "Teste rápido: troque o tema por outro qualquer. Se o seu repertório continuar servindo igualzinho, ele está genérico demais — procure um mais específico."
  },

  // DICAS práticas de prova
  dicas: [
    { titulo: "Leia o tema 2 vezes e sublinhe as palavras-chave", texto: "Ex.: em 'Desafios para a valorização da herança africana no Brasil', as palavras-chave são DESAFIOS + VALORIZAÇÃO + HERANÇA AFRICANA + BRASIL. Falar só de racismo, sem 'herança', é tangenciar." },
    { titulo: "Escreva a tese antes de tudo", texto: "Em uma frase: qual é o problema e por que ele existe? Os dois motivos viram seus dois desenvolvimentos." },
    { titulo: "Faça rascunho, mas controle o tempo", texto: "No 1º dia (Linguagens + Humanas + Redação) você tem 5h30. Reserve cerca de 1h a 1h20 para a redação e passe a limpo com folga." },
    { titulo: "Média de 6 a 8 linhas por parágrafo", texto: "4 parágrafos × 6–8 linhas = 24 a 30 linhas: texto completo sem estourar o limite de 30. Na folha cabem em média 10 a 12 palavras por linha (≈ 65–90 palavras por parágrafo). Nunca fique com 7 linhas ou menos no total (zera)." },
    { titulo: "Repertório tem que conversar com o tema", texto: "Escolha leis, dados, autores e obras ligados ao assunto. Platão não serve para herança africana; a Lei 10.639/2003 e Abdias do Nascimento servem. Teste: se o repertório cabe em qualquer tema, ele é genérico demais." },
    { titulo: "Repertório produtivo vale mais que repertório famoso", texto: "Uma lei ou um dado bem explicado e ligado ao argumento pontua mais do que uma citação famosa solta. Sempre explique a relação com o tema." },
    { titulo: "Proposta: confira os 5 elementos", texto: "Agente, ação, meio/modo, finalidade e detalhamento. Use os marcadores 'por meio de' (meio) e 'a fim de' (finalidade) para não esquecer nenhum." },
    { titulo: "Prefira a impessoalidade", texto: "Não é proibido usar 1ª pessoa, mas o texto impessoal soa mais objetivo. Evite 'eu acho' e perguntas retóricas em excesso." },
    { titulo: "Frases de tamanho médio", texto: "Períodos muito longos causam justaposição e excesso de elementos; frases muito curtas soam truncadas. Mire em 20–30 palavras por período, com vírgulas bem colocadas." },
    { titulo: "Revise com um roteiro de 2 minutos", texto: "Acentos (você, também, não, país), crase (à, às), concordância (é necessário/necessária), vírgula após adjunto adverbial longo no início da frase e repetição de palavras." },
    { titulo: "O título é opcional", texto: "Se usar, ele não é avaliado e não conta como linha do texto. Se tiver dúvida, deixe sem título." },
    { titulo: "Nunca se identifique", texto: "Nada de nome, assinatura, iniciais ou apelido no texto — isso zera a redação." },
    { titulo: "Cuidado com os Direitos Humanos", texto: "Proponha soluções que protejam pessoas e grupos. Pena de morte, tortura ou violência na proposta levam a 0 na Competência 5." }
  ],

  repertorios: [
    { eixo: "Educação e Cidadania", fontes: "Paulo Freire ('Pedagogia do Oprimido'); Darcy Ribeiro; LDB (Lei 9.394/1996); Constituição, art. 205.", uso: "Educação como emancipação; analfabetismo; evasão; valorização docente." },
    { eixo: "Tecnologia e Comportamento", fontes: "George Orwell ('1984'); Byung-Chul Han ('Sociedade do Cansaço', 'Infocracia'); Milton Santos (meio técnico-científico-informacional); LGPD.", uso: "Vigilância, polarização por algoritmos, privacidade, hiperconectividade." },
    { eixo: "Saúde Pública", fontes: "Constituição de 1988 (art. 196 — saúde como direito de todos e dever do Estado); Josué de Castro ('Geografia da Fome'); Machado de Assis ('O Alienista').", uso: "Saneamento, saúde mental, desertos alimentares, acesso ao SUS." },
    { eixo: "Meio Ambiente", fontes: "Ailton Krenak ('Ideias para Adiar o Fim do Mundo'); racismo ambiental; Acordo de Paris; Lei de Crimes Ambientais (9.605/1998).", uso: "Mudanças climáticas, enchentes em comunidades vulneráveis, desmatamento." },
    { eixo: "Desigualdade e Minorias", fontes: "Constituição, art. 3º, IV (promover o bem de todos sem preconceito de origem, raça, sexo, cor e idade); DUDH (1948); Silvio Almeida (racismo estrutural); Adela Cortina (aporofobia).", uso: "Racismo, etarismo, capacitismo, população em situação de rua." },
    { eixo: "Herança africana e povos originários", fontes: "Lei 10.639/2003 e Lei 11.645/2008; Abdias do Nascimento; Lélia Gonzalez; Ailton Krenak; Censo 2022 (1,69 milhão de indígenas e 1,33 milhão de quilombolas).", uso: "Valorização cultural, racismo, povos tradicionais, patrimônio imaterial." },
    { eixo: "Cultura e Identidade", fontes: "Antonio Candido ('O Direito à Literatura'); Escola de Frankfurt (Adorno/Horkheimer — Indústria Cultural); Constituição, art. 215.", uso: "Acesso à cultura, patrimônio, padronização estética e consumo cultural." }
  ],

  frasesProntas: {
    conectivos: ["Nesse sentido", "Ademais", "Outrossim", "Por conseguinte", "Sob esse viés", "Em contrapartida", "Dessa forma", "Diante do exposto"],
    intervencao: ["Portanto, cabe ao Ministério da Educação...", "A fim de mitigar tal problemática, é imprescindível que...", "Para tanto, por meio de...", "com o objetivo de garantir..."]
  }
};
