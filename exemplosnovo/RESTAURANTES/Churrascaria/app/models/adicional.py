from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

import sqlalchemy as sa
from sqlalchemy import Boolean, DateTime, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.item_adicional import ItemPedidoAdicional
    from app.models.produto_adicional import ProdutoAdicional


class Adicional(Base):
    __tablename__ = "adicionais"
    __table_args__ = (
        sa.Index("ix_adicionais_ativo_id", "ativo", "id"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nome: Mapped[str] = mapped_column(String(120), nullable=False, unique=True, index=True)
    preco: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    ativo: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default=sa.true(),
    )
    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    itens: Mapped[list["ItemPedidoAdicional"]] = relationship(back_populates="adicional")
    produtos_links: Mapped[list["ProdutoAdicional"]] = relationship(
        back_populates="adicional"
    )
