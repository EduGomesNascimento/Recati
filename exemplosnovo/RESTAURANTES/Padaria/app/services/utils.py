from decimal import Decimal, ROUND_HALF_UP

MONEY_QUANT = Decimal("0.01")


def as_money(value: Decimal | int | float | str) -> Decimal:
    return Decimal(value).quantize(MONEY_QUANT, rounding=ROUND_HALF_UP)
