/* ============================================================
   GERADOR do banco de questões (build-time, determinístico).
   Executar:  node build/generate-questions.js
   Gera:      js/data/questions.js  (window.ENEM_QUESTIONS)

   Combina:
   - Questões conceituais curadas (estilo ENEM, escritas à mão)
   - Geradores paramétricos quantitativos (matemática, física,
     química) que produzem problemas distintos com resposta
     calculada corretamente e explicação real.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

/* ---------- RNG determinístico (mulberry32) ---------- */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20260710);
const rint = (a, b) => a + Math.floor(rng() * (b - a + 1));
const pick = arr => arr[Math.floor(rng() * arr.length)];
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr;
}

/* ---------- formatação pt-BR ---------- */
const money = v => 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const num = (v, d = 0) => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });

/* ---------- montador de alternativas ----------
   correctVal + lista de distratores → 5 alternativas embaralhadas.
   fmt: função que formata o valor em texto. keyOf: normaliza p/ dedupe. */
function build(base, correctVal, distractors, fmt, keyOf) {
  keyOf = keyOf || (v => Math.round(Number(v) * 100) / 100);
  const seen = new Set([keyOf(correctVal)]);
  const opts = [{ v: correctVal, ok: true }];
  for (const d of distractors) {
    if (!isFinite(d)) continue;
    const k = keyOf(d);
    if (seen.has(k)) continue;
    seen.add(k); opts.push({ v: d, ok: false });
    if (opts.length === 5) break;
  }
  // padding de segurança
  const factors = [0.5, 1.5, 0.75, 1.25, 2, 0.9, 1.1, 0.6, 1.4, 3];
  let fi = 0;
  while (opts.length < 5 && fi < factors.length) {
    let cand = correctVal * factors[fi++]; if (correctVal === 0) cand = factors[fi] || 1;
    const k = keyOf(cand);
    if (!seen.has(k) && isFinite(cand)) { seen.add(k); opts.push({ v: cand, ok: false }); }
  }
  shuffle(opts);
  base.alternativas = opts.map(o => fmt(o.v));
  base.correta = opts.findIndex(o => o.ok);
  return base;
}

const OUT = [];
let counter = 0;
const nid = pfx => `${pfx}-${String(++counter).padStart(4, '0')}`;

/* ============================================================
   1) QUESTÕES CONCEITUAIS CURADAS
   ============================================================ */
const CURADAS = [].concat(
  require('./curated-questions.js'),
  require('./curated-questions-2.js'),
  require('./curated-questions-3.js')
);
CURADAS.forEach(q => { q.id = q.id || nid('c'); q.gerada = false; OUT.push(q); });

/* ============================================================
   2) GERADORES PARAMÉTRICOS
   ============================================================ */

/* --- Matemática: porcentagem sucessiva (desconto + acréscimo) --- */
function genPorcSucessiva() {
  const ctx = pick([
    ['um eletrodoméstico', 'na loja'], ['uma bicicleta', 'na promoção'],
    ['um celular', 'no e-commerce'], ['uma geladeira', 'na liquidação'],
    ['um tênis', 'na loja esportiva'], ['um livro', 'na feira']
  ]);
  const base = rint(80, 60) * 10 / 1; // multiplos de 10
  const preco = rint(10, 60) * 10;
  const desc = pick([10, 15, 20, 25, 30, 40]);
  const acr = pick([5, 10, 12, 15, 20]);
  const fd = 1 - desc / 100, fa = 1 + acr / 100;
  const correto = preco * fd * fa;
  const errSoma = preco * (1 + (acr - desc) / 100); // erro de somar %
  const errSoDesc = preco * fd;
  const errSoAcr = preco * fa;
  const q = {
    area: 'matematica', materia: 'matematica', topico: 'Porcentagem', nivel: 'Médio', gerada: true,
    enunciado: `O preço de ${ctx[0]} ${ctx[1]} é ${money(preco)}. Ele recebe um desconto de ${desc}% e, em seguida, um acréscimo de ${acr}% por parcelamento. Qual o valor final?`,
    explicacao: `Descontos e acréscimos não se somam — multiplicam-se os fatores. Desconto de ${desc}% → ×${num(fd, 2)}; acréscimo de ${acr}% → ×${num(fa, 2)}. Assim: ${money(preco)} × ${num(fd, 2)} × ${num(fa, 2)} = ${money(correto)}.`,
    dica: 'Nunca some porcentagens sucessivas: aplique um fator depois do outro sobre o que sobrou.'
  };
  return build(q, correto, [errSoma, errSoDesc, errSoAcr, preco, correto * 1.1], money);
}

/* --- Matemática: X% de V (porcentagem simples) --- */
function genPorcSimples() {
  const p = pick([5, 8, 10, 12, 15, 20, 25, 30, 40, 60, 75]);
  const v = rint(4, 40) * 50;
  const correto = v * p / 100;
  const ctx = pick([
    `Em uma turma de ${v} alunos, ${p}% foram aprovados sem recuperação.`,
    `Uma conta de ${money(v)} recebeu ${p}% de gorjeta.`,
    `De ${v} vagas oferecidas, ${p}% foram destinadas a cotas.`,
    `Um investimento de ${money(v)} rendeu ${p}% no período.`
  ]);
  const isMoney = ctx.includes('R$');
  const fmt = isMoney ? money : (x => num(x, x % 1 ? 1 : 0));
  const q = {
    area: 'matematica', materia: 'matematica', topico: 'Porcentagem', nivel: 'Fácil', gerada: true,
    enunciado: `${ctx} Quanto isso representa?`,
    explicacao: `${p}% de ${isMoney ? money(v) : num(v)} = ${isMoney ? money(v) : num(v)} × ${p}/100 = ${isMoney ? money(correto) : num(correto, correto % 1 ? 1 : 0)}.`,
    dica: 'X% de V = V × (X ÷ 100). Basta multiplicar.'
  };
  return build(q, correto, [v * p / 10, v * p / 1000, v / p, correto * 2, correto / 2], fmt);
}

