from __future__ import annotations

from decimal import Decimal
from uuid import uuid4

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.enums import MetodoPagamento, StatusPagamento
from app.models.pagamento import Pagamento
from app.models.pedido import Pedido
from app.schemas.pagamento import (
    PagamentoCreate,
    PagamentoMaquininhaConfirmar,
    PagamentoMaquininhaIniciar,
)
from app.services.utils import as_money


def list_pagamentos(
    db: Session,
    pedido_id: int | None,
    offset: int = 0,
    limit: int = 500,
) -> list[Pagamento]:
    stmt = select(Pagamento)
    if pedido_id is not None:
        stmt = stmt.where(Pagamento.pedido_id == pedido_id)
    stmt = stmt.order_by(Pagamento.id.desc()).offset(offset).limit(limit)
    return list(db.scalars(stmt).all())


def create_pagamento_manual(db: Session, payload: PagamentoCreate) -> Pagamento:
    pedido = _get_pedido_or_404(db, payload.pedido_id)
    valor = as_money(payload.valor)
    _validate_valor_exato_no_saldo(db, pedido, valor)

    pagamento = Pagamento(
        pedido_id=payload.pedido_id,
        metodo=payload.metodo,
        valor=valor,
        status=StatusPagamento.APROVADO,
    )
    db.add(pagamento)
    db.commit()
    db.refresh(pagamento)
    _invalidate_comanda_read_caches()
    return pagamento


def iniciar_pagamento_maquininha(
    db: Session,
    payload: PagamentoMaquininhaIniciar,
) -> Pagamento:
    pedido = _get_pedido_or_404(db, payload.pedido_id)
    if payload.metodo not in {MetodoPagamento.CARTAO_DEBITO, MetodoPagamento.CARTAO_CREDITO}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Método de maquininha deve ser CARTAO_DEBITO ou CARTAO_CREDITO.",
        )

    valor = as_money(payload.valor)
    _validate_valor_exato_no_saldo(db, pedido, valor)

    pagamento = Pagamento(
        pedido_id=payload.pedido_id,
        metodo=payload.metodo,
        valor=valor,
        status=StatusPagamento.PENDENTE,
        referencia_externa=f"TX-{uuid4().hex[:12].upper()}",
        maquininha_id=payload.maquininha_id,
    )
    db.add(pagamento)
    db.commit()
    db.refresh(pagamento)
    _invalidate_comanda_read_caches()
    return pagamento


def confirmar_pagamento_maquininha(
    db: Session,
    pagamento_id: int,
    payload: PagamentoMaquininhaConfirmar,
) -> Pagamento:
    pagamento = _get_pagamento_or_404(db, pagamento_id)
    if pagamento.status != StatusPagamento.PENDENTE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Somente pagamentos pendentes podem ser confirmados.",
        )

    if payload.aprovado:
        pedido = _get_pedido_or_404(db, pagamento.pedido_id)
        _validate_valor_exato_no_saldo(db, pedido, as_money(pagamento.valor))

    pagamento.status = StatusPagamento.APROVADO if payload.aprovado else StatusPagamento.RECUSADO
    if payload.referencia_externa:
        pagamento.referencia_externa = payload.referencia_externa
    db.commit()
    db.refresh(pagamento)
    _invalidate_comanda_read_caches()
    return pagamento


def callback_maquininha_por_referencia(
    db: Session,
    referencia: str,
    payload: PagamentoMaquininhaConfirmar,
) -> Pagamento:
    pagamento = db.scalar(select(Pagamento).where(Pagamento.referencia_externa == referencia))
    if not pagamento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pagamento com referência {referencia} não encontrado.",
        )
    return confirmar_pagamento_maquininha(db, pagamento.id, payload)


def resumo_pagamentos_pedido(db: Session, pedido_id: int, total_comanda: Decimal) -> dict:
    total_pago = db.scalar(
        select(func.coalesce(func.sum(Pagamento.valor), 0)).where(
            Pagamento.pedido_id == pedido_id,
            Pagamento.status == StatusPagamento.APROVADO,
        )
    )
    total_pago_money = as_money(total_pago or Decimal("0"))
    total_comanda_money = as_money(total_comanda)
    saldo = _non_negative_money(total_comanda_money - total_pago_money)
    return {
        "total_comanda": total_comanda_money,
        "total_pago": total_pago_money,
        "saldo_pendente": saldo,
    }


def resumo_pagamentos_lista(pagamentos: list[Pagamento], total_comanda: Decimal) -> dict:
    total_pago = sum(
        (as_money(pagamento.valor) for pagamento in pagamentos if pagamento.status == StatusPagamento.APROVADO),
        start=Decimal("0"),
    )
    total_pago_money = as_money(total_pago)
    total_comanda_money = as_money(total_comanda)
    saldo = _non_negative_money(total_comanda_money - total_pago_money)
    return {
        "total_comanda": total_comanda_money,
        "total_pago": total_pago_money,
        "saldo_pendente": saldo,
    }


def _get_pagamento_or_404(db: Session, pagamento_id: int) -> Pagamento:
    pagamento = db.get(Pagamento, pagamento_id)
    if not pagamento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pagamento {pagamento_id} não encontrado.",
        )
    return pagamento


def _get_pedido_or_404(db: Session, pedido_id: int) -> Pedido:
    pedido = db.get(Pedido, pedido_id)
    if not pedido:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Comanda/Pedido {pedido_id} não encontrado.",
        )
    return pedido


def _validate_valor_exato_no_saldo(db: Session, pedido: Pedido, valor_pagamento: Decimal) -> None:
    saldo_pendente = _saldo_pendente_pedido(db, pedido.id, pedido.total)
    if saldo_pendente <= Decimal("0"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Comanda já quitada. Não é permitido registrar novo pagamento.",
        )

    valor_money = as_money(valor_pagamento)
    if valor_money != saldo_pendente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Pagamento deve ser exatamente igual ao saldo pendente. "
                f"Saldo: R$ {saldo_pendente:.2f} | informado: R$ {valor_money:.2f}."
            ),
        )


def _saldo_pendente_pedido(db: Session, pedido_id: int, total_comanda: Decimal) -> Decimal:
    total_pago = db.scalar(
        select(func.coalesce(func.sum(Pagamento.valor), 0)).where(
            Pagamento.pedido_id == pedido_id,
            Pagamento.status == StatusPagamento.APROVADO,
        )
    )
    total_pago_money = as_money(total_pago or Decimal("0"))
    total_comanda_money = as_money(total_comanda)
    return _non_negative_money(total_comanda_money - total_pago_money)


def _non_negative_money(value: Decimal) -> Decimal:
    return as_money(value if value > Decimal("0") else Decimal("0"))


def _invalidate_comanda_read_caches() -> None:
    # Import local para evitar ciclo de import entre serviços.
    from app.services.comanda_service import invalidate_read_caches

    invalidate_read_caches()
