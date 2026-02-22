from __future__ import annotations

from datetime import date, datetime, time
from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy import desc, func, select
from sqlalchemy.orm import Session, joinedload

from app.models.cliente import Cliente
from app.models.enums import StatusPedido
from app.models.item_pedido import ItemPedido
from app.models.pedido import Pedido
from app.models.produto import Produto
from app.schemas.pedido import (
    ItemPedidoCreate,
    ItemPedidoUpdate,
    PedidoCreate,
)
from app.services.utils import as_money

STATUS_TRANSITIONS: dict[StatusPedido, set[StatusPedido]] = {
    StatusPedido.ABERTO: {StatusPedido.FINALIZADA, StatusPedido.CANCELADO},
    StatusPedido.FINALIZADA: {StatusPedido.CANCELADO},
    StatusPedido.CANCELADO: set(),
}


def create_pedido(db: Session, payload: PedidoCreate) -> Pedido:
    cliente = db.get(Cliente, payload.cliente_id)
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cliente {payload.cliente_id} não encontrado.",
        )
    pedido = Pedido(
        cliente_id=payload.cliente_id,
        tipo_entrega=payload.tipo_entrega,
        observacoes=payload.observacoes,
    )
    db.add(pedido)
    db.commit()
    db.refresh(pedido)
    return pedido


def list_pedidos(
    db: Session,
    page: int,
    page_size: int,
    status_filter: StatusPedido | None,
    cliente_id: int | None,
    data_inicial: date | None,
    data_final: date | None,
) -> tuple[list[Pedido], int]:
    stmt = select(Pedido)

    if status_filter is not None:
        stmt = stmt.where(Pedido.status == status_filter)
    if cliente_id is not None:
        stmt = stmt.where(Pedido.cliente_id == cliente_id)
    if data_inicial is not None:
        stmt = stmt.where(Pedido.criado_em >= datetime.combine(data_inicial, time.min))
    if data_final is not None:
        stmt = stmt.where(Pedido.criado_em <= datetime.combine(data_final, time.max))

    total = int(db.scalar(select(func.count()).select_from(stmt.subquery())) or 0)
    items_stmt = (
        stmt.order_by(Pedido.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    pedidos = list(db.scalars(items_stmt).all())
    return pedidos, total


def list_cupons_historico(
    db: Session,
    data_inicial: date | None,
    data_final: date | None,
    status_filter: StatusPedido | None,
    cliente_id: int | None,
    somente_finalizados: bool,
    limit: int,
) -> list[dict]:
    stmt = select(Pedido, Cliente.nome).join(Cliente, Cliente.id == Pedido.cliente_id)

    if status_filter is not None:
        stmt = stmt.where(Pedido.status == status_filter)
    elif somente_finalizados:
        stmt = stmt.where(
            Pedido.status.in_([StatusPedido.FINALIZADA, StatusPedido.CANCELADO])
        )

    if cliente_id is not None:
        stmt = stmt.where(Pedido.cliente_id == cliente_id)
    if data_inicial is not None:
        stmt = stmt.where(Pedido.criado_em >= datetime.combine(data_inicial, time.min))
    if data_final is not None:
        stmt = stmt.where(Pedido.criado_em <= datetime.combine(data_final, time.max))

    rows = db.execute(stmt.order_by(desc(Pedido.criado_em)).limit(limit)).all()
    return [
        {
            "pedido_id": pedido.id,
            "cliente_id": pedido.cliente_id,
            "cliente_nome": cliente_nome,
            "status": pedido.status,
            "tipo_entrega": pedido.tipo_entrega,
            "total": as_money(pedido.total),
            "criado_em": pedido.criado_em,
        }
        for pedido, cliente_nome in rows
    ]


def get_pedido_or_404(db: Session, pedido_id: int) -> Pedido:
    stmt = (
        select(Pedido)
        .options(
            joinedload(Pedido.cliente),
            joinedload(Pedido.itens).joinedload(ItemPedido.produto),
        )
        .where(Pedido.id == pedido_id)
    )
    pedido = db.execute(stmt).unique().scalar_one_or_none()
    if not pedido:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pedido {pedido_id} não encontrado.",
        )
    return pedido


def get_cupom_data(db: Session, pedido_id: int) -> dict:
    pedido = get_pedido_or_404(db, pedido_id)
    itens = [
        {
            "id": item.id,
            "produto": item.produto.nome if item.produto else f"Produto {item.produto_id}",
            "quantidade": item.quantidade,
            "preco_unitario": as_money(item.preco_unitario),
            "subtotal": as_money(item.subtotal),
        }
        for item in pedido.itens
    ]
    return {
        "pedido_id": pedido.id,
        "cliente_nome": pedido.cliente.nome if pedido.cliente else f"Cliente {pedido.cliente_id}",
        "tipo_entrega": pedido.tipo_entrega.value,
        "status": pedido.status.value,
        "observacoes": pedido.observacoes,
        "criado_em": pedido.criado_em,
        "total": as_money(pedido.total),
        "itens": itens,
    }


def add_item(db: Session, pedido_id: int, payload: ItemPedidoCreate) -> Pedido:
    pedido = get_pedido_or_404(db, pedido_id)
    _ensure_open_order(pedido)

    produto = db.get(Produto, payload.produto_id)
    if not produto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Produto {payload.produto_id} não encontrado.",
        )
    if not produto.ativo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Produto inativo não pode ser adicionado ao pedido.",
        )

    preco_unitario = as_money(produto.preco)
    subtotal = as_money(preco_unitario * payload.quantidade)
    item = ItemPedido(
        pedido_id=pedido.id,
        produto_id=produto.id,
        quantidade=payload.quantidade,
        preco_unitario=preco_unitario,
        subtotal=subtotal,
    )
    db.add(item)
    db.flush()
    _recalculate_total(db, pedido)
    db.commit()
    return get_pedido_or_404(db, pedido.id)


