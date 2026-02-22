# Guia Completo do Sistema e Banco

## 1. Visao geral

Este projeto e um ERP de padaria focado em:

- controle de comandas
- anotacao de pedidos no mobile
- operacao de caixa no desktop
- controle de estoque por fluxo de preparo
- pagamentos (manual e maquininha simulada)
- fechamento e faturamento por periodo

O backend roda em FastAPI e usa SQLAlchemy com SQLite por padrao.

## 2. Arquitetura tecnica

Camadas principais:

- `app/routes`: endpoints HTTP
- `app/services`: regras de negocio
- `app/models`: tabelas ORM (SQLAlchemy)
- `app/schemas`: contratos de entrada/saida (Pydantic)
- `app/db`: engine, sessao e bootstrap de schema
- `app/templates` e `app/static`: interfaces web (mobile e caixa)

Entrada web:

- `/mobile`: tela de anotacao para atendente/garcom
- `/caixa`: tela de caixa, controle e configuracoes

## 3. Fluxo operacional (fim a fim)

### 3.1 Fluxo de comanda

1. Cadastrar codigos de comanda (`C-001`, `C-002`, etc.).
2. Abrir comanda com codigo livre.
3. Adicionar itens e adicionais (status inicial `ABERTO`).
4. Finalizar para cozinha (muda para `EM_PREPARO`, com baixa de estoque).
5. Entregar (`ENTREGUE`) ou cancelar (`CANCELADO`).
6. Ao finalizar/cancelar, codigo da comanda e liberado.

### 3.2 Fluxo de estoque

Regra central:

- adicionar/remover itens em comanda `ABERTO` nao mexe em estoque
- baixa de estoque ocorre na transicao `ABERTO -> EM_PREPARO`
- cancelamento com reposicao reverte estoque (quando aplicavel)

### 3.3 Fluxo de pagamentos

Pagamento manual:

- criado como `APROVADO` na hora

Pagamento maquininha:

- inicia como `PENDENTE`
- depois confirma como `APROVADO` ou `RECUSADO`

Saldo da comanda:

- `saldo_pendente = total_comanda - soma(pagamentos_aprovados)`

## 4. Regras de negocio importantes

### 4.1 Status da comanda e transicoes

Transicoes permitidas no backend:

- `ABERTO -> EM_PREPARO`, `ABERTO -> CANCELADO`
- `EM_PREPARO -> PRONTO`, `EM_PREPARO -> ENTREGUE`, `EM_PREPARO -> CANCELADO`
- `PRONTO -> ENTREGUE`, `PRONTO -> CANCELADO`

Observacao:

- a etapa `PRONTO` pode ficar oculta na interface por configuracao, mas o backend suporta.

### 4.2 Itens e adicionais

- somente comandas `ABERTO` podem ter itens alterados (fluxo normal)
- produto inativo nao pode ser adicionado
- adicional inativo nao pode ser usado
- se o produto tiver adicionais permitidos definidos, so eles sao aceitos
- subtotal do item inclui adicionais e desconto
- desconto nao pode ser negativo e nem maior que o bruto do item
- total da comanda e sempre recalculado pela soma dos subtotais dos itens

### 4.3 Cancelamento, exclusao e ajuste forcado

- cancelar comanda pode repor estoque ou considerar perda
- existe exclusao forcada de item no pagamento (`/forcar`) com opcao de repor estoque
- exclusao definitiva da comanda remove itens/pagamentos e libera codigo
- se a comanda estava em preparo/pronto, pode repor estoque na exclusao

### 4.4 Complexidade do pedido

Classificacao por total de itens:

- 0: `Sem itens`
- ate 2: `Pedido minusculo`
- ate 5: `Pedido pequeno`
- ate 8: `Pedido medio`
- acima de 8: `Pedido grande`

## 5. Banco de dados

## 5.1 Configuracao e engine

- URL vem de `DATABASE_URL`
- padrao: `sqlite:///./padaria.db`
- SQLite com `PRAGMA foreign_keys=ON`
- tabelas criadas no startup com `Base.metadata.create_all`
- bootstrap incremental em `app/db/bootstrap.py` para colunas legadas

## 5.2 Tabelas principais

### `clientes`

- `id` PK
- `nome`
- `telefone`
- `endereco`
- `criado_em`

Uso atual:

- sistema cria/usa cliente tecnico `Balcao` para comandas.

### `comanda_codigos`

- `id` PK
- `codigo` unico
- `ativo`
- `em_uso`
- `criado_em`

### `produtos`

- `id` PK
- `nome`
- `categoria`
- `descricao`
- `imagem_url`
- `preco` (Decimal)
- `ativo`
- `estoque_atual`
- `criado_em`

### `adicionais`

- `id` PK
- `nome` unico
- `preco` (Decimal)
- `ativo`
- `criado_em`

### `produto_adicionais`

Tabela de vinculo produto x adicional permitido:

