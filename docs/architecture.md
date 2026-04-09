# Architecture

## System Overview

```
┌──────────────────┐        ┌──────────────────┐       ┌──────────────┐
│   React + Vite   │─HTTP──→│   FastAPI         │─SDK──→│   Supabase   │
│   (Frontend)     │←──JSON─│   (Backend)       │←──────│   (DB+Auth)  │
└────────┬─────────┘        └──────────────────┘       └──────┬───────┘
         │                    Supabase Auth SDK               │
         └─────────────────────────────────────────────────────┘
```

Frontend talks to TWO systems:
1. **Supabase Auth SDK** — directly for auth (signup, signin, OAuth, session)
2. **FastAPI** — for all application data (CRUD, stats, AI extraction)

## Auth Flow

```
Frontend ──signup/signin──→ Supabase Auth ──JWT──→ Frontend (localStorage)
Frontend ──API call + JWT──→ FastAPI ──verify JWT (PyJWT)──→ process request
```

- Backend NEVER issues tokens or handles passwords — Supabase does
- Backend ONLY verifies JWTs and extracts `user_id` from claims
- Frontend protection (`ProtectedLayout`) is UI-only — checks Supabase session, no backend call
- Backend protection happens per-request when actual data is needed

## Backend Layered Architecture

```
Routers (app/api/)       — parse request, call service, return response
    ↓ Pydantic models
Services (app/services/) — ALL business logic
    ↓ Pydantic models
Repositories (app/repositories/) — ONLY layer that talks to Supabase
    ↓ supabase-py
Supabase (PostgreSQL)
```

## Frontend Data Flow

```
Page → custom hook → TanStack Query → axios (+ JWT header) → FastAPI → JSON
```

## AI Extraction Flow (Sprint 3)

```
POST /applications/extract-from-url
  → httpx fetches HTML → BeautifulSoup parses
  → enough content? YES → LLM extracts structured data
                    NO  → return partial, frontend asks user to paste text
  → Pydantic validates → pre-fill form or fallback to manual entry
```

## Database Migrations

```bash
supabase migration new <name>   # create SQL file in supabase/migrations/
supabase db push                # apply to local DB
```

Never modify the database manually — always go through migrations.
