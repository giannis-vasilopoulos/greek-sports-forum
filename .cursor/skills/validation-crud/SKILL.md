---
name: validation-crud
description: >-
  Drizzle-zod validation for CRUD on pgTable rows — insert/update schemas,
  lib/validation/db, Greek copy, coercion. Use when adding or changing server
  actions, API routes, or forms that create/update forum/profile rows, or when
  adding lib/validation/db files.
---

# CRUD validation (drizzle-zod)

## When required

Any new **create** or **update** of a row in [`db/schema/`](../../../db/schema/) (threads, posts, profile edits, etc.) **must** use `drizzle-zod@0.7.x` with Zod 3. Do not hand-write a `z.object` that mirrors column names on the `pgTable`.

## Layout

| Layer          | Path                           | Role                                                                        |
| -------------- | ------------------------------ | --------------------------------------------------------------------------- |
| Generated base | `lib/validation/db/<table>.ts` | `createInsertSchema` / `createUpdateSchema` from matching table             |
| Public API     | `lib/validation/<domain>.ts`   | `.pick()` / `.omit()` fields the client may send; export input/output types |
| DB schema      | `db/schema/*.ts`               | Drizzle only — **never** import Zod or `copy` here                          |

## Column overrides

- Greek messages: [`lib/copy/validation.ts`](../../../lib/copy/validation.ts) via `copy.validation` (add keys there when needed).
- Form IDs: use `z.coerce.number` with `invalid_type_error` — HTML forms send strings.
- Stricter than DB: refinements on generated fields (trim, min length, enums) in the second argument to `createInsertSchema` / `createUpdateSchema`.

## Reuse one schema everywhere

- Server actions / API routes: `safeParse` or [`lib/validation/parse.ts`](../../../lib/validation/parse.ts) (`safeParseInput`, `parseFormData`, `zodFieldErrors`).
- Client forms: `react-hook-form` + `zodResolver` against the **same** exported schema.
- Never trust the client — always parse on the server.

## Workflow

1. Change [`db/schema/`](../../../db/schema/) → `pnpm db:generate` → `pnpm db:migrate`
2. Add or extend `lib/validation/db/<table>.ts`
3. Export public shape from `lib/validation/<domain>.ts`
4. Wire action + form + Vitest under `__tests__/lib/validation/`

## Tests

Mirror domain validation in `__tests__/lib/validation/`. Assert at least:

- String coercion for numeric IDs from forms
- Trim / min-length behavior
- Greek error messages for invalid input

## Exceptions (hand-written Zod only)

- Sign-in / sign-up: [`lib/validation/fields.ts`](../../../lib/validation/fields.ts), [`lib/validation/auth.ts`](../../../lib/validation/auth.ts)
- Better Auth–internal tables: `session`, `account`, `verification`
- Cron routes and seed scripts
- Cross-table or authorization checks in actions **after** Zod passes (e.g. team belongs to league)

## Reference (pilot)

- [`lib/validation/db/fan-profiles.ts`](../../../lib/validation/db/fan-profiles.ts) — `createInsertSchema` + overrides
- [`lib/validation/profiles.ts`](../../../lib/validation/profiles.ts) — `.pick({ leagueId, favoriteTeamId, displayName })`

## Avoid

- Hand-rolling `z.object({ ... })` for CRUD input that mirrors a `pgTable`
- Duplicating column lists between validation and insert `.values()` without a shared generated base

## Future

On Drizzle ORM v1 stable: replace `from "drizzle-zod"` with `from "drizzle-orm/zod"` and remove the `drizzle-zod` package. Keep the `lib/validation/db/*` layout.
