# ΚΕΡΚΙΔΑ: Design System (MASTER)

> Replaces the previous `design-system/kerkida/MASTER.md` (teal / light) and the ad-hoc dark neon theme.
> Direction: **Γ «Πίνακας»** (clean, data-first) with **Β «Προβολείς»** (broadcast) used only for matchday moments.
> Source of truth for values: `app/globals.css`. This file explains them. Page-specific rules: `pages/*.md`.
> Stack: Next.js 16 App Router · React 19 · Tailwind CSS v4 · shadcn/ui (radix-nova) · lucide-react.

## 1. Principles

1. **Neutral first, colour means something.** No club owns the UI. Colour is reserved for state: live, votes, form, zones, transfers.
2. **Club-neutral palette.** Primary is cobalt (hue 268): not a big-five club colour. Live is signal orange (hue 58): never read as Olympiacos red. Red appears only for destructive actions and the relegation zone. Success is sky-teal (not Panathinaikos green), downvote is violet.
3. **The team is shown by its logo, not by its colours.** Exception: the 2px two-tone avatar ring, identical in width and split for every club.
4. **Hierarchy from size and weight, not tiny grey text.** Minimum UI text 12px. `muted-foreground` is for meta only.
5. **Mobile-first, matchday-first.** Most traffic is phones during live matches; dark mode is equally polished.
6. **Greek is the default.** `<html lang="el">`, Greek copy, Greek uppercase without tonos via CSS only.

## 2. Colour

- 85 tokens in OKLCH, all inside sRGB (the hex in `globals.css` comments is exact).
- 142 contrast checks: every text pair ≥ 4.5:1, every non-text UI pair ≥ 3:1, in light **and** dark. Lowest text ratio: 5.36:1.
- shadcn names are kept 1:1 so stock components work unchanged. Domain tokens extend them.
- Tailwind: every token is available as `bg-*`, `text-*`, `border-*`, `ring-*` via `@theme inline` (`--color-*`).

### Rules

- `primary` = links, active states, focus ring, upvote, win. `cta` = same colour, **pill** shape, max once per view (Εγγραφή).
- `live` is a **fill** (pill, dot). Orange as text uses `live-text`; as a 1.5px outline uses `live-border`.
- `destructive` only for delete/errors/relegation. Never for live, losses or teams.
- `win/draw/loss` are distinguished by fill → grey → outline (+ letter Ν/Ι/Η), never colour alone.
- Team colours are **data** (`Team.colors`), not tokens. Used only in the avatar ring.
- Ads always sit on `ad-surface` with the dashed `ad-border` and the label «Διαφήμιση».

#### Core

