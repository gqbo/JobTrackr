# Design System — The Executive Agent

## Creative North Star: "The Digital Curator"

JobTrackr is not a spreadsheet-like tracker. It is a premium workspace. The UI must reflect calm, professional authority — treating every job application as a milestone.

Core principles:
- Breathing room over density
- Tonal depth over harsh lines
- Intentional asymmetry over rigid grids
- Editorial feel over SaaS template look

---

## Colors & Surface Philosophy

### Palette

| Token | Hex | Role |
|-------|-----|------|
| `surface` | `#fcf8f9` | Global canvas (base layer) |
| `surface-container-low` | `#f6f3f4` | Large layout blocks (sidebar, panels) |
| `surface-container-lowest` | `#ffffff` | Cards — items that "lift" off the page |
| `surface-container-high` | `#eae7ea` | Nested content, search bars inside headers |
| `surface-container-highest` | `#dddadd` | Hover states, secondary button backgrounds |
| `surface-bright` | `#fdf9fa` | Main content areas — keeps the interface energetic |
| `primary` | `#005ac2` | Action, intelligence, CTAs |
| `primary-dim` | `#004fab` | CTA gradient endpoint |
| `primary-container` | `#d8e2ff` | Tonal badge backgrounds, focus glows |
| `on-primary` | `#ffffff` | Text/icons on primary buttons |
| `on-primary-container` | `#001a41` | Text on tonal badges |
| `on-surface` | `#323235` | Primary text — NEVER use pure black |
| `on-surface-variant` | `#5f5f61` | Secondary / metadata text |
| `outline-variant` | `#b3b1b4` | Ghost borders (used at 15% opacity only) |
| `error` | `#ba1a1a` | Rejected / error status |

### The "No-Line" Rule — NON-NEGOTIABLE
**1px solid borders are PROHIBITED for sectioning.** Boundaries must be defined solely through background color shifts or subtle tonal transitions.

```
✅ surface-container-low panel on a surface background
❌ border border-gray-200 on a container
```

### The "Glass & Gradient" Rule

- **Main CTAs:** Linear gradient from `primary` → `primary-dim` at 135deg
  ```css
  background: linear-gradient(135deg, #005ac2, #004fab);
  ```
- **Floating navigation:** `surface-container-lowest` at 70% opacity + `backdrop-blur-md`

---

## Typography

Two-font system: **Manrope** (headings) + **Inter** (data/body).

Import in `index.html` or global CSS:
```html
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

| Scale | Font | Size | Weight | Use |
|-------|------|------|--------|-----|
| `display-lg` | Manrope | 3.5rem | 300 | Dashboard greetings, hero counts |
| `headline-md` | Manrope | 2rem | 600 | Page titles |
| `headline-sm` | Manrope | 1.5rem | 700 | Card titles (tight letter-spacing: -0.02em) |
| `body-lg` | Inter | 1rem | 400 | Descriptions, notes (line-height: 1.6) |
| `body-sm` | Inter | 0.875rem | 400 | Secondary content |
| `label` | Inter | 0.75rem | 500 | Metadata — UPPERCASE, letter-spacing: 0.05em |

---

## Elevation & Depth

**No dirty shadows.** Height is implied through tone, not shadow darkness.

| Level | Method |
|-------|--------|
| Resting card | `surface-container-lowest` on `surface-container-low` background |
| Floating modal / popover | `shadow-[0_20px_50px_rgba(50,50,53,0.06)]` |
| Input focus ring | 4px outer glow using `primary-container` |

**The "Ghost Border" rule:** When containment is required for accessibility (e.g., inputs), use `outline-variant` at **15% opacity** only.

---

## Spacing Philosophy

- Use asymmetrical padding: **more air at the top** than the bottom (editorial feel)
- Major logical groups: `gap-8` or `gap-12` — NOT `gap-2` for everything
- Between list items: 40px vertical space OR `surface-container-high` hover shift — NO divider lines

---

## Components

### Cards & Data Lists

```
✅ 40px vertical spacing between list items
✅ surface-container-high background on hover
❌ Divider lines / <hr> between items
❌ Cards inside cards with shadows
```

**Status Pillar:** Instead of a full-color badge, render a `4px` vertical left bar in the status color:
```tsx
<div className="w-1 self-stretch rounded-full bg-primary" />
```

### Buttons

| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| Primary | Gradient `primary` → `primary-dim` 135deg | `on-primary` | None |
| Secondary | `surface-container-highest` | `on-surface` | None |
| Tertiary | Transparent | `primary` | None |

Border-radius for all buttons: `rounded-md` (0.375rem).

### Input Fields

```
Background: surface-container-lowest
Border: outline-variant at 15% opacity (ghost border)
Focus: border transitions to primary + 4px primary-container outer glow
```

Tailwind reference:
```tsx
className="bg-white border border-[#b3b1b4]/15 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-md px-4 py-2"
```

### Status Badges (Tonal)

```tsx
className="bg-primary-container text-on-primary-container text-xs font-medium uppercase tracking-wide rounded-full px-3 py-1"
```

Use tonal backgrounds — never high-contrast, fully saturated tags.

### Timeline Component

- Vertical track: `outline-variant` at 20% opacity
- Milestone markers: `surface-container-lowest` circles with a `2px primary` ring

---

## Layout Structure

### Login / Auth Pages

Two-column split layout (50/50):
- **Left panel:** `surface-container-low` background — branding, hero copy, social proof
- **Right panel:** `surface` background — the actual form, centered vertically

On mobile: stack vertically — left panel becomes a compact header, form fills the screen.

```
Desktop: [Left: Branding 50%] | [Right: Form 50%]
Mobile:  [Top: Compact brand]
         [Form full-width]
```

### Application Dashboard

- Sidebar: `surface-container-low` — no border separating it from main content
- Main content: `surface-bright`
- Table rows: alternate between `surface-container-lowest` and `surface` — never use stripes with colors

---

## Do's and Don'ts

### Do
- Use `on-surface` (`#323235`) for all text — NEVER pure `#000000`
- Use `on-surface-variant` (`#5f5f61`) for secondary/metadata
- Use `surface-bright` for main content areas
- Asymmetric padding: more top space than bottom (editorial, breathing)
- Wider gaps (`gap-8`, `gap-12`) for major logical sections

### Don't
- Use `border` classes for layout sectioning — use background shifts
- Use standard `gap-2` everywhere
- Use cards inside cards with shadows
- Use high-contrast, fully saturated color badges
- Use divider lines between list items

---

## Tailwind Custom Tokens (add to `tailwind.config.js`)

```js
colors: {
  surface: '#fcf8f9',
  'surface-bright': '#fdf9fa',
  'surface-container-lowest': '#ffffff',
  'surface-container-low': '#f6f3f4',
  'surface-container': '#f0edef',
  'surface-container-high': '#eae7ea',
  'surface-container-highest': '#dddadd',
  primary: '#005ac2',
  'primary-dim': '#004fab',
  'primary-container': '#d8e2ff',
  'on-primary': '#ffffff',
  'on-primary-container': '#001a41',
  'on-surface': '#323235',
  'on-surface-variant': '#5f5f61',
  'outline-variant': '#b3b1b4',
  error: '#ba1a1a',
},
fontFamily: {
  display: ['Manrope', 'sans-serif'],
  body: ['Inter', 'sans-serif'],
},
```
