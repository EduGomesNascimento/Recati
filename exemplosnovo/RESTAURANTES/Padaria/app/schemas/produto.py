from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from pydantic import Field

from app.schemas.common import ORMBaseModel


class ProdutoBase(ORMBaseModel):
    nome: str = Field(min_length=2, max_length=120)
    categoria: str | None = Field(default=None, max_length=80)
    descricao: str | None = Field(default=None, max_length=1000)
    imagem_url: str | None = Field(default=None, max_length=255)
    preco: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    ativo: bool = True
    estoque_atual: int = Field(default=0, ge=0)
    adicional_ids: list[int] = Field(default_factory=list)


class ProdutoCreate(ProdutoBase):
    pass


class ProdutoUpdate(ProdutoBase):
    pass


class ProdutoOut(ProdutoBase):
    id: int
    criado_em: datetime


class EstoquePatchIn(ORMBaseModel):
    delta: int = Field(description="Valor para somar (positivo) ou subtrair (negativo).")
