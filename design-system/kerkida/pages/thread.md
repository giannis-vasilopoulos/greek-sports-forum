# Page override: Thread detail

**Route**: `/leagues/{league}/threads/{id}-{slug}` · **Canvas board**: S04 · Thread

## Variants

1. **Discussion**: default.
2. **Live match thread** (`thread.type === "match_thread"` and match live/halftime).
3. **Guest**: any thread, not signed in.

## Layout

| Zone         | Mobile                                                                                                                                      | Desktop                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Header       | Focused: `AppHeader back={{ href: leagueHub, label: "Super League · Συζητήσεις" }}`; **no** league bar, **no** match bar, **no** bottom nav | normal header + `LeagueBar showScopes={false} active={league}`                            |
| Score        | live: `ScoreBug variant="compact"` sticky under header (48px)                                                                               | live: `ScoreBug variant="hero"` as `AppShell.top`                                         |
| Title        | breadcrumb hidden; type badge + (pinned/LIVE) + `h1.text-h1` (22 mobile), **Inter**, sentence case, `line-clamp-3`                          | breadcrumb (Super League › Συζητήσεις), `text-h1` 28                                      |
| Meta         | `AuthorLine` + Ακολούθηση + copy link                                                                                                       | same                                                                                      |
| OP           | `PostCard isRoot isOp`                                                                                                                      | same, Card surface                                                                        |
| Composer     | `ReplyComposer` mobile bar fixed bottom (replaces bottom nav); expands to bottom Sheet                                                      | inline under OP                                                                           |
| Sort         | “N απαντήσεις” + pill tabs Κορυφαία · Νεότερα · Παλαιότερα (live: **Νεότερα** first & default)                                              | same                                                                                      |
| Best-first   | `BestFirstBanner shown total allHref` when sort = Κορυφαία and total > shown                                                                | same                                                                                      |
| Replies      | `<ul>` of `PostCard`; nesting indent 12px+2px line (mobile) / 20px (desktop); max depth 6 then `continueHref`                               | same                                                                                      |
| In-thread ad | after the 5th **top-level** reply, then every 10; never inside a chain                                                                      | `leaderboard`                                                                             |
| Rail         | —                                                                                                                                           | thread info (league, teams tagged, followers), trending, sticky MPU; live: mini standings |

## Behaviour

- Collapse: `defaultCollapsed` for replies with score < −5 (`moderation="low_score"`) and for chains deeper than 4 on mobile.
- Live: new replies are queued; button “N νέες απαντήσεις” (announced at most once per 30″). Score changes via `ScoreAnnouncer`.
- Deep link `#post-{id}`: expand ancestors, scroll with `scroll-padding-top`, highlight 2s with `bg-accent`.
- Guest: `VoteButtons disabled disabledReason="Συνδέσου για να ψηφίσεις"`; `ReplyComposer gate={{ kind: "guest" }}`; draft kept in localStorage.
- Locked thread: `gate.kind="locked"`, votes still allowed.

## FUTURE (data not available)

Match tabs (Γεγονότα / Ενδεκάδες / Στατιστικά) and «στο 25′» timestamps: do not render placeholders.

## Accessibility

Back → h1 → author → follow → OP → sort → replies → composer. Each post `<article aria-labelledby>`; nesting via nested `<ul>`. Collapse toggles have a 44px hit area. Ctrl/⌘+Enter submits, Esc cancels quote.
