from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Response
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from app.core.config import settings
from app.db.base import Base
from app.db.bootstrap import ensure_schema
from app.db.session import engine
from app.routes import (
    adicionais_router,
    comandas_router,
    config_router,
    pagamentos_router,
    produtos_router,
    relatorios_router,
    web_router,
)

APP_DIR = Path(__file__).resolve().parent
STATIC_DIR = APP_DIR / "static"


@asynccontextmanager
async def lifespan(_app: FastAPI):
    Base.metadata.create_all(bind=engine)
    ensure_schema(engine)
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "API para controle de comanda, pedidos, adicionais, pagamentos e fechamento de caixa."
    ),
    lifespan=lifespan,
)

app.include_router(comandas_router)
app.include_router(config_router)
app.include_router(produtos_router)
app.include_router(adicionais_router)
app.include_router(pagamentos_router)
app.include_router(relatorios_router)
app.include_router(web_router)
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


@app.get("/health", tags=["Sistema"])
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/health/db", tags=["Sistema"])
def health_db(response: Response) -> dict[str, str]:
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception:
        response.status_code = 503
        return {"status": "error", "database": "disconnected"}
