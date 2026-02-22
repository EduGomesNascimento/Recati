from __future__ import annotations

from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, JSON, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class ERPConfig(Base):
    __tablename__ = "erp_config"

    id: Mapped[int] = mapped_column(primary_key=True, default=1)
    payload: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False, default=dict)
    atualizado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
        index=True,
    )
