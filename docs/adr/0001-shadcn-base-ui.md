# 0001: Move shadcn/ui primitives from Radix to Base UI

- **Status:** Accepted
- **Date:** 2026-11-19

## Context

`components/ui` uses the shadcn `radix-nova` style (`radix-ui` package). shadcn now ships a `base-nova` style built on Base UI (`@base-ui/react`), with the same visual design and class names.

The ΚΕΡΚΙΔΑ redesign is about to add and replace most primitives (REFACTOR-PLAN Phase 2, PRs 7–12), and the handoff code in `docs/design/handoff/` is written against Radix (`asChild`). Switching later would mean porting every new primitive and call site twice.

Today's surface is small: 14 files in `components/ui`, about 30 `asChild` call sites, and 8 `onOpenChange`/`onValueChange` handlers in 3 files.

## Decision

Switch `components.json` to `style: "base-nova"` before Phase 2, regenerate the existing primitives with the shadcn CLI, and migrate call sites in the same PR (REFACTOR-PLAN row 6c). From then on, all new primitives are added as `base-nova`, and handoff code is converted when ported.

Main API differences to apply at call sites:

| Radix                                                               | Base UI                                                                                                   |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `asChild`                                                           | `render={<Child />}`; add `nativeButton={false}` when a button renders a link or other non-button element |
| `onOpenChange(open)` / `onValueChange(value)`                       | Same names; a second `eventDetails` argument is added                                                     |
| `onEscapeKeyDown`, `onPointerDownOutside`, `event.preventDefault()` | `onOpenChange` + `eventDetails.reason` + `eventDetails.cancel()`                                          |
| `data-[state=open]` / `data-[state=closed]` selectors               | `data-open` / `data-closed`                                                                               |
| Tabs `Trigger` / `Content`                                          | `Tab` / `Panel`                                                                                           |
| `forceMount`                                                        | `keepMounted` on `Portal`                                                                                 |

## Consequences

- **Good:** one primitive library going forward; no double port of the handoff; Base UI's `render` prop and state callbacks replace Slot workarounds.
- **Cost:** one migration PR before Phase 2. Generated `components/ui` files are excluded from the 200-line count; the call-site migration is counted.
- **Ongoing:** handoff components must be converted when ported (`asChild` → `render`, Tabs part names, `data-open`). `radix-ui` is removed from `package.json` once nothing imports it.
- **Docs to update in the switch PR:** `AGENTS.md` (stack table, Modern Web Guidance precedence), `design-system/kerkida/MASTER.md` and `COMPONENTS.md` (`radix-nova` mentions, "Radix Tabs"), `.cursor/skills/shadcn-ui/SKILL.md`.
