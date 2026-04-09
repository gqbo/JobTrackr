# PRD — Sprint 2: Applications Table
**JobTrackr · "The Digital Curator"**

---

## 1. Overview

**Objetivo:** Construir la pantalla principal de JobTrackr — la tabla de postulaciones. Esta es la pantalla donde el usuario vive el 90% del tiempo en la app.

**Scope:**
- ✅ Tabla con TanStack Table v8 (ya en el stack)
- ✅ CRUD completo (crear, editar inline, eliminar)
- ✅ Buscador global + filtros por columna + ordenamiento
- ✅ Notes timeline modal
- ✅ Add Application (URL input — campos vacíos hasta Sprint 3 AI)
- ✅ Seed data para desarrollo
- ❌ Stats cards (Sprint 5 — Dashboard)
- ❌ Google OAuth (Sprint 1C — pospuesto)

**Ruta:** `/dashboard` → renombrada internamente a "My Applications" (sidebar: "Applications")

---

## 2. Design Language

Seguir `docs/design-system.md` estrictamente. Lo que aplica específicamente a esta pantalla:

### Superficie y layout
```
Layout: sidebar fijo (surface-container-low) + main content (surface-bright)
Table area: surface-container-lowest — "lifts off" the page
No borders de 1px para seccionar — solo shifts de background color
```

### Tokens de color
```
#fcf8f9  surface                — canvas global
#f6f3f4  surface-container-low  — sidebar
#fdf9fa  surface-bright         — main content area
#ffffff  surface-container-lowest — tabla / cards
#eae7ea  surface-container-high  — hover rows, inputs anidados
#323235  on-surface             — todo el texto principal
#5f5f61  on-surface-variant     — metadata (fechas, labels)
#005ac2  primary                — CTAs, links, pillar Applied
#b3b1b4  outline-variant        — ghost borders al 20% opacity
```

### Tipografía (consistente con Login/Register)
```
font-display (Manrope): "My Applications" — headline-md (2rem, 600)
font-body (Inter): todo el contenido de la tabla — body-sm (0.875rem)
Labels de columna: font-body text-xs font-medium uppercase tracking-wider text-[#5f5f61]
```

### Botón "+ Add Application"
```
Igual que el botón "Sign In" del login:
bg-gradient-to-br from-[#005ac2] to-[#004fab]
text-white font-body font-semibold text-sm rounded-md
hover:from-[#004fab] hover:to-[#003d96]
```

---

## 3. Columns

| Columna | Ancho aprox. | Tipo | Edición | Notas |
|---|---|---|---|---|
| Status Pillar | 4px | Visual | — | Barra vertical izquierda, color por status |
| Company | ~180px | Texto | Inline | |
| Role | ~220px | Texto | Inline | |
| Status | ~150px | Dropdown | Inline | Badge tonal |
| Modality | ~120px | Dropdown | Inline | Remote / Hybrid / On-site |
| Location | ~160px | Texto | Inline | `—` si Modality = Remote |
| Salary | ~120px | Texto | Inline | Opcional, frecuentemente vacío |
| Date Saved | ~120px | Fecha | Solo lectura | Auto al crear |
| Actions | ~100px | Iconos | — | Notes · URL · Delete |

**Sin columna de excitement/priority.** Será reemplazada por AI Match Score en sprint futuro (requiere CV upload).

---

## 4. Status Config

Centralizado en `frontend/src/config/applicationStatuses.ts` — **SINGLE SOURCE OF TRUTH**.
Agregar un status nuevo = editar un solo archivo en frontend + un solo archivo en backend.

| Status | Label | Pillar Color | Badge BG | Badge Text | Orden |
|---|---|---|---|---|---|
| `bookmarked` | Bookmarked | `#b3b1b4` | `#f0f0f0` | `#5f5f61` | 1 |
| `applied` | Applied | `#005ac2` | `#d8e2ff` | `#004fab` | 2 |
| `interviewing` | Interviewing | `#d97706` | `#fef3c7` | `#92400e` | 3 |
| `accepted` | Accepted | `#16a34a` | `#dcfce7` | `#166534` | 4 |
| `rejected` | Rejected | `#ba1a1a` | `#fde8e8` | `#ba1a1a` | 5 |
| `ghosted` | Ghosted | `#6b7280` | `#f3f4f6` | `#374151` | 6 |

**Status Pillar:**
```tsx
<div className="w-1 self-stretch rounded-full" style={{ backgroundColor: status.pillarColor }} />
```

**Status Badge:** tonal, `rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide` — nunca colores 100% saturados.

---

## 5. Row Behavior

### Hover
```
bg-[#eae7ea]  (surface-container-high) — sin borde, solo color shift
transition-colors duration-150
```

### Edición inline
- Click en celda → aparece input o select en lugar del texto
- `onBlur` o `Enter` → PATCH /applications/:id → optimistic update con TanStack Query
- `Escape` → cancela edición, restaura valor anterior
- Input styling consistente con el login:
  ```
  bg-white border border-[#b3b1b4]/20 rounded-md px-2 py-1 text-sm
  focus:border-[#005ac2] focus:ring-2 focus:ring-[#005ac2]/10
  ```

