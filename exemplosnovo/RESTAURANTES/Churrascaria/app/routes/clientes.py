from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.cliente import ClienteCreate, ClienteOut, ClienteUpdate
from app.schemas.common import PaginatedResponse
from app.services import cliente_service

router = APIRouter(prefix="/clientes", tags=["Clientes"])


@router.post("", response_model=ClienteOut, status_code=status.HTTP_201_CREATED)
def create_cliente(payload: ClienteCreate, db: Session = Depends(get_db)) -> ClienteOut:
    return cliente_service.create_cliente(db, payload)


@router.get("", response_model=PaginatedResponse[ClienteOut])
def list_clientes(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=500),
    db: Session = Depends(get_db),
) -> PaginatedResponse[ClienteOut]:
    items, total = cliente_service.list_clientes(db, page=page, page_size=page_size)
    return PaginatedResponse[ClienteOut](
        page=page,
        page_size=page_size,
        total=total,
        items=items,
    )


@router.get("/{cliente_id}", response_model=ClienteOut)
def get_cliente(cliente_id: int, db: Session = Depends(get_db)) -> ClienteOut:
    return cliente_service.get_cliente_or_404(db, cliente_id)


@router.put("/{cliente_id}", response_model=ClienteOut)
def update_cliente(
    cliente_id: int,
    payload: ClienteUpdate,
    db: Session = Depends(get_db),
) -> ClienteOut:
    return cliente_service.update_cliente(db, cliente_id, payload)


@router.delete("/{cliente_id}")
def delete_cliente(cliente_id: int, db: Session = Depends(get_db)) -> dict[str, str]:
    cliente_service.delete_cliente(db, cliente_id)
    return {"message": "Cliente removido com sucesso."}
