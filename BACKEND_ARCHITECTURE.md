# InterviewAI Backend Architecture Design

**Version:** 1.0  
**Last Updated:** June 21, 2026  
**Architect:** Principal Backend Architect  
**Style:** Modular Monolith with Feature-Based Architecture

---

## Table of Contents

1. [Complete Folder Structure](#1-complete-folder-structure)
2. [Backend Modules](#2-backend-modules)
3. [PostgreSQL Database Design](#3-postgresql-database-design)
4. [Prisma Schema Architecture](#4-prisma-schema-architecture)
5. [ATS Resume Analyzer Design](#5-ats-resume-analyzer-design)
6. [Interview Engine Design](#6-interview-engine-design)
7. [Coding Interview Design](#7-coding-interview-design)
8. [Voice Interview Design](#8-voice-interview-design)
9. [Security Architecture](#9-security-architecture)
10. [Scalability Strategy](#10-scalability-strategy)
11. [Future Expansion](#11-future-expansion)

---

## 1. Complete Folder Structure

### Overview
Next.js 15 App Router with modular monolith architecture. Feature-based organization with clear separation of concerns.

```
interviewai/
├── src/
│   ├── app/                                    # Next.js App Router
│   │   ├── (auth)/                            # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/                       # Dashboard route group
│   │   │   ├── candidate/
│   │   │   │   ├── resume/
│   │   │   │   │   ├── upload/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── interviews/
│   │   │   │   │   ├── create/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── reports/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── learning/
│   │   │   │       └── page.tsx
│   │   │   ├── recruiter/
│   │   │   │   ├── assessments/
│   │   │   │   │   ├── create/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── candidates/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── reports/
│   │   │   │       └── page.tsx
│   │   │   ├── organization/
│   │   │   │   ├── team/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── recruiters/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (marketing)/                      # Marketing route group
│   │   │   ├── page.tsx
│   │   │   ├── pricing/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/                              # API Routes (Server Actions)
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/
│   │   │   │   │   └── route.ts
│   │   │   │   └── callback/
│   │   │   │       └── route.ts
│   │   │   ├── v1/
│   │   │   │   ├── users/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── resumes/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── analyze/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── interviews/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── sessions/
│   │   │   │   │   │   ├── route.ts
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── route.ts
│   │   │   │   │   └── generate/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── questions/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── answers/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── evaluations/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── coding/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── submit/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── execute/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── voice/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── upload/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── transcribe/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── reports/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── analytics/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── learning/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   ├── roadmaps/
│   │   │   │   │   │   ├── route.ts
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── route.ts
│   │   │   │   │   └── progress/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── subscriptions/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── checkout/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── recruiters/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── assessments/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── share/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── candidates/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── organizations/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── members/
│   │   │   │   │   │   ├── route.ts
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── route.ts
│   │   │   │   │   └── invitations/
│   │   │   │   │       └── route.ts
│   │   │   │   └── copilot/
│   │   │   │       ├── route.ts
│   │   │   │       ├── [id]/
│   │   │   │       │   └── route.ts
│   │   │   │       └── suggestions/
│   │   │   │           └── route.ts
│   │   │   └── webhooks/
│   │   │       ├── stripe/
│   │   │       │   └── route.ts
│   │   │       └── cloudinary/
│   │   │           └── route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   │
│   ├── modules/                                # Feature-Based Modules
│   │   ├── auth/
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── session.service.ts
│   │   │   │   └── oauth.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── auth.repository.ts
│   │   │   ├── validators/
│   │   │   │   ├── login.validator.ts
│   │   │   │   ├── register.validator.ts
│   │   │   │   └── session.validator.ts
│   │   │   ├── types/
│   │   │   │   └── auth.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── user/
│   │   │   ├── services/
│   │   │   │   ├── user.service.ts
│   │   │   │   └── profile.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── user.repository.ts
│   │   │   ├── validators/
│   │   │   │   ├── user.validator.ts
│   │   │   │   └── profile.validator.ts
│   │   │   ├── types/
│   │   │   │   └── user.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── resume/
│   │   │   ├── services/
│   │   │   │   ├── resume.service.ts
│   │   │   │   ├── upload.service.ts
│   │   │   │   └── parser.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── resume.repository.ts
│   │   │   ├── validators/
│   │   │   │   └── resume.validator.ts
│   │   │   ├── types/
│   │   │   │   └── resume.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── ats-analyzer/
│   │   │   ├── services/
│   │   │   │   ├── ats.service.ts
│   │   │   │   ├── keyword.service.ts
│   │   │   │   ├── skill-gap.service.ts
│   │   │   │   ├── grammar.service.ts
│   │   │   │   ├── formatting.service.ts
│   │   │   │   └── optimization.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── ats.repository.ts
│   │   │   ├── validators/
│   │   │   │   └── ats.validator.ts
│   │   │   ├── types/
│   │   │   │   └── ats.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── interview/
│   │   │   ├── services/
│   │   │   │   ├── interview.service.ts
│   │   │   │   ├── generation.service.ts
│   │   │   │   └── context.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── interview.repository.ts
│   │   │   ├── validators/
│   │   │   │   └── interview.validator.ts
│   │   │   ├── types/
│   │   │   │   └── interview.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── question/
│   │   │   ├── services/
│   │   │   │   ├── question.service.ts
│   │   │   │   └── adaptive.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── question.repository.ts
│   │   │   ├── validators/
│   │   │   │   └── question.validator.ts
│   │   │   ├── types/
│   │   │   │   └── question.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── session/
│   │   │   ├── services/
│   │   │   │   ├── session.service.ts
│   │   │   │   ├── conversation.service.ts
│   │   │   │   └── flow.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── session.repository.ts
│   │   │   ├── validators/
│   │   │   │   └── session.validator.ts
│   │   │   ├── types/
│   │   │   │   └── session.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── answer/
│   │   │   ├── services/
│   │   │   │   ├── answer.service.ts
│   │   │   │   └── analysis.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── answer.repository.ts
│   │   │   ├── validators/
│   │   │   │   └── answer.validator.ts
│   │   │   ├── types/
│   │   │   │   └── answer.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── evaluation/
│   │   │   ├── services/
│   │   │   │   ├── evaluation.service.ts
│   │   │   │   ├── scoring.service.ts
│   │   │   │   ├── feedback.service.ts
│   │   │   │   └── metric.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── evaluation.repository.ts
│   │   │   ├── validators/
│   │   │   │   └── evaluation.validator.ts
│   │   │   ├── types/
│   │   │   │   └── evaluation.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── coding/
│   │   │   ├── services/
│   │   │   │   ├── coding.service.ts
│   │   │   │   ├── judge0.service.ts
│   │   │   │   ├── execution.service.ts
│   │   │   │   ├── test-case.service.ts
│   │   │   │   └── code-review.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── coding.repository.ts
│   │   │   ├── validators/
│   │   │   │   └── coding.validator.ts
│   │   │   ├── types/
│   │   │   │   └── coding.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── voice/
│   │   │   ├── services/
│   │   │   │   ├── voice.service.ts
│   │   │   │   ├── transcription.service.ts
│   │   │   │   ├── analysis.service.ts
│   │   │   │   └── scoring.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── voice.repository.ts
│   │   │   ├── validators/
│   │   │   │   └── voice.validator.ts
│   │   │   ├── types/
│   │   │   │   └── voice.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── report/
│   │   │   ├── services/
│   │   │   │   ├── report.service.ts
│   │   │   │   ├── generation.service.ts
│   │   │   │   └── export.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── report.repository.ts
│   │   │   ├── validators/
│   │   │   │   └── report.validator.ts
│   │   │   ├── types/
│   │   │   │   └── report.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── analytics/
│   │   │   ├── services/
│   │   │   │   ├── analytics.service.ts
│   │   │   │   ├── tracking.service.ts
│   │   │   │   └── insights.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── analytics.repository.ts
│   │   │   ├── validators/
│   │   │   │   └── analytics.validator.ts
│   │   │   ├── types/
│   │   │   │   └── analytics.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── learning/
│   │   │   ├── services/
│   │   │   │   ├── learning.service.ts
│   │   │   │   ├── roadmap.service.ts
│   │   │   │   └── progress.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── learning.repository.ts
│   │   │   ├── validators/
│   │   │   │   └── learning.validator.ts
│   │   │   ├── types/
│   │   │   │   └── learning.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── subscription/
│   │   │   ├── services/
│   │   │   │   ├── subscription.service.ts
│   │   │   │   ├── billing.service.ts
│   │   │   │   └── plan.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── subscription.repository.ts
│   │   │   ├── validators/
│   │   │   │   └── subscription.validator.ts
│   │   │   ├── types/
│   │   │   │   └── subscription.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── recruiter/
│   │   │   ├── services/
│   │   │   │   ├── recruiter.service.ts
│   │   │   │   └── evaluation.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── recruiter.repository.ts
│   │   │   ├── validators/
│   │   │   │   └── recruiter.validator.ts
│   │   │   ├── types/
│   │   │   │   └── recruiter.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── assessment/
│   │   │   ├── services/
│   │   │   │   ├── assessment.service.ts
│   │   │   │   ├── sharing.service.ts
│   │   │   │   └── candidate.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── assessment.repository.ts
│   │   │   ├── validators/
│   │   │   │   └── assessment.validator.ts
│   │   │   ├── types/
│   │   │   │   └── assessment.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── organization/
│   │   │   ├── services/
│   │   │   │   ├── organization.service.ts
│   │   │   │   ├── member.service.ts
│   │   │   │   ├── invitation.service.ts
│   │   │   │   └── permission.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── organization.repository.ts
│   │   │   ├── validators/
│   │   │   │   └── organization.validator.ts
│   │   │   ├── types/
│   │   │   │   └── organization.types.ts
│   │   │   └── index.ts
│   │   │
│   │   └── copilot/
│   │       ├── services/
│   │       │   ├── copilot.service.ts
│   │       │   ├── suggestion.service.ts
│   │       │   └── real-time.service.ts
│   │       ├── repositories/
│   │       │   └── copilot.repository.ts
│   │       ├── validators/
│   │       │   └── copilot.validator.ts
│   │       ├── types/
│   │       │   └── copilot.types.ts
│   │       └── index.ts
│   │
│   ├── services/                              # Shared Services
│   │   ├── ai/
│   │   │   ├── gemini.service.ts
│   │   │   ├── prompt.service.ts
│   │   │   └── rate-limiter.service.ts
│   │   ├── storage/
│   │   │   ├── cloudinary.service.ts
│   │   │   └── file.service.ts
│   │   ├── email/
│   │   │   ├── resend.service.ts
│   │   │   └── templates.service.ts
│   │   ├── cache/
│   │   │   ├── cache.service.ts
│   │   │   └── redis.service.ts (future)
│   │   ├── queue/
│   │   │   ├── queue.service.ts
│   │   │   └── job.service.ts
│   │   └── notification/
│   │       └── notification.service.ts
│   │
│   ├── repositories/                           # Base Repository
│   │   ├── base.repository.ts
│   │   └── prisma.repository.ts
│   │
│   ├── validators/                            # Shared Validators
│   │   ├── zod.schema.ts
│   │   └── validation.middleware.ts
│   │
│   ├── lib/                                   # Core Libraries
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── logger.ts
│   │   ├── errors.ts
│   │   ├── constants.ts
│   │   └── utils.ts
│   │
│   ├── types/                                 # Shared Types
│   │   ├── common.types.ts
│   │   ├── api.types.ts
│   │   └── error.types.ts
│   │
│   ├── middleware/                            # Middleware
│   │   ├── auth.middleware.ts
│   │   ├── rbac.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── config/                                # Configuration
│   │   ├── env.ts
│   │   ├── database.ts
│   │   └── services.ts
│   │
│   ├── components/                            # UI Components
│   │   └── ...
│   │
│   ├── hooks/                                 # React Hooks
│   │   └── ...
│   │
│   └── stores/                                # State Management
│       └── ...
│
├── prisma/                                    # Prisma ORM
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── public/                                    # Static Assets
│   └── ...
│
├── scripts/                                   # Utility Scripts
│   ├── seed.ts
│   ├── migrate.ts
│   └── cleanup.ts
│
├── tests/                                     # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .env.local
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── components.json
└── README.md
```

### Directory Explanations

#### `app/`
Next.js 15 App Router directory containing:
- **Route Groups**: `(auth)`, `(dashboard)`, `(marketing)` for logical organization
- **API Routes**: RESTful endpoints under `api/v1/` following versioning best practices
- **Webhooks**: External service integrations (Stripe, Cloudinary)
- **Server Actions**: Next.js server actions for mutations

#### `modules/`
Feature-based modules following Domain-Driven Design:
- Each module is self-contained with services, repositories, validators, and types
- Clear boundaries between domains
- Easy to extract to microservices if needed

#### `services/`
Shared cross-cutting services:
- AI services (Gemini integration)
- Storage services (Cloudinary)
- Email services (Resend)
- Cache services (Redis future)
- Queue services (background jobs)
- Notification services

#### `repositories/`
Base repository pattern implementation:
- Generic repository with CRUD operations
- Prisma-specific implementation
- Consistent data access layer

#### `validators/`
Shared validation logic:
- Zod schemas
- Validation middleware
- Input sanitization

#### `lib/`
Core libraries and utilities:
- Database client initialization
- Auth configuration
- Logging utilities
- Error handling
- Constants
- Utility functions

#### `types/`
Shared TypeScript types:
- Common types used across modules
- API response types
- Error types

#### `middleware/`
Request/response middleware:
- Authentication
- RBAC (Role-Based Access Control)
- Rate limiting
- Error handling

#### `config/`
Configuration management:
- Environment variables
- Database configuration
- Service configuration

#### `prisma/`
Prisma ORM configuration:
- Schema definition
- Migrations
- Seed data

---

## 2. Backend Modules

### Module Overview
Each module follows the Service Layer Pattern with Repository Pattern, ensuring separation of concerns and testability.

---

### Auth Module

**Responsibilities:**
- User authentication and authorization
- Session management
- OAuth integration (Google, GitHub)
- Password management (hash, reset)
- Token generation and validation
- Multi-factor authentication (future)

**Relationships:**
- Depends on: User Module
- Used by: All other modules for authentication
- Integrates with: Auth.js (NextAuth v5)

**Dependencies:**
- User Module
- Session Module
- Email Service (for password reset)

**Key Services:**
- `AuthService`: Login, logout, register
- `SessionService`: Session CRUD, validation
- `OAuthService`: OAuth provider integration

---

### User Module

**Responsibilities:**
- User profile management
- User preferences
- Account settings
- Profile completion tracking
- User search and filtering

**Relationships:**
- Depends on: Auth Module
- Used by: Resume, Interview, Organization modules
- One-to-many with: Resume, Interview, Subscription

**Dependencies:**
- Auth Module
- Storage Service (profile images)

**Key Services:**
- `UserService`: User CRUD operations
- `ProfileService`: Profile management, completion tracking

---

### Resume Module

**Responsibilities:**
- Resume upload and storage
- Resume parsing (PDF, DOCX)
- Resume versioning
- Resume metadata extraction
- Resume template management (future)

**Relationships:**
- Depends on: User Module, Storage Service
- One-to-many with: ResumeAnalysis
- Used by: ATS Analyzer Module

**Dependencies:**
- User Module
- Storage Service (Cloudinary)
- Parser Service (PDF parsing)

**Key Services:**
- `ResumeService`: Resume CRUD, versioning
- `UploadService`: File upload handling
- `ParserService`: Resume content extraction

---

### ATS Analyzer Module

**Responsibilities:**
- ATS score calculation
- Keyword matching and extraction
- Missing keyword detection
- Skill gap analysis
- Grammar and spelling analysis
- Formatting analysis
- Job description matching
- Resume optimization suggestions

**Relationships:**
- Depends on: Resume Module, AI Service
- One-to-one with: Resume
- Used by: Report Module

**Dependencies:**
- Resume Module
- AI Service (Gemini)
- Grammar Service (AI-powered)
- Keyword Service

**Key Services:**
- `ATSService`: Main ATS analysis orchestration
- `KeywordService`: Keyword extraction and matching
- `SkillGapService`: Skill gap detection
- `GrammarService`: Grammar and spelling analysis
- `FormattingService`: Resume formatting analysis
- `OptimizationService`: Suggestion generation

---

### Interview Module

**Responsibilities:**
- Interview creation and management
- Interview type configuration (Technical, Behavioral, HR, Coding, Voice)
- Interview template management
- Interview scheduling (future)
- Interview sharing (future)

**Relationships:**
- Depends on: User Module, Question Module
- One-to-many with: InterviewSession, Question
- Used by: Session Module, Report Module

**Dependencies:**
- User Module
- Question Module
- AI Service (question generation)

**Key Services:**
- `InterviewService`: Interview CRUD operations
- `GenerationService`: AI-powered question generation
- `ContextService`: Interview context management

---

### Question Module

**Responsibilities:**
- Question bank management
- Question categorization
- Question difficulty levels
- Question tagging
- Adaptive question selection
- Question versioning

**Relationships:**
- Depends on: Interview Module
- Many-to-one with: Interview
- Used by: Session Module, Answer Module

**Dependencies:**
- Interview Module
- AI Service (question generation)

**Key Services:**
- `QuestionService`: Question CRUD operations
- `AdaptiveService`: Adaptive question selection based on performance

---

### Interview Session Module

**Responsibilities:**
- Interview session lifecycle management
- Conversation flow control
- Session state management
- Real-time session updates
- Session time tracking
- Session completion handling

**Relationships:**
- Depends on: Interview Module, User Module
- One-to-many with: Answer, Message
- Used by: Answer Module, Evaluation Module

**Dependencies:**
- Interview Module
- User Module
- Conversation Service

**Key Services:**
- `SessionService`: Session CRUD, lifecycle management
- `ConversationService`: Conversation flow control
- `FlowService`: Interview flow orchestration

---

### Answer Module

**Responsibilities:**
- Answer storage and management
- Answer analysis
- Answer transcription (voice)
- Answer timing tracking
- Answer quality assessment

**Relationships:**
- Depends on: Session Module, Question Module
- Many-to-one with: Session, Question
- One-to-one with: Evaluation

**Dependencies:**
- Session Module
- Question Module
- AI Service (answer analysis)

**Key Services:**
- `AnswerService`: Answer CRUD operations
- `AnalysisService`: Answer content analysis

---

### Evaluation Module

**Responsibilities:**
- Answer evaluation and scoring
- Performance metric calculation
- Feedback generation
- Evaluation aggregation
- Comparative analysis (future)

**Relationships:**
- Depends on: Answer Module
- One-to-one with: Answer
- One-to-many with: EvaluationMetric
- Used by: Report Module

**Dependencies:**
- Answer Module
- AI Service (evaluation)
- Scoring Service

**Key Services:**
- `EvaluationService`: Evaluation CRUD operations
- `ScoringService`: Score calculation
- `FeedbackService`: AI-powered feedback generation
- `MetricService`: Metric tracking and aggregation

---

### Coding Interview Module

**Responsibilities:**
- Coding question management
- Code execution via Judge0
- Test case management
- Code submission handling
- Complexity analysis
- AI code review
- Code quality assessment

**Relationships:**
- Depends on: Interview Module, Question Module
- One-to-many with: CodingSubmission
- Integrates with: Judge0 API

**Dependencies:**
- Interview Module
- Question Module
- Judge0 Service
- AI Service (code review)

**Key Services:**
- `CodingService`: Coding interview management
- `Judge0Service`: Judge0 API integration
- `ExecutionService`: Code execution orchestration
- `TestCaseService`: Test case management
- `CodeReviewService`: AI-powered code review

---

### Voice Interview Module

**Responsibilities:**
- Audio upload and storage
- Speech-to-text transcription
- Voice analysis (tone, pace, clarity)
- Communication scoring
- Confidence analysis
- Audio quality assessment

**Relationships:**
- Depends on: Session Module, Answer Module
- One-to-one with: Answer
- Integrates with: AI Service (speech-to-text)

**Dependencies:**
- Session Module
- Answer Module
- Storage Service (audio files)
- AI Service (transcription, analysis)

**Key Services:**
- `VoiceService`: Voice interview management
- `TranscriptionService`: Speech-to-text conversion
- `AnalysisService`: Voice analysis
- `ScoringService`: Communication scoring

---

### Report Module

**Responsibilities:**
- Interview report generation
- Performance summary creation
- Recommendation generation
- Report export (PDF, JSON)
- Report sharing (future)
- Report templates

**Relationships:**
- Depends on: Evaluation Module, ATS Analyzer Module
- One-to-one with: InterviewSession
- One-to-many with: Recommendation
- Used by: All modules for reporting

**Dependencies:**
- Evaluation Module
- ATS Analyzer Module
- AI Service (report generation)
- Export Service

**Key Services:**
- `ReportService`: Report CRUD operations
- `GenerationService`: AI-powered report generation
- `ExportService`: Report export functionality

---

### Analytics Module

**Responsibilities:**
- User activity tracking
- Performance analytics
- Usage statistics
- Trend analysis
- Insight generation
- Dashboard data aggregation

**Relationships:**
- Depends on: All modules
- Many-to-one with: User
- Used by: Dashboard, Learning Module

**Dependencies:**
- All modules
- Cache Service (for performance)

**Key Services:**
- `AnalyticsService`: Analytics data collection
- `TrackingService`: Event tracking
- `InsightsService`: Insight generation

---

### Learning Roadmap Module

**Responsibilities:**
- Learning roadmap generation
- Skill-based recommendations
- Progress tracking
- Learning resource curation
- Achievement tracking
- Personalized learning paths

**Relationships:**
- Depends on: Analytics Module, Report Module
- Many-to-one with: User
- Used by: Candidate Dashboard

**Dependencies:**
- Analytics Module
- Report Module
- AI Service (roadmap generation)

**Key Services:**
- `LearningService`: Learning content management
- `RoadmapService`: AI-powered roadmap generation
- `ProgressService`: Progress tracking

---

### Subscription Module

**Responsibilities:**
- Subscription plan management
- Subscription lifecycle
- Billing management
- Payment processing (Stripe)
- Usage tracking
- Plan upgrades/downgrades

**Relationships:**
- Depends on: User Module
- One-to-one with: User
- Integrates with: Stripe API

**Dependencies:**
- User Module
- Stripe API
- Email Service (billing notifications)

**Key Services:**
- `SubscriptionService`: Subscription CRUD operations
- `BillingService`: Billing management
- `PlanService`: Plan management

---

### Recruiter Module

**Responsibilities:**
- Recruiter profile management
- Candidate evaluation
- Candidate ranking
- Assessment management
- Recruiter analytics

**Relationships:**
- Depends on: User Module, Organization Module
- Many-to-one with: Organization
- One-to-many with: Assessment, Candidate

**Dependencies:**
- User Module
- Organization Module
- Evaluation Module

**Key Services:**
- `RecruiterService`: Recruiter CRUD operations
- `EvaluationService`: Candidate evaluation orchestration

---

### Assessment Module

**Responsibilities:**
- Assessment creation and management
- Assessment template management
- Assessment sharing
- Candidate assignment
- Assessment results aggregation
- Assessment analytics

**Relationships:**
- Depends on: Recruiter Module, Interview Module
- Many-to-one with: Recruiter, Organization
- One-to-many with: Candidate
- Used by: Recruiter Dashboard

**Dependencies:**
- Recruiter Module
- Interview Module
- Sharing Service

**Key Services:**
- `AssessmentService`: Assessment CRUD operations
- `SharingService`: Assessment sharing functionality
- `CandidateService`: Candidate assignment and tracking

---

### Organization Module

**Responsibilities:**
- Organization management
- Team management
- Member management
- Role and permission management
- Organization settings
- Invitation management
- Multi-tenant support foundation

**Relationships:**
- Depends on: User Module
- One-to-many with: Member, Recruiter, Assessment
- Used by: Recruiter Module, Assessment Module

**Dependencies:**
- User Module
- Email Service (invitations)
- Permission Service

**Key Services:**
- `OrganizationService`: Organization CRUD operations
- `MemberService`: Member management
- `InvitationService`: Invitation handling
- `PermissionService`: RBAC implementation

---

### Interview Copilot Module

**Responsibilities:**
- Real-time interview assistance
- Answer suggestions
- Question hints
- Context-aware guidance
- Real-time feedback
- Interview strategy recommendations

**Relationships:**
- Depends on: Session Module, AI Service
- One-to-one with: InterviewSession
- Used by: Candidate during interviews

**Dependencies:**
- Session Module
- AI Service (real-time suggestions)
- WebSocket Service (future)

**Key Services:**
- `CopilotService`: Copilot orchestration
- `SuggestionService`: AI-powered suggestions
- `RealTimeService`: Real-time assistance (WebSocket)

---

## 3. PostgreSQL Database Design

### Entity Overview
Production-grade database design with proper indexing, constraints, and relationships.

---

### User Entity

**Fields:**
- `id` (UUID, Primary Key)
- `email` (VARCHAR(255), Unique, Not Null)
- `password_hash` (VARCHAR(255), Nullable)
- `first_name` (VARCHAR(100), Not Null)
- `last_name` (VARCHAR(100), Not Null)
- `avatar_url` (TEXT, Nullable)
- `role` (ENUM: CANDIDATE, RECRUITER, ADMIN)
- `email_verified` (BOOLEAN, Default: false)
- `onboarding_completed` (BOOLEAN, Default: false)
- `preferences` (JSONB, Default: {})
- `last_login_at` (TIMESTAMP, Nullable)
- `created_at` (TIMESTAMP, Default: NOW())
- `updated_at` (TIMESTAMP, Default: NOW())
- `deleted_at` (TIMESTAMP, Nullable)

**Indexes:**
- `idx_user_email` (email)
- `idx_user_role` (role)
- `idx_user_created_at` (created_at)

**Constraints:**
- `chk_user_email_format` (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
- `unq_user_email` (email)

**Relationships:**
- One-to-many: Resume, Interview, Subscription, Organization (as owner)

---

### Resume Entity

**Fields:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → User, Not Null)
- `title` (VARCHAR(255), Not Null)
- `file_url` (TEXT, Not Null)
- `file_name` (VARCHAR(255), Not Null)
- `file_size` (INTEGER, Not Null)
- `file_type` (VARCHAR(50), Not Null)
- `parsed_content` (TEXT, Nullable)
- `parsed_metadata` (JSONB, Default: {})
- `is_primary` (BOOLEAN, Default: false)
- `version` (INTEGER, Default: 1)
- `created_at` (TIMESTAMP, Default: NOW())
- `updated_at` (TIMESTAMP, Default: NOW())
- `deleted_at` (TIMESTAMP, Nullable)

**Indexes:**
- `idx_resume_user_id` (user_id)
- `idx_resume_is_primary` (is_primary)
- `idx_resume_created_at` (created_at)

**Constraints:**
- `fk_resume_user_id` (user_id → User.id)
- `chk_resume_file_size` (file_size > 0)

**Relationships:**
- Many-to-one: User
- One-to-one: ResumeAnalysis
- One-to-many: Interview (as source)

---

### ResumeAnalysis Entity

**Fields:**
- `id` (UUID, Primary Key)
- `resume_id` (UUID, Foreign Key → Resume, Not Null)
- `ats_score` (DECIMAL(5,2), Not Null)
- `keyword_score` (DECIMAL(5,2), Not Null)
- `formatting_score` (DECIMAL(5,2), Not Null)
- `grammar_score` (DECIMAL(5,2), Not Null)
- `overall_score` (DECIMAL(5,2), Not Null)
- `matched_keywords` (JSONB, Default: [])
- `missing_keywords` (JSONB, Default: [])
- `skill_gaps` (JSONB, Default: [])
- `grammar_issues` (JSONB, Default: [])
- `formatting_issues` (JSONB, Default: [])
- `suggestions` (JSONB, Default: [])
- `job_description_id` (UUID, Nullable)
- `job_title` (VARCHAR(255), Nullable)
- `created_at` (TIMESTAMP, Default: NOW())
- `updated_at` (TIMESTAMP, Default: NOW())
- `deleted_at` (TIMESTAMP, Nullable)

**Indexes:**
- `idx_resume_analysis_resume_id` (resume_id)
- `idx_resume_analysis_overall_score` (overall_score)
- `idx_resume_analysis_created_at` (created_at)

**Constraints:**
- `fk_resume_analysis_resume_id` (resume_id → Resume.id)
- `chk_resume_analysis_score_range` (ats_score BETWEEN 0 AND 100)

**Relationships:**
- One-to-one: Resume
- Many-to-one: JobDescription (future)

---

### Interview Entity

**Fields:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → User, Not Null)
- `title` (VARCHAR(255), Not Null)
- `description` (TEXT, Nullable)
- `type` (ENUM: TECHNICAL, BEHAVIORAL, HR, CODING, VOICE)
- `difficulty` (ENUM: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
- `duration_minutes` (INTEGER, Nullable)
- `question_count` (INTEGER, Default: 0)
- `status` (ENUM: DRAFT, ACTIVE, ARCHIVED)
- `settings` (JSONB, Default: {})
- `resume_id` (UUID, Foreign Key → Resume, Nullable)
- `created_at` (TIMESTAMP, Default: NOW())
- `updated_at` (TIMESTAMP, Default: NOW())
- `deleted_at` (TIMESTAMP, Nullable)

**Indexes:**
- `idx_interview_user_id` (user_id)
- `idx_interview_type` (type)
- `idx_interview_status` (status)
- `idx_interview_created_at` (created_at)

**Constraints:**
- `fk_interview_user_id` (user_id → User.id)
- `fk_interview_resume_id` (resume_id → Resume.id)
- `chk_interview_duration` (duration_minutes > 0)

**Relationships:**
- Many-to-one: User, Resume
- One-to-many: InterviewSession, Question

---

### Question Entity

**Fields:**
- `id` (UUID, Primary Key)
- `interview_id` (UUID, Foreign Key → Interview, Not Null)
- `question_text` (TEXT, Not Null)
- `question_type` (ENUM: OPEN_ENDED, MULTIPLE_CHOICE, CODING, BEHAVIORAL, SITUATIONAL)
- `category` (VARCHAR(100), Nullable)
- `difficulty` (ENUM: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
- `order_index` (INTEGER, Not Null)
- `expected_keywords` (JSONB, Default: [])
- `evaluation_criteria` (JSONB, Default: {})
- `time_limit_seconds` (INTEGER, Nullable)
- `is_adaptive` (BOOLEAN, Default: false)
- `created_at` (TIMESTAMP, Default: NOW())
- `updated_at` (TIMESTAMP, Default: NOW())
- `deleted_at` (TIMESTAMP, Nullable)

**Indexes:**
- `idx_question_interview_id` (interview_id)
- `idx_question_category` (category)
- `idx_question_difficulty` (difficulty)
- `idx_question_order_index` (order_index)

**Constraints:**
- `fk_question_interview_id` (interview_id → Interview.id)
- `chk_question_order_index` (order_index >= 0)

**Relationships:**
- Many-to-one: Interview
- One-to-many: Answer, CodingQuestion

---

### InterviewSession Entity

**Fields:**
- `id` (UUID, Primary Key)
- `interview_id` (UUID, Foreign Key → Interview, Not Null)
- `user_id` (UUID, Foreign Key → User, Not Null)
- `status` (ENUM: IN_PROGRESS, COMPLETED, ABANDONED)
- `started_at` (TIMESTAMP, Default: NOW())
- `completed_at` (TIMESTAMP, Nullable)
- `duration_seconds` (INTEGER, Nullable)
- `current_question_index` (INTEGER, Default: 0)
- `total_questions_answered` (INTEGER, Default: 0)
- `session_data` (JSONB, Default: {})
- `created_at` (TIMESTAMP, Default: NOW())
- `updated_at` (TIMESTAMP, Default: NOW())
- `deleted_at` (TIMESTAMP, Nullable)

**Indexes:**
- `idx_session_interview_id` (interview_id)
- `idx_session_user_id` (user_id)
- `idx_session_status` (status)
- `idx_session_started_at` (started_at)

**Constraints:**
- `fk_session_interview_id` (interview_id → Interview.id)
- `fk_session_user_id` (user_id → User.id)
- `chk_session_duration` (duration_seconds >= 0)

**Relationships:**
- Many-to-one: Interview, User
- One-to-many: Answer, Message, InterviewReport
- One-to-one: Evaluation (aggregated)

---

### Answer Entity

**Fields:**
- `id` (UUID, Primary Key)
- `session_id` (UUID, Foreign Key → InterviewSession, Not Null)
- `question_id` (UUID, Foreign Key → Question, Not Null)
- `answer_text` (TEXT, Nullable)
- `answer_audio_url` (TEXT, Nullable)
- `answer_code` (TEXT, Nullable)
- `answer_type` (ENUM: TEXT, VOICE, CODE)
- `time_taken_seconds` (INTEGER, Nullable)
- `submitted_at` (TIMESTAMP, Default: NOW())
- `answer_metadata` (JSONB, Default: {})
- `created_at` (TIMESTAMP, Default: NOW())
- `updated_at` (TIMESTAMP, Default: NOW())
- `deleted_at` (TIMESTAMP, Nullable)

**Indexes:**
- `idx_answer_session_id` (session_id)
- `idx_answer_question_id` (question_id)
- `idx_answer_submitted_at` (submitted_at)

**Constraints:**
- `fk_answer_session_id` (session_id → InterviewSession.id)
- `fk_answer_question_id` (question_id → Question.id)
- `chk_answer_time_taken` (time_taken_seconds >= 0)

**Relationships:**
- Many-to-one: InterviewSession, Question
- One-to-one: Evaluation
- One-to-one: CodingSubmission (if coding answer)

---

### Evaluation Entity

**Fields:**
- `id` (UUID, Primary Key)
- `answer_id` (UUID, Foreign Key → Answer, Not Null)
- `score` (DECIMAL(5,2), Not Null)
- `max_score` (DECIMAL(5,2), Not Null)
- `feedback` (TEXT, Nullable)
- `strengths` (JSONB, Default: [])
- `weaknesses` (JSONB, Default: [])
- `improvements` (JSONB, Default: [])
- `evaluation_details` (JSONB, Default: {})
- `evaluated_at` (TIMESTAMP, Default: NOW())
- `created_at` (TIMESTAMP, Default: NOW())
- `updated_at` (TIMESTAMP, Default: NOW())
- `deleted_at` (TIMESTAMP, Nullable)

**Indexes:**
- `idx_evaluation_answer_id` (answer_id)
- `idx_evaluation_score` (score)
- `idx_evaluation_evaluated_at` (evaluated_at)

**Constraints:**
- `fk_evaluation_answer_id` (answer_id → Answer.id)
- `chk_evaluation_score_range` (score BETWEEN 0 AND max_score)

**Relationships:**
- One-to-one: Answer
- One-to-many: EvaluationMetric

---

### EvaluationMetric Entity

**Fields:**
- `id` (UUID, Primary Key)
- `evaluation_id` (UUID, Foreign Key → Evaluation, Not Null)
- `metric_name` (VARCHAR(100), Not Null)
- `metric_value` (DECIMAL(5,2), Not Null)
- `metric_description` (TEXT, Nullable)
- `metric_category` (VARCHAR(50), Nullable)
- `created_at` (TIMESTAMP, Default: NOW())
- `updated_at` (TIMESTAMP, Default: NOW())
- `deleted_at` (TIMESTAMP, Nullable)

**Indexes:**
- `idx_evaluation_metric_evaluation_id` (evaluation_id)
- `idx_evaluation_metric_name` (metric_name)

**Constraints:**
- `fk_evaluation_metric_evaluation_id` (evaluation_id → Evaluation.id)
- `chk_evaluation_metric_value` (metric_value >= 0)

**Relationships:**
- Many-to-one: Evaluation

---

### CodingQuestion Entity

**Fields:**
- `id` (UUID, Primary Key)
- `question_id` (UUID, Foreign Key → Question, Not Null)
- `problem_statement` (TEXT, Not Null)
- `input_format` (TEXT, Nullable)
- `output_format` (TEXT, Nullable)
- `constraints` (TEXT, Nullable)
- `examples` (JSONB, Default: [])
- `hints` (JSONB, Default: [])
- `time_limit_seconds` (INTEGER, Nullable)
- `memory_limit_mb` (INTEGER, Nullable)
- `difficulty` (ENUM: EASY, MEDIUM, HARD)
- `tags` (JSONB, Default: [])
- `created_at` (TIMESTAMP, Default: NOW())
- `updated_at` (TIMESTAMP, Default: NOW())
- `deleted_at` (TIMESTAMP, Nullable)

**Indexes:**
- `idx_coding_question_question_id` (question_id)
- `idx_coding_question_difficulty` (difficulty)
- `idx_coding_question_tags` (tags)

**Constraints:**
- `fk_coding_question_question_id` (question_id → Question.id)

**Relationships:**
- One-to-one: Question
- One-to-many: CodingSubmission, TestCase

---

### CodingSubmission Entity

**Fields:**
- `id` (UUID, Primary Key)
- `answer_id` (UUID, Foreign Key → Answer, Not Null)
- `coding_question_id` (UUID, Foreign Key → CodingQuestion, Not Null)
- `code` (TEXT, Not Null)
- `language` (VARCHAR(50), Not Null)
- `status` (ENUM: PENDING, RUNNING, COMPLETED, FAILED, TIMEOUT)
- `execution_time_ms` (INTEGER, Nullable)
- `memory_used_kb` (INTEGER, Nullable)
- `test_cases_passed` (INTEGER, Default: 0)
- `total_test_cases` (INTEGER, Default: 0)
- `judge0_submission_id` (VARCHAR(255), Nullable)
- `stdout` (TEXT, Nullable)
- `stderr` (TEXT, Nullable)
- `compile_output` (TEXT, Nullable)
- `code_review` (JSONB, Default: {})
- `complexity_analysis` (JSONB, Default: {})
- `submitted_at` (TIMESTAMP, Default: NOW())
- `created_at` (TIMESTAMP, Default: NOW())
- `updated_at` (TIMESTAMP, Default: NOW())
- `deleted_at` (TIMESTAMP, Nullable)

**Indexes:**
- `idx_coding_submission_answer_id` (answer_id)
- `idx_coding_submission_question_id` (coding_question_id)
- `idx_coding_submission_status` (status)
- `idx_coding_submission_submitted_at` (submitted_at)

**Constraints:**
- `fk_coding_submission_answer_id` (answer_id → Answer.id)
- `fk_coding_submission_question_id` (coding_question_id → CodingQuestion.id)

**Relationships:**
- Many-to-one: Answer, CodingQuestion

---

### TestCase Entity

**Fields:**
- `id` (UUID, Primary Key)
- `coding_question_id` (UUID, Foreign Key → CodingQuestion, Not Null)
- `input` (TEXT, Not Null)
- `expected_output` (TEXT, Not Null)
- `is_hidden` (BOOLEAN, Default: false)
- `order_index` (INTEGER, Not Null)
- `created_at` (TIMESTAMP, Default: NOW())
- `updated_at` (TIMESTAMP, Default: NOW())
- `deleted_at` (TIMESTAMP, Nullable)

**Indexes:**
- `idx_test_case_coding_question_id` (coding_question_id)
- `idx_test_case_is_hidden` (is_hidden)
- `idx_test_case_order_index` (order_index)

**Constraints:**
- `fk_test_case_coding_question_id` (coding_question_id → CodingQuestion.id)

**Relationships:**
- Many-to-one: CodingQuestion

---

### InterviewReport Entity

**Fields:**
- `id` (UUID, Primary Key)
- `session_id` (UUID, Foreign Key → InterviewSession, Not Null)
- `overall_score` (DECIMAL(5,2), Not Null)
- `performance_summary` (TEXT, Not Null)
- `strengths` (JSONB, Default: [])
- `weaknesses` (JSONB, Default: [])
- `detailed_feedback` (JSONB, Default: {})
- `recommendations` (JSONB, Default: [])
- `comparison_data` (JSONB, Default: {})
- `generated_at` (TIMESTAMP, Default: NOW())
- `created_at` (TIMESTAMP, Default: NOW())
- `updated_at` (TIMESTAMP, Default: NOW())
- `deleted_at` (TIMESTAMP, Nullable)

**Indexes:**
- `idx_interview_report_session_id` (session_id)
- `idx_interview_report_overall_score` (overall_score)
- `idx_interview_report_generated_at` (generated_at)

**Constraints:**
- `fk_interview_report_session_id` (session_id → InterviewSession.id)
- `chk_interview_report_score_range` (overall_score BETWEEN 0 AND 100)

**Relationships:**
- One-to-one: InterviewSession
- One-to-many: Recommendation

---

### Recommendation Entity

**Fields:**
- `id` (UUID, Primary Key)
- `report_id` (UUID, Foreign Key → InterviewReport, Not Null)
- `recommendation_type` (ENUM: SKILL, RESOURCE, PRACTICE, COURSE)
- `title` (VARCHAR(255), Not Null)
- `description` (TEXT, Nullable)
- `priority` (ENUM: HIGH, MEDIUM, LOW)
- `actionable_steps` (JSONB, Default: [])
- `resource_url` (TEXT, Nullable)
- `estimated_time_hours` (INTEGER, Nullable)
- `created_at` (TIMESTAMP, Default: NOW())
- `updated_at` (TIMESTAMP, Default: NOW())
- `deleted_at` (TIMESTAMP, Nullable)

**Indexes:**
- `idx_recommendation_report_id` (report_id)
- `idx_recommendation_type` (recommendation_type)
- `idx_recommendation_priority` (priority)

**Constraints:**
- `fk_recommendation_report_id` (report_id → InterviewReport.id)

**Relationships:**
- Many-to-one: InterviewReport

---

### Analytics Entity

**Fields:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → User, Not Null)
- `event_type` (VARCHAR(100), Not Null)
- `event_data` (JSONB, Default: {})
- `session_id` (UUID, Nullable)
- `created_at` (TIMESTAMP, Default: NOW())

**Indexes:**
- `idx_analytics_user_id` (user_id)
- `idx_analytics_event_type` (event_type)
- `idx_analytics_created_at` (created_at)
- Composite: `idx_analytics_user_event_time` (user_id, event_type, created_at)

**Constraints:**
- `fk_analytics_user_id` (user_id → User.id)

**Relationships:**
- Many-to-one: User

---

### Subscription Entity

**Fields:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → User, Not Null)
- `plan_type` (ENUM: FREE, BASIC, PRO, ENTERPRISE)
- `status` (ENUM: ACTIVE, CANCELLED, EXPIRED, TRIAL)
- `start_date` (DATE, Not Null)
- `end_date` (DATE, Nullable)
- `stripe_subscription_id` (VARCHAR(255), Nullable)
- `stripe_customer_id` (VARCHAR(255), Nullable)
- `billing_cycle` (ENUM: MONTHLY, YEARLY)
- `usage_limits` (JSONB, Default: {})
- `current_usage` (JSONB, Default: {})
- `created_at` (TIMESTAMP, Default: NOW())
- `updated_at` (TIMESTAMP, Default: NOW())
- `deleted_at` (TIMESTAMP, Nullable)

**Indexes:**
- `idx_subscription_user_id` (user_id)
- `idx_subscription_status` (status)
- `idx_subscription_plan_type` (plan_type)
- `idx_subscription_stripe_subscription_id` (stripe_subscription_id)

**Constraints:**
- `fk_subscription_user_id` (user_id → User.id)
- `unq_subscription_user_id` (user_id) WHERE deleted_at IS NULL
- `chk_subscription_dates` (end_date > start_date)

**Relationships:**
- One-to-one: User

---

### Company Entity

**Fields:**
- `id` (UUID, Primary Key)
- `name` (VARCHAR(255), Not Null)
- `slug` (VARCHAR(255), Unique, Not Null)
- `logo_url` (TEXT, Nullable)
- `website` (TEXT, Nullable)
- `industry` (VARCHAR(100), Nullable)
- `size` (ENUM: STARTUP, SMALL, MEDIUM, LARGE, ENTERPRISE)
- `description` (TEXT, Nullable)
- `created_at` (TIMESTAMP, Default: NOW())
- `updated_at` (TIMESTAMP, Default: NOW())
- `deleted_at` (TIMESTAMP, Nullable)

**Indexes:**
- `idx_company_slug` (slug)
- `idx_company_industry` (industry)
- `idx_company_size` (size)

**Constraints:**
- `unq_company_slug` (slug)

**Relationships:**
- One-to-many: Organization

---

### Recruiter Entity

**Fields:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → User, Not Null)
- `company_id` (UUID, Foreign Key → Company, Nullable)
- `title` (VARCHAR(255), Nullable)
- `department` (VARCHAR(100), Nullable)
- `specialization` (JSONB, Default: [])
- `bio` (TEXT, Nullable)
- `linkedin_url` (TEXT, Nullable)
- `total_assessments_created` (INTEGER, Default: 0)
- `total_candidates_evaluated` (INTEGER, Default: 0)
- `created_at` (TIMESTAMP, Default: NOW())
- `updated_at` (TIMESTAMP, Default: NOW())
- `deleted_at` (TIMESTAMP, Nullable)

**Indexes:**
- `idx_recruiter_user_id` (user_id)
- `idx_recruiter_company_id` (company_id)

**Constraints:**
- `fk_recruiter_user_id` (user_id → User.id)
- `fk_recruiter_company_id` (company_id → Company.id)
- `unq_recruiter_user_id` (user_id)

**Relationships:**
- One-to-one: User
- Many-to-one: Company
- One-to-many: Assessment

---

### Assessment Entity

**Fields:**
- `id` (UUID, Primary Key)
- `recruiter_id` (UUID, Foreign Key → Recruiter, Not Null)
- `organization_id` (UUID, Foreign Key → Organization, Nullable)
- `title` (VARCHAR(255), Not Null)
- `description` (TEXT, Nullable)
- `interview_id` (UUID, Foreign Key → Interview, Not Null)
- `status` (ENUM: DRAFT, PUBLISHED, ARCHIVED)
- `share_link` (VARCHAR(255), Unique, Nullable)
- `settings` (JSONB, Default: {})
- `deadline` (TIMESTAMP, Nullable)
- `total_candidates` (INTEGER, Default: 0)
- `completed_candidates` (INTEGER, Default: 0)
- `created_at` (TIMESTAMP, Default: NOW())
- `updated_at` (TIMESTAMP, Default: NOW())
- `deleted_at` (TIMESTAMP, Nullable)

**Indexes:**
- `idx_assessment_recruiter_id` (recruiter_id)
- `idx_assessment_organization_id` (organization_id)
- `idx_assessment_interview_id` (interview_id)
- `idx_assessment_share_link` (share_link)
- `idx_assessment_status` (status)

**Constraints:**
- `fk_assessment_recruiter_id` (recruiter_id → Recruiter.id)
- `fk_assessment_organization_id` (organization_id → Organization.id)
- `fk_assessment_interview_id` (interview_id → Interview.id)
- `unq_assessment_share_link` (share_link)

**Relationships:**
- Many-to-one: Recruiter, Organization, Interview
- One-to-many: Candidate

---

### Organization Entity

**Fields:**
- `id` (UUID, Primary Key)
- `name` (VARCHAR(255), Not Null)
- `slug` (VARCHAR(255), Unique, Not Null)
- `logo_url` (TEXT, Nullable)
- `plan_type` (ENUM: FREE, TEAM, ENTERPRISE)
- `max_members` (INTEGER, Default: 5)
- `settings` (JSONB, Default: {})
- `owner_id` (UUID, Foreign Key → User, Not Null)
- `created_at` (TIMESTAMP, Default: NOW())
- `updated_at` (TIMESTAMP, Default: NOW())
- `deleted_at` (TIMESTAMP, Nullable)

**Indexes:**
- `idx_organization_slug` (slug)
- `idx_organization_owner_id` (owner_id)
- `idx_organization_plan_type` (plan_type)

**Constraints:**
- `fk_organization_owner_id` (owner_id → User.id)
- `unq_organization_slug` (slug)

**Relationships:**
- Many-to-one: User (owner)
- One-to-many: Member, Assessment, Recruiter

---

### Member Entity

**Fields:**
- `id` (UUID, Primary Key)
- `organization_id` (UUID, Foreign Key → Organization, Not Null)
- `user_id` (UUID, Foreign Key → User, Not Null)
- `role` (ENUM: OWNER, ADMIN, MEMBER, VIEWER)
- `status` (ENUM: ACTIVE, PENDING, INVITED, REMOVED)
- `joined_at` (TIMESTAMP, Nullable)
- `permissions` (JSONB, Default: {})
- `created_at` (TIMESTAMP, Default: NOW())
- `updated_at` (TIMESTAMP, Default: NOW())
- `deleted_at` (TIMESTAMP, Nullable)

**Indexes:**
- `idx_member_organization_id` (organization_id)
- `idx_member_user_id` (user_id)
- `idx_member_role` (role)
- `idx_member_status` (status)
- Composite: `idx_member_org_user` (organization_id, user_id)

**Constraints:**
- `fk_member_organization_id` (organization_id → Organization.id)
- `fk_member_user_id` (user_id → User.id)
- `unq_member_org_user` (organization_id, user_id) WHERE deleted_at IS NULL

**Relationships:**
- Many-to-one: Organization, User

---

### Conversation Entity

**Fields:**
- `id` (UUID, Primary Key)
- `session_id` (UUID, Foreign Key → InterviewSession, Not Null)
- `copilot_enabled` (BOOLEAN, Default: false)
- `messages_count` (INTEGER, Default: 0)
- `created_at` (TIMESTAMP, Default: NOW())
- `updated_at` (TIMESTAMP, Default: NOW())
- `deleted_at` (TIMESTAMP, Nullable)

**Indexes:**
- `idx_conversation_session_id` (session_id)

**Constraints:**
- `fk_conversation_session_id` (session_id → InterviewSession.id)

**Relationships:**
- One-to-one: InterviewSession
- One-to-many: Message

---

### Message Entity

**Fields:**
- `id` (UUID, Primary Key)
- `conversation_id` (UUID, Foreign Key → Conversation, Not Null)
- `role` (ENUM: USER, ASSISTANT, SYSTEM)
- `content` (TEXT, Not Null)
- `message_type` (ENUM: QUESTION, ANSWER, FEEDBACK, SUGGESTION, SYSTEM)
- `metadata` (JSONB, Default: {})
- `created_at` (TIMESTAMP, Default: NOW())

**Indexes:**
- `idx_message_conversation_id` (conversation_id)
- `idx_message_role` (role)
- `idx_message_created_at` (created_at)

**Constraints:**
- `fk_message_conversation_id` (conversation_id → Conversation.id)

**Relationships:**
- Many-to-one: Conversation

---

## 4. Prisma Schema Architecture

### Schema Design Principles

**Enums:**
- Role-based enums for type safety
- Status enums for state management
- Difficulty enums for progression
- Type enums for categorization

**Relations:**
- One-to-One: User ↔ Subscription, Resume ↔ ResumeAnalysis, Answer ↔ Evaluation
- One-to-Many: User ↔ Resume, Interview ↔ Question, Session ↔ Answer
- Many-to-Many: Organization ↔ Member (through Member entity)

**Composite Indexes:**
- Performance optimization for common query patterns
- Multi-column indexes for filtering and sorting
- Unique constraints for data integrity

**Soft Deletes:**
- `deleted_at` timestamp on all major entities
- Query filtering for active records
- Data retention and recovery capability

**Audit Fields:**
- `created_at` on all entities
- `updated_at` on all entities
- Automatic timestamp management

**Schema Structure:**
```prisma
// Enums
enum UserRole {
  CANDIDATE
  RECRUITER
  ADMIN
}

enum InterviewType {
  TECHNICAL
  BEHAVIORAL
  HR
  CODING
  VOICE
}

enum InterviewStatus {
  DRAFT
  ACTIVE
  ARCHIVED
}

enum SessionStatus {
  IN_PROGRESS
  COMPLETED
  ABANDONED
}

enum QuestionType {
  OPEN_ENDED
  MULTIPLE_CHOICE
  CODING
  BEHAVIORAL
  SITUATIONAL
}

enum AnswerType {
  TEXT
  VOICE
  CODE
}

enum EvaluationStatus {
  PENDING
  COMPLETED
  FAILED
}

enum SubscriptionStatus {
  ACTIVE
  CANCELLED
  EXPIRED
  TRIAL
}

enum PlanType {
  FREE
  BASIC
  PRO
  ENTERPRISE
}

enum MemberRole {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}

// Base Model with Soft Delete and Audit Fields
model Base {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  @@map("_base")
}

// User Model
model User {
  id                String   @id @default(uuid())
  email             String   @unique
  passwordHash      String?  @map("password_hash")
  firstName         String   @map("first_name")
  lastName          String   @map("last_name")
  avatarUrl         String?  @map("avatar_url")
  role              UserRole @default(CANDIDATE)
  emailVerified     Boolean  @default(false) @map("email_verified")
  onboardingCompleted Boolean @default(false) @map("onboarding_completed")
  preferences       Json     @default("{}")
  lastLoginAt       DateTime? @map("last_login_at")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
  deletedAt         DateTime? @map("deleted_at")

  resumes       Resume[]
  interviews    Interview[]
  subscription  Subscription?
  organizations Organization[] @relation("OrganizationOwner")
  members       Member[]
  recruiter     Recruiter?
  analytics     Analytics[]

  @@index([email])
  @@index([role])
  @@index([createdAt])
  @@map("users")
}

// Resume Model
model Resume {
  id              String   @id @default(uuid())
  userId          String   @map("user_id")
  title           String
  fileUrl         String   @map("file_url")
  fileName        String   @map("file_name")
  fileSize        Int      @map("file_size")
  fileType        String   @map("file_type")
  parsedContent   String?  @map("parsed_content")
  parsedMetadata  Json     @default("{}") @map("parsed_metadata")
  isPrimary       Boolean  @default(false) @map("is_primary")
  version         Int      @default(1)
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  deletedAt       DateTime? @map("deleted_at")

  user           User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  analysis       ResumeAnalysis?
  interviews     Interview[]

  @@index([userId])
  @@index([isPrimary])
  @@index([createdAt])
  @@map("resumes")
}

// Resume Analysis Model
model ResumeAnalysis {
  id                String   @id @default(uuid())
  resumeId          String   @unique @map("resume_id")
  atsScore          Decimal  @map("ats_score") @db.Decimal(5, 2)
  keywordScore      Decimal  @map("keyword_score") @db.Decimal(5, 2)
  formattingScore   Decimal  @map("formatting_score") @db.Decimal(5, 2)
  grammarScore      Decimal  @map("grammar_score") @db.Decimal(5, 2)
  overallScore      Decimal  @map("overall_score") @db.Decimal(5, 2)
  matchedKeywords   Json     @default("[]") @map("matched_keywords")
  missingKeywords   Json     @default("[]") @map("missing_keywords")
  skillGaps         Json     @default("[]") @map("skill_gaps")
  grammarIssues     Json     @default("[]") @map("grammar_issues")
  formattingIssues  Json     @default("[]") @map("formatting_issues")
  suggestions       Json     @default("[]")
  jobDescriptionId  String?  @map("job_description_id")
  jobTitle          String?  @map("job_title")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
  deletedAt         DateTime? @map("deleted_at")

  resume Resume @relation(fields: [resumeId], references: [id], onDelete: Cascade)

  @@index([resumeId])
  @@index([overallScore])
  @@index([createdAt])
  @@map("resume_analyses")
}

// Interview Model
model Interview {
  id              String        @id @default(uuid())
  userId          String        @map("user_id")
  title           String
  description     String?
  type            InterviewType
  difficulty      String
  durationMinutes Int?         @map("duration_minutes")
  questionCount   Int           @default(0) @map("question_count")
  status          InterviewStatus @default(DRAFT)
  settings        Json          @default("{}")
  resumeId        String?       @map("resume_id")
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")
  deletedAt       DateTime?     @map("deleted_at")

  user       User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  resume     Resume?            @relation(fields: [resumeId], references: [id])
  sessions   InterviewSession[]
  questions  Question[]
  assessments Assessment[]

  @@index([userId])
  @@index([type])
  @@index([status])
  @@index([createdAt])
  @@map("interviews")
}

// Question Model
model Question {
  id                 String      @id @default(uuid())
  interviewId        String      @map("interview_id")
  questionText       String      @map("question_text")
  questionType       QuestionType @map("question_type")
  category           String?
  difficulty         String
  orderIndex         Int         @map("order_index")
  expectedKeywords   Json        @default("[]") @map("expected_keywords")
  evaluationCriteria Json        @default("{}") @map("evaluation_criteria")
  timeLimitSeconds   Int?        @map("time_limit_seconds")
  isAdaptive         Boolean     @default(false) @map("is_adaptive")
  createdAt          DateTime    @default(now()) @map("created_at")
  updatedAt          DateTime    @updatedAt @map("updated_at")
  deletedAt          DateTime?   @map("deleted_at")

  interview      Interview         @relation(fields: [interviewId], references: [id], onDelete: Cascade)
  answers        Answer[]
  codingQuestion CodingQuestion?

  @@index([interviewId])
  @@index([category])
  @@index([difficulty])
  @@index([orderIndex])
  @@map("questions")
}

// Interview Session Model
model InterviewSession {
  id                    String        @id @default(uuid())
  interviewId           String        @map("interview_id")
  userId                String        @map("user_id")
  status                SessionStatus
  startedAt             DateTime      @default(now()) @map("started_at")
  completedAt           DateTime?     @map("completed_at")
  durationSeconds       Int?          @map("duration_seconds")
  currentQuestionIndex  Int           @default(0) @map("current_question_index")
  totalQuestionsAnswered Int          @default(0) @map("total_questions_answered")
  sessionData           Json          @default("{}") @map("session_data")
  createdAt             DateTime      @default(now()) @map("created_at")
  updatedAt             DateTime      @updatedAt @map("updated_at")
  deletedAt             DateTime?     @map("deleted_at")

  interview     Interview         @relation(fields: [interviewId], references: [id], onDelete: Cascade)
  user          User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  answers       Answer[]
  messages      Message[]
  report        InterviewReport?
  conversation  Conversation?

  @@index([interviewId])
  @@index([userId])
  @@index([status])
  @@index([startedAt])
  @@map("interview_sessions")
}

// Answer Model
model Answer {
  id               String     @id @default(uuid())
  sessionId        String     @map("session_id")
  questionId       String     @map("question_id")
  answerText       String?    @map("answer_text")
  answerAudioUrl   String?    @map("answer_audio_url")
  answerCode       String?    @map("answer_code")
  answerType       AnswerType @map("answer_type")
  timeTakenSeconds Int?       @map("time_taken_seconds")
  submittedAt      DateTime   @default(now()) @map("submitted_at")
  answerMetadata   Json       @default("{}") @map("answer_metadata")
  createdAt        DateTime   @default(now()) @map("created_at")
  updatedAt        DateTime   @updatedAt @map("updated_at")
  deletedAt        DateTime?   @map("deleted_at")

  session         InterviewSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  question        Question         @relation(fields: [questionId], references: [id], onDelete: Cascade)
  evaluation      Evaluation?
  codingSubmission CodingSubmission?

  @@index([sessionId])
  @@index([questionId])
  @@index([submittedAt])
  @@map("answers")
}

// Evaluation Model
model Evaluation {
  id                String   @id @default(uuid())
  answerId          String   @unique @map("answer_id")
  score             Decimal  @map("score") @db.Decimal(5, 2)
  maxScore          Decimal  @map("max_score") @db.Decimal(5, 2)
  feedback          String?
  strengths         Json     @default("[]")
  weaknesses        Json     @default("[]")
  improvements      Json     @default("[]")
  evaluationDetails Json     @default("{}") @map("evaluation_details")
  evaluatedAt       DateTime @default(now()) @map("evaluated_at")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
  deletedAt         DateTime? @map("deleted_at")

  answer  Answer            @relation(fields: [answerId], references: [id], onDelete: Cascade)
  metrics EvaluationMetric[]

  @@index([answerId])
  @@index([score])
  @@index([evaluatedAt])
  @@map("evaluations")
}

// Evaluation Metric Model
model EvaluationMetric {
  id                String   @id @default(uuid())
  evaluationId      String   @map("evaluation_id")
  metricName        String   @map("metric_name")
  metricValue       Decimal  @map("metric_value") @db.Decimal(5, 2)
  metricDescription String?  @map("metric_description")
  metricCategory    String?  @map("metric_category")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
  deletedAt         DateTime? @map("deleted_at")

  evaluation Evaluation @relation(fields: [evaluationId], references: [id], onDelete: Cascade)

  @@index([evaluationId])
  @@index([metricName])
  @@map("evaluation_metrics")
}

// Coding Question Model
model CodingQuestion {
  id              String   @id @default(uuid())
  questionId      String   @unique @map("question_id")
  problemStatement String  @map("problem_statement")
  inputFormat     String?  @map("input_format")
  outputFormat    String?  @map("output_format")
  constraints     String?
  examples        Json     @default("[]")
  hints           Json     @default("[]")
  timeLimitSeconds Int?    @map("time_limit_seconds")
  memoryLimitMb   Int?     @map("memory_limit_mb")
  difficulty      String
  tags            Json     @default("[]")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  deletedAt       DateTime? @map("deleted_at")

  question    Question          @relation(fields: [questionId], references: [id], onDelete: Cascade)
  submissions CodingSubmission[]
  testCases   TestCase[]

  @@index([questionId])
  @@index([difficulty])
  @@map("coding_questions")
}

// Coding Submission Model
model CodingSubmission {
  id                  String   @id @default(uuid())
  answerId            String   @unique @map("answer_id")
  codingQuestionId    String   @map("coding_question_id")
  code                String
  language            String
  status              String
  executionTimeMs     Int?     @map("execution_time_ms")
  memoryUsedKb        Int?     @map("memory_used_kb")
  testCasesPassed     Int      @default(0) @map("test_cases_passed")
  totalTestCases      Int      @default(0) @map("total_test_cases")
  judge0SubmissionId  String?  @map("judge0_submission_id")
  stdout              String?
  stderr              String?
  compileOutput       String?  @map("compile_output")
  codeReview          Json     @default("{}") @map("code_review")
  complexityAnalysis  Json     @default("{}") @map("complexity_analysis")
  submittedAt         DateTime @default(now()) @map("submitted_at")
  createdAt           DateTime @default(now()) @map("created_at")
  updatedAt           DateTime @updatedAt @map("updated_at")
  deletedAt           DateTime? @map("deleted_at")

  answer         Answer         @relation(fields: [answerId], references: [id], onDelete: Cascade)
  codingQuestion CodingQuestion @relation(fields: [codingQuestionId], references: [id], onDelete: Cascade)

  @@index([answerId])
  @@index([codingQuestionId])
  @@index([status])
  @@index([submittedAt])
  @@map("coding_submissions")
}

// Test Case Model
model TestCase {
  id              String   @id @default(uuid())
  codingQuestionId String  @map("coding_question_id")
  input           String
  expectedOutput  String   @map("expected_output")
  isHidden        Boolean  @default(false) @map("is_hidden")
  orderIndex      Int      @map("order_index")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  deletedAt       DateTime? @map("deleted_at")

  codingQuestion CodingQuestion @relation(fields: [codingQuestionId], references: [id], onDelete: Cascade)

  @@index([codingQuestionId])
  @@index([isHidden])
  @@index([orderIndex])
  @@map("test_cases")
}

// Interview Report Model
model InterviewReport {
  id                String   @id @default(uuid())
  sessionId         String   @unique @map("session_id")
  overallScore      Decimal  @map("overall_score") @db.Decimal(5, 2)
  performanceSummary String  @map("performance_summary")
  strengths         Json     @default("[]")
  weaknesses        Json     @default("[]")
  detailedFeedback  Json     @default("{}") @map("detailed_feedback")
  recommendations    Json     @default("[]")
  comparisonData    Json     @default("{}") @map("comparison_data")
  generatedAt       DateTime @default(now()) @map("generated_at")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
  deletedAt         DateTime? @map("deleted_at")

  session           InterviewSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  recommendationObjs Recommendation[]

  @@index([sessionId])
  @@index([overallScore])
  @@index([generatedAt])
  @@map("interview_reports")
}

// Recommendation Model
model Recommendation {
  id                   String   @id @default(uuid())
  reportId             String   @map("report_id")
  recommendationType    String   @map("recommendation_type")
  title                String
  description          String?
  priority             String
  actionableSteps      Json     @default("[]") @map("actionable_steps")
  resourceUrl          String?  @map("resource_url")
  estimatedTimeHours   Int?     @map("estimated_time_hours")
  createdAt            DateTime @default(now()) @map("created_at")
  updatedAt            DateTime @updatedAt @map("updated_at")
  deletedAt            DateTime? @map("deleted_at")

  report InterviewReport @relation(fields: [reportId], references: [id], onDelete: Cascade)

  @@index([reportId])
  @@index([recommendationType])
  @@index([priority])
  @@map("recommendations")
}

// Analytics Model
model Analytics {
  id         String   @id @default(uuid())
  userId     String   @map("user_id")
  eventType  String   @map("event_type")
  eventData  Json     @default("{}") @map("event_data")
  sessionId  String?  @map("session_id")
  createdAt  DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([eventType])
  @@index([createdAt])
  @@index([userId, eventType, createdAt])
  @@map("analytics")
}

// Subscription Model
model Subscription {
  id                   String            @id @default(uuid())
  userId               String            @unique @map("user_id")
  planType             PlanType          @map("plan_type")
  status               SubscriptionStatus
  startDate            DateTime          @map("start_date") @db.Date
  endDate              DateTime?         @map("end_date") @db.Date
  stripeSubscriptionId String?           @map("stripe_subscription_id")
  stripeCustomerId     String?           @map("stripe_customer_id")
  billingCycle         String            @map("billing_cycle")
  usageLimits          Json              @default("{}") @map("usage_limits")
  currentUsage         Json              @default("{}") @map("current_usage")
  createdAt            DateTime          @default(now()) @map("created_at")
  updatedAt            DateTime          @updatedAt @map("updated_at")
  deletedAt            DateTime?         @map("deleted_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([status])
  @@index([planType])
  @@index([stripeSubscriptionId])
  @@map("subscriptions")
}

// Company Model
model Company {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  logoUrl     String?  @map("logo_url")
  website     String?
  industry    String?
  size        String?
  description String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  deletedAt   DateTime? @map("deleted_at")

  recruiters Recruiter[]
  organizations Organization[]

  @@index([slug])
  @@index([industry])
  @@index([size])
  @@map("companies")
}

// Recruiter Model
model Recruiter {
  id                       String   @id @default(uuid())
  userId                   String   @unique @map("user_id")
  companyId                String?  @map("company_id")
  title                    String?
  department               String?
  specialization           Json     @default("[]")
  bio                      String?
  linkedinUrl              String?  @map("linkedin_url")
  totalAssessmentsCreated  Int      @default(0) @map("total_assessments_created")
  totalCandidatesEvaluated Int      @default(0) @map("total_candidates_evaluated")
  createdAt                DateTime @default(now()) @map("created_at")
  updatedAt                DateTime @updatedAt @map("updated_at")
  deletedAt                DateTime? @map("deleted_at")

  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  company     Company?     @relation(fields: [companyId], references: [id])
  assessments Assessment[]

  @@index([userId])
  @@index([companyId])
  @@map("recruiters")
}

// Assessment Model
model Assessment {
  id                    String   @id @default(uuid())
  recruiterId           String   @map("recruiter_id")
  organizationId        String?  @map("organization_id")
  title                 String
  description           String?
  interviewId           String   @map("interview_id")
  status                String
  shareLink             String?  @unique @map("share_link")
  settings              Json     @default("{}")
  deadline              DateTime? @map("deadline")
  totalCandidates       Int      @default(0) @map("total_candidates")
  completedCandidates   Int      @default(0) @map("completed_candidates")
  createdAt             DateTime @default(now()) @map("created_at")
  updatedAt             DateTime @updatedAt @map("updated_at")
  deletedAt             DateTime? @map("deleted_at")

  recruiter    Recruiter  @relation(fields: [recruiterId], references: [id], onDelete: Cascade)
  organization Organization? @relation(fields: [organizationId], references: [id])
  interview    Interview  @relation(fields: [interviewId], references: [id])

  @@index([recruiterId])
  @@index([organizationId])
  @@index([interviewId])
  @@index([shareLink])
  @@index([status])
  @@map("assessments")
}

// Organization Model
model Organization {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  logoUrl     String?  @map("logo_url")
  planType    String   @map("plan_type")
  maxMembers  Int      @default(5) @map("max_members")
  settings    Json     @default("{}")
  ownerId     String   @map("owner_id")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  deletedAt   DateTime? @map("deleted_at")

  owner       User         @relation("OrganizationOwner", fields: [ownerId], references: [id], onDelete: Cascade)
  members     Member[]
  assessments Assessment[]
  recruiters  Recruiter[]

  @@index([slug])
  @@index([ownerId])
  @@index([planType])
  @@map("organizations")
}

// Member Model
model Member {
  id             String   @id @default(uuid())
  organizationId String   @map("organization_id")
  userId         String   @map("user_id")
  role           MemberRole
  status         String
  joinedAt       DateTime? @map("joined_at")
  permissions    Json     @default("{}")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")
  deletedAt      DateTime? @map("deleted_at")

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([organizationId])
  @@index([userId])
  @@index([role])
  @@index([status])
  @@unique([organizationId, userId])
  @@map("members")
}

// Conversation Model
model Conversation {
  id             String   @id @default(uuid())
  sessionId      String   @unique @map("session_id")
  copilotEnabled Boolean  @default(false) @map("copilot_enabled")
  messagesCount  Int      @default(0) @map("messages_count")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")
  deletedAt      DateTime? @map("deleted_at")

  session InterviewSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  messages Message[]

  @@index([sessionId])
  @@map("conversations")
}

// Message Model
model Message {
  id             String   @id @default(uuid())
  conversationId String   @map("conversation_id")
  role           String
  content        String
  messageType    String   @map("message_type")
  metadata       Json     @default("{}")
  createdAt      DateTime @default(now()) @map("created_at")

  conversation Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  @@index([conversationId])
  @@index([role])
  @@index([createdAt])
  @@map("messages")
}
```

---

## 5. ATS Resume Analyzer Design

### Features Overview
Comprehensive ATS analysis with AI-powered insights for resume optimization.

---

### Workflow

**1. Resume Upload & Parsing**
- User uploads resume (PDF, DOCX)
- File stored in Cloudinary
- Parser extracts text content
- Metadata extracted (name, email, phone, skills, experience)

**2. Keyword Extraction**
- AI extracts technical skills, soft skills, tools, technologies
- Categorizes keywords by type (technical, soft, industry-specific)
- Calculates keyword density and distribution

**3. Job Description Matching (Optional)**
- User provides job description
- AI extracts job requirements
- Compares resume keywords against job requirements
- Calculates match percentage

**4. ATS Score Calculation**
- Keyword Score: Match percentage with job description (or industry standards)
- Formatting Score: Section structure, readability, ATS compatibility
- Grammar Score: Spelling, grammar, punctuation analysis
- Overall Score: Weighted average of all scores

**5. Skill Gap Detection**
- Identify missing skills from job description
- Suggest courses/resources for skill development
- Prioritize by job requirements

**6. Grammar & Formatting Analysis**
- AI-powered grammar check
- Formatting issues detection
- ATS compatibility check
- Section completeness analysis

**7. Optimization Suggestions**
- Specific actionable improvements
- Section reorganization recommendations
- Keyword optimization suggestions
- Formatting improvements

**8. Report Generation**
- Comprehensive analysis report
- Visual score breakdown
- Prioritized recommendations
- Before/after comparison

---

### Database Design

**ResumeAnalysis Entity** (detailed in Section 3)
- Stores all analysis results
- JSONB fields for flexible data storage
- Relationships to Resume and JobDescription

**Analysis Workflow Tables** (future enhancement)
- `AnalysisJob`: Track analysis jobs
- `AnalysisStep`: Track individual analysis steps
- `AnalysisCache`: Cache analysis results

---

### AI Integration

**Gemini API Integration:**
- **Prompt Engineering**: Structured prompts for consistent analysis
- **Context Management**: Resume content + job description as context
- **Response Parsing**: Structured JSON response parsing
- **Rate Limiting**: Token-based rate limiting
- **Error Handling**: Retry logic with exponential backoff

**Prompt Strategy:**
```
System: You are an expert ATS resume analyzer. Analyze the resume against the job description and provide:
1. Keyword match percentage
2. Missing keywords
3. Skill gaps
4. Grammar issues
5. Formatting issues
6. Optimization suggestions

Response format: JSON with scores, lists, and detailed feedback.
```

**AI Services:**
- `KeywordService`: Extract and categorize keywords
- `GrammarService`: Grammar and spelling analysis
- `FormattingService`: Formatting analysis
- `OptimizationService`: Generate suggestions

---

### Storage Strategy

**File Storage:**
- **Cloudinary**: Store original resume files
- **CDN**: Deliver files with caching
- **Versioning**: Keep resume versions

**Parsed Content Storage:**
- **PostgreSQL**: Store parsed text content
- **JSONB**: Store structured metadata
- **Full-Text Search**: Enable resume search (future)

**Analysis Results Storage:**
- **PostgreSQL**: Store analysis results
- **JSONB**: Store flexible analysis data
- **Caching**: Cache recent analyses

---

## 6. Interview Engine Design

### Overview
AI-powered interview generation and management with adaptive questioning.

---

### Question Generation

**Generation Process:**
1. **Context Collection**
   - Interview type (Technical, Behavioral, HR, Coding, Voice)
   - Difficulty level
   - Resume content (if provided)
   - Job description (if provided)
   - User preferences

2. **AI Prompt Construction**
   - Interview type and difficulty
   - Resume context
   - Job requirements
   - Question count
   - Time constraints

3. **Gemini API Integration**
   - Send structured prompt
   - Receive question list
   - Parse and validate questions

4. **Question Storage**
   - Store in Question table
   - Link to Interview
   - Set order and metadata

**Prompt Strategy:**
```
System: You are an expert interviewer. Generate {count} {type} interview questions 
for {difficulty} level.

Context:
- Resume: {resume_content}
- Job Description: {job_description}
- Role: {role}

Requirements:
- Questions should be relevant to the role
- Include expected keywords for evaluation
- Provide evaluation criteria
- Suggest time limits

Response format: JSON array of questions with metadata.
```

---

### Context Handling

**Context Types:**
- **Resume Context**: Skills, experience, projects
- **Job Description Context**: Requirements, responsibilities
- **Interview Context**: Previous answers, performance
- **User Context**: Learning goals, preferences

**Context Management:**
- **Context Builder**: Assemble relevant context
- **Context Cache**: Cache frequently used context
- **Context Validation**: Ensure context quality
- **Context Pruning**: Remove irrelevant information

---

### Conversation Flow

**Flow States:**
1. **Initialization**: Session creation, context loading
2. **Question Delivery**: Present current question
3. **Answer Collection**: Receive user answer
4. **Answer Evaluation**: AI-powered evaluation
5. **Feedback Delivery**: Provide immediate feedback
6. **Next Question**: Adaptive selection or end
7. **Completion**: Generate final report

**Flow Control:**
- **Flow Service**: Orchestrate conversation
- **State Machine**: Manage flow states
- **Transition Rules**: Define state transitions
- **Error Handling**: Handle flow interruptions

---

### Adaptive Follow-up Questions

**Adaptation Strategy:**
1. **Performance Tracking**
   - Track answer scores
   - Identify weak areas
   - Monitor time taken

2. **Difficulty Adjustment**
   - Increase difficulty for high performers
   - Decrease difficulty for struggling users
   - Maintain optimal challenge level

3. **Topic Adaptation**
   - Focus on weak areas
   - Deep dive on interesting topics
   - Skip mastered topics

4. **Follow-up Generation**
   - Generate contextual follow-ups
   - Clarification questions
   - Deep-dive questions

**Adaptive Service:**
- **Performance Analysis**: Analyze answer performance
- **Difficulty Calculator**: Calculate optimal difficulty
- **Follow-up Generator**: Generate follow-up questions
- **Topic Selector**: Select next topic

---

### Interview Session Lifecycle

**Lifecycle States:**
1. **Created**: Session initialized
2. **In Progress**: Active interview
3. **Paused**: User paused (future)
4. **Completed**: All questions answered
5. **Abandoned**: User left without completion

**Lifecycle Management:**
- **Session Service**: Manage session state
- **State Persistence**: Save session state
- **Timeout Handling**: Handle session timeouts
- **Recovery**: Enable session recovery

---

### Report Generation

**Report Components:**
1. **Performance Summary**
   - Overall score
   - Strengths and weaknesses
   - Key insights

2. **Detailed Analysis**
   - Question-by-question breakdown
   - Answer evaluations
   - Performance metrics

3. **Recommendations**
   - Skill development recommendations
   - Resource suggestions
   - Practice areas

4. **Comparison Data**
   - Compare with industry benchmarks
   - Compare with previous sessions
   - Percentile rankings

**Generation Process:**
1. **Data Collection**: Gather session data
2. **AI Analysis**: Analyze performance
3. **Report Construction**: Build report structure
4. **Recommendation Generation**: Generate recommendations
5. **Report Storage**: Store report

---

### Gemini Integration

**Integration Strategy:**
- **Service Layer**: Dedicated Gemini service
- **Prompt Management**: Centralized prompt templates
- **Rate Limiting**: Token-based rate limiting
- **Error Handling**: Retry logic with backoff
- **Response Parsing**: Structured response parsing

**Gemini Service:**
- **Question Generation**: Generate interview questions
- **Answer Evaluation**: Evaluate user answers
- **Feedback Generation**: Generate feedback
- **Report Generation**: Generate reports
- **Recommendation Generation**: Generate recommendations

---

## 7. Coding Interview Design

### Overview
Integrated coding interview platform with Judge0 execution and AI code review.

---

### Judge0 Integration

**Judge0 API Integration:**
- **Language Support**: Multiple programming languages
- **Code Execution**: Secure code execution
- **Test Case Validation**: Automated test case running
- **Performance Metrics**: Execution time, memory usage

**Integration Points:**
- **Submission API**: Submit code for execution
- **Status API**: Check execution status
- **Results API**: Retrieve execution results

**Judge0 Service:**
- **Submission Handler**: Handle code submissions
- **Status Poller**: Poll execution status
- **Result Parser**: Parse execution results
- **Error Handler**: Handle execution errors

---

### Execution Flow

**1. Code Submission**
- User submits code
- Code validated for syntax
- Submission sent to Judge0

**2. Execution Queue**
- Submission queued in Judge0
- Status tracked via polling
- Timeout handling

**3. Test Case Execution**
- Test cases run sequentially
- Results collected
- Performance metrics captured

**4. Result Processing**
- Execution results parsed
- Test case results aggregated
- Pass/fail status determined

**5. Response Delivery**
- Results returned to user
- Error messages displayed
- Performance metrics shown

---

### Submission Flow

**Submission States:**
1. **Pending**: Submission queued
2. **Running**: Code executing
3. **Completed**: Execution finished
4. **Failed**: Execution failed
5. **Timeout**: Execution timed out

**State Management:**
- **Status Tracking**: Track submission status
- **State Persistence**: Save submission state
- **State Transitions**: Handle state changes
- **Error Recovery**: Handle failed submissions

---

### Test Cases

**Test Case Types:**
- **Public Test Cases**: Visible to users
- **Hidden Test Cases**: Hidden from users
- **Edge Cases**: Boundary conditions
- **Performance Cases**: Performance testing

**Test Case Management:**
- **Test Case Service**: Manage test cases
- **Test Case Validation**: Validate test cases
- **Test Case Execution**: Execute test cases
- **Result Aggregation**: Aggregate results

---

### Complexity Analysis

**Analysis Types:**
- **Time Complexity**: Big O notation
- **Space Complexity**: Memory usage
- **Algorithm Efficiency**: Algorithm selection
- **Optimization Opportunities**: Improvement suggestions

**Analysis Process:**
1. **Code Analysis**: Analyze code structure
2. **Complexity Calculation**: Calculate complexity
3. **Comparison**: Compare with optimal solutions
4. **Suggestions**: Provide optimization suggestions

---

### AI Code Review

**Review Aspects:**
- **Code Quality**: Clean code principles
- **Best Practices**: Industry best practices
- **Performance**: Performance optimization
- **Security**: Security vulnerabilities
- **Readability**: Code readability

**Review Process:**
1. **Code Analysis**: Static code analysis
2. **AI Evaluation**: AI-powered review
3. **Issue Detection**: Detect code issues
4. **Suggestion Generation**: Generate improvement suggestions

**Code Review Service:**
- **Static Analysis**: Static code analysis
- **AI Review**: AI-powered review
- **Issue Reporting**: Report code issues
- **Suggestion Engine**: Generate suggestions

---

## 8. Voice Interview Design

### Overview
Voice interview platform with speech-to-text and voice analysis capabilities.

---

### Audio Upload

**Upload Process:**
1. **Audio Recording**: User records answer
2. **File Validation**: Validate audio format
3. **File Upload**: Upload to Cloudinary
4. **URL Storage**: Store file URL
5. **Transcription Queue**: Queue for transcription

**Supported Formats:**
- **Audio Formats**: MP3, WAV, M4A, OGG
- **Max Duration**: 5 minutes per answer
- **Max File Size**: 10MB per answer

**Upload Service:**
- **File Validation**: Validate audio files
- **Upload Handler**: Handle file uploads
- **URL Management**: Manage file URLs
- **Error Handling**: Handle upload errors

---

### Speech-To-Text

**Transcription Process:**
1. **Audio Retrieval**: Retrieve audio file
2. **Transcription API**: Send to transcription service
3. **Text Extraction**: Extract transcribed text
4. **Text Storage**: Store transcribed text
5. **Quality Check**: Check transcription quality

**Transcription Services:**
- **Gemini API**: Primary transcription service
- **Fallback Services**: Alternative services (future)
- **Quality Assurance**: Transcription quality checks

**Transcription Service:**
- **Audio Processor**: Process audio files
- **Transcription Handler**: Handle transcription
- **Quality Checker**: Check transcription quality
- **Retry Logic**: Retry failed transcriptions

---

### Voice Analysis

**Analysis Aspects:**
- **Tone Analysis**: Emotional tone detection
- **Pace Analysis**: Speaking pace measurement
- **Clarity Analysis**: Speech clarity assessment
- **Confidence Analysis**: Confidence level detection
- **Filler Words**: Filler word detection

**Analysis Process:**
1. **Audio Processing**: Process audio file
2. **Feature Extraction**: Extract voice features
3. **AI Analysis**: AI-powered analysis
4. **Score Calculation**: Calculate scores
5. **Feedback Generation**: Generate feedback

**Analysis Service:**
- **Feature Extractor**: Extract voice features
- **AI Analyzer**: AI-powered analysis
- **Score Calculator**: Calculate scores
- **Feedback Generator**: Generate feedback

---

### Communication Scoring

**Score Components:**
- **Clarity Score**: Speech clarity (0-100)
- **Confidence Score**: Confidence level (0-100)
- **Pace Score**: Speaking pace (0-100)
- **Tone Score**: Professional tone (0-100)
- **Overall Score**: Weighted average

**Scoring Process:**
1. **Feature Analysis**: Analyze voice features
2. **Score Calculation**: Calculate individual scores
3. **Weight Application**: Apply score weights
4. **Overall Score**: Calculate overall score
5. **Benchmarking**: Compare with benchmarks

---

### Confidence Analysis

**Analysis Factors:**
- **Voice Stability**: Voice stability measurement
- **Pause Patterns**: Pause pattern analysis
- **Volume Consistency**: Volume consistency check
- **Speech Rate**: Speech rate analysis
- **Filler Word Usage**: Filler word detection

**Analysis Process:**
1. **Voice Processing**: Process voice audio
2. **Feature Extraction**: Extract confidence features
3. **Pattern Analysis**: Analyze speech patterns
4. **Confidence Score**: Calculate confidence score
5. **Feedback Generation**: Generate confidence feedback

---

## 9. Security Architecture

### Overview
Comprehensive security architecture protecting user data and system integrity.

---

### RBAC (Role-Based Access Control)

**Roles:**
- **CANDIDATE**: Access to candidate features
- **RECRUITER**: Access to recruiter features
- **ADMIN**: Full system access
- **OWNER**: Organization owner
- **MEMBER**: Organization member
- **VIEWER**: Read-only access

**Permissions:**
- **Resource-Based**: Permissions per resource type
- **Action-Based**: Permissions per action (read, write, delete)
- **Scope-Based**: Permissions per scope (own, organization, all)

**RBAC Implementation:**
- **Permission Service**: Manage permissions
- **Role Service**: Manage roles
- **Access Control**: Enforce access control
- **Permission Cache**: Cache permissions

---

### JWT Strategy

**JWT Implementation:**
- **Access Tokens**: Short-lived access tokens (15 minutes)
- **Refresh Tokens**: Long-lived refresh tokens (7 days)
- **Token Storage**: HttpOnly cookies
- **Token Rotation**: Automatic token rotation

**Token Claims:**
- **User ID**: User identifier
- **Role**: User role
- **Permissions**: User permissions
- **Expiration**: Token expiration
- **Issuer**: Token issuer

**JWT Service:**
- **Token Generator**: Generate tokens
- **Token Validator**: Validate tokens
- **Token Refresher**: Refresh tokens
- **Token Revoker**: Revoke tokens

---

### Session Management

**Session Strategy:**
- **Server-Side Sessions**: Server-side session storage
- **Session Store**: PostgreSQL session store
- **Session Expiration**: Automatic session expiration
- **Session Cleanup**: Regular session cleanup

**Session Data:**
- **User ID**: User identifier
- **Session ID**: Session identifier
- **Created At**: Session creation time
- **Expires At**: Session expiration time
- **Session Data**: Session-specific data

**Session Service:**
- **Session Creator**: Create sessions
- **Session Validator**: Validate sessions
- **Session Refresher**: Refresh sessions
- **Session Revoker**: Revoke sessions

---

### Rate Limiting

**Rate Limiting Strategy:**
- **Per-User Limits**: Limits per user
- **Per-IP Limits**: Limits per IP address
- **Per-Endpoint Limits**: Limits per endpoint
- **Sliding Window**: Sliding window algorithm

**Rate Limits:**
- **API Requests**: 100 requests/minute
- **Auth Requests**: 10 requests/minute
- **File Uploads**: 5 uploads/minute
- **AI Requests**: 20 requests/minute

**Rate Limiting Service:**
- **Limit Checker**: Check rate limits
- **Limit Enforcer**: Enforce rate limits
- **Limit Tracker**: Track usage
- **Limit Resetter**: Reset limits

---

### Input Validation

**Validation Strategy:**
- **Schema Validation**: Zod schema validation
- **Input Sanitization**: Input sanitization
- **Type Validation**: Type validation
- **Length Validation**: Length validation

**Validation Layers:**
- **API Layer**: API input validation
- **Service Layer**: Service input validation
- **Repository Layer**: Repository input validation
- **Database Layer**: Database constraints

**Validation Service:**
- **Schema Validator**: Validate schemas
- **Input Sanitizer**: Sanitize inputs
- **Type Checker**: Check types
- **Length Checker**: Check lengths

---

### Prompt Injection Protection

**Protection Strategy:**
- **Input Sanitization**: Sanitize user inputs
- **Prompt Template**: Use prompt templates
- **Context Validation**: Validate context
- **Output Validation**: Validate AI outputs

**Protection Measures:**
- **Allowlist**: Allowlist of safe inputs
- **Blocklist**: Blocklist of dangerous patterns
- **Length Limits**: Input length limits
- **AI Guardrails**: AI guardrails

**Protection Service:**
- **Input Sanitizer**: Sanitize inputs
- **Pattern Detector**: Detect dangerous patterns
- **Context Validator**: Validate context
- **Output Validator**: Validate outputs

---

### Secure File Uploads

**Upload Security:**
- **File Type Validation**: Validate file types
- **File Size Limits**: File size limits
- **Virus Scanning**: Virus scanning (future)
- **Secure Storage**: Secure file storage

**Upload Validation:**
- **File Type Check**: Check file type
- **File Size Check**: Check file size
- **File Content Check**: Check file content
- **File Name Sanitization**: Sanitize file names

**Upload Service:**
- **File Validator**: Validate files
- **File Scanner**: Scan files (future)
- **Secure Uploader**: Upload securely
- **File Manager**: Manage files

---

### API Security

**Security Measures:**
- **HTTPS Only**: Enforce HTTPS
- **CORS**: CORS configuration
- **CSRF Protection**: CSRF protection
- **Security Headers**: Security headers

**API Security Headers:**
- **X-Frame-Options**: Clickjacking protection
- **X-Content-Type-Options**: MIME sniffing protection
- **X-XSS-Protection**: XSS protection
- **Strict-Transport-Security**: HSTS
- **Content-Security-Policy**: CSP

**Security Middleware:**
- **HTTPS Enforcer**: Enforce HTTPS
- **CORS Handler**: Handle CORS
- **CSRF Protector**: Protect against CSRF
- **Header Manager**: Manage security headers

---

### Secrets Management

**Secrets Strategy:**
- **Environment Variables**: Environment variable storage
- **Secret Rotation**: Regular secret rotation
- **Secret Encryption**: Secret encryption
- **Access Control**: Secret access control

**Secret Types:**
- **API Keys**: Third-party API keys
- **Database Credentials**: Database credentials
- **JWT Secrets**: JWT signing secrets
- **Encryption Keys**: Encryption keys

**Secrets Service:**
- **Secret Manager**: Manage secrets
- **Secret Rotator**: Rotate secrets
- **Secret Encryptor**: Encrypt secrets
- **Secret Access Controller**: Control access

---

## 10. Scalability Strategy

### Overview
Scalable architecture designed to grow from 100 to 100,000 users.

---

### 100 Users

**Architecture:**
- **Single Database**: PostgreSQL single instance
- **Application Server**: Single Next.js instance
- **File Storage**: Cloudinary
- **Email Service**: Resend
- **AI Service**: Gemini API

**Performance:**
- **Response Time**: < 200ms
- **Uptime**: 99.5%
- **Throughput**: 10 requests/second

**Optimizations:**
- **Database Indexing**: Basic indexing
- **Caching**: In-memory caching
- **Code Optimization**: Code optimization

---

### 1,000 Users

**Architecture:**
- **Database**: PostgreSQL with read replicas
- **Application Server**: Load-balanced Next.js instances
- **File Storage**: Cloudinary with CDN
- **Email Service**: Resend with queue
- **AI Service**: Gemini API with rate limiting

**Performance:**
- **Response Time**: < 300ms
- **Uptime**: 99.7%
- **Throughput**: 50 requests/second

**Optimizations:**
- **Database Indexing**: Advanced indexing
- **Query Optimization**: Query optimization
- **Connection Pooling**: Connection pooling
- **Caching**: Redis caching

---

### 10,000 Users

**Architecture:**
- **Database**: PostgreSQL with read replicas and connection pooling
- **Application Server**: Load-balanced Next.js instances with auto-scaling
- **File Storage**: Cloudinary with CDN and multi-region
- **Email Service**: Resend with queue and retry logic
- **AI Service**: Gemini API with advanced rate limiting and caching
- **Queue System**: Background job queue
- **Cache Layer**: Redis cluster

**Performance:**
- **Response Time**: < 500ms
- **Uptime**: 99.9%
- **Throughput**: 500 requests/second

**Optimizations:**
- **Database Sharding**: Horizontal sharding (if needed)
- **Query Optimization**: Advanced query optimization
- **Connection Pooling**: Advanced connection pooling
- **Caching**: Multi-level caching
- **CDN**: Global CDN
- **Background Jobs**: Background job processing

---

### 100,000 Users

**Architecture:**
- **Database**: PostgreSQL cluster with read replicas, connection pooling, and sharding
- **Application Server**: Load-balanced Next.js instances with auto-scaling and multi-region
- **File Storage**: Cloudinary with CDN, multi-region, and edge caching
- **Email Service**: Resend with queue, retry logic, and multi-region
- **AI Service**: Gemini API with advanced rate limiting, caching, and load balancing
- **Queue System**: Distributed background job queue
- **Cache Layer**: Redis cluster with multi-region
- **Search Engine**: Elasticsearch (for search)
- **Analytics**: Dedicated analytics database

**Performance:**
- **Response Time**: < 1s
- **Uptime**: 99.95%
- **Throughput**: 5,000 requests/second

**Optimizations:**
- **Database Sharding**: Advanced sharding
- **Query Optimization**: Expert query optimization
- **Connection Pooling**: Advanced connection pooling
- **Caching**: Multi-level caching with cache warming
- **CDN**: Global CDN with edge computing
- **Background Jobs**: Distributed job processing
- **Microservices**: Extract critical modules to microservices

---

### Caching Opportunities

**Cache Layers:**
1. **Application Cache**: In-memory cache (LRU)
2. **Redis Cache**: Distributed cache
3. **CDN Cache**: CDN edge cache
4. **Database Cache**: Query result cache

**Cacheable Data:**
- **User Sessions**: Session data
- **User Profiles**: User profile data
- **Interview Questions**: Frequently accessed questions
- **Analysis Results**: ATS analysis results
- **Reports**: Generated reports
- **Configuration**: Application configuration

**Cache Strategy:**
- **Cache Aside**: Cache aside pattern
- **Write Through**: Write through for critical data
- **Write Back**: Write back for non-critical data
- **Cache Invalidation**: Time-based and event-based invalidation

---

### Queue Opportunities

**Queue Use Cases:**
1. **Email Sending**: Email queue
2. **Report Generation**: Report generation queue
3. **ATS Analysis**: ATS analysis queue
4. **Code Execution**: Code execution queue
5. **Voice Transcription**: Transcription queue
6. **Analytics**: Analytics event queue

**Queue Implementation:**
- **Queue Service**: Background job queue
- **Job Processor**: Job processor
- **Retry Logic**: Retry with exponential backoff
- **Dead Letter Queue**: Failed job handling

**Queue Benefits:**
- **Performance**: Improved performance
- **Reliability**: Improved reliability
- **Scalability**: Improved scalability
- **Resilience**: Improved resilience

---

### Background Jobs

**Job Types:**
1. **Email Jobs**: Send emails
2. **Report Jobs**: Generate reports
3. **Analysis Jobs**: Perform ATS analysis
4. **Cleanup Jobs**: Clean up old data
5. **Analytics Jobs**: Process analytics events
6. **Notification Jobs**: Send notifications

**Job Implementation:**
- **Job Queue**: Background job queue
- **Job Processor**: Job processor
- **Job Scheduler**: Job scheduler
- **Job Monitor**: Job monitoring

**Job Benefits:**
- **Performance**: Improved performance
- **Reliability**: Improved reliability
- **Scalability**: Improved scalability

---

### Future Redis Integration

**Redis Use Cases:**
1. **Session Storage**: Session data storage
2. **Cache Layer**: Application cache
3. **Rate Limiting**: Rate limiting
4. **Pub/Sub**: Real-time updates
5. **Leaderboards**: Analytics leaderboards
6. **Job Queue**: Background job queue

**Redis Architecture:**
- **Redis Cluster**: Redis cluster for high availability
- **Redis Sentinel**: Redis sentinel for failover
- **Redis Persistence**: RDB and AOF persistence
- **Redis Security**: Redis security

**Redis Benefits:**
- **Performance**: Improved performance
- **Scalability**: Improved scalability
- **Reliability**: Improved reliability
- **Flexibility**: Flexible data structures

---

## 11. Future Expansion

### Overview
Architecture designed for future expansion without major rewrites.

---

### Recruiter Dashboard

**Features:**
- **Assessment Management**: Create and manage assessments
- **Candidate Management**: View and evaluate candidates
- **Analytics Dashboard**: Recruitment analytics
- **Team Management**: Manage recruiting team
- **Candidate Ranking**: AI-powered candidate ranking

**Implementation:**
- **Recruiter Module**: Already designed
- **Assessment Module**: Already designed
- **Analytics Module**: Already designed
- **Organization Module**: Already designed

**No Rewrite Required**: All modules already designed and integrated.

---

### Organization Workspace

**Features:**
- **Team Collaboration**: Team collaboration features
- **Shared Assessments**: Shared assessment library
- **Candidate Pool**: Shared candidate pool
- **Analytics Dashboard**: Organization analytics
- **Permission Management**: Granular permissions

**Implementation:**
- **Organization Module**: Already designed
- **Member Module**: Already designed
- **Assessment Module**: Already designed
- **Analytics Module**: Already designed

**No Rewrite Required**: All modules already designed and integrated.

---

### Multi-Tenant Support

**Features:**
- **Tenant Isolation**: Data isolation per tenant
- **Tenant Configuration**: Tenant-specific configuration
- **Tenant Billing**: Tenant-specific billing
- **Tenant Branding**: Tenant-specific branding
- **Tenant Analytics**: Tenant-specific analytics

**Implementation:**
- **Organization Module**: Already designed with multi-tenant foundation
- **Member Module**: Already designed with RBAC
- **Subscription Module**: Already designed with tenant billing
- **Analytics Module**: Already designed with tenant analytics

**No Rewrite Required**: Architecture already supports multi-tenancy through Organization module.

---

### Subscription Billing

**Features:**
- **Plan Management**: Manage subscription plans
- **Billing Management**: Manage billing cycles
- **Payment Processing**: Process payments via Stripe
- **Usage Tracking**: Track usage per plan
- **Plan Upgrades**: Handle plan upgrades/downgrades

**Implementation:**
- **Subscription Module**: Already designed
- **Stripe Integration**: Webhook handlers already designed
- **Usage Tracking**: Usage limits already designed
- **Plan Management**: Plan types already designed

**No Rewrite Required**: All billing infrastructure already designed.

---

### Interview Copilot

**Features:**
- **Real-time Assistance**: Real-time interview assistance
- **Answer Suggestions**: AI-powered answer suggestions
- **Question Hints**: Contextual question hints
- **Feedback Delivery**: Real-time feedback
- **Strategy Recommendations**: Interview strategy recommendations

**Implementation:**
- **Copilot Module**: Already designed
- **Conversation Module**: Already designed
- **Message Module**: Already designed
- **AI Service**: Already designed with Gemini integration

**No Rewrite Required**: All copilot infrastructure already designed.

**Future Enhancements:**
- **WebSocket Integration**: Real-time communication
- **Streaming Responses**: Streaming AI responses
- **Voice Integration**: Voice-based copilot
- **Video Integration**: Video-based copilot

---

## Conclusion

This backend architecture for InterviewAI is designed to be:

- **Production-Grade**: Follows industry best practices and patterns
- **Scalable**: Designed to scale from 100 to 100,000 users
- **Maintainable**: Modular architecture with clear separation of concerns
- **Recruiter-Impressive**: Demonstrates senior-level backend engineering skills
- **Portfolio-Worthy**: Comprehensive architecture suitable for portfolio demonstration

The architecture follows:
- **Modular Monolith**: Feature-based modules with clear boundaries
- **Service Layer Pattern**: Business logic in services, not route handlers
- **Repository Pattern**: Data access abstraction
- **Domain Separation**: Clear domain boundaries
- **SOLID Principles**: Single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion

The architecture is ready for implementation with minimal changes and can be extended for future features without major rewrites.
