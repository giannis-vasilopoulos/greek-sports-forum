# Home

## Route

- **Pattern:** `/`
- **Example:** `/`

## Page type id

`home`

## Indexable

- **Index:** yes
- **Robots:** `index, follow`

## Title

- **Default only:** `ΚΕΡΚΙΔΑ — Greek Sports Forum` (via `title.default`, not template)

## Description

`Η κερκίδα σου για κάθε πρωτάθλημα — συζητήσεις, match threads και ζωντανή κοινότητα αθλητικών φίλων.`

## Canonical

`absoluteUrl('/')`

## Open Graph / Twitter

| Field   | Value             |
| ------- | ----------------- |
| `type`  | `website`         |
| `image` | `/og/default.png` |

## JSON-LD

| @type        | Template                                                       |
| ------------ | -------------------------------------------------------------- |
| WebSite      | [`../json-ld/website.json`](../json-ld/website.json)           |
| Organization | [`../json-ld/organization.json`](../json-ld/organization.json) |
| WebPage      | [`../json-ld/web-page.json`](../json-ld/web-page.json)         |
| ItemList     | Top thread rows on home feed (optional, via `buildHomeJsonLd`) |

Use `@graph` via `buildHomeJsonLd()`.

## Breadcrumbs

None (home is root).

## Sitemap

| Include | changefreq | priority | lastModified |
| ------- | ---------- | -------- | ------------ |
| yes     | daily      | 1.0      | build time   |

## Internal links

- Header: `/sign-up`, `/sign-in` (guests)
- Thread rows: `/leagues/{slug}/threads/{id}-{slug}`
- League nav: `/leagues/{slug}`
- Standings sidebar: `/standings`

## Implementation

- Spec comment: `/** SEO spec: seo/pages/home.md */`
- Builder: `buildHomeMetadata()`, `buildHomeJsonLd({ threadTitles, threadPaths })`
