# Page override: Standings

**Routes**: `/standings` → 302 to `/leagues/{active-profile-league ?? super-league}/standings` · `/leagues/{league}/standings` (also the hub tab) · **Canvas board**: S07

## Layout

| Zone         | Mobile                                                                                                       | Desktop                                |
| ------------ | ------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| Header / nav | `active="standings"`, `BottomNav`                                                                            | `active="standings"`                   |
| League bar   | `showScopes={false}`: switching league stays on standings                                                    | same                                   |
| Title        | `PageTitle overline="Super League · 2025–26 · μετά την 26η αγωνιστική"` → **ΒΑΘΜΟΛΟΓΙΑ** (Fira, system text) | same, `text-display`                   |
| Phase        | pill tabs Κανονική · Play-off (when the league has phases)                                                   | Κανονική · Play-off 1–4 · Play-off 5–8 |
| Table        | `StandingsTable` (mobile hides Ν/Ι/Η/Γκολ/Φόρμα via `hidden md:table-cell`)                                  | full columns                           |
| Separators   | `separatorsAfter={[4, 8, 12]}` for Super League (config per league)                                          | same                                   |
| Legend       | `StandingsLegend`                                                                                            | same                                   |
| Ad           | `AdSlot placement="table-bottom"` after the legend                                                           | `leaderboard`                          |
| Rail         | —                                                                                                            | upcoming round, trending, MPU          |

## Rules

- Favourite team = active fan profile's team for this league → `favoriteTeamId` (accent row + star + SR text).
- Row = link to team page (stretched link, one Tab stop).
- `league.hasStandings === false` → `DataUnavailable kind="not_synced" title="Η βαθμολογία του NBA δεν είναι διαθέσιμη ακόμα" description="…μπες στη συζήτηση." action=<Button asChild variant="outline" size="sm"><Link>Συζητήσεις NBA</Link></Button>` (neutral, not red).
- Season not started → `EmptyState icon={CalendarClockIcon}`.
- `data-density="compact"` honoured (36px rows).

## Accessibility

`<caption>` (sr-only), `<abbr title>` for Αγ/Ν/Ι/Η/Δ/Βαθ, zone rows `aria-describedby` → legend ids, form pips have an sr-only sentence.
