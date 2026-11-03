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

  // conectivos por função (C4)
  conectivos: [
    { funcao: "Iniciar o 1º desenvolvimento", lista: ["Em primeira análise", "Inicialmente", "A princípio", "Em primeiro plano"] },
    { funcao: "Adição (2º desenvolvimento)", lista: ["Além disso", "Ademais", "Somado a isso", "Outrossim", "Paralelamente"] },
    { funcao: "Oposição / ressalva", lista: ["Entretanto", "No entanto", "Contudo", "Todavia", "Em contrapartida"] },
    { funcao: "Causa / explicação", lista: ["Isso porque", "visto que", "uma vez que", "já que", "em virtude de"] },
    { funcao: "Consequência", lista: ["Por conseguinte", "Consequentemente", "Dessa forma", "Desse modo", "Assim"] },
    { funcao: "Exemplificação", lista: ["a exemplo de", "como ilustra", "tal qual", "como comprova"] },
    { funcao: "Conclusão", lista: ["Portanto", "Diante do exposto", "Em suma", "Logo", "Dessarte"] },
    { funcao: "Retomar sem repetir (referenciação)", lista: ["tal problemática", "esse cenário", "a referida questão", "esse impasse", "isso"] }
  ],

  // DICAS práticas de prova
  dicas: [
    { titulo: "Leia o tema 2 vezes e sublinhe as palavras-chave", texto: "Ex.: em 'Desafios para a valorização da herança africana no Brasil', as palavras-chave são DESAFIOS + VALORIZAÇÃO + HERANÇA AFRICANA + BRASIL. Falar só de racismo, sem 'herança', é tangenciar." },
    { titulo: "Escreva a tese antes de tudo", texto: "Em uma frase: qual é o problema e por que ele existe? Os dois motivos viram seus dois desenvolvimentos." },
    { titulo: "Faça rascunho, mas controle o tempo", texto: "No 1º dia (Linguagens + Humanas + Redação) você tem 5h30. Reserve cerca de 1h a 1h20 para a redação e passe a limpo com folga." },
    { titulo: "Média de 6 a 8 linhas por parágrafo", texto: "4 parágrafos × 6–8 linhas = 24 a 30 linhas: texto completo sem estourar o limite de 30. Na folha cabem em média 10 a 12 palavras por linha (≈ 65–90 palavras por parágrafo). Nunca fique com 7 linhas ou menos no total (zera)." },
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
    { eixo: "Desigualdade e Minorias", fontes: "Zygmunt Bauman ('Modernidade Líquida'); Durkheim (anomia); DUDH (1948); Florestan Fernandes.", uso: "Racismo estrutural, etarismo, população em situação de rua, meritocracia." },
    { eixo: "Cultura e Identidade", fontes: "Antonio Candido ('O Direito à Literatura'); Escola de Frankfurt (Adorno/Horkheimer — Indústria Cultural); Constituição, art. 215.", uso: "Acesso à cultura, patrimônio, padronização estética e consumo cultural." }
  ],

  frasesProntas: {
    conectivos: ["Nesse sentido", "Ademais", "Outrossim", "Por conseguinte", "Sob esse viés", "Em contrapartida", "Dessa forma", "Diante do exposto"],
    intervencao: ["Portanto, cabe ao Ministério da Educação...", "A fim de mitigar tal problemática, é imprescindível que...", "Para tanto, por meio de...", "com o objetivo de garantir..."]
  }
};
