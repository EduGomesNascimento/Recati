from __future__ import annotations

from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Index, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.adicional import Adicional
    from app.models.item_pedido import ItemPedido


class ItemPedidoAdicional(Base):
    __tablename__ = "itens_pedido_adicionais"
    __table_args__ = (
        Index(
            "ix_itens_pedido_adicionais_item_adicional",
            "item_pedido_id",
            "adicional_id",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    item_pedido_id: Mapped[int] = mapped_column(
        ForeignKey("itens_pedido.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    adicional_id: Mapped[int] = mapped_column(
        ForeignKey("adicionais.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    quantidade: Mapped[int] = mapped_column(nullable=False, default=1)
    preco_unitario: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    subtotal: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

    item_pedido: Mapped["ItemPedido"] = relationship(back_populates="adicionais")
    adicional: Mapped["Adicional"] = relationship(back_populates="itens")
