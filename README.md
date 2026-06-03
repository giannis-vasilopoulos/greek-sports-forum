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

`pnpm db:seed` requires `DATABASE_URL` and `SEED_ADMIN_*` / `SEED_USER_*` in `.env.local`, plus API keys for non-SLGR leagues where applicable. See [AGENTS.md](AGENTS.md) for setup.

**Standings** are not filled by seed — sync after seed (dev server running):

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/sync-standings
```

Optional demo forum data: `pnpm db:seed:mock-fixtures` (best on a fresh DB).

| Goal                         | Commands                                                              |
| ---------------------------- | --------------------------------------------------------------------- |
| Delete everything            | `docker compose down -v` → `docker compose up -d` → `pnpm db:migrate` |
| Seed users + leagues + teams | `pnpm db:seed`                                                        |
| Standings                    | `curl` to `/api/cron/sync-standings` with `CRON_SECRET`               |
| Demo threads (optional)      | `pnpm db:seed:mock-fixtures`                                          |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
