# Thread Detail Page Overrides

> **PROJECT:** ΚΕΡΚΙΔΑ
> **Page Type:** Thread detail / participation

> Rules here **override** `design-system/kerkida/MASTER.md` where noted.

---

## Layout

- **Shell:** `FeedShell` — left 168px · main flex-1 · right 200px
- **Main order:** Breadcrumb header → `ThreadTopAd` → desktop composer → post stream → `ThreadInContentAd` (after ~5 posts)
- **Mobile:** Collapsed sticky `ReplyComposer` fixed to bottom (placeholder + sign-in link); expands on tap, reply, or draft restore; main column `pb-20` collapsed / `pb-32` expanded; Cookies pill stacks above composer via `--bottom-chrome-height`

## Conversion

- Guests: full read + enabled composer; submit saves draft → sign-in redirect → restore on return
- Signed-in: sticky composer, Ctrl+Enter submit, reply-to quote strip
- Votes: compact vertical rail; guest vote → sign-in redirect

## Typography & color

- Thread title: 18px/500
- Post body: 13px/400
- Meta: 11px muted
- OP card: `bg-muted/20` rounded border
- Tokens: KERKIDA teal `primary`, live `destructive` pulse badge

## Components

- `ThreadHeader` — breadcrumb, badges, social proof (reply count + last activity)
- `PostCard` — vote rail + avatar + content + reply action; OP uses muted card; nested replies use cumulative indent + `border-l` (cap 6 × 12px); branch collapse control (`−` / `+`) on replies with children (depth ≥ 1) hides subtree client-side; OP has no collapse control
- `PostList` — OP rendered once; Reddit-style nested tree under OP; reply list always visible; only individual branches collapse; **default:** depth 1 expanded (full body), depth 2+ with children collapsed (hidden-count summary); user can toggle any branch with children
- `PostList` best-first — when top-level replies exceed 12, show top 12 by score with helper line + «Εμφάνιση όλων των απαντήσεων (N) — χρονολογικά»; expand reveals full chronological list
- `ReplyComposer` — draft-then-signup, fan-profile gate, rate-limit inline message
- `VoteControls` — up/down with score
