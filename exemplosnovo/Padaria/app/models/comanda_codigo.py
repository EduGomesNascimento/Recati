from __future__ import annotations

from datetime import datetime

import sqlalchemy as sa
from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class ComandaCodigo(Base):
    __tablename__ = "comanda_codigos"
    __table_args__ = (
        sa.Index("ix_comanda_codigos_ativo_em_uso", "ativo", "em_uso"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    codigo: Mapped[str] = mapped_column(String(50), nullable=False, unique=True, index=True)
    ativo: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default=sa.true(),
    )
    em_uso: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default=sa.false(),
    )
    status_visual: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="LIBERADO",
        server_default="LIBERADO",
        index=True,
    )
    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
