# Standings Page Overrides

> **PROJECT:** ΚΕΡΚΙΔΑ
> **Page Type:** Standings overview and league standings

> Rules here **override** `design-system/kerkida/MASTER.md` where noted.

---

## Layout

- **Shell:** Single column, `max-w-3xl`, centered — no sidebars
- **Main order:** Page title → League subtitle → League tabs → Top ad → Table or unavailable → Bottom ad (conditional)
- **Routes:** `/standings` (defaults to Super League) and `/leagues/{slug}/standings`

## Typography

- Page H1: `copy.standings.pageTitle` ("Βαθμολογίες")
- League subtitle: `text-sm text-muted-foreground`
- Table: compact `text-sm` with optional W/D/L columns

## Color (page)

- Active league tab: pill nav consistent with feed league tabs
- Phase separators (Super League): thicker border after ranks 4 and 8

## Components

- **StandingsLeagueTabs:** pill links to each league standings route
- **StandingsTable:** full standings with team logos and optional extended stats
- **StandingsUnavailable:** deferred leagues (NBA, Euroleague)

## Ads

- Top: `StandingsTopAd` after league tabs, before table or unavailable message — always shown
- Bottom: `StandingsBottomAd` after the table — only when the table renders with rows (`!deferred && rows.length > 0`)
- Deferred leagues and empty sync state show top ad only
