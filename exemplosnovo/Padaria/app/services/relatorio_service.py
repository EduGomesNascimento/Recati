from __future__ import annotations

import csv
import io
from datetime import date, datetime, time, timedelta
from decimal import Decimal

from sqlalchemy import case, desc, func, select
from sqlalchemy.orm import Session

from app.models.enums import MetodoPagamento, StatusPagamento, StatusPedido, TipoEntrega
from app.models.item_pedido import ItemPedido
from app.models.pagamento import Pagamento
from app.models.pedido import Pedido
from app.models.produto import Produto
from app.services.utils import as_money


def _fmt_money_csv(value: Decimal | float | int) -> str:
    amount = as_money(value)
    return f"{amount:.2f}".replace(".", ",")


def resumo_dia(db: Session, data_ref: date) -> dict:
    inicio = datetime.combine(data_ref, time.min)
    fim = datetime.combine(data_ref, time.max)

    total_vendido = db.scalar(
        select(func.coalesce(func.sum(Pedido.total), 0)).where(
            Pedido.criado_em >= inicio,
            Pedido.criado_em <= fim,
            Pedido.status != StatusPedido.CANCELADO,
        )
    )

    status_rows = db.execute(
        select(Pedido.status, func.count(Pedido.id))
        .where(Pedido.criado_em >= inicio, Pedido.criado_em <= fim)
        .group_by(Pedido.status)
    ).all()

    pedidos_por_status = {status.value: int(qtd) for status, qtd in status_rows}
    for status in StatusPedido:
        pedidos_por_status.setdefault(status.value, 0)

    quantidade_label = func.coalesce(func.sum(ItemPedido.quantidade), 0).label("qtd")
    total_label = func.coalesce(func.sum(ItemPedido.subtotal), 0).label("total")

    top_rows = db.execute(
        select(Produto.id, Produto.nome, quantidade_label, total_label)
        .join(ItemPedido, ItemPedido.produto_id == Produto.id)
        .join(Pedido, Pedido.id == ItemPedido.pedido_id)
        .where(
            Pedido.criado_em >= inicio,
            Pedido.criado_em <= fim,
            Pedido.status != StatusPedido.CANCELADO,
        )
        .group_by(Produto.id, Produto.nome)
        .order_by(desc("qtd"), desc("total"))
        .limit(5)
    ).all()

    top_produtos = [
        {
            "produto_id": produto_id,
            "nome": nome,
            "quantidade": int(qtd),
            "total": as_money(total),
        }
        for produto_id, nome, qtd, total in top_rows
    ]

    return {
        "data": data_ref,
        "total_vendido": as_money(total_vendido or Decimal("0")),
        "pedidos_por_status": pedidos_por_status,
        "top_produtos": top_produtos,
    }


