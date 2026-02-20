from pathlib import Path
import shutil
import uuid

from fastapi import HTTPException, UploadFile, status

from app.core.config import settings


ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx"}


def ensure_upload_dir() -> Path:
    target = Path(settings.UPLOAD_DIR)
    target.mkdir(parents=True, exist_ok=True)
    return target


def save_resume_file(file: UploadFile) -> str:
    upload_dir = ensure_upload_dir()

    original_name = file.filename or "resume"
    extension = Path(original_name).suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume must be one of: .pdf, .doc, .docx",
        )

    stored_name = f"{uuid.uuid4().hex}{extension}"
    destination = upload_dir / stored_name

    with destination.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return str(destination).replace("\\", "/")
