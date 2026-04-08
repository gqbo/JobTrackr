Me e# Skill Registry — job_tracker

Generated: 2026-04-07

## User Skills

| Skill | Trigger | Source |
|-------|---------|--------|
| go-testing | Go tests, Bubbletea TUI testing | ~/.claude/skills/go-testing/SKILL.md |
| skill-creator | Create new skill, add agent instructions | ~/.claude/skills/skill-creator/SKILL.md |
| judgment-day | "judgment day", "dual review", "juzgar" | ~/.claude/skills/judgment-day/SKILL.md |
| branch-pr | Creating PR, opening PR | ~/.claude/skills/branch-pr/SKILL.md |
| issue-creation | Creating GitHub issue, reporting bug | ~/.claude/skills/issue-creation/SKILL.md |

## Project Conventions

| File | Purpose |
|------|---------|
| CLAUDE.md | Root project instructions, commands, architecture rules |
| backend/CLAUDE.md | Backend rules, layered architecture, testing |
| frontend/CLAUDE.md | Frontend rules, state management, testing |
| docs/project-overview.md | Full project overview, sprint roadmap, tech stack |
| docs/architecture.md | System architecture, auth flow, data flow |
| docs/backend.md | Backend architecture, project structure, patterns |
| docs/frontend.md | Frontend patterns, component organization, hooks |
| docs/testing.md | Testing strategy, commands, examples |

## Compact Rules

### Python/FastAPI Backend
- Layered architecture: routers → services → repositories (NEVER skip layers)
- Routers: receive request + call service + return response. ZERO logic.
- Services: ALL business logic. Never import supabase directly.
- Repositories: ONLY layer that talks to Supabase. Returns Pydantic models, not raw dicts.
- snake_case, type hints on all function signatures
- Pydantic models for all request/response schemas in `app/models/`
- Async functions for all I/O operations
- Settings via pydantic-settings in `app/core/config.py`
- Domain exceptions in services, HTTPException only in routers
- Structured logging with `logging` module, never `print()`

### React/TypeScript Frontend
- TypeScript strict mode, interfaces over types for object shapes
- TanStack Query for server state, React Context for auth, useState for UI
- NO Redux, NO Zustand
- axios instance in `src/lib/axios.ts`, never import axios directly
- All API types in `src/types/`, never use `any`
- Components receive data via props, hooks fetch data
- shadcn/ui components in `components/ui/`, not modified after generation

### Testing
- Backend: pytest + httpx AsyncClient for integration, mock repos for unit
- Frontend: Vitest + React Testing Library
- Test behavior, not implementation
- Every endpoint: happy path + auth failure + validation error

### Workflow
- Conventional commits: feat:, fix:, refactor:, test:, docs:, chore:
- Supabase CLI for local dev, migrations in `supabase/migrations/`
- Never hardcode config values
