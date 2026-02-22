from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine


def ensure_schema(engine: Engine) -> None:
    inspector = inspect(engine)
    tables = set(inspector.get_table_names())

    if "pedidos" in tables:
        pedido_columns = {column["name"] for column in inspector.get_columns("pedidos")}
        if "comanda_codigo" not in pedido_columns:
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE pedidos ADD COLUMN comanda_codigo VARCHAR(50)"))
        if "mesa" not in pedido_columns:
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE pedidos ADD COLUMN mesa VARCHAR(30)"))

    if "itens_pedido" in tables:
        item_columns = {column["name"] for column in inspector.get_columns("itens_pedido")}
        if "observacoes" not in item_columns:
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE itens_pedido ADD COLUMN observacoes TEXT"))
        if "desconto" not in item_columns:
            with engine.begin() as conn:
                conn.execute(
                    text("ALTER TABLE itens_pedido ADD COLUMN desconto NUMERIC(10,2) NOT NULL DEFAULT 0")
                )

    if "produtos" in tables:
        product_columns = {column["name"] for column in inspector.get_columns("produtos")}
        if "imagem_url" not in product_columns:
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE produtos ADD COLUMN imagem_url VARCHAR(255)"))
        if "categoria" not in product_columns:
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE produtos ADD COLUMN categoria VARCHAR(80)"))
        if "descricao" not in product_columns:
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE produtos ADD COLUMN descricao TEXT"))

    if "comanda_codigos" in tables:
        codigo_columns = {column["name"] for column in inspector.get_columns("comanda_codigos")}
        if "status_visual" not in codigo_columns:
            with engine.begin() as conn:
                conn.execute(
                    text(
                        "ALTER TABLE comanda_codigos "
                        "ADD COLUMN status_visual VARCHAR(20) NOT NULL DEFAULT 'LIBERADO'"
                    )
                )
        with engine.begin() as conn:
            conn.execute(
                text(
                    "UPDATE comanda_codigos "
                    "SET status_visual = 'LIBERADO' "
                    "WHERE status_visual IS NULL OR TRIM(status_visual) = ''"
                )
            )

    _ensure_indexes(engine, tables)


def _ensure_indexes(engine: Engine, tables: set[str]) -> None:
    inspector = inspect(engine)
    existing_indexes = {
        table: {idx["name"] for idx in inspector.get_indexes(table)}
        for table in tables
    }

    definitions: list[tuple[str, str, str]] = [
        (
            "pedidos",
            "ix_pedidos_status_criado_em",
            "CREATE INDEX IF NOT EXISTS ix_pedidos_status_criado_em ON pedidos (status, criado_em)",
        ),
        (
            "pedidos",
            "ix_pedidos_tipo_criado_em",
            "CREATE INDEX IF NOT EXISTS ix_pedidos_tipo_criado_em ON pedidos (tipo_entrega, criado_em)",
        ),
        (
            "pedidos",
            "ix_pedidos_comanda_status",
            "CREATE INDEX IF NOT EXISTS ix_pedidos_comanda_status ON pedidos (comanda_codigo, status)",
        ),
        (
            "pagamentos",
            "ix_pagamentos_pedido_status",
            "CREATE INDEX IF NOT EXISTS ix_pagamentos_pedido_status ON pagamentos (pedido_id, status)",
        ),
        (
            "pagamentos",
            "ix_pagamentos_status_criado_em",
            "CREATE INDEX IF NOT EXISTS ix_pagamentos_status_criado_em ON pagamentos (status, criado_em)",
        ),
        (
            "pagamentos",
            "ix_pagamentos_status_metodo_criado_em",
            "CREATE INDEX IF NOT EXISTS ix_pagamentos_status_metodo_criado_em ON pagamentos (status, metodo, criado_em)",
        ),
        (
            "comanda_codigos",
            "ix_comanda_codigos_ativo_em_uso",
            "CREATE INDEX IF NOT EXISTS ix_comanda_codigos_ativo_em_uso ON comanda_codigos (ativo, em_uso)",
        ),
        (
            "comanda_codigos",
            "ix_comanda_codigos_status_visual",
            "CREATE INDEX IF NOT EXISTS ix_comanda_codigos_status_visual ON comanda_codigos (status_visual)",
        ),
        (
            "adicionais",
            "ix_adicionais_ativo_id",
            "CREATE INDEX IF NOT EXISTS ix_adicionais_ativo_id ON adicionais (ativo, id)",
        ),
        (
            "produtos",
            "ix_produtos_ativo_id",
            "CREATE INDEX IF NOT EXISTS ix_produtos_ativo_id ON produtos (ativo, id)",
        ),
        (
            "itens_pedido",
            "ix_itens_pedido_pedido_produto",
            "CREATE INDEX IF NOT EXISTS ix_itens_pedido_pedido_produto ON itens_pedido (pedido_id, produto_id)",
        ),
        (
            "itens_pedido_adicionais",
            "ix_itens_pedido_adicionais_item_adicional",
            "CREATE INDEX IF NOT EXISTS ix_itens_pedido_adicionais_item_adicional ON itens_pedido_adicionais (item_pedido_id, adicional_id)",
        ),
    ]

    for table_name, index_name, ddl in definitions:
        if table_name not in tables:
            continue
        if index_name in existing_indexes.get(table_name, set()):
            continue
        with engine.begin() as conn:
            conn.execute(text(ddl))
