from __future__ import annotations

from copy import deepcopy
from datetime import date, datetime, time
from decimal import Decimal
from threading import Lock
from time import monotonic

from fastapi import HTTPException, status
from sqlalchemy import asc, desc, func, select
from sqlalchemy.orm import Session, joinedload

from app.models.adicional import Adicional
from app.models.cliente import Cliente
from app.models.comanda_codigo import ComandaCodigo
from app.models.enums import StatusPedido, TipoEntrega
from app.models.item_adicional import ItemPedidoAdicional
from app.models.item_pedido import ItemPedido
from app.models.pedido import Pedido
from app.models.pedido_cozinha_snapshot import PedidoCozinhaSnapshot
from app.models.produto import Produto
from app.models.produto_adicional import ProdutoAdicional
from app.schemas.comanda import ComandaAbrirIn, ComandaItemCreate, ComandaItemUpdate
from app.services import pagamento_service
from app.services.utils import as_money

STATUS_TRANSITIONS: dict[StatusPedido, set[StatusPedido]] = {
    StatusPedido.ABERTO: {StatusPedido.EM_PREPARO, StatusPedido.CANCELADO},
    StatusPedido.EM_PREPARO: {StatusPedido.PRONTO, StatusPedido.ENTREGUE, StatusPedido.CANCELADO},
    StatusPedido.PRONTO: {StatusPedido.ENTREGUE, StatusPedido.CANCELADO},
    StatusPedido.ENTREGUE: {StatusPedido.EM_PREPARO},
    StatusPedido.CANCELADO: set(),
}

CLIENTE_BALCAO_NOME = "Balcao"
ITEM_EDITABLE_STATUSES = {
    StatusPedido.ABERTO,
    StatusPedido.EM_PREPARO,
    StatusPedido.PRONTO,
    StatusPedido.ENTREGUE,
}
STOCK_CONTROLLED_STATUSES = {
    StatusPedido.EM_PREPARO,
    StatusPedido.PRONTO,
    StatusPedido.ENTREGUE,
}
STATUS_VISUAL_LIBERADO = "LIBERADO"
STATUS_VISUALS_VALIDOS = {
    STATUS_VISUAL_LIBERADO,
    StatusPedido.ABERTO.value,
    StatusPedido.EM_PREPARO.value,
    StatusPedido.PRONTO.value,
    StatusPedido.ENTREGUE.value,
    StatusPedido.CANCELADO.value,
}

READ_CACHE_TTL_SECONDS = 1.0
READ_CACHE_MAX_ITEMS = 512
_cache_lock = Lock()
_cache_generation = 0
_cache_list_comandas: dict[tuple, tuple[float, list[dict]]] = {}
_cache_list_painel: dict[tuple, tuple[float, list[dict]]] = {}
_cache_list_historico: dict[tuple, tuple[float, list[dict]]] = {}
_cache_sugestoes: dict[tuple, tuple[float, list[dict]]] = {}
_cache_comanda: dict[tuple, tuple[float, dict]] = {}


def invalidate_read_caches() -> None:
    global _cache_generation
    with _cache_lock:
        _cache_generation += 1
        _cache_list_comandas.clear()
        _cache_list_painel.clear()
        _cache_list_historico.clear()
        _cache_sugestoes.clear()
        _cache_comanda.clear()


def _next_cache_key(*parts) -> tuple:
    with _cache_lock:
        generation = _cache_generation
    return (generation, *parts)


def _cache_read(cache: dict, key: tuple):
    now = monotonic()
    with _cache_lock:
        item = cache.get(key)
        if not item:
            return None
        expires_at, payload = item
        if expires_at < now:
            cache.pop(key, None)
            return None
        return deepcopy(payload)


def _cache_write(cache: dict, key: tuple, payload) -> None:
    now = monotonic()
    with _cache_lock:
        if len(cache) >= READ_CACHE_MAX_ITEMS:
            expired = [k for k, (expires, _value) in cache.items() if expires < now]
            for expired_key in expired:
                cache.pop(expired_key, None)
            if len(cache) >= READ_CACHE_MAX_ITEMS:
                first_key = next(iter(cache))
                cache.pop(first_key, None)
        cache[key] = (now + READ_CACHE_TTL_SECONDS, deepcopy(payload))


def create_codigo(db: Session, codigo_raw: str) -> ComandaCodigo:
    codigo = _normalize_codigo(codigo_raw)
    existing = db.scalar(select(ComandaCodigo).where(ComandaCodigo.codigo == codigo))
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Código de comanda '{codigo}' já cadastrado.",
        )
    code = ComandaCodigo(
        codigo=codigo,
        ativo=True,
        em_uso=False,
        status_visual=STATUS_VISUAL_LIBERADO,
    )
    db.add(code)
    db.commit()
    db.refresh(code)
    invalidate_read_caches()
    return code


def list_codigos(db: Session, ativo: bool | None, em_uso: bool | None) -> list[ComandaCodigo]:
    _purge_historico_if_due(db)
    stmt = select(ComandaCodigo)
    if ativo is not None:
        stmt = stmt.where(ComandaCodigo.ativo.is_(ativo))
    if em_uso is not None:
        stmt = stmt.where(ComandaCodigo.em_uso.is_(em_uso))
    rows = list(db.scalars(stmt.order_by(ComandaCodigo.codigo.asc())).all())
    for code in rows:
        if code.status_visual not in STATUS_VISUALS_VALIDOS:
            code.status_visual = STATUS_VISUAL_LIBERADO
    return rows


