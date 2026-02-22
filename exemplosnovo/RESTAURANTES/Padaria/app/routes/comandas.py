from datetime import date
from decimal import Decimal

from fastapi import APIRouter, Depends, Query, Request, status
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.enums import StatusPedido, TipoEntrega
from app.schemas.comanda import (
    ComandaAbrirIn,
    ComandaCodigoCreate,
    ComandaCodigoDeleteOut,
    ComandaCodigoLiberarIn,
    ComandaCodigoOut,
    ComandaPainelOut,
    ComandaCodigoPatch,
    ComandaDeleteOut,
    ComandaItemCreate,
    ComandaItemMoveIn,
    ComandaItemUpdate,
    ComandaListOut,
    ComandaOut,
    ComandaResetItemOut,
    ComandaResetOut,
    ComandaStatusPatchIn,
    SugestaoProdutoOut,
)
from app.services import comanda_service

router = APIRouter(prefix="/comandas", tags=["Comandas"])
templates = Jinja2Templates(directory="app/templates")


@router.post("/codigos", response_model=ComandaCodigoOut, status_code=status.HTTP_201_CREATED)
def create_codigo(
    payload: ComandaCodigoCreate,
    db: Session = Depends(get_db),
) -> ComandaCodigoOut:
    return comanda_service.create_codigo(db, payload.codigo)


@router.get("/codigos", response_model=list[ComandaCodigoOut])
def list_codigos(
    ativo: bool | None = Query(default=None),
    em_uso: bool | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[ComandaCodigoOut]:
    return comanda_service.list_codigos(db, ativo, em_uso)


@router.get("/painel", response_model=list[ComandaPainelOut])
def list_painel_comandas(
    ativo: bool = Query(default=True),
    db: Session = Depends(get_db),
) -> list[ComandaPainelOut]:
    return comanda_service.list_painel_comandas(db, ativo=ativo)


@router.patch("/codigos/{codigo_id}", response_model=ComandaCodigoOut)
def patch_codigo(
    codigo_id: int,
    payload: ComandaCodigoPatch,
    db: Session = Depends(get_db),
) -> ComandaCodigoOut:
    return comanda_service.patch_codigo_ativo(db, codigo_id, payload.ativo)


@router.post("/codigos/{codigo_id}/liberar", response_model=ComandaCodigoOut)
def liberar_codigo(
    codigo_id: int,
    payload: ComandaCodigoLiberarIn,
    db: Session = Depends(get_db),
) -> ComandaCodigoOut:
    return comanda_service.liberar_codigo(db, codigo_id, confirmar=payload.confirmar)


@router.delete("/codigos/{codigo_id}", response_model=ComandaCodigoDeleteOut)
def delete_codigo(codigo_id: int, db: Session = Depends(get_db)) -> ComandaCodigoDeleteOut:
    return comanda_service.delete_codigo(db, codigo_id)


@router.post("/abrir", response_model=ComandaOut, status_code=status.HTTP_201_CREATED)
def abrir_comanda(payload: ComandaAbrirIn, db: Session = Depends(get_db)) -> ComandaOut:
    return comanda_service.abrir_comanda(db, payload)


@router.get("", response_model=list[ComandaListOut])
def list_comandas(
    status: StatusPedido | None = Query(default=None),
    tipo_entrega: TipoEntrega | None = Query(default=None),
    codigo: str | None = Query(default=None),
    mesa: str | None = Query(default=None),
    data_inicial: date | None = Query(default=None),
    data_final: date | None = Query(default=None),
    total_min: Decimal | None = Query(default=None, ge=0),
    total_max: Decimal | None = Query(default=None, ge=0),
    order_by: str = Query(default="id"),
    order_dir: str = Query(default="desc"),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=500, ge=1, le=5000),
    db: Session = Depends(get_db),
) -> list[ComandaListOut]:
    return comanda_service.list_comandas(
        db,
        status_filter=status,
        tipo_entrega=tipo_entrega,
        codigo=codigo,
        mesa=mesa,
        data_inicial=data_inicial,
        data_final=data_final,
        total_min=total_min,
        total_max=total_max,
        order_by=order_by,
        order_dir=order_dir,
        offset=offset,
        limit=limit,
    )


