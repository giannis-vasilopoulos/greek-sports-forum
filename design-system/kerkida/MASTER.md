# KERKIDA — Design System

## Brand

- Name: ΚΕΡΚΙΔΑ (letter-spacing: 0.08em, font-weight: 500)
- Accent: `#1D9E75` (teal — sport-neutral, works for all teams)
- Accent bg: `#E1F5EE` / text: `#085041`
- Live/danger: `#E24B4A` / bg: `#FCEBEB` / text: `#791F1F`

## Typography

- Font: system-ui via shadcn (Inter)
- Sizes: 10px hints · 11px labels/meta · 12px secondary · 13px body · 15px titles · 18px headings
- Weights: 400 regular · 500 medium (ONLY these two)
- Letter spacing: 0.06em for SECTION LABELS (uppercase)

## Spacing

- Component gap: 4px · 6px · 8px · 10px · 12px · 14px · 16px
- Section padding: 12px–16px
- Card padding: 10px–14px

## Components

### Thread Row

- Avatar 28px circle · title 13px/500 · meta 11px muted
- Hover: bg-secondary · right chevron icon
- Badges: live (pulse red) · type (muted gray pill)

### Match Chip

- Min-width: 160px · border-radius: lg
- Live state: 1.5px teal/red border
- Score: 15px/500 · team names: 12px/500

### League Tab (feed filter)

- Active: bg-foreground text-background
- Inactive: transparent text-muted
- Border-radius: md

### League Nav Item (sidebar)

- Active: bg-secondary text-primary
- Icon 14px + label 12px
- Padding: 7px 8px

### User Pill (header)

- Avatar 28px + username 12px + league badge
- Border: 0.5px · border-radius: 20px

## Layout (desktop)

- Left sidebar: 168px (league nav + profile)
- Main content: flex-1
- Right sidebar: 200px (standings + upcoming + trending)
- Header: 52px sticky
- Match bar: auto height, horizontal scroll

## States

- Live match: red badge pulse + 1.5px border on chip
- Active league: teal bg pill on user pill
- Unread notification: 8px red dot on bell icon
