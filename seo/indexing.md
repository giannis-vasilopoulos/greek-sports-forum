# Indexing — robots, sitemap, canonical

## robots.txt (`app/robots.ts`)

| Rule     | Value                    |
| -------- | ------------------------ |
| Allow    | `/` (default)            |
| Disallow | `/api/`                  |
| Sitemap  | `{SITE_URL}/sitemap.xml` |

Private routes use HTML `robots` meta (noindex) — not robots.txt disallow — so logged-in users can still share direct links if needed.

## noindex matrix

| Route                                                                    | robots meta         |
| ------------------------------------------------------------------------ | ------------------- |
| Public content                                                           | `index, follow`     |
| `/sign-in`, `/sign-up`                                                   | `noindex, follow`   |
| `/dashboard`, `/profile`, `/settings`, `/fan-profiles`, `/notifications` | `noindex, nofollow` |

Implementation: `ROBOTS_INDEX`, `ROBOTS_NOINDEX_FOLLOW`, `ROBOTS_NOINDEX_NOFOLLOW` in `lib/seo/metadata.ts`.

## sitemap.xml (`app/sitemap.ts`)

### Static entries (always)

`/`, `/leagues`, `/match-threads`, `/standings`, `/about`, `/terms`, `/privacy`, `/contact`

| Path             | changefreq | priority |
| ---------------- | ---------- | -------- |
| `/`              | daily      | 1.0      |
| `/leagues`       | daily      | 0.9      |
| `/match-threads` | hourly     | 0.9      |
| `/standings`     | daily      | 0.8      |
| Legal pages      | monthly    | 0.3      |

### Dynamic entries (when DB available)

| Path                                  | Source                           | lastModified                  |
| ------------------------------------- | -------------------------------- | ----------------------------- |
| `/leagues/{slug}`                     | `league` where `isActive = true` | latest thread activity or now |
| `/leagues/{slug}/threads/{id}-{slug}` | public threads                   | `thread.lastActivityAt`       |
| `/members/{username}`                 | public profiles (future)         | profile update                |

Exclude locked threads from sitemap (policy: locked = still indexable if public URL; revisit when moderation rules ship).

### Pagination

| List   | Canonical                     |
| ------ | ----------------------------- |
| Page 1 | `/path` (no `?page=`)         |
| Page N | `/path?page=N` self-canonical |

## Canonical rules

- One canonical URL per indexable page
- Absolute URLs via `metadataBase` + `alternates.canonical`
- Strip UTM and referral query params on canonical
