Career Page Assignment
Project Overview

This is a full-stack Career Page module built as part of a company assignment.

The original required stack was Node.js, Express, TypeScript, Prisma, and PostgreSQL.
However, I implemented the backend using FastAPI and MySQL because I am more comfortable with this stack and wanted to deliver a clean, well-structured, and working solution.

The application includes a public job listing interface and a protected admin panel for managing jobs and applications.

Tech Stack
Backend

Python 3.11

FastAPI

MySQL

SQLAlchemy ORM

JWT authentication (python-jose)

bcrypt password hashing

File upload handling (resume files stored on server)

Frontend

HTML

CSS

Vanilla JavaScript

Fetch API

Features
Public Side

List active jobs

View job details

Apply to a job with:

fullName

email

phone

resume upload (.pdf / .doc / .docx)

optional coverLetter

Admin Side

Login with JWT

Create job

Update job

Delete job

Activate / Deactivate job

View applications (filtered by jobId)

Update application status:

APPLIED

SHORTLISTED

REJECTED

Folder Structure
Backend

app/

core (config, dependencies, security)

models (admin, job, application)

routes (public, admin_auth, admin_jobs, admin_applications)

schemas (auth, job, application)

services (admin_service, file_service)

database.py

main.py

.env

db.py (create first admin)

uploads/

resumes/ (stores uploaded resume files; only path is saved in DB)

Frontend

frontend/

index.html

job.html

admin-login.html

admin-dashboard.html

styles.css

js/api.js

js/public.js

js/admin.js

js/auth.js

Setup Instructions
Backend Setup

Create a virtual environment:

python -m venv venv
venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Create a MySQL database:

career_db

Configure app/.env with:

DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
JWT_SECRET_KEY
JWT_ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES
UPLOAD_DIR

Run backend:

uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

Create First Admin

Run:

python db.py your_email@example.com
 your_password

Use these credentials to log in from the admin panel.

Frontend Setup

Navigate to frontend:

cd frontend

Start a simple server:

python -m http.server 5500 --bind 127.0.0.1

Open in browser:

http://127.0.0.1:5500/index.html

http://127.0.0.1:5500/admin-login.html

Make sure backend is running on port 8000.

API Overview
Public

GET /jobs
GET /jobs/{job_id}
POST /jobs/{job_id}/apply

Admin Auth

POST /admin/auth/login

Admin Jobs

POST /admin/jobs
PUT /admin/jobs/{job_id}
DELETE /admin/jobs/{job_id}
PATCH /admin/jobs/{job_id}/activate
PATCH /admin/jobs/{job_id}/deactivate

Admin Applications

GET /admin/applications?jobId={id}
PATCH /admin/applications/{application_id}/status

Authentication:

Login returns JWT

Frontend stores token in localStorage

Protected requests use Authorization: Bearer <token>

Architecture Decisions

I followed a layered structure to keep the project organized and maintainable:

Routes handle HTTP logic

Schemas handle validation

Services contain business logic

Models define database structure

JWT is used for securing admin routes.
Passwords are hashed using bcrypt.
Resume files are stored on disk and only the file path is saved in the database to keep it lightweight.
Application status is implemented as an enum to enforce valid state transitions.

End-to-End Test Flow

Start backend

Create admin using db.py

Open frontend

Log in as admin

Create a job

Log out

Apply to the job from public page

Log back in as admin

View application and update status


This project focuses on clean structure, proper validation, secure authentication, and fulfilling the assignment requirements in a practical way.
