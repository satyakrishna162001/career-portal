from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.application import ApplicationStatus


class JobApplicationResponse(BaseModel):
    id: int
    jobId: int
    fullName: str
    email: EmailStr
    phone: str
    resumePath: str
    coverLetter: str | None = None
    status: ApplicationStatus
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus
