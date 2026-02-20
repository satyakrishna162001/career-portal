# Career Page Assignment

## Project Overview
This is a full-stack Career Page module built as part of a company assignment.

The original required stack was Node.js, Express, TypeScript, Prisma, and PostgreSQL. I implemented it with FastAPI and MySQL because I am more comfortable with this stack and wanted to deliver a clean, working solution.

The project includes a public job listing/apply flow and a protected admin panel for job and application management.

## Tech Stack

### Backend
- Python 3.11
- FastAPI
- MySQL
- SQLAlchemy ORM
- JWT authentication (`python-jose`)
- `bcrypt` password hashing
- File upload handling (resume files stored on server)

### Frontend
- HTML
- CSS
- Vanilla JavaScript
- Fetch API

## Features

### Public Side
- List active jobs
- View job details
- Apply to a job with:
  - `fullName`
  - `email`
  - `phone`
  - resume upload (`.pdf` / `.doc` / `.docx`)
  - optional `coverLetter`

### Admin Side
- Login with JWT
- Create job
- Update job
- Delete job
- Activate / Deactivate job
- View applications (filtered by `jobId`)
- Update application status:
  - `APPLIED`
  - `SHORTLISTED`
  - `REJECTED`

## Setup Instructions

### Backend Setup
Create and activate virtual environment:

```bash
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create MySQL database:

```sql
CREATE DATABASE career_db;
```

Configure `app/.env` with:
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET_KEY`
- `JWT_ALGORITHM`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `UPLOAD_DIR`

Run backend:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Create first admin:

```bash
python db.py your_email@example.com your_password
```

### Demo Login Credentials
Use these credentials for local/demo login:
- **Email:** `your_email@example.com`
- **Password:** `your_password`

### Frontend Setup

```bash
cd frontend
python -m http.server 5500 --bind 127.0.0.1
```

Open in browser:
- `http://127.0.0.1:5500/index.html`
- `http://127.0.0.1:5500/admin-login.html`

Make sure backend is running on port `8000`.

## Architecture Decisions
I used a layered structure to keep the project easy to maintain:
- Routes handle HTTP logic
- Schemas handle validation
- Services contain reusable business logic
- Models define database structure

JWT is used to secure admin routes. Passwords are hashed with `bcrypt`. Resume files are stored on disk and only their path is saved in the database.