/* --- Matemática: regra de três simples --- */
function genRegraTres() {
  const cenarios = [
    () => { const p = rint(3, 8), g = rint(200, 500), q2 = p + rint(2, 6); return { texto: `Uma receita para ${p} pessoas usa ${g} g de farinha. Mantendo a proporção, quantos gramas são necessários para ${q2} pessoas?`, correto: g / p * q2, unidade: 'g', direta: true }; },
    () => { const km = rint(40, 120), l = rint(4, 10), km2 = km * rint(2, 4); return { texto: `Um carro percorre ${km} km com ${l} litros de combustível. Quantos litros para percorrer ${km2} km, no mesmo consumo?`, correto: l / km * km2, unidade: ' litros', direta: true }; },
    () => { const maq = rint(2, 5), dias = rint(6, 20), maq2 = maq + rint(1, 4); return { texto: `${maq} máquinas fazem um serviço em ${dias} dias. Quantos dias ${maq2} máquinas iguais levariam (grandezas inversamente proporcionais)?`, correto: maq * dias / maq2, unidade: ' dias', direta: false, inv: true }; },
    () => { const oper = rint(4, 10), horas = rint(6, 12), oper2 = oper - rint(1, 3); return { texto: `${oper} operários constroem um muro em ${horas} horas. Quantas horas ${oper2} operários levariam (inversamente proporcional)?`, correto: oper * horas / oper2, unidade: ' horas', direta: false, inv: true }; }
  ];
  const s = pick(cenarios)();
  const c = Math.round(s.correto * 100) / 100;
  const fmt = x => num(x, x % 1 ? 2 : 0) + s.unidade;
  const q = {
    area: 'matematica', materia: 'matematica', topico: 'Regra de três', nivel: s.inv ? 'Médio' : 'Fácil', gerada: true,
    enunciado: s.texto,
    explicacao: s.inv
      ? `Grandezas inversamente proporcionais: quando uma aumenta, a outra diminui. Multiplicamos "reto": o produto se conserva, resultando em ${fmt(c)}.`
      : `Grandezas diretamente proporcionais. Montando a proporção e multiplicando cruzado, obtém-se ${fmt(c)}.`,
    dica: s.inv ? '"Mais recursos, menos tempo" → inversamente proporcional: inverta antes de multiplicar.' : 'Ache o valor unitário e multiplique — é o caminho mais rápido.'
  };
  return build(q, c, [c * 1.5, c / 1.5, c * 2, c * 0.8, c + s.correto * 0.25], fmt);
}

/* --- Matemática: vértice de parábola (máximo/mínimo) --- */
function genVertice() {
  const b = pick([4, 6, 8, 10, 12]);
  const a = -1;
  const c0 = -pick([3, 5, 7, 9]);
  const xv = -b / (2 * a); // = b/2
  const contexto = pick([
    ['O lucro (em milhares de reais) de uma empresa é', 'a quantidade vendida (em milhares) que maximiza o lucro'],
    ['A altura (em metros) de um projétil é', 'o instante (em s) de altura máxima'],
    ['A receita (em mil reais) de um evento é', 'o número de ingressos (em milhares) que maximiza a receita']
  ]);
  const q = {
    area: 'matematica', materia: 'matematica', topico: 'Função 2º grau', nivel: 'Médio', gerada: true,
    enunciado: `${contexto[0]} dada por f(x) = −x² + ${b}x − ${-c0}. Qual é ${contexto[1]}?`,
    explicacao: `Como a = −1 < 0, a parábola tem ponto de MÁXIMO no vértice. x do vértice = −b/(2a) = −${b}/(2×(−1)) = ${xv}.`,
    dica: '"Máximo" ou "mínimo" → vértice: x = −b/(2a). Não teste valor por valor.'
  };
  const distr = [b, xv + 1, xv - 1, xv + 2, xv * 2, -c0, xv - 2, b - 1].filter(v => v > 0 && v !== xv);
  return build(q, xv, distr, x => num(Math.round(x)), v => Math.round(v));
}

/* --- Matemática: função 1º grau (custo) --- */
function genFuncao1() {
  const fixo = rint(20, 80) * 5;
  const varr = pick([2, 2.5, 3, 4, 5, 8]);
  const x = rint(10, 60);
  const correto = fixo + varr * x;
  const q = {
    area: 'matematica', materia: 'matematica', topico: 'Álgebra e Funções', nivel: 'Fácil', gerada: true,
    enunciado: `Uma empresa cobra uma taxa fixa de ${money(fixo)} mais ${money(varr)} por unidade produzida. Qual o custo total para ${x} unidades?`,
    explicacao: `Modelo do 1º grau: C(x) = ${fixo} + ${num(varr, varr % 1 ? 2 : 0)}·x. Para x = ${x}: ${money(fixo)} + ${money(varr)}×${x} = ${money(correto)}.`,
    dica: 'Taxa fixa é o "b" (valor inicial); o custo por unidade é o "a" (inclinação).'
  };
  return build(q, correto, [varr * x, fixo + varr, fixo * x, correto + fixo, correto - fixo], money);
}

