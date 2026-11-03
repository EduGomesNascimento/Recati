/* Questões no estilo ENEM (contextualizadas) de Matemática e
   Ciências da Natureza, para dar cobertura dessas áreas na fonte
   "Só ENEM". Escritas à mão, com resposta conferida. fonte: "enem". */
module.exports = [
  /* ===================== MATEMÁTICA (estilo ENEM) ===================== */
  {
    area: "matematica", materia: "matematica", topico: "Vazão e proporção", nivel: "Fácil",
    enunciado: "Uma torneira enche um reservatório de 600 litros em 20 minutos, com vazão constante. Qual é essa vazão, em litros por minuto?",
    alternativas: ["20 L/min", "25 L/min", "30 L/min", "40 L/min", "60 L/min"], correta: 2,
    explicacao: "Vazão = volume ÷ tempo = 600 L ÷ 20 min = 30 L/min.",
    dica: "Vazão é quanto passa por unidade de tempo: divida o volume pelo tempo."
  },
  {
    area: "matematica", materia: "matematica", topico: "Porcentagem", nivel: "Fácil",
    enunciado: "Uma blusa que custa R$ 80,00 está com 25% de desconto à vista. Qual o preço à vista?",
    alternativas: ["R$ 55,00", "R$ 60,00", "R$ 65,00", "R$ 70,00", "R$ 75,00"], correta: 1,
    explicacao: "Desconto de 25% → paga-se 75%. 80 × 0,75 = R$ 60,00. (Ou: 25% de 80 = 20; 80 − 20 = 60.)",
    dica: "Desconto de p% → multiplique por (1 − p/100)."
  },
  {
    area: "matematica", materia: "matematica", topico: "Velocidade média", nivel: "Médio",
    enunciado: "Um ônibus percorreu 180 km em 2 horas e 30 minutos. Qual foi sua velocidade média?",
    alternativas: ["60 km/h", "72 km/h", "75 km/h", "80 km/h", "90 km/h"], correta: 1,
    explicacao: "2 h 30 min = 2,5 h. Velocidade média = distância ÷ tempo = 180 ÷ 2,5 = 72 km/h.",
    dica: "Converta o tempo para horas decimais (30 min = 0,5 h) antes de dividir."
  },
  {
    area: "matematica", materia: "matematica", topico: "Geometria/Volume", nivel: "Médio",
    enunciado: "Um reservatório em forma de bloco retangular tem 2 m de comprimento, 3 m de largura e 1 m de altura. Quantos litros de água ele comporta cheio? (1 m³ = 1000 L)",
    alternativas: ["600 L", "6 000 L", "60 000 L", "6 m³", "600 000 L"], correta: 1,
    explicacao: "Volume = 2 × 3 × 1 = 6 m³. Como 1 m³ = 1000 L, são 6 × 1000 = 6 000 L.",
    dica: "Volume do bloco = comprimento × largura × altura. Depois converta m³ → litros."
  },
  {
    area: "matematica", materia: "matematica", topico: "Escala", nivel: "Médio",
    enunciado: "Em um mapa de escala 1:50 000, a distância entre duas cidades é de 8 cm. Qual a distância real, em quilômetros?",
    alternativas: ["2 km", "4 km", "5 km", "8 km", "40 km"], correta: 1,
    explicacao: "8 cm × 50 000 = 400 000 cm. Convertendo: 400 000 cm = 4 000 m = 4 km.",
    dica: "Multiplique a medida do mapa pela escala e converta (100 000 cm = 1 km)."
  },
  {
    area: "matematica", materia: "matematica", topico: "Estatística", nivel: "Médio",
    enunciado: "Em uma avaliação, um aluno tirou 6,0 na prova (peso 3) e 8,0 no trabalho (peso 2). Qual a média ponderada?",
    alternativas: ["6,4", "6,8", "7,0", "7,2", "7,5"], correta: 1,
    explicacao: "Média ponderada = (6×3 + 8×2) ÷ (3+2) = (18 + 16) ÷ 5 = 34 ÷ 5 = 6,8.",
    dica: "Média ponderada: multiplique nota × peso, some e divida pela soma dos pesos."
  },
  {
    area: "matematica", materia: "matematica", topico: "Probabilidade", nivel: "Médio",
    enunciado: "Ao lançar um dado comum de 6 faces, qual a probabilidade de sair um número maior que 4?",
    alternativas: ["1/6", "1/3", "1/2", "2/3", "5/6"], correta: 1,
    explicacao: "Números maiores que 4: apenas 5 e 6 (2 casos). Probabilidade = 2/6 = 1/3.",
    dica: "Conte os casos favoráveis e divida pelos 6 resultados possíveis."
  },
  {
    area: "matematica", materia: "matematica", topico: "Álgebra e Funções", nivel: "Médio",
    enunciado: "Uma corrida de táxi cobra R$ 5,00 de bandeirada (fixo) mais R$ 2,00 por quilômetro. Quanto custa uma corrida de 10 km?",
    alternativas: ["R$ 20,00", "R$ 22,00", "R$ 25,00", "R$ 27,00", "R$ 30,00"], correta: 2,
    explicacao: "Modelo do 1º grau: C = 5 + 2·x. Para x = 10: C = 5 + 2×10 = 5 + 20 = R$ 25,00.",
    dica: "Parte fixa (bandeirada) + parte variável (por km). É uma função do 1º grau."
  },
  {
    area: "matematica", materia: "matematica", topico: "Matemática Financeira", nivel: "Médio",
    enunciado: "Um capital de R$ 1 000,00 é aplicado a juros simples de 2% ao mês durante 5 meses. Qual o valor dos juros?",
    alternativas: ["R$ 20,00", "R$ 50,00", "R$ 100,00", "R$ 200,00", "R$ 1 100,00"], correta: 2,
    explicacao: "Juros simples: J = C·i·t = 1000 × 0,02 × 5 = R$ 100,00.",
    dica: "Juros simples: J = capital × taxa (decimal) × tempo."
  },
  {
    area: "matematica", materia: "matematica", topico: "Proporção", nivel: "Médio",
    enunciado: "Em uma sala, a razão entre meninos e meninas é 3 para 2. Se há 30 alunos no total, quantos são meninos?",
    alternativas: ["12", "15", "18", "20", "24"], correta: 2,
    explicacao: "A razão 3:2 divide o total em 3+2 = 5 partes. Cada parte = 30 ÷ 5 = 6. Meninos = 3 × 6 = 18.",
    dica: "Some as partes da razão e divida o total por elas para achar o valor de cada parte."
  },
  {
    area: "matematica", materia: "matematica", topico: "Geometria Plana", nivel: "Fácil",
    enunciado: "Para revestir um piso retangular de 4 m por 5 m, usam-se lajotas quadradas de 0,25 m² cada. Quantas lajotas são necessárias?",
    alternativas: ["20", "40", "60", "80", "100"], correta: 3,
    explicacao: "Área do piso = 4 × 5 = 20 m². Nº de lajotas = 20 ÷ 0,25 = 80 lajotas.",
    dica: "Divida a área total pela área de cada peça."
  },
  {
    area: "matematica", materia: "matematica", topico: "Porcentagem", nivel: "Médio",
    enunciado: "Um trabalhador recebia R$ 1 200,00 e teve um aumento de 15%. Qual seu novo salário?",
    alternativas: ["R$ 1 215,00", "R$ 1 320,00", "R$ 1 380,00", "R$ 1 500,00", "R$ 1 800,00"], correta: 2,
    explicacao: "Aumento de 15% → multiplica por 1,15: 1200 × 1,15 = R$ 1 380,00. (15% de 1200 = 180; 1200 + 180 = 1380.)",
    dica: "Aumento de p% → multiplique por (1 + p/100)."
  },
  {
    area: "matematica", materia: "matematica", topico: "Estatística/Densidade", nivel: "Médio",
    enunciado: "Uma cidade tem 500 000 habitantes e área de 2 000 km². Qual a densidade demográfica (hab/km²)?",
    alternativas: ["100 hab/km²", "200 hab/km²", "250 hab/km²", "400 hab/km²", "500 hab/km²"], correta: 2,
    explicacao: "Densidade demográfica = população ÷ área = 500 000 ÷ 2 000 = 250 hab/km².",
    dica: "Densidade demográfica = habitantes ÷ área."
  },
  {
    area: "matematica", materia: "matematica", topico: "Porcentagem", nivel: "Difícil",
    enunciado: "Um preço de R$ 100,00 sofre dois descontos sucessivos de 10% e 20%. Qual o preço final?",
    alternativas: ["R$ 68,00", "R$ 70,00", "R$ 72,00", "R$ 75,00", "R$ 80,00"], correta: 2,
    explicacao: "Descontos sucessivos multiplicam os fatores: 100 × 0,90 × 0,80 = R$ 72,00 (não 70, pois não se somam os percentuais).",
    dica: "Descontos sucessivos: multiplique (0,90 × 0,80), nunca some as porcentagens."
  },
  {
    area: "matematica", materia: "matematica", topico: "Frações", nivel: "Fácil",
    enunciado: "João gastou 3/4 de seus R$ 200,00 em livros. Quanto ele gastou?",
    alternativas: ["R$ 50,00", "R$ 100,00", "R$ 120,00", "R$ 150,00", "R$ 180,00"], correta: 3,
    explicacao: "3/4 de 200 = (3 × 200) ÷ 4 = 600 ÷ 4 = R$ 150,00.",
    dica: "Fração de um valor: multiplique pelo numerador e divida pelo denominador."
  },
  {
    area: "matematica", materia: "matematica", topico: "Análise Combinatória", nivel: "Fácil",
    enunciado: "Uma pessoa tem 4 camisetas e 3 bermudas. De quantas formas diferentes pode se vestir (uma camiseta e uma bermuda)?",
    alternativas: ["7", "9", "10", "12", "16"], correta: 3,
    explicacao: "Pelo princípio multiplicativo: 4 × 3 = 12 combinações diferentes.",
    dica: "Escolhas combinadas (e...e) → multiplique as opções."
  },

  /* ===================== CIÊNCIAS DA NATUREZA (estilo ENEM) ===================== */
  {
    area: "natureza", materia: "fisica", topico: "Eletrodinâmica", nivel: "Médio",
    enunciado: "Uma lâmpada de 60 W fica acesa 5 horas por dia durante 30 dias. Qual o consumo mensal de energia?",
    alternativas: ["0,3 kWh", "3 kWh", "9 kWh", "18 kWh", "90 kWh"], correta: 2,
    explicacao: "60 W = 0,06 kW. Energia = 0,06 × 5 × 30 = 9 kWh.",
    dica: "Converta W → kW (÷1000) e multiplique por horas e dias."
  },
  {
    area: "natureza", materia: "fisica", topico: "Mecânica/Energia", nivel: "Médio",
    enunciado: "Um objeto é abandonado de uma altura de 20 m (g = 10 m/s², sem resistência do ar). Qual a velocidade ao atingir o solo?",
    alternativas: ["10 m/s", "15 m/s", "20 m/s", "40 m/s", "200 m/s"], correta: 2,
    explicacao: "Conservação de energia: v = √(2·g·h) = √(2×10×20) = √400 = 20 m/s.",
    dica: "Queda sem atrito: v = √(2·g·h)."
  },
  {
    area: "natureza", materia: "quimica", topico: "Química Geral", nivel: "Médio",
    enunciado: "Qual é a massa de 2 mols de água (H₂O)? (massa molar da água = 18 g/mol)",
    alternativas: ["9 g", "18 g", "20 g", "36 g", "72 g"], correta: 3,
    explicacao: "massa = nº de mols × massa molar = 2 × 18 = 36 g.",
    dica: "massa = mols × massa molar (g/mol)."
  },
  {
    area: "natureza", materia: "quimica", topico: "Química Geral", nivel: "Fácil",
    enunciado: "Uma solução apresenta pH = 5. Em relação à acidez, essa solução é:",
    alternativas: ["Fortemente básica", "Levemente básica", "Neutra", "Ácida", "Sem classificação"], correta: 3,
    explicacao: "Na escala de 0 a 14, pH < 7 indica solução ácida. Com pH = 5, a solução é ácida.",
    dica: "pH < 7 ácido · pH = 7 neutro · pH > 7 básico."
  },
  {
    area: "natureza", materia: "biologia", topico: "Genética", nivel: "Médio",
    enunciado: "No cruzamento de dois indivíduos heterozigotos (Aa × Aa), qual a probabilidade de um descendente apresentar o fenótipo recessivo?",
    alternativas: ["0%", "25%", "50%", "75%", "100%"], correta: 1,
    explicacao: "Aa × Aa gera 1 AA : 2 Aa : 1 aa. O fenótipo recessivo só aparece em aa, ou seja, 1/4 = 25%.",
    dica: "Monte o quadro de Punnett: Aa × Aa → 3 dominantes : 1 recessivo (25%)."
  },
  {
    area: "natureza", materia: "fisica", topico: "Ondulatória", nivel: "Médio",
    enunciado: "Uma onda sonora propaga-se no ar a 340 m/s com frequência de 20 Hz. Qual o comprimento de onda?",
    alternativas: ["7 m", "10 m", "15 m", "17 m", "20 m"], correta: 3,
    explicacao: "v = λ·f → λ = v/f = 340 ÷ 20 = 17 m.",
    dica: "Equação fundamental das ondas: v = λ·f. Isole λ = v/f."
  }
];