def list_painel_comandas(db: Session, ativo: bool = True) -> list[dict]:
    _purge_historico_if_due(db)
    cache_key = _next_cache_key("list_painel_comandas", bool(ativo))
    cached = _cache_read(_cache_list_painel, cache_key)
    if cached is not None:
        return cached

    stmt = select(ComandaCodigo)
    if ativo:
        stmt = stmt.where(ComandaCodigo.ativo.is_(True))
    codigos = list(db.scalars(stmt.order_by(ComandaCodigo.codigo.asc())).all())
    if not codigos:
        return []

    codigos_map = {row.codigo: row for row in codigos}
    pedidos = list(
        db.scalars(
            select(Pedido)
            .where(Pedido.comanda_codigo.in_(codigos_map.keys()))
            .order_by(Pedido.id.desc())
        ).all()
    )
    ultimo_pedido_por_codigo: dict[str, Pedido] = {}
    for pedido in pedidos:
        codigo = pedido.comanda_codigo
        if not codigo:
            continue
        if codigo not in ultimo_pedido_por_codigo:
            ultimo_pedido_por_codigo[codigo] = pedido

    # Precalcula o último pedido "ativo" por código para evitar N+1 queries
    # durante a montagem do painel quando status_visual está em aberto/preparo/pronto.
    status_ativos = {
        StatusPedido.ABERTO.value,
        StatusPedido.EM_PREPARO.value,
        StatusPedido.PRONTO.value,
    }
    ultimo_pedido_ativo_por_codigo: dict[str, Pedido] = {}
    for pedido in pedidos:
        codigo = pedido.comanda_codigo
        if not codigo or codigo in ultimo_pedido_ativo_por_codigo:
            continue
        if pedido.status.value in status_ativos:
            ultimo_pedido_ativo_por_codigo[codigo] = pedido

    payload: list[dict] = []
    for code in codigos:
        status_visual = code.status_visual or STATUS_VISUAL_LIBERADO
        if status_visual not in STATUS_VISUALS_VALIDOS:
            status_visual = STATUS_VISUAL_LIBERADO
            code.status_visual = status_visual
        pedido = ultimo_pedido_por_codigo.get(code.codigo)
        if status_visual in status_ativos and (not pedido or pedido.status.value != status_visual):
            pedido_ativo = ultimo_pedido_ativo_por_codigo.get(code.codigo)
            if pedido_ativo and pedido_ativo.status.value == status_visual:
                pedido = pedido_ativo
            else:
                pedido = None
        payload.append(
            {
                "codigo_id": code.id,
                "codigo": code.codigo,
                "ativo": code.ativo,
                "em_uso": code.em_uso,
                "status": status_visual,
                "pedido_id": pedido.id if pedido else None,
                "mesa": pedido.mesa if pedido else None,
                "tipo_entrega": pedido.tipo_entrega if pedido else None,
                "total": as_money(pedido.total) if pedido else as_money(0),
                "criado_em": pedido.criado_em if pedido else None,
            }
        )
    _cache_write(_cache_list_painel, cache_key, payload)
    return payload


def liberar_codigo(db: Session, codigo_id: int, confirmar: bool = False) -> ComandaCodigo:
    code = db.get(ComandaCodigo, codigo_id)
    if not code:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Código de comanda {codigo_id} não encontrado.",
        )
    if code.em_uso:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível liberar um código em uso.",
        )
    if code.status_visual in {StatusPedido.ENTREGUE.value, StatusPedido.CANCELADO.value} and not confirmar:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Confirmação obrigatória para liberar comanda entregue/cancelada.",
        )
    code.status_visual = STATUS_VISUAL_LIBERADO
    db.commit()
    db.refresh(code)
    invalidate_read_caches()
    return code


def patch_codigo_ativo(db: Session, codigo_id: int, ativo: bool) -> ComandaCodigo:
    code = db.get(ComandaCodigo, codigo_id)
    if not code:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Código de comanda {codigo_id} não encontrado.",
        )
    if not ativo and code.em_uso:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível desativar um código de comanda em uso.",
        )
    code.ativo = ativo
    db.commit()
    db.refresh(code)
    invalidate_read_caches()
    return code


def delete_codigo(db: Session, codigo_id: int) -> dict:
    code = db.get(ComandaCodigo, codigo_id)
    if not code:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Código de comanda {codigo_id} não encontrado.",
        )
    if code.em_uso:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível excluir um código em uso.",
        )
    payload = {
        "id": code.id,
        "codigo": code.codigo,
        "removido": True,
    }
    db.delete(code)
    db.commit()
    invalidate_read_caches()
    return payload


def abrir_comanda(db: Session, payload: ComandaAbrirIn) -> dict:
    codigo = _normalize_codigo(payload.codigo)
    mesa_normalizada = _normalize_optional_text(payload.mesa)
    if payload.tipo_entrega == TipoEntrega.ENTREGA and not mesa_normalizada:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mesa e obrigatoria para comandas do tipo ENTREGA.",
        )
    code = db.scalar(select(ComandaCodigo).where(ComandaCodigo.codigo == codigo))
    if not code:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Código de comanda '{codigo}' não encontrado.",
        )
    if not code.ativo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Código de comanda '{codigo}' está desativado.",
        )
    if code.em_uso:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Código de comanda '{codigo}' já está em uso.",
        )

    cliente_bal = _get_or_create_cliente_balcao(db)
    pedido = Pedido(
        cliente_id=cliente_bal.id,
        comanda_codigo=codigo,
        tipo_entrega=payload.tipo_entrega,
        mesa=mesa_normalizada,
        observacoes=_normalize_optional_text(payload.observacoes),
        status=StatusPedido.ABERTO,
        total=as_money(0),
    )
    code.em_uso = True
    code.status_visual = StatusPedido.ABERTO.value
    db.add(pedido)
    db.commit()
    invalidate_read_caches()
    return get_comanda(db, pedido.id)