/* --- Matemática: volume de cilindro → litros --- */
function genVolumeCilindro() {
  const r = pick([1, 2, 0.5, 1.5, 3]);
  const h = pick([1, 2, 3, 4, 2.5]);
  const PI = 3.14;
  const vol = PI * r * r * h; // m³
  const litros = vol * 1000;
  const q = {
    area: 'matematica', materia: 'matematica', topico: 'Geometria/Volume', nivel: 'Difícil', gerada: true,
    enunciado: `Uma caixa d'água cilíndrica tem raio ${num(r, r % 1 ? 1 : 0)} m e altura ${num(h, h % 1 ? 1 : 0)} m. Usando π ≈ 3,14, quantos litros ela comporta (1 m³ = 1000 L)?`,
    explicacao: `Volume = π·r²·h = 3,14 × ${num(r, r % 1 ? 1 : 0)}² × ${num(h, h % 1 ? 1 : 0)} = ${num(vol, 2)} m³. Convertendo: ${num(vol, 2)} × 1000 = ${num(litros)} litros.`,
    dica: 'Pegadinha clássica: 1 m³ = 1000 L. Calcule em m³ e multiplique por 1000.'
  };
  return build(q, litros, [vol, litros / 10, PI * r * h * 1000, litros * 2, litros / 2], x => num(Math.round(x)) + ' litros');
}

/* --- Matemática: Pitágoras --- */
function genPitagoras() {
  const ternas = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25]];
  const t = pick(ternas);
  const k = pick([1, 1, 2, 3, 10]);
  const a = t[0] * k, b = t[1] * k, hip = t[2] * k;
  const ctx = pick([
    `Uma escada apoiada na parede tem a base a ${a} m do muro e o topo a ${b} m de altura.`,
    `Um terreno retangular tem lados de ${a} m e ${b} m.`,
    `Um mastro de ${b} m é preso por um cabo fixado a ${a} m de sua base.`
  ]);
  const q = {
    area: 'matematica', materia: 'matematica', topico: 'Geometria Plana', nivel: 'Médio', gerada: true,
    enunciado: `${ctx} Qual o comprimento da diagonal/hipotenusa (em metros)?`,
    explicacao: `Teorema de Pitágoras: hip² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}. Logo hip = √${a * a + b * b} = ${hip} m.`,
    dica: 'Reconheça as ternas pitagóricas (3-4-5, 5-12-13...) e seus múltiplos para ganhar tempo.'
  };
  return build(q, hip, [a + b, Math.round(Math.sqrt(a * a + b * b) * 1.2), hip + k, hip - k, Math.round((a + b) / 2)], x => num(x) + ' m');
}

/* --- Matemática: probabilidade (urna) --- */
function genProbabilidade() {
  const cores = shuffle([['azuis', rint(2, 6)], ['vermelhas', rint(2, 6)], ['verdes', rint(1, 5)]]);
  const total = cores.reduce((s, c) => s + c[1], 0);
  const alvo = cores[0];
  const frac = alvo[1] / total;
  const q = {
    area: 'matematica', materia: 'matematica', topico: 'Probabilidade', nivel: 'Médio', gerada: true,
    enunciado: `Uma urna contém ${cores.map(c => `${c[1]} bolas ${c[0]}`).join(', ')}. Retirando uma bola ao acaso, qual a probabilidade de ela ser ${alvo[0].replace('s', '')}?`,
    explicacao: `Total de bolas = ${cores.map(c => c[1]).join('+')} = ${total}. Casos favoráveis = ${alvo[1]}. Probabilidade = ${alvo[1]}/${total} ≈ ${num(frac * 100, 1)}%.`,
    dica: 'Probabilidade = casos favoráveis ÷ casos totais. Some tudo para o total.'
  };
  return build(q, frac, [alvo[1] / (total - alvo[1]), (total - alvo[1]) / total, 1 / total, alvo[1] / total * 1.5], x => `${Math.round(x * total)}/${total} (≈ ${num(x * 100, 0)}%)`, v => Math.round(v * 1000));
}