| Token                      | Light                    | Dark                     | Usage                                                                           | Contrast L/D                                                        |
| -------------------------- | ------------------------ | ------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `--background`             | `oklch(0.985 0.002 265)` | `oklch(0.18 0.006 270)`  | App canvas behind everything                                                    | —                                                                   |
| `--foreground`             | `oklch(0.22 0.01 270)`   | `oklch(0.965 0.003 270)` | Primary text, icons                                                             | on background 16.6/17.0; on card 17.3/15.7; on ad-surface 15.6/15.1 |
| `--card`                   | `oklch(1 0 0)`           | `oklch(0.218 0.008 270)` | Thread rows, tables, chips, panels                                              | —                                                                   |
| `--card-foreground`        | `oklch(0.22 0.01 270)`   | `oklch(0.965 0.003 270)` | Text on card                                                                    | on card 17.3/15.7                                                   |
| `--popover`                | `oklch(1 0 0)`           | `oklch(0.25 0.009 270)`  | Menus, dropdowns, hover cards                                                   | —                                                                   |
| `--popover-foreground`     | `oklch(0.22 0.01 270)`   | `oklch(0.965 0.003 270)` | Text on popover                                                                 | on popover 17.3/14.5                                                |
| `--primary`                | `oklch(0.5 0.2 268)`     | `oklch(0.74 0.132 268)`  | Cobalt. Links, active tab, selected state, focus, upvote                        | on background 6.1/8.0; on card 6.3/7.4                              |
| `--primary-foreground`     | `oklch(0.99 0 0)`        | `oklch(0.18 0.03 268)`   | Text/icons on primary fill                                                      | on primary 6.2/8.0                                                  |
| `--secondary`              | `oklch(0.955 0.004 270)` | `oklch(0.27 0.009 270)`  | Secondary buttons, segmented-control track                                      | —                                                                   |
| `--secondary-foreground`   | `oklch(0.22 0.01 270)`   | `oklch(0.965 0.003 270)` | Text on secondary                                                               | on secondary 15.2/13.6                                              |
| `--muted`                  | `oklch(0.955 0.004 270)` | `oklch(0.27 0.009 270)`  | Quiet fills: hover rows, skeletons, code                                        | —                                                                   |
| `--muted-foreground`       | `oklch(0.49 0.012 270)`  | `oklch(0.76 0.012 270)`  | Meta, timestamps, captions, table headers (≥12px)                               | on background 6.0/8.8; on card 6.3/8.1; on muted 5.5/7.0            |
| `--accent`                 | `oklch(0.95 0.023 268)`  | `oklch(0.3 0.06 268)`    | shadcn hover/highlight tint (menu item, tag bg)                                 | —                                                                   |
| `--accent-foreground`      | `oklch(0.44 0.2 268)`    | `oklch(0.86 0.068 268)`  | Text on accent tint                                                             | on accent 7.2/8.9                                                   |
| `--destructive`            | `oklch(0.52 0.19 27)`    | `oklch(0.72 0.16 25)`    | Delete, errors, relegation zone. Never used for live or teams                   | on card 6.1/6.5; on background 5.8/7.1                              |
| `--destructive-foreground` | `oklch(0.99 0 0)`        | `oklch(0.18 0.03 25)`    | Text on destructive fill                                                        | on destructive 5.9/7.1                                              |
| `--border`                 | `oklch(0.91 0.005 270)`  | `oklch(0.31 0.01 270)`   | Dividers, card outlines (decorative)                                            | —                                                                   |
| `--input`                  | `oklch(0.64 0.012 270)`  | `oklch(0.54 0.012 270)`  | Form-field outline (≥3:1, WCAG 1.4.11)                                          | on card 3.4/3.4; on background 3.2/3.7; on loss 3.4/3.4             |
| `--ring`                   | `oklch(0.5 0.2 268)`     | `oklch(0.74 0.132 268)`  | Focus ring 2px + 2px offset                                                     | on background 6.1/8.0; on card 6.3/7.4                              |
| `--cta`                    | `oklch(0.5 0.2 268)`     | `oklch(0.74 0.132 268)`  | Conversion buttons (Εγγραφή). Alias of primary, kept separate so it can diverge | —                                                                   |
| `--cta-foreground`         | `oklch(0.99 0 0)`        | `oklch(0.18 0.03 268)`   | Text on cta                                                                     | on cta 6.2/8.0                                                      |

#### Charts

| Token       | Light                   | Dark                    | Usage                               | Contrast L/D    |
| ----------- | ----------------------- | ----------------------- | ----------------------------------- | --------------- |
| `--chart-1` | `oklch(0.5 0.2 268)`    | `oklch(0.74 0.132 268)` | Series 1 · cobalt                   | on card 6.3/7.4 |
| `--chart-2` | `oklch(0.62 0.16 52)`   | `oklch(0.76 0.15 58)`   | Series 2 · orange                   | on card 3.9/7.8 |
| `--chart-3` | `oklch(0.55 0.2 320)`   | `oklch(0.72 0.17 320)`  | Series 3 · magenta                  | on card 5.4/6.5 |
| `--chart-4` | `oklch(0.6 0.106 215)`  | `oklch(0.78 0.11 210)`  | Series 4 · sky                      | on card 3.8/9.0 |
| `--chart-5` | `oklch(0.55 0.015 270)` | `oklch(0.68 0.015 270)` | Series 5 · slate (others / average) | on card 4.9/6.0 |

#### Sidebar

