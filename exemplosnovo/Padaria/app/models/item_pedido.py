from __future__ import annotations

from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Index, Numeric, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.item_adicional import ItemPedidoAdicional
    from app.models.pedido import Pedido
    from app.models.produto import Produto


class ItemPedido(Base):
    __tablename__ = "itens_pedido"
    __table_args__ = (
        Index("ix_itens_pedido_pedido_produto", "pedido_id", "produto_id"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    pedido_id: Mapped[int] = mapped_column(
        ForeignKey("pedidos.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    produto_id: Mapped[int] = mapped_column(
        ForeignKey("produtos.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    quantidade: Mapped[int] = mapped_column(nullable=False)
    preco_unitario: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    desconto: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
        default=0,
        server_default="0",
    )
    subtotal: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    observacoes: Mapped[str | None] = mapped_column(Text, nullable=True)

    pedido: Mapped["Pedido"] = relationship(back_populates="itens")
    produto: Mapped["Produto"] = relationship(back_populates="itens")
    adicionais: Mapped[list["ItemPedidoAdicional"]] = relationship(
        back_populates="item_pedido",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
