from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.cliente import Cliente
from app.models.pedido import Pedido
from app.schemas.cliente import ClienteCreate, ClienteUpdate


def create_cliente(db: Session, payload: ClienteCreate) -> Cliente:
    cliente = Cliente(**payload.model_dump())
    db.add(cliente)
    db.commit()
    db.refresh(cliente)
    return cliente


def list_clientes(db: Session, page: int, page_size: int) -> tuple[list[Cliente], int]:
    total = db.scalar(select(func.count(Cliente.id))) or 0
    stmt = (
        select(Cliente)
        .order_by(Cliente.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    clientes = list(db.scalars(stmt).all())
    return clientes, int(total)


def get_cliente_or_404(db: Session, cliente_id: int) -> Cliente:
    cliente = db.get(Cliente, cliente_id)
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cliente {cliente_id} não encontrado.",
        )
    return cliente


def update_cliente(db: Session, cliente_id: int, payload: ClienteUpdate) -> Cliente:
    cliente = get_cliente_or_404(db, cliente_id)
    for key, value in payload.model_dump().items():
        setattr(cliente, key, value)
    db.commit()
    db.refresh(cliente)
    return cliente


def delete_cliente(db: Session, cliente_id: int) -> None:
    cliente = get_cliente_or_404(db, cliente_id)
    has_orders = db.scalar(
        select(func.count(Pedido.id)).where(Pedido.cliente_id == cliente_id)
    )
    if has_orders:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cliente possui pedidos e não pode ser removido.",
        )
    db.delete(cliente)
    db.commit()
