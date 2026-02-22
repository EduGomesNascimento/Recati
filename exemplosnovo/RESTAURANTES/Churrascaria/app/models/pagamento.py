from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, Index, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.enums import MetodoPagamento, StatusPagamento

if TYPE_CHECKING:
    from app.models.pedido import Pedido


class Pagamento(Base):
    __tablename__ = "pagamentos"
    __table_args__ = (
        Index("ix_pagamentos_pedido_status", "pedido_id", "status"),
        Index("ix_pagamentos_status_criado_em", "status", "criado_em"),
        Index("ix_pagamentos_status_metodo_criado_em", "status", "metodo", "criado_em"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    pedido_id: Mapped[int] = mapped_column(
        ForeignKey("pedidos.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    metodo: Mapped[MetodoPagamento] = mapped_column(
        SQLEnum(MetodoPagamento, name="metodo_pagamento", native_enum=False),
        nullable=False,
        index=True,
    )
    status: Mapped[StatusPagamento] = mapped_column(
        SQLEnum(StatusPagamento, name="status_pagamento", native_enum=False),
        nullable=False,
        default=StatusPagamento.APROVADO,
        server_default=StatusPagamento.APROVADO.value,
        index=True,
    )
    valor: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    referencia_externa: Mapped[str | None] = mapped_column(String(80), nullable=True, index=True)
    maquininha_id: Mapped[str | None] = mapped_column(String(80), nullable=True)
    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.now,
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    pedido: Mapped["Pedido"] = relationship(back_populates="pagamentos")
