from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

import sqlalchemy as sa
from sqlalchemy import Boolean, DateTime, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.item_pedido import ItemPedido
    from app.models.produto_adicional import ProdutoAdicional


class Produto(Base):
    __tablename__ = "produtos"
    __table_args__ = (
        sa.Index("ix_produtos_ativo_id", "ativo", "id"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nome: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    categoria: Mapped[str | None] = mapped_column(String(80), nullable=True, index=True)
    descricao: Mapped[str | None] = mapped_column(Text, nullable=True)
    imagem_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    preco: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    ativo: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default=sa.true(),
    )
    estoque_atual: Mapped[int] = mapped_column(
        nullable=False,
        default=0,
        server_default="0",
    )
    controla_estoque: Mapped[bool] = mapped_column(
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

    itens: Mapped[list["ItemPedido"]] = relationship(back_populates="produto")
    adicionais_links: Mapped[list["ProdutoAdicional"]] = relationship(
        back_populates="produto",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    @property
    def adicional_ids(self) -> list[int]:
        return sorted([link.adicional_id for link in self.adicionais_links])