| Token                          | Light                    | Dark                     | Usage                      | Contrast L/D               |
| ------------------------------ | ------------------------ | ------------------------ | -------------------------- | -------------------------- |
| `--sidebar`                    | `oklch(0.975 0.003 270)` | `oklch(0.2 0.007 270)`   | Left league nav surface    | —                          |
| `--sidebar-foreground`         | `oklch(0.22 0.01 270)`   | `oklch(0.965 0.003 270)` | Nav text                   | on sidebar 16.1/16.4       |
| `--sidebar-primary`            | `oklch(0.5 0.2 268)`     | `oklch(0.74 0.132 268)`  | Active nav marker          | —                          |
| `--sidebar-primary-foreground` | `oklch(0.99 0 0)`        | `oklch(0.18 0.03 268)`   | Text on sidebar-primary    | on sidebar-primary 6.2/8.0 |
| `--sidebar-accent`             | `oklch(0.94 0.028 268)`  | `oklch(0.29 0.055 268)`  | Active / hover nav item bg | —                          |
| `--sidebar-accent-foreground`  | `oklch(0.44 0.2 268)`    | `oklch(0.86 0.068 268)`  | Active nav item text       | on sidebar-accent 6.9/9.2  |
| `--sidebar-border`             | `oklch(0.91 0.005 270)`  | `oklch(0.3 0.01 270)`    | Sidebar divider            | —                          |
| `--sidebar-ring`               | `oklch(0.5 0.2 268)`     | `oklch(0.74 0.132 268)`  | Focus in sidebar           | —                          |

#### Match status

| Token                    | Light                   | Dark                    | Usage                                                  | Contrast L/D                                        |
| ------------------------ | ----------------------- | ----------------------- | ------------------------------------------------------ | --------------------------------------------------- |
| `--live`                 | `oklch(0.72 0.17 58)`   | `oklch(0.76 0.16 60)`   | LIVE pill fill, pulse dot, score-change flash          | on scorebug 6.7/7.0                                 |
| `--live-border`          | `oklch(0.53 0.144 48)`  | `oklch(0.76 0.16 60)`   | Live chip outline 1.5px (darker in light mode for 3:1) | on card 5.6/7.8; on background 5.4/8.4              |
| `--live-foreground`      | `oklch(0.22 0.04 50)`   | `oklch(0.22 0.04 50)`   | Text on live fill                                      | on live 6.7/7.8                                     |
| `--live-text`            | `oklch(0.53 0.144 48)`  | `oklch(0.8 0.14 62)`    | Orange as text: minute “67′” on bg/card                | on background 5.4/9.8; on card 5.6/9.0              |
| `--halftime`             | `oklch(0.95 0.033 65)`  | `oklch(0.32 0.06 60)`   | HT pill bg (paused live)                               | —                                                   |
| `--halftime-foreground`  | `oklch(0.47 0.128 48)`  | `oklch(0.84 0.11 65)`   | HT pill text                                           | on halftime 6.2/7.7                                 |
| `--finished`             | `oklch(0.94 0.004 270)` | `oklch(0.29 0.008 270)` | ΤΕΛΙΚΟ pill bg                                         | —                                                   |
| `--finished-foreground`  | `oklch(0.42 0.012 270)` | `oklch(0.8 0.01 270)`   | ΤΕΛΙΚΟ text                                            | on finished 7.1/7.6                                 |
| `--scheduled`            | `oklch(0.95 0.023 268)` | `oklch(0.3 0.06 268)`   | Kick-off time pill bg                                  | —                                                   |
| `--scheduled-foreground` | `oklch(0.44 0.2 268)`   | `oklch(0.86 0.068 268)` | Kick-off time text                                     | on scheduled 7.2/8.9                                |
| `--postponed`            | `oklch(0.95 0.02 305)`  | `oklch(0.3 0.05 305)`   | ΑΝΑΒΟΛΗ pill bg (+ strikethrough time)                 | —                                                   |
| `--postponed-foreground` | `oklch(0.45 0.15 305)`  | `oklch(0.84 0.08 305)`  | ΑΝΑΒΟΛΗ text                                           | on postponed 6.9/8.3                                |
| `--scorebug`             | `oklch(0.22 0.012 270)` | `oklch(0.26 0.012 270)` | Live score header surface (dark in both modes)         | —                                                   |
| `--scorebug-raised`      | `oklch(0.3 0.014 270)`  | `oklch(0.34 0.014 270)` | Digit boxes, logo fallback on scorebug                 | —                                                   |
| `--scorebug-foreground`  | `oklch(0.99 0 0)`       | `oklch(0.99 0 0)`       | Score, team names on scorebug                          | on scorebug 16.8/15.1; on scorebug-raised 13.3/11.4 |
| `--scorebug-muted`       | `oklch(0.8 0.01 270)`   | `oklch(0.8 0.01 270)`   | League, round, full names on scorebug                  | on scorebug 9.3/8.3                                 |