def list_comandas(
    db: Session,
    status_filter: StatusPedido | None,
    tipo_entrega: TipoEntrega | None,
    codigo: str | None,
    mesa: str | None,
    data_inicial: date | None,
    data_final: date | None,
    total_min: Decimal | None,
    total_max: Decimal | None,
    order_by: str,
    order_dir: str,
    offset: int = 0,
    limit: int = 500,
) -> list[dict]:
    _purge_historico_if_due(db)
    stmt = select(Pedido).where(Pedido.comanda_codigo.is_not(None))
    if status_filter is not None:
        stmt = stmt.where(Pedido.status == status_filter)
    if tipo_entrega is not None:
        stmt = stmt.where(Pedido.tipo_entrega == tipo_entrega)
    if codigo:
        stmt = stmt.where(Pedido.comanda_codigo.ilike(f"%{codigo.strip()}%"))
    if mesa:
        stmt = stmt.where(Pedido.mesa.ilike(f"%{mesa.strip()}%"))
    if data_inicial is not None:
        stmt = stmt.where(Pedido.criado_em >= datetime.combine(data_inicial, time.min))
    if data_final is not None:
        stmt = stmt.where(Pedido.criado_em <= datetime.combine(data_final, time.max))
    if total_min is not None:
        stmt = stmt.where(Pedido.total >= total_min)
    if total_max is not None:
        stmt = stmt.where(Pedido.total <= total_max)

    if total_min is not None and total_max is not None and total_min > total_max:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filtro inválido: total_min não pode ser maior que total_max.",
        )

    order_columns = {
        "id": Pedido.id,
        "criado_em": Pedido.criado_em,
        "codigo": Pedido.comanda_codigo,
        "mesa": Pedido.mesa,
        "status": Pedido.status,
        "tipo_entrega": Pedido.tipo_entrega,
        "total": Pedido.total,
    }
    if order_by not in order_columns:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"order_by inválido: {order_by}.",
        )
    if order_dir not in {"asc", "desc"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"order_dir inválido: {order_dir}.",
        )

    cache_key = _next_cache_key(
        "list_comandas",
        status_filter.value if status_filter else None,
        tipo_entrega.value if tipo_entrega else None,
        (codigo or "").strip().lower(),
        (mesa or "").strip().lower(),
        data_inicial.isoformat() if data_inicial else None,
        data_final.isoformat() if data_final else None,
        str(total_min) if total_min is not None else None,
        str(total_max) if total_max is not None else None,
        order_by,
        order_dir,
        offset,
        limit,
    )
    cached = _cache_read(_cache_list_comandas, cache_key)
    if cached is not None:
        return cached

    order_column = order_columns[order_by]
    order_expr = asc(order_column) if order_dir == "asc" else desc(order_column)
    stmt = stmt.order_by(order_expr, desc(Pedido.id)).offset(offset).limit(limit)
    comandas = list(db.scalars(stmt).all())
    if not comandas:
        _cache_write(_cache_list_comandas, cache_key, [])
        return []

    comanda_ids = [c.id for c in comandas]
    totais_itens_rows = db.execute(
        select(
            ItemPedido.pedido_id,
            func.coalesce(func.sum(ItemPedido.quantidade), 0),
        )
        .where(ItemPedido.pedido_id.in_(comanda_ids))
        .group_by(ItemPedido.pedido_id)
    ).all()
    total_itens_por_comanda = {pedido_id: int(total_itens) for pedido_id, total_itens in totais_itens_rows}

    payload = [
        {
            "id": c.id,
            "comanda_codigo": c.comanda_codigo or f"#{c.id}",
            "mesa": c.mesa,
            "status": c.status,
            "tipo_entrega": c.tipo_entrega,
            "total": as_money(c.total),
            "total_itens": total_itens_por_comanda.get(c.id, 0),
            "complexidade": _classificar_complexidade(total_itens_por_comanda.get(c.id, 0)),
            "criado_em": c.criado_em,
        }
        for c in comandas
    ]
    _cache_write(_cache_list_comandas, cache_key, payload)
    return payload


def _purge_historico_if_due(db: Session) -> None:
    now = datetime.now()
    if now.weekday() != 6 or now.hour < 23:
        return
    pedidos = list(
        db.scalars(
            select(Pedido).where(
                Pedido.comanda_codigo.is_not(None),
                Pedido.status.in_([StatusPedido.ENTREGUE, StatusPedido.CANCELADO]),
            )
        ).all()
    )
    if not pedidos:
        return
    codigos_liberados: set[str] = set()
    for pedido in pedidos:
        if pedido.comanda_codigo:
            codigos_liberados.add(pedido.comanda_codigo)
        pedido.comanda_codigo = None
    for codigo in codigos_liberados:
        _release_comanda_codigo(db, codigo, status_visual=STATUS_VISUAL_LIBERADO)
    db.commit()
    invalidate_read_caches()


def list_historico(
    db: Session,
    data_inicial: date | None,
    data_final: date | None,
    status_filter: StatusPedido | None,
    somente_finalizadas: bool,
    limit: int,
) -> list[dict]:
    _purge_historico_if_due(db)
    cache_key = _next_cache_key(
        "list_historico",
        data_inicial.isoformat() if data_inicial else None,
        data_final.isoformat() if data_final else None,
        status_filter.value if status_filter else None,
        somente_finalizadas,
        limit,
    )
    cached = _cache_read(_cache_list_historico, cache_key)
    if cached is not None:
        return cached

    stmt = select(Pedido).where(Pedido.comanda_codigo.is_not(None))
    if status_filter is not None:
        stmt = stmt.where(Pedido.status == status_filter)
    elif somente_finalizadas:
        stmt = stmt.where(Pedido.status.in_([StatusPedido.ENTREGUE, StatusPedido.CANCELADO]))

    if data_inicial is not None:
        stmt = stmt.where(Pedido.criado_em >= datetime.combine(data_inicial, time.min))
    if data_final is not None:
        stmt = stmt.where(Pedido.criado_em <= datetime.combine(data_final, time.max))

    rows = list(db.scalars(stmt.order_by(desc(Pedido.criado_em)).limit(limit)).all())
    payload = [
        {
            "pedido_id": p.id,
            "cliente_id": p.cliente_id,
            "cliente_nome": CLIENTE_BALCAO_NOME,
            "status": p.status,
            "tipo_entrega": p.tipo_entrega,
            "mesa": p.mesa,
            "total": as_money(p.total),
            "criado_em": p.criado_em,
            "comanda_codigo": p.comanda_codigo or f"#{p.id}",
        }
        for p in rows
    ]
    _cache_write(_cache_list_historico, cache_key, payload)
    return payload


