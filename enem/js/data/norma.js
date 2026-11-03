/* ============================================================
   TREINADOR DE NORMA PADRÃO — exercícios.
   Regras conforme o Acordo Ortográfico (obrigatório desde 2016)
   e a gramática normativa usada na correção do ENEM (C1).
   Tipos: "digitar" (escreva a forma correta) e "multipla".
   ============================================================ */
window.ENEM_NORMA = {
  categorias: {
    acentuacao: "Acentuação", crase: "Crase", completar: "Complete a frase",
    concordancia: "Concordância", regencia: "Regência", pontuacao: "Pontuação", ortografia: "Ortografia"
  },

  // Resumo das regras (cola rápida)
  regras: [
    { cat: "acentuacao", titulo: "Proparoxítonas", texto: "TODAS são acentuadas: lâmpada, médico, público, ônibus." },
    { cat: "acentuacao", titulo: "Oxítonas", texto: "Acentue as terminadas em A(s), E(s), O(s), EM, ENS: sofá, café, avô, também, parabéns." },
    { cat: "acentuacao", titulo: "Paroxítonas", texto: "Acentue as terminadas em L, N, R, X, PS, Ã(s), ÃO(s), I(s), US, UM(uns), ON(s) e ditongo: fácil, hífen, açúcar, tórax, bíceps, órfã, órgão, júri, vírus, álbum, história." },
    { cat: "acentuacao", titulo: "Monossílabos tônicos", texto: "Acentue os terminados em A(s), E(s), O(s): pá, pé, pó, três, nós." },
    { cat: "acentuacao", titulo: "Hiato com I e U", texto: "I e U tônicos sozinhos na sílaba (ou com S) levam acento: saída, saúde, baú, juíza. Exceção: antes de NH (rainha) e após ditongo em paroxítona (feiura)." },
    { cat: "acentuacao", titulo: "O que o Acordo tirou", texto: "Ditongo aberto em paroxítona: ideia, assembleia, heroico, jiboia. Hiato OO/EE: voo, enjoo, creem, leem, veem. Trema: linguiça, frequente. Diferenciais: para (verbo), pelo, polo." },
    { cat: "acentuacao", titulo: "O que ficou", texto: "Oxítonas com ditongo aberto: herói, papéis, anéis. Diferenciais: pôr (verbo) × por, pôde (passado) × pode, têm/vêm (plural) × tem/vem." },
    { cat: "crase", titulo: "Quando usar", texto: "Crase = preposição A + artigo A. Teste: troque por uma palavra masculina — se virar 'AO', há crase: 'Fui à escola' → 'Fui ao colégio'." },
    { cat: "crase", titulo: "Nunca use", texto: "Antes de palavra masculina, verbo, pronome pessoal e de tratamento (exceto senhora/dona), 'uma' e palavras no plural com 'a' singular: 'a pé', 'a partir de', 'a ela', 'a uma', 'a reuniões'." },
    { cat: "crase", titulo: "Sempre use", texto: "Horas (às 8h), locuções femininas (às vezes, à noite, à medida que, à custa de) e 'à moda de' (bife à milanesa)." },
    { cat: "crase", titulo: "Cidades e 'casa'", texto: "'Volto DA' → crase; 'volto DE' → sem crase: vou à Bahia (volto da Bahia), vou a Brasília (volto de Brasília). 'Casa' (o próprio lar) sem determinante: voltei a casa." },
    { cat: "concordancia", titulo: "É necessário / é necessária", texto: "Sem determinante, fica no masculino: 'É necessário paciência'. Com determinante, concorda: 'É necessária a paciência', 'São necessárias medidas'. Vale para proibido, permitido, bom." },
    { cat: "concordancia", titulo: "Haver e fazer impessoais", texto: "'Haver' = existir e 'fazer' = tempo ficam no singular: 'Houve problemas', 'Faz dois anos'. Mas 'existir' concorda: 'Existem problemas'." },
    { cat: "regencia", titulo: "Verbos que pedem 'a'", texto: "Assistir (ver) a, obedecer a, aspirar (desejar) a, chegar a, ir a, preferir X a Y (sem 'do que')." },
    { cat: "pontuacao", titulo: "Vírgulas da redação", texto: "Nunca separe sujeito e verbo. Isole o adjunto adverbial longo deslocado ('Na sociedade atual, …'), o aposto, o vocativo e as orações adjetivas explicativas." }
  ],

  exercicios: [
    /* -------- ACENTUAÇÃO (digitar) -------- */
    { cat: "acentuacao", tipo: "digitar", nivel: "Fácil", pergunta: "Acentue: \"Voce precisa estudar.\" → escreva a palavra correta:", palavra: "voce", resposta: "você", explicacao: "Oxítona terminada em E → acento: você." },
    { cat: "acentuacao", tipo: "digitar", nivel: "Fácil", pergunta: "Acentue: \"Isso tambem é importante.\"", palavra: "tambem", resposta: "também", explicacao: "Oxítona terminada em EM → acento: também." },
    { cat: "acentuacao", tipo: "digitar", nivel: "Fácil", pergunta: "Acentue: \"A saude é um direito de todos.\"", palavra: "saude", resposta: "saúde", explicacao: "Hiato: o U tônico fica sozinho na sílaba (sa-ú-de) → acento." },
    { cat: "acentuacao", tipo: "digitar", nivel: "Médio", pergunta: "Acentue: \"O pais (nação) precisa investir em educação.\"", palavra: "pais", resposta: "país", explicacao: "Hiato com I tônico (pa-ís) → acento. Sem acento, 'pais' é o plural de pai." },
    { cat: "acentuacao", tipo: "digitar", nivel: "Fácil", pergunta: "Acentue: \"A historia do Brasil é longa.\"", palavra: "historia", resposta: "história", explicacao: "Paroxítona terminada em ditongo crescente (-ia) → acento." },
    { cat: "acentuacao", tipo: "digitar", nivel: "Fácil", pergunta: "Acentue: \"Não é facil mudar.\"", palavra: "facil", resposta: "fácil", explicacao: "Paroxítona terminada em L → acento." },
    { cat: "acentuacao", tipo: "digitar", nivel: "Médio", pergunta: "Acentue: \"O orgao público responsável…\"", palavra: "orgao", resposta: "órgão", explicacao: "Paroxítona terminada em ÃO → acento agudo no O (ór-gão), além do til." },
    { cat: "acentuacao", tipo: "digitar", nivel: "Médio", pergunta: "Acentue: \"Ele comprou acucar.\"", palavra: "acucar", resposta: "açúcar", explicacao: "Paroxítona terminada em R → acento (a-çú-car); leva cedilha também." },
    { cat: "acentuacao", tipo: "digitar", nivel: "Fácil", pergunta: "Acentue: \"O medico atendeu a população.\"", palavra: "medico", resposta: "médico", explicacao: "Proparoxítona → todas são acentuadas." },
    { cat: "acentuacao", tipo: "digitar", nivel: "Médio", pergunta: "Acentue: \"Ninguem ficou de fora.\"", palavra: "ninguem", resposta: "ninguém", explicacao: "Oxítona terminada em EM → acento." },
    { cat: "acentuacao", tipo: "digitar", nivel: "Médio", pergunta: "Acentue: \"O virus se espalhou.\"", palavra: "virus", resposta: "vírus", explicacao: "Paroxítona terminada em US → acento." },
    { cat: "acentuacao", tipo: "digitar", nivel: "Difícil", pergunta: "Corrija pelo Acordo Ortográfico: \"Tive uma idéia.\"", palavra: "idéia", resposta: "ideia", explicacao: "O Acordo tirou o acento do ditongo aberto 'ei' nas paroxítonas: ideia." },
    { cat: "acentuacao", tipo: "digitar", nivel: "Difícil", pergunta: "Corrija pelo Acordo Ortográfico: \"O vôo atrasou.\"", palavra: "vôo", resposta: "voo", explicacao: "O hiato 'oo' perdeu o acento: voo, enjoo." },
    { cat: "acentuacao", tipo: "digitar", nivel: "Difícil", pergunta: "Corrija pelo Acordo Ortográfico: \"Foi um ato heróico.\"", palavra: "heróico", resposta: "heroico", explicacao: "Paroxítona com ditongo aberto 'oi' perdeu o acento: heroico. (Herói, oxítona, mantém.)" },
    { cat: "acentuacao", tipo: "digitar", nivel: "Difícil", pergunta: "Plural de 'ele tem': \"Eles ___ direitos.\" (verbo ter)", palavra: "tem", resposta: "têm", explicacao: "Acento diferencial de número: ele tem / eles têm." },

    /* -------- ACENTUAÇÃO (múltipla) -------- */
    { cat: "acentuacao", tipo: "multipla", nivel: "Médio", pergunta: "Qual palavra é acentuada pela MESMA regra de 'fácil'?", alternativas: ["café", "lâmpada", "útil", "saúde", "você"], correta: 2, explicacao: "'Fácil' e 'útil' são paroxítonas terminadas em L. Café/você: oxítonas; lâmpada: proparoxítona; saúde: hiato." },
    { cat: "acentuacao", tipo: "multipla", nivel: "Médio", pergunta: "Qual palavra está ERRADA segundo o Acordo Ortográfico?", alternativas: ["herói", "assembléia", "papéis", "ideia", "voo"], correta: 1, explicacao: "Paroxítonas com ditongo aberto perderam o acento: assembleia. Herói e papéis são oxítonas e mantêm o acento." },
    { cat: "acentuacao", tipo: "multipla", nivel: "Fácil", pergunta: "Qual dessas palavras é proparoxítona (e por isso acentuada)?", alternativas: ["público", "também", "saída", "fácil", "café"], correta: 0, explicacao: "Pú-bli-co: tônica na antepenúltima sílaba → proparoxítona, sempre acentuada." },
    { cat: "acentuacao", tipo: "multipla", nivel: "Difícil", pergunta: "Em qual frase o acento diferencial está correto?", alternativas: ["Ele pôde sair ontem e hoje não pode.", "Vou pára de estudar.", "Eles vem amanhã.", "Ele têm razão.", "Quero por o livro na mesa."], correta: 0, explicacao: "'Pôde' (passado) × 'pode' (presente) mantém o acento. 'Para' (verbo) perdeu o acento; 'eles vêm' e 'ele tem' estão trocados; 'pôr' (verbo) leva acento." },
    { cat: "acentuacao", tipo: "multipla", nivel: "Difícil", pergunta: "Qual palavra NÃO leva acento?", alternativas: ["rainha", "saída", "juíza", "baú", "país"], correta: 0, explicacao: "I tônico seguido de NH não é acentuado: ra-i-nha. As outras são hiatos acentuados." },

    /* -------- CRASE -------- */
    { cat: "crase", tipo: "multipla", nivel: "Fácil", pergunta: "Complete: \"Fui ___ escola ontem.\"", alternativas: ["a", "à", "há", "ah"], correta: 1, explicacao: "Ir a + a escola = à escola. Teste: 'Fui ao colégio' → há crase." },
    { cat: "crase", tipo: "multipla", nivel: "Fácil", pergunta: "Complete: \"Começou ___ chover.\"", alternativas: ["à", "a", "há", "ás"], correta: 1, explicacao: "Antes de verbo nunca há crase: começou a chover." },
    { cat: "crase", tipo: "multipla", nivel: "Médio", pergunta: "Complete: \"A reunião será ___ 14h.\"", alternativas: ["as", "às", "há", "a"], correta: 1, explicacao: "Horas determinadas levam crase: às 14h." },
    { cat: "crase", tipo: "multipla", nivel: "Médio", pergunta: "Em qual frase a crase está correta?", alternativas: ["Andou à pé.", "Entregou o prêmio à ela.", "Referiu-se à uma aluna.", "Chegou à noite.", "Começou à estudar."], correta: 3, explicacao: "'À noite' é locução adverbial feminina → crase. Não há crase antes de masculino (pé), pronome pessoal (ela), 'uma' e verbo." },
    { cat: "crase", tipo: "multipla", nivel: "Difícil", pergunta: "Complete: \"Vou ___ Brasília e depois ___ Bahia.\"", alternativas: ["à / à", "a / a", "a / à", "à / a"], correta: 2, explicacao: "Volto DE Brasília → sem crase (vou a Brasília). Volto DA Bahia → crase (vou à Bahia)." },
    { cat: "crase", tipo: "multipla", nivel: "Médio", pergunta: "Complete: \"O governo deve garantir acesso ___ saúde e ___ educação.\"", alternativas: ["a / a", "à / à", "à / a", "há / há"], correta: 1, explicacao: "Acesso A + A saúde = à saúde; acesso A + A educação = à educação. Teste: 'acesso ao lazer'." },
    { cat: "crase", tipo: "multipla", nivel: "Difícil", pergunta: "Qual frase está correta?", alternativas: ["Daqui à duas horas.", "Ficou frente à frente.", "Comeu bife à milanesa.", "Fez referência à reuniões.", "Dirigiu-se à Vossa Excelência."], correta: 2, explicacao: "'À milanesa' = à moda milanesa → crase. Não há crase em 'a duas horas' (futuro), 'frente a frente' (palavras repetidas), 'a reuniões' (a singular + plural) nem antes de pronome de tratamento." },

    /* -------- COMPLETE A FRASE -------- */
    { cat: "completar", tipo: "multipla", nivel: "Fácil", pergunta: "Complete: \"___ dois anos que estudo para o ENEM.\"", alternativas: ["Fazem", "Faz", "Fazia-se", "Fizeram"], correta: 1, explicacao: "'Fazer' indicando tempo é impessoal: fica no singular — Faz dois anos." },
    { cat: "completar", tipo: "multipla", nivel: "Fácil", pergunta: "Complete: \"___ muitos problemas na reunião.\"", alternativas: ["Houveram", "Houve", "Haviam", "Hão"], correta: 1, explicacao: "'Haver' no sentido de existir é impessoal: Houve muitos problemas." },
    { cat: "completar", tipo: "multipla", nivel: "Médio", pergunta: "Complete: \"Não sei ___ ele faltou.\"", alternativas: ["porque", "por que", "porquê", "por quê"], correta: 1, explicacao: "Interrogativa indireta (= por qual motivo) → 'por que', separado e sem acento." },
    { cat: "completar", tipo: "multipla", nivel: "Médio", pergunta: "Complete: \"Ele faltou ___ estava doente.\"", alternativas: ["por que", "porque", "porquê", "por quê"], correta: 1, explicacao: "Explicação/causa (= pois) → 'porque', junto e sem acento." },
    { cat: "completar", tipo: "multipla", nivel: "Médio", pergunta: "Complete: \"Ninguém explicou o ___ da decisão.\"", alternativas: ["porque", "por que", "porquê", "por quê"], correta: 2, explicacao: "Substantivo (o motivo), precedido de artigo → 'porquê', junto e com acento." },
    { cat: "completar", tipo: "multipla", nivel: "Médio", pergunta: "Complete: \"Ele chegou, mas não disse ___.\"", alternativas: ["porque", "por que", "porquê", "por quê"], correta: 3, explicacao: "No fim da frase, antes de pontuação → 'por quê', separado e com acento." },
    { cat: "completar", tipo: "multipla", nivel: "Fácil", pergunta: "Complete: \"Ele é um ___ aluno, pois se comporta ___.\"", alternativas: ["mal / mau", "mau / mal", "mau / mau", "mal / mal"], correta: 1, explicacao: "Mau é adjetivo (oposto de bom): mau aluno. Mal é advérbio (oposto de bem): comporta-se mal." },
    { cat: "completar", tipo: "multipla", nivel: "Médio", pergunta: "Complete: \"Estudo aqui ___ três anos e volto daqui ___ dois dias.\"", alternativas: ["a / há", "há / a", "há / há", "a / a"], correta: 1, explicacao: "'Há' indica tempo passado (= faz); 'a' indica tempo futuro ou distância." },
    { cat: "completar", tipo: "multipla", nivel: "Médio", pergunta: "Complete: \"___ você vai com tanta pressa?\"", alternativas: ["Onde", "Aonde", "Donde", "Em onde"], correta: 1, explicacao: "Com verbos de movimento (ir a), usa-se 'aonde'. 'Onde' indica lugar fixo (onde você mora?)." },
    { cat: "completar", tipo: "multipla", nivel: "Difícil", pergunta: "Complete: \"Estude, ___ não passará.\"", alternativas: ["se não", "senão", "sim não", "sem não"], correta: 1, explicacao: "'Senão' = caso contrário. 'Se não' = caso não (ex.: 'Se não estudar, não passará')." },
    { cat: "completar", tipo: "multipla", nivel: "Médio", pergunta: "Complete: \"Ele estudou, ___ não foi bem; quer estudar ___.\"", alternativas: ["mais / mas", "mas / mais", "mas / mas", "mais / mais"], correta: 1, explicacao: "'Mas' indica oposição (= porém); 'mais' indica quantidade (oposto de menos)." },
    { cat: "completar", tipo: "multipla", nivel: "Difícil", pergunta: "Complete: \"___ de criticar, proponha uma solução.\"", alternativas: ["Ao invés", "Em vez", "A vez", "Em invés"], correta: 1, explicacao: "'Em vez de' = no lugar de. 'Ao invés de' significa 'ao contrário de' (só para opostos: subiu ao invés de descer)." },

    /* -------- CONCORDÂNCIA -------- */
    { cat: "concordancia", tipo: "multipla", nivel: "Médio", pergunta: "Qual frase está correta?", alternativas: ["É proibido a entrada de animais.", "É necessário a participação de todos.", "É necessária a participação de todos.", "São necessário mais investimentos."], correta: 2, explicacao: "Com determinante (a participação), o adjetivo concorda: necessária. Sem determinante, fica no masculino: 'É necessário paciência'." },
    { cat: "concordancia", tipo: "multipla", nivel: "Médio", pergunta: "Complete: \"___ medidas urgentes para combater a fome.\"", alternativas: ["É necessário", "É necessária", "São necessárias", "São necessário"], correta: 2, explicacao: "Substantivo no plural (medidas) → verbo e adjetivo no plural: São necessárias medidas." },
    { cat: "concordancia", tipo: "multipla", nivel: "Fácil", pergunta: "Complete: \"Seguem ___ os documentos.\"", alternativas: ["anexo", "anexos", "anexa", "em anexos"], correta: 1, explicacao: "'Anexo' é adjetivo e concorda com o substantivo: anexos os documentos (anexas as fotos). 'Em anexo' é invariável." },
    { cat: "concordancia", tipo: "multipla", nivel: "Médio", pergunta: "Complete: \"Ela ficou ___ preocupada.\"", alternativas: ["meia", "meio", "meios", "meias"], correta: 1, explicacao: "'Meio' com sentido de 'um pouco' é advérbio e não varia: meio preocupada." },
    { cat: "concordancia", tipo: "multipla", nivel: "Médio", pergunta: "Complete: \"Havia ___ pessoas na fila.\"", alternativas: ["bastante", "bastantes", "bastanta", "bastantas"], correta: 1, explicacao: "'Bastante' com sentido de 'muitos' (adjetivo) varia: bastantes pessoas. Como advérbio (estudou bastante), não varia." },
    { cat: "concordancia", tipo: "multipla", nivel: "Fácil", pergunta: "Complete: \"___ vários motivos para isso.\"", alternativas: ["Existe", "Existem", "Há-se", "Houveram"], correta: 1, explicacao: "'Existir' é pessoal e concorda com o sujeito (vários motivos): Existem." },

    /* -------- REGÊNCIA -------- */
    { cat: "regencia", tipo: "multipla", nivel: "Médio", pergunta: "Qual frase segue a norma padrão?", alternativas: ["Assisti o filme.", "Assisti ao filme.", "Assisti no filme.", "Assisti pelo filme."], correta: 1, explicacao: "'Assistir' no sentido de ver pede a preposição 'a': assisti ao filme." },
    { cat: "regencia", tipo: "multipla", nivel: "Médio", pergunta: "Complete: \"Prefiro estudar ___ jogar.\"", alternativas: ["do que", "a", "que", "mais que"], correta: 1, explicacao: "'Preferir' pede 'a': prefiro isto A aquilo. Evite 'prefiro mais' e 'do que'." },
    { cat: "regencia", tipo: "multipla", nivel: "Médio", pergunta: "Qual frase está correta?", alternativas: ["A medida implica em gastos.", "A medida implica gastos.", "A medida implica a gastos.", "A medida implica de gastos."], correta: 1, explicacao: "'Implicar' (acarretar) é transitivo direto: implica gastos." },
    { cat: "regencia", tipo: "multipla", nivel: "Fácil", pergunta: "Qual frase está correta?", alternativas: ["Cheguei na escola cedo.", "Cheguei à escola cedo.", "Cheguei a escola cedo.", "Cheguei em a escola cedo."], correta: 1, explicacao: "'Chegar' pede a preposição 'a': chegar A + A escola = à escola." },
    { cat: "regencia", tipo: "multipla", nivel: "Médio", pergunta: "Complete: \"Os motoristas devem obedecer ___ sinalização.\"", alternativas: ["a", "à", "na", "da"], correta: 1, explicacao: "'Obedecer' pede 'a': obedecer A + A sinalização = à sinalização." },

    /* -------- PONTUAÇÃO -------- */
    { cat: "pontuacao", tipo: "multipla", nivel: "Médio", pergunta: "Qual frase está pontuada corretamente?", alternativas: ["Os jovens brasileiros, enfrentam a ansiedade.", "Na sociedade contemporânea os jovens enfrentam a ansiedade.", "Na sociedade contemporânea, os jovens enfrentam a ansiedade.", "Na sociedade, contemporânea os jovens enfrentam a ansiedade."], correta: 2, explicacao: "O adjunto adverbial longo deslocado para o início deve ser isolado por vírgula. Nunca separe sujeito (os jovens brasileiros) e verbo (enfrentam)." },
    { cat: "pontuacao", tipo: "multipla", nivel: "Médio", pergunta: "Em qual frase a vírgula é OBRIGATÓRIA e está correta?", alternativas: ["Paulo Freire, educador brasileiro, defendia a educação libertadora.", "O governo, deve investir em educação.", "A educação é, importante.", "Os alunos que estudaram, passaram."], correta: 0, explicacao: "O aposto explicativo ('educador brasileiro') vem entre vírgulas. Nas outras, a vírgula separa termos que não podem ser separados." },
    { cat: "pontuacao", tipo: "multipla", nivel: "Difícil", pergunta: "Qual frase indica que TODOS os alunos estudaram?", alternativas: ["Os alunos que estudaram passaram.", "Os alunos, que estudaram, passaram.", "Os alunos que, estudaram passaram.", "Os alunos que estudaram passaram, todos."], correta: 1, explicacao: "Com vírgulas, a oração adjetiva é explicativa (todos estudaram). Sem vírgulas, é restritiva (só os que estudaram passaram)." },

    /* -------- ORTOGRAFIA -------- */
    { cat: "ortografia", tipo: "multipla", nivel: "Fácil", pergunta: "Qual é a grafia correta?", alternativas: ["concerteza", "com certeza", "comcerteza", "com serteza"], correta: 1, explicacao: "'Com certeza' é locução: duas palavras." },
    { cat: "ortografia", tipo: "multipla", nivel: "Fácil", pergunta: "Qual é a grafia correta?", alternativas: ["apartir de", "à partir de", "a partir de", "apartír de"], correta: 2, explicacao: "'A partir de': separado e sem crase (antes de verbo não há crase)." },
    { cat: "ortografia", tipo: "multipla", nivel: "Médio", pergunta: "Qual palavra está escrita corretamente?", alternativas: ["excessão", "exceção", "esceção", "exeção"], correta: 1, explicacao: "Exceção (do verbo excetuar) — com 'c' e cedilha." },
    { cat: "ortografia", tipo: "multipla", nivel: "Médio", pergunta: "Qual palavra está escrita corretamente?", alternativas: ["previlégio", "privilégio", "privilégeo", "previlégeo"], correta: 1, explicacao: "Privilégio: pri-vi-lé-gio." },
    { cat: "ortografia", tipo: "multipla", nivel: "Médio", pergunta: "Qual alternativa está correta?", alternativas: ["Vou a fim de passar no ENEM.", "Vou afim de passar no ENEM.", "Vou à fim de passar no ENEM.", "Vou a fins de passar no ENEM."], correta: 0, explicacao: "'A fim de' (separado) indica finalidade — muito usado na proposta de intervenção! 'Afim' significa semelhante." },
    { cat: "ortografia", tipo: "multipla", nivel: "Difícil", pergunta: "Qual palavra está escrita corretamente?", alternativas: ["reinvindicar", "reivindicar", "reinvidicar", "reivindiscar"], correta: 1, explicacao: "Reivindicar: rei-vin-di-car (sem 'n' depois do 'rei')." },
    { cat: "ortografia", tipo: "multipla", nivel: "Médio", pergunta: "Qual palavra está escrita corretamente?", alternativas: ["impecilho", "empecilho", "empencilho", "inpecilho"], correta: 1, explicacao: "Empecilho, com 'e' inicial." }
  ]
};
