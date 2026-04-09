# Backend — Architecture & Patterns

## Layer Rules

**Routers** (`app/api/`): parse request → call service → return response. No logic, no DB calls. Use `Depends()` for injection. Raise `HTTPException` for HTTP errors.

**Services** (`app/services/`): ALL business logic. Receive and return Pydantic models. Raise domain exceptions (not HTTPException). Only place where business rules are enforced.

**Repositories** (`app/repositories/`): only layer that imports supabase-py. Translate Supabase responses ↔ Pydantic models. One per table. Methods: `get_by_id()`, `list_by_user()`, `create()`, `update()`, `delete()`. No business logic.

## Exception Handling

```
Repository → NotFoundException, DatabaseException
Service    → DuplicateApplicationException, ExtractionFailedException, etc.
Router     → catches domain exceptions, maps to HTTPException with correct status
Global     → catches unhandled exceptions, returns 500
```

Domain exceptions in `app/core/exceptions.py`. Global handler in `app/core/middleware.py`.

## Configuration

All config via pydantic-settings in `app/core/config.py`. Access via `get_settings()` dependency — never import `Settings` directly in modules.

## Auth

Backend receives JWT in `Authorization: Bearer <token>`. Middleware (`app/core/middleware.py`) verifies with PyJWT, extracts `user_id`, injects via `Depends()`. Backend never handles passwords or token issuance.

## Logging

Use `logging.getLogger(__name__)`. Never use `print()`. Log with `extra={"user_id": ..., "app_id": ...}` for structured context.

## Project Structure

```
backend/app/
  main.py           # app factory, middleware registration
  api/              # routers (health, applications, stats)
  core/             # config, middleware, exceptions, dependencies
  models/           # Pydantic request/response schemas
  services/         # business logic
  repositories/     # supabase-py calls
  llm/              # Sprint 3: LiteLLM, scraper, prompts
tests/
  conftest.py       # fixtures: client, authenticated_client, test_user_id
  test_api/         # integration tests
  test_services/    # unit tests with mocked repos
```
