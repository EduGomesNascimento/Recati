# PadariaERP

Aplicacao focada em **controle de comanda**, sem cadastro de cliente na operacao.

Documentacao detalhada de funcionamento e banco:

- `GUIA_SISTEMA_E_BANCO.md`

## O que o sistema entrega

- App **mobile** para anotacao de pedido:
  - tela principal abre direto em anotacao de item
  - selecao/pesquisa de comanda aberta (ou abrir nova comanda)
  - abertura de comanda com campo de **mesa opcional**
  - inclusao de itens por toque rapido (+1/+2)
  - catalogo com imagens dos produtos
  - sugestoes "mais pedidos"
  - observacoes rapidas por chips (ex.: `Alergico a gluten`)
  - desconto por item
  - inclusao de adicionais por item
  - troca de status da comanda
  - impressao de cupom
- App **desktop (caixa)**:
  - cadastro de codigos de comanda
  - cadastro completo de produtos:
    - nome, categoria, descricao, preco, ativo/inativo e estoque
    - upload de foto do produto (arquivo) ou URL de imagem
    - vinculo de adicionais permitidos por produto
    - edicao, desativacao/reativacao e exclusao definitiva (quando permitido)
    - ajustes rapidos de estoque (`-10`, `-1`, `+1`, `+10`)
  - cadastro completo de adicionais:
    - criar, editar, ativar/desativar e excluir (quando permitido)
    - vinculo de adicionais permitidos por produto
    - no app de anotacao, a selecao de item mostra somente adicionais possiveis
  - filtro de comandas por codigo, mesa, status, tipo de entrega, periodo e faixa de total
  - ordenacao por ID, data, codigo, mesa, status, tipo e total (asc/desc)
  - controle de pagamentos (dinheiro, pix, cartao)
  - fluxo de maquininha (simulado: iniciar/aprovar/recusar)
  - botao para **resetar comandas ativas** (cancela e libera codigos)
  - opcao para **excluir comanda definitivamente** (com reposicao de estoque quando necessario)
  - fechamento de caixa diario
  - controle de **faturamento por periodo** com resumo por dia
  - exportacao CSV do fechamento
  - tema claro/escuro
  - aba de configuracao do ERP (customizavel):
    - nome da empresa, subtitulo, logo e email de rodape
    - cores principais do tema (desktop + mobile)
    - tempo real (ativo/inativo e intervalo)
    - habilitar/desabilitar etapa `PRONTO`
    - status aplicado ao "Finalizar pedido" no mobile
    - impressao automatica da cozinha no mobile
  - opcoes visuais no desktop e mobile (por dispositivo):
    - tema, densidade, tamanho de texto, bordas, contraste, layout e icones
    - presets rapidos de interface
  - paletas de cor rapidas na configuracao global do ERP

## Stack

- Python 3.11+
- FastAPI
- SQLAlchemy 2.x
- Pydantic v2
- SQLite (padrao: `padaria.db`)
- Jinja2

## Endpoints principais

- `POST /comandas/codigos`
- `GET /comandas/codigos`
- `DELETE /comandas/codigos/{codigo_id}`
- `POST /comandas/abrir`
- `GET /comandas`
- `GET /comandas/{id}`
- `DELETE /comandas/{id}`
- `POST /comandas/{id}/itens`
- `PUT /comandas/{id}/itens/{item_id}`
- `DELETE /comandas/{id}/itens/{item_id}`
- `DELETE /comandas/{id}/itens/{item_id}/forcar?repor_estoque=true|false`
- `PATCH /comandas/{id}/status`
- `GET /comandas/{id}/cupom`
- `GET /comandas/historico/cupons`
- `GET /comandas/sugestoes/mais-pedidos`
- `POST /comandas/resetar-ativas`
- `POST /adicionais`
- `GET /adicionais`
- `PUT /adicionais/{id}`
- `DELETE /adicionais/{id}` (`?hard=true` para exclusao definitiva)
- `POST /produtos`
- `GET /produtos`
- `PUT /produtos/{id}`
- `PATCH /produtos/{id}/estoque`
- `DELETE /produtos/{id}`
- `POST /produtos/upload-imagem`
- `POST /pagamentos`
- `POST /pagamentos/maquininha/iniciar`
- `PATCH /pagamentos/maquininha/{pagamento_id}/confirmar`
- `GET /relatorios/fechamento-caixa`
- `GET /relatorios/fechamento-caixa.csv`
- `GET /relatorios/faturamento-periodo`
- `GET /config/erp`
- `PATCH /config/erp`
- `POST /config/erp/reset`

## Interfaces

- Mobile: `http://127.0.0.1:8000/mobile`
- Caixa desktop: `http://127.0.0.1:8000/caixa`
- Docs API: `http://127.0.0.1:8000/docs`

## Como rodar

```bash
python -m venv .venv
```

```bash
# Windows
.venv\Scripts\Activate.ps1
```

```bash
pip install -r requirements.txt
python seed.py
python -m uvicorn app.main:app --reload
```

## Rodar como aplicacao (1 clique no Windows)

- Execute `iniciar_padaria_app.bat`

Esse launcher sobe a API e abre o navegador no app mobile.

## Android Studio (APK)

- Projeto pronto em `android_studio_app/`
- Guia rapido: `android_studio_app/README.md`

## Seed

`seed.py` cria dados base:

- 12 produtos com imagens (`/static/img/*.svg`)
- adicionais
- codigos de comanda (`C-001` ate `C-020`)
- comandas fake em status diferentes (abertas, em preparo, prontas, entregues e canceladas)
- pagamentos fake (manual e maquininha simulada)

## Testes

```bash
python -m pytest -q
```
