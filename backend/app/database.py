from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

def normalize_database_url(url: str) -> str:
    """
    Normalizes database connection URLs for SQLAlchemy.
    Converts Render PostgreSQL URLs starting with 'postgres://' or 'postgresql://'
    to 'postgresql+psycopg2://' to ensure the installed psycopg2 driver is used.
    """
    if not url:
        return "sqlite:///./crystal_notebook.db"
    clean_url = url.strip()
    if clean_url.startswith("postgres://"):
        return clean_url.replace("postgres://", "postgresql+psycopg2://", 1)
    if clean_url.startswith("postgresql://"):
        return clean_url.replace("postgresql://", "postgresql+psycopg2://", 1)
    return clean_url


normalized_db_url = normalize_database_url(settings.DATABASE_URL)

if normalized_db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    engine = create_engine(
        normalized_db_url,
        connect_args=connect_args,
        pool_pre_ping=True
    )
else:
    # Production PostgreSQL connection configuration
    engine = create_engine(
        normalized_db_url,
        connect_args={},
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
        pool_recycle=300
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