def fechamento_caixa(db: Session, data_ref: date) -> dict:
    inicio = datetime.combine(data_ref, time.min)
    fim = datetime.combine(data_ref, time.max)

    base_filter = [Pedido.criado_em >= inicio, Pedido.criado_em <= fim]

    total_pedidos = int(
        db.scalar(select(func.count(Pedido.id)).where(*base_filter)) or 0
    )
    pedidos_cancelados = int(
        db.scalar(
            select(func.count(Pedido.id)).where(
                *base_filter,
                Pedido.status == StatusPedido.CANCELADO,
            )
        )
        or 0
    )
    pedidos_validos = max(total_pedidos - pedidos_cancelados, 0)

    total_vendido = as_money(
        db.scalar(
            select(func.coalesce(func.sum(Pedido.total), 0)).where(
                *base_filter,
                Pedido.status != StatusPedido.CANCELADO,
            )
        )
        or Decimal("0")
    )
    total_cancelado = as_money(
        db.scalar(
            select(func.coalesce(func.sum(Pedido.total), 0)).where(
                *base_filter,
                Pedido.status == StatusPedido.CANCELADO,
            )
        )
        or Decimal("0")
    )

    status_rows = db.execute(
        select(Pedido.status, func.count(Pedido.id))
        .where(*base_filter)
        .group_by(Pedido.status)
    ).all()
    pedidos_por_status = {status.value: int(qtd) for status, qtd in status_rows}
    for status in StatusPedido:
        pedidos_por_status.setdefault(status.value, 0)

    tipo_rows = db.execute(
        select(
            Pedido.tipo_entrega,
            func.count(Pedido.id),
            func.coalesce(func.sum(Pedido.total), 0),
        )
        .where(*base_filter, Pedido.status != StatusPedido.CANCELADO)
        .group_by(Pedido.tipo_entrega)
    ).all()

    pedidos_por_tipo_entrega = {tipo.value: 0 for tipo in TipoEntrega}
    faturamento_por_tipo_entrega = {tipo.value: as_money(0) for tipo in TipoEntrega}
    for tipo, qtd, total in tipo_rows:
        pedidos_por_tipo_entrega[tipo.value] = int(qtd)
        faturamento_por_tipo_entrega[tipo.value] = as_money(total)

    total_recebido = as_money(
        db.scalar(
            select(func.coalesce(func.sum(Pagamento.valor), 0)).where(
                Pagamento.criado_em >= inicio,
                Pagamento.criado_em <= fim,
                Pagamento.status == StatusPagamento.APROVADO,
            )
        )
        or Decimal("0")
    )

    payment_rows = db.execute(
        select(Pagamento.metodo, func.coalesce(func.sum(Pagamento.valor), 0))
        .where(
            Pagamento.criado_em >= inicio,
            Pagamento.criado_em <= fim,
            Pagamento.status == StatusPagamento.APROVADO,
        )
        .group_by(Pagamento.metodo)
    ).all()
    pagamentos_por_metodo = {method.value: as_money(0) for method in MetodoPagamento}
    for method, amount in payment_rows:
        pagamentos_por_metodo[method.value] = as_money(amount)

    ticket_medio = as_money(
        total_recebido / pedidos_validos if pedidos_validos > 0 else Decimal("0")
    )

    return {
        "data": data_ref,
        "total_pedidos": total_pedidos,
        "pedidos_validos": pedidos_validos,
        "pedidos_cancelados": pedidos_cancelados,
        "total_vendido": total_vendido,
        "total_recebido": total_recebido,
        "total_cancelado": total_cancelado,
        "ticket_medio": ticket_medio,
        "pedidos_por_status": pedidos_por_status,
        "pedidos_por_tipo_entrega": pedidos_por_tipo_entrega,
        "faturamento_por_tipo_entrega": faturamento_por_tipo_entrega,
        "pagamentos_por_metodo": pagamentos_por_metodo,
    }


def fechamento_caixa_csv(data: dict) -> str:
    buffer = io.StringIO()
    writer = csv.writer(buffer, delimiter=";")

    writer.writerow(["relatorio", "Fechamento de Caixa"])
    writer.writerow(["data_referencia", str(data["data"])])
    writer.writerow(["gerado_em", datetime.now().strftime("%Y-%m-%d %H:%M:%S")])
    writer.writerow([])

    writer.writerow(["resumo_geral", "valor"])
    writer.writerow(["total_pedidos", int(data["total_pedidos"])])
    writer.writerow(["pedidos_validos", int(data["pedidos_validos"])])
    writer.writerow(["pedidos_cancelados", int(data["pedidos_cancelados"])])
    writer.writerow(["total_vendido", _fmt_money_csv(data["total_vendido"])])
    writer.writerow(["total_recebido", _fmt_money_csv(data["total_recebido"])])
    writer.writerow(["total_cancelado", _fmt_money_csv(data["total_cancelado"])])
    writer.writerow(["ticket_medio", _fmt_money_csv(data["ticket_medio"])])
    writer.writerow([])

    writer.writerow(["pedidos_por_status", "quantidade"])
    for status, quantidade in data["pedidos_por_status"].items():
        writer.writerow([status, int(quantidade)])
    writer.writerow([])

    writer.writerow(["tipo_entrega", "pedidos", "faturamento"])
    for tipo, quantidade in data["pedidos_por_tipo_entrega"].items():
        faturamento = data["faturamento_por_tipo_entrega"].get(tipo, 0)
        writer.writerow([tipo, int(quantidade), _fmt_money_csv(faturamento)])

    writer.writerow([])
    writer.writerow(["metodo_pagamento", "total_recebido"])
    for metodo, total in data["pagamentos_por_metodo"].items():
        writer.writerow([metodo, _fmt_money_csv(total)])

    return buffer.getvalue()


