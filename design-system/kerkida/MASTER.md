# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/kerkida/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** ΚΕΡΚΙΔΑ
**Updated:** 2026-05-29
**Category:** Sports community forum
**Style:** Vibrant & block-based — Stadium Electric

---

## Global Rules

### Color Palette (Stadium Electric)

| Role            | Hex       | Token          | Usage                          |
| --------------- | --------- | -------------- | ------------------------------ |
| Primary         | `#4F46E5` | `--primary`    | Brand, links, emphasis         |
| Secondary       | `#818CF8` | `--secondary`  | Highlights, secondary actions  |
| CTA             | `#F97316` | `--cta`        | Sign up, join, conversion      |
| Live / activity | `#22C55E` | `--chart-2`    | LIVE badges, online indicators |
| Background      | `#EEF2FF` | `--background` | Page surface                   |
| Text            | `#1E1B4B` | `--foreground` | Headings, body                 |

**Color notes:** Energetic indigo forum + orange conversion CTAs. Green reserved for live/online only (not signup buttons).

### Typography

- **Heading:** Barlow Condensed (`font-heading`)
- **Body:** Barlow (`font-sans`)
- **Mood:** sports, athletic, condensed headlines, readable body
- **Scale:** Hero H1 40–48px desktop, section H2 24–28px, body 16–18px

### Spacing

| Token        | Value                         | Usage                     |
| ------------ | ----------------------------- | ------------------------- |
| Section gap  | `48px` / `3rem`               | Between homepage sections |
| Hero padding | `64px` / `4rem` vertical      | Hero block                |
| Container    | `max-w-6xl` (1152px)          | Main content width        |
| Page padding | `16px` mobile, `24px` desktop | Horizontal gutters        |

### Shadows

Use semantic elevation via borders + `shadow-sm` on cards — avoid layout-shifting `translateY` hovers.

---

## Component Specs

### Buttons

- **Primary action (join/sign up):** `variant="cta"` — orange
- **Secondary:** `variant="outline"` or `ghost`
- **Default brand:** `variant="default"` — indigo
- Transitions: `transition-colors duration-200`, no scale on cards

### Cards

- White/card surface on tinted background
- `border-border`, optional `border-l-4 border-l-primary` for league blocks
- Hover: `hover:bg-muted/60`, `hover:border-primary/30` — no transform

### LIVE badge

- `bg-chart-2 text-primary-foreground` with pulse dot
- Never use emoji for status icons — Lucide or CSS dot only

---

## Page Pattern

**Community/Forum Landing**

1. Hero — value prop, stats, dual CTA
2. Popular leagues — grid of topic cards
3. Active members — social proof
4. Join CTA — conversion block

---

## Anti-Patterns (Do NOT Use)

- Emojis as UI icons (league list uses Lucide via `LeagueIcon`)
- Purple-on-lavender low-contrast body text
- Layout-shifting scale hovers on cards
- Missing `cursor-pointer` on interactive cards
- Instant state changes without 150–300ms transitions

---

## Pre-Delivery Checklist

- [ ] Semantic tokens only in components
- [ ] Light + dark mode tested
- [ ] `font-heading` on H1/H2
- [ ] Responsive 375px–1440px
- [ ] Greek copy for all user-facing strings