def list_sugestoes_mais_pedidos(db: Session, limit: int = 8) -> list[dict]:
    cache_key = _next_cache_key("list_sugestoes_mais_pedidos", limit)
    cached = _cache_read(_cache_sugestoes, cache_key)
    if cached is not None:
        return cached

    quantidade = func.coalesce(func.sum(ItemPedido.quantidade), 0).label("quantidade_total")
    rows = db.execute(
        select(
            Produto.id,
            Produto.nome,
            Produto.imagem_url,
            Produto.preco,
            quantidade,
        )
        .join(ItemPedido, ItemPedido.produto_id == Produto.id)
        .join(Pedido, Pedido.id == ItemPedido.pedido_id)
        .where(
            Pedido.comanda_codigo.is_not(None),
            Pedido.status != StatusPedido.CANCELADO,
        )
        .group_by(Produto.id, Produto.nome, Produto.imagem_url, Produto.preco)
        .order_by(desc("quantidade_total"), Produto.nome.asc())
        .limit(limit)
    ).all()
    payload = [
        {
            "produto_id": produto_id,
            "nome": nome,
            "imagem_url": imagem_url,
            "preco": as_money(preco),
            "quantidade_total": int(qtd),
        }
        for produto_id, nome, imagem_url, preco, qtd in rows
    ]
    _cache_write(_cache_sugestoes, cache_key, payload)
    return payload


def resetar_comandas_ativas(db: Session) -> dict:
    # Limpa toda comanda ainda vinculada a um codigo, mantendo historico financeiro
    # e devolvendo os codigos para o estado LIBERADO.
    pedidos = list(
        db.execute(
            select(Pedido)
            .options(joinedload(Pedido.itens))
            .where(
                Pedido.comanda_codigo.is_not(None),
            )
            .order_by(Pedido.id.asc())
        )
        .unique()
        .scalars()
        .all()
    )

    itens_afetados = 0
    estoque_reposto_total = 0
    codigos_liberados: set[str] = set()
    estoque_por_produto: dict[int, int] = {}

    for pedido in pedidos:
        if pedido.comanda_codigo:
            codigos_liberados.add(pedido.comanda_codigo)
        itens_afetados += len(pedido.itens)

        if pedido.status in {StatusPedido.EM_PREPARO, StatusPedido.PRONTO}:
            for item in pedido.itens:
                estoque_por_produto[item.produto_id] = (
                    estoque_por_produto.get(item.produto_id, 0) + item.quantidade
                )

        pedido.status = StatusPedido.CANCELADO
        pedido.comanda_codigo = None

    produtos = {
        produto.id: produto
        for produto in db.scalars(
            select(Produto).where(Produto.id.in_(estoque_por_produto.keys()))
        ).all()
    }
    for produto_id, quantidade in estoque_por_produto.items():
        produto = produtos.get(produto_id)
        if produto and produto.controla_estoque:
            produto.estoque_atual += quantidade
            estoque_reposto_total += quantidade

    for codigo in codigos_liberados:
        _release_comanda_codigo(db, codigo, status_visual=STATUS_VISUAL_LIBERADO)

    # Garante recuperacao operacional apos reset em massa:
    # todo codigo cadastrado volta para uso livre, inclusive casos orfaos.
    codigos_cadastrados = list(
        db.scalars(
            select(ComandaCodigo)
        ).all()
    )
    for code in codigos_cadastrados:
        if code.em_uso or code.status_visual != STATUS_VISUAL_LIBERADO:
            code.em_uso = False
            code.status_visual = STATUS_VISUAL_LIBERADO
            codigos_liberados.add(code.codigo)

    db.commit()
    invalidate_read_caches()
    return {
        "comandas_resetadas": len(pedidos),
        "itens_afetados": itens_afetados,
        "codigos_liberados": len(codigos_liberados),
        "estoque_reposto_total": estoque_reposto_total,
    }


def reset_comanda_individual(db: Session, pedido_id: int) -> dict:
    pedido = _get_comanda_or_404(db, pedido_id)
    status_anterior = pedido.status
    comanda_codigo = pedido.comanda_codigo or f"#{pedido.id}"
    estoque_reposto_total = 0

    if pedido.status in {StatusPedido.EM_PREPARO, StatusPedido.PRONTO}:
        for item in pedido.itens:
            if _increment_stock_for_product(db, item.produto_id, item.quantidade):
                estoque_reposto_total += item.quantidade

    pedido.status = StatusPedido.CANCELADO
    _release_comanda_codigo(db, pedido.comanda_codigo, status_visual=STATUS_VISUAL_LIBERADO)
    pedido.comanda_codigo = None

    db.commit()
    invalidate_read_caches()
    return {
        "pedido_id": pedido_id,
        "comanda_codigo": comanda_codigo,
        "status_anterior": status_anterior,
        "comanda_liberada": True,
        "estoque_reposto_total": estoque_reposto_total,
    }


def get_comanda(db: Session, pedido_id: int) -> dict:
    cache_key = _next_cache_key("get_comanda", pedido_id)
    cached = _cache_read(_cache_comanda, cache_key)
    if cached is not None:
        return cached

    db.expire_all()
    pedido = _get_comanda_or_404(db, pedido_id)
    payload = _serialize_comanda(db, pedido)
    _cache_write(_cache_comanda, cache_key, payload)
    return payload


def add_item(db: Session, pedido_id: int, payload: ComandaItemCreate) -> dict:
    pedido = _get_comanda_or_404(db, pedido_id)
    _ensure_editable_order(pedido)
    produto = _get_produto_ativo_or_404(db, payload.produto_id)

    if _status_controla_estoque(pedido.status):
        _decrement_stock_for_product(db, produto.id, payload.quantidade)

    item = ItemPedido(
        pedido_id=pedido.id,
        produto_id=produto.id,
        quantidade=payload.quantidade,
        desconto=as_money(payload.desconto),
        observacoes=_normalize_optional_text(payload.observacoes),
        preco_unitario=as_money(produto.preco),
        subtotal=as_money(0),
    )
    db.add(item)
    db.flush()

    _replace_adicionais(db, item, payload.adicionais, produto.id)
    _recalculate_item_subtotal(item)
    _recalculate_comanda_total(db, pedido)
    db.commit()
    invalidate_read_caches()
    return get_comanda(db, pedido.id)