#### Votes & form

| Token               | Light                   | Dark                     | Usage                                          | Contrast L/D                           |
| ------------------- | ----------------------- | ------------------------ | ---------------------------------------------- | -------------------------------------- |
| `--upvote`          | `oklch(0.5 0.2 268)`    | `oklch(0.74 0.132 268)`  | Active upvote icon + count                     | on card 6.3/7.4; on background 6.1/8.0 |
| `--downvote`        | `oklch(0.5 0.19 305)`   | `oklch(0.74 0.13 305)`   | Active downvote icon + count (violet, not red) | on card 6.6/7.2; on background 6.3/7.8 |
| `--win`             | `oklch(0.5 0.2 268)`    | `oklch(0.74 0.132 268)`  | Form guide Ν: solid fill                       | on card 6.3/7.4                        |
| `--win-foreground`  | `oklch(0.99 0 0)`       | `oklch(0.18 0.03 268)`   | Letter on win                                  | on win 6.2/8.0                         |
| `--draw`            | `oklch(0.82 0.006 270)` | `oklch(0.44 0.008 270)`  | Form guide Ι: mid-grey fill                    | —                                      |
| `--draw-foreground` | `oklch(0.22 0.01 270)`  | `oklch(0.965 0.003 270)` | Letter on draw                                 | on draw 9.9/7.0                        |
| `--loss`            | `oklch(1 0 0)`          | `oklch(0.218 0.008 270)` | Form guide Η: card fill + input-colour outline | —                                      |
| `--loss-foreground` | `oklch(0.49 0.012 270)` | `oklch(0.76 0.012 270)`  | Letter on loss                                 | on loss 6.3/8.1                        |

#### Transfers

| Token                | Light                    | Dark                    | Usage                                        | Contrast L/D                                 |
| -------------------- | ------------------------ | ----------------------- | -------------------------------------------- | -------------------------------------------- |
| `--arrival`          | `oklch(0.48 0.2 268)`    | `oklch(0.76 0.122 268)` | Transfer in: ↙ icon + label text             | on card 6.9/8.0; on arrival-subtle 6.0/6.3   |
| `--arrival-subtle`   | `oklch(0.95 0.023 268)`  | `oklch(0.3 0.06 268)`   | Arrival row/pill tint                        | —                                            |
| `--departure`        | `oklch(0.5 0.2 330)`     | `oklch(0.76 0.14 330)`  | Transfer out: ↗ icon + label text            | on card 6.7/7.6; on departure-subtle 5.8/6.1 |
| `--departure-subtle` | `oklch(0.955 0.025 330)` | `oklch(0.3 0.06 330)`   | Departure row/pill tint                      | —                                            |
| `--rumor`            | `oklch(0.96 0.025 85)`   | `oklch(0.3 0.035 85)`   | Unconfirmed rumour pill bg (+ dashed border) | —                                            |
| `--rumor-foreground` | `oklch(0.44 0.08 70)`    | `oklch(0.86 0.06 85)`   | Rumour label text                            | on rumor 7.0/8.9                             |

#### Reputation

