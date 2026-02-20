# README

## Setup Instructions

### 1. Backend
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create MySQL database:
```sql
CREATE DATABASE career_db;
```

Configure `app/.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=career_db
JWT_SECRET_KEY=change-me
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
UPLOAD_DIR=uploads/resumes
```

Run backend:
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 2. Create Admin User
```bash
python db.py your_email@example.com your_password
```

### 3. Frontend
```bash
cd frontend
python -m http.server 5500 --bind 127.0.0.1
```

Open:
- `http://127.0.0.1:5500/index.html`
- `http://127.0.0.1:5500/admin-login.html`

Note: backend must be running before using frontend features.

## Architecture Decisions (Short)
- I used **FastAPI** because it is quick to build APIs and gives built-in Swagger docs.
- I used **SQLAlchemy** to keep database models and relationships structured.
- I separated code into `routes`, `schemas`, `services`, and `core` to keep `main.py` clean and avoid mixing all logic in one place.
- I kept frontend in plain HTML/CSS/JavaScript to match assignment scope and keep the project simple.
