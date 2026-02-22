from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from pydantic import Field

from app.models.enums import MetodoPagamento, StatusPagamento
from app.schemas.common import ORMBaseModel


class PagamentoCreate(ORMBaseModel):
    pedido_id: int = Field(gt=0)
    valor: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    metodo: MetodoPagamento


class PagamentoMaquininhaIniciar(ORMBaseModel):
    pedido_id: int = Field(gt=0)
    valor: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    metodo: MetodoPagamento = MetodoPagamento.CARTAO_DEBITO
    maquininha_id: str | None = Field(default=None, max_length=80)


class PagamentoMaquininhaConfirmar(ORMBaseModel):
    aprovado: bool
    referencia_externa: str | None = Field(default=None, max_length=80)


class PagamentoOut(ORMBaseModel):
    id: int
    pedido_id: int
    metodo: MetodoPagamento
    status: StatusPagamento
    valor: Decimal
    referencia_externa: str | None
    maquininha_id: str | None
    criado_em: datetime


class ResumoPagamentoOut(ORMBaseModel):
    total_comanda: Decimal
    total_pago: Decimal
    saldo_pendente: Decimal
