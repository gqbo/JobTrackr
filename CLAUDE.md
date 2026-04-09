# JobTrackr

@docs/project-overview.md
@docs/architecture.md
@docs/testing.md
@docs/backend.md
@docs/frontend.md
@docs/design-system.md

## Commands
- Backend dev: `cd backend && uvicorn app.main:app --reload`
- Frontend dev: `cd frontend && npm run dev`
- Backend tests: `cd backend && pytest`
- Frontend tests: `cd frontend && npx vitest`
- DB start: `supabase start`
- DB migration: `supabase migration new <name>`
- DB push: `supabase db push`

## Code Style
- Python: snake_case, type hints on all function signatures, Pydantic models for all request/response schemas
- TypeScript: strict mode, interfaces over types for object shapes, named exports

## Architecture — NON-NEGOTIABLE
- Routers: receive request + call service + return response. ZERO logic.
- Services: ALL business logic. Never import supabase directly.
- Repositories: ONLY layer that talks to Supabase. Returns Pydantic models, not raw dicts.
- Never skip layers (router must not call repository directly).

## Workflow
- Run relevant tests after changes (`pytest` or `vitest`, not both unless both changed)
- Never hardcode config values — use pydantic-settings (backend) or env vars (frontend)
- Supabase Auth handles all auth flows. Backend only VERIFIES JWTs.

## Docs Maintenance — MANDATORY
After implementing any change that affects the items below, update the corresponding doc file BEFORE committing:

| Change type | File to update |
|---|---|
| Auth flow, layered architecture, system diagram | `docs/architecture.md` |
| New frontend patterns, state strategy, component structure | `docs/frontend.md` |
| New backend patterns, layer rules, exception handling | `docs/backend.md` |
| Testing strategy, new test patterns, commands | `docs/testing.md` |
| Design tokens, component variants, layout rules | `docs/design-system.md` |
| Sprint roadmap, tech stack changes, DB schema | `docs/project-overview.md` |

If a change doesn't fit any existing doc, ask the user before creating a new one.