/* --- Matemática: média / moda / mediana --- */
function genEstatistica() {
  const n = 5;
  const vals = Array.from({ length: n }, () => rint(3, 10));
  vals[1] = vals[2]; // garante uma moda
  const soma = vals.reduce((a, b) => a + b, 0);
  const media = soma / n;
  const ord = vals.slice().sort((a, b) => a - b);
  const mediana = ord[2];
  const freq = {}; vals.forEach(v => freq[v] = (freq[v] || 0) + 1);
  const moda = Object.keys(freq).sort((a, b) => freq[b] - freq[a])[0];
  const tipo = pick(['média', 'mediana', 'moda']);
  const correto = tipo === 'média' ? media : tipo === 'mediana' ? mediana : Number(moda);
  const q = {
    area: 'matematica', materia: 'matematica', topico: 'Estatística', nivel: 'Médio', gerada: true,
    enunciado: `As notas de um aluno em ${n} avaliações foram: ${vals.join(', ')}. Qual é a ${tipo} dessas notas?`,
    explicacao: tipo === 'média'
      ? `Média = (${vals.join('+')}) ÷ ${n} = ${soma} ÷ ${n} = ${num(media, media % 1 ? 1 : 0)}.`
      : tipo === 'mediana'
        ? `Em ordem: ${ord.join(', ')}. A mediana é o valor central = ${mediana}.`
        : `A moda é o valor que mais se repete = ${moda}.`,
    dica: tipo === 'mediana' ? 'Para a mediana, SEMPRE ordene primeiro e pegue o do meio.' : tipo === 'moda' ? 'Moda = valor mais frequente.' : 'Média = soma ÷ quantidade.'
  };
  return build(q, correto, [media, mediana, Number(moda), soma, ord[0], ord[4]], x => num(x, x % 1 ? 1 : 0));
}

/* --- Matemática: juros simples --- */
function genJurosSimples() {
  const cap = rint(4, 40) * 100;
  const taxa = pick([1, 2, 2.5, 3, 4, 5]);
  const t = rint(3, 24);
  const juros = cap * (taxa / 100) * t;
  const montante = cap + juros;
  const pedeMontante = rng() < 0.5;
  const correto = pedeMontante ? montante : juros;
  const q = {
    area: 'matematica', materia: 'matematica', topico: 'Matemática Financeira', nivel: 'Médio', gerada: true,
    enunciado: `Um capital de ${money(cap)} é aplicado a juros simples de ${num(taxa, taxa % 1 ? 1 : 0)}% ao mês durante ${t} meses. Qual ${pedeMontante ? 'o montante final' : 'o valor dos juros'}?`,
    explicacao: `Juros simples: J = C·i·t = ${money(cap)} × ${num(taxa / 100, 3)} × ${t} = ${money(juros)}. ${pedeMontante ? `Montante = capital + juros = ${money(cap)} + ${money(juros)} = ${money(montante)}.` : ''}`,
    dica: 'Juros simples incidem sempre sobre o capital inicial: J = C·i·t (taxa em decimal).'
  };
  return build(q, correto, [pedeMontante ? juros : montante, cap * taxa / 100, juros * 2, correto * 1.1, correto * 0.9], money);
}

/* --- Matemática: escala de mapa --- */
function genEscala() {
  const escala = pick([1000, 5000, 10000, 25000, 50000, 100000]);
  const cm = rint(2, 12);
  const realM = cm * escala / 100; // metros
  const realKm = realM / 1000;
  const usaKm = escala >= 25000;
  const correto = usaKm ? realKm : realM;
  const q = {
    area: 'matematica', materia: 'matematica', topico: 'Escala e Proporção', nivel: 'Médio', gerada: true,
    enunciado: `Em um mapa de escala 1:${num(escala)}, dois pontos distam ${cm} cm. Qual a distância real ${usaKm ? '(em km)' : '(em metros)'}?`,
    explicacao: `A escala 1:${num(escala)} significa que 1 cm no mapa = ${num(escala)} cm reais. Assim, ${cm} cm × ${num(escala)} = ${num(cm * escala)} cm = ${usaKm ? num(realKm, realKm % 1 ? 2 : 0) + ' km' : num(realM) + ' m'}.`,
    dica: 'Multiplique a medida do mapa pela escala e converta a unidade (100 cm = 1 m; 100000 cm = 1 km).'
  };
  return build(q, correto, [correto * 10, correto / 10, cm * escala, correto * 2], x => num(x, x % 1 ? 2 : 0) + (usaKm ? ' km' : ' m'));
}

/* --- Física: consumo em kWh --- */
function genConsumoKwh() {
  const aparelhos = [['chuveiro elétrico', pick([4400, 5400, 6800])], ['ferro de passar', pick([1000, 1200])],
  ['ar-condicionado', pick([1400, 2000])], ['micro-ondas', pick([1200, 1500])], ['secador de cabelo', pick([1600, 2000])]];
  const ap = pick(aparelhos);
  const potW = ap[1];
  const potKw = potW / 1000;
  const minDia = pick([15, 20, 30, 40, 60]);
  const hDia = minDia / 60;
  const dias = 30;
  const kwh = potKw * hDia * dias;
  const q = {
    area: 'natureza', materia: 'fisica', topico: 'Eletrodinâmica', nivel: 'Médio', gerada: true,
    enunciado: `Um ${ap[0]} de ${num(potW)} W é usado ${minDia} minutos por dia durante ${dias} dias. Qual o consumo mensal de energia?`,
    explicacao: `Converta: ${num(potW)} W = ${num(potKw, potKw % 1 ? 1 : 0)} kW; ${minDia} min = ${num(hDia, 2)} h. Energia = P × t = ${num(potKw, 1)} × ${num(hDia, 2)} × ${dias} = ${num(kwh, 1)} kWh.`,
    dica: 'kWh = potência (kW) × horas de uso. Converta W→kW (÷1000) e min→h (÷60).'
  };
  return build(q, kwh, [potKw * minDia * dias, kwh * 60, potW * hDia * dias / 1000 * 60, kwh / 2, kwh * 2], x => num(x, 1) + ' kWh');
}

