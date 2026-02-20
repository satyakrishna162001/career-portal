from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AdminResponse(BaseModel):
    id: int
    email: EmailStr
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)
