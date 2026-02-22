from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.adicional import Adicional
    from app.models.produto import Produto


class ProdutoAdicional(Base):
    __tablename__ = "produto_adicionais"
    __table_args__ = (
        UniqueConstraint("produto_id", "adicional_id", name="uq_produto_adicional"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    produto_id: Mapped[int] = mapped_column(
        ForeignKey("produtos.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    adicional_id: Mapped[int] = mapped_column(
        ForeignKey("adicionais.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    produto: Mapped["Produto"] = relationship(back_populates="adicionais_links")
    adicional: Mapped["Adicional"] = relationship(back_populates="produtos_links")
