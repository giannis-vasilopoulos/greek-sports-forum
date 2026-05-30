# URL taxonomy

English Latin slugs in paths. Greek in UI and metadata titles/descriptions.

## Public — indexable

| URL                                   | Page type        | Example                                              |
| ------------------------------------- | ---------------- | ---------------------------------------------------- |
| `/`                                   | home             | `/`                                                  |
| `/leagues`                            | leagues-index    | `/leagues`                                           |
| `/leagues/{slug}`                     | league-hub       | `/leagues/super-league`                              |
| `/leagues/{slug}/threads`             | league-threads   | `/leagues/super-league/threads`                      |
| `/leagues/{slug}/threads/{id}-{slug}` | thread           | `/leagues/super-league/threads/42-panathinaikos-aek` |
| `/leagues/{slug}/teams/{team-slug}`   | team             | `/leagues/super-league/teams/panathinaikos`          |
| `/match-threads`                      | match-threads    | `/match-threads`                                     |
| `/standings`                          | standings        | `/standings`                                         |
| `/leagues/{slug}/standings`           | league-standings | `/leagues/super-league/standings`                    |
| `/members`                            | members-index    | `/members`                                           |
| `/members/{username}`                 | member           | `/members/nikos_13`                                  |

### League slugs (DB canonical — `db/seed.ts`)

`super-league`, `champions-league`, `premier-league`, `la-liga`, `bundesliga`, `serie-a`, `euroleague`, `nba`, `basket-league`, `world-cup`, `euro`

Nav/footer may show a curated subset (`components/layout/site-data.ts`).

## Legal — indexable (low priority)

| URL        |
| ---------- |
| `/about`   |
| `/terms`   |
| `/privacy` |
| `/contact` |

## Auth — noindex, follow

| URL        |
| ---------- |
| `/sign-in` |
| `/sign-up` |

## Private — noindex, nofollow

| URL              |
| ---------------- |
| `/dashboard`     |
| `/profile`       |
| `/settings`      |
| `/fan-profiles`  |
| `/notifications` |

## Disallow (robots.txt)

| Path    |
| ------- |
| `/api/` |

## Redirect rules

| Rule                   | Action                                                            |
| ---------------------- | ----------------------------------------------------------------- |
| Trailing slash         | 301 `/path/` → `/path` (Next.js default: no trailing slash)       |
| Thread title change    | 301 `.../threads/{id}-{old-slug}` → `.../threads/{id}-{new-slug}` |
| WWW vs apex            | TBD when domain is chosen; 301 non-canonical host                 |
| Deprecated `/forums/*` | 301 to new hierarchy if ever introduced                           |

## Query parameters

| Page             | Params                | Canonical                                            |
| ---------------- | --------------------- | ---------------------------------------------------- |
| List pages       | `?page=2`             | Self-canonical per page; page 1 omits `?page=`       |
| `/match-threads` | `?league=`, `?live=1` | Strip tracking params; canonical to path without UTM |

## Hierarchy

```
/ → /leagues → /leagues/{slug} → /leagues/{slug}/threads → /leagues/{slug}/threads/{id}-{slug}
              → /leagues/{slug}/standings
              → /leagues/{slug}/teams/{team-slug}
/ → /match-threads → (links to thread URLs)
/ → /standings
/ → /members → /members/{username}
```