- `id` PK
- `produto_id` FK -> `produtos.id`
- `adicional_id` FK -> `adicionais.id`
- unique(`produto_id`, `adicional_id`)

Se nao houver vinculos para um produto, o sistema aceita todos os adicionais ativos.

### `pedidos` (comandas)

- `id` PK
- `cliente_id` FK -> `clientes.id`
- `comanda_codigo`
- `mesa`
- `status` enum (`ABERTO`, `EM_PREPARO`, `PRONTO`, `ENTREGUE`, `CANCELADO`)
- `tipo_entrega` enum (`RETIRADA`, `ENTREGA`)
- `observacoes`
- `total` (Decimal)
- `criado_em`

### `itens_pedido`

- `id` PK
- `pedido_id` FK -> `pedidos.id`
- `produto_id` FK -> `produtos.id`
- `quantidade`
- `preco_unitario` (snapshot do produto)
- `desconto`
- `subtotal`
- `observacoes`

### `itens_pedido_adicionais`

- `id` PK
- `item_pedido_id` FK -> `itens_pedido.id`
- `adicional_id` FK -> `adicionais.id`
- `quantidade`
- `preco_unitario` (snapshot do adicional)
- `subtotal`

### `pagamentos`

- `id` PK
- `pedido_id` FK -> `pedidos.id`
- `metodo` enum (`DINHEIRO`, `PIX`, `CARTAO_DEBITO`, `CARTAO_CREDITO`)
- `status` enum (`PENDENTE`, `APROVADO`, `RECUSADO`, `CANCELADO`)
- `valor`
- `referencia_externa`
- `maquininha_id`
- `criado_em`

### `erp_config`

- `id` PK (linha unica, normalmente `1`)
- `payload` JSON com configuracoes do ERP
- `atualizado_em`

Configuracoes globais incluem branding, cores, tempo real e regras de UI.

## 5.3 Relacionamentos (resumo)

- `clientes 1:N pedidos`
- `pedidos 1:N itens_pedido`
- `pedidos 1:N pagamentos`
- `itens_pedido 1:N itens_pedido_adicionais`
- `produtos N:N adicionais` via `produto_adicionais`

## 6. Endpoints por modulo

Comandas:

- codigos (`/comandas/codigos`)
- abrir/listar/detalhar/excluir comanda
- itens (add/update/delete/forcar)
- status
- cupom
- sugestoes
- resetar ativas

Produtos:

- CRUD
- upload de imagem
- ajuste de estoque

Adicionais:

- CRUD

Pagamentos:

- pagamento manual
- iniciar/confirmar maquininha
- callback por referencia

Relatorios:

- resumo do dia
- fechamento de caixa
- fechamento CSV
- faturamento por periodo

Configuracao ERP:

- `GET /config/erp`
- `PATCH /config/erp`
- `POST /config/erp/reset`

## 7. Tempo real e interface

Desktop e mobile usam polling para atualizar dados automaticamente:

- intervalo controlado por configuracao ERP (`tempo_real_segundos`)
- pode ligar/desligar tempo real na configuracao
- cada dispositivo tambem tem opcoes locais de aparencia (tema, densidade, etc.)

## 8. Seed e dados fake

`seed.py` cria base inicial:

- cliente `Balcao`
- produtos e adicionais
- vinculos de adicionais por produto
- codigos `C-001` a `C-020`
- comandas fake em varios status
- pagamentos fake

## 9. Consultas SQL uteis (SQLite)

Listar tabelas:

```sql
SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name;
```

Comandas abertas:

```sql
SELECT id, comanda_codigo, status, total
FROM pedidos
WHERE status = 'ABERTO'
ORDER BY id DESC;
```

Estoque atual:

```sql
SELECT id, nome, estoque_atual, ativo
FROM produtos
ORDER BY nome;
```

Itens de uma comanda:

```sql
SELECT i.id, p.nome AS produto, i.quantidade, i.subtotal
FROM itens_pedido i
JOIN produtos p ON p.id = i.produto_id
WHERE i.pedido_id = ?;
```

Total recebido por metodo:

```sql
SELECT metodo, SUM(valor) AS total
FROM pagamentos
WHERE status = 'APROVADO'
GROUP BY metodo;
```

## 10. Backup e recuperacao

Backup simples:

- parar o sistema
- copiar o arquivo `padaria.db`

Restauracao:

- substituir `padaria.db` pelo backup
- subir a aplicacao novamente

## 11. Arquivos chave para manutencao

- Regras de comanda: `app/services/comanda_service.py`
- Regras de pagamento: `app/services/pagamento_service.py`
- Regras de relatorio: `app/services/relatorio_service.py`
- Modelos ORM: `app/models/*.py`
- Config global ERP: `app/services/config_service.py`
- Frontend caixa: `app/templates/caixa.html`, `app/static/caixa.js`, `app/static/caixa.css`
- Frontend mobile: `app/templates/mobile.html`, `app/static/mobile.js`, `app/static/mobile.css`
