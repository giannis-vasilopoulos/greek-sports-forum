# Security, referrers, external links

## HTTP Referrer-Policy

| Header            | Value                             |
| ----------------- | --------------------------------- |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |

Set in [`next.config.ts`](../next.config.ts) `headers()`.

## External links

All `target="_blank"` links (footer social, outbound):

```html
rel="noopener noreferrer"
```

Update [`components/layout/footer.tsx`](../components/layout/footer.tsx) when touching social links.

## Canonical / hreflang

- Single locale (`el`); no `hreflang` alternates until a second locale ships
- `html lang="el"` on root layout

## Open Graph / Twitter

- Always absolute URLs via `metadataBase`
- Never ship relative OG image URLs in production metadata
- Social handles TBD — placeholder `@kerkida` in globals

## Optional (future)

- Content-Security-Policy — not configured yet
- `Permissions-Policy` — not configured yet
