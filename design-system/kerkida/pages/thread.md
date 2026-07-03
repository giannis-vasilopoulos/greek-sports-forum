# Thread Detail Page Overrides

> **PROJECT:** ΚΕΡΚΙΔΑ
> **Page Type:** Thread detail / participation

> Rules here **override** `design-system/kerkida/MASTER.md` where noted.

---

## Layout

- **Shell:** `FeedShell` — left 168px · main flex-1 · right 200px
- **Main order:** Breadcrumb header → `ThreadTopAd` → post stream → `ThreadInContentAd` (after ~5 posts) → desktop composer
- **Mobile:** Sticky `ReplyComposer` fixed to bottom; main column `pb-32` spacer

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
- `PostCard` — vote rail + avatar + content + reply action
- `ReplyComposer` — draft-then-signup, fan-profile gate, rate-limit inline message
- `VoteControls` — up/down with score
