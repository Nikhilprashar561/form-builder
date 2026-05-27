# NexForm — Modern Full Stack Form Builder SaaS

A production-grade full stack form builder platform where users can create, customize, publish, and manage dynamic forms with real-time analytics and response management.

Built using modern technologies like Next.js, tRPC, PostgreSQL, Drizzle ORM, Tailwind CSS, and TypeScript.

---

# Problem Statement

Traditional form builders are either:
- expensive,
- limited in customization,
- difficult to self-host,
- or lack developer-focused extensibility.

NexForm solves this problem by providing:
- a customizable form creation platform,
- modern full-stack architecture,
- scalable backend APIs,
- public/private form sharing,
- response analytics,
- authentication,
- and dynamic schema-driven form generation.

---

# Features

## Authentication
- User Signup
- User Login
- Email Verification
- JWT Authentication
- Protected Routes
- Session Management

## Form Builder
- Create Dynamic Forms
- Add Multiple Field Types
- Required / Optional Fields
- Public / Unlisted Forms
- Custom Form Slugs
- Form Publishing
- Form Unpublishing

## Form Fields
Supported field types:
- Text
- Email
- Password
- Number
- Yes/No

## Form Responses
- Public Form Submission
- Store Responses
- Response Validation
- Form Analytics
- Submission Tracking

## Dashboard
- User Created Forms
- Form Management
- Response Insights
- Analytics Overview

## Backend Features
- Type-safe APIs using tRPC
- Schema Validation using Zod
- PostgreSQL Database
- Drizzle ORM
- Modular Backend Architecture
- API Documentation using Scalar

---

# Tech Stack

## Frontend
- Next.js
- React.js
- TypeScript
- Tailwind CSS
- React Hook Form
- TanStack Query
- tRPC Client

## Backend
- Node.js
- tRPC
- Drizzle ORM
- PostgreSQL
- Zod
- JWT Authentication

## DevOps / Tools
- Turborepo
- PNPM
- Docker
- Scalar API Docs

---

# Monorepo Structure

```bash
form-builder/
│
├── apps/
│   ├── web/          # Frontend (Next.js)
│   └── api/          # Backend (tRPC API)
│
├── packages/
│   ├── typescript-config/
│   └── eslint-config/
│
├── package.json
├── turbo.json
└── pnpm-workspace.yaml
```

---

# Installation

## 1. Clone Repository

```bash
git clone https://github.com/Nikhilprashar561/form-builder.git
```

---

## 2. Navigate into project

```bash
cd form-builder
```

---

## 3. Install Dependencies

```bash
pnpm install
```

---

# 🐳 Docker Setup

## Start PostgreSQL Container

```bash
docker compose up -d
```

---

# Environment Variables

Create `.env` files inside apps.

---

## apps/api/.env

```env
DATABASE_URL=postgresql://username:password@localhost:5432/formbuilder

JWT_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:3000

NODE_ENV=development
```

---

## apps/web/.env

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

# Database Setup

## Generate Migrations

```bash
pnpm drizzle-kit generate
```

---

## Push Schema

```bash
pnpm drizzle-kit push
```

---

# Running the Project

## Run All Apps

```bash
pnpm dev
```

---

## Frontend

```bash
http://localhost:3000
```

---

## Backend

```bash
http://localhost:8080
```

---

# Database Schema Overview

---

## User Table

| Field | Type |
|---|---|
| id | UUID |
| fullName | varchar |
| email | varchar |
| password | text |
| createdAt | timestamp |

---

## Form Table

| Field | Type |
|---|---|
| id | UUID |
| title | varchar |
| description | text |
| slug | varchar |
| visibility | enum |
| createdBy | UUID |
| isPublished | boolean |

---

## Form Fields Table

| Field | Type |
|---|---|
| id | UUID |
| formId | UUID |
| label | varchar |
| fieldType | enum |
| required | boolean |

---

## Form Submission Table

| Field | Type |
|---|---|
| id | UUID |
| formId | UUID |
| submittedAt | timestamp |

---

# Authentication Flow

```text
User Signup
    ↓
Email Verification
    ↓
Login
    ↓
JWT Token Generated
    ↓
Protected Routes Access
```

---

# API Routes

# Authentication APIs

## Register User

```http
POST /auth/register
```

---

## Login User

```http
POST /auth/login
```

---

## Verify Email

```http
POST /auth/verify-email
```

---

# Form APIs

## Create Form

```http
POST /form/create
```

---

## Update Form

```http
PUT /form/update
```

---

## Delete Form

```http
DELETE /form/delete
```

---

## Get Created Forms

```http
GET /form/getCreatedForms
```

---

## Get One Specific Form

```http
GET /form/getOneSpecificFormWithAllFields
```

---

# Form Field APIs

## Create Field

```http
POST /field/create
```

---

## Update Field

```http
PUT /field/update
```

---

## Delete Field

```http
DELETE /field/delete
```

---

# Submission APIs

## Submit Form

```http
POST /submission/create
```

---

## Get Form Responses

```http
GET /submission/getAll
```

---

## Get Analytics

```http
GET /submission/analytics
```

---

# Frontend Pages

| Page | Description |
|---|---|
| Home | Landing Page |
| Login | User Authentication |
| Signup | User Registration |
| Verify Email | Email Verification |
| Dashboard | User Dashboard |
| Create Form | Form Builder |
| Form Details | Form Analytics |
| Public Form | Form Submission |

---

# Architecture

```text
Frontend (Next.js)
        ↓
tRPC Client
        ↓
Backend API (Node.js + tRPC)
        ↓
Drizzle ORM
        ↓
PostgreSQL Database
```

---

# Future Improvements

- Drag & Drop Builder
- File Upload Fields
- Multi-Step Forms
- Form Themes
- Webhooks
- Email Notifications
- CSV Export
- Rate Limiting
- AI Form Generation
- Team Collaboration

---

# Deployment

## Frontend Deployment
- Vercel
- Netlify

## Backend Deployment
- Render
- Railway
- VPS

## Database
- Neon PostgreSQL
- Supabase
- Railway PostgreSQL

---

# Development Commands

## Run Development Server

```bash
pnpm dev
```

---

## Build Project

```bash
pnpm build
```

---

## Run Linter

```bash
pnpm lint
```

---

# Project Goals

This project was built to:
- learn scalable backend architecture,
- understand type-safe APIs,
- practice production-grade monorepo structure,
- and build a real SaaS-level application.

---

# Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch
3. Commit changes
4. Push branch
5. Create Pull Request

---

# License

This project is licensed under the MIT License.

---

# Author

## Nikhil Prashar

Full Stack Developer focused on building scalable full-stack applications using modern web technologies.

- JavaScript
- TypeScript
- React.js
- Next.js
- Node.js
- PostgreSQL
- Drizzle ORM
- tRPC

---

# Support

If you like this project, consider giving it a on GitHub.
