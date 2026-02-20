import sys

from app.core.security import hash_password
from app.database import SessionLocal
from app.models.admin import Admin


def create_admin(email: str, password: str) -> None:
    db = SessionLocal()
    try:
        existing = db.query(Admin).filter(Admin.email == email).first()
        if existing:
            print("Admin already exists")
            return

        admin = Admin(email=email, passwordHash=hash_password(password))
        db.add(admin)
        db.commit()
        print("Admin created")
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python db.py <email> <password>")
        raise SystemExit(1)

    create_admin(sys.argv[1], sys.argv[2])
