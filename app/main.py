from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import Admin, Job, JobApplication  # noqa: F401
from app.routes import (
    admin_applications_router,
    admin_auth_router,
    admin_jobs_router,
    public_router,
)
from app.services.file_service import ensure_upload_dir


app = FastAPI(title="Career Page API", version="1.0.0")

# Allow frontend pages served from local static servers.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:8000",
        "http://localhost:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    ensure_upload_dir()
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Career Page API Running"}


app.include_router(public_router)
app.include_router(admin_auth_router)
app.include_router(admin_jobs_router)
app.include_router(admin_applications_router)
