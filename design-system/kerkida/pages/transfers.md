# Transfers Page Overrides

> **PROJECT:** ΚΕΡΚΙΔΑ
> **Page Type:** Transfers overview, league hub, and team transfers

> Rules here **override** `design-system/kerkida/MASTER.md` where noted.

---

## Layout

- **Shell:** Single column, `max-w-3xl`, centered — no sidebars
- **Hub order:** Page title → League subtitle → Cross-link to rumors → League tabs → Top ad → Team grid or unavailable
- **Team page order:** Page title → League subtitle → Back to league hub + cross-links → Top ad → Direction tabs (Άφιξη / Αποχώρηση) → Table or empty → Bottom ad (conditional)
- **Routes:** `/transfers` (default Super League), `/leagues/{slug}/transfers`, `/leagues/{slug}/teams/{team-slug}/transfers`

## Typography

- Page H1: `copy.transfers.pageTitle` on hubs; `copy.transfers.teamPageTitle` on team pages
- League subtitle: `text-sm text-muted-foreground`
- Table: compact `text-sm`

## Color (page)

- Active league tab: pill nav consistent with standings league tabs
- Active direction tab: primary pill on team pages

## Components

- **TeamPickerHub + LeaguePillTabs:** league tabs link to `/leagues/{slug}/transfers`
- **TeamTransfersTableSection:** client-side Άφιξη / Αποχώρηση filter
- **TransfersTable:** player, from → to, date, fee (no direction column on team pages)
- **TransfersUnavailable:** deferred leagues (NBA, Euroleague)

## Ads

- Top: `TransfersTopAd` after league tabs (hub) or cross-links (team), before grid/table
- Bottom: `TransfersBottomAd` after the table when rows exist (team page only)
