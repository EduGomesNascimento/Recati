/* ============================================================
   DICIONÁRIO DE VOCABULÁRIO FORMAL PARA A REDAÇÃO
   Palavras formais e claras, com grafia do Acordo Ortográfico
   vigente. "moderacao: true" = palavra correta, mas rebuscada:
   use no máximo uma vez, só quando soar natural.
   Lembre: clareza vale mais que palavra difícil (C1 e C3).
   ============================================================ */
window.ENEM_VOCABULARIO = {
  categorias: {
    verbo: "Verbos", substantivo: "Substantivos", adjetivo: "Adjetivos",
    expressao: "Expressões e conectivos", troca: "Troque o informal", paronimo: "Não confunda"
  },
  aviso: "Vocabulário formal ajuda, mas o corretor premia clareza. Use as palavras abaixo quando souber o sentido exato; as marcadas com ⚠️ são corretas porém rebuscadas — no máximo uma por texto.",
  palavras: [
    /* ---------------- VERBOS ---------------- */
    { cat: "verbo", p: "mitigar", sig: "amenizar, reduzir os efeitos de algo", troca: "diminuir", ex: "É preciso mitigar os efeitos das enchentes nas periferias." },
    { cat: "verbo", p: "fomentar", sig: "estimular, incentivar, promover", troca: "incentivar", ex: "O Estado deve fomentar a leitura nas escolas públicas." },
    { cat: "verbo", p: "corroborar", sig: "confirmar, reforçar com provas", troca: "confirmar", ex: "Os dados do IBGE corroboram essa tese." },
    { cat: "verbo", p: "evidenciar", sig: "mostrar com clareza, tornar evidente", troca: "mostrar", ex: "O Censo 2022 evidencia o envelhecimento da população." },
    { cat: "verbo", p: "salientar", sig: "destacar, ressaltar", troca: "destacar", ex: "Cabe salientar o papel da escola nesse processo." },
    { cat: "verbo", p: "perpetuar", sig: "fazer durar, manter por muito tempo", troca: "manter", ex: "A omissão estatal perpetua a desigualdade." },
    { cat: "verbo", p: "acarretar", sig: "causar, trazer como consequência (transitivo direto: 'acarreta prejuízos')", troca: "causar", ex: "O desmatamento acarreta graves prejuízos ao clima." },
    { cat: "verbo", p: "coibir", sig: "reprimir, impedir que aconteça", troca: "impedir", ex: "A fiscalização deve coibir o trabalho infantil." },
    { cat: "verbo", p: "erradicar", sig: "eliminar pela raiz, acabar completamente", troca: "acabar com", ex: "O objetivo é erradicar o analfabetismo." },
    { cat: "verbo", p: "viabilizar", sig: "tornar possível", troca: "possibilitar", ex: "Parcerias podem viabilizar o acesso à internet no campo." },
    { cat: "verbo", p: "assegurar", sig: "garantir", troca: "garantir", ex: "A Constituição assegura o direito à saúde." },
    { cat: "verbo", p: "democratizar", sig: "tornar acessível a todos", troca: "liberar para todos", ex: "É necessário democratizar o acesso à cultura." },
    { cat: "verbo", p: "implementar", sig: "pôr em prática, executar", troca: "fazer", ex: "O governo deve implementar políticas de inclusão digital." },
    { cat: "verbo", p: "negligenciar", sig: "descuidar, tratar com desatenção", troca: "ignorar", ex: "O poder público negligencia a saúde mental dos jovens." },
    { cat: "verbo", p: "marginalizar", sig: "excluir, pôr à margem da sociedade", troca: "excluir", ex: "O preconceito marginaliza a população idosa." },
    { cat: "verbo", p: "potencializar", sig: "intensificar, aumentar a força de algo", troca: "aumentar", ex: "Os algoritmos potencializam a desinformação." },
    { cat: "verbo", p: "elucidar", sig: "esclarecer, explicar", troca: "explicar", ex: "O pensamento de Bauman elucida a fragilidade dos laços atuais." },
    { cat: "verbo", p: "dirimir", sig: "resolver, eliminar (dúvidas ou conflitos)", troca: "resolver", ex: "Campanhas podem dirimir dúvidas sobre as vacinas." },
    { cat: "verbo", p: "suscitar", sig: "provocar, despertar", troca: "provocar", ex: "O tema suscita intensos debates." },
    { cat: "verbo", p: "preconizar", sig: "recomendar, defender como ideal", troca: "defender", ex: "A Constituição preconiza a dignidade da pessoa humana." },
    { cat: "verbo", p: "angariar", sig: "reunir, obter (recursos, apoio)", troca: "conseguir", ex: "ONGs angariam recursos para os desabrigados." },
    { cat: "verbo", p: "endossar", sig: "apoiar, concordar com", troca: "apoiar", ex: "Especialistas endossam a regulação das plataformas." },
    { cat: "verbo", p: "ensejar", sig: "dar ocasião a, causar", troca: "causar", ex: "A impunidade enseja novos crimes.", moderacao: true },
    { cat: "verbo", p: "obstar", sig: "impedir, criar obstáculo", troca: "impedir", ex: "A burocracia obsta o acesso aos direitos.", moderacao: true },

    /* ---------------- SUBSTANTIVOS ---------------- */
    { cat: "substantivo", p: "conjuntura", sig: "situação, contexto em determinado momento", troca: "situação", ex: "Na conjuntura atual, a crise climática é urgente." },
    { cat: "substantivo", p: "entrave", sig: "obstáculo, impedimento", troca: "problema", ex: "A falta de verbas é o principal entrave." },
    { cat: "substantivo", p: "mazela", sig: "problema social grave, mal", troca: "problema", ex: "A fome é uma das mazelas históricas do país." },
    { cat: "substantivo", p: "percalço", sig: "dificuldade, contratempo", troca: "dificuldade", ex: "Os percalços do ensino remoto atingiram os mais pobres." },
    { cat: "substantivo", p: "premissa", sig: "ideia que serve de ponto de partida a um raciocínio", troca: "ideia inicial", ex: "Parte-se da premissa de que educar é emancipar." },
    { cat: "substantivo", p: "paradigma", sig: "modelo, padrão de pensamento", troca: "modelo", ex: "É preciso romper com o paradigma do automóvel." },
    { cat: "substantivo", p: "falácia", sig: "argumento enganoso, ideia falsa que parece verdadeira", troca: "mentira", ex: "A meritocracia pura é uma falácia num país desigual." },
    { cat: "substantivo", p: "cerne", sig: "núcleo, ponto central", troca: "centro", ex: "O cerne da questão é a desigualdade de acesso." },
    { cat: "substantivo", p: "prerrogativa", sig: "direito ou poder exclusivo de um cargo ou função", troca: "direito", ex: "Fiscalizar é prerrogativa do poder público." },
    { cat: "substantivo", p: "primazia", sig: "prioridade, posição de destaque", troca: "prioridade", ex: "A criança deve ter primazia nas políticas públicas." },
    { cat: "substantivo", p: "equidade", sig: "justiça que considera as diferenças (tratar desigualmente os desiguais)", troca: "justiça", ex: "As cotas buscam a equidade no ensino superior." },
    { cat: "substantivo", p: "abrangência", sig: "alcance, amplitude", troca: "alcance", ex: "A campanha deve ter abrangência nacional." },
    { cat: "substantivo", p: "omissão", sig: "ausência de ação quando se deveria agir", troca: "falta de ação", ex: "A omissão do Estado agrava o problema." },
    { cat: "substantivo", p: "estigma", sig: "marca negativa, rótulo preconceituoso", troca: "preconceito", ex: "O estigma afasta pessoas do tratamento psicológico." },
    { cat: "substantivo", p: "precarização", sig: "piora das condições (de trabalho, de vida)", troca: "piora", ex: "A uberização expressa a precarização do trabalho." },
    { cat: "substantivo", p: "iniquidade", sig: "injustiça grave", troca: "injustiça", ex: "A fome num país produtor de alimentos é uma iniquidade." },
    { cat: "substantivo", p: "anacronismo", sig: "algo fora do seu tempo, ultrapassado", troca: "atraso", ex: "O trabalho escravo é um anacronismo inaceitável." },
    { cat: "substantivo", p: "celeuma", sig: "polêmica, discussão acalorada (palavra feminina: a celeuma)", troca: "polêmica", ex: "A regulação das redes gerou grande celeuma.", moderacao: true },
    { cat: "substantivo", p: "óbice", sig: "obstáculo, impedimento", troca: "obstáculo", ex: "A distância é um óbice ao acesso à saúde.", moderacao: true },

    /* ---------------- ADJETIVOS ---------------- */
    { cat: "adjetivo", p: "imprescindível", sig: "indispensável, que não se pode dispensar", troca: "muito importante", ex: "É imprescindível investir em saneamento." },
    { cat: "adjetivo", p: "premente", sig: "urgente, que exige solução imediata", troca: "urgente", ex: "A crise climática é uma questão premente." },
    { cat: "adjetivo", p: "latente", sig: "oculto, presente mas ainda não manifesto", troca: "escondido", ex: "O racismo latente se revela nas oportunidades desiguais." },
    { cat: "adjetivo", p: "exequível", sig: "possível de executar, viável", troca: "possível", ex: "A proposta deve ser exequível e detalhada." },
    { cat: "adjetivo", p: "ineficaz", sig: "que não produz o efeito desejado", troca: "que não funciona", ex: "A fiscalização tem se mostrado ineficaz." },
    { cat: "adjetivo", p: "intrínseco", sig: "essencial, que faz parte da natureza de algo", troca: "próprio", ex: "A dignidade é intrínseca a todo ser humano." },
    { cat: "adjetivo", p: "recorrente", sig: "que se repete com frequência", troca: "frequente", ex: "Enchentes recorrentes atingem as mesmas comunidades." },
    { cat: "adjetivo", p: "vigente", sig: "em vigor, válido no momento", troca: "atual", ex: "A legislação vigente não regula a inteligência artificial." },
    { cat: "adjetivo", p: "contundente", sig: "forte, convincente, incisivo", troca: "forte", ex: "Os dados são uma prova contundente do problema." },
    { cat: "adjetivo", p: "emblemático", sig: "simbólico, representativo", troca: "simbólico", ex: "O caso é emblemático da violência de gênero." },
    { cat: "adjetivo", p: "deletério", sig: "nocivo, prejudicial", troca: "prejudicial", ex: "O uso excessivo de telas tem efeitos deletérios." },
    { cat: "adjetivo", p: "arraigado", sig: "enraizado, profundamente fixado", troca: "enraizado", ex: "O machismo está arraigado na cultura." },
    { cat: "adjetivo", p: "notório", sig: "conhecido por todos, evidente", troca: "conhecido", ex: "É notório o abandono do sistema prisional." },
    { cat: "adjetivo", p: "indissociável", sig: "inseparável", troca: "inseparável", ex: "Saúde e saneamento são indissociáveis." },
    { cat: "adjetivo", p: "profícuo", sig: "proveitoso, útil, produtivo", troca: "útil", ex: "O diálogo entre escola e família é profícuo." },
    { cat: "adjetivo", p: "inexorável", sig: "inevitável, que não se pode deter", troca: "inevitável", ex: "O envelhecimento populacional é inexorável.", moderacao: true },

    /* ---------------- EXPRESSÕES E CONECTIVOS ---------------- */
    { cat: "expressao", p: "sob essa ótica", sig: "desse ponto de vista", troca: "nesse sentido", ex: "Sob essa ótica, a educação é a chave do problema." },
    { cat: "expressao", p: "à luz de", sig: "com base em, segundo (leva crase)", troca: "segundo", ex: "À luz da Constituição, a saúde é direito de todos." },
    { cat: "expressao", p: "no que tange a", sig: "no que diz respeito a (com feminino: 'no que tange à')", troca: "sobre", ex: "No que tange à educação, os avanços são lentos." },
    { cat: "expressao", p: "em detrimento de", sig: "em prejuízo de", troca: "prejudicando", ex: "O lucro é priorizado em detrimento do meio ambiente." },
    { cat: "expressao", p: "a despeito de", sig: "apesar de", troca: "apesar de", ex: "A despeito das leis, a violência persiste." },
    { cat: "expressao", p: "haja vista", sig: "considerando, tendo em vista (fica invariável)", troca: "já que", ex: "O tema é urgente, haja vista os dados de feminicídio." },
    { cat: "expressao", p: "em contrapartida", sig: "por outro lado", troca: "mas", ex: "Em contrapartida, as periferias seguem sem saneamento." },
    { cat: "expressao", p: "consoante", sig: "conforme, segundo", troca: "conforme", ex: "Consoante o Estatuto da Pessoa Idosa (art. 96), discriminar a pessoa idosa é crime." },
    { cat: "expressao", p: "outrossim", sig: "além disso, igualmente", troca: "além disso", ex: "Outrossim, a mídia deve conscientizar a população." },
    { cat: "expressao", p: "destarte", sig: "dessa forma, assim (também se escreve 'dessarte')", troca: "assim", ex: "Destarte, a desigualdade se perpetua.", moderacao: true },
    { cat: "expressao", p: "mormente", sig: "principalmente, sobretudo", troca: "principalmente", ex: "A crise atinge, mormente, os mais pobres.", moderacao: true },
    { cat: "expressao", p: "porquanto", sig: "porque, visto que", troca: "porque", ex: "A medida é urgente, porquanto vidas estão em risco.", moderacao: true },

    /* ---------------- TROQUE O INFORMAL ---------------- */
    { cat: "troca", p: "hoje em dia → na contemporaneidade / atualmente", sig: "evite a marca de oralidade", troca: "hoje em dia", ex: "Na contemporaneidade, as redes moldam opiniões." },
    { cat: "troca", p: "a gente → a sociedade / os cidadãos", sig: "'a gente' é coloquial; prefira sujeitos impessoais", troca: "a gente", ex: "A sociedade precisa debater o tema." },
    { cat: "troca", p: "coisa → fator / aspecto / elemento", sig: "palavra vaga demais para a redação", troca: "coisa", ex: "Esse fator agrava o problema." },
    { cat: "troca", p: "ajudar a → contribuir para", sig: "verbo mais preciso e formal", troca: "ajudar", ex: "A leitura contribui para o pensamento crítico." },
    { cat: "troca", p: "mostrar → evidenciar / demonstrar", sig: "verbos mais precisos", troca: "mostrar", ex: "A pesquisa demonstra o aumento da ansiedade." },
    { cat: "troca", p: "acabar com → erradicar / combater", sig: "verbos formais de ação", troca: "acabar com", ex: "É preciso combater a desinformação." },
    { cat: "troca", p: "muito importante → imprescindível / fundamental", sig: "evite intensificadores coloquiais", troca: "muito importante", ex: "A proposta é fundamental para a inclusão." },
    { cat: "troca", p: "por causa de → em virtude de / devido a", sig: "locuções causais formais", troca: "por causa de", ex: "Em virtude da omissão estatal, o problema persiste." },
    { cat: "troca", p: "vai ter → haverá", sig: "futuro com 'haver' no sentido de existir", troca: "vai ter", ex: "Haverá avanços se houver investimento." },
    { cat: "troca", p: "tipo / tipo assim → como / por exemplo", sig: "marca de oralidade", troca: "tipo", ex: "Redes sociais, como o Instagram, influenciam jovens." },
    { cat: "troca", p: "pra / tá / tô → para / está / estou", sig: "nunca abrevie na redação", troca: "pra", ex: "Para isso, o Estado está obrigado a agir." },
    { cat: "troca", p: "eu acho que → defende-se que / é evidente que", sig: "prefira a impessoalidade", troca: "eu acho", ex: "É evidente que a educação transforma vidas." },

    /* ---------------- NÃO CONFUNDA (PARÔNIMOS) ---------------- */
    { cat: "paronimo", p: "iminente × eminente", sig: "IMINENTE = prestes a acontecer; EMINENTE = ilustre, importante", troca: "", ex: "Há risco iminente de colapso. / O eminente cientista alertou." },
    { cat: "paronimo", p: "ratificar × retificar", sig: "RATIFICAR = confirmar; RETIFICAR = corrigir", troca: "", ex: "O Brasil ratificou o Acordo de Paris. / A empresa retificou o erro." },
    { cat: "paronimo", p: "incipiente × insipiente", sig: "INCIPIENTE = inicial, que está começando; INSIPIENTE = ignorante", troca: "", ex: "A regulação da IA ainda é incipiente." },
    { cat: "paronimo", p: "descriminar × discriminar", sig: "DESCRIMINAR = deixar de considerar crime; DISCRIMINAR = distinguir, tratar com preconceito", troca: "", ex: "Não se pode discriminar pessoas pela idade." },
    { cat: "paronimo", p: "infligir × infringir", sig: "INFLIGIR = aplicar (pena, castigo); INFRINGIR = desrespeitar (lei, regra)", troca: "", ex: "Quem infringe a lei deve responder por isso." },
    { cat: "paronimo", p: "tráfego × tráfico", sig: "TRÁFEGO = trânsito; TRÁFICO = comércio ilegal", troca: "", ex: "O tráfego intenso polui as cidades. / O tráfico de pessoas é crime." },
    { cat: "paronimo", p: "comprimento × cumprimento", sig: "COMPRIMENTO = extensão; CUMPRIMENTO = saudação ou execução", troca: "", ex: "É preciso garantir o cumprimento da lei." },
    { cat: "paronimo", p: "emergir × imergir", sig: "EMERGIR = vir à tona; IMERGIR = mergulhar", troca: "", ex: "Novos problemas emergem com a tecnologia." },
    { cat: "paronimo", p: "igualdade × equidade", sig: "IGUALDADE = mesmo tratamento para todos; EQUIDADE = tratamento conforme a necessidade de cada um", troca: "", ex: "Cotas buscam equidade, não apenas igualdade formal." }
  ]
};
