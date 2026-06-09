This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Database reset and seed

There is no `db:reset` script. `pnpm db:seed` only **upserts** leagues, teams, and seed users — it does not remove forum threads, standings, or other data.

**Full wipe** (empty Postgres volume, re-migrate, seed):

```bash
docker compose down -v
docker compose up -d
pnpm db:migrate
pnpm db:seed
```

`pnpm db:seed` requires `DATABASE_URL` and `SEED_ADMIN_*` / `SEED_USER_*` in `.env.local`, plus API keys for non-SLGR leagues where applicable, and optional R2 vars for logo mirroring (see below). See [AGENTS.md](AGENTS.md) for full environment setup.

**Standings** are not filled by seed — sync after seed (dev server running):

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/sync-standings
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/sync-transfers
```

Optional demo forum data: `pnpm db:seed:mock-fixtures` (best on a fresh DB).

| Goal                         | Commands                                                                                                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Delete everything            | `docker compose down -v` → `docker compose up -d` → `pnpm db:migrate`                                                                                                                             |
| Seed users + leagues + teams | `pnpm db:seed`                                                                                                                                                                                    |
| Standings                    | `curl` to `/api/cron/sync-standings` with `CRON_SECRET`                                                                                                                                           |
| Transfers                    | `curl` to `/api/cron/sync-transfers` with `CRON_SECRET` (needs `API_SPORTS_KEY`; free tier uses season 2024 — set `API_SPORTS_FOOTBALL_SEASON=2025` on paid plans; full sync is slow ~10 req/min) |
| Demo threads (optional)      | `pnpm db:seed:mock-fixtures`                                                                                                                                                                      |
| Refresh team/league logos    | `pnpm db:seed` or `curl` to `/api/cron/sync-teams` with `CRON_SECRET`                                                                                                                             |

## Team and league logos (Cloudflare R2)

League and team crests are fetched from external APIs during `pnpm db:seed` (and `/api/cron/sync-teams`), optionally **mirrored** into [Cloudflare R2](https://developers.cloudflare.com/r2/), resized, and stored as **WebP** (SVG sources stay SVG). Public URLs are saved in Postgres (`leagues.logo_url`, `teams.logo_url`). The UI loads them via `next/image` ([`components/brand/entity-logo.tsx`](components/brand/entity-logo.tsx)) — browsers never call football-data, SLGR, etc. directly.

### Why `@aws-sdk/client-s3`?

We use **R2 for storage**, not Amazon S3. R2 exposes an **S3-compatible API** (same `PutObject` / bucket model). The AWS SDK is only a **client library** that talks to R2’s endpoint (`https://<accountId>.r2.cloudflarestorage.com`). See [`lib/logos/mirror.ts`](lib/logos/mirror.ts).

| Piece                 | Role                                                                             |
| --------------------- | -------------------------------------------------------------------------------- |
| Cloudflare R2         | Object storage + public delivery (`r2.dev` or custom domain)                     |
| `@aws-sdk/client-s3`  | Server-side uploads during seed/cron                                             |
| `LOGO_CDN_PUBLIC_URL` | Base URL saved in the DB and allowed in `next.config.ts` `images.remotePatterns` |

### One-time Cloudflare setup

1. Create an R2 bucket (e.g. `kerkida-logos`).
2. Enable **public access** (R2.dev subdomain) or attach a custom domain.
3. Create an API token with **Object Read & Write** for that bucket.

### Environment variables

Add to `.env.local` (also listed in [AGENTS.md](AGENTS.md)):

```bash
LOGO_MIRROR_ENABLED=true
LOGO_CDN_PUBLIC_URL=https://pub-xxxx.r2.dev
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=kerkida-logos
# Optional — ingest normalization (defaults: 64px max edge, WebP quality 85)
LOGO_MAX_EDGE_PX=64
LOGO_WEBP_QUALITY=85
```

- Set `LOGO_MIRROR_ENABLED=false` to skip uploads and keep provider hotlink URLs (local dev without R2).
- If R2 vars are missing, seed still runs; the UI falls back to emoji/letters when `logo_url` is empty.
- Transform logic: [`lib/logos/transform.ts`](lib/logos/transform.ts) (uses `sharp`).

### Refresh logos

Re-run seed after changing transform settings or migrating from older `.png` keys in R2:

```bash
pnpm db:seed
# or (dev server running):
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/sync-teams
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