def update_item(
    db: Session,
    pedido_id: int,
    item_id: int,
    payload: ItemPedidoUpdate,
) -> Pedido:
    pedido = get_pedido_or_404(db, pedido_id)
    _ensure_open_order(pedido)

    item = db.scalar(
        select(ItemPedido).where(
            ItemPedido.id == item_id,
            ItemPedido.pedido_id == pedido_id,
        )
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item {item_id} não encontrado no pedido {pedido_id}.",
        )

    item.quantidade = payload.quantidade
    item.subtotal = as_money(item.preco_unitario * payload.quantidade)
    db.flush()
    _recalculate_total(db, pedido)
    db.commit()
    return get_pedido_or_404(db, pedido.id)


def delete_item(db: Session, pedido_id: int, item_id: int) -> Pedido:
    pedido = get_pedido_or_404(db, pedido_id)
    _ensure_open_order(pedido)

    item = db.scalar(
        select(ItemPedido).where(
            ItemPedido.id == item_id,
            ItemPedido.pedido_id == pedido_id,
        )
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item {item_id} não encontrado no pedido {pedido_id}.",
        )

    db.delete(item)
    db.flush()
    _recalculate_total(db, pedido)
    db.commit()
    return get_pedido_or_404(db, pedido.id)


def change_status(db: Session, pedido_id: int, new_status: StatusPedido) -> Pedido:
    pedido = get_pedido_or_404(db, pedido_id)

    if pedido.status == new_status:
        return pedido

    allowed = STATUS_TRANSITIONS.get(pedido.status, set())
    if new_status not in allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Transição inválida de status: {pedido.status.value} -> "
                f"{new_status.value}."
            ),
        )

    if pedido.status == StatusPedido.ABERTO and new_status == StatusPedido.FINALIZADA:
        _decrement_stock_for_order(db, pedido)

    pedido.status = new_status
    db.commit()
    return get_pedido_or_404(db, pedido.id)


def _ensure_open_order(pedido: Pedido) -> None:
    if pedido.status != StatusPedido.ABERTO:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Somente pedidos com status ABERTO podem ter itens alterados.",
        )


def _recalculate_total(db: Session, pedido: Pedido) -> None:
    total = db.scalar(
        select(func.coalesce(func.sum(ItemPedido.subtotal), 0)).where(
            ItemPedido.pedido_id == pedido.id
        )
    )
    pedido.total = as_money(total or Decimal("0.00"))
    db.flush()


def _decrement_stock_for_order(db: Session, pedido: Pedido) -> None:
    if not pedido.itens:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pedido sem itens nao pode ir para FINALIZADA.",
        )

    required_per_product: dict[int, int] = {}
    for item in pedido.itens:
        required_per_product[item.produto_id] = (
            required_per_product.get(item.produto_id, 0) + item.quantidade
        )

    produtos = {
        produto.id: produto
        for produto in db.scalars(
            select(Produto).where(Produto.id.in_(required_per_product.keys()))
        ).all()
    }
    updates: list[tuple[Produto, int]] = []
    for produto_id, required_qty in required_per_product.items():
        produto = produtos.get(produto_id)
        if not produto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Produto {produto_id} não encontrado.",
            )
        if not produto.controla_estoque:
            continue
        if produto.estoque_atual < required_qty:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Estoque insuficiente para '{produto.nome}'. "
                    f"Disponível: {produto.estoque_atual}, "
                    f"necessário: {required_qty}."
                ),
            )
        updates.append((produto, required_qty))

    for produto, required_qty in updates:
        produto.estoque_atual -= required_qty