### Location cuando Modality = Remote
```
Texto: "—" con line-through y color #5f5f61
No editable mientras modality sea Remote
```

### Separación entre filas
40px de vertical whitespace — **NUNCA divider lines**. Consistente con design-system.

---

## 6. Actions Column

Tres iconos de `lucide-react`, con tooltip nativo (`title` attribute):

| Ícono | Tooltip | Acción |
|---|---|---|
| `FileText` | "View Notes" | Abre NotesModal |
| `ExternalLink` | "Open Posting" | `target="_blank" rel="noopener"` al URL guardado |
| `Trash2` | "Delete" | Confirm dialog → DELETE /applications/:id |

Estilo: `text-[#5f5f61] hover:text-[#323235] transition-colors p-1 rounded`

---

## 7. Add Application Modal

Disparado por el botón "+ Add Application":

```
Modal flotante:
  bg: surface-container-lowest (#ffffff)
  shadow: shadow-[0_20px_50px_rgba(50,50,53,0.06)]
  Cierra al click fuera del modal

Heading: "Add Application"
  font-display font-semibold text-[#323235]

Label: "JOB POSTING URL"
  font-body text-xs uppercase tracking-wider text-[#5f5f61]

Input: igual al del login
  bg-white border border-[#b3b1b4]/20 rounded-md
  placeholder: "https://linkedin.com/jobs/..."

Button: "Save Application"
  bg-gradient-to-br from-[#005ac2] to-[#004fab] — mismo estilo que Sign In
```

`POST /applications { url }` → crea registro con campos vacíos → toast de confirmación.

---

## 8. Notes Modal (Timeline)

```
Modal flotante — mismo shadow que Add Application

Heading: "{Company} — Notes"

Timeline (desc por created_at):
┌─────────────────────────────────────┐
│  Apr 09, 2026 · 3:24 PM     [🗑]   │
│  Hice la entrevista técnica.         │
│  Me pidieron un home assignment.     │
└─────────────────────────────────────┘

Input al fondo:
  [textarea placeholder "Add a note..."]  [Add →]

Botón Add: primary gradient, py-2 px-4
Botón delete por nota: Trash2 icon, text-[#5f5f61] hover:text-[#ba1a1a]
```

Separación entre entradas: background shift `surface-container-low` alternado — sin líneas divisoras.

---

## 9. Search, Filters, Sort

```
Search bar:
  bg-white border border-[#b3b1b4]/20 rounded-md
  placeholder "Search applications..."
  Ícono: Search (lucide-react)
  Busca en: company, role, location

Filter dropdowns:
  Status (multi-select) · Modality (multi-select)
  Estilo secondary — surface-container-highest bg, on-surface text

Column headers:
  Sortable — ícono ChevronsUpDown → ChevronUp / ChevronDown
  label uppercase tracking-wider text-xs text-[#5f5f61]
```

Todo client-side con TanStack Table v8.

---

## 10. Pagination

```
Default: 5 filas/página
Selector: [5] [10] [25] [50]
  activo: bg-[#eae7ea] text-[#323235]
  inactivo: transparent text-[#5f5f61]

"Showing 1–5 of 24 applications"
  font-body text-sm text-[#5f5f61]

[Previous]  1  2  3  …  12  [Next]
```

---

## 11. Sidebar

```
Logo: "JobTrackr" — font-display bold
Subtitle: "The Digital Curator" — font-body text-xs text-[#5f5f61]

Nav items:
  Activo:   bg-[#005ac2]/10 text-[#005ac2] border-l-2 border-[#005ac2]
  Inactivo: text-[#5f5f61] hover:bg-[#eae7ea]

Items Sprint 2: Applications (activo), Kanban, Stats, Settings (placeholders)

Bottom: avatar + nombre + email del AuthContext
```

---

## 12. Empty State

```
Centered en la tabla:
  Ícono: Briefcase — text-[#b3b1b4] text-5xl
  Heading: "No applications yet" — font-display text-xl text-[#323235]
  Sub: "Paste a job URL to get started" — font-body text-[#5f5f61]
  Button: "+ Add Application" — primary gradient
```

---

## 13. Backend

### DB Migration
`supabase/migrations/<timestamp>_create_applications.sql`

```sql
CREATE TYPE application_status AS ENUM (
  'bookmarked', 'applied', 'interviewing', 'accepted', 'rejected', 'ghosted'
);
CREATE TYPE application_modality AS ENUM ('remote', 'hybrid', 'on_site');

CREATE TABLE applications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  company     TEXT,
  role        TEXT,
  status      application_status NOT NULL DEFAULT 'bookmarked',
  modality    application_modality,
  location    TEXT,
  salary      TEXT,
  source      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE application_notes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id  UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_applications" ON applications FOR ALL USING (user_id = auth.uid());
CREATE POLICY "own_notes" ON application_notes FOR ALL
  USING (application_id IN (SELECT id FROM applications WHERE user_id = auth.uid()));
```

