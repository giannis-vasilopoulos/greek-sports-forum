---
name: testing
description: >-
  Vitest unit tests and Playwright e2e tests for Greek Sports Forum. Use when
  adding or changing features, UI components, server actions, lib helpers, or
  when the user asks for tests.
---

# Testing

Unit tests run with **Vitest** + React Testing Library. End-to-end tests run with **Playwright**.

## Commands

| Command            | Purpose                                      |
| ------------------ | -------------------------------------------- |
| `pnpm test`        | Run unit tests once                          |
| `pnpm test:watch`  | Unit tests in watch mode                     |
| `pnpm test:e2e`    | Playwright e2e (starts or reuses dev server) |
| `pnpm test:e2e:ui` | Playwright UI mode                           |

One-time Playwright browser install: `pnpm exec playwright install`

E2e requires PostgreSQL (`docker compose up -d`) and `.env.local`.

## Unit tests (Vitest)

### File placement

| Source                          | Test file                                      | When required                                                |
| ------------------------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| `lib/**/*.ts`                   | `__tests__/lib/**/*.test.ts` (mirrored path)   | Non-trivial pure logic, helpers, error mapping               |
| `components/**/*.tsx` (shared)  | `__tests__/components/**/*.test.tsx`           | Client components with state, interaction, or conditional UI |
| `app/<route>/_components/*.tsx` | `__tests__/app/<route>/_components/*.test.tsx` | Route-specific client components with isolatable behavior    |
| `components/ui/*` (shadcn CLI)  | skip                                           | Do not test unmodified shadcn primitives                     |

### What to unit-test in `components/`

- User interactions (click, type, submit) and resulting UI
- Props-driven branches (loading, error, empty states)
- Accessibility roles/labels for custom composites

### What not to unit-test with Vitest

- Async Server Components — use Playwright
- Full page layouts wired to DB — use Playwright

### Conventions

- Import explicitly: `import { describe, it, expect, vi } from "vitest"`
- Use `@testing-library/react` and `@testing-library/user-event` for client components
- Next.js mocks live in [`vitest.setup.ts`](../../../vitest.setup.ts) — extend there when new server APIs are needed

## E2E tests (Playwright)

Organize by **feature**, one folder per user-facing area:

```
e2e/
  home/
    home.spec.ts
  auth/
    sign-in.spec.ts
  dashboard/
    dashboard.spec.ts
```

- Name spec after the feature: `e2e/<feature>/<feature>.spec.ts`
- Add or extend the matching folder when shipping a feature — avoid monolithic specs
- Assert user-visible outcomes (headings, navigation, form errors), not implementation details
- Import `test` and `expect` from [`e2e/fixtures.ts`](../../../e2e/fixtures.ts), not `@playwright/test` — every spec gets an automatic **browser error guard** that fails on `pageerror` and `console.error` (see [`e2e/helpers/browser-errors.ts`](../../../e2e/helpers/browser-errors.ts))

```typescript
import { expect, test } from "@/e2e/fixtures";
```

Add regression coverage when a feature touches client-only state (`localStorage`, hydration-sensitive UI, effects). Example: thread draft restore in `e2e/thread/thread-detail.spec.ts`.

## Agent workflow

When implementing a feature:

1. Add Vitest tests under `__tests__/` (mirroring source paths) for logic in `lib/` and client components in `components/` (or route `_components/`) where behavior is non-trivial
2. Add or update a Playwright spec under `e2e/<feature>/` for the happy path and one meaningful edge case
3. Run `pnpm test`; run `pnpm test:e2e` when the feature touches pages, auth, or full request flows
