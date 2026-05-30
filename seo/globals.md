# Global metadata defaults

Applied via [`app/layout.tsx`](../app/layout.tsx) and overridden per route in `seo/pages/*.md`.

## Environment

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # production: https://your-domain
NEXT_PUBLIC_SITE_NAME=ΚΕΡΚΙΔΑ
```

## Root `Metadata` (Next.js)

| Field                  | Value                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| `metadataBase`         | `new URL(NEXT_PUBLIC_SITE_URL)`                                                                        |
| `title.default`        | `ΚΕΡΚΙΔΑ — Greek Sports Forum`                                                                         |
| `title.template`       | `%s \| ΚΕΡΚΙΔΑ`                                                                                        |
| `description`          | `Η κερκίδα σου για κάθε πρωτάθλημα — συζητήσεις, match threads και ζωντανή κοινότητα αθλητικών φίλων.` |
| `openGraph.locale`     | `el_GR`                                                                                                |
| `openGraph.type`       | `website` (default)                                                                                    |
| `openGraph.siteName`   | `ΚΕΡΚΙΔΑ`                                                                                              |
| `openGraph.images`     | `/og/default.png` (1200×630 — add asset before prod)                                                   |
| `twitter.card`         | `summary_large_image`                                                                                  |
| `twitter.site`         | `@kerkida` (placeholder)                                                                               |
| `robots`               | `{ index: true, follow: true }`                                                                        |
| `alternates.canonical` | Per-route via `buildPageMetadata()`                                                                    |

## Language rules

| Layer                                            | Language      |
| ------------------------------------------------ | ------------- |
| URL paths / slugs                                | English Latin |
| `<title>`, `description`, OG text                | Greek         |
| JSON-LD `name` / `description` where user-facing | Greek         |
| Code identifiers                                 | English       |

## Icons (documented paths)

| Asset              | Path                    |
| ------------------ | ----------------------- |
| Favicon            | `/favicon.ico`          |
| Apple touch        | `/apple-touch-icon.png` |
| OG default         | `/og/default.png`       |
| Org logo (JSON-LD) | `/og/logo.png`          |

## Per-page overrides

Each `seo/pages/*.md` may override: title, description, robots, canonical, OG type/image, JSON-LD types.

Use [`lib/seo/metadata.ts`](../lib/seo/metadata.ts) builders — do not hardcode strings in page files.
