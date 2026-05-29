# Greek Sports Forum — Agent Guide

Instructions for AI coding agents working in this repository.

## Project overview

**greek-sports-forum** is an early-stage Greek sports community forum built as a full-stack Next.js application. The codebase currently has:

- A default landing page (`app/page.tsx`)
- PostgreSQL persistence via Drizzle ORM
- Authentication scaffolding with Better Auth (email/password + GitHub OAuth)
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

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, shadcn/ui (`radix-nova`) |
| Language | TypeScript (strict) |
| Package manager | **pnpm** (not npm/yarn) |
| Node.js | 22.22.0 (see `.nvmrc`) |
| Database | PostgreSQL 16 (Docker) |
| ORM | Drizzle ORM + drizzle-kit |
| Auth | Better Auth with Drizzle adapter |
| Icons | Lucide React |

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

# Better Auth (generate a random secret for local dev)
BETTER_AUTH_SECRET=your-random-secret-at-least-32-chars
BETTER_AUTH_URL=http://localhost:3000

# Optional — GitHub OAuth (warns at build/runtime if missing)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Docker Compose defaults (`docker-compose.yml`):

- User: `kerkida`
- Password: `kerkida`
- Database: `kerkida_dev`
- Port: `5432`

---

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm start` | Run production server |
| `pnpm lint` | ESLint (Next.js core-web-vitals + TypeScript) |
| `pnpm db:generate` | Generate Drizzle migration from schema changes |
| `pnpm db:migrate` | Apply migrations |
| `pnpm db:push` | Push schema directly (dev/prototyping only) |
| `pnpm db:studio` | Open Drizzle Studio |

### Verification before finishing work

Run these when touching app code:

```bash
pnpm lint
pnpm build
```

Both must pass before claiming work is complete.

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
db/
  schema.ts             # Drizzle schema (auth tables today)
  migrations/           # Generated SQL migrations
  index.ts              # Drizzle client (pg Pool)
lib/
  auth.ts               # Better Auth server config
  auth-client.ts        # Better Auth React client
  utils.ts              # cn() helper for class merging
proxy.ts                # Route protection (Next.js 16 proxy convention)
drizzle.config.ts       # Drizzle Kit config
docker-compose.yml      # Local PostgreSQL
components.json         # shadcn/ui config
```

### Path aliases

Use `@/*` for imports (maps to project root):

```typescript
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

---

## Code conventions

### TypeScript

- Strict mode is enabled — avoid `any`; prefer proper types.
- Use `@/` path aliases; do not use relative imports that cross major boundaries when an alias exists.
- Server-only code (DB, auth config) belongs in `lib/` or `db/`, not in client components.

### React & Next.js

- Default to **Server Components** in `app/`. Add `"use client"` only when needed (hooks, browser APIs, client auth calls).
- Co-locate route-specific components under the route directory when they are not shared.
- Use `next/image` for images and `next/link` for internal navigation.

### Styling

- Tailwind CSS v4 with CSS variables defined in `app/globals.css`.
- Use semantic tokens (`bg-background`, `text-foreground`, `border-border`, etc.) instead of hard-coded colors where possible.
- Merge classes with `cn()` from `@/lib/utils`.
- Dark mode uses the `.dark` class variant (`@custom-variant dark` in globals.css).

### shadcn/ui

- Style: **radix-nova**, base color: **neutral**, RSC enabled.
- Add components via CLI — do not copy-paste from external sources:

```bash
pnpm dlx shadcn@latest add <component-name>
```

- Place shared UI in `components/ui/`.
- `components.json` aliases: `@/components`, `@/components/ui`, `@/lib/utils`, `@/hooks`.

### Database (Drizzle)

1. Edit `db/schema.ts`.
2. Run `pnpm db:generate` to create a migration.
3. Run `pnpm db:migrate` to apply it.
4. Use `pnpm db:push` only for quick local experiments — prefer migrations for anything that should be reproducible.

Access the database through `db` from `@/db/index.ts`. Schema and relations live in `@/db/schema`.

Current tables: `user`, `session`, `account`, `verification` (Better Auth).

### Database errors

Thin helpers in `lib/db/` — do **not** wrap the exported `db` client (Better Auth uses it directly).

| Helper | Use when |
| --- | --- |
| `runDbOrThrow(fn)` | RSC or routes where infra failure should hit `error.tsx` or a caught 500 |
| `runDbResult(fn, { onUnique, onFk })` | Server actions/forms where duplicate key or FK is expected |
| `notFound()` (Next.js) | Required row missing in RSC — empty query result is not a DB error |
| `ok` / `err` / `notFound()` / `conflict()` from `@/lib/db/result` | Building `Result` values |

Unexpected connection or SQL errors throw `DbError` from `@/lib/db/errors`. Constraint codes `23505` / `23503` map to `Result` errors via `runDbResult` (defaults to `conflict()` if handlers omitted).

### Authentication (Better Auth)

**Server** — import `auth` from `@/lib/auth`:

- Drizzle adapter with PostgreSQL
- Email/password enabled
- GitHub OAuth configured (requires env vars)

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

For design-heavy features (layouts, landing pages, component polish), read and follow:

`.cursor/skills/ui-ux-pro-max/SKILL.md`

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
4. **Verify** — run `pnpm lint` and `pnpm build`.
5. **Database changes** — always generate and apply migrations; update `db/schema.ts` first.
6. **New UI primitives** — use shadcn CLI; extend existing components before creating duplicates.
7. **Auth-sensitive routes** — update `proxy.ts` matcher when protecting new paths.

### Avoid

- Adding `middleware.ts` (use `proxy.ts`)
- Using npm/yarn when pnpm is the project standard
- Hand-rolling shadcn components or bypassing `cn()`
- Raw SQL outside Drizzle migrations unless explicitly required
- Committing generated secrets or `.env.local`
- Assuming Next.js 14/15 patterns without checking `node_modules/next/dist/docs/`

---

## Related files

- `CLAUDE.md` — points to this file (`@AGENTS.md`)
- `README.md` — generic create-next-app readme (not project-specific yet)
- `components.json` — shadcn/ui configuration
- `docker-compose.yml` — local PostgreSQL service
