import re

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from pydantic import EmailStr, TypeAdapter, ValidationError
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.models.application import JobApplication
from app.models.job import Job
from app.schemas.application import JobApplicationResponse
from app.schemas.job import JobResponse
from app.services.file_service import save_resume_file


router = APIRouter(tags=["Public"])
email_adapter = TypeAdapter(EmailStr)
phone_pattern = re.compile(r"^[0-9+()\-\s]{7,20}$")


@router.get("/jobs", response_model=list[JobResponse])
def list_active_jobs(db: Session = Depends(get_db)):
    return db.query(Job).filter(Job.isActive.is_(True)).order_by(Job.createdAt.desc()).all()


@router.get("/jobs/{job_id}", response_model=JobResponse)
def get_job_details(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id, Job.isActive.is_(True)).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job


@router.post("/jobs/{job_id}/apply", response_model=JobApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_to_job(
    job_id: int,
    fullName: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    coverLetter: str | None = Form(None),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    if not job.isActive:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot apply to an inactive job")

    try:
        validated_email = email_adapter.validate_python(email)
    except ValidationError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid email") from exc

    if not phone_pattern.fullmatch(phone.strip()):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid phone number")

    resume_path = save_resume_file(resume)

    application = JobApplication(
        jobId=job.id,
        fullName=fullName.strip(),
        email=str(validated_email),
        phone=phone.strip(),
        resumePath=resume_path,
        coverLetter=coverLetter,
    )

    db.add(application)
    db.commit()
    db.refresh(application)
    return application
