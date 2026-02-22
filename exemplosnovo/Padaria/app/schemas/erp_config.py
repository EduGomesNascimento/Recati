from __future__ import annotations

from typing import Literal

from pydantic import Field, field_validator

from app.schemas.common import ORMBaseModel


HEX_COLOR_PATTERN = r"^#[0-9A-Fa-f]{6}$"


class ERPConfigOut(ORMBaseModel):
    empresa_nome: str
    empresa_subtitulo: str
    email_rodape: str
    logo_url: str
    cor_primaria: str
    cor_secundaria: str
    cor_topo_primaria: str
    cor_topo_secundaria: str
    tempo_real_segundos: int
    tempo_real_ativo: bool
    permitir_status_pronto: bool
    finalizar_mobile_status: Literal["EM_PREPARO", "PRONTO"]
    impressao_cozinha_automatica: bool
    mobile_obs_rapidas: list[str]
    mobile_mais_pedidos: list[str]
    mobile_motivos_reabertura_entregue: list[str]
    layout_css_custom: str
    layout_textos_custom: dict[str, str]


class ERPConfigPatchIn(ORMBaseModel):
    empresa_nome: str | None = Field(default=None, min_length=1, max_length=120)
    empresa_subtitulo: str | None = Field(default=None, min_length=1, max_length=180)
    email_rodape: str | None = Field(default=None, min_length=3, max_length=180)
    logo_url: str | None = Field(default=None, min_length=1, max_length=255)
    cor_primaria: str | None = Field(default=None, pattern=HEX_COLOR_PATTERN)
    cor_secundaria: str | None = Field(default=None, pattern=HEX_COLOR_PATTERN)
    cor_topo_primaria: str | None = Field(default=None, pattern=HEX_COLOR_PATTERN)
    cor_topo_secundaria: str | None = Field(default=None, pattern=HEX_COLOR_PATTERN)
    tempo_real_segundos: int | None = Field(default=None, ge=2, le=120)
    tempo_real_ativo: bool | None = None
    permitir_status_pronto: bool | None = None
    finalizar_mobile_status: Literal["EM_PREPARO", "PRONTO"] | None = None
    impressao_cozinha_automatica: bool | None = None
    mobile_obs_rapidas: list[str] | None = None
    mobile_mais_pedidos: list[str] | None = None
    mobile_motivos_reabertura_entregue: list[str] | None = None
    layout_css_custom: str | None = Field(default=None, max_length=20000)
    layout_textos_custom: dict[str, str] | None = None

    @field_validator(
        "empresa_nome",
        "empresa_subtitulo",
        "email_rodape",
        "logo_url",
        mode="before",
    )
    @classmethod
    def _clean_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        clean = str(value).strip()
        return clean or None

    @field_validator(
        "mobile_obs_rapidas",
        "mobile_mais_pedidos",
        "mobile_motivos_reabertura_entregue",
        mode="before",
    )
    @classmethod
    def _clean_text_list(cls, value: list[str] | str | None) -> list[str] | None:
        if value is None:
            return None
        raw_items = value if isinstance(value, list) else str(value).splitlines()
        clean_items: list[str] = []
        seen: set[str] = set()
        for raw in raw_items:
            text = str(raw).strip()
            if not text:
                continue
            text = text[:120]
            key = text.casefold()
            if key in seen:
                continue
            seen.add(key)
            clean_items.append(text)
            if len(clean_items) >= 30:
                break
        return clean_items or None

    @field_validator("layout_css_custom", mode="before")
    @classmethod
    def _clean_css_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        text = str(value).strip()
        if not text:
            return None
        return text[:20000]

    @field_validator("layout_textos_custom", mode="before")
    @classmethod
    def _clean_layout_texts(
        cls, value: dict[str, str] | None
    ) -> dict[str, str] | None:
        if value is None:
            return None
        if not isinstance(value, dict):
            raise ValueError("layout_textos_custom deve ser um objeto JSON.")
        clean: dict[str, str] = {}
        for raw_key, raw_text in value.items():
            key = str(raw_key).strip()[:80]
            text = str(raw_text).strip()[:220]
            if not key or not text:
                continue
            clean[key] = text
            if len(clean) >= 60:
                break
        return clean or None
