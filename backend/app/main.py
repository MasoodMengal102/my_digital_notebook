import os
import traceback
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.services.seed_data import seed_database

# Ensure all SQLAlchemy models are registered
import app.models

# Routers
from app.routers import auth, notes, tasks, reminders, classes, events, planner, search, stats, settings as settings_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize all database tables
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed initial demo user and data safely
    db = SessionLocal()
    try:
        seed_database(db)
    except Exception as e:
        print(f"Warning: Demo seeding skipped or already present: {e}")
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Full-stack student productivity and digital note-taking platform backend API.",
    lifespan=lifespan
)

# Exception Handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    messages = []
    for err in exc.errors():
        field_loc = " -> ".join(str(l) for l in err.get("loc", []) if l != "body")
        msg = err.get("msg", "Invalid value")
        if field_loc:
            messages.append(f"{field_loc}: {msg}")
        else:
            messages.append(msg)
    combined = "; ".join(messages)
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": combined}
    )

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    print(f"UNHANDLED SERVER ERROR on {request.method} {request.url.path}: {exc}")
    traceback.print_exc()
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error. Please try again later."}
    )

# CORS configuration for production and local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=r"https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Register API Routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(notes.router, prefix=settings.API_PREFIX)
app.include_router(tasks.router, prefix=settings.API_PREFIX)
app.include_router(reminders.router, prefix=settings.API_PREFIX)
app.include_router(classes.router, prefix=settings.API_PREFIX)
app.include_router(events.router, prefix=settings.API_PREFIX)
app.include_router(planner.router, prefix=settings.API_PREFIX)
app.include_router(search.router, prefix=settings.API_PREFIX)
app.include_router(stats.router, prefix=settings.API_PREFIX)
app.include_router(settings_router.router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "tagline": "Write. Plan. Remember. Achieve.",
        "version": settings.VERSION,
        "status": "online",
        "health_url": "/health",
        "docs_url": "/docs"
    }

@app.get("/health", tags=["Health"])
def health_check():
    """Production health check for Render monitoring."""
    return {"status": "ok"}

@app.get(f"{settings.API_PREFIX}/health", tags=["Health"])
def api_health_check():
    return {"status": "ok", "service": settings.PROJECT_NAME}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)

