from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.erp_config import ERPConfigOut, ERPConfigPatchIn
from app.services import config_service

router = APIRouter(prefix="/config", tags=["Configuração"])


@router.get("/erp", response_model=ERPConfigOut)
def get_erp_config(db: Session = Depends(get_db)) -> ERPConfigOut:
    return config_service.get_config(db)


@router.patch("/erp", response_model=ERPConfigOut)
def patch_erp_config(payload: ERPConfigPatchIn, db: Session = Depends(get_db)) -> ERPConfigOut:
    return config_service.update_config(db, payload)


@router.post("/erp/reset", response_model=ERPConfigOut)
def reset_erp_config(db: Session = Depends(get_db)) -> ERPConfigOut:
    return config_service.reset_config(db)
