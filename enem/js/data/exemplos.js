/* ============================================================
   EXEMPLOS RESOLVIDOS — aprender fazendo, no estilo ENEM.
   Cada exemplo: situação do cotidiano → o que pede → conceito →
   passo a passo → resposta → pegadinha que derruba candidatos.
   ============================================================ */
window.ENEM_EXEMPLOS = {
  /* =========================== FÍSICA =========================== */
  fisica: [
    {
      titulo: "Quanto o chuveiro pesa na conta de luz?", tema: "Eletrodinâmica · consumo",
      situacao: "Uma família de 4 pessoas usa um chuveiro de 5 500 W. Cada pessoa toma um banho de 15 minutos por dia. A tarifa é de R$ 0,80 por kWh.",
      pede: "O gasto mensal (30 dias) com o chuveiro.",
      conceito: "Energia elétrica = potência × tempo (E = P·Δt). A conta é cobrada em kWh, então a potência deve estar em kW e o tempo em horas.",
      formula: "E = P · Δt",
      passos: [
        "Converta a potência: 5 500 W = 5,5 kW.",
        "Tempo por dia: 4 pessoas × 15 min = 60 min = 1 h.",
        "Energia no mês: 5,5 kW × 1 h × 30 dias = 165 kWh.",
        "Custo: 165 kWh × R$ 0,80 = R$ 132,00."
      ],
      resposta: "R$ 132,00 por mês.",
      pegadinha: "Esquecer de converter W → kW (÷ 1000) e minutos → horas (÷ 60). Com 5 500 em vez de 5,5, o resultado sai mil vezes maior."
    },
    {
      titulo: "Por que a posição 'inverno' esquenta mais?", tema: "Eletrodinâmica · potência e resistência",
      situacao: "Um chuveiro ligado sempre na mesma tensão (220 V) tem as posições 'verão' e 'inverno', que mudam o comprimento do resistor usado.",
      pede: "Qual posição tem menor resistência e por quê ela aquece mais a água.",
      conceito: "Com a tensão (U) constante, a potência é P = U²/R: quanto MENOR a resistência, MAIOR a potência dissipada em calor (efeito Joule).",
      formula: "P = U² / R",
      passos: [
        "A tensão da casa é fixa: U = 220 V nas duas posições.",
        "Em P = U²/R, U² é constante; logo, P e R são inversamente proporcionais.",
        "Na posição 'inverno', usa-se um trecho MENOR do resistor → resistência menor.",
        "Resistência menor → potência maior → mais calor transferido para a água."
      ],
      resposta: "Inverno = menor resistência = maior potência = água mais quente.",
      pegadinha: "Muita gente pensa que 'mais resistência esquenta mais'. Isso só vale com corrente constante (P = R·i²). Em casa, o que é constante é a TENSÃO."
    },
    {
      titulo: "Por que o disjuntor desarmou?", tema: "Eletrodinâmica · associação em paralelo",
      situacao: "Em uma rede de 127 V, um ferro de passar (1 100 W) e um micro-ondas (1 270 W) são ligados ao mesmo tempo no mesmo circuito, protegido por um disjuntor de 15 A.",
      pede: "Se o disjuntor vai desarmar.",
      conceito: "As tomadas de uma casa ficam em paralelo: cada aparelho recebe a mesma tensão e as correntes se SOMAM. Corrente de cada aparelho: i = P/U.",
      formula: "i = P / U",
      passos: [
        "Ferro: i = 1 100 / 127 ≈ 8,7 A.",
        "Micro-ondas: i = 1 270 / 127 = 10 A.",
        "Em paralelo, a corrente total é a soma: 8,7 + 10 ≈ 18,7 A.",
        "18,7 A > 15 A → o disjuntor desarma para proteger a fiação."
      ],
      resposta: "Sim, desarma: a corrente total (~18,7 A) passa de 15 A.",
      pegadinha: "Achar que em paralelo a corrente é a mesma para todos. Em paralelo, a TENSÃO é a mesma; as correntes se somam."
    },
    {
      titulo: "Ida a 60 km/h, volta a 40 km/h: média de 50?", tema: "Cinemática · velocidade média",
      situacao: "Um carro faz a ida de uma viagem a 60 km/h e volta pelo mesmo caminho a 40 km/h.",
      pede: "A velocidade média no percurso total.",
      conceito: "Velocidade média = distância total ÷ tempo total. Não é a média das velocidades.",
      formula: "vm = Δs / Δt",
      passos: [
        "Escolha uma distância fácil para cada trecho, por exemplo 120 km.",
        "Ida: 120 ÷ 60 = 2 h. Volta: 120 ÷ 40 = 3 h.",
        "Distância total = 240 km; tempo total = 5 h.",
        "vm = 240 ÷ 5 = 48 km/h."
      ],
      resposta: "48 km/h (e não 50 km/h).",
      pegadinha: "Fazer (60 + 40) ÷ 2 = 50. O carro passa MAIS tempo no trecho lento, então a média fica abaixo de 50."
    },
    {
      titulo: "Velocidade no fim da descida da montanha-russa", tema: "Mecânica · conservação de energia",
      situacao: "Um carrinho parte do repouso do alto de uma rampa de 20 m. Despreze atritos (g = 10 m/s²).",
      pede: "A velocidade no ponto mais baixo.",
      conceito: "Sem atrito, a energia mecânica se conserva: a energia potencial no alto vira energia cinética embaixo.",
      formula: "m·g·h = m·v²/2  →  v = √(2·g·h)",
      passos: [
        "Iguale as energias: m·g·h = m·v²/2.",
        "A massa aparece dos dois lados e se cancela.",
        "v = √(2 × 10 × 20) = √400 = 20 m/s.",
        "Em km/h: 20 × 3,6 = 72 km/h."
      ],
      resposta: "20 m/s (72 km/h), independentemente da massa.",
      pegadinha: "Achar que o carrinho mais pesado chega mais rápido. Sem atrito, a massa se cancela."
    },
    {
      titulo: "Quanto calor para ferver a água do café?", tema: "Termologia · calor sensível",
      situacao: "Deseja-se aquecer 2 litros de água de 20 °C até 100 °C. Calor específico da água: 1 cal/g·°C.",
      pede: "A quantidade de calor necessária.",
      conceito: "Calor sensível muda a temperatura: Q = m·c·ΔT. Para a água, 1 L ≈ 1 kg = 1 000 g.",
      formula: "Q = m · c · ΔT",
      passos: [
        "Massa: 2 L de água ≈ 2 000 g.",
        "Variação de temperatura: ΔT = 100 − 20 = 80 °C.",
        "Q = 2 000 × 1 × 80 = 160 000 cal.",
        "Em quilocalorias: 160 kcal."
      ],
      resposta: "160 000 cal (160 kcal).",
      pegadinha: "Usar a temperatura final (100) em vez da VARIAÇÃO (80). ΔT é sempre final − inicial."
    },
    {
      titulo: "Por que o suor refresca?", tema: "Termologia · calor latente",
      situacao: "Após correr, o corpo transpira e, ao evaporar, o suor dá sensação de frescor. Em dias muito úmidos, essa sensação diminui.",
      pede: "Explicar o fenômeno e o efeito da umidade.",
      conceito: "Mudança de estado usa calor latente: para evaporar, a água ABSORVE calor do corpo, sem alterar sua própria temperatura durante a transição.",
      formula: "Q = m · L",
      passos: [
        "O suor (água) precisa de energia para passar de líquido a vapor.",
        "Essa energia é retirada da pele → a pele esfria.",
        "Com o ar úmido (quase saturado de vapor), a evaporação fica mais lenta.",
        "Menos evaporação → menos calor retirado → sensação de abafamento."
      ],
      resposta: "A evaporação retira calor da pele; ar úmido dificulta a evaporação e reduz o resfriamento.",
      pegadinha: "Dizer que o suor 'é frio'. Ele sai à temperatura do corpo; o resfriamento vem da EVAPORAÇÃO."
    },
    {
      titulo: "Qual o tamanho da onda da rádio FM?", tema: "Ondulatória · v = λ·f",
      situacao: "Uma rádio FM transmite na frequência de 100 MHz. As ondas de rádio viajam à velocidade da luz, 3 × 10⁸ m/s.",
      pede: "O comprimento de onda.",
      conceito: "Equação fundamental: v = λ·f. Ondas de rádio são eletromagnéticas (propagam-se até no vácuo).",
      formula: "λ = v / f",
      passos: [
        "Converta: 100 MHz = 100 × 10⁶ Hz = 10⁸ Hz.",
        "λ = (3 × 10⁸) ÷ (10⁸).",
        "λ = 3 m."
      ],
      resposta: "3 metros.",
      pegadinha: "Esquecer que 'mega' (M) = 10⁶. Também: ondas de rádio NÃO são ondas sonoras — são eletromagnéticas."
    },
    {
      titulo: "A sirene muda de tom ao passar", tema: "Ondulatória · efeito Doppler",
      situacao: "Uma ambulância passa por um pedestre com a sirene ligada: o som parece agudo quando ela se aproxima e grave quando se afasta.",
      pede: "Explicar a mudança.",
      conceito: "Efeito Doppler: o movimento relativo entre fonte e observador altera a frequência PERCEBIDA (a frequência emitida não muda).",
      passos: [
        "Aproximando-se, a fonte 'alcança' as próprias ondas: elas chegam mais juntas.",
        "Mais ondas por segundo → frequência percebida maior → som mais agudo.",
        "Afastando-se, as ondas chegam mais espaçadas → frequência menor → som mais grave."
      ],
      resposta: "Aproximação = frequência aparente maior (agudo); afastamento = menor (grave).",
      pegadinha: "Dizer que a sirene muda de volume ou que a frequência emitida muda. Muda a frequência PERCEBIDA."
    },
    {
      titulo: "Por que o salto agulha afunda na grama?", tema: "Hidrostática · pressão",
      situacao: "Uma pessoa de 600 N apoia todo o peso em sapatos com área total de 200 cm². Depois, apoia o mesmo peso num salto agulha de 2 cm².",
      pede: "Comparar as pressões.",
      conceito: "Pressão = força ÷ área. Mesma força em área menor → pressão maior.",
      formula: "p = F / A",
      passos: [
        "Converta: 200 cm² = 0,02 m²; 2 cm² = 0,0002 m² (1 cm² = 10⁻⁴ m²).",
        "Sapato comum: p = 600 ÷ 0,02 = 30 000 Pa.",
        "Salto agulha: p = 600 ÷ 0,0002 = 3 000 000 Pa.",
        "A pressão no salto é 100 vezes maior — por isso afunda."
      ],
      resposta: "O salto agulha exerce pressão 100 vezes maior (3 × 10⁶ Pa contra 3 × 10⁴ Pa).",
      pegadinha: "Errar a conversão de cm² para m² (é 10⁻⁴, não 10⁻²). Mesma ideia explica a faca afiada e os esquis na neve."
    },
    {
      titulo: "Como um navio de aço flutua?", tema: "Hidrostática · empuxo",
      situacao: "Um bloco de 2 litros é totalmente mergulhado em água (densidade 1 000 kg/m³; g = 10 m/s²).",
      pede: "O empuxo sobre o bloco e por que navios flutuam.",
      conceito: "Princípio de Arquimedes: o empuxo é igual ao peso do líquido deslocado: E = d(líquido)·V(submerso)·g.",
      formula: "E = d · V · g",
      passos: [
        "Volume submerso: 2 L = 0,002 m³.",
        "E = 1 000 × 0,002 × 10 = 20 N.",
        "O navio é oco: seu casco desloca um volume ENORME de água.",
        "O peso dessa água deslocada (empuxo) equilibra o peso do navio — ele flutua."
      ],
      resposta: "Empuxo de 20 N. O navio flutua porque desloca muita água graças ao formato oco.",
      pegadinha: "Achar que o empuxo depende da densidade do corpo. Depende da densidade do LÍQUIDO e do volume submerso."
    },
    {
      titulo: "Por que retrovisores e espelhos de loja são curvos?", tema: "Óptica · espelho convexo",
      situacao: "Retrovisores externos de carros e espelhos de segurança em lojas são convexos.",
      pede: "As características da imagem e a vantagem.",
      conceito: "Espelho convexo sempre forma imagem virtual, direita e MENOR, ampliando o campo visual.",
      passos: [
        "O espelho convexo espalha (diverge) os raios refletidos.",
        "A imagem formada é virtual, direita e reduzida.",
        "Por ser menor, cabe mais coisa no espelho → campo visual maior.",
        "Por isso aparece o aviso 'os objetos estão mais próximos do que parecem'."
      ],
      resposta: "Imagem virtual, direita e menor; vantagem: campo de visão ampliado.",
      pegadinha: "Confundir com o espelho côncavo (de maquiagem), que amplia a imagem quando o objeto está próximo."
    }
  ],

  /* =========================== BIOLOGIA =========================== */
  biologia: [
    {
      titulo: "Pais saudáveis, filho com a doença", tema: "Genética · heredograma",
      situacao: "Um casal sem a doença tem um filho afetado por uma condição genética autossômica.",
      pede: "O tipo de herança e a chance de o próximo filho ser um menino afetado.",
      conceito: "Se pais normais têm filho afetado, a doença é RECESSIVA e os pais são heterozigotos (Aa).",
      passos: [
        "Pais normais com filho afetado → ambos carregam o alelo recessivo: Aa × Aa.",
        "Quadro de Punnett: 1 AA : 2 Aa : 1 aa → chance de afetado (aa) = 1/4.",
        "Chance de ser menino = 1/2.",
        "Menino E afetado: 1/4 × 1/2 = 1/8."
      ],
      resposta: "Herança recessiva; chance de menino afetado = 1/8 (12,5%).",
      pegadinha: "Responder 1/4. Quando a questão pede 'menino afetado', multiplique pela chance do sexo (1/2)."
    },
    {
      titulo: "Quem pode doar sangue para quem?", tema: "Genética · sistema ABO e Rh",
      situacao: "Um paciente de sangue tipo A Rh+ precisa de transfusão.",
      pede: "Quais tipos ele pode receber.",
      conceito: "O que importa são os antígenos (aglutinogênios) das hemácias DOADAS e os anticorpos (aglutininas) do RECEPTOR. Tipo A tem anticorpo anti-B; Rh+ pode receber Rh+ e Rh−.",
      passos: [
        "Receptor A tem anticorpos anti-B no plasma.",
        "Ele NÃO pode receber hemácias com antígeno B (tipos B e AB).",
        "Pode receber hemácias A ou O (O não tem antígenos A nem B).",
        "Sendo Rh+, aceita Rh+ e Rh−."
      ],
      resposta: "A+, A−, O+ e O−.",
      pegadinha: "Lembre: O− é doador universal de hemácias; AB+ é receptor universal."
    },
    {
      titulo: "Quanta energia chega ao topo da cadeia?", tema: "Ecologia · pirâmide de energia",
      situacao: "Os produtores de um ecossistema fixam 10 000 kcal. A cada nível trófico, cerca de 10% da energia passa adiante.",
      pede: "A energia disponível para o consumidor terciário.",
      conceito: "A energia flui em um sentido e diminui a cada nível (perdas como calor na respiração e em restos não consumidos).",
      passos: [
        "Produtores: 10 000 kcal.",
        "Consumidor primário: 10% → 1 000 kcal.",
        "Consumidor secundário: 10% → 100 kcal.",
        "Consumidor terciário: 10% → 10 kcal."
      ],
      resposta: "Cerca de 10 kcal.",
      pegadinha: "Dizer que a energia 'circula' ou 'é reciclada'. Quem recicla é a MATÉRIA; a energia se dissipa."
    },
    {
      titulo: "Por que os peixes morreram na lagoa?", tema: "Ecologia · eutrofização",
      situacao: "Após o despejo de esgoto numa lagoa, a água ficou verde e, dias depois, muitos peixes apareceram mortos.",
      pede: "Explicar a sequência de eventos.",
      conceito: "Eutrofização: excesso de nutrientes (nitrogênio e fósforo) causa proliferação de algas; a decomposição delas consome o oxigênio.",
      passos: [
        "O esgoto adiciona nutrientes → as algas se multiplicam (água verde).",
        "A camada de algas bloqueia a luz; muitas algas morrem.",
        "Bactérias aeróbias decompõem essa matéria orgânica e consomem o O₂ dissolvido.",
        "Sem oxigênio, os peixes morrem por asfixia."
      ],
      resposta: "Falta de oxigênio causada pela decomposição do excesso de algas.",
      pegadinha: "Dizer que as algas 'envenenaram' os peixes. A causa principal é a queda do oxigênio."
    },
    {
      titulo: "Picada de cobra: vacina ou soro?", tema: "Imunologia · imunização",
      situacao: "Uma pessoa foi picada por uma jararaca e chegou ao hospital.",
      pede: "O tratamento indicado e por quê.",
      conceito: "Soro = anticorpos prontos (imunização PASSIVA, ação imediata, curativa). Vacina = antígeno que estimula o corpo a produzir anticorpos (ATIVA, lenta, preventiva, com memória).",
      passos: [
        "O veneno age rápido: é preciso neutralizá-lo já.",
        "A vacina levaria dias ou semanas para gerar anticorpos.",
        "O soro antiofídico traz anticorpos prontos que neutralizam o veneno imediatamente."
      ],
      resposta: "Soro antiofídico (imunização passiva e imediata).",
      pegadinha: "Soro não gera memória: a pessoa não fica 'imunizada' para uma próxima picada."
    },
    {
      titulo: "Superbactérias: quem 'ficou resistente'?", tema: "Evolução · seleção natural",
      situacao: "O uso indiscriminado de antibióticos aumentou a frequência de bactérias resistentes em hospitais.",
      pede: "A explicação evolutiva correta.",
      conceito: "Seleção natural (Darwin): a variação já existe na população; o ambiente seleciona as variantes mais aptas.",
      passos: [
        "Na população bacteriana já havia, por mutação aleatória, algumas resistentes.",
        "O antibiótico mata as sensíveis.",
        "As resistentes sobrevivem e se reproduzem.",
        "Com o tempo, a população fica majoritariamente resistente."
      ],
      resposta: "O antibiótico SELECIONOU bactérias que já eram resistentes.",
      pegadinha: "Alternativas com 'a bactéria se adaptou para sobreviver' ou 'criou resistência' são lamarckistas — erradas."
    },
    {
      titulo: "A planta no escuro libera CO₂?", tema: "Bioenergética · fotossíntese e respiração",
      situacao: "Um experimento mede o CO₂ ao redor de uma planta durante 24 horas.",
      pede: "O que acontece de dia e à noite.",
      conceito: "A planta RESPIRA o tempo todo (consome O₂, libera CO₂) e só faz FOTOSSÍNTESE com luz (consome CO₂, libera O₂).",
      passos: [
        "Noite: só respiração → a planta libera CO₂.",
        "Dia com luz forte: fotossíntese > respiração → absorção líquida de CO₂.",
        "Quando fotossíntese = respiração, a troca líquida é zero: ponto de compensação fótico."
      ],
      resposta: "À noite libera CO₂; de dia, com luz suficiente, absorve CO₂ (saldo).",
      pegadinha: "Dizer que a planta 'respira só à noite'. Ela respira sempre; de dia a fotossíntese supera a respiração."
    },
    {
      titulo: "Por que a salada temperada murcha?", tema: "Citologia · osmose",
      situacao: "Uma salada de alface temperada com sal fica murcha em poucos minutos. Carne salgada (charque) demora a estragar.",
      pede: "Explicar os dois fatos.",
      conceito: "Osmose: a água atravessa a membrana do meio MENOS concentrado em soluto para o MAIS concentrado.",
      passos: [
        "O sal deixa o meio externo hipertônico (mais concentrado).",
        "A água sai das células da alface → elas perdem volume → a folha murcha.",
        "No charque, o sal faz o mesmo com bactérias e fungos: eles perdem água.",
        "Desidratados, os micro-organismos não se multiplicam → o alimento conserva."
      ],
      resposta: "Em meio hipertônico, as células perdem água por osmose.",
      pegadinha: "Dizer que 'o sal entra e murcha a folha'. Quem se move na osmose é a ÁGUA."
    },
    {
      titulo: "Febre alta e enzimas", tema: "Bioquímica · enzimas",
      situacao: "Febres muito altas são perigosas. Além disso, a amilase da saliva para de agir quando o alimento chega ao estômago.",
      pede: "Explicar os dois fatos.",
      conceito: "Enzimas são proteínas com temperatura e pH ótimos. Fora dessa faixa perdem eficiência e podem desnaturar (perder a forma).",
      passos: [
        "Temperatura muito alta altera a forma das enzimas (desnaturação).",
        "Sem a forma correta, elas não se encaixam no substrato → reações vitais falham.",
        "A amilase salivar atua em pH próximo do neutro (boca).",
        "No estômago, o pH é muito ácido → a amilase para; ali atua a pepsina."
      ],
      resposta: "Calor excessivo desnatura enzimas; cada enzima tem um pH ótimo.",
      pegadinha: "Achar que mais calor sempre acelera a reação enzimática. Acelera só até a temperatura ótima."
    },
    {
      titulo: "Por que plantar feijão 'aduba' o solo?", tema: "Ecologia · ciclo do nitrogênio",
      situacao: "Agricultores alternam o plantio de milho com leguminosas (feijão, soja) para melhorar o solo.",
      pede: "Explicar a técnica.",
      conceito: "Bactérias (como Rhizobium) vivem em nódulos das raízes das leguminosas e fixam o N₂ do ar, transformando-o em compostos nitrogenados.",
      passos: [
        "As plantas NÃO absorvem o N₂ diretamente do ar.",
        "As bactérias dos nódulos fixam o N₂ em amônia — relação mutualística.",
        "Parte desse nitrogênio fica no solo (inclusive após a decomposição das raízes).",
        "A cultura seguinte aproveita esse nitrogênio — menos adubo químico."
      ],
      resposta: "Bactérias fixadoras nas raízes das leguminosas enriquecem o solo com nitrogênio.",
      pegadinha: "Dizer que a própria planta fixa o nitrogênio. Quem fixa são as BACTÉRIAS associadas."
    },
    {
      titulo: "Dengue: quem causa e como combater?", tema: "Saúde · doenças transmitidas por vetores",
      situacao: "Campanhas pedem que a população elimine água parada em pneus, vasos e garrafas.",
      pede: "O agente causador, o vetor e a lógica da campanha.",
      conceito: "A dengue é causada por um VÍRUS; o mosquito Aedes aegypti é o VETOR (transmissor). As larvas se desenvolvem em água parada.",
      passos: [
        "Agente causador: vírus da dengue.",
        "Vetor: fêmea do Aedes aegypti, que pica e transmite o vírus.",
        "O mosquito deposita ovos em água parada, onde as larvas crescem.",
        "Eliminar criadouros interrompe o ciclo do vetor — a forma mais eficiente de prevenção."
      ],
      resposta: "Causador: vírus; vetor: Aedes aegypti; campanha: eliminar criadouros.",
      pegadinha: "Dizer que o mosquito 'causa' a dengue ou que antibiótico trata a doença (antibiótico não age sobre vírus)."
    },
    {
      titulo: "Insulina humana feita por bactérias", tema: "Biotecnologia · DNA recombinante",
      situacao: "Hoje, a insulina usada por diabéticos é produzida por bactérias modificadas.",
      pede: "Como isso é possível.",
      conceito: "DNA recombinante: o gene humano da insulina é inserido no DNA de uma bactéria, que passa a produzir a proteína humana.",
      passos: [
        "Corta-se o gene da insulina humana com enzimas de restrição.",
        "Esse gene é inserido em um plasmídeo (DNA circular) bacteriano.",
        "A bactéria transgênica se multiplica e produz insulina humana.",
        "Funciona porque o código genético é UNIVERSAL: a bactéria 'lê' o gene humano."
      ],
      resposta: "Por engenharia genética: o gene humano é inserido em bactérias, que produzem a insulina.",
      pegadinha: "A universalidade do código genético é a chave conceitual — é ela que permite organismos transgênicos."
    }
  ],

  /* =========================== QUÍMICA =========================== */
  quimica: [
    {
      titulo: "Quanto CO₂ sai da queima do gás de cozinha?", tema: "Estequiometria",
      situacao: "Na combustão completa do metano: CH₄ + 2 O₂ → CO₂ + 2 H₂O (C = 12, H = 1, O = 16).",
      pede: "A massa de CO₂ produzida na queima de 32 g de metano.",
      conceito: "Os coeficientes da equação balanceada dão a proporção em mols; converta mols em massa pela massa molar.",
      passos: [
        "Massas molares: CH₄ = 16 g/mol; CO₂ = 44 g/mol.",
        "Proporção: 1 mol CH₄ → 1 mol CO₂, ou seja, 16 g → 44 g.",
        "32 g de CH₄ = 2 mols → 2 mols de CO₂.",
        "2 × 44 = 88 g de CO₂."
      ],
      resposta: "88 g de CO₂.",
      pegadinha: "Calcular com a equação desbalanceada. Sempre confira o balanceamento primeiro."
    },
    {
      titulo: "Diluindo o suco concentrado", tema: "Soluções · diluição",
      situacao: "1 L de suco concentrado tem 100 g/L de açúcar. Adiciona-se água até completar 5 L.",
      pede: "A nova concentração.",
      conceito: "Na diluição a massa de soluto não muda: C₁·V₁ = C₂·V₂.",
      formula: "C₁ · V₁ = C₂ · V₂",
      passos: [
        "Soluto: 100 g/L × 1 L = 100 g de açúcar.",
        "Volume final: 5 L.",
        "C₂ = 100 g ÷ 5 L = 20 g/L."
      ],
      resposta: "20 g/L.",
      pegadinha: "Somar a água adicionada (4 L) errado: o volume FINAL é 5 L, não 4 L."
    },
    {
      titulo: "Por que o refrigerante 'perde o gás'?", tema: "Equilíbrio químico · Le Chatelier",
      situacao: "Ao abrir uma garrafa de refrigerante, formam-se bolhas; aberto e quente, ele 'perde o gás' mais rápido.",
      pede: "Explicar pelo equilíbrio CO₂(g) ⇌ CO₂(aq).",
      conceito: "Le Chatelier: o equilíbrio se desloca para minimizar a perturbação. A solubilidade dos gases cai com menor pressão e maior temperatura.",
      passos: [
        "Fechado, o CO₂ fica dissolvido sob alta pressão.",
        "Ao abrir, a pressão cai → equilíbrio se desloca para o gás → bolhas.",
        "Aquecer diminui a solubilidade dos gases → mais CO₂ escapa."
      ],
      resposta: "Menor pressão e maior temperatura deslocam o equilíbrio para a liberação do CO₂.",
      pegadinha: "Gases são MENOS solúveis em água quente — o contrário do açúcar."
    },
    {
      titulo: "Como a água chega limpa à torneira?", tema: "Separação de misturas · ETA",
      situacao: "Numa estação de tratamento de água, a água bruta passa por várias etapas.",
      pede: "A sequência e a função de cada etapa.",
      conceito: "Cada etapa separa um tipo de impureza; a desinfecção elimina micro-organismos.",
      passos: [
        "Coagulação/floculação: produtos agregam as impurezas em flocos.",
        "Decantação: os flocos pesados depositam no fundo.",
        "Filtração: camadas de areia e cascalho retêm partículas restantes.",
        "Desinfecção (cloração) e fluoretação: eliminam micro-organismos e protegem os dentes."
      ],
      resposta: "Floculação → decantação → filtração → desinfecção/fluoretação.",
      pegadinha: "A filtração NÃO elimina micro-organismos dissolvidos; para isso existe a cloração."
    },
    {
      titulo: "Chuva ácida corroendo monumentos", tema: "Química ambiental",
      situacao: "Estátuas de mármore (CaCO₃) em cidades industriais se desgastam rapidamente.",
      pede: "A origem da chuva ácida e a reação com o mármore.",
      conceito: "Óxidos de enxofre e nitrogênio (SOₓ, NOₓ), da queima de combustíveis fósseis, reagem com a água formando ácidos.",
      passos: [
        "Queima de combustíveis libera SO₂ e NOₓ.",
        "Na atmosfera, formam ácidos sulfúrico e nítrico com a água.",
        "O ácido reage com o carbonato de cálcio do mármore, que se desgasta e libera CO₂."
      ],
      resposta: "SOₓ e NOₓ formam ácidos que corroem o mármore (CaCO₃).",
      pegadinha: "O CO₂ forma um ácido fraco; os grandes vilões da chuva ácida são os óxidos de ENXOFRE e NITROGÊNIO."
    },
    {
      titulo: "O zinco protege o ferro", tema: "Eletroquímica · metal de sacrifício",
      situacao: "Cascos de navios recebem placas de zinco para não enferrujarem.",
      pede: "Explicar a proteção.",
      conceito: "O metal com maior tendência a oxidar (menor potencial de redução) oxida primeiro, protegendo o outro.",
      passos: [
        "O zinco oxida mais facilmente que o ferro.",
        "Ligados, o zinco perde elétrons (ânodo) no lugar do ferro.",
        "O ferro fica protegido; a placa de zinco é trocada periodicamente."
      ],
      resposta: "O zinco é o 'metal de sacrifício': ele oxida no lugar do ferro.",
      pegadinha: "Ânodo = oxidação; cátodo = redução. O zinco aqui é o ânodo."
    }
  ],

  /* =========================== MATEMÁTICA =========================== */
  matematica: [
    {
      titulo: "Sobe 20%, cai 20%: volta ao preço?", tema: "Porcentagem sucessiva",
      situacao: "Um produto de R$ 100,00 sofre aumento de 20% e, depois, desconto de 20%.",
      pede: "O preço final.",
      conceito: "Porcentagens sucessivas se multiplicam (fatores), não se somam.",
      passos: [
        "Aumento de 20% → × 1,20: 100 × 1,20 = 120.",
        "Desconto de 20% → × 0,80: 120 × 0,80 = 96.",
        "Fator total: 1,20 × 0,80 = 0,96 → queda de 4%."
      ],
      resposta: "R$ 96,00 (não volta a R$ 100,00).",
      pegadinha: "O desconto de 20% incide sobre 120, não sobre 100."
    },
    {
      titulo: "Duas torneiras enchem mais rápido", tema: "Regra de três inversa",
      situacao: "3 torneiras iguais enchem uma caixa em 8 horas.",
      pede: "Em quanto tempo 4 torneiras iguais a encheriam.",
      conceito: "Mais torneiras → menos tempo: grandezas inversamente proporcionais; o produto se mantém.",
      passos: [
        "Produto constante: 3 × 8 = 24 (torneira·hora).",
        "Com 4 torneiras: 4 × t = 24.",
        "t = 6 horas."
      ],
      resposta: "6 horas.",
      pegadinha: "Fazer regra de três direta (daria 10,7 h). Pergunte: aumentar uma faz a outra aumentar ou diminuir?"
    },
    {
      titulo: "Do mapa para a realidade", tema: "Escala",
      situacao: "Num mapa de escala 1 : 200 000, duas cidades estão a 6 cm.",
      pede: "A distância real em km.",
      conceito: "Escala 1 : 200 000 → 1 cm no mapa = 200 000 cm na realidade.",
      passos: [
        "6 × 200 000 = 1 200 000 cm.",
        "÷ 100 → 12 000 m.",
        "÷ 1 000 → 12 km."
      ],
      resposta: "12 km.",
      pegadinha: "Para ir de cm a km, divida por 100 000 (100 para metros, 1 000 para km)."
    },
    {
      titulo: "Média ou mediana dos salários?", tema: "Estatística",
      situacao: "Cinco funcionários ganham R$ 2 000, 2 000, 2 500, 3 000 e 40 500.",
      pede: "Qual medida representa melhor o salário típico.",
      conceito: "A média é puxada por valores extremos (outliers); a mediana é o valor central.",
      passos: [
        "Média: (2 000 + 2 000 + 2 500 + 3 000 + 40 500) ÷ 5 = 50 000 ÷ 5 = 10 000.",
        "Mediana (valores em ordem): o do meio = 2 500.",
        "Quatro dos cinco ganham até R$ 3 000 → a mediana representa melhor."
      ],
      resposta: "A mediana (R$ 2 500); a média (R$ 10 000) é distorcida pelo salário alto.",
      pegadinha: "Com um valor muito discrepante, a questão quase sempre quer a MEDIANA."
    },
    {
      titulo: "Dois dados: soma 7", tema: "Probabilidade",
      situacao: "Dois dados comuns são lançados.",
      pede: "A probabilidade de a soma ser 7.",
      conceito: "P = casos favoráveis ÷ casos possíveis. Com dois dados há 6 × 6 = 36 resultados.",
      passos: [
        "Total de resultados: 36.",
        "Somas 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) → 6 casos.",
        "P = 6/36 = 1/6."
      ],
      resposta: "1/6 (≈ 16,7%).",
      pegadinha: "(1,6) e (6,1) são resultados DIFERENTES — os dados são distinguíveis."
    },
    {
      titulo: "Quantos litros cabem na piscina?", tema: "Geometria espacial · volume",
      situacao: "Uma piscina retangular mede 8 m × 4 m × 1,5 m.",
      pede: "A capacidade em litros.",
      conceito: "Volume do bloco = comprimento × largura × altura; 1 m³ = 1 000 L.",
      passos: [
        "V = 8 × 4 × 1,5 = 48 m³.",
        "48 × 1 000 = 48 000 L."
      ],
      resposta: "48 000 litros.",
      pegadinha: "Esquecer a conversão 1 m³ = 1 000 L — a pegadinha mais comum de volume no ENEM."
    }
  ]
};
