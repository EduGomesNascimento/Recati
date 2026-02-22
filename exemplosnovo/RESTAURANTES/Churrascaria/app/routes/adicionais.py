from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.adicional import AdicionalCreate, AdicionalOut, AdicionalUpdate
from app.services import adicional_service

router = APIRouter(prefix="/adicionais", tags=["Adicionais"])


@router.post("", response_model=AdicionalOut, status_code=status.HTTP_201_CREATED)
def create_adicional(payload: AdicionalCreate, db: Session = Depends(get_db)) -> AdicionalOut:
    return adicional_service.create_adicional(db, payload)


@router.get("", response_model=list[AdicionalOut])
def list_adicionais(
    ativo: bool | None = Query(default=None),
    q: str | None = Query(default=None, description="Busca por nome do adicional"),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=500, ge=1, le=5000),
    db: Session = Depends(get_db),
) -> list[AdicionalOut]:
    return adicional_service.list_adicionais(
        db,
        ativo=ativo,
        q=q,
        offset=offset,
        limit=limit,
    )


@router.get("/{adicional_id}", response_model=AdicionalOut)
def get_adicional(adicional_id: int, db: Session = Depends(get_db)) -> AdicionalOut:
    return adicional_service.get_adicional_or_404(db, adicional_id)


@router.put("/{adicional_id}", response_model=AdicionalOut)
def update_adicional(
    adicional_id: int,
    payload: AdicionalUpdate,
    db: Session = Depends(get_db),
) -> AdicionalOut:
    return adicional_service.update_adicional(db, adicional_id, payload)


@router.delete("/{adicional_id}", response_model=AdicionalOut)
def delete_adicional(
    adicional_id: int,
    hard: bool = Query(default=False, description="Exclui definitivamente quando true."),
    db: Session = Depends(get_db),
) -> AdicionalOut:
    if hard:
        return adicional_service.hard_delete_adicional(db, adicional_id)
    return adicional_service.deactivate_adicional(db, adicional_id)