/* --- Física: ondas v = λ·f --- */
function genOndas() {
  const modo = pick(['lambda', 'freq', 'vel']);
  const v = pick([340, 300, 1500, 320, 340]);
  const f = pick([20, 50, 85, 100, 170, 200, 250, 500]);
  const lambda = v / f;
  let correto, enun, expl, unidade;
  if (modo === 'lambda') {
    correto = lambda; unidade = ' m';
    enun = `Uma onda se propaga a ${num(v)} m/s com frequência ${num(f)} Hz. Qual o comprimento de onda?`;
    expl = `v = λ·f → λ = v/f = ${num(v)}/${num(f)} = ${num(lambda, lambda % 1 ? 2 : 0)} m.`;
  } else if (modo === 'freq') {
    correto = f; unidade = ' Hz';
    enun = `Uma onda de velocidade ${num(v)} m/s tem comprimento de onda ${num(lambda, lambda % 1 ? 2 : 0)} m. Qual a frequência?`;
    expl = `v = λ·f → f = v/λ = ${num(v)}/${num(lambda, lambda % 1 ? 2 : 0)} = ${num(f)} Hz.`;
  } else {
    correto = v; unidade = ' m/s';
    enun = `Uma onda de frequência ${num(f)} Hz tem comprimento de onda ${num(lambda, lambda % 1 ? 2 : 0)} m. Qual a velocidade de propagação?`;
    expl = `v = λ·f = ${num(lambda, lambda % 1 ? 2 : 0)} × ${num(f)} = ${num(v)} m/s.`;
  }
  const q = {
    area: 'natureza', materia: 'fisica', topico: 'Ondulatória', nivel: 'Médio', gerada: true,
    enunciado: enun, explicacao: expl,
    dica: 'Fórmula-mãe da ondulatória: v = λ·f. Isole a grandeza pedida.'
  };
  return build(q, correto, [correto * 2, correto / 2, v * f, correto * 1.5, correto * 0.5], x => num(x, x % 1 ? 2 : 0) + unidade);
}

/* --- Física: queda livre (energia / Torricelli) --- */
function genQueda() {
  const g = 10;
  const h = pick([5, 10, 20, 45, 80, 125]);
  const v = Math.sqrt(2 * g * h);
  const q = {
    area: 'natureza', materia: 'fisica', topico: 'Mecânica/Energia', nivel: 'Médio', gerada: true,
    enunciado: `Um objeto é abandonado de uma altura de ${h} m (g = 10 m/s², sem resistência do ar). Com que velocidade ele atinge o solo?`,
    explicacao: `Conservação de energia: m·g·h = m·v²/2 → v = √(2·g·h) = √(2×10×${h}) = √${2 * g * h} = ${num(v, v % 1 ? 1 : 0)} m/s.`,
    dica: 'Sem atrito, energia potencial vira cinética: v = √(2·g·h). A massa se cancela.'
  };
  return build(q, v, [2 * g * h, g * h, Math.sqrt(g * h), v * 2, v / 2], x => num(x, x % 1 ? 1 : 0) + ' m/s');
}

/* --- Física: calorimetria Q = m·c·ΔT --- */
function genCalorimetria() {
  const m = pick([100, 200, 250, 500, 1000]); // g
  const c = 1; // cal/g°C água
  const ti = rint(15, 30), tf = ti + pick([10, 20, 30, 40, 50]);
  const dT = tf - ti;
  const Q = m * c * dT;
  const q = {
    area: 'natureza', materia: 'fisica', topico: 'Termologia', nivel: 'Médio', gerada: true,
    enunciado: `Quanto calor (em calorias) é necessário para aquecer ${num(m)} g de água (c = 1 cal/g°C) de ${ti}°C até ${tf}°C?`,
    explicacao: `Q = m·c·ΔT = ${num(m)} × 1 × (${tf}−${ti}) = ${num(m)} × ${dT} = ${num(Q)} cal.`,
    dica: 'Calor sensível: Q = m·c·ΔT. ΔT é a variação (final − inicial).'
  };
  return build(q, Q, [m * dT * 2, m * (tf), m * c, Q / 2, Q * 2], x => num(x) + ' cal');
}

/* --- Química: estequiometria (proporção molar) --- */
function genEstequiometria() {
  const reacoes = [
    { eq: '2 H₂ + O₂ → 2 H₂O', reag: 'H₂', prod: 'H₂O', cr: 2, cp: 2 },
    { eq: 'N₂ + 3 H₂ → 2 NH₃', reag: 'H₂', prod: 'NH₃', cr: 3, cp: 2 },
    { eq: 'C + O₂ → CO₂', reag: 'C', prod: 'CO₂', cr: 1, cp: 1 },
    { eq: '2 C₂H₆ + 7 O₂ → 4 CO₂ + 6 H₂O', reag: 'C₂H₆', prod: 'CO₂', cr: 2, cp: 4 },
    { eq: 'CH₄ + 2 O₂ → CO₂ + 2 H₂O', reag: 'CH₄', prod: 'H₂O', cr: 1, cp: 2 }
  ];
  const r = pick(reacoes);
  const molsReag = pick([1, 2, 3, 4, 5, 6]) * r.cr;
  const molsProd = molsReag / r.cr * r.cp;
  const q = {
    area: 'natureza', materia: 'quimica', topico: 'Estequiometria', nivel: 'Difícil', gerada: true,
    enunciado: `Na reação ${r.eq}, quantos mols de ${r.prod} se formam a partir de ${molsReag} mols de ${r.reag} (demais reagentes em excesso)?`,
    explicacao: `A proporção estequiométrica é ${r.cr} ${r.reag} : ${r.cp} ${r.prod}. Logo, ${molsReag} mols de ${r.reag} produzem ${molsReag} × (${r.cp}/${r.cr}) = ${num(molsProd)} mols de ${r.prod}.`,
    dica: 'Use os coeficientes balanceados como proporção. Balanceie ANTES de calcular.'
  };
  return build(q, molsProd, [molsReag, molsReag * r.cr / r.cp, molsProd * 2, molsProd / 2, molsReag + r.cp], x => num(x, x % 1 ? 1 : 0) + ' mols');
}

