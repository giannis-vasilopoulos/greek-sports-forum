---
name: shadcn-ui
description: >-
  Adds and extends shadcn/ui components for Greek Sports Forum — radix-nova
  style, CLI workflow, RSC patterns, Lucide icons. Use when adding UI
  components, forms, dialogs, or working in components/ui/.
---

# shadcn/ui

Project component library conventions. For Tailwind tokens and dark mode, see [tailwind-styling](../tailwind-styling/SKILL.md). For landing-page design exploration, see [ui-ux-pro-max](../ui-ux-pro-max/SKILL.md).

## Project config

From `components.json`:

| Setting | Value |
| --- | --- |
| Style | `radix-nova` |
| Base color | `neutral` |
| RSC | `true` |
| Icons | `lucide` |
| CSS entry | `app/globals.css` |

**Path aliases:**

- `@/components/ui` — primitives
- `@/components` — shared composites
- `@/lib/utils` — `cn()` helper
- `@/hooks` — shared hooks

## Adding components

Always use the CLI — never copy-paste from external sources:

```bash
pnpm dlx shadcn@latest add <component-name>
```

Examples:

```bash
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add dialog form
```

After adding, update [reference.md](reference.md) if the component inventory changed.

## File placement

| Type | Location |
| --- | --- |
| Shared primitives | `components/ui/` |
| Route-specific composites | `app/<route>/` (co-located) |
| Shared non-primitive UI | `components/` (not `ui/`) |

## Extend, don't fork

- **Prefer** `className` prop overrides on shadcn primitives
- **Prefer** wrapper components for repeated compositions
- **Avoid** editing `components/ui/*` for one-off styling — extend instead
- **Only edit primitives** for bug fixes upstream would accept

## Component patterns

Follow existing code in `components/ui/button.tsx`:

```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

// cva variants with semantic token classes (bg-primary, border-border, etc.)
// data-slot, data-variant, data-size attributes for styling hooks
// asChild + Slot.Root for polymorphic rendering (e.g. Button as Link)
```

Key conventions:

- **Variants via `cva`** — not inline conditional color classes
- **Semantic tokens in variants** — `bg-primary`, not `bg-blue-500`
- **`cn()` for merging** — `cn(buttonVariants({ variant, size }), className)`

## Server vs client components

- **Default**: Server Components in `app/`
- **Add `"use client"`** only when the component needs hooks, browser APIs, or event handlers
- Interactive shadcn primitives (Dialog, Sheet, Form, Select, DropdownMenu, etc.) require `"use client"`
- Static primitives (Button, Badge, Card shell) can stay as Server Components when used without client-only children

## Icons

- **Lucide only** — `import { IconName } from "lucide-react"`
- Consistent sizing: `[&_svg:not([class*='size-'])]:size-4` (see button.tsx)
- No emoji as UI icons

## Forms

For user input, use the shadcn Form pattern:

- `react-hook-form` + `zodResolver` + Zod schema
- `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`

Add via CLI if missing:

```bash
pnpm dlx shadcn@latest add form input label
```

Do not hand-roll validation UI with raw `<input>` and manual error spans.

## Common compositions

| Pattern | Components |
| --- | --- |
| Content block | `Card` + `CardHeader` + `CardTitle` + `CardContent` |
| Modal | `Dialog` + `DialogContent` + `DialogHeader` + `DialogTitle` |
| Side panel | `Sheet` + `SheetContent` (set `side` prop) |
| Form page | `Form` + `FormField` + `Input` / `Select` / `Textarea` |
| Data list | `Table` or `DataTable` (TanStack Table for sort/filter) |
| Tabs | `Tabs` + `TabsList` + `TabsTrigger` + `TabsContent` |

See [reference.md](reference.md) for installed components and doc links.

## Cross-links

- Token/theming questions → [tailwind-styling](../tailwind-styling/SKILL.md)
- Visual design, palettes, landing structure → [ui-ux-pro-max](../ui-ux-pro-max/SKILL.md)

## Anti-patterns

| Don't | Do instead |
| --- | --- |
| Copy component source from shadcn docs | `pnpm dlx shadcn@latest add` |
| Hard-coded colors in variants | Semantic token classes |
| Custom tab/dialog implementations | Use shadcn Dialog, Sheet, Tabs |
| Native `<select>` for styled dropdowns | shadcn Select |
| Mix icon libraries | Lucide only |
| Skip FormField wrapper | FormField + FormItem + FormLabel + FormControl |
| Ship custom components without tests | Co-locate Vitest tests per [testing](../testing/SKILL.md) skill |
