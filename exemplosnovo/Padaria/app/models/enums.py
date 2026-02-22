from enum import Enum


class StatusPedido(str, Enum):
    ABERTO = "ABERTO"
    EM_PREPARO = "EM_PREPARO"
    PRONTO = "PRONTO"
    ENTREGUE = "ENTREGUE"
    CANCELADO = "CANCELADO"


class TipoEntrega(str, Enum):
    RETIRADA = "RETIRADA"
    ENTREGA = "ENTREGA"


class MetodoPagamento(str, Enum):
    DINHEIRO = "DINHEIRO"
    PIX = "PIX"
    CARTAO_DEBITO = "CARTAO_DEBITO"
    CARTAO_CREDITO = "CARTAO_CREDITO"


class StatusPagamento(str, Enum):
    PENDENTE = "PENDENTE"
    APROVADO = "APROVADO"
    RECUSADO = "RECUSADO"
    CANCELADO = "CANCELADO"
