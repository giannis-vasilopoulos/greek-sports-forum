# Greek Sports Forum — Agent Guide

Instructions for AI coding agents working in this repository.

## Project overview

**greek-sports-forum** is an early-stage Greek sports community forum built as a full-stack Next.js application. The codebase currently has:

- A default landing page (`app/page.tsx`)
- PostgreSQL persistence via Drizzle ORM
- Authentication scaffolding with Better Auth (email/password + Google OAuth)
- shadcn/ui components (Radix Nova style) on Tailwind CSS v4
- Route protection via `proxy.ts` for `/dashboard` (route not yet implemented)

Prefer minimal, focused changes. Match existing patterns before introducing new abstractions.

---

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Key Next.js 16 specifics for this repo:

- **App Router only** — do not add Pages Router files (`pages/`).
- **`proxy.ts` replaces `middleware.ts`** — use root-level `proxy.ts` for request interception. The build output labels this as "Proxy (Middleware)".
- **Consult bundled docs before changing routing, caching, data fetching, or navigation behavior.** Several guides include agent hints (search for `AI agent hint` in `node_modules/next/dist/docs/`).
- **Instant navigations:** Suspense/loading UI alone may not be enough; some routes need `unstable_instant` exports. See `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.mdx`.
<!-- END:nextjs-agent-rules -->

---

## Tech stack

| Layer           | Choice                                              |
| --------------- | --------------------------------------------------- |
| Framework       | Next.js 16 (App Router)                             |
| UI              | React 19, Tailwind CSS v4, shadcn/ui (`radix-nova`) |
| Language        | TypeScript (strict)                                 |
| Package manager | **pnpm** (not npm/yarn)                             |
| Node.js         | 22.22.0 (see `.nvmrc`)                              |
| Database        | PostgreSQL 16 (Docker)                              |
| ORM             | Drizzle ORM + drizzle-kit                           |
| Auth            | Better Auth with Drizzle adapter                    |
| Icons           | Lucide React                                        |

---

## Setup

### Prerequisites

- Node.js 22.22.0 (`nvm use` reads `.nvmrc`)
- pnpm
- Docker (for local PostgreSQL)

### First-time setup

```bash
# Install dependencies
pnpm install

# Start PostgreSQL
docker compose up -d

# Create .env.local (see Environment variables below)
cp .env.example .env.local  # if .env.example exists; otherwise create manually

# Apply database migrations
pnpm db:migrate

# Start dev server
pnpm dev
```

