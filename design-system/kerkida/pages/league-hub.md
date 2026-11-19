# Page override: League hub (NEW)

**Routes**: `/leagues` (index: grouped grid of 11 leagues) · `/leagues/{league}` (tab Συζητήσεις) · `/leagues/{league}/matches` · `/standings` · `/transfers` · `/teams` · **Canvas board**: S05

## Layout

| Zone          | Mobile                                                                                                                                                                                                                     | Desktop                                           |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Header        | `active="leagues"`, bottom nav “Αρχική” stays active (hub = home scoped to a league)                                                                                                                                       | `active="leagues"`                                |
| League bar    | `showScopes` (Όλα/LIVE lead back to the global home) `active={league}`                                                                                                                                                     | same                                              |
| Entity header | `EntityHeader media={<LeagueLogo size="xl">}` title `PageTitle` → **SUPER LEAGUE**, meta “Σεζόν 2025–26 · 26η αγωνιστική · 14 ομάδες · 3 αγώνες σήμερα”, `PageTabs` Συζητήσεις · Αγώνες · Βαθμολογία · Μεταγραφές · Ομάδες | + aside: “Γράφεις ως {profile}” chip + “Νέο θέμα” |
| Match bar     | league-scoped `MatchBar` under the entity header                                                                                                                                                                           | same                                              |
| Συζητήσεις    | pill tabs Δημοφιλή · Νέα · Match + `ThreadList`; then **Ομάδες** grid (3 cols)                                                                                                                                             | list + Ομάδες grid (7 cols)                       |
| Rail          | —                                                                                                                                                                                                                          | mini standings, upcoming, MPU                     |

## Rules

- No fan profile for this league → aside shows `Button variant="outline"` “Δημιούργησε fan profile” instead of “Γράφεις ως…”.
- Tabs are links (one URL each); the active tab persists when switching league via the league bar.
- Hub of a league without standings: Βαθμολογία tab still visible; content = `DataUnavailable`.
