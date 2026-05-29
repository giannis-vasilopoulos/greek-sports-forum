---
name: tailwind-styling
description: >-
  Applies Greek Sports Forum Tailwind CSS v4 styling conventions — semantic
  tokens, dark mode, cn(), layout. Use when editing CSS, Tailwind classes,
  theme tokens, globals.css, responsive layout, or visual spacing.
---

# Tailwind Styling

Project-specific styling rules for Greek Sports Forum. For adding UI components, see [shadcn-ui](../shadcn-ui/SKILL.md). For landing-page design exploration, see [ui-ux-pro-max](../ui-ux-pro-max/SKILL.md).

## Stack

- **Tailwind CSS v4** via `@import "tailwindcss"` in `app/globals.css`
- **shadcn tailwind** via `@import "shadcn/tailwind.css"`
- **Animations** via `@import "tw-animate-css"`
- **No** legacy `tailwind.config.js` — theme lives in CSS (`@theme inline`)
- **Class merging** — always use `cn()` from `@/lib/utils`

## Semantic tokens

Prefer semantic utilities over hard-coded colors. Tokens are defined in `:root` and `.dark` in `app/globals.css` and mapped in `@theme inline`.

| Utility | Use for |
| --- | --- |
| `bg-background` / `text-foreground` | Page surfaces and body text |
| `bg-card` / `text-card-foreground` | Card containers |
| `bg-primary` / `text-primary-foreground` | Primary actions, emphasis |
| `bg-secondary` / `text-secondary-foreground` | Secondary actions |
| `bg-muted` / `text-muted-foreground` | Subtle backgrounds, helper text |
| `bg-accent` / `text-accent-foreground` | Hover/highlight states |
| `bg-destructive` / `text-destructive` | Errors, destructive actions |
| `border-border` | Default borders |
| `ring-ring` | Focus rings |
| `bg-popover` / `text-popover-foreground` | Dropdowns, popovers |

For sidebar and chart tokens, see [reference.md](reference.md).

## Dark mode

- Class-based: `@custom-variant dark (&:is(.dark *))` in `globals.css`
- Apply `.dark` on a parent element (typically `<html>`)
- **Always test both light and dark** before finishing UI work
- Use semantic tokens — they adapt automatically; do not duplicate color logic in components

## Fonts

Geist sans and mono are loaded in `app/layout.tsx`:

- `--font-geist-sans` → body/UI (`font-sans`)
- `--font-geist-mono` → code (`font-mono`)

Do not introduce ad-hoc font stacks without updating both `app/layout.tsx` and `@theme inline` in `globals.css`.

## Layout and spacing

- Use consistent container widths (`max-w-6xl`, `max-w-7xl`) within a page
- Account for fixed navbars — add padding so content is not hidden
- Responsive breakpoints: verify at 375px, 768px, 1024px, 1440px
- No horizontal scroll on mobile

## Interaction

- Clickable elements: `cursor-pointer` and visible hover feedback
- Transitions: `transition-colors duration-200` (150–300ms range)
- Focus: visible focus rings (`focus-visible:ring-ring/50` pattern from shadcn components)
- **No layout-shifting hovers** — avoid `scale` transforms on cards/nav that move surrounding content

## Anti-patterns

| Don't | Do instead |
| --- | --- |
| `bg-slate-900`, `text-blue-500`, raw hex | `bg-background`, `text-primary`, semantic tokens |
| `style={{ color: 'var(--primary)' }}` or `bg-[var(--primary)]` | `bg-primary`, `text-primary-foreground` |
| Hard-coded light/dark classes on every element | Semantic tokens that switch via `.dark` |
| Editing `components/ui/*` for one-off colors | `className` override or wrapper component |
| Emoji as UI icons | Lucide icons (`lucide-react`) |

## Customizing the theme

To change colors or radius:

1. Edit CSS variables in `:root` / `.dark` in `app/globals.css`
2. Keep `@theme inline` mappings in sync
3. Do not add parallel color systems — map design recommendations to existing tokens

See [reference.md](reference.md) for the full token → utility mapping.

## When to escalate

Use [ui-ux-pro-max](../ui-ux-pro-max/SKILL.md) when the task needs:

- Landing-page layout patterns or hero structure
- New palette / typography exploration beyond existing tokens
- UX guideline searches (accessibility, animation, z-index)

After design research, **map results back to semantic tokens** in `globals.css` — do not introduce standalone color variables in JSX.

## Pre-delivery checklist

- [ ] Semantic tokens used (no raw palette utilities where tokens exist)
- [ ] `cn()` used for conditional/merged classes
- [ ] Light and dark modes tested
- [ ] Borders visible in both modes (`border-border`)
- [ ] Muted text readable (`text-muted-foreground`, not too light)
- [ ] No layout shift on hover/focus
- [ ] Responsive at mobile and desktop widths