def update_item(db: Session, pedido_id: int, item_id: int, payload: ComandaItemUpdate) -> dict:
    pedido = _get_comanda_or_404(db, pedido_id)
    _ensure_editable_order(pedido)

    item = db.scalar(
        select(ItemPedido).where(
            ItemPedido.id == item_id,
            ItemPedido.pedido_id == pedido_id,
        )
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item {item_id} não encontrado na comanda {pedido_id}.",
        )

    old_produto_id = item.produto_id
    old_quantidade = item.quantidade
    next_produto_id = payload.produto_id or item.produto_id
    produto = _get_produto_ativo_or_404(db, next_produto_id)

    if _status_controla_estoque(pedido.status):
        _adjust_stock_on_item_change(
            db,
            old_produto_id=old_produto_id,
            old_quantidade=old_quantidade,
            new_produto_id=produto.id,
            new_quantidade=payload.quantidade,
        )

    item.produto_id = produto.id
    item.preco_unitario = as_money(produto.preco)
    item.quantidade = payload.quantidade
    item.desconto = as_money(payload.desconto)
    item.observacoes = _normalize_optional_text(payload.observacoes)
    _replace_adicionais(db, item, payload.adicionais, produto.id)
    _recalculate_item_subtotal(item)
    _recalculate_comanda_total(db, pedido)
    db.commit()
    invalidate_read_caches()
    return get_comanda(db, pedido.id)


def delete_item(
    db: Session,
    pedido_id: int,
    item_id: int,
    forcar: bool = False,
    repor_estoque: bool = True,
) -> dict:
    pedido = _get_comanda_or_404(db, pedido_id)
    if not forcar:
        _ensure_editable_order(pedido)
    elif pedido.status == StatusPedido.CANCELADO:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível alterar itens de comandas canceladas.",
        )
    elif pedido.status not in ITEM_EDITABLE_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status atual não permite alteração de itens.",
        )
    item = db.scalar(
        select(ItemPedido).where(
            ItemPedido.id == item_id,
            ItemPedido.pedido_id == pedido_id,
        )
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item {item_id} não encontrado na comanda {pedido_id}.",
        )

    deve_repor = repor_estoque if forcar else True
    if deve_repor and _status_controla_estoque(pedido.status):
        _increment_stock_for_product(db, item.produto_id, item.quantidade)

    db.delete(item)
    db.flush()
    _recalculate_comanda_total(db, pedido)
    db.commit()
    invalidate_read_caches()
    return get_comanda(db, pedido.id)


def move_item(
    db: Session,
    pedido_id: int,
    item_id: int,
    destino_pedido_id: int,
) -> dict:
    if pedido_id == destino_pedido_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Comanda de origem e destino devem ser diferentes.",
        )

    origem = _get_comanda_or_404(db, pedido_id)
    destino = _get_comanda_or_404(db, destino_pedido_id)
    _ensure_editable_order(origem)
    _ensure_editable_order(destino)

    item = db.scalar(
        select(ItemPedido).where(
            ItemPedido.id == item_id,
            ItemPedido.pedido_id == origem.id,
        )
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item {item_id} não encontrado na comanda {pedido_id}.",
        )

    origem_controla = _status_controla_estoque(origem.status)
    destino_controla = _status_controla_estoque(destino.status)
    if origem_controla and not destino_controla:
        _increment_stock_for_product(db, item.produto_id, item.quantidade)
    elif not origem_controla and destino_controla:
        _decrement_stock_for_product(db, item.produto_id, item.quantidade)

    novo_item = ItemPedido(
        pedido_id=destino.id,
        produto_id=item.produto_id,
        quantidade=item.quantidade,
        desconto=as_money(item.desconto),
        observacoes=item.observacoes,
        preco_unitario=as_money(item.preco_unitario),
        subtotal=as_money(item.subtotal),
    )
    db.add(novo_item)
    db.flush()

    for adicional in item.adicionais:
        novo_item.adicionais.append(
            ItemPedidoAdicional(
                adicional_id=adicional.adicional_id,
                quantidade=adicional.quantidade,
                preco_unitario=as_money(adicional.preco_unitario),
                subtotal=as_money(adicional.subtotal),
            )
        )

    db.delete(item)
    db.flush()
    _recalculate_comanda_total(db, origem)
    _recalculate_comanda_total(db, destino)
    db.commit()
    invalidate_read_caches()
    return get_comanda(db, origem.id)


def change_status(
    db: Session,
    pedido_id: int,
    new_status: StatusPedido,
    repor_estoque: bool = True,
    confirmar_reabertura: bool = False,
    motivo_status: str | None = None,
) -> dict:
    pedido = _get_comanda_or_404(db, pedido_id)
    if pedido.status == new_status:
        return get_comanda(db, pedido.id)

    # Reabertura entregue -> em preparo e tratada como regra operacional explicita.
    # Mantemos essa excecao aqui para evitar bloqueio por tabela de transicao.
    is_reabertura_entregue = (
        pedido.status == StatusPedido.ENTREGUE and new_status == StatusPedido.EM_PREPARO
    )
    allowed = STATUS_TRANSITIONS.get(pedido.status, set())
    if new_status not in allowed and not is_reabertura_entregue:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Transição inválida: {pedido.status.value} -> {new_status.value}.",
        )
    if pedido.status == StatusPedido.ABERTO and new_status == StatusPedido.EM_PREPARO:
        _decrement_stock_for_order(db, pedido)
    if (
        new_status == StatusPedido.CANCELADO
        and pedido.status in {StatusPedido.EM_PREPARO, StatusPedido.PRONTO}
        and repor_estoque
    ):
        _increment_stock_for_order(db, pedido)

    if is_reabertura_entregue:
        if not confirmar_reabertura:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Confirme a reabertura da comanda para voltar para EM_PREPARO.",
            )
        motivo_clean = _normalize_optional_text(motivo_status)
        if not motivo_clean:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Informe ao menos um motivo para reabrir a comanda entregue.",
            )
        registro = f"[Reabertura {datetime.now().strftime('%d/%m/%Y %H:%M')}] {motivo_clean}"
        if pedido.observacoes:
            pedido.observacoes = f"{pedido.observacoes}\n{registro}"
        else:
            pedido.observacoes = registro

    pedido.status = new_status
    codigo_entity = None
    if pedido.comanda_codigo:
        codigo_entity = db.scalar(
            select(ComandaCodigo).where(ComandaCodigo.codigo == pedido.comanda_codigo)
        )
    if codigo_entity:
        codigo_entity.status_visual = new_status.value
        codigo_entity.em_uso = new_status not in {StatusPedido.ENTREGUE, StatusPedido.CANCELADO}
    elif new_status in {StatusPedido.ENTREGUE, StatusPedido.CANCELADO}:
        _release_comanda_codigo(db, pedido.comanda_codigo, status_visual=new_status.value)
    db.commit()
    invalidate_read_caches()
    return get_comanda(db, pedido.id)