| Token                | Light                   | Dark                     | Usage                                      | Contrast L/D       |
| -------------------- | ----------------------- | ------------------------ | ------------------------------------------ | ------------------ |
| `--rep-1`            | `oklch(0.94 0.004 270)` | `oklch(0.3 0.008 270)`   | Tier 1 Νέος: badge bg                      | —                  |
| `--rep-1-foreground` | `oklch(0.42 0.012 270)` | `oklch(0.8 0.01 270)`    | Tier 1 text                                | on rep-1 7.1/7.3   |
| `--rep-2`            | `oklch(0.93 0.032 268)` | `oklch(0.32 0.07 268)`   | Tier 2 Τακτικός: badge bg                  | —                  |
| `--rep-2-foreground` | `oklch(0.44 0.17 268)`  | `oklch(0.86 0.068 268)`  | Tier 2 text                                | on rep-2 6.6/8.3   |
| `--rep-3`            | `oklch(0.5 0.2 268)`    | `oklch(0.74 0.132 268)`  | Tier 3 Βετεράνος: solid badge              | —                  |
| `--rep-3-foreground` | `oklch(0.99 0 0)`       | `oklch(0.18 0.03 268)`   | Tier 3 text                                | on rep-3 6.2/8.0   |
| `--rep-4`            | `oklch(0.22 0.01 270)`  | `oklch(0.965 0.003 270)` | Tier 4 Θρύλος της κερκίδας: inverted badge | —                  |
| `--rep-4-foreground` | `oklch(0.99 0 0)`       | `oklch(0.18 0.006 270)`  | Tier 4 text                                | on rep-4 16.8/17.0 |

#### Feedback

| Token                  | Light                   | Dark                   | Usage                                                             | Contrast L/D        |
| ---------------------- | ----------------------- | ---------------------- | ----------------------------------------------------------------- | ------------------- |
| `--success`            | `oklch(0.5 0.088 215)`  | `oklch(0.78 0.1 210)`  | Saved / posted. Sky-teal, never PAO green; always with check icon | on card 5.8/9.0     |
| `--success-foreground` | `oklch(0.99 0 0)`       | `oklch(0.18 0.03 215)` | Text on success fill                                              | on success 5.6/9.7  |
| `--warning`            | `oklch(0.84 0.15 85)`   | `oklch(0.82 0.14 85)`  | Caution banners (always with icon + text)                         | —                   |
| `--warning-foreground` | `oklch(0.24 0.05 70)`   | `oklch(0.22 0.05 70)`  | Text on warning fill                                              | on warning 10.1/9.9 |
| `--info`               | `oklch(0.52 0.148 250)` | `oklch(0.76 0.11 250)` | Neutral notices, tips                                             | on card 5.5/8.2     |
| `--info-foreground`    | `oklch(0.99 0 0)`       | `oklch(0.18 0.03 250)` | Text on info fill                                                 | on info 5.4/8.8     |

#### Zones

| Token               | Light                   | Dark                    | Usage                               | Contrast L/D    |
| ------------------- | ----------------------- | ----------------------- | ----------------------------------- | --------------- |
| `--zone-playoff`    | `oklch(0.5 0.2 268)`    | `oklch(0.74 0.132 268)` | Standings 3px bar · play-off τίτλου | on card 6.3/7.4 |
| `--zone-mid`        | `oklch(0.64 0.012 270)` | `oklch(0.56 0.012 270)` | Standings bar · play-off 5–8        | on card 3.4/3.7 |
| `--zone-relegation` | `oklch(0.52 0.19 27)`   | `oklch(0.72 0.16 25)`   | Standings bar · υποβιβασμός         | on card 6.1/6.5 |

#### Ads

| Token                     | Light                   | Dark                    | Usage                                                    | Contrast L/D          |
| ------------------------- | ----------------------- | ----------------------- | -------------------------------------------------------- | --------------------- |
| `--ad-surface`            | `oklch(0.965 0.012 85)` | `oklch(0.235 0.012 85)` | Sponsored slot background (warm, set apart from content) | —                     |
| `--ad-surface-foreground` | `oklch(0.47 0.015 80)`  | `oklch(0.76 0.015 85)`  | “Χορηγούμενο” label                                      | on ad-surface 6.2/7.8 |
| `--ad-border`             | `oklch(0.88 0.015 85)`  | `oklch(0.33 0.015 85)`  | Sponsored slot outline (dashed)                          | —                     |

