# ΚΕΡΚΙΔΑ: Migration map (old → new)

Use with `REFACTOR-PLAN.md`. Find remaining usages any time with:

```bash
rg -n "text-\[1[0-3]px\]|border-\[1\.5px\]|w-\[(168|200)px\]|section-label|text-(hint|meta|secondary-size|body-size|title-size|heading-size)\b|live-pulse" app components
```

## 1. Typography utilities

| Old                                                         | Old value                       | New                                                                                                                | Notes                                                                                                                                    |
| ----------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `text-[10px]`, `.text-hint`                                 | 10px                            | `text-xs` (12) **or** `text-label` (12/600, tracking)                                                              | Nothing below 12px in UI text. Decorative glyphs inside logos/pips are the only exception (inside components).                           |
| `text-[11px]`, `.text-meta` (old)                           | 11px                            | `text-meta` (13/1.4, 500)                                                                                          | **Name collision on purpose**: in PR 4 the old `.text-meta` utility is deleted and the token takes over, so every usage grows 11 → 13px. |
| `.section-label`                                            | 11px/500 uppercase 0.06em muted | `.text-overline` (12/600 uppercase 0.06em muted) or `<SectionHeader overline>`                                     |                                                                                                                                          |
| `.text-secondary-size`                                      | 12px                            | `text-xs` / `text-meta`                                                                                            | meta-like text → `text-meta`; chips/badges → `text-xs`                                                                                   |
| `text-[13px]`, `.text-body-size`                            | 13px                            | `text-body` (15/1.55) for posts and comments · `text-body-sm` (14) for compact rows · `text-meta` (13) for bylines | Decide by role, not by size.                                                                                                             |
| `.text-title-size`                                          | 15px                            | `text-title` (17/600) for thread titles (`.thread-title` adds the 3-line clamp) · `text-h4` (16) for card titles   |                                                                                                                                          |
| `.text-heading-size`                                        | 18px                            | `text-h3` (18) or `text-h2` (22)                                                                                   |                                                                                                                                          |
| page `<h1>` `text-2xl font-bold` (Βαθμολογίες, Μεταγραφές…) |                                 | `<PageTitle>` (Fira, `text-display-sm md:text-display`)                                                            | Only for fixed page titles. Thread titles stay Inter (`text-h1`).                                                                        |
| `font-medium` on everything                                 | 500                             | weight tokens: 400 body · 500 meta · 600 titles/buttons/labels · 700 points                                        |                                                                                                                                          |
| `uppercase` on hand-typed caps (e.g. "ΑΡΗΣ")                |                                 | type sentence case + `uppercase` utility                                                                           | CSS drops the tonos with `lang="el"`.                                                                                                    |
| `.live-pulse` (`animate-pulse` on text)                     |                                 | `<LiveDot/>` / `<LivePill/>`                                                                                       | Pulse only the 6px dot; static under reduced motion.                                                                                     |

## 2. Colours

| Old                                                               | New                                                                                 | Notes                                   |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------- |
| `--primary` neon `#39FF14` / `bg-primary` CTA                     | `bg-cta` via `<Button variant="cta">` (cobalt pill)                                 | Neon is gone. Do not reintroduce green. |
| `text-primary` links (neon)                                       | `text-primary` (cobalt)                                                             | Same class, new value: no code change.  |
| `--accent` dim neon tint                                          | `bg-accent text-accent-foreground` (cobalt tint)                                    | Same class.                             |
| red LIVE text (`text-red-*`, `text-destructive`)                  | `<LivePill minute>` (`bg-live text-live-foreground`) · orange text `text-live-text` | Live is never red.                      |
| red live chip border (`border-destructive`, `border-red-*`)       | `<MatchChip>` (status="live" → `.border-emphasis border-live-border`)               |                                         |
| green chip border on scheduled matches                            | `<MatchChip>` (status="scheduled" → `border-border`)                                |                                         |
| green active pill (`border-primary text-primary` on league pills) | `<LeagueBar>` (`aria-current=page` → `bg-foreground text-background`)               |                                         |
| green notification dot                                            | `bg-primary` dot + sr-only “Μη αναγνωσμένη” (`<NotificationItem>`)                  |                                         |
| `--chart-1` neon                                                  | `--chart-1` cobalt (…`chart-5`)                                                     |                                         |
| hard-coded hex anywhere                                           | the matching token (`MASTER.md §2`)                                                 |                                         |

## 3. Borders, radius, sizes

