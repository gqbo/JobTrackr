# Design System — The Executive Agent

## Creative North Star: "The Digital Curator"

JobTrackr is a premium workspace, not a spreadsheet tracker. UI must reflect calm, professional authority.

Core principles: breathing room over density · tonal depth over harsh lines · editorial feel over SaaS template look

---

## Colors

| Token | Hex | Role |
|---|---|---|
| `surface` | `#fcf8f9` | Global canvas |
| `surface-container-low` | `#f6f3f4` | Large layout blocks (panels, sidebar) |
| `surface-container-lowest` | `#ffffff` | Cards — lift off the page |
| `surface-container-high` | `#eae7ea` | Nested content, hover states |
| `surface-container-highest` | `#dddadd` | Secondary button backgrounds |
| `surface-bright` | `#fdf9fa` | Main content areas |
| `primary` | `#005ac2` | CTAs, actions |
| `primary-dim` | `#004fab` | CTA gradient endpoint |
| `primary-container` | `#d8e2ff` | Badge backgrounds, focus glows |
| `on-primary` | `#ffffff` | Text on primary buttons |
| `on-surface` | `#323235` | Primary text — NEVER pure black |
| `on-surface-variant` | `#5f5f61` | Secondary / metadata text |
| `outline-variant` | `#b3b1b4` | Ghost borders (15% opacity only) |
| `error` | `#ba1a1a` | Errors, rejected status |

**No-Line Rule — NON-NEGOTIABLE:** 1px solid borders are PROHIBITED for sectioning. Use background color shifts only.

**CTA gradient:** `from-[#005ac2] to-[#004fab]` at `bg-gradient-to-br`.

---

## Typography

Two fonts: **Manrope** (`font-display`) for headings, **Inter** (`font-body`) for data and body text.

| Scale | Font | Size | Weight | Use |
|---|---|---|---|---|
| display-lg | Manrope | 3.5rem | 300 | Hero counts, dashboard greetings |
| headline-md | Manrope | 2rem | 600 | Page titles |
| headline-sm | Manrope | 1.5rem | 700 | Card titles (-0.02em tracking) |
| body-lg | Inter | 1rem | 400 | Descriptions (1.6 line-height) |
| body-sm | Inter | 0.875rem | 400 | Secondary content |
| label | Inter | 0.75rem | 500 | Metadata — UPPERCASE, 0.05em tracking |

---

## Elevation

No dirty shadows — height implied through tone.

| Level | Method |
|---|---|
| Resting card | `surface-container-lowest` on `surface-container-low` |
| Floating modal | `shadow-[0_20px_50px_rgba(50,50,53,0.06)]` |
| Input focus | 2px ring `[#005ac2]/10` |

Ghost border for inputs: `border-[#b3b1b4]/20` — never full opacity.

---

## Spacing

- Asymmetric padding: more air at the top than the bottom
- Major sections: `gap-8` or `gap-12`
- Between list items: 40px vertical space — NO divider lines

---

## Components

### Buttons

| Variant | Background | Text |
|---|---|---|
| Primary | `from-[#005ac2] to-[#004fab]` gradient | `#ffffff` |
| Secondary | `surface-container-highest` | `on-surface` |
| Tertiary | transparent | `primary` |

All buttons: `rounded-md`, no border.

### Inputs
`bg-white border border-[#b3b1b4]/20`, focus: `border-[#005ac2] ring-2 ring-[#005ac2]/10`.

### FieldError
Use `FieldError` component for all form field errors — never a plain `<p>`. Renders `AlertCircle` (13px) + message in `error` color.

### PasswordInput
Use `PasswordInput` component for all password fields. Manages `Eye`/`EyeOff` toggle internally. Accepts all input props except `type`.

### Status Badges (Tonal)
`bg-primary-container text-on-primary-container` — rounded-full, uppercase, tracking-wide. Never high-contrast saturated colors.

### Status Pillar
4px vertical left bar instead of full-color badge: `<div className="w-1 self-stretch rounded-full bg-primary" />`.

---

## Layout

### Auth Pages
Two-column split (50/50). Left panel is `AuthBrandingPanel` component (shared across `/login` and `/register`): `surface-container-low` bg, logo + hero copy + social proof + decorative grid. Right panel: `surface` bg, form centered, `max-w-sm`. On mobile: stack vertically.

### Dashboard
Sidebar: `surface-container-low` — no border. Main content: `surface-bright`. Table rows: alternate `surface-container-lowest` / `surface` — no colored stripes.

---

## Do / Don't

✅ `on-surface` for all text · `surface-bright` for content areas · wider gaps for major sections · tonal badge backgrounds
❌ Pure `#000000` · border classes for layout · cards inside cards with shadows · dividers between list items · `gap-2` everywhere
