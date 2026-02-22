from datetime import date, datetime

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from fastapi.responses import HTMLResponse, Response
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.relatorio import FaturamentoPeriodoOut, FechamentoCaixaOut, ResumoDiaOut
from app.services import config_service, relatorio_service

router = APIRouter(prefix="/relatorios", tags=["Relatórios"])
templates = Jinja2Templates(directory="app/templates")


@router.get("/resumo-dia", response_model=ResumoDiaOut)
def get_resumo_dia(
    data: date = Query(description="Data no formato YYYY-MM-DD"),
    db: Session = Depends(get_db),
) -> ResumoDiaOut:
    return relatorio_service.resumo_dia(db, data)


@router.get("/fechamento-caixa", response_model=FechamentoCaixaOut)
def get_fechamento_caixa(
    data: date = Query(description="Data no formato YYYY-MM-DD"),
    db: Session = Depends(get_db),
) -> FechamentoCaixaOut:
    return relatorio_service.fechamento_caixa(db, data)


@router.get("/fechamento-caixa.csv")
def get_fechamento_caixa_csv(
    data: date = Query(description="Data no formato YYYY-MM-DD"),
    db: Session = Depends(get_db),
) -> Response:
    fechamento = relatorio_service.fechamento_caixa(db, data)
    csv_content = "\ufeff" + relatorio_service.fechamento_caixa_csv(fechamento)
    filename = f"fechamento-caixa-{data.isoformat()}.csv"
    return Response(
        content=csv_content,
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/faturamento-periodo", response_model=FaturamentoPeriodoOut)
def get_faturamento_periodo(
    data_inicial: date = Query(description="Data inicial no formato YYYY-MM-DD"),
    data_final: date = Query(description="Data final no formato YYYY-MM-DD"),
    db: Session = Depends(get_db),
) -> FaturamentoPeriodoOut:
    try:
        return relatorio_service.faturamento_periodo(db, data_inicial, data_final)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error


@router.get("/faturamento-periodo.csv")
def get_faturamento_periodo_csv(
    data_inicial: date = Query(description="Data inicial no formato YYYY-MM-DD"),
    data_final: date = Query(description="Data final no formato YYYY-MM-DD"),
    db: Session = Depends(get_db),
) -> Response:
    try:
        payload = relatorio_service.faturamento_periodo(db, data_inicial, data_final)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error

    csv_content = "\ufeff" + relatorio_service.faturamento_periodo_csv(payload)
    filename = f"faturamento-periodo-{data_inicial.isoformat()}-a-{data_final.isoformat()}.csv"
    return Response(
        content=csv_content,
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/faturamento-periodo/relatorio", response_class=HTMLResponse)
def get_faturamento_periodo_relatorio(
    request: Request,
    data_inicial: date = Query(description="Data inicial no formato YYYY-MM-DD"),
    data_final: date = Query(description="Data final no formato YYYY-MM-DD"),
    db: Session = Depends(get_db),
) -> HTMLResponse:
    try:
        payload = relatorio_service.faturamento_periodo(db, data_inicial, data_final)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error

    config = config_service.get_config(db)
    context = {
        "request": request,
        "data": payload,
        "logo_url": config.get("logo_url") or "/static/logo.png",
        "empresa_nome": config.get("empresa_nome") or "ChurrascariaERP",
        "gerado_em": datetime.now().strftime("%d/%m/%Y %H:%M"),
    }
    return templates.TemplateResponse("relatorio_faturamento.html", context)