/* --- Química: massa molar / número de mols --- */
function genMols() {
  const subs = [['H₂O', 18], ['CO₂', 44], ['NaCl', 58.5], ['O₂', 32], ['CaCO₃', 100], ['C₆H₁₂O₆ (glicose)', 180], ['H₂SO₄', 98]];
  const s = pick(subs);
  const mols = pick([0.5, 1, 2, 3, 0.25, 4]);
  const massa = mols * s[1];
  const pedeMassa = rng() < 0.6;
  const correto = pedeMassa ? massa : mols;
  const q = {
    area: 'natureza', materia: 'quimica', topico: 'Química Geral', nivel: 'Médio', gerada: true,
    enunciado: pedeMassa
      ? `Qual a massa de ${num(mols, mols % 1 ? 2 : 0)} mol de ${s[0]}? (massa molar = ${num(s[1], s[1] % 1 ? 1 : 0)} g/mol)`
      : `Quantos mols há em ${num(massa, massa % 1 ? 1 : 0)} g de ${s[0]}? (massa molar = ${num(s[1], s[1] % 1 ? 1 : 0)} g/mol)`,
    explicacao: pedeMassa
      ? `massa = n° de mols × massa molar = ${num(mols, mols % 1 ? 2 : 0)} × ${num(s[1], s[1] % 1 ? 1 : 0)} = ${num(massa, massa % 1 ? 1 : 0)} g.`
      : `n° de mols = massa ÷ massa molar = ${num(massa, massa % 1 ? 1 : 0)} ÷ ${num(s[1], s[1] % 1 ? 1 : 0)} = ${num(mols, mols % 1 ? 2 : 0)} mols.`,
    dica: 'Relação-chave: massa = mols × massa molar (g/mol da tabela periódica).'
  };
  const fmt = pedeMassa ? (x => num(x, x % 1 ? 1 : 0) + ' g') : (x => num(x, x % 1 ? 2 : 0) + ' mols');
  return build(q, correto, [pedeMassa ? mols : massa, correto * 2, correto / 2, correto * s[1] / 10], fmt);
}

/* --- Química: pH (ácido/base, escala) --- */
function genPh() {
  const casos = [
    { ph: rint(1, 4), classe: 'ácida', ex: pick(['suco de limão', 'vinagre', 'refrigerante']) },
    { ph: 7, classe: 'neutra', ex: 'água pura' },
    { ph: rint(8, 13), classe: 'básica (alcalina)', ex: pick(['sabão', 'água sanitária', 'leite de magnésia']) }
  ];
  const c = pick(casos);
  const q = {
    area: 'natureza', materia: 'quimica', topico: 'Química Geral', nivel: 'Fácil', gerada: true,
    enunciado: `Uma solução (${c.ex}) apresenta pH = ${c.ph}. Essa solução é classificada como:`,
    alternativas: shuffle(['ácida', 'neutra', 'básica (alcalina)', 'sempre corrosiva', 'sem classificação']),
    explicacao: `Na escala de 0 a 14: pH < 7 é ácido, pH = 7 é neutro e pH > 7 é básico. Com pH = ${c.ph}, a solução é ${c.classe}.`,
    dica: 'pH < 7 ácido · pH = 7 neutro · pH > 7 básico. O 7 (água pura) é a referência.'
  };
  q.correta = q.alternativas.indexOf(c.classe);
  return q;
}

/* --- Matemática: progressão aritmética (PA) --- */
function genPA() {
  const a1 = rint(1, 12), r = rint(2, 9), n = rint(6, 20);
  const an = a1 + (n - 1) * r;
  const soma = (a1 + an) * n / 2;
  const pedeSoma = rng() < 0.5;
  const correto = pedeSoma ? soma : an;
  const q = {
    area: 'matematica', materia: 'matematica', topico: 'Progressões', nivel: 'Médio', gerada: true,
    enunciado: pedeSoma
      ? `Em uma progressão aritmética de primeiro termo ${a1} e razão ${r}, qual é a soma dos ${n} primeiros termos?`
      : `Uma progressão aritmética tem primeiro termo ${a1} e razão ${r}. Qual é o ${n}º termo?`,
    explicacao: pedeSoma
      ? `Termo geral: aₙ = a₁ + (n−1)·r = ${a1} + ${n - 1}×${r} = ${an}. Soma: Sₙ = (a₁+aₙ)·n/2 = (${a1}+${an})×${n}/2 = ${num(soma)}.`
      : `Termo geral da PA: aₙ = a₁ + (n−1)·r = ${a1} + (${n}−1)×${r} = ${a1} + ${(n - 1) * r} = ${an}.`,
    dica: 'PA: aₙ = a₁ + (n−1)·r. Soma: Sₙ = (a₁+aₙ)·n/2.'
  };
  return build(q, correto, [pedeSoma ? an : soma, a1 + n * r, correto + r, correto - r, a1 * n], x => num(x));
}

