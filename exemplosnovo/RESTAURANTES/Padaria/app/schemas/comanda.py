from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from pydantic import Field

from app.models.enums import StatusPedido, TipoEntrega
from app.schemas.common import ORMBaseModel
from app.schemas.pagamento import ResumoPagamentoOut


class ComandaCodigoCreate(ORMBaseModel):
    codigo: str = Field(min_length=1, max_length=50)


class ComandaCodigoPatch(ORMBaseModel):
    ativo: bool


class ComandaCodigoLiberarIn(ORMBaseModel):
    confirmar: bool = False


class ComandaCodigoOut(ORMBaseModel):
    id: int
    codigo: str
    ativo: bool
    em_uso: bool
    status_visual: str
    criado_em: datetime


class ComandaCodigoDeleteOut(ORMBaseModel):
    id: int
    codigo: str
    removido: bool


class ComandaPainelOut(ORMBaseModel):
    codigo_id: int
    codigo: str
    ativo: bool
    em_uso: bool
    status: str
    pedido_id: int | None = None
    mesa: str | None = None
    tipo_entrega: TipoEntrega | None = None
    total: Decimal = Decimal("0.00")
    criado_em: datetime | None = None


class ComandaAbrirIn(ORMBaseModel):
    codigo: str = Field(min_length=1, max_length=50)
    tipo_entrega: TipoEntrega = TipoEntrega.RETIRADA
    mesa: str | None = Field(default=None, max_length=30)
    observacoes: str | None = None


class ItemAdicionalIn(ORMBaseModel):
    adicional_id: int = Field(gt=0)
    quantidade: int = Field(gt=0)


class ItemAdicionalOut(ORMBaseModel):
    id: int
    adicional_id: int
    nome: str
    quantidade: int
    preco_unitario: Decimal
    subtotal: Decimal


class ComandaItemCreate(ORMBaseModel):
    produto_id: int = Field(gt=0)
    quantidade: int = Field(gt=0)
    desconto: Decimal = Field(default=Decimal("0.00"), ge=0, max_digits=10, decimal_places=2)
    observacoes: str | None = None
    adicionais: list[ItemAdicionalIn] = Field(default_factory=list)


class ComandaItemUpdate(ORMBaseModel):
    produto_id: int | None = Field(default=None, gt=0)
    quantidade: int = Field(gt=0)
    desconto: Decimal = Field(default=Decimal("0.00"), ge=0, max_digits=10, decimal_places=2)
    observacoes: str | None = None
    adicionais: list[ItemAdicionalIn] = Field(default_factory=list)


class ComandaItemMoveIn(ORMBaseModel):
    destino_pedido_id: int = Field(gt=0)


class ComandaItemOut(ORMBaseModel):
    id: int
    pedido_id: int
    produto_id: int
    produto_nome: str
    quantidade: int
    observacoes: str | None
    preco_unitario: Decimal
    desconto: Decimal
    subtotal: Decimal
    adicionais: list[ItemAdicionalOut] = Field(default_factory=list)


class ComandaStatusPatchIn(ORMBaseModel):
    status: StatusPedido
    repor_estoque: bool = True
    confirmar_reabertura: bool = False
    motivo_status: str | None = Field(default=None, max_length=255)


class ComandaListOut(ORMBaseModel):
    id: int
    comanda_codigo: str
    mesa: str | None
    status: StatusPedido
    tipo_entrega: TipoEntrega
    total: Decimal
    total_itens: int = 0
    complexidade: str = "Sem itens"
    criado_em: datetime


class ComandaOut(ORMBaseModel):
    id: int
    comanda_codigo: str
    mesa: str | None
    status: StatusPedido
    tipo_entrega: TipoEntrega
    observacoes: str | None
    total: Decimal
    total_itens: int = 0
    complexidade: str = "Sem itens"
    criado_em: datetime
    itens: list[ComandaItemOut] = Field(default_factory=list)
    pagamento: ResumoPagamentoOut


class SugestaoProdutoOut(ORMBaseModel):
    produto_id: int
    nome: str
    imagem_url: str | None
    preco: Decimal
    quantidade_total: int


class ComandaResetOut(ORMBaseModel):
    comandas_resetadas: int
    itens_afetados: int
    codigos_liberados: int
    estoque_reposto_total: int


class ComandaDeleteOut(ORMBaseModel):
    comanda_id: int
    comanda_codigo: str
    itens_removidos: int
    pagamentos_removidos: int
    estoque_reposto_total: int


class ComandaResetItemOut(ORMBaseModel):
    pedido_id: int
    comanda_codigo: str
    status_anterior: StatusPedido
    comanda_liberada: bool
    estoque_reposto_total: int