def faturamento_periodo_csv(data: dict) -> str:
    buffer = io.StringIO()
    writer = csv.writer(buffer, delimiter=";")

    writer.writerow(["relatorio", "Faturamento por Periodo"])
    writer.writerow(["data_inicial", str(data["data_inicial"])])
    writer.writerow(["data_final", str(data["data_final"])])
    writer.writerow(["gerado_em", datetime.now().strftime("%Y-%m-%d %H:%M:%S")])
    writer.writerow([])

    writer.writerow(["resumo_geral", "valor"])
    writer.writerow(["total_pedidos", int(data["total_pedidos"])])
    writer.writerow(["pedidos_validos", int(data["pedidos_validos"])])
    writer.writerow(["pedidos_cancelados", int(data["pedidos_cancelados"])])
    writer.writerow(["total_vendido", _fmt_money_csv(data["total_vendido"])])
    writer.writerow(["total_recebido", _fmt_money_csv(data["total_recebido"])])
    writer.writerow(["total_cancelado", _fmt_money_csv(data["total_cancelado"])])
    writer.writerow(["ticket_medio", _fmt_money_csv(data["ticket_medio"])])
    writer.writerow([])

    writer.writerow(["metodo_pagamento", "total_recebido"])
    for metodo, total in data["pagamentos_por_metodo"].items():
        writer.writerow([metodo, _fmt_money_csv(total)])
    writer.writerow([])

    writer.writerow(
        [
            "dia",
            "total_pedidos",
            "pedidos_validos",
            "pedidos_cancelados",
            "total_vendido",
            "total_recebido",
            "total_cancelado",
            "ticket_medio",
        ]
    )
    for row in data.get("dias", []):
        writer.writerow(
            [
                str(row["data"]),
                int(row["total_pedidos"]),
                int(row["pedidos_validos"]),
                int(row["pedidos_cancelados"]),
                _fmt_money_csv(row["total_vendido"]),
                _fmt_money_csv(row["total_recebido"]),
                _fmt_money_csv(row["total_cancelado"]),
                _fmt_money_csv(row["ticket_medio"]),
            ]
        )

    return buffer.getvalue()


