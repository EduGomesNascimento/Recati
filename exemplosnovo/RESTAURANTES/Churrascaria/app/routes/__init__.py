from app.routes.adicionais import router as adicionais_router
from app.routes.comandas import router as comandas_router
from app.routes.config import router as config_router
from app.routes.pagamentos import router as pagamentos_router
from app.routes.produtos import router as produtos_router
from app.routes.relatorios import router as relatorios_router
from app.routes.web import router as web_router

__all__ = [
    "adicionais_router",
    "comandas_router",
    "config_router",
    "pagamentos_router",
    "produtos_router",
    "relatorios_router",
    "web_router",
]