#### Surfaces

| Token       | Light                        | Dark                    | Usage                        | Contrast L/D |
| ----------- | ---------------------------- | ----------------------- | ---------------------------- | ------------ |
| `--overlay` | `oklch(0.18 0.01 270) / 45%` | `oklch(0.05 0 0) / 65%` | Scrim behind sheets & modals | —            |

## 3. Typography

Two families, both with full Greek (monotonic + polytonic, `greek` + `greek-ext` subsets):

| Family                        | Variable         | Weights                                      | Use                                                                                                                                                                                                                                                            |
| ----------------------------- | ---------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Inter**                     | `--font-sans`    | 400 · 500 · 600 · 700 (variable, opsz 14–32) | Everything: UI, body, user content, thread titles, H1–H4, buttons, nav, tables. Numbers with `tabular-nums`.                                                                                                                                                   |
| **Fira Sans Extra Condensed** | `--font-display` | 700 · 800 italic                             | **System text only**: score digits, team names on the scorebug & chips, fixed page H1s (ΒΑΘΜΟΛΟΓΙΑ, ΜΕΤΑΓΡΑΦΕΣ, league/team names). Use the `.text-system` utility (italic, uppercase, tabular). Never user-generated text, body, buttons, nav or table cells. |

### Weights (tokens)

| Token                    | Value | Used for                                               |
| ------------------------ | ----- | ------------------------------------------------------ |
| `--font-weight-regular`  | 400   | body, comments, table numbers                          |
| `--font-weight-medium`   | 500   | meta, timestamps, team names in tables, nav items      |
| `--font-weight-semibold` | 600   | thread titles, H1–H4, buttons, labels, usernames, tabs |
| `--font-weight-bold`     | 700   | points column, wordmark, Inter scores, Fira chips      |
| `--font-weight-black`    | 800   | Fira only: scorebug, page H1                           |

### Scale (Tailwind `text-*` utilities; line-height, tracking and weight travel with the size)

| Utility           | Family  | Size / line-height | Weight | Tracking | Use                                                                     |
| ----------------- | ------- | ------------------ | ------ | -------- | ----------------------------------------------------------------------- |
| `text-display`    | Fira XC | 56 / 0.95          | 800i   | 0.005em  | Fixed page H1 ≥ md                                                      |
| `text-display-sm` | Fira XC | 36 / 0.95          | 800i   |          | Page H1 < md                                                            |
| `text-score`      | Fira XC | 46 / 1             | 800i   |          | Scorebug digits                                                         |
| `text-team`       | Fira XC | 22 / 1             | 800i   |          | Scorebug team name                                                      |
| `text-score-chip` | Fira XC | 18 / 1             | 700i   |          | Match chip score                                                        |
| `text-h1`         | Inter   | 28 / 1.2           | 600    | −0.015em | Content H1 (thread title on thread page, 22 < md)                       |
| `text-h2`         | Inter   | 22 / 1.25          | 600    | −0.01em  | Section header                                                          |
| `text-h3`         | Inter   | 18 / 1.3           | 600    |          | Card heading                                                            |
| `text-h4`         | Inter   | 16 / 1.35          | 600    |          | Sub-heading                                                             |
| `text-title`      | Inter   | 17 / 1.35          | 600    |          | Thread title in lists, **sentence case, clamp 3** (`.thread-title`)     |
| `text-body`       | Inter   | 15 / 1.55          | 400    |          | Posts, comments                                                         |
| `text-body-sm`    | Inter   | 14 / 1.5           | 400    |          | Compact density, helper text                                            |
| `text-meta`       | Inter   | 13 / 1.4           | 500    |          | Bylines, timestamps                                                     |
| `text-label`      | Inter   | 12 / 1.3           | 600    | 0.06em   | Overlines, table headers; use `.text-overline` (adds uppercase + muted) |
| `text-numeric`    | Inter   | 15 / 1.2           | (500)  |          | Standings & stats with `tabular-nums`                                   |

