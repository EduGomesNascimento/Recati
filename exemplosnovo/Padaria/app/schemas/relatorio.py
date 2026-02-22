from __future__ import annotations

from datetime import date
from decimal import Decimal

from app.schemas.common import ORMBaseModel


class TopProdutoOut(ORMBaseModel):
    produto_id: int
    nome: str
    quantidade: int
    total: Decimal


class ResumoDiaOut(ORMBaseModel):
    data: date
    total_vendido: Decimal
    pedidos_por_status: dict[str, int]
    top_produtos: list[TopProdutoOut]


class FechamentoCaixaOut(ORMBaseModel):
    data: date
    total_pedidos: int
    pedidos_validos: int
    pedidos_cancelados: int
    total_vendido: Decimal
    total_recebido: Decimal
    total_cancelado: Decimal
    ticket_medio: Decimal
    pedidos_por_status: dict[str, int]
    pedidos_por_tipo_entrega: dict[str, int]
    faturamento_por_tipo_entrega: dict[str, Decimal]
    pagamentos_por_metodo: dict[str, Decimal]


class FaturamentoDiaOut(ORMBaseModel):
    data: date
    total_pedidos: int
    pedidos_validos: int
    pedidos_cancelados: int
    total_vendido: Decimal
    total_recebido: Decimal
    total_cancelado: Decimal
    ticket_medio: Decimal


class FaturamentoPeriodoOut(ORMBaseModel):
    data_inicial: date
    data_final: date
    total_pedidos: int
    pedidos_validos: int
    pedidos_cancelados: int
    total_vendido: Decimal
    total_recebido: Decimal
    total_cancelado: Decimal
    ticket_medio: Decimal
    pagamentos_por_metodo: dict[str, Decimal]
    dias: list[FaturamentoDiaOut]
