from sqlalchemy.orm import Session

from app.models.admin import Admin

from app.core.security import verify_password


def authenticate_admin(db: Session, email: str, password: str) -> Admin | None:
    admin = db.query(Admin).filter(Admin.email == email).first()
    if not admin:
        return None

    if not verify_password(password, admin.passwordHash):
        return None

    return admin