@router.get("/historico/cupons")
def list_historico_cupons(
    data_inicial: date | None = Query(default=None),
    data_final: date | None = Query(default=None),
    status: StatusPedido | None = Query(default=None),
    somente_finalizadas: bool = Query(default=True),
    limit: int = Query(default=200, ge=1, le=1000),
    db: Session = Depends(get_db),
) -> list[dict]:
    return comanda_service.list_historico(
        db,
        data_inicial=data_inicial,
        data_final=data_final,
        status_filter=status,
        somente_finalizadas=somente_finalizadas,
        limit=limit,
    )


@router.get("/sugestoes/mais-pedidos", response_model=list[SugestaoProdutoOut])
def list_sugestoes_mais_pedidos(
    limit: int = Query(default=8, ge=1, le=30),
    db: Session = Depends(get_db),
) -> list[SugestaoProdutoOut]:
    return comanda_service.list_sugestoes_mais_pedidos(db, limit=limit)


@router.post("/resetar-ativas", response_model=ComandaResetOut)
def resetar_comandas_ativas(db: Session = Depends(get_db)) -> ComandaResetOut:
    return comanda_service.resetar_comandas_ativas(db)


@router.get("/{pedido_id}", response_model=ComandaOut)
def get_comanda(pedido_id: int, db: Session = Depends(get_db)) -> ComandaOut:
    return comanda_service.get_comanda(db, pedido_id)


@router.delete("/{pedido_id}", response_model=ComandaDeleteOut)
def delete_comanda(pedido_id: int, db: Session = Depends(get_db)) -> ComandaDeleteOut:
    return comanda_service.delete_comanda(db, pedido_id)


@router.post("/{pedido_id}/reset", response_model=ComandaResetItemOut)
def reset_comanda_individual(
    pedido_id: int,
    db: Session = Depends(get_db),
) -> ComandaResetItemOut:
    return comanda_service.reset_comanda_individual(db, pedido_id)


@router.get("/{pedido_id}/cupom", response_class=HTMLResponse)
def get_cupom_comanda(
    pedido_id: int,
    request: Request,
    cozinha: bool = Query(default=False),
    auto_print: bool = Query(default=False),
    alteracao: bool = Query(default=False),
    db: Session = Depends(get_db),
) -> HTMLResponse:
    data = comanda_service.get_cupom_data(db, pedido_id)
    data["cozinha"] = cozinha
    data["auto_print"] = auto_print
    data["alteracao"] = alteracao
    template_name = "cupom_cozinha.html" if cozinha else "cupom_comanda.html"
    return templates.TemplateResponse(request, template_name, data)


@router.post("/{pedido_id}/itens", response_model=ComandaOut)
def add_item(
    pedido_id: int,
    payload: ComandaItemCreate,
    db: Session = Depends(get_db),
) -> ComandaOut:
    return comanda_service.add_item(db, pedido_id, payload)


@router.put("/{pedido_id}/itens/{item_id}", response_model=ComandaOut)
def update_item(
    pedido_id: int,
    item_id: int,
    payload: ComandaItemUpdate,
    db: Session = Depends(get_db),
) -> ComandaOut:
    return comanda_service.update_item(db, pedido_id, item_id, payload)


@router.delete("/{pedido_id}/itens/{item_id}", response_model=ComandaOut)
def delete_item(pedido_id: int, item_id: int, db: Session = Depends(get_db)) -> ComandaOut:
    return comanda_service.delete_item(db, pedido_id, item_id)


@router.delete("/{pedido_id}/itens/{item_id}/forcar", response_model=ComandaOut)
def force_delete_item(
    pedido_id: int,
    item_id: int,
    repor_estoque: bool = Query(default=True),
    db: Session = Depends(get_db),
) -> ComandaOut:
    return comanda_service.delete_item(
        db,
        pedido_id,
        item_id,
        forcar=True,
        repor_estoque=repor_estoque,
    )


@router.post("/{pedido_id}/itens/{item_id}/mover", response_model=ComandaOut)
def move_item(
    pedido_id: int,
    item_id: int,
    payload: ComandaItemMoveIn,
    db: Session = Depends(get_db),
) -> ComandaOut:
    return comanda_service.move_item(
        db,
        pedido_id,
        item_id,
        payload.destino_pedido_id,
    )


@router.patch("/{pedido_id}/status", response_model=ComandaOut)
def patch_status(
    pedido_id: int,
    payload: ComandaStatusPatchIn,
    db: Session = Depends(get_db),
) -> ComandaOut:
    return comanda_service.change_status(
        db,
        pedido_id,
        payload.status,
        repor_estoque=payload.repor_estoque,
        confirmar_reabertura=payload.confirmar_reabertura,
        motivo_status=payload.motivo_status,
    )
