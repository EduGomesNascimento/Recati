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
        ("Buffet", "59.90", 120, "/static/img/sanduiche.svg", "Buffet", "Buffet por kg"),
        ("Mini Espeto", "12.90", 180, "/static/img/esfiha.svg", "Mini Espeto", "Espeto individual"),
        (
            "Espeto Completo",
            "34.90",
            110,
            "/static/img/misto.svg",
            "Espeto Completo",
            "Espeto com acompanhamentos",
        ),
        (
            "Buffet Almoco",
            "39.90",
            90,
            "/static/img/empada.svg",
            "Buffet Almoco",
            "Prato executivo de almoco",
        ),
        ("Bebidas", "8.90", 250, "/static/img/suco.svg", "Bebidas", "Item geral de bebidas"),
        (
            "Refrigerante Lata 350ml",
            "6.50",
            260,
            "/static/img/suco.svg",
            "Bebidas",
            "Coca, Guarana ou Zero",
        ),
        (
            "Suco Natural 500ml",
            "9.50",
            130,
            "/static/img/suco.svg",
            "Bebidas",
            "Laranja ou abacaxi",
        ),
        (
            "Agua Mineral 500ml",
            "4.00",
            280,
            "/static/img/suco.svg",
            "Bebidas",
            "Com ou sem gas",
        ),
        (
            "Cerveja Long Neck",
            "12.00",
            180,
            "/static/img/suco.svg",
            "Bebidas",
            "Garrafa 355ml",
        ),
        ("Pao de Alho", "8.00", 140, "/static/img/pao.svg", "Acompanhamento", "Unidade"),
        (
            "Queijo Coalho na Brasa",
            "11.00",
            120,
            "/static/img/pao_queijo.svg",
            "Acompanhamento",
            "Espeto de queijo",
        ),
        (
            "Costela Fatiada",
            "44.90",
            70,
            "/static/img/croissant.svg",
            "Espeto Completo",
            "Porcao especial",
        ),
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
        ("Farofa Extra", "3.00"),
        ("Vinagrete", "2.50"),
        ("Molho de Alho", "2.00"),
        ("Queijo Coalho Extra", "4.50"),
        ("Gelo e Limao", "1.50"),
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
        "Buffet": ["Farofa Extra", "Vinagrete", "Molho de Alho"],
        "Mini Espeto": ["Farofa Extra", "Vinagrete", "Molho de Alho"],
        "Espeto Completo": ["Farofa Extra", "Vinagrete", "Molho de Alho", "Queijo Coalho Extra"],
        "Buffet Almoco": ["Farofa Extra", "Vinagrete", "Molho de Alho"],
        "Bebidas": ["Gelo e Limao"],
        "Refrigerante Lata 350ml": ["Gelo e Limao"],
        "Suco Natural 500ml": ["Gelo e Limao"],
        "Cerveja Long Neck": ["Gelo e Limao"],
        "Costela Fatiada": ["Farofa Extra", "Vinagrete", "Molho de Alho", "Queijo Coalho Extra"],
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
                ("Mini Espeto", 2, "Sem pimenta", [("Vinagrete", 1)], "2.00"),
                ("Refrigerante Lata 350ml", 2, None, [("Gelo e Limao", 1)]),
            ],
            "pagamentos": [],
        },
        {
            "codigo": "C-002",
            "status": StatusPedido.ABERTO,
            "tipo_entrega": TipoEntrega.ENTREGA,
            "obs": "Rua das Brasas, 45",
            "itens": [
                ("Buffet Almoco", 2, None, [("Farofa Extra", 2)]),
                ("Bebidas", 1, None, []),
            ],
            "pagamentos": [(MetodoPagamento.PIX, StatusPagamento.APROVADO, "25.00", "PIX-CH-01")],
        },
        {
            "codigo": "C-003",
            "status": StatusPedido.EM_PREPARO,
            "tipo_entrega": TipoEntrega.RETIRADA,
            "mesa": "5",
            "obs": "Mesa 5",
            "itens": [
                ("Espeto Completo", 2, "Ao ponto", [("Molho de Alho", 1), ("Farofa Extra", 1)]),
                ("Agua Mineral 500ml", 2, None, []),
            ],
            "pagamentos": [],
        },
        {
            "codigo": "C-004",
            "status": StatusPedido.PRONTO,
            "tipo_entrega": TipoEntrega.RETIRADA,
            "obs": "Balcao retirada",
            "itens": [
                ("Pao de Alho", 3, None, []),
                ("Queijo Coalho na Brasa", 2, None, [("Molho de Alho", 1)]),
            ],
            "pagamentos": [],
        },
        {
            "codigo": "C-005",
            "status": StatusPedido.ENTREGUE,
            "tipo_entrega": TipoEntrega.ENTREGA,
            "obs": "Condominio Grill",
            "itens": [
                ("Costela Fatiada", 1, None, [("Farofa Extra", 1), ("Vinagrete", 1)]),
                ("Suco Natural 500ml", 2, None, [("Gelo e Limao", 2)]),
            ],
            "pagamentos": [(MetodoPagamento.CARTAO_CREDITO, StatusPagamento.APROVADO, "68.90", "NSU-CH-9001")],
        },
        {
            "codigo": "C-006",
            "status": StatusPedido.ENTREGUE,
            "tipo_entrega": TipoEntrega.RETIRADA,
            "mesa": "9",
            "obs": "Mesa 9",
            "itens": [
                ("Buffet", 2, None, [("Farofa Extra", 1)]),
                ("Cerveja Long Neck", 3, None, []),
            ],
            "pagamentos": [
                (MetodoPagamento.DINHEIRO, StatusPagamento.APROVADO, "60.00", None),
                (MetodoPagamento.PIX, StatusPagamento.APROVADO, "12.00", "PIX-CH-02"),
            ],
        },
        {
            "codigo": "C-007",
            "status": StatusPedido.CANCELADO,
            "tipo_entrega": TipoEntrega.RETIRADA,
            "obs": "Cliente desistiu",
            "itens": [("Mini Espeto", 1, None, []), ("Bebidas", 1, None, [])],
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
                    maquininha_id="MAQ-CH-01" if "CARTAO" in metodo.value else None,
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
