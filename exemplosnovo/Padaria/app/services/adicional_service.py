from __future__ import annotations

from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.adicional import Adicional
from app.models.item_adicional import ItemPedidoAdicional
from app.models.item_pedido import ItemPedido
from app.models.pedido import Pedido
from app.models.produto_adicional import ProdutoAdicional
from app.schemas.adicional import AdicionalCreate, AdicionalUpdate
from app.services.utils import as_money


def create_adicional(db: Session, payload: AdicionalCreate) -> Adicional:
    name = payload.nome.strip()
    existing = db.scalar(select(Adicional).where(func.lower(Adicional.nome) == name.lower()))
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Adicional '{name}' já existe.",
        )
    adicional = Adicional(
        nome=name,
        preco=payload.preco,
        ativo=payload.ativo,
    )
    db.add(adicional)
    db.commit()
    db.refresh(adicional)
    return adicional


def list_adicionais(
    db: Session,
    ativo: bool | None,
    q: str | None = None,
    offset: int = 0,
    limit: int = 500,
) -> list[Adicional]:
    stmt = select(Adicional)
    if ativo is not None:
        stmt = stmt.where(Adicional.ativo.is_(ativo))
    if q:
        stmt = stmt.where(Adicional.nome.ilike(f"%{q.strip()}%"))
    stmt = stmt.order_by(Adicional.nome.asc(), Adicional.id.asc()).offset(offset).limit(limit)
    return list(db.scalars(stmt).all())


def get_adicional_or_404(db: Session, adicional_id: int) -> Adicional:
    adicional = db.get(Adicional, adicional_id)
    if not adicional:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Adicional {adicional_id} não encontrado.",
        )
    return adicional


def update_adicional(db: Session, adicional_id: int, payload: AdicionalUpdate) -> Adicional:
    adicional = get_adicional_or_404(db, adicional_id)
    name = payload.nome.strip()
    existing = db.scalar(
        select(Adicional).where(
            func.lower(Adicional.nome) == name.lower(),
            Adicional.id != adicional_id,
        )
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Adicional '{name}' já existe.",
        )
    adicional.nome = name
    adicional.preco = payload.preco
    adicional.ativo = payload.ativo
    db.commit()
    db.refresh(adicional)
    return adicional


def deactivate_adicional(db: Session, adicional_id: int) -> Adicional:
    adicional = get_adicional_or_404(db, adicional_id)
    adicional.ativo = False
    db.commit()
    db.refresh(adicional)
    return adicional


def hard_delete_adicional(db: Session, adicional_id: int) -> Adicional:
    """
    Exclui adicional definitivamente, removendo das notas e dos vínculos de produto.
    """
    adicional = get_adicional_or_404(db, adicional_id)

    rows = list(
        db.scalars(
            select(ItemPedidoAdicional).where(ItemPedidoAdicional.adicional_id == adicional_id)
        ).all()
    )
    item_ids_afetados = sorted({int(row.item_pedido_id) for row in rows})

    pedido_ids_afetados: list[int] = []
    if item_ids_afetados:
        pedido_ids_afetados = sorted(
            {
                int(pedido_id)
                for pedido_id in db.scalars(
                    select(ItemPedido.pedido_id).where(ItemPedido.id.in_(item_ids_afetados))
                ).all()
            }
        )

    if rows:
        for row in rows:
            db.delete(row)
        db.flush()
        _recalculate_itens_totais(db, item_ids_afetados)
        _recalculate_pedidos_totais(db, pedido_ids_afetados)

    links = list(
        db.scalars(
            select(ProdutoAdicional).where(ProdutoAdicional.adicional_id == adicional_id)
        ).all()
    )
    for link in links:
        db.delete(link)

    db.delete(adicional)
    db.commit()
    # Atualiza cache de leitura das comandas apos exclusao em cascata.
    from app.services.comanda_service import invalidate_read_caches

    invalidate_read_caches()
    return adicional


def _recalculate_itens_totais(db: Session, item_ids: list[int]) -> None:
    if not item_ids:
        return
    itens = list(
        db.scalars(
            select(ItemPedido).where(ItemPedido.id.in_(item_ids))
        ).all()
    )
    if not itens:
        return

    adicionais_rows = db.execute(
        select(
            ItemPedidoAdicional.item_pedido_id,
            func.coalesce(func.sum(ItemPedidoAdicional.subtotal), Decimal("0.00")),
        )
        .where(ItemPedidoAdicional.item_pedido_id.in_(item_ids))
        .group_by(ItemPedidoAdicional.item_pedido_id)
    ).all()
    adicionais_map = {
        int(item_id): as_money(total)
        for item_id, total in adicionais_rows
    }

    for item in itens:
        base = as_money(item.preco_unitario * item.quantidade)
        adicionais_total = adicionais_map.get(int(item.id), as_money(0))
        bruto = as_money(base + adicionais_total)
        desconto = as_money(item.desconto or Decimal("0.00"))
        if desconto > bruto:
            desconto = bruto
        item.desconto = desconto
        item.subtotal = as_money(bruto - desconto)
    db.flush()


def _recalculate_pedidos_totais(db: Session, pedido_ids: list[int]) -> None:
    if not pedido_ids:
        return

    rows = db.execute(
        select(
            ItemPedido.pedido_id,
            func.coalesce(func.sum(ItemPedido.subtotal), Decimal("0.00")),
        )
        .where(ItemPedido.pedido_id.in_(pedido_ids))
        .group_by(ItemPedido.pedido_id)
    ).all()
    totals_map = {
        int(pedido_id): as_money(total)
        for pedido_id, total in rows
    }
    pedidos = list(
        db.scalars(
            select(Pedido).where(Pedido.id.in_(pedido_ids))
        ).all()
    )
    for pedido in pedidos:
        pedido.total = totals_map.get(int(pedido.id), as_money(0))
    db.flush()
