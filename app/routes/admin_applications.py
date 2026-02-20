from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin, get_db
from app.models.admin import Admin
from app.models.application import JobApplication
from app.schemas.application import ApplicationStatusUpdate, JobApplicationResponse


router = APIRouter(prefix="/admin/applications", tags=["Admin Applications"])


@router.get("", response_model=list[JobApplicationResponse])
def list_applications(
    jobId: int | None = None,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
):
    query = db.query(JobApplication)
    if jobId is not None:
        query = query.filter(JobApplication.jobId == jobId)
    return query.order_by(JobApplication.createdAt.desc()).all()


@router.patch("/{application_id}/status", response_model=JobApplicationResponse)
def update_application_status(
    application_id: int,
    payload: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
):
    application = db.query(JobApplication).filter(JobApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    application.status = payload.status
    db.commit()
    db.refresh(application)
    return application
