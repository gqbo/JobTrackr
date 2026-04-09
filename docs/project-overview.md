# JobTrackr — Project Overview

## What It Is
Fullstack web app for tracking job applications. User pastes a job URL, AI extracts structured data, saves it to a personal dashboard with table and Kanban views.

## Goals
- Learn Python + FastAPI with layered architecture
- Learn React with TanStack Query and modern patterns
- Apply integration + unit testing strategies
- Build a genuinely useful tool

## Tech Stack

**Backend:** Python 3.12, FastAPI, supabase-py, PyJWT, pydantic-settings, Pydantic v2, LiteLLM, httpx, BeautifulSoup4, slowapi, pytest

**Frontend:** React 19, Vite, TypeScript (strict), Tailwind CSS, shadcn/ui, TanStack Query v5, TanStack Table v8, dnd-kit, React Router v7, Recharts, axios, Vitest, lucide-react, Zod, React Hook Form

**Infra:** Supabase (PostgreSQL + Auth), Supabase CLI for local dev, uvicorn, Docker (prod only)

## Sprint Roadmap

| Sprint | Focus | Key Deliverable |
|--------|-------|-----------------|
| 1A | Project setup | Monorepo, health check, config |
| 1B | Auth (email) | Email/password auth end-to-end ✅ |
| 1C | Auth (Google) | Google OAuth via Supabase |
| 2 | CRUD + Table | Application CRUD, TanStack Table |
| 3 | AI Extraction | URL scraping + LLM extraction |
| 4 | Kanban | dnd-kit drag-and-drop board |
| 5 | Dashboard | Stats endpoint + Recharts |
| 6 | Google Sheets | OAuth2 + Sheets export (optional) |

## Database Schema

**`auth.users`** — managed by Supabase Auth (id, email, created_at)

**`user_settings`** — per-user config: AI extraction quota, Google tokens

**`applications`** — core entity: url, company, role, location, salary range, tech stack, remote flag, status, excitement (1-5), dates, notes, source

**Status Enum:** Bookmarked → Applying → Applied → Interviewing → Technical Test → Negotiating → Accepted → Rejected → Ghosted

See `.env.example` for environment variables.
