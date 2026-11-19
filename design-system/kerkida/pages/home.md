# Page override: Home feed

**Routes**: `/` · `/match-threads` (same page, `active="live"` scope, sort “Live”) · `/?live=1`
**Canvas board**: S03 · Αρχική

## Layout

| Zone       | Mobile (<md)                                                                | Desktop (≥md / rail ≥xl)                                                       |
| ---------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Header     | `AppHeader` 56 (wordmark · bell · avatar)                                   | 64 with primary nav, `active="home"` (`"matches"` on /match-threads)           |
| League bar | `LeagueBar showScopes active="all"`, 3 league pills + grid button           | all pills, “Όλες” popover                                                      |
| Match bar  | `MatchBar` (chips 160, snap)                                                | chips 176 + arrows                                                             |
| Top ad     | `AdSlot size="mobile-banner" placement="top"` under the match bar           | `AdSlot size="leaderboard"` first item in `main`                               |
| Feed head  | Pill tabs Δημοφιλή · Νέα · Live N + icon button “Νέο θέμα” (44)             | `SectionHeader title="Για σένα"` + tabs + `Button size="sm"` Νέο θέμα          |
| Feed       | `ThreadList` (edge-to-edge) of comfortable `ThreadRow`                      | rounded card list; `density` from user setting (compact ≥lg only)              |
| In-feed ad | after row 6, then every 10 (`mobile-feed` / `leaderboard`)                  | same                                                                           |
| Rail       | widgets move **below** the feed on <xl (mini standings, upcoming, trending) | `rail`: mini standings (active profile league), upcoming, trending, sticky MPU |
| Bottom     | `BottomNav`                                                                 | footer                                                                         |

## Overrides of MASTER

- After 120px of scroll the match bar scrolls away and `LeagueBar.ticker` shows the most important live match (followed team first, else highest-profile league).
- New threads never auto-insert: show `Button variant="secondary" size="sm"` “N νέα θέματα” pinned under the league bar.
- Pinned threads only at the top of a league-scoped feed, max 2.

## States

- Loading: 6 × `ThreadRowSkeleton`, `MatchBar matches={null}`.
- Empty (league with no threads): `EmptyState icon={InboxIcon} title="Κανένα θέμα ακόμα" action=<Button>Νέο θέμα</Button>`.
- Error: `EmptyState` + “Δοκίμασε ξανά”.
- First visit: `CookieConsent open` (bottom-left desktop, above bottom nav on mobile).

## Accessibility

Skip link → header → league bar → match bar → sort tabs → Νέο θέμα → list → rail → footer. One Tab stop per thread row. `ScoreAnnouncer` lives inside `MatchBar`.

## Acceptance

- [ ] No left sidebar; no header Leagues dropdown; no in-feed league tabs.
- [ ] Ad heights reserved (CLS 0 in Lighthouse on 4G).
- [ ] All rows ≥44px tall; LIVE has text and pulse.
