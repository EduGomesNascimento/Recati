from pathlib import Path

from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

TEMPLATES_DIR = Path(__file__).resolve().parents[1] / "templates"
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))
router = APIRouter(tags=["Interface"])


def _is_mobile_client(request: Request) -> bool:
    user_agent = request.headers.get("user-agent", "").lower()
    mobile_tokens = ("android", "iphone", "ipad", "mobile", "wv")
    return any(token in user_agent for token in mobile_tokens)


@router.get("/", include_in_schema=False)
def root() -> RedirectResponse:
    return RedirectResponse(url="/mobile", status_code=307)


@router.get("/app-mobile", response_class=HTMLResponse, include_in_schema=False)
def comandas_page(request: Request) -> HTMLResponse:
    return templates.TemplateResponse(request, "mobile.html", {})


@router.get("/mobile", response_class=HTMLResponse, include_in_schema=False)
def mobile_page(request: Request) -> HTMLResponse:
    return templates.TemplateResponse(request, "mobile.html", {})


@router.get("/caixa", response_class=HTMLResponse, include_in_schema=False)
def caixa_page(request: Request) -> HTMLResponse:
    if _is_mobile_client(request):
        return RedirectResponse(url="/mobile?acesso=negado", status_code=307)
    return templates.TemplateResponse(request, "caixa.html", {})


@router.get("/favicon.ico", include_in_schema=False)
def favicon() -> RedirectResponse:
    return RedirectResponse(url="/static/logo.png", status_code=307)