| Old                                      | New                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------ |
| `border-[1.5px]`                         | `.border-emphasis` (live chip, open rumour, ad slot) or the owning component   |
| `border-[0.5px]` (old MASTER user pill)  | `border` (1px)                                                                 |
| `rounded-[20px]` user pill               | `<AccountMenu>` trigger (`rounded-full`)                                       |
| avatar `size-7` + `text-[10px]` initials | `<TeamAvatar size="md">`                                                       |
| ad-hoc icon sizes `h-3 w-3`, `h-[14px]`  | `size-3.5` (14) · `size-4` (16) · `size-5` (20) · `size-6` (24) per MASTER §10 |
| league logo `<img className="h-5 w-5">`  | `<LeagueLogo size="sm">` (fallback monogram)                                   |

## 4. Layout

| Old                                                       | New                                                                                               |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `w-[168px]` left sidebar (league list + profile card)     | **removed**: leagues → `<LeagueBar>`; profile → `<AccountMenu>`                                   |
| `w-[200px]` right sidebar                                 | `<AppShell rail>` = `w-80` (320), **only ≥xl**; below xl the widgets render inline after the feed |
| header `Leagues ▾` dropdown                               | **removed** → `<LeagueBar>` “Όλες” (Popover ≥md / Sheet <md)                                      |
| in-feed league tabs (Όλα, LIVE, Super League…)            | **removed** → `<LeagueBar showScopes>`                                                            |
| `Φήμες μεταγραφών` header link                            | tab inside Μεταγραφές (`<PageTabs>`)                                                              |
| mixed header copy (“Leagues”, “Match Threads”)            | `PRIMARY_NAV`: Αρχική · Αγώνες · Βαθμολογίες · Μεταγραφές · Λίγκες                                |
| mobile hamburger sheet with leagues + 64px neon “Εγγραφή” | `<BottomNav>` + `<LeagueBar>`; guest CTA = normal `Button variant="cta" size="sm"` in header      |
| full-width cookie bar (~20% of screen)                    | `<CookieConsent>` card (bottom-left desktop / above bottom nav mobile) + settings Sheet           |
| floating “Cookies” pill bottom-left                       | footer link “Ρυθμίσεις cookies” opens the settings Sheet                                          |
| empty ad gaps (blank 200px boxes)                         | `<AdSlot size placement>` with reserved height + label + house ad                                 |
| `max-w-[…]` page containers                               | `max-w-304` (1216) via `<AppShell>`                                                               |

## 5. Components

| Old pattern                                          | New component                                                            |
| ---------------------------------------------------- | ------------------------------------------------------------------------ |
| match card in top bar                                | `MatchChip` + `MatchBar`                                                 |
| thread list item (all identical)                     | `ThreadRow` (type tile, chips, unread, flair, stats) inside `ThreadList` |
| up/down chevrons + number                            | `VoteButtons`                                                            |
| comment block with `+ / −` and “1 απάντηση κρυμμένη” | `PostCard` (Collapsible, `N κρυμμένες απαντήσεις`, moderation states)    |
| “Η αναρτήση έχει συμπτυχθεί λόγω αρνητικών ψήφων”    | `PostCard` `moderation="low_score"`                                      |
| textarea + “Σύνδεση για δημοσίευση”                  | `ReplyComposer gate=…`                                                   |
| standings `<table>`                                  | `StandingsTable` + `StandingsLegend`                                     |
| transfers table (Αφιξη/Αποχώρηση pills)              | `TransfersTable`                                                         |
| rumour row (“ronaldo”)                               | `RumorCard`                                                              |
| team picker 2-col buttons (duplicates ΑΕΚ/Α.Ε.Κ.)    | team grid tiles (see `pages/transfers.md`); de-duplicate data            |
| “Προσωρινά μη διαθέσιμο” card                        | `DataUnavailable kind="not_synced"`                                      |
| fan profile card (green bg)                          | Fan profiles page cards (`bg-accent border-primary` + «Ενεργό» badge)    |
| user pill with green league badge                    | `AccountMenu` trigger                                                    |
| notification row with green dot                      | `NotificationItem`                                                       |

## 6. Lint guard (add in the last PR, warn-mode earlier)

```jsonc
// eslint.config.mjs → no-restricted-syntax on className literals
{
  "selector": "Literal[value=/text-\\[(9|10|11|13)px\\]|border-\\[1\\.5px\\]|w-\\[(168|200)px\\]|section-label|text-(hint|secondary-size|body-size|title-size|heading-size)/]",
  "message": "Use design tokens (design-system/kerkida/MIGRATION.md).",
}
```
