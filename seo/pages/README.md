# Page specs

One markdown file per **page type** (not necessarily one file per route).

## Adding a new page

1. Register URL in [`../urls.md`](../urls.md)
2. Copy [`_template.md`](_template.md) → `{page-type}.md`
3. Fill every section — no implied defaults
4. Update [`../indexing.md`](../indexing.md) if indexable/noindex changes
5. Add JSON-LD templates under [`../json-ld/`](../json-ld/) if new `@type`s
6. Update [`../README.md`](../README.md) page-type map
7. Implement route with `lib/seo/metadata.ts` builders and JSON-LD per the spec