### Greek

- Uppercase via `uppercase` / `.text-overline` / `.text-system` **only** (tested in Chromium: drops tonos with `lang="el"`, keeps dialytika: ΠΑΝΑΘΗΝΑΪΚΟΣ). With `lang="en"` the tonos stays, so never wrap Greek in `lang="en"`.
- Type copy in sentence case. Never hard-code capitals.
- Terms kept in English: “Match Thread”, “LIVE”, league names (Super League, Euroleague…).

## 4. Spacing, radius, borders

- **Spacing**: Tailwind default 4px scale (`--spacing: 0.25rem`). Gutters: 16 mobile / 24–32 desktop. Card padding 12–16. Section gap 32.
- **Radius** (base `--radius: 0.625rem`): `rounded-sm` 6 (tags, pips) · `rounded-md` 8 (buttons, inputs) · `rounded-lg` 10 (chips) · `rounded-xl` 12 (cards, tables) · `rounded-2xl` 16 (sheets, panels) · `rounded-full` (pills, avatars, cta).
- **Borders**: 1px `border` (decorative) · 1px `input` (form fields, 3.4:1) · 1.5px `.border-emphasis` (live chip, open rumour, ad slot; dashed for unconfirmed) · 2px thread line / active tab · focus ring 2px + 2px offset (`ring`).

## 5. Elevation

| Level       | Light        | Dark                 | Use                                  |
| ----------- | ------------ | -------------------- | ------------------------------------ |
| `shadow-xs` | 0 1 2 /6%    | 1px inner light edge | cards (optional)                     |
| `shadow-sm` | soft 2-layer | 1px + dark           | sticky bars, active pill             |
| `shadow-md` | 4/12         | 6/16 + edge          | popovers, dropdowns, cta             |
| `shadow-lg` | 12/32        | 16/40 + edge         | sheets, dialogs, cookie card, toasts |

Dark mode: surfaces get lighter as they rise (background 0.180 → card 0.218 → popover 0.250 → secondary 0.270).

## 6. Layers (z-index)

`--z-base 0 · --z-sticky 10 (league bar, table header, compact scorebug) · --z-header 30 (header, bottom nav) · --z-composer 40 · --z-cookie 50 · --z-popover 60 · --z-overlay 70 · --z-sheet 71 · --z-toast 90 · --z-tooltip 100`. Use as `z-(--z-header)`.

## 7. Motion

- Durations: `--duration-fast` 120ms (hover, press, vote) · `--duration-base` 180ms (popovers, tabs, collapse) · `--duration-slow` 280ms (sheets, cookie card) · `--duration-pulse` 1600ms.
- Easing: `ease-standard` (default) · `ease-enter` · `ease-exit`.
- **Live pulse**: 6px dot, box-shadow ring 0→6px, 70%→0 opacity, 1600ms, infinite (`.live-dot` / `<LiveDot/>`). Only on the dot, max one pulsing element per region.
- **Score change**: one `animate-score-flash` (900ms) on the score cell.
- **Reduced motion**: global rule sets animations/transitions to ~0; the live dot becomes static, the word LIVE carries the state; no score flash; score changes are announced via `aria-live="polite"`.

## 8. Breakpoints (Tailwind defaults, mobile-first)

|       | min  | Layout                                                                                                   |
| ----- | ---- | -------------------------------------------------------------------------------------------------------- |
| base  | 0    | 1 column · header 56 · league bar · match bar · bottom nav (5) · composer replaces bottom nav on threads |
| `sm`  | 640  | 2-col card grids (transfers, rumours)                                                                    |
| `md`  | 768  | Desktop header (64) with primary nav, no bottom nav · page H1 `text-display` · full table columns        |
| `lg`  | 1024 | Wider content, team grid 7 columns                                                                       |
| `xl`  | 1280 | Right rail 320 (`<AppShell rail>`), sticky MPU                                                           |
| `2xl` | 1536 | Content max-width 1216 (`max-w-304`), centred                                                            |

