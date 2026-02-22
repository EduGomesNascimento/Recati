from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from pydantic import Field

from app.schemas.common import ORMBaseModel


class AdicionalBase(ORMBaseModel):
    nome: str = Field(min_length=2, max_length=120)
    preco: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    ativo: bool = True


class AdicionalCreate(AdicionalBase):
    pass


class AdicionalUpdate(AdicionalBase):
    pass


class AdicionalOut(AdicionalBase):
    id: int
    criado_em: datetime
