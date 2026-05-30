# SEO — ΚΕΡΚΙΔΑ

> **LOGIC:** When building or changing a route (`app/**/page.tsx`), read files in this order:
>
> 1. `seo/README.md` (this file)
> 2. `seo/urls.md` — confirm or register the URL
> 3. `seo/globals.md` — defaults
> 4. `seo/pages/[page-type].md` — **overrides globals**; create from `_template.md` if missing
> 5. `seo/indexing.md` — robots / sitemap
> 6. `seo/json-ld/` — schemas listed in the page spec
> 7. `seo/security-and-referrers.md` — when page has outbound links
>
> Do not ship a page without `generateMetadata` + JSON-LD matching the spec.

---

**Project:** ΚΕΡΚΙΔΑ (Greek Sports Forum)  
**Locale:** `el` / `el_GR` (single locale; no `hreflang` yet)  
**URL slugs:** English Latin (paths); Greek in titles/descriptions/UI  
**Implementation:** [`lib/seo/`](../lib/seo/) + [`components/seo/`](../components/seo/)

## Environment

| Variable                | Required                                          | Purpose                          |
| ----------------------- | ------------------------------------------------- | -------------------------------- |
| `NEXT_PUBLIC_SITE_URL`  | Prod yes; dev defaults to `http://localhost:3000` | Canonical base, OG URLs, sitemap |
| `NEXT_PUBLIC_SITE_NAME` | Optional                                          | Defaults to `ΚΕΡΚΙΔΑ`            |

## Page type → spec file

| Route pattern                         | Page type id       | Spec                                                 |
| ------------------------------------- | ------------------ | ---------------------------------------------------- |
| `/`                                   | `home`             | [`pages/home.md`](pages/home.md)                     |
| `/leagues`                            | `leagues-index`    | [`pages/leagues-index.md`](pages/leagues-index.md)   |
| `/leagues/{slug}`                     | `league-hub`       | [`pages/league-hub.md`](pages/league-hub.md)         |
| `/leagues/{slug}/threads`             | `league-threads`   | [`pages/league-threads.md`](pages/league-threads.md) |
| `/leagues/{slug}/threads/{id}-{slug}` | `thread`           | [`pages/thread.md`](pages/thread.md)                 |
| `/leagues/{slug}/teams/{team-slug}`   | `team`             | [`pages/team.md`](pages/team.md)                     |
| `/match-threads`                      | `match-threads`    | [`pages/match-threads.md`](pages/match-threads.md)   |
| `/standings`                          | `standings`        | [`pages/standings.md`](pages/standings.md)           |
| `/leagues/{slug}/standings`           | `league-standings` | [`pages/standings.md`](pages/standings.md)           |
| `/members`                            | `members-index`    | [`pages/member.md`](pages/member.md)                 |
| `/members/{username}`                 | `member`           | [`pages/member.md`](pages/member.md)                 |
| `/about`                              | `about`            | [`pages/about.md`](pages/about.md)                   |
| `/terms`                              | `terms`            | [`pages/terms.md`](pages/terms.md)                   |
| `/privacy`                            | `privacy`          | [`pages/privacy.md`](pages/privacy.md)               |
| `/contact`                            | `contact`          | [`pages/contact.md`](pages/contact.md)               |
| `/sign-in`                            | `sign-in`          | [`pages/sign-in.md`](pages/sign-in.md)               |
| `/sign-up`                            | `sign-up`          | [`pages/sign-up.md`](pages/sign-up.md)               |
| `/profile`                            | `profile`          | [`pages/profile.md`](pages/profile.md)               |
| `/settings`                           | `settings`         | [`pages/settings.md`](pages/settings.md)             |
| `/fan-profiles`                       | `fan-profiles`     | [`pages/profile.md`](pages/profile.md)               |
| `/notifications`                      | `notifications`    | [`pages/notifications.md`](pages/notifications.md)   |
| `/dashboard`                          | `dashboard`        | [`pages/profile.md`](pages/profile.md)               |

## Related docs

- [`urls.md`](urls.md) — URL taxonomy and redirects
- [`globals.md`](globals.md) — site-wide metadata defaults
- [`indexing.md`](indexing.md) — robots, sitemap, noindex matrix
- [`security-and-referrers.md`](security-and-referrers.md) — Referrer-Policy, external links
- [`pages/README.md`](pages/README.md) — how to add a new page spec
- [`json-ld/README.md`](json-ld/README.md) — structured data templates

## Code map

| File                         | Role                                                |
| ---------------------------- | --------------------------------------------------- |
| `lib/seo/site.ts`            | `getSiteUrl()`, `SITE_NAME`, `absoluteUrl()`        |
| `lib/seo/metadata.ts`        | `buildPageMetadata()`, robots presets               |
| `lib/seo/json-ld.ts`         | Schema builders                                     |
| `lib/seo/paths.ts`           | Canonical path helpers (`threadPath`, `leaguePath`) |
| `lib/seo/slug.ts`            | `slugify()` for thread titles                       |
| `components/seo/json-ld.tsx` | Renders JSON-LD script tag                          |
| `app/robots.ts`              | robots.txt                                          |
| `app/sitemap.ts`             | sitemap.xml                                         |
