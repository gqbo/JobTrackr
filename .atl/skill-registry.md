# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| Writing Go tests, using teatest, or adding test coverage | go-testing | /home/gqbo/.claude/skills/go-testing/SKILL.md |
| Creating a new skill, adding agent instructions, documenting patterns for AI | skill-creator | /home/gqbo/.claude/skills/skill-creator/SKILL.md |
| "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen" | judgment-day | /home/gqbo/.claude/skills/judgment-day/SKILL.md |
| Creating a pull request, opening a PR, or preparing changes for review | branch-pr | /home/gqbo/.claude/skills/branch-pr/SKILL.md |
| Creating a GitHub issue, reporting a bug, or requesting a feature | issue-creation | /home/gqbo/.claude/skills/issue-creation/SKILL.md |
| /commit or asking to commit changes | commit | /home/gqbo/.claude/skills/commit/SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### commit
- Group changes by concern in this order: ci → config → docs → migrations → test(backend) → test(frontend) → feat/fix/refactor → chore
- Test files NEVER grouped with implementation files; migrations always get their own commit
- Never use `git add .` or `git add -A` — stage files explicitly by path
- Conventional Commits format: `type(scope): description` (imperative mood, lowercase, no trailing period, max ~72 chars)
- Scope examples: `(backend)`, `(frontend)`, `(auth)`, `(applications)`, `(health)`, `(db)`, `(ci)`, `(config)`
- Never include `Co-Authored-By` or any AI attribution in commits
- If git hooks fail, stop and report — never use `--no-verify`
- Skip empty groups — don't create commits with no files

### go-testing
- Table-driven tests are the default: `for _, tt := range tests { t.Run(tt.name, ...) }`
- Test Bubbletea state: call `model.Update(tea.KeyMsg{...})` directly for state transition tests
- Use `teatest.NewTestModel()` only for full interactive flow tests (heavier)
- Golden files in `testdata/` for visual TUI output — flag with `-update` to regenerate
- Mock dependencies via interfaces, not concrete types
- Use `t.TempDir()` for file operations — never hardcode paths

### skill-creator
- SKILL.md frontmatter must include: `name`, `description` (with "Trigger:" text), `license: Apache-2.0`, `metadata.author`, `metadata.version`
- The `description` field's Trigger text is how orchestrators match this skill — make it specific and keyword-rich
- Compact rules are the most important output: 5-15 lines, actionable only, no motivation, no full examples
- Place user skills at `~/.claude/skills/{skill-name}/SKILL.md`; project skills at `{project}/.agent/skills/{skill-name}/SKILL.md`
- After creating a skill, run `skill-registry` to update the catalog
- Skip `sdd-*`, `_shared`, and `skill-registry` directories when scanning

### judgment-day
- Resolve skill registry BEFORE launching judges — inject matching compact rules as `## Project Standards (auto-resolved)` into BOTH judge prompts
- Launch both judges in parallel (async) — never sequential; orchestrator never reviews itself
- WARNING classification: ask "Can a normal user trigger this?" YES → `WARNING (real)`, NO → `WARNING (theoretical)`
- Theoretical warnings → report as INFO only, never fix, never re-judge
- Round 1: present verdict table → ASK user before fixing confirmed issues
- Round 2+: only re-judge if confirmed CRITICALs remain; fix real WARNINGs inline without re-judging
- APPROVED = 0 confirmed CRITICALs + 0 confirmed real WARNINGs

### branch-pr
- Every PR MUST link a GitHub issue with `Closes/Fixes/Resolves #N` in the body — no exceptions
- Branch naming regex: `^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)\/[a-z0-9._-]+$`
- Add exactly one `type:*` label matching the commit type (e.g., `feat` → `type:feature`, `fix` → `type:bug`)
- PR body must include: linked issue, type checkbox, summary bullets, changes table, test plan, contributor checklist
- No `Co-Authored-By` trailers in any commit on the branch
- Run `shellcheck scripts/*.sh` before pushing

### issue-creation
- Blank issues are disabled — must use bug_report.yml or feature_request.yml template
- Issues auto-receive `status:needs-review`; a maintainer must add `status:approved` before any PR can open
- Questions go to Discussions, NOT issues
- Always search for duplicates before creating a new issue
- Bug report requires: description, steps to reproduce, expected vs actual behavior, OS, agent/client, shell
- Feature request requires: problem description, proposed solution, affected area

### python-fastapi (project-specific)
- Layered architecture: routers → services → repositories — NEVER skip layers
- Routers: receive request + call service + return response, ZERO logic, ZERO direct DB calls
- Services: ALL business logic, raise domain exceptions (not HTTPException), never import supabase directly
- Repositories: ONLY layer that touches supabase-py, return Pydantic models (not raw dicts)
- All Pydantic models in `app/models/` — never define schemas inline in routers
- Settings via `get_settings()` dependency from `app/core/config.py` — never import `Settings` directly
- Async functions for all I/O; structured logging with `logging` module, never `print()`
- Domain exceptions in `app/core/exceptions.py`; global handler in `app/core/middleware.py`

### react-typescript (project-specific)
- TypeScript strict mode; interfaces over types for object shapes; never use `any` — define in `src/types/`
- TanStack Query for server state, React Context (`AuthContext`) for auth, `useState` for UI only
- Never import axios directly — always use the configured instance at `src/lib/axios.ts`
- Supabase client (`src/lib/supabase.ts`) used ONLY for auth flows — never for data fetching
- Components receive data via props; custom hooks in `hooks/` handle all data fetching
- Routing via `createBrowserRouter` + `RouteObject[]` defined in `src/routes/routes.tsx`
- `components/ui/` are shadcn/ui — never modify after generation
- Form validation: Zod schemas in `src/validation/schemas/`, used with React Hook Form

### testing (project-specific)
- Backend: pytest + httpx AsyncClient (`ASGITransport`) in `tests/test_api/` for integration
- Backend service tests: mock repositories in `tests/test_services/`
- Every endpoint needs at minimum: happy path + auth failure + validation error
- Frontend: Vitest + React Testing Library; `renderHook` for custom hook tests
- Test user interaction and behavior, NOT implementation details
- Never test: repository methods, Pydantic validation, shadcn/ui internals, TanStack Query caching

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| CLAUDE.md (root) | /home/gqbo/Documents/github-projects/job_tracker/CLAUDE.md | Index — references docs below |
| docs/project-overview.md | /home/gqbo/Documents/github-projects/job_tracker/docs/project-overview.md | Stack, sprint roadmap, DB schema |
| docs/architecture.md | /home/gqbo/Documents/github-projects/job_tracker/docs/architecture.md | System diagram, auth flow, layer rules |
| docs/testing.md | /home/gqbo/Documents/github-projects/job_tracker/docs/testing.md | Testing strategy, commands, patterns |
| docs/backend.md | /home/gqbo/Documents/github-projects/job_tracker/docs/backend.md | Backend layer rules, exceptions, structure |
| docs/frontend.md | /home/gqbo/Documents/github-projects/job_tracker/docs/frontend.md | Frontend patterns, routing, state, components |
| docs/design-system.md | /home/gqbo/Documents/github-projects/job_tracker/docs/design-system.md | Design tokens, colors, typography, components |
| backend/CLAUDE.md | /home/gqbo/Documents/github-projects/job_tracker/backend/CLAUDE.md | Backend-specific rules + test patterns |
| frontend/CLAUDE.md | /home/gqbo/Documents/github-projects/job_tracker/frontend/CLAUDE.md | Frontend-specific rules + test patterns |
