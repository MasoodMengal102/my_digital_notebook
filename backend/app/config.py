import os
from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Crystal Notebook"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Secret key for JWT signing (supports both JWT_SECRET_KEY and SECRET_KEY)
    SECRET_KEY: str = os.getenv("JWT_SECRET_KEY") or os.getenv("SECRET_KEY", "crystal-notebook-super-secret-jwt-key-2026-production-grade")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY") or os.getenv("SECRET_KEY", "crystal-notebook-super-secret-jwt-key-2026-production-grade")
    
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Defaults to SQLite for immediate local run, supports PostgreSQL via DATABASE_URL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./crystal_notebook.db")
    
    # Production Frontend URL (e.g. https://crystal-notebook.onrender.com)
    FRONTEND_URL: Optional[str] = os.getenv("FRONTEND_URL", None)

    @property
    def cors_origins(self) -> List[str]:
        origins = [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
        ]
        if self.FRONTEND_URL:
            for url in self.FRONTEND_URL.split(","):
                cleaned = url.strip().rstrip("/")
                if cleaned and cleaned not in origins:
                    origins.append(cleaned)
        return origins

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

