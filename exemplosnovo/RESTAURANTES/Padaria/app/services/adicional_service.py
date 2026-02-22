from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.adicional import Adicional
from app.models.item_adicional import ItemPedidoAdicional
from app.schemas.adicional import AdicionalCreate, AdicionalUpdate


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
    adicional = get_adicional_or_404(db, adicional_id)
    used_count = int(
        db.scalar(
            select(func.count()).where(ItemPedidoAdicional.adicional_id == adicional_id)
        )
        or 0
    )
    if used_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Adicional já utilizado em itens e não pode ser excluído definitivamente. "
                "Desative o adicional em vez de excluir."
            ),
        )
    db.delete(adicional)
    db.commit()
    return adicional
