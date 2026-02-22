from __future__ import annotations

from datetime import datetime

from pydantic import Field

from app.schemas.common import ORMBaseModel


class ClienteBase(ORMBaseModel):
    nome: str = Field(min_length=2, max_length=120)
    telefone: str | None = Field(default=None, max_length=20)
    endereco: str | None = Field(default=None, max_length=255)


class ClienteCreate(ClienteBase):
    pass


class ClienteUpdate(ClienteBase):
    pass


class ClienteOut(ClienteBase):
    id: int
    criado_em: datetime