Dev server: [http://localhost:3000](http://localhost:3000)

### Environment variables

Create `.env.local` in the project root (never commit secrets):

```bash
# Required
DATABASE_URL=postgresql://kerkida:kerkida@localhost:5432/kerkida_dev

# SEO — canonical base for metadata, Open Graph, sitemap (required in production)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=ΚΕΡΚΙΔΑ

# Better Auth (generate a random secret for local dev)
BETTER_AUTH_SECRET=your-random-secret-at-least-32-chars
BETTER_AUTH_URL=http://localhost:3000

# Optional — Google OAuth (warns at build/runtime if missing)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Optional — Google Analytics 4 (omit in dev to disable; Consent Mode gates storage)
NEXT_PUBLIC_GA4_ID=

# Optional — team/league logo CDN (Cloudflare R2). When unset, seed keeps provider hotlink URLs.
LOGO_MIRROR_ENABLED=true
LOGO_CDN_PUBLIC_URL=https://pub-xxxx.r2.dev
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=kerkida-logos
LOGO_MAX_EDGE_PX=64
LOGO_WEBP_QUALITY=85
```

Logos are normalized at ingest via `sharp` in `lib/logos/transform.ts` (WebP, max edge clamped 16–256). Re-run `pnpm db:seed` to refresh R2 objects and DB URLs after changing these settings.

Docker Compose defaults (`docker-compose.yml`):

- User: `kerkida`
- Password: `kerkida`
- Database: `kerkida_dev`
- Port: `5432`

---

## Commands

| Command                 | Purpose                                        |
| ----------------------- | ---------------------------------------------- |
| `pnpm dev`              | Start Next.js dev server                       |
| `pnpm build`            | Production build                               |
| `pnpm start`            | Run production server                          |
| `pnpm lint`             | ESLint (Next.js core-web-vitals + TypeScript)  |
| `pnpm typecheck`        | TypeScript check (`tsc --noEmit`)              |
| `pnpm format`           | Prettier write                                 |
| `pnpm format:check`     | Prettier check (CI)                            |
| `pnpm fallow:audit`     | PR-scope dead-code gate (same as CI)           |
| `pnpm fallow:dead-code` | Full-repo cleanup report (local)               |
| `pnpm fallow:health`    | Complexity / CRAP hotspots (local)             |
| `pnpm fallow:dupes`     | Code duplication scan (local, optional)        |
| `pnpm test`             | Run unit tests (Vitest)                        |
| `pnpm test:watch`       | Unit tests in watch mode                       |
| `pnpm test:e2e`         | Playwright e2e tests                           |
| `pnpm test:e2e:ui`      | Playwright UI mode                             |
| `pnpm db:generate`      | Generate Drizzle migration from schema changes |
| `pnpm db:migrate`       | Apply migrations                               |
| `pnpm db:push`          | Push schema directly (dev/prototyping only)    |
| `pnpm db:studio`        | Open Drizzle Studio                            |

### Git hooks

Husky runs on every commit:

| Hook       | Runs                                                   |
| ---------- | ------------------------------------------------------ |
| pre-commit | ESLint fix, Prettier write, typecheck (when TS staged) |
| commit-msg | commitlint (Conventional Commits)                      |

CI (`.github/workflows/ci.yml`) runs lint, typecheck, format check, fallow audit, unit tests, build, and e2e on every push to `main` and on pull requests.

### Verification before finishing work

Run these when touching app code:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

All four must pass before claiming work is complete. Run `pnpm fallow:audit` when touching `lib/`, `db/`, or `components/` outside `components/ui/`. Run `pnpm test:e2e` when the change touches pages, auth, or full request flows (requires Docker Postgres and `.env.local`). One-time Playwright browser install: `pnpm exec playwright install`.

---

## Project structure

```
app/                    # Next.js App Router (routes, layouts, API routes)
  api/auth/[...all]/    # Better Auth handler
  globals.css           # Tailwind v4 + shadcn theme tokens
  layout.tsx            # Root layout (Geist fonts)
  page.tsx              # Home page
components/
  ui/                   # shadcn/ui primitives (add via CLI, don't hand-roll)
hooks/
  thread/               # Thread hooks (use-reply-draft, use-reply-target, …)
  profile/              # Profile hooks
  ads/                  # Consent / ad hooks
  layout/               # Layout hooks (e.g. bottom chrome)
db/
  schema.ts             # Drizzle schema (auth tables today)
  migrations/           # Generated SQL migrations
  index.ts              # Drizzle client (pg Pool)
lib/
  auth.ts               # Better Auth server config
  auth-client.ts        # Better Auth React client
  utils.ts              # cn() helper for class merging
proxy.ts                # Route protection (Next.js 16 proxy convention)
vitest.config.ts        # Vitest unit test config
playwright.config.ts    # Playwright e2e config
e2e/                    # Feature-scoped Playwright specs
drizzle.config.ts       # Drizzle Kit config
docker-compose.yml      # Local PostgreSQL
components.json         # shadcn/ui config
seo/                    # SEO specs (URLs, metadata, JSON-LD) — read before new routes
```

### Path aliases

Use `@/*` for imports (maps to project root):

```typescript
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useReplyDraft } from "@/hooks/thread/use-reply-draft";
import { cn } from "@/lib/utils";
```

---

## Code conventions

### File size

- Production `.ts` / `.tsx` files are capped at **300 lines** (ESLint `max-lines`, blank lines and comments excluded).
- Exempt: `components/ui/**`, `__tests__/**`, `e2e/**`, `db/seed/**`, `db/seed.ts`.
- When a file approaches the limit, split by feature (submodules with barrel re-exports under `lib/`, co-located subcomponents under `components/`).

### React hooks

- All React hooks live under `hooks/<feature>/use-*.ts` (import via `@/hooks/...`).
- Add `"use client"` when the hook uses browser APIs or React client features.
- Do not define or export `use*` hooks from `components/` or `lib/` — keep those modules UI or server logic only.

### TypeScript

- Strict mode is enabled — avoid `any`; prefer proper types.
- Use `@/` path aliases; do not use relative imports that cross major boundaries when an alias exists.
- Server-only code (DB, auth config) belongs in `lib/` or `db/`, not in client components.

### React & Next.js

- Default to **Server Components** in `app/`. Add `"use client"` only when needed (hooks, browser APIs, client auth calls).
- Co-locate route-specific components under the route directory when they are not shared.
- Use `next/image` for images and `next/link` for internal navigation.

### Copy & language

- All user-facing text in the frontend must be in **Greek** — labels, headings, buttons, links, placeholders, validation and error messages, empty states, toasts, and accessible names (`aria-label`, `title`, etc.).
- Product Greek copy lives in [`lib/copy/`](lib/copy/) — import `copy` from `@/lib/copy` (`copy.auth`, `copy.validation`, `copy.seo`, `copy.layout`, `copy.feed`, `copy.ads`, `copy.forum`, `copy.moderation`, `copy.common`). Helpers: `pageTitle`, `formatReplyCount` from `@/lib/copy`.
- **Do not** move strings from mock/demo/seed files (`*-mock-data.ts`, `db/seed/*`) or long legal body copy in [`app/privacy/page.tsx`](app/privacy/page.tsx) into `lib/copy/`.
- Keep code identifiers, comments, commit messages, and server-side logs in English unless a task says otherwise.

### Styling

Follow `.cursor/skills/tailwind-styling/SKILL.md` for Tailwind v4, tokens, and dark mode.

### shadcn/ui

Follow `.cursor/skills/shadcn-ui/SKILL.md` for adding and extending components.

### Testing

Follow `.cursor/skills/testing/SKILL.md` for Vitest unit tests and Playwright e2e tests.

- Place unit tests under `__tests__/`, mirroring source paths: `lib/bar.ts` → `__tests__/lib/bar.test.ts`, `components/foo.tsx` → `__tests__/components/foo.test.tsx`
- Organize e2e by feature: `e2e/<feature>/<feature>.spec.ts`
- Skip tests for unmodified shadcn `components/ui/*` primitives

### Database (Drizzle)

1. Edit `db/schema.ts`.
2. Run `pnpm db:generate` to create a migration.
3. Run `pnpm db:migrate` to apply it.
4. Use `pnpm db:push` only for quick local experiments — prefer migrations for anything that should be reproducible.

Access the database through `db` from `@/db/index.ts`. Schema and relations live in `@/db/schema`.

Current tables: `user`, `session`, `account`, `verification` (Better Auth).

### Database errors

Thin helpers in `lib/db/` — do **not** wrap the exported `db` client (Better Auth uses it directly).

| Helper                                                            | Use when                                                                 |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `runDbOrThrow(fn)`                                                | RSC or routes where infra failure should hit `error.tsx` or a caught 500 |
| `runDbResult(fn, { onUnique, onFk })`                             | Server actions/forms where duplicate key or FK is expected               |
| `notFound()` (Next.js)                                            | Required row missing in RSC — empty query result is not a DB error       |
| `ok` / `err` / `notFound()` / `conflict()` from `@/lib/db/result` | Building `Result` values                                                 |

Unexpected connection or SQL errors throw `DbError` from `@/lib/db/errors`. Constraint codes `23505` / `23503` map to `Result` errors via `runDbResult` (defaults to `conflict()` if handlers omitted).

### Validation

- Define input rules in [`lib/validation/`](lib/validation/) (`fields.ts` for reusable username/password, domain files for composed schemas). Greek error messages come from [`lib/copy/validation.ts`](lib/copy/validation.ts) via `copy.validation`.
- For CRUD that inserts/updates Drizzle rows (threads, posts, profile edits), follow [`.cursor/skills/validation-crud/SKILL.md`](.cursor/skills/validation-crud/SKILL.md) — required `drizzle-zod` via `lib/validation/db/*`.
- **Keep hand-written** `lib/validation/fields.ts` and `lib/validation/auth.ts` for sign-in/sign-up (password complexity, full name, email policy) and Better Auth predicates — auth tables are wider/weaker than product rules.
- Client forms use **react-hook-form** + `zodResolver` against validation schemas; map Better Auth API errors in [`lib/auth/map-sign-up-error.ts`](lib/auth/map-sign-up-error.ts) where needed.
- **Better Auth** enforces auth boundaries via thin predicates (`isValidUsername`, `isValidPassword`) in [`lib/auth.ts`](lib/auth.ts) — do not duplicate regex inline in auth config.
- **Server actions** and custom API routes must `safeParse` with the same schema (never trust the client). Helpers: [`lib/validation/parse.ts`](lib/validation/parse.ts).
- Seed and e2e passwords used for sign-up must satisfy `passwordSchema` (e.g. `TestPass123!`).

### Authentication (Better Auth)

**Server** — import `auth` from `@/lib/auth`:

- Drizzle adapter with PostgreSQL
- Email/password enabled (min/max length + `hooks.before` password complexity)
- Username plugin (`usernameClient` on the client) with validators from `lib/validation/fields.ts`
- Google OAuth configured (requires env vars)

**Client** — import `authClient` from `@/lib/auth-client`:

```typescript
"use client";
import { authClient } from "@/lib/auth-client";
```

**API route** — `app/api/auth/[...all]/route.ts` exposes Better Auth endpoints via `toNextJsHandler`.

When adding auth UI or server session checks, follow [Better Auth docs](https://better-auth.com/docs).

### Route protection

Protected routes are configured in root `proxy.ts`:

```typescript
export const config = {
  matcher: ["/dashboard"],
};
```

Unauthenticated requests to matched paths redirect to `/sign-in`. Extend `matcher` when adding new protected areas; do **not** create `middleware.ts`.

---

## UI/UX work

For design-heavy features (layouts, landing pages, visual exploration), follow `.cursor/skills/ui-ux-pro-max/SKILL.md` after reading the styling and shadcn skills above.

That skill uses searchable design data and Python scripts under `.cursor/skills/ui-ux-pro-max/scripts/`.

---

## Git & commits

- Do not commit unless explicitly asked.
- Do not commit `.env*` files or secrets.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (commitlint-compatible):

```
<type>(<optional scope>): <subject>
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

Subject: imperative mood, lowercase, no trailing period.

---

## Agent workflow

1. **Read before writing** — inspect surrounding files and match conventions.
2. **Minimize scope** — smallest correct change; no drive-by refactors.
3. **Check Next.js docs** — for routing, caching, fetching, or navigation changes.
4. **Verify** — run `pnpm lint`, `pnpm test`, and `pnpm build`; run `pnpm test:e2e` for page/auth changes.
5. **Database changes** — always generate and apply migrations; update `db/schema.ts` first.
6. **New UI primitives** — use shadcn CLI; extend existing components before creating duplicates.
7. **Auth-sensitive routes** — update `proxy.ts` matcher when protecting new paths.
8. **Feature tests** — add Vitest tests under `__tests__/` (mirroring source paths) where behavior is non-trivial; add or update a Playwright spec under `e2e/<feature>/` per the testing skill.
9. **New or changed routes** — before `app/**/page.tsx`:
   - Read [`seo/README.md`](seo/README.md) and the page spec in `seo/pages/{type}.md` (create from `seo/pages/_template.md` if missing)
   - Register URL in [`seo/urls.md`](seo/urls.md) if new
   - Implement via `lib/seo/metadata.ts` + `components/seo/json-ld.tsx`; update `app/sitemap.ts` if indexable
   - For UI routes, also check `design-system/kerkida/pages/{page}.md`

### Avoid

- Adding `middleware.ts` (use `proxy.ts`)
- Using npm/yarn when pnpm is the project standard
- Hand-rolling shadcn components or bypassing `cn()`
- Raw SQL outside Drizzle migrations unless explicitly required
- Committing generated secrets or `.env.local`
- Assuming Next.js 14/15 patterns without checking `node_modules/next/dist/docs/`
- Shipping routes without SEO spec + `generateMetadata` + JSON-LD aligned to `seo/pages/*.md`
- Hardcoding titles/descriptions/canonicals in page files instead of `lib/seo/*` builders
- Hand-rolling `z.object` for CRUD input that mirrors a `pgTable` — use the [validation-crud skill](.cursor/skills/validation-crud/SKILL.md)

---

## Related files

- `CLAUDE.md` — points to this file (`@AGENTS.md`)
- `README.md` — generic create-next-app readme (not project-specific yet)
- `components.json` — shadcn/ui configuration
- `docker-compose.yml` — local PostgreSQL service
- `seo/` — SEO URL taxonomy, metadata, JSON-LD specs (read before adding routes)
