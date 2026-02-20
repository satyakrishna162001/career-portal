from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String

from app.database import Base


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    passwordHash = Column(String(255), nullable=False)
    createdAt = Column(DateTime, default=datetime.utcnow, nullable=False)
