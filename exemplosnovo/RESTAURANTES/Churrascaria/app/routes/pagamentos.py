from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.pagamento import (
    PagamentoCreate,
    PagamentoMaquininhaConfirmar,
    PagamentoMaquininhaIniciar,
    PagamentoOut,
)
from app.services import pagamento_service

router = APIRouter(prefix="/pagamentos", tags=["Pagamentos"])


@router.get("", response_model=list[PagamentoOut])
def list_pagamentos(
    pedido_id: int | None = Query(default=None, ge=1),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=500, ge=1, le=5000),
    db: Session = Depends(get_db),
) -> list[PagamentoOut]:
    return pagamento_service.list_pagamentos(
        db,
        pedido_id,
        offset=offset,
        limit=limit,
    )


@router.post("", response_model=PagamentoOut, status_code=status.HTTP_201_CREATED)
def create_pagamento(payload: PagamentoCreate, db: Session = Depends(get_db)) -> PagamentoOut:
    return pagamento_service.create_pagamento_manual(db, payload)


@router.post("/maquininha/iniciar", response_model=PagamentoOut, status_code=status.HTTP_201_CREATED)
def iniciar_pagamento_maquininha(
    payload: PagamentoMaquininhaIniciar,
    db: Session = Depends(get_db),
) -> PagamentoOut:
    return pagamento_service.iniciar_pagamento_maquininha(db, payload)


@router.patch("/maquininha/{pagamento_id}/confirmar", response_model=PagamentoOut)
def confirmar_pagamento_maquininha(
    pagamento_id: int,
    payload: PagamentoMaquininhaConfirmar,
    db: Session = Depends(get_db),
) -> PagamentoOut:
    return pagamento_service.confirmar_pagamento_maquininha(db, pagamento_id, payload)


@router.post("/maquininha/callback/{referencia}", response_model=PagamentoOut)
def callback_maquininha(
    referencia: str,
    payload: PagamentoMaquininhaConfirmar,
    db: Session = Depends(get_db),
) -> PagamentoOut:
    return pagamento_service.callback_maquininha_por_referencia(db, referencia, payload)