### API Endpoints

| Method | Path | Descripción |
|---|---|---|
| GET | `/applications` | List (limit, offset) |
| POST | `/applications` | Create `{ url }` |
| GET | `/applications/{id}` | Get one |
| PATCH | `/applications/{id}` | Update parcial |
| DELETE | `/applications/{id}` | Delete |
| GET | `/applications/{id}/notes` | List notes |
| POST | `/applications/{id}/notes` | Add note `{ content }` |
| DELETE | `/applications/{id}/notes/{note_id}` | Delete note |

Todos requieren `CurrentUserDep`. Arquitectura: **Router → Service → Repository** (NON-NEGOTIABLE).

### Archivos Backend
```
app/models/application.py              ← ApplicationStatus, ApplicationModality, schemas
app/repositories/application_repository.py
app/services/application_service.py
app/api/applications.py               ← router
backend/seed_dev.py                   ← 15 aplicaciones + notas para dev
```

---

## 14. Frontend Files

```
src/
  config/
    applicationStatuses.ts            ← SINGLE SOURCE OF TRUTH para statuses
  types/
    index.ts                          ← Application, ApplicationNote, enums
  hooks/
    useApplications.ts                ← TanStack Query hooks (CRUD + notes)
  pages/
    ApplicationsPage.tsx              ← página principal
  components/
    ApplicationsTable.tsx             ← TanStack Table v8
    InlineEditCell.tsx                ← wrapper genérico edición inline
    StatusPillar.tsx                  ← barra 4px izquierda
    StatusBadge.tsx                   ← badge tonal por status
    ModalityCell.tsx                  ← location con strikethrough si Remote
    NotesModal.tsx                    ← timeline de notas
    AddApplicationModal.tsx           ← URL input modal
```

---

## 15. Seed Data

`backend/seed_dev.py` — 15 aplicaciones realistas, todas con 1–2 notas:

| Empresa | Rol | Status | Modalidad |
|---|---|---|---|
| Google | Senior Frontend Engineer | Interviewing | Remote |
| Stripe | Product Designer | Applied | Hybrid |
| Airbnb | Software Engineer II | Bookmarked | Remote |
| Meta | Mobile Engineer iOS | Rejected | On-site |
| TradeStation | Software Engineer Intern | Ghosted | Remote |
| Babel | Full Stack .NET/React | Applied | Remote |
| TransUnion | Software Engineer | Bookmarked | Remote |
| Shopify | Frontend Developer | Interviewing | Remote |
| GitHub | Staff Engineer | Accepted | Remote |
| Netflix | Senior React Developer | Applied | On-site |
| Cloudflare | Systems Engineer | Applied | Remote |
| Vercel | DX Engineer | Bookmarked | Remote |
| Linear | Product Engineer | Interviewing | Remote |
| Notion | Software Engineer | Rejected | Hybrid |
| Figma | Frontend Engineer | Applied | Hybrid |

```bash
cd backend && python seed_dev.py
```

---

## 16. Tests

### Backend (pytest)
- `test_api/test_applications.py` — CRUD completo, ownership checks (user A no ve datos de B), 404 en registros ajenos
- `test_api/test_notes.py` — Notes CRUD, cascade delete al borrar application

### Frontend (vitest)
- `applicationStatuses.test.ts` — todos los statuses tienen label, pillarColor, badgeBg, badgeText, order
- `useApplications.test.ts` — hooks con axios mockeado

---

## 17. Docs a actualizar después de implementar

| Cambio | Archivo |
|---|---|
| Nuevos patrones backend (CRUD layers) | `docs/backend.md` |
| TanStack Table, inline editing, hooks pattern | `docs/frontend.md` |
| Nuevos patrones de test (integration CRUD) | `docs/testing.md` |
| DB schema actualizado, roadmap | `docs/project-overview.md` |

---

## 18. Verification Checklist

- [ ] `supabase db push` aplica migración sin errores
- [ ] `pytest` pasa (todos los tests nuevos + existentes)
- [ ] `npx vitest` pasa
- [ ] `tsc --noEmit` — 0 errores TypeScript
- [ ] Tabla renderiza con seed data (15 aplicaciones)
- [ ] Edición inline guarda en DB al blur/enter, cancela con Escape
- [ ] Status pillar color coincide con el status de cada fila
- [ ] Hover de fila: solo color shift, sin border
- [ ] Notes modal: agregar + eliminar entradas, timestamps correctos
- [ ] Add Application: URL guarda, fila aparece con campos vacíos
- [ ] Search filtra rows en tiempo real (company, role, location)
- [ ] Sort funciona en todas las columnas sortables
- [ ] Paginación: 5/página default, selector 5/10/25/50 funciona
- [ ] Location muestra `—` cuando Modality = Remote
- [ ] Action icons: tooltips visibles en hover
- [ ] Empty state visible cuando no hay aplicaciones o búsqueda sin resultados
- [ ] Tokens de color del design system respetados (no pure black, no 1px borders de layout)
