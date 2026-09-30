---
name: Serene Ice Confectionery Suite
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#41474e'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#72787f'
  outline-variant: '#c1c7cf'
  surface-tint: '#2d628c'
  primary: '#2a6089'
  on-primary: '#ffffff'
  primary-container: '#4679a4'
  on-primary-container: '#fdfcff'
  inverse-primary: '#9acbfb'
  secondary: '#3b6281'
  on-secondary: '#ffffff'
  secondary-container: '#b4dcff'
  on-secondary-container: '#3a617f'
  tertiary: '#4f5e68'
  on-tertiary: '#ffffff'
  tertiary-container: '#677781'
  on-tertiary-container: '#fcfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cde5ff'
  primary-fixed-dim: '#9acbfb'
  on-primary-fixed: '#001d32'
  on-primary-fixed-variant: '#094a73'
  secondary-fixed: '#cbe6ff'
  secondary-fixed-dim: '#a4cbee'
  on-secondary-fixed: '#001e30'
  on-secondary-fixed-variant: '#214a68'
  tertiary-fixed: '#d5e5f1'
  tertiary-fixed-dim: '#b9c9d4'
  on-tertiary-fixed: '#0e1d26'
  on-tertiary-fixed-variant: '#3a4952'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-sm: 0.75rem
  gutter-lg: 2rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a refined, serene management environment tailored for luxury confectioneries and artisanal retail operations. Drawing inspiration from clean Scandinavian minimalism and soft frosted tones, the aesthetic prioritizes cognitive clarity, executive grace, and frictionless operational oversight.

The visual mood evokes purity, stillness, and deliberate precision. Interfaces are composed of airy, powder-tinted canvases, balanced whitespace, and quiet structural lines. Rather than high-stress operational dashboards characterized by harsh contrasts and aggressive alerts, this system creates an aura of tranquil competence. Interactions feel featherlight yet grounded, instilling absolute confidence for inventory, recipe formulation, branch orders, and retail analytics.

## Colors

The palette directly builds upon soft atmospheric ice tones and powder blues, supported by deep slate ink to ensure rigorous contrast and effortless legibility.

- **Primary (`#5A8CB8`):** Steel Ice Blue serves as the main interactive anchor—delivering crisp focal emphasis on primary actions, toggles, and active navigation nodes without visual fatigue.
- **Secondary (`#8DB4D6`):** Soft Glacial Blue provides secondary interaction styling, active container borders, metric highlights, and hover states.
- **Tertiary (`#D6E6F2`):** Powder Muted Tint acts as the functional structural divider, input surface stroke, and pill/chip background.
- **Neutral (`#1E293B`):** Deep Slate Ink delivers high-contrast typography, crisp iconography, and dark foundational contrast against pastel layers.

### Surface Tiers
- **Canvas Base:** `#F8FAFD` — A subtle, cool-tinted whisper of blue that softens ambient glare.
- **Card / Panel Elevate:** `#FFFFFF` — Crisp, pure white elevated tiles standing cleanly above the canvas.
- **Subtle Recessed Fill:** `#F0F4F9` — Used for table headers, inactive segments, and nested panels.
- **Hairline Borders:** `#E2EAF2` — Extremely soft, low-contrast delineations replacing dark separator lines.

## Typography

The design system relies entirely on **Plus Jakarta Sans**, utilizing its geometric yet friendly modern proportions to deliver warmth alongside clinical administrative clarity. 

- Large titles feature subtle negative tracking to preserve cohesion and contemporary composure.
- Data tables, tabular metrics, and form values lean strictly on medium weights (`500`) to avoid ink bleed on pale surfaces.
- Small indicators, category captions, and metadata tags use tracked uppercase or semi-bold variants (`label-sm`, `label-md`) to ensure effortless scanning across multi-column data sheets.

## Layout & Spacing

A fluid 12-column grid anchors the desktop console experience, backed by a base 4px/8px modular rhythm. The overarching philosophy prioritizes generous margins and breathing space around high-density operational tables and order cards.

