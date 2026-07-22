# 🚀 Acquisitions API

A modern RESTful backend built with **Node.js**, **Express.js**, **PostgreSQL**, and **Drizzle ORM** for managing companies, acquisitions, users, authentication, and analytics.

The project demonstrates secure authentication, role-based authorization, CRUD operations, dashboard analytics, file uploads, API documentation, and Docker deployment.

---

## 📖 Table of Contents

- Features
- Technology Stack
- Project Architecture
- Installation
- Environment Variables
- Running the Project
- Docker
- API Documentation
- Authentication
- API Endpoints
- Folder Structure
- Security
- Future Improvements

---

# ✨ Features

### Authentication

- JWT Authentication
- Secure Login & Registration
- Password Hashing using bcrypt
- Protected Routes

### User Management

- User Registration
- User Login
- Get All Users
- User Profile
- Update User
- Delete User

### Company Management

- Create Company
- Update Company
- Delete Company
- Search Companies
- Filter Companies
- Pagination
- Sorting
- Upload Company Logo

### Acquisition Management

- Create Acquisition
- Update Acquisition
- Delete Acquisition
- View Acquisition History
- Company Relationship Tracking

### Dashboard

- Total Users
- Total Companies
- Total Acquisitions
- Total Deal Value
- Latest Companies
- Latest Acquisitions

### Security

- JWT Authentication
- Role-Based Authorization
- Helmet
- CORS
- Arcjet Protection
- Zod Validation
- Centralized Error Handling

---

# 🛠 Technology Stack

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript Runtime |
| Express.js | Backend Framework |
| PostgreSQL | Database |
| Drizzle ORM | ORM |
| JWT | Authentication |
| bcrypt | Password Hashing |
| Zod | Validation |
| Multer | File Upload |
| Swagger | API Documentation |
| Winston | Logging |
| Docker | Containerization |
| Arcjet | Security & Rate Limiting |

---

# 📁 Project Structure

```text
src/
│
├── config/
├── controllers/
├── middleware/
├── models/
├── route/
├── services/
├── validations/
├── uploads/
├── utils/
│
├── app.js
└── index.js
```

---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/acquisitions-api.git
```

Move into the project

```bash
cd acquisitions-api
```

Install dependencies

```bash
npm install
```

Create a `.env` file.

Run the project

```bash
npm run dev
```

---

# 🐳 Docker

Build and start the project

```bash
docker compose --env-file .env.development -f docker-compose.dev.yml up --build
```

---

# 🔑 Environment Variables

```env
PORT=3000

DATABASE_URL=

JWT_SECRET=

ARCJET_KEY=

NODE_ENV=development
```

---

# 📚 API Documentation

Swagger UI

```
http://localhost:3000/api-docs
```

---

# 🔐 Authentication

All protected routes require a JWT Bearer Token.

Example:

```
Authorization: Bearer <your_token>
```

---

# 📌 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/signup |
| POST | /api/auth/signin |
| GET | /api/auth/profile |

---

## Users

| Method | Endpoint |
|---------|----------|
| GET | /api/users |
| GET | /api/users/:id |
| PUT | /api/users/:id |
| DELETE | /api/users/:id |

---

## Companies

| Method | Endpoint |
|---------|----------|
| GET | /api/companies |
| GET | /api/companies/my |
| GET | /api/companies/stats |
| GET | /api/companies/:id |
| POST | /api/companies |
| PUT | /api/companies/:id |
| DELETE | /api/companies/:id |
| POST | /api/companies/:id/logo |

---

## Acquisitions

| Method | Endpoint |
|---------|----------|
| GET | /api/acquisitions |
| GET | /api/acquisitions/:id |
| POST | /api/acquisitions |
| PUT | /api/acquisitions/:id |
| DELETE | /api/acquisitions/:id |

---

## Dashboard

| Method | Endpoint |
|---------|----------|
| GET | /api/dashboard |

---

# 🛡 Security

- JWT Authentication
- Password Hashing
- Helmet
- CORS
- Arcjet Protection
- Role-Based Authorization
- Request Validation
- Centralized Error Handling

---

# 🚀 Future Improvements

- Refresh Token Authentication
- Email Verification
- Password Reset
- Soft Deletes
- Audit Logs
- Unit Testing
- CI/CD Pipeline
- Redis Caching

---

# 👨‍💻 Author

**Aayush**

Backend Developer

---

## ⭐ If you found this project helpful, consider giving it a star!