from __future__ import annotations

from decimal import Decimal

from sqlalchemy import func, select

from app.db.base import Base
from app.db.bootstrap import ensure_schema
from app.db.session import SessionLocal, engine
from app.models.adicional import Adicional
from app.models.cliente import Cliente
from app.models.comanda_codigo import ComandaCodigo
from app.models.enums import MetodoPagamento, StatusPagamento, StatusPedido, TipoEntrega
from app.models.item_adicional import ItemPedidoAdicional
from app.models.item_pedido import ItemPedido
from app.models.pagamento import Pagamento
from app.models.pedido import Pedido
from app.models.produto import Produto
from app.models.produto_adicional import ProdutoAdicional


def money(value: str | Decimal | int | float) -> Decimal:
    return Decimal(value).quantize(Decimal("0.01"))


def run_seed() -> None:
    Base.metadata.create_all(bind=engine)
    ensure_schema(engine)

    with SessionLocal() as db:
        cliente = _get_or_create_cliente_balcao(db)
        produtos = _seed_produtos(db)
        adicionais = _seed_adicionais(db)
        _seed_produto_adicionais(db, produtos, adicionais)
        codigos = _seed_codigos(db)

        has_comandas = (
            db.scalar(select(func.count(Pedido.id)).where(Pedido.comanda_codigo.is_not(None))) or 0
        )
        if not has_comandas:
            _seed_comandas_fake(db, cliente, produtos, adicionais, codigos)

        db.commit()

    print("Seed concluido com sucesso.")


def _get_or_create_cliente_balcao(db) -> Cliente:
    cliente = db.scalar(select(Cliente).where(func.lower(Cliente.nome) == "balcao"))
    if cliente:
        return cliente
    cliente = Cliente(nome="Balcao", telefone=None, endereco=None)
    db.add(cliente)
    db.flush()
    return cliente


def _seed_produtos(db) -> dict[str, Produto]:
    catalogo = [
        ("Pao Frances", "0.95", 400, "/static/img/pao.svg", "Padaria", "Unidade"),
        ("Pao de Queijo", "2.50", 180, "/static/img/pao_queijo.svg", "Salgado", "Unidade recheada"),
        ("Croissant", "7.50", 60, "/static/img/croissant.svg", "Salgado", "Massa folhada"),
        ("Bolo de Cenoura", "22.50", 20, "/static/img/bolo.svg", "Doce", "Fatia especial"),
        ("Bolo de Chocolate", "26.00", 18, "/static/img/bolo_choco.svg", "Doce", "Fatia com cobertura"),
        ("Sanduiche Natural", "14.90", 50, "/static/img/sanduiche.svg", "Lanche", "Pao integral"),
        ("Cafe Coado", "4.50", 250, "/static/img/cafe.svg", "Bebida", "Copo 200ml"),
        ("Capuccino", "7.90", 120, "/static/img/cafe.svg", "Bebida", "Copo 300ml"),
        ("Suco de Laranja", "8.50", 90, "/static/img/suco.svg", "Bebida", "Copo 300ml"),
        ("Misto Quente", "11.50", 90, "/static/img/misto.svg", "Lanche", "Pao de forma"),
        ("Empada de Frango", "9.00", 80, "/static/img/empada.svg", "Salgado", "Unidade"),
        ("Esfiha de Carne", "7.00", 100, "/static/img/esfiha.svg", "Salgado", "Unidade"),
    ]

    for nome, preco, estoque, imagem, categoria, descricao in catalogo:
        produto = db.scalar(select(Produto).where(Produto.nome == nome))
        if not produto:
            produto = Produto(
                nome=nome,
                preco=money(preco),
                estoque_atual=estoque,
                ativo=True,
                imagem_url=imagem,
                categoria=categoria,
                descricao=descricao,
            )
            db.add(produto)
        else:
            produto.preco = money(preco)
            produto.ativo = True
            produto.estoque_atual = max(produto.estoque_atual, estoque)
            produto.imagem_url = imagem
            produto.categoria = categoria
            produto.descricao = descricao
    db.flush()
    produtos = {
        p.nome: p for p in db.scalars(select(Produto).where(Produto.nome.in_([c[0] for c in catalogo])))
    }
    return produtos