- **Desktop (1200px+):** 12-column grid, `margin: 2rem` to `2.5rem`, `gutter: 1.5rem` to `2rem`. Nested split views (e.g., inventory catalog on left, batch formula details on right) run a 5:7 or 4:8 split.
- **Tablet (768px - 1199px):** 8-column layout with `gutter: 1.25rem` and `margin: 1.5rem`. Secondary panels transition into collapsible side sheets.
- **Mobile (<768px):** 4-column layout, `gutter-sm: 0.75rem`, `margin-mobile: 1rem`. Multi-column analytical tables collapse to responsive card lists with sticky status action bars.

## Elevation & Depth

Visual hierarchy avoids heavy drop-shadows or dark artificial occlusions. Instead, depth is articulated through **tonal stratification and soft, sky-tinted ambient glows**.

- **Level 0 (Canvas):** `#F8FAFD` — Static base level.
- **Level 1 (Cards, Modules, Table Containers):** `#FFFFFF` surface bordered by a 1px hairline border of `#E2EAF2`. Accompanied by an ultra-diffused atmospheric shadow: `0 2px 12px -2px rgba(90, 140, 184, 0.08)`.
- **Level 2 (Hovered Cards, Dropdown Menus, Popovers):** `#FFFFFF` surface, `0 8px 24px -4px rgba(90, 140, 184, 0.14)`, border color shifts slightly to `#D6E6F2`.
- **Level 3 (Modal Dialogs, Flyouts):** `#FFFFFF` elevated with a backdrop scrim of `#1E293B` at 18% opacity with a `backdrop-blur(4px)` wash. Ambient shadow: `0 20px 40px -8px rgba(30, 41, 59, 0.12)`.

## Shapes

The interface embraces a gentle, approachable curvature (Level 2). This eliminates clinical harshness while retaining the structured posture required for professional enterprise tooling.

- Standard buttons, input fields, dropdown triggers, and chips adhere to `rounded-md` (8px / `0.5rem`).
- Module cards, analytics charts, and modal frames use `rounded-lg` (16px / `1rem`).
- Micro status tags, pill indicators, and floating avatar badges use full circular pills (`rounded-full` / 9999px).

## Components

### Buttons
- **Primary:** Filled with `#5A8CB8`, text in `#FFFFFF`, font weight `600`. Hover state transitions to `#4C7C9E` with a subtle elevation shift. Active state drops 1px down.
- **Secondary / Soft:** Background `#F0F4F9`, text `#1E293B`, border 1px solid `#D6E6F2`. On hover: background `#E4EEF7`.
- **Ghost:** Transparent background, `#5A8CB8` text. Hover brings a gentle `#F2F7FB` surface wash.

### Form Inputs & Selects
- Inputs feature a crisp `#FFFFFF` background with an `#E2EAF2` perimeter stroke and `0.5rem` radius. 
- Placeholder text in `#94A3B8`. Active text in `#1E293B`.
- Focus state reveals a 1px `#5A8CB8` border paired with an ambient ice-blue outer ring: `box-shadow: 0 0 0 3px rgba(90, 140, 184, 0.18)`.

### Cards & Metrics Modules
- Pure `#FFFFFF` surfaces with 16px corner radii and delicate `#E2EAF2` perimeter hairline borders.
- KPI blocks present stat titles in `label-md` (`#64748B`), major values in `headline-md` (`#1E293B`), and trend badges in rounded pill chips with pale-tinted indicators (e.g., `#EBF7EE` for positive yield).

### Chips & Status Badges
- **Active / Verified:** `#EBF3FA` fill with `#3A729E` label.
- **Pending / In Batch:** `#FFF9EB` fill with `#B45309` label.
- **Completed / Dispatched:** `#ECFDF5` fill with `#047857` label.
- All badges are rendered with `rounded-full` pill contours and `label-sm` typographic styling.

### Tables & Inventory Data Lists
- Table headers utilize `#F0F4F9` background, `label-sm` slate text, and bottom border `#E2EAF2`.
- Alternating rows remain cleanly white (`#FFFFFF`) with smooth `#F8FAFD` hover states. 
- Row separators use a razor-thin 1px `#F2F7FB` border.

### Checkboxes & Radios
- Box outlines use `#CBD5E1`. When selected, fill turns `#5A8CB8` with a crisp white checkmark/dot.
- Focus rings produce a matching 3px soft blue halo (`rgba(90, 140, 184, 0.20)`).