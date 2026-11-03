/* ============================================================
   TEMAS DE REDAÇÃO — banco de temas prováveis para o ENEM 2026.
   Cada tema: probabilidade, dificuldade, resumo, dados+fontes,
   repertórios legitimados, jeito de lembrar, roteiro de
   argumentação e exemplo de proposta de intervenção.

   Base: temas já cobrados (2015–2025) + tendências 2026 segundo
   cursos preparatórios. Repertórios (leis, autores, obras) são
   reais; os dados são referências de estudo — confira sempre em
   fontes oficiais (IBGE, OMS/OPAS, ONU, Inep, DataSUS) antes da
   prova, pois números mudam.
   ============================================================ */
window.ENEM_TEMAS = {
  disclaimer: "As etiquetas de probabilidade são apostas de estudo (o Inep mantém sigilo). Treine temas variados. Leis, autores e obras citados são reais; os números são referências — confirme em fontes oficiais.",

  // temas já cobrados recentemente (para você NÃO apostar neles)
  jaCairam: [
    "2025 — Perspectivas do envelhecimento na sociedade brasileira",
    "2024 — Valorização da herança africana no Brasil",
    "2023 — Invisibilidade do trabalho de cuidado realizado pela mulher",
    "2022 — Valorização de comunidades e povos tradicionais",
    "2021 — Invisibilidade e registro civil",
    "2020 — Estigma associado às doenças mentais",
    "2019 — Democratização do acesso ao cinema",
    "2018 — Manipulação do usuário pelo controle de dados na internet",
    "2017 — Formação educacional de surdos",
    "2016 — Caminhos para combater a intolerância religiosa",
    "2015 — A persistência da violência contra a mulher"
  ],

  probabilidades: {
    "quase-certo": { rotulo: "Quase certo", emoji: "🔥", chip: "vermelho" },
    "muito-provavel": { rotulo: "Muito provável", emoji: "⭐", chip: "amarelo" },
    "provavel": { rotulo: "Provável", emoji: "📈", chip: "azul" },
    "pouco-provavel": { rotulo: "Pouco provável", emoji: "🌱", chip: "cinza" }
  },

  temas: [
    /* ========== QUASE CERTO ========== */
    {
      id: "t-desinformacao", titulo: "Combate à desinformação e às fake news nas redes sociais",
      eixo: "Tecnologia e Democracia", probabilidade: "quase-certo", dificuldade: "Médio",
      porque: "Tema campeão das apostas para 2026: liga-se a eleições, IA generativa e à (não) regulação das plataformas. É atual, social e de fácil repertório.",
      resumo: "A disseminação de informações falsas em escala industrial, turbinada por algoritmos e IA, ameaça a democracia, a saúde pública e a coesão social. Discuta causas (modelo de negócio do engajamento, bolhas) e caminhos de enfrentamento (regulação, educação midiática).",
      dados: [
        { texto: "O Marco Civil da Internet (Lei 12.965/2014) e a LGPD (Lei 13.709/2018) regem o uso da rede, mas não tratam diretamente da moderação de conteúdo.", fonte: "Legislação brasileira" },
        { texto: "O PL 2630 ('PL das Fake News') foi amplamente debatido no Congresso como tentativa de responsabilizar plataformas — referência do debate sobre regulação.", fonte: "Câmara dos Deputados" },
        { texto: "A OMS cunhou o termo 'infodemia' para o excesso de informação (muita dela falsa) durante a pandemia de Covid-19.", fonte: "OMS" },
        { texto: "Estudo do MIT publicado na revista Science (Vosoughi, Roy e Aral, 2018) mostrou que notícias falsas tinham cerca de 70% mais chance de serem compartilhadas no Twitter do que as verdadeiras.", fonte: "Science / MIT, 2018" }
      ],
      repertorios: [
        { ref: "George Orwell, '1984'", uso: "A manipulação da verdade e o controle da informação ('quem controla o passado controla o futuro')." },
        { ref: "Byung-Chul Han, 'Infocracia'", uso: "O regime da informação e a crise da democracia na era digital." },
        { ref: "Hannah Arendt", uso: "A mentira organizada e a destruição do senso comum ameaçam a esfera pública." }
      ],
      lembrar: "Pense em 'VERDADE EM RISCO': Vigilância (algoritmos), Engajamento (lucro com a mentira), Regulação (PL 2630), Desinformação, Educação midiática.",
      argumentos: [
        "D1 — CAUSA: o modelo de negócio das plataformas premia o engajamento, e conteúdos falsos/polêmicos engajam mais; algoritmos criam bolhas que reforçam crenças (câmaras de eco).",
        "D2 — CONSEQUÊNCIA: a desinformação corrói a democracia (manipulação eleitoral) e a saúde pública (negacionismo de vacinas), minando a confiança nas instituições."
      ],
      tese: "A desinformação, impulsionada pela lógica do engajamento e pela ausência de regulação efetiva, configura-se como grave ameaça à democracia brasileira.",
      proposta: "O Ministério da Educação (AGENTE) deve inserir a educação midiática no currículo (AÇÃO), por meio de programas que ensinem a checar fontes e identificar manchetes falsas (MEIO), a fim de formar cidadãos críticos e resistentes à manipulação (FINALIDADE), em parceria com agências de checagem e plataformas (DETALHAMENTO)."
    },
    {
      id: "t-ia-trabalho", titulo: "Os impactos da inteligência artificial no mundo do trabalho",
      eixo: "Tecnologia e Trabalho", probabilidade: "quase-certo", dificuldade: "Difícil",
      porque: "A IA generativa explodiu em 2023–2026 e domina o debate sobre emprego, criatividade e regulação. Exige repertório um pouco mais sofisticado.",
      resumo: "A automação por IA transforma profissões, ameaça postos de trabalho e levanta debates sobre requalificação, direitos e regulação. Equilibre os ganhos de produtividade com a proteção do trabalhador e a desigualdade.",
      dados: [
        { texto: "O Marco Legal da IA (PL 2338/2023) foi aprovado pelo Senado em dezembro de 2024 e tramita na Câmara desde março de 2025, ainda sem votação final (situação em out/2026) — mostra que a regulação ainda não acompanha a tecnologia.", fonte: "Senado Federal / Câmara dos Deputados" },
        { texto: "A Constituição de 1988 (art. 6º) garante o trabalho como direito social; a automação desafia esse direito.", fonte: "Constituição Federal" },
        { texto: "A 4ª Revolução Industrial (indústria 4.0) é marcada por IA, automação e análise de dados em massa.", fonte: "Fórum Econômico Mundial" }
      ],
      repertorios: [
        { ref: "Yuval Noah Harari, 'Homo Deus' / '21 Lições'", uso: "O surgimento de uma possível 'classe inútil' sem requalificação diante da automação." },
        { ref: "Charles Chaplin, 'Tempos Modernos' (1936)", uso: "A desumanização do trabalhador diante da máquina — relido para a era da IA." },
        { ref: "Revolução Industrial e o ludismo (séc. XIX)", uso: "Trabalhadores ingleses destruíam máquinas por medo do desemprego: mostra que a tensão entre tecnologia e emprego é histórica e exige políticas de transição." }
      ],
      lembrar: "Mnemônico 'IA = Impacto + Adaptação': metade ameaça (desemprego), metade oportunidade (requalificação). Sempre proponha EDUCAÇÃO/requalificação.",
      argumentos: [
        "D1 — CONSEQUÊNCIA: a automação elimina tarefas repetitivas e ameaça empregos, aprofundando a desigualdade entre quem domina a tecnologia e quem é substituído por ela.",
        "D2 — CAMINHO: sem políticas de requalificação profissional e regulação, os ganhos de produtividade concentram-se em poucas empresas, não na sociedade."
      ],
      tese: "A ausência de políticas de requalificação e de regulação da inteligência artificial pode transformar o avanço tecnológico em motor de desemprego e desigualdade.",
      proposta: "O Ministério do Trabalho (AGENTE) deve criar programas de requalificação profissional (AÇÃO), por meio de parcerias com escolas técnicas e plataformas de ensino gratuitas (MEIO), a fim de preparar trabalhadores para as novas funções geradas pela IA (FINALIDADE), com bolsas de incentivo para populações de baixa renda (DETALHAMENTO)."
    },
    {
      id: "t-saude-mental-jovens", titulo: "Desafios para a promoção da saúde mental dos jovens no Brasil",
      eixo: "Saúde Pública", probabilidade: "quase-certo", dificuldade: "Médio",
      porque: "Aposta forte e recorrente, com recorte NOVO (jovens + redes sociais), diferente de 2020 (estigma das doenças mentais). Ansiedade e burnout são pauta constante.",
      resumo: "Ansiedade, depressão e burnout crescem entre jovens, pressionados por redes sociais, cobrança por produtividade e hiperconexão. Discuta causas sociais e a fragilidade do cuidado em saúde mental.",
      dados: [
        { texto: "Segundo a OMS (2017), o Brasil tem a maior prevalência de transtornos de ansiedade do mundo: 9,3% da população.", fonte: "OMS, 2017" },
        { texto: "A OMS classifica o burnout (esgotamento profissional) como fenômeno ocupacional na CID-11 (em vigor desde 2022).", fonte: "OMS" },
        { texto: "A Constituição (art. 196) garante a saúde como direito de todos e dever do Estado, incluindo a saúde mental via SUS (CAPS).", fonte: "Constituição / SUS" },
        { texto: "O 'Setembro Amarelo' é a campanha nacional de prevenção ao suicídio, indicando a relevância do tema.", fonte: "CVV / CFM" }
      ],
      repertorios: [
        { ref: "Byung-Chul Han, 'Sociedade do Cansaço'", uso: "A autoexploração e a cobrança por desempenho adoecem o indivíduo contemporâneo." },
        { ref: "Jonathan Haidt, 'A Geração Ansiosa' (2024)", uso: "Reúne pesquisas que ligam a infância passada no celular ao aumento de ansiedade e depressão em adolescentes." },
        { ref: "Documentário 'O Dilema das Redes' (2020)", uso: "O design viciante das redes sociais e seu impacto na autoestima dos jovens." }
      ],
      lembrar: "'CANSAÇO digital': Cobrança, Autoexploração (Byung-Chul Han), Nocividade das redes, SUS/CAPS como solução. Foque na proposta de rede de apoio.",
      argumentos: [
        "D1 — CAUSA: a cultura da hiperprodutividade e a comparação constante nas redes sociais geram ansiedade e sensação de inadequação nos jovens.",
        "D2 — CONSEQUÊNCIA/FALHA: o acesso ao cuidado psicológico é desigual; faltam profissionais e estrutura (CAPS) para a demanda crescente."
      ],
      tese: "A pressão por produtividade e a influência nociva das redes sociais, somadas à carência de atendimento psicológico, agravam a crise de saúde mental entre os jovens brasileiros.",
      proposta: "O Ministério da Saúde, em parceria com o da Educação (AGENTE), deve ampliar o atendimento psicológico nas escolas e nos CAPS (AÇÃO), por meio de contratação de profissionais e telemedicina (MEIO), a fim de acolher e tratar jovens em sofrimento (FINALIDADE), com campanhas de combate ao estigma (DETALHAMENTO)."
    },

    /* ========== MUITO PROVÁVEL ========== */
    {
      id: "t-apostas", titulo: "Caminhos para conter os danos das apostas esportivas (bets) no Brasil",
      eixo: "Economia e Comportamento", probabilidade: "muito-provavel", dificuldade: "Médio",
      porque: "Explosão das 'bets' em 2024–2025, com publicidade massiva, endividamento e vício. Tema novíssimo e socialmente urgente.",
      resumo: "A popularização das apostas online, impulsionada por publicidade e influenciadores, gera endividamento, vício e impactos na saúde mental, sobretudo entre os mais pobres. Discuta regulação e conscientização.",
      dados: [
        { texto: "A Lei 14.790/2023 regulamentou as apostas de quota fixa (bets) no Brasil, com regras de publicidade e tributação.", fonte: "Legislação brasileira" },
        { texto: "O Código de Defesa do Consumidor (Lei 8.078/1990) protege contra publicidade abusiva.", fonte: "CDC" },
        { texto: "O jogo patológico ('transtorno do jogo') é reconhecido como doença pela OMS na CID-11.", fonte: "OMS" },
        { texto: "Nota técnica do Banco Central (set/2024) estimou que beneficiários do Bolsa Família transferiram cerca de R$ 3 bilhões a empresas de apostas via Pix só em agosto de 2024.", fonte: "Banco Central do Brasil, 2024" }
      ],
      repertorios: [
        { ref: "Zygmunt Bauman, 'Vida para Consumo'", uso: "A lógica do consumo e do imediatismo que transforma pessoas em apostadoras compulsivas." },
        { ref: "Escola de Frankfurt (Adorno/Horkheimer), Indústria Cultural", uso: "A publicidade massiva manipula desejos e normaliza o comportamento de risco." }
      ],
      lembrar: "'APOSTA alta': Abuso publicitário, Pobreza atingida, Ocio/vício (ludomania), Saúde mental, Tributação/regulação, Ação educativa.",
      argumentos: [
        "D1 — CAUSA: a publicidade onipresente (atletas, influenciadores) associa apostas a dinheiro fácil e normaliza o risco, atingindo jovens e famílias endividadas.",
        "D2 — CONSEQUÊNCIA: o vício em apostas gera endividamento, destruição de famílias e sobrecarga da saúde pública com transtornos associados."
      ],
      tese: "A publicidade abusiva e a frágil fiscalização das apostas online favorecem o endividamento e o vício, especialmente entre a população vulnerável.",
      proposta: "O Ministério da Fazenda, junto ao da Saúde (AGENTE), deve restringir a publicidade de apostas e financiar tratamento à ludomania (AÇÃO), por meio de fiscalização e campanhas educativas (MEIO), a fim de reduzir o endividamento e proteger os vulneráveis (FINALIDADE), destinando parte da arrecadação a programas de prevenção (DETALHAMENTO)."
    },
    {
      id: "t-clima", titulo: "Enfrentamento da crise climática e dos eventos extremos no Brasil",
      eixo: "Meio Ambiente", probabilidade: "muito-provavel", dificuldade: "Médio",
      porque: "Enchentes (RS, 2024), secas e ondas de calor tornaram o tema urgente; o Brasil sedia debates climáticos. Forte apelo socioambiental.",
      resumo: "O aumento de enchentes, secas e ondas de calor expõe a vulnerabilidade de comunidades pobres (racismo ambiental). Relacione mudança climática, desigualdade e necessidade de adaptação das cidades.",
      dados: [
        { texto: "O Acordo de Paris (2015) busca limitar o aquecimento global a bem menos de 2°C, com esforços para não passar de 1,5°C em relação à era pré-industrial; o Brasil é signatário.", fonte: "ONU" },
        { texto: "O IPCC (6º Relatório, 2021–2023) afirma que é inequívoco que a ação humana aqueceu a atmosfera, os oceanos e a terra.", fonte: "IPCC" },
        { texto: "A Política Nacional sobre Mudança do Clima (Lei 12.187/2009) orienta ações nacionais.", fonte: "Legislação brasileira" },
        { texto: "As enchentes no Rio Grande do Sul em 2024 são exemplo concreto de evento climático extremo com impacto social.", fonte: "Defesa Civil / imprensa" }
      ],
      repertorios: [
        { ref: "Ailton Krenak, 'Ideias para Adiar o Fim do Mundo'", uso: "A crítica à relação predatória com a natureza e a defesa de outros modos de viver." },
        { ref: "Conceito de 'racismo ambiental'", uso: "Os impactos ambientais atingem desproporcionalmente as populações pobres e periféricas." },
        { ref: "ODS 13 (Agenda 2030, ONU)", uso: "Ação contra a mudança global do clima como meta internacional." }
      ],
      lembrar: "'CLIMA injusto': Catástrofes (enchentes/secas), Localização (periferia sofre mais), Injustiça/racismo ambiental, Metas (Acordo de Paris), Adaptação urbana.",
      argumentos: [
        "D1 — CAUSA/DESIGUALDADE: comunidades em áreas de risco (encostas, margens) sofrem mais com eventos extremos — é o racismo ambiental.",
        "D2 — FALHA ESTRUTURAL: a falta de planejamento urbano e de políticas de adaptação agrava os desastres e a perda de vidas."
      ],
      tese: "A crise climática, somada à desigualdade urbana, torna as populações vulneráveis as maiores vítimas dos eventos extremos no Brasil.",
      proposta: "O Ministério das Cidades, com os municípios (AGENTE), deve investir em infraestrutura de adaptação climática (AÇÃO), por meio de drenagem, reflorestamento urbano e realocação de moradias em risco (MEIO), a fim de proteger as comunidades vulneráveis (FINALIDADE), priorizando as áreas periféricas mais afetadas (DETALHAMENTO)."
    },
    {
      id: "t-etarismo", titulo: "Combate ao etarismo e valorização da pessoa idosa no mercado de trabalho",
      eixo: "Desigualdade e Minorias", probabilidade: "muito-provavel", dificuldade: "Médio",
      porque: "O Brasil envelhece rápido; etarismo é recorte NOVO e específico (diferente do tema geral de 2025). Boa base legal.",
      resumo: "O preconceito etário exclui idosos do mercado e da vida social, num país que envelhece aceleradamente. Discuta a invisibilidade, os direitos e o potencial produtivo da pessoa idosa.",
      dados: [
        { texto: "O Estatuto da Pessoa Idosa (Lei 10.741/2003 — nome atualizado pela Lei 14.423/2022) garante direitos e proíbe a discriminação por idade.", fonte: "Legislação brasileira" },
        { texto: "Censo 2022: pessoas com 65 anos ou mais já são 10,9% da população (22,2 milhões) — alta de 57,4% em relação a 2010, o maior percentual da história.", fonte: "IBGE, Censo 2022" },
        { texto: "A Constituição (art. 230) determina que família, sociedade e Estado amparem as pessoas idosas.", fonte: "Constituição Federal" }
      ],
      repertorios: [
        { ref: "Simone de Beauvoir, 'A Velhice'", uso: "A sociedade trata o idoso como um ser à margem, negando-lhe lugar e valor." },
        { ref: "Estatuto da Pessoa Idosa", uso: "Marco legal que, apesar de existir, não impede o preconceito cotidiano." }
      ],
      lembrar: "'IDADE não apaga valor': Invisibilidade, Direitos (Estatuto da Pessoa Idosa), Autonomia, Discriminação (etarismo), Experiência desperdiçada. Dado-âncora: 10,9% têm 65+ (Censo 2022).",
      argumentos: [
        "D1 — CAUSA: a cultura que associa produtividade à juventude gera o etarismo, excluindo idosos do trabalho e reforçando estereótipos.",
        "D2 — CONSEQUÊNCIA: a sociedade desperdiça a experiência da população idosa e condena muitos à solidão e à dependência."
      ],
      tese: "O etarismo, enraizado na supervalorização da juventude, nega à pessoa idosa seu direito ao trabalho e à participação social plena.",
      proposta: "O Ministério do Trabalho (AGENTE) deve incentivar a contratação e permanência de idosos (AÇÃO), por meio de benefícios fiscais a empresas e programas de requalificação (MEIO), a fim de combater o etarismo e aproveitar sua experiência (FINALIDADE), aliado a campanhas de valorização da pessoa idosa (DETALHAMENTO)."
    },
    {
      id: "t-violencia-mulher", titulo: "O enfrentamento à violência contra a mulher na era digital",
      eixo: "Desigualdade e Minorias", probabilidade: "muito-provavel", dificuldade: "Médio",
      porque: "Violência contra a mulher caiu em 2015, mas o recorte digital (violência online, nudes, perseguição) é novo e muito atual.",
      resumo: "Além da violência física, cresce a violência digital contra mulheres: exposição íntima não consentida, perseguição (stalking) e discurso de ódio. Articule as formas de violência e a cultura machista.",
      dados: [
        { texto: "A Lei Maria da Penha (Lei 11.340/2006) é referência mundial no combate à violência doméstica.", fonte: "Legislação brasileira" },
        { texto: "O feminicídio, criado como qualificadora pela Lei 13.104/2015, virou crime autônomo com a Lei 14.994/2024 (art. 121-A do Código Penal), com pena de 20 a 40 anos.", fonte: "Legislação brasileira" },
        { texto: "No ambiente digital: Lei 12.737/2012 (invasão de dispositivo), Lei 13.718/2018 (divulgação de cena de nudez sem consentimento) e Lei 14.132/2021 (crime de perseguição/stalking).", fonte: "Legislação brasileira" },
        { texto: "O Anuário Brasileiro de Segurança Pública registrou 1.571 feminicídios em 2025 (edição de jul/2026), recorde da série — mesmo com queda das mortes violentas em geral.", fonte: "Fórum Brasileiro de Segurança Pública" }
      ],
      repertorios: [
        { ref: "Simone de Beauvoir, 'O Segundo Sexo'", uso: "'Ninguém nasce mulher, torna-se mulher' — a construção social que legitima a opressão." },
        { ref: "Maria da Penha Maia Fernandes", uso: "Sobreviveu a duas tentativas de assassinato pelo então marido (1983); sua luta por justiça, levada à Comissão Interamericana de Direitos Humanos (OEA), originou a Lei 11.340/2006." },
        { ref: "Série 'Adolescência' (Netflix, 2025)", uso: "Mostra como a misoginia propagada online alcança meninos — liga violência de gênero e ambiente digital." }
      ],
      lembrar: "'ESCUDO legal': Maria da Penha (2006, doméstica) → Feminicídio (2015, virou crime autônomo em 2024) → Stalking (2021) → nudez sem consentimento (2018). Causa-raiz = cultura machista.",
      argumentos: [
        "D1 — CAUSA: a cultura machista naturaliza o controle sobre a mulher, agora estendido ao ambiente digital (vigilância, exposição, ameaças).",
        "D2 — FALHA: a sensação de impunidade e a dificuldade de denunciar crimes virtuais perpetuam a violência."
      ],
      tese: "A cultura machista, transposta para o ambiente digital, cria novas formas de violência contra a mulher que exigem resposta do Estado e da sociedade.",
      proposta: "O Poder Judiciário, com a Polícia Civil (AGENTE), deve ampliar delegacias virtuais especializadas (AÇÃO), por meio de canais digitais de denúncia e capacitação de agentes (MEIO), a fim de acolher vítimas e punir agressores (FINALIDADE), com campanhas educativas sobre respeito e consentimento nas escolas (DETALHAMENTO)."
    },
    {
      id: "t-neurodivergentes", titulo: "Desafios para a inclusão de pessoas neurodivergentes no Brasil",
      eixo: "Inclusão e Diversidade", probabilidade: "muito-provavel", dificuldade: "Difícil",
      porque: "Autismo e TDAH ganharam enorme visibilidade; inclusão é pauta frequente do ENEM. Exige repertório específico e cuidado.",
      resumo: "Pessoas autistas, com TDAH e outras neurodivergências enfrentam barreiras na escola, no trabalho e no acesso ao diagnóstico. Discuta o capacitismo e a necessidade de adaptação da sociedade.",
      dados: [
        { texto: "A Lei Berenice Piana (Lei 12.764/2012) institui a Política Nacional de Proteção dos Direitos da Pessoa com TEA, equiparando-a à pessoa com deficiência.", fonte: "Legislação brasileira" },
        { texto: "O Estatuto da Pessoa com Deficiência (Lei 13.146/2015) garante inclusão e acessibilidade.", fonte: "Legislação brasileira" },
        { texto: "A Constituição (art. 208) assegura atendimento educacional especializado às pessoas com deficiência.", fonte: "Constituição Federal" }
      ],
      repertorios: [
        { ref: "Conceito de 'capacitismo'", uso: "O preconceito que considera a pessoa com deficiência/neurodivergência incapaz." },
        { ref: "Modelo social da deficiência", uso: "A deficiência está nas barreiras da sociedade, não apenas no indivíduo." },
        { ref: "Série 'Atypical' (Netflix, 2017–2021)", uso: "Acompanha um jovem autista em busca de autonomia e expõe barreiras de inclusão na escola e no trabalho." }
      ],
      lembrar: "'INCLUIR de verdade': Identificação/diagnóstico, Normas (Lei Berenice Piana), Capacitismo (combater), Laços sociais, Universidade/escola adaptada, Inserção no trabalho, Respeito.",
      argumentos: [
        "D1 — BARREIRA: a falta de preparo de escolas e empresas e a demora no diagnóstico excluem pessoas neurodivergentes.",
        "D2 — CAPACITISMO: estereótipos tratam a neurodivergência como incapacidade, negando potencial e autonomia."
      ],
      tese: "O capacitismo e a ausência de estruturas adaptadas impedem a plena inclusão das pessoas neurodivergentes na sociedade brasileira.",
      proposta: "O Ministério da Educação (AGENTE) deve capacitar professores e adaptar escolas para a neurodiversidade (AÇÃO), por meio de formação continuada e profissionais de apoio (MEIO), a fim de garantir aprendizagem e inclusão (FINALIDADE), aliado a campanhas de combate ao capacitismo (DETALHAMENTO)."
    },

    /* ========== PROVÁVEL ========== */
    {
      id: "t-privacidade-dados", titulo: "Proteção de dados pessoais e privacidade na era digital",
      eixo: "Tecnologia e Cidadania", probabilidade: "provavel", dificuldade: "Difícil",
      porque: "O controle de dados caiu em 2018, mas o avanço da IA e do 'capitalismo de vigilância' reabre o recorte com novo fôlego.",
      resumo: "Empresas e Estados coletam dados em massa, criando um 'capitalismo de vigilância'. Discuta privacidade como direito, manipulação de comportamento e o papel da LGPD.",
      dados: [
        { texto: "A LGPD (Lei 13.709/2018) regula o tratamento de dados pessoais no Brasil.", fonte: "Legislação brasileira" },
        { texto: "A proteção de dados foi incluída como direito fundamental na Constituição (EC 115/2022).", fonte: "Constituição Federal" }
      ],
      repertorios: [
        { ref: "Shoshana Zuboff, 'A Era do Capitalismo de Vigilância'", uso: "A transformação da experiência humana em dado e mercadoria." },
        { ref: "Michel Foucault, 'Vigiar e Punir'", uso: "O panóptico como metáfora da vigilância constante — hoje, digital." },
        { ref: "George Orwell, '1984'", uso: "O 'Grande Irmão' e a vigilância total." }
      ],
      lembrar: "'DADO é poder': Dados coletados, Algoritmos manipulam, Direito (LGPD), Orwell/panóptico. Proposta = fiscalização da ANPD.",
      argumentos: [
        "D1 — CONSEQUÊNCIA: a coleta massiva de dados permite manipular comportamento (consumo, voto) e expõe cidadãos a vazamentos e golpes.",
        "D2 — FALHA: o desconhecimento dos usuários e a fiscalização limitada enfraquecem a proteção prevista em lei."
      ],
      tese: "A exploração de dados pessoais sem transparência ameaça a privacidade e a autonomia dos cidadãos na era digital.",
      proposta: "A Autoridade Nacional de Proteção de Dados (AGENTE) deve intensificar a fiscalização das empresas (AÇÃO), por meio de auditorias e multas, somadas à educação digital (MEIO), a fim de garantir o direito à privacidade (FINALIDADE), exigindo linguagem clara nos termos de uso (DETALHAMENTO)."
    },
    {
      id: "t-fome", titulo: "O combate à insegurança alimentar e à fome no Brasil",
      eixo: "Desigualdade Social", probabilidade: "provavel", dificuldade: "Médio",
      porque: "A volta do Brasil ao Mapa da Fome e a desigualdade mantêm o tema vivo. Repertório clássico e forte (Josué de Castro).",
      resumo: "Milhões de brasileiros convivem com insegurança alimentar, num país que é grande produtor agrícola — o paradoxo da fome. Discuta desigualdade, acesso e políticas públicas.",
      dados: [
        { texto: "A alimentação é direito social na Constituição (art. 6º).", fonte: "Constituição Federal" },
        { texto: "Segundo o relatório SOFI 2025 da FAO/ONU (jul/2025), o Brasil saiu novamente do Mapa da Fome (menos de 2,5% da população subnutrida, média 2022–2024) — havia saído em 2014 e retornado no período de 2018 a 2020. O SOFI 2026 manteve o país fora.", fonte: "FAO / ONU" },
        { texto: "Programas como o Bolsa Família e a merenda escolar são políticas de segurança alimentar.", fonte: "Governo Federal" }
      ],
      repertorios: [
        { ref: "Josué de Castro, 'Geografia da Fome'", uso: "A fome é um problema social e político, não natural." },
        { ref: "Conceito de 'desertos alimentares'", uso: "Áreas urbanas pobres sem acesso a alimentos saudáveis e baratos." }
      ],
      lembrar: "'FOME tem endereço': produtor agrícola x povo com fome (paradoxo), Josué de Castro, desertos alimentares, políticas (merenda/Bolsa Família). Dado-âncora: saída do Mapa da Fome (FAO, 2025) mostra que política pública funciona — mas a insegurança alimentar ainda existe.",
      argumentos: [
        "D1 — PARADOXO: o Brasil é potência agrícola, mas a concentração de renda e a desigualdade impedem o acesso à comida.",
        "D2 — CONSEQUÊNCIA: a fome compromete saúde, aprendizagem e dignidade, perpetuando o ciclo da pobreza."
      ],
      tese: "A insegurança alimentar no Brasil resulta não da falta de produção, mas da desigualdade no acesso ao alimento.",
      proposta: "O Ministério do Desenvolvimento Social (AGENTE) deve fortalecer programas de transferência de renda e agricultura familiar (AÇÃO), por meio de verbas e compras públicas de alimentos (MEIO), a fim de garantir segurança alimentar (FINALIDADE), com atenção especial aos desertos alimentares urbanos (DETALHAMENTO)."
    },
    {
      id: "t-professor", titulo: "Caminhos para a valorização do professor na educação básica",
      eixo: "Educação", probabilidade: "provavel", dificuldade: "Fácil",
      porque: "Tema clássico de educação (caiu como PPL em 2015); a falta de professores e a baixa atratividade da carreira o mantêm atual.",
      resumo: "Baixos salários, violência e desprestígio afastam jovens da docência, ameaçando o futuro da educação. Discuta a importância social do professor e a precarização da carreira.",
      dados: [
        { texto: "A educação é direito de todos e dever do Estado e da família (Constituição, art. 205).", fonte: "Constituição Federal" },
        { texto: "A LDB (Lei 9.394/1996) e o piso salarial nacional (Lei 11.738/2008) regem a carreira docente.", fonte: "Legislação brasileira" },
        { texto: "Censo 2022: a taxa de analfabetismo das pessoas com 15 anos ou mais foi de 7,0% (era 9,6% em 2010).", fonte: "IBGE, Censo 2022" }
      ],
      repertorios: [
        { ref: "Paulo Freire, 'Pedagogia da Autonomia'", uso: "O professor como agente de transformação e emancipação." },
        { ref: "Darcy Ribeiro (frase atribuída)", uso: "'A crise da educação no Brasil não é uma crise; é um projeto' — a negligência como escolha política." }
      ],
      lembrar: "'PROF em crise': Piso (salário), Respeito/violência, Oferta (faltam professores), Formação, Freire/Darcy Ribeiro.",
      argumentos: [
        "D1 — CAUSA: salários baixos, violência e desprestígio social desestimulam a carreira, gerando falta de professores.",
        "D2 — CONSEQUÊNCIA: sem valorização docente, a qualidade do ensino cai e perpetua-se a desigualdade educacional."
      ],
      tese: "A desvalorização do professor, expressa em salários baixos e desprestígio, compromete a qualidade da educação básica brasileira.",
      proposta: "O Ministério da Educação, com estados e municípios (AGENTE), deve valorizar a carreira docente (AÇÃO), por meio do cumprimento do piso salarial, planos de carreira e formação continuada (MEIO), a fim de atrair e reter bons profissionais (FINALIDADE), aliado a campanhas de reconhecimento social do professor (DETALHAMENTO)."
    },
    {
      id: "t-saneamento", titulo: "Desafios para a universalização do saneamento básico no Brasil",
      eixo: "Saúde e Infraestrutura", probabilidade: "provavel", dificuldade: "Médio",
      porque: "Milhões sem esgoto/água tratada; o Marco do Saneamento mantém o debate aquecido. Ligado a saúde e desigualdade.",
      resumo: "A falta de água tratada e esgoto atinge milhões, causando doenças e mortes evitáveis, sobretudo nas periferias. Relacione saneamento, saúde e desigualdade regional.",
      dados: [
        { texto: "O Marco Legal do Saneamento (Lei 14.026/2020) fixou a meta de, até 2033, levar água potável a 99% da população e coleta e tratamento de esgoto a 90%.", fonte: "Legislação brasileira" },
        { texto: "A saúde é direito social (Constituição, art. 6º e 196), e o saneamento é determinante da saúde pública.", fonte: "Constituição Federal" },
        { texto: "Doenças de veiculação hídrica (diarreia, hepatite A, verminoses) estão ligadas à falta de saneamento.", fonte: "Ministério da Saúde" }
      ],
      repertorios: [
        { ref: "Objetivo de Desenvolvimento Sustentável 6 (ONU)", uso: "Água potável e saneamento como meta global até 2030." },
        { ref: "Oswaldo Cruz e a Revolta da Vacina (1904)", uso: "As campanhas sanitárias no Rio de Janeiro mostram, desde o início do século XX, que saneamento é questão de saúde pública — e que exige diálogo com a população." }
      ],
      lembrar: "'ÁGUA e vida': Acesso desigual, meta 2033 (Marco), doenças evitáveis, periferia. Saneamento = saúde = cidadania.",
      argumentos: [
        "D1 — CONSEQUÊNCIA: a ausência de esgoto e água tratada causa doenças evitáveis e sobrecarrega o SUS.",
        "D2 — DESIGUALDADE: periferias e áreas rurais são as mais afetadas, aprofundando a injustiça social."
      ],
      tese: "A falta de saneamento básico no Brasil, marcada por desigualdade regional, compromete a saúde e a dignidade de milhões.",
      proposta: "O Ministério das Cidades (AGENTE) deve acelerar as obras de saneamento (AÇÃO), por meio de investimento público e parcerias, priorizando regiões carentes (MEIO), a fim de reduzir doenças e promover dignidade (FINALIDADE), com fiscalização das metas do Marco Legal (DETALHAMENTO)."
    },
    {
      id: "t-racismo", titulo: "Caminhos para combater o racismo estrutural no Brasil",
      eixo: "Desigualdade e Minorias", probabilidade: "provavel", dificuldade: "Médio",
      porque: "Pauta recorrente e central; herança africana caiu em 2024, mas o racismo estrutural como recorte segue possível.",
      resumo: "O racismo no Brasil é estrutural: molda oportunidades, renda, violência e representação. Discuta suas raízes históricas (escravidão) e manifestações atuais.",
      dados: [
        { texto: "Censo 2022: pela primeira vez, os pardos são o maior grupo (45,3%); somados aos pretos (10,2%), a população negra é 55,5% dos brasileiros.", fonte: "IBGE, Censo 2022" },
        { texto: "A Lei 7.716/1989 define os crimes de racismo; a Lei 14.532/2023 equiparou a injúria racial ao racismo (imprescritível e inafiançável).", fonte: "Legislação brasileira" },
        { texto: "A Lei 10.639/2003 tornou obrigatório o ensino de história e cultura afro-brasileira (ampliada pela Lei 11.645/2008 para incluir a indígena); a Lei de Cotas (12.711/2012) foi atualizada pela Lei 14.723/2023.", fonte: "Legislação brasileira" }
      ],
      repertorios: [
        { ref: "Conceito de 'racismo estrutural' (Silvio Almeida, 2019)", uso: "O racismo como regra que organiza a sociedade, não exceção." },
        { ref: "Florestan Fernandes, 'A integração do negro na sociedade de classes'", uso: "A abolição sem inclusão relegou a população negra à margem da sociedade de classes." },
        { ref: "Djamila Ribeiro, 'Lugar de Fala'", uso: "A importância de dar protagonismo às vozes negras." },
        { ref: "Abdias do Nascimento", uso: "A denúncia do 'genocídio do negro brasileiro' e a luta por direitos." }
      ],
      lembrar: "'RAÍZ histórica': escravidão → desigualdade atual. Leis: 10.639 (ensino), Cotas, 14.532 (injúria=racismo). Silvio Almeida.",
      argumentos: [
        "D1 — RAIZ HISTÓRICA: a escravidão e a abolição sem inclusão criaram desigualdades que persistem (renda, educação, violência).",
        "D2 — MANIFESTAÇÃO ATUAL: o racismo estrutural se expressa na sub-representação e na violência contra a população negra."
      ],
      tese: "Herdado da escravidão e mantido por estruturas sociais, o racismo no Brasil perpetua desigualdades que exigem políticas afirmativas.",
      proposta: "O Ministério da Educação (AGENTE) deve fortalecer o cumprimento da Lei 10.639/2003 e as políticas afirmativas (AÇÃO), por meio de formação de professores e fiscalização (MEIO), a fim de combater o racismo e valorizar a cultura negra (FINALIDADE), aliado a campanhas antirracistas (DETALHAMENTO)."
    },
    {
      id: "t-inclusao-digital", titulo: "Desafios para a inclusão digital no Brasil",
      eixo: "Tecnologia e Cidadania", probabilidade: "provavel", dificuldade: "Fácil",
      porque: "A desigualdade de acesso à internet e a equipamentos ficou evidente na pandemia; tema acessível e atual.",
      resumo: "A exclusão digital aprofunda desigualdades no acesso à educação, ao trabalho e a serviços. Discuta o 'apartheid digital' e a conectividade como direito.",
      dados: [
        { texto: "O Marco Civil da Internet (Lei 12.965/2014) prevê o acesso à internet como essencial ao exercício da cidadania.", fonte: "Legislação brasileira" },
        { texto: "TIC Domicílios 2024 (Cetic.br): 84% dos brasileiros com 10 anos ou mais usam internet (cerca de 159 milhões) — mas 86% na área urbana contra 76% na rural.", fonte: "Cetic.br, 2024" },
        { texto: "A pandemia de Covid-19 evidenciou a exclusão digital no ensino remoto.", fonte: "Contexto recente" }
      ],
      repertorios: [
        { ref: "Milton Santos, 'meio técnico-científico-informacional'", uso: "A técnica e a informação definem o espaço — e quem fica de fora." },
        { ref: "Conceito de 'exclusão/apartheid digital'", uso: "A divisão entre conectados e desconectados aprofunda a desigualdade." }
      ],
      lembrar: "'CLIQUE que exclui': Conectividade desigual, Localização (rural/periferia), Instrução (saber usar), Milton Santos, Educação remota.",
      argumentos: [
        "D1 — CONSEQUÊNCIA: sem internet e equipamentos, milhões ficam excluídos de educação, trabalho e serviços públicos digitais.",
        "D2 — DESIGUALDADE: a exclusão atinge mais pobres, população rural e idosos, ampliando a distância social."
      ],
      tese: "A desigualdade no acesso à internet configura um apartheid digital que aprofunda as demais exclusões sociais no Brasil.",
      proposta: "O Ministério das Comunicações (AGENTE) deve expandir a conectividade e doar equipamentos (AÇÃO), por meio de internet pública em escolas e regiões remotas (MEIO), a fim de democratizar o acesso digital (FINALIDADE), com oficinas de letramento digital para idosos (DETALHAMENTO)."
    },
    {
      id: "t-trabalho-escravo", titulo: "O combate ao trabalho análogo à escravidão no Brasil",
      eixo: "Direitos Humanos", probabilidade: "provavel", dificuldade: "Difícil",
      porque: "Resgates recorrentes (inclusive em setores urbanos e no campo) mantêm o tema vivo; exige repertório jurídico.",
      resumo: "O trabalho escravo contemporâneo persiste no campo e nas cidades, violando a dignidade humana. Discuta suas causas (pobreza, impunidade) e o papel da fiscalização.",
      dados: [
        { texto: "O art. 149 do Código Penal tipifica a redução a condição análoga à de escravo.", fonte: "Código Penal" },
        { texto: "A 'Lista Suja' do trabalho escravo é instrumento de transparência e punição de empregadores.", fonte: "Ministério do Trabalho" },
        { texto: "A dignidade da pessoa humana é fundamento da República (Constituição, art. 1º, III).", fonte: "Constituição Federal" }
      ],
      repertorios: [
        { ref: "Declaração Universal dos Direitos Humanos (1948)", uso: "Ninguém será mantido em escravidão ou servidão (art. 4º)." },
        { ref: "Lei Áurea (1888)", uso: "A abolição formal não garantiu inclusão nem fiscalização: o trabalho escravo contemporâneo mostra que a exploração mudou de forma, mas persiste." }
      ],
      lembrar: "'CORRENTE invisível': Condição desumana, Oferta enganosa, Rural e urbano, Lista Suja, Fiscalização, dignidade (art.1º).",
      argumentos: [
        "D1 — CAUSA: a pobreza e a falta de oportunidades tornam pessoas vulneráveis a aliciadores que prometem trabalho e impõem servidão.",
        "D2 — IMPUNIDADE: a fiscalização insuficiente e a impunidade permitem a continuidade do crime."
      ],
      tese: "A persistência do trabalho análogo à escravidão no Brasil revela a combinação entre vulnerabilidade social e impunidade.",
      proposta: "O Ministério do Trabalho (AGENTE) deve reforçar a fiscalização e a reinserção das vítimas (AÇÃO), por meio de mais auditores e da 'Lista Suja' (MEIO), a fim de erradicar o trabalho escravo e punir responsáveis (FINALIDADE), oferecendo qualificação às vítimas resgatadas (DETALHAMENTO)."
    },
    {
      id: "t-mobilidade", titulo: "Desafios da mobilidade urbana sustentável nas cidades brasileiras",
      eixo: "Cidades e Meio Ambiente", probabilidade: "provavel", dificuldade: "Médio",
      porque: "Trânsito, poluição e transporte público precário afetam o cotidiano; tema concreto e socioambiental.",
      resumo: "O transporte público precário e a cultura do automóvel geram congestionamentos, poluição e perda de tempo e qualidade de vida. Discuta mobilidade como direito e sustentabilidade.",
      dados: [
        { texto: "A Política Nacional de Mobilidade Urbana (Lei 12.587/2012) prioriza o transporte coletivo e os modos não motorizados.", fonte: "Legislação brasileira" },
        { texto: "O transporte é direito social na Constituição (art. 6º, incluído pela EC 90/2015).", fonte: "Constituição Federal" }
      ],
      repertorios: [
        { ref: "Conceito de 'direito à cidade' (Henri Lefebvre)", uso: "A cidade deve ser acessível e justa para todos os seus habitantes." },
        { ref: "ODS 11 (ONU)", uso: "Cidades e comunidades sustentáveis como meta global." }
      ],
      lembrar: "'RODA sustentável': Transporte coletivo, poluição, tempo perdido, direito à cidade (Lefebvre), bicicleta/pé.",
      argumentos: [
        "D1 — CAUSA: o incentivo histórico ao carro individual e o transporte público deficiente geram congestionamento e poluição.",
        "D2 — CONSEQUÊNCIA: a população perde horas no trânsito e respira ar poluído, com impactos na saúde e na economia."
      ],
      tese: "A precariedade do transporte público e a priorização do automóvel comprometem a mobilidade urbana sustentável no Brasil.",
      proposta: "As prefeituras, com o governo federal (AGENTE), devem investir em transporte coletivo de qualidade e ciclovias (AÇÃO), por meio de verbas e planejamento urbano (MEIO), a fim de reduzir poluição e melhorar a mobilidade (FINALIDADE), com tarifas acessíveis e integração entre modais (DETALHAMENTO)."
    },
    {
      id: "t-amazonia", titulo: "A preservação da Amazônia e a justiça socioambiental",
      eixo: "Meio Ambiente", probabilidade: "provavel", dificuldade: "Médio",
      porque: "Desmatamento e protagonismo do Brasil em pautas ambientais mantêm o tema relevante, com recorte socioambiental.",
      resumo: "O desmatamento da Amazônia ameaça o clima, a biodiversidade e os povos da floresta. Articule proteção ambiental, interesses econômicos e direitos dos povos tradicionais.",
      dados: [
        { texto: "A Lei de Crimes Ambientais (Lei 9.605/1998) pune condutas lesivas ao meio ambiente.", fonte: "Legislação brasileira" },
        { texto: "O Código Florestal (Lei 12.651/2012) regula o uso e a proteção da vegetação nativa.", fonte: "Legislação brasileira" },
        { texto: "A Amazônia regula o regime de chuvas ('rios voadores') e é enorme estoque de carbono e biodiversidade.", fonte: "Ciência / INPE" }
      ],
      repertorios: [
        { ref: "Ailton Krenak, 'Ideias para Adiar o Fim do Mundo'", uso: "A sabedoria dos povos originários e a crítica à destruição da natureza." },
        { ref: "Chico Mendes", uso: "A luta pela floresta e pelos povos que dela dependem." }
      ],
      lembrar: "'FLORESTA viva': 'rios voadores', carbono, biodiversidade, povos da floresta (Krenak, Chico Mendes), desmatamento ilegal.",
      argumentos: [
        "D1 — CAUSA: a pressão do agronegócio, da mineração e da grilagem impulsiona o desmatamento ilegal.",
        "D2 — CONSEQUÊNCIA: a destruição afeta o clima global, a biodiversidade e expulsa povos tradicionais."
      ],
      tese: "A preservação da Amazônia exige conciliar desenvolvimento econômico, proteção ambiental e direitos dos povos da floresta.",
      proposta: "O IBAMA, com o Ministério do Meio Ambiente (AGENTE), deve intensificar a fiscalização contra o desmatamento ilegal (AÇÃO), por meio de monitoramento por satélite e punição de infratores (MEIO), a fim de preservar a floresta e seus povos (FINALIDADE), incentivando a bioeconomia sustentável (DETALHAMENTO)."
    },

    /* ========== NOVOS (atualíssimos) ========== */
    {
      id: "t-telas-infancia", titulo: "Os impactos do uso excessivo de telas e redes sociais na infância e na adolescência",
      eixo: "Tecnologia e Juventude", probabilidade: "muito-provavel", dificuldade: "Médio",
      porque: "Pauta quente em 2025–2026: lei que restringe celulares nas escolas, ECA Digital e o debate nacional sobre a 'adultização' de crianças nas redes.",
      resumo: "Crianças e adolescentes passam horas em telas e redes, com impactos na atenção, no sono, na saúde mental e na exposição a riscos (exploração, conteúdos nocivos). Discuta a responsabilidade de plataformas, famílias, escolas e Estado.",
      dados: [
        { texto: "A Lei 15.100/2025 restringe o uso de celulares pelos estudantes nas escolas de educação básica, inclusive em recreios e intervalos (salvo fins pedagógicos, de acessibilidade ou de saúde).", fonte: "Legislação brasileira" },
        { texto: "O ECA Digital (Lei 15.211/2025, sancionado em 17/09/2025, em vigor desde 17/03/2026) impõe deveres de proteção de crianças e adolescentes às plataformas digitais (privacidade, supervisão parental, publicidade).", fonte: "Legislação brasileira" },
        { texto: "O Estatuto da Criança e do Adolescente (Lei 8.069/1990) e o art. 227 da Constituição garantem a proteção integral e a prioridade absoluta às crianças.", fonte: "ECA / Constituição Federal" }
      ],
      repertorios: [
        { ref: "Jonathan Haidt, 'A Geração Ansiosa' (2024)", uso: "Associa a 'infância baseada no celular' ao aumento de ansiedade e depressão entre adolescentes." },
        { ref: "Série 'Adolescência' (Netflix, 2025)", uso: "Retrata como a cultura misógina online pode influenciar meninos sem que pais e escola percebam." },
        { ref: "Byung-Chul Han, 'Sociedade do Cansaço'", uso: "A hiperestimulação e a dispersão da atenção na era digital." }
      ],
      lembrar: "'TELA que prende': Tempo excessivo, Exposição a riscos, Lei 15.100 (celular na escola), ECA Digital (plataformas), Atenção e sono prejudicados.",
      argumentos: [
        "D1 — CAUSA: o design viciante das plataformas (rolagem infinita, notificações) captura a atenção de crianças, que ainda não têm autorregulação desenvolvida.",
        "D2 — CONSEQUÊNCIA: o uso excessivo prejudica sono, aprendizagem e saúde mental e expõe crianças à 'adultização' e a predadores."
      ],
      tese: "O uso excessivo e desprotegido de telas compromete o desenvolvimento de crianças e adolescentes, exigindo responsabilização das plataformas e mediação de famílias e escolas.",
      proposta: "A Autoridade Nacional de Proteção de Dados, com o Ministério da Justiça (AGENTE), deve fiscalizar o cumprimento do ECA Digital pelas plataformas (AÇÃO), por meio de auditorias e sanções (MEIO), a fim de proteger crianças de conteúdos nocivos e do design viciante (FINALIDADE), aliado a programas de educação digital para pais nas escolas (DETALHAMENTO)."
    },
    {
      id: "t-violencia-escolas", titulo: "Caminhos para combater a violência e o bullying nas escolas brasileiras",
      eixo: "Educação e Segurança", probabilidade: "provavel", dificuldade: "Médio",
      porque: "Ataques a escolas (2023) e a criminalização do bullying e do cyberbullying (2024) mantêm o tema em pauta.",
      resumo: "Bullying, cyberbullying e episódios de violência extrema afetam a aprendizagem e a saúde mental de estudantes. Discuta prevenção, cultura de paz e acolhimento psicológico.",
      dados: [
        { texto: "A Lei 14.811/2024 incluiu no Código Penal (art. 146-A) o crime de intimidação sistemática (bullying), punido com multa, e o cyberbullying, com reclusão de 2 a 4 anos e multa.", fonte: "Legislação brasileira" },
        { texto: "A Lei 13.185/2015 instituiu o Programa de Combate à Intimidação Sistemática (bullying) nas escolas.", fonte: "Legislação brasileira" },
        { texto: "A Constituição (art. 205) define a educação como direito voltado ao pleno desenvolvimento da pessoa.", fonte: "Constituição Federal" }
      ],
      repertorios: [
        { ref: "Paulo Freire, 'Pedagogia da Autonomia'", uso: "Educar exige diálogo e respeito ao outro — base de uma cultura de paz." },
        { ref: "Declaração sobre uma Cultura de Paz (ONU, 1999)", uso: "Defende educação, diálogo e respeito como base para prevenir a violência — inclusive no ambiente escolar." }
      ],
      lembrar: "'PAZ na escola': Prevenção (programas), Acolhimento psicológico, Zelo digital (cyberbullying = crime desde 2024).",
      argumentos: [
        "D1 — CAUSA: a naturalização do bullying como 'brincadeira' e a ausência de mediação permitem a escalada da violência.",
        "D2 — CONSEQUÊNCIA: vítimas sofrem com evasão, queda no rendimento e adoecimento psíquico; o ambiente escolar perde sua função formadora."
      ],
      tese: "A naturalização do bullying e a carência de acompanhamento psicológico tornam a escola brasileira vulnerável à violência.",
      proposta: "O Ministério da Educação (AGENTE) deve implementar programas permanentes de cultura de paz e psicólogos nas escolas (AÇÃO), por meio de verbas federais e formação de professores em mediação de conflitos (MEIO), a fim de prevenir o bullying e a violência (FINALIDADE), incluindo canais anônimos de denúncia para os alunos (DETALHAMENTO)."
    },
    {
      id: "t-ultraprocessados", titulo: "Os desafios da alimentação saudável diante dos ultraprocessados no Brasil",
      eixo: "Saúde Pública", probabilidade: "provavel", dificuldade: "Difícil",
      porque: "Obesidade crescente, rotulagem frontal de alimentos e o prestígio internacional do Guia Alimentar brasileiro tornam o tema plausível.",
      resumo: "O consumo crescente de alimentos ultraprocessados está ligado à obesidade e a doenças crônicas, enquanto alimentos frescos ficam mais caros e menos acessíveis. Discuta publicidade, renda e educação alimentar.",
      dados: [
        { texto: "O Guia Alimentar para a População Brasileira (Ministério da Saúde, 2014) recomenda basear a dieta em alimentos in natura e minimamente processados e evitar ultraprocessados.", fonte: "Ministério da Saúde" },
        { texto: "A classificação NOVA (que separa os alimentos pelo grau de processamento) foi criada por pesquisadores da USP liderados por Carlos Monteiro e é usada internacionalmente.", fonte: "USP / Nupens" },
        { texto: "A alimentação é direito social previsto no art. 6º da Constituição.", fonte: "Constituição Federal" }
      ],
      repertorios: [
        { ref: "Josué de Castro, 'Geografia da Fome'", uso: "A má alimentação como problema social, não apenas individual." },
        { ref: "Documentário 'Muito Além do Peso' (2012)", uso: "Retrata a obesidade infantil e a influência da publicidade de alimentos no Brasil." }
      ],
      lembrar: "'NOVA fome': classificação NOVA (USP), Guia Alimentar (2014), publicidade, preço do alimento fresco, obesidade e doenças crônicas.",
      argumentos: [
        "D1 — CAUSA: a publicidade e o baixo preço dos ultraprocessados, somados à rotina acelerada, empurram a população para uma dieta pobre.",
        "D2 — CONSEQUÊNCIA: obesidade, diabetes e hipertensão crescem e sobrecarregam o SUS."
      ],
      tese: "A popularização dos ultraprocessados, favorecida pela publicidade e pela desigualdade de renda, ameaça a saúde alimentar dos brasileiros.",
      proposta: "O Ministério da Saúde (AGENTE) deve ampliar a educação alimentar e restringir a publicidade de ultraprocessados para crianças (AÇÃO), por meio de campanhas e regulação (MEIO), a fim de reduzir a obesidade e as doenças crônicas (FINALIDADE), subsidiando alimentos in natura da agricultura familiar (DETALHAMENTO)."
    },

    /* ========== POUCO PROVÁVEL (já caíram / nicho) ========== */
    {
      id: "t-prisional", titulo: "Desafios do sistema prisional brasileiro",
      eixo: "Direitos Humanos", probabilidade: "pouco-provavel", dificuldade: "Extrema",
      porque: "Tema sensível e polarizado; exige muito cuidado com Direitos Humanos na proposta. Possível, mas pouco provável.",
      resumo: "Superlotação, condições degradantes e baixa ressocialização marcam as prisões brasileiras, que alimentam a reincidência e o crime organizado. Discuta punição x ressocialização respeitando os Direitos Humanos.",
      dados: [
        { texto: "Em 2023, o STF concluiu o julgamento da ADPF 347 e reconheceu um 'estado de coisas inconstitucional' no sistema prisional, determinando um plano nacional para enfrentá-lo.", fonte: "Supremo Tribunal Federal" },
        { texto: "A Lei de Execução Penal (Lei 7.210/1984) prevê assistência educacional, de saúde e ao trabalho para a ressocialização do preso.", fonte: "Legislação brasileira" }
      ],
      repertorios: [
        { ref: "Michel Foucault, 'Vigiar e Punir'", uso: "A prisão como instituição disciplinar que falha em ressocializar." },
        { ref: "Música 'Diário de um Detento' (Racionais MC's, 1997)", uso: "Retrata a realidade do Carandiru e o massacre de 1992." }
      ],
      lembrar: "Tema 'EXTREMO': cuidado com a proposta — nunca sugira violência ou pena cruel (fere os Direitos Humanos e zera a C5). Foque em ressocialização (LEP).",
      argumentos: [
        "D1 — FALHA: a superlotação e as condições degradantes impedem a ressocialização prevista na Lei de Execução Penal.",
        "D2 — CONSEQUÊNCIA: presídios superlotados fortalecem facções e elevam a reincidência, piorando a segurança pública."
      ],
      tese: "A superlotação e o abandono do sistema prisional brasileiro inviabilizam a ressocialização e alimentam o ciclo da violência.",
      proposta: "O Conselho Nacional de Justiça, com o Ministério da Justiça (AGENTE), deve ampliar penas alternativas para crimes sem violência e oferecer estudo e trabalho nos presídios (AÇÃO), por meio de parcerias e mutirões carcerários (MEIO), a fim de reduzir a superlotação e a reincidência (FINALIDADE), garantindo a dignidade prevista na LEP (DETALHAMENTO)."
    },
    {
      id: "t-envelhecimento", titulo: "Perspectivas do envelhecimento na sociedade brasileira",
      eixo: "Demografia", probabilidade: "pouco-provavel", dificuldade: "Médio",
      porque: "Foi o tema de 2025 — dificilmente se repete tão cedo. Estude para entender o padrão, não para apostar.",
      resumo: "O Brasil envelhece rapidamente, exigindo repensar saúde, previdência e cuidado. (Tema recém-cobrado em 2025.)",
      dados: [
        { texto: "O Estatuto da Pessoa Idosa (Lei 10.741/2003, nome atualizado pela Lei 14.423/2022) garante direitos à pessoa idosa.", fonte: "Legislação brasileira" },
        { texto: "Censo 2022: 10,9% da população tem 65 anos ou mais; o índice de envelhecimento passou de 30,7 (2010) para 55,2 (2022).", fonte: "IBGE, Censo 2022" }
      ],
      repertorios: [
        { ref: "Simone de Beauvoir, 'A Velhice'", uso: "A marginalização social da pessoa idosa." }
      ],
      lembrar: "Já caiu em 2025 — serve de modelo. Padrão ENEM: direito social + grupo vulnerável + proposta estatal.",
      argumentos: [
        "D1 — a transição demográfica desafia a previdência e os serviços de saúde.",
        "D2 — o etarismo e a falta de políticas de cuidado marginalizam os idosos."
      ],
      tese: "O envelhecimento populacional exige políticas de cuidado, saúde e inclusão da pessoa idosa.",
      proposta: "O Estado deve ampliar políticas de cuidado e saúde ao idoso, garantindo dignidade e participação social."
    },
    {
      id: "t-intolerancia", titulo: "Caminhos para combater a intolerância religiosa no Brasil",
      eixo: "Diversidade", probabilidade: "pouco-provavel", dificuldade: "Médio",
      porque: "Foi o tema de 2016. Pode voltar com outro recorte, mas é pouco provável no curto prazo.",
      resumo: "A intolerância religiosa, sobretudo contra religiões de matriz africana, viola a liberdade de crença. (Tema já cobrado em 2016.)",
      dados: [
        { texto: "A Constituição (art. 5º, VI) garante a liberdade de crença e o livre exercício dos cultos religiosos.", fonte: "Constituição Federal" },
        { texto: "A laicidade do Estado é princípio constitucional.", fonte: "Constituição Federal" }
      ],
      repertorios: [
        { ref: "Declaração Universal dos Direitos Humanos (1948)", uso: "Liberdade de pensamento, consciência e religião (art. 18)." }
      ],
      lembrar: "Já caiu em 2016. Base: laicidade + liberdade de crença + respeito à diversidade.",
      argumentos: [
        "D1 — o preconceito atinge sobretudo religiões de matriz africana, revelando racismo.",
        "D2 — a falta de educação para a diversidade perpetua a intolerância."
      ],
      tese: "A intolerância religiosa no Brasil, ligada ao racismo, fere a liberdade de crença e a laicidade do Estado.",
      proposta: "O Estado deve promover a educação para a diversidade religiosa e punir a discriminação."
    },
    {
      id: "t-cultura", titulo: "Democratização do acesso à cultura no Brasil",
      eixo: "Cultura", probabilidade: "pouco-provavel", dificuldade: "Fácil",
      porque: "O acesso ao cinema caiu em 2019; o eixo cultura pode voltar com novo recorte, mas é aposta fraca agora.",
      resumo: "O acesso a bens culturais (teatro, museus, cinema, livros) é desigual e concentrado. Discuta cultura como direito e ferramenta de cidadania.",
      dados: [
        { texto: "A cultura é direito garantido pela Constituição (art. 215).", fonte: "Constituição Federal" },
        { texto: "A Lei Rouanet incentiva a produção cultural via renúncia fiscal.", fonte: "Legislação brasileira" }
      ],
      repertorios: [
        { ref: "Antônio Candido, 'O Direito à Literatura'", uso: "A literatura (e a cultura) como bem incompressível, direito humano." }
      ],
      lembrar: "Cinema caiu em 2019. Base: cultura = direito (Antônio Candido) + acesso desigual.",
      argumentos: [
        "D1 — a concentração de equipamentos culturais nas grandes cidades exclui periferias e interior.",
        "D2 — a cultura forma cidadãos críticos; negá-la aprofunda a desigualdade."
      ],
      tese: "O acesso desigual à cultura no Brasil nega a milhões um direito fundamental à formação e à cidadania.",
      proposta: "O Ministério da Cultura deve descentralizar equipamentos e programas culturais, priorizando periferias e interior."
    }
  ]
};
