/* ============================================================
   ENRIQUECEDOR DE REPERTÓRIO — cards rotativos.
   Categorias: citação, dado, conceito, série/filme, pesquisa, música.
   Autorias, datas e números foram conferidos. Dados mudam: o
   ano da fonte está sempre indicado — cite o ano na redação.
   ============================================================ */
window.ENEM_REPERTORIO = {
  categorias: {
    citacao: { rotulo: "Citação", emoji: "💬" },
    dado: { rotulo: "Dado estatístico", emoji: "📊" },
    conceito: { rotulo: "Conceito", emoji: "🧠" },
    serie: { rotulo: "Série / filme", emoji: "🎬" },
    pesquisa: { rotulo: "Pesquisa", emoji: "🔬" },
    musica: { rotulo: "Música", emoji: "🎵" }
  },
  cards: [
    /* ---------------- CITAÇÕES ---------------- */
    { cat: "citacao", titulo: "Simone de Beauvoir", texto: "“Ninguém nasce mulher: torna-se mulher.”", fonte: "O Segundo Sexo (1949)", uso: "Gênero, machismo, violência contra a mulher." },
    { cat: "citacao", titulo: "Paulo Freire", texto: "“Se a educação sozinha não transforma a sociedade, sem ela tampouco a sociedade muda.”", fonte: "Pedagogia da Indignação (2000)", uso: "Educação como base de qualquer proposta." },
    { cat: "citacao", titulo: "Martin Luther King Jr.", texto: "“A injustiça em qualquer lugar é uma ameaça à justiça em todo lugar.”", fonte: "Carta da Prisão de Birmingham (1963)", uso: "Racismo, desigualdade, direitos humanos." },
    { cat: "citacao", titulo: "Jean-Jacques Rousseau", texto: "“O homem nasce livre, e por toda parte encontra-se a ferros.”", fonte: "Do Contrato Social (1762)", uso: "Liberdade, desigualdade, trabalho escravo." },
    { cat: "citacao", titulo: "Aristóteles", texto: "“O homem é, por natureza, um animal político.”", fonte: "Política (séc. IV a.C.)", uso: "Cidadania, participação social, isolamento." },
    { cat: "citacao", titulo: "George Orwell", texto: "“Quem controla o passado controla o futuro; quem controla o presente controla o passado.”", fonte: "1984 (1949)", uso: "Desinformação, memória histórica, manipulação." },
    { cat: "citacao", titulo: "Jean-Paul Sartre", texto: "“O homem está condenado a ser livre.”", fonte: "O Existencialismo é um Humanismo (1946)", uso: "Responsabilidade individual e coletiva." },
    { cat: "citacao", titulo: "Declaração Universal dos Direitos Humanos", texto: "“Todos os seres humanos nascem livres e iguais em dignidade e em direitos.”", fonte: "Art. 1º (ONU, 1948)", uso: "Coringa para qualquer tema de minorias e direitos." },
    { cat: "citacao", titulo: "Constituição Federal", texto: "“Todos são iguais perante a lei, sem distinção de qualquer natureza.”", fonte: "Art. 5º, caput (1988)", uso: "Igualdade, discriminação, acesso a direitos." },
    { cat: "citacao", titulo: "Montesquieu", texto: "“Para que não se possa abusar do poder, é preciso que, pela disposição das coisas, o poder freie o poder.”", fonte: "O Espírito das Leis (1748)", uso: "Democracia, instituições, fiscalização." },
    { cat: "citacao", titulo: "Hannah Arendt", texto: "O primeiro direito humano é “o direito a ter direitos”.", fonte: "Origens do Totalitarismo (1951)", uso: "Refugiados, registro civil, cidadania." },

    /* ---------------- DADOS ---------------- */
    { cat: "dado", titulo: "População do Brasil", texto: "O Brasil tem 203,1 milhões de habitantes.", fonte: "IBGE, Censo 2022", uso: "Contextualizar qualquer tema nacional." },
    { cat: "dado", titulo: "Composição racial", texto: "Pela 1ª vez os pardos são o maior grupo (45,3%); com os pretos (10,2%), a população negra soma 55,5%.", fonte: "IBGE, Censo 2022", uso: "Racismo, representatividade, desigualdade." },
    { cat: "dado", titulo: "Envelhecimento", texto: "10,9% dos brasileiros têm 65 anos ou mais (22,2 milhões) — alta de 57,4% desde 2010.", fonte: "IBGE, Censo 2022", uso: "Etarismo, previdência, cuidado." },
    { cat: "dado", titulo: "Analfabetismo", texto: "7,0% das pessoas com 15 anos ou mais são analfabetas (eram 9,6% em 2010).", fonte: "IBGE, Censo 2022", uso: "Educação, exclusão, cidadania." },
    { cat: "dado", titulo: "Povos indígenas e quilombolas", texto: "O Censo contou 1,69 milhão de indígenas e, pela primeira vez, 1,33 milhão de quilombolas.", fonte: "IBGE, Censo 2022", uso: "Povos tradicionais, invisibilidade, direitos." },
    { cat: "dado", titulo: "Internet", texto: "84% dos brasileiros com 10+ anos usam internet — 86% nas cidades, 76% no campo.", fonte: "Cetic.br, TIC Domicílios 2024", uso: "Inclusão digital, educação, desigualdade." },
    { cat: "dado", titulo: "Feminicídio", texto: "O Brasil registrou 1.571 feminicídios em 2025, recorde da série histórica.", fonte: "Anuário Brasileiro de Segurança Pública (2026)", uso: "Violência contra a mulher." },
    { cat: "dado", titulo: "Fome", texto: "O Brasil saiu novamente do Mapa da Fome da ONU (menos de 2,5% de subnutridos).", fonte: "FAO, relatório SOFI 2025", uso: "Fome, políticas públicas, desigualdade." },
    { cat: "dado", titulo: "Ansiedade", texto: "O Brasil tem a maior prevalência de transtornos de ansiedade do mundo: 9,3% da população.", fonte: "OMS (2017)", uso: "Saúde mental." },
    { cat: "dado", titulo: "Apostas", texto: "Beneficiários do Bolsa Família enviaram cerca de R$ 3 bilhões às bets via Pix só em agosto de 2024.", fonte: "Banco Central, nota técnica (2024)", uso: "Apostas, endividamento, vício." },
    { cat: "dado", titulo: "Saneamento", texto: "A meta legal é levar água a 99% e esgoto a 90% da população até 2033.", fonte: "Marco Legal do Saneamento, Lei 14.026/2020", uso: "Saneamento, saúde, desigualdade regional." },

    /* ---------------- CONCEITOS ---------------- */
    { cat: "conceito", titulo: "Racismo estrutural", texto: "O racismo não é um desvio individual, mas parte do funcionamento normal das instituições e relações sociais.", fonte: "Silvio Almeida, Racismo Estrutural (2019)", uso: "Racismo, desigualdade racial." },
    { cat: "conceito", titulo: "Etarismo (ageísmo)", texto: "Preconceito e discriminação com base na idade. O termo 'ageism' foi criado pelo gerontólogo Robert Butler em 1969.", fonte: "Robert Butler (1969)", uso: "Envelhecimento, mercado de trabalho." },
    { cat: "conceito", titulo: "Capacitismo", texto: "Discriminação que trata a pessoa com deficiência como incapaz ou inferior.", fonte: "Estudos da deficiência / LBI (Lei 13.146/2015)", uso: "Inclusão, neurodivergência, acessibilidade." },
    { cat: "conceito", titulo: "Aporofobia", texto: "Aversão e rejeição às pessoas pobres — o pobre incomoda mais que o estrangeiro.", fonte: "Adela Cortina, Aporofobia (2017)", uso: "Pessoas em situação de rua, desigualdade." },
    { cat: "conceito", titulo: "Necropolítica", texto: "O poder de decidir quem pode viver e quem deve morrer, expondo certos grupos à morte.", fonte: "Achille Mbembe (2003)", uso: "Violência policial, periferias, racismo." },
    { cat: "conceito", titulo: "Modernidade líquida", texto: "Relações, empregos e valores tornam-se frágeis, instáveis e descartáveis.", fonte: "Zygmunt Bauman (2000)", uso: "Redes sociais, trabalho, consumo." },
    { cat: "conceito", titulo: "Sociedade do cansaço", texto: "A cobrança por desempenho faz o indivíduo explorar a si mesmo até o esgotamento (burnout).", fonte: "Byung-Chul Han (2010)", uso: "Saúde mental, trabalho, juventude." },
    { cat: "conceito", titulo: "Indústria cultural", texto: "A cultura transformada em mercadoria padronizada, que entretém mas aliena.", fonte: "Adorno e Horkheimer, Dialética do Esclarecimento (1947)", uso: "Mídia, consumo, publicidade, apostas." },
    { cat: "conceito", titulo: "Racismo ambiental", texto: "Os danos ambientais recaem desproporcionalmente sobre populações pobres e racializadas.", fonte: "Benjamin Chavis (1982)", uso: "Enchentes, clima, saneamento." },
    { cat: "conceito", titulo: "Capitalismo de vigilância", texto: "A experiência humana vira dado, usado para prever e influenciar comportamentos.", fonte: "Shoshana Zuboff (2019)", uso: "Dados, privacidade, redes sociais." },
    { cat: "conceito", titulo: "Banalidade do mal", texto: "Pessoas comuns cometem atrocidades quando obedecem sem pensar criticamente.", fonte: "Hannah Arendt, Eichmann em Jerusalém (1963)", uso: "Violência, discurso de ódio, omissão." },
    { cat: "conceito", titulo: "Anomia", texto: "Estado de enfraquecimento das normas sociais, que gera desorientação e desvio.", fonte: "Émile Durkheim (1893/1897)", uso: "Violência, crise social." },
    { cat: "conceito", titulo: "Infodemia", texto: "Excesso de informações — muitas falsas — que dificulta encontrar orientação confiável.", fonte: "OMS (2020)", uso: "Desinformação, saúde pública." },
    { cat: "conceito", titulo: "Meritocracia (crítica)", texto: "O termo nasceu como sátira: Michael Young alertou que o 'mérito' pode legitimar desigualdades de origem.", fonte: "Michael Young, The Rise of the Meritocracy (1958)", uso: "Educação, cotas, desigualdade." },
    { cat: "conceito", titulo: "Gentrificação", texto: "Valorização de uma área que expulsa os moradores mais pobres.", fonte: "Ruth Glass (1964)", uso: "Cidades, moradia, desigualdade." },

    /* ---------------- SÉRIES E FILMES ---------------- */
    { cat: "serie", titulo: "Black Mirror (Netflix, 2011–)", texto: "Episódios independentes mostram os efeitos sombrios da tecnologia sobre a vida humana.", fonte: "Série", uso: "Tecnologia, redes, vigilância, IA." },
    { cat: "serie", titulo: "Adolescência (Netflix, 2025)", texto: "Um garoto de 13 anos é acusado de um crime; a série mostra a influência da cultura misógina online.", fonte: "Minissérie", uso: "Redes sociais, juventude, violência contra a mulher." },
    { cat: "serie", titulo: "O Dilema das Redes (2020)", texto: "Ex-funcionários de big techs explicam como os algoritmos são feitos para viciar.", fonte: "Documentário", uso: "Desinformação, saúde mental, dados." },
    { cat: "serie", titulo: "O Conto da Aia (2017–2025)", texto: "Distopia em que mulheres perdem todos os direitos sob um regime autoritário.", fonte: "Série", uso: "Direitos das mulheres, autoritarismo." },
    { cat: "serie", titulo: "Atypical (Netflix, 2017–2021)", texto: "Acompanha um jovem autista em busca de independência.", fonte: "Série", uso: "Neurodivergência, inclusão." },
    { cat: "serie", titulo: "Sob Pressão (Globo, 2017–2022)", texto: "Retrata a rotina de um hospital público e os desafios do SUS.", fonte: "Série", uso: "Saúde pública." },
    { cat: "serie", titulo: "Segunda Chamada (Globo, 2019–2021)", texto: "Professores e alunos da Educação de Jovens e Adultos numa escola pública noturna.", fonte: "Série", uso: "Educação, evasão, professores." },
    { cat: "serie", titulo: "Chernobyl (HBO, 2019)", texto: "Mostra o custo humano de mentiras institucionais após o desastre nuclear.", fonte: "Minissérie", uso: "Desinformação, ciência, responsabilidade." },
    { cat: "serie", titulo: "Ainda Estou Aqui (2024)", texto: "Filme de Walter Salles sobre Eunice Paiva e a ditadura; Oscar de Melhor Filme Internacional em 2025.", fonte: "Filme", uso: "Memória, ditadura, direitos humanos." },
    { cat: "serie", titulo: "Que Horas Ela Volta? (2015)", texto: "Filme de Anna Muylaert sobre uma empregada doméstica e as divisões de classe.", fonte: "Filme", uso: "Trabalho doméstico, desigualdade, educação." },
    { cat: "serie", titulo: "Tempos Modernos (1936)", texto: "Chaplin satiriza o trabalhador transformado em peça da máquina.", fonte: "Filme", uso: "Trabalho, automação, IA." },

    /* ---------------- PESQUISAS ---------------- */
    { cat: "pesquisa", titulo: "Notícias falsas se espalham mais", texto: "Notícias falsas tiveram cerca de 70% mais chance de serem compartilhadas no Twitter que as verdadeiras.", fonte: "Vosoughi, Roy e Aral — MIT, revista Science (2018)", uso: "Desinformação." },
    { cat: "pesquisa", titulo: "Estudo de Harvard sobre a felicidade", texto: "Acompanhando pessoas desde 1938, concluiu que relações próximas são o maior preditor de saúde e felicidade.", fonte: "Harvard Study of Adult Development", uso: "Saúde mental, solidão, envelhecimento." },
    { cat: "pesquisa", titulo: "PISA 2022", texto: "O Brasil ficou abaixo da média da OCDE em matemática, leitura e ciências.", fonte: "OCDE (divulgado em 2023)", uso: "Educação, valorização do professor." },
    { cat: "pesquisa", titulo: "IPCC — 6º Relatório", texto: "É inequívoco que a influência humana aqueceu a atmosfera, os oceanos e a terra.", fonte: "IPCC (2021–2023)", uso: "Mudanças climáticas." },
    { cat: "pesquisa", titulo: "A Geração Ansiosa", texto: "Jonathan Haidt reúne estudos que ligam a 'infância baseada no celular' ao aumento da ansiedade em adolescentes.", fonte: "Jonathan Haidt (2024)", uso: "Telas, redes sociais, saúde mental." },
    { cat: "pesquisa", titulo: "Anuário Brasileiro de Segurança Pública", texto: "Em 2025, as mortes violentas caíram ao menor nível em 13 anos, mas os feminicídios bateram recorde.", fonte: "Fórum Brasileiro de Segurança Pública (2026)", uso: "Violência, violência de gênero." },

    /* ---------------- MÚSICAS ---------------- */
    { cat: "musica", titulo: "“Construção” — Chico Buarque (1971)", texto: "O operário que morre 'atrapalhando o tráfego' simboliza o trabalhador desumanizado.", fonte: "Música", uso: "Trabalho, precarização." },
    { cat: "musica", titulo: "“Cálice” — Chico Buarque e Gilberto Gil (1973)", texto: "O jogo 'cálice'/'cale-se' denuncia a censura da ditadura.", fonte: "Música", uso: "Liberdade de expressão, ditadura, memória." },
    { cat: "musica", titulo: "“A Carne” — Elza Soares (2002)", texto: "“A carne mais barata do mercado é a carne negra.”", fonte: "Composição de Seu Jorge, Marcelo Yuka e Ulisses Cappelletti", uso: "Racismo estrutural, violência." },
    { cat: "musica", titulo: "“Maria da Vila Matilde” — Elza Soares (2015)", texto: "Uma mulher reage à violência doméstica: “Cê vai se arrepender de levantar a mão pra mim.”", fonte: "Composição de Douglas Germano", uso: "Violência contra a mulher." },
    { cat: "musica", titulo: "“Comida” — Titãs (1987)", texto: "“A gente não quer só comida / A gente quer comida, diversão e arte.”", fonte: "Música", uso: "Cultura, dignidade, direitos sociais." },
    { cat: "musica", titulo: "“Asa Branca” — Luiz Gonzaga e Humberto Teixeira (1947)", texto: "A seca obriga o sertanejo a migrar.", fonte: "Música", uso: "Seca, clima, migração, desigualdade regional." },
    { cat: "musica", titulo: "“Negro Drama” — Racionais MC's (2002)", texto: "Retrata o racismo e a vida na periferia.", fonte: "Música", uso: "Racismo, periferia, juventude." },
    { cat: "musica", titulo: "“AmarElo” — Emicida (2019)", texto: "Sobre dor e superação, com trecho de Belchior: “Ano passado eu morri, mas esse ano eu não morro.”", fonte: "Música", uso: "Saúde mental, desigualdade." },
    { cat: "musica", titulo: "“Admirável Chip Novo” — Pitty (2003)", texto: "Critica a padronização e a alienação das pessoas.", fonte: "Música", uso: "Tecnologia, consumo, alienação." },
    { cat: "musica", titulo: "“Haiti” — Caetano Veloso e Gilberto Gil (1993)", texto: "Denuncia o racismo e a violência contra 'quase todos pretos'.", fonte: "Música", uso: "Racismo, violência policial." }
  ]
};