def delete_comanda(db: Session, pedido_id: int) -> dict:
    pedido = _get_comanda_or_404(db, pedido_id)
    comanda_codigo = pedido.comanda_codigo or f"#{pedido.id}"
    itens_removidos = len(pedido.itens)
    pagamentos_removidos = len(pedido.pagamentos)
    estoque_reposto_total = 0

    if pedido.status in {StatusPedido.EM_PREPARO, StatusPedido.PRONTO}:
        reposicao_por_produto: dict[int, int] = {}
        for item in pedido.itens:
            reposicao_por_produto[item.produto_id] = (
                reposicao_por_produto.get(item.produto_id, 0) + item.quantidade
            )
        produtos = {
            produto.id: produto
            for produto in db.scalars(
                select(Produto).where(Produto.id.in_(reposicao_por_produto.keys()))
            ).all()
        }
        for produto_id, quantidade in reposicao_por_produto.items():
            produto = produtos.get(produto_id)
            if produto and produto.controla_estoque:
                produto.estoque_atual += quantidade
                estoque_reposto_total += quantidade

    _release_comanda_codigo(db, pedido.comanda_codigo, status_visual=STATUS_VISUAL_LIBERADO)
    db.delete(pedido)
    db.commit()
    invalidate_read_caches()
    return {
        "comanda_id": pedido_id,
        "comanda_codigo": comanda_codigo,
        "itens_removidos": itens_removidos,
        "pagamentos_removidos": pagamentos_removidos,
        "estoque_reposto_total": estoque_reposto_total,
    }


def get_cupom_data(db: Session, pedido_id: int, cozinha: bool = False) -> dict:
    pedido = _get_comanda_or_404(db, pedido_id)
    pagamento = pagamento_service.resumo_pagamentos_lista(pedido.pagamentos, pedido.total)
    total_itens = _total_itens_da_comanda(pedido)

    itens_data = []
    for item in pedido.itens:
        ad_rows = [
            {
                "nome": ad.adicional.nome if ad.adicional else f"Adicional {ad.adicional_id}",
                "quantidade": ad.quantidade,
                "preco_unitario": as_money(ad.preco_unitario),
                "subtotal": as_money(ad.subtotal),
            }
            for ad in item.adicionais
        ]
        itens_data.append(
            {
                "id": item.id,
                "produto": item.produto.nome if item.produto else f"Produto {item.produto_id}",
                "quantidade": item.quantidade,
                "observacoes": item.observacoes,
                "preco_unitario": as_money(item.preco_unitario),
                "desconto": as_money(item.desconto),
                "subtotal": as_money(item.subtotal),
                "adicionais": ad_rows,
            }
        )

    diferencas_cozinha: list[str] = []
    if cozinha:
        snapshot_atual = _build_cozinha_snapshot(itens_data)
        snapshot_anterior = _get_last_cozinha_snapshot(db, pedido.id)
        diferencas_cozinha = _diff_cozinha_snapshots(snapshot_anterior, snapshot_atual)
        db.add(PedidoCozinhaSnapshot(pedido_id=pedido.id, payload=snapshot_atual))
        db.commit()

    return {
        "pedido_id": pedido.id,
        "comanda_codigo": pedido.comanda_codigo or f"#{pedido.id}",
        "mesa": pedido.mesa,
        "status": pedido.status.value,
        "tipo_entrega": pedido.tipo_entrega.value,
        "observacoes": pedido.observacoes,
        "total_itens": total_itens,
        "complexidade": _classificar_complexidade(total_itens),
        "criado_em": pedido.criado_em,
        "total": as_money(pedido.total),
        "total_pago": pagamento["total_pago"],
        "saldo_pendente": pagamento["saldo_pendente"],
        "itens": itens_data,
        "diferencas_cozinha": diferencas_cozinha,
    }


def _build_cozinha_snapshot(itens_data: list[dict]) -> list[dict]:
    snapshot: list[dict] = []
    for item in itens_data:
        adicionais = sorted(
            [
                {
                    "nome": str(ad.get("nome") or "").strip(),
                    "quantidade": int(ad.get("quantidade") or 0),
                }
                for ad in item.get("adicionais", [])
            ],
            key=lambda row: (row.get("nome", ""), row.get("quantidade", 0)),
        )
        snapshot.append(
            {
                "item_id": int(item.get("id") or 0),
                "produto": str(item.get("produto") or "").strip(),
                "quantidade": int(item.get("quantidade") or 0),
                "observacoes": str(item.get("observacoes") or "").strip(),
                "adicionais": [
                    ad for ad in adicionais if ad["nome"] and ad["quantidade"] > 0
                ],
            }
        )
    return snapshot


def _get_last_cozinha_snapshot(db: Session, pedido_id: int) -> list[dict]:
    row = db.scalar(
        select(PedidoCozinhaSnapshot)
        .where(PedidoCozinhaSnapshot.pedido_id == pedido_id)
        .order_by(PedidoCozinhaSnapshot.id.desc())
        .limit(1)
    )
    if not row or not isinstance(row.payload, list):
        return []
    return row.payload


