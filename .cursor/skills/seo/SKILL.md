---
name: seo
description: >-
  SEO for Greek Sports Forum — URLs, metadata, JSON-LD, sitemap, robots.
  Use when adding routes, pages, metadata, Open Graph, canonical URLs,
  structured data, or sitemap/robots changes.
---

# SEO (ΚΕΡΚΙΔΑ)

## Read first

Follow the order in [`seo/README.md`](../../../seo/README.md):

1. `seo/README.md`
2. `seo/urls.md`
3. `seo/globals.md`
4. `seo/pages/{page-type}.md` (copy from `seo/pages/_template.md` if missing)
5. `seo/indexing.md`
6. `seo/json-ld/`
7. `seo/security-and-referrers.md`

## Implementation

| Task                | Location                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------- |
| Site URL / defaults | `lib/seo/site.ts` (technical); Greek strings in `lib/copy/seo.ts`                             |
| Page metadata       | `lib/seo/metadata.ts` — `buildPageMetadata()`, `buildHomeMetadata()`, `buildThreadMetadata()` |
| Copy helpers        | `lib/copy/format.ts` — `pageTitle()`                                                          |
| Path helpers        | `lib/seo/paths.ts`                                                                            |
| Thread slugs        | `lib/seo/slug.ts` — `slugify()`                                                               |
| JSON-LD builders    | `lib/seo/json-ld.ts`                                                                          |
| Script tag          | `components/seo/json-ld.tsx`                                                                  |
| robots.txt          | `app/robots.ts`                                                                               |
| sitemap.xml         | `app/sitemap.ts`                                                                              |

## New route checklist

1. Spec file in `seo/pages/{type}.md`
2. URL in `seo/urls.md`
3. `export const metadata` or `generateMetadata` via builders
4. `<JsonLd />` matching spec
5. Sitemap entry if indexable
6. Vitest for builder logic; e2e for title/canonical when touching pages

## Language

- URL slugs: English Latin
- Titles, descriptions, OG text: Greek
- `html lang="el"`

## Verification

```bash
pnpm test
pnpm build
```

- View source: canonical link + JSON-LD `@graph`
- `/robots.txt` and `/sitemap.xml` reachable
- Google Rich Results Test on home (when deployed)
