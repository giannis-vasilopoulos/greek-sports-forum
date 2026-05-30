# Home Page Overrides

> **PROJECT:** ΚΕΡΚΙΔΑ
> **Page Type:** Community / forum landing

> Rules here **override** `design-system/kerkida/MASTER.md` where noted.

---

## Layout

- **Container:** `max-w-6xl` centered; hero is full-bleed above container
- **Section order:** Hero → Popular leagues → Active members → Join CTA
- **Section spacing:** `gap-12` mobile, `gap-16` md between sections inside container
- **Hero:** Full-width block with geometric pattern, condensed headline, stat pills, centered CTAs

## Typography

- H1: `font-heading text-4xl md:text-5xl font-bold tracking-tight`
- H2: `font-heading text-2xl font-semibold tracking-tight`
- Subcopy: `text-muted-foreground text-base md:text-lg`

## Color (page)

- Hero background: `bg-primary/5` with `border-y border-border`
- League cards: left accent `border-l-4 border-l-primary`
- Join CTA card: `bg-primary text-primary-foreground` (inverted block)

## Components

- Leagues: responsive grid `grid-cols-1 sm:grid-cols-2` with Lucide sport icons
- Members: `grid-cols-1 sm:grid-cols-2` cards
- LIVE badge: chart-2 green, not CTA orange

## CTA placement

- Hero: Εγγραφή (cta) + Σύνδεση (outline)
- Footer section: Ξεκίνα δωρεάν (cta on inverted card)
