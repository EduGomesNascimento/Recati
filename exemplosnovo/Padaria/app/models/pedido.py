from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

import sqlalchemy as sa
from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.enums import StatusPedido, TipoEntrega

if TYPE_CHECKING:
    from app.models.cliente import Cliente
    from app.models.item_pedido import ItemPedido
    from app.models.pagamento import Pagamento


class Pedido(Base):
    __tablename__ = "pedidos"
    __table_args__ = (
        sa.Index("ix_pedidos_status_criado_em", "status", "criado_em"),
        sa.Index("ix_pedidos_tipo_criado_em", "tipo_entrega", "criado_em"),
        sa.Index("ix_pedidos_comanda_status", "comanda_codigo", "status"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    cliente_id: Mapped[int] = mapped_column(
        ForeignKey("clientes.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    comanda_codigo: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
        index=True,
    )
    mesa: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
        index=True,
    )
    status: Mapped[StatusPedido] = mapped_column(
        SQLEnum(StatusPedido, name="status_pedido", native_enum=False),
        nullable=False,
        default=StatusPedido.ABERTO,
        server_default=StatusPedido.ABERTO.value,
        index=True,
    )
    tipo_entrega: Mapped[TipoEntrega] = mapped_column(
        SQLEnum(TipoEntrega, name="tipo_entrega", native_enum=False),
        nullable=False,
    )
    observacoes: Mapped[str | None] = mapped_column(Text, nullable=True)
    total: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
        default=Decimal("0.00"),
        server_default=sa.text("0"),
    )
    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.now,
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    cliente: Mapped["Cliente"] = relationship(back_populates="pedidos")
    itens: Mapped[list["ItemPedido"]] = relationship(
        back_populates="pedido",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    pagamentos: Mapped[list["Pagamento"]] = relationship(
        back_populates="pedido",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
