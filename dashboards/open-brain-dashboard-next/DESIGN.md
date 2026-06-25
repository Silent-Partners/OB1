# Design

Visual system for the Open Brain dashboard. Source of truth is
`app/globals.css` (`@theme inline`). This file documents it so variants stay
on-brand. Tokens trace back to the "Silent Partners Design System Live"
(colors_and_type.css).

## Theme

Light, warm, editorial. Cream paper surfaces, ink text, a single green accent.
Square corners (2px), flat elevation. Reads like a well-set periodical, not a
SaaS app. Light is intentional and identity-level — never invert to dark.

## Color

Strategy: **Restrained** — tinted warm-neutral surfaces + one accent. The cream
is a committed brand identity, not the AI warm-neutral default; preserve it.

| Role | Token | Value |
|---|---|---|
| Page bg (cream) | `--color-bg-primary` / `--color-cream` | `#f8f6f0` |
| Card / paper | `--color-bg-surface` / `--color-paper` | `#fefdf9` |
| Elevated / inset | `--color-bg-elevated` / `--color-cream-dark` | `#ede9e0` |
| Deeper inset | `--color-cream-darker` | `#e0ddd4` |
| Border (rule) | `--color-border` | `rgba(17,17,16,0.15)` |
| Hairline | `--color-border-subtle` | `rgba(17,17,16,0.08)` |
| Ink (text) | `--color-text-primary` / `--color-ink` | `#111110` |
| Ink mid | `--color-ink-mid` | `#3a3a38` |
| Secondary text | `--color-text-secondary` | `rgba(17,17,16,0.70)` |
| Muted text | `--color-text-muted` / `--color-ink-muted` | `#6b6b67` (≈4.9:1 on cream ✓) |
| Ghost | `--color-ink-ghost` | `#a8a8a4` |
| **Green accent** | `--color-green` / `--color-violet`* | `#1a6b3c` |
| Green dark (hover/press) | `--color-green-dark` / `--color-violet-dim` | `#164f2d` |
| Green mid | `--color-green-mid` | `#2e8a52` |
| Green light / surface tint | `--color-green-light` | `#d6eae0` |
| Green selection glow | `--color-violet-glow` | `rgba(26,107,60,0.15)` |
| Green tint bg | `--color-violet-surface` | `rgba(26,107,60,0.08)` |
| Blue (charts only) | `--color-blue` / `--color-info` | `#7096a4` |
| Success / Warning / Danger | tokens | `#1a6b3c` / `#7a5c1e` / `#8b2020` |

\* **Naming note:** the `--color-violet*` tokens are legacy names mapped to
green so existing utilities re-skin automatically. There is no violet on screen.
Treat `violet` utilities as "the accent." Accent is for **actions, current
selection, and live state only** — never decoration.

## Typography

- **Display / serif:** Source Serif 4 (`--font-serif`), weights 200–700 +
  italics. The editorial voice. Currently under-used — bring it forward for
  page titles, section heads, and large numerals.
- **Body / UI:** Public Sans (`--font-sans`), weights 100–900 + italics.
  Labels, buttons, data, body.
- **Mono:** Roboto Mono (`--font-mono`) — incidental/data.
- **Pairing axis:** serif display + humanist sans (correct contrast pairing).
- **Overline:** `.type-overline` — Public Sans 600, 12px, `0.16em` tracking,
  uppercase, muted. This is a real brand element. Use it as **one** masthead
  kicker per page — NOT as the heading for every section. Section heads should
  be Source Serif 4, not stacked overlines.
- Product scale: fixed rem (not fluid), tight ratio (~1.2). Prose 65–75ch.

## Components

- **Rules over boxes:** thin ink rules (`.rule-top` / `.rule-bottom`, 1px ink)
  and hairline dividers (`--color-border-subtle`) are the primary structural
  device. Reach for a rule before a card.
- **Cards:** `bg-paper` + `border-border` + `rounded-sm` + `shadow-sm`. Use only
  for genuine grouping. Never identical card grids; never nested cards.
- **Radius:** 2px everywhere (`--radius-sm`). All larger radius tokens are
  clamped to 2–4px to tame Tailwind's rounded-* utilities.
- **Elevation:** flat. `--shadow-sm/md/lg` exist for *real* elevation
  (modals, popovers) only.
- **State vocabulary (standardize):** default / hover / focus-visible / active /
  disabled / selected / loading / error. Accent reserved for selected + primary.
- **Type badge:** neutral ink-tint chip + per-type emoji (emoji is decoration,
  never the only signal — the type label text is always present).

## Layout

- App shell: fixed 224px (`w-56`) left sidebar, content `max-w-6xl` centered,
  `px-4 py-4` (mobile) → `px-8 py-8` (desktop). Mobile top bar under 768px.
- Responsiveness is structural (collapse sidebar, reflow columns), not fluid
  type.
- Flex for 1D, grid for 2D. Auto-fit grids: `minmax(280px, 1fr)`.

## Motion

- 150–250ms, ease-out, state-only (hover / focus / selection / feedback).
- No orchestrated page-load choreography — product loads into a task.
- Every transition has a `prefers-reduced-motion: reduce` fallback.