def _seed_adicionais(db) -> dict[str, Adicional]:
    data = [
        ("Queijo Extra", "3.50"),
        ("Bacon Extra", "5.00"),
        ("Molho Especial", "2.00"),
        ("Ovo", "2.50"),
        ("Chocolate", "3.00"),
    ]
    for nome, preco in data:
        adicional = db.scalar(select(Adicional).where(Adicional.nome == nome))
        if not adicional:
            adicional = Adicional(nome=nome, preco=money(preco), ativo=True)
            db.add(adicional)
        else:
            adicional.preco = money(preco)
            adicional.ativo = True
    db.flush()
    adicionais = {
        a.nome: a for a in db.scalars(select(Adicional).where(Adicional.nome.in_([c[0] for c in data])))
    }
    return adicionais


def _seed_produto_adicionais(db, produtos: dict[str, Produto], adicionais: dict[str, Adicional]) -> None:
    links = {
        "Misto Quente": ["Queijo Extra", "Bacon Extra", "Ovo", "Molho Especial"],
        "Sanduiche Natural": ["Queijo Extra", "Bacon Extra", "Molho Especial"],
        "Croissant": ["Queijo Extra", "Chocolate"],
        "Capuccino": ["Chocolate"],
        "Suco de Laranja": [],
    }
    for produto_nome, adicionais_nomes in links.items():
        produto = produtos.get(produto_nome)
        if not produto:
            continue
        db.query(ProdutoAdicional).filter(ProdutoAdicional.produto_id == produto.id).delete()
        for adicional_nome in adicionais_nomes:
            adicional = adicionais.get(adicional_nome)
            if not adicional:
                continue
            db.add(
                ProdutoAdicional(
                    produto_id=produto.id,
                    adicional_id=adicional.id,
                )
            )


def _seed_codigos(db) -> dict[str, ComandaCodigo]:
    base = [f"C-{str(i).zfill(3)}" for i in range(1, 21)]
    for codigo in base:
        record = db.scalar(select(ComandaCodigo).where(ComandaCodigo.codigo == codigo))
        if not record:
            db.add(ComandaCodigo(codigo=codigo, ativo=True, em_uso=False))
    db.flush()
    return {c.codigo: c for c in db.scalars(select(ComandaCodigo).where(ComandaCodigo.codigo.in_(base)))}


def _seed_comandas_fake(db, cliente: Cliente, produtos: dict, adicionais: dict, codigos: dict) -> None:
    estrutura = [
        {
            "codigo": "C-001",
            "status": StatusPedido.ABERTO,
            "tipo_entrega": TipoEntrega.RETIRADA,
            "mesa": "1",
            "obs": "Mesa 1",
            "itens": [
                ("Misto Quente", 1, "Sem tomate", [("Queijo Extra", 1)], "1.50"),
                ("Cafe Coado", 2, None, []),
            ],
            "pagamentos": [],
        },
        {
            "codigo": "C-002",
            "status": StatusPedido.ABERTO,
            "tipo_entrega": TipoEntrega.ENTREGA,
            "obs": "Rua Azul, 30",
            "itens": [
                ("Sanduiche Natural", 2, None, [("Bacon Extra", 1)]),
                ("Suco de Laranja", 2, None, [], "2.00"),
            ],
            "pagamentos": [(MetodoPagamento.PIX, StatusPagamento.APROVADO, "15.00", "PIX-FAKE-01")],
        },
        {
            "codigo": "C-003",
            "status": StatusPedido.EM_PREPARO,
            "tipo_entrega": TipoEntrega.RETIRADA,
            "mesa": "4",
            "obs": "Mesa 4",
            "itens": [
                ("Croissant", 3, None, [("Chocolate", 1)]),
                ("Capuccino", 2, None, []),
            ],
            "pagamentos": [],
        },
        {
            "codigo": "C-004",
            "status": StatusPedido.PRONTO,
            "tipo_entrega": TipoEntrega.RETIRADA,
            "obs": "Retirada balcao",
            "itens": [
                ("Empada de Frango", 2, None, []),
                ("Cafe Coado", 2, None, []),
            ],
            "pagamentos": [],
        },
        {
            "codigo": "C-005",
            "status": StatusPedido.ENTREGUE,
            "tipo_entrega": TipoEntrega.ENTREGA,
            "obs": "Condominio Sol",
            "itens": [
                ("Bolo de Cenoura", 1, None, []),
                ("Suco de Laranja", 1, None, []),
            ],
            "pagamentos": [(MetodoPagamento.CARTAO_CREDITO, StatusPagamento.APROVADO, "31.00", "NSU-9001")],
        },
        {
            "codigo": "C-006",
            "status": StatusPedido.ENTREGUE,
            "tipo_entrega": TipoEntrega.RETIRADA,
            "mesa": "7",
            "obs": "Mesa 7",
            "itens": [
                ("Pao de Queijo", 6, None, []),
                ("Cafe Coado", 3, None, []),
            ],
            "pagamentos": [
                (MetodoPagamento.DINHEIRO, StatusPagamento.APROVADO, "20.00", None),
                (MetodoPagamento.PIX, StatusPagamento.APROVADO, "8.50", "PIX-FAKE-02"),
            ],
        },
        {
            "codigo": "C-007",
            "status": StatusPedido.CANCELADO,
            "tipo_entrega": TipoEntrega.RETIRADA,
            "obs": "Cliente desistiu",
            "itens": [("Esfiha de Carne", 2, None, [])],
            "pagamentos": [],
        },
    ]

    for row in estrutura:
        pedido = Pedido(
            cliente_id=cliente.id,
            comanda_codigo=row["codigo"],
            mesa=row.get("mesa"),
            tipo_entrega=row["tipo_entrega"],
            observacoes=row["obs"],
            status=row["status"],
            total=money("0"),
        )
        db.add(pedido)
        db.flush()

        total = money("0")
        for item_row in row["itens"]:
            desconto_raw = "0"
            if len(item_row) == 4:
                product_name, quantidade, obs_item, adds = item_row
            else:
                product_name, quantidade, obs_item, adds, desconto_raw = item_row
            produto = produtos[product_name]
            preco_unit = money(produto.preco)
            item_sub = money(preco_unit * quantidade)
            item = ItemPedido(
                pedido_id=pedido.id,
                produto_id=produto.id,
                quantidade=quantidade,
                observacoes=obs_item,
                preco_unitario=preco_unit,
                desconto=money(desconto_raw),
                subtotal=money("0"),
            )
            db.add(item)
            db.flush()

            for add_name, add_qtd in adds:
                adicional = adicionais[add_name]
                add_unit = money(adicional.preco)
                add_sub = money(add_unit * add_qtd)
                db.add(
                    ItemPedidoAdicional(
                        item_pedido_id=item.id,
                        adicional_id=adicional.id,
                        quantidade=add_qtd,
                        preco_unitario=add_unit,
                        subtotal=add_sub,
                    )
                )
                item_sub += add_sub

            bruto = money(item_sub)
            desconto_valor = money(desconto_raw)
            if desconto_valor > bruto:
                desconto_valor = money("0")
            item.desconto = desconto_valor
            item.subtotal = money(bruto - desconto_valor)
            total += item.subtotal

        pedido.total = money(total)
        for metodo, status, valor, referencia in row["pagamentos"]:
            db.add(
                Pagamento(
                    pedido_id=pedido.id,
                    metodo=metodo,
                    status=status,
                    valor=money(valor),
                    referencia_externa=referencia,
                    maquininha_id="MAQ-FAKE-01" if "CARTAO" in metodo.value else None,
                )
            )

        codigo = codigos.get(row["codigo"])
        if codigo:
            codigo.ativo = True
            codigo.em_uso = row["status"] in {
                StatusPedido.ABERTO,
                StatusPedido.EM_PREPARO,
                StatusPedido.PRONTO,
            }


if __name__ == "__main__":
    run_seed()
