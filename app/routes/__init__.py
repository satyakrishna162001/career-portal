from app.routes.admin_applications import router as admin_applications_router
from app.routes.admin_auth import router as admin_auth_router
from app.routes.admin_jobs import router as admin_jobs_router
from app.routes.public import router as public_router

__all__ = [
    "admin_applications_router",
    "admin_auth_router",
    "admin_jobs_router",
    "public_router",
]
