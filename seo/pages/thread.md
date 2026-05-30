# Thread detail

**Page type id:** `thread`  
**Route:** `/leagues/{slug}/threads/{id}-{slug}`  
**Indexable:** yes (`index, follow`)

**Title:** `{thread.title} | {league.name} | ΚΕΡΚΙΔΑ`  
**Description:** First ~155 chars of stripped first-post content  
**Canonical:** `/leagues/{league.slug}/threads/{id}-{slug}`  
**OG type:** `article`  
**OG image:** league logo or dynamic OG  
**JSON-LD:** DiscussionForumPosting, WebPage, BreadcrumbList  
**Sitemap:** yes; lastModified = `thread.lastActivityAt`  
**Redirect:** 301 on slug change, ID is lookup key

**Slug generation:** `lib/seo/slug.ts` — Latin titles slugify cleanly; Greek-only titles fall back to `thread` (use `{id}-thread` or add greeklish transliteration when creating threads)

**Builder:** `buildThreadMetadata()`, `buildThreadJsonLd()`
