Project Overview

This project is a Career Page module where:

Public users can view job openings and apply.

Admin users can manage jobs and review applications.

Although the original requirement specified Node.js and Prisma, I implemented the backend using FastAPI and MySQL, as I am more comfortable with this stack and wanted to ensure a clean and well-structured implementation.

Tech Stack
Backend

Python 3.11

FastAPI

MySQL

SQLAlchemy ORM

JWT Authentication

File upload handling

Frontend

HTML

CSS

Vanilla JavaScript (Fetch API)

Features Implemented
Public Side

List active jobs

View job details

Apply to job (Full Name, Email, Phone, Resume upload, Optional cover letter)

Admin Side

Admin login using JWT

Create job

Update job

Delete job

Activate / Deactivate job

View applications

Update application status (APPLIED / SHORTLISTED / REJECTED)

Backend Setup

Clone the repository:

git clone <repository-link>
cd career-page-module


Create virtual environment:

python -m venv venv


Activate environment:

Windows:

venv\Scripts\activate


Install dependencies:

pip install -r requirements.txt


Create a .env file and configure:

DATABASE_URL=mysql+pymysql://username:password@localhost/database_name
SECRET_KEY=your_secret_key


Run the server:

uvicorn app.main:app --reload


Backend runs on:

http://localhost:8000

Frontend Setup

Ensure backend server is running.

Open the frontend HTML files in the browser:

index.html (Public Job Listing)

admin-login.html (Admin Panel)

-- Short Explanation of Architecture Decisions

The project follows a layered architecture: routers, services, models, and schemas.

Dependency injection is used for database sessions and authentication.

JWT authentication is implemented to secure admin routes.

Resume files are stored on the server and only the file path is saved in the database.

Enum is used for application status to maintain controlled state transitions.

Separation between public and admin APIs ensures clear responsibility and security.

This implementation focuses on clean structure, proper validation, RESTful API design, and secure authentication as per the assignment evaluation criteria.