## 9. Density

`data-density="compact"` on `<body>` (user setting) or on a list/table. Comfortable: rows 48 · thread-row padding 12 · cell-px 16 · body 15. Compact: rows 36 · padding 8 · cell-px 12 · body-sm 14. Controls stay 44px on touch in both (`pointer-coarse`). Compact thread rows are ≥lg only.

## 10. Icons & logos

- **Lucide** only. Sizes: `--icon-xs` 14 (inline meta) · `--icon-sm` 16 (buttons, tags) · `--icon-md` 20 (default UI) · `--icon-lg` 24 (nav, touch) · `--icon-xl` 32 (empty states). Stroke 2 at ≤16, 1.75 at 20–24, 1.5 at ≥32. Icons inherit `currentColor`; icon-only buttons need `aria-label`.
- **Logos**: WebP 64×64 source, transparent, optically padded. Sizes `--logo-xs` 16 (inline, flair, nav) · `--logo-sm` 20 (chips, compact tables) · `--logo-md` 24 (standings, rows) · `--logo-lg` 32 (scorebug mobile, headers). Fallback: team = initial on `secondary` circle; league = monogram tile (`foreground` on `background`). Always `alt=""` (the name is always next to it).
- **Team identity**: `<TeamAvatar team>` ring (2px conic split of the club's two colours + 1px `input` hairline) and `<TeamFlair>` (logo 16 + name in a neutral chip). Nothing else is team-coloured.

## 11. Layout & navigation (summary; see `pages/*.md`)

- Header (Greek only): Αρχική · Αγώνες · Βαθμολογίες · Μεταγραφές · Λίγκες. Φήμες is a tab inside Μεταγραφές.
- **One** `<LeagueBar>`: changes league, keeps the section. Replaces header dropdown + left sidebar + feed tabs.
- League hub `/leagues/{l}` (tabs Συζητήσεις · Αγώνες · Βαθμολογία · Μεταγραφές · Ομάδες) and team page `/leagues/{l}/teams/{t}` (Συζητήσεις · Αγώνες · Μεταγραφές · Φήμες).
- No left sidebar. One right rail ≥1280. Mobile bottom nav: Αρχική · Αγώνες · Βαθμολογίες · Μεταγραφές · Εγώ.
- Ads: top · in-feed after row 6 (then every 10) · in-thread after the 5th top-level reply · below tables · rail MPU. Never inside a reply chain, never on auth/settings/notifications/fan profiles. Height reserved before load.

## 12. Accessibility baseline

- Skip link first; `main#main`; `scroll-padding-top: 8rem` for sticky bars.
- Touch targets ≥ 44×44 (`pointer-coarse:` sizes); bottom nav 60px.
- Focus-visible ring on every interactive element (2px `ring`, 2px offset).
- Live scores: one `<ScoreAnnouncer>` per page (`aria-live="polite"`), goals and full time only; minutes update silently; new replies/threads behind a button, never auto-inserted.
- Status by text + icon, never colour alone (LIVE, Ν/Ι/Η, Άφιξη/Αποχώρηση, Ανεπιβεβαίωτο, Ενεργό).
- Route tabs are links with `aria-current="page"`; in-page filters are Radix Tabs.

## 13. Data not yet available (design for absence)

| Feature                                      | Ships now                                            | Later                                     |
| -------------------------------------------- | ---------------------------------------------------- | ----------------------------------------- |
| Match tabs (Γεγονότα, Ενδεκάδες, Στατιστικά) | No tab bar on match threads                          | Underline tabs under the scorebug         |
| Match-minute timestamps                      | Relative time «πριν 42 λ.»                           | «στο 25′»                                 |
| Global search                                | No search icon                                       | Icon left of the bell → full-screen sheet |
| Team abbreviations                           | Full name, truncated (`Team.shortName ?? Team.name`) | 3-letter abbreviation                     |
| NBA standings                                | `<DataUnavailable kind="not_synced">`                | Table                                     |
