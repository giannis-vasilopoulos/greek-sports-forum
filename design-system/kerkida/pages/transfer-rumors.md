# Transfer Rumors Page Overrides

> **PROJECT:** ΚΕΡΚΙΔΑ
> **Page Type:** Community transfer rumor overview, league hub, and team feeds

> Rules here **override** `design-system/kerkida/MASTER.md` where noted.

---

## Layout

- **Shell:** Single column, `max-w-3xl`, centered
- **Hub order:** Page title → League subtitle → Cross-link to official transfers → League tabs → Submit form → Team grid
- **Team page order:** Page title → League subtitle → Back to league hub + cross-links → Submit form → Thread feed list
- **Routes:** `/transfer-rumors`, `/leagues/{slug}/transfer-rumors`, `/leagues/{slug}/teams/{team-slug}/transfer-rumors`

## Typography

- Page H1: `copy.transferRumors.pageTitle` on hubs; `copy.transferRumors.teamPageTitle` on team pages
- Thread rows: reuse `ThreadRow` styling from feed

## Components

- **TeamPickerHub + LeaguePillTabs:** league tabs link to `/leagues/{slug}/transfer-rumors`
- **SubmitRumorForm:** gated by sign-in and fan profile for the active league
- **ThreadRowList:** rumor threads linking to thread detail routes

## Ads

- Defer dedicated ad slots until traffic warrants; mirror standings if added later
