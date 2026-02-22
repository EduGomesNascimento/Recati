from datetime import date

from fastapi import APIRouter, Depends, Query, Request, status
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.enums import StatusPedido
from app.schemas.common import PaginatedResponse
from app.schemas.pedido import (
    CupomHistoricoOut,
    ItemPedidoCreate,
    ItemPedidoUpdate,
    PedidoCreate,
    PedidoListOut,
    PedidoOut,
    PedidoStatusPatchIn,
)
from app.services import pedido_service

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])
templates = Jinja2Templates(directory="app/templates")


@router.post("", response_model=PedidoOut, status_code=status.HTTP_201_CREATED)
def create_pedido(payload: PedidoCreate, db: Session = Depends(get_db)) -> PedidoOut:
    return pedido_service.create_pedido(db, payload)


@router.get("", response_model=PaginatedResponse[PedidoListOut])
def list_pedidos(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=500),
    status: StatusPedido | None = Query(default=None),
    cliente_id: int | None = Query(default=None, ge=1),
    data_inicial: date | None = Query(default=None),
    data_final: date | None = Query(default=None),
    db: Session = Depends(get_db),
) -> PaginatedResponse[PedidoListOut]:
    items, total = pedido_service.list_pedidos(
        db,
        page=page,
        page_size=page_size,
        status_filter=status,
        cliente_id=cliente_id,
        data_inicial=data_inicial,
        data_final=data_final,
    )
    return PaginatedResponse[PedidoListOut](
        page=page,
        page_size=page_size,
        total=total,
        items=items,
    )


@router.get("/historico/cupons", response_model=list[CupomHistoricoOut])
def list_cupons_historico(
    data_inicial: date | None = Query(default=None),
    data_final: date | None = Query(default=None),
    status: StatusPedido | None = Query(default=None),
    cliente_id: int | None = Query(default=None, ge=1),
    somente_finalizados: bool = Query(default=True),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
) -> list[CupomHistoricoOut]:
    return pedido_service.list_cupons_historico(
        db=db,
        data_inicial=data_inicial,
        data_final=data_final,
        status_filter=status,
        cliente_id=cliente_id,
        somente_finalizados=somente_finalizados,
        limit=limit,
    )


@router.get("/{pedido_id}", response_model=PedidoOut)
def get_pedido(pedido_id: int, db: Session = Depends(get_db)) -> PedidoOut:
    return pedido_service.get_pedido_or_404(db, pedido_id)


@router.get("/{pedido_id}/cupom", response_class=HTMLResponse)
def get_cupom_comanda(
    pedido_id: int,
    request: Request,
    db: Session = Depends(get_db),
) -> HTMLResponse:
    cupom_data = pedido_service.get_cupom_data(db, pedido_id)
    return templates.TemplateResponse(
        request,
        "cupom.html",
        cupom_data,
    )


@router.post("/{pedido_id}/itens", response_model=PedidoOut)
def add_item(
    pedido_id: int,
    payload: ItemPedidoCreate,
    db: Session = Depends(get_db),
) -> PedidoOut:
    return pedido_service.add_item(db, pedido_id, payload)


@router.put("/{pedido_id}/itens/{item_id}", response_model=PedidoOut)
def update_item(
    pedido_id: int,
    item_id: int,
    payload: ItemPedidoUpdate,
    db: Session = Depends(get_db),
) -> PedidoOut:
    return pedido_service.update_item(db, pedido_id, item_id, payload)


@router.delete("/{pedido_id}/itens/{item_id}", response_model=PedidoOut)
def delete_item(pedido_id: int, item_id: int, db: Session = Depends(get_db)) -> PedidoOut:
    return pedido_service.delete_item(db, pedido_id, item_id)


@router.patch("/{pedido_id}/status", response_model=PedidoOut)
def patch_status(
    pedido_id: int,
    payload: PedidoStatusPatchIn,
    db: Session = Depends(get_db),
) -> PedidoOut:
    return pedido_service.change_status(db, pedido_id, payload.status)
