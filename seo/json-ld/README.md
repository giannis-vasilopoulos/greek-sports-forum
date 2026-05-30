# JSON-LD templates

Placeholders: `{SITE_URL}`, `{SITE_NAME}`, `{PAGE_URL}`, `{PAGE_NAME}`, `{PAGE_DESCRIPTION}`, `{DATE}`, etc.

Code fills placeholders in [`lib/seo/json-ld.ts`](../../lib/seo/json-ld.ts).

## Usage

| Page type  | Templates                                           |
| ---------- | --------------------------------------------------- |
| home       | organization, website, web-page                     |
| league hub | sports-organization, web-page, breadcrumb-list      |
| thread     | discussion-forum-posting, web-page, breadcrumb-list |
| lists      | item-list, web-page, breadcrumb-list                |
| team       | sports-team, web-page, breadcrumb-list              |
| legal      | web-page                                            |

Emit as `@graph` in a single `<script type="application/ld+json">`.

Validate with [Google Rich Results Test](https://search.google.com/test/rich-results).