def _diff_cozinha_snapshots(previous: list[dict], current: list[dict]) -> list[str]:
    if not previous:
        return ["Primeira impressão da cozinha para esta comanda."]

    previous_map = {
        int(item.get("item_id") or 0): item
        for item in previous
        if int(item.get("item_id") or 0) > 0
    }
    current_map = {
        int(item.get("item_id") or 0): item
        for item in current
        if int(item.get("item_id") or 0) > 0
    }

    differences: list[str] = []

    previous_ids = set(previous_map.keys())
    current_ids = set(current_map.keys())
    added_ids = sorted(current_ids - previous_ids)
    removed_ids = sorted(previous_ids - current_ids)
    common_ids = sorted(previous_ids & current_ids)

    for item_id in added_ids:
        item = current_map[item_id]
        differences.append(
            f"Adicionado: {item.get('produto') or f'Item {item_id}'} x{int(item.get('quantidade') or 0)}."
        )

    for item_id in removed_ids:
        item = previous_map[item_id]
        differences.append(
            f"Removido: {item.get('produto') or f'Item {item_id}'} x{int(item.get('quantidade') or 0)}."
        )

    for item_id in common_ids:
        before = previous_map[item_id]
        after = current_map[item_id]
        nome_item = after.get("produto") or before.get("produto") or f"Item {item_id}"
        qty_before = int(before.get("quantidade") or 0)
        qty_after = int(after.get("quantidade") or 0)
        if qty_before != qty_after:
            differences.append(
                f"Quantidade alterada: {nome_item} de x{qty_before} para x{qty_after}."
            )

        obs_before = str(before.get("observacoes") or "").strip()
        obs_after = str(after.get("observacoes") or "").strip()
        if obs_before != obs_after:
            if obs_after:
                differences.append(f"Observação atualizada em {nome_item}: {obs_after}.")
            else:
                differences.append(f"Observação removida de {nome_item}.")

        ads_before = _format_snapshot_adicionais(before.get("adicionais"))
        ads_after = _format_snapshot_adicionais(after.get("adicionais"))
        if ads_before != ads_after:
            if ads_after:
                differences.append(f"Adicionais alterados em {nome_item}: {ads_after}.")
            else:
                differences.append(f"Adicionais removidos de {nome_item}.")

    if not differences:
        return ["Sem diferenças em relação à nota anterior."]
    return differences[:80]


def _format_snapshot_adicionais(raw_adicionais) -> str:
    if not isinstance(raw_adicionais, list):
        return ""
    parts: list[str] = []
    for adicional in raw_adicionais:
        nome = str((adicional or {}).get("nome") or "").strip()
        quantidade = int((adicional or {}).get("quantidade") or 0)
        if not nome or quantidade <= 0:
            continue
        parts.append(f"{nome} x{quantidade}")
    return ", ".join(sorted(parts))


def _normalize_codigo(code: str) -> str:
    normalized = code.strip().upper()
    if not normalized:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Código de comanda inválido.",
        )
    return normalized


def _normalize_optional_text(value: str | None) -> str | None:
    if value is None:
        return None
    normalized = " ".join(value.split())
    return normalized or None


def _get_or_create_cliente_balcao(db: Session) -> Cliente:
    cliente = db.scalar(
        select(Cliente).where(func.lower(Cliente.nome) == CLIENTE_BALCAO_NOME.lower())
    )
    if cliente:
        return cliente
    cliente = Cliente(nome=CLIENTE_BALCAO_NOME, telefone=None, endereco=None)
    db.add(cliente)
    db.flush()
    return cliente


def _get_comanda_or_404(db: Session, pedido_id: int) -> Pedido:
    stmt = (
        select(Pedido)
        .options(
            joinedload(Pedido.itens)
            .joinedload(ItemPedido.adicionais)
            .joinedload(ItemPedidoAdicional.adicional),
            joinedload(Pedido.itens).joinedload(ItemPedido.produto),
            joinedload(Pedido.pagamentos),
        )
        .where(
            Pedido.id == pedido_id,
            Pedido.comanda_codigo.is_not(None),
        )
    )
    pedido = db.execute(stmt).unique().scalar_one_or_none()
    if not pedido:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Comanda {pedido_id} não encontrada.",
        )
    return pedido


def _get_produto_ativo_or_404(db: Session, produto_id: int) -> Produto:
    produto = db.get(Produto, produto_id)
    if not produto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Produto {produto_id} não encontrado.",
        )
    if not produto.ativo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Produto inativo não pode ser adicionado.",
        )
    return produto


def _replace_adicionais(
    db: Session,
    item: ItemPedido,
    adicionais_payload: list,
    produto_id: int,
) -> None:
    item.adicionais.clear()
    db.flush()
    if not adicionais_payload:
        return

    # Aceita payload com IDs repetidos e agrega as quantidades.
    adicionais_agrupados: dict[int, int] = {}
    for ad_payload in adicionais_payload:
        adicional_id = int(ad_payload.adicional_id)
        quantidade = int(ad_payload.quantidade)
        if quantidade <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Quantidade inválida para adicional {adicional_id}.",
            )
        adicionais_agrupados[adicional_id] = adicionais_agrupados.get(adicional_id, 0) + quantidade

    adicionais_permitidos = _get_adicionais_permitidos_no_produto(db, produto_id)
    adicional_ids = list(adicionais_agrupados.keys())
    adicionais_map = {
        adicional.id: adicional
        for adicional in db.scalars(select(Adicional).where(Adicional.id.in_(adicional_ids))).all()
    }

    for adicional_id, quantidade in adicionais_agrupados.items():
        if adicionais_permitidos and adicional_id not in adicionais_permitidos:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Adicional {adicional_id} não permitido para este produto."
                ),
            )
        adicional = adicionais_map.get(adicional_id)
        if not adicional:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Adicional {adicional_id} não encontrado.",
            )
        if not adicional.ativo:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Adicional '{adicional.nome}' está inativo.",
            )
        preco = as_money(adicional.preco)
        subtotal = as_money(preco * quantidade)
        item.adicionais.append(
            ItemPedidoAdicional(
                adicional_id=adicional.id,
                quantidade=quantidade,
                preco_unitario=preco,
                subtotal=subtotal,
            )
        )


def _recalculate_item_subtotal(item: ItemPedido) -> None:
    base = as_money(item.preco_unitario * item.quantidade)
    adicionais_total = as_money(
        sum((as_money(ad.subtotal) for ad in item.adicionais), start=Decimal("0"))
    )
    bruto = as_money(base + adicionais_total)
    desconto = as_money(item.desconto or Decimal("0"))
    if desconto < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Desconto do item não pode ser negativo.",
        )
    if desconto > bruto:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Desconto do item não pode ser maior que o valor bruto do item.",
        )
    item.desconto = desconto
    item.subtotal = as_money(bruto - desconto)


def _recalculate_comanda_total(db: Session, pedido: Pedido) -> None:
    db.flush()
    total = db.scalar(
        select(func.coalesce(func.sum(ItemPedido.subtotal), 0)).where(
            ItemPedido.pedido_id == pedido.id
        )
    )
    pedido.total = as_money(total or Decimal("0"))
    db.flush()