/* --- Matemática: progressão geométrica (PG) --- */
function genPG() {
  const a1 = rint(1, 6), q0 = pick([2, 3]), n = rint(4, 8);
  const an = a1 * Math.pow(q0, n - 1);
  const qq = {
    area: 'matematica', materia: 'matematica', topico: 'Progressões', nivel: 'Difícil', gerada: true,
    enunciado: `Uma cultura de bactérias começa com ${a1} indivíduo(s) e ${q0 === 2 ? 'dobra' : 'triplica'} a cada hora. Quantas bactérias haverá após ${n - 1} horas?`,
    explicacao: `É uma PG de razão ${q0}. Termo geral: aₙ = a₁·qⁿ⁻¹ = ${a1}·${q0}^${n - 1} = ${num(an)}.`,
    dica: 'PG (crescimento que multiplica): aₙ = a₁·qⁿ⁻¹. Cresce exponencialmente.'
  };
  return build(qq, an, [a1 * q0 * (n - 1), a1 * Math.pow(q0, n), an / q0, an * q0, a1 + q0 * (n - 1)], x => num(x));
}

/* --- Matemática: análise combinatória (arranjo/combinação simples) --- */
function genCombinatoria() {
  const fat = k => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
  const tipo = pick(['permuta', 'combina', 'multiplicativo']);
  if (tipo === 'permuta') {
    const n = rint(3, 6);
    const correto = fat(n);
    const q = {
      area: 'matematica', materia: 'matematica', topico: 'Análise Combinatória', nivel: 'Médio', gerada: true,
      enunciado: `De quantas maneiras diferentes ${n} pessoas podem ser organizadas em fila?`,
      explicacao: `É uma permutação de ${n} elementos: P = ${n}! = ${Array.from({ length: n }, (_, i) => n - i).join('×')} = ${num(correto)}.`,
      dica: 'Ordenar TODOS os elementos numa fila = permutação = n! (fatorial).'
    };
    return build(q, correto, [fat(n - 1), n * n, n * (n - 1), fat(n) / 2, n * 2], x => num(x));
  } else if (tipo === 'combina') {
    const n = rint(5, 8), k = rint(2, 3);
    const correto = fat(n) / (fat(k) * fat(n - k));
    const q = {
      area: 'matematica', materia: 'matematica', topico: 'Análise Combinatória', nivel: 'Difícil', gerada: true,
      enunciado: `De um grupo de ${n} pessoas, quantas comissões diferentes de ${k} membros podem ser formadas (a ordem não importa)?`,
      explicacao: `A ordem não importa → combinação: C(${n},${k}) = ${n}! / (${k}!·${n - k}!) = ${num(correto)}.`,
      dica: 'Ordem NÃO importa (comissão, grupo) → combinação. Ordem importa (pódio, senha) → arranjo.'
    };
    return build(q, correto, [fat(n) / fat(n - k), n * k, correto * 2, n + k, correto + k], x => num(x));
  } else {
    const a = rint(2, 5), b = rint(3, 6), c = rint(2, 4);
    const correto = a * b * c;
    const q = {
      area: 'matematica', materia: 'matematica', topico: 'Análise Combinatória', nivel: 'Médio', gerada: true,
      enunciado: `Um cardápio oferece ${a} tipos de entrada, ${b} de prato principal e ${c} de sobremesa. Quantos menus diferentes (uma opção de cada) podem ser montados?`,
      explicacao: `Pelo princípio multiplicativo da contagem: ${a} × ${b} × ${c} = ${num(correto)} menus.`,
      dica: 'Escolhas em sequência (e...e...e) → MULTIPLIQUE as opções.'
    };
    return build(q, correto, [a + b + c, a * b + c, correto + a, correto - b, a * b], x => num(x));
  }
}

/* --- Física: equação dos pontos conjugados (lentes/espelhos) --- */
function genOptica() {
  const f = pick([10, 12, 15, 20, 30]);
  const p = pick([f + 5, f + 10, 2 * f, 3 * f]); // objeto além do foco → imagem real
  const pl = (f * p) / (p - f); // 1/f = 1/p + 1/p'
  const q = {
    area: 'natureza', materia: 'fisica', topico: 'Óptica', nivel: 'Difícil', gerada: true,
    enunciado: `Um objeto é colocado a ${p} cm de uma lente convergente de distância focal ${f} cm. A que distância da lente se forma a imagem?`,
    explicacao: `Equação de Gauss: 1/f = 1/p + 1/p'. Assim 1/p' = 1/${f} − 1/${p}, resultando em p' = ${num(pl, pl % 1 ? 1 : 0)} cm (imagem real, do outro lado).`,
    dica: "Equação dos pontos conjugados: 1/f = 1/p + 1/p'. Isole 1/p' e inverta."
  };
  return build(q, pl, [p - f, f, p + f, pl * 2, (f + p) / 2], x => num(x, x % 1 ? 1 : 0) + ' cm');
}

