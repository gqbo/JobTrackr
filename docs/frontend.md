# Frontend — Patterns & Conventions

## State Management

| State Type | Tool | Example |
|---|---|---|
| Server data | TanStack Query | Applications, stats, user profile |
| Auth | React Context | Current user session |
| UI | useState | Modals, toggles, form inputs |

No Redux, no Zustand — TanStack Query covers server state, Context covers auth. Adding a state library would be complexity with zero benefit.

## TanStack Query

Query keys are hierarchical for smart invalidation:
- `['applications']` — all
- `['applications', { status, search }]` — filtered
- `['applications', id]` — single
- `['stats']` — dashboard stats

All data fetching in custom hooks (`hooks/`), never in components directly. Components call hooks → hooks call API functions → API functions call axios.

## Component Organization

```
src/
  components/
    ui/                    # shadcn/ui — do not modify after generation
    AuthBrandingPanel.tsx  # Shared left panel for all auth pages
    FieldError.tsx         # AlertCircle icon + message for field errors
    PasswordInput.tsx      # Password input with Eye/EyeOff toggle
    ProtectedLayout.tsx    # Redirects to /login if no Supabase session
  pages/                   # One component per route
  hooks/                   # All data fetching and auth hooks
  lib/
    axios.ts               # Configured instance with auth interceptor
    supabase.ts            # Supabase client (auth only)
  types/                   # All TypeScript interfaces — never use `any`
  validation/
    schemas/auth.schema.ts # Zod schemas + inferred types
```

Rules:
- Pages use hooks. Components receive data via props.
- Never import axios directly — always use `lib/axios.ts`
- Never use `any` — define interfaces in `types/`
- shadcn/ui components in `components/ui/` are NOT modified after generation

## Axios

`lib/axios.ts` has a request interceptor that reads the Supabase session from localStorage and attaches `Authorization: Bearer <token>` on every request. Never instantiate axios elsewhere.

## Auth Flow (Frontend)

1. Form submit → Supabase JS SDK handles auth directly (no FastAPI involved)
2. Supabase stores JWT in localStorage automatically
3. `AuthContext` listens to `onAuthStateChange`, exposes `user`, `signIn`, `signOut`, `loading`
4. axios interceptor reads token from Supabase session and attaches it to API calls
5. `ProtectedLayout` checks `user` from context — frontend-only, no backend call

## Routing

Uses `createBrowserRouter` + `RouteObject[]` (React Router v7). Defined in `src/routes/routes.tsx`.

- Public: `/login`, `/register` — share `AuthBrandingPanel`, hardcoded to their mode, no toggle state
- Protected: wrapped in `ProtectedLayout`, redirect to `/login` if no session
- `/` redirects to `/dashboard`
- `*` renders `NotFoundPage` (inline in routes.tsx)