def _ensure_editable_order(pedido: Pedido) -> None:
    if pedido.status not in ITEM_EDITABLE_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Somente comandas em ABERTO, EM_PREPARO, PRONTO ou ENTREGUE "
                "podem ter itens alterados."
            ),
        )


def _status_controla_estoque(status_pedido: StatusPedido) -> bool:
    return status_pedido in STOCK_CONTROLLED_STATUSES


def _decrement_stock_for_product(db: Session, produto_id: int, quantidade: int) -> bool:
    produto = db.get(Produto, produto_id)
    if not produto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Produto {produto_id} nao encontrado.",
        )
    if not produto.controla_estoque:
        return False
    if produto.estoque_atual < quantidade:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Estoque insuficiente para '{produto.nome}'. "
                f"Disponivel: {produto.estoque_atual}, necessario: {quantidade}."
            ),
        )
    produto.estoque_atual -= quantidade
    return True


def _increment_stock_for_product(db: Session, produto_id: int, quantidade: int) -> bool:
    produto = db.get(Produto, produto_id)
    if not produto:
        return False
    if not produto.controla_estoque:
        return False
    produto.estoque_atual += quantidade
    return True


def _adjust_stock_on_item_change(
    db: Session,
    old_produto_id: int,
    old_quantidade: int,
    new_produto_id: int,
    new_quantidade: int,
) -> None:
    if old_produto_id == new_produto_id:
        delta = int(new_quantidade) - int(old_quantidade)
        if delta > 0:
            _decrement_stock_for_product(db, new_produto_id, delta)
        elif delta < 0:
            _increment_stock_for_product(db, new_produto_id, abs(delta))
        return

    _increment_stock_for_product(db, old_produto_id, int(old_quantidade))
    _decrement_stock_for_product(db, new_produto_id, int(new_quantidade))


def _decrement_stock_for_order(db: Session, pedido: Pedido) -> None:
    if not pedido.itens:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Comanda sem itens nao pode ir para EM_PREPARO.",
        )
    required: dict[int, int] = {}
    for item in pedido.itens:
        required[item.produto_id] = required.get(item.produto_id, 0) + item.quantidade

    produtos = {
        produto.id: produto
        for produto in db.scalars(select(Produto).where(Produto.id.in_(required.keys()))).all()
    }
    updates: list[tuple[Produto, int]] = []
    for produto_id, quantity in required.items():
        produto = produtos.get(produto_id)
        if not produto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Produto {produto_id} nao encontrado.",
            )
        if not produto.controla_estoque:
            continue
        if produto.estoque_atual < quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Estoque insuficiente para '{produto.nome}'. "
                    f"Disponivel: {produto.estoque_atual}, necessario: {quantity}."
                ),
            )
        updates.append((produto, quantity))
    for produto, quantity in updates:
        produto.estoque_atual -= quantity


def _increment_stock_for_order(db: Session, pedido: Pedido) -> None:
    required: dict[int, int] = {}
    for item in pedido.itens:
        required[item.produto_id] = required.get(item.produto_id, 0) + item.quantidade

    produtos = {
        produto.id: produto
        for produto in db.scalars(select(Produto).where(Produto.id.in_(required.keys()))).all()
    }
    for produto_id, quantity in required.items():
        produto = produtos.get(produto_id)
        if not produto:
            continue
        if not produto.controla_estoque:
            continue
        produto.estoque_atual += quantity


def _get_adicionais_permitidos_no_produto(db: Session, produto_id: int) -> set[int]:
    return set(
        db.scalars(
            select(ProdutoAdicional.adicional_id).where(ProdutoAdicional.produto_id == produto_id)
        ).all()
    )


def _release_comanda_codigo(
    db: Session,
    code: str | None,
    status_visual: str | None = None,
) -> None:
    if not code:
        return
    comanda_code = db.scalar(select(ComandaCodigo).where(ComandaCodigo.codigo == code))
    if comanda_code:
        comanda_code.em_uso = False
        if status_visual and status_visual in STATUS_VISUALS_VALIDOS:
            comanda_code.status_visual = status_visual


def _total_itens_da_comanda(pedido: Pedido) -> int:
    return int(sum(item.quantidade for item in pedido.itens))


def _classificar_complexidade(total_itens: int) -> str:
    if total_itens <= 0:
        return "Sem itens"
    if total_itens <= 2:
        return "Pedido minúsculo"
    if total_itens <= 5:
        return "Pedido pequeno"
    if total_itens <= 8:
        return "Pedido médio"
    return "Pedido grande"


def _serialize_comanda(db: Session, pedido: Pedido) -> dict:
    pagamento = pagamento_service.resumo_pagamentos_lista(pedido.pagamentos, pedido.total)
    itens = []
    for item in pedido.itens:
        adicionais = [
            {
                "id": ad.id,
                "adicional_id": ad.adicional_id,
                "nome": ad.adicional.nome if ad.adicional else f"Adicional {ad.adicional_id}",
                "quantidade": ad.quantidade,
                "preco_unitario": as_money(ad.preco_unitario),
                "subtotal": as_money(ad.subtotal),
            }
            for ad in item.adicionais
        ]
        itens.append(
            {
                "id": item.id,
                "pedido_id": item.pedido_id,
                "produto_id": item.produto_id,
                "produto_nome": item.produto.nome if item.produto else f"Produto {item.produto_id}",
                "quantidade": item.quantidade,
                "observacoes": item.observacoes,
                "preco_unitario": as_money(item.preco_unitario),
                "desconto": as_money(item.desconto),
                "subtotal": as_money(item.subtotal),
                "adicionais": adicionais,
            }
        )
    total_itens = _total_itens_da_comanda(pedido)
    return {
        "id": pedido.id,
        "comanda_codigo": pedido.comanda_codigo or f"#{pedido.id}",
        "mesa": pedido.mesa,
        "status": pedido.status,
        "tipo_entrega": pedido.tipo_entrega,
        "observacoes": pedido.observacoes,
        "total": as_money(pedido.total),
        "total_itens": total_itens,
        "complexidade": _classificar_complexidade(total_itens),
        "criado_em": pedido.criado_em,
        "itens": itens,
        "pagamento": pagamento,
    }