/* --- Física: densidade / massa / volume --- */
function genDensidade() {
  const d = pick([0.8, 1.0, 2.7, 7.8, 13.6, 0.92]); // g/cm³
  const V = rint(2, 40) * 10;
  const m = d * V;
  const materiais = { 0.8: 'óleo', 1.0: 'água', 2.7: 'alumínio', 7.8: 'ferro', 13.6: 'mercúrio', 0.92: 'gelo' };
  const q = {
    area: 'natureza', materia: 'fisica', topico: 'Hidrostática', nivel: 'Médio', gerada: true,
    enunciado: `Uma amostra de ${materiais[d]} tem volume ${num(V)} cm³ e densidade ${num(d, d % 1 ? 2 : 1)} g/cm³. Qual é a sua massa?`,
    explicacao: `Densidade d = m/V, logo m = d·V = ${num(d, d % 1 ? 2 : 1)} × ${num(V)} = ${num(m, m % 1 ? 1 : 0)} g.`,
    dica: 'Relação-chave: densidade = massa ÷ volume. Isole a grandeza pedida.'
  };
  return build(q, m, [V / d, d + V, m * 2, m / 2, V], x => num(x, x % 1 ? 1 : 0) + ' g');
}

/* --- Biologia: genética (quadro de Punnett, proporções) --- */
function genGenetica() {
  const casos = [
    { cruz: 'Aa × Aa', pergunta: 'apresentem o fenótipo recessivo', frac: 1 / 4, expl: 'Aa × Aa gera 1 AA : 2 Aa : 1 aa. O fenótipo recessivo (aa) corresponde a 1/4 = 25%.' },
    { cruz: 'Aa × Aa', pergunta: 'apresentem o fenótipo dominante', frac: 3 / 4, expl: 'Aa × Aa gera 3/4 com pelo menos um alelo A (AA e Aa) → fenótipo dominante = 75%.' },
    { cruz: 'Aa × aa', pergunta: 'apresentem o fenótipo recessivo', frac: 1 / 2, expl: 'Aa × aa gera 1 Aa : 1 aa. O fenótipo recessivo (aa) corresponde a 1/2 = 50%.' },
    { cruz: 'AA × aa', pergunta: 'sejam heterozigotos', frac: 1, expl: 'AA × aa gera 100% Aa (heterozigotos). Toda a prole recebe um A e um a.' }
  ];
  const c = pick(casos);
  const pct = Math.round(c.frac * 100);
  const q = {
    area: 'natureza', materia: 'biologia', topico: 'Genética', nivel: 'Médio', gerada: true,
    enunciado: `No cruzamento ${c.cruz} (A domina a), qual a probabilidade de os descendentes ${c.pergunta}?`,
    explicacao: c.expl,
    dica: 'Monte o quadro de Punnett (2×2) e conte as proporções. Aa × Aa → 3:1.'
  };
  return build(q, pct, [25, 50, 75, 100, 0].filter(v => v !== pct), x => num(x) + '%', v => Math.round(v));
}

/* ---------- registro dos geradores e volumes ---------- */
const GERADORES = [
  [genPorcSucessiva, 42], [genPorcSimples, 34], [genRegraTres, 42], [genVertice, 30],
  [genFuncao1, 22], [genVolumeCilindro, 26], [genPitagoras, 28], [genProbabilidade, 32],
  [genEstatistica, 30], [genJurosSimples, 24], [genEscala, 18],
  [genConsumoKwh, 30], [genOndas, 28], [genQueda, 22], [genCalorimetria, 22],
  [genEstequiometria, 28], [genMols, 24], [genPh, 18],
  [genPA, 22], [genPG, 16], [genCombinatoria, 26], [genOptica, 18],
  [genDensidade, 20], [genGenetica, 20]
];

GERADORES.forEach(([gen, n]) => {
  let tentativas = 0, feitos = 0;
  const vistos = new Set();
  while (feitos < n && tentativas < n * 12) {
    tentativas++;
    const q = gen();
    const chave = q.enunciado;
    if (vistos.has(chave)) continue;      // evita enunciados idênticos
    if (q.correta < 0) continue;          // segurança
    vistos.add(chave);
    q.id = nid('g');
    OUT.push(q);
    feitos++;
  }
});

/* ============================================================
   SAÍDA
   ============================================================ */
const header = `/* ============================================================
   BANCO DE QUESTÕES — ${OUT.length} questões estilo ENEM.
   GERADO AUTOMATICAMENTE por build/generate-questions.js
   (NÃO edite à mão — rode o gerador novamente para atualizar).

   Composição:
   - Conceituais curadas (escritas à mão)  : ${CURADAS.length}
   - Quantitativas paramétricas (geradas)  : ${OUT.length - CURADAS.length}

   Temas e habilidades baseados em edições anteriores do
   ENEM/Inep, reescritos para fins educacionais.
   ============================================================ */
window.ENEM_QUESTIONS = `;
const body = JSON.stringify(OUT, null, 1);
fs.writeFileSync(path.join(__dirname, '..', 'js', 'data', 'questions.js'), header + body + ';\n', 'utf8');

// relatório por área
const porArea = {};
OUT.forEach(q => { porArea[q.area] = (porArea[q.area] || 0) + 1; });
console.log(`Total de questões: ${OUT.length}`);
console.log('Por área:', porArea);
console.log(`Curadas: ${CURADAS.length} · Geradas: ${OUT.length - CURADAS.length}`);