def faturamento_periodo(db: Session, data_inicial: date, data_final: date) -> dict:
    if data_inicial > data_final:
        raise ValueError("data_inicial não pode ser maior que data_final.")

    limite_dias = 120
    total_dias = (data_final - data_inicial).days + 1
    if total_dias > limite_dias:
        raise ValueError(f"Período máximo suportado: {limite_dias} dias.")

    inicio = datetime.combine(data_inicial, time.min)
    fim = datetime.combine(data_final, time.max)

    base_filter = [
        Pedido.comanda_codigo.is_not(None),
        Pedido.criado_em >= inicio,
        Pedido.criado_em <= fim,
    ]

    pedidos_rows = db.execute(
        select(
            func.date(Pedido.criado_em).label("dia"),
            func.count(Pedido.id).label("total_pedidos"),
            func.coalesce(
                func.sum(
                    case((Pedido.status == StatusPedido.CANCELADO, 1), else_=0)
                ),
                0,
            ).label("pedidos_cancelados"),
            func.coalesce(
                func.sum(
                    case((Pedido.status != StatusPedido.CANCELADO, Pedido.total), else_=0)
                ),
                0,
            ).label("total_vendido"),
            func.coalesce(
                func.sum(
                    case((Pedido.status == StatusPedido.CANCELADO, Pedido.total), else_=0)
                ),
                0,
            ).label("total_cancelado"),
        )
        .where(*base_filter)
        .group_by(func.date(Pedido.criado_em))
        .order_by(func.date(Pedido.criado_em).asc())
    ).all()

    pagamentos_rows = db.execute(
        select(
            func.date(Pagamento.criado_em).label("dia"),
            func.coalesce(func.sum(Pagamento.valor), 0).label("total_recebido"),
        )
        .where(
            Pagamento.criado_em >= inicio,
            Pagamento.criado_em <= fim,
            Pagamento.status == StatusPagamento.APROVADO,
        )
        .group_by(func.date(Pagamento.criado_em))
        .order_by(func.date(Pagamento.criado_em).asc())
    ).all()

    pagamento_por_metodo_rows = db.execute(
        select(Pagamento.metodo, func.coalesce(func.sum(Pagamento.valor), 0))
        .where(
            Pagamento.criado_em >= inicio,
            Pagamento.criado_em <= fim,
            Pagamento.status == StatusPagamento.APROVADO,
        )
        .group_by(Pagamento.metodo)
    ).all()
    pagamentos_por_metodo = {method.value: as_money(0) for method in MetodoPagamento}
    for method, amount in pagamento_por_metodo_rows:
        pagamentos_por_metodo[method.value] = as_money(amount)

    pedidos_map = {
        str(dia): {
            "total_pedidos": int(total_pedidos or 0),
            "pedidos_cancelados": int(pedidos_cancelados or 0),
            "total_vendido": as_money(total_vendido or Decimal("0")),
            "total_cancelado": as_money(total_cancelado or Decimal("0")),
        }
        for dia, total_pedidos, pedidos_cancelados, total_vendido, total_cancelado in pedidos_rows
    }
    recebidos_map = {
        str(dia): as_money(total_recebido or Decimal("0"))
        for dia, total_recebido in pagamentos_rows
    }

    dias_data: list[dict] = []
    cursor = data_inicial
    while cursor <= data_final:
        key = cursor.isoformat()
        pedidos_dia = pedidos_map.get(
            key,
            {
                "total_pedidos": 0,
                "pedidos_cancelados": 0,
                "total_vendido": as_money(0),
                "total_cancelado": as_money(0),
            },
        )
        total_pedidos = int(pedidos_dia["total_pedidos"])
        pedidos_cancelados = int(pedidos_dia["pedidos_cancelados"])
        pedidos_validos = max(total_pedidos - pedidos_cancelados, 0)
        total_recebido = recebidos_map.get(key, as_money(0))
        ticket_medio = as_money(
            total_recebido / pedidos_validos if pedidos_validos > 0 else Decimal("0")
        )
        dias_data.append(
            {
                "data": cursor,
                "total_pedidos": total_pedidos,
                "pedidos_validos": pedidos_validos,
                "pedidos_cancelados": pedidos_cancelados,
                "total_vendido": pedidos_dia["total_vendido"],
                "total_recebido": total_recebido,
                "total_cancelado": pedidos_dia["total_cancelado"],
                "ticket_medio": ticket_medio,
            }
        )
        cursor += timedelta(days=1)

    total_pedidos = int(sum(row["total_pedidos"] for row in dias_data))
    pedidos_cancelados = int(sum(row["pedidos_cancelados"] for row in dias_data))
    pedidos_validos = max(total_pedidos - pedidos_cancelados, 0)
    total_vendido = as_money(sum((row["total_vendido"] for row in dias_data), start=Decimal("0")))
    total_recebido = as_money(sum((row["total_recebido"] for row in dias_data), start=Decimal("0")))
    total_cancelado = as_money(sum((row["total_cancelado"] for row in dias_data), start=Decimal("0")))
    ticket_medio = as_money(
        total_recebido / pedidos_validos if pedidos_validos > 0 else Decimal("0")
    )

    return {
        "data_inicial": data_inicial,
        "data_final": data_final,
        "total_pedidos": total_pedidos,
        "pedidos_validos": pedidos_validos,
        "pedidos_cancelados": pedidos_cancelados,
        "total_vendido": total_vendido,
        "total_recebido": total_recebido,
        "total_cancelado": total_cancelado,
        "ticket_medio": ticket_medio,
        "pagamentos_por_metodo": pagamentos_por_metodo,
        "dias": dias_data,
    }
