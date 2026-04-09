# Testing Strategy

## Philosophy
- Test behavior, not implementation
- Integration tests provide the most value per effort
- Don't test library code (supabase-py, axios, React internals)
- Every endpoint: happy path + auth failure + validation error at minimum

## Commands

```bash
# Backend
cd backend
pytest                              # all tests
pytest tests/test_api/ -v           # integration only
pytest tests/test_services/ -v      # unit only
pytest -k "test_name" -v            # single test

# Frontend
cd frontend
npx vitest          # watch mode
npx vitest --run    # CI mode
```

## Backend

**Integration tests** (`tests/test_api/`): full request cycle — HTTP → router → service → repository → response. Use `conftest.py` fixtures: `client`, `authenticated_client`, `test_user_id`.

**Unit tests** (`tests/test_services/`): business logic in isolation with mocked repositories.

**What NOT to test:** repository methods (thin supabase-py wrappers), Pydantic validation, FastAPI DI mechanics, Supabase SDK behavior.

## Frontend

**Component tests:** test what the user sees and does — use `render` + `screen` queries. Not implementation details.

**Hook tests:** use `renderHook` from React Testing Library.

**What NOT to test:** shadcn/ui components, TanStack Query caching, React Router navigation, CSS/styling.

## E2E
Not in scope for initial sprints. Playwright can be added later for critical flows.

## File Naming
- Backend: `test_<module>.py` in `tests/test_api/` or `tests/test_services/`
- Frontend: `<Component>.test.tsx` or `<hook>.test.ts` — next to source or in `__tests__/`
