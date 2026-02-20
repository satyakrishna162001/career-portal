Career Page Module
Project Overview:

This project is a Career Page module built as part of the company assignment.
It allows users to view job openings and apply for them. An admin panel is provided to manage jobs and review applications.

Although the requirement mentioned Node.js and PostgreSQL, I implemented the backend using FastAPI and MySQL, as I am more comfortable with this stack and wanted to deliver a stable and clean solution.

Tech Stack

Backend
Python
FastAPI
MySQL
JWT Authentication

Frontend
HTML
CSS
Vanilla JavaScript

Features

Public Side

View active job listings

View job details

Apply for a job with resume upload

Admin Side

Admin login (JWT)

Create, update, delete jobs

Activate or deactivate jobs

View applications

Update application status (APPLIED, SHORTLISTED, REJECTED)

Setup Instructions

Clone the repository.

Create and activate a virtual environment:

python -m venv venv
venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Create a .env file inside the backend folder and add:

DATABASE_URL=mysql+pymysql://username:password@localhost/database_name
SECRET_KEY=your_secret_key

Run the server:

uvicorn app.main:app --reload

Open the frontend HTML files in your browser after starting the backend.

Architecture Decisions

The project follows a simple layered structure (routers, models, schemas, services) to keep code organized.

JWT authentication is used to protect admin routes.

Resume files are stored on the server, and only the file path is saved in the database.

Enums are used for application status to maintain controlled state changes.

This implementation focuses on clean structure, proper validation, secure authentication, and meeting the assignment requirements.
