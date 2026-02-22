from collections.abc import Generator

from sqlalchemy import create_engine, event
from sqlalchemy.engine import make_url
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

database_url = settings.database_url
url = make_url(database_url)
is_sqlite = url.get_backend_name() == "sqlite"

connect_args = {"check_same_thread": False} if is_sqlite else {}

engine = create_engine(
    database_url,
    future=True,
    echo=False,
    connect_args=connect_args,
    pool_pre_ping=True,
)

if is_sqlite:

    @event.listens_for(engine, "connect")
    def _enable_foreign_keys(dbapi_connection, _connection_record) -> None:
        cursor = dbapi_connection.cursor()
        pragmas = [
            "PRAGMA foreign_keys=ON",
            # Pragmas para melhorar concorrencia e throughput em SQLite sob carga diaria.
            "PRAGMA journal_mode=WAL",
            "PRAGMA synchronous=NORMAL",
            "PRAGMA temp_store=MEMORY",
            "PRAGMA busy_timeout=5000",
            "PRAGMA cache_size=-64000",
        ]
        for pragma in pragmas:
            try:
                cursor.execute(pragma)
            except Exception:
                # Em alguns ambientes/arquivos, nem todos os PRAGMAs sao aceitos.
                continue
        cursor.close()


SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
    future=True,
)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
