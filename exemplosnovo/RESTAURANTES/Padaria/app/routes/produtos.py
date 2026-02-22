from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, Query, status
from fastapi import File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.common import PaginatedResponse
from app.schemas.produto import EstoquePatchIn, ProdutoCreate, ProdutoOut, ProdutoUpdate
from app.services import produto_service

router = APIRouter(prefix="/produtos", tags=["Produtos"])
UPLOAD_DIR = Path("app/static/uploads/produtos")
MAX_UPLOAD_BYTES = 5 * 1024 * 1024
UPLOAD_CHUNK_BYTES = 512 * 1024
ALLOWED_CONTENT_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
}
ALLOWED_SUFFIXES = set(ALLOWED_CONTENT_TYPES.values()) | {".jpeg"}


@router.post("", response_model=ProdutoOut, status_code=status.HTTP_201_CREATED)
def create_produto(payload: ProdutoCreate, db: Session = Depends(get_db)) -> ProdutoOut:
    return produto_service.create_produto(db, payload)


@router.post("/upload-imagem")
def upload_produto_imagem(file: UploadFile = File(...)) -> dict[str, str]:
    content_type = (file.content_type or "").lower()
    if content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Arquivo invalido. Envie apenas imagens (JPEG, PNG, WEBP, GIF ou SVG).",
        )

    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in ALLOWED_SUFFIXES:
        suffix = ALLOWED_CONTENT_TYPES[content_type]

    try:
        chunks: list[bytes] = []
        total_bytes = 0
        while True:
            chunk = file.file.read(UPLOAD_CHUNK_BYTES)
            if not chunk:
                break
            total_bytes += len(chunk)
            if total_bytes > MAX_UPLOAD_BYTES:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Imagem excede limite de 5MB.",
                )
            chunks.append(chunk)
        data = b"".join(chunks)
    finally:
        file.file.close()

    if not data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Arquivo vazio. Envie uma imagem valida.",
        )

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"produto_{uuid4().hex}{suffix}"
    output = UPLOAD_DIR / filename
    output.write_bytes(data)
    return {"imagem_url": f"/static/uploads/produtos/{filename}"}


@router.get("", response_model=PaginatedResponse[ProdutoOut])
def list_produtos(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=500),
    ativo: bool | None = Query(default=None),
    q: str | None = Query(default=None, description="Busca por nome do produto"),
    db: Session = Depends(get_db),
) -> PaginatedResponse[ProdutoOut]:
    items, total = produto_service.list_produtos(
        db,
        page=page,
        page_size=page_size,
        ativo=ativo,
        q=q,
    )
    return PaginatedResponse[ProdutoOut](
        page=page,
        page_size=page_size,
        total=total,
        items=items,
    )


@router.get("/{produto_id}", response_model=ProdutoOut)
def get_produto(produto_id: int, db: Session = Depends(get_db)) -> ProdutoOut:
    return produto_service.get_produto_or_404(db, produto_id)


@router.put("/{produto_id}", response_model=ProdutoOut)
def update_produto(
    produto_id: int,
    payload: ProdutoUpdate,
    db: Session = Depends(get_db),
) -> ProdutoOut:
    return produto_service.update_produto(db, produto_id, payload)


@router.patch("/{produto_id}/estoque", response_model=ProdutoOut)
def patch_estoque(
    produto_id: int,
    payload: EstoquePatchIn,
    db: Session = Depends(get_db),
) -> ProdutoOut:
    return produto_service.patch_estoque(db, produto_id, payload.delta)


@router.delete("/{produto_id}", response_model=ProdutoOut)
def delete_produto(
    produto_id: int,
    hard: bool = Query(default=False, description="Exclui definitivamente quando true."),
    db: Session = Depends(get_db),
) -> ProdutoOut:
    if hard:
        return produto_service.hard_delete_produto(db, produto_id)
    return produto_service.deactivate_produto(db, produto_id)
