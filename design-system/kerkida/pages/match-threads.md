# Match Threads Page Overrides

> **PROJECT:** ΚΕΡΚΙΔΑ
> **Page Type:** Feed / match threads list

> Rules here **override** `design-system/kerkida/MASTER.md` where noted.

---

## Layout

- **Shell:** `FeedShell` — left sidebar 168px · main flex-1 · right sidebar 200px (desktop)
- **Above shell:** `MatchBar` — full-width horizontal scroll of match chips
- **Main order:** Top ad → League tabs → Thread rows → Mid ad
- **Mobile:** Hide fixed sidebars; league tabs remain; right sidebar content stacks below thread list

## Typography

- Page title (visually hidden or sr-only): per SEO spec
- Section labels: `.section-label` (11px uppercase, 0.06em tracking)
- Thread list uses `ThreadRow` component specs from MASTER

## Color (page)

- Match bar background: `bg-background` with `border-b border-border`
- Active league tab: `bg-foreground text-background`
- Live thread badge: destructive palette with pulse

## Components

- **MatchBar:** horizontal scroll row of `MatchChip`
- **LeagueTab:** filter row for all leagues + live filter
- **ThreadRow:** list of match threads with live/type badges
- **LeftSidebar:** league nav + compact profile
- **RightSidebar:** standings snippet, upcoming matches, trending threads

## Ads

- Top: `MatchThreadsTopAd` before thread list
- Mid: `MatchThreadsMidAd` after ~6 thread rows
