# 🚀 Rumo ao ENEM

Aplicação web leve, lúdica e **100% offline** de preparação para o ENEM. Sem
login, sem servidor: você digita seu nome uma vez e o app lembra de você e do
seu progresso usando o armazenamento local do navegador (`localStorage`).

## Como usar
Abra `enem-app/index.html` em qualquer navegador moderno. Não precisa instalar
nada nem estar conectado à internet (os links externos de estudo, esses sim,
abrem em novas abas).

## O que tem dentro
- **Trilhas do zero ao avançado** nas 4 áreas do ENEM (Linguagens, Humanas,
  Natureza, Matemática), organizadas em **módulos** por assunto: teoria,
  mnemônicos, analogias, dicas, blocos de atenção e representações gráficas em
  cada lição.
- **Banco com mais de 500 questões** estilo ENEM: um núcleo de questões
  conceituais escritas à mão (interpretação, história, biologia, filosofia
  etc.) somado a geradores paramétricos de questões quantitativas (matemática,
  física, química) com resposta calculada e explicação detalhada.
- **Simulados customizados**: escolha áreas, quantidade, dificuldade, modo
  cronometrado e explicação por questão. Correção e explicação detalhada em
  cada item.
- **Diagnóstico de nível**: o app calcula sua proficiência, mostra seu nível
  (Aprendiz → Craque do ENEM) e diz exatamente **o que você precisa melhorar**.
- **Gráficos**: curva de aprendizagem (linha), radar de proficiência por área,
  barras por tópico e medidor de preparo geral — todos em SVG, sem bibliotecas.
- **Redação**: estrutura, as 5 competências, checklist da proposta de
  intervenção, repertórios coringa, temas prováveis e treino com autoavaliação.
- **Plano de estudos**: 4 fases, cronograma semanal e técnicas (repetição
  espaçada, intercalado, Pomodoro).
- **Recursos**: plataformas, canais de videoaula e materiais oficiais.
- **Gamificação**: conquistas, sequência de dias (streak) e perfil com
  exportação do progresso.

## Estrutura
```
enem-app/
├── index.html
├── css/style.css
├── build/                     gerador do banco de questões (Node)
│   ├── generate-questions.js  emite js/data/questions.js
│   ├── curated-questions.js   questões conceituais (lote 1)
│   └── curated-questions-2.js questões conceituais (lote 2)
└── js/
    ├── data/        conteúdo (módulos), questões, redação e recursos
    ├── storage.js   persistência local
    ├── charts.js    gráficos SVG
    ├── engine.js    diagnóstico, níveis, recomendações, conquistas
    └── app.js       roteamento e telas
```

### Regenerar o banco de questões
`js/data/questions.js` é **gerado** — não edite à mão. Para ampliar o banco,
edite os arquivos de `build/` e rode:
```
node build/generate-questions.js
```
Isso reescreve `js/data/questions.js`. Adicione questões conceituais em
`curated-questions*.js` ou novos geradores paramétricos em
`generate-questions.js`.

As questões são baseadas em habilidades e temas de edições anteriores do
ENEM/Inep, reescritas para fins educacionais.
