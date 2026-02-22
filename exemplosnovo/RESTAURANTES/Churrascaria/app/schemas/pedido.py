from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from pydantic import Field

from app.models.enums import StatusPedido, TipoEntrega
from app.schemas.common import ORMBaseModel


class PedidoCreate(ORMBaseModel):
    cliente_id: int = Field(gt=0)
    tipo_entrega: TipoEntrega
    observacoes: str | None = None


class PedidoStatusPatchIn(ORMBaseModel):
    status: StatusPedido


class ItemPedidoCreate(ORMBaseModel):
    produto_id: int = Field(gt=0)
    quantidade: int = Field(gt=0)


class ItemPedidoUpdate(ORMBaseModel):
    quantidade: int = Field(gt=0)


class ItemPedidoOut(ORMBaseModel):
    id: int
    pedido_id: int
    produto_id: int
    quantidade: int
    preco_unitario: Decimal
    subtotal: Decimal


class PedidoOut(ORMBaseModel):
    id: int
    cliente_id: int
    status: StatusPedido
    tipo_entrega: TipoEntrega
    observacoes: str | None
    total: Decimal
    criado_em: datetime
    itens: list[ItemPedidoOut] = Field(default_factory=list)


class PedidoListOut(ORMBaseModel):
    id: int
    cliente_id: int
    status: StatusPedido
    tipo_entrega: TipoEntrega
    total: Decimal
    criado_em: datetime


class CupomHistoricoOut(ORMBaseModel):
    pedido_id: int
    cliente_id: int
    cliente_nome: str
    status: StatusPedido
    tipo_entrega: TipoEntrega
    total: Decimal
    criado_em: datetime
