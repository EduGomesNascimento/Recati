/* ============================================================
   CONTEÚDO — Trilhas de estudo organizadas em MÓDULOS.
   Cobre as 4 áreas do ENEM + Redação, do zero ao avançado.
   Cada lição: modulo, teoria, mnemônicos, analogias, dicas,
   blocos de atenção e representações gráficas.
   ============================================================ */
window.ENEM_CONTENT = {
  areas: [
    { id: "linguagens", nome: "Linguagens e Códigos", emoji: "📖", cor: "var(--s7)", desc: "Interpretação, gramática, literatura, artes e língua estrangeira." },
    { id: "humanas", nome: "Ciências Humanas", emoji: "🌍", cor: "var(--s3)", desc: "História, Geografia, Filosofia e Sociologia." },
    { id: "natureza", nome: "Ciências da Natureza", emoji: "🔬", cor: "var(--s2)", desc: "Biologia, Química e Física." },
    { id: "matematica", nome: "Matemática", emoji: "🔢", cor: "var(--s1)", desc: "45 questões — o grande divisor de águas." },
    { id: "redacao", nome: "Redação", emoji: "📝", cor: "var(--s5)", desc: "Dissertativo-argumentativo — até 1000 pontos." }
  ],

  materias: {
    /* ==================== MATEMÁTICA ==================== */
    matematica: {
      area: "matematica", nome: "Matemática", emoji: "🔢", incidencia: "45 questões",
      resumo: "A matéria com mais questões. Domine o básico (proporção/porcentagem) antes de tudo.",
      licoes: [
        {
          id: "mat-01", modulo: "Módulo 1 · Aritmética e Proporção", titulo: "Porcentagem e proporção", nivel: "Básico", incidencia: "32–37% (altíssima)",
          objetivo: "Resolver rapidamente regra de três, porcentagem sobre porcentagem, razões e escalas.",
          teoria: [
            { t: "p", c: "Porcentagem é uma fração de denominador 100. Assim, 25% = 25/100 = 0,25. Para calcular X% de um valor, multiplique o valor por X/100." },
            { t: "formula", c: "X% de V  =  V × (X ÷ 100)" },
            { t: "p", c: "Aumento de p% multiplica por (1 + p/100). Desconto de p% multiplica por (1 − p/100). Aumentos e descontos sucessivos NÃO se somam: você multiplica os fatores." },
            { t: "ex", c: "Um produto de R$200 sobe 10% e depois cai 10%. Não volta a R$200! Fica 200×1,10×0,90 = R$198." },
            { t: "h4", c: "Regra de três" },
            { t: "p", c: "Grandezas diretamente proporcionais crescem juntas (multiplica cruzado). Inversamente proporcionais: uma cresce, a outra cai (inverte uma coluna)." }
          ],
          mnemonico: "\"Mais gente, menos tempo\" → inversamente proporcional. Se aumentar uma grandeza faz a outra DIMINUIR, inverta antes de multiplicar cruzado.",
          analogia: "Porcentagem sucessiva é como descer duas escadas rolantes: você não soma os degraus, aplica um efeito depois do outro sobre o que sobrou.",
          dica: "No ENEM, ~1 em cada 3 questões de matemática esconde uma regra de três. Se travou, pergunte: 'o que é proporcional a quê?'",
          grafico: { tipo: "barras", titulo: "Incidência dos temas de Matemática (%)", dados: [{ r: "Básica/Aritmética", v: 35 }, { r: "Geometria", v: 20 }, { r: "Estatística/Prob.", v: 15 }, { r: "Álgebra/Funções", v: 9 }] }
        },
        {
          id: "mat-05", modulo: "Módulo 1 · Aritmética e Proporção", titulo: "Matemática financeira: juros", nivel: "Intermediário", incidencia: "parte de Aritmética",
          objetivo: "Calcular juros simples e compostos e entender acréscimos/descontos no consumo.",
          teoria: [
            { t: "formula", c: "Juros simples: J = C · i · t   (taxa i em decimal)" },
            { t: "p", c: "No juros SIMPLES, os juros incidem sempre sobre o capital inicial. No juros COMPOSTO, incidem sobre o montante acumulado ('juros sobre juros'), por isso crescem mais rápido." },
            { t: "formula", c: "Montante composto: M = C · (1 + i)ᵗ" },
            { t: "ex", c: "R$1000 a 10% ao mês por 2 meses: simples → 1000+2×100 = R$1200; composto → 1000×1,1² = R$1210." }
          ],
          mnemonico: "Composto = 'bola de neve': juros sobre juros. Simples = 'fatia fixa' sempre igual.",
          analogia: "Juros compostos são como uma planta que cresce sobre o que já cresceu; simples é adicionar sempre o mesmo tijolo.",
          dica: "Cuidado com a taxa: transforme % em decimal (10% = 0,10) e confira se o tempo está na mesma unidade da taxa.",
          grafico: null
        },
        {
          id: "mat-02", modulo: "Módulo 2 · Estatística e Probabilidade", titulo: "Medidas de tendência central", nivel: "Intermediário", incidencia: "11–17%",
          objetivo: "Calcular média (simples e ponderada), moda e mediana e interpretar gráficos.",
          teoria: [
            { t: "p", c: "Média aritmética: some tudo e divida pela quantidade. Média ponderada: cada valor tem um 'peso'; multiplique valor×peso, some e divida pela soma dos pesos." },
            { t: "p", c: "Moda: o valor que mais aparece. Mediana: o valor do meio quando os dados estão em ordem (se houver dois no meio, faça a média deles)." },
            { t: "ex", c: "Notas 5, 7, 7, 10 → média (5+7+7+10)/4 = 7,25; moda = 7; mediana = (7+7)/2 = 7." }
          ],
          mnemonico: "MEdiana = MEio (ordene primeiro!). MOda = a que mais Ocorre.",
          analogia: "A mediana é o 'juiz imparcial': quem está no meio da fila. Não se deixa enganar por um valor gigante (outlier), diferente da média.",
          dica: "Se um gráfico tem uma barra muito alta (outlier), a questão provavelmente quer a MEDIANA, não a média.",
          grafico: null
        },
        {
          id: "mat-06", modulo: "Módulo 2 · Estatística e Probabilidade", titulo: "Probabilidade e contagem", nivel: "Intermediário", incidencia: "parte de Estatística",
          objetivo: "Calcular probabilidades simples e usar o princípio da contagem.",
          teoria: [
            { t: "formula", c: "P(evento) = casos favoráveis ÷ casos totais" },
            { t: "p", c: "Probabilidade vai de 0 (impossível) a 1 (certo), ou de 0% a 100%. Para eventos independentes em sequência, MULTIPLIQUE as probabilidades ('e'). Para alternativas, SOME ('ou')." },
            { t: "p", c: "Princípio multiplicativo da contagem: se uma escolha tem m opções e outra tem n, o total de combinações é m×n." },
            { t: "ex", c: "Dado comum: P(sair par) = 3/6 = 1/2. Dois dados, P(dois 6) = 1/6 × 1/6 = 1/36." }
          ],
          mnemonico: "'E' multiplica, 'OU' soma. Guardou isso, resolveu metade das questões.",
          analogia: "Contagem é um cardápio: 3 sucos e 4 lanches dão 3×4 = 12 combinações de merenda.",
          dica: "Comece sempre achando o total de casos possíveis — é o denominador de tudo.",
          grafico: null
        },
        {
          id: "mat-03", modulo: "Módulo 3 · Álgebra e Funções", titulo: "Funções do 1º e 2º grau", nivel: "Intermediário", incidencia: "8–10%",
          objetivo: "Modelar situações lineares e parabólicas; achar vértice, raízes e máximo/mínimo.",
          teoria: [
            { t: "formula", c: "1º grau: f(x) = a·x + b   (a = inclinação, b = valor inicial)" },
            { t: "formula", c: "2º grau: f(x) = a·x² + b·x + c" },
            { t: "p", c: "Na função do 2º grau, se a > 0 a parábola tem boca para cima (ponto de MÍNIMO); se a < 0, boca para baixo (ponto de MÁXIMO). O vértice dá o valor extremo." },
            { t: "formula", c: "x do vértice = −b ÷ (2a)" },
            { t: "p", c: "ENEM adora usar a função do 2º grau para 'lucro máximo' e 'altura máxima de um projétil' — sempre no vértice." }
          ],
          mnemonico: "'a positivo = alegria (sorriso ∪); a negativo = boca pra baixo ∩'.",
          analogia: "A parábola de um projétil é como jogar uma bola: sobe, atinge o topo (vértice = altura máxima) e desce simetricamente.",
          dica: "Viu 'valor máximo', 'lucro máximo' ou 'altura máxima'? Calcule o vértice. Quase nunca é preciso testar valores um a um.",
          grafico: { tipo: "funcao", titulo: "Parábola de lucro (vértice = lucro máximo)" }
        },
        {
          id: "mat-07", modulo: "Módulo 3 · Álgebra e Funções", titulo: "Função exponencial e crescimento", nivel: "Avançado", incidencia: "parte de Funções",
          objetivo: "Reconhecer crescimento/decrescimento exponencial em populações, juros e radioatividade.",
          teoria: [
            { t: "formula", c: "Exponencial: f(x) = a · bˣ   (b > 1 cresce; 0 < b < 1 decresce)" },
            { t: "p", c: "Diferente da função linear (soma sempre a mesma quantidade), a exponencial MULTIPLICA por um fator fixo a cada período. Por isso 'dispara'." },
            { t: "p", c: "Aplicações típicas no ENEM: crescimento populacional/bacteriano, juros compostos, meia-vida (decaimento radioativo) e disseminação de vírus." },
            { t: "ex", c: "Uma bactéria que dobra a cada hora: 1 → 2 → 4 → 8 → 16... é 2ˣ. Meia-vida: a cada período, a quantidade cai pela metade." }
          ],
          mnemonico: "Linear SOMA, exponencial MULTIPLICA. 'Explodiu'? É exponencial.",
          analogia: "Exponencial é uma corrente de mensagens: cada pessoa repassa para várias, e o número dispara em pouco tempo.",
          dica: "Meia-vida = decaimento exponencial. A cada período fixo, sobra metade: 100% → 50% → 25% → 12,5%.",
          grafico: null
        },
        {
          id: "mat-04", modulo: "Módulo 4 · Geometria", titulo: "Geometria plana e trigonometria", nivel: "Avançado", incidencia: "16–22%",
          objetivo: "Calcular áreas, perímetros e aplicar Pitágoras e razões trigonométricas.",
          teoria: [
            { t: "formula", c: "Teorema de Pitágoras: hipotenusa² = cateto² + cateto²" },
            { t: "p", c: "Áreas essenciais: retângulo (b×h), triângulo (b×h/2), círculo (π·r²). Trigonometria no triângulo retângulo: seno = cateto oposto/hipotenusa; cosseno = cateto adjacente/hipotenusa; tangente = oposto/adjacente." },
            { t: "p", c: "Reconhecer as ternas pitagóricas (3-4-5, 5-12-13, 8-15-17) e seus múltiplos economiza muito tempo." }
          ],
          mnemonico: "SOH-CAH-TOA: Seno=Oposto/Hipotenusa, Cosseno=Adjacente/Hipotenusa, Tangente=Oposto/Adjacente.",
          analogia: "As razões trigonométricas são 'proporções da rampa': quanto mais inclinada, maior a tangente do ângulo.",
          dica: "Antes de calcular, cheque as UNIDADES. Metade dos erros de geometria no ENEM é conversão.",
          grafico: null
        },
        {
          id: "mat-08", modulo: "Módulo 4 · Geometria", titulo: "Geometria espacial e volumes", nivel: "Avançado", incidencia: "parte de Geometria",
          objetivo: "Calcular volumes de sólidos e converter unidades (m³ ↔ litros).",
          teoria: [
            { t: "p", c: "Volume de qualquer 'coluna reta' (prisma e cilindro) = área da base × altura. Pirâmides e cones têm 1/3 desse valor. Esfera = (4/3)·π·r³." },
            { t: "formula", c: "Cilindro: V = π·r²·h        Esfera: V = (4/3)·π·r³" },
            { t: "atencao", c: "Conversão que derruba candidato: 1 m³ = 1000 litros. Reservatórios quase sempre pedem essa troca." },
            { t: "ex", c: "Caixa d'água cilíndrica de raio 1 m e altura 2 m: V = π·1²·2 ≈ 6,28 m³ ≈ 6280 litros." }
          ],
          mnemonico: "Prisma/cilindro: 'a base carrega tudo pra cima' → Área da base × altura. Ponta (cone/pirâmide) → divide por 3.",
          analogia: "Volume de prisma é empilhar folhas idênticas: a área de uma folha (base) vezes a altura da pilha.",
          dica: "Objeto submerso desloca volume igual ao seu próprio: é assim que se calcula a variação de nível em reservatórios.",
          grafico: null
        }
      ]
    },

    /* ==================== FÍSICA ==================== */
    fisica: {
      area: "natureza", nome: "Física", emoji: "⚛️", incidencia: "~15 questões",
      resumo: "Física do ENEM é do cotidiano: conta de luz, calor, som, movimento. Fórmula sozinha não resolve — entenda o fenômeno.",
      licoes: [
        {
          id: "fis-01", modulo: "Módulo 1 · Mecânica", titulo: "Leis de Newton e energia", nivel: "Básico", incidencia: "26–31%",
          objetivo: "Aplicar as Leis de Newton e a conservação de energia.",
          teoria: [
            { t: "p", c: "1ª Lei (Inércia): sem força resultante, o corpo mantém seu estado. 2ª Lei: F = m·a. 3ª Lei: ação e reação (forças em corpos diferentes)." },
            { t: "p", c: "Energia mecânica = cinética (movimento) + potencial (posição/altura). Sem atrito, ela se conserva: o que perde de altura, ganha de velocidade." },
            { t: "formula", c: "E_cinética = m·v²/2      E_potencial = m·g·h" }
          ],
          mnemonico: "Leis de Newton: 'IN-FA-RE' → INércia, F=m·A, REação.",
          analogia: "Conservação de energia é uma montanha-russa: no alto tem energia 'guardada' (potencial); ao descer, ela 'vira' velocidade (cinética).",
          dica: "Ação e reação NUNCA se anulam, porque agem em corpos diferentes. Erro clássico do ENEM.",
          grafico: null
        },
        {
          id: "fis-04", modulo: "Módulo 1 · Mecânica", titulo: "Cinemática: interpretando gráficos", nivel: "Intermediário", incidencia: "parte de Mecânica",
          objetivo: "Ler gráficos de posição e velocidade e usar as equações do MU e MUV.",
          teoria: [
            { t: "p", c: "Movimento Uniforme (MU): velocidade constante, gráfico posição×tempo é uma reta inclinada. Movimento Uniformemente Variado (MUV): aceleração constante, velocidade varia linearmente." },
            { t: "formula", c: "MU: S = S₀ + v·t     MUV: S = S₀ + v₀·t + a·t²/2" },
            { t: "p", c: "Num gráfico velocidade×tempo, a ÁREA sob a curva é o deslocamento, e a INCLINAÇÃO é a aceleração." }
          ],
          mnemonico: "No gráfico v×t: 'Área = distância; Inclinação = aceleração'.",
          analogia: "A inclinação de um gráfico é a 'ladeira' da informação: quanto mais íngreme, mais rápido algo muda.",
          dica: "O ENEM adora dar um gráfico e pedir interpretação, não conta. Treine ler área e inclinação.",
          grafico: null
        },
        {
          id: "fis-02", modulo: "Módulo 2 · Eletricidade e Energia", titulo: "Eletrodinâmica — a conta de luz", nivel: "Intermediário", incidencia: "19–26%",
          objetivo: "Calcular potência, consumo em kWh e resistências em série/paralelo.",
          teoria: [
            { t: "formula", c: "Potência: P = U·i     Energia consumida: E = P × tempo" },
            { t: "p", c: "A conta de luz é cobrada em quilowatt-hora (kWh): potência (kW) × horas de uso. Aparelhos de aquecimento (chuveiro, ferro) gastam mais por causa do Efeito Joule." },
            { t: "ex", c: "Chuveiro de 5400 W (5,4 kW) usado 1h/dia por 30 dias: 5,4 × 1 × 30 = 162 kWh no mês." },
            { t: "atencao", c: "Correntes de 20 mA a 100 mA no corpo humano podem causar parada respiratória — segurança elétrica cai no ENEM." }
          ],
          mnemonico: "Potência: 'PUI!' → P = U·i.",
          analogia: "Circuito elétrico é encanamento: tensão (U) é a pressão da água, corrente (i) é a vazão, resistência é o cano estreito.",
          dica: "Consumo alto = potência alta × tempo longo. O vilão da conta quase sempre é o chuveiro elétrico.",
          grafico: { tipo: "barras", titulo: "Consumo típico mensal (kWh)", dados: [{ r: "Chuveiro", v: 162 }, { r: "Geladeira", v: 45 }, { r: "Ar-cond.", v: 120 }, { r: "TV", v: 15 }] }
        },
        {
          id: "fis-03", modulo: "Módulo 3 · Termologia", titulo: "Calor, temperatura e trocas térmicas", nivel: "Intermediário", incidencia: "13–17%",
          objetivo: "Diferenciar calor e temperatura; aplicar Q=m·c·ΔT; entender condução, convecção e irradiação.",
          teoria: [
            { t: "p", c: "Temperatura mede a agitação das partículas; calor é energia em trânsito do corpo quente para o frio. Transferência: condução (contato), convecção (fluidos), irradiação (ondas)." },
            { t: "formula", c: "Calor sensível: Q = m·c·ΔT" },
            { t: "p", c: "Calor latente é o calor trocado na MUDANÇA DE ESTADO (gelo→água), sem mudar a temperatura enquanto dura a transição." }
          ],
          mnemonico: "Transferência de calor: 'Cco-Cve-Irr' — Condução (Contato), Convecção (Corrente de fluido), Irradiação (Raios).",
          analogia: "Coletor solar funciona por convecção: água quente sobe, fria desce, criando circulação — como uma esteira invisível.",
          dica: "Durante a mudança de estado (gelo derretendo), a temperatura NÃO muda: todo o calor vai para a transição (calor latente).",
          grafico: null
        },
        {
          id: "fis-05", modulo: "Módulo 4 · Ondas e Óptica", titulo: "Ondulatória, som e óptica", nivel: "Avançado", incidencia: "13–18%",
          objetivo: "Aplicar v=λ·f, entender efeito Doppler e a correção de vícios de visão.",
          teoria: [
            { t: "formula", c: "Ondas: v = λ·f   (velocidade = comprimento de onda × frequência)" },
            { t: "p", c: "Ondas mecânicas (som) precisam de meio material; eletromagnéticas (luz, rádio) se propagam no vácuo. Fenômenos: reflexão, refração, difração e interferência (base do cancelamento de ruído)." },
            { t: "p", c: "Efeito Doppler: a frequência aparente muda com o movimento relativo — a ambulância se aproximando soa mais aguda; afastando, mais grave." },
            { t: "p", c: "Óptica: miopia se corrige com lentes divergentes (negativas); hipermetropia, com convergentes (positivas)." }
          ],
          mnemonico: "Efeito Doppler: 'aproxima = agudo, afasta = grave'.",
          analogia: "As ondas na frente do carro se 'amontoam' (agudo) e atrás se 'esticam' (grave), como marcas de tinta espremidas.",
          dica: "Som é onda mecânica (não se propaga no vácuo). Luz é eletromagnética (viaja no vácuo). Não troque.",
          grafico: null
        }
      ]
    },

    /* ==================== QUÍMICA ==================== */
    quimica: {
      area: "natureza", nome: "Química", emoji: "🧪", incidencia: "~15 questões",
      resumo: "Química conecta o microscópico (átomos, ligações) com o macro (indústria, ambiente). Estequiometria é a linguagem-base.",
      licoes: [
        {
          id: "qui-01", modulo: "Módulo 1 · Química Geral", titulo: "Estequiometria e o conceito de mol", nivel: "Básico", incidencia: "27–33%",
          objetivo: "Dominar mol, massa molar, reagente limitante e balanceamento.",
          teoria: [
            { t: "p", c: "Mol é a 'dúzia do químico': 1 mol = 6,02×10²³ partículas. A massa molar (g/mol) é a massa de 1 mol e vem da tabela periódica." },
            { t: "p", c: "Estequiometria é a 'receita de bolo' das reações: os coeficientes balanceados dizem a proporção entre reagentes e produtos." },
            { t: "p", c: "Reagente limitante é o ingrediente que acaba primeiro e define o quanto de produto se forma." }
          ],
          mnemonico: "Balancear: 'MACHO' → Metais, Ametais, Carbono, Hidrogênio, Oxigênio (ordem prática).",
          analogia: "Reagente limitante é fazer sanduíches: com 10 fatias de pão e 3 de queijo, o queijo limita você a 3 sanduíches — sobra pão.",
          dica: "Sempre balanceie a equação ANTES de fazer contas. Coeficiente errado = resposta errada.",
          grafico: { tipo: "barras", titulo: "Incidência dos temas de Química (%)", dados: [{ r: "Geral/Estequio.", v: 30 }, { r: "Físico-Química", v: 28 }, { r: "Orgânica", v: 18 }, { r: "Ambiental", v: 12 }, { r: "Eletroquím.", v: 8 }] }
        },
        {
          id: "qui-04", modulo: "Módulo 1 · Química Geral", titulo: "Separação de misturas", nivel: "Básico", incidencia: "parte de Química Geral",
          objetivo: "Reconhecer os métodos de separação em contextos como tratamento de água e petróleo.",
          teoria: [
            { t: "p", c: "Tratamento de água (ETA): floculação (aglomera impurezas), decantação (deposita por gravidade) e filtração (retém sólidos)." },
            { t: "p", c: "Destilação separa líquidos por diferença de ponto de ebulição. A destilação FRACIONADA separa o petróleo em gasolina, querosene, diesel etc." },
            { t: "ex", c: "Água + areia: filtração. Água + sal dissolvido: destilação (evapora e recondensa a água). Petróleo: destilação fracionada." }
          ],
          mnemonico: "ETA: 'Flô Deca Filtra' → Floculação, Decantação, Filtração.",
          analogia: "A destilação fracionada é uma 'torre de andares': cada fração do petróleo 'desce' em um andar conforme seu ponto de ebulição.",
          dica: "Sólido que não dissolve → filtração/decantação. Dissolvido → destilação. Identifique se a mistura é homogênea ou heterogênea.",
          grafico: null
        },
        {
          id: "qui-02", modulo: "Módulo 2 · Físico-Química", titulo: "Termoquímica, cinética e equilíbrio", nivel: "Intermediário", incidencia: "27–30%",
          objetivo: "Entender entalpia (Hess), o que acelera reações e o princípio de Le Chatelier.",
          teoria: [
            { t: "p", c: "Reação exotérmica LIBERA calor (ΔH<0); endotérmica ABSORVE calor (ΔH>0)." },
            { t: "p", c: "Velocidade da reação aumenta com: temperatura, superfície de contato, concentração e catalisadores." },
            { t: "p", c: "Le Chatelier: um equilíbrio 'reage' a perturbações para minimizá-las. Aumentou reagente? O equilíbrio se desloca para consumir esse excesso." }
          ],
          mnemonico: "'EXO = EXIt do calor (sai); ENDO = ENtra calor'.",
          analogia: "Le Chatelier é uma gangorra: você aperta um lado, ela se ajusta pro outro pra reequilibrar.",
          dica: "Catalisador acelera a reação mas NÃO desloca o equilíbrio nem é consumido. Pegadinha frequente.",
          grafico: null
        },
        {
          id: "qui-05", modulo: "Módulo 2 · Físico-Química", titulo: "Eletroquímica: pilhas e corrosão", nivel: "Avançado", incidencia: "6–9%",
          objetivo: "Determinar ânodo/cátodo em pilhas e entender proteção contra corrosão.",
          teoria: [
            { t: "p", c: "Na pilha (célula galvânica), a OXIDAÇÃO (perda de elétrons) ocorre no ânodo (polo negativo) e a REDUÇÃO (ganho) no cátodo (polo positivo). Elétrons fluem do ânodo para o cátodo." },
            { t: "p", c: "Quem tem menor potencial de redução oxida (é o ânodo). A eletrólise é o processo inverso: usa energia elétrica para forçar reações (metalurgia, galvanização)." },
            { t: "p", c: "Proteção contra corrosão: 'metal de sacrifício' — um metal mais reativo (zinco) oxida no lugar do ferro, protegendo-o." }
          ],
          mnemonico: "'ânodo = oxidação' (vogais juntas). 'REDução = REcebe elétrons no CÁTodo'.",
          analogia: "O metal de sacrifício é o 'guarda-costas' do ferro: ele se corrói primeiro para o ferro não enferrujar.",
          dica: "Pilha PRODUZ energia (espontânea). Eletrólise CONSOME energia (forçada). Não confunda os dois.",
          grafico: null
        },
        {
          id: "qui-03", modulo: "Módulo 3 · Orgânica e Ambiente", titulo: "Química orgânica e ambiental", nivel: "Avançado", incidencia: "30–33% (somados)",
          objetivo: "Reconhecer funções orgânicas e entender chuva ácida e efeito estufa.",
          teoria: [
            { t: "p", c: "Funções orgânicas se reconhecem pelo grupo funcional: álcool (–OH), ácido carboxílico (–COOH), cetona (C=O no meio), aldeído (C=O na ponta), amina (–NH₂)." },
            { t: "p", c: "Esterificação (ácido + álcool → éster) dá aromas de frutas; saponificação produz sabão. Biodiesel vem da transesterificação de óleos." },
            { t: "p", c: "Chuva ácida: óxidos de enxofre e nitrogênio (SOₓ, NOₓ) reagem com água e formam ácidos. Efeito estufa: CO₂ e metano retêm calor na atmosfera." }
          ],
          mnemonico: "Forças intermoleculares (crescente): 'Di-Di-Po' → Dipolo induzido (London) < Dipolo permanente < Pontes de hidrogênio.",
          analogia: "Pontes de hidrogênio são o 'velcro' das moléculas: grudam forte, por isso a água ferve a 100°C.",
          dica: "Ponto de ebulição alto = forças intermoleculares fortes (pontes de H). Isso explica solubilidade e evaporação.",
          grafico: null
        }
      ]
    },

    /* ==================== BIOLOGIA ==================== */
    biologia: {
      area: "natureza", nome: "Biologia", emoji: "🧬", incidencia: "~15 questões",
      resumo: "Biologia do ENEM gira em torno de ecologia, saúde pública e genética, quase sempre a partir de uma situação-problema.",
      licoes: [
        {
          id: "bio-01", modulo: "Módulo 1 · Ecologia", titulo: "Cadeias, energia e impactos ambientais", nivel: "Básico", incidencia: "22–37%",
          objetivo: "Entender cadeias/teias alimentares, ciclos biogeoquímicos e impactos ambientais.",
          teoria: [
            { t: "p", c: "Energia flui em UM sentido (produtores → consumidores → decompositores) e diminui a cada nível; matéria CICLA (ciclos do carbono, nitrogênio, água)." },
            { t: "p", c: "Impactos: eutrofização (excesso de nutrientes → algas → morte de peixes), magnificação trófica (acúmulo de toxinas ao longo da cadeia) e aquecimento global." },
            { t: "p", c: "Relações ecológicas: mutualismo (ganha-ganha), parasitismo (um ganha, outro perde), competição, predação." }
          ],
          mnemonico: "'Energia FLUI e some; matéria CICLA e volta'. Nunca escreva que energia 'circula'.",
          analogia: "A pirâmide de energia é um funil: só ~10% passa de um nível para o próximo. Por isso há muitos capins e poucos leões.",
          dica: "Magnificação trófica: o predador do topo (e o humano) acumula mais poluente. Peixe grande = mais mercúrio.",
          grafico: { tipo: "barras", titulo: "Energia disponível por nível trófico (%)", dados: [{ r: "Produtores", v: 100 }, { r: "1º Consum.", v: 10 }, { r: "2º Consum.", v: 1 }, { r: "3º Consum.", v: 0.1 }] }
        },
        {
          id: "bio-04", modulo: "Módulo 1 · Ecologia", titulo: "Biomas brasileiros e sustentabilidade", nivel: "Intermediário", incidencia: "parte de Ecologia",
          objetivo: "Reconhecer os biomas do Brasil e discutir preservação e restauração.",
          teoria: [
            { t: "p", c: "Biomas do Brasil: Amazônia (floresta úmida, maior biodiversidade), Cerrado (savana, 'berço das águas'), Caatinga (semiárido, xerófitas), Mata Atlântica (muito devastada), Pampa e Pantanal (maior planície alagável)." },
            { t: "p", c: "Sucessão ecológica: recuperação gradual de um ecossistema, das espécies pioneiras à comunidade clímax. Técnicas como 'bombas de sementes' aceleram a restauração de áreas degradadas." }
          ],
          mnemonico: "Cerrado = 'caixa d'água do Brasil' (nasce ali boa parte dos rios). Caatinga = seca. Pantanal = alaga.",
          analogia: "A sucessão ecológica é como reformar uma casa em ruínas: primeiro entram os 'faz-tudo' (pioneiras), depois a estrutura complexa se estabelece.",
          dica: "Amazônia = maior biodiversidade; Mata Atlântica = mais ameaçada. O ENEM cobra a devastação por fronteiras agropecuárias.",
          grafico: null
        },
        {
          id: "bio-02", modulo: "Módulo 2 · Célula e Corpo Humano", titulo: "Citologia e bioenergética", nivel: "Intermediário", incidencia: "9–12%",
          objetivo: "Diferenciar transporte de membrana, respiração celular e fotossíntese.",
          teoria: [
            { t: "p", c: "Transporte passivo (a favor do gradiente, sem gastar energia): difusão e osmose. Transporte ativo (contra o gradiente, gasta ATP): bomba de sódio-potássio." },
            { t: "p", c: "Respiração celular (na mitocôndria) quebra glicose com O₂ e produz muito ATP. Fermentação não usa O₂ e rende pouco ATP (pão, iogurte, álcool)." },
            { t: "p", c: "Fotossíntese: plantas capturam CO₂ e luz, produzem glicose e liberam O₂." }
          ],
          mnemonico: "'ATIVO gasta ATP' (as duas têm 'AT'). Passivo vai a favor da correnteza.",
          analogia: "Transporte ativo é remar contra a correnteza (cansa, gasta energia); passivo é boiar rio abaixo (de graça).",
          dica: "Mitocôndria = respiração (produz ATP). Cloroplasto = fotossíntese (produz glicose). Não troque as organelas.",
          grafico: null
        },
        {
          id: "bio-05", modulo: "Módulo 2 · Célula e Corpo Humano", titulo: "Fisiologia e imunologia", nivel: "Intermediário", incidencia: "8–14%",
          objetivo: "Entender os sistemas do corpo e distinguir soro de vacina.",
          teoria: [
            { t: "p", c: "Sistemas integrados: digestório (enzimas e pH ao longo do trato), cardiovascular (grande e pequena circulação, hematose nos pulmões), respiratório e imunológico." },
            { t: "p", c: "Soro = anticorpos prontos (imunização passiva, curativa, imediata). Vacina = antígeno que faz o corpo produzir defesas (preventiva, ativa, cria memória)." },
            { t: "p", c: "Endocrinologia: hormônios regulam o corpo; disruptores endócrinos (como o bisfenol A) podem interferir nesse controle." }
          ],
          mnemonico: "'SORO Socorre (pronto, curativo); VACINA Vale depois (preventiva, cria memória)'.",
          analogia: "Vacina é treinar o exército antes da guerra; soro é chamar mercenários prontos no meio da batalha.",
          dica: "Hematose = troca gasosa (O₂ entra, CO₂ sai) que ocorre nos alvéolos pulmonares. Cai bastante.",
          grafico: null
        },
        {
          id: "bio-03", modulo: "Módulo 3 · Genética e Evolução", titulo: "Hereditariedade e seleção natural", nivel: "Avançado", incidencia: "10–18%",
          objetivo: "Resolver heredogramas, entender seleção natural e biotecnologia.",
          teoria: [
            { t: "p", c: "1ª Lei de Mendel: cada característica é determinada por um par de alelos que se separam nos gametas. Aa × Aa → 3 dominantes : 1 recessivo." },
            { t: "p", c: "Evolução por seleção natural (Darwin): o ambiente 'seleciona' os mais aptos. A resistência bacteriana a antibióticos é o exemplo campeão." },
            { t: "p", c: "Biotecnologia: DNA recombinante, transgênicos, testes de paternidade. Sistema ABO e fator Rh nos grupos sanguíneos." }
          ],
          mnemonico: "Aa × Aa → 3:1 no fenótipo. Guarde esse quadro de Punnett de cor.",
          analogia: "Seleção natural é um filtro do ambiente: quem 'passa pela peneira' (mais apto) sobrevive e deixa mais descendentes.",
          dica: "Bactéria não 'fica' resistente porque quis: as resistentes já existiam e sobreviveram. Cuidado com linguagem lamarckista.",
          grafico: null
        }
      ]
    },

    /* ==================== HISTÓRIA ==================== */
    historia: {
      area: "humanas", nome: "História", emoji: "🏛️", incidencia: "~17 questões",
      resumo: "Metade das questões é História do Brasil. O foco é entender processos e continuidades, não decorar datas isoladas.",
      licoes: [
        {
          id: "his-04", modulo: "Módulo 1 · Mundo Antigo e Medieval", titulo: "Antiguidade e Idade Média", nivel: "Básico", incidencia: "4–10%",
          objetivo: "Comparar a democracia ateniense com a moderna e entender o feudalismo.",
          teoria: [
            { t: "p", c: "Democracia ateniense: direta, mas restrita a homens livres (excluía mulheres, escravos e estrangeiros). A moderna é representativa e mais ampla." },
            { t: "p", c: "Roma: da república oligárquica ao Império; legado do Direito Romano. Idade Média: feudalismo (suserania e vassalagem), economia agrária e papel unificador da Igreja Católica." }
          ],
          mnemonico: "Democracia ateniense = 'Direta, porém Discriminatória' (excluía muitos).",
          analogia: "O feudo era um mundo fechado e autossuficiente, como uma 'ilha' que produzia quase tudo o que consumia.",
          dica: "Compare sempre 'democracia antiga x moderna': a antiga é direta e restrita; a nossa, representativa e universal.",
          grafico: { tipo: "barras", titulo: "Incidência em História (%)", dados: [{ r: "Brasil", v: 50 }, { r: "Geral/Contemp.", v: 25 }, { r: "Antiga/Medieval", v: 8 }] }
        },
        {
          id: "his-01", modulo: "Módulo 2 · Brasil Colônia e Império", titulo: "Colônia e Império", nivel: "Intermediário", incidencia: "parte dos 49%",
          objetivo: "Compreender ciclos econômicos, escravidão/resistência e centralização imperial.",
          teoria: [
            { t: "p", c: "Ciclos econômicos coloniais: pau-brasil, açúcar (Nordeste) e mineração (ouro, séc. XVIII). Economia voltada para exportação (pacto colonial)." },
            { t: "p", c: "Escravidão e resistência: quilombos (Palmares), revoltas, cultura afro-brasileira. Resistência indígena também é cobrada." },
            { t: "p", c: "Império (1822–1889): centralização, Poder Moderador e revoltas regenciais (instabilidade após a abdicação de D. Pedro I)." }
          ],
          mnemonico: "Ordem dos ciclos: 'Pau, Açúcar, Ouro' → PAO. A economia colonial foi um 'PÃO' de exportação.",
          analogia: "O pacto colonial era uma relação de exclusividade forçada: a colônia só podia 'namorar' (comerciar com) a metrópole.",
          dica: "ENEM valoriza a resistência (negra e indígena). Alternativas que romantizam a colonização costumam estar erradas.",
          grafico: null
        },
        {
          id: "his-02", modulo: "Módulo 3 · Brasil República", titulo: "República Velha e Era Vargas", nivel: "Intermediário", incidencia: "parte dos 49%",
          objetivo: "Entender a política do café com leite, 1930, Vargas e o trabalhismo.",
          teoria: [
            { t: "p", c: "República Velha: 'política do café com leite' (revezamento SP-MG) e coronelismo (voto de cabresto)." },
            { t: "p", c: "Revolução de 1930 encerra a República Velha e leva Vargas ao poder. Vargas cria leis trabalhistas (CLT, 1943) e o Estado Novo (ditadura, 1937–45)." },
            { t: "p", c: "Populismo: líderes com forte apelo às massas urbanas." }
          ],
          mnemonico: "Café com leite = 'CAfé (São Paulo) + LEite (Minas)'.",
          analogia: "O coronelismo era um 'toma-lá-dá-cá': o coronel entregava votos, o governo entregava cargos e obras.",
          dica: "Vargas é ambíguo: ganhou direitos trabalhistas MAS foi ditador no Estado Novo. Evite alternativas extremas.",
          grafico: null
        },
        {
          id: "his-03", modulo: "Módulo 3 · Brasil República", titulo: "Ditadura Militar e redemocratização", nivel: "Avançado", incidencia: "parte dos 49%",
          objetivo: "Entender o Regime Civil-Militar e a Constituição de 1988.",
          teoria: [
            { t: "p", c: "Regime Civil-Militar (1964–85): repressão, censura, AI-5, 'milagre econômico' (crescimento com concentração de renda) e abertura 'lenta e gradual'." },
            { t: "p", c: "Redemocratização: movimento das Diretas Já e a Constituição de 1988 ('Constituição Cidadã'), que ampliou direitos sociais e criou o SUS." }
          ],
          mnemonico: "AI-5 (1968) = o 'ato mais duro'. Pense: '5 = mão fechada em punho' → auge da repressão.",
          analogia: "O 'milagre econômico' foi um bolo que cresceu, mas foi repartido de forma muito desigual.",
          dica: "'Milagre econômico' cresceu o PIB MAS aumentou a desigualdade e a dívida externa. O ENEM cobra esse paradoxo.",
          grafico: null
        },
        {
          id: "his-05", modulo: "Módulo 4 · História Geral Contemporânea", titulo: "Do Imperialismo à Guerra Fria", nivel: "Avançado", incidencia: "17–30%",
          objetivo: "Relacionar imperialismo, guerras mundiais e Guerra Fria.",
          teoria: [
            { t: "p", c: "Imperialismo/Neocolonialismo (séc. XIX) na África e Ásia gerou tensões que alimentaram a Primeira e a Segunda Guerra Mundial." },
            { t: "p", c: "Guerra Fria: bipolaridade EUA × URSS, corrida armamentista e espacial, e ditaduras periféricas apoiadas pelas superpotências. Terminou com a queda do Muro de Berlim (1989) e o fim da URSS (1991)." }
          ],
          mnemonico: "Guerra Fria = 'Fria' porque não houve confronto direto entre EUA e URSS (medo nuclear).",
          analogia: "A Guerra Fria foi um jogo de xadrez global: as superpotências moviam 'peças' (países periféricos) sem se atacarem diretamente.",
          dica: "O foco de História Geral no ENEM é pós-Revolução Francesa. Antiguidade cai pouco; contemporâneo cai muito.",
          grafico: null
        }
      ]
    },

    /* ==================== GEOGRAFIA ==================== */
    geografia: {
      area: "humanas", nome: "Geografia", emoji: "🗺️", incidencia: "~14 questões",
      resumo: "Geografia do ENEM é crítica e atual: agrária, urbana, geopolítica e ambiental, sempre ligadas a desigualdades.",
      licoes: [
        {
          id: "geo-01", modulo: "Módulo 1 · Geografia Urbana e População", titulo: "Espaço urbano e demografia", nivel: "Básico", incidencia: "10–15%",
          objetivo: "Entender urbanização, segregação, gentrificação e transição demográfica.",
          teoria: [
            { t: "p", c: "Urbanização acelerada gerou macrocefalia urbana (cidades enormes e desordenadas) e conurbação (cidades que se fundem)." },
            { t: "p", c: "Gentrificação: revitalização de uma área que valoriza os imóveis e EXPULSA a população de baixa renda." },
            { t: "p", c: "Transição demográfica: o Brasil passou de altas taxas de natalidade para baixas; agora envelhece e a pirâmide etária se estreita na base." }
          ],
          mnemonico: "'Gentrificação = Gente rica chega, gente pobre sai'.",
          analogia: "Conurbação é como manchas de tinta que se espalham e se tocam: São Paulo e cidades vizinhas viraram uma só mancha.",
          dica: "Pirâmide etária com base estreita e topo largo = população envelhecendo (caso do Brasil hoje). Cai muito com gráficos.",
          grafico: null
        },
        {
          id: "geo-02", modulo: "Módulo 2 · Geografia Agrária e Ambiental", titulo: "Espaço agrário e questão ambiental", nivel: "Intermediário", incidencia: "11–18%",
          objetivo: "Compreender estrutura fundiária, agronegócio × agricultura familiar e domínios morfoclimáticos.",
          teoria: [
            { t: "p", c: "Estrutura fundiária brasileira é concentrada (poucos donos, muita terra). Revolução Verde mecanizou o campo mas causou êxodo rural." },
            { t: "p", c: "Agronegócio exporta commodities; agricultura familiar produz boa parte do alimento que vai à mesa do brasileiro (segurança alimentar)." },
            { t: "p", c: "Domínios morfoclimáticos (Aziz Ab'Sáber): Amazônico, Cerrado, Caatinga, Mares de Morros, Araucárias e Pradarias." }
          ],
          mnemonico: "Domínios: 'A CATA MAR de PRAdaria e ARAucária' → Amazônico, Caatinga, Cerrado, Mares de Morros, Pradarias, Araucárias.",
          analogia: "Agricultura familiar é a 'horta do Brasil' (feijão, mandioca); agronegócio é a 'fábrica de exportação' (soja, boi).",
          dica: "ENEM defende a agricultura familiar e critica o desmatamento para pastagem/soja.",
          grafico: null
        },
        {
          id: "geo-04", modulo: "Módulo 2 · Geografia Agrária e Ambiental", titulo: "Clima, relevo e impactos", nivel: "Intermediário", incidencia: "13–15%",
          objetivo: "Diferenciar tipos de chuva, entender relevo e mudanças climáticas.",
          teoria: [
            { t: "p", c: "Tipos de chuva: orográfica (relevo força o ar úmido a subir), frontal (encontro de massas de ar) e convectiva (calor evapora e forma nuvens de tempestade)." },
            { t: "p", c: "Ilhas de calor nas cidades: concreto e asfalto retêm calor; a falta de vegetação eleva a temperatura urbana. Inversão térmica agrava a poluição no inverno." },
            { t: "p", c: "Mudanças climáticas intensificam eventos extremos (enchentes, secas), atingindo mais as populações vulneráveis (racismo ambiental)." }
          ],
          mnemonico: "Chuvas: 'O-F-C' → Orográfica (montanha), Frontal (frentes), Convectiva (calor).",
          analogia: "A ilha de calor é uma 'panela de concreto': a cidade cozinha no próprio calor por falta de vegetação para 'ventilar'.",
          dica: "Relacione clima e desigualdade: enchentes atingem mais quem mora em áreas de risco. É a leitura socioambiental do ENEM.",
          grafico: null
        },
        {
          id: "geo-03", modulo: "Módulo 3 · Geopolítica e Globalização", titulo: "Blocos, BRICS e conflitos", nivel: "Avançado", incidencia: "9–12%",
          objetivo: "Entender blocos econômicos, BRICS e conflitos por recursos.",
          teoria: [
            { t: "p", c: "Globalização integrou mercados, capitais e informação (Milton Santos: 'meio técnico-científico-informacional')." },
            { t: "p", c: "Blocos econômicos: Mercosul, União Europeia. BRICS reúne economias emergentes. Conflitos giram em torno de recursos estratégicos (petróleo, água, gás)." }
          ],
          mnemonico: "BRICS = Brasil, Rússia, Índia, China, South Africa (África do Sul).",
          analogia: "A globalização é uma rede de pesca: aproxima quem está conectado, mas deixa buracos por onde escapam os excluídos digitais.",
          dica: "Milton Santos é o geógrafo-chave do ENEM. Repertório de ouro também para a redação sobre tecnologia.",
          grafico: null
        }
      ]
    },

    /* ==================== FILOSOFIA E SOCIOLOGIA ==================== */
    filosociologia: {
      area: "humanas", nome: "Filosofia e Sociologia", emoji: "💭", incidencia: "~10 questões",
      resumo: "Fornece o repertório da redação. Domine os clássicos: Durkheim, Marx, Weber e a filosofia política.",
      licoes: [
        {
          id: "fso-03", modulo: "Módulo 1 · Filosofia Antiga", titulo: "Sócrates, Platão e Aristóteles", nivel: "Básico", incidencia: "parte de Filosofia",
          objetivo: "Entender os fundadores do pensamento ocidental.",
          teoria: [
            { t: "p", c: "Sócrates: maiêutica (fazer perguntas para 'partejar' ideias), 'só sei que nada sei'. Platão: mundo das ideias, mito da caverna (sair da ilusão para o conhecimento)." },
            { t: "p", c: "Aristóteles: a política como busca do bem comum; a ética da virtude (o meio-termo entre extremos)." }
          ],
          mnemonico: "'SÓcrates pergunta (maiêutica); PLAtão eleva ao mundo das ideias; ARIStóteles busca a virtude'.",
          analogia: "O mito da caverna é sair do cinema para a luz do dia: as sombras (ilusão) dão lugar à realidade (conhecimento).",
          dica: "Sócrates = perguntas; Platão = mundo das ideias; Aristóteles = virtude e política. Memorize esse trio.",
          grafico: null
        },
        {
          id: "fso-01", modulo: "Módulo 2 · Teóricos da Sociologia", titulo: "Durkheim, Marx e Weber", nivel: "Intermediário", incidencia: "17–22%",
          objetivo: "Distinguir os três sociólogos clássicos.",
          teoria: [
            { t: "p", c: "Durkheim: 'fato social' (coercitivo, externo, geral); coesão social; anomia (ausência de normas)." },
            { t: "p", c: "Marx: materialismo histórico; luta de classes; mais-valia (lucro do trabalho não pago); alienação." },
            { t: "p", c: "Weber: ação social (o indivíduo age dando sentido); burocracia; ética protestante e o 'espírito do capitalismo'." }
          ],
          mnemonico: "'DUrkheim = coesão/anomia; MArx = MAis-valia; WEber = sentido da ação'.",
          analogia: "Durkheim vê a sociedade como um corpo (órgãos cooperando); Marx, como arena de conflito; Weber, como soma de ações com sentido.",
          dica: "Marx pensa em ESTRUTURA/classe; Weber pensa no INDIVÍDUO e no sentido da ação. Esse é o divisor de águas.",
          grafico: null
        },
        {
          id: "fso-04", modulo: "Módulo 2 · Teóricos da Sociologia", titulo: "Cultura, mídia e sociedade atual", nivel: "Avançado", incidencia: "13–18%",
          objetivo: "Entender indústria cultural, etnocentrismo e pensadores contemporâneos.",
          teoria: [
            { t: "p", c: "Etnocentrismo (julgar o outro pelo próprio padrão) × relativismo cultural (compreender cada cultura em seu contexto)." },
            { t: "p", c: "Indústria Cultural (Adorno e Horkheimer, Escola de Frankfurt): cultura vira mercadoria padronizada que aliena. Bauman: 'modernidade líquida' (laços frágeis). Byung-Chul Han: 'sociedade do cansaço' (autoexploração por produtividade)." }
          ],
          mnemonico: "Indústria Cultural = cultura virou 'fast-food': padronizada, massificada, para consumo rápido.",
          analogia: "A modernidade líquida de Bauman é a água que não guarda forma: relações, empregos e certezas escorrem pelos dedos.",
          dica: "Adorno, Bauman, Byung-Chul Han e Foucault são coringas para redação sobre tecnologia e trabalho.",
          grafico: null
        },
        {
          id: "fso-02", modulo: "Módulo 3 · Filosofia Política e Ética", titulo: "Contratualistas, Kant e Foucault", nivel: "Avançado", incidencia: "24–43%",
          objetivo: "Dominar contratualistas, ética kantiana e Foucault.",
          teoria: [
            { t: "p", c: "Contratualistas: Hobbes ('o homem é o lobo do homem' → Estado forte), Locke (propriedade e liberdade), Rousseau ('bom selvagem' corrompido pela sociedade, vontade geral)." },
            { t: "p", c: "Kant: imperativo categórico — aja de modo que sua ação possa virar lei universal (ética do dever)." },
            { t: "p", c: "Foucault: microfísica do poder; instituições disciplinares (prisão, escola, hospital) que 'vigiam e punem'." }
          ],
          mnemonico: "Contratualistas: 'HoLoRou' → Hobbes (medo/Leviatã), Locke (Liberdade/propriedade), Rousseau (bondade natural).",
          analogia: "Para Hobbes, sem Estado a vida seria uma briga de bar sem seguranças. O contrato social é contratar um 'segurança' (Estado).",
          dica: "Foucault é ótimo repertório de redação sobre vigilância, controle e tecnologia. Vale como 'coringa'.",
          grafico: null
        }
      ]
    },

    /* ==================== LINGUAGENS ==================== */
    portugues: {
      area: "linguagens", nome: "Português e Interpretação", emoji: "📖", incidencia: "~30 questões",
      resumo: "Interpretação é a habilidade soberana. O ENEM não cobra gramática decorada, mas o sentido do texto no contexto.",
      licoes: [
        {
          id: "por-01", modulo: "Módulo 1 · Interpretação e Linguagem", titulo: "Interpretação e funções da linguagem", nivel: "Básico", incidencia: "33–87%",
          objetivo: "Identificar a intenção do texto e as 6 funções da linguagem (Jakobson).",
          teoria: [
            { t: "p", c: "Funções da linguagem: Referencial (informar), Emotiva (o 'eu'), Conativa/Apelativa (convencer o 'você' — publicidade), Fática (testar o canal — 'alô?'), Metalinguística (a língua falando dela mesma), Poética (a forma da mensagem)." },
            { t: "p", c: "Interpretar é inferir: entender ironia, ambiguidade e intertextualidade (um texto que dialoga com outro)." }
          ],
          mnemonico: "6 funções: 'RE-EMO-CO-FA-META-PO' → Referencial, Emotiva, Conativa, Fática, Metalinguística, Poética.",
          analogia: "As funções são 'chapéus' que o texto usa: publicidade veste o Conativo (te convencer); um poema, o Poético.",
          dica: "Propaganda? Quase sempre função CONATIVA (foco em VOCÊ, imperativo: 'compre', 'participe').",
          grafico: null
        },
        {
          id: "por-04", modulo: "Módulo 1 · Interpretação e Linguagem", titulo: "Figuras de linguagem e variação", nivel: "Intermediário", incidencia: "parte de Interpretação",
          objetivo: "Reconhecer metáfora, metonímia, ironia e respeitar a variação linguística.",
          teoria: [
            { t: "p", c: "Metáfora: comparação implícita ('ela é uma flor'). Metonímia: troca por proximidade ('ler Machado' = ler a obra). Hipérbole: exagero. Ironia: dizer o contrário do que se pensa." },
            { t: "p", c: "Variação linguística: a língua varia conforme região, grupo e situação. Nenhuma variedade é 'errada' — o critério é adequação ao contexto. O ENEM combate o preconceito linguístico." }
          ],
          mnemonico: "MetÁfora = 'É' (identifica). Comparação = 'como' (explícita).",
          analogia: "A metonímia é um 'apelido por proximidade': chamamos o time pela cidade, o prato pela marca.",
          dica: "O ENEM valoriza o respeito à diversidade linguística. Fuja de alternativas que chamam variedades populares de 'erradas'.",
          grafico: null
        },
        {
          id: "por-02", modulo: "Módulo 2 · Gramática Textual", titulo: "Coesão, coerência e conectivos", nivel: "Intermediário", incidencia: "10–21%",
          objetivo: "Usar coesão, coerência e pontuação para entender e construir sentido.",
          teoria: [
            { t: "p", c: "Coesão = amarração (conectivos, pronomes que retomam palavras). Coerência = lógica das ideias. O ENEM cobra gramática dentro do texto, não regras soltas." },
            { t: "p", c: "Conectivos mudam o sentido: 'mas/porém' (oposição), 'porque/pois' (causa), 'portanto/logo' (conclusão), 'embora' (concessão)." }
          ],
          mnemonico: "Conclusão: 'PLC' → Portanto, Logo, Consequentemente. Oposição: 'MAPO' → Mas, Porém, entretantO.",
          analogia: "Conectivos são placas de trânsito do texto: 'mas' é uma curva (mudou a direção); 'portanto' é a chegada (conclusão).",
          dica: "Trocar o conectivo muda o sentido da frase. Questões de 'qual conectivo cabe aqui' testam exatamente isso.",
          grafico: null
        },
        {
          id: "por-05", modulo: "Módulo 2 · Gramática Textual", titulo: "Concordância e crase essenciais", nivel: "Avançado", incidencia: "parte de Gramática",
          objetivo: "Aplicar as regras de concordância e crase mais cobradas.",
          teoria: [
            { t: "p", c: "Verbos impessoais ficam no singular: 'haver' (existir) e 'fazer' (tempo) — 'Havia problemas', 'Faz dois anos'. Mas 'existir' concorda: 'Existem problemas'." },
            { t: "p", c: "Crase é a fusão de preposição 'a' + artigo 'a(s)'. NÃO ocorre antes de palavra masculina, verbo nem artigo indefinido ('a uma'). Ocorre em 'às 3 horas', 'à noite'." }
          ],
          mnemonico: "Crase: 'antes de masculino e verbo, passa longe'. Se puder trocar por 'ao', tem crase no feminino.",
          analogia: "A crase é um 'encontro marcado' de dois 'a': só acontece quando os dois (preposição + artigo) comparecem.",
          dica: "Teste da crase: troque a palavra feminina por uma masculina. Se aparecer 'ao', então crase; se 'o', sem crase.",
          grafico: null
        },
        {
          id: "por-03", modulo: "Módulo 3 · Literatura e Artes", titulo: "Escolas literárias e vanguardas", nivel: "Avançado", incidencia: "8–46%",
          objetivo: "Relacionar escolas literárias ao contexto histórico e reconhecer vanguardas.",
          teoria: [
            { t: "p", c: "Romantismo: nacionalismo, idealização (indianismo). Realismo/Naturalismo: crítica social, ironia (Machado de Assis). Modernismo (1922): ruptura, liberdade formal, identidade brasileira." },
            { t: "p", c: "Vanguardas europeias: Cubismo (fragmenta), Expressionismo (emoção), Surrealismo (sonho/inconsciente), Dadaísmo (provocação) — base do Modernismo." }
          ],
          mnemonico: "Escolas: 'BA-AR-RO-RE-PA-SI-MO' → Barroco, Arcadismo, Romantismo, Realismo, Parnasianismo, Simbolismo, Modernismo.",
          analogia: "O Modernismo de 22 foi um 'grito de independência' artístico: chega de copiar a Europa, vamos falar do Brasil com liberdade.",
          dica: "Machado = ironia e análise psicológica. Narrador sarcástico observando a hipocrisia social? Provavelmente Realismo.",
          grafico: null
        }
      ]
    }
  }
};
