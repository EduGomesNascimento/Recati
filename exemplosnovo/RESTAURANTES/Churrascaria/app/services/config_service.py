from __future__ import annotations

from copy import deepcopy
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.erp_config import ERPConfig
from app.schemas.erp_config import ERPConfigPatchIn


def _default_config() -> dict[str, Any]:
    return {
        "empresa_nome": "ChurrascariaERP",
        "empresa_subtitulo": "Caixa, Pagamento e Fechamento",
        "email_rodape": "ChurrascariaERP",
        "logo_url": "/static/logo.png",
        "cor_primaria": "#d8252e",
        "cor_secundaria": "#860f12",
        "cor_topo_primaria": "#ce1d24",
        "cor_topo_secundaria": "#7f0d11",
        "tempo_real_segundos": 5,
        "tempo_real_ativo": True,
        "permitir_status_pronto": False,
        "finalizar_mobile_status": "ABERTO",
        "impressao_cozinha_automatica": True,
        "mobile_obs_rapidas": [
            "Mal passado",
            "Ao ponto",
            "Bem passado",
            "Sem sal",
            "Sem cebola",
        ],
        "mobile_mais_pedidos": [
            "Buffet",
            "Mini Espeto",
            "Espeto Completo",
            "Buffet Almoco",
            "Bebidas",
        ],
        "mobile_motivos_reabertura_entregue": [
            "Erro no status",
            "Pedido nao saiu completo",
            "Cliente solicitou ajuste",
            "Troca de item",
            "Falha na entrega",
        ],
    }


def _normalize_text_list(value: Any, fallback: list[str]) -> list[str]:
    if isinstance(value, list):
        raw_items = value
    elif isinstance(value, str):
        raw_items = value.splitlines()
    else:
        raw_items = []
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
    if clean_items:
        return clean_items
    return list(fallback)


def _normalize_payload(payload: Any) -> dict[str, Any]:
    clean = _default_config()
    if not payload:
        return clean
    if not isinstance(payload, dict):
        return clean
    for key, value in payload.items():
        if key in clean and value is not None:
            clean[key] = value
    clean["mobile_obs_rapidas"] = _normalize_text_list(
        clean.get("mobile_obs_rapidas"),
        _default_config()["mobile_obs_rapidas"],
    )
    clean["mobile_mais_pedidos"] = _normalize_text_list(
        clean.get("mobile_mais_pedidos"),
        [],
    )
    clean["mobile_motivos_reabertura_entregue"] = _normalize_text_list(
        clean.get("mobile_motivos_reabertura_entregue"),
        _default_config()["mobile_motivos_reabertura_entregue"],
    )
    # Compatibilidade com valores legados do fluxo antigo (EM_PREPARO/PRONTO).
    finalizar_mobile_status = str(clean.get("finalizar_mobile_status") or "").upper().strip()
    if finalizar_mobile_status not in {"ABERTO", "FINALIZADA"}:
        finalizar_mobile_status = "ABERTO"
    clean["finalizar_mobile_status"] = finalizar_mobile_status
    return clean


def _get_or_create(db: Session) -> ERPConfig:
    row = db.scalar(select(ERPConfig).where(ERPConfig.id == 1))
    if row:
        return row
    row = ERPConfig(id=1, payload=deepcopy(_default_config()))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def get_config(db: Session) -> dict[str, Any]:
    row = _get_or_create(db)
    normalized = _normalize_payload(row.payload)
    if normalized != row.payload:
        row.payload = normalized
        db.commit()
        db.refresh(row)
    return normalized


def update_config(db: Session, payload: ERPConfigPatchIn) -> dict[str, Any]:
    row = _get_or_create(db)
    current = _normalize_payload(row.payload)
    patch = payload.model_dump(exclude_none=True)
    for key, value in patch.items():
        current[key] = value
    row.payload = _normalize_payload(current)
    db.commit()
    db.refresh(row)
    return row.payload


def reset_config(db: Session) -> dict[str, Any]:
    row = _get_or_create(db)
    row.payload = _default_config()
    db.commit()
    db.refresh(row)
    return row.payload

