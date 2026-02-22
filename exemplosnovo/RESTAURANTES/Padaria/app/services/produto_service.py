from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.models.adicional import Adicional
from app.models.item_pedido import ItemPedido
from app.models.produto import Produto
from app.models.produto_adicional import ProdutoAdicional
from app.schemas.produto import ProdutoCreate, ProdutoUpdate


def create_produto(db: Session, payload: ProdutoCreate) -> Produto:
    data = _normalize_produto_data(payload.model_dump())
    adicional_ids = data.pop("adicional_ids", [])
    produto = Produto(**data)
    db.add(produto)
    db.flush()
    _set_produto_adicionais(db, produto, adicional_ids)
    db.commit()
    db.refresh(produto)
    return produto


def list_produtos(
    db: Session,
    page: int,
    page_size: int,
    ativo: bool | None,
    q: str | None,
) -> tuple[list[Produto], int]:
    stmt = select(Produto).options(selectinload(Produto.adicionais_links))
    if ativo is not None:
        stmt = stmt.where(Produto.ativo.is_(ativo))
    if q:
        stmt = stmt.where(Produto.nome.ilike(f"%{q.strip()}%"))

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = int(db.scalar(count_stmt) or 0)

    items_stmt = (
        stmt.order_by(Produto.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    produtos = list(db.scalars(items_stmt).all())
    return produtos, total


def get_produto_or_404(db: Session, produto_id: int) -> Produto:
    produto = db.scalar(
        select(Produto)
        .options(selectinload(Produto.adicionais_links))
        .where(Produto.id == produto_id)
    )
    if not produto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Produto {produto_id} não encontrado.",
        )
    return produto


def update_produto(db: Session, produto_id: int, payload: ProdutoUpdate) -> Produto:
    produto = get_produto_or_404(db, produto_id)
    data = _normalize_produto_data(payload.model_dump())
    adicional_ids = data.pop("adicional_ids", [])
    for key, value in data.items():
        setattr(produto, key, value)
    _set_produto_adicionais(db, produto, adicional_ids)
    db.commit()
    db.refresh(produto)
    return produto


def patch_estoque(db: Session, produto_id: int, delta: int) -> Produto:
    produto = get_produto_or_404(db, produto_id)
    novo_estoque = produto.estoque_atual + delta
    if novo_estoque < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Estoque insuficiente para ajuste. Atual: {produto.estoque_atual}, "
                f"delta solicitado: {delta}."
            ),
        )
    produto.estoque_atual = novo_estoque
    db.commit()
    db.refresh(produto)
    return produto


def deactivate_produto(db: Session, produto_id: int) -> Produto:
    produto = get_produto_or_404(db, produto_id)
    produto.ativo = False
    db.commit()
    db.refresh(produto)
    return produto


def hard_delete_produto(db: Session, produto_id: int) -> Produto:
    produto = get_produto_or_404(db, produto_id)
    used_count = int(
        db.scalar(
            select(func.count()).where(ItemPedido.produto_id == produto_id)
        )
        or 0
    )
    if used_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Produto já utilizado em pedidos/comandas e não pode ser excluído "
                "definitivamente. Desative o produto em vez de excluir."
            ),
        )
    db.delete(produto)
    db.commit()
    return produto


def _normalize_produto_data(data: dict) -> dict:
    normalized = dict(data)
    normalized["nome"] = str(normalized.get("nome", "")).strip()
    normalized["categoria"] = _clean_nullable_str(normalized.get("categoria"))
    normalized["descricao"] = _clean_nullable_str(normalized.get("descricao"))
    normalized["imagem_url"] = _clean_nullable_str(normalized.get("imagem_url"))
    return normalized


def _clean_nullable_str(value: str | None) -> str | None:
    if value is None:
        return None
    cleaned = str(value).strip()
    return cleaned or None


def _set_produto_adicionais(db: Session, produto: Produto, adicional_ids: list[int]) -> None:
    clean_ids = sorted({int(ad_id) for ad_id in adicional_ids if int(ad_id) > 0})
    if not clean_ids:
        produto.adicionais_links = []
        db.flush()
        return

    rows = list(
        db.scalars(
            select(Adicional).where(
                Adicional.id.in_(clean_ids),
                Adicional.ativo.is_(True),
            )
        ).all()
    )
    found_ids = {row.id for row in rows}
    missing = [ad_id for ad_id in clean_ids if ad_id not in found_ids]
    if missing:
        missing_txt = ", ".join(str(v) for v in missing)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Adicionais inválidos/inativos para o produto: {missing_txt}.",
        )

    produto.adicionais_links = [ProdutoAdicional(adicional_id=ad_id) for ad_id in clean_ids]
    db.flush()
