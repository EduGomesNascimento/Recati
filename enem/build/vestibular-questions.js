/* Questões no estilo de VESTIBULARES e outras provas (FUVEST,
   UNICAMP, UNESP, UERJ, PUC, Mackenzie, Albert Einstein etc.),
   escritas à mão para fins educacionais. fonte: "vestibular".
   Costumam ser mais diretas/computacionais que o ENEM. */
module.exports = [
  /* ===================== MATEMÁTICA ===================== */
  {
    area: "matematica", materia: "matematica", topico: "Logaritmos", nivel: "Médio", banca: "FUVEST",
    enunciado: "O valor de log₂ 32 + log₃ 27 é:",
    alternativas: ["5", "6", "7", "8", "9"], correta: 3,
    explicacao: "log₂ 32 = 5 (pois 2⁵ = 32) e log₃ 27 = 3 (pois 3³ = 27). Somando: 5 + 3 = 8.",
    dica: "logₐ aⁿ = n. Escreva o número como potência da base."
  },
  {
    area: "matematica", materia: "matematica", topico: "Equação exponencial", nivel: "Médio", banca: "UNESP",
    enunciado: "Resolvendo a equação 2ˣ⁺¹ = 32, o valor de x é:",
    alternativas: ["3", "4", "5", "6", "2"], correta: 1,
    explicacao: "32 = 2⁵. Então 2ˣ⁺¹ = 2⁵, logo x + 1 = 5 e x = 4.",
    dica: "Iguale as bases: se aᵐ = aⁿ, então m = n."
  },
  {
    area: "matematica", materia: "matematica", topico: "Análise Combinatória", nivel: "Difícil", banca: "FUVEST",
    enunciado: "Quantos anagramas distintos podem ser formados com as letras da palavra LIVRO (todas distintas)?",
    alternativas: ["24", "60", "100", "120", "720"], correta: 3,
    explicacao: "LIVRO tem 5 letras distintas. O número de anagramas é 5! = 5×4×3×2×1 = 120.",
    dica: "Anagramas de palavra com letras distintas = n! (fatorial do nº de letras)."
  },
  {
    area: "matematica", materia: "matematica", topico: "Progressão Geométrica", nivel: "Médio", banca: "UNICAMP",
    enunciado: "A soma dos 5 primeiros termos da PG (3, 6, 12, 24, 48) é:",
    alternativas: ["81", "93", "96", "99", "105"], correta: 1,
    explicacao: "Basta somar: 3 + 6 + 12 + 24 + 48 = 93. (Ou use Sₙ = a₁(qⁿ−1)/(q−1) = 3(2⁵−1)/(2−1) = 3×31 = 93.)",
    dica: "PG: Sₙ = a₁·(qⁿ − 1)/(q − 1)."
  },
  {
    area: "matematica", materia: "matematica", topico: "Trigonometria", nivel: "Médio", banca: "PUC",
    enunciado: "O valor de sen 30° + cos 60° é:",
    alternativas: ["0", "1/2", "1", "√2/2", "√3/2"], correta: 2,
    explicacao: "sen 30° = 1/2 e cos 60° = 1/2. Somando: 1/2 + 1/2 = 1.",
    dica: "Decore os valores notáveis: sen30=cos60=1/2; sen60=cos30=√3/2; sen45=cos45=√2/2."
  },
  {
    area: "matematica", materia: "matematica", topico: "Geometria Analítica", nivel: "Médio", banca: "UERJ",
    enunciado: "A distância entre os pontos A(1, 2) e B(4, 6) no plano cartesiano é:",
    alternativas: ["3", "4", "5", "6", "7"], correta: 2,
    explicacao: "d = √[(4−1)² + (6−2)²] = √(3² + 4²) = √(9 + 16) = √25 = 5.",
    dica: "Distância entre pontos: d = √[(x₂−x₁)² + (y₂−y₁)²]. Terna 3-4-5 aparece muito."
  },
  {
    area: "matematica", materia: "matematica", topico: "Função composta", nivel: "Difícil", banca: "FUVEST",
    enunciado: "Se f(x) = 2x + 1 e g(x) = x², então f(g(3)) vale:",
    alternativas: ["7", "13", "19", "25", "49"], correta: 2,
    explicacao: "Primeiro g(3) = 3² = 9. Depois f(9) = 2×9 + 1 = 19.",
    dica: "Em f(g(x)), resolva de dentro para fora: calcule g primeiro, use o resultado em f."
  },
  {
    area: "matematica", materia: "matematica", topico: "Porcentagem", nivel: "Difícil", banca: "Mackenzie",
    enunciado: "Um produto teve dois aumentos sucessivos de 20% e 50%. O aumento percentual total foi de:",
    alternativas: ["70%", "72%", "75%", "80%", "100%"], correta: 3,
    explicacao: "Fatores: 1,20 × 1,50 = 1,80. Isso corresponde a um aumento total de 80% (não 70%, pois os aumentos não se somam).",
    dica: "Aumentos sucessivos: multiplique os fatores (1,20 × 1,50), não some as porcentagens."
  },

  /* ===================== FÍSICA ===================== */
  {
    area: "natureza", materia: "fisica", topico: "Cinemática", nivel: "Médio", banca: "UNESP",
    enunciado: "Um carro parte do repouso com aceleração constante de 2 m/s². Qual a velocidade após 10 s?",
    alternativas: ["5 m/s", "10 m/s", "20 m/s", "40 m/s", "100 m/s"], correta: 2,
    explicacao: "No MUV, v = v₀ + a·t = 0 + 2×10 = 20 m/s.",
    dica: "MUV: v = v₀ + a·t. Partindo do repouso, v₀ = 0."
  },
  {
    area: "natureza", materia: "fisica", topico: "Dinâmica", nivel: "Médio", banca: "FUVEST",
    enunciado: "Uma força resultante de 20 N atua sobre um corpo de massa 4 kg. A aceleração adquirida é:",
    alternativas: ["2 m/s²", "4 m/s²", "5 m/s²", "16 m/s²", "80 m/s²"], correta: 2,
    explicacao: "Pela 2ª Lei de Newton, F = m·a, logo a = F/m = 20/4 = 5 m/s².",
    dica: "F = m·a. Isole a aceleração: a = F/m."
  },
  {
    area: "natureza", materia: "fisica", topico: "Hidrostática", nivel: "Difícil", banca: "UNICAMP",
    enunciado: "Qual a pressão exercida por uma coluna de água de 2 m de altura? (densidade = 1000 kg/m³; g = 10 m/s²)",
    alternativas: ["2 000 Pa", "5 000 Pa", "10 000 Pa", "20 000 Pa", "200 000 Pa"], correta: 3,
    explicacao: "Pressão hidrostática: p = ρ·g·h = 1000 × 10 × 2 = 20 000 Pa.",
    dica: "Pressão de coluna de fluido: p = ρ·g·h."
  },
  {
    area: "natureza", materia: "fisica", topico: "Eletricidade", nivel: "Médio", banca: "PUC",
    enunciado: "Um resistor de 10 Ω é percorrido por uma corrente de 2 A. A diferença de potencial em seus terminais é:",
    alternativas: ["5 V", "8 V", "12 V", "20 V", "40 V"], correta: 3,
    explicacao: "Pela 1ª Lei de Ohm, U = R·i = 10 × 2 = 20 V.",
    dica: "Lei de Ohm: U = R·i."
  },
  {
    area: "natureza", materia: "fisica", topico: "Óptica", nivel: "Médio", banca: "UERJ",
    enunciado: "Um objeto está a 30 cm de um espelho plano. A distância entre o objeto e sua imagem é:",
    alternativas: ["15 cm", "30 cm", "45 cm", "60 cm", "90 cm"], correta: 3,
    explicacao: "No espelho plano, a imagem é simétrica: forma-se a 30 cm atrás do espelho. A distância objeto-imagem é 30 + 30 = 60 cm.",
    dica: "Espelho plano: imagem virtual, do mesmo tamanho, simétrica. Objeto-imagem = 2× a distância ao espelho."
  },

  /* ===================== QUÍMICA ===================== */
  {
    area: "natureza", materia: "quimica", topico: "Soluções", nivel: "Difícil", banca: "FUVEST",
    enunciado: "Qual a concentração em mol/L (molaridade) de uma solução com 0,5 mol de soluto em 250 mL de solução?",
    alternativas: ["0,5 mol/L", "1 mol/L", "2 mol/L", "2,5 mol/L", "5 mol/L"], correta: 2,
    explicacao: "Molaridade = mols ÷ volume (em litros). 250 mL = 0,25 L. M = 0,5 / 0,25 = 2 mol/L.",
    dica: "Converta mL para L (÷1000). Molaridade = n° de mols ÷ volume em litros."
  },
  {
    area: "natureza", materia: "quimica", topico: "Atomística", nivel: "Médio", banca: "UNESP",
    enunciado: "Um átomo possui número atômico 11 (Z = 11) e número de massa 23 (A = 23). Quantos nêutrons ele tem?",
    alternativas: ["11", "12", "23", "34", "1"], correta: 1,
    explicacao: "Nº de nêutrons = A − Z = 23 − 11 = 12. (Z = prótons = 11; nêutrons = massa − prótons.)",
    dica: "Nêutrons = A − Z (massa menos número atômico)."
  },
  {
    area: "natureza", materia: "quimica", topico: "Gases", nivel: "Difícil", banca: "UNICAMP",
    enunciado: "Mantendo a temperatura constante, um gás ocupa 4 L a 2 atm. Se a pressão passar a 8 atm, o novo volume será (Lei de Boyle):",
    alternativas: ["1 L", "2 L", "4 L", "8 L", "16 L"], correta: 0,
    explicacao: "Lei de Boyle (T constante): P₁V₁ = P₂V₂. Então 2×4 = 8×V₂ → V₂ = 8/8 = 1 L.",
    dica: "Temperatura constante: P·V é constante (quanto maior a pressão, menor o volume)."
  },
  {
    area: "natureza", materia: "quimica", topico: "Orgânica", nivel: "Médio", banca: "PUC",
    enunciado: "O composto de fórmula CH₃–CH₂–OH é um:",
    alternativas: ["Ácido carboxílico", "Álcool (etanol)", "Aldeído", "Éter", "Cetona"], correta: 1,
    explicacao: "A presença do grupo hidroxila (–OH) ligado a carbono saturado caracteriza um álcool. CH₃CH₂OH é o etanol.",
    dica: "Grupo –OH em carbono saturado = álcool. Terminação -ol."
  },
  {
    area: "natureza", materia: "quimica", topico: "pH", nivel: "Médio", banca: "Albert Einstein",
    enunciado: "Uma solução tem concentração de íons H⁺ igual a 10⁻³ mol/L. Seu pH é:",
    alternativas: ["1", "3", "7", "10", "11"], correta: 1,
    explicacao: "pH = −log[H⁺] = −log(10⁻³) = 3. Como pH < 7, a solução é ácida.",
    dica: "pH = −log[H⁺]. Se [H⁺] = 10⁻ⁿ, então pH = n."
  },

  /* ===================== BIOLOGIA ===================== */
  {
    area: "natureza", materia: "biologia", topico: "Genética", nivel: "Difícil", banca: "FUVEST",
    enunciado: "No sistema ABO, um casal em que o pai é tipo A (heterozigoto, Iᴬi) e a mãe tipo B (heterozigota, Iᴮi) pode ter filhos dos tipos:",
    alternativas: ["Somente A e B", "Somente AB", "A, B, AB e O", "Somente O", "Somente A e O"], correta: 2,
    explicacao: "Iᴬi × IᴮI gera: IᴬIᴮ (AB), Iᴬi (A), Iᴮi (B) e ii (O). Portanto, os quatro tipos sanguíneos são possíveis.",
    dica: "Cruze os alelos num quadro de Punnett. Pais heterozigotos A e B podem ter filho O."
  },
  {
    area: "natureza", materia: "biologia", topico: "Citologia", nivel: "Médio", banca: "UNESP",
    enunciado: "A organela responsável pela síntese de proteínas na célula é:",
    alternativas: ["Mitocôndria", "Ribossomo", "Lisossomo", "Complexo de Golgi", "Cloroplasto"], correta: 1,
    explicacao: "Os ribossomos são as organelas onde ocorre a tradução do RNA mensageiro em proteínas (síntese proteica).",
    dica: "Ribossomo = fábrica de proteínas. Mitocôndria = energia (ATP)."
  },
  {
    area: "natureza", materia: "biologia", topico: "Ecologia", nivel: "Médio", banca: "UERJ",
    enunciado: "A relação ecológica entre o boi e os micro-organismos que digerem a celulose em seu estômago, beneficiando ambos, é um exemplo de:",
    alternativas: ["Parasitismo", "Competição", "Mutualismo", "Predação", "Comensalismo"], correta: 2,
    explicacao: "No mutualismo, ambas as espécies se beneficiam: o boi obtém nutrientes da celulose digerida e os micro-organismos ganham abrigo e alimento. É uma relação harmônica interespecífica.",
    dica: "Mutualismo = os dois ganham. Parasitismo = um ganha e o outro perde."
  },
  {
    area: "natureza", materia: "biologia", topico: "Evolução", nivel: "Difícil", banca: "UNICAMP",
    enunciado: "Órgãos análogos, como a asa da ave e a asa do inseto, indicam:",
    alternativas: ["Mesma origem embrionária", "Evolução convergente (funções semelhantes, origens diferentes)", "Parentesco evolutivo próximo", "Órgãos vestigiais", "Mutação recente"], correta: 1,
    explicacao: "Órgãos análogos têm função semelhante mas origens embrionárias diferentes — resultam de evolução convergente (adaptação a pressões parecidas). Já órgãos homólogos têm mesma origem e indicam parentesco.",
    dica: "Análogos = mesma função, origens diferentes (convergente). Homólogos = mesma origem (divergente)."
  },
  {
    area: "natureza", materia: "biologia", topico: "Fisiologia Vegetal", nivel: "Médio", banca: "PUC",
    enunciado: "Na fotossíntese, o gás liberado para a atmosfera é o:",
    alternativas: ["Gás carbônico (CO₂)", "Oxigênio (O₂)", "Nitrogênio (N₂)", "Metano (CH₄)", "Hidrogênio (H₂)"], correta: 1,
    explicacao: "Na fotossíntese, as plantas absorvem CO₂ e água e, usando luz, produzem glicose, liberando O₂ (proveniente da quebra da água) para a atmosfera.",
    dica: "Fotossíntese: entra CO₂, sai O₂. Respiração: o inverso."
  },

  /* ===================== HISTÓRIA ===================== */
  {
    area: "humanas", materia: "historia", topico: "Brasil Colônia", nivel: "Médio", banca: "FUVEST",
    enunciado: "A Inconfidência Mineira (1789) tinha entre seus objetivos:",
    alternativas: ["Manter o pacto colonial com Portugal.", "A independência da capitania e o fim da cobrança de impostos como a derrama.", "A abolição imediata e total da escravidão.", "A união com a Espanha.", "A restauração do absolutismo português."], correta: 1,
    explicacao: "A Inconfidência Mineira foi um movimento das elites mineiras, influenciado pelo Iluminismo, que buscava a independência e protestava contra a pesada tributação da Coroa (como a derrama). A questão da escravidão era secundária e não consensual entre os inconfidentes.",
    dica: "Inconfidência Mineira: influência iluminista, revolta contra impostos (derrama) e desejo de independência."
  },
  {
    area: "humanas", materia: "historia", topico: "História Geral", nivel: "Médio", banca: "UNESP",
    enunciado: "A Revolução Industrial teve início, no século XVIII, principalmente:",
    alternativas: ["Na França", "Na Inglaterra", "Na Alemanha", "nos Estados Unidos", "na Itália"], correta: 1,
    explicacao: "A Revolução Industrial começou na Inglaterra (séc. XVIII), favorecida por acúmulo de capital, mão de obra, carvão, mercado consumidor e pioneirismo tecnológico (máquina a vapor).",
    dica: "Revolução Industrial = Inglaterra, século XVIII, máquina a vapor."
  },
  {
    area: "humanas", materia: "historia", topico: "Brasil República", nivel: "Difícil", banca: "UERJ",
    enunciado: "A Semana de Arte Moderna de 1922 e a fundação do Partido Comunista no mesmo ano evidenciam que a década de 1920 no Brasil foi marcada por:",
    alternativas: ["Total estabilidade da República Velha.", "Questionamentos à ordem oligárquica, tanto no campo cultural quanto no político.", "Apoio unânime à política do café com leite.", "Ausência de movimentos sociais.", "Retorno à monarquia."], correta: 1,
    explicacao: "Os anos 1920 concentraram contestações à hegemonia oligárquica da República Velha: no plano cultural (Modernismo de 22), político (fundação do PCB, tenentismo) e militar (revoltas tenentistas), preparando a crise que levaria à Revolução de 1930.",
    dica: "Anos 1920 = efervescência contestatória que mina a República Velha (Modernismo, tenentismo, PCB)."
  },
  {
    area: "humanas", materia: "historia", topico: "Idade Moderna", nivel: "Médio", banca: "PUC",
    enunciado: "O movimento cultural dos séculos XV e XVI que valorizou o humanismo, a razão e a Antiguidade Clássica foi:",
    alternativas: ["O Feudalismo", "O Renascimento", "A Reforma Protestante", "O Iluminismo", "O Romantismo"], correta: 1,
    explicacao: "O Renascimento (séc. XV–XVI) retomou os valores clássicos greco-romanos, valorizando o humanismo (homem no centro), a razão, a ciência e o antropocentrismo, em contraste com o teocentrismo medieval.",
    dica: "Renascimento = humanismo + antropocentrismo + retomada da Antiguidade Clássica."
  },

  /* ===================== GEOGRAFIA ===================== */
  {
    area: "humanas", materia: "geografia", topico: "Climatologia", nivel: "Médio", banca: "FUVEST",
    enunciado: "O fenômeno climático El Niño caracteriza-se pelo:",
    alternativas: ["Resfriamento anormal das águas do Pacífico.", "Aquecimento anormal das águas superficiais do Pacífico equatorial, alterando o clima global.", "Aumento das chuvas apenas na Europa.", "Congelamento do oceano Atlântico.", "Desaparecimento das monções."], correta: 1,
    explicacao: "O El Niño é o aquecimento anômalo das águas superficiais do Pacífico equatorial, que desorganiza a circulação atmosférica e provoca alterações climáticas globais (secas no Nordeste, chuvas no Sul do Brasil, por exemplo). A fase fria é a La Niña.",
    dica: "El Niño = aquecimento do Pacífico. La Niña = resfriamento. Ambos alteram o clima mundial."
  },
  {
    area: "humanas", materia: "geografia", topico: "Geografia Econômica", nivel: "Médio", banca: "UNESP",
    enunciado: "A sigla PIB (Produto Interno Bruto) representa:",
    alternativas: ["A dívida externa de um país.", "A soma de todos os bens e serviços finais produzidos em um país em um período.", "O número de habitantes de um país.", "A taxa de desemprego.", "O total de impostos arrecadados."], correta: 1,
    explicacao: "O PIB é a soma do valor de todos os bens e serviços finais produzidos em um território durante certo período. É o principal indicador do tamanho de uma economia (mas não mede diretamente a distribuição de renda).",
    dica: "PIB = tudo que o país produz. Alto PIB não significa, por si só, boa distribuição de renda."
  },
  {
    area: "humanas", materia: "geografia", topico: "Geopolítica", nivel: "Difícil", banca: "UERJ",
    enunciado: "A Organização das Nações Unidas (ONU) tem como um de seus principais órgãos o Conselho de Segurança, cujos cinco membros permanentes com poder de veto são:",
    alternativas: ["Brasil, Índia, Alemanha, Japão e África do Sul", "EUA, Rússia, China, Reino Unido e França", "EUA, Brasil, China, Índia e Rússia", "Alemanha, Itália, Japão, França e EUA", "China, Índia, Rússia, Brasil e EUA"], correta: 1,
    explicacao: "Os cinco membros permanentes do Conselho de Segurança da ONU (com poder de veto) são EUA, Rússia, China, Reino Unido e França — as potências vencedoras da Segunda Guerra Mundial.",
    dica: "Membros permanentes da ONU = vencedores da 2ª Guerra: EUA, Rússia, China, Reino Unido, França."
  },
  {
    area: "humanas", materia: "geografia", topico: "Geografia do Brasil", nivel: "Médio", banca: "Mackenzie",
    enunciado: "A principal fonte de energia elétrica do Brasil é a:",
    alternativas: ["Termelétrica a carvão", "Hidrelétrica", "Nuclear", "Eólica", "Solar fotovoltaica"], correta: 1,
    explicacao: "A matriz elétrica brasileira é predominantemente hidrelétrica, graças ao grande potencial hídrico do país (bacias com muitos rios e desníveis). Eólica e solar vêm crescendo, mas a hidrelétrica ainda lidera.",
    dica: "Brasil = matriz elétrica majoritariamente hidrelétrica."
  },

  /* ===================== FILOSOFIA/SOCIOLOGIA ===================== */
  {
    area: "humanas", materia: "filosociologia", topico: "Filosofia", nivel: "Difícil", banca: "UNICAMP",
    enunciado: "A frase 'Penso, logo existo' (Cogito, ergo sum), que fundamenta o racionalismo moderno, é de:",
    alternativas: ["Aristóteles", "René Descartes", "Karl Marx", "Immanuel Kant", "Friedrich Nietzsche"], correta: 1,
    explicacao: "A célebre proposição 'Penso, logo existo' é de René Descartes. Por meio da dúvida metódica, ele chega à única certeza inabalável: a existência do sujeito que pensa — base do racionalismo moderno.",
    dica: "'Cogito, ergo sum' = Descartes, pai do racionalismo e da dúvida metódica."
  },
  {
    area: "humanas", materia: "filosociologia", topico: "Sociologia", nivel: "Médio", banca: "UERJ",
    enunciado: "O processo pelo qual o indivíduo aprende as normas, valores e costumes de sua sociedade é chamado de:",
    alternativas: ["Alienação", "Socialização", "Estratificação", "Anomia", "Mobilidade"], correta: 1,
    explicacao: "A socialização é o processo contínuo pelo qual o indivíduo internaliza a cultura (normas, valores, papéis) do grupo em que vive, tornando-se membro da sociedade. A família e a escola são agentes socializadores primários.",
    dica: "Socialização = aprender a cultura/normas da sociedade. Família e escola são agentes."
  },

  /* ===================== LINGUAGENS ===================== */
  {
    area: "linguagens", materia: "portugues", topico: "Literatura", nivel: "Difícil", banca: "FUVEST",
    enunciado: "A obra 'Os Lusíadas', de Luís de Camões, é uma epopeia que exalta:",
    alternativas: ["A vida urbana contemporânea.", "As grandes navegações e os feitos heroicos do povo português.", "A decadência do Império Romano.", "A Revolução Industrial inglesa.", "A mitologia asteca."], correta: 1,
    explicacao: "'Os Lusíadas' (1572) é uma epopeia clássica que narra e exalta as grandes navegações portuguesas, especialmente a viagem de Vasco da Gama às Índias, celebrando os feitos heroicos do povo lusitano.",
    dica: "'Os Lusíadas' = epopeia de Camões sobre as navegações e a glória de Portugal."
  },
  {
    area: "linguagens", materia: "portugues", topico: "Gramática", nivel: "Médio", banca: "UNESP",
    enunciado: "Na frase 'Os estudantes dedicados conquistaram boas notas', a palavra 'dedicados' é:",
    alternativas: ["Substantivo", "Adjetivo", "Verbo", "Advérbio", "Preposição"], correta: 1,
    explicacao: "'Dedicados' qualifica o substantivo 'estudantes' (quais estudantes? os dedicados), funcionando como adjetivo (atribui uma característica ao substantivo).",
    dica: "Adjetivo caracteriza o substantivo. Pergunte: 'como/qual é o substantivo?'"
  },
  {
    area: "linguagens", materia: "ingles", topico: "Leitura instrumental", nivel: "Médio", banca: "PUC",
    enunciado: "In the sentence 'The results were not only surprising but also encouraging', the structure 'not only... but also' expresses:",
    alternativas: ["contrast", "addition (both ideas together)", "cause", "condition", "time"], correta: 1,
    explicacao: "A estrutura correlativa 'not only... but also' expressa adição enfática: une duas ideias ('não apenas... mas também'). Aqui, os resultados foram surpreendentes E encorajadores.",
    dica: "'not only... but also' = não apenas... mas também (adição enfática)."
  }
];
