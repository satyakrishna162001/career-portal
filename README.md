# Career Page Assignment

## Project Overview
This is a full-stack Career Page module built as part of a company assignment.

The original required stack was Node.js, Express, TypeScript, Prisma, and PostgreSQL. I implemented the backend using FastAPI and MySQL to deliver the same functionality in a clean and maintainable way.

The project has:
- Public job listing and application flow
- Admin panel for managing jobs and applications

## Tech Stack

### Backend
- Python 3.11
- FastAPI
- MySQL
- SQLAlchemy ORM
- JWT authentication (`python-jose`)
- `bcrypt` password hashing
- File upload handling

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

## Folder Structure

### Backend
- `app/`
  - `core` (config, dependencies, security)
  - `models` (admin, job, application)
  - `routes` (public, admin_auth, admin_jobs, admin_applications)
  - `schemas` (auth, job, application)
  - `services` (admin_service, file_service)
  - `database.py`
  - `main.py`
  - `.env`
- `db.py` (create first admin)
- `uploads/resumes/` (stores uploaded resume files; only path is saved in DB)

### Frontend
- `frontend/`
  - `index.html`
  - `job.html`
  - `admin-login.html`
  - `admin-dashboard.html`
  - `styles.css`
  - `js/api.js`
  - `js/public.js`
  - `js/admin.js`
  - `js/auth.js`

## Setup Instructions

### Backend Setup
Create a virtual environment and install dependencies:

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create a MySQL database:

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

### Create First Admin

```bash
python db.py your_email@example.com your_password
```

<<<<<<< HEAD
python db.py your_email@example.com
 your_password

--------Use these credentials to log in from the admin panel.

--Frontend Setup:

Navigate to frontend:
=======
### Frontend Setup
>>>>>>> 6672a89 (Refine README formatting and setup instructions)

```bash
cd frontend
python -m http.server 5500 --bind 127.0.0.1
```

Open in browser:
- `http://127.0.0.1:5500/index.html`
- `http://127.0.0.1:5500/admin-login.html`

Make sure backend is running on port `8000`.

## API Overview

### Public
- `GET /jobs`
- `GET /jobs/{job_id}`
- `POST /jobs/{job_id}/apply`

### Admin Auth
- `POST /admin/auth/login`

### Admin Jobs
- `POST /admin/jobs`
- `PUT /admin/jobs/{job_id}`
- `DELETE /admin/jobs/{job_id}`
- `PATCH /admin/jobs/{job_id}/activate`
- `PATCH /admin/jobs/{job_id}/deactivate`

### Admin Applications
- `GET /admin/applications?jobId={id}`
- `PATCH /admin/applications/{application_id}/status`

## Authentication
- Login returns JWT
- Frontend stores token in `localStorage`
- Protected requests use `Authorization: Bearer <token>`

## Architecture Decisions
I followed a layered structure so code is easier to read and maintain:
- Routes handle HTTP layer
- Schemas handle validation
- Services hold reusable business logic
- Models define DB tables/relationships

JWT protects admin routes, passwords are hashed with `bcrypt`, and resume files are stored on disk while DB stores only file paths.

## End-to-End Test Flow
1. Start backend
2. Create admin using `db.py`
3. Start frontend
4. Login as admin
5. Create a job
6. Open public page and apply
7. Go back to admin and update application status
