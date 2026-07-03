# Page spec template

Copy this file when adding a new page type. Replace `{placeholders}`.

---

## Route

- **Pattern:** `/example/{slug}`
- **Example:** `/example/foo-bar`

## Page type id

`example-page`

## Indexable

- **Index:** yes | no
- **Robots:** `index, follow` | `noindex, follow` | `noindex, nofollow`

## Title

- **Pattern:** `{dynamic} | ΚΕΡΚΙΔΑ` or use default only
- **Example:** `Example title | ΚΕΡΚΙΔΑ`
- **Max length:** ~60 chars

## Description

- **Pattern:** Greek description with `{placeholders}`
- **Example:** `…`
- **Max length:** ~160 chars

## Canonical

- **Rule:** `absoluteUrl('/example/{slug}')` or static path

## Open Graph / Twitter

| Field    | Value                        |
| -------- | ---------------------------- |
| `type`   | `website` \| `article`       |
| `image`  | `/og/default.png` or dynamic |
| `locale` | `el_GR`                      |

## JSON-LD

| @type          | Template                                                             |
| -------------- | -------------------------------------------------------------------- |
| WebPage        | [`../json-ld/web-page.json`](../json-ld/web-page.json)               |
| BreadcrumbList | [`../json-ld/breadcrumb-list.json`](../json-ld/breadcrumb-list.json) |

## Breadcrumbs (Greek labels)

1. Αρχική → `/`
2. …

## Sitemap

| Include | changefreq | priority | lastModified      |
| ------- | ---------- | -------- | ----------------- |
| yes/no  | daily      | 0.8      | static / DB field |

## Internal links

- Nav: …
- Footer: …

## Implementation checklist

- [ ] Spec file complete
- [ ] `generateMetadata` via `buildPageMetadata()` or dedicated builder
- [ ] `notFound()` in `generateMetadata` when the page 404s (no fallback metadata)
- [ ] `<JsonLd />` with schemas from spec
- [ ] Entry in `app/sitemap.ts` if indexable
- [ ] E2e or unit test for title/canonical
- [ ] `seo/urls.md` updated
