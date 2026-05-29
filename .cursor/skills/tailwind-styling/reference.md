# Theme token reference

Read when customizing `app/globals.css` or applying sidebar/chart/radius tokens.

## Core tokens → Tailwind utilities

| CSS variable | Tailwind utilities |
| --- | --- |
| `--background` | `bg-background` |
| `--foreground` | `text-foreground` |
| `--card` | `bg-card` |
| `--card-foreground` | `text-card-foreground` |
| `--popover` | `bg-popover` |
| `--popover-foreground` | `text-popover-foreground` |
| `--primary` | `bg-primary`, `text-primary`, `border-primary` |
| `--primary-foreground` | `text-primary-foreground` |
| `--secondary` | `bg-secondary` |
| `--secondary-foreground` | `text-secondary-foreground` |
| `--muted` | `bg-muted` |
| `--muted-foreground` | `text-muted-foreground` |
| `--accent` | `bg-accent` |
| `--accent-foreground` | `text-accent-foreground` |
| `--destructive` | `bg-destructive`, `text-destructive` |
| `--border` | `border-border` |
| `--input` | `bg-input`, `border-input` |
| `--ring` | `ring-ring` |

## Sidebar tokens

| CSS variable | Tailwind utilities |
| --- | --- |
| `--sidebar` | `bg-sidebar` |
| `--sidebar-foreground` | `text-sidebar-foreground` |
| `--sidebar-primary` | `bg-sidebar-primary` |
| `--sidebar-primary-foreground` | `text-sidebar-primary-foreground` |
| `--sidebar-accent` | `bg-sidebar-accent` |
| `--sidebar-accent-foreground` | `text-sidebar-accent-foreground` |
| `--sidebar-border` | `border-sidebar-border` |
| `--sidebar-ring` | `ring-sidebar-ring` |

## Chart tokens

| CSS variable | Tailwind utility |
| --- | --- |
| `--chart-1` | `bg-chart-1`, `text-chart-1` |
| `--chart-2` | `bg-chart-2`, `text-chart-2` |
| `--chart-3` | `bg-chart-3`, `text-chart-3` |
| `--chart-4` | `bg-chart-4`, `text-chart-4` |
| `--chart-5` | `bg-chart-5`, `text-chart-5` |

## Radius scale

Base: `--radius: 0.625rem` in `:root`.

| Token | Formula | Typical use |
| --- | --- | --- |
| `--radius-sm` | `calc(var(--radius) * 0.6)` | Small elements |
| `--radius-md` | `calc(var(--radius) * 0.8)` | Buttons (xs/sm) |
| `--radius-lg` | `var(--radius)` | Default rounded corners |
| `--radius-xl` | `calc(var(--radius) * 1.4)` | Cards |
| `--radius-2xl` | `calc(var(--radius) * 1.8)` | Large panels |
| `--radius-3xl` | `calc(var(--radius) * 2.2)` | Hero sections |
| `--radius-4xl` | `calc(var(--radius) * 2.6)` | Feature blocks |

Use Tailwind radius utilities (`rounded-lg`, `rounded-xl`) which map to these tokens via `@theme inline`.

## Color format

Tokens use **oklch** in `:root` / `.dark`. When adjusting colors, keep both light and dark schemes in sync. Dark mode borders often use alpha: `oklch(1 0 0 / 10%)`.
