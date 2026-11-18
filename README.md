# Recati

Site institucional da RECATI, com intro em vídeo, página Sobre e as páginas
de projetos e demonstrações listadas abaixo.

**Domínio:** www.recati.com.br (configurado em `CNAME`)

## Seções

| Pasta | Conteúdo |
|---|---|
| `/` (`index.html`, `contato.html`, `duvidas.html`) | Site principal |
| `exemplos/` | Vitrine de sites-exemplo (salão, clínica, padaria, mecânica, ERP...) |
| `exemplosnovo/` | Sistemas de Padaria e Restaurantes (código e builds) |
| `enem/` | "Rumo ao ENEM": guia de estudos com questões |
| `imprimir/` | PrintBridge (impressão) |
| `damp`, `damp-*` | Projeto DAMP: controle, atuadores, materiais, vídeo e perguntas da banca |
| `img/` | Imagens do site e dos exemplos |
| `video/` | Vídeos do mascote (intro e página de contato) |
| `assets/` | Outros recursos compartilhados |
| `arquivo/midia-sem-uso/` | Imagens que nenhuma página usa, guardadas caso precise |

As páginas principais (`index.html`, `sobre.html`, `contato.html`,
`duvidas.html`) ficam na raiz para manter os endereços públicos do site.
Os artefatos de build do `exemplosnovo/` (PyInstaller e Android) não são
versionados: gere-os de novo localmente quando precisar.

## GitHub Pages

Depois do push, habilite em:
- Repository Settings -> Pages
- Source: Deploy from a branch
- Branch: main
- Folder: /(root)

URL sem domínio próprio: https://edugomesnascimento.github.io/Recati/
