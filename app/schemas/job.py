from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class JobBase(BaseModel):
    title: str
    description: str
    location: str
    jobType: str


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    jobType: Optional[str] = None
    isActive: Optional[bool] = None


class JobResponse(JobBase):
    id: int
    isActive: bool
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)
